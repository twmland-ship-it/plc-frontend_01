import { computed, defineComponent, ref, reactive, toRaw } from "vue";
import { BillWrap, ChildSpan } from "./style";
import { useStore } from "vuex";
import dayjs from "dayjs";
import DataTables from "@/components/table/DataTable.vue";
import ModalTable from "@/components/oco/util/ModalTable.vue";
import { Modal } from "ant-design-vue";
import { TreeSelect } from "ant-design-vue";
import PeriodSelect from "@/components/oco/util/periodSelect/Index.vue";
import { periodOptions } from "@/composable/period";
import MeterSetting from "@/components/oco/waterbill/meter-setting/Index.vue";
export default defineComponent({
  components: { BillWrap, DataTables, ModalTable, MeterSetting, PeriodSelect },

  setup() {
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;

    const { state, dispatch } = useStore();

    const loading = computed(() => state.waterbill.loading);

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
      meters: [],
      date: [dayjs(), dayjs()],
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

    // const setChildren = (data) => {
    //   return data.map((el) => ({
    //     ...el,
    //     key: el.id,
    //     children: el.children && setChildren(el.children),
    //     name: <ChildSpan onClick={() => showDetail(el)}>{el.name}</ChildSpan>,
    //   }));
    // };

    const data = computed(() =>
      state.waterbill.calculateTableData.map((el) => ({
        name: (
          <ChildSpan onClick={() => showDetail(el)}>{el.MeterName}</ChildSpan>
        ),
        region: el.RegionName,
        unit: el.MeterUnit,
        consumption: el.FeeData.Consumption,
        total: el.FeeData.UsageFee,
      }))
    );
    const columns = [
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
        title: "用水量",
        dataIndex: "consumption",
        key: "consumption",
        align: "right",
      },
      {
        title: "水費",
        dataIndex: "total",
        key: "total",
        align: "right",
      },
    ];
    const summaryTable = computed(() => state.waterbill.calculateSummary);

    const submitted = ref(false);
    const submit = async () => {
      await dispatch("waterbill/calculate", toRaw(formState));

      submitted.value = true;
    };

    const search = (e) => {
      dispatch("waterbill/filterCalculateTable", e.target.value);
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
        await dispatch("waterbill/exportCalculate", {
          ...toRaw(formState),
          fileName: exportFileName.value,
        });
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
    const detailColumns = [
      {
        title: "時間",
        dataIndex: "Date",
        key: "Date",
      },
      {
        title: "用水量",
        dataIndex: "Consumption",
        key: "Consumption",
        align: "right",
      },
    ];

    const showDetail = (data) => {
      detailTableData.value = data.RawData;
      detailModalTitle.value = `${data.MeterName} 詳情`;
      detailModal.value = true;
    };

    const closeDetailModal = () => {
      detailModal.value = false;
    };

    return {
      SHOW_PARENT,
      loading,
      labelCol,
      wrapperCol,
      schedulePeriodOptions,
      formState,
      data,
      columns,
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
