import mutations from "./mutations";
import Cookies from "js-cookie";
import { DataService } from "@/config/dataService/dataService";
import { setItem, removeItem, getItem } from "@/utility/localStorageControl";
import { clearAllAcknowledgedAlarmSuppressions } from "@/composable/alarmPromptState";
import {
  clearPermissionData,
  clearTenantContext,
  dispatchStorageUpdate,
  removeTenantScopedItem,
  resolveTenantSlug,
  setPermissionData,
  setTenantContext,
  TENANT_PERMISSION_STORAGE_KEY,
  TENANT_USER_DATA_STORAGE_KEY,
} from "@/utility/tenantContext";

const normalizeAccount = (account) => String(account ?? "").trim();

/** 後端 JSON 可能為 PascalCase（Detail）或 camelCase（detail） */
function pickApiDetail(payload) {
  return payload?.Detail ?? payload?.detail ?? null;
}

/** Role / StaffLogin 之 Features 欄位相容 */
function pickFeatures(detail) {
  if (!detail || typeof detail !== "object") return null;
  const f = detail.Features ?? detail.features;
  if (f && typeof f === "object" && !Array.isArray(f)) return f;
  return null;
}

/** 將 axios / 網路錯誤轉成使用者可讀訊息（避免只顯示 Request failed） */
function resolveLoginHttpError(err) {
  if (!err) return "登入失敗，請稍後再試";
  if (err.response) {
    const { status, data } = err.response;
    if (status === 405) {
      return "登入請求被拒絕（HTTP 405）。若前端在 Docker/nginx 內，請確認已將 /api 轉發至 Product-002 API（預設 5170），且後端已啟動。";
    }
    if (status === 404) {
      return "找不到登入 API（HTTP 404）。請確認後端位址與 proxy 設定。";
    }
    if (typeof data === "string" && data.trim()) {
      const t = data.trim();
      return t.length > 400 ? `${t.slice(0, 400)}…` : t;
    }
    if (data && typeof data === "object") {
      if (data.Message != null && data.Message !== "") return String(data.Message);
      if (data.message != null && data.message !== "") return String(data.message);
      if (data.title != null && data.title !== "") return String(data.title);
      if (data.errors && typeof data.errors === "object") {
        try {
          return JSON.stringify(data.errors);
        } catch {
          /* ignore */
        }
      }
    }
    return `登入失敗（HTTP ${status}）`;
  }
  if (err.message) return err.message;
  return "登入失敗，請檢查網路或稍後再試";
}

const state = () => ({
  login: Cookies.get("logedIn"),
  loading: false,
  error: null,
});

const actions = {
  async login({ commit, dispatch }, { acc, password, id }) {
    try {
      await commit("loginBegin");
      const tenantSlug = resolveTenantSlug(id);
      if (!tenantSlug) {
        throw new Error("缺少租戶識別碼，請從租戶管理入口進入登入頁，或先重新選擇租戶。");
      }

      // 使用 DataService 發送登入請求，確保使用正確的格式
      const loginData = {
        Account: acc,
        Password: password,
        IdName: tenantSlug
      };

      // 使用 DataService 發送請求，它會自動處理 Content-Type
      const res = await DataService.post('/api/Staff/StaffLogin', loginData);

      const loginDetail = pickApiDetail(res.data);
      // 檢查登入是否成功
      if (!loginDetail) {
        const errorMessage = res.data.Message || res.data.message || "登入失敗，請檢查登入資料";
        console.error("登入失敗:", errorMessage);
        await commit("loginErr", errorMessage);
        throw new Error(errorMessage);
      }

      const {
        AccessToken,
        RefreshToken,
        StaffName,
        PermissionCode,
        RoleId, // 添加 RoleId
        UniformNumber,
        CustomerID, // 後端回應的 JSON 屬性名稱是 CustomerID（大寫 ID）
        CustomerName,
        EnableState,
        IsRoot,
      } = loginDetail;
      const loginFeatures = pickFeatures(loginDetail) || {};
      setItem("access_token", AccessToken);
      setItem("refresh_token", RefreshToken);
      setTenantContext({
        tenantSlug,
        tenantId: CustomerID,
      });

      await dispatch("fetchUserData", {
        StaffName,
        Account: normalizeAccount(acc),
        PermissionCode,
        RoleId, // 傳遞 RoleId
        UniformNumber,
        CustomerId: CustomerID, // 使用正確的變數名稱
        CustomerName,
        EnableState,
        IsRoot: !!IsRoot,
        loginFeatures,
      });

      // 通知前端權限系統更新
      if (typeof window !== 'undefined') {
        dispatchStorageUpdate(TENANT_PERMISSION_STORAGE_KEY);
        dispatchStorageUpdate(TENANT_USER_DATA_STORAGE_KEY);
      }

      Cookies.set("logedIn", true);
      return commit("loginSuccess", true);
    } catch (err) {
      console.error("登入錯誤:", err);
      const errorMessage = resolveLoginHttpError(err);
      await commit("loginErr", errorMessage);
      throw new Error(errorMessage);
    }
  },

  async fetchUserData({ dispatch }, data) {
    try {
      clearPermissionData();
      await dispatch("fetchUserPermissions", data.RoleId);
      const storedPermission = getItem(TENANT_PERMISSION_STORAGE_KEY);
      let hasFeatures = false;
      try {
        const p =
          storedPermission && typeof storedPermission === "object"
            ? storedPermission
            : {};
        hasFeatures =
          p &&
          typeof p === "object" &&
          Object.keys(p).some((k) => Array.isArray(p[k]) && p[k].length > 0);
      } catch {
        hasFeatures = false;
      }
      if (!hasFeatures) {
        const lf = data.loginFeatures;
        if (lf && typeof lf === "object" && Object.keys(lf).length > 0) {
          setPermissionData(lf);
        } else if (data.IsRoot || (data.PermissionCode != null && data.PermissionCode >= 999)) {
          await dispatch("setAdminPermissions");
        } else {
          setPermissionData({});
        }
      }
      const userPayload = { ...data };
      delete userPayload.loginFeatures;
      setItem(TENANT_USER_DATA_STORAGE_KEY, JSON.stringify(userPayload));

      // 通知前端用戶資料更新
      if (typeof window !== 'undefined') {
        dispatchStorageUpdate(TENANT_USER_DATA_STORAGE_KEY);
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  async setAdminPermissions() {
    try {
      // 設定管理員最高權限 - 包含所有功能的所有權限
      const adminPermissions = {
        "dashboard": ["c", "r", "u", "d"],
        "gui": ["r"],
        "gui-setting": ["c", "r", "u", "d"],
        "gui-main": ["r", "u"],
        "database": ["r"],
        "database-realtime": ["r"],
        "database-history": ["c", "r", "u", "d"],
        "database-runtime": ["r", "u"],
        "database-customReport": ["c", "r", "u", "d"],
        "alarm": ["r"],
        "alarm-realtime": ["r", "u"],
        "alarm-history": ["r"],
        "alarm-reliability": ["c", "r", "u", "d"],
        "alarm-reliability-analysis": ["r", "u"],
        "system": ["r"],
        "system-uninstall": ["c", "r", "u", "d"],
        "system-bill": ["c", "r", "u", "d"],
        "system-waterbill": ["c", "r", "u", "d"],
        "system-cctv": ["c", "r", "u", "d"],
        "system-btu": ["c", "r", "u", "d"],
        "notify": ["r"],
        "notify-setting": ["c", "r", "u", "d"],
        "notify-group": ["c", "r", "u", "d"],
        "notify-message": ["c", "r", "u", "d"],
        "tags": ["r"],
        "tags-region": ["c", "r", "u", "d"],
        "tags-channel": ["c", "r", "u", "d"],
        "tags-device": ["c", "r", "u", "d"],
        "tags-group": ["c", "r", "u", "d"],
        "tags-tag": ["c", "r", "u", "d"],
        "user": ["r"],
        "user-list": ["c", "r", "u", "d"],
        "user-role": ["c", "r", "u", "d"],
        "schedule": ["r"],
        "schedule-calendar": ["c", "r", "u", "d"],
        "schedule-work": ["c", "r", "u", "d"]
      };

      setPermissionData(adminPermissions);
    } catch (err) {
      console.error("設定管理員權限失敗:", err);
    }
  },

  async fetchUserPermissions(_, roleId) {
    try {
      const response = await DataService.get(`/api/role/${roleId}`);
      const detail = pickApiDetail(response.data);
      const permissions = pickFeatures(detail);
      if (permissions && Object.keys(permissions).length > 0) {
        setPermissionData(permissions);
      } else {
        console.warn("GET /role 未回傳有效 Features，將由登入 Features 或 Root/999 補齊");
      }
    } catch (err) {
      console.error("獲取用戶權限失敗:", err);
    }
  },

  logOut({ commit }) {
    try {
      commit("logoutBegin");
      Cookies.remove("logedIn");
      clearPermissionData();
      removeItem("guiList");
      removeItem(TENANT_USER_DATA_STORAGE_KEY);
      removeItem("access_token");
      removeItem("refresh_token");
      removeTenantScopedItem("tagRefreshTime");
      removeTenantScopedItem("tagList");
      removeItem("tagRefreshTime");
      removeItem("tagList");
      clearTenantContext();
      clearAllAcknowledgedAlarmSuppressions();
      commit("logoutSuccess", null);
    } catch (err) {
      commit("logoutErr", err);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
