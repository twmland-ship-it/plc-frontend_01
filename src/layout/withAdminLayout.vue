<template>
  <Div :darkMode="darkMode">
    <sdModal
      v-if="cctvModalOpen"
      :visible="cctvModalOpen"
      :onCancel="closeCCTVModal"
      :width="500"
      class="cctv-modal"
      :wrapClassName="'cctv-modal-wrap'"
      :rootClassName="'cctv-modal-root'"
    >
      <cctvStream
        :cctv="cctvModalList"
        :alarm="true"
        :dontShowOnAlarm="pause"
        @changeAlarmSetting="onPauseChanged"
      ></cctvStream>
    </sdModal>
    <Layout class="layout">
      <Header
        :style="{
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 2000,
          background: 'rgba(255, 255, 255, 0.98)',
          [!rtl ? 'left' : 'right']: 0,
        }"
      >
        <div class="ninjadash-header-content d-flex">
          <div class="ninjadash-header-content__left">
            <div class="navbar-brand align-cener-v">
              <router-link
                :class="
                  topMenu && innerWidth > 991
                    ? 'ninjadash-logo top-menu'
                    : 'ninjadash-logo'
                "
                to="/"
              >
                <img
                  :src="
                    !darkMode
                      ? require(`@/static/img/oco_logo.png`)
                      : require(`@/static/img/oco_logo.png`)
                  "
                  alt="logo"
                />
              </router-link>
              <sdButton
                v-if="!topMenu || innerWidth <= 991"
                @click="toggleCollapsed"
                type="white"
              >
                <img
                  :src="require(`../static/img/icon/align-center-alt.svg`)"
                  alt="menu"
                />
              </sdButton>
            </div>
          </div>
          <div class="ninjadash-header-content__center">
            <div class="customer-name-display" v-if="customerName">
              <span class="customer-name-text">{{ customerName }}</span>
            </div>
          </div>
          <div class="ninjadash-header-content__right d-flex">
            <div class="ninjadash-nav-actions">
              <Notification :alarms="importantAlarm" />
              <AuthInfo />
            </div>
          </div>
          <!-- <div class="ninjadash-header-content__fluid">
            <div class="ninjadash-header-content__fluid__action">
              <a
                class="btn-search"
                @click="handleSearchHide(searchHide)"
                href="#"
              >
                <Notification :alarms="alarms" />
              </a>
              <a class="btn-auth" @click="onShowHide(hide)" href="#">
                <unicon name="ellipsis-v"></unicon>
              </a>
            </div>
          </div> -->
        </div>
      </Header>
      <!-- <div class="header-more">
        <a-row>
          <a-col :md="0" :sm="24" :xs="24">
            <div class="small-screen-headerRight">
              <SmallScreenSearch :hide="searchHide" :darkMode="darkMode">
                <HeaderSearch />
              </SmallScreenSearch>
              <SmallScreenAuthInfo :hide="hide" :darkMode="darkMode">
                <AuthInfo :rtl="rtl" />
              </SmallScreenAuthInfo>
            </div>
          </a-col>
        </a-row>
      </div> -->
      <Layout>
        <template v-if="!topMenu || innerWidth <= 991">
          <Sider
            :width="280"
            :style="{
              margin: '65px 0 0 0',
              padding: `${!rtl ? '20px 20px 55px 0px' : '20px 0px 55px 20px'}`,
              overflowY: 'auto',
              height: '100vh',
              position: 'fixed',
              [!rtl ? 'left' : 'right']: 0,
              zIndex: 998,
            }"
            :collapsed="collapsed"
            :theme="!darkMode ? 'light' : 'dark'"
          >
            <perfect-scrollbar
              :options="{
                wheelSpeed: 1,
                swipeEasing: true,
                suppressScrollX: true,
              }"
            >
              <AsideItems
                :toggleCollapsed="toggleCollapsedMobile"
                :topMenu="topMenu"
                :rtl="rtl"
                :darkMode="darkMode"
                :events="onEventChange"
              />
            </perfect-scrollbar>
          </Sider>
        </template>
        <Layout class="ninjadash-main-layout">
          <Content>
            <Suspense>
              <template #default>
                <router-view
                  :style="{
                    minHeight: 'calc(100vh - 65px - 42px)',
                  }"
                ></router-view>
              </template>
              <template #fallback>
                <div class="spin">
                  <a-spin />
                </div>
              </template>
            </Suspense>
            <Footer
              class="admin-footer"
              :style="{
                padding: '10px 30px 10px',
                color: 'rgba(0, 0, 0, 0.65)',
                fontSize: '14px',
                background: 'rgba(255, 255, 255, .90)',
                width: '100%',
                boxShadow: '0 -5px 10px rgba(146,153,184, 0.05)',
              }"
            >
              <a-row>
                <a-col :span="12">
                  <span class="admin-footer__copyright"
                    >2023 ©
                    <a href="http://www.oco.com.tw" style="">橙設科技有限公司</a>
                  </span>
                </a-col>
                <a-col :span="12" style="text-align: right;">
                  <span class="admin-footer__version"
                    >版本 v{{ appVersion }} | 更新時間：{{ buildDate }}
                  </span>
                </a-col>
              </a-row>
            </Footer>
          </Content>
          <Realtime
            :pause="pause"
            :collapsed="alarmCollapsed"
            :alarmSummary="alarmSummary"
            @onPauseChanged="onPauseChanged"
            @changePanel="changePanel"
          />
        </Layout>
      </Layout>
    </Layout>
  </Div>
</template>
<script>
import { Layout } from "ant-design-vue";
import {
  Div,
  // SmallScreenSearch,
  // SmallScreenAuthInfo,
  // TopMenuSearch,
} from "./style";
// import HeaderSearch from "../components/header-search/HeaderSearch.vue";
import Notification from "@/components/utilities/auth-info/Notification.vue";
import Realtime from "@/components/oco/alarm/Realtime.vue";
import AuthInfo from "../components/utilities/auth-info/info.vue";
import AsideItems from "./Aside";
// import TopMenu from "./TopMenuItems";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import {
  computed,
  ref,
  shallowRef,
  defineComponent,
  onBeforeUnmount,
  watch,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { useAlarmConnection } from "@/composable/alarmConnection";
import { useCCTVConnection } from "@/composable/cctvConnection";
import router from "@/routes/protectedRoute";
import cctvStream from "@/components/oco/util/cctvModal/Index.vue";
import { useTagInfo, getTagListCached } from "@/composable/tagInfo";
import { cctvModalSource, cctvModalOpen, cctvModalList, resetCCTVModalSource, setCCTVModalSourceAuto, updateCCTVModalIfNeeded } from "@/composable/cctvModalState";
import {
  clearAcknowledgedAlarmSuppression,
  getLatestPromptableAlarm,
  resolveAlarmPromptScope,
  syncAcknowledgedAlarmSuppression,
} from "@/composable/alarmPromptState";
import { getItem } from "@/utility/localStorageControl";
import {
  getTenantId,
  isTenantRebindStorageKey,
  TENANT_USER_DATA_STORAGE_KEY,
} from "@/utility/tenantContext";
const { Header, Footer, Sider, Content } = Layout;

export default defineComponent({
  name: "WithAdminLayout",
  components: {
    Div,
    Header,
    Layout,
    Footer,
    Sider,
    Content,
    // HeaderSearch,
    // SmallScreenSearch,
    // SmallScreenAuthInfo,
    // TopMenuSearch,
    AuthInfo,
    Notification,
    AsideItems,
    // TopMenu,
    PerfectScrollbar,
    Realtime,
    cctvStream,
  },
  setup() {
    const collapsed = ref(false);
    const hide = ref(true);
    const searchHide = ref(true);
    const customizerAction = ref(false);
    const activeSearch = ref(false);

    // const store = useStore();
    const { dispatch, state } = useStore();

    const rtl = computed(() => state.themeLayout.rtlData);
    const darkMode = computed(() => state.themeLayout.data);
    const topMenu = computed(() => state.themeLayout.topMenu);

    // 取得 CustomerName 從 localStorage，只有在登入狀態下才顯示
    const customerName = computed(() => {
      try {
        // 檢查登入狀態
        const isLoggedIn = state.auth.login;
        if (!isLoggedIn) {
          return "";
        }

        const userData = getItem(TENANT_USER_DATA_STORAGE_KEY);
        // getItem 已經會自動解析 JSON，所以 userData 可能是物件或字串
        if (userData && typeof userData === 'object' && userData.CustomerName) {
          return userData.CustomerName;
        }
        return "";
      } catch (error) {
        // 靜默處理錯誤，避免控制台噪音
        return "";
      }
    });
    const alarmCollapsed = ref("1");
    const alarmSummary = shallowRef([]);

    // 版本號和建置日期 - 從 localStorage 或環境變數取得
    const appVersion = ref(process.env.VUE_APP_VERSION || "2.3.007-alpha.1");
    const buildDate = ref(process.env.VUE_APP_BUILD_DATE || "2026.04.17 16:00:00");
    const importantAlarm = shallowRef([]);
    const getAlarmPromptScope = () =>
      resolveAlarmPromptScope({
        customerId: getTenantId(),
        userData: getItem(TENANT_USER_DATA_STORAGE_KEY),
      });

    // 監聽 userData 變化以更新標題
    const updatePageTitle = () => {
      try {
        const userData = getItem(TENANT_USER_DATA_STORAGE_KEY);
        const customerName = userData?.CustomerName || "OCO Web Scada";
        const title = `${customerName} - OCO Web Scada (${appVersion.value})`;
        document.title = title;
      } catch (error) {
        // ignore title update errors to avoid noisy console output during tenant rebinding
      }
    };

    // mqtt - 在此處定義之後調用 updatePageTitle
    let refreshAlarmTenantBinding = async () => false;
    let refreshCctvTenantBinding = async () => false;

    const _onStorageChange = async (e) => {
      if (e.key === TENANT_USER_DATA_STORAGE_KEY) {
        updatePageTitle();
      }
      if (isTenantRebindStorageKey(e.key)) {
        try {
          await refreshAlarmTenantBinding();
        } catch (_) {
          // ignore tenant rebinding errors triggered by storage events
        }
        try {
          await refreshCctvTenantBinding();
        } catch (_) {
          // ignore tenant rebinding errors triggered by storage events
        }
      }
    };

    onMounted(() => {
      const loadTags = () => dispatch("tags/getAllTagsAndOptions");
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(loadTags, { timeout: 5000 });
      } else {
        setTimeout(loadTags, 2000);
      }
      updatePageTitle();
      window.addEventListener('storage', _onStorageChange);
    });
    collapsed.value = window.innerWidth <= 1200 && true;

    let audioQueue = [];
    let currentIndex = 0;
    let isQueueUpdated = false;

    const playCurrentSpeech = () => {
      if (speechSynthesis.speaking) return;

      if (audioQueue.length > 0) {
        const utterance = new SpeechSynthesisUtterance(
          audioQueue[currentIndex]
        );
        utterance.onend = handleSpeechEnd;
        speechSynthesis.speak(utterance);
      }
    };

    const handleSpeechEnd = () => {
      if (isQueueUpdated) {
        currentIndex = 0;
        isQueueUpdated = false; // 重置標誌位
      } else {
        currentIndex = (currentIndex + 1) % audioQueue.length;
      }
      playCurrentSpeech();
    };

    const updateAudioQueue = (newQueue) => {
      const newAudioQueue = newQueue.map((el) => el.AlarmDescription);
      audioQueue = newAudioQueue;
      isQueueUpdated = true;
    };

    const lastProcessedAlarmId = ref(null);
    let lastAlarmJson = "";
    let pendingAlarmTimer = null;
    let lastAlarmProcessTime = 0;
    const ALARM_MIN_INTERVAL = 300;

    const alarmCallback = (sourceData) => {
      if (pause.value) return;
      const source = JSON.parse(sourceData);
      const rawJson = source.AlarmSummaryJson;

      if (rawJson === lastAlarmJson) return;
      lastAlarmJson = rawJson;

      // 高優先級警報（Priority <= 1 且 AlarmState === 1）立即處理，跳過節流
      try {
        const peek = JSON.parse(rawJson);
        const hasUrgent = peek.some(a => a.AlarmState === 1 && a.Priority <= 1);
        if (hasUrgent) {
          if (pendingAlarmTimer) { clearTimeout(pendingAlarmTimer); pendingAlarmTimer = null; }
          lastAlarmProcessTime = performance.now();
          processAlarmData(rawJson);
          return;
        }
      } catch (_) { /* 解析失敗走正常節流流程 */ }

      if (pendingAlarmTimer) return;

      const now = performance.now();
      const elapsed = now - lastAlarmProcessTime;
      if (elapsed >= ALARM_MIN_INTERVAL) {
        lastAlarmProcessTime = now;
        requestAnimationFrame(() => processAlarmData(rawJson));
      } else {
        pendingAlarmTimer = setTimeout(() => {
          pendingAlarmTimer = null;
          lastAlarmProcessTime = performance.now();
          processAlarmData(lastAlarmJson);
        }, ALARM_MIN_INTERVAL - elapsed);
      }
    };

    const openCctvForAlarm = (componentId, retryCount = 0) => {
      const cctvList = useTagInfo(componentId, "CctvList");
      if (cctvList && cctvList.length > 0) {
        openCCTVModal({
          CctvIdList: cctvList.map((el) => el.Id),
          isAuto: true
        });
        return;
      }
      if (!getTagListCached() && retryCount < 3) {
        setTimeout(() => openCctvForAlarm(componentId, retryCount + 1), 1000);
      }
    };

    const processAlarmData = (rawJson) => {
      if (pause.value) return;
      const parsed = JSON.parse(rawJson);
      parsed.sort((a, b) => new Date(b.AlarmTime) - new Date(a.AlarmTime));
      Object.freeze(parsed);
      const alarmPromptScope = getAlarmPromptScope();
      syncAcknowledgedAlarmSuppression(alarmPromptScope, parsed);
      alarmSummary.value = parsed;
      importantAlarm.value = parsed.filter((el) => el.AlarmStatus === 3);

      updateAudioQueue(parsed.filter((el) => el.IsAudio && el.AlarmState === 1));
      playCurrentSpeech();

      if (parsed.length === 0) return;

      // 只檢查最新一筆是否為尚未被本使用者剛確認過的有效警報
      const latestEntry = parsed[0];
      const newAlarm = getLatestPromptableAlarm([latestEntry], alarmPromptScope);

      if (!newAlarm) {
        // 沒有 AlarmState===1 的警報，檢查是否有復歸信號
        if (latestEntry && latestEntry.AlarmState === 3) {
          CCTVModalClosedByUser.value = false;
          lastProcessedAlarmId.value = null;
          lastAlarmState.value = latestEntry.AlarmState;
          clearAcknowledgedAlarmSuppression(alarmPromptScope);
        }
        return;
      }

      alarmCollapsed.value = "1";
      lastAlarmId.value = newAlarm.Id;

      if (newAlarm.Id !== lastProcessedAlarmId.value) {
        lastProcessedAlarmId.value = newAlarm.Id;
        CCTVModalClosedByUser.value = false;

        if (newAlarm.PageId && router.currentRoute.value.params.id !== newAlarm.PageId) {
          router.push({ name: "gui-main", params: { id: newAlarm.PageId } });
        }

        openCctvForAlarm(newAlarm.ComponentId);
      } else {
        if (CCTVModalClosedByUser.value) {
          lastAlarmState.value = newAlarm.AlarmState;
          return;
        }
        openCctvForAlarm(newAlarm.ComponentId);
      }

      lastAlarmState.value = newAlarm.AlarmState;
    };

    const {
      connection,
      setPaused: setAlarmPaused,
      refreshTenantBinding: refreshAlarmBinding,
    } = useAlarmConnection(alarmCallback);
    refreshAlarmTenantBinding = refreshAlarmBinding;
    onBeforeUnmount(() => {
      setAlarmPaused(true);
      connection.stop();
      if (pendingAlarmTimer) { clearTimeout(pendingAlarmTimer); pendingAlarmTimer = null; }
    });

    // const cctvCallback = (cctvId, bytes) => {
    //   console.log(cctvId, bytes);
    // };

    // ← 修改：不再需要本地的 CCTVModal 和 currCCTV，改用共享狀態
    // const CCTVModal = ref(false);
    // const currCCTV = ref([]);
    // const CCTVModalSource = ref(null);
    const CCTVModalClosedByUser = ref(false);             // 用戶是否主動關閉自動打開的 Modal
    const lastAlarmId = ref(null);
    const lastAlarmState = ref(null);

    const changeAlarmCCTVSetting = (val) => {
      pause.value = val;
    };

    const openCCTVModal = ({ CctvIdList, isAuto = true }) => {
      if (pause.value) return;

      const changed = updateCCTVModalIfNeeded(CctvIdList);
      if (!changed) return;

      if (isAuto) {
        setCCTVModalSourceAuto();
      } else {
        cctvModalSource.value = 'user';
        cctvModalOpen.value = true;
      }
    };

    const closeCCTVModal = () => {
      // ← 如果是自動打開的 Modal，標記為已被用戶關閉
      if (cctvModalSource.value === 'auto') {
        CCTVModalClosedByUser.value = true;
      }
      resetCCTVModalSource();
    };

    let cctvConn = null;
    let isUnmounted = false;
    useCCTVConnection().then(({ connection: c, refreshTenantBinding }) => {
      if (isUnmounted) {
        try { c.stop(); } catch { /* ignore */ }
      } else {
        cctvConn = c;
        refreshCctvTenantBinding = refreshTenantBinding;
      }
    }).catch(err => {
      console.error("CCTV connection init failed:", err);
    });
    onBeforeUnmount(() => {
      isUnmounted = true;
      window.removeEventListener('storage', _onStorageChange);
      if (innerWidth <= 990 && onBodyClick) {
        document.body.removeEventListener("click", onBodyClick);
      }
      if (cctvConn) {
        try { cctvConn.stop(); } catch { /* ignore */ }
      }
    });

    const pause = ref(false);
    const onPauseChanged = (val) => {
      pause.value = val;
    };

    const changePanel = (val) => {
      alarmCollapsed.value = val;
    };

    watch(
      () => pause.value,
      (val) => {
        setAlarmPaused(val);
        if (val) {
          if (pendingAlarmTimer) {
            clearTimeout(pendingAlarmTimer);
            pendingAlarmTimer = null;
          }
          connection.stop();
        } else {
          connection.start();
        }
      }
    );

    const toggleCollapsed = (e) => {
      e.preventDefault();
      collapsed.value = !collapsed.value;
    };
    const handleSearchHide = (search) => {
      searchHide.value = !search;
      hide.value = true;
    };
    const onShowHide = (h) => {
      hide.value = !h;
      searchHide.value = true;
    };
    const toggleSearch = () => {
      activeSearch.value = !activeSearch.value;
    };

    const toggleCollapsedMobile = () => {
      // const aside = document.querySelector(".ps--active-y");
      // aside.scrollTop = 0;

      if (innerWidth <= 990) {
        collapsed.value = !collapsed.value;
      }
    };
    const onBodyClick = (e) => {
      if (
        !e.target.closest(".ant-layout-sider") &&
        !e.target.closest(".navbar-brand .ant-btn")
      ) {
        collapsed.value = true;
      }
    };
    if (innerWidth <= 990) {
      document.body.addEventListener("click", onBodyClick);
    }

    const onRtlChange = () => {
      const html = document.querySelector("html");
      html.setAttribute("dir", "rtl");
      dispatch("changeRtlMode", true);
    };

    const onLtrChange = () => {
      const html = document.querySelector("html");
      html.setAttribute("dir", "ltr");
      dispatch("changeRtlMode", false);
    };

    const modeChangeDark = () => {
      dispatch("changeLayoutMode", true);
    };

    const modeChangeLight = () => {
      dispatch("changeLayoutMode", false);
    };

    const modeChangeTopNav = () => {
      dispatch("changeMenuMode", true);
    };

    const modeChangeSideNav = () => {
      dispatch("changeMenuMode", false);
    };

    const alarms = computed(() => state.alarm.realtimeInitData);

    const onEventChange = {
      onRtlChange,
      onLtrChange,
      modeChangeDark,
      modeChangeLight,
      modeChangeTopNav,
      modeChangeSideNav,
    };

    return {
      alarmCollapsed,
      pause,
      onPauseChanged,
      changePanel,
      alarmSummary,
      importantAlarm,
      toggleCollapsed,
      handleSearchHide,
      toggleCollapsedMobile,
      onShowHide,
      collapsed,
      hide,
      searchHide,
      toggleSearch,
      customizerAction,
      activeSearch,
      innerWidth: window.innerWidth,
      rtl,
      darkMode,
      topMenu,
      onEventChange,
      alarms,
      cctvModalOpen,           // ← 新增：使用共享的 Modal 狀態
      cctvModalList,           // ← 新增：使用共享的 CCTV 列表
      changeAlarmCCTVSetting,
      closeCCTVModal,
      customerName,
      appVersion,
      buildDate,
    };
  },
});
</script>
<style>
body {
  overflow-x: hidden;
}
.ps {
  height: calc(100vh - 100px);
}
.ant-layout-sider-collapsed .ps {
  height: calc(100vh - 70px);
}
::-webkit-scrollbar {
  width: 15px;
  height: 15px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* CustomerName 顯示樣式 */
.ninjadash-header-content {
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
}

.ninjadash-header-content__left {
  /* 固定左側區塊寬度，避免 navbar-brand 被撐滿導致漢堡按鈕跑到最右邊 */
  flex: 0 0 280px !important;
  max-width: 280px !important;
}

.ninjadash-header-content__left .navbar-brand {
  /* 取消 space-between，讓縮放按鈕靠左貼近 logo */
  justify-content: flex-start !important;
  gap: 12px !important;
}

.ninjadash-header-content__left .navbar-brand button {
  /* 保險：避免被其他樣式推開 */
  margin-left: 0 !important;
}

.ninjadash-header-content__center {
  flex: 1 1 auto !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-width: 0 !important;
  padding: 0 12px !important;
}

.ninjadash-header-content__right {
  flex: 0 0 auto !important;
  position: relative !important;
  z-index: 2 !important;
}

.customer-name-display {
  /* 移除所有背景和邊框 */
  background: none !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.customer-name-text {
  font-size: 18px !important;
  font-weight: 600 !important;
  color: #000 !important;
  text-shadow: none !important;
  letter-spacing: 0.5px !important;
  white-space: nowrap !important;
  line-height: 1 !important;
}

/* 版本號樣式 */
.admin-footer__version {
  font-size: 12px !important;
  color: #999 !important;
  font-weight: 400 !important;
}

/* Footer 樣式，確保不被內容覆蓋 */
.admin-footer {
  position: relative !important;
  z-index: 1000 !important;
  margin-top: 120px !important; /* 確保與上方內容有足夠間距 */
}

/* 響應式設計 */
@media only screen and (max-width: 768px) {
  .customer-name-text {
    font-size: 16px !important;
  }
}

@media only screen and (max-width: 767px) {
  .ninjadash-header-content__left {
    flex: 0 0 auto !important;
    max-width: none !important;
  }
}

@media only screen and (max-width: 480px) {
  .customer-name-text {
    font-size: 14px !important;
  }

  .ninjadash-header-content__center {
    display: none !important;
  }
}
</style>

<style>
/***** CCTV Modal position overrides *****/
.cctv-modal.ant-modal, .cctv-modal-wrap .ant-modal {
  /* 往下移，避免貼到頂部 */
  top: 80px !important;
  left: 12px !important;
  margin: 0 !important; /* cancel horizontal centering */
  z-index: 3000 !important;
}

/* 螢幕高度較小時，避免往下移後超出可視範圍 */
@media (max-height: 700px) {
  .cctv-modal.ant-modal, .cctv-modal-wrap .ant-modal {
    top: 24px !important;
  }
}
</style>
