/**
 * Property-Based Tests for Center Margins Calculation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 15: 水平和垂直置中計算
 * Validates: Requirements 7.3, 7.4, 7.5
 * 
 * 測試居中時邊距相等
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';

describe('Property: Center Margins Calculation', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 15: 水平和垂直置中計算
   * 
   * For any 可用空間和內容尺寸，當選擇水平置中時，左右邊距應該相等；
   * 當選擇垂直置中時，上下邊距應該相等；
   * 當選擇完全置中時，四個邊距應該正確計算使內容居中
   * 
   * 這個屬性確保：
   * 1. 水平置中：左邊距 = 右邊距 = (可用寬度 - 內容寬度) / 2
   * 2. 垂直置中：上邊距 = 下邊距 = (可用高度 - 內容高度) / 2
   * 3. 完全置中：同時滿足水平和垂直置中
   * 4. 所有邊距值都應該 >= 0
   */
  it('should calculate equal horizontal margins for centering', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 可用寬度
        fc.integer({ min: 600, max: 2560 }), // 內容寬度（小於可用寬度）
        fc.integer({ min: 600, max: 2160 }), // 可用高度
        fc.integer({ min: 400, max: 1440 }), // 內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          // 確保內容寬度不超過可用寬度
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證水平置中：左邊距 = 右邊距
          expect(margins.left).toBe(margins.right);

          // 驗證計算公式
          const expectedHorizontalMargin = (availableWidth - actualContentWidth) / 2;
          expect(margins.left).toBe(Math.max(0, expectedHorizontalMargin));
          expect(margins.right).toBe(Math.max(0, expectedHorizontalMargin));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試垂直置中：上下邊距應該相等
   */
  it('should calculate equal vertical margins for centering', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 可用寬度
        fc.integer({ min: 600, max: 2560 }), // 內容寬度
        fc.integer({ min: 600, max: 2160 }), // 可用高度
        fc.integer({ min: 400, max: 1440 }), // 內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          // 確保內容尺寸不超過可用空間
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證垂直置中：上邊距 = 下邊距
          expect(margins.top).toBe(margins.bottom);

          // 驗證計算公式
          const expectedVerticalMargin = (availableHeight - actualContentHeight) / 2;
          expect(margins.top).toBe(Math.max(0, expectedVerticalMargin));
          expect(margins.bottom).toBe(Math.max(0, expectedVerticalMargin));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試完全置中：同時滿足水平和垂直置中
   */
  it('should calculate all margins correctly for complete centering', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 可用寬度
        fc.integer({ min: 600, max: 2560 }), // 內容寬度
        fc.integer({ min: 600, max: 2160 }), // 可用高度
        fc.integer({ min: 400, max: 1440 }), // 內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          // 確保內容尺寸不超過可用空間
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證完全置中
          expect(margins.left).toBe(margins.right);
          expect(margins.top).toBe(margins.bottom);

          // 驗證計算公式
          const expectedHorizontalMargin = (availableWidth - actualContentWidth) / 2;
          const expectedVerticalMargin = (availableHeight - actualContentHeight) / 2;

          expect(margins.left).toBe(Math.max(0, expectedHorizontalMargin));
          expect(margins.right).toBe(Math.max(0, expectedHorizontalMargin));
          expect(margins.top).toBe(Math.max(0, expectedVerticalMargin));
          expect(margins.bottom).toBe(Math.max(0, expectedVerticalMargin));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試邊距非負性：所有邊距值都應該 >= 0
   */
  it('should never return negative margins', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 3840 }), // 可用寬度
        fc.integer({ min: 100, max: 4000 }), // 內容寬度（可能超過可用寬度）
        fc.integer({ min: 100, max: 2160 }), // 可用高度
        fc.integer({ min: 100, max: 3000 }), // 內容高度（可能超過可用高度）
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: contentWidth,
            height: contentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證所有邊距都 >= 0
          expect(margins.top).toBeGreaterThanOrEqual(0);
          expect(margins.right).toBeGreaterThanOrEqual(0);
          expect(margins.bottom).toBeGreaterThanOrEqual(0);
          expect(margins.left).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試數學屬性：內容尺寸 + 邊距 = 可用空間
   * 
   * 驗證邊距計算的數學正確性
   */
  it('should satisfy the equation: content size + margins = available space', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 可用寬度
        fc.integer({ min: 600, max: 2560 }), // 內容寬度
        fc.integer({ min: 600, max: 2160 }), // 可用高度
        fc.integer({ min: 400, max: 1440 }), // 內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          // 確保內容尺寸不超過可用空間
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證水平方向的等式
          const totalWidth = actualContentWidth + margins.left + margins.right;
          expect(totalWidth).toBeCloseTo(availableWidth, 5);

          // 驗證垂直方向的等式
          const totalHeight = actualContentHeight + margins.top + margins.bottom;
          expect(totalHeight).toBeCloseTo(availableHeight, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試對稱性：內容居中時，左右邊距之和應該等於可用寬度減去內容寬度
   */
  it('should maintain symmetry in margin calculations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 可用寬度
        fc.integer({ min: 600, max: 2560 }), // 內容寬度
        fc.integer({ min: 600, max: 2160 }), // 可用高度
        fc.integer({ min: 400, max: 1440 }), // 內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          // 確保內容尺寸不超過可用空間
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證水平對稱性
          const horizontalMarginSum = margins.left + margins.right;
          const expectedHorizontalSum = availableWidth - actualContentWidth;
          expect(horizontalMarginSum).toBeCloseTo(expectedHorizontalSum, 5);

          // 驗證垂直對稱性
          const verticalMarginSum = margins.top + margins.bottom;
          const expectedVerticalSum = availableHeight - actualContentHeight;
          expect(verticalMarginSum).toBeCloseTo(expectedVerticalSum, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試一致性：相同輸入應該產生相同輸出
   */
  it('should produce consistent results for the same input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2560 }),
        fc.integer({ min: 600, max: 2160 }),
        fc.integer({ min: 400, max: 1440 }),
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 多次計算應該得到相同結果
          const result1 = calculator.calculateCenterMargins(availableSpace, contentSize);
          const result2 = calculator.calculateCenterMargins(availableSpace, contentSize);
          const result3 = calculator.calculateCenterMargins(availableSpace, contentSize);

          expect(result1.top).toBe(result2.top);
          expect(result1.right).toBe(result2.right);
          expect(result1.bottom).toBe(result2.bottom);
          expect(result1.left).toBe(result2.left);

          expect(result2.top).toBe(result3.top);
          expect(result2.right).toBe(result3.right);
          expect(result2.bottom).toBe(result3.bottom);
          expect(result2.left).toBe(result3.left);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界情況測試：內容尺寸等於可用空間時，邊距應該為 0
   */
  it('should return zero margins when content fills available space', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 可用寬度
        fc.integer({ min: 600, max: 2160 }), // 可用高度
        (availableWidth, availableHeight) => {
          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          // 內容尺寸等於可用空間
          const contentSize = {
            width: availableWidth,
            height: availableHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 所有邊距都應該為 0
          expect(margins.top).toBe(0);
          expect(margins.right).toBe(0);
          expect(margins.bottom).toBe(0);
          expect(margins.left).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界情況測試：內容尺寸超過可用空間時，邊距應該為 0
   */
  it('should return zero margins when content exceeds available space', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 2000 }), // 較小的可用寬度
        fc.integer({ min: 2001, max: 4000 }), // 較大的內容寬度
        fc.integer({ min: 600, max: 1000 }), // 較小的可用高度
        fc.integer({ min: 1001, max: 2000 }), // 較大的內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: contentWidth,
            height: contentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 所有邊距都應該為 0（因為內容超過可用空間）
          expect(margins.top).toBe(0);
          expect(margins.right).toBe(0);
          expect(margins.bottom).toBe(0);
          expect(margins.left).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 精確度測試：邊距計算應該精確到小數點
   */
  it('should handle fractional margins correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 801, max: 3841 }), // 奇數可用寬度
        fc.integer({ min: 600, max: 2560 }), // 偶數內容寬度
        fc.integer({ min: 601, max: 2161 }), // 奇數可用高度
        fc.integer({ min: 400, max: 1440 }), // 偶數內容高度
        (availableWidth, contentWidth, availableHeight, contentHeight) => {
          // 確保內容尺寸不超過可用空間
          const actualContentWidth = Math.min(contentWidth, availableWidth);
          const actualContentHeight = Math.min(contentHeight, availableHeight);

          const availableSpace = {
            width: availableWidth,
            height: availableHeight
          };

          const contentSize = {
            width: actualContentWidth,
            height: actualContentHeight
          };

          // 執行計算
          const margins = calculator.calculateCenterMargins(availableSpace, contentSize);

          // 驗證邊距可能是小數
          const horizontalMargin = (availableWidth - actualContentWidth) / 2;
          const verticalMargin = (availableHeight - actualContentHeight) / 2;

          expect(margins.left).toBeCloseTo(Math.max(0, horizontalMargin), 10);
          expect(margins.right).toBeCloseTo(Math.max(0, horizontalMargin), 10);
          expect(margins.top).toBeCloseTo(Math.max(0, verticalMargin), 10);
          expect(margins.bottom).toBeCloseTo(Math.max(0, verticalMargin), 10);
        }
      ),
      { numRuns: 100 }
    );
  });
});
