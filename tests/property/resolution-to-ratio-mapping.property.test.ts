/**
 * Property-Based Tests for Resolution to Aspect Ratio Mapping
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 11: 解析度到比例映射
 * Validates: Requirements 8.2, 8.3, 8.4
 * 
 * 測試 16:9 解析度使用正確比例
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';
import { COMMON_RESOLUTIONS } from '../../src/types/iframe-config';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: Resolution to Aspect Ratio Mapping', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 11: 解析度到比例映射
   * 
   * For any 16:9 的標準解析度（1920x1080, 1366x768, 2560x1440），
   * 系統應該使用 16:9 的寬高比進行計算
   * 
   * 這個屬性確保：
   * 1. 標準 16:9 解析度正確映射到 16:9 比例
   * 2. 計算結果保持 16:9 的寬高比
   * 3. 不同的 16:9 解析度使用相同的比例計算邏輯
   */
  it('should use 16:9 aspect ratio for standard 16:9 resolutions', () => {
    // 標準 16:9 解析度列表
    const standard16x9Resolutions = [
      { width: 1920, height: 1080, name: 'Full HD' },
      { width: 1366, height: 768, name: 'HD' },
      { width: 2560, height: 1440, name: '2K' }
    ];

    standard16x9Resolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.integer({ min: 800, max: 3840 }), // 視窗寬度
          fc.integer({ min: 600, max: 2160 }), // 視窗高度
          fc.boolean(), // Sidebar 狀態
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

            // 從解析度計算設計比例
            const designRatio = resolution.width / resolution.height;

            // 執行計算
            const result = calculator.calculate(measurements, {
              designRatio: designRatio,
              fitMode: 'auto'
            });

            // 計算實際的寬高比
            const actualRatio = result.width / result.height;

            // 驗證比例應該是 16:9（允許 0.01 的誤差）
            const expected16x9Ratio = 16 / 9;
            expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);

            // 額外驗證：實際比例應該與設計比例一致
            expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 50 } // 每個解析度測試 50 次
      );
    });
  });

  /**
   * 測試：1920x1080 解析度映射到 16:9 比例
   * 
   * Requirement 8.2: WHEN 用戶選擇 1920x1080 THEN THE System SHALL 使用 16:9 的 Aspect_Ratio
   */
  it('should map 1920x1080 resolution to 16:9 aspect ratio', () => {
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

          // 1920x1080 的比例
          const designRatio = 1920 / 1080;

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const actualRatio = result.width / result.height;
          const expected16x9Ratio = 16 / 9;

          // 驗證使用 16:9 比例
          expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);

          // 驗證 1920/1080 約等於 16/9
          expect(Math.abs(designRatio - expected16x9Ratio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：1366x768 解析度映射到 16:9 比例
   * 
   * Requirement 8.3: WHEN 用戶選擇 1366x768 THEN THE System SHALL 使用 16:9 的 Aspect_Ratio
   */
  it('should map 1366x768 resolution to 16:9 aspect ratio', () => {
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

          // 1366x768 的比例
          const designRatio = 1366 / 768;

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const actualRatio = result.width / result.height;
          const expected16x9Ratio = 16 / 9;

          // 驗證使用 16:9 比例
          expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);

          // 驗證 1366/768 約等於 16/9
          expect(Math.abs(designRatio - expected16x9Ratio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：2560x1440 解析度映射到 16:9 比例
   * 
   * Requirement 8.4: WHEN 用戶選擇 2560x1440 THEN THE System SHALL 使用 16:9 的 Aspect_Ratio
   */
  it('should map 2560x1440 resolution to 16:9 aspect ratio', () => {
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

          // 2560x1440 的比例
          const designRatio = 2560 / 1440;

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const actualRatio = result.width / result.height;
          const expected16x9Ratio = 16 / 9;

          // 驗證使用 16:9 比例
          expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);

          // 驗證 2560/1440 約等於 16/9
          expect(Math.abs(designRatio - expected16x9Ratio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：所有常見 16:9 解析度的一致性
   * 
   * 驗證所有預定義的 16:9 解析度都產生相同的比例
   */
  it('should produce consistent 16:9 ratio for all common 16:9 resolutions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1200, max: 3840 }), // 較大的視窗以確保有足夠空間
        fc.integer({ min: 800, max: 2160 }),
        (viewportWidth, viewportHeight) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 測試所有常見的 16:9 解析度
          const ratios = COMMON_RESOLUTIONS.map(resolution => {
            const designRatio = resolution.width / resolution.height;
            const result = calculator.calculate(measurements, {
              designRatio: designRatio,
              fitMode: 'auto'
            });
            return result.width / result.height;
          });

          // 所有比例都應該接近 16:9
          const expected16x9Ratio = 16 / 9;
          ratios.forEach(ratio => {
            expect(Math.abs(ratio - expected16x9Ratio)).toBeLessThan(0.01);
          });

          // 所有比例之間的差異應該很小（一致性）
          const maxRatio = Math.max(...ratios);
          const minRatio = Math.min(...ratios);
          expect(maxRatio - minRatio).toBeLessThan(0.02);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：解析度比例的數學正確性
   * 
   * 驗證標準 16:9 解析度的寬高比確實等於 16/9
   */
  it('should verify that standard resolutions have correct 16:9 mathematical ratio', () => {
    const standard16x9Resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 },
      { width: 3840, height: 2160 }
    ];

    const expected16x9Ratio = 16 / 9;

    standard16x9Resolutions.forEach(resolution => {
      const actualRatio = resolution.width / resolution.height;
      
      // 驗證每個解析度的比例都接近 16:9
      expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);
    });
  });

  /**
   * 測試：不同 Sidebar 狀態下的比例一致性
   * 
   * 驗證無論 Sidebar 展開或收合，使用相同解析度計算出的比例都是 16:9
   */
  it('should maintain 16:9 ratio regardless of sidebar state for standard resolutions', () => {
    const resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 }
    ];

    resolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1200, max: 3840 }),
          fc.integer({ min: 800, max: 2160 }),
          (viewportWidth, viewportHeight) => {
            const designRatio = resolution.width / resolution.height;

            // Sidebar 展開
            const measurementsExpanded: LayoutMeasurements = {
              viewport: { width: viewportWidth, height: viewportHeight },
              sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            // Sidebar 收合
            const measurementsCollapsed: LayoutMeasurements = {
              viewport: { width: viewportWidth, height: viewportHeight },
              sidebar: { width: 64, collapsed: true, collapsedWidth: 64 },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            const resultExpanded = calculator.calculate(measurementsExpanded, {
              designRatio: designRatio,
              fitMode: 'auto'
            });

            const resultCollapsed = calculator.calculate(measurementsCollapsed, {
              designRatio: designRatio,
              fitMode: 'auto'
            });

            const ratioExpanded = resultExpanded.width / resultExpanded.height;
            const ratioCollapsed = resultCollapsed.width / resultCollapsed.height;
            const expected16x9Ratio = 16 / 9;

            // 兩種狀態下的比例都應該是 16:9
            expect(Math.abs(ratioExpanded - expected16x9Ratio)).toBeLessThan(0.01);
            expect(Math.abs(ratioCollapsed - expected16x9Ratio)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * 測試：width-based 和 height-based 模式下的比例一致性
   * 
   * 驗證無論使用哪種適應模式，16:9 解析度都產生 16:9 比例
   */
  it('should maintain 16:9 ratio in both width-based and height-based modes', () => {
    const resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 }
    ];

    resolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1200, max: 3840 }),
          fc.integer({ min: 800, max: 2160 }),
          fc.constantFrom('width-based' as const, 'height-based' as const),
          (viewportWidth, viewportHeight, fitMode) => {
            const measurements: LayoutMeasurements = {
              viewport: { width: viewportWidth, height: viewportHeight },
              sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            const designRatio = resolution.width / resolution.height;

            const result = calculator.calculate(measurements, {
              designRatio: designRatio,
              fitMode: fitMode
            });

            const actualRatio = result.width / result.height;
            const expected16x9Ratio = 16 / 9;

            // 驗證比例是 16:9
            expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);

            // 驗證使用了正確的適應模式
            expect(result.fitMode).toBe(fitMode);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * 測試：解析度到比例的映射函數
   * 
   * 驗證從解析度計算出的比例確實是 16:9
   */
  it('should correctly calculate 16:9 ratio from resolution dimensions', () => {
    const testCases = [
      { width: 1920, height: 1080, expectedRatio: 16 / 9 },
      { width: 1366, height: 768, expectedRatio: 16 / 9 },
      { width: 2560, height: 1440, expectedRatio: 16 / 9 },
      { width: 3840, height: 2160, expectedRatio: 16 / 9 }
    ];

    testCases.forEach(testCase => {
      const calculatedRatio = testCase.width / testCase.height;
      
      // 驗證計算出的比例等於預期的 16:9
      expect(Math.abs(calculatedRatio - testCase.expectedRatio)).toBeLessThan(0.01);
    });
  });

  /**
   * 測試：極端視窗尺寸下的比例保持
   * 
   * 即使在非常小或非常大的視窗中，16:9 解析度仍應產生 16:9 比例
   */
  it('should maintain 16:9 ratio in extreme viewport sizes', () => {
    const resolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 }
    ];

    const extremeViewports = [
      { width: 800, height: 600 },    // 最小視窗
      { width: 3840, height: 2160 },  // 4K 視窗
      { width: 1024, height: 1024 },  // 正方形視窗
      { width: 2560, height: 800 }    // 超寬視窗
    ];

    resolutions.forEach(resolution => {
      extremeViewports.forEach(viewport => {
        const measurements: LayoutMeasurements = {
          viewport: viewport,
          sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
          header: { height: 64 },
          footer: { height: 50 },
          contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
        };

        const designRatio = resolution.width / resolution.height;

        const result = calculator.calculate(measurements, {
          designRatio: designRatio,
          fitMode: 'auto'
        });

        const actualRatio = result.width / result.height;
        const expected16x9Ratio = 16 / 9;

        // 驗證比例是 16:9
        expect(Math.abs(actualRatio - expected16x9Ratio)).toBeLessThan(0.01);
      });
    });
  });
});
