/**
 * Property-Based Tests for One-Click Optimization Parameter Calculation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 13: 一鍵最佳化參數計算
 * Validates: Requirements 6.1
 * 
 * 測試計算出的參數能完整顯示且保持比例
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { LayoutMeasurer } from '../../src/utils/layout-measurer';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: One-Click Optimization Parameter Calculation', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 13: 一鍵最佳化參數計算
   * 
   * For any 當前環境測量結果，一鍵最佳化功能應該計算出能夠在可用空間內
   * 完整顯示且保持比例的最大尺寸
   * 
   * 這個屬性確保：
   * 1. 計算出的尺寸不超出可用空間（寬度和高度都在範圍內）
   * 2. 計算出的尺寸保持 16:9 的設計比例
   * 3. 計算出的尺寸是在保持比例前提下的最大尺寸
   * 4. 無論 Sidebar 展開或收合，計算都能正確進行
   */
  it('should calculate optimal parameters that fit within available space and maintain aspect ratio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 視窗寬度
        fc.integer({ min: 600, max: 2160 }), // 視窗高度
        fc.boolean(), // Sidebar 是否收合
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          // 構建測量數據
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: {
              width: sidebarCollapsed ? 64 : 200,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 計算可用空間
          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 使用 16:9 比例進行最佳化計算（模擬一鍵最佳化功能）
          const designRatio = 16 / 9;
          const result = calculator.calculate(measurements, {
            designRatio,
            fitMode: 'auto' // 自動選擇最佳適應策略
          });

          // 驗證 1: 計算出的尺寸不超出可用空間
          expect(result.width).toBeLessThanOrEqual(availableSpace.width);
          expect(result.height).toBeLessThanOrEqual(availableSpace.height);

          // 驗證 2: 保持 16:9 比例
          const actualRatio = result.width / result.height;
          expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);

          // 驗證 3: 尺寸為正數
          expect(result.width).toBeGreaterThan(0);
          expect(result.height).toBeGreaterThan(0);

          // 驗證 4: 計算出的尺寸應該是最大可能尺寸
          // 如果以寬度為基準，高度應該接近可用高度；如果以高度為基準，寬度應該接近可用寬度
          if (result.fitMode === 'width-based') {
            // 寬度應該接近可用寬度
            expect(result.width).toBeGreaterThan(availableSpace.width * 0.95);
            // 高度不應超出
            expect(result.height).toBeLessThanOrEqual(availableSpace.height);
          } else if (result.fitMode === 'height-based') {
            // 高度應該接近可用高度
            expect(result.height).toBeGreaterThan(availableSpace.height * 0.95);
            // 寬度不應超出
            expect(result.width).toBeLessThanOrEqual(availableSpace.width);
          }
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：最佳化計算在不同 Sidebar 狀態下的一致性
   * 
   * 驗證無論 Sidebar 展開或收合，計算出的參數都能正確適應可用空間
   */
  it('should calculate optimal parameters correctly for both sidebar states', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1200, max: 3840 }), // 較大的視窗寬度
        fc.integer({ min: 800, max: 2160 }),
        (viewportWidth, viewportHeight) => {
          const designRatio = 16 / 9;

          // Sidebar 展開狀態
          const measurementsExpanded: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // Sidebar 收合狀態
          const measurementsCollapsed: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 64, collapsed: true, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 計算兩種狀態下的可用空間
          const availableExpanded = calculator.calculateAvailableSpace(measurementsExpanded);
          const availableCollapsed = calculator.calculateAvailableSpace(measurementsCollapsed);

          // 計算最佳尺寸
          const resultExpanded = calculator.calculate(measurementsExpanded, {
            designRatio,
            fitMode: 'auto'
          });

          const resultCollapsed = calculator.calculate(measurementsCollapsed, {
            designRatio,
            fitMode: 'auto'
          });

          // 驗證展開狀態：尺寸在可用空間內且保持比例
          expect(resultExpanded.width).toBeLessThanOrEqual(availableExpanded.width);
          expect(resultExpanded.height).toBeLessThanOrEqual(availableExpanded.height);
          expect(Math.abs(resultExpanded.width / resultExpanded.height - designRatio)).toBeLessThan(0.01);

          // 驗證收合狀態：尺寸在可用空間內且保持比例
          expect(resultCollapsed.width).toBeLessThanOrEqual(availableCollapsed.width);
          expect(resultCollapsed.height).toBeLessThanOrEqual(availableCollapsed.height);
          expect(Math.abs(resultCollapsed.width / resultCollapsed.height - designRatio)).toBeLessThan(0.01);

          // 驗證收合狀態的尺寸應該大於或等於展開狀態（因為可用空間更大）
          expect(resultCollapsed.width).toBeGreaterThanOrEqual(resultExpanded.width * 0.95);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：最佳化計算的邊距合理性
   * 
   * 驗證計算出的邊距值合理（非負且不會導致內容超出）
   */
  it('should calculate reasonable margins that keep content within bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        fc.boolean(),
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: {
              width: sidebarCollapsed ? 64 : 200,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 驗證邊距非負
          expect(result.margins.top).toBeGreaterThanOrEqual(0);
          expect(result.margins.right).toBeGreaterThanOrEqual(0);
          expect(result.margins.bottom).toBeGreaterThanOrEqual(0);
          expect(result.margins.left).toBeGreaterThanOrEqual(0);

          // 驗證邊距合理（不會過大）
          const availableSpace = calculator.calculateAvailableSpace(measurements);
          expect(result.margins.left + result.margins.right).toBeLessThan(availableSpace.width);
          expect(result.margins.top + result.margins.bottom).toBeLessThan(availableSpace.height);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：最佳化計算在常見解析度下的表現
   * 
   * 驗證在常見的螢幕解析度下，最佳化計算能產生合理的結果
   */
  it('should produce reasonable results for common screen resolutions', () => {
    const commonResolutions = [
      { width: 1920, height: 1080, name: 'Full HD' },
      { width: 1366, height: 768, name: 'HD' },
      { width: 2560, height: 1440, name: '2K' },
      { width: 3840, height: 2160, name: '4K' },
      { width: 1280, height: 720, name: 'HD 720p' }
    ];

    commonResolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (sidebarCollapsed) => {
            const measurements: LayoutMeasurements = {
              viewport: { width: resolution.width, height: resolution.height },
              sidebar: {
                width: sidebarCollapsed ? 64 : 200,
                collapsed: sidebarCollapsed,
                collapsedWidth: 64
              },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            const availableSpace = calculator.calculateAvailableSpace(measurements);
            const result = calculator.calculate(measurements, {
              designRatio: 16 / 9,
              fitMode: 'auto'
            });

            // 驗證尺寸在可用空間內
            expect(result.width).toBeLessThanOrEqual(availableSpace.width);
            expect(result.height).toBeLessThanOrEqual(availableSpace.height);

            // 驗證比例
            expect(Math.abs(result.width / result.height - 16 / 9)).toBeLessThan(0.01);

            // 驗證尺寸合理（不會太小）
            expect(result.width).toBeGreaterThan(200);
            expect(result.height).toBeGreaterThan(100);
          }
        ),
        { numRuns: 20 }
      );
    });
  });

  /**
   * 測試：最佳化計算的可用空間利用率
   * 
   * 驗證計算出的尺寸能夠充分利用可用空間（至少使用 90% 的可用空間）
   */
  it('should utilize at least 90% of available space in one dimension', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 3840 }), // 確保有足夠的空間
        fc.integer({ min: 700, max: 2160 }),
        fc.boolean(),
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: {
              width: sidebarCollapsed ? 64 : 200,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);
          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 計算利用率
          const widthUtilization = result.width / availableSpace.width;
          const heightUtilization = result.height / availableSpace.height;

          // 至少有一個維度的利用率應該 >= 90%
          const maxUtilization = Math.max(widthUtilization, heightUtilization);
          expect(maxUtilization).toBeGreaterThanOrEqual(0.90);

          // 兩個維度都不應超過 100%
          expect(widthUtilization).toBeLessThanOrEqual(1.0);
          expect(heightUtilization).toBeLessThanOrEqual(1.0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：最佳化計算的數學一致性
   * 
   * 驗證計算結果滿足數學約束：
   * - width = height * designRatio
   * - width <= availableWidth
   * - height <= availableHeight
   */
  it('should satisfy mathematical constraints for optimization', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        fc.boolean(),
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: {
              width: sidebarCollapsed ? 64 : 200,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const designRatio = 16 / 9;
          const availableSpace = calculator.calculateAvailableSpace(measurements);
          const result = calculator.calculate(measurements, {
            designRatio,
            fitMode: 'auto'
          });

          // 約束 1: width = height * designRatio (允許小誤差)
          const expectedWidth = result.height * designRatio;
          expect(Math.abs(result.width - expectedWidth)).toBeLessThan(1);

          // 約束 2: width <= availableWidth
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 0.1); // 允許浮點誤差

          // 約束 3: height <= availableHeight
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 0.1);

          // 約束 4: 如果以寬度為基準，則 width 應該等於 availableWidth
          if (result.fitMode === 'width-based') {
            expect(Math.abs(result.width - availableSpace.width)).toBeLessThan(1);
          }

          // 約束 5: 如果以高度為基準，則 height 應該等於 availableHeight
          if (result.fitMode === 'height-based') {
            expect(Math.abs(result.height - availableSpace.height)).toBeLessThan(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：最佳化計算在極端情況下的穩健性
   * 
   * 驗證在極端視窗尺寸下，計算仍能產生有效結果
   */
  it('should handle extreme viewport dimensions gracefully', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 800, height: 2000 },   // 非常高的視窗
          { width: 3840, height: 600 },   // 非常寬的視窗
          { width: 1024, height: 1024 },  // 正方形視窗
          { width: 2560, height: 800 },   // 超寬視窗
          { width: 800, height: 600 }     // 小視窗
        ),
        fc.boolean(),
        (viewport, sidebarCollapsed) => {
          const measurements: LayoutMeasurements = {
            viewport: viewport,
            sidebar: {
              width: sidebarCollapsed ? 64 : 200,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);
          
          // 只在有足夠可用空間時進行測試
          if (availableSpace.width > 100 && availableSpace.height > 100) {
            const result = calculator.calculate(measurements, {
              designRatio: 16 / 9,
              fitMode: 'auto'
            });

            // 驗證結果有效
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
            expect(result.width).toBeLessThanOrEqual(availableSpace.width);
            expect(result.height).toBeLessThanOrEqual(availableSpace.height);
            expect(Math.abs(result.width / result.height - 16 / 9)).toBeLessThan(0.01);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：最佳化計算結果的可重現性
   * 
   * 驗證相同的輸入總是產生相同的輸出（純函數特性）
   */
  it('should produce consistent results for the same input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        fc.boolean(),
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: {
              width: sidebarCollapsed ? 64 : 200,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 執行兩次相同的計算
          const result1 = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          const result2 = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 驗證結果完全相同
          expect(result1.width).toBe(result2.width);
          expect(result1.height).toBe(result2.height);
          expect(result1.fitMode).toBe(result2.fitMode);
          expect(result1.margins.top).toBe(result2.margins.top);
          expect(result1.margins.right).toBe(result2.margins.right);
          expect(result1.margins.bottom).toBe(result2.margins.bottom);
          expect(result1.margins.left).toBe(result2.margins.left);
        }
      ),
      { numRuns: 100 }
    );
  });
});
