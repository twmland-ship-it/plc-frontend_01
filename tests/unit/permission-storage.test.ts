import { beforeEach, describe, expect, it } from "vitest";
import {
  dispatchStorageUpdate,
  getPermissionData,
  setPermissionData,
  TENANT_PERMISSION_STORAGE_KEY,
} from "@/utility/tenantContext";

describe("permission storage helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and reads permission payload through centralized helpers", () => {
    setPermissionData({
      dashboard: ["r"],
      "user-list": ["r", "u"],
    });

    expect(getPermissionData()).toEqual({
      dashboard: ["r"],
      "user-list": ["r", "u"],
    });
    expect(localStorage.getItem(TENANT_PERMISSION_STORAGE_KEY)).toContain("dashboard");
  });

  it("dispatches a storage update with the centralized permission key", async () => {
    setPermissionData({ dashboard: ["r"] });

    const eventPromise = new Promise((resolve) => {
      window.addEventListener(
        "storage",
        (event) => {
          resolve({
            key: event.key,
            newValue: event.newValue,
          });
        },
        { once: true }
      );
    });

    dispatchStorageUpdate(TENANT_PERMISSION_STORAGE_KEY);

    await expect(eventPromise).resolves.toEqual({
      key: TENANT_PERMISSION_STORAGE_KEY,
      newValue: localStorage.getItem(TENANT_PERMISSION_STORAGE_KEY),
    });
  });
});
