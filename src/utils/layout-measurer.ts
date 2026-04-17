/**
 * Layout Measurer - 佈局測量器
 * 
 * 負責測量當前頁面佈局的各項尺寸，包括：
 * - 視窗尺寸
 * - Sidebar 寬度和狀態
 * - Header 和 Footer 高度
 * - 內容區域邊距
 * 
 * 提供響應式監聽功能，當佈局變化時自動觸發回調
 */

import type {
  LayoutMeasurements,
  LayoutMeasurer as ILayoutMeasurer,
  ViewportSize,
  SidebarInfo,
  FixedElementInfo,
  Padding
} from '../types/iframe-config';
import { DEFAULT_MEASUREMENTS } from '../types/iframe-config';
import { debounce, rafThrottle } from './performance';

/**
 * 佈局測量器實現類
 */
export class LayoutMeasurer implements ILayoutMeasurer {
  private changeCallbacks: Array<(measurements: LayoutMeasurements) => void> = [];
  private mutationObserver: MutationObserver | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private resizeHandler: (() => void) | null = null;
  private isDisposed = false;

  /**
   * 測量當前佈局
   * @returns 測量結果
   */
  measure(): LayoutMeasurements {
    try {
      return {
        viewport: this.measureViewport(),
        sidebar: this.measureSidebar(),
        header: this.measureHeader(),
        footer: this.measureFooter(),
        contentPadding: this.measureContentPadding()
      };
    } catch (error) {
      console.error('Layout measurement error:', error);
      // 返回預設值作為降級方案
      return { ...DEFAULT_MEASUREMENTS };
    }
  }

  /**
   * 測量視窗尺寸
   * @returns 視窗尺寸
   */
  private measureViewport(): ViewportSize {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  /**
   * 測量 Sidebar 資訊
   * @returns Sidebar 資訊
   */
  private measureSidebar(): SidebarInfo {
    // 嘗試多個可能的 Sidebar 選擇器
    const selectors = [
      '.ant-layout-sider',
      '.sidebar',
      '[class*="sidebar"]',
      '[class*="Sidebar"]',
      '.layout-sider',
      '#sidebar'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        const collapsed = this.isSidebarCollapsed(element);
        
        return {
          width: rect.width,
          collapsed,
          collapsedWidth: collapsed ? rect.width : 64
        };
      }
    }

    // 降級：使用預設值
    console.warn('Sidebar element not found, using default values');
    return {
      width: DEFAULT_MEASUREMENTS.sidebar.width,
      collapsed: DEFAULT_MEASUREMENTS.sidebar.collapsed,
      collapsedWidth: DEFAULT_MEASUREMENTS.sidebar.collapsedWidth
    };
  }

  /**
   * 判斷 Sidebar 是否收合
   * @param element Sidebar 元素
   * @returns 是否收合
   */
  private isSidebarCollapsed(element: HTMLElement): boolean {
    // 檢查常見的收合狀態類名
    const collapsedClasses = [
      'collapsed',
      'ant-layout-sider-collapsed',
      'is-collapsed',
      'sidebar-collapsed'
    ];

    for (const className of collapsedClasses) {
      if (element.classList.contains(className)) {
        return true;
      }
    }

    // 檢查寬度（如果寬度小於 100px，可能是收合狀態）
    const rect = element.getBoundingClientRect();
    if (rect.width < 100) {
      return true;
    }

    return false;
  }

  /**
   * 測量 Header 高度
   * @returns Header 資訊
   */
  private measureHeader(): FixedElementInfo {
    // 嘗試多個可能的 Header 選擇器
    const selectors = [
      '.ant-layout-header',
      '.header',
      '[class*="header"]',
      '[class*="Header"]',
      '.layout-header',
      '#header',
      'header'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        return {
          height: rect.height
        };
      }
    }

    // 降級：使用預設值
    console.warn('Header element not found, using default value');
    return {
      height: DEFAULT_MEASUREMENTS.header.height
    };
  }

  /**
   * 測量 Footer 高度
   * @returns Footer 資訊
   */
  private measureFooter(): FixedElementInfo {
    // 嘗試多個可能的 Footer 選擇器
    const selectors = [
      '.ant-layout-footer',
      '.footer',
      '[class*="footer"]',
      '[class*="Footer"]',
      '.layout-footer',
      '#footer',
      'footer'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        return {
          height: rect.height
        };
      }
    }

    // 降級：使用預設值
    console.warn('Footer element not found, using default value');
    return {
      height: DEFAULT_MEASUREMENTS.footer.height
    };
  }

  /**
   * 測量內容區域邊距
   * @returns 內容邊距
   */
  private measureContentPadding(): Padding {
    // 嘗試多個可能的內容區域選擇器
    const selectors = [
      '.ant-layout-content',
      '.content',
      '[class*="content"]',
      '[class*="Content"]',
      '.layout-content',
      '#content',
      'main'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        const styles = window.getComputedStyle(element);
        const padding = {
          top: parseFloat(styles.paddingTop) || 0,
          right: parseFloat(styles.paddingRight) || 0,
          bottom: parseFloat(styles.paddingBottom) || 0,
          left: parseFloat(styles.paddingLeft) || 0
        };
        
        // 調試：輸出測量到的 padding
        // console.log('[LayoutMeasurer] contentPadding from', selector, ':', padding);
        
        return padding;
      }
    }

    // 降級：使用預設值（0）
    console.warn('Content element not found, using zero padding');
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  /**
   * 監聽佈局變化
   * @param callback 變化時的回調函數
   */
  onLayoutChange(callback: (measurements: LayoutMeasurements) => void): void {
    if (this.isDisposed) {
      console.warn('LayoutMeasurer has been disposed, cannot add listener');
      return;
    }

    // 添加回調到列表
    this.changeCallbacks.push(callback);

    // 如果是第一個監聽器，初始化觀察器
    if (this.changeCallbacks.length === 1) {
      this.setupObservers();
    }
  }

  /**
   * 設置觀察器
   */
  private setupObservers(): void {
    // 設置 MutationObserver 監聽 Sidebar 狀態變化
    this.setupMutationObserver();

    // 設置 ResizeObserver 監聽容器大小變化
    this.setupResizeObserver();

    // 設置 window.resize 作為降級方案
    this.setupResizeHandler();
  }

  /**
   * 設置 MutationObserver
   */
  private setupMutationObserver(): void {
    try {
      // 查找 Sidebar 元素
      const sidebarSelectors = [
        '.ant-layout-sider',
        '.sidebar',
        '[class*="sidebar"]'
      ];

      let sidebarElement: HTMLElement | null = null;
      for (const selector of sidebarSelectors) {
        sidebarElement = document.querySelector(selector) as HTMLElement;
        if (sidebarElement) break;
      }

      if (!sidebarElement) {
        console.warn('Sidebar element not found for MutationObserver');
        return;
      }

      // 創建 MutationObserver
      this.mutationObserver = new MutationObserver(() => {
        this.notifyChange();
      });

      // 開始觀察 class 和 style 變化
      this.mutationObserver.observe(sidebarElement, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    } catch (error) {
      console.error('Failed to setup MutationObserver:', error);
    }
  }

  /**
   * 設置 ResizeObserver
   */
  private setupResizeObserver(): void {
    try {
      // 檢查瀏覽器是否支援 ResizeObserver
      if (typeof ResizeObserver === 'undefined') {
        console.warn('ResizeObserver not supported, using fallback');
        return;
      }

      // 創建 ResizeObserver
      this.resizeObserver = new ResizeObserver(() => {
        this.notifyChange();
      });

      // 觀察 body 元素的大小變化
      this.resizeObserver.observe(document.body);

      // 觀察 Sidebar 元素的大小變化
      const sidebarSelectors = [
        '.ant-layout-sider',
        '.sidebar',
        '[class*="sidebar"]'
      ];

      for (const selector of sidebarSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          this.resizeObserver.observe(element);
          break;
        }
      }
    } catch (error) {
      console.error('Failed to setup ResizeObserver:', error);
    }
  }

  /**
   * 設置 window.resize 處理器（降級方案）
   */
  private setupResizeHandler(): void {
    // 使用 rafThrottle 優化性能，確保在瀏覽器重繪時執行
    this.resizeHandler = rafThrottle(() => {
      this.notifyChange();
    });

    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * 通知所有監聽器佈局已變化
   */
  private notifyChange(): void {
    if (this.isDisposed) {
      return;
    }

    const measurements = this.measure();
    
    // 通知所有回調
    for (const callback of this.changeCallbacks) {
      try {
        callback(measurements);
      } catch (error) {
        console.error('Error in layout change callback:', error);
      }
    }
  }

  /**
   * 停止監聽並清理資源
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }

    this.isDisposed = true;

    // 清理 MutationObserver
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // 清理 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // 清理 resize 處理器
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }

    // 清空回調列表
    this.changeCallbacks = [];
  }
}

/**
 * 創建佈局測量器實例
 * @returns 佈局測量器實例
 */
export function createLayoutMeasurer(): LayoutMeasurer {
  return new LayoutMeasurer();
}

/**
 * 預設導出
 */
export default LayoutMeasurer;
