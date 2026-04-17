# project-rules（電力卸載）

僅針對「電力卸載」頁面，落實下列規則；其他功能不得受影響。

## 範圍與隔離
- 只改動卸載頁面域內檔案與其專屬 API 客戶端／Store（namespaced）。
- 不改全域攔截器、共用元件邏輯；必要時以本頁內部過濾（例如 Tag 單位過濾）。
- 可用 feature flag 在本頁切換 demoData ↔ API（開發/測試用），穩定後清除 demo。

## API 與資料契約
- 僅呼叫文件列出的端點；不新增未載明能力。
- Content-Type：
  - multipart/form-data：Create/Edit/Delete 區域、EditConsumableTagForUnload、EditElectricPowerUnloadStageGroup。
  - application/json：EditElectricPowerUnloadTag。
- 回應判斷：ReturnCode==1 視為成功；否則顯示 Message。

- 列表查詢：GET /api/ElectricPowerUnload/GetElectricPowerUnloadStageGroupDetailList；若 SummaryDetailList 為空，前端顯示空狀態與新增按鈕。

## UI/資料規則
- StageCode 枚舉 1/2/3；編輯畫面 StageCode 唯讀。
- 新增/編輯/刪除階段使用 ModifyMode：1/3/4。
- 卸載需量 kW（UnloadULmt）UI 唯讀，以「契約容量 × %」換算顯示。
- ElectricPowerConsumableTagIdList 僅接受單位 kW/mW 的測點；UI 於候選清單禁用非 kW/mW，提交階段再二次過濾。
- 設備值設定：LoadValue 應為 UnloadValue 的反向值（依文件）。
- 即時需量測點、階段設備與值採「雙欄式」交互（左：已選｜右：候選）。
- 所有彈窗統一提供「取消 / 重設 / 確定」操作；為避免 footer 插槽差異，按鈕於內容底部顯示。


## 錯誤處理
- 顯示後端 Message；勿自行包裝未載明的錯誤碼。
- 網路/逾時：以一般錯誤提示，並保持 UI 狀態可回復。

## 驗收標準
- 現有 UI 動線不變；資料來源改為 API 後仍可完成文件定義之操作。
- 不出現文件未允許的輸入欄位或操作按鈕。
- 開發完成應更新本文件與 README、Technical* 檔案的對應變更。

