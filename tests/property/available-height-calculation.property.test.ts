/**
 * Property-Based Tests for Available Height Calculation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 2: 可用高度計算
 * Validates: Requirements 1.4
 * 
 * 測試可用高度計算公式的正確性
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: Available Height Calculation', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 2: 可用高度計算
   * 
   * For any 視窗高度、固定元素高度（header、footer）和內容邊距，
   * 計算出的可用高度應該等於視窗高度減去所有固定元素高度再減去上下邊距
   * 
   * 這個屬性確保：
   * 1. 正確扣除 Header 高度
   * 2. 正確扣除 Footer 高度
   * 3. 正確扣除上下邊距
   * 4. 計算公式：可用高度 = 視窗高度 - Header 高度 - Footer 高度 - 上邊距 - 下邊距
   */
  it('should calculate available height correctly for any viewport and fixed elements', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 600, max: 2160 }), // 視窗高度（從 HD 到 4K）
        fc.integer({ min: 40, max: 100 }), // Header 高度
        fc.integer({ min: 30, max: 80 }), // Footer 高度
        fc.integer({ min: 0, max: 50 }), // 上邊距
        fc.integer({ min: 0, max: 50 }), // 下邊距
        (viewportHeight, headerHeight, footerHeight, paddingTop, paddingBottom) => {
          // 構建測量數據
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: headerHeight },
            footer: { height: footerHeight },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          // 執行計算
          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 計算期望值
          const expectedHeight = viewportHeight - headerHeight - footerHeight - paddingTop - paddingBottom;

          // 驗證計算結果
          expect(availableSpace.height).toBe(expectedHeight);
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 額外測試：驗證固定元素高度變化對可用高度的影響
   * 
   * 這個測試確保當固定元素高度增加時，可用高度會相應減少
   */
  it('should decrease available height when fixed element heights increase', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 2160 }), // 視窗高度
        fc.integer({ min: 0, max: 50 }), // 上邊距
        fc.integer({ min: 0, max: 50 }), // 下邊距
        (viewportHeight, paddingTop, paddingBottom) => {
          // 較小的固定元素高度
          const measurementsSmall: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: 50 },
            footer: { height: 30 },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          // 較大的固定元素高度
          const measurementsLarge: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: 80 },
            footer: { height: 60 },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          // 計算兩種情況的可用高度
          const availableSmall = calculator.calculateAvailableSpace(measurementsSmall);
          const availableLarge = calculator.calculateAvailableSpace(measurementsLarge);

          // 固定元素高度增加的總量
          const headerIncrease = 80 - 50; // 30px
          const footerIncrease = 60 - 30; // 30px
          const totalIncrease = headerIncrease + footerIncrease; // 60px

          // 可用高度應該減少相應的量
          expect(availableSmall.height - availableLarge.height).toBe(totalIncrease);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界情況測試：極端的邊距值
   * 
   * 測試當邊距值很大時，可用高度的計算仍然正確
   */
  it('should handle large padding values correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 2160 }), // 較大的視窗高度
        fc.integer({ min: 40, max: 100 }), // Header 高度
        fc.integer({ min: 30, max: 80 }), // Footer 高度
        fc.integer({ min: 50, max: 200 }), // 較大的上邊距
        fc.integer({ min: 50, max: 200 }), // 較大的下邊距
        (viewportHeight, headerHeight, footerHeight, paddingTop, paddingBottom) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: headerHeight },
            footer: { height: footerHeight },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);
          const expectedHeight = viewportHeight - headerHeight - footerHeight - paddingTop - paddingBottom;

          // 即使邊距很大，計算仍然應該正確
          expect(availableSpace.height).toBe(expectedHeight);

          // 如果計算結果為負，應該被修正為 0
          if (expectedHeight < 0) {
            expect(availableSpace.height).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 一致性測試：相同輸入應該產生相同輸出
   * 
   * 這個測試確保計算函數是純函數（無副作用）
   */
  it('should produce consistent results for the same input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 600, max: 2160 }),
        fc.integer({ min: 40, max: 100 }),
        fc.integer({ min: 30, max: 80 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        (viewportHeight, headerHeight, footerHeight, paddingTop, paddingBottom) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: headerHeight },
            footer: { height: footerHeight },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          // 多次計算應該得到相同結果
          const result1 = calculator.calculateAvailableSpace(measurements);
          const result2 = calculator.calculateAvailableSpace(measurements);
          const result3 = calculator.calculateAvailableSpace(measurements);

          expect(result1.height).toBe(result2.height);
          expect(result2.height).toBe(result3.height);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 非負性測試：可用高度永遠不應該是負數
   * 
   * 即使輸入的參數組合會導致負數結果，函數也應該返回 0
   */
  it('should never return negative available height', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 600, max: 2160 }),
        fc.integer({ min: 40, max: 300 }), // 可能很大的 Header
        fc.integer({ min: 30, max: 300 }), // 可能很大的 Footer
        fc.integer({ min: 0, max: 500 }), // 可能很大的上邊距
        fc.integer({ min: 0, max: 500 }), // 可能很大的下邊距
        (viewportHeight, headerHeight, footerHeight, paddingTop, paddingBottom) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: headerHeight },
            footer: { height: footerHeight },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 可用高度應該永遠 >= 0
          expect(availableSpace.height).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 數學屬性測試：可用高度 + 佔用高度 = 視窗高度
   * 
   * 驗證高度計算的數學正確性
   */
  it('should satisfy the equation: available height + occupied height = viewport height', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 600, max: 2160 }),
        fc.integer({ min: 40, max: 100 }),
        fc.integer({ min: 30, max: 80 }),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        (viewportHeight, headerHeight, footerHeight, paddingTop, paddingBottom) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: headerHeight },
            footer: { height: footerHeight },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 計算佔用的高度
          const occupiedHeight = headerHeight + footerHeight + paddingTop + paddingBottom;

          // 如果可用高度不是 0（沒有被修正），則應該滿足等式
          if (availableSpace.height > 0) {
            expect(availableSpace.height + occupiedHeight).toBe(viewportHeight);
          } else {
            // 如果可用高度是 0，說明佔用高度 >= 視窗高度
            expect(occupiedHeight).toBeGreaterThanOrEqual(viewportHeight);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊距獨立性測試：上下邊距的變化不應該影響寬度計算
   * 
   * 驗證高度計算與寬度計算的獨立性
   */
  it('should not affect width calculation when padding top/bottom changes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 600, max: 2160 }),
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (viewportHeight, paddingTop, paddingBottom) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: paddingTop,
              right: 24,
              bottom: paddingBottom,
              left: 24
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 上下邊距的變化不應該影響寬度
          const expectedWidth = 1920 - 200 - 24 - 24;
          expect(availableSpace.width).toBe(expectedWidth);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 零邊距測試：當所有邊距為 0 時的計算
   * 
   * 驗證邊界情況下的計算正確性
   */
  it('should calculate correctly when all paddings are zero', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 600, max: 2160 }),
        fc.integer({ min: 40, max: 100 }),
        fc.integer({ min: 30, max: 80 }),
        (viewportHeight, headerHeight, footerHeight) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: 1920, height: viewportHeight },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: headerHeight },
            footer: { height: footerHeight },
            contentPadding: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 當邊距為 0 時，可用高度 = 視窗高度 - Header - Footer
          const expectedHeight = viewportHeight - headerHeight - footerHeight;
          expect(availableSpace.height).toBe(expectedHeight);
        }
      ),
      { numRuns: 100 }
    );
  });
});
