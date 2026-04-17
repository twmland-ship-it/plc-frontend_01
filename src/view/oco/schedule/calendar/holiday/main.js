import { useStore } from "vuex";
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  reactive,
  watch,
  toRaw,
} from "vue";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.schedule.loading);
    onMounted(async () => {
      const year = new Date().getFullYear();
      const res = await Promise.all([
        dispatch("schedule/getHoliday", year),
        dispatch("schedule/getHolidayOptions"),
      ]);
      repeatOptions.value = res[1].repeat;
    });
    const selectedDay = ref();
    const holiday = computed(() => state.schedule.holiday);
    const isHoliday = (date) => {
      const current = date.format("YYYY-MM-DD");
      return holiday.value.find((el) => el.date === current);
    };

    const getYears = (value) => {
      const year = value.year();
      const years = [];
      for (let i = year - 10; i < year + 10; i += 1) {
        years.push(i);
      }
      return years;
    };

    const getMonths = () => {
      const months = [];
      for (let i = 0; i < 12; i++) {
        months.push(`${i + 1}月`);
      }
      return months;
    };

    const fileInput = ref(null);
    const handleFileUpload = async () => {
      try {
        const file = fileInput.value.files[0];
        await dispatch("schedule/importCalendar", file);
        notification.success({
          message: "匯入成功",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err,
        });
      }
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const onPanelChange = (date) => {
      const year = date.year();
      if (year !== state.schedule.currentYear) {
        dispatch("schedule/getHoliday", year);
      }
    };

    const onSelect = (date) => {
      if (!permission.update) return;
      formState.date = date;
      const checkIsHoliday = isHoliday(date);
      if (checkIsHoliday) {
        formState.repeat = checkIsHoliday.repeat || "1";
        formState.description = checkIsHoliday.text;
      } else {
        formState.repeat = "1";
        formState.description = null;
      }
      modal.value = true;
    };

    const modal = ref(false);
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
    const formState = reactive({
      id: null,
      description: "",
      repeat: null,
      cron: null,
      date: null,
    });

    const rules = {
      description: [{ required: true, trigger: "blur", message: "請輸入描述" }],
      repeat: [{ required: true, trigger: "blur", message: "請選擇" }],
    };
    const repeatOptions = ref([]);
    const remark = ref(null);
    watch(
      () => formState.repeat,
      (newValue) => {
        const dayObj = {
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
          0: "日",
        };
        if (newValue === "1") {
          formState.cron = null;
          remark.value = null;
        }
        if (newValue === "2") {
          formState.cron = `* * * * ${formState.date.day()}`;
          remark.value = `每週 ${dayObj[formState.date.day()]}`;
        }
        if (newValue === "3") {
          const firstDayOfMonth = formState.date.startOf("month");
          const weekNumber = Math.floor(
            formState.date.diff(firstDayOfMonth, "day") / 7 + 1
          );
          formState.cron = `* * * * ${formState.date.day()}#${weekNumber}`;
          remark.value = `每月第 ${weekNumber} 個 週${
            dayObj[formState.date.day()]
          }`;
        }

        if (newValue === "4") {
          formState.cron = `* * * ${formState.date.date()} ${formState.date.month()} *`;
          remark.value = `每年 ${formState.date.month()} 月 ${formState.date.date()} 日`;
        }
      }
    );

    const closeModal = () => {
      modal.value = false;
    };

    const submitForm = async () => {
      try {
        await dispatch("schedule/setHoliday", toRaw(formState));
        notification.success({
          message: "設定成功",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err,
        });
      }
    };

    return {
      permission,
      loading,
      selectedDay,
      holiday,
      isHoliday,
      getYears,
      getMonths,
      fileInput,
      handleFileUpload,
      triggerFileInput,
      onPanelChange,
      onSelect,
      modal,
      repeatOptions,
      remark,
      labelCol,
      wrapperCol,
      formState,
      rules,
      closeModal,
      submitForm,
    };
  },
});
