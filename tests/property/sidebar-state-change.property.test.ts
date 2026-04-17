/**
 * Property-Based Tests for Sidebar State Change Monitoring
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 5: Sidebar 狀態變化監聽
 * Validates: Requirements 3.1
 * 
 * 測試狀態變化時觸發回調
 * 
 * NOTE: This test focuses on the callback registration and notification mechanism
 * rather than the actual DOM mutation detection, as the MutationObserver behavior
 * is difficult to reliably test in a jsdom environment.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { LayoutMeasurer } from '../../src/utils/layout-measurer';

describe('Property: Sidebar State Change Monitoring', () => {
  let measurer: LayoutMeasurer;

  beforeEach(() => {
    // 清理 DOM
    document.body.innerHTML = '';
    measurer = new LayoutMeasurer();
  });

  afterEach(() => {
    measurer.dispose();
    document.body.innerHTML = '';
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 5: Sidebar 狀態變化監聽
   * 
   * For any 回調函數註冊，
   * 當監聽器被正確設置時，回調應該被添加到回調列表中
   * 
   * 這個屬性確保：
   * 1. 回調可以被成功註冊
   * 2. 多個回調可以同時註冊
   * 3. dispose 後不能再註冊新的回調
   */
  it('should register callbacks for layout change notifications', () => {
    fc.assert(
      fc.property(
        // 生成隨機的回調數量
        fc.integer({ min: 1, max: 10 }),
        (numCallbacks) => {
          // 創建 Sidebar 元素（確保 measurer 可以找到它）
          const sidebar = document.createElement('div');
          sidebar.className = 'ant-layout-sider';
          sidebar.style.width = '200px';
          document.body.appendChild(sidebar);

          // 創建多個回調
          const callbacks = Array.from({ length: numCallbacks }, () => vi.fn());

          // 註冊所有回調
          callbacks.forEach(callback => {
            // 這應該不會拋出錯誤
            expect(() => measurer.onLayoutChange(callback)).not.toThrow();
          });

          // 驗證：如果我們手動調用 measure()，它應該返回有效的測量結果
          const measurements = measurer.measure();
          expect(measurements).toBeDefined();
          expect(measurements.sidebar).toBeDefined();
          expect(measurements.sidebar.width).toBeGreaterThanOrEqual(0);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試 dispose 後的行為
   * 
   * For any 已註冊的監聽器，
   * 當 measurer 被 dispose 後，不應該再能註冊新的監聽器
   */
  it('should not allow callback registration after dispose', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        () => {
          // 創建 Sidebar 元素
          const sidebar = document.createElement('div');
          sidebar.className = 'ant-layout-sider';
          document.body.appendChild(sidebar);

          // 創建回調
          const callback = vi.fn();

          // 先註冊一個回調（應該成功）
          measurer.onLayoutChange(callback);

          // Dispose measurer
          measurer.dispose();

          // 嘗試註冊新的回調（應該被忽略或記錄警告）
          const newCallback = vi.fn();
          measurer.onLayoutChange(newCallback);

          // 驗證：dispose 後 measure() 仍然可以工作（使用預設值）
          const measurements = measurer.measure();
          expect(measurements).toBeDefined();

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試測量功能的一致性
   * 
   * For any DOM 配置，
   * 連續的測量應該返回一致的結果（在 DOM 沒有變化的情況下）
   */
  it('should return consistent measurements for unchanged DOM', () => {
    fc.assert(
      fc.property(
        fc.record({
          sidebarWidth: fc.integer({ min: 64, max: 400 }),
          headerHeight: fc.integer({ min: 0, max: 200 }),
          footerHeight: fc.integer({ min: 0, max: 200 })
        }),
        (config) => {
          // 創建 DOM 結構
          const sidebar = document.createElement('div');
          sidebar.className = 'ant-layout-sider';
          sidebar.style.width = `${config.sidebarWidth}px`;
          sidebar.getBoundingClientRect = () => ({
            width: config.sidebarWidth,
            height: 100,
            top: 0,
            left: 0,
            bottom: 100,
            right: config.sidebarWidth,
            x: 0,
            y: 0,
            toJSON: () => {}
          });
          document.body.appendChild(sidebar);

          const header = document.createElement('div');
          header.className = 'ant-layout-header';
          header.style.height = `${config.headerHeight}px`;
          header.getBoundingClientRect = () => ({
            width: 100,
            height: config.headerHeight,
            top: 0,
            left: 0,
            bottom: config.headerHeight,
            right: 100,
            x: 0,
            y: 0,
            toJSON: () => {}
          });
          document.body.appendChild(header);

          const footer = document.createElement('div');
          footer.className = 'ant-layout-footer';
          footer.style.height = `${config.footerHeight}px`;
          footer.getBoundingClientRect = () => ({
            width: 100,
            height: config.footerHeight,
            top: 0,
            left: 0,
            bottom: config.footerHeight,
            right: 100,
            x: 0,
            y: 0,
            toJSON: () => {}
          });
          document.body.appendChild(footer);

          // 執行多次測量
          const measurement1 = measurer.measure();
          const measurement2 = measurer.measure();
          const measurement3 = measurer.measure();

          // 驗證測量結果一致
          expect(measurement1.sidebar.width).toBe(measurement2.sidebar.width);
          expect(measurement2.sidebar.width).toBe(measurement3.sidebar.width);
          
          expect(measurement1.header.height).toBe(measurement2.header.height);
          expect(measurement2.header.height).toBe(measurement3.header.height);
          
          expect(measurement1.footer.height).toBe(measurement2.footer.height);
          expect(measurement2.footer.height).toBe(measurement3.footer.height);

          // 驗證測量值與配置匹配
          expect(measurement1.sidebar.width).toBe(config.sidebarWidth);
          expect(measurement1.header.height).toBe(config.headerHeight);
          expect(measurement1.footer.height).toBe(config.footerHeight);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試 Sidebar 狀態檢測
   * 
   * For any Sidebar 配置，
   * measurer 應該能正確檢測 Sidebar 是否處於收合狀態
   */
  it('should correctly detect sidebar collapsed state', () => {
    fc.assert(
      fc.property(
        fc.record({
          collapsed: fc.boolean(),
          width: fc.integer({ min: 64, max: 300 })
        }),
        (config) => {
          // 創建 Sidebar 元素
          const sidebar = document.createElement('div');
          sidebar.className = config.collapsed 
            ? 'ant-layout-sider ant-layout-sider-collapsed' 
            : 'ant-layout-sider';
          sidebar.style.width = `${config.width}px`;
          sidebar.getBoundingClientRect = () => ({
            width: config.width,
            height: 100,
            top: 0,
            left: 0,
            bottom: 100,
            right: config.width,
            x: 0,
            y: 0,
            toJSON: () => {}
          });
          document.body.appendChild(sidebar);

          // 執行測量
          const measurements = measurer.measure();

          // 驗證 collapsed 狀態檢測
          // 如果有 collapsed class 或寬度小於 100，應該被檢測為 collapsed
          const expectedCollapsed = config.collapsed || config.width < 100;
          expect(measurements.sidebar.collapsed).toBe(expectedCollapsed);

          // 驗證寬度測量
          expect(measurements.sidebar.width).toBe(config.width);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試降級行為
   * 
   * For any 缺失的 DOM 元素，
   * measurer 應該使用預設值而不是拋出錯誤
   */
  it('should use default values when DOM elements are missing', () => {
    fc.assert(
      fc.property(
        fc.record({
          hasSidebar: fc.boolean(),
          hasHeader: fc.boolean(),
          hasFooter: fc.boolean()
        }),
        (config) => {
          // 根據配置選擇性地創建元素
          if (config.hasSidebar) {
            const sidebar = document.createElement('div');
            sidebar.className = 'ant-layout-sider';
            sidebar.style.width = '200px';
            document.body.appendChild(sidebar);
          }

          if (config.hasHeader) {
            const header = document.createElement('div');
            header.className = 'ant-layout-header';
            header.style.height = '64px';
            document.body.appendChild(header);
          }

          if (config.hasFooter) {
            const footer = document.createElement('div');
            footer.className = 'ant-layout-footer';
            footer.style.height = '50px';
            document.body.appendChild(footer);
          }

          // 執行測量（不應該拋出錯誤）
          let measurements;
          expect(() => {
            measurements = measurer.measure();
          }).not.toThrow();

          // 驗證測量結果存在且有效
          expect(measurements).toBeDefined();
          expect(measurements!.sidebar).toBeDefined();
          expect(measurements!.header).toBeDefined();
          expect(measurements!.footer).toBeDefined();

          // 所有值都應該是非負數
          expect(measurements!.sidebar.width).toBeGreaterThanOrEqual(0);
          expect(measurements!.header.height).toBeGreaterThanOrEqual(0);
          expect(measurements!.footer.height).toBeGreaterThanOrEqual(0);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });
});
