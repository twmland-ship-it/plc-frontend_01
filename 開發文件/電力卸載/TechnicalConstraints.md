# TechnicalConstraints（電力卸載）

## 固定規則（依文件）
- ModifyMode：1=新增、3=編輯、4=刪除（EditElectricPowerUnloadStageGroup）。
- StageCode：僅 1/2/3；編輯畫面 StageCode 必須唯讀。
- Content-Type：
  - multipart/form-data（多數維護端點）。
  - application/json（EditElectricPowerUnloadTag）。
- 回應信封：ReturnCode==1 才視為成功；否則以 Message 呈現失敗原因。
- UnloadULmt（kW）唯讀，由「契約容量 × %」換算顯示（% 由操作者調整）。
- 允許的測點單位：kW / mW（即時需量計算用）。
- 即時需量測點畫面需提供「重設」回復到預載狀態，以及「確定」二次提示後才送出。
- 階段設備與值畫面需提供「重設」回復到預載狀態，以及「確定」二次提示後才送出。
- 設備值設定：LoadValue 應為 UnloadValue 的反向值。

## 不做的項目（避免超範圍）
- 不新增未在文件列出的 API 或查詢能力（如進階搜尋、分頁、批次匯入/出）。
- 不擴充驗證規則（除文件明載者）。
- 不更動其他模組或全域攔截器/元件邏輯。
- 不改共用 TagFilter 元件之選項來源與行為；kW/mW 過濾在本頁提交階段處理。

## 風險與因應
- 若後端未提供契約容量，則無法計算/顯示 UnloadULmt（kW）；UI 應停用相關輸入並提示。
- 測點單位缺失時，無法過濾 kW/mW；需後端補齊或改以後端過濾。
- 文件若僅提供 JSON 參考檔名而無實體查詢端點，需以後端最終提供為準後再接入。

