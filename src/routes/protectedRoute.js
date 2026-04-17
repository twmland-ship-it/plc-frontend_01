import { createWebHistory, createRouter } from "vue-router";
import adminRoutes from "./AdminRoutes";
import authRoutes from "./authRoutes";
import store from "@/vuex/store";
import {
  getPermissionData,
  getTenantSlug,
  resolveTenantSlug,
} from "@/utility/tenantContext";

const routes = [
  {
    name: "Admin",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/layout/withAdminLayout.vue"),
    children: [...adminRoutes],
    meta: { auth: false },
  },
  {
    name: "Auth",
    path: "/auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "@/layout/withAuthLayout.vue"),
    children: [...authRoutes],
    meta: { auth: true },
  },
];

const router = createRouter({
  history: createWebHistory(
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_SUB_ROUTE
        ? process.env.VUE_APP_SUB_ROUTE
        : process.env.BASE_URL
      : process.env.BASE_URL
  ),
  linkExactActiveClass: "active",
  routes,
});

router.beforeEach(async (to, from, next) => {
  const menuList = getPermissionData();
  const tenantSlug = getTenantSlug();
  const routeTenantId = resolveTenantSlug(to.params?.id);

  // 從多租戶平台開啟 /auth/:id 時，若本機仍為「已登入」狀態，舊邏輯會 next("/") 而忽略 URL 租戶 → 永遠留在上一個客戶
  if (
    to.name === "login" &&
    routeTenantId &&
    store.state.auth.login &&
    routeTenantId !== tenantSlug
  ) {
    await store.dispatch("auth/logOut");
    next({ name: "login", params: { id: routeTenantId }, replace: true });
    return;
  }

  function getAllSubProperties(obj) {
    const result = [];
    if (!obj || typeof obj !== "object") return result;
    for (const prop in obj) {
      if (obj[prop].includes("r")) {
        result.push(prop);
      }
    }
    return result;
  }
  const allPermissionRoute = getAllSubProperties(menuList);
  const hasPermission = allPermissionRoute.includes(to.name);

  if (to.meta.auth && store.state.auth.login) {
    next("/");
  } else if (!to.meta.auth && !store.state.auth.login) {
    next(tenantSlug ? { name: "login", params: { id: tenantSlug } } : { name: "login" });
  } else if (!to.meta.auth && to.name !== "dashboard" && !hasPermission) {
    next("/");
  } else if (to.name === "gui-main") {
    // const randomParam = Math.random().toString(36).substring(7);
    to.params = { ...to.params };
    next();
  } else {
    window.scrollTo(0, 0); // reset scroll position to top of page
    next();
  }
});

export default router;
