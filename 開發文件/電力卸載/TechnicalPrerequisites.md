# TechnicalPrerequisites（電力卸載）

## 後端提供需求
- API 端點（見 README 與 openapi.yaml）。
- 模式代碼對照（ModeCodeNamePairs）。
- 卸載區域之契約容量（供 % → kW 換算）。
- 卸載警報虛擬點清單（UnloadAlarmTagListInSystem）。
- 測點清單 /api/Tag/GetTagList，需含單位資訊（用於過濾 kW/mW）。
- （建議）於 GetElectricPowerUnloadStageGroupDetailList 回傳中，提供每個 Summary 目前的即時需量測點 Id 清單（例如 ElectricPowerConsumableTagIdList），供前端預載與「重設」回復參考。
- 即時狀況資料（GetElectricPowerUnloadStatusList）。
- 目前卸載地區清單端點：GET /api/ElectricPowerUnload/GetElectricPowerUnloadStageGroupDetailList（回傳 Detail.SummaryDetailList）。


## 前端環境
- 僅在卸載頁面域內導入新的 API 客戶端檔案；不改全域設定。
- （可選）Feature flag：VITE_UNLOAD_API=on 用於切換 demo ↔ API。
- 依賴 tags 模組 actions：tags/getAllTagsAndOptions 以載入 tagInitData（供需量測點選擇）。
- kW/mW 單位過濾於提交階段執行，候選清單不修改共用 TagFilter。
- 階段設備與值（StageTagModal）預載來源：GetElectricPowerUnloadStageGroupDetailList 回傳之 StageDetailList[x].TagList（含 TagId、UnloadValue、LoadValue、IntervalSecondsForLoad）。
- 雙欄式交互規則：開窗即預載至左欄；提供「重設」回復預載狀態；送出前需二次確認。

## 安全與權限

- 沿用現有 route-based r/c/u/d 權限；不新增其他權限點。
- 跨域（CORS）需允許當前前端來源調用上述端點。

## 文件/契約同步

- 後端更動端點或欄位時，需同步更新 openapi.yaml 與 README。
