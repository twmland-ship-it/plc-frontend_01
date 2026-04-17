import { computed, defineComponent, ref, reactive, toRaw } from "vue";
import { BillWrap, ChildSpan } from "./style";
import { useStore } from "vuex";
import dayjs from "dayjs";
import DataTables from "@/components/table/DataTable.vue";
import ModalTable from "@/components/oco/util/ModalTable.vue";
import { Modal } from "ant-design-vue";
import { TreeSelect } from "ant-design-vue";
import { periodOptions } from "@/composable/period";
import PeriodSelect from "@/components/oco/util/periodSelect/Index.vue";
import MeterSetting from "@/components/oco/bill/meter-setting/Index.vue";
export default defineComponent({
  components: { BillWrap, DataTables, ModalTable, MeterSetting, PeriodSelect },

  setup() {
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;

    const { state, dispatch } = useStore();

    const loading = computed(() => state.bill.loading);
    const modeOptions = ref([
      {
        label: "用電度",
        value: "1",
      },
      {
        label: "電費",
        value: "2",
      },
    ]);

    const labelCol = {
      lg: 8,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 16,
      md: 15,
      xs: 24,
    };

    const schedulePeriodOptions = ref(periodOptions);

    const formState = reactive({
      mode: "1",
      meters: [],
      date: [dayjs().subtract(1, "day"), dayjs()],
    });

    const setDate = ({ startTime, endTime }) => {
      formState.date = [dayjs(startTime), dayjs(endTime)];
    };

    const setMeters = (data) => {
      formState.meters = data;
    };

    const submitable = computed(
      () => formState.meters.length > 0 && formState.date && !loading.value
    );

    const data = ref([]);
    const columns = ref();
    const showSummary = ref(false);
    const summaryTable = ref();

    const submitted = ref(false);
    const submit = async () => {
      if (formState.mode === "1") {
        await dispatch("bill/calculateVariation", toRaw(formState));
        data.value = state.bill.calculateTableData.map((el) => ({
          name: (
            <ChildSpan onClick={() => showDetail(el)}>{el.MeterName}</ChildSpan>
          ),
          region: el.RegionName,
          unit: el.MeterUnit,
          total: el.Data.reduce((a, b) => a + b.Variation, 0).toFixed(2),
        }));
        columns.value = [
          {
            title: "名稱",
            dataIndex: "name",
            key: "name",
            fixed: "left",
          },
          {
            title: "地區",
            dataIndex: "region",
            key: "region",
          },
          {
            title: "單位",
            dataIndex: "unit",
            key: "unit",
          },
          {
            title: "總用電量",
            dataIndex: "total",
            key: "total",
            align: "right",
          },
        ];
        detailColumns.value = [
          {
            title: "時間",
            dataIndex: "Date",
            key: "Date",
            fixed: "left",
          },
          {
            title: "起始值",
            dataIndex: "FirstValue",
            key: "FirstValue",
          },
          {
            title: "結束值",
            dataIndex: "LastValue",
            key: "LastValue",
          },
          {
            title: "總用電量",
            dataIndex: "Variation",
            key: "Variation",
            align: "right",
          },
        ];
        showSummary.value = false;
      } else {
        await dispatch("bill/calculateFee", toRaw(formState));
        data.value = state.bill.calculateTableData.map((el) => ({
          name: (
            <ChildSpan onClick={() => showDetail(el)}>{el.MeterName}</ChildSpan>
          ),
          region: el.RegionName,
          unit: el.MeterUnit,
          totalPeakKwh: el.Data.reduce((a, b) => a + b.PeakKwh, 0).toFixed(2),
          totalPeakFee: el.Data.reduce((a, b) => a + b.PeakFee, 0).toFixed(2),
          totalHalfPeakKwh: el.Data.reduce(
            (a, b) => a + b.HalfPeakKwh,
            0
          ).toFixed(2),
          totalHalfPeakFee: el.Data.reduce(
            (a, b) => a + b.HalfPeakFee,
            0
          ).toFixed(2),
          totalSaturdayHalfPeakKwh: el.Data.reduce(
            (a, b) => a + b.SaturdayHalfPeakKwh,
            0
          ).toFixed(2),
          totalSaturdayHalfPeakFee: el.Data.reduce(
            (a, b) => a + b.SaturdayHalfPeakFee,
            0
          ).toFixed(2),
          totalOffPeakKwh: el.Data.reduce(
            (a, b) => a + b.OffPeakKwh,
            0
          ).toFixed(2),
          totalOffPeakFee: el.Data.reduce(
            (a, b) => a + b.OffPeakFee,
            0
          ).toFixed(2),
        }));
        columns.value = [
          {
            title: "名稱",
            dataIndex: "name",
            key: "name",
            fixed: "left",
          },
          {
            title: "地區",
            dataIndex: "region",
            key: "region",
          },
          {
            title: "單位",
            dataIndex: "unit",
            key: "unit",
          },
          {
            title: "尖峰用電量",
            dataIndex: "totalPeakKwh",
            key: "totalPeakKwh",
          },
          {
            title: "尖峰電費",
            dataIndex: "totalPeakFee",
            key: "totalPeakFee",
          },
          {
            title: "半尖峰用電量",
            dataIndex: "totalHalfPeakKwh",
            key: "totalHalfPeakKwh",
          },
          {
            title: "半尖峰電費",
            dataIndex: "totalHalfPeakFee",
            key: "totalHalfPeakFee",
          },
          {
            title: "周六半尖峰用電量",
            dataIndex: "totalSaturdayHalfPeakKwh",
            key: "totalSaturdayHalfPeakKwh",
          },
          {
            title: "周六半尖峰電費",
            dataIndex: "totalSaturdayHalfPeakFee",
            key: "totalSaturdayHalfPeakFee",
          },
          {
            title: "離峰用電量",
            dataIndex: "totalOffPeakKwh",
            key: "totalOffPeakKwh",
          },
          {
            title: "離峰電費",
            dataIndex: "totalOffPeakFee",
            key: "totalOffPeakFee",
          },
        ];
        detailColumns.value = [
          {
            title: "時間",
            dataIndex: "Date",
            key: "Date",
            fixed: "left",
          },
          {
            title: "尖峰用電度",
            dataIndex: "PeakKwh",
            key: "PeakKwh",
          },
          {
            title: "尖峰電費",
            dataIndex: "PeakFee",
            key: "PeakFee",
          },
          {
            title: "半尖峰用電度",
            dataIndex: "HalfPeakKwh",
            key: "HalfPeakKwh",
          },
          {
            title: "半尖峰電費",
            dataIndex: "HalfPeakFee",
            key: "HalfPeakFee",
          },
          {
            title: "周六半尖峰用電度",
            dataIndex: "SaturdayHalfPeakKwh",
            key: "SaturdayHalfPeakKwh",
          },
          {
            title: "周六半尖峰電費",
            dataIndex: "SaturdayHalfPeakFee",
            key: "SaturdayHalfPeakFee",
          },
          {
            title: "離峰用電度",
            dataIndex: "OffPeakKwh",
            key: "OffPeakKwh",
          },
          {
            title: "離峰電費",
            dataIndex: "OffPeakFee",
            key: "OffPeakFee",
          },
        ];
        summaryTable.value = state.bill.calculateSummary;
        showSummary.value = true;
      }
      submitted.value = true;
    };

    const search = (e) => {
      dispatch("bill/filterCalculateTable", e.target.value);
    };

    const exportModal = ref(false);
    const exportFileName = ref("");
    const openExportModal = () => {
      exportFileName.value = dayjs().format("YYYYMMDDHHmmss");
      exportModal.value = true;
    };

    const closeExportModal = () => {
      exportModal.value = false;
    };

    const exportReport = async () => {
      try {
        if (formState.mode === "1") {
          await dispatch("bill/exportVariation", {
            ...toRaw(formState),
            fileName: exportFileName.value,
          });
        } else {
          await dispatch("bill/exportFee", {
            ...toRaw(formState),
            fileName: exportFileName.value,
          });
        }
        exportModal.value = false;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const detailModal = ref();
    const detailModalTitle = ref("");
    const detailTableData = ref([]);
    const detailColumns = ref([]);

    const showDetail = (data) => {
      detailTableData.value = data.Data;
      detailModalTitle.value = `${data.MeterName} 詳情`;
      detailModal.value = true;
    };

    const closeDetailModal = () => {
      detailModal.value = false;
    };

    return {
      SHOW_PARENT,
      loading,
      modeOptions,
      labelCol,
      wrapperCol,
      schedulePeriodOptions,
      formState,
      data,
      columns,
      showSummary,
      summaryTable,
      setDate,
      setMeters,
      submitable,
      submitted,
      submit,
      exportModal,
      exportFileName,
      openExportModal,
      closeExportModal,
      exportReport,
      search,
      detailModal,
      detailModalTitle,
      detailTableData,
      detailColumns,
      closeDetailModal,
    };
  },
});
