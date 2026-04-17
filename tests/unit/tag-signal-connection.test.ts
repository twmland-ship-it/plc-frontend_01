import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

const handlers = {};
let closeHandler = null;
let reconnectedHandler = null;
const handleTenantBindingFailure = vi.fn(async () => "租戶驗證失敗");
const addEventListenerSpy = vi.spyOn(window, "addEventListener");
const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

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
  onreconnected: vi.fn((callback) => {
    reconnectedHandler = callback;
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

vi.mock("@/utility/tenantBindingFailure", () => ({
  handleTenantBindingFailure,
}));

describe("useTagSignalConnection", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    mockConnection.state = "Disconnected";
    closeHandler = null;
    reconnectedHandler = null;
    Object.keys(handlers).forEach((key) => delete handlers[key]);
    localStorage.clear();
    localStorage.setItem("access_token", JSON.stringify("token-1"));
    global.speechSynthesis = {
      cancel: vi.fn(),
    };
  });

  it("connected state can refresh current tenant page binding", async () => {
    const { useTagSignalConnection } = await import("@/composable/tagSignalConnection");

    const { refreshTenantBinding } = useTagSignalConnection("page-001", vi.fn());
    await Promise.resolve();
    mockConnection.invoke.mockClear();

    const result = await refreshTenantBinding();

    expect(result).toBe(true);
    expect(mockConnection.invoke).toHaveBeenCalledWith("RegisterCurrentTenantPageAsync", "page-001");
  });

  it("storage event should refresh tenant page binding when connected", async () => {
    const { useTagSignalConnection } = await import("@/composable/tagSignalConnection");

    useTagSignalConnection("page-002", vi.fn());
    await Promise.resolve();
    mockConnection.invoke.mockClear();

    const storageHandler = addEventListenerSpy.mock.calls.find(([eventName]) => eventName === "storage")?.[1];
    expect(storageHandler).toBeTypeOf("function");

    await storageHandler?.({ key: "customer_id" });

    expect(mockConnection.invoke).toHaveBeenCalledWith("RegisterCurrentTenantPageAsync", "page-002");
  });

  it("refresh binding should use latest reactive page id", async () => {
    const { useTagSignalConnection } = await import("@/composable/tagSignalConnection");
    const pageId = ref("page-010");

    const { refreshTenantBinding } = useTagSignalConnection(pageId, vi.fn());
    await Promise.resolve();
    mockConnection.invoke.mockClear();
    pageId.value = "page-011";

    const result = await refreshTenantBinding(pageId);

    expect(result).toBe(true);
    expect(mockConnection.invoke).toHaveBeenCalledWith("RegisterCurrentTenantPageAsync", "page-011");
  });

  it("tenant mismatch should trigger session invalidation flow", async () => {
    const { useTagSignalConnection } = await import("@/composable/tagSignalConnection");

    useTagSignalConnection("page-003", vi.fn());
    await handlers.PageIdError?.("Access token 租戶與註冊頁面不一致");

    expect(handleTenantBindingFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Access token 租戶與註冊頁面不一致",
      }),
    );
  });

  it("cleanup should remove storage listener", async () => {
    const { useTagSignalConnection } = await import("@/composable/tagSignalConnection");

    const { cleanup } = useTagSignalConnection("page-004", vi.fn());
    await Promise.resolve();
    cleanup();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
  });
});
