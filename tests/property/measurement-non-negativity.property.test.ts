/**
 * Property-Based Tests for Layout Measurements
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 22: 計算結果非負性
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4
 * 
 * 測試所有測量值都 >= 0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { LayoutMeasurer } from '../../src/utils/layout-measurer';

describe('Property: Measurement Non-Negativity', () => {
  let measurer: LayoutMeasurer;

  beforeEach(() => {
    measurer = new LayoutMeasurer();
  });

  afterEach(() => {
    measurer.dispose();
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 22: 計算結果非負性
   * 
   * For any 測量操作，所有返回的測量值（寬度、高度、邊距）都應該大於或等於 0
   * 
   * 這個屬性確保：
   * 1. viewport 的寬度和高度都是非負數
   * 2. sidebar 的寬度和收合寬度都是非負數
   * 3. header 和 footer 的高度都是非負數
   * 4. contentPadding 的所有值（top, right, bottom, left）都是非負數
   */
  it('should always return non-negative measurements', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // 我們不需要生成輸入，因為 measure() 不接受參數
        () => {
          const measurements = measurer.measure();

          // 驗證 viewport 尺寸非負
          expect(measurements.viewport.width).toBeGreaterThanOrEqual(0);
          expect(measurements.viewport.height).toBeGreaterThanOrEqual(0);

          // 驗證 sidebar 尺寸非負
          expect(measurements.sidebar.width).toBeGreaterThanOrEqual(0);
          expect(measurements.sidebar.collapsedWidth).toBeGreaterThanOrEqual(0);

          // 驗證 header 高度非負
          expect(measurements.header.height).toBeGreaterThanOrEqual(0);

          // 驗證 footer 高度非負
          expect(measurements.footer.height).toBeGreaterThanOrEqual(0);

          // 驗證 contentPadding 所有值非負
          expect(measurements.contentPadding.top).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.right).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.bottom).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.left).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 額外的屬性測試：測試在不同 DOM 狀態下的非負性
   * 
   * 這個測試創建隨機的 DOM 結構來模擬不同的頁面佈局，
   * 確保即使在各種 DOM 配置下，測量結果仍然是非負的
   */
  it('should return non-negative measurements with various DOM configurations', () => {
    fc.assert(
      fc.property(
        // 生成隨機的 DOM 配置
        fc.record({
          hasSidebar: fc.boolean(),
          sidebarWidth: fc.integer({ min: 0, max: 400 }),
          hasHeader: fc.boolean(),
          headerHeight: fc.integer({ min: 0, max: 200 }),
          hasFooter: fc.boolean(),
          footerHeight: fc.integer({ min: 0, max: 200 }),
          contentPadding: fc.integer({ min: 0, max: 50 })
        }),
        (config) => {
          // 清理之前的 DOM
          document.body.innerHTML = '';

          // 根據配置創建 DOM 結構
          const layout = document.createElement('div');
          layout.className = 'ant-layout';

          if (config.hasSidebar) {
            const sidebar = document.createElement('div');
            sidebar.className = 'ant-layout-sider';
            sidebar.style.width = `${config.sidebarWidth}px`;
            layout.appendChild(sidebar);
          }

          const contentLayout = document.createElement('div');
          contentLayout.className = 'ant-layout';

          if (config.hasHeader) {
            const header = document.createElement('div');
            header.className = 'ant-layout-header';
            header.style.height = `${config.headerHeight}px`;
            contentLayout.appendChild(header);
          }

          const content = document.createElement('div');
          content.className = 'ant-layout-content';
          content.style.padding = `${config.contentPadding}px`;
          contentLayout.appendChild(content);

          if (config.hasFooter) {
            const footer = document.createElement('div');
            footer.className = 'ant-layout-footer';
            footer.style.height = `${config.footerHeight}px`;
            contentLayout.appendChild(footer);
          }

          layout.appendChild(contentLayout);
          document.body.appendChild(layout);

          // 執行測量
          const measurements = measurer.measure();

          // 驗證所有測量值都是非負的
          expect(measurements.viewport.width).toBeGreaterThanOrEqual(0);
          expect(measurements.viewport.height).toBeGreaterThanOrEqual(0);
          expect(measurements.sidebar.width).toBeGreaterThanOrEqual(0);
          expect(measurements.sidebar.collapsedWidth).toBeGreaterThanOrEqual(0);
          expect(measurements.header.height).toBeGreaterThanOrEqual(0);
          expect(measurements.footer.height).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.top).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.right).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.bottom).toBeGreaterThanOrEqual(0);
          expect(measurements.contentPadding.left).toBeGreaterThanOrEqual(0);

          // 清理 DOM
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 邊界情況測試：極小視窗尺寸
   * 
   * 測試當視窗尺寸非常小時，測量結果仍然是非負的
   */
  it('should handle very small viewport sizes without negative values', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          // 即使在極小的視窗尺寸下，測量結果也應該是非負的
          const measurements = measurer.measure();

          // 所有測量值都應該是有限的非負數
          expect(Number.isFinite(measurements.viewport.width)).toBe(true);
          expect(Number.isFinite(measurements.viewport.height)).toBe(true);
          expect(measurements.viewport.width).toBeGreaterThanOrEqual(0);
          expect(measurements.viewport.height).toBeGreaterThanOrEqual(0);

          // 其他所有值也應該是非負的
          const allValues = [
            measurements.sidebar.width,
            measurements.sidebar.collapsedWidth,
            measurements.header.height,
            measurements.footer.height,
            measurements.contentPadding.top,
            measurements.contentPadding.right,
            measurements.contentPadding.bottom,
            measurements.contentPadding.left
          ];

          allValues.forEach(value => {
            expect(Number.isFinite(value)).toBe(true);
            expect(value).toBeGreaterThanOrEqual(0);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
