/**
 * Property-Based Tests for Real-time Preview Updates
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 7: 即時預覽更新
 * Validates: Requirements 4.1
 * 
 * 測試參數變化時預覽即時更新
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { mount } from '@vue/test-utils';
import PreviewPanel from '../../src/components/oco/gui/setting/PreviewPanel.vue';
import { nextTick } from 'vue';

describe('Property: Real-time Preview Updates', () => {
  /**
   * Feature: iframe-auto-fit-enhancement, Property 7: 即時預覽更新
   * 
   * For any 配置參數的變化（顯示模式、高度值、邊距等），
   * 預覽區域應該即時反映這些變化
   * 
   * 這個屬性確保：
   * 1. 當顯示模式改變時，預覽的 iframe 樣式相應更新
   * 2. 當高度模式或高度值改變時，預覽的尺寸計算相應更新
   * 3. 當 Sidebar 狀態改變時，預覽的可用空間和尺寸相應更新
   * 4. 所有變化都是即時的（響應式的）
   */
  it('should update preview immediately when display mode changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('none', 'contain-center', 'stretch'),
        fc.constantFrom('none', 'contain-center', 'stretch'),
        async (initialMode, newMode) => {
          // 跳過相同模式的測試
          if (initialMode === newMode) return;

          // 創建初始配置
          const initialConfig = {
            iframeFit: initialMode,
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          // 掛載組件
          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          // 等待初始渲染
          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始狀態
          const initialDisplayMode = wrapper.vm.displayModeText;

          // 更新配置
          await wrapper.setProps({
            config: {
              ...initialConfig,
              iframeFit: newMode
            }
          });

          // 等待更新
          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證顯示模式文字已更新
          const newDisplayMode = wrapper.vm.displayModeText;
          expect(newDisplayMode).not.toBe(initialDisplayMode);

          // 驗證新的顯示模式對應正確的文字
          const expectedTexts = {
            'none': '原尺寸（可捲動）',
            'contain-center': '等比例置中',
            'stretch': '拉伸滿版'
          };
          expect(newDisplayMode).toBe(expectedTexts[newMode]);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：高度模式變化時預覽即時更新
   * 
   * 驗證當高度模式改變時，預覽的尺寸計算會相應更新
   */
  it('should update preview immediately when height mode changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('px', 'vh', 'auto'),
        fc.integer({ min: 200, max: 2000 }),
        async (heightMode, heightValue) => {
          const config = {
            iframeFit: 'contain-center',
            iframeHeightMode: heightMode,
            iframeHeightValue: heightMode !== 'auto' ? heightValue : undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始尺寸
          const initialWidth = wrapper.vm.calculatedWidth;
          const initialHeight = wrapper.vm.calculatedHeight;

          // 驗證尺寸為正數
          expect(initialWidth).toBeGreaterThan(0);
          expect(initialHeight).toBeGreaterThan(0);

          // 更改為不同的高度模式
          const newHeightMode = heightMode === 'auto' ? 'px' : 'auto';
          await wrapper.setProps({
            config: {
              ...config,
              iframeHeightMode: newHeightMode,
              iframeHeightValue: newHeightMode === 'px' ? 918 : undefined
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取新尺寸
          const newWidth = wrapper.vm.calculatedWidth;
          const newHeight = wrapper.vm.calculatedHeight;

          // 驗證尺寸仍為正數
          expect(newWidth).toBeGreaterThan(0);
          expect(newHeight).toBeGreaterThan(0);

          // 驗證尺寸已更新（對於 contain-center 模式，尺寸應該保持 16:9 比例）
          if (config.iframeFit === 'contain-center') {
            const ratio = newWidth / newHeight;
            expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.01);
          }

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：Sidebar 狀態變化時預覽即時更新
   * 
   * 驗證當 Sidebar 展開/收合時，預覽的可用空間和尺寸會相應更新
   */
  it('should update preview immediately when sidebar state changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (initialSidebarCollapsed) => {
          const config = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config,
              sidebarCollapsed: initialSidebarCollapsed
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始可用寬度
          const initialAvailableWidth = wrapper.vm.availableWidth;
          const initialCalculatedWidth = wrapper.vm.calculatedWidth;

          // 切換 Sidebar 狀態
          await wrapper.setProps({
            sidebarCollapsed: !initialSidebarCollapsed
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取新的可用寬度
          const newAvailableWidth = wrapper.vm.availableWidth;
          const newCalculatedWidth = wrapper.vm.calculatedWidth;

          // 驗證可用寬度已改變
          expect(newAvailableWidth).not.toBe(initialAvailableWidth);

          // 驗證計算出的寬度也相應改變
          // 當 Sidebar 從展開變為收合時，可用寬度應該增加
          // 當 Sidebar 從收合變為展開時，可用寬度應該減少
          if (initialSidebarCollapsed) {
            // 從收合變為展開：可用寬度減少
            expect(newAvailableWidth).toBeLessThan(initialAvailableWidth);
          } else {
            // 從展開變為收合：可用寬度增加
            expect(newAvailableWidth).toBeGreaterThan(initialAvailableWidth);
          }

          // 驗證計算出的寬度也相應變化
          if (config.iframeFit === 'contain-center') {
            // 在等比例模式下，寬度應該隨可用空間變化
            if (initialSidebarCollapsed) {
              expect(newCalculatedWidth).toBeLessThanOrEqual(initialCalculatedWidth);
            } else {
              expect(newCalculatedWidth).toBeGreaterThanOrEqual(initialCalculatedWidth);
            }
          }

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：多個參數同時變化時預覽正確更新
   * 
   * 驗證當多個配置參數同時改變時，預覽能正確反映所有變化
   */
  it('should update preview correctly when multiple parameters change simultaneously', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('none', 'contain-center', 'stretch'),
        fc.constantFrom('px', 'vh', 'auto'),
        fc.integer({ min: 200, max: 2000 }),
        fc.boolean(),
        async (displayMode, heightMode, heightValue, sidebarCollapsed) => {
          const config = {
            iframeFit: displayMode,
            iframeHeightMode: heightMode,
            iframeHeightValue: heightMode !== 'auto' ? heightValue : undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config,
              sidebarCollapsed
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證初始狀態
          expect(wrapper.vm.displayModeText).toBeDefined();
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);
          expect(wrapper.vm.availableWidth).toBeGreaterThan(0);
          expect(wrapper.vm.availableHeight).toBeGreaterThan(0);

          // 同時更改多個參數
          const newDisplayMode = displayMode === 'contain-center' ? 'stretch' : 'contain-center';
          const newHeightMode = heightMode === 'auto' ? 'px' : 'auto';
          const newSidebarCollapsed = !sidebarCollapsed;

          await wrapper.setProps({
            config: {
              iframeFit: newDisplayMode,
              iframeHeightMode: newHeightMode,
              iframeHeightValue: newHeightMode === 'px' ? 918 : undefined
            },
            sidebarCollapsed: newSidebarCollapsed
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證所有值都已更新且有效
          expect(wrapper.vm.displayModeText).toBeDefined();
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);
          expect(wrapper.vm.availableWidth).toBeGreaterThan(0);
          expect(wrapper.vm.availableHeight).toBeGreaterThan(0);

          // 驗證顯示模式已更新
          const expectedTexts = {
            'none': '原尺寸（可捲動）',
            'contain-center': '等比例置中',
            'stretch': '拉伸滿版'
          };
          expect(wrapper.vm.displayModeText).toBe(expectedTexts[newDisplayMode]);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：預覽尺寸資訊的響應性
   * 
   * 驗證當配置改變時，顯示的尺寸資訊（像素值和百分比）也會即時更新
   */
  it('should update size information immediately when configuration changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('contain-center', 'stretch'),
        fc.boolean(),
        async (displayMode, sidebarCollapsed) => {
          const config = {
            iframeFit: displayMode,
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config,
              sidebarCollapsed
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始尺寸資訊
          const initialWidth = wrapper.vm.calculatedWidth;
          const initialHeight = wrapper.vm.calculatedHeight;
          const initialWidthPercentage = wrapper.vm.widthPercentage;
          const initialHeightPercentage = wrapper.vm.heightPercentage;

          // 驗證初始值有效
          expect(initialWidth).toBeGreaterThan(0);
          expect(initialHeight).toBeGreaterThan(0);
          expect(initialWidthPercentage).toBeGreaterThan(0);
          expect(initialWidthPercentage).toBeLessThanOrEqual(100);
          expect(initialHeightPercentage).toBeGreaterThan(0);
          expect(initialHeightPercentage).toBeLessThanOrEqual(100);

          // 更改配置
          const newDisplayMode = displayMode === 'contain-center' ? 'stretch' : 'contain-center';
          await wrapper.setProps({
            config: {
              ...config,
              iframeFit: newDisplayMode
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取新的尺寸資訊
          const newWidth = wrapper.vm.calculatedWidth;
          const newHeight = wrapper.vm.calculatedHeight;
          const newWidthPercentage = wrapper.vm.widthPercentage;
          const newHeightPercentage = wrapper.vm.heightPercentage;

          // 驗證新值有效
          expect(newWidth).toBeGreaterThan(0);
          expect(newHeight).toBeGreaterThan(0);
          expect(newWidthPercentage).toBeGreaterThan(0);
          expect(newWidthPercentage).toBeLessThanOrEqual(100);
          expect(newHeightPercentage).toBeGreaterThan(0);
          expect(newHeightPercentage).toBeLessThanOrEqual(100);

          // 驗證百分比計算正確
          const availableWidth = wrapper.vm.availableWidth;
          const availableHeight = wrapper.vm.availableHeight;
          
          if (availableWidth > 0) {
            const expectedWidthPercentage = Math.round((newWidth / availableWidth) * 100);
            expect(newWidthPercentage).toBe(expectedWidthPercentage);
          }
          
          if (availableHeight > 0) {
            const expectedHeightPercentage = Math.round((newHeight / availableHeight) * 100);
            expect(newHeightPercentage).toBe(expectedHeightPercentage);
          }

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：預覽樣式的響應性
   * 
   * 驗證當配置改變時，iframe 的樣式（寬度、高度）也會即時更新
   */
  it('should update iframe styles immediately when configuration changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('none', 'contain-center', 'stretch'),
        async (displayMode) => {
          const config = {
            iframeFit: displayMode,
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始樣式
          const initialStyle = wrapper.vm.iframeStyle;
          expect(initialStyle).toBeDefined();
          expect(initialStyle.width).toBeDefined();
          expect(initialStyle.height).toBeDefined();

          // 更改配置
          const newDisplayMode = displayMode === 'contain-center' ? 'stretch' : 'contain-center';
          await wrapper.setProps({
            config: {
              ...config,
              iframeFit: newDisplayMode
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取新樣式
          const newStyle = wrapper.vm.iframeStyle;
          expect(newStyle).toBeDefined();
          expect(newStyle.width).toBeDefined();
          expect(newStyle.height).toBeDefined();

          // 驗證樣式已更新（至少有一個屬性不同）
          const stylesChanged = 
            initialStyle.width !== newStyle.width ||
            initialStyle.height !== newStyle.height ||
            initialStyle.display !== newStyle.display;
          
          expect(stylesChanged).toBe(true);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：預覽更新的一致性
   * 
   * 驗證相同的配置總是產生相同的預覽結果（確保響應式計算是確定性的）
   */
  it('should produce consistent preview results for the same configuration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('none', 'contain-center', 'stretch'),
        fc.constantFrom('px', 'vh', 'auto'),
        fc.integer({ min: 200, max: 2000 }),
        fc.boolean(),
        async (displayMode, heightMode, heightValue, sidebarCollapsed) => {
          const config = {
            iframeFit: displayMode,
            iframeHeightMode: heightMode,
            iframeHeightValue: heightMode !== 'auto' ? heightValue : undefined
          };

          // 創建兩個相同配置的組件實例
          const wrapper1 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed }
          });

          const wrapper2 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證兩個實例產生相同的結果
          expect(wrapper1.vm.calculatedWidth).toBe(wrapper2.vm.calculatedWidth);
          expect(wrapper1.vm.calculatedHeight).toBe(wrapper2.vm.calculatedHeight);
          expect(wrapper1.vm.availableWidth).toBe(wrapper2.vm.availableWidth);
          expect(wrapper1.vm.availableHeight).toBe(wrapper2.vm.availableHeight);
          expect(wrapper1.vm.displayModeText).toBe(wrapper2.vm.displayModeText);
          expect(wrapper1.vm.widthPercentage).toBe(wrapper2.vm.widthPercentage);
          expect(wrapper1.vm.heightPercentage).toBe(wrapper2.vm.heightPercentage);

          wrapper1.unmount();
          wrapper2.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：快速連續變化時預覽的穩定性
   * 
   * 驗證當配置快速連續變化時，預覽仍能正確更新且不會出錯
   */
  it('should handle rapid configuration changes gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.constantFrom('none', 'contain-center', 'stretch'), { minLength: 3, maxLength: 10 }),
        async (displayModes) => {
          const initialConfig = {
            iframeFit: displayModes[0],
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();

          // 快速連續更改配置
          for (let i = 1; i < displayModes.length; i++) {
            await wrapper.setProps({
              config: {
                ...initialConfig,
                iframeFit: displayModes[i]
              }
            });
            await nextTick();
          }

          // 等待所有更新完成
          await new Promise(resolve => setTimeout(resolve, 100));

          // 驗證最終狀態有效
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);
          expect(wrapper.vm.availableWidth).toBeGreaterThan(0);
          expect(wrapper.vm.availableHeight).toBeGreaterThan(0);

          // 驗證最終顯示模式正確
          const expectedTexts = {
            'none': '原尺寸（可捲動）',
            'contain-center': '等比例置中',
            'stretch': '拉伸滿版'
          };
          const finalMode = displayModes[displayModes.length - 1];
          expect(wrapper.vm.displayModeText).toBe(expectedTexts[finalMode]);

          wrapper.unmount();
        }
      ),
      { numRuns: 30 }
    );
  });
});
