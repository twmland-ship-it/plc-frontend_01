import * as signalR from "@microsoft/signalr";
import { notification } from "ant-design-vue";
import { getItem } from "@/utility/localStorageControl";
import { handleTenantBindingFailure } from "@/utility/tenantBindingFailure";
import {
  LEGACY_HUB_REGISTRATION_MODE,
  isHubMethodMissingError,
} from "@/utility/legacyContractCompat";

// Maintenance rule:
// 1. New AlarmSummary behavior must be added to the current contract flow first.
// 2. LEGACY_COMPAT blocks are temporary fallback code for old field deployments only.
// 3. After backend upgrade, remove the LEGACY_COMPAT blocks instead of extending them.

const getSignalRUrlCandidates = () =>
  process.env.NODE_ENV === "development"
    ? [`${process.env.VUE_APP_API_ENDPOINT}AlarmSummary`]
    : ["/api/AlarmSummary", "/AlarmSummary"];

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

const createConnectionFacade = (getCurrentConnection) => ({
  get state() {
    return getCurrentConnection().state;
  },
  start(...args) {
    return getCurrentConnection().start(...args);
  },
  stop(...args) {
    return getCurrentConnection().stop(...args);
  },
  invoke(...args) {
    return getCurrentConnection().invoke(...args);
  },
  on(...args) {
    return getCurrentConnection().on(...args);
  },
  off(...args) {
    return getCurrentConnection().off(...args);
  },
});

const resolveLegacyAlarmPayload = (clientId) => {
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

  return JSON.stringify({
    CustomerId: customerId,
    ClientId: clientId || "",
  });
};

const registerCurrentTenant = async (targetConnection, registrationState) => {
  if (!getItem("access_token")) {
    console.error("Access token 未找到，請重新登入");
    notification.error({
      message: "連接失敗",
      description: "Access token 未找到，請重新登入系統",
      duration: 5,
    });
    return false;
  }

  await targetConnection.invoke("RegisterCurrentTenantAsync");
  registrationState.mode = LEGACY_HUB_REGISTRATION_MODE.CURRENT;
  return true;
};

// LEGACY_COMPAT_START
// Remove this fallback after all field deployments support RegisterCurrentTenantAsync.
const registerLegacyTenant = async (targetConnection, clientId, registrationState) => {
  const payload = resolveLegacyAlarmPayload(clientId);
  if (!payload) {
    return false;
  }

  await targetConnection.invoke("FromClientSendConnectedIdAndCustomerIdAsync", payload);
  registrationState.mode = LEGACY_HUB_REGISTRATION_MODE.LEGACY;
  return true;
};

const registerAlarmTenant = async (targetConnection, clientId, registrationState) => {
  if (registrationState.mode === LEGACY_HUB_REGISTRATION_MODE.LEGACY) {
    return await registerLegacyTenant(targetConnection, clientId, registrationState);
  }

  try {
    return await registerCurrentTenant(targetConnection, registrationState);
  } catch (err) {
    if (!isHubMethodMissingError(err)) {
      throw err;
    }

    console.warn("[AlarmSummary] Current hub registration unavailable, fallback to legacy hub method.");
    return await registerLegacyTenant(targetConnection, clientId, registrationState);
  }
};
// LEGACY_COMPAT_END

export function useAlarmConnection(callback) {
  let activeSignalRUrl = getSignalRUrlCandidates()[0];
  let connection = createConnection(activeSignalRUrl);
  const facadeConnection = createConnectionFacade(() => connection);
  let paused = false;
  const registrationState = {
    // LEGACY_COMPAT_START
    // Remove after field backend no longer needs AlarmSummary legacy registration.
    mode: LEGACY_HUB_REGISTRATION_MODE.AUTO,
    // LEGACY_COMPAT_END
  };

  const bindHandlers = (targetConnection) => {
    targetConnection.on("GetConnectedId", async function (clientId) {
      try {
        await registerAlarmTenant(targetConnection, clientId, registrationState);
      } catch (err) {
        console.error("警報連接錯誤:", err);
        notification.error({
          message: "警報連接失敗",
          description: "無法建立警報連接，請檢查網路或重新登入",
          duration: 5,
        });
      }
    });

    targetConnection.on("ToClientSendAlarmSummaryJson", callback);

    targetConnection.on("CustomerIdError", function (errorText) {
      console.error("客戶代碼錯誤:", errorText);
      handleTenantBindingFailure({
        message: errorText,
      });
    });

    targetConnection.onclose(async () => {
      speechSynthesis.cancel();
      if (paused) {
        return;
      }
      // 自動重連全部失敗後的最終 fallback：手動重連
      let retryDelay = 5000;
      const maxRetryDelay = 60000;
      const retryLoop = async () => {
        if (paused) {
          return;
        }
        try {
          await startWithFallback();
          console.log("AlarmSummary 重連成功");
        } catch (err) {
          console.warn(`AlarmSummary 重連失敗，${retryDelay / 1000}s 後重試`, err);
          retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
          setTimeout(retryLoop, retryDelay);
        }
      };
      setTimeout(retryLoop, retryDelay);
    });
  };

  const switchConnection = (signalRUrl) => {
    activeSignalRUrl = signalRUrl;
    connection = createConnection(signalRUrl);
    bindHandlers(connection);
  };

  const startWithFallback = async () => {
    if (paused) {
      return;
    }
    let lastError = null;
    const candidates = [...new Set([activeSignalRUrl, ...getSignalRUrlCandidates()])];

    for (const signalRUrl of candidates) {
      if (activeSignalRUrl !== signalRUrl) {
        switchConnection(signalRUrl);
      }

      try {
        await connection.start();
        console.log(`AlarmSummary WebSocket 連接成功: ${signalRUrl}`);
        return;
      } catch (err) {
        lastError = err;
        console.warn(`AlarmSummary WebSocket 連接失敗: ${signalRUrl}`, err);
        try {
          await connection.stop();
        } catch (_) {
          // ignore stop errors during fallback
        }
      }
    }

    console.error("AlarmSummary WebSocket 連接失敗:", lastError);
  };

  bindHandlers(connection);
  startWithFallback();

  return {
    connection: facadeConnection,
    async refreshTenantBinding() {
      if (connection.state !== signalR.HubConnectionState.Connected) {
        return false;
      }

      try {
        return await registerAlarmTenant(connection, connection.connectionId, registrationState);
      } catch (err) {
        console.error("警報租戶重新綁定失敗:", err);
        notification.error({
          message: "警報租戶重新綁定失敗",
          description: "無法使用目前登入資訊重新綁定警報連線",
          duration: 5,
        });
        return false;
      }
    },
    setPaused(value) {
      paused = !!value;
    },
    getPaused() {
      return paused;
    },
  };
}
