# iframe 自動適應功能 - 故障排除指南

## 📋 目錄

1. [快速診斷](#快速診斷)
2. [常見問題](#常見問題)
3. [進階診斷](#進階診斷)
4. [錯誤訊息](#錯誤訊息)
5. [效能問題](#效能問題)
6. [聯絡支援](#聯絡支援)

---

## 快速診斷

### 診斷流程圖

```
開始
  ↓
iframe 是否顯示？
  ├─ 否 → 檢查伺服器連線 → 問題 1
  └─ 是 ↓
內容是否完整？
  ├─ 否 → 檢查尺寸設定 → 問題 2
  └─ 是 ↓
比例是否正確？
  ├─ 否 → 檢查顯示模式 → 問題 3
  └─ 是 ↓
位置是否居中？
  ├─ 否 → 檢查對齊設定 → 問題 4
  └─ 是 ↓
完成！
```

### 快速檢查清單

在開始詳細診斷前，請先檢查：

- [ ] OCOGUI 伺服器是否正在運行
- [ ] 網址設定是否正確
- [ ] 瀏覽器縮放比例是否為 100%
- [ ] 是否已清除瀏覽器快取
- [ ] 配置是否已正確儲存

---

## 常見問題

### 問題 1：iframe 完全不顯示

#### 症狀
- 只看到空白區域
- 或顯示「無法載入內容」錯誤
- 或顯示載入中但一直不出現

#### 可能原因
1. OCOGUI 伺服器未運行
2. 網址設定錯誤
3. 網路連線問題
4. 瀏覽器阻擋 iframe


#### 診斷步驟

**步驟 1：檢查 OCOGUI 伺服器**

```bash
# 檢查伺服器是否運行
# 在瀏覽器中訪問：
http://localhost:2955

# 或使用 curl 測試：
curl http://localhost:2955
```

**預期結果：** 應該看到 OCOGUI 的登入頁面或主頁

**如果失敗：**
- 啟動 OCOGUI 伺服器
- 檢查伺服器設定檔
- 確認端口 2955 未被佔用

**步驟 2：檢查網址設定**

在設定介面中確認：
```
OCOGUI 伺服器：http://localhost:2955
OCOGUI 視圖：NTC_SMB meter_4PB_4F
```

**常見錯誤：**
- ❌ `http://localhost:2955/` (多了斜線)
- ❌ `localhost:2955` (缺少 http://)
- ❌ 視圖名稱拼寫錯誤

**步驟 3：檢查瀏覽器 Console**

1. 按 F12 開啟開發者工具
2. 切換到 Console 標籤
3. 查看是否有錯誤訊息

**常見錯誤訊息：**
```
ERR_CONNECTION_REFUSED
→ 伺服器未運行

Mixed Content
→ HTTPS 頁面載入 HTTP iframe

CORS Error
→ 跨域問題
```

#### 解決方案

**方案 A：重啟伺服器**
1. 停止 OCOGUI 伺服器
2. 等待 5 秒
3. 重新啟動伺服器
4. 重新整理頁面

**方案 B：檢查防火牆**
1. 確認防火牆未阻擋端口 2955
2. 暫時關閉防火牆測試
3. 如果可以顯示，則添加防火牆規則

**方案 C：使用 IP 位址**
```
改用 IP 位址代替 localhost：
http://192.168.1.100:2955
```

---

### 問題 2：內容被裁切

#### 症狀
- iframe 底部內容看不到
- 右側內容被切掉
- 出現捲軸但無法捲動

#### 可能原因
1. 高度值設定過大
2. 容器有隱藏的 padding
3. 瀏覽器縮放不是 100%

#### 診斷步驟

**步驟 1：檢查瀏覽器縮放**
```
按 Ctrl+0 重置縮放到 100%
```

**步驟 2：測量實際可用空間**

在瀏覽器 Console 中執行：
```javascript
console.log('視窗尺寸:', window.innerWidth, 'x', window.innerHeight);
console.log('Content 區域:', document.querySelector('.ant-layout-content')?.getBoundingClientRect());
```

**步驟 3：比較設定值**
```
可用高度：918px
設定高度：918px
→ 剛好，沒有問題

可用高度：918px
設定高度：1000px
→ 過大，需要調整
```

#### 解決方案

**方案 A：降低高度值**
```
當前高度：918
建議改為：868 (減少 50px 作為安全邊距)
```

**方案 B：使用一鍵最佳化**
1. 點擊「一鍵最佳化」按鈕
2. 系統會自動計算安全值
3. 儲存新配置

**方案 C：使用 vh 模式**
```
高度模式：視窗 vh
高度值：85
→ 自動適應，留 15% 安全邊距
```

---

### 問題 3：內容變形

#### 症狀
- 內容被拉伸或壓縮
- 圓形變成橢圓形
- 文字看起來很奇怪

#### 可能原因
1. 使用了「拉伸滿版」模式
2. 設計比例與顯示比例不符
3. iframe 內部有強制寬高的 CSS

#### 診斷步驟

**步驟 1：檢查顯示模式**
```
當前設定：拉伸滿版
→ 這會導致變形

應該改為：等比例置中（建議）
```

**步驟 2：檢查比例**
```javascript
// 在 Console 中執行
const width = 1632;
const height = 918;
const ratio = width / height;
console.log('當前比例:', ratio);
console.log('16:9 比例:', 16/9);
console.log('差異:', Math.abs(ratio - 16/9));
```

**預期結果：** 差異應該小於 0.01

#### 解決方案

**方案 A：改用等比例置中**
```
顯示模式：等比例置中（建議）
→ 保持 16:9 比例，不變形
```

**方案 B：調整設計解析度**
```
如果設計不是 16:9，需要：
1. 選擇「自訂解析度」
2. 輸入實際設計的寬度和高度
3. 系統會自動計算正確比例
```

---

### 問題 4：位置不居中

#### 症狀
- iframe 偏左或偏右
- iframe 偏上或偏下
- 位置不在紅色框框中央

#### 可能原因
1. 邊距設定不正確
2. 容器有額外的 padding
3. CSS 衝突

#### 診斷步驟

**步驟 1：檢查邊距設定**
```
當前邊距：
  上：0
  下：0
  左：100  ← 不對稱
  右：0

應該是：
  上：0
  下：0
  左：20
  右：20
```

**步驟 2：使用快速置中**
1. 點擊「完全置中」按鈕
2. 系統會自動計算對稱邊距
3. 查看預覽效果

#### 解決方案

**方案 A：使用快速置中按鈕**
- 水平置中：自動計算左右邊距
- 垂直置中：自動計算上下邊距
- 完全置中：同時水平和垂直置中

**方案 B：手動設定對稱邊距**
```
計算方法：
可用寬度：1672px
iframe 寬度：1632px
剩餘空間：40px
左右邊距：各 20px
```

---

### 問題 5：Sidebar 切換無反應

#### 症狀
- 收合 Sidebar 後 iframe 沒有變化
- 或變化不符合預期

#### 說明

這通常是**正常現象**！

**原因：**
```
當高度是限制因素時：
  Sidebar 展開：可用寬度 1672px → iframe 1632px
  Sidebar 收合：可用寬度 1808px → iframe 仍 1632px

因為高度限制，寬度無法增加
只是左右留白增加，內容保持居中
```

#### 如果確實需要動態調整

需要實施響應式功能，參考開發者文件。

---

### 問題 6：預覽與實際不符

#### 症狀
- 預覽看起來正常
- 實際顯示有問題

#### 可能原因
1. 快取問題
2. 配置未正確儲存
3. 瀏覽器版本過舊

#### 解決方案

**方案 A：清除快取**
```
1. 按 Ctrl+Shift+Delete
2. 選擇「快取的圖片和檔案」
3. 點擊「清除資料」
4. 或直接按 Ctrl+F5 強制重新整理
```

**方案 B：確認儲存**
```
1. 檢查是否點擊「儲存」按鈕
2. 查看是否有「儲存成功」提示
3. 重新載入頁面確認
```

**方案 C：更新瀏覽器**
```
確保使用最新版本：
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+
```

---

## 進階診斷

### 使用瀏覽器開發者工具

#### 檢查元素尺寸

1. 按 F12 開啟開發者工具
2. 點擊「Elements」標籤
3. 找到 iframe 元素
4. 查看 Computed 樣式

**檢查項目：**
```
width: 1632px ✓
height: 918px ✓
margin: 0 auto ✓
display: block ✓
```

#### 檢查網路請求

1. 切換到「Network」標籤
2. 重新整理頁面
3. 查看 iframe 的請求狀態

**正常狀態：**
```
Status: 200 OK
Type: document
Size: 正常大小
Time: < 1s
```

**異常狀態：**
```
Status: 404 Not Found → 網址錯誤
Status: 500 Server Error → 伺服器問題
Status: (failed) → 連線失敗
```

#### 檢查 Console 錯誤

常見錯誤及解決方案：

**錯誤 1：Mixed Content**
```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure frame 'http://...'.

解決方案：
- 將 OCOGUI 伺服器改用 HTTPS
- 或在 HTTP 環境下使用
```

**錯誤 2：CORS**
```
Access to XMLHttpRequest has been blocked by CORS policy

解決方案：
- 這通常不影響 iframe 顯示
- 如果影響，需要設定 OCOGUI 伺服器的 CORS
```

**錯誤 3：Refused to display**
```
Refused to display '...' in a frame because it set 'X-Frame-Options' to 'deny'.

解決方案：
- 需要修改 OCOGUI 伺服器的 X-Frame-Options 設定
- 改為 'SAMEORIGIN' 或移除該 header
```

### 測量工具診斷

使用內建的測量工具進行診斷：

```javascript
// 在 Console 中執行完整診斷
(function() {
  console.log('%c=== iframe 診斷報告 ===', 'color: blue; font-size: 16px; font-weight: bold');
  
  // 1. 視窗資訊
  console.log('%c1. 視窗資訊', 'color: green; font-weight: bold');
  console.log('  寬度:', window.innerWidth, 'px');
  console.log('  高度:', window.innerHeight, 'px');
  console.log('  縮放:', Math.round(window.devicePixelRatio * 100), '%');
  
  // 2. Sidebar 資訊
  console.log('%c2. Sidebar 資訊', 'color: green; font-weight: bold');
  const sidebar = document.querySelector('.ant-layout-sider');
  if (sidebar) {
    const rect = sidebar.getBoundingClientRect();
    console.log('  寬度:', rect.width, 'px');
    console.log('  狀態:', sidebar.classList.contains('ant-layout-sider-collapsed') ? '收合' : '展開');
  } else {
    console.log('  ❌ 未找到 Sidebar');
  }
  
  // 3. Content 資訊
  console.log('%c3. Content 區域', 'color: green; font-weight: bold');
  const content = document.querySelector('.ant-layout-content');
  if (content) {
    const rect = content.getBoundingClientRect();
    const styles = window.getComputedStyle(content);
    console.log('  寬度:', rect.width, 'px');
    console.log('  高度:', rect.height, 'px');
    console.log('  Padding:', {
      top: styles.paddingTop,
      right: styles.paddingRight,
      bottom: styles.paddingBottom,
      left: styles.paddingLeft
    });
  } else {
    console.log('  ❌ 未找到 Content');
  }
  
  // 4. iframe 資訊
  console.log('%c4. iframe 資訊', 'color: green; font-weight: bold');
  const iframe = document.querySelector('iframe');
  if (iframe) {
    const rect = iframe.getBoundingClientRect();
    const styles = window.getComputedStyle(iframe);
    console.log('  寬度:', rect.width, 'px');
    console.log('  高度:', rect.height, 'px');
    console.log('  顯示:', styles.display);
    console.log('  位置:', {
      top: rect.top,
      left: rect.left
    });
  } else {
    console.log('  ❌ 未找到 iframe');
  }
  
  // 5. 計算建議
  console.log('%c5. 建議配置', 'color: red; font-weight: bold');
  if (content && sidebar) {
    const sidebarWidth = sidebar.getBoundingClientRect().width;
    const contentRect = content.getBoundingClientRect();
    const contentStyles = window.getComputedStyle(content);
    
    const availableWidth = window.innerWidth - sidebarWidth - 
                          parseInt(contentStyles.paddingLeft) - 
                          parseInt(contentStyles.paddingRight);
    const availableHeight = contentRect.height - 
                           parseInt(contentStyles.paddingTop) - 
                           parseInt(contentStyles.paddingBottom);
    
    const ratio = 16 / 9;
    const byWidth = { width: availableWidth, height: availableWidth / ratio };
    const byHeight = { width: availableHeight * ratio, height: availableHeight };
    const optimal = byWidth.height <= availableHeight ? byWidth : byHeight;
    
    console.log('  可用寬度:', Math.floor(availableWidth), 'px');
    console.log('  可用高度:', Math.floor(availableHeight), 'px');
    console.log('  推薦尺寸:', Math.floor(optimal.width), 'x', Math.floor(optimal.height), 'px');
    console.log('  適應模式:', byWidth.height <= availableHeight ? '以寬度為基準' : '以高度為基準');
  }
  
  console.log('%c=== 診斷完成 ===', 'color: blue; font-size: 16px; font-weight: bold');
})();
```

---

## 錯誤訊息

### 前端錯誤訊息

#### "無法載入內容"

**完整訊息：**
```
無法載入內容
載入失敗，請檢查網址和網路連線
```

**原因：**
- OCOGUI 伺服器未運行
- 網址錯誤
- 網路連線問題

**解決方案：**
1. 檢查 OCOGUI 伺服器狀態
2. 驗證網址設定
3. 測試網路連線

#### "配置驗證失敗"

**完整訊息：**
```
配置驗證失敗
高度值不能小於 200px
```

**原因：**
- 輸入的參數不符合驗證規則

**解決方案：**
1. 檢查錯誤訊息中的具體問題
2. 修正參數值
3. 重新儲存

#### "範本載入失敗"

**完整訊息：**
```
範本載入失敗
無法從資料庫載入範本
```

**原因：**
- 資料庫連線問題
- 範本已被刪除
- 權限不足

**解決方案：**
1. 檢查資料庫連線
2. 確認範本是否存在
3. 檢查用戶權限

### 後端錯誤訊息

#### "資料庫連線失敗"

**原因：**
- 資料庫服務未運行
- 連線字串錯誤
- 網路問題

**解決方案：**
1. 檢查資料庫服務狀態
2. 驗證連線字串
3. 測試資料庫連線

#### "配置儲存失敗"

**原因：**
- 資料庫寫入權限不足
- 資料格式錯誤
- 資料庫空間不足

**解決方案：**
1. 檢查資料庫權限
2. 驗證資料格式
3. 檢查資料庫空間

---

## 效能問題

### 問題：載入速度慢

#### 症狀
- iframe 載入時間超過 3 秒
- 頁面切換緩慢

#### 可能原因
1. OCOGUI 伺服器效能不足
2. 網路延遲
3. 瀏覽器快取未啟用

#### 解決方案

**方案 A：優化伺服器**
- 增加伺服器資源
- 優化資料庫查詢
- 啟用快取機制

**方案 B：優化網路**
- 使用有線網路代替 Wi-Fi
- 減少網路跳轉
- 使用本地伺服器

**方案 C：啟用瀏覽器快取**
- 確保瀏覽器快取已啟用
- 設定適當的快取時間

### 問題：動畫不流暢

#### 症狀
- Sidebar 切換時有卡頓
- 視窗調整時不流暢

#### 可能原因
1. 電腦效能不足
2. 瀏覽器硬體加速未啟用
3. 過多的 DOM 操作

#### 解決方案

**方案 A：啟用硬體加速**
```
Chrome:
設定 → 系統 → 使用硬體加速 (如果可用)
```

**方案 B：關閉不必要的功能**
- 關閉瀏覽器擴充功能
- 關閉其他分頁
- 關閉背景程式

**方案 C：降低動畫複雜度**
- 減少 transition 時間
- 簡化動畫效果

---

## 聯絡支援

### 提供診斷資訊

在聯絡技術支援前，請準備以下資訊：

#### 1. 系統資訊
```
作業系統：Windows 10 / macOS / Linux
瀏覽器：Chrome 120.0.0.0
螢幕解析度：1920x1080
```

#### 2. 配置資訊
```
顯示模式：等比例置中
高度模式：固定 px
高度值：918
OCOGUI 伺服器：http://localhost:2955
```

#### 3. 錯誤資訊
- 錯誤訊息截圖
- Console 錯誤訊息
- Network 請求狀態

#### 4. 診斷報告
- 執行診斷工具的完整輸出
- 測量工具的結果

### 截圖指南

**必要截圖：**
1. 問題現象截圖
2. 設定介面截圖
3. Console 錯誤截圖
4. Network 標籤截圖

**截圖要求：**
- 完整視窗截圖
- 清晰可見
- 包含相關資訊

### 聯絡方式

**技術支援：**
- Email: support@oco.com
- 電話: +886-xxx-xxxx
- 線上客服: https://oco.com/support

**回應時間：**
- 緊急問題：2 小時內
- 一般問題：1 工作日內
- 功能建議：3 工作日內

---

## 附錄

### A. 診斷檢查表

使用此檢查表進行系統性診斷：

```
□ 1. 基礎檢查
  □ OCOGUI 伺服器正在運行
  □ 網址設定正確
  □ 瀏覽器縮放為 100%
  □ 已清除瀏覽器快取

□ 2. 配置檢查
  □ 顯示模式設定正確
  □ 高度模式設定正確
  □ 高度值在合理範圍
  □ 配置已正確儲存

□ 3. 環境檢查
  □ 瀏覽器版本符合要求
  □ 螢幕解析度適當
  □ 網路連線正常
  □ 防火牆未阻擋

□ 4. 功能檢查
  □ iframe 可以顯示
  □ 內容完整不裁切
  □ 比例正確不變形
  □ 位置居中對齊

□ 5. 效能檢查
  □ 載入速度正常
  □ 動畫流暢
  □ 無記憶體洩漏
  □ CPU 使用率正常
```

### B. 常用診斷命令

```javascript
// 快速檢查視窗尺寸
console.log(window.innerWidth, 'x', window.innerHeight);

// 檢查 iframe 尺寸
const iframe = document.querySelector('iframe');
console.log(iframe?.getBoundingClientRect());

// 檢查 Sidebar 狀態
const sidebar = document.querySelector('.ant-layout-sider');
console.log('Sidebar 寬度:', sidebar?.getBoundingClientRect().width);
console.log('是否收合:', sidebar?.classList.contains('ant-layout-sider-collapsed'));

// 檢查可用空間
const content = document.querySelector('.ant-layout-content');
console.log('Content 尺寸:', content?.getBoundingClientRect());
```

### C. 效能監控

```javascript
// 監控 iframe 載入時間
const start = performance.now();
iframe.addEventListener('load', () => {
  const end = performance.now();
  console.log('載入時間:', (end - start).toFixed(2), 'ms');
});

// 監控記憶體使用
if (performance.memory) {
  console.log('記憶體使用:', {
    used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
    total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
  });
}
```

---

**文件版本：** 1.0  
**最後更新：** 2025-01-08  
**適用版本：** Oco.GUI plc-frontend v2.0+  
**維護者：** Oco.GUI 開發團隊
