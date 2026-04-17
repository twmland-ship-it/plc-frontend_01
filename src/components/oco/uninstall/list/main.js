import { defineComponent, computed } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";
import { ActionSpan } from "./style.js";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  props: {
    delete: { type: Function, required: true },
    add: { type: Function, required: true },
    edit: { type: Function, required: true },
    consumable: { type: Function, required: false },
    stageGroup: { type: Function, required: false },
  },
  components: {
    DataTables,
  },
  setup(props) {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.uninstall.loading);
    const canManage = computed(() => permission.create || permission.update || permission.delete);
    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      { title: "模式", dataIndex: "mode", key: "mode" },
      { title: "階段數", dataIndex: "stages", key: "stages" },
      { title: "操作", dataIndex: "action", key: "action" },
    ];
    const tableData = computed(() =>
      state.uninstall.tableData.map((el) => {
        const name = el?.name ?? el?.Name ?? el?.Summary?.Name ?? "-";
        const id = el?.id ?? el?.Id ?? el?.Summary?.Id ?? "";
        const modeCode = el?.ModeCode ?? el?.Mode ?? el?.Summary?.ModeCode ?? el?.Summary?.Mode;
        const modeName = el?.ModeName ?? el?.ModeCodeName ?? el?.Summary?.ModeCodeName ?? modeCode ?? "-";
        const stages = (el?.StageDetailList?.length) ?? (el?.Summary?.StageDetailList?.length) ?? 0;
        return {
          name,
          mode: modeName,
          stages,
          action: (
            <ActionSpan>
              {canManage.value && permission.update && (
                <span onClick={() => props.edit({
                  Id: id,
                  Name: name,
                  Mode: el?.Mode ?? el?.ModeCode ?? el?.Summary?.Mode ?? el?.Summary?.ModeCode ?? null,
                  ContinuedSecond: el?.ContinuedSecond ?? el?.ContinueSeconds ?? el?.Summary?.ContinuedSecond ?? el?.Summary?.ContinueSeconds ?? 0,
                  IsLoad: el?.IsLoad ?? el?.Summary?.IsLoad ?? false,
                  ContractCapacity: el?.ContractCapacity ?? el?.Summary?.ContractCapacity ?? 1,
                })}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {canManage.value && permission.update && props.consumable && (
                <span
                  style="margin-left:8px"
                  onClick={() => {
                    const consumableIds = el?.ElectricPowerConsumableTagIdList || el?.Summary?.ElectricPowerConsumableTagIdList || [];
                    props.consumable({ Id: id, Name: name, selectedTagIds: consumableIds });
                  }}
                >
                  <span style="font-size:12px;color:#1890ff">需量測點</span>
                </span>
              )}
              {canManage.value && permission.update && props.stageGroup && (
                <span style="margin-left:8px" onClick={() => props.stageGroup({
                  SummaryId: id,
                  StageDetailList: el?.StageDetailList || el?.Summary?.StageDetailList || []
                })}>
                  <span style="font-size:12px;color:#1890ff">階段管理</span>
                </span>
              )}
              {canManage.value && permission.delete && (
                <span onClick={() => props.delete({ id, name })}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );

    const search = (e) => {
      dispatch("uninstall/filterTableData", e.target.value);
    };

    return { permission, loading, columns, tableData, search, canManage };
  },
});
