export default [
  {
    path: "/gui",
    name: "gui",
    children: [
      {
        path: "setting",
        name: "gui-setting",
        component: () => import("@/view/oco/gui/setting/Index.vue"),
      },
      {
        path: "main/:id",
        name: "gui-main",
        component: () => import("@/view/oco/gui/main/Index.vue"),
      },
    ],
  },
  {
    path: "/database",
    name: "database",
    children: [
      {
        path: "realtime",
        name: "database-realtime",
        component: () => import("@/view/oco/database/realtime/Index.vue"),
      },
      {
        path: "history",
        name: "database-history",
        component: () => import("@/view/oco/database/history/Index.vue"),
      },
      {
        path: "runtime",
        name: "database-runtime",
        component: () => import("@/view/oco/database/runtime/Index.vue"),
      },
      {
        path: "customReport",
        name: "database-customReport",
        component: () => import("@/view/oco/database/customReport/Index.vue"),
      },
    ],
  },
  {
    path: "/alarm",
    name: "alarm",
    children: [
      {
        path: "history",
        name: "alarm-history",
        component: () => import("@/view/oco/alarm/history/Index.vue"),
      },
      {
        path: "reliability",
        name: "alarm-reliability",
        component: () => import("@/view/oco/alarm/reliability/Index.vue"),
      },
      {
        path: "reliability-analysis",
        name: "alarm-reliability-analysis",
        component: () => import("@/view/oco/alarm/reliability-analysis/Index.vue"),
      },
    ],
  },
  {
    path: "/system",
    name: "system",
    children: [
      {
        path: "uninstall",
        name: "system-uninstall",
        component: () => import("@/view/oco/system/uninstall/Index.vue"),
      },
      {
        path: "cctv",
        name: "system-cctv",
        component: () => import("@/view/oco/system/cctv/Index.vue"),
      },
      {
        path: "bill",
        name: "system-bill",
        component: () => import("@/view/oco/system/bill/Index.vue"),
      },
      {
        path: "waterbill",
        name: "system-waterbill",
        component: () => import("@/view/oco/system/waterbill/Index.vue"),
      },
      {
        path: "btu",
        name: "system-btu",
        component: () => import("@/view/oco/system/btu/Index.vue"),
      },
    ],
  },
  {
    path: "/tags",
    name: "tags",
    children: [
      {
        path: "region",
        name: "tags-region",
        component: () => import("@/view/oco/tags/region/Index.vue"),
      },
      {
        path: "channel",
        name: "tags-channel",
        component: () => import("@/view/oco/tags/channel/Index.vue"),
      },
      {
        path: "device",
        name: "tags-device",
        component: () => import("@/view/oco/tags/device/Index.vue"),
      },
      {
        path: "group",
        name: "tags-group",
        component: () => import("@/view/oco/tags/group/Index.vue"),
      },
      {
        path: "tag",
        name: "tags-tag",
        component: () => import("@/view/oco/tags/tag/Index.vue"),
      },
    ],
  },
  {
    path: "/notify",
    name: "notify",
    children: [
      {
        path: "setting",
        name: "notify-setting",
        component: () => import("@/view/oco/notify/setting/Index.vue"),
      },
      {
        path: "group",
        name: "notify-group",
        component: () => import("@/view/oco/notify/group/Index.vue"),
      },
      {
        path: "message",
        name: "notify-message",
        component: () => import("@/view/oco/notify/message/Index.vue"),
      },
    ],
  },
  {
    path: "/schedule",
    name: "schedule",
    children: [
      {
        path: "calendar",
        name: "schedule-calendar",
        component: () => import("@/view/oco/schedule/calendar/Index.vue"),
      },
      {
        path: "work",
        name: "schedule-work",
        component: () => import("@/view/oco/schedule/work/Index.vue"),
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    children: [
      {
        path: "list",
        name: "user-list",
        component: () => import("@/view/oco/user/list/Index.vue"),
      },
      {
        path: "role",
        name: "user-role",
        component: () => import("@/view/oco/user/role/Index.vue"),
      },
    ],
  },
];
