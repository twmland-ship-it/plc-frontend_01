import { useStore } from "vuex";
import {
  computed,
  defineComponent,
  reactive,
  inject,
  onMounted,
  watch,
} from "vue";
import DataTables from "@/components/table/DataTable.vue";
export default defineComponent({
  components: {
    DataTables,
  },
  props: {
    endTimeOptions: {
      type: Array,
      required: true,
    },
    repeatOptions: {
      type: Array,
      required: true,
    },

    formState: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { state } = useStore();
    const loading = computed(() => state.schedule.loading);
    const form = inject("basicForm");
    const labelCol = {
      lg: 6,
      md: 9,
      xs: 24,
    };

    const wrapperCol = {
      lg: 18,
      md: 15,
      xs: 24,
    };

    const dayObj = {
      1: "一",
      2: "二",
      3: "三",
      4: "四",
      5: "五",
      6: "六",
      0: "日",
    };

    onMounted(() => {
      Object.assign(scheduleFormState, props.formState);
    });

    const scheduleFormState = reactive({});

    const radioStyle = reactive({
      display: "flex",
      marginTop: "0.2rem",
    });

    const monthAdditionOptions = computed(() => {
      if (!scheduleFormState.startTime) {
        return [];
      }

      const second = scheduleFormState.startTime.second();
      const minute = scheduleFormState.startTime.minute();
      const hour = scheduleFormState.startTime.hour();
      const day = scheduleFormState.startTime.day();
      const date = scheduleFormState.startTime.date();
      const firstDayOfMonth = scheduleFormState.startTime.startOf("month");
      const weekNumber = Math.floor(
        scheduleFormState.startTime.diff(firstDayOfMonth, "day") / 7 + 1
      );

      return [
        {
          label: `每月第 ${weekNumber} 個 週${dayObj[day]}`,
          value: `${second} ${minute} ${hour} * * ${day}#${weekNumber}`,
        },
        {
          label: `每月第 ${date} 天`,
          value: `${second} ${minute} ${hour} ${date} * *`,
        },
      ];
    });

    const changeStartTime = () => {
      scheduleFormState.repeatValue = null;
    };

    const changeRepeat = () => {
      scheduleFormState.repeatValue = null;
      if (!scheduleFormState.startTime) {
        return;
      }
      const second = scheduleFormState.startTime.second();
      const minute = scheduleFormState.startTime.minute();
      const hour = scheduleFormState.startTime.hour();
      const day = scheduleFormState.startTime.day();
      const date = scheduleFormState.startTime.date();
      const month = scheduleFormState.startTime.month();
      if (scheduleFormState.repeat === "1") {
        scheduleFormState.repeatLabel = `每日`;
        scheduleFormState.repeatValue = `${second} ${minute} ${hour} * * *`;
      } else if (scheduleFormState.repeat === "2") {
        scheduleFormState.repeatLabel = `每週 ${dayObj[day]}`;
        scheduleFormState.repeatValue = `${second} ${minute} ${hour} * * ${day}`;
      } else if (scheduleFormState.repeat === "4") {
        scheduleFormState.repeatLabel = `每年 ${month} 月 ${date} 日`;
        scheduleFormState.repeatValue = `${second} ${minute} ${hour} ${date} ${month} *`;
      } else if (scheduleFormState.repeat === "5") {
        scheduleFormState.repeatLabel = `每個工作日`;
      } else if (scheduleFormState.repeat === "6") {
        scheduleFormState.repeatLabel = `每個非工作日`;
      }
    };

    watch(
      () => scheduleFormState,
      () => {
        emit("update", scheduleFormState);
      },
      { deep: true }
    );

    return {
      loading,
      form,
      labelCol,
      wrapperCol,
      scheduleFormState,
      monthAdditionOptions,
      radioStyle,
      changeStartTime,
      changeRepeat,
    };
  },
});
