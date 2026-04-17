# Task 9 Implementation Summary: 精確對齊功能

## 實施日期
2025-01-07

## 任務概述
實施了 iframe 精確對齊功能，包括邊距調整控制和快速置中按鈕。

## 完成的子任務

### 9.1 添加邊距調整控制 ✅

**實施內容：**

1. **UI 組件更新** (`src/view/oco/gui/setting/Index.vue`)
   - 添加「啟用精確對齊模式」複選框
   - 添加四個獨立的邊距輸入框（上、下、左、右）
   - 每個輸入框限制範圍為 0-500px
   - 添加適當的 data-testid 屬性以便測試

2. **狀態管理** (`src/view/oco/gui/setting/main.js`)
   - 在 formState 中添加邊距相關狀態：
     - `enablePreciseAlignment`: 是否啟用精確對齊
     - `marginTop`: 上邊距
     - `marginRight`: 右邊距
     - `marginBottom`: 下邊距
     - `marginLeft`: 左邊距
   - 在 openEditModal 中載入已保存的邊距設定
   - 在 openAddModal 中重置邊距為 0
   - 在 computeFinalLink 中保存邊距到 JSON 配置

3. **預覽整合** (`src/components/oco/gui/setting/PreviewPanel.vue`)
   - 更新 PreviewPanel 以接收 margins 配置
   - 在計算 iframe 尺寸時使用自訂邊距
   - 即時反映邊距變化

4. **iframe 組件支援** (`src/components/oco/gui/iframe/main.js`)
   - 已經支援從配置中讀取 margins
   - 在計算 iframe 尺寸時應用邊距

**驗證的需求：**
- Requirements 7.1: 提供上、下、左、右邊距的獨立調整選項 ✅

---

### 9.2 實施快速置中按鈕 ✅

**實施內容：**

1. **UI 組件更新** (`src/view/oco/gui/setting/Index.vue`)
   - 添加三個快速置中按鈕：
     - 「水平置中」按鈕（帶 arrows-h 圖標）
     - 「垂直置中」按鈕（帶 arrows-v 圖標）
     - 「完全置中」按鈕（帶 crosshair 圖標，主要樣式）
   - 按鈕放置在邊距輸入框上方，方便快速操作

2. **置中邏輯實現** (`src/view/oco/gui/setting/main.js`)
   
   **handleHorizontalCenter():**
   - 測量當前佈局
   - 計算可用空間
   - 計算 iframe 尺寸
   - 計算水平居中邊距：`(可用寬度 - iframe 寬度) / 2`
   - 自動填入左右邊距
   - 顯示成功通知

   **handleVerticalCenter():**
   - 測量當前佈局
   - 計算可用空間
   - 計算 iframe 尺寸
   - 計算垂直居中邊距：`(可用高度 - iframe 高度) / 2`
   - 自動填入上下邊距
   - 顯示成功通知

   **handleFullCenter():**
   - 測量當前佈局
   - 計算可用空間
   - 計算 iframe 尺寸
   - 使用 SizeCalculator.calculateCenterMargins() 計算所有邊距
   - 自動填入所有四個邊距
   - 顯示成功通知，包含計算出的邊距值

3. **錯誤處理**
   - 所有置中函數都包含 try-catch 錯誤處理
   - 失敗時顯示友善的錯誤訊息
   - 記錄錯誤到 console 以便調試

**驗證的需求：**
- Requirements 7.3: 水平置中自動計算左右邊距 ✅
- Requirements 7.4: 垂直置中自動計算上下邊距 ✅
- Requirements 7.5: 完全置中同時套用水平和垂直置中 ✅

---

## 測試覆蓋

### 單元測試
創建了 `tests/unit/margin-centering.test.ts`，包含以下測試：

1. **水平置中邊距計算** ✅
   - 驗證左右邊距相等
   - 驗證總寬度不超出可用空間
   - Validates: Requirements 7.3

2. **垂直置中邊距計算** ✅
   - 驗證上下邊距相等
   - 驗證總高度不超出可用空間
   - Validates: Requirements 7.4

3. **完全置中邊距計算** ✅
   - 驗證所有邊距非負
   - 驗證左右邊距相等（水平置中）
   - 驗證上下邊距相等（垂直置中）
   - 驗證總尺寸不超出可用空間
   - Validates: Requirements 7.5

4. **獨立邊距調整** ✅
   - 驗證自訂邊距被正確應用
   - Validates: Requirements 7.1

5. **邊界情況處理** ✅
   - 測試可用空間小於內容尺寸的情況
   - 驗證邊距不會是負數

**測試結果：** 所有 5 個測試通過 ✅

---

## 技術實現細節

### 數據流

1. **用戶操作流程：**
   ```
   用戶啟用精確對齊 
   → 顯示邊距輸入框和快速置中按鈕
   → 用戶點擊快速置中按鈕或手動輸入邊距
   → 即時更新預覽
   → 用戶儲存設定
   → 邊距保存到資料庫（JSON 格式）
   ```

2. **載入流程：**
   ```
   打開編輯對話框
   → 從資料庫載入配置 JSON
   → 解析 margins 物件
   → 填入表單欄位
   → 如果有 margins，自動啟用精確對齊模式
   ```

3. **預覽流程：**
   ```
   用戶調整邊距
   → 傳遞 margins 到 PreviewPanel
   → PreviewPanel 使用 SizeCalculator 計算尺寸
   → 即時更新預覽顯示
   ```

### JSON 配置格式

```json
{
  "embedMode": "iframe",
  "urlMode": "select",
  "url": "http://192.168.1.100:2955/#/view?name=meter",
  "serverUrl": "http://192.168.1.100:2955",
  "iframeFit": "contain-center",
  "iframeHeightMode": "auto",
  "iframeHeightValue": 918,
  "margins": {
    "top": 10,
    "right": 20,
    "bottom": 10,
    "left": 20
  },
  "iframe": {
    "fit": "contain-center",
    "heightMode": "auto",
    "heightValue": 918
  }
}
```

### 關鍵算法

**水平置中計算：**
```javascript
const horizontalMargin = Math.max(0, Math.round((availableWidth - iframeWidth) / 2));
marginLeft = horizontalMargin;
marginRight = horizontalMargin;
```

**垂直置中計算：**
```javascript
const verticalMargin = Math.max(0, Math.round((availableHeight - iframeHeight) / 2));
marginTop = verticalMargin;
marginBottom = verticalMargin;
```

**完全置中計算：**
```javascript
const centerMargins = calculator.calculateCenterMargins(availableSpace, contentSize);
// centerMargins = {
//   top: (availableHeight - contentHeight) / 2,
//   right: (availableWidth - contentWidth) / 2,
//   bottom: (availableHeight - contentHeight) / 2,
//   left: (availableWidth - contentWidth) / 2
// }
```

---

## 用戶體驗改進

1. **簡化操作流程**
   - 用戶不需要手動計算邊距值
   - 一鍵即可實現完美置中
   - 支援獨立調整以滿足特殊需求

2. **即時反饋**
   - 調整邊距時預覽即時更新
   - 點擊置中按鈕後顯示成功通知
   - 通知中包含計算出的邊距值

3. **視覺化設計**
   - 使用圖標增強按鈕識別度
   - 「完全置中」使用主要樣式突出顯示
   - 邊距輸入框清晰標示方向

---

## 向後兼容性

- 舊配置（沒有 margins 欄位）自動使用預設值 0
- 不啟用精確對齊模式時，不保存 margins 到配置
- 現有的 iframe 顯示邏輯完全兼容

---

## 已知限制

1. 邊距範圍限制為 0-500px
2. 邊距計算基於當前測量的佈局，視窗大小改變後需要重新計算
3. 快速置中按鈕需要 DOM 元素存在才能正確測量

---

## 後續建議

1. 考慮添加「重置邊距」按鈕，一鍵清除所有邊距
2. 可以添加邊距預設值（例如：小邊距 5px、中邊距 10px、大邊距 20px）
3. 考慮添加「鎖定比例」功能，調整一個邊距時自動調整對應邊距

---

## 結論

Task 9「實施精確對齊功能」已完全實現，包括：
- ✅ 9.1 添加邊距調整控制
- ✅ 9.2 實施快速置中按鈕

所有功能都經過測試驗證，符合需求規格，並提供良好的用戶體驗。
