/**
 * Performance Optimization Utilities
 * 
 * 提供防抖（debounce）和節流（throttle）等性能優化工具函數
 */

/**
 * 防抖函數
 * 
 * 在事件被觸發 n 毫秒後再執行回調，如果在這 n 毫秒內又被觸發，則重新計時
 * 適用場景：搜尋框輸入、視窗 resize、表單驗證等
 * 
 * @param func - 要執行的函數
 * @param wait - 延遲時間（毫秒）
 * @param immediate - 是否立即執行（第一次觸發時）
 * @returns 防抖後的函數
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);

    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * 節流函數
 * 
 * 規定在一個單位時間內，只能觸發一次函數。如果這個單位時間內觸發多次函數，只有一次生效
 * 適用場景：滾動事件、按鈕點擊、拖拽事件等
 * 
 * @param func - 要執行的函數
 * @param wait - 間隔時間（毫秒）
 * @param options - 配置選項
 * @returns 節流後的函數
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;
  const { leading = true, trailing = true } = options;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const now = Date.now();

    // 如果不需要首次執行，則將 previous 設為當前時間
    if (!previous && !leading) {
      previous = now;
    }

    // 計算剩餘時間
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      // 時間到了，執行函數
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(context, args);
    } else if (!timeout && trailing) {
      // 設置定時器，在剩餘時間後執行
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(context, args);
      }, remaining);
    }
  };
}

/**
 * 請求動畫幀節流
 * 
 * 使用 requestAnimationFrame 實現的節流，確保在瀏覽器下一次重繪之前執行
 * 適用場景：動畫、滾動事件等需要與瀏覽器重繪同步的場景
 * 
 * @param func - 要執行的函數
 * @returns 節流後的函數
 */
export function rafThrottle<T extends (...args: any[]) => any>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;

    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      func.apply(context, args);
      rafId = null;
    });
  };
}

/**
 * 取消防抖或節流
 * 
 * 用於清理防抖或節流函數的定時器
 * 
 * @param func - 防抖或節流後的函數
 */
export function cancel(func: any): void {
  if (func && typeof func.cancel === 'function') {
    func.cancel();
  }
}

/**
 * 記憶化函數
 * 
 * 緩存函數的計算結果，避免重複計算
 * 適用場景：複雜計算、純函數等
 * 
 * @param func - 要記憶化的函數
 * @param resolver - 自訂緩存鍵生成函數
 * @returns 記憶化後的函數
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T & { cache: Map<string, ReturnType<T>> } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = function (this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  } as T & { cache: Map<string, ReturnType<T>> };

  memoized.cache = cache;
  return memoized;
}

/**
 * 批次處理函數
 * 
 * 將多次調用合併為一次批次處理
 * 適用場景：批次更新 DOM、批次發送請求等
 * 
 * @param func - 批次處理函數
 * @param wait - 等待時間（毫秒）
 * @returns 批次處理後的函數
 */
export function batch<T>(
  func: (items: T[]) => void,
  wait: number
): (item: T) => void {
  let items: T[] = [];
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (item: T) => {
    items.push(item);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(items);
      items = [];
      timeout = null;
    }, wait);
  };
}

/**
 * 空閒時執行
 * 
 * 在瀏覽器空閒時執行函數，不會阻塞主線程
 * 適用場景：非關鍵任務、預載入等
 * 
 * @param func - 要執行的函數
 * @param options - 配置選項
 */
export function runWhenIdle(
  func: () => void,
  options?: IdleRequestOptions
): number {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(func, options);
  } else {
    // 降級方案：使用 setTimeout
    return setTimeout(func, 1) as any;
  }
}

/**
 * 取消空閒執行
 * 
 * @param id - runWhenIdle 返回的 ID
 */
export function cancelIdle(id: number): void {
  if (typeof cancelIdleCallback !== 'undefined') {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
