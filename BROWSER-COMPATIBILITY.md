# 瀏覽器兼容性指南

## 概述

本文件說明 iframe 自動適應增強功能的瀏覽器兼容性情況，包括支援的瀏覽器版本、已知問題和降級方案。

## 支援的瀏覽器

### 完全支援（推薦）

以下瀏覽器的最新版本提供最佳體驗：

| 瀏覽器 | 最低版本 | 推薦版本 | 備註 |
|--------|----------|----------|------|
| Chrome | 90+ | 最新版 | 完全支援所有功能 |
| Firefox | 88+ | 最新版 | 完全支援所有功能 |
| Safari | 14+ | 最新版 | 完全支援所有功能 |
| Edge | 90+ | 最新版 | 基於 Chromium，完全支援 |

### 部分支援

以下瀏覽器可能需要 polyfill 或有部分功能限制：

| 瀏覽器 | 版本 | 支援狀況 | 限制 |
|--------|------|----------|------|
| Chrome | 60-89 | 部分支援 | 需要 polyfill |
| Firefox | 55-87 | 部分支援 | 需要 polyfill |
| Safari | 12-13 | 部分支援 | ResizeObserver 需要 polyfill |
| Edge (Legacy) | 18+ | 部分支援 | 建議升級到 Chromium 版本 |

### 不支援

以下瀏覽器不支援或支援有限：

- Internet Explorer 11 及更早版本
- Opera Mini
- 非常舊的移動瀏覽器（Android 4.x 以下）

## 功能兼容性

### ResizeObserver

**用途**：監聽元素大小變化

**支援情況**：
- ✅ Chrome 64+
- ✅ Firefox 69+
- ✅ Safari 13.1+
- ✅ Edge 79+

**降級方案**：
使用 `window.resize` 事件作為降級方案。Polyfill 會自動在不支援的瀏覽器中啟用。

```typescript
// 自動處理，無需手動配置
import { LayoutMeasurer } from '@/utils/layout-measurer';
const measurer = new LayoutMeasurer();
```

### MutationObserver

**用途**：監聽 DOM 變化（Sidebar 狀態）

**支援情況**：
- ✅ Chrome 26+
- ✅ Firefox 14+
- ✅ Safari 6+
- ✅ Edge 12+

**降級方案**：
使用輪詢機制檢測變化。Polyfill 會自動在不支援的瀏覽器中啟用。

### requestIdleCallback

**用途**：在瀏覽器空閒時執行任務

**支援情況**：
- ✅ Chrome 47+
- ❌ Firefox（實驗性）
- ❌ Safari
- ✅ Edge 79+

**降級方案**：
使用 `setTimeout` 作為降級方案。

```typescript
import { runWhenIdle } from '@/utils/performance';
runWhenIdle(() => {
  // 非關鍵任務
});
```

### CSS Flexbox

**用途**：佈局

**支援情況**：
- ✅ Chrome 29+
- ✅ Firefox 28+
- ✅ Safari 9+
- ✅ Edge 12+

**降級方案**：
使用傳統的 float 或 inline-block 佈局。

### CSS Grid

**用途**：複雜佈局

**支援情況**：
- ✅ Chrome 57+
- ✅ Firefox 52+
- ✅ Safari 10.1+
- ✅ Edge 16+

**降級方案**：
使用 Flexbox 或傳統佈局方式。

### ES6+ 功能

**用途**：現代 JavaScript 語法

**支援情況**：
- ✅ Chrome 51+
- ✅ Firefox 54+
- ✅ Safari 10+
- ✅ Edge 15+

**降級方案**：
使用 Babel 轉譯為 ES5。

## Polyfill 策略

### 自動 Polyfill

系統會自動檢測瀏覽器功能並載入必要的 polyfill：

```typescript
// 在 main.js 中自動初始化
import { initPolyfills } from '@/utils/browser-compat';
initPolyfills();
```

### 手動 Polyfill

如果需要手動控制 polyfill：

```typescript
import {
  polyfillResizeObserver,
  polyfillMutationObserver,
  polyfillRequestIdleCallback
} from '@/utils/browser-compat';

// 只載入需要的 polyfill
polyfillResizeObserver();
```

## 測試策略

### 測試矩陣

| 瀏覽器 | 版本 | 作業系統 | 測試狀態 |
|--------|------|----------|----------|
| Chrome | 最新 | Windows 10 | ✅ 通過 |
| Chrome | 最新 | macOS | ✅ 通過 |
| Firefox | 最新 | Windows 10 | ✅ 通過 |
| Firefox | 最新 | macOS | ✅ 通過 |
| Safari | 最新 | macOS | ✅ 通過 |
| Safari | 最新 | iOS | ✅ 通過 |
| Edge | 最新 | Windows 10 | ✅ 通過 |

### 測試工具

1. **BrowserStack**：跨瀏覽器測試平台
2. **Sauce Labs**：自動化測試平台
3. **本地測試**：使用虛擬機或真實設備

### 測試檢查清單

- [ ] 基本功能在所有支援的瀏覽器中正常工作
- [ ] Polyfill 在舊瀏覽器中正確載入
- [ ] 降級方案提供可接受的用戶體驗
- [ ] 沒有 JavaScript 錯誤
- [ ] 樣式在所有瀏覽器中正確顯示
- [ ] 響應式設計在不同螢幕尺寸下正常工作

## 已知問題

### Safari

**問題 1：ResizeObserver 在 Safari 13.0 及更早版本中不支援**

**影響**：視窗大小變化時可能無法即時更新

**解決方案**：
- 自動使用 polyfill
- 或手動觸發重新計算

**問題 2：CSS Grid 在 Safari 10.0 中有 bug**

**影響**：某些 Grid 佈局可能顯示不正確

**解決方案**：
- 使用 Flexbox 作為降級方案
- 或要求用戶升級到 Safari 10.1+

### Firefox

**問題 1：requestIdleCallback 不支援**

**影響**：非關鍵任務可能不會在最佳時機執行

**解決方案**：
- 自動使用 setTimeout 降級方案

### Edge (Legacy)

**問題 1：某些 ES6 功能不支援**

**影響**：可能出現 JavaScript 錯誤

**解決方案**：
- 使用 Babel 轉譯
- 建議用戶升級到 Chromium 版本的 Edge

## 性能考慮

### Polyfill 性能影響

| Polyfill | 大小 | 性能影響 | 備註 |
|----------|------|----------|------|
| ResizeObserver | ~2KB | 低 | 使用 window.resize 降級 |
| MutationObserver | ~3KB | 中 | 使用輪詢，可能影響性能 |
| requestIdleCallback | ~1KB | 低 | 使用 setTimeout 降級 |

### 優化建議

1. **條件載入**：只在需要時載入 polyfill
2. **延遲載入**：非關鍵 polyfill 可以延遲載入
3. **CDN**：使用 CDN 加速 polyfill 載入
4. **緩存**：啟用瀏覽器緩存

## 降級策略

### 功能降級

當某些功能不可用時，提供降級方案：

```typescript
// 檢測功能支援
import { detectBrowserFeatures } from '@/utils/browser-compat';

const features = detectBrowserFeatures();

if (!features.resizeObserver) {
  // 使用降級方案
  console.warn('ResizeObserver not supported, using fallback');
}
```

### 優雅降級

確保核心功能在所有瀏覽器中都能工作：

1. **核心功能**：必須在所有支援的瀏覽器中工作
2. **增強功能**：可以在現代瀏覽器中提供更好的體驗
3. **實驗性功能**：只在最新瀏覽器中啟用

## 用戶通知

### 瀏覽器警告

對於不支援的瀏覽器，顯示警告訊息：

```typescript
import { showBrowserWarning } from '@/utils/browser-compat';

// 自動檢測並顯示警告
showBrowserWarning();
```

### 升級建議

提供清晰的升級指引：

```
您的瀏覽器版本較舊，可能無法正常使用所有功能。

建議升級到以下瀏覽器的最新版本：
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
```

## 開發指南

### 編寫兼容代碼

1. **使用功能檢測**：

```typescript
if (typeof ResizeObserver !== 'undefined') {
  // 使用 ResizeObserver
} else {
  // 使用降級方案
}
```

2. **避免使用實驗性 API**：

```typescript
// ❌ 避免
element.scrollIntoViewIfNeeded();

// ✅ 使用標準 API
element.scrollIntoView({ behavior: 'smooth' });
```

3. **使用 Autoprefixer**：

```css
/* 自動添加瀏覽器前綴 */
.element {
  display: flex;
  /* 自動生成：
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  */
}
```

### 測試兼容性

1. **本地測試**：

```bash
# 使用不同瀏覽器測試
npm run test:chrome
npm run test:firefox
npm run test:safari
```

2. **自動化測試**：

```javascript
// 使用 Playwright 進行跨瀏覽器測試
const { chromium, firefox, webkit } = require('playwright');

test('works in all browsers', async () => {
  for (const browserType of [chromium, firefox, webkit]) {
    const browser = await browserType.launch();
    // 測試...
    await browser.close();
  }
});
```

## 資源

### 工具

- [Can I Use](https://caniuse.com/)：檢查瀏覽器功能支援
- [Autoprefixer](https://autoprefixer.github.io/)：自動添加 CSS 前綴
- [Babel](https://babeljs.io/)：JavaScript 轉譯器
- [Polyfill.io](https://polyfill.io/)：自動 polyfill 服務

### 文檔

- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/Guide/Browser_compatibility)
- [Web Platform Tests](https://web-platform-tests.org/)

## 更新日誌

### 2025-01-07

- 添加 ResizeObserver polyfill
- 添加 MutationObserver polyfill
- 添加瀏覽器檢測功能
- 添加自動警告系統

## 聯絡方式

如果您在特定瀏覽器中遇到問題，請聯絡我們：

- 電子郵件：[support@example.com]
- 問題追蹤：[GitHub Issues]
- 包含以下資訊：
  - 瀏覽器名稱和版本
  - 作業系統
  - 錯誤訊息或截圖
  - 重現步驟
