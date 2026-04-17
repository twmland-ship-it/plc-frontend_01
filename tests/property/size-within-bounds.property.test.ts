/**
 * Property-Based Tests for Size Within Bounds
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 23: 計算結果不超出可用空間
 * Validates: Requirements 1.1, 6.4
 * 
 * 測試寬度和高度都不超出可用空間
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: Size Within Bounds', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 23: 計算結果不超出可用空間
   * 
   * For any 計算出的 iframe 尺寸，當使用等比例模式時，
   * 寬度不應超過可用寬度且高度不應超過可用高度
   * 
   * 這個屬性確保：
   * 1. 計算出的寬度 <= 可用寬度
   * 2. 計算出的高度 <= 可用高度
   * 3. 在 auto 模式下，系統自動選擇不會超出邊界的方案
   * 4. 即使在極端的視窗尺寸下，也不會超出可用空間
   */
  it('should never exceed available space in auto mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }), // 視窗寬度
        fc.integer({ min: 600, max: 2160 }), // 視窗高度
        fc.boolean(), // Sidebar 是否收合
        fc.integer({ min: 0, max: 50 }), // 上邊距
        fc.integer({ min: 0, max: 50 }), // 右邊距
        fc.integer({ min: 0, max: 50 }), // 下邊距
        fc.integer({ min: 0, max: 50 }), // 左邊距
        (viewportWidth, viewportHeight, sidebarCollapsed, paddingTop, paddingRight, paddingBottom, paddingLeft) => {
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
            contentPadding: {
              top: paddingTop,
              right: paddingRight,
              bottom: paddingBottom,
              left: paddingLeft
            }
          };

          // 使用 auto 模式計算（系統自動選擇最佳方案）
          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 計算實際可用空間
          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 驗證寬度不超出可用空間（允許 1px 的浮點數誤差）
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);

          // 驗證高度不超出可用空間（允許 1px 的浮點數誤差）
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);

          // 驗證結果中記錄的可用空間與實際計算一致
          expect(result.availableSpace.width).toBe(availableSpace.width);
          expect(result.availableSpace.height).toBe(availableSpace.height);
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：width-based 模式下寬度使用全部可用空間，高度不超出
   * 
   * 當明確指定以寬度為基準時：
   * - 寬度應該等於可用寬度
   * - 高度應該根據比例計算，但可能超出可用高度（這是預期行為）
   */
  it('should use full width in width-based mode', () => {
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
            fitMode: 'width-based'
          });

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 在 width-based 模式下，寬度應該等於可用寬度
          expect(Math.abs(result.width - availableSpace.width)).toBeLessThan(1);

          // 高度根據比例計算
          const expectedHeight = availableSpace.width / (16 / 9);
          expect(Math.abs(result.height - expectedHeight)).toBeLessThan(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：height-based 模式下高度使用全部可用空間，寬度不超出
   * 
   * 當明確指定以高度為基準時：
   * - 高度應該等於可用高度
   * - 寬度應該根據比例計算，但可能超出可用寬度（這是預期行為）
   */
  it('should use full height in height-based mode', () => {
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
            fitMode: 'height-based'
          });

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 在 height-based 模式下，高度應該等於可用高度
          expect(Math.abs(result.height - availableSpace.height)).toBeLessThan(1);

          // 寬度根據比例計算
          const expectedWidth = availableSpace.height * (16 / 9);
          expect(Math.abs(result.width - expectedWidth)).toBeLessThan(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：auto 模式智能選擇不超出邊界的方案
   * 
   * 驗證 auto 模式能夠正確選擇：
   * - 當以寬度為基準不會超出高度時，選擇 width-based
   * - 當以寬度為基準會超出高度時，選擇 height-based
   */
  it('should intelligently choose fit mode to stay within bounds', () => {
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

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 計算兩種方案
          const byWidthHeight = availableSpace.width / (16 / 9);
          const byHeightWidth = availableSpace.height * (16 / 9);

          // 驗證選擇的模式是正確的
          if (byWidthHeight <= availableSpace.height) {
            // 以寬度為基準不會超出，應該選擇 width-based
            expect(result.fitMode).toBe('width-based');
            expect(Math.abs(result.width - availableSpace.width)).toBeLessThan(1);
          } else {
            // 以寬度為基準會超出，應該選擇 height-based
            expect(result.fitMode).toBe('height-based');
            expect(Math.abs(result.height - availableSpace.height)).toBeLessThan(1);
          }

          // 無論選擇哪種模式，都不應該超出可用空間
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：極端視窗尺寸下不超出邊界
   * 
   * 測試在非常寬或非常高的視窗中，計算結果仍然不超出可用空間
   */
  it('should stay within bounds in extreme viewport dimensions', () => {
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

          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 驗證不超出邊界
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：不同設計比例下都不超出邊界
   * 
   * 測試系統能夠處理任意設計比例，並確保不超出可用空間
   */
  it('should stay within bounds for any design ratio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        fc.double({ min: 1.0, max: 2.5, noNaN: true }), // 設計比例
        fc.boolean(),
        (viewportWidth, viewportHeight, designRatio, sidebarCollapsed) => {
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
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 驗證不超出邊界
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：Sidebar 狀態變化時仍不超出邊界
   * 
   * 當 Sidebar 展開或收合時，可用空間會改變，
   * 但計算結果仍應該在新的可用空間範圍內
   */
  it('should stay within bounds when sidebar state changes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1200, max: 3840 }), // 較大的視窗以確保有足夠空間
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

          const availableExpanded = calculator.calculateAvailableSpace(measurementsExpanded);
          const availableCollapsed = calculator.calculateAvailableSpace(measurementsCollapsed);

          // 展開狀態下不超出邊界
          expect(resultExpanded.width).toBeLessThanOrEqual(availableExpanded.width + 1);
          expect(resultExpanded.height).toBeLessThanOrEqual(availableExpanded.height + 1);

          // 收合狀態下不超出邊界
          expect(resultCollapsed.width).toBeLessThanOrEqual(availableCollapsed.width + 1);
          expect(resultCollapsed.height).toBeLessThanOrEqual(availableCollapsed.height + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：常見解析度下不超出邊界
   * 
   * 測試常見的螢幕解析度，確保計算結果不超出可用空間
   */
  it('should stay within bounds for common resolutions', () => {
    const commonResolutions = [
      { width: 1920, height: 1080, name: 'Full HD' },
      { width: 1366, height: 768, name: 'HD' },
      { width: 2560, height: 1440, name: '2K' },
      { width: 3840, height: 2160, name: '4K' },
      { width: 1280, height: 720, name: 'HD 720p' },
      { width: 1600, height: 900, name: 'HD+' }
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

            const availableSpace = calculator.calculateAvailableSpace(measurements);

            // 驗證不超出邊界
            expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);
            expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);
          }
        ),
        { numRuns: 20 } // 每個解析度測試 20 次
      );
    });
  });

  /**
   * 測試：邊距變化時不超出邊界
   * 
   * 當內容邊距改變時，可用空間會相應減少，
   * 計算結果應該適應新的可用空間
   */
  it('should stay within bounds with varying padding', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1200, max: 3840 }),
        fc.integer({ min: 800, max: 2160 }),
        fc.integer({ min: 0, max: 100 }), // 邊距可以更大
        (viewportWidth, viewportHeight, padding) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: {
              top: padding,
              right: padding,
              bottom: padding,
              left: padding
            }
          };

          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 驗證不超出邊界
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：結果尺寸為正數且在合理範圍內
   * 
   * 除了不超出邊界，還要確保計算結果是有意義的正數
   */
  it('should produce positive dimensions within bounds', () => {
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

          const availableSpace = calculator.calculateAvailableSpace(measurements);

          // 驗證尺寸為正數
          expect(result.width).toBeGreaterThan(0);
          expect(result.height).toBeGreaterThan(0);

          // 驗證不超出邊界
          expect(result.width).toBeLessThanOrEqual(availableSpace.width + 1);
          expect(result.height).toBeLessThanOrEqual(availableSpace.height + 1);

          // 驗證尺寸在合理範圍內（至少有一些最小尺寸）
          expect(result.width).toBeGreaterThan(100);
          expect(result.height).toBeGreaterThan(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});
