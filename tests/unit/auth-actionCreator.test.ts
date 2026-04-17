import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(() => null),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

vi.mock("@/config/dataService/dataService", () => ({
  DataService: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import authModule from "@/vuex/modules/auth/actionCreator";
import { DataService } from "@/config/dataService/dataService";

const mockedDataService = DataService as unknown as {
  post: ReturnType<typeof vi.fn>;
  get: ReturnType<typeof vi.fn>;
};

describe("auth actionCreator", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("login should persist auth/session data without storing plaintext login credentials", async () => {
    mockedDataService.post.mockResolvedValue({
      data: {
        Detail: {
          AccessToken: "access-token",
          RefreshToken: "refresh-token",
          StaffName: "王管理員",
          PermissionCode: 999,
          RoleId: "11111111-2222-3333-4444-555555555555",
          UniformNumber: "U12345678",
          CustomerID: "66666666-7777-8888-9999-aaaaaaaaaaaa",
          CustomerName: "Tenant A",
          EnableState: 1,
          IsRoot: true,
          Features: {
            dashboard: ["r"],
          },
        },
      },
    });

    const commit = vi.fn();
    const fetchUserData = vi.fn(() => Promise.resolve());
    const dispatch = vi.fn((type, payload) => {
      if (type === "fetchUserData") {
        return fetchUserData(payload);
      }
      return Promise.resolve();
    });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    await authModule.actions.login(
      { commit, dispatch },
      {
        acc: " admin ",
        password: "Secret123!",
        id: "tenant-a",
      }
    );

    expect(localStorage.getItem("loginCredentials")).toBeNull();
    expect(localStorage.getItem("access_token")).toBe("access-token");
    expect(localStorage.getItem("refresh_token")).toBe("refresh-token");
    expect(localStorage.getItem("brand_id")).toBe("tenant-a");
    expect(localStorage.getItem("customer_id")).toBe("66666666-7777-8888-9999-aaaaaaaaaaaa");
    expect(fetchUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        Account: "admin",
        CustomerId: "66666666-7777-8888-9999-aaaaaaaaaaaa",
        StaffName: "王管理員",
      })
    );
    expect(logSpy).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });
});
