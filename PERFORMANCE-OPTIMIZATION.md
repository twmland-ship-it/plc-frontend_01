# 性能優化指南

## 概述

本文件說明 iframe 自動適應增強功能中實施的性能優化策略。

## 優化策略

### 1. 防抖（Debounce）和節流（Throttle）

#### 使用場景

- **防抖**：適用於頻繁觸發但只需要最後一次結果的場景
  - 搜尋框輸入
  - 表單驗證
  - 視窗 resize（當需要最終尺寸時）

- **節流**：適用於需要定期執行的場景
  - 滾動事件
  - 拖拽事件
  - 按鈕點擊防止重複提交

- **RAF 節流**：適用於需要與瀏覽器重繪同步的場景
  - 動畫更新
  - 視窗 resize（當需要平滑動畫時）
  - 滾動位置更新

#### 實現

```typescript
import { debounce, throttle, rafThrottle } from '@/utils/performance';

// 防抖範例：搜尋輸入
const handleSearch = debounce((value: string) => {
  // 執行搜尋
}, 300);

// 節流範例：滾動事件
const handleScroll = throttle(() => {
  // 處理滾動
}, 100);

// RAF 節流範例：視窗 resize
const handleResize = rafThrottle(() => {
  // 更新佈局
});
```

### 2. 記憶化（Memoization）

#### 使用場景

- 複雜計算結果緩存
- 純函數結果緩存
- 避免重複計算

#### 實現

在 `SizeCalculator` 中使用記憶化：

```typescript
import { memoize } from '@/utils/performance';

export class SizeCalculator {
  private calculateMemoized: ReturnType<typeof memoize>;

  constructor() {
    this.calculateMemoized = memoize(
      this._calculateInternal.bind(this),
      (measurements, options) => {
        // 生成緩存鍵
        return JSON.stringify({
          viewport: measurements.viewport,
          sidebar: measurements.sidebar,
          // ...
        });
      }
    );
  }

  calculate(measurements, options) {
    return this.calculateMemoized(measurements, options);
  }

  clearCache() {
    this.calculateMemoized.cache.clear();
  }
}
```

### 3. Vue 響應性優化

#### Computed vs Watch

- **使用 computed**：當需要基於響應式數據計算衍生值時
  - 自動緩存
  - 只在依賴變化時重新計算
  - 適合同步計算

```typescript
const calculatedSize = computed(() => {
  if (!measurements.value) return null;
  return sizeCalculator.calculate(measurements.value, options);
});
```

- **使用 watch**：當需要執行副作用或異步操作時
  - 可以執行異步操作
  - 可以訪問舊值和新值
  - 適合副作用操作

```typescript
watch(
  () => props.config,
  (newConfig, oldConfig) => {
    // 執行副作用
  },
  { deep: true }
);
```

#### 避免不必要的重新渲染

1. **使用 v-memo**（Vue 3.2+）：

```vue
<template>
  <div v-memo="[config.iframeFit, config.iframeHeightMode]">
    <!-- 只在 iframeFit 或 iframeHeightMode 變化時重新渲染 -->
  </div>
</template>
```

2. **使用 shallowRef 和 shallowReactive**：

```typescript
import { shallowRef, shallowReactive } from 'vue';

// 對於大型對象，使用 shallow 版本避免深度響應
const measurements = shallowRef<LayoutMeasurements | null>(null);
```

3. **使用 markRaw**：

```typescript
import { markRaw } from 'vue';

// 對於不需要響應式的對象
const layoutMeasurer = markRaw(new LayoutMeasurer());
```

### 4. 觀察器優化

#### ResizeObserver 和 MutationObserver

- 使用原生觀察器 API 而非輪詢
- 提供降級方案以支援舊瀏覽器

```typescript
// 優先使用 ResizeObserver
if (typeof ResizeObserver !== 'undefined') {
  this.resizeObserver = new ResizeObserver(() => {
    this.notifyChange();
  });
  this.resizeObserver.observe(document.body);
} else {
  // 降級：使用 window.resize
  window.addEventListener('resize', this.resizeHandler);
}
```

### 5. 批次處理

#### 使用場景

- 批次更新 DOM
- 批次發送請求
- 批次處理事件

#### 實現

```typescript
import { batch } from '@/utils/performance';

const batchUpdate = batch((items: Item[]) => {
  // 批次處理所有項目
  items.forEach(item => {
    // 更新 DOM
  });
}, 100);

// 多次調用會被合併
batchUpdate(item1);
batchUpdate(item2);
batchUpdate(item3);
// 100ms 後一次性處理所有項目
```

### 6. 空閒時執行

#### 使用場景

- 非關鍵任務
- 預載入資源
- 分析和日誌

#### 實現

```typescript
import { runWhenIdle, cancelIdle } from '@/utils/performance';

// 在瀏覽器空閒時執行
const idleId = runWhenIdle(() => {
  // 執行非關鍵任務
  preloadResources();
}, { timeout: 2000 });

// 如果需要，可以取消
cancelIdle(idleId);
```

## 性能監控

### 使用 Performance API

```typescript
// 測量函數執行時間
performance.mark('calculation-start');
const result = calculator.calculate(measurements, options);
performance.mark('calculation-end');
performance.measure('calculation', 'calculation-start', 'calculation-end');

// 獲取測量結果
const measures = performance.getEntriesByName('calculation');
console.log(`Calculation took ${measures[0].duration}ms`);
```

### 使用 Vue Devtools

- 使用 Vue Devtools 的 Performance 標籤監控組件渲染
- 識別性能瓶頸
- 優化重新渲染

## 最佳實踐

### 1. 避免在 computed 中執行副作用

```typescript
// ❌ 錯誤
const value = computed(() => {
  console.log('Computing...'); // 副作用
  return someCalculation();
});

// ✅ 正確
const value = computed(() => {
  return someCalculation();
});
```

### 2. 使用 key 優化列表渲染

```vue
<template>
  <div v-for="item in items" :key="item.id">
    {{ item.name }}
  </div>
</template>
```

### 3. 延遲載入組件

```typescript
// 使用 defineAsyncComponent
import { defineAsyncComponent } from 'vue';

const PreviewPanel = defineAsyncComponent(() =>
  import('@/components/oco/gui/setting/PreviewPanel.vue')
);
```

### 4. 避免不必要的深度監聽

```typescript
// ❌ 避免
watch(
  () => props.config,
  (newConfig) => {
    // ...
  },
  { deep: true } // 深度監聽可能很昂貴
);

// ✅ 更好
watch(
  () => [props.config.iframeFit, props.config.iframeHeightMode],
  ([newFit, newMode]) => {
    // 只監聽需要的屬性
  }
);
```

### 5. 使用 v-once 對於靜態內容

```vue
<template>
  <div v-once>
    <!-- 這些內容只渲染一次 -->
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>
```

## 性能指標

### 目標

- **首次渲染時間（FCP）**：< 1.5s
- **最大內容繪製（LCP）**：< 2.5s
- **首次輸入延遲（FID）**：< 100ms
- **累積佈局偏移（CLS）**：< 0.1
- **計算時間**：< 16ms（60fps）
- **記憶體使用**：< 50MB

### 測量工具

- Chrome DevTools Performance
- Lighthouse
- Vue Devtools
- Performance API

## 故障排除

### 性能問題診斷

1. **使用 Performance 標籤**：
   - 錄製性能配置文件
   - 識別長任務
   - 查找重新渲染

2. **檢查記憶體洩漏**：
   - 使用 Memory 標籤
   - 拍攝堆快照
   - 比較快照找出洩漏

3. **優化建議**：
   - 減少 DOM 操作
   - 使用虛擬滾動
   - 延遲載入非關鍵資源
   - 使用 Web Workers 處理複雜計算

## 參考資源

- [Vue 3 Performance](https://vuejs.org/guide/best-practices/performance.html)
- [Web Performance](https://web.dev/performance/)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [ResizeObserver API](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [MutationObserver API](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
