import { defineComponent, ref, computed, reactive, toRaw } from "vue";
import { useStore } from "vuex";
import { Main } from "../../styled";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import DataTables from "@/components/table/DataTable.vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import { TableSpan } from "./style";
import { Modal } from "ant-design-vue";
export default defineComponent({
  components: {
    Main,
    DataTables,
    LevelSelect,
    TagFilter,
    TableSpan,
  },
  setup() {
    const { state, dispatch } = useStore();
    const init = ref(false);
    const loading = computed(() => state.database.loading);

    const labelCol = {
      lg: 2,
      md: 9,
      xs: 24,
    };

    const wrapperCol = {
      lg: 6,
      md: 15,
      xs: 24,
    };

    const formState = reactive({
      tag: [],
    });

    const setTag = async (data) => {
      formState.tag = data;
    };

    const submitable = computed(() => formState.tag.length !== 0);

    const searching = ref(false);

    const showTable = ref(false);

    const data = computed(() => {
      const res = state.database.realtimeTableData.map((el) => {
        const { name, unit, value, status } = el;
        return {
          ...el,
          status,
          name,
          unit,
          value,
        };
      });
      return res;
    });
    const columns = [
      { title: "名稱", dataIndex: "Name", key: "Name" },
      { title: "測點值", dataIndex: "Value", key: "Value", align: "right" },
    ];
    const getRowClassName = ({ status }) => {
      if (status === "1") {
        return "text-normal";
      } else if (status === "2") {
        return "text-alert";
      } else if (status === "3") {
        return "text-disabled";
      }
    };
    const submit = async () => {
      try {
        searching.value = true;
        await dispatch("database/fetchRealtimeData", toRaw(formState));
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

    const search = (e) => {
      dispatch("database/filterRealtimeTable", e.target.value);
    };

    return {
      init,
      labelCol,
      wrapperCol,
      formState,
      setTag,
      submitable,
      searching,
      showTable,
      data,
      loading,
      columns,
      getRowClassName,
      submit,
      search,
    };
  },
});
