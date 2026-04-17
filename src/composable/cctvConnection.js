import * as signalR from "@microsoft/signalr";
import { notification } from "ant-design-vue";
import { getItem } from "@/utility/localStorageControl";
import { handleTenantBindingFailure } from "@/utility/tenantBindingFailure";
import { TENANT_ACCESS_TOKEN_STORAGE_KEY } from "@/utility/tenantContext";
import {
  LEGACY_HUB_REGISTRATION_MODE,
  isHubMethodMissingError,
} from "@/utility/legacyContractCompat";

// Maintenance rule:
// 1. New CCTV behavior must be added to the current contract flow first.
// 2. LEGACY_COMPAT blocks are temporary fallback code for old field deployments only.
// 3. After backend upgrade, remove the LEGACY_COMPAT blocks instead of extending them.

const getSignalRUrlCandidates = () =>
  process.env.NODE_ENV === "development"
    ? [`${process.env.VUE_APP_API_ENDPOINT}Cctv`]
    : ["/api/Cctv", "/Cctv"];

const createConnection = (signalRUrl) => {
  const conn = new signalR.HubConnectionBuilder()
    .withUrl(signalRUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => getItem("access_token") || "",
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: () => 5000,
    })
    .build();
  conn.serverTimeoutInMilliseconds = 60000;
  conn.keepAliveIntervalInMilliseconds = 15000;
  return conn;
};

let activeSignalRUrl = getSignalRUrlCandidates()[0];
let connection = createConnection(activeSignalRUrl);
let lifecycleHandlersBound = false;
// LEGACY_COMPAT_START
// Remove after field backend no longer needs registerClientAsync(customerId, serviceCode).
let registrationMode = LEGACY_HUB_REGISTRATION_MODE.AUTO;
// LEGACY_COMPAT_END

const recreateConnection = (signalRUrl) => {
  activeSignalRUrl = signalRUrl;
  connection = createConnection(signalRUrl);
  lifecycleHandlersBound = false;
  bindLifecycleHandlers();
};

const resolveLegacyCctvPayload = () => {
  const customerId = getItem("customer_id");
  if (!customerId) {
    console.error("客戶 ID 未找到，請重新登入");
    notification.error({
      message: "連接失敗",
      description: "客戶 ID 未找到，請重新登入系統",
      duration: 5,
    });
    return null;
  }

  return {
    customerId,
    serviceCode: 999,
  };
};

const registerCurrentTenantClient = async () => {
  if (!getItem(TENANT_ACCESS_TOKEN_STORAGE_KEY)) {
    console.error("Access token 未找到，請重新登入");
    notification.error({
      message: "連接失敗",
      description: "Access token 未找到，請重新登入系統",
      duration: 5,
    });
    return false;
  }

  await connection.invoke("registerCurrentTenantClientAsync");
  registrationMode = LEGACY_HUB_REGISTRATION_MODE.CURRENT;
  return true;
};

// LEGACY_COMPAT_START
const registerLegacyClient = async () => {
  const payload = resolveLegacyCctvPayload();
  if (!payload) {
    return false;
  }

  await connection.invoke("registerClientAsync", payload.customerId, payload.serviceCode);
  registrationMode = LEGACY_HUB_REGISTRATION_MODE.LEGACY;
  return true;
};
// LEGACY_COMPAT_END

const registerCctvClient = async () => {
  try {
    console.log("嘗試註冊 CCTV 租戶連線");

    if (registrationMode === LEGACY_HUB_REGISTRATION_MODE.LEGACY) {
      const legacyRegistered = await registerLegacyClient();
      if (legacyRegistered) {
        console.log("CCTV legacy 連接註冊成功");
      }
      return legacyRegistered;
    }

    const currentRegistered = await registerCurrentTenantClient();
    if (currentRegistered) {
      console.log("CCTV 連接註冊成功");
      return true;
    }

    return false;
  } catch (err) {
    if (isHubMethodMissingError(err)) {
      console.warn("[CCTV] Current hub registration unavailable, fallback to legacy hub method.");
      const legacyRegistered = await registerLegacyClient();
      if (legacyRegistered) {
        console.log("CCTV legacy 連接註冊成功");
      }
      return legacyRegistered;
    }

    console.error("CCTV 連接註冊失敗:", err);
    notification.error({
      message: "CCTV 連接失敗",
      description: "無法註冊 CCTV 連接，可能是登入狀態已失效",
      duration: 5,
    });
    throw err;
  }
};

function bindLifecycleHandlers() {
  if (lifecycleHandlersBound) return;

  connection.on("CustomerIdError", function (errorText) {
    console.error("CCTV 客戶代碼錯誤:", errorText);
    notification.error({
      message: "CCTV 租戶驗證失敗",
      description: errorText || "CCTV 連線租戶與 access token 不一致，請重新登入",
      duration: 5,
    });
    handleTenantBindingFailure({
      message: errorText,
    });
  });

  connection.onclose(async () => {
    speechSynthesis.cancel();
  });

  connection.onreconnected(async () => {
    console.log("CCTV WebSocket 重新連接成功");
    try {
      await registerCctvClient();
    } catch (err) {
      console.error("CCTV 重新註冊失敗:", err);
    }
  });

  lifecycleHandlersBound = true;
}

async function startConnectionWithFallback() {
  bindLifecycleHandlers();

  if (
    connection.state === signalR.HubConnectionState.Connected ||
    connection.state === signalR.HubConnectionState.Connecting ||
    connection.state === signalR.HubConnectionState.Reconnecting
  ) {
    return;
  }

  let lastError = null;
  const candidates = [...new Set([activeSignalRUrl, ...getSignalRUrlCandidates()])];

  for (const signalRUrl of candidates) {
    if (activeSignalRUrl !== signalRUrl) {
      recreateConnection(signalRUrl);
    }

    try {
      await connection.start();
      console.log(`CCTV WebSocket 連接成功: ${signalRUrl}`);
      await registerCctvClient();
      return;
    } catch (err) {
      lastError = err;
      console.warn(`CCTV WebSocket 連接失敗: ${signalRUrl}`, err);
      try {
        await connection.stop();
      } catch (_) {
        // ignore stop errors during fallback
      }
    }
  }

  console.error("CCTV WebSocket 連接失敗:", lastError);
  notification.error({
    message: "CCTV WebSocket 連接失敗",
    description: "無法連接到 CCTV 服務器，請檢查網路連接或代理設定",
    duration: 5,
  });
  throw lastError;
}

export async function useCCTVConnection() {
  await startConnectionWithFallback();
  return {
    connection,
    async refreshTenantBinding() {
      if (connection.state !== signalR.HubConnectionState.Connected) {
        return false;
      }

      try {
        await registerCctvClient();
        return true;
      } catch (err) {
        console.error("CCTV 租戶重新綁定失敗:", err);
        return false;
      }
    },
  };
}
