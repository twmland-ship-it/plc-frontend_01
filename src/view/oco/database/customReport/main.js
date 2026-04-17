import { defineComponent, ref, computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { Main } from "../../styled";
import PeriodSelect from "@/components/oco/util/periodSelect/Index.vue";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    Main,
    PeriodSelect,
  },
  setup() {
    const { state, dispatch } = useStore();
    const loading = computed(() => state.database.loading);
    const reportList = ref([]);
    onMounted(async () => {
      try {
        const res = await dispatch("database/getCustomReportList");
        reportList.value = res;
      } catch (err) {
        alert(err);
      }
    });

    const formState = reactive({
      report: "",
      date: [dayjs().subtract(1, "day"), dayjs()],
    });

    const setDate = ({ startTime, endTime }) => {
      formState.date = [dayjs(startTime), dayjs(endTime)];
    };

    const exportReport = () => {
      const tar = reportList.value.find(
        (item) => item.fileName === formState.report
      );
      const params = {
        FileName: tar.fileName,
        ReportType: tar.reportType,
        From: dayjs(formState.date[0]).format("YYYY-MM-DD"),
        To: dayjs(formState.date[1]).format("YYYY-MM-DD"),
        TagQueryCondition: {
          TagIds: tar.tagIds.map((el) => el.id),
          ReplaceTagNames: tar.tagIds.reduce((obj, item) => {
            obj[item.id] = item.name;
            return obj;
          }, {}),
          TagStatisticMethods: tar.tagIds.reduce((obj, item) => {
            obj[item.id] = item.method;
            return obj;
          }, {}),
        },
      };

      dispatch("database/exportCustomReport", params);
    };

    return {
      exportReport,
      formState,
      loading,
      reportList,
      setDate,
    };
  },
});
