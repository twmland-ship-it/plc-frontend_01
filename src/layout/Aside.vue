<template>
  <a-menu
    v-if="init"
    :open-keys="openKeys"
    :selectedKeys="selectedKeys"
    :mode="mode"
    :theme="darkMode ? 'dark' : 'light'"
    class="scroll-menu"
    @openChange="onOpenChange"
  >
    <a-menu-item key="dashboard">
      <template #icon>
        <unicon name="create-dashboard"></unicon>
      </template>
      <router-link to="/">首頁</router-link>
    </a-menu-item>

    <div v-if="permissionList.gui">
      <NavTitle class="ninjadash-sidebar-nav-title"> 監控系統 </NavTitle>
      <a-menu-item v-if="permissionList.guiSetting" key="gui-setting">
        <template #icon>
          <unicon name="setting"></unicon>
        </template>
        <router-link :to="{ name: 'gui-setting' }">頁面設定</router-link>
      </a-menu-item>

      <div v-if="permissionList.guiMain">
        <div v-for="v in guiList" :key="v.Id">
          <div v-if="v.Category === 2">
            <a-sub-menu :key="`gui-${v.Id}`">
              <template #icon>
                <unicon name="th-large"></unicon>
              </template>
              <template #title>{{ v.Name }}</template>

              <MenuList
                :parentKey="`gui-${v.Id}`"
                :openKeys="openKeys"
                :allList="v.Children"
                :toggleCollapsed="toggleCollapsed"
              />
            </a-sub-menu>
          </div>
          <div v-else>
            <a-menu-item @click="toggleCollapsed" :key="`gui-${v.Id}`">
              <template #icon>
                <unicon name="th-large"></unicon>
              </template>
              <router-link :to="{ name: 'gui-main', params: { id: v.Id } }">
                {{ v.Name }}
              </router-link>
            </a-menu-item>
          </div>
        </div>
      </div>
    </div>

    <div v-if="permissionList.database">
      <NavTitle class="ninjadash-sidebar-nav-title"> 數據中心 </NavTitle>
      <a-menu-item
        v-if="permissionList.databaseRealtime"
        key="database-realtime"
      >
        <template #icon>
          <unicon name="heart-rate"></unicon>
        </template>
        <router-link :to="{ name: 'database-realtime' }">即時資料</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.databaseHistory" key="database-history">
        <template #icon>
          <unicon name="history"></unicon>
        </template>
        <router-link :to="{ name: 'database-history' }">歷史報表</router-link>
      </a-menu-item>

      <a-menu-item v-if="permissionList.databaseRuntime" key="database-runtime">
        <template #icon>
          <unicon name="clock-eight"></unicon>
        </template>
        <router-link :to="{ name: 'database-runtime' }">運轉時數</router-link>
      </a-menu-item>
      <a-menu-item
        v-if="permissionList.databaseCustomReport"
        key="database-customReport"
      >
        <template #icon>
          <unicon name="list-ul"></unicon>
        </template>
        <router-link :to="{ name: 'database-customReport' }"
          >匯出報表</router-link
        >
      </a-menu-item>
    </div>

    <div v-if="permissionList.alarm">
      <NavTitle class="ninjadash-sidebar-nav-title"> 警報系統 </NavTitle>
      <a-menu-item v-if="permissionList.alarmHistory" key="alarm-history">
        <template #icon>
          <unicon name="history"></unicon>
        </template>
        <router-link :to="{ name: 'alarm-history' }">歷史警報</router-link>
      </a-menu-item>
      <a-menu-item
        v-if="permissionList.alarmReliability"
        key="alarm-reliability"
      >
        <template #icon>
          <unicon name="analytics"></unicon>
        </template>
        <router-link :to="{ name: 'alarm-reliability' }"
          >故障分析</router-link
        >
      </a-menu-item>
      <a-menu-item
        v-if="permissionList.alarmReliabilityAnalysis"
        key="alarm-reliability-analysis"
      >
        <template #icon>
          <unicon name="chart-line"></unicon>
        </template>
        <router-link :to="{ name: 'alarm-reliability-analysis' }"
          >可靠度分析</router-link
        >
      </a-menu-item>
    </div>

    <div v-if="permissionList.system">
      <NavTitle class="ninjadash-sidebar-nav-title"> 系統 </NavTitle>
      <a-menu-item v-if="permissionList.systemUninstall" key="system-uninstall">
        <template #icon>
          <unicon name="bolt-slash"></unicon>
        </template>
        <router-link :to="{ name: 'system-uninstall' }">電力卸載</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.systemBill" key="system-bill">
        <template #icon>
          <unicon name="bill"></unicon>
        </template>
        <router-link :to="{ name: 'system-bill' }">電費</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.systemWaterbill" key="system-waterbill">
        <template #icon>
          <unicon name="bill"></unicon>
        </template>
        <router-link :to="{ name: 'system-waterbill' }">水費</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.systemBTU" key="system-btu">
        <template #icon>
          <unicon name="bill"></unicon>
        </template>
        <router-link :to="{ name: 'system-btu' }">BTU</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.systemCCTV" key="system-cctv">
        <template #icon>
          <unicon name="video"></unicon>
        </template>
        <router-link :to="{ name: 'system-cctv' }"> CCTV </router-link>
      </a-menu-item>
    </div>

    <div v-if="permissionList.notify">
      <NavTitle class="ninjadash-sidebar-nav-title"> 通知 </NavTitle>
      <a-menu-item v-if="permissionList.notifySetting" key="notify-setting">
        <template #icon>
          <unicon name="setting"></unicon>
        </template>
        <router-link :to="{ name: 'notify-setting' }">通知設定</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.notifyGroup" key="notify-group">
        <template #icon>
          <unicon name="comments"></unicon>
        </template>
        <router-link :to="{ name: 'notify-group' }">通知群組</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.notifyMessage" key="notify-message">
        <template #icon>
          <unicon name="message"></unicon>
        </template>
        <router-link :to="{ name: 'notify-message' }">發送通知</router-link>
      </a-menu-item>
    </div>

    <div v-if="permissionList.tags">
      <NavTitle class="ninjadash-sidebar-nav-title"> 測點 </NavTitle>
      <a-menu-item v-if="permissionList.tagsRegion" key="tags-region">
        <template #icon>
          <unicon name="map-marker"></unicon>
        </template>
        <router-link :to="{ name: 'tags-region' }">地區</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.tagsChannel" key="tags-channel">
        <template #icon>
          <unicon name="channel"></unicon>
        </template>
        <router-link :to="{ name: 'tags-channel' }">通道</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.tagsDevice" key="tags-device">
        <template #icon>
          <unicon name="desktop"></unicon>
        </template>
        <router-link :to="{ name: 'tags-device' }">裝置</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.tagsGroup" key="tags-group">
        <template #icon>
          <unicon name="servers"></unicon>
        </template>
        <router-link :to="{ name: 'tags-group' }">群組</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.tagsTag" key="tags-tag">
        <template #icon>
          <unicon name="heart-rate"></unicon>
        </template>
        <router-link :to="{ name: 'tags-tag' }">測點</router-link>
      </a-menu-item>
    </div>

    <div v-if="permissionList.user">
      <NavTitle class="ninjadash-sidebar-nav-title"> 人員 </NavTitle>
      <a-menu-item v-if="permissionList.userRole" key="user-role">
        <template #icon>
          <unicon name="lock-alt"></unicon>
        </template>
        <router-link :to="{ name: 'user-role' }">權限設定</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.userList" key="user-list">
        <template #icon>
          <unicon name="users-alt"></unicon>
        </template>
        <router-link :to="{ name: 'user-list' }">人員清單</router-link>
      </a-menu-item>
    </div>

    <div v-if="permissionList.schedule">
      <NavTitle class="ninjadash-sidebar-nav-title"> 排程 </NavTitle>
      <a-menu-item
        v-if="permissionList.scheduleCalendar"
        key="schedule-calendar"
      >
        <template #icon>
          <unicon name="calender"></unicon>
        </template>
        <router-link :to="{ name: 'schedule-calendar' }">日曆設定</router-link>
      </a-menu-item>
      <a-menu-item v-if="permissionList.scheduleWork" key="schedule">
        <template #icon>
          <unicon name="list-ul"></unicon>
        </template>
        <router-link :to="{ name: 'schedule-work' }">工作排程</router-link>
      </a-menu-item>
    </div>

    <!-- <NavTitle v-if="menu.equipment" class="ninjadash-sidebar-nav-title">
        設備
      </NavTitle>
      <a-menu-item v-if="menu.equipment" key="equipment">
        <template #icon>
        <unicon name="desktop"></unicon>
      </template>
      <router-link to="/">設備管理</router-link>
    </a-menu-item> -->
  </a-menu>
</template>
<script>
import {
  computed,
  reactive,
  ref,
  toRefs,
  watch,
  watchEffect,
  defineComponent,
  onMounted,
  toRaw,
} from "vue";
import VueTypes from "vue-types";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import versions from "../demoData/changelog.json";
import { NavTitle } from "./style";
import { useI18n } from "vue-i18n";
import { usePermission } from "@/composable/permission";
import router from "@/routes/protectedRoute";
import MenuList from "@/components/oco/util/MenuList.vue";
import { Modal } from "ant-design-vue";
export default defineComponent({
  name: "AsideItems",
  props: {
    toggleCollapsed: VueTypes.func,
    events: VueTypes.object,
  },
  components: {
    NavTitle,
    MenuList,
  },
  setup(props) {
    const { t } = useI18n();
    const init = ref(false);
    const store = useStore();
    const darkMode = computed(() => store.state.themeLayout.data);
    const mode = ref("inline");
    const { events } = toRefs(props);
    const {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    } = events.value;
    const route = computed(() => useRoute());
    const state = reactive({
      rootSubmenuKeys: ["sub1", "sub2", "sub4"],
      selectedKeys: ["home"],
      openKeys: ["dashboard"],
      preOpenKeys: ["dashboard"],
    });

    function addPageRoute(allPages) {
      return new Promise((resolve) => {
        // 拼接完整的路由路径
        for (let i = 0; i < allPages.length; i++) {
          if (allPages[i].Category !== 2) {
            router.addRoute("gui-main", {
              path: `${allPages[i].Id}`,
              component: () => import("@/view/oco/gui/main/Index.vue"),
            });
          }

          if (allPages[i].Children.length > 0) {
            addPageRoute(allPages[i].Children);
          }
        }
        resolve();
      });
    }
    onMounted(async () => {
      try {
        const allPages = await store.dispatch("gui/getAllPages");
        addPageRoute(allPages.data);
        guiList.value = allPages.data;
        init.value = true;
      } catch (err) {
        Modal.error({ title: "錯誤", content: err.message });
      }
    });

    const onOpenChange = (keys) => {
      let deleteProp = false;
      for (let k in state.openKeys) {
        if (!deleteProp) {
          if (!keys.includes(state.openKeys[k])) {
            deleteProp = true;
            delete state.openKeys[k];
          }
        } else {
          delete state.openKeys[k];
        }
      }
      if (!deleteProp) {
        state.openKeys[Object.keys(state.openKeys).length + 1] =
          keys[keys.length - 1];
      }
      deleteProp = true;
    };

    const guiList = ref([]);
    watch(
      () => store.state.gui.settingInitData,
      async (newValue) => {
        init.value = false;
        guiList.value = newValue;
        await addPageRoute(newValue);
        init.value = true;
      }
    );
    function findPathsById(arr, id, path = "") {
      let paths = [];
      for (let obj of arr) {
        let currentPath = `${path}-${obj.Id}`;

        if (obj.Id === id) {
          paths.push(currentPath);
          break;
        }
        if (obj.Children && Array.isArray(obj.Children)) {
          let foundPaths = findPathsById(obj.Children, id, currentPath);
          if (foundPaths.length > 0) {
            paths.push(currentPath, ...foundPaths);
          }
        }

        if (!obj.Children && obj.Id !== id) {
          paths = [];
        }
      }

      return paths;
    }

    watchEffect(() => {
      if (route.value.matched.length) {
        if (route.value.matched.length > 2) {
          if (route.value.matched[2].name === "gui-main") {
            const keys = findPathsById(
              toRaw(guiList.value),
              route.value.params.id,
              "gui",
              []
            );
            state.selectedKeys = [keys[keys.length - 1]];
            state.openKeys = keys;
            state.preOpenKeys = keys;
          } else {
            state.selectedKeys = [route.value.matched[2].name];
            state.openKeys = [route.value.matched[1].name];
            state.preOpenKeys = [route.value.matched[1].name];
          }
        } else {
          state.selectedKeys = [route.value.matched[1].name];
          state.openKeys = [route.value.matched[1].name];
          state.preOpenKeys = [route.value.matched[1].name];
        }
      }
    });

    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal;
      }
    );
    const readPermission = (key) => {
      const { permission } = usePermission(key);
      return computed(() => permission.read);
    };

    const permissionList = reactive({
      dashboard: readPermission("dashboard"),
      gui: readPermission("gui"),
      guiSetting: readPermission("gui-setting"),
      guiMain: readPermission("gui-main"),
      database: readPermission("database"),
      databaseRealtime: readPermission("database-realtime"),
      databaseHistory: readPermission("database-history"),
      databaseRuntime: readPermission("database-runtime"),
      databaseCustomReport: readPermission("database-customReport"),
      alarm: false,
      alarmRealtime: readPermission("alarm-realtime"),
      alarmHistory: readPermission("alarm-history"),
      alarmReliability: readPermission("alarm-reliability"),
      alarmReliabilityAnalysis: readPermission("alarm-reliability-analysis"),
      system: false,
      systemUninstall: readPermission("system-uninstall"),
      systemBill: readPermission("system-bill"),
      systemWaterbill: readPermission("system-waterbill"),
      systemCCTV: readPermission("system-cctv"),
      systemBTU: readPermission("system-btu"),
      notify: readPermission("notify"),
      notifySetting: readPermission("notify-setting"),
      notifyGroup: readPermission("notify-group"),
      notifyMessage: readPermission("notify-message"),
      tags: readPermission("tags"),
      tagsRegion: readPermission("tags-region"),
      tagsChannel: readPermission("tags-channel"),
      tagsDevice: readPermission("tags-device"),
      tagsGroup: readPermission("tags-group"),
      tagsTag: readPermission("tags-tag"),
      user: readPermission("user"),
      userList: readPermission("user-list"),
      userRole: readPermission("user-role"),
      schedule: readPermission("schedule"),
      scheduleCalendar: readPermission("schedule-calendar"),
      scheduleWork: readPermission("schedule-work"),
    });

    // 父層可視條件：任一子項有 read 權限即顯示
    permissionList.system = computed(() =>
      permissionList.systemUninstall ||
      permissionList.systemBill ||
      permissionList.systemWaterbill ||
      permissionList.systemBTU ||
      permissionList.systemCCTV
    );

    permissionList.alarm = computed(() =>
      permissionList.alarmHistory ||
      permissionList.alarmReliability ||
      permissionList.alarmReliabilityAnalysis ||
      permissionList.alarmRealtime
    );

    return {
      init,
      guiList,
      mode,
      ...toRefs(state),
      darkMode,
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
      versions,
      onOpenChange,
      t,
      permissionList,
    };
  },
});
</script>
