import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import ModalTable from "@/components/oco/util/ModalTable.vue";
import dayjs from "dayjs";
import { useTagInfo } from "../../../../composable/tagInfo";
export default defineComponent({
  props: {
    modal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },

    closeModal: {
      type: Function,
      required: true,
    },
  },
  components: {
    ModalTable,
  },
  setup() {
    const { state, dispatch } = useStore();

    const loading = computed(() => state.alarm.loading);
    const columns = [
      { title: "測點名稱", dataIndex: "name", key: "name", fixed: "left" },
      { title: "描述", dataIndex: "description", key: "description" },
      { title: "故障次數", dataIndex: "value", key: "value", align: "right" },
    ];

    const innerColumns = [
      { title: "故障時間", dataIndex: "value", key: "value" },
    ];

    const tableData = computed(() => {
      return state.alarm.reliabilityTableData.map((el) => ({
        ...el,
        key: el.TagName,
        name: el.TagName,
        description: useTagInfo(el.TagId, "Description"),
        value: el.FaultOccurredTimes && el.FaultOccurredTimes.length,
        details: el.FaultOccurredTimes.map((el) => ({
          value: dayjs(el).format("YYYY-MM-DD HH:mm:ss"),
        })),
      }));
    });

    const search = (e) => {
      dispatch("alarm/filterReliabilityData", e.target.value);
    };
    return {
      loading,
      columns,
      innerColumns,
      tableData,
      search,
    };
  },
});
