import { defineComponent, computed } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";

const stageUnloadText = (row, stage) => {
  const s = row?.StageDetailList?.find((x) => Number(x?.Stage) === Number(stage));
  return s?.UnloadULmtText ?? "-";
};

const bySummaryNameAsc = (a, b) => {
  const aName = String(a?.SummaryName ?? "");
  const bName = String(b?.SummaryName ?? "");
  return aName.localeCompare(bName, "zh-Hant", {
    numeric: true,
    sensitivity: "base",
  });
};

export default defineComponent({
  components: {
    DataTables,
  },
  setup() {
    const store = useStore();
    const { state, commit } = store;

    const loading = computed(() => state.uninstall.loading);
    const tableData = computed(() => {
      const list = Array.isArray(state.uninstall.tableData)
        ? state.uninstall.tableData
        : [];

      return list.map((row) => ({
        ...row,
        key: row?.SummaryId ?? row?.SummaryName ?? String(Math.random()),
        Stage1: stageUnloadText(row, 1),
        Stage2: stageUnloadText(row, 2),
        Stage3: stageUnloadText(row, 3),
      }));
    });

    const staleWarning = computed(() => !!state.uninstall.staleWarning);
    const fatalErrorMessage = computed(() =>
      state.uninstall.fatalError ? String(state.uninstall.fatalError) : ""
    );

    const nameSortOrder = computed(() => state.uninstall.nameSortOrder || "ascend");

    const handleTableChange = (_pagination, _filters, sorter) => {
      const s = Array.isArray(sorter) ? sorter[0] : sorter;
      if (s?.columnKey !== "SummaryName") return;
      const order = s?.order;
      if (order === "ascend" || order === "descend") {
        commit("uninstall/setNameSortOrder", order);
      }
    };

    const columns = computed(() => [
      {
        title: "名稱",
        dataIndex: "SummaryName",
        key: "SummaryName",
        columnKey: "SummaryName",
        align: "left",
        sortOrder: nameSortOrder.value,
        sortDirections: ["ascend", "descend"],
        sorter: (a, b) => bySummaryNameAsc(a, b),
      },
      {
        title: "契約容量",
        dataIndex: "ContractCapacityText",
        key: "ContractCapacityText",
        align: "right",
      },
      {
        title: "即時需量",
        dataIndex: "CurrentDemandText",
        key: "CurrentDemandText",
        align: "right",
      },
      {
        title: "即時需量比",
        dataIndex: "CurrentDemandAndContractCapacityRatioTextWithPercentageSign",
        key: "CurrentDemandAndContractCapacityRatioTextWithPercentageSign",
        align: "right",
      },
      {
        title: "卸載模式",
        dataIndex: "ModeText",
        key: "ModeText",
        align: "center",
      },
      {
        title: "卸載階段",
        dataIndex: "CurrentUnloadStage",
        key: "CurrentUnloadStage",
        align: "center",
      },
      {
        title: "各階段需量(kW)",
        key: "Stages",
        children: [
          { title: "1", dataIndex: "Stage1", key: "Stage1", align: "right" },
          { title: "2", dataIndex: "Stage2", key: "Stage2", align: "right" },
          { title: "3", dataIndex: "Stage3", key: "Stage3", align: "right" },
        ],
      },
    ]);

    return {
      loading,
      staleWarning,
      fatalErrorMessage,
      columns,
      tableData,
      handleTableChange,
    };
  },
});

