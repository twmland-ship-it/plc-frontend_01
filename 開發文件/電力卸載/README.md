# 電力卸載（前端整合說明，依文件）

僅處理「電力卸載」功能，嚴格依《電力加卸載頁面及API》文件，不擴充未載明能力；其他功能不受影響。

## 功能與端點
- 新增卸載區域：POST /api/ElectricPowerUnload/CreateElectricPowerUnloadSummary (multipart/form-data)
- 編輯卸載區域：POST /api/ElectricPowerUnload/EditElectricPowerUnloadSummary (multipart/form-data)
- 刪除卸載區域：POST /api/ElectricPowerUnload/DeleteElectricPowerUnloadSummary (multipart/form-data)
- 編輯即時需量測點集合：POST /api/ElectricPowerUnload/EditElectricPowerConsumableTagForUnload (multipart/form-data)
- 卸載階段（新增/編輯/刪除）：POST /api/ElectricPowerUnload/EditElectricPowerUnloadStageGroup (multipart/form-data)
  - ModifyMode：1=新增、3=編輯、4=刪除
- 階段設備與值：POST /api/ElectricPowerUnload/EditElectricPowerUnloadTag (application/json)
- 即時狀況：GET /api/ElectricPowerUnload/GetElectricPowerUnloadStatusList

- 目前卸載地區（含階段明細）：GET /api/ElectricPowerUnload/GetElectricPowerUnloadStageGroupDetailList

依賴（查詢/選單資料）：
- 測點清單：GET /api/Tag/GetTagList（僅用於本頁選擇；UI 應過濾單位為 kW / mW）
- 模式對照與資料結構參考：ElectricPowerUnload_GetElectricPowerUnloadStageGroupDetailList.json（文件提供）

## UI 整合重點
1. 區域列表：以文件資料結構載入（顯示 Name、ModeCode 對應名稱、階段數等）。
2. 新增/編輯區域：Name 必填；ModeCode 下拉；編輯時 Id 唯讀。
3. 刪除區域：確認後送出 Id。
4. 即時需量測點：左側已選（由明細預載）、右側候選（/Tag/GetTagList）；提交至 EditElectricPowerConsumableTagForUnload。
   - 預載：開啟時即依目前區域的既有設定預選（欄位以明細回傳為準，待後端確認對應欄位）。
   - 重設：一鍵回復到「預載」狀態。
   - 確定：點選後會顯示提示再送出。
   - 單位規則：右側候選清單已將非 kW / mW 的測點標示並禁用；為保險起見，提交時仍會再次過濾。
5. 卸載階段管理：
   - 新增/編輯/刪除均走 EditElectricPowerUnloadStageGroup（multipart/form-data）。
   - 編輯時 StageCode 唯讀。
   - 卸載需量 kW（UnloadULmt）在 UI 唯讀，以「契約容量 × %」換算顯示。
   - 警報點 UnloadAlarmTagId 由後端清單提供（虛擬點）。
6. 階段設備與值：EditElectricPowerUnloadTag（JSON）。雙欄式（左已選｜右候選）；預載 StageDetailList[x].TagList；提供「重設」及送出前二次確認。輸入 UnloadValue 時自動帶出 LoadValue（反向值）；可填 IntervalSecondsForLoad。
7. 即時狀況：輪詢 GetElectricPowerUnloadStatusList；階段=0 黑色，其餘紅色（依文件）。

## 請求/回應約定
- 多數維護端點 Content-Type= multipart/form-data；設備值設定 Content-Type= application/json。
- 回應信封：{ ReturnCode, Message, Detail }；ReturnCode=1 視為成功，其餘顯示 Message。

## 驗證規則（僅依文件）
- StageCode 僅 1/2/3；編輯畫面 StageCode 唯讀。
- ElectricPowerConsumableTagIdList 僅允許單位 kW/mW 的測點。
- UnloadULmt（kW）在 UI 唯讀，透過 % 與契約容量換算顯示；LoadLLmt 可填。
- LoadValue = UnloadValue 的反向值（文件說明）。

## 變更範圍與風險控管
- 僅變更「電力卸載」頁面與其私有 API 介面，不動其他模組與全域設定。
- 初期可保留 demoData 切換（僅開發/測試），穩定後移除。
- 不新增文件未列之功能與欄位；未知欄位一律與後端確認後再開發。

## OpenAPI
見同資料夾的 openapi.yaml（OpenAPI 3.0.3）。


## 前端整合進度（狀態紀錄）

- 已新增 API 客戶端：src/api/electricPowerUnload.js
  - 封裝端點：Create/Edit/Delete Summary、EditConsumableTags、EditStageGroup、EditStageTag、GetStatusList
  - Content-Type 自動處理：multipart/form-data 與 application/json 依規格送出
- 已於 Vuex 新增對應 actions（不影響既有 demo 流程）：
  - uninstall/createSummary({ Name, ModeCode })
  - uninstall/editSummary({ Id, Name, ModeCode })
  - uninstall/deleteSummary({ Id })
  - uninstall/setConsumableTags({ SummaryId, ElectricPowerConsumableTagIdList })
  - uninstall/editStageGroup({ ModifyMode, SummaryId, StageId, StageCode, StageName, UnloadULmt, LoadLLmt, UnloadAlarmTagId })
  - uninstall/editStageTag({ StageDetailId, SummaryId, TagList })
- 列表讀取：已改為呼叫 GET /api/ElectricPowerUnload/GetElectricPowerUnloadStageGroupDetailList（失敗時回退 demoData）。
- UI 已完成：
  - 空狀態（顯示「尚未設定卸載區域」＋「新增卸載區域」按鈕）
  - SummaryModal（新增/編輯 區域 Name、ModeCode）
  - ConsumableTagsDrawer（即時需量測點，提交時僅接受 kW / mW）
  - StageGroupModal（階段管理：ModifyMode 1/3/4；編輯時 StageCode 唯讀；UnloadULmt 只讀顯示）
  - StageTagModal（階段設備與值設定：JSON 送出；支援多列 TagId/UnloadValue/LoadValue/IntervalSecondsForLoad；預設自動以 UnloadValue 反向填入 LoadValue）
- 下一步：—

### 待確認

1) 卸載區域列表與明細查詢 API 路徑與參數
2) CreateElectricPowerUnloadSummary 成功回應是否於 Detail 帶回新 SummaryId
3) ModeCode 對照清單（ModeCodeNamePairs）的取得方式與路徑
