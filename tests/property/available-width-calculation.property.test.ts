/**
 * Property-Based Tests for Available Width Calculation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 1: Sidebar 狀態下的可用寬度計算
 * Validates: Requirements 1.2, 1.3
 * 
 * 測試不同 Sidebar 狀態下的寬度計算
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: Available Width Calculation', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 1: Sidebar 狀態下的可用寬度計算
   * 
   * For any 視窗寬度、Sidebar 狀態（展開/收合）和內容邊距，
   * 計算出的可用寬度應該等於視窗寬度減去 Sidebar 寬度再減去左右邊距
   * 
   * 這個屬性確保：
   * 1. 當 Sidebar 展開時，使用完整的 Sidebar 寬度
   * 2. 當 Sidebar 收合時，使用收合後的 Sidebar 寬度
   * 3. 正確扣除左右邊距
   * 4. 計算公式：可用寬度 = 視窗寬度 - Sidebar 寬度 - 左邊距 - 右邊距
   */
  it('should calculate available width correctly for any viewport and sidebar state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 視窗寬度（從 HD 到 4K）
        fc.boolean(), // Sidebar 是否收合
        fc.integer({ min: 0, max: 50 }), // 左邊距
        fc.integer({ min: 0, max: 50 }), // 右邊距
        (viewportWidth, sidebarCollapsed, paddingLeft, paddingRight) => {
          // 根據 Sidebar 狀態決定寬度
          const sidebarWidth = sidebarCollapsed ? 64 : 200;

          // 構建測量數據
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: sidebarWidth,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          // 執行計算
          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 計算期望值
          const expectedWidth = viewportWidth - sidebarWidth - paddingLeft - paddingRight;

          // 驗證計算結果
          expect(availableSpace.width).toBe(expectedWidth);
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 額外測試：驗證 Sidebar 展開和收合狀態的寬度差異
   * 
   * 這個測試確保當 Sidebar 從展開變為收合時，可用寬度會相應增加
   */
  it('should increase available width when sidebar collapses', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 視窗寬度
        fc.integer({ min: 0, max: 50 }), // 左邊距
        fc.integer({ min: 0, max: 50 }), // 右邊距
        (viewportWidth, paddingLeft, paddingRight) => {
          // Sidebar 展開狀態
          const measurementsExpanded: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: 200,
              collapsed: false,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          // Sidebar 收合狀態
          const measurementsCollapsed: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: 64,
              collapsed: true,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          // 計算兩種狀態的可用寬度
          const availableExpanded = calculator.calculateAvailableSpace(measurementsExpanded);
          const availableCollapsed = calculator.calculateAvailableSpace(measurementsCollapsed);

          // 收合後的可用寬度應該比展開時多 136px (200 - 64)
          const expectedDifference = 200 - 64;
          expect(availableCollapsed.width - availableExpanded.width).toBe(expectedDifference);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界情況測試：極端的邊距值
   * 
   * 測試當邊距值很大時，可用寬度的計算仍然正確
   */
  it('should handle large padding values correctly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 3840 }), // 較大的視窗寬度
        fc.boolean(), // Sidebar 狀態
        fc.integer({ min: 50, max: 200 }), // 較大的左邊距
        fc.integer({ min: 50, max: 200 }), // 較大的右邊距
        (viewportWidth, sidebarCollapsed, paddingLeft, paddingRight) => {
          const sidebarWidth = sidebarCollapsed ? 64 : 200;

          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: sidebarWidth,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);
          const expectedWidth = viewportWidth - sidebarWidth - paddingLeft - paddingRight;

          // 即使邊距很大，計算仍然應該正確
          expect(availableSpace.width).toBe(expectedWidth);

          // 如果計算結果為負，應該被修正為 0
          if (expectedWidth < 0) {
            expect(availableSpace.width).toBe(0);
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
        fc.integer({ min: 800, max: 3840 }),
        fc.boolean(),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        (viewportWidth, sidebarCollapsed, paddingLeft, paddingRight) => {
          const sidebarWidth = sidebarCollapsed ? 64 : 200;

          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: sidebarWidth,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          // 多次計算應該得到相同結果
          const result1 = calculator.calculateAvailableSpace(measurements);
          const result2 = calculator.calculateAvailableSpace(measurements);
          const result3 = calculator.calculateAvailableSpace(measurements);

          expect(result1.width).toBe(result2.width);
          expect(result2.width).toBe(result3.width);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 非負性測試：可用寬度永遠不應該是負數
   * 
   * 即使輸入的參數組合會導致負數結果，函數也應該返回 0
   */
  it('should never return negative available width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.boolean(),
        fc.integer({ min: 0, max: 500 }), // 可能很大的邊距
        fc.integer({ min: 0, max: 500 }),
        (viewportWidth, sidebarCollapsed, paddingLeft, paddingRight) => {
          const sidebarWidth = sidebarCollapsed ? 64 : 200;

          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: sidebarWidth,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 可用寬度應該永遠 >= 0
          expect(availableSpace.width).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 數學屬性測試：可用寬度 + 佔用寬度 = 視窗寬度
   * 
   * 驗證寬度計算的數學正確性
   */
  it('should satisfy the equation: available width + occupied width = viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.boolean(),
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 0, max: 50 }),
        (viewportWidth, sidebarCollapsed, paddingLeft, paddingRight) => {
          const sidebarWidth = sidebarCollapsed ? 64 : 200;

          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: 1080 },
            sidebar: {
              width: sidebarWidth,
              collapsed: sidebarCollapsed,
              collapsedWidth: 64
            },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: 24,
              right: paddingRight,
              bottom: 24,
              left: paddingLeft
            }
          };

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 計算佔用的寬度
          const occupiedWidth = sidebarWidth + paddingLeft + paddingRight;

          // 如果可用寬度不是 0（沒有被修正），則應該滿足等式
          if (availableSpace.width > 0) {
            expect(availableSpace.width + occupiedWidth).toBe(viewportWidth);
          } else {
            // 如果可用寬度是 0，說明佔用寬度 >= 視窗寬度
            expect(occupiedWidth).toBeGreaterThanOrEqual(viewportWidth);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
