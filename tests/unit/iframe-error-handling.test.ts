/**
 * Iframe 載入錯誤處理單元測試
 * 
 * 測試 iframe 組件的錯誤處理功能
 * Requirements: 10.4
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createStore } from 'vuex';
import IframeComponent from '../../src/components/oco/gui/iframe/Index.vue';

describe('Iframe Error Handling', () => {
  let wrapper: VueWrapper<any>;
  let store: any;

  beforeEach(() => {
    // 創建測試用的 Vuex store
    store = createStore({
      state: {
        gui: {
          guiDetail: {
            DataContentJson: JSON.stringify({
              url: 'http://example.com/test',
              serverUrl: 'http://example.com',
              iframeFit: 'contain-center',
              iframeHeightMode: 'px',
              iframeHeightValue: 800,
              designResolution: { width: 1920, height: 1080 },
              margins: { top: 0, right: 0, bottom: 0, left: 0 }
            })
          }
        }
      }
    });

    // 創建測試用的 DOM 結構
    document.body.innerHTML = `
      <div id="app">
        <div class="ant-layout">
          <div class="ant-layout-sider" style="width: 200px;">Sidebar</div>
          <div class="ant-layout">
            <div class="ant-layout-header" style="height: 64px;">Header</div>
            <div class="ant-layout-content" style="padding: 24px;">Content</div>
            <div class="ant-layout-footer" style="height: 50px;">Footer</div>
          </div>
        </div>
      </div>
    `;
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    document.body.innerHTML = '';
  });

  describe('載入失敗時顯示錯誤訊息', () => {
    it('should display error placeholder when iframe fails to load', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      // 等待組件掛載
      await wrapper.vm.$nextTick();

      // 初始狀態：應該顯示 iframe，不顯示錯誤
      expect(wrapper.find('iframe').exists()).toBe(true);
      expect(wrapper.find('.error-placeholder').exists()).toBe(false);

      // 模擬 iframe 載入錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');

      // 等待 DOM 更新
      await wrapper.vm.$nextTick();

      // 應該隱藏 iframe，顯示錯誤佔位符
      expect(wrapper.find('iframe').exists()).toBe(false);
      expect(wrapper.find('.error-placeholder').exists()).toBe(true);
    });

    it('should display error icon in error placeholder', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查錯誤圖標
      const errorIcon = wrapper.find('.error-icon');
      expect(errorIcon.exists()).toBe(true);
      expect(errorIcon.text()).toBe('⚠️');
    });

    it('should display error title', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查錯誤標題
      const errorPlaceholder = wrapper.find('.error-placeholder');
      expect(errorPlaceholder.find('h3').text()).toBe('無法載入內容');
    });

    it('should display error message', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查錯誤訊息
      const errorMessage = wrapper.find('.error-message');
      expect(errorMessage.exists()).toBe(true);
      expect(errorMessage.text()).toBe('載入失敗，請檢查網址和網路連線');
    });

    it('should display troubleshooting suggestions', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查故障排除建議
      const troubleshooting = wrapper.find('.troubleshooting');
      expect(troubleshooting.exists()).toBe(true);
      expect(troubleshooting.find('h4').text()).toBe('故障排除建議：');

      // 檢查建議列表
      const suggestions = troubleshooting.findAll('li');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].text()).toContain('檢查 OCOGUI 伺服器是否正在運行');
    });

    it('should display the failed URL in troubleshooting', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查是否顯示失敗的 URL
      const troubleshooting = wrapper.find('.troubleshooting');
      const urlSuggestion = troubleshooting.findAll('li')[1];
      expect(urlSuggestion.text()).toContain('確認網址是否正確');
      expect(urlSuggestion.text()).toContain('http://');
    });

    it('should log error to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      const errorEvent = new Event('error');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查是否記錄到 console
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Iframe load error:',
        expect.any(Object)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('重新載入功能', () => {
    it('should display retry button in error state', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查重試按鈕
      const retryButton = wrapper.find('.retry-button');
      expect(retryButton.exists()).toBe(true);
      expect(retryButton.text()).toBe('重新載入');
    });

    it('should hide error and show iframe when retry button is clicked', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 確認錯誤狀態
      expect(wrapper.find('.error-placeholder').exists()).toBe(true);
      expect(wrapper.find('iframe').exists()).toBe(false);

      // 點擊重試按鈕
      const retryButton = wrapper.find('.retry-button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();

      // 應該隱藏錯誤，顯示 iframe
      expect(wrapper.find('.error-placeholder').exists()).toBe(false);
      expect(wrapper.find('iframe').exists()).toBe(true);
    });

    it('should reset error message when retry is clicked', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查錯誤訊息存在
      expect(wrapper.vm.errorMessage).toBe('載入失敗，請檢查網址和網路連線');

      // 點擊重試按鈕
      const retryButton = wrapper.find('.retry-button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();

      // 錯誤訊息應該被清空
      expect(wrapper.vm.errorMessage).toBe('');
    });

    it('should reset loadError flag when retry is clicked', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查錯誤標記
      expect(wrapper.vm.loadError).toBe(true);

      // 點擊重試按鈕
      const retryButton = wrapper.find('.retry-button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();

      // 錯誤標記應該被重置
      expect(wrapper.vm.loadError).toBe(false);
    });

    it('should reload iframe with same URL when retry is clicked', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 獲取初始 URL
      const initialIframe = wrapper.find('iframe');
      const initialSrc = initialIframe.attributes('src');

      // 觸發錯誤
      await initialIframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 點擊重試按鈕
      const retryButton = wrapper.find('.retry-button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();

      // 檢查新的 iframe 是否使用相同的 URL
      const newIframe = wrapper.find('iframe');
      expect(newIframe.attributes('src')).toBe(initialSrc);
    });

    it('should allow multiple retry attempts', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 第一次錯誤
      let iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.error-placeholder').exists()).toBe(true);

      // 第一次重試
      let retryButton = wrapper.find('.retry-button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('iframe').exists()).toBe(true);

      // 第二次錯誤
      iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('.error-placeholder').exists()).toBe(true);

      // 第二次重試
      retryButton = wrapper.find('.retry-button');
      await retryButton.trigger('click');
      await wrapper.vm.$nextTick();
      expect(wrapper.find('iframe').exists()).toBe(true);
    });
  });

  describe('錯誤狀態下的 UI 樣式', () => {
    it('should apply correct CSS classes to error placeholder', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查 CSS 類別
      const errorPlaceholder = wrapper.find('.error-placeholder');
      expect(errorPlaceholder.exists()).toBe(true);
      expect(errorPlaceholder.classes()).toContain('error-placeholder');
    });

    it('should have retry button with correct styling class', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 檢查重試按鈕的樣式類別
      const retryButton = wrapper.find('.retry-button');
      expect(retryButton.exists()).toBe(true);
      expect(retryButton.classes()).toContain('retry-button');
    });
  });

  describe('正常載入狀態', () => {
    it('should not display error placeholder when iframe loads successfully', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 模擬成功載入
      const iframe = wrapper.find('iframe');
      await iframe.trigger('load');
      await wrapper.vm.$nextTick();

      // 不應該顯示錯誤
      expect(wrapper.find('.error-placeholder').exists()).toBe(false);
      expect(wrapper.find('iframe').exists()).toBe(true);
    });

    it('should maintain iframe display after successful load', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 模擬成功載入
      const iframe = wrapper.find('iframe');
      await iframe.trigger('load');
      await wrapper.vm.$nextTick();

      // 檢查 loadError 標記
      expect(wrapper.vm.loadError).toBe(false);
      expect(wrapper.vm.errorMessage).toBe('');
    });
  });

  describe('邊界情況', () => {
    it('should handle error when iframe ref is null', async () => {
      wrapper = mount(IframeComponent, {
        global: {
          plugins: [store]
        }
      });

      await wrapper.vm.$nextTick();

      // 觸發錯誤
      const iframe = wrapper.find('iframe');
      await iframe.trigger('error');
      await wrapper.vm.$nextTick();

      // 設置 iframe ref 為 null
      wrapper.vm.ifr = null;

      // 點擊重試不應該拋出錯誤
      const retryButton = wrapper.find('.retry-button');
      await expect(async () => {
        await retryButton.trigger('click');
        await wrapper.vm.$nextTick();
      }).not.toThrow();
    });

    it('should handle missing URL gracefully', async () => {
      // 創建沒有 URL 的 store
      const emptyStore = createStore({
        state: {
          gui: {
            guiDetail: {
              DataContentJson: JSON.stringify({
                url: null,
                serverUrl: 'http://example.com',
                iframeFit: 'contain-center',
                iframeHeightMode: 'px',
                iframeHeightValue: 800,
                designResolution: { width: 1920, height: 1080 },
                margins: { top: 0, right: 0, bottom: 0, left: 0 }
              })
            }
          }
        }
      });

      wrapper = mount(IframeComponent, {
        global: {
          plugins: [emptyStore]
        }
      });

      await wrapper.vm.$nextTick();

      // 組件應該正常渲染，不拋出錯誤
      expect(wrapper.exists()).toBe(true);
    });
  });
});
