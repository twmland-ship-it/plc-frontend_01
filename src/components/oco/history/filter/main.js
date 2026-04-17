import {
  defineComponent,
  computed,
  reactive,
  watch,
  onMounted,
  ref,
} from "vue";
import { useStore } from "vuex";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
import PeriodSelect from "@/components/oco/util/periodSelect/Index.vue";
import dayjs from "dayjs";
import ColumnSet from "@/components/oco/form/uninstall-tag/Index.vue";
import CommonSearch from "@/components/oco/util/commonSearch/Index.vue";
import { Wrap } from "./style";
import { useChartOptions } from "@/composable/chart";
import { reportType, statisticMethod } from "@/composable/options";
import { Modal } from "ant-design-vue";
export default defineComponent({
  components: {
    TagFilter,
    GroupFilter,
    PeriodSelect,
    ColumnSet,
    CommonSearch,
    Wrap,
  },
  props: {
    formState: {
      type: Object,
      required: true,
    },
    labelCol: {
      type: Object,
      default: () => ({
        lg: 6,
        md: 9,
        xs: 24,
      }),
    },
    wrapperCol: {
      type: Object,
      default: () => ({
        lg: 18,
        md: 15,
        xs: 24,
      }),
    },
    usePeriod: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { state, dispatch } = useStore();
    const loading = computed(() => state.database.loading);
    onMounted(async () => {
      const res = await Promise.all([
        dispatch("database/fetchDatabaseHistoryOptions"),
        dispatch("database/getSearchList"),
      ]);
      searchTypeOptions.value = res[0].searchType;
      schedulePeriodOptions.value = res[0].schedulePeriod;
    });
    const searchTypeOptions = ref([]);
    const chartTypeOptions = [
      {
        id: "none",
        name: "無圖表",
      },
      {
        id: "pie",
        name: "圓餅圖",
      },
      {
        id: "bar",
        name: "長條圖",
      },
      {
        id: "line",
        name: "趨勢圖",
      },
    ];
    const reportTypeOptions = reportType;

    const compareTypeOptions = [
      {
        id: 1,
        name: "年比較",
      },
      {
        id: 2,
        name: "月比較",
      },
    ];
    const chartSummaryOptions = useChartOptions();
    const summaryTypeOptions = statisticMethod;
    const schedulePeriodOptions = ref([]);

    const columnModal = ref(false);
    const settingColumn = [
      {
        title: "測點名稱",
        dataIndex: "name",
      },
      {
        title: "欄位名稱",
        dataIndex: "value",
        width: "200px",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "70px",
      },
    ];

    const columnData = ref([]);

    const openModal = () => {
      columnData.value = filterFormState.tags;
      columnModal.value = true;
    };

    const closeModal = () => {
      if (
        JSON.stringify(columnData.value) !==
        JSON.stringify(filterFormState.tags)
      ) {
        Modal.confirm({
          title: "提示",
          content: "測點將不會選定，確定關閉？",
          onOk() {
            columnModal.value = false;
          },
        });
      } else {
        columnModal.value = false;
      }
    };

    const addColumnTag = (data) => {
      columnData.value = [
        ...columnData.value,
        ...data.map((el) => ({ ...el, value: "" })),
      ];
    };

    const editColumnTag = ({ id, key, value }) => {
      columnData.value.find((el) => el.id === id)[key] = value;
    };

    const deleteColumnTag = (id) => {
      columnData.value.splice(
        columnData.value.indexOf(columnData.value.find((el) => el.id === id)),
        1
      );
    };

    const submitColumn = () => {
      filterFormState.tags = columnData.value;
      columnModal.value = false;
    };

    const commonSearchData = computed(() => state.database.commonSearchList);

    const deleteCommonSearch = async (id) => {
      await dispatch("database/deleteSearch", id);
    };

    const useSearch = (data) => {
      Object.assign(filterFormState, data);
    };

    onMounted(() => {
      Object.assign(filterFormState, props.formState);
    });

    const setTags = async (data) => {
      filterFormState.tags = data;
    };

    const setGroups = async (data) => {
      filterFormState.groups = data;
    };

    const setDate = ({ startTime, endTime }) => {
      filterFormState.date = [dayjs(startTime), dayjs(endTime)];
    };

    const filterFormState = reactive({
      searchType: "統計報表",
      tags: [],
      chartType: null,
      chartSummary: null,
      reportType: null,
      compareType: null,
      reportSummary: null,
      date: [dayjs(), dayjs()],
    });

    watch(
      () => filterFormState,
      () => {
        emit("update", filterFormState);
      },
      { deep: true }
    );

    return {
      setTags,
      setGroups,
      setDate,
      chartTypeOptions,
      chartSummaryOptions,
      reportTypeOptions,
      compareTypeOptions,
      searchTypeOptions,
      summaryTypeOptions,
      schedulePeriodOptions,
      columnModal,
      settingColumn,
      columnData,
      openModal,
      closeModal,
      addColumnTag,
      editColumnTag,
      deleteColumnTag,
      commonSearchData,
      deleteCommonSearch,
      useSearch,
      loading,
      filterFormState,
      submitColumn,
    };
  },
});
