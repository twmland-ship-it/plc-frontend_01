import { Main } from "../../styled";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
import { Modal } from "ant-design-vue";
import dayjs from "dayjs";
import PeriodSelect from "@/components/oco/util/periodSelect/Index.vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    Main,
    DataTables,
    GroupFilter,
    TagFilter,
    PeriodSelect,
  },
  setup() {
    const { state, dispatch } = useStore();
    const { permission } = usePermission();

    const loading = computed(() => state.alarm.loading);
    onMounted(async () => {
      const res = await dispatch("alarm/getHistoryOptions");
      searchTypeOptions.value = res.searchType;
      // 設定預設值為第一個選項的 value，避免寫死 1
      if (res.searchType && res.searchType.length > 0) {
        formState.searchType = res.searchType[0].Id ?? res.searchType[0].value ?? res.searchType[0].Value ?? res.searchType[0];
      }
    });

    const labelCol = {
      lg: 2,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 5,
      md: 15,
      xs: 24,
    };

    const searchTypeOptions = ref([]);

    const formState = reactive({
      searchType: null,
      tags: [],
      groups: [],
      date: null,
    });

    const setDate = ({ startTime, endTime }) => {
      formState.date = [dayjs(startTime), dayjs(endTime)];
    };

    watch(
      () => formState.searchType,
      () => {
        formState.tags = [];
        formState.groups = [];
      }
    );

    const setTags = (value) => {
      formState.tags = value;
    };

    const setGroups = (value) => {
      formState.groups = value;
    };

    const sumitable = computed(
      () =>
        !searching.value
    );
    const submit = async () => {
      try {
        showTable.value = false;
        searching.value = true;
        await dispatch("alarm/fetchAlarmHistory", formState);
        searching.value = false;
        showTable.value = true;
      } catch (err) {
        searching.value = false;
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };
    const searching = ref(false);
    const showTable = ref(false);

    const columns = [
      { title: "時間", dataIndex: "AlarmTime", key: "AlarmTime" },
      { title: "測點", dataIndex: "FullTagName", key: "FullTagName" },
      { title: "測點說明", dataIndex: "TagDescription", key: "TagDescription" },
      { title: "測點類型", dataIndex: "TagTypeText", key: "TagTypeText" },
      { title: "警報狀態", dataIndex: "AlarmStateText", key: "AlarmStateText" },
      {
        title: "警報等級",
        dataIndex: "AlarmPriorityText",
        key: "AlarmPriorityText",
      },
      {
        title: "測點值",
        dataIndex: "TagValue",
        key: "TagValue",
        align: "right",
      },
    ];
    const tableData = computed(() =>
      state.alarm.historyTableData.map((el) => ({
        ...el,
        AlarmTime: dayjs(el.AlarmTime).format("YYYY-MM-DD HH:mm:ss"),
      }))
    );
    const search = (e) => {
      dispatch("alarm/filterAlarmHistory", e.target.value);
    };
    return {
      permission,
      loading,
      labelCol,
      wrapperCol,
      searchTypeOptions,
      formState,
      setDate,
      setTags,
      setGroups,
      submit,
      sumitable,
      searching,
      showTable,
      columns,
      tableData,
      search,
    };
  },
});
