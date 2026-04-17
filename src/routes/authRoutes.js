const routes = [
  {
    path: ":id?",
    name: "login",
    component: () =>
      import(
        /* webpackChunkName: "login" */ "@/view/oco/auth/signIn/SignIn.vue"
      ),
  },
  {
    path: "test-email",
    name: "test-email",
    component: () =>
      import(
        /* webpackChunkName: "test-email" */ "@/view/test-email-setting.vue"
      ),
  },

  // {
  //   path: 'register',
  //   name: 'register',
  //   component: () => import(/* webpackChunkName: "register" */ '@/view/authentication/Signup.vue'),
  // },
  {
    path: "forgotPassword",
    name: "forgotPassword",
    component: () =>
      import(
        /* webpackChunkName: "forgotPassword" */ "@/view/authentication/ForgotPassword.vue"
      ),
  },
];

export default routes;
