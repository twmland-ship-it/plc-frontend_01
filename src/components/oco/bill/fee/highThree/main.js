import dayjs from "dayjs";
import { defineComponent, reactive, ref, watch } from "vue";

export default defineComponent({
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const formState = reactive(props.value);

    const startSummerMonth = ref(formState.summerMonth.startDate.split("-")[0]);

    const startSummerDate = ref(formState.summerMonth.startDate.split("-")[1]);

    watch(
      () => [startSummerMonth, startSummerDate],
      () => {
        formState.summerMonth.startDate = `${startSummerMonth.value}-${startSummerDate.value}`;
      },
      {
        deep: true,
      }
    );

    const endSummerMonth = ref(formState.summerMonth.endDate.split("-")[0]);

    const endSummerDate = ref(formState.summerMonth.endDate.split("-")[1]);

    watch(
      () => [endSummerMonth.value, endSummerDate.value],
      () => {
        formState.summerMonth.endDate = `${endSummerMonth.value}-${endSummerDate.value}`;
      },
      {
        deep: true,
      }
    );

    const weekdayPeak = ref(
      formState.weekDay.filter((el) => el.PeakType === "Peak")
    );

    const addWeekdayPeak = () => {
      weekdayPeak.value.push({
        PeakType: "Peak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "Summer",
      });
    };

    const delWeekdayPeak = (index) => {
      weekdayPeak.value.splice(index, 1);
    };

    const weekdayHalfPeak = ref(
      formState.weekDay.filter(
        (el) => el.PeakType === "HalfPeak" && el.UseType === "Summer"
      )
    );

    const addWeekdayHalfPeak = () => {
      weekdayHalfPeak.value.push({
        PeakType: "HalfPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "Summer",
      });
    };

    const delWeekdayHalfPeak = (index) => {
      weekdayHalfPeak.value.splice(index, 1);
    };

    const weekdayNoSummerHalfPeak = ref(
      formState.weekDay.filter(
        (el) => el.PeakType === "HalfPeak" && el.UseType === "NonSummer"
      )
    );

    const addWeekdayNoSummerHalfPeak = () => {
      weekdayNoSummerHalfPeak.value.push({
        PeakType: "HalfPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "NonSummer",
      });
    };

    const delWeekdayNoSummerHalfPeak = (index) => {
      weekdayNoSummerHalfPeak.value.splice(index, 1);
    };

    const weekdayOffPeak = ref(
      formState.weekDay.filter(
        (el) => el.PeakType === "OffPeak" && el.UseType === "Summer"
      )
    );

    const addWeekdayOffPeak = () => {
      weekdayOffPeak.value.push({
        PeakType: "OffPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "Summer",
      });
    };

    const delWeekdayOffPeak = (index) => {
      weekdayOffPeak.value.splice(index, 1);
    };

    const weekdayNoSummerOffPeak = ref(
      formState.weekDay.filter(
        (el) => el.PeakType === "OffPeak" && el.UseType === "NonSummer"
      )
    );

    const addWeekdayNoSummerOffPeak = () => {
      weekdayNoSummerOffPeak.value.push({
        PeakType: "OffPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "NonSummer",
      });
    };

    const delWeekdayNoSummerOffPeak = (index) => {
      weekdayNoSummerOffPeak.value.splice(index, 1);
    };

    watch(
      () => [
        weekdayNoSummerOffPeak,
        weekdayNoSummerHalfPeak,
        weekdayOffPeak,
        weekdayHalfPeak,
        weekdayPeak,
      ],
      () => {
        formState.weekDay = [
          ...weekdayNoSummerOffPeak.value,
          ...weekdayNoSummerHalfPeak.value,
          ...weekdayOffPeak.value,
          ...weekdayHalfPeak.value,
          ...weekdayPeak.value,
        ];
      },
      {
        deep: true,
      }
    );

    const saturdayHalfPeak = ref(
      formState.saturday.filter(
        (el) => el.PeakType === "SaturdayHalfPeak" && el.UseType === "Summer"
      )
    );

    const addSaturdayHalfPeak = () => {
      saturdayHalfPeak.value.push({
        PeakType: "SaturdayHalfPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "Summer",
      });
    };

    const delSaturdayHalfPeak = (index) => {
      saturdayHalfPeak.value.splice(index, 1);
    };

    const saturdayNoSummerHalfPeak = ref(
      formState.saturday.filter(
        (el) => el.PeakType === "HalfPeak" && el.UseType === "NonSummer"
      )
    );

    const addSaturdayNoSummerHalfPeak = () => {
      saturdayNoSummerHalfPeak.value.push({
        PeakType: "HalfPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "NonSummer",
      });
    };

    const delSaturdayNoSummerHalfPeak = (index) => {
      saturdayNoSummerHalfPeak.value.splice(index, 1);
    };

    const saturdayOffPeak = ref(
      formState.saturday.filter(
        (el) => el.PeakType === "OffPeak" && el.UseType === "Summer"
      )
    );

    const addSaturdayOffPeak = () => {
      saturdayOffPeak.value.push({
        PeakType: "OffPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "Summer",
      });
    };

    const delSaturdayOffPeak = (index) => {
      saturdayOffPeak.value.splice(index, 1);
    };

    const saturdayNoSummerOffPeak = ref(
      formState.saturday.filter(
        (el) => el.PeakType === "OffPeak" && el.UseType === "NonSummer"
      )
    );

    const addSaturdayNoSummerOffPeak = () => {
      saturdayNoSummerOffPeak.value.push({
        PeakType: "OffPeak",
        StartTime: dayjs().startOf("day"),
        EndTime: dayjs().startOf("day"),
        UseType: "NonSummer",
      });
    };

    const delSaturdayNoSummerOffPeak = (index) => {
      saturdayNoSummerOffPeak.value.splice(index, 1);
    };

    watch(
      () => [
        saturdayNoSummerOffPeak,
        saturdayNoSummerHalfPeak,
        saturdayOffPeak,
        saturdayHalfPeak,
      ],
      () => {
        formState.saturday = [
          ...saturdayNoSummerOffPeak.value,
          ...saturdayNoSummerHalfPeak.value,
          ...saturdayOffPeak.value,
          ...saturdayHalfPeak.value,
        ];
      },
      {
        deep: true,
      }
    );

    watch(
      () => formState,
      (val) => {
        emit("update:value", val);
      },
      {
        deep: true,
      }
    );

    return {
      addSaturdayHalfPeak,
      addSaturdayNoSummerHalfPeak,
      addSaturdayNoSummerOffPeak,
      addSaturdayOffPeak,
      addWeekdayHalfPeak,
      addWeekdayNoSummerHalfPeak,
      addWeekdayNoSummerOffPeak,
      addWeekdayOffPeak,
      addWeekdayPeak,
      delSaturdayHalfPeak,
      delSaturdayNoSummerHalfPeak,
      delSaturdayNoSummerOffPeak,
      delSaturdayOffPeak,
      delWeekdayHalfPeak,
      delWeekdayNoSummerHalfPeak,
      delWeekdayNoSummerOffPeak,
      delWeekdayOffPeak,
      delWeekdayPeak,
      endSummerDate,
      endSummerMonth,
      formState,
      saturdayHalfPeak,
      saturdayNoSummerHalfPeak,
      saturdayNoSummerOffPeak,
      saturdayOffPeak,
      startSummerDate,
      startSummerMonth,
      weekdayHalfPeak,
      weekdayNoSummerHalfPeak,
      weekdayNoSummerOffPeak,
      weekdayOffPeak,
      weekdayPeak,
    };
  },
});
