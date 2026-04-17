/**
 * Browser Compatibility Utilities
 * 
 * 提供瀏覽器兼容性檢測和 polyfill
 */

/**
 * 瀏覽器功能檢測結果
 */
export interface BrowserFeatures {
  resizeObserver: boolean;
  mutationObserver: boolean;
  intersectionObserver: boolean;
  requestIdleCallback: boolean;
  requestAnimationFrame: boolean;
  customElements: boolean;
  shadowDOM: boolean;
  es6: boolean;
  flexbox: boolean;
  grid: boolean;
}

/**
 * 檢測瀏覽器功能支援
 * 
 * @returns 功能支援情況
 */
export function detectBrowserFeatures(): BrowserFeatures {
  return {
    resizeObserver: typeof ResizeObserver !== 'undefined',
    mutationObserver: typeof MutationObserver !== 'undefined',
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    requestIdleCallback: typeof requestIdleCallback !== 'undefined',
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
    customElements: typeof customElements !== 'undefined',
    shadowDOM: typeof ShadowRoot !== 'undefined',
    es6: checkES6Support(),
    flexbox: checkCSSFeature('display', 'flex'),
    grid: checkCSSFeature('display', 'grid')
  };
}

/**
 * 檢測 ES6 支援
 */
function checkES6Support(): boolean {
  try {
    // 檢測箭頭函數、let/const、模板字串等
    eval('const test = () => `test`');
    return true;
  } catch {
    return false;
  }
}

/**
 * 檢測 CSS 功能支援
 */
function checkCSSFeature(property: string, value: string): boolean {
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports(property, value);
  }
  
  // 降級檢測
  const element = document.createElement('div');
  element.style[property as any] = value;
  return element.style[property as any] === value;
}

/**
 * ResizeObserver Polyfill
 * 
 * 為不支援 ResizeObserver 的瀏覽器提供降級方案
 */
export function polyfillResizeObserver(): void {
  if (typeof ResizeObserver !== 'undefined') {
    return; // 原生支援，不需要 polyfill
  }

  console.warn('ResizeObserver not supported, using polyfill');

  // 簡單的 polyfill 實現
  (window as any).ResizeObserver = class ResizeObserverPolyfill {
    private callback: ResizeObserverCallback;
    private observedElements: Set<Element> = new Set();
    private resizeHandler: () => void;

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      
      // 使用 window.resize 作為降級方案
      this.resizeHandler = () => {
        const entries: ResizeObserverEntry[] = [];
        
        this.observedElements.forEach(element => {
          const rect = element.getBoundingClientRect();
          entries.push({
            target: element,
            contentRect: rect,
            borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
            contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
            devicePixelContentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }]
          } as ResizeObserverEntry);
        });

        if (entries.length > 0) {
          this.callback(entries, this);
        }
      };

      window.addEventListener('resize', this.resizeHandler);
    }

    observe(target: Element): void {
      this.observedElements.add(target);
      
      // 立即觸發一次
      const rect = target.getBoundingClientRect();
      this.callback([{
        target,
        contentRect: rect,
        borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
        contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
        devicePixelContentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }]
      } as ResizeObserverEntry], this);
    }

    unobserve(target: Element): void {
      this.observedElements.delete(target);
    }

    disconnect(): void {
      this.observedElements.clear();
      window.removeEventListener('resize', this.resizeHandler);
    }
  };
}

/**
 * MutationObserver Polyfill
 * 
 * 為不支援 MutationObserver 的瀏覽器提供降級方案
 */
export function polyfillMutationObserver(): void {
  if (typeof MutationObserver !== 'undefined') {
    return; // 原生支援，不需要 polyfill
  }

  console.warn('MutationObserver not supported, using polyfill');

  // 簡單的 polyfill 實現（使用輪詢）
  (window as any).MutationObserver = class MutationObserverPolyfill {
    private callback: MutationCallback;
    private observedElements: Map<Element, { attributes: boolean; attributeFilter?: string[] }> = new Map();
    private intervalId: number | null = null;
    private previousStates: Map<Element, any> = new Map();

    constructor(callback: MutationCallback) {
      this.callback = callback;
    }

    observe(target: Element, options: MutationObserverInit): void {
      this.observedElements.set(target, {
        attributes: options.attributes || false,
        attributeFilter: options.attributeFilter
      });

      // 保存初始狀態
      this.previousStates.set(target, this.captureState(target, options));

      // 開始輪詢
      if (!this.intervalId) {
        this.intervalId = window.setInterval(() => {
          this.checkMutations();
        }, 100);
      }
    }

    private captureState(element: Element, options: MutationObserverInit): any {
      const state: any = {};
      
      if (options.attributes) {
        state.attributes = {};
        const attrs = element.attributes;
        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          if (!options.attributeFilter || options.attributeFilter.includes(attr.name)) {
            state.attributes[attr.name] = attr.value;
          }
        }
      }
      
      return state;
    }

    private checkMutations(): void {
      const mutations: MutationRecord[] = [];

      this.observedElements.forEach((options, element) => {
        const previousState = this.previousStates.get(element);
        const currentState = this.captureState(element, options);

        if (options.attributes) {
          // 檢查屬性變化
          const prevAttrs = previousState.attributes || {};
          const currAttrs = currentState.attributes || {};

          Object.keys(currAttrs).forEach(attrName => {
            if (prevAttrs[attrName] !== currAttrs[attrName]) {
              mutations.push({
                type: 'attributes',
                target: element,
                attributeName: attrName,
                oldValue: prevAttrs[attrName]
              } as MutationRecord);
            }
          });
        }

        this.previousStates.set(element, currentState);
      });

      if (mutations.length > 0) {
        this.callback(mutations, this);
      }
    }

    disconnect(): void {
      this.observedElements.clear();
      this.previousStates.clear();
      
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }

    takeRecords(): MutationRecord[] {
      return [];
    }
  };
}

/**
 * requestIdleCallback Polyfill
 */
export function polyfillRequestIdleCallback(): void {
  if (typeof requestIdleCallback !== 'undefined') {
    return;
  }

  console.warn('requestIdleCallback not supported, using polyfill');

  (window as any).requestIdleCallback = function(callback: IdleRequestCallback, options?: IdleRequestOptions) {
    const start = Date.now();
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      });
    }, 1) as any;
  };

  (window as any).cancelIdleCallback = function(id: number) {
    clearTimeout(id);
  };
}

/**
 * requestAnimationFrame Polyfill
 */
export function polyfillRequestAnimationFrame(): void {
  if (typeof requestAnimationFrame !== 'undefined') {
    return;
  }

  console.warn('requestAnimationFrame not supported, using polyfill');

  let lastTime = 0;

  (window as any).requestAnimationFrame = function(callback: FrameRequestCallback) {
    const currentTime = Date.now();
    const timeToCall = Math.max(0, 16 - (currentTime - lastTime));
    const id = window.setTimeout(() => {
      callback(currentTime + timeToCall);
    }, timeToCall);
    lastTime = currentTime + timeToCall;
    return id;
  };

  (window as any).cancelAnimationFrame = function(id: number) {
    clearTimeout(id);
  };
}

/**
 * 初始化所有 polyfills
 */
export function initPolyfills(): void {
  polyfillResizeObserver();
  polyfillMutationObserver();
  polyfillRequestIdleCallback();
  polyfillRequestAnimationFrame();
}

/**
 * 獲取瀏覽器資訊
 */
export interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  os: string;
  mobile: boolean;
}

/**
 * 檢測瀏覽器資訊
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const info: BrowserInfo = {
    name: 'Unknown',
    version: 'Unknown',
    engine: 'Unknown',
    os: 'Unknown',
    mobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
  };

  // 檢測瀏覽器
  if (/Edge\/(\d+)/.test(ua)) {
    info.name = 'Edge';
    info.version = RegExp.$1;
    info.engine = 'EdgeHTML';
  } else if (/Edg\/(\d+)/.test(ua)) {
    info.name = 'Edge';
    info.version = RegExp.$1;
    info.engine = 'Chromium';
  } else if (/Chrome\/(\d+)/.test(ua)) {
    info.name = 'Chrome';
    info.version = RegExp.$1;
    info.engine = 'Blink';
  } else if (/Safari\/(\d+)/.test(ua) && !/Chrome/.test(ua)) {
    info.name = 'Safari';
    info.version = RegExp.$1;
    info.engine = 'WebKit';
  } else if (/Firefox\/(\d+)/.test(ua)) {
    info.name = 'Firefox';
    info.version = RegExp.$1;
    info.engine = 'Gecko';
  } else if (/MSIE (\d+)/.test(ua) || /Trident.*rv:(\d+)/.test(ua)) {
    info.name = 'IE';
    info.version = RegExp.$1;
    info.engine = 'Trident';
  }

  // 檢測作業系統
  if (/Windows/.test(ua)) {
    info.os = 'Windows';
  } else if (/Mac OS X/.test(ua)) {
    info.os = 'macOS';
  } else if (/Linux/.test(ua)) {
    info.os = 'Linux';
  } else if (/Android/.test(ua)) {
    info.os = 'Android';
  } else if (/iOS|iPhone|iPad|iPod/.test(ua)) {
    info.os = 'iOS';
  }

  return info;
}

/**
 * 檢查是否為支援的瀏覽器
 */
export function isSupportedBrowser(): boolean {
  const browser = detectBrowser();
  
  // 定義最低支援版本
  const minVersions: Record<string, number> = {
    'Chrome': 90,
    'Firefox': 88,
    'Safari': 14,
    'Edge': 90
  };

  const minVersion = minVersions[browser.name];
  if (!minVersion) {
    return false; // 未知瀏覽器
  }

  const version = parseInt(browser.version, 10);
  return version >= minVersion;
}

/**
 * 顯示瀏覽器不支援警告
 */
export function showBrowserWarning(): void {
  const browser = detectBrowser();
  
  if (!isSupportedBrowser()) {
    console.warn(
      `您的瀏覽器 ${browser.name} ${browser.version} 可能不完全支援本系統的所有功能。\n` +
      `建議使用以下瀏覽器的最新版本：\n` +
      `- Chrome 90+\n` +
      `- Firefox 88+\n` +
      `- Safari 14+\n` +
      `- Edge 90+`
    );

    // 可選：顯示 UI 警告
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #fff3cd;
      color: #856404;
      padding: 12px 20px;
      text-align: center;
      z-index: 10000;
      border-bottom: 1px solid #ffeaa7;
    `;
    warning.innerHTML = `
      <strong>瀏覽器兼容性警告：</strong>
      您的瀏覽器版本較舊，可能無法正常使用所有功能。建議升級到最新版本。
      <button onclick="this.parentElement.remove()" style="margin-left: 10px; padding: 4px 12px; cursor: pointer;">
        關閉
      </button>
    `;
    document.body.insertBefore(warning, document.body.firstChild);
  }
}

/**
 * 記錄瀏覽器資訊到控制台
 */
export function logBrowserInfo(): void {
  const browser = detectBrowser();
  const features = detectBrowserFeatures();
  
  console.group('瀏覽器資訊');
  console.log('名稱:', browser.name);
  console.log('版本:', browser.version);
  console.log('引擎:', browser.engine);
  console.log('作業系統:', browser.os);
  console.log('移動設備:', browser.mobile);
  console.log('支援狀態:', isSupportedBrowser() ? '✓ 支援' : '✗ 不支援');
  console.groupEnd();

  console.group('功能支援');
  Object.entries(features).forEach(([feature, supported]) => {
    console.log(`${feature}:`, supported ? '✓' : '✗');
  });
  console.groupEnd();
}
