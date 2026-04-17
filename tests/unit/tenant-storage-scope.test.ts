import { beforeEach, describe, expect, it } from "vitest";
import {
  clearTenantContext,
  setTenantContext,
  setTenantScopedItem,
} from "@/utility/tenantContext";
import {
  getTagListCached,
  invalidateTagListCache,
} from "@/composable/tagInfo";
import {
  listTemplates,
  saveTemplate,
} from "@/api/iframeTemplate";

describe("tenant-scoped frontend storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearTenantContext();
    invalidateTagListCache();
  });

  it("switches tag cache by tenant instead of reusing the previous tenant data", () => {
    setTenantContext({
      tenantSlug: "tenant-a",
      tenantId: "tenant-guid-a",
    });
    setTenantScopedItem("tagList", {
      tagA: { Id: "tagA", SimpleName: "Tag A" },
    });

    expect(getTagListCached()).toEqual({
      tagA: { Id: "tagA", SimpleName: "Tag A" },
    });

    setTenantContext({
      tenantSlug: "tenant-b",
      tenantId: "tenant-guid-b",
    });
    setTenantScopedItem("tagList", {
      tagB: { Id: "tagB", SimpleName: "Tag B" },
    });

    expect(getTagListCached()).toEqual({
      tagB: { Id: "tagB", SimpleName: "Tag B" },
    });
  });

  it("isolates iframe templates per tenant", async () => {
    setTenantContext({
      tenantSlug: "tenant-a",
      tenantId: "tenant-guid-a",
    });

    await saveTemplate({
      name: "Tenant A Template",
      description: "tenant a only",
      config: {
        viewUrl: "https://example.com/a",
      },
      tags: "tenant-a",
    });

    setTenantContext({
      tenantSlug: "tenant-b",
      tenantId: "tenant-guid-b",
    });

    expect(await listTemplates()).toEqual([]);

    setTenantContext({
      tenantSlug: "tenant-a",
      tenantId: "tenant-guid-a",
    });

    const templates = await listTemplates();
    expect(templates).toHaveLength(1);
    expect(templates[0].Name).toBe("Tenant A Template");
  });
});
