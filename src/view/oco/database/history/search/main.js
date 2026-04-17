import { defineComponent, ref, computed, reactive } from "vue";
import { useStore } from "vuex";
import DataTables from "@/components/table/DataTable.vue";
import { Search } from "./style";
import { Modal } from "ant-design-vue";
import ModalTable from "@/components/oco/util/ModalTable.vue";
import TableChart from "@/components/oco/util/tableChart/TableChart.vue";
import HistoryFilter from "@/components/oco/history/filter/Index.vue";
import { useChartDataTransform, useChartOptions } from "@/composable/chart";

import dayjs from "dayjs";
export default defineComponent({
  components: {
    DataTables,
    ModalTable,
    TableChart,
    HistoryFilter,
    Search,
  },

  setup() {
    const { state, dispatch } = useStore();
    const loading = computed(() => state.database.loading);
    const collapseKey = ref("1");
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
      searchType: "統計報表",
      tags: [],
      chartType: "none",
      chartSummary: "Summation",
      reportType: "detail",
      compareType: 1,
      reportSummary: "Summation",
      date: [dayjs().startOf("day"), dayjs().add(1, "day").startOf("day")],
    });

    const updateFormState = (data) => {
      Object.assign(formState, data);
    };

    const submitable = computed(
      () => formState.tags.length !== 0 && formState.date
    );
    const searching = ref(false);

    const showTable = ref(false);

    const showSummary = ref(false);
    const data = ref([]);
    const summaryData = ref([]);
    const columns = ref([]);

    const chartData = reactive({
      type: null,
      title: null,
      labels: [],
      datasets: [],
      options: null,
    });
    const summaryType = useChartOptions();

    const getChartDatas = (
      tags,
      rawData,
      searchType,
      chartType,
      chartSummary,
      summaryDatas
    ) => {
      let allDatas = [];
      let labels = [];
      switch (chartType) {
        case "line":
          if (searchType === "統計報表") {
            labels = rawData.map((el) => el.time);
            tags.forEach((el) => {
              const tagDatas = {
                label: el.value || el.name,
                datas: rawData.map((data) => data[el.id]),
              };
              allDatas.push(tagDatas);
            });
          } else {
            labels = rawData[0].labels;
            tags.forEach((el, idx) => {
              const tagDatas = [
                {
                  label: el.value || el.name,
                  datas: [rawData[idx].startValue, rawData[idx].endValue],
                },
              ];
              allDatas.push(tagDatas);
            });
          }
          break;
        case "bar":
        case "pie":
          labels = tags.map((el) => el.value || el.name);
          if (searchType === "統計報表") {
            tags.forEach((el) => {
              const tagDatas = {
                label: summaryType.find((el) => el.value === chartSummary)
                  .label,
                datas: summaryDatas.find((item) => item.id === el.id)?.summary[
                  summaryType.find((el) => el.value === chartSummary).value
                ],
              };

              allDatas.push(tagDatas);
            });
          } else {
            allDatas = [
              { label: rawData[0].labels[0], datas: rawData[0].startValue },
              { label: rawData[0].labels[1], datas: rawData[0].endValue },
            ];
          }
          break;
        default:
          break;
      }

      return { allDatas, labels };
    };

    const submit = async () => {
      try {
        searching.value = true;
        await dispatch("database/getHistoryData", formState);
        if (formState.searchType === "統計報表") {
          const { rowdata, rowColumns } = generateStatisticsReport();
          columns.value = rowColumns;
          data.value = rowdata;
          summaryData.value = generateStatisticsSummary();
          showSummary.value = true;
        } else {
          data.value = generateCompareReport();
          showSummary.value = false;
        }

        if (formState.chartType !== "none") {
          const { allDatas, labels } = getChartDatas(
            formState.tags,
            data.value,
            formState.searchType,
            formState.chartType,
            formState.chartSummary,
            summaryData.value
          );
          const { options, datasets } = useChartDataTransform(
            allDatas,
            formState.chartType
          );
          chartData.labels = labels;
          chartData.datasets = datasets;
          chartData.options = options;
        }
        chartData.type = formState.chartType;
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

    const exportModal = ref(false);
    const exportFormState = reactive({
      fileName: "",
      importFile: null,
      worksheetName: "",
    });

    const onImportFileChange = (file) => {
      file.fileList.filter((x) => (x.status = "done"));
    };

    const fileUpload = async (info) => {
      let file = info.file;
      if (!file) return;
      exportFormState.importFile = file;
    };

    const openExportModal = () => {
      exportFormState.fileName = dayjs().format("YYYYMMDDHHmmss");
      exportFormState.worksheetName = "";
      exportFormState.importFile = null;
      exportModal.value = true;
    };

    const closeExportModal = () => {
      exportModal.value = false;
    };

    const exportFile = async () => {
      try {
        await dispatch("database/exportHistoryData", {
          data: data.value,
          columns: columns.value,
          fileName: exportFormState.fileName,
          worksheetName: exportFormState.worksheetName,
          importFile: exportFormState.importFile,
        });
        exportModal.value = false;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const generateStatisticsReport = () => {
      const tagColumn = formState.tags.map((el) => ({
        title: el.value || el.name,
        dataIndex: el.id,
        key: el.id,
        // width: 100,
      }));

      const rowColumns = [
        {
          title: "時間",
          dataIndex: "time",
          key: "time",
          width: "180px",
          fixed: "left",
        },
        ...tagColumn,
      ];

      const res = state.database.historyTableData.Tags.reduce(
        (result, item) => {
          item.Data.forEach((detail) => {
            let displayTime;
            if (formState.reportType === "yearly") {
              displayTime = dayjs(detail.Time).format("YYYY-MM");
            } else if (formState.reportType === "monthly") {
              displayTime = dayjs(detail.Time).format("YYYY-MM-DD");
            } else if (formState.reportType === "daily") {
              displayTime = dayjs(detail.Time).format("YYYY-MM-DD HH");
            } else {
              displayTime = dayjs(detail.Time).format("YYYY-MM-DD HH:mm:ss");
            }
            const existingItem = result.find(
              (resultItem) => resultItem.time === displayTime
            );

            if (existingItem) {
              existingItem[item.TagId] = detail.Value;
            } else {
              const newItem = {
                time: displayTime,
                [item.TagId]: detail.Value,
              };
              result.push(newItem);
            }
          });

          return result;
        },
        []
      );
      res.sort((a, b) => new Date(a.time) - new Date(b.time));
      return { rowdata: res, rowColumns };
    };

    const generateStatisticsSummary = () => {
      return state.database.historyTableData.Tags.map((el) => ({
        id: el.TagId,
        summary: el.Summary,
      }));
    };

    const generateCompareReport = () => {
      columns.value = [
        {
          title: "名稱",
          dataIndex: "name",
          key: "name",
          fixed: "left",
          width: 300,
        },
        ...state.database.historyTableData.map((el) => ({
          title: el.Time,
          dataIndex: el.Time,
          key: el.Time,
        })),
      ];
      const res = state.database.historyTableData.reduce((result, item) => {
        item.Detail.forEach((detail) => {
          const existingItem = result.find(
            (resultItem) => resultItem.TagId === detail.TagId
          );

          if (existingItem) {
            existingItem[item.Time] = detail.Value;
          } else {
            const newItem = {
              TagId: detail.TagId,
              name:
                formState.tags.find((el) => el.id === detail.TagId).value ||
                formState.tags.find((el) => el.id === detail.TagId).name,
              [item.Time]: detail.Value,
            };
            result.push(newItem);
          }
        });

        return result;
      }, []);

      return res;
    };

    const getTotal = (id) => {
      return state.database.historyTableData.Tags.find((el) => el.TagId === id)
        ?.Summary.Summation;
    };

    const getAverage = (id) => {
      return state.database.historyTableData.Tags.find((el) => el.TagId === id)
        ?.Summary.Average;
    };

    const getMaximum = (id) => {
      return state.database.historyTableData.Tags.find((el) => el.TagId === id)
        ?.Summary.Maximum;
    };

    const getMinimum = (id) => {
      return state.database.historyTableData.Tags.find((el) => el.TagId === id)
        ?.Summary.Minimum;
    };

    const search = (e) => {
      dispatch("database/filterDatabaseHistoryTable", e.target.value);
    };

    const detailModal = ref();
    const detailModalTitle = ref("");
    const detailTableData = ref([]);

    const closeDetailModal = () => {
      detailModal.value = false;
    };

    const addSearchModal = ref(false);
    const addSearchFormState = reactive({
      name: "",
    });

    const openAddSearchModal = () => {
      addSearchModal.value = true;
    };
    const closeAddSearchModal = () => {
      addSearchModal.value = false;
    };

    const addSearch = async () => {
      try {
        let newObj = Object.assign({}, formState);
        Object.assign(newObj, addSearchFormState);
        delete newObj.date;
        await dispatch("database/addSearch", JSON.stringify(newObj));
        addSearchModal.value = false;
        Modal.success({
          title: "新增成功",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    return {
      state,
      collapseKey,
      labelCol,
      wrapperCol,
      formState,
      updateFormState,
      submitable,
      searching,
      showTable,
      showSummary,
      data,
      loading,
      columns,
      chartData,
      getTotal,
      getAverage,
      getMaximum,
      getMinimum,
      submit,
      exportModal,
      exportFormState,
      fileUpload,
      openExportModal,
      closeExportModal,
      exportFile,
      search,
      detailModal,
      detailModalTitle,
      detailTableData,
      closeDetailModal,
      addSearchModal,
      addSearchFormState,
      openAddSearchModal,
      onImportFileChange,
      closeAddSearchModal,
      addSearch,
    };
  },
});
