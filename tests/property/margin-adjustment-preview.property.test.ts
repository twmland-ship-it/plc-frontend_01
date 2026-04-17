/**
 * Property-Based Tests for Margin Adjustment Real-time Preview
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 14: 邊距調整即時預覽
 * Validates: Requirements 7.2
 * 
 * 測試邊距變化時預覽即時更新
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { mount } from '@vue/test-utils';
import PreviewPanel from '../../src/components/oco/gui/setting/PreviewPanel.vue';
import { nextTick } from 'vue';

describe('Property: Margin Adjustment Real-time Preview', () => {
  /**
   * Feature: iframe-auto-fit-enhancement, Property 14: 邊距調整即時預覽
   * 
   * For any 邊距值的調整（上、下、左、右），
   * 預覽應該即時反映邊距的變化
   * 
   * 這個屬性確保：
   * 1. 當任何邊距值改變時，預覽的 iframe 位置和尺寸相應更新
   * 2. 邊距變化是即時的（響應式的）
   * 3. 邊距計算正確反映在預覽中
   * 4. 多個邊距同時變化時，預覽能正確處理
   */
  it('should update preview immediately when top margin changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        async (initialMargin, newMargin) => {
          // 跳過相同邊距的測試
          if (initialMargin === newMargin) return;

          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: initialMargin,
              right: 0,
              bottom: 0,
              left: 0
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始計算結果
          const initialCalculatedSize = wrapper.vm.calculatedSize;
          expect(initialCalculatedSize).toBeDefined();
          expect(initialCalculatedSize.margins.top).toBe(initialMargin);

          // 更新上邊距
          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: newMargin,
                right: 0,
                bottom: 0,
                left: 0
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證邊距已更新
          const newCalculatedSize = wrapper.vm.calculatedSize;
          expect(newCalculatedSize).toBeDefined();
          expect(newCalculatedSize.margins.top).toBe(newMargin);

          // 驗證預覽尺寸仍然有效
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  it('should update preview immediately when right margin changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        async (initialMargin, newMargin) => {
          if (initialMargin === newMargin) return;

          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: 0,
              right: initialMargin,
              bottom: 0,
              left: 0
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const initialCalculatedSize = wrapper.vm.calculatedSize;
          expect(initialCalculatedSize.margins.right).toBe(initialMargin);

          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: 0,
                right: newMargin,
                bottom: 0,
                left: 0
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const newCalculatedSize = wrapper.vm.calculatedSize;
          expect(newCalculatedSize.margins.right).toBe(newMargin);
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  it('should update preview immediately when bottom margin changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        async (initialMargin, newMargin) => {
          if (initialMargin === newMargin) return;

          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: 0,
              right: 0,
              bottom: initialMargin,
              left: 0
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const initialCalculatedSize = wrapper.vm.calculatedSize;
          expect(initialCalculatedSize.margins.bottom).toBe(initialMargin);

          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: 0,
                right: 0,
                bottom: newMargin,
                left: 0
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const newCalculatedSize = wrapper.vm.calculatedSize;
          expect(newCalculatedSize.margins.bottom).toBe(newMargin);
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  it('should update preview immediately when left margin changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        async (initialMargin, newMargin) => {
          if (initialMargin === newMargin) return;

          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: 0,
              right: 0,
              bottom: 0,
              left: initialMargin
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const initialCalculatedSize = wrapper.vm.calculatedSize;
          expect(initialCalculatedSize.margins.left).toBe(initialMargin);

          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: 0,
                right: 0,
                bottom: 0,
                left: newMargin
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const newCalculatedSize = wrapper.vm.calculatedSize;
          expect(newCalculatedSize.margins.left).toBe(newMargin);
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  /**
   * 測試：多個邊距同時變化時預覽正確更新
   * 
   * 驗證當多個邊距值同時改變時，預覽能正確反映所有變化
   */
  it('should update preview correctly when multiple margins change simultaneously', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        async (top1, right1, bottom1, left1, top2, right2, bottom2, left2) => {
          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: top1,
              right: right1,
              bottom: bottom1,
              left: left1
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取初始邊距
          const initialCalculatedSize = wrapper.vm.calculatedSize;
          expect(initialCalculatedSize.margins.top).toBe(top1);
          expect(initialCalculatedSize.margins.right).toBe(right1);
          expect(initialCalculatedSize.margins.bottom).toBe(bottom1);
          expect(initialCalculatedSize.margins.left).toBe(left1);

          // 同時更改所有邊距
          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: top2,
                right: right2,
                bottom: bottom2,
                left: left2
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證所有邊距都已更新
          const newCalculatedSize = wrapper.vm.calculatedSize;
          expect(newCalculatedSize.margins.top).toBe(top2);
          expect(newCalculatedSize.margins.right).toBe(right2);
          expect(newCalculatedSize.margins.bottom).toBe(bottom2);
          expect(newCalculatedSize.margins.left).toBe(left2);

          // 驗證預覽尺寸仍然有效
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  /**
   * 測試：邊距變化影響可用空間計算
   * 
   * 驗證當邊距改變時，可用空間的計算會相應調整
   */
  it('should adjust available space calculation when margins change', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        async (initialMargin, newMargin) => {
          if (initialMargin === newMargin) return;

          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: initialMargin,
              right: initialMargin,
              bottom: initialMargin,
              left: initialMargin
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const initialAvailableWidth = wrapper.vm.availableWidth;
          const initialAvailableHeight = wrapper.vm.availableHeight;
          const initialCalculatedWidth = wrapper.vm.calculatedWidth;
          const initialCalculatedHeight = wrapper.vm.calculatedHeight;

          // 更改所有邊距
          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: newMargin,
                right: newMargin,
                bottom: newMargin,
                left: newMargin
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const newAvailableWidth = wrapper.vm.availableWidth;
          const newAvailableHeight = wrapper.vm.availableHeight;
          const newCalculatedWidth = wrapper.vm.calculatedWidth;
          const newCalculatedHeight = wrapper.vm.calculatedHeight;

          // 驗證可用空間和計算尺寸都是正數
          expect(newAvailableWidth).toBeGreaterThan(0);
          expect(newAvailableHeight).toBeGreaterThan(0);
          expect(newCalculatedWidth).toBeGreaterThan(0);
          expect(newCalculatedHeight).toBeGreaterThan(0);

          // 驗證邊距變化影響了可用空間
          // 當邊距增加時，可用空間應該減少；當邊距減少時，可用空間應該增加
          const marginDiff = newMargin - initialMargin;
          if (marginDiff > 0) {
            // 邊距增加，可用空間應該減少或保持不變
            expect(newAvailableWidth).toBeLessThanOrEqual(initialAvailableWidth);
            expect(newAvailableHeight).toBeLessThanOrEqual(initialAvailableHeight);
          } else if (marginDiff < 0) {
            // 邊距減少，可用空間應該增加或保持不變
            expect(newAvailableWidth).toBeGreaterThanOrEqual(initialAvailableWidth);
            expect(newAvailableHeight).toBeGreaterThanOrEqual(initialAvailableHeight);
          }

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  /**
   * 測試：邊距變化時保持 16:9 比例
   * 
   * 驗證在 contain-center 模式下，即使邊距改變，iframe 仍保持 16:9 比例
   */
  it('should maintain 16:9 aspect ratio when margins change in contain-center mode', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        async (top, right, bottom, left) => {
          const config = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top,
              right,
              bottom,
              left
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          const width = wrapper.vm.calculatedWidth;
          const height = wrapper.vm.calculatedHeight;

          // 驗證尺寸為正數
          expect(width).toBeGreaterThan(0);
          expect(height).toBeGreaterThan(0);

          // 驗證保持 16:9 比例
          const ratio = width / height;
          const expectedRatio = 16 / 9;
          expect(Math.abs(ratio - expectedRatio)).toBeLessThan(0.01);

          wrapper.unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：邊距變化的響應性
   * 
   * 驗證邊距變化後，calculatedSize 中的邊距值即時更新
   * 這是 Property 14 的核心：邊距調整應該即時反映在計算結果中
   */
  it('should update iframe styles immediately when margins change', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        async (initialMargin, newMargin) => {
          if (initialMargin === newMargin) return;

          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: initialMargin,
              right: initialMargin,
              bottom: initialMargin,
              left: initialMargin
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證初始邊距值
          const initialCalculatedSize = wrapper.vm.calculatedSize;
          expect(initialCalculatedSize.margins.top).toBe(initialMargin);
          expect(initialCalculatedSize.margins.right).toBe(initialMargin);
          expect(initialCalculatedSize.margins.bottom).toBe(initialMargin);
          expect(initialCalculatedSize.margins.left).toBe(initialMargin);

          // 更改邊距
          await wrapper.setProps({
            config: {
              ...initialConfig,
              margins: {
                top: newMargin,
                right: newMargin,
                bottom: newMargin,
                left: newMargin
              }
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證邊距值已即時更新
          const newCalculatedSize = wrapper.vm.calculatedSize;
          expect(newCalculatedSize.margins.top).toBe(newMargin);
          expect(newCalculatedSize.margins.right).toBe(newMargin);
          expect(newCalculatedSize.margins.bottom).toBe(newMargin);
          expect(newCalculatedSize.margins.left).toBe(newMargin);

          // 驗證樣式對象仍然有效
          const newStyle = wrapper.vm.iframeStyle;
          expect(newStyle).toBeDefined();
          expect(newStyle.width).toBeDefined();
          expect(newStyle.height).toBeDefined();

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 30000);

  /**
   * 測試：邊距為零時的特殊情況
   * 
   * 驗證當所有邊距都為零時，預覽仍能正常工作
   */
  it('should handle zero margins correctly', async () => {
    const config = {
      iframeFit: 'contain-center',
      iframeHeightMode: 'auto',
      margins: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    };

    const wrapper = mount(PreviewPanel, {
      props: {
        config,
        sidebarCollapsed: false
      }
    });

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 50));

    // 驗證零邊距時預覽正常
    expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
    expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);
    expect(wrapper.vm.availableWidth).toBeGreaterThan(0);
    expect(wrapper.vm.availableHeight).toBeGreaterThan(0);

    const calculatedSize = wrapper.vm.calculatedSize;
    expect(calculatedSize.margins.top).toBe(0);
    expect(calculatedSize.margins.right).toBe(0);
    expect(calculatedSize.margins.bottom).toBe(0);
    expect(calculatedSize.margins.left).toBe(0);

    wrapper.unmount();
  });

  /**
   * 測試：邊距變化的一致性
   * 
   * 驗證相同的邊距配置總是產生相同的預覽結果
   */
  it('should produce consistent preview results for the same margin configuration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        async (top, right, bottom, left) => {
          const config = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top,
              right,
              bottom,
              left
            }
          };

          // 創建兩個相同配置的組件實例
          const wrapper1 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed: false }
          });

          const wrapper2 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed: false }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證兩個實例產生相同的結果
          expect(wrapper1.vm.calculatedWidth).toBe(wrapper2.vm.calculatedWidth);
          expect(wrapper1.vm.calculatedHeight).toBe(wrapper2.vm.calculatedHeight);
          
          const size1 = wrapper1.vm.calculatedSize;
          const size2 = wrapper2.vm.calculatedSize;
          expect(size1.margins.top).toBe(size2.margins.top);
          expect(size1.margins.right).toBe(size2.margins.right);
          expect(size1.margins.bottom).toBe(size2.margins.bottom);
          expect(size1.margins.left).toBe(size2.margins.left);

          wrapper1.unmount();
          wrapper2.unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：快速連續邊距變化時預覽的穩定性
   * 
   * 驗證當邊距快速連續變化時，預覽仍能正確更新且不會出錯
   */
  it('should handle rapid margin changes gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 0, max: 50 }), { minLength: 5, maxLength: 15 }),
        async (margins) => {
          const initialConfig = {
            iframeFit: 'contain-center',
            iframeHeightMode: 'auto',
            margins: {
              top: margins[0],
              right: 0,
              bottom: 0,
              left: 0
            }
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed: false
            }
          });

          await nextTick();

          // 快速連續更改上邊距
          for (let i = 1; i < margins.length; i++) {
            await wrapper.setProps({
              config: {
                ...initialConfig,
                margins: {
                  top: margins[i],
                  right: 0,
                  bottom: 0,
                  left: 0
                }
              }
            });
            await nextTick();
          }

          // 等待所有更新完成
          await new Promise(resolve => setTimeout(resolve, 100));

          // 驗證最終狀態有效
          expect(wrapper.vm.calculatedWidth).toBeGreaterThan(0);
          expect(wrapper.vm.calculatedHeight).toBeGreaterThan(0);
          
          const finalSize = wrapper.vm.calculatedSize;
          expect(finalSize.margins.top).toBe(margins[margins.length - 1]);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
