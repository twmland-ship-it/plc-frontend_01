import {
  defineComponent,
  computed,
  onMounted,
  ref,
  nextTick,
} from "vue";
import { Main } from "../../styled";
import { useStore } from "vuex";
import DetailModal from "./components/DetailModal.vue";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";

export default defineComponent({
  components: {
    Main,
    DetailModal,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();

    // 載入數據
    onMounted(async () => {
      await loadReliabilityAnalysis();
    });

    const loading = computed(() => state.alarm.reliabilityAnalysisLoading);
    const resetLoading = ref(false);
    const formulaText = computed(() => state.alarm.reliabilityAnalysisData?.FormulaText || "");
    const tableData = computed(() => state.alarm.reliabilityAnalysisData?.ReliabilityAnalysList || []);

    // 系統篩選（主表格）
    const systemOptions = ["全部", "動力系統", "電力系統"];
    const selectedSystem = ref("全部");
    const filteredTableData = computed(() => {
      const list = tableData.value || [];
      if (selectedSystem.value === "全部") return list;
      const keyword =
        selectedSystem.value === "動力系統"
          ? "動力"
          : selectedSystem.value === "電力系統"
            ? "電力"
            : selectedSystem.value;
      return list.filter((row) => {
        const systemName = String(row?.SystemName ?? "");
        return systemName === selectedSystem.value || systemName.includes(keyword);
      });
    });

    // 主表分頁（50 / 100）
    const mainTablePagination = ref({
      current: 1,
      pageSize: 50,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["50", "100"],
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆`,
    });

    const handleMainTableChange = (pagination) => {
      if (!pagination) return;
      mainTablePagination.value.current = pagination.current ?? 1;
      mainTablePagination.value.pageSize =
        pagination.pageSize ?? mainTablePagination.value.pageSize;
    };

    // 表格欄位定義
    const columns = [
      {
        title: "系統名稱",
        dataIndex: "SystemName",
        key: "SystemName",
        width: 120,
      },
      {
        title: "設備名稱",
        dataIndex: "Description",
        key: "Description",
        width: 120,
      },
      {
        title: "故障次數",
        dataIndex: "ErrorCount",
        key: "ErrorCount",
        width: 100,
        align: "center",
      },
      {
        title: "運轉次數",
        dataIndex: "StatusCount",
        key: "StatusCount",
        width: 100,
        align: "center",
      },
      {
        title: "運轉時間",
        dataIndex: "OprSeconds",
        key: "OprSeconds",
        width: 130,
        align: "center",
      },
      {
        title: "可靠度(%)",
        dataIndex: "ResultText",
        key: "ResultText",
        width: 120,
        align: "center",
      },
      {
        title: "重置時間",
        dataIndex: "ResetTimeText",
        key: "ResetTimeText",
        width: 160,
      },
      {
        title: "操作",
        key: "action",
        width: 150,
        align: "center",
      },
    ];

    // 秒數轉 HH:MM:SS（hours 可超過 24）
    const secondsToHms = (seconds) => {
      const sec = Number(seconds);
      if (!Number.isFinite(sec) || sec <= 0) return "00:00:00";
      const total = Math.floor(sec);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const ss = String(s).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    };

    // 依據規格公式計算可靠度(%)
    const calcReliabilityPercent = (errorCount, statusCount) => {
      const e = Number(errorCount ?? 0);
      const s = Number(statusCount ?? 0);
      const denom = s + e;
      if (!Number.isFinite(denom) || denom <= 0) return 100;
      const p = (1 - e / denom) * 100;
      return Math.min(100, Math.max(0, p));
    };

    const normalizeResultText = (text) => {
      const t = String(text ?? "").trim();
      if (!t) return "";
      // API 可能回 "100.00 %" 或 "100.00%"，這裡統一補一個空白
      return t.replace(/\s*%\s*$/, " %");
    };

    const hasDetailData = (record) => {
      // 以 API 回傳結果為準：OriginalResult 為 null 通常代表沒有可計算/可展開的明細
      if (record?.OriginalResult === null) return false;
      // 若 API 直接回傳「沒有運轉紀錄」等字樣，也視為無明細
      const rt = String(record?.ResultText ?? "");
      if (rt.includes("沒有運轉紀錄")) return false;
      return true;
    };

    const formatReliabilityPercent = (record) => {
      // **以 API 回傳的 ResultText 為主**（包含「沒有運轉紀錄」）
      const apiText = normalizeResultText(record?.ResultText);
      if (apiText) return apiText;

      // 若 API 沒給，再用前端公式計算當作備援
      const p = calcReliabilityPercent(record?.ErrorCount, record?.StatusCount);
      return `${p.toFixed(2)} %`;
    };

    const formatOprSeconds = (record) => {
      // API 回傳欄位：OprSeconds（單位秒）
      return secondsToHms(record?.OprSeconds);
    };

    // 載入可靠度分析數據
    const loadReliabilityAnalysis = async () => {
      try {
        await dispatch("alarm/getReliabilityAnalysis");
      } catch (err) {
        Modal.error({
          title: "載入失敗",
          content: err.message,
        });
      }
    };

    // 重置設備
    const resetDevice = async (record) => {
      Modal.confirm({
        title: "確認重置",
        content: `確定要重置設備「${record.Description}」嗎？`,
        okText: "確認",
        cancelText: "取消",
        onOk: async () => {
          try {
            resetLoading.value = true;
            await dispatch("alarm/resetOperatingHour", {
              TagId: record.StateTagId,
            });
            notification.success({
              message: "重置成功",
              description: `設備「${record.Description}」已成功重置`,
            });
            // 重新載入數據
            await loadReliabilityAnalysis();
          } catch (err) {
            Modal.error({
              title: "重置失敗",
              content: err.message,
            });
          } finally {
            resetLoading.value = false;
          }
        },
      });
    };

    // 明細 Modal 相關
    const detailModal = ref(false);
    const detailModalTitle = ref("");
    const currentDetailData = ref(null);

    // 強制響應式更新
    const forceUpdate = ref(0);

    // 故障時間 DataGrid 相關
    const errorTimeTableData = ref([]);
    const errorTimePagination = ref({
      current: 1,
      pageSize: 20,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `故障記錄：第 ${range[0]}-${range[1]} 筆，共 ${total} 筆`,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      size: 'small',
    });

    const errorTimeColumns = [
      {
        title: '序號',
        key: 'index',
        width: 80,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '故障時間',
        key: 'time',
        dataIndex: 'time',
        width: 200,
        align: 'center',
        sorter: (a, b) => new Date(a.time) - new Date(b.time),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
      },
    ];

    const handleErrorTimeTableChange = (pagination) => {
      if (!pagination) return;
      errorTimePagination.value.current = pagination.current ?? 1;
      errorTimePagination.value.pageSize = pagination.pageSize ?? errorTimePagination.value.pageSize;
    };

    // 運轉時間 DataGrid 相關
    const statusTimeTableData = ref([]);
    const statusTimePagination = ref({
      current: 1,
      pageSize: 20,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `運轉記錄：第 ${range[0]}-${range[1]} 筆，共 ${total} 筆`,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      size: 'small',
    });

    const statusTimeColumns = [
      {
        title: '序號',
        key: 'index',
        width: 80,
        align: 'center',
        fixed: 'left',
      },
      {
        title: '運轉時間',
        key: 'time',
        dataIndex: 'time',
        width: 200,
        align: 'center',
        sorter: (a, b) => new Date(a.time) - new Date(b.time),
        sortDirections: ['descend', 'ascend'],
        defaultSortOrder: 'descend',
      },
    ];

    const handleStatusTimeTableChange = (pagination) => {
      if (!pagination) return;
      statusTimePagination.value.current = pagination.current ?? 1;
      statusTimePagination.value.pageSize = pagination.pageSize ?? statusTimePagination.value.pageSize;
    };

    const showDetail = (record) => {
      // 無明細資料：直接不開啟
      if (!hasDetailData(record)) {
        return;
      }

      const reliabilityPercent = calcReliabilityPercent(record?.ErrorCount, record?.StatusCount);
      const reliabilityText = `${reliabilityPercent.toFixed(2)} %`;
      const oprSeconds = Number(record?.OprSeconds ?? 0);
      const oprTimeText = secondsToHms(oprSeconds);

      // 構造明細數據結構
      const detailData = {
        UniqueKey: record.ErrTagId || record.StateTagId || record.Description || record.SystemName || "reliability",
        Description: record.Description,
        SystemName: record.SystemName,
        ReliabilityPercent: reliabilityPercent,
        ReliabilityText: reliabilityText,
        OprSeconds: oprSeconds,
        OprTimeText: oprTimeText,
        FormulaResultText: `可靠度 = ((1 - (${record.ErrorCount} / (${record.StatusCount} + ${record.ErrorCount}))) * 100) % = ${reliabilityText}`,
        ErrorCount: record.ErrorCount || 0,
        ErrorTimeTextList: record.ErrorTimeTextList || [],
        StatusCount: record.StatusCount || 0,
        StatusTimeTextList: record.StatusTimeTextList || []
      };

      console.log("構造的明細數據:", detailData);

      // 使用 nextTick 確保響應式更新
      nextTick(() => {
        currentDetailData.value = detailData;
        detailModalTitle.value = `${record.SystemName} - ${record.Description} 明細`;

        // 準備故障時間 DataGrid 數據
        const errorTimeList = record.ErrorTimeTextList || [];
        errorTimeTableData.value = errorTimeList.map((time, index) => ({
          key: `error-${index}`,
          time: time,
        }));
        errorTimePagination.value.total = errorTimeList.length;
        errorTimePagination.value.current = 1; // 重置到第一頁

        // 準備運轉時間 DataGrid 數據
        const statusTimeList = record.StatusTimeTextList || [];
        statusTimeTableData.value = statusTimeList.map((time, index) => ({
          key: `status-${index}`,
          time: time,
        }));
        statusTimePagination.value.total = statusTimeList.length;
        statusTimePagination.value.current = 1; // 重置到第一頁

        detailModal.value = true;
        forceUpdate.value++; // 強制更新
      });
    };

    const closeDetailModal = () => {
      detailModal.value = false;
      currentDetailData.value = null;

      // 重置 DataGrid 數據
      errorTimeTableData.value = [];
      errorTimePagination.value.current = 1;
      errorTimePagination.value.total = 0;

      statusTimeTableData.value = [];
      statusTimePagination.value.current = 1;
      statusTimePagination.value.total = 0;
    };

    return {
      permission,
      loading,
      resetLoading,
      formulaText,
      tableData,
      systemOptions,
      selectedSystem,
      filteredTableData,
      mainTablePagination,
      handleMainTableChange,
      columns,
      formatReliabilityPercent,
      formatOprSeconds,
      hasDetailData,
      resetDevice,
      detailModal,
      detailModalTitle,
      currentDetailData,
      showDetail,
      closeDetailModal,
      forceUpdate,
      // DataGrid 相關
      errorTimeTableData,
      errorTimePagination,
      errorTimeColumns,
      handleErrorTimeTableChange,
      statusTimeTableData,
      statusTimePagination,
      statusTimeColumns,
      handleStatusTimeTableChange,
    };
  },
});
