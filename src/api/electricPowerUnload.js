import { DataService } from "@/config/dataService/dataService";

function toFormData(obj) {
  const fd = new FormData();
  if (!obj) return fd;
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach((item) => fd.append(k, item));
    } else {
      fd.append(k, v);
    }
  });
  return fd;
}

export const ElectricPowerUnloadAPI = {
  // Summary (區域) CRUD
  createSummary: ({ Name, Mode, ContinuedSecond, IsLoad, ContractCapacity }) =>
    DataService.post(
      "/api/ElectricPowerUnload/CreateElectricPowerUnloadSummary",
      toFormData({ Name, Mode, ContinuedSecond, IsLoad, ContractCapacity })
    ),

  editSummary: ({ Id, Name, Mode, ContinuedSecond, IsLoad, ContractCapacity }) =>
    DataService.post(
      "/api/ElectricPowerUnload/EditElectricPowerUnloadSummary",
      toFormData({ Id, Name, Mode, ContinuedSecond, IsLoad, ContractCapacity })
    ),

  deleteSummary: ({ Id }) =>
    DataService.post(
      "/api/ElectricPowerUnload/DeleteElectricPowerUnloadSummary",
      toFormData({ Id })
    ),

  // 目前卸載地區（含階段明細）
  getSummaryDetailList: () =>
    DataService.get("/api/ElectricPowerUnload/GetElectricPowerUnloadStageGroupDetailList"),

  // 即時需量測點設定
  editConsumableTags: ({ SummaryId, ElectricPowerConsumableTagIdList }) =>
    DataService.post(
      "/api/ElectricPowerUnload/EditElectricPowerConsumableTagForUnload",
      toFormData({ SummaryId, ElectricPowerConsumableTagIdList })
    ),

  // 卸載階段（新增/編輯/刪除）
  editStageGroup: ({
    ModifyMode, // 1=create, 3=edit, 4=delete
    SummaryId,
    StageId, // for edit/delete
    StageCode, // 1|2|3
    StageName,
    UnloadULmt,
    LoadLLmt,
    UnloadAlarmTagId,
  }) =>
    DataService.post(
      "/api/ElectricPowerUnload/EditElectricPowerUnloadStageGroup",
      toFormData({
        ModifyMode,
        SummaryId,
        StageId,
        StageCode,
        StageName,
        UnloadULmt,
        LoadLLmt,
        UnloadAlarmTagId,
      })
    ),

  // 階段設備與值設定（JSON）
  editStageTag: ({ StageDetailId, SummaryId, TagList }) =>
    DataService.post(
      "/api/ElectricPowerUnload/EditElectricPowerUnloadTag",
      { StageDetailId, SummaryId, TagList },
      { "Content-Type": "application/json" }
    ),

  // 即時狀況
  getStatusList: () => DataService.get("/api/ElectricPowerUnload/GetElectricPowerUnloadStatusList"),
};
