import dayjs from "dayjs";
dayjs.weekStart = 0;

// [Description("本日")]
//   ThisDay = 1,
//   [Description("昨日")]
//   LastDay = 2,
//   [Description("本週")]
//   ThisWeek = 3,
//   [Description("上週")]
//   LastWeek = 4,
//   [Description("本月")]
//   ThisMonth = 5,
//   [Description("上月")]
//   LastMonth = 6,
//   [Description("今年")]
//   ThisYear = 7,
//   [Description("去年")]
//   LastYear = 8
export const periodOptions = [
  {
    id: 1,
    name: "本日",
  },
  {
    id: 2,
    name: "昨日",
  },
  {
    id: 3,
    name: "本週",
  },
  {
    id: 4,
    name: "上週",
  },
  {
    id: 5,
    name: "本月",
  },
  {
    id: 6,
    name: "上月",
  },
  {
    id: 7,
    name: "今年",
  },
  {
    id: 8,
    name: "去年",
  },
];
export function usePeriodTime(period) {
  switch (period) {
    case 1:
      return {
        startTime: dayjs().format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs().add(1, "day").format("YYYY-MM-DD 00:00:00"),
        reportType: "daily",
      };

    case 2:
      return {
        startTime: dayjs().subtract(1, "day").format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs().format("YYYY-MM-DD 00:00:00"),
        reportType: "daily",
      };

    case 3:
      return {
        startTime: dayjs().startOf("week").format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs()
          .endOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00"),
        reportType: "monthly",
      };

    case 4:
      return {
        startTime: dayjs()
          .subtract(1, "week")
          .startOf("week")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs()
          .subtract(1, "week")
          .endOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00"),
        reportType: "monthly",
      };

    case 5:
      return {
        startTime: dayjs().startOf("month").format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs()
          .endOf("month")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00"),
        reportType: "monthly",
      };

    case 6:
      return {
        startTime: dayjs()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs()
          .subtract(1, "month")
          .endOf("month")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00"),
        reportType: "monthly",
      };

    case 7:
      return {
        startTime: dayjs().startOf("year").format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs()
          .endOf("year")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00"),
        reportType: "yearly",
      };

    case 8:
      return {
        startTime: dayjs()
          .subtract(1, "year")
          .startOf("year")
          .format("YYYY-MM-DD 00:00:00"),
        endTime: dayjs()
          .subtract(1, "year")
          .endOf("year")
          .add(1, "day")
          .format("YYYY-MM-DD 00:00:00"),
        reportType: "yearly",
      };
  }
}
