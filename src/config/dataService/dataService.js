import axios from "axios";
import { getItem } from "../../utility/localStorageControl";
import qs from "qs";
import store from "@/vuex/store";
import router from "@/routes/protectedRoute";
import { getTenantSlug } from "@/utility/tenantContext";

const authHeader = () => ({
  Authorization: `Bearer ${getItem("access_token")}`,
});

const isApiDebugEnabled = () => {
  const flag = getItem("debug_api_log");
  return flag === true || flag === "true" || flag === 1 || flag === "1";
};

// 注意：baseURL 使用空字串，讓各個 API 調用自己加上正確的路徑前綴
// 開發時通過 customize-vue-config.js 的代理轉發，生產時由 Web 伺服器代理處理
const client = axios.create({
  baseURL: "", // 使用空字串，避免路徑重複
  headers: {
    Authorization: `Bearer ${getItem("access_token")}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

class DataService {
  static get(path = "", data = {}, optionalHeader = {}) {
    let url = path;
    if (data && !optionalHeader["Content-Type"]) {
      url += `?${new URLSearchParams(data)}`;
    }
    return client({
      method: "GET",
      url,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }

  static post(path = "", data = {}, optionalHeader = {}, responseType) {
    // Check if data is an instance of FormData
    if (data instanceof FormData) {
      // For FormData, let the browser set the Content-Type header automatically
      // Do not stringify the data
    } else if (data && !optionalHeader["Content-Type"]) {
      data = qs.stringify(data);
    } else if (optionalHeader["Content-Type"] === "application/json") {
      data = JSON.stringify(data);
    }
    
    return client({
      method: "POST",
      url: path,
      data,
      headers: { ...authHeader(), ...optionalHeader },
      responseType: responseType,
    });
  }

  static patch(path = "", data = {}) {
    return client({
      method: "PATCH",
      url: path,
      data: JSON.stringify(data),
      headers: { ...authHeader() },
    });
  }

  static delete(path = "", data = {}, optionalHeader = {}) {
    return client({
      method: "DELETE",
      url: path,
      data: data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }

  static put(path = "", data = {}, optionalHeader = {}) {
    if (optionalHeader["Content-Type"] === "application/json") {
      data = JSON.stringify(data);
    } else if (data && !optionalHeader["Content-Type"]) {
      data = qs.stringify(data);
    }
    return client({
      method: "PUT",
      url: path,
      data: data,
      headers: { ...authHeader(), ...optionalHeader },
    });
  }
}

/**
 * axios interceptors runs before and after a request, letting the developer modify req,req more
 * For more details on axios interceptor see https://github.com/axios/axios#interceptors
 */
client.interceptors.request.use((config) => {
  // do something before executing the request
  // For example tag along the bearer access token to request header or set a cookie
  const requestConfig = config;
  const { headers } = config;
  requestConfig.headers = {
    ...headers,
    Authorization: `Bearer ${getItem("access_token")}`,
  };
  return requestConfig;
});

client.interceptors.response.use(
  (response) => {
    const contentType = response.headers["content-type"];
    if (
      contentType &&
      contentType.includes(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      return response;
    }
    if (isApiDebugEnabled()) {
      console.debug("[API] 回應:", response.data);
    }
    if (Number(response.data.ReturnCode) === 1) {
      return response;
    } else {
      console.warn(
        "API 失敗，ReturnCode:",
        response.data.ReturnCode,
        "Message:",
        response.data.Message
      );
      throw new Error(response.data.Message || "API 請求失敗");
    }
  },
  (error) => {
    /**
     * Do something in case the response returns an error code [3**, 4**, 5**] etc
     * For example, on token expiration retrieve a new access token, retry a failed request etc
     */
    const { response } = error;
    // const originalRequest = error.config;
    if (response) {
      if (response.status === 401) {
        const tenantSlug = getTenantSlug();
        store.dispatch("auth/logOut");
        router.push(tenantSlug ? { name: "login", params: { id: tenantSlug } } : { name: "login" });
      }
    }
    return Promise.reject(error);
  }
);
export { DataService };
