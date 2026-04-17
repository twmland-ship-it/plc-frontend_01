# 2026-01-10 Modal 外層白框 (視窗包視窗) 問題修復指南

## 問題描述
在 `plc-frontend` 專案中，所有的 Modal 彈出視窗（如「新增頁面」、「編輯頁面」）外層都出現了一個巨大的、白色的、類似卡片的背景框，導致看起來像是「一個視窗包著另一個視窗」。

此問題導致：
1. 視窗無法正常縮小或置中。
2. 視覺效果嚴重異常。
3. 即使還原了 Modal 相關的程式碼，問題仍然存在。

## 問題根源
經過排查，問題出在 `src/assets/css/accessibility.css` (無障礙樣式表) 中，有一段針對 `[role="dialog"]` 的全域樣式：

```css
/* accessibility.css */
[role="dialog"] {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background: white; /* 兇手：強制白色背景 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw; /* 兇手：強制最大寬度 */
  max-height: 90vh;
  overflow: auto;
}
```

由於 Ant Design Vue 的 Modal 內部結構（`.ant-modal` 或 `.ant-modal-content`）帶有 `role="dialog"` 屬性，這段全域 CSS 強制覆蓋了 Ant Design 的預設樣式，導致 Modal 的外層容器變成了白色大框。

## 修復方式
在 `src/main.js` 中，**移除** 對 `accessibility.css` 的引用。

**修改前 (src/main.js):**
```javascript
import "@/assets/css/accessibility.css"; // 這行導致衝突
import { initInputDetection } from "@/utils/accessibility";
// ...
initInputDetection();
```

**修改後 (src/main.js):**
```javascript
// import "@/assets/css/accessibility.css"; // 移除或註解掉
// import { initInputDetection } from "@/utils/accessibility"; // 移除或註解掉
// ...
// initInputDetection(); // 移除或註解掉
```

## 未來開發注意事項
1. **避免使用屬性選擇器設定全域樣式**：像 `[role="dialog"]` 這種選擇器權重很高且範圍太廣，極易影響第三方 UI 庫（如 Ant Design, Element UI）的元件。
2. **無障礙功能需進行隔離**：如果必須使用無障礙樣式，請確保只針對自定義的元件生效，或者使用 `:not(.ant-modal)` 等方式排除 UI 庫的元素。
3. **Modal 樣式客製化**：
   - 若要客製化 Modal 寬高，請使用 `<a-modal :width="...">` 或 `:wrapClassName="..."` 配合特定 class。
   - 絕對不要在 `style.css` 中直接修改 `.ant-modal` 的全域樣式，這會破壞所有彈窗。

