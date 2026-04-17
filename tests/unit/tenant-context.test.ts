import { beforeEach, describe, expect, it } from "vitest";
import {
  clearTenantContext,
  getTenantContext,
  getTenantId,
  getTenantScopedItem,
  getTenantScopedStorageKey,
  isTenantRebindStorageKey,
  migrateLegacyStorageKeyToTenantScope,
  removeTenantScopedItem,
  resolveTenantId,
  resolveTenantSlug,
  setTenantScopedItem,
  setTenantContext,
} from "@/utility/tenantContext";

describe("tenantContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("prefers route tenant slug over stored slug", () => {
    window.localStorage.setItem("brand_id", "stored-tenant");

    expect(resolveTenantSlug("route-tenant")).toBe("route-tenant");
  });

  it("falls back to stored tenant context when GUID tenant id is only in userData", () => {
    window.localStorage.setItem(
      "userData",
      JSON.stringify({
        CustomerId: "8f2c7f8e-0b7d-4f67-a375-35d2f7907b59",
      })
    );

    expect(getTenantId()).toBe("8f2c7f8e-0b7d-4f67-a375-35d2f7907b59");
  });

  it("sets and clears tenant context consistently", () => {
    setTenantContext({
      tenantSlug: "tenant-b",
      tenantId: "6fd4df73-e587-4b31-8b68-3cc0dc225f34",
    });

    expect(getTenantContext()).toEqual({
      tenantSlug: "tenant-b",
      tenantId: "6fd4df73-e587-4b31-8b68-3cc0dc225f34",
    });

    clearTenantContext();

    expect(getTenantContext()).toEqual({
      tenantSlug: "",
      tenantId: "",
    });
  });

  it("clears stale local tenant keys when new context omits them", () => {
    setTenantContext({
      tenantSlug: "tenant-a",
      tenantId: "c56226cf-7406-43e4-93d0-d0e3157c1d08",
    });

    setTenantContext({
      tenantSlug: "",
      tenantId: "",
    });

    expect(window.localStorage.getItem("brand_id")).toBeNull();
    expect(window.localStorage.getItem("customer_id")).toBeNull();
  });

  it("prefers explicit tenant id and otherwise falls back to stored tenant context", () => {
    window.localStorage.setItem("customer_id", "stored-tenant-id");

    expect(resolveTenantId("explicit-tenant-id")).toBe("explicit-tenant-id");
    expect(resolveTenantId("")).toBe("stored-tenant-id");
  });

  it("builds and reads tenant-scoped storage keys", () => {
    setTenantContext({
      tenantSlug: "tenant-a",
      tenantId: "tenant-guid-a",
    });

    setTenantScopedItem("tagList", { a: 1 });

    expect(getTenantScopedStorageKey("tagList")).toBe("tenant:tenant-guid-a:tagList");
    expect(getTenantScopedItem("tagList")).toEqual({ a: 1 });

    removeTenantScopedItem("tagList");
    expect(getTenantScopedItem("tagList")).toBeNull();
  });

  it("migrates legacy localStorage keys into the current tenant scope", () => {
    setTenantContext({
      tenantSlug: "tenant-a",
      tenantId: "tenant-guid-a",
    });
    window.localStorage.setItem("dashboard_chart_order", JSON.stringify(["c1", "c2"]));

    expect(migrateLegacyStorageKeyToTenantScope("dashboard_chart_order")).toBe(true);
    expect(window.localStorage.getItem("dashboard_chart_order")).toBeNull();
    expect(getTenantScopedItem("dashboard_chart_order")).toEqual(["c1", "c2"]);
  });

  it("identifies storage keys that should trigger tenant rebinding", () => {
    expect(isTenantRebindStorageKey("userData")).toBe(true);
    expect(isTenantRebindStorageKey("customer_id")).toBe(true);
    expect(isTenantRebindStorageKey("brand_id")).toBe(true);
    expect(isTenantRebindStorageKey("access_token")).toBe(true);
    expect(isTenantRebindStorageKey("permission")).toBe(false);
  });
});
