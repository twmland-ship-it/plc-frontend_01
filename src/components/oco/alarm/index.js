import { computed, defineComponent, ref, watch } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { RealTime, ActionSpan } from "./style";
import ModalHelper from "@/utility/modalHelper";
import { useStore } from "vuex";
import router from "@/routes/protectedRoute";
import dayjs from "dayjs";
import cctvStream from "@/components/oco/util/cctvModal/Index.vue";
import { getTagListCached } from "@/composable/tagInfo";
import { usePermission } from "@/composable/permission";
import { requestOpenCCTVModal, resetCCTVModalSource } from "@/composable/cctvModalState";  // ← 修改
import {
  getActiveUnacknowledgedAlarmIds,
  rememberAcknowledgedAlarmIds,
  resolveAlarmPromptScope,
} from "@/composable/alarmPromptState";
import { getItem } from "@/utility/localStorageControl";
import { getTenantContext, TENANT_USER_DATA_STORAGE_KEY } from "@/utility/tenantContext";
export default defineComponent({
  components: {
    DataTables,
    RealTime,
    cctvStream,
  },
  props: {
    collapsed: {
      type: String,
      require: true,
    },
    alarmSummary: {
      type: Array,
      require: true,
    },
    pause: {
      type: Boolean,
      require: true,
    },
  },
  emits: ["onPauseChanged", "changePanel"],
  setup(props, { emit }) {
    const store = useStore();
    const { permission: alarmPermission } = usePermission("alarm-realtime");
    const windowWidth = window.innerWidth;
    const changePanel = (e) => {
      emit("changePanel", e);
    };

    // 改進的快取機制：保留緩存以保證性能，但加入時間戳以防止過期
    // 結構：{ value: [], timestamp: Date, accessed: boolean }
    const cctvCache = new Map();
    const CCTV_CACHE_TTL = 5 * 60 * 1000; // 5 分鐘 TTL
    
    // ← 新增：響應式引用，用於追蹤 tag 數據是否已加載
    const tagDataReady = ref(false);
    
    const getCCTVList = (tagId) => {
      const now = Date.now();
      
      // 如果緩存存在且未過期，直接返回
      if (cctvCache.has(tagId)) {
        const cached = cctvCache.get(tagId);
        if (now - cached.timestamp < CCTV_CACHE_TTL) {
          return cached.value;
        }
        // 否則清除過期快取
        cctvCache.delete(tagId);
      }
      
      // 重新查詢：優先使用 Vuex store，但若 store 不完整則回退到 localStorage 的完整 tagList
      const tableData = Array.isArray(store.state.tags?.tagTableData)
        ? store.state.tags.tagTableData
        : [];
      const storeTags = tableData.length > 0
        ? (() => {
            const result = {};
            for (const item of tableData) {
              result[item.Id] = item;
            }
            return result;
          })()
        : null;
      const cachedTags = getTagListCached();

      const storeTag = storeTags?.[tagId];
      const cachedTag = cachedTags?.[tagId];
      const cctvList = Array.isArray(storeTag?.CctvList)
        ? storeTag.CctvList
        : cachedTag?.CctvList;
      const result = (cctvList && cctvList.length > 0) ? cctvList.map((el) => el.Id) : [];

      // 若 tag 資料來源尚未準備好，不要把空結果快取住，避免 icon 暫時消失後卡住 5 分鐘
      const hasTagSource = tableData.length > 0 || !!cachedTags;
      if (!hasTagSource && result.length === 0) {
        return [];
      }
      
      // 存入快取（即使為空也快取，防止重複查詢）
      cctvCache.set(tagId, {
        value: result,
        timestamp: now,
        accessed: false
      });
      
      return result;
    };

    // 額外的歷史資料（展開時自動載入，縮回時清空）
    const extraRows = ref([]);

    // 合併即時摘要與歷史：以 Id 去重，且以即時資料覆蓋歷史，確保「新警報優先」
    const mergedList = computed(() => {
      const byId = new Map();
      // 先放歷史
      for (const h of extraRows.value) {
        if (h && h.Id != null) byId.set(h.Id, h);
      }
      // 再放即時（覆蓋同 Id）
      for (const r of props.alarmSummary) {
        if (r && r.Id != null) byId.set(r.Id, r);
      }
      return Array.from(byId.values()).sort(
        (a, b) => new Date(b.AlarmTime) - new Date(a.AlarmTime)
      );
    });


    const tableData = computed(() => mergedList.value);

    const actionColumn = {
      title: "操作",
      dataIndex: "action",
      key: "action",
      width: 190,
      customRender: ({ record: el }) => {
        const cctvIds = getCCTVList(el.ComponentId);
        return (
          <ActionSpan>
            {(el.AlarmState === 1 || el.AlarmState === 3) && alarmPermission.update && (
              <a-button type="primary" ghost onClick={() => checkAlarm({ id: el.Id })}>
                <unicon name="check"></unicon>
              </a-button>
            )}
            <a-button type="primary" ghost onClick={() => openSOP(el)}>
              <unicon name="file-alt"></unicon>
            </a-button>
            {el.PageId && (
              <a-button type="primary" ghost onClick={() => openImage(el)}>
                <unicon name="image"></unicon>
              </a-button>
            )}
            {cctvIds.length > 0 && (
              <a-button type="primary" ghost onClick={() => openCCTVModal(cctvIds)}>
                <unicon name="video"></unicon>
              </a-button>
            )}
          </ActionSpan>
        );
      },
    };
    const columns = [
      actionColumn,
      {
        title: "型態",
        dataIndex: "AlarmTypeCode",
        key: "AlarmTypeCode",
        width: 90,
        customRender: ({ text }) => (
          <span
            class={[
              "alarm-type-chip",
              `alarm-type-${String(text ?? "unknown").toLowerCase()}`,
            ]}
          >
            {text ?? "-"}
          </span>
        ),
      },
      {
        title: "警戒值",
        dataIndex: "AlarmLimitValueAtTrigger",
        key: "AlarmLimitValueAtTrigger",
        width: 100,
        customRender: ({ text, record }) => {
          const displayValue = [text, record.AlarmLimitValue].find(
            (value) => value !== null && value !== undefined && String(value).trim() !== ""
          );
          return displayValue ?? "-";
        },
      },
      {
        title: "現值",
        dataIndex: "AlarmValueAtTrigger",
        key: "AlarmValueAtTrigger",
        width: 100,
        customRender: ({ text, record }) => {
          const displayValue = [
            text,
            record.RealComponentTagValue,
            record.ComponentValue,
          ].find(
            (value) => value !== null && value !== undefined && String(value).trim() !== ""
          );
          return displayValue ?? "-";
        },
      },
      { title: "時間", dataIndex: "AlarmTime", key: "time", width: 110, customRender: ({ text }) => dayjs(text).format("YYYY-MM-DD HH:mm:ss") },
      { title: "地區", dataIndex: "RegionName", key: "RegionName", width: 120 },
      {
        title: "說明",
        dataIndex: "AlarmDescription",
        key: "AlarmDescription",
        width: 230,
      },
      {
        title: "測點",
        dataIndex: "ComponentName",
        key: "ComponentName",
        width: 310,
      },
      {
        title: "警報等級",
        dataIndex: "PriorityText",
        key: "PriorityText",
        width: 80,
      },
      {
        title: "狀態",
        dataIndex: "AlarmStateText",
        key: "AlarmStateText",
        width: 80,
      },
    ];

    // Expand / Collapse fullscreen toggle for realtime alarm panel
    const expanded = ref(false);
    const isLoadingHistory = ref(false);

    const loadExpandedHistory = async () => {
      isLoadingHistory.value = true;
      try {
        const res = await store.dispatch("alarm/getHistoryOptions");
        // 取得預設查詢條件：優先取 searchType[0].value、searchType[0].Value 或本身
        const typeOptions = res?.searchType ?? [];
        let defaultSearchType = null;
        if (typeOptions.length > 0) {
           defaultSearchType = typeOptions[0].Id ?? typeOptions[0].value ?? typeOptions[0].Value ?? typeOptions[0];
        }
        
        // 若沒有查詢條件，拋出錯誤避免 API 失敗
        if (defaultSearchType == null) {
          throw new Error("無可用的查詢條件");
        }
        
        // 近 24 小時
        const start = dayjs().subtract(24, "hour");
        const end = dayjs();
        await store.dispatch("alarm/fetchAlarmHistory", {
          searchType: defaultSearchType,
          tags: [], // 全部設備
          date: [start, end],
        });
        const hist = (store.state.alarm && store.state.alarm.historyTableData) || [];
        // 歷史排序後再裁 50 筆，去重交由 mergedList 統一處理（即時優先）
        extraRows.value = hist
          .sort((a, b) => dayjs(b.AlarmTime).unix() - dayjs(a.AlarmTime).unix())
          .slice(0, 50);
      } catch (err) {
        console.error("載入歷史失敗", err);
      } finally {
        isLoadingHistory.value = false;
      }
    };

    const toggleExpand = async () => {
      expanded.value = !expanded.value;
      if (expanded.value) {
        // 非阻塞：先顯示即時資料，歷史在背景載入
        loadExpandedHistory();
      } else {
        extraRows.value = [];
      }
    };

    const tableScroll = computed(() => {
      // Base collapsed height
      const baseY = 50;
      // Expanded height：更高一些，固定 600px
      const expandedY = 600;
      return expanded.value
        ? { x: 'max-content', y: expandedY }
        : { x: 'max-content', y: baseY };
    });

    // ← 新增：監聽 store 中的 tag 數據，初次加載時強制清除快取以重新渲染表格
    watch(
      () => store.state.tags?.tagTableData,
      (newTagData) => {
        if (newTagData && newTagData.length > 0 && !tagDataReady.value) {
          // Tag 數據首次加載完成，清除快取強制表格重新渲染
          cctvCache.clear();
          tagDataReady.value = true;
        }
      }
    );


    const getRowClassName = ({ AlarmState }) => {
      if (AlarmState === 2) {
        return "text-checked";
      } else if (AlarmState === 1) {
        return "text-alert";
      } else {
        return "text-normal";
      }
    };

    const onPauseChanged = (eOrVal) => {
      // 支援兩種來源：
      // 1) 即時警報區的 <a-checkbox> 會傳入 event
      // 2) CCTV 視窗內的 <cctvStream> 會 emit boolean
      const checked =
        typeof eOrVal === "boolean" ? eOrVal : !!eOrVal?.target?.checked;
      emit("onPauseChanged", checked);
    };

    const openSOP = ({ ComponentName, AlarmSop }) => {
      ModalHelper.info({
        title: `${ComponentName} SOP`,
        content: AlarmSop,
      });
    };

    const openImage = (data) => {
      router.push({
        name: "gui-main",
        params: { id: data.PageId },
      });
    };

    const CCTVModal = ref(false);
    const currCCTV = ref([]);

    const openCCTVModal = (CctvIdList) => {
      // ← 修改：不直接打開本地 Modal，而是調用共享狀態的函數
      // 這樣統一由 withAdminLayout.vue 中的 Modal 顯示
      requestOpenCCTVModal(CctvIdList);
    };

    const closeCCTVModal = () => {
      // 清除所有 CCTV 快取，確保下次查詢能取得最新資料
      // 這樣用戶關閉 CCTV 視窗後，點擊攝影機圖案會重新查詢最新的 CCTV 列表
      cctvCache.clear();
      resetCCTVModalSource();  // ← 修改：使用共享狀態的重置函數
    };

    const checkAlarm = async ({ id }) => {
      ModalHelper.confirm({
        title: "確認警報?",
        okText: "確認",
        cancelText: "取消",
        onOk: async () => {
          try {
            await store.dispatch("alarm/checkAlarm", id);
            const { tenantId } = getTenantContext();
            const promptScope = resolveAlarmPromptScope({
              customerId: tenantId,
              userData: getItem(TENANT_USER_DATA_STORAGE_KEY),
            });
            const acknowledgedIds = id
              ? [id]
              : Array.from(getActiveUnacknowledgedAlarmIds(props.alarmSummary));
            rememberAcknowledgedAlarmIds(promptScope, acknowledgedIds);
            ModalHelper.success({
              title: "已確認",
            });
          } catch (err) {
            ModalHelper.error({
              title: "發生錯誤",
              content: err.message,
            });
          }
        },
      });
    };

    return {
      windowWidth,
      changePanel,
      tableData,
      columns,
      getRowClassName,
      checkAlarm,
      onPauseChanged,
      CCTVModal,
      currCCTV,
      closeCCTVModal,
      openCCTVModal,  // ← 新增：必须暴露出去，表格才能调用
      expanded,
      isLoadingHistory,
      toggleExpand,
      tableScroll,
    };
  },
});
