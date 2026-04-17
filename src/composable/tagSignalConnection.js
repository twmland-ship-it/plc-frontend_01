import * as signalR from "@microsoft/signalr";
import { getItem } from "@/utility/localStorageControl";
import { handleTenantBindingFailure } from "@/utility/tenantBindingFailure";
import {
  TENANT_ACCESS_TOKEN_STORAGE_KEY,
  isTenantRebindStorageKey,
} from "@/utility/tenantContext";
import {
  LEGACY_HUB_REGISTRATION_MODE,
  isHubMethodMissingError,
} from "@/utility/legacyContractCompat";

// Maintenance rule:
// 1. New PageTag behavior must be added to the current contract flow first.
// 2. LEGACY_COMPAT blocks are temporary fallback code for old field deployments only.
// 3. After backend upgrade, remove the LEGACY_COMPAT blocks instead of extending them.

const resolvePageId = (source) => {
  if (typeof source === "function") {
    return source();
  }

  if (source && typeof source === "object" && "value" in source) {
    return source.value;
  }

  return source;
};

export function useTagSignalConnection(id, callback) {
  // 在開發環境中直接連接到後端，在生產環境中使用相對路徑
  const signalRUrl = process.env.NODE_ENV === 'development'
    ? `${process.env.VUE_APP_API_ENDPOINT}PageTag`
    : "/api/PageTag";

  const connection = new signalR.HubConnectionBuilder()
    .withUrl(signalRUrl, {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      accessTokenFactory: () => getItem("access_token") || "",
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: () => 5000,
    })
    .build();
  connection.serverTimeoutInMilliseconds = 60000;
  connection.keepAliveIntervalInMilliseconds = 15000;
  let startPromise = null;
  let stopped = false;
  let pageIdSource = id;
  // LEGACY_COMPAT_START
  // Remove this mode switch after all field deployments support
  // RegisterCurrentTenantPageAsync.
  let registrationMode = LEGACY_HUB_REGISTRATION_MODE.AUTO;
  // LEGACY_COMPAT_END

  const resolveRegistrationPayload = (connectedClientId) => {
    if (!getItem(TENANT_ACCESS_TOKEN_STORAGE_KEY)) {
      console.error("Access token 未找到，無法註冊 PageTag 連線");
      return null;
    }

    const pageId = resolvePageId(pageIdSource);
    if (!pageId) {
      console.warn("[PageTag] 缺少 pageId，略過租戶頁面綁定");
      return null;
    }

    return {
      pageId,
      clientId: connectedClientId || connection.connectionId || "",
    };
  };

  const registerCurrentTenantPage = async (pageId) => {
    await connection.invoke("RegisterCurrentTenantPageAsync", pageId);
    registrationMode = LEGACY_HUB_REGISTRATION_MODE.CURRENT;
    return true;
  };

  // LEGACY_COMPAT_START
  // Legacy field backend contract from older Main deployments.
  const registerLegacyTenantPage = async (pageId, clientId) => {
    const json = JSON.stringify({
      PageId: pageId,
      ClientId: clientId,
    });

    await connection.invoke("FromClientSendConnectedIdAndPageIdAsync", json);
    registrationMode = LEGACY_HUB_REGISTRATION_MODE.LEGACY;
    return true;
  };
  // LEGACY_COMPAT_END

  const registerTenantPage = async (connectedClientId) => {
    const payload = resolveRegistrationPayload(connectedClientId);
    if (!payload) {
      return false;
    }

    if (registrationMode === LEGACY_HUB_REGISTRATION_MODE.LEGACY) {
      return await registerLegacyTenantPage(payload.pageId, payload.clientId);
    }

    try {
      return await registerCurrentTenantPage(payload.pageId);
    } catch (err) {
      if (!isHubMethodMissingError(err)) {
        throw err;
      }

      console.warn("[PageTag] Current hub registration unavailable, fallback to legacy hub method.");
      return await registerLegacyTenantPage(payload.pageId, payload.clientId);
    }
  };

  const ensureStarted = async () => {
    if (stopped) return;
    if (
      connection.state === signalR.HubConnectionState.Connected ||
      connection.state === signalR.HubConnectionState.Connecting ||
      connection.state === signalR.HubConnectionState.Reconnecting
    ) {
      return;
    }
    if (!startPromise) {
      startPromise = connection.start().catch((err) => {
        console.warn("[PageTag] connection.start failed:", err?.message || err);
      }).finally(() => {
        startPromise = null;
      });
    }
    await startPromise;
  };

  connection.on("GetConnectedId", async function (clientId) {
    try {
      await registerTenantPage(clientId);
    } catch (err) {
      console.error(err);
    }
  });

  connection.onreconnected(async () => {
    try {
      await registerTenantPage(connection.connectionId);
    } catch (err) {
      console.error("[PageTag] 重新註冊失敗:", err);
    }
  });

  const onPageTagJson = (payload) => {
    try {
      callback(payload);
    } catch (err) {
      console.warn("[PageTag] callback error:", err?.message || err);
    }
  };
  connection.on("ToClientPageTagJson", onPageTagJson);

  connection.on("PageIdError", function (errorText) {
    console.error(errorText);
    handleTenantBindingFailure({
      message: errorText,
    });
  });

  const onStorageChange = async (event) => {
    if (
      stopped ||
      !isTenantRebindStorageKey(event.key)
    ) {
      return;
    }

    if (connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    try {
      await registerTenantPage(connection.connectionId);
    } catch (err) {
      console.error("[PageTag] storage 事件租戶重新綁定失敗:", err);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorageChange);
  }

  connection.onclose(async () => {
    speechSynthesis.cancel();
  });

  ensureStarted();

  const cleanup = () => {
    stopped = true;
    connection.off("ToClientPageTagJson", onPageTagJson);
    connection.off("GetConnectedId");
    connection.off("PageIdError");
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorageChange);
    }
    const waitStart = startPromise || Promise.resolve();
    waitStart.finally(() => {
      if (
        connection.state === signalR.HubConnectionState.Connected ||
        connection.state === signalR.HubConnectionState.Connecting ||
        connection.state === signalR.HubConnectionState.Reconnecting
      ) {
        connection.stop().catch(() => {});
      }
    });
  };

  return {
    connection,
    cleanup,
    async refreshTenantBinding(nextPageIdSource = pageIdSource) {
      pageIdSource = nextPageIdSource || pageIdSource;

      if (connection.state !== signalR.HubConnectionState.Connected) {
        return false;
      }

      try {
        return await registerTenantPage(connection.connectionId);
      } catch (err) {
        console.error("[PageTag] 租戶重新綁定失敗:", err);
        return false;
      }
    },
  };
}
