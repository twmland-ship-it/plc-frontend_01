import { defineComponent, computed, toRaw, reactive, watch } from "vue";
import { useStore } from "vuex";
import { ModalWrapper } from "./style";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
import { Modal } from "ant-design-vue";
export default defineComponent({
  props: {
    sourceData: {
      type: Object,
      required: true,
    },
    chartTypeOptions: {
      type: Array,
      default: () => [],
    },
    timePeriodOptions: {
      type: Array,
      default: () => [],
    },
    summaryTypeOptions: {
      type: Array,
      default: () => [],
    },
    detailPeriodOptions: {
      type: Array,
      default: () => [],
    },
    unitOptions: {
      type: Array,
      default: () => [],
    },
    paramSummaryOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ModalWrapper,
    TagFilter,
    GroupFilter,
  },
  setup(props, { emit }) {
    const { state } = useStore();

    const loading = computed(() => state.dashboard.loading);
    // const useMultiGroup = ["doughnut", "bar", "card"];
    const showTimePeriodOptions = computed(() =>
      formState.chartType === "line"
        ? props.timePeriodOptions.slice(1)
        : props.timePeriodOptions
    );
    const chartSchemes = [
      {
        id: "line",
        params: 10,
      },
      {
        id: "doughnut",
        params: 10,
      },
      {
        id: "bar",
        params: 10,
      },
      {
        id: "radialBar",
        params: 1,
      },
      {
        id: "card",
        params: 2,
      },
    ];

    const checkSchemeLength = (type) => {
      if (!type) {
        return 0;
      }
      return chartSchemes.find((el) => el.id === type).params;
    };

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

    const formState = reactive({});
    Object.assign(formState, JSON.parse(JSON.stringify(props.sourceData)));
    watch(
      () => formState.chartType,
      () => {
        formState.params = [
          { name: null, tags: [], groups: [], color: "#000000" },
        ];
      }
    );

    const rules = {
      name: [
        {
          required: true,
          message: "請輸入圖表名稱",
          trigger: "blur",
        },
      ],
      limit: [
        {
          required: true,
          message: "請輸入上限值",
          trigger: "blur",
        },
      ],
      params: [
        {
          required: true,
          validator: (rule, value, callback) => {
            if (value.filter((el) => !el.name).length > 0) {
              callback("請填參數名稱");
            } else {
              callback();
            }
          },
          trigger: "blur",
        },
      ],
    };

    const setGroups = (data, idx) => {
      formState.params[idx].groups = data.map((el) => el.id);
      const groupTags = data.map((el) => el.tags.map((tag) => tag.Id)).flat();
      formState.params[idx].groupTags = groupTags;
    };

    const setTags = (data, idx) => {
      if (formState.chartType !== "line") {
        formState.params[idx].tags = data.map((el) => el.id);
      } else {
        formState.params[idx].tags = data.value ? [data.value] : [];
      }
    };

    const newBlock = () => {
      formState.params.push({
        name: null,
        tags: [],
        groups: [],
        color: "#000000",
      });
    };

    const delBlock = (idx) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        onOk: () => {
          formState.params.splice(idx, 1);
        },
      });
    };

    const submit = () => {
      emit("submit", toRaw(formState));
    };

    return {
      loading,
      checkSchemeLength,
      labelCol,
      wrapperCol,
      formState,
      rules,
      setGroups,
      setTags,
      showTimePeriodOptions,
      newBlock,
      delBlock,
      submit,
    };
  },
});
