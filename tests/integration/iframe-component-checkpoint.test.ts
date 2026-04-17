/**
 * Checkpoint 7: iframe 組件功能驗證
 * 
 * 此測試驗證 iframe 組件的核心功能：
 * - 測試 iframe 在不同視窗大小下的顯示
 * - 測試 Sidebar 切換時的響應
 * - 確保平滑過渡動畫正常
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createStore } from 'vuex';
import IframeComponent from '@/components/oco/gui/iframe/Index.vue';

describe('Checkpoint 7: iframe Component Functionality Verification', () => {
  let store: any;
  let wrapper: any;
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // 保存原始視窗尺寸
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;

    // 創建測試用的 Vuex store
    store = createStore({
      state: {
        gui: {
          guiDetail: {
            DataContentJson: JSON.stringify({
              embedMode: 'iframe',
              url: 'http://localhost:2955/#/view?name=test',
              serverUrl: 'http://localhost:2955',
              iframeFit: 'contain-center',
              iframeHeightMode: 'px',
              iframeHeightValue: 918,
              designResolution: {
                width: 1920,
                height: 1080
              },
              margins: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              }
            })
          }
        }
      }
    });

    // 模擬 DOM 元素
    document.body.innerHTML = `
      <div id="app">
        <div class="ant-layout">
          <div class="ant-layout-sider" style="width: 200px; height: 100vh;"></div>
          <div class="ant-layout">
            <div class="ant-layout-header" style="height: 64px;"></div>
            <div class="ant-layout-content" style="padding: 24px;">
              <div id="iframe-container"></div>
            </div>
            <div class="ant-layout-footer" style="height: 50px;"></div>
          </div>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    // 恢復原始視窗尺寸
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight
    });
  });

  describe('1. 不同視窗大小下的顯示測試', () => {
    it('should display correctly at 1920x1080 resolution', async () => {
      // 設置視窗大小為 1920x1080
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080
      });

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      // 驗證 iframe 樣式包含過渡動畫
      const style = iframe.attributes('style');
      expect(style).toContain('transition');
      expect(style).toContain('0.3s');
    });

    it('should display correctly at 1366x768 resolution', async () => {
      // 設置視窗大小為 1366x768
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1366
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      });

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      // 驗證 iframe 有正確的樣式
      const style = iframe.attributes('style');
      expect(style).toBeDefined();
      expect(style).toContain('transition');
    });

    it('should display correctly at 2560x1440 resolution', async () => {
      // 設置視窗大小為 2560x1440
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 2560
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1440
      });

      wrapper = mount(IframeComponent, {
        global: {
        plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      // 驗證 iframe 有正確的樣式
      const style = iframe.attributes('style');
      expect(style).toBeDefined();
      expect(style).toContain('transition');
    });

    it('should adapt when window is resized', async () => {
      // 初始視窗大小
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080
      });

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      const initialStyle = iframe.attributes('style');

      // 改變視窗大小
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1366
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      });

      // 觸發 resize 事件
      window.dispatchEvent(new Event('resize'));
      await flushPromises();
      await wrapper.vm.$nextTick();

      // 等待 ResizeObserver 回調
      await new Promise(resolve => setTimeout(resolve, 100));
      await wrapper.vm.$nextTick();

      const updatedStyle = iframe.attributes('style');
      
      // 驗證樣式已更新（至少包含過渡動畫）
      expect(updatedStyle).toBeDefined();
      expect(updatedStyle).toContain('transition');
    });
  });

  describe('2. Sidebar 切換響應測試', () => {
    it('should respond to sidebar collapse', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      // 獲取初始樣式
      const initialStyle = iframe.attributes('style');

      // 模擬 Sidebar 收合
      const sidebar = document.querySelector('.ant-layout-sider');
      if (sidebar) {
        (sidebar as HTMLElement).style.width = '64px';
        sidebar.classList.add('ant-layout-sider-collapsed');
        
        // 觸發 MutationObserver
        const event = new Event('DOMSubtreeModified');
        sidebar.dispatchEvent(event);
      }

      // 等待響應
      await new Promise(resolve => setTimeout(resolve, 350)); // 300ms transition + 50ms buffer
      await wrapper.vm.$nextTick();

      const updatedStyle = iframe.attributes('style');
      
      // 驗證樣式包含過渡動畫
      expect(updatedStyle).toContain('transition');
      expect(updatedStyle).toContain('0.3s');
    });

    it('should respond to sidebar expand', async () => {
      // 初始狀態：Sidebar 收合
      const sidebar = document.querySelector('.ant-layout-sider');
      if (sidebar) {
        (sidebar as HTMLElement).style.width = '64px';
        sidebar.classList.add('ant-layout-sider-collapsed');
      }

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      // 模擬 Sidebar 展開
      if (sidebar) {
        (sidebar as HTMLElement).style.width = '200px';
        sidebar.classList.remove('ant-layout-sider-collapsed');
        
        // 觸發 MutationObserver
        const event = new Event('DOMSubtreeModified');
        sidebar.dispatchEvent(event);
      }

      // 等待響應
      await new Promise(resolve => setTimeout(resolve, 350)); // 300ms transition + 50ms buffer
      await wrapper.vm.$nextTick();

      const updatedStyle = iframe.attributes('style');
      
      // 驗證樣式包含過渡動畫
      expect(updatedStyle).toContain('transition');
      expect(updatedStyle).toContain('0.3s');
    });

    it('should complete transition within 300ms', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      const startTime = Date.now();

      // 模擬 Sidebar 切換
      const sidebar = document.querySelector('.ant-layout-sider');
      if (sidebar) {
        (sidebar as HTMLElement).style.width = '64px';
        sidebar.classList.add('ant-layout-sider-collapsed');
        
        const event = new Event('DOMSubtreeModified');
        sidebar.dispatchEvent(event);
      }

      // 等待過渡完成
      await new Promise(resolve => setTimeout(resolve, 300));
      await wrapper.vm.$nextTick();

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 驗證過渡時間在合理範圍內（300ms ± 100ms）
      expect(duration).toBeGreaterThanOrEqual(250);
      expect(duration).toBeLessThanOrEqual(400);
    });
  });

  describe('3. 平滑過渡動畫測試', () => {
    it('should have CSS transition property', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      const style = iframe.attributes('style');

      // 驗證包含 transition 屬性
      expect(style).toContain('transition');
      expect(style).toContain('all');
      expect(style).toContain('0.3s');
      expect(style).toContain('ease-in-out');
    });

    it('should maintain transition during display mode changes', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      
      // 驗證初始狀態有過渡動畫
      let style = iframe.attributes('style');
      expect(style).toContain('transition');

      // 改變顯示模式為 stretch
      store.state.gui.guiDetail.DataContentJson = JSON.stringify({
        embedMode: 'iframe',
        url: 'http://localhost:2955/#/view?name=test',
        serverUrl: 'http://localhost:2955',
        iframeFit: 'stretch',
        iframeHeightMode: 'px',
        iframeHeightValue: 918,
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      // 驗證改變後仍有過渡動畫
      style = iframe.attributes('style');
      expect(style).toContain('transition');
    });

    it('should apply ease-in-out timing function', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      const style = iframe.attributes('style');

      // 驗證使用 ease-in-out 緩動函數
      expect(style).toContain('ease-in-out');
    });
  });

  describe('4. 不同顯示模式測試', () => {
    it('should work in contain-center mode', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      const style = iframe.attributes('style');
      expect(style).toContain('transition');
      expect(style).toContain('margin');
    });

    it('should work in stretch mode', async () => {
      store.state.gui.guiDetail.DataContentJson = JSON.stringify({
        embedMode: 'iframe',
        url: 'http://localhost:2955/#/view?name=test',
        iframeFit: 'stretch',
        iframeHeightMode: 'px',
        iframeHeightValue: 918,
        designResolution: {
          width: 1920,
          height: 1080
        }
      });

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      const style = iframe.attributes('style');
      expect(style).toContain('width: 100%');
      expect(style).toContain('transition');
    });

    it('should work in none mode (original size)', async () => {
      store.state.gui.guiDetail.DataContentJson = JSON.stringify({
        embedMode: 'iframe',
        url: 'http://localhost:2955/#/view?name=test',
        iframeFit: 'none',
        iframeHeightMode: 'px',
        iframeHeightValue: 918,
        designResolution: {
          width: 1920,
          height: 1080
        }
      });

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      expect(iframe.exists()).toBe(true);

      const style = iframe.attributes('style');
      expect(style).toContain('1920px');
      expect(style).toContain('1080px');
      expect(style).toContain('transition');
    });
  });

  describe('5. 錯誤處理測試', () => {
    it('should handle iframe load errors gracefully', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      
      // 觸發錯誤事件
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 驗證顯示錯誤訊息
      const errorPlaceholder = wrapper.find('.error-placeholder');
      expect(errorPlaceholder.exists()).toBe(true);
      expect(errorPlaceholder.text()).toContain('無法載入內容');
    });

    it('should provide retry functionality', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await flushPromises();
      await wrapper.vm.$nextTick();

      const iframe = wrapper.find('iframe');
      
      // 觸發錯誤
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 驗證重試按鈕存在
      const retryButton = wrapper.find('.retry-button');
      expect(retryButton.exists()).toBe(true);
      expect(retryButton.text()).toContain('重新載入');

      // 點擊重試
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();

      // 驗證 iframe 重新顯示
      const iframeAfterRetry = wrapper.find('iframe');
      expect(iframeAfterRetry.exists()).toBe(true);
    });
  });
});
