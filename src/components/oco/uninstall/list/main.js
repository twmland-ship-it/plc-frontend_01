import { defineComponent, computed, h } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";

const stageUnloadText = (row, stage) => {
  const s = row?.StageDetailList?.find((x) => Number(x?.Stage) === Number(stage));
  const unloadText = s?.UnloadULmtText ?? "-";
  if (unloadText === "-" || unloadText === "") return unloadText;
  const ratioText = s?.UnloadULmtRatioWithPercentageSignText ?? "";
  return ratioText ? `${unloadText} (${ratioText})` : unloadText;
};

const bySummaryNameAsc = (a, b) => {
  const aName = String(a?.SummaryName ?? "");
  const bName = String(b?.SummaryName ?? "");
  return aName.localeCompare(bName, "zh-Hant", {
    numeric: true,
    sensitivity: "base",
  });
};

const bySummaryIdAsc = (a, b) => {
  const aId = String(a?.SummaryId ?? "");
  const bId = String(b?.SummaryId ?? "");
  return aId.localeCompare(bId, "en", { numeric: true, sensitivity: "base" });
};

export default defineComponent({
  components: {
    DataTables,
  },
  setup() {
    const store = useStore();
    const { state, commit } = store;

    const fetching = computed(() => !!state.uninstall.fetching);
    const hasLoadedOnce = computed(() => !!state.uninstall.hasLoadedOnce);

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
        return;
      }

      // Some table versions may emit `undefined` on toggle; keep it two-state.
      commit(
        "uninstall/setNameSortOrder",
        nameSortOrder.value === "ascend" ? "descend" : "ascend"
      );
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
        sorter: true, // controlled/server-side sorting (we keep list sorted ourselves)
      },
      {
        title: "契約容量(kW)①",
        dataIndex: "ContractCapacityText",
        key: "ContractCapacityText",
        align: "right",
      },
      {
        title: "即時需量(kW)②",
        dataIndex: "CurrentDemandText",
        key: "CurrentDemandText",
        align: "right",
      },
      {
        title: () =>
          h("div", { style: "display:flex; flex-direction:column;" }, [
            h("div", { class: "uninstall-coltitle__line1" }, "即時需量比"),
            h("div", { class: "uninstall-coltitle__line2" }, "((②/①) * 100)%"),
          ]),
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

    const sortedTableData = computed(() => {
      const list = Array.isArray(state.uninstall.tableData)
        ? state.uninstall.tableData
        : [];

      const dir = nameSortOrder.value === "descend" ? -1 : 1;
      const sorted = list.slice().sort((a, b) => {
        const byName = bySummaryNameAsc(a, b);
        if (byName !== 0) return byName * dir;
        return bySummaryIdAsc(a, b) * dir;
      });

      return sorted.map((row) => ({
        ...row,
        key: row?.SummaryId ?? row?.SummaryName ?? String(Math.random()),
        Stage1: stageUnloadText(row, 1),
        Stage2: stageUnloadText(row, 2),
        Stage3: stageUnloadText(row, 3),
      }));
    });

    return {
      fetching,
      hasLoadedOnce,
      staleWarning,
      fatalErrorMessage,
      columns,
      tableData: sortedTableData,
      handleTableChange,
    };
  },
});

