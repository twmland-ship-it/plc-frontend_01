import mutations from "./mutations";
// import user from "@/demoData/user-list.json"; // 改為使用實際 API，不再需要模擬資料
// import permission from "@/demoData/user-permission.json"; // 暫時註解掉未使用的 import
import { useDatatableFilter } from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
import { getItem } from "@/utility/localStorageControl";
import {
  dispatchStorageUpdate,
  setPermissionData,
  TENANT_PERMISSION_STORAGE_KEY,
  TENANT_USER_DATA_STORAGE_KEY,
} from "@/utility/tenantContext";

const initState = () => ({
  loading: false,
  error: null,
  userInitData: [],
  userTableData: [],
  allUserTableData: [], // 包括已停用用戶的完整列表
  roleInitData: [],
  roleTableData: [],
});

const state = initState();

const actions = {
  async getUserList({ commit }) {
    try {
      commit("getUserListBegin");
      // 調用實際 API 獲取人員列表 - 後端路由是 /staff-members，通過 nginx /api/ 代理訪問
      const response = await DataService.get("/api/staff-members");
      const users = response.data.Detail.StaffMembers
        // 過濾掉已停用的用戶 (EnableState = 0 表示 Disabled)
        .filter((staff) => staff.EnableState !== 0)
        .map((staff) => ({
          id: staff.StaffId,
          index: staff.StaffIndex, // 使用後端提供的 StaffIndex
          name: staff.StaffName,
          email: staff.Email || "", // 添加 email 欄位
          account: staff.Account || "",
          enableState: staff.EnableState,
          permission: {
            id: staff.RoleId,
            name: staff.RoleName
          }
        }));
      commit("getUserListSuccess", users);
    } catch (err) {
      commit("getUserListErr", err);
      throw new Error(err);
    }
  },

  // 獲取所有人員列表（包括已停用的）
  async getAllUserList({ commit }) {
    try {
      commit("getAllUserListBegin");
      const response = await DataService.get("/api/staff-members");
      const users = response.data.Detail.StaffMembers
        .map((staff) => ({
          id: staff.StaffId,
          index: staff.StaffIndex,
          name: staff.StaffName,
          email: staff.Email || "",
          account: staff.Account || "",
          enableState: staff.EnableState,
          enableStateName: staff.EnableState === 0 ? '已停用' : staff.EnableState === 1 ? '已註冊' : '使用中',
          permission: {
            id: staff.RoleId,
            name: staff.RoleName
          }
        }));
      commit("getAllUserListSuccess", users);
      return users;
    } catch (err) {
      commit("getAllUserListErr", err);
      throw new Error(err);
    }
  },

  filterUserTable({ state, commit }, searchText) {
    try {
      commit("filterUserTableBegin");
      // call api
      const res = useDatatableFilter(state.userInitData, searchText);
      commit("filterUserTableSuccess", res);
    } catch (err) {
      commit("filterUserTableErr", err);
      throw new Error(err);
    }
  },

  async getUserListOptions({ commit }) {
    try {
      commit("getUserListOptionsBegin");
      // 從權限 API 獲取可用的權限選項 - 後端路由是 /roles，通過 nginx /api/ 代理訪問
      const response = await DataService.get("/api/roles");

      if (!response.data || !response.data.Detail || !response.data.Detail.Roles) {
        throw new Error("權限 API 回應格式不正確");
      }

      const permissions = response.data.Detail.Roles.map(role => ({
        id: role.RoleId,
        name: role.RoleName
      }));

      commit("getUserListOptionsSuccess");
      return { permissions };
    } catch (err) {
      commit("getUserListOptionsErr", err);
      throw new Error(err.message || err);
    }
  },

  async addUser({ commit }, params) {
    try {
      commit("addUserBegin");

      // 調用實際 API 新增人員
      const requestData = {
        StaffId: params.name || `staff_${Date.now()}`, // 使用名稱或時間戳作為 StaffId
        StaffName: params.name,
        Account: params.name, // 使用名稱作為帳號
        Email: params.email || `${params.name}@example.com`, // 提供預設 Email
        RoleId: params.permission, // 權限 ID（應該是 Guid）
        Password: params.password || "123456" // 使用用戶設定的密碼或預設密碼
      };

      await DataService.post("/api/staff", requestData, { "Content-Type": "application/json" });
      commit("addUserSuccess");
    } catch (err) {
      commit("addUserErr", err);
      throw new Error(err);
    }
  },

  async editUser({ commit }, params) {
    try {
      commit("editUserBegin");
      // 調用實際 API 編輯人員
      // 注意：後端 API 使用 /staff/{index} 而不是 /staff/{id}
      // 需要使用數字 index 而不是 GUID id
      const requestData = {
        StaffId: params.id, // 將 GUID 作為 StaffId 傳送
        StaffName: params.name,
        Email: params.email || "", // 添加 Email 欄位
        RoleId: params.permission
      };

      // 使用 index 作為路徑參數 - 後端路由是 /staff/{index}，通過 nginx /api/ 代理訪問
      await DataService.put(`/api/staff/${params.index}`, requestData, { "Content-Type": "application/json" });

      // 如果有提供密碼，則更新密碼
      if (params.password && params.password.trim()) {
        await DataService.put(`/api/staff/${params.index}/password/reset`, {
          NewPassword: params.password
        }, { "Content-Type": "application/json" });
      }

      commit("editUserSuccess");
    } catch (err) {
      commit("editUserErr", err);
      throw new Error(err);
    }
  },

  async deleteUser({ commit }, params) {
    try {
      commit("deleteUserBegin");
      // 調用實際 API "刪除"人員 - 實際上是將狀態設置為 Disabled (0)
      // 後端路由：PUT /staff/{index}/status/{status}，通過 nginx /api/ 代理訪問
      const index = params.index || params;
      // EnumStaffState.Disabled = 0
      await DataService.put(`/api/staff/${index}/status/0`, {}, { "Content-Type": "application/json" });
      commit("deleteUserSuccess");
    } catch (err) {
      commit("deleteUserErr", err);
      throw new Error(err);
    }
  },

  // 重設人員密碼
  async resetUserPassword({ commit }, params) {
    try {
      commit("resetUserPasswordBegin");
      // 調用重設密碼 API - 正確的路徑是 /staff/{index}/password/reset
      await DataService.put(`/api/staff/${params.index}/password/reset`, {
        NewPassword: params.newPassword
      }, { "Content-Type": "application/json" });
      commit("resetUserPasswordSuccess");
    } catch (err) {
      commit("resetUserPasswordErr", err);
      throw new Error(err);
    }
  },

  // 真正刪除用戶（從資料庫中移除）
  async permanentDeleteUser({ commit }, params) {
    try {
      commit("permanentDeleteUserBegin");
      // 由於後端沒有真正的刪除API，我們先將用戶設為停用狀態
      // 這樣可以確保該用戶不會再出現在權限檢查中
      const index = params.index || params;
      await DataService.put(`/api/staff/${index}/status/0`, {}, { "Content-Type": "application/json" });

      // 注意：這裡我們使用停用狀態來模擬刪除
      // 如果後端有真正的刪除API，可以改為：
      // await DataService.delete(`/api/staff/${index}`);

      commit("permanentDeleteUserSuccess");
    } catch (err) {
      commit("permanentDeleteUserErr", err);
      throw new Error(err);
    }
  },

  // 檢查權限使用情況
  async checkRoleUsage({ dispatch }, roleId) {
    try {
      // 獲取所有用戶（包括已停用的）
      const allUsers = await dispatch("getAllUserList");

      // 找出使用該權限的用戶
      const usersWithRole = allUsers.filter(user => user.permission.id === roleId);

      return {
        isInUse: usersWithRole.length > 0,
        users: usersWithRole,
        activeUsers: usersWithRole.filter(user => user.enableState !== 0),
        disabledUsers: usersWithRole.filter(user => user.enableState === 0)
      };
    } catch (err) {
      throw new Error(err);
    }
  },

  // 權限管理 - 改為實際API調用
  async getRoleList({ commit }) {
    try {
      commit("getRoleListBegin");
      const response = await DataService.get("/api/roles");

      // 檢查回應格式
      if (!response.data || !response.data.Detail || !response.data.Detail.Roles) {
        throw new Error("API 回應格式不正確");
      }
      const roles = response.data.Detail.Roles.map(role => ({
        id: role.RoleId,
        name: role.RoleName,
        isRoot: role.IsRoot
      }));
      commit("getRoleListSuccess", roles);
    } catch (err) {
      commit("getRoleListErr", err);
      throw new Error(err);
    }
  },

  async getRoleOptions({ commit }) {
    try {
      commit("getRoleOptionsBegin");
      // 從後端獲取權限功能列表
      const response = await DataService.get("/api/roles");
      const roles = response.data.Detail.Roles.map(role => ({
        id: role.RoleId,
        name: role.RoleName,
        isRoot: role.IsRoot
      }));
      
      // 構建權限選項結構（基於後端功能名稱）
      const permissionOptions = [
        {
          id: "dashboard",
          value: "dashboard",
          name: "首頁",
          options: ["c", "u", "d"]
        },
        {
          id: "gui",
          value: "gui",
          name: "監控系統",
          options: ["r"],
          sub: [
            {
              id: "gui-setting",
              value: "gui-setting",
              name: "監控系統-頁面設定",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "gui-main",
              value: "gui-main",
              name: "監控系統-子系統",
              options: ["r", "u"]
            }
          ]
        },
        {
          id: "database",
          value: "database",
          name: "數據中心",
          options: ["r"],
          sub: [
            {
              id: "database-realtime",
              value: "database-realtime",
              name: "數據中心-即時資料",
              options: ["r"]
            },
            {
              id: "database-history",
              value: "database-history",
              name: "數據中心-歷史報表",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "database-runtime",
              value: "database-runtime",
              name: "數據中心-運轉時數",
              options: ["r", "u"]
            },
            {
              id: "database-customReport",
              value: "database-customReport",
              name: "數據中心-自訂報表",
              options: ["c", "r", "u", "d"]
            }
          ]
        },
        {
          id: "alarm",
          value: "alarm",
          name: "警報系統",
          options: ["r"],
          sub: [
            {
              id: "alarm-realtime",
              value: "alarm-realtime",
              name: "警報系統-即時警報",
              options: ["r", "u"]
            },
            {
              id: "alarm-history",
              value: "alarm-history",
              name: "警報系統-歷史警報",
              options: ["r"]
            },
            {
              id: "alarm-reliability",
              value: "alarm-reliability",
              name: "警報系統-故障分析",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "alarm-reliability-analysis",
              value: "alarm-reliability-analysis",
              name: "警報系統-可靠度分析",
              options: ["r", "u"]
            }
          ]
        },
        {
          id: "system",
          value: "system",
          name: "系統",
          options: ["r"],
          sub: [
            {
              id: "system-uninstall",
              value: "system-uninstall",
              name: "系統-電力卸載",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "system-bill",
              value: "system-bill",
              name: "系統-電耗統計",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "system-waterbill",
              value: "system-waterbill",
              name: "系統-水耗統計",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "system-btu",
              value: "system-btu",
              name: "系統-BTU",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "system-cctv",
              value: "system-cctv",
              name: "系統-CCTV",
              options: ["c", "r", "u", "d"]
            }
          ]
        },
        {
          id: "notify",
          value: "notify",
          name: "通知",
          options: ["r"],
          sub: [
            {
              id: "notify-setting",
              value: "notify-setting",
              name: "通知-通知設定",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "notify-group",
              value: "notify-group",
              name: "通知-通知群組",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "notify-message",
              value: "notify-message",
              name: "通知-發送通知",
              options: ["c", "r"]
            }
          ]
        },
        {
          id: "tags",
          value: "tags",
          name: "測點",
          options: ["r"],
          sub: [
            {
              id: "tags-region",
              value: "tags-region",
              name: "測點-地區",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "tags-channel",
              value: "tags-channel",
              name: "測點-通道",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "tags-device",
              value: "tags-device",
              name: "測點-裝置",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "tags-group",
              value: "tags-group",
              name: "測點-群組",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "tags-tag",
              value: "tags-tag",
              name: "測點-測點",
              options: ["c", "r", "u", "d"]
            }
          ]
        },
        {
          id: "user",
          value: "user",
          name: "人員",
          options: ["r"],
          sub: [
            {
              id: "user-role",
              value: "user-role",
              name: "人員-權限設定",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "user-list",
              value: "user-list",
              name: "人員-人員清單",
              options: ["c", "r", "u", "d"]
            }
          ]
        },
        {
          id: "schedule",
          value: "schedule",
          name: "排程",
          options: ["r"],
          sub: [
            {
              id: "schedule-calendar",
              value: "schedule-calendar",
              name: "排程-行事曆",
              options: ["c", "r", "u", "d"]
            },
            {
              id: "schedule-work",
              value: "schedule-work",
              name: "排程-工作排程",
              options: ["c", "r", "u", "d"]
            }
          ]
        }
      ];
      
      commit("getRoleOptionsSuccess");
      return { permission: permissionOptions, roles: roles };
    } catch (err) {
      commit("getRoleOptionsErr", err);
      throw new Error(err);
    }
  },

  filterRoleTable({ state, commit }, searchText) {
    try {
      commit("filterRoleTableBegin");
      // call api
      const res = useDatatableFilter(state.roleInitData, searchText);
      commit("filterRoleTableSuccess", res);
    } catch (err) {
      commit("filterRoleTableErr", err);
      throw new Error(err);
    }
  },

  // 新增權限 - 實際API調用
  async addRole({ commit }, params) {
    try {
      commit("addRoleBegin");

      // 轉換前端權限格式為後端格式
      const features = {};
      Object.keys(params.permission).forEach(key => {
        if (params.permission[key] && params.permission[key].length > 0) {
          // 後端期望的是 "r", "c", "u", "d" 格式，直接使用前端格式
          const permissions = params.permission[key];
          features[key] = permissions;
        }
      });

      const requestData = {
        Name: params.name,
        Description: params.name, // 使用名稱作為描述
        IsRoot: false,
        Features: features
      };

      await DataService.post("/api/role", requestData, { "Content-Type": "application/json" });
      commit("addRoleSuccess");
    } catch (err) {
      commit("addRoleErr", err);
      throw new Error(err);
    }
  },

  // 編輯權限 - 實際API調用
  async editRole({ commit }, params) {
    try {
      commit("editRoleBegin");

      // 轉換前端權限格式為後端格式
      const features = {};
      Object.keys(params.permission).forEach(key => {
        if (params.permission[key] && params.permission[key].length > 0) {
          // 後端期望的是 "r", "c", "u", "d" 格式，直接使用前端格式
          const permissions = params.permission[key];
          features[key] = permissions;
        }
      });

      const requestData = {
        Name: params.name,
        Description: params.name, // 使用名稱作為描述
        IsRoot: false,
        Features: features // 使用轉換後的 features
      };

      await DataService.put(`/api/role/${params.id}`, requestData, { "Content-Type": "application/json" });
      commit("editRoleSuccess");

      // 若當前登入者的 RoleId 與被編輯的相同，則即時刷新前端權限快取
      try {
        const currentUser = getItem(TENANT_USER_DATA_STORAGE_KEY);
        if (currentUser && currentUser.RoleId === params.id) {
          const roleRes = await DataService.get(`/api/role/${params.id}`);
          const features = roleRes?.data?.Detail?.Features || {};
          setPermissionData(features);
          dispatchStorageUpdate(TENANT_PERMISSION_STORAGE_KEY);
        }
      } catch (e) {
        console.warn("即時刷新權限失敗（不影響主流程）:", e?.message || e);
      }
    } catch (err) {
      commit("editRoleErr", err);
      throw new Error(err);
    }
  },

  // 刪除權限 - 實際API調用
  async deleteRole({ commit }, id) {
    try {
      commit("deleteRoleBegin");
      await DataService.delete(`/api/role/${id}`);
      commit("deleteRoleSuccess");
    } catch (err) {
      commit("deleteRoleErr", err);

      // 檢查是否為權限正在使用的錯誤
      if (err.response && err.response.status === 500) {
        // 從後端回應中取得錯誤訊息
        const errorData = err.response.data;
        const errorMessage = errorData?.Message || errorData?.message || err.message || '';

        // 檢查是否為權限正在使用的錯誤
        if (errorMessage.includes('Role is in use') ||
            errorMessage.includes('權限正在使用') ||
            errorMessage.includes('已經有人員使用該權限')) {
          throw new Error('無法刪除權限：此權限正在使用中。\n\n可能原因：\n1. 有啟用的人員正在使用此權限\n2. 有已停用的人員仍關聯此權限\n\n建議：請檢查所有人員（包括已停用的），確保沒有人員使用此權限後再刪除。');
        }

        // 檢查是否為根權限錯誤
        if (errorMessage.includes('Root role can\'t not be deleted') ||
            errorMessage.includes('根權限無法刪除')) {
          throw new Error('無法刪除權限：此為系統根權限，無法刪除。');
        }

        // 如果有具體的錯誤訊息，直接使用
        if (errorMessage) {
          throw new Error(`刪除權限失敗：${errorMessage}`);
        }
      }

      throw new Error(err);
    }
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
