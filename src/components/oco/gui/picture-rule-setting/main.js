import { defineComponent, reactive, ref, watch } from "vue";
import { formWrap } from "./style";
export default defineComponent({
  components: {
    formWrap,
  },
  props: {
    rule: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const activeKey = ref(["1", "2", "3"]);

    const formState = reactive({
      stopAction: "3",
      stopValue: null,
      stopStroke: "#ffffff",
      stopFill: "#ffffff",
      digAlarmStatus: false,
      digAlarmStroke: "#ffffff",
      digAlarmFill: "#ffffff",
      digCheckStatus: false,
      digCheckStroke: "#ffffff",
      digCheckFill: "#ffffff",
      HHAlarmStatus: false,
      HHAlarmStroke: "#ffffff",
      HHAlarmFill: "#ffffff",
      HHCheckStatus: false,
      HHCheckStroke: "#ffffff",
      HHCheckFill: "#ffffff",
      HIAlarmStatus: false,
      HIAlarmStroke: "#ffffff",
      HIAlarmFill: "#ffffff",
      HICheckStatus: false,
      HICheckStroke: "#ffffff",
      HICheckFill: "#ffffff",
      LOAlarmStatus: false,
      LOAlarmStroke: "#ffffff",
      LOAlarmFill: "#ffffff",
      LOCheckStatus: false,
      LOCheckStroke: "#ffffff",
      LOCheckFill: "#ffffff",
      LLAlarmStatus: false,
      LLAlarmStroke: "#ffffff",
      LLAlarmFill: "#ffffff",
      LLCheckStatus: false,
      LLCheckStroke: "#ffffff",
      LLCheckFill: "#ffffff",
    });

    Object.assign(formState, props.rule);

    const stopOptions = [
      {
        id: "1",
        name: "隱藏",
      },
      {
        id: "2",
        name: "變色",
      },
      {
        id: "3",
        name: "無",
      },
    ];

    const rules = {
      stopValue: [
        {
          required: formState.stopAction !== "3",
          message: "請填停止值",
          trigger: "blur",
        },
      ],
    };

    watch(
      () => formState,
      () => {
        emit("submit", formState);
      },
      { deep: true }
    );

    return { activeKey, formState, stopOptions, rules };
  },
});
