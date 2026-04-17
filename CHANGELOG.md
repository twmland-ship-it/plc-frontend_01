# 版本更新記錄

## v2.2.29 (2024-09-04 10:30)

### 🆕 新功能
- **電費計算 - 低壓非時間電價**
  - 新增年月選擇功能：新增項目時先選擇電價實施年月
  - 新增臨時用電倍數設定欄位
  - 移除元件內的年月選擇，改由主頁面統一管理
  - 完整的 API 整合 (`/electricity-rate/power-supply/0/segment/0/details`)

### 🔧 技術改進
- 低壓非時間電價元件改為受控元件 (v-model)
- 新增專用的 Vuex actions (`addLowVoltageNonTimeFee`, `editLowVoltageNonTimeFee`)
- 新增年月選擇 Modal 介面
- 完整的資料格式轉換和 API 請求結構

### 📋 API 更新
- 新增 `GET /electricity-rate/power-supply/0/segment/0/time-settings` 支援
- 完整的 POST 請求格式，包含 DetailItems 夏月/非夏月資料
- 支援 TemporaryUsageMultiplier 臨時用電倍數參數

### 📚 文檔更新
- 更新 OpenAPI 3.0 規格文檔
- 更新 README.md 功能說明
- 更新開發規則文檔 (project-rules.md)
- 新增版本修改記錄

### 🎯 使用者體驗
- 簡化電價設定流程：年月選擇 → 詳細設定
- 清楚的介面標示和備註說明
- 響應式設計，支援不同螢幕尺寸

---

## v2.2.28 (2024-09-04 09:00)

### 🔧 基礎功能
- 低壓非時間電價基礎元件實作
- 夏月期間設定功能
- 基本電費和流動電費輸入介面

---

**發布時間**: 2024-09-04 10:30  
**建置環境**: Node.js 16+, Vue 3, Ant Design Vue  
**部署狀態**: 生產就緒  
**測試狀態**: 功能測試完成
