/**
 * Vitest 測試設置文件
 * 
 * 本文件在所有測試執行前載入，用於設置全局測試環境
 */

import { expect, afterEach } from 'vitest';

// 每個測試後自動清理（如果需要）
afterEach(() => {
  // 清理邏輯
});

// 擴展 expect 匹配器（如果需要）
// 例如：expect.extend({ ... });

// 設置全局測試環境變數
global.console = {
  ...console,
  // 在測試中抑制某些 console 輸出（可選）
  // warn: vi.fn(),
  // error: vi.fn(),
};

// Mock window 物件的某些屬性（如果需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock ResizeObserver（如果測試環境不支援）
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock MutationObserver with functional implementation that triggers callbacks
class MockMutationObserver {
  private callback: MutationCallback;
  private observedElements: WeakMap<Element, { attributes?: boolean; attributeFilter?: string[] }> = new WeakMap();
  
  constructor(callback: MutationCallback) {
    this.callback = callback;
  }

  observe(target: Element, options?: MutationObserverInit) {
    this.observedElements.set(target, {
      attributes: options?.attributes,
      attributeFilter: options?.attributeFilter
    });

    // Store the observer instance on the element for testing purposes
    (target as any).__mutationObserver__ = this;
  }

  // Method to manually trigger the callback (for testing)
  trigger(target: Element, attributeName: string, oldValue: string | null = null) {
    const mutations: MutationRecord[] = [{
      type: 'attributes',
      target,
      attributeName,
      oldValue,
      addedNodes: [] as any,
      removedNodes: [] as any,
      previousSibling: null,
      nextSibling: null,
      attributeNamespace: null
    }];
    
    // Use setTimeout to simulate async behavior
    setTimeout(() => {
      this.callback(mutations, this as any);
    }, 0);
  }

  unobserve(target: Element) {
    this.observedElements.delete(target);
    delete (target as any).__mutationObserver__;
  }

  disconnect() {
    // Clear all observations
  }

  takeRecords() {
    return [];
  }
}

global.MutationObserver = MockMutationObserver as any;

// Mock IntersectionObserver（如果測試環境不支援）
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
};

// 設置測試用的 localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

// 設置測試用的 location mock
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    host: 'localhost:3000',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: '',
    reload: () => {},
    replace: () => {},
    assign: () => {}
  },
  writable: true
});

// 設置測試用的 navigator mock
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    language: 'zh-TW',
    languages: ['zh-TW', 'zh', 'en'],
    onLine: true,
    cookieEnabled: true
  },
  writable: true
});

// 設置測試用的 document.body 尺寸
Object.defineProperty(document.body, 'clientWidth', {
  value: 1920,
  writable: true
});

Object.defineProperty(document.body, 'clientHeight', {
  value: 1080,
  writable: true
});

// 設置測試用的 window 尺寸
Object.defineProperty(window, 'innerWidth', {
  value: 1920,
  writable: true
});

Object.defineProperty(window, 'innerHeight', {
  value: 1080,
  writable: true
});

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = function() {
  return {
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0,
    toJSON: () => {}
  };
};

// Mock getComputedStyle
window.getComputedStyle = () => {
  return {
    getPropertyValue: () => '0px',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px'
  } as CSSStyleDeclaration;
};

console.log('✓ Vitest 測試環境設置完成');
