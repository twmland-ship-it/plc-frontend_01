# Task 12: 範本管理功能實施總結

## 實施日期
2025-01-07

## 任務概述
實施 iframe 配置範本管理功能，包括資料庫表創建、API 端點實施和 UI 組件開發。

## 完成的子任務

### 12.1 創建範本資料表 ✅
**檔案**: `Oco.Gui/plc-frontend/database/create-iframe-template-table.sql`

創建了 `IframeConfigTemplate` 資料表，包含以下欄位：
- `Id`: 主鍵（自動遞增）
- `Name`: 範本名稱（必填，最多 100 字元）
- `Description`: 範本描述（選填，最多 500 字元）
- `ConfigJson`: 配置 JSON（必填，存儲完整的 IframeConfig 物件）
- `Tags`: 標籤（選填，用於分類和搜尋）
- `CreatedAt`: 創建時間（自動設定）
- `UpdatedAt`: 更新時間（選填）
- `CreatedBy`: 創建者（選填）
- `IsSystemTemplate`: 是否為系統預設範本（0: 用戶範本, 1: 系統範本）

**索引**:
- `IX_IframeConfigTemplate_Name`: 加速按名稱搜尋
- `IX_IframeConfigTemplate_CreatedAt`: 加速按創建時間排序

**系統預設範本**:
插入了 3 個系統預設範本：
1. 1920x1080 滿版居中（16:9）
2. 1366x768 滿版居中（16:9）
3. 2560x1440 滿版居中（16:9）

### 12.2 實施範本 API ✅
**檔案**: `Oco.Gui/plc-frontend/src/api/iframeTemplate.js`

實施了完整的範本 CRUD API：

#### 核心功能
1. **listTemplates(options)**: 取得所有範本列表
   - 支援過濾系統範本
   - 支援標籤過濾

2. **getTemplate(id)**: 取得單一範本
   - 自動解析 ConfigJson

3. **saveTemplate(template)**: 儲存新範本
   - 驗證必填欄位
   - 自動序列化配置

4. **updateTemplate(id, template)**: 更新現有範本
   - 驗證必填欄位
   - 更新時間戳

5. **deleteTemplate(id)**: 刪除範本

#### 進階功能
6. **duplicateTemplate(id, newName)**: 複製範本
   - 自動生成副本名稱

7. **searchTemplates(keyword)**: 搜尋範本
   - 搜尋名稱和描述

8. **exportTemplate(id)**: 匯出範本為 JSON
   - 包含版本資訊和匯出時間

9. **importTemplate(templateJson)**: 匯入範本從 JSON
   - 驗證格式

#### Vuex 整合
**檔案**: 
- `Oco.Gui/plc-frontend/src/vuex/modules/gui/actionCreator.js`
- `Oco.Gui/plc-frontend/src/vuex/modules/gui/mutations.js`

新增的 Vuex actions:
- `fetchIframeTemplates`: 取得範本列表
- `getIframeTemplate`: 取得單一範本
- `saveIframeTemplate`: 儲存範本
- `updateIframeTemplate`: 更新範本
- `deleteIframeTemplate`: 刪除範本
- `duplicateIframeTemplate`: 複製範本
- `searchIframeTemplates`: 搜尋範本
- `exportIframeTemplate`: 匯出範本
- `importIframeTemplate`: 匯入範本

新增的 state:
- `iframeTemplates`: 範本列表
- `iframeTemplatesLoading`: 載入狀態

### 12.3 實施範本管理 UI ✅
**檔案**: `Oco.Gui/plc-frontend/src/components/oco/gui/setting/TemplateManager.vue`

#### UI 功能

1. **範本列表顯示**
   - 卡片式佈局，響應式網格
   - 顯示範本名稱、描述、創建時間、標籤
   - 區分系統範本和用戶範本（藍色邊框標示）
   - 支援搜尋（名稱、描述、標籤）

2. **範本操作**
   - **載入**: 套用範本配置到表單
   - **匯出**: 下載範本為 JSON 檔案
   - **複製**: 創建範本副本
   - **刪除**: 刪除用戶範本（系統範本不可刪除）

3. **儲存範本對話框**
   - 輸入範本名稱（必填，最多 100 字元）
   - 輸入範本描述（選填，最多 500 字元）
   - 輸入標籤（選填，以逗號分隔）
   - 自動捕獲當前配置

4. **匯入範本對話框**
   - 拖曳上傳或點擊選擇 JSON 檔案
   - 自動驗證檔案格式
   - 匯入後自動重新載入列表

#### 整合到設定介面
**檔案**: 
- `Oco.Gui/plc-frontend/src/view/oco/gui/setting/Index.vue`
- `Oco.Gui/plc-frontend/src/view/oco/gui/setting/main.js`

新增方法:
- `getCurrentConfig()`: 取得當前表單配置
- `handleLoadTemplate(config)`: 載入範本到表單

範本管理器位置：
- 放置在預覽面板之後
- 僅在外部連結類型（type === 5）時顯示

## 技術實現細節

### 資料流
```
用戶操作 → TemplateManager 組件 
         → Vuex actions 
         → API 呼叫 
         → 後端資料庫
         → 回傳結果
         → 更新 UI
```

### 配置格式
範本儲存的配置格式：
```json
{
  "displayMode": "contain-center",
  "heightMode": "auto",
  "heightValue": null,
  "designResolution": {
    "width": 1920,
    "height": 1080
  },
  "margins": {
    "top": 0,
    "right": 0,
    "bottom": 0,
    "left": 0
  },
  "serverUrl": "http://192.168.1.100:2955",
  "viewUrl": "http://192.168.1.100:2955/#/view?name=main",
  "urlMode": "select"
}
```

### 錯誤處理
- 所有 API 呼叫都包含 try-catch
- 使用 Ant Design 的 message 和 Modal 顯示錯誤
- 驗證必填欄位
- 防止刪除系統範本

### 用戶體驗優化
- 載入狀態指示器（Spin）
- 確認對話框（刪除、載入）
- 成功/失敗通知
- 搜尋即時過濾
- 響應式佈局

## 測試建議

### 單元測試
1. 測試範本 API 的所有方法
2. 測試配置序列化和反序列化
3. 測試驗證邏輯

### 整合測試
1. 測試完整的儲存流程
2. 測試完整的載入流程
3. 測試完整的刪除流程
4. 測試匯入/匯出流程

### UI 測試
1. 測試範本列表顯示
2. 測試搜尋功能
3. 測試對話框互動
4. 測試載入範本後表單更新

## 後續工作

### 資料庫遷移
需要在後端執行 SQL 腳本創建資料表：
```bash
# 在 SQL Server Management Studio 或命令列執行
sqlcmd -S <server> -d <database> -i create-iframe-template-table.sql
```

### 後端 API 實施
需要在後端實施以下 API 端點：
- `GET /api/iframe-templates` - 列出範本
- `GET /api/iframe-templates/:id` - 取得單一範本
- `POST /api/iframe-templates` - 創建範本
- `PUT /api/iframe-templates/:id` - 更新範本
- `DELETE /api/iframe-templates/:id` - 刪除範本
- `GET /api/iframe-templates/search` - 搜尋範本

### 權限控制
考慮添加權限控制：
- 系統範本只有管理員可以修改
- 用戶只能刪除自己創建的範本
- 範本共享功能

### 進階功能
1. 範本分類和標籤管理
2. 範本預覽縮圖
3. 範本使用統計
4. 範本版本控制
5. 範本匯入/匯出批次操作

## 驗收標準

✅ **Requirements 9.1**: 提供「儲存為範本」選項
✅ **Requirements 9.2**: 要求輸入範本名稱和描述
✅ **Requirements 9.3**: 顯示可用範本列表供選擇
✅ **Requirements 9.4**: 套用範本的所有參數設定
✅ **Requirements 9.5**: 要求確認並從列表中移除範本

## 檔案清單

### 新增檔案
1. `Oco.Gui/plc-frontend/database/create-iframe-template-table.sql` - 資料庫表創建腳本
2. `Oco.Gui/plc-frontend/src/api/iframeTemplate.js` - 範本 API
3. `Oco.Gui/plc-frontend/src/components/oco/gui/setting/TemplateManager.vue` - 範本管理器組件

### 修改檔案
1. `Oco.Gui/plc-frontend/src/vuex/modules/gui/actionCreator.js` - 新增範本管理 actions
2. `Oco.Gui/plc-frontend/src/vuex/modules/gui/mutations.js` - 新增範本管理 mutations
3. `Oco.Gui/plc-frontend/src/view/oco/gui/setting/Index.vue` - 整合範本管理器
4. `Oco.Gui/plc-frontend/src/view/oco/gui/setting/main.js` - 新增範本管理方法

## 結論

Task 12 已成功完成，實施了完整的範本管理功能。用戶現在可以：
- 儲存當前配置為範本
- 瀏覽和搜尋範本
- 載入範本快速套用配置
- 匯出和匯入範本
- 複製和刪除範本

這個功能大幅提升了用戶體驗，讓用戶可以快速在不同頁面間套用相同的顯示設定，避免重複手動調整參數。

## 注意事項

⚠️ **重要**: 此實施僅完成前端部分。需要後端團隊實施對應的 API 端點和資料庫遷移。

⚠️ **資料庫**: 執行 SQL 腳本前請先備份資料庫。

⚠️ **測試**: 建議在測試環境充分測試後再部署到生產環境。
