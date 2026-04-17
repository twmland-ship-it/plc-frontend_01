# 無障礙性指南

## 概述

本文件說明 iframe 自動適應增強功能中實施的無障礙性（Accessibility, a11y）改進措施。

## WCAG 2.1 合規性

本專案遵循 WCAG 2.1 Level AA 標準，確保所有用戶都能訪問和使用系統。

### 四大原則

1. **可感知（Perceivable）**：資訊和用戶界面組件必須以用戶可以感知的方式呈現
2. **可操作（Operable）**：用戶界面組件和導航必須是可操作的
3. **可理解（Understandable）**：資訊和用戶界面的操作必須是可理解的
4. **健壯（Robust）**：內容必須足夠健壯，能被各種用戶代理（包括輔助技術）可靠地解釋

## 實施的無障礙性功能

### 1. ARIA 標籤和屬性

#### iframe 組件

```vue
<iframe
  :title="'嵌入的 OCOGUI 視圖'"
  :aria-label="'OCOGUI 視圖內容'"
  role="region"
/>
```

#### 錯誤訊息

```vue
<div role="alert" aria-live="assertive">
  <h3 id="error-title">無法載入內容</h3>
  <p id="error-message">{{ errorMessage }}</p>
</div>
```

#### 按鈕

```vue
<button
  aria-label="重新載入 iframe 內容"
  @click="retryLoad"
>
  重新載入
</button>
```

### 2. 鍵盤導航

#### 完整鍵盤支援

所有互動元素都可以通過鍵盤訪問：

- **Tab**：移動到下一個可聚焦元素
- **Shift + Tab**：移動到上一個可聚焦元素
- **Enter / Space**：激活按鈕或連結
- **Escape**：關閉對話框或彈出層
- **Arrow Keys**：在列表或選單中導航

#### 焦點管理

```typescript
import { trapFocus } from '@/utils/accessibility';

// 在模態對話框中限制焦點
const cleanup = trapFocus(dialogElement);

// 清理時恢復焦點
cleanup();
```

#### 焦點指示器

```css
/* 只在使用鍵盤時顯示焦點樣式 */
body.using-keyboard *:focus {
  outline: 2px solid #1890ff;
  outline-offset: 2px;
}
```

### 3. 螢幕閱讀器支援

#### 即時區域（Live Regions）

```typescript
import { announceToScreenReader } from '@/utils/accessibility';

// 宣告訊息給螢幕閱讀器
announceToScreenReader('iframe 內容載入失敗', 'assertive');
announceToScreenReader('正在重新載入 iframe 內容', 'polite');
```

#### 語義化 HTML

使用正確的 HTML 元素和 ARIA 角色：

```html
<!-- 使用語義化標籤 -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>

<!-- 使用 ARIA 角色 -->
<div role="region" aria-label="內容區域">...</div>
<div role="alert">...</div>
<div role="dialog">...</div>
```

#### 替代文字

為所有非文字內容提供替代文字：

```html
<!-- 圖片 -->
<img src="icon.png" alt="設定圖示" />

<!-- 裝飾性圖片 -->
<img src="decoration.png" alt="" aria-hidden="true" />

<!-- 圖示字體 -->
<i class="icon" aria-hidden="true"></i>
<span class="sr-only">設定</span>
```

### 4. 顏色和對比度

#### 對比度要求

- **正常文字**：至少 4.5:1
- **大文字（18pt 或 14pt 粗體）**：至少 3:1
- **UI 組件和圖形**：至少 3:1

#### 不依賴顏色

不僅使用顏色來傳達資訊：

```html
<!-- ❌ 錯誤：只用顏色 -->
<span style="color: red;">錯誤</span>

<!-- ✅ 正確：使用圖示和文字 -->
<span style="color: red;">
  <i class="error-icon" aria-hidden="true">⚠️</i>
  錯誤
</span>
```

#### 高對比度模式

```css
@media (prefers-contrast: high) {
  button,
  a,
  input {
    border: 2px solid currentColor;
  }
}
```

### 5. 響應式設計

#### 文字縮放

支援文字縮放至 200% 而不失去功能：

```css
/* 使用相對單位 */
font-size: 1rem; /* 而非 16px */
padding: 0.5em; /* 而非 8px */
```

#### 觸控目標大小

所有互動元素至少 44x44 像素：

```css
button {
  min-width: 44px;
  min-height: 44px;
}
```

### 6. 表單無障礙性

#### 標籤關聯

```html
<label for="username">用戶名稱</label>
<input id="username" type="text" />
```

#### 錯誤訊息

```html
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  請輸入有效的電子郵件地址
</span>
```

#### 必填欄位

```html
<label for="name">
  姓名
  <span aria-label="必填">*</span>
</label>
<input id="name" type="text" required aria-required="true" />
```

### 7. 動畫和過渡

#### 尊重用戶偏好

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### 可控制的動畫

提供暫停、停止或隱藏動畫的選項。

## 測試工具

### 自動化測試

1. **axe DevTools**：瀏覽器擴展，檢測無障礙性問題
2. **Lighthouse**：Chrome DevTools 內建，提供無障礙性評分
3. **WAVE**：Web Accessibility Evaluation Tool
4. **Pa11y**：命令行工具，自動化測試

### 手動測試

1. **鍵盤導航測試**：
   - 使用 Tab 鍵遍歷所有互動元素
   - 確保焦點順序合理
   - 確保所有功能都可以通過鍵盤訪問

2. **螢幕閱讀器測試**：
   - **NVDA**（Windows，免費）
   - **JAWS**（Windows，商業）
   - **VoiceOver**（macOS/iOS，內建）
   - **TalkBack**（Android，內建）

3. **顏色對比度測試**：
   - 使用 Chrome DevTools 的 Color Picker
   - 使用 Contrast Checker 工具

4. **縮放測試**：
   - 測試 200% 文字縮放
   - 測試 400% 頁面縮放

## 常見問題和解決方案

### 1. 焦點管理

**問題**：模態對話框打開時，焦點沒有移動到對話框內

**解決方案**：
```typescript
import { trapFocus } from '@/utils/accessibility';

onMounted(() => {
  const cleanup = trapFocus(dialogRef.value);
  onUnmounted(cleanup);
});
```

### 2. 動態內容

**問題**：動態更新的內容沒有通知螢幕閱讀器

**解決方案**：
```typescript
import { announceToScreenReader } from '@/utils/accessibility';

// 內容更新後
announceToScreenReader('內容已更新', 'polite');
```

### 3. 自訂組件

**問題**：自訂組件沒有正確的 ARIA 屬性

**解決方案**：
```vue
<template>
  <div
    role="button"
    tabindex="0"
    :aria-pressed="isPressed"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    {{ label }}
  </div>
</template>
```

### 4. 圖示按鈕

**問題**：只有圖示的按鈕沒有文字標籤

**解決方案**：
```vue
<button aria-label="關閉">
  <i class="close-icon" aria-hidden="true">×</i>
</button>
```

## 最佳實踐

### 1. 使用語義化 HTML

```html
<!-- ✅ 好 -->
<button>提交</button>
<nav>...</nav>
<main>...</main>

<!-- ❌ 壞 -->
<div onclick="submit()">提交</div>
<div class="nav">...</div>
<div class="main">...</div>
```

### 2. 提供跳過導航連結

```html
<a href="#main-content" class="skip-to-content">
  跳到主要內容
</a>
```

### 3. 使用 ARIA 時要謹慎

```html
<!-- ❌ 不必要的 ARIA -->
<button role="button">提交</button>

<!-- ✅ 只在需要時使用 -->
<div role="button" tabindex="0">提交</div>
```

### 4. 測試真實設備

在真實設備上使用螢幕閱讀器測試，而不僅僅依賴自動化工具。

### 5. 持續改進

無障礙性是一個持續的過程，定期審查和改進。

## 資源

### 官方文檔

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### 工具

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

### 學習資源

- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Components](https://inclusive-components.design/)

## 檢查清單

### 開發階段

- [ ] 使用語義化 HTML 元素
- [ ] 為所有互動元素添加適當的 ARIA 屬性
- [ ] 確保所有功能都可以通過鍵盤訪問
- [ ] 為非文字內容提供替代文字
- [ ] 確保顏色對比度符合 WCAG 標準
- [ ] 支援文字縮放至 200%
- [ ] 尊重用戶的動畫偏好

### 測試階段

- [ ] 使用 axe DevTools 檢測問題
- [ ] 運行 Lighthouse 無障礙性審計
- [ ] 使用鍵盤完整測試所有功能
- [ ] 使用螢幕閱讀器測試
- [ ] 測試顏色對比度
- [ ] 測試文字和頁面縮放
- [ ] 在不同瀏覽器和設備上測試

### 部署前

- [ ] 修復所有嚴重的無障礙性問題
- [ ] 記錄已知的限制
- [ ] 提供無障礙性聲明
- [ ] 提供反饋渠道

## 聯絡方式

如果您在使用本系統時遇到無障礙性問題，請聯絡我們：

- 電子郵件：[accessibility@example.com]
- 問題追蹤：[GitHub Issues]
