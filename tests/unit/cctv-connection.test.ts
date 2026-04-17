import { beforeEach, describe, expect, it, vi } from "vitest";

const handlers = {};
let closeHandler = null;
const handleTenantBindingFailure = vi.fn(async () => "租戶驗證失敗");

const mockConnection = {
  state: "Disconnected",
  start: vi.fn(async () => {
    mockConnection.state = "Connected";
  }),
  stop: vi.fn(async () => {
    mockConnection.state = "Disconnected";
    if (closeHandler) {
      await closeHandler();
    }
  }),
  invoke: vi.fn(async () => {}),
  on: vi.fn((eventName, callback) => {
    handlers[eventName] = callback;
  }),
  off: vi.fn(),
  onclose: vi.fn((callback) => {
    closeHandler = callback;
  }),
  onreconnected: vi.fn(),
  serverTimeoutInMilliseconds: 0,
  keepAliveIntervalInMilliseconds: 0,
};

const notificationError = vi.fn();

vi.mock("@microsoft/signalr", () => ({
  HubConnectionBuilder: class {
    withUrl() {
      return this;
    }
    withAutomaticReconnect() {
      return this;
    }
    build() {
      return mockConnection;
    }
  },
  HttpTransportType: {
    WebSockets: "WebSockets",
  },
  HubConnectionState: {
    Connected: "Connected",
    Connecting: "Connecting",
    Reconnecting: "Reconnecting",
    Disconnected: "Disconnected",
  },
}));

vi.mock("ant-design-vue", () => ({
  notification: {
    error: notificationError,
  },
}));

vi.mock("@/utility/tenantBindingFailure", () => ({
  handleTenantBindingFailure,
}));

describe("useCCTVConnection", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockConnection.state = "Disconnected";
    closeHandler = null;
    Object.keys(handlers).forEach((key) => delete handlers[key]);
    localStorage.clear();
    localStorage.setItem("access_token", JSON.stringify("token-1"));
    global.speechSynthesis = {
      cancel: vi.fn(),
    };
  });

  it("registers current tenant CCTV client after connection starts", async () => {
    const { useCCTVConnection } = await import("@/composable/cctvConnection");

    await useCCTVConnection();

    expect(mockConnection.start).toHaveBeenCalledTimes(1);
    expect(mockConnection.invoke).toHaveBeenCalledWith("registerCurrentTenantClientAsync");
  });

  it("surfaces tenant mismatch errors from CCTV hub", async () => {
    const { useCCTVConnection } = await import("@/composable/cctvConnection");

    await useCCTVConnection();
    await handlers.CustomerIdError?.("Access token 租戶與註冊客戶不一致");

    expect(notificationError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "CCTV 租戶驗證失敗",
      })
    );
    expect(handleTenantBindingFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Access token 租戶與註冊客戶不一致",
      })
    );
  });

  it("connected state can refresh current tenant CCTV binding", async () => {
    const { useCCTVConnection } = await import("@/composable/cctvConnection");

    const { refreshTenantBinding } = await useCCTVConnection();
    mockConnection.invoke.mockClear();

    const result = await refreshTenantBinding();

    expect(result).toBe(true);
    expect(mockConnection.invoke).toHaveBeenCalledWith("registerCurrentTenantClientAsync");
  });
});
