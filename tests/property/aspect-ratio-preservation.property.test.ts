/**
 * Property-Based Tests for 16:9 Aspect Ratio Preservation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 4: 16:9 比例保持
 * Validates: Requirements 1.5
 * 
 * 測試計算結果保持 16:9 比例
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: 16:9 Aspect Ratio Preservation', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 4: 16:9 比例保持
   * 
   * For any 計算出的 iframe 尺寸，當設計解析度為 1920x1080 且使用等比例模式時，
   * 寬高比應該等於 16:9（誤差在 0.01 以內）
   * 
   * 這個屬性確保：
   * 1. 無論視窗大小如何變化，計算出的尺寸始終保持 16:9 比例
   * 2. 無論 Sidebar 是展開還是收合，比例都保持不變
   * 3. 計算結果的寬高比與設計比例一致
   * 4. 允許浮點數計算的微小誤差（< 0.01）
   */
  it('should maintain 16:9 aspect ratio for any calculated size', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 視窗寬度（從 HD 到 4K）
        fc.integer({ min: 600, max: 2160 }), // 視窗高度（從 SVGA 到 4K）
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

          // 使用 16:9 比例進行計算（1920x1080 的比例）
          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 計算實際的寬高比
          const actualRatio = result.width / result.height;
          const expectedRatio = 16 / 9;

          // 驗證比例保持（允許 0.01 的誤差）
          expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 額外測試：不同設計比例的保持
   * 
   * 測試系統能夠正確保持任意指定的設計比例
   */
  it('should maintain any specified design ratio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 視窗寬度
        fc.integer({ min: 600, max: 2160 }), // 視窗高度
        fc.double({ min: 1.0, max: 2.5, noNaN: true }), // 設計比例（例如 4:3=1.33, 16:9=1.78, 21:9=2.33）
        (viewportWidth, viewportHeight, designRatio) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const actualRatio = result.width / result.height;

          // 驗證比例保持
          expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：width-based 模式下的比例保持
   * 
   * 當明確指定以寬度為基準時，仍應保持比例
   */
  it('should maintain aspect ratio in width-based mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        (viewportWidth, viewportHeight) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'width-based'
          });

          const actualRatio = result.width / result.height;
          const expectedRatio = 16 / 9;

          expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.01);
          expect(result.fitMode).toBe('width-based');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：height-based 模式下的比例保持
   * 
   * 當明確指定以高度為基準時，仍應保持比例
   */
  it('should maintain aspect ratio in height-based mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        (viewportWidth, viewportHeight) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'height-based'
          });

          const actualRatio = result.width / result.height;
          const expectedRatio = 16 / 9;

          expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.01);
          expect(result.fitMode).toBe('height-based');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：Sidebar 狀態變化不影響比例
   * 
   * 當 Sidebar 展開或收合時，計算出的尺寸可能改變，但比例應該保持不變
   */
  it('should maintain aspect ratio regardless of sidebar state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1200, max: 3840 }), // 較大的視窗寬度以確保有足夠空間
        fc.integer({ min: 800, max: 2160 }),
        (viewportWidth, viewportHeight) => {
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

          const resultExpanded = calculator.calculate(measurementsExpanded, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          const resultCollapsed = calculator.calculate(measurementsCollapsed, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          const ratioExpanded = resultExpanded.width / resultExpanded.height;
          const ratioCollapsed = resultCollapsed.width / resultCollapsed.height;
          const expectedRatio = 16 / 9;

          // 兩種狀態下的比例都應該是 16:9
          expect(Math.abs(ratioExpanded - expectedRatio)).toBeLessThan(0.01);
          expect(Math.abs(ratioCollapsed - expectedRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：常見解析度的比例保持
   * 
   * 測試常見的 16:9 解析度（1920x1080, 1366x768, 2560x1440）
   */
  it('should maintain 16:9 ratio for common resolutions', () => {
    const commonResolutions = [
      { width: 1920, height: 1080, name: 'Full HD' },
      { width: 1366, height: 768, name: 'HD' },
      { width: 2560, height: 1440, name: '2K' },
      { width: 3840, height: 2160, name: '4K' }
    ];

    commonResolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.boolean(), // Sidebar 狀態
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

            const result = calculator.calculate(measurements, {
              designRatio: 16 / 9,
              fitMode: 'auto'
            });

            const actualRatio = result.width / result.height;
            const expectedRatio = 16 / 9;

            expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 20 } // 每個解析度測試 20 次
      );
    });
  });

  /**
   * 測試：極端視窗尺寸下的比例保持
   * 
   * 測試在非常寬或非常高的視窗中，比例仍然保持
   */
  it('should maintain aspect ratio in extreme viewport dimensions', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 800, height: 2000 },   // 非常高的視窗
          { width: 3840, height: 600 },   // 非常寬的視窗
          { width: 1024, height: 1024 },  // 正方形視窗
          { width: 2560, height: 800 }    // 超寬視窗
        ),
        (viewport) => {
          const measurements: LayoutMeasurements = {
            viewport: viewport,
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          const actualRatio = result.width / result.height;
          const expectedRatio = 16 / 9;

          expect(Math.abs(actualRatio - expectedRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：比例保持的數學一致性
   * 
   * 驗證 width / height = designRatio 這個數學關係
   */
  it('should satisfy the mathematical relationship: width / height = designRatio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        fc.double({ min: 1.0, max: 2.5, noNaN: true }),
        (viewportWidth, viewportHeight, designRatio) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證數學關係
          const calculatedRatio = result.width / result.height;
          const difference = Math.abs(calculatedRatio - designRatio);

          // 差異應該小於 0.01
          expect(difference).toBeLessThan(0.01);

          // 或者用另一種方式驗證：width 應該約等於 height * designRatio
          const expectedWidth = result.height * designRatio;
          expect(Math.abs(result.width - expectedWidth)).toBeLessThan(1); // 允許 1px 的誤差
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：1920x1080 設計解析度的特定測試
   * 
   * 針對需求中明確提到的 1920x1080 設計解析度進行測試
   */
  it('should maintain 16:9 ratio for 1920x1080 design resolution', () => {
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

          // 使用 1920x1080 的比例（16:9）
          const designRatio = 1920 / 1080;

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const actualRatio = result.width / result.height;

          // 驗證比例保持
          expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);

          // 額外驗證：比例應該接近 16/9
          expect(Math.abs(actualRatio - (16 / 9))).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});
