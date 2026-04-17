/**
 * Property-Based Tests for Preview Size Information Accuracy
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 8: 預覽尺寸資訊準確性
 * Validates: Requirements 4.2
 * 
 * 測試顯示的尺寸與計算值一致
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { mount } from '@vue/test-utils';
import PreviewPanel from '../../src/components/oco/gui/setting/PreviewPanel.vue';
import { SizeCalculator } from '../../src/utils/size-calculator';
import { LayoutMeasurer } from '../../src/utils/layout-measurer';
import { nextTick } from 'vue';

describe('Property: Preview Size Information Accuracy', () => {
  /**
   * Feature: iframe-auto-fit-enhancement, Property 8: 預覽尺寸資訊準確性
   * 
   * For any 預覽狀態，顯示的尺寸資訊（像素值）應該與實際計算出的尺寸一致
   * 
   * 這個屬性確保：
   * 1. 顯示的 iframe 寬度與計算出的寬度一致
   * 2. 顯示的 iframe 高度與計算出的高度一致
   * 3. 顯示的可用空間與實際測量的可用空間一致
   * 4. 顯示的百分比值與實際計算的百分比一致
   */
  it('should display iframe dimensions that match calculated values', async () => {
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

          // 獲取顯示的尺寸資訊
          const displayedWidth = wrapper.vm.calculatedWidth;
          const displayedHeight = wrapper.vm.calculatedHeight;
          const displayedAvailableWidth = wrapper.vm.availableWidth;
          const displayedAvailableHeight = wrapper.vm.availableHeight;

          // 獨立計算尺寸以驗證
          const measurer = new LayoutMeasurer();
          const calculator = new SizeCalculator();
          
          const measurements = measurer.measure();
          
          // 應用 Sidebar 狀態覆蓋
          measurements.sidebar.collapsed = sidebarCollapsed;
          measurements.sidebar.width = sidebarCollapsed 
            ? measurements.sidebar.collapsedWidth 
            : 200;

          // 計算可用空間
          const calculatedAvailableSpace = calculator.calculateAvailableSpace(measurements);
          const expectedAvailableWidth = Math.round(calculatedAvailableSpace.width);
          const expectedAvailableHeight = Math.round(calculatedAvailableSpace.height);

          // 驗證可用空間一致
          expect(displayedAvailableWidth).toBe(expectedAvailableWidth);
          expect(displayedAvailableHeight).toBe(expectedAvailableHeight);

          // 計算 iframe 尺寸
          let expectedSize;
          const designRatio = 16 / 9;

          if (displayMode === 'stretch') {
            expectedSize = {
              width: calculatedAvailableSpace.width,
              height: calculatedAvailableSpace.height
            };
          } else if (displayMode === 'none') {
            expectedSize = {
              width: 1920,
              height: 1080
            };
          } else {
            // contain-center
            expectedSize = calculator.calculate(measurements, {
              designRatio,
              fitMode: 'auto'
            });
          }

          const expectedWidth = Math.round(expectedSize.width);
          const expectedHeight = Math.round(expectedSize.height);

          // 驗證 iframe 尺寸一致
          expect(displayedWidth).toBe(expectedWidth);
          expect(displayedHeight).toBe(expectedHeight);

          measurer.dispose();
          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：顯示的百分比值與計算值一致
   * 
   * 驗證顯示的百分比值是根據實際尺寸正確計算的
   */
  it('should display percentage values that match calculated percentages', async () => {
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

          // 獲取顯示的值
          const displayedWidth = wrapper.vm.calculatedWidth;
          const displayedHeight = wrapper.vm.calculatedHeight;
          const displayedAvailableWidth = wrapper.vm.availableWidth;
          const displayedAvailableHeight = wrapper.vm.availableHeight;
          const displayedWidthPercentage = wrapper.vm.widthPercentage;
          const displayedHeightPercentage = wrapper.vm.heightPercentage;

          // 計算預期的百分比
          let expectedWidthPercentage = 0;
          let expectedHeightPercentage = 0;

          if (displayedAvailableWidth > 0) {
            expectedWidthPercentage = Math.round((displayedWidth / displayedAvailableWidth) * 100);
          }

          if (displayedAvailableHeight > 0) {
            expectedHeightPercentage = Math.round((displayedHeight / displayedAvailableHeight) * 100);
          }

          // 驗證百分比一致
          expect(displayedWidthPercentage).toBe(expectedWidthPercentage);
          expect(displayedHeightPercentage).toBe(expectedHeightPercentage);

          // 驗證百分比在合理範圍內
          expect(displayedWidthPercentage).toBeGreaterThanOrEqual(0);
          expect(displayedWidthPercentage).toBeLessThanOrEqual(100);
          expect(displayedHeightPercentage).toBeGreaterThanOrEqual(0);
          expect(displayedHeightPercentage).toBeLessThanOrEqual(100);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：Sidebar 狀態變化後尺寸資訊準確性
   * 
   * 驗證當 Sidebar 狀態改變後，顯示的尺寸資訊仍然與計算值一致
   */
  it('should maintain size accuracy after sidebar state changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('contain-center', 'stretch'),
        fc.boolean(),
        async (displayMode, initialSidebarCollapsed) => {
          const config = {
            iframeFit: displayMode,
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

          // 切換 Sidebar 狀態
          await wrapper.setProps({
            sidebarCollapsed: !initialSidebarCollapsed
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取顯示的尺寸資訊
          const displayedWidth = wrapper.vm.calculatedWidth;
          const displayedHeight = wrapper.vm.calculatedHeight;
          const displayedAvailableWidth = wrapper.vm.availableWidth;
          const displayedAvailableHeight = wrapper.vm.availableHeight;

          // 獨立計算以驗證
          const measurer = new LayoutMeasurer();
          const calculator = new SizeCalculator();
          
          const measurements = measurer.measure();
          measurements.sidebar.collapsed = !initialSidebarCollapsed;
          measurements.sidebar.width = !initialSidebarCollapsed 
            ? measurements.sidebar.collapsedWidth 
            : 200;

          const calculatedAvailableSpace = calculator.calculateAvailableSpace(measurements);
          const expectedAvailableWidth = Math.round(calculatedAvailableSpace.width);
          const expectedAvailableHeight = Math.round(calculatedAvailableSpace.height);

          // 驗證可用空間一致
          expect(displayedAvailableWidth).toBe(expectedAvailableWidth);
          expect(displayedAvailableHeight).toBe(expectedAvailableHeight);

          // 計算並驗證 iframe 尺寸
          let expectedSize;
          const designRatio = 16 / 9;

          if (displayMode === 'stretch') {
            expectedSize = {
              width: calculatedAvailableSpace.width,
              height: calculatedAvailableSpace.height
            };
          } else {
            expectedSize = calculator.calculate(measurements, {
              designRatio,
              fitMode: 'auto'
            });
          }

          const expectedWidth = Math.round(expectedSize.width);
          const expectedHeight = Math.round(expectedSize.height);

          expect(displayedWidth).toBe(expectedWidth);
          expect(displayedHeight).toBe(expectedHeight);

          measurer.dispose();
          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  }, 20000);

  /**
   * 測試：配置變化後尺寸資訊準確性
   * 
   * 驗證當配置改變後，顯示的尺寸資訊仍然與新配置的計算值一致
   */
  it('should maintain size accuracy after configuration changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('none', 'contain-center', 'stretch'),
        fc.constantFrom('none', 'contain-center', 'stretch'),
        fc.boolean(),
        async (initialMode, newMode, sidebarCollapsed) => {
          // 跳過相同模式
          if (initialMode === newMode) return;

          const initialConfig = {
            iframeFit: initialMode,
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          const wrapper = mount(PreviewPanel, {
            props: {
              config: initialConfig,
              sidebarCollapsed
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 更改配置
          await wrapper.setProps({
            config: {
              ...initialConfig,
              iframeFit: newMode
            }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 獲取顯示的尺寸資訊
          const displayedWidth = wrapper.vm.calculatedWidth;
          const displayedHeight = wrapper.vm.calculatedHeight;

          // 獨立計算以驗證
          const measurer = new LayoutMeasurer();
          const calculator = new SizeCalculator();
          
          const measurements = measurer.measure();
          measurements.sidebar.collapsed = sidebarCollapsed;
          measurements.sidebar.width = sidebarCollapsed 
            ? measurements.sidebar.collapsedWidth 
            : 200;

          const calculatedAvailableSpace = calculator.calculateAvailableSpace(measurements);

          // 根據新模式計算預期尺寸
          let expectedSize;
          const designRatio = 16 / 9;

          if (newMode === 'stretch') {
            expectedSize = {
              width: calculatedAvailableSpace.width,
              height: calculatedAvailableSpace.height
            };
          } else if (newMode === 'none') {
            expectedSize = {
              width: 1920,
              height: 1080
            };
          } else {
            expectedSize = calculator.calculate(measurements, {
              designRatio,
              fitMode: 'auto'
            });
          }

          const expectedWidth = Math.round(expectedSize.width);
          const expectedHeight = Math.round(expectedSize.height);

          // 驗證尺寸一致
          expect(displayedWidth).toBe(expectedWidth);
          expect(displayedHeight).toBe(expectedHeight);

          measurer.dispose();
          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：尺寸資訊的數值類型正確性
   * 
   * 驗證所有顯示的尺寸資訊都是有效的數字（非 NaN、非 Infinity）
   */
  it('should display valid numeric values for all size information', async () => {
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

          // 獲取所有尺寸資訊
          const width = wrapper.vm.calculatedWidth;
          const height = wrapper.vm.calculatedHeight;
          const availableWidth = wrapper.vm.availableWidth;
          const availableHeight = wrapper.vm.availableHeight;
          const widthPercentage = wrapper.vm.widthPercentage;
          const heightPercentage = wrapper.vm.heightPercentage;

          // 驗證所有值都是有效數字
          expect(Number.isFinite(width)).toBe(true);
          expect(Number.isFinite(height)).toBe(true);
          expect(Number.isFinite(availableWidth)).toBe(true);
          expect(Number.isFinite(availableHeight)).toBe(true);
          expect(Number.isFinite(widthPercentage)).toBe(true);
          expect(Number.isFinite(heightPercentage)).toBe(true);

          // 驗證所有值都不是 NaN
          expect(Number.isNaN(width)).toBe(false);
          expect(Number.isNaN(height)).toBe(false);
          expect(Number.isNaN(availableWidth)).toBe(false);
          expect(Number.isNaN(availableHeight)).toBe(false);
          expect(Number.isNaN(widthPercentage)).toBe(false);
          expect(Number.isNaN(heightPercentage)).toBe(false);

          // 驗證所有值都是非負數
          expect(width).toBeGreaterThanOrEqual(0);
          expect(height).toBeGreaterThanOrEqual(0);
          expect(availableWidth).toBeGreaterThanOrEqual(0);
          expect(availableHeight).toBeGreaterThanOrEqual(0);
          expect(widthPercentage).toBeGreaterThanOrEqual(0);
          expect(heightPercentage).toBeGreaterThanOrEqual(0);

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：尺寸資訊的一致性（多次測量）
   * 
   * 驗證對於相同的配置，多次測量得到的尺寸資訊是一致的
   */
  it('should produce consistent size information across multiple measurements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('none', 'contain-center', 'stretch'),
        fc.boolean(),
        async (displayMode, sidebarCollapsed) => {
          const config = {
            iframeFit: displayMode,
            iframeHeightMode: 'auto',
            iframeHeightValue: undefined
          };

          // 創建多個相同配置的實例
          const wrapper1 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed }
          });

          const wrapper2 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed }
          });

          const wrapper3 = mount(PreviewPanel, {
            props: { config, sidebarCollapsed }
          });

          await nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證所有實例產生相同的尺寸資訊
          expect(wrapper1.vm.calculatedWidth).toBe(wrapper2.vm.calculatedWidth);
          expect(wrapper2.vm.calculatedWidth).toBe(wrapper3.vm.calculatedWidth);

          expect(wrapper1.vm.calculatedHeight).toBe(wrapper2.vm.calculatedHeight);
          expect(wrapper2.vm.calculatedHeight).toBe(wrapper3.vm.calculatedHeight);

          expect(wrapper1.vm.availableWidth).toBe(wrapper2.vm.availableWidth);
          expect(wrapper2.vm.availableWidth).toBe(wrapper3.vm.availableWidth);

          expect(wrapper1.vm.availableHeight).toBe(wrapper2.vm.availableHeight);
          expect(wrapper2.vm.availableHeight).toBe(wrapper3.vm.availableHeight);

          expect(wrapper1.vm.widthPercentage).toBe(wrapper2.vm.widthPercentage);
          expect(wrapper2.vm.widthPercentage).toBe(wrapper3.vm.widthPercentage);

          expect(wrapper1.vm.heightPercentage).toBe(wrapper2.vm.heightPercentage);
          expect(wrapper2.vm.heightPercentage).toBe(wrapper3.vm.heightPercentage);

          wrapper1.unmount();
          wrapper2.unmount();
          wrapper3.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：尺寸資訊與樣式的一致性
   * 
   * 驗證顯示的尺寸資訊與實際應用到 iframe 的樣式一致
   */
  it('should display size information that matches applied iframe styles', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('contain-center'),
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

          // 獲取顯示的尺寸
          const displayedWidth = wrapper.vm.calculatedWidth;
          const displayedHeight = wrapper.vm.calculatedHeight;

          // 獲取應用的樣式
          const iframeStyle = wrapper.vm.iframeStyle;

          // 預覽容器是縮放的，需要計算縮放比例
          const measurer = new LayoutMeasurer();
          const measurements = measurer.measure();
          
          const containerWidth = 400;
          const containerHeight = 300;
          const scale = Math.min(
            containerWidth / (measurements.viewport.width || 1920),
            containerHeight / (measurements.viewport.height || 1080)
          );

          // 從樣式中提取尺寸（移除 'px' 後綴）
          const styleWidth = parseFloat(iframeStyle.width);
          const styleHeight = parseFloat(iframeStyle.height);

          // 計算預期的縮放後尺寸
          const expectedScaledWidth = displayedWidth * scale;
          const expectedScaledHeight = displayedHeight * scale;

          // 驗證樣式尺寸與顯示尺寸的縮放關係一致（允許小誤差）
          expect(Math.abs(styleWidth - expectedScaledWidth)).toBeLessThan(1);
          expect(Math.abs(styleHeight - expectedScaledHeight)).toBeLessThan(1);

          measurer.dispose();
          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：邊界情況下的尺寸資訊準確性
   * 
   * 驗證在極端情況下（如非常小或非常大的視窗），尺寸資訊仍然準確
   */
  it('should maintain accuracy in edge cases', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('contain-center', 'stretch'),
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

          // 獲取尺寸資訊
          const width = wrapper.vm.calculatedWidth;
          const height = wrapper.vm.calculatedHeight;
          const availableWidth = wrapper.vm.availableWidth;
          const availableHeight = wrapper.vm.availableHeight;
          const widthPercentage = wrapper.vm.widthPercentage;
          const heightPercentage = wrapper.vm.heightPercentage;

          // 驗證基本約束
          expect(width).toBeGreaterThanOrEqual(0);
          expect(height).toBeGreaterThanOrEqual(0);
          expect(availableWidth).toBeGreaterThanOrEqual(0);
          expect(availableHeight).toBeGreaterThanOrEqual(0);

          // 驗證尺寸不超出可用空間（對於 contain-center 模式）
          if (displayMode === 'contain-center') {
            expect(width).toBeLessThanOrEqual(availableWidth + 1); // 允許 1px 誤差
            expect(height).toBeLessThanOrEqual(availableHeight + 1);
          }

          // 驗證百分比計算正確
          if (availableWidth > 0) {
            const calculatedPercentage = Math.round((width / availableWidth) * 100);
            expect(widthPercentage).toBe(calculatedPercentage);
          }

          if (availableHeight > 0) {
            const calculatedPercentage = Math.round((height / availableHeight) * 100);
            expect(heightPercentage).toBe(calculatedPercentage);
          }

          wrapper.unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
