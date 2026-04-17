import FeaturesRoutes from "./FeaturesRoutes";

const routes = [
  {
    path: "",
    name: "dashboard",
    component: () => import("@/view/oco/home/Home.vue"),
  },
  {
    path: "test-api",
    name: "test-api",
    component: () => import("@/view/test-api.vue"),
  },
  ...FeaturesRoutes,
];

export default routes;
