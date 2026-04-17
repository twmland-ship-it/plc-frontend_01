import store from "@/vuex/store";
import { getTenantSlug, resolveTenantSlug } from "@/utility/tenantContext";

const buildLoginPath = (tenantSlug) => {
  const normalizedTenantSlug = resolveTenantSlug(tenantSlug);
  return normalizedTenantSlug ? `/auth/${normalizedTenantSlug}` : "/auth";
};

export async function handleTenantBindingFailure({
  message = "租戶驗證失敗，請重新登入",
  tenantSlug,
} = {}) {
  try {
    await store.dispatch("auth/logOut");
  } catch (_) {
    // ignore logout cleanup errors and continue redirect flow
  }

  if (typeof window !== "undefined") {
    window.location.assign(buildLoginPath(tenantSlug ?? getTenantSlug()));
  }

  return message;
}
