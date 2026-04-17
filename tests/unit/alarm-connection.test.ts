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
  serverTimeoutInMilliseconds: 0,
  keepAliveIntervalInMilliseconds: 0,
};

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
    error: vi.fn(),
  },
}));

vi.mock("@/utility/tenantBindingFailure", () => ({
  handleTenantBindingFailure,
}));

describe("useAlarmConnection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockConnection.state = "Disconnected";
    closeHandler = null;
    Object.keys(handlers).forEach((key) => delete handlers[key]);
    localStorage.clear();
    localStorage.setItem("customer_id", "test-customer");
    localStorage.setItem("access_token", JSON.stringify("token-1"));
    global.speechSynthesis = {
      cancel: vi.fn(),
    };
  });

  it("手動暫停後不應自動重連", async () => {
    const { useAlarmConnection } = await import("@/composable/alarmConnection");
    const { connection, setPaused } = useAlarmConnection(vi.fn());

    await Promise.resolve();
    expect(mockConnection.start).toHaveBeenCalledTimes(1);

    setPaused(true);
    await connection.stop();
    await vi.advanceTimersByTimeAsync(65000);

    expect(mockConnection.start).toHaveBeenCalledTimes(1);
  });

  it("connected state can refresh current tenant binding", async () => {
    const { useAlarmConnection } = await import("@/composable/alarmConnection");
    const { refreshTenantBinding } = useAlarmConnection(vi.fn());

    await Promise.resolve();
    mockConnection.invoke.mockClear();

    const result = await refreshTenantBinding();

    expect(result).toBe(true);
    expect(mockConnection.invoke).toHaveBeenCalledWith("RegisterCurrentTenantAsync");
  });

  it("tenant mismatch should trigger session invalidation flow", async () => {
    const { useAlarmConnection } = await import("@/composable/alarmConnection");
    useAlarmConnection(vi.fn());

    await handlers.CustomerIdError?.("Access token 租戶與註冊客戶不一致");

    expect(handleTenantBindingFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Access token 租戶與註冊客戶不一致",
      })
    );
  });
});
