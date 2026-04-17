/**
 * Property-Based Tests for Window Resize Response
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 12: 視窗大小變化響應
 * Validates: Requirements 5.5
 * 
 * 測試視窗變化時即時更新尺寸資訊
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { LayoutMeasurer } from '../../src/utils/layout-measurer';
import { SizeCalculator } from '../../src/utils/size-calculator';

describe('Property: Window Resize Response', () => {
  let measurer: LayoutMeasurer;
  let calculator: SizeCalculator;
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // 保存原始視窗尺寸
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;

    // 清理 DOM
    document.body.innerHTML = '';
    
    // 創建測試實例
    measurer = new LayoutMeasurer();
    calculator = new SizeCalculator();
  });

  afterEach(() => {
    // 清理
    measurer.dispose();
    
    // 恢復原始視窗尺寸
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight
    });
    
    document.body.innerHTML = '';
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 12: 視窗大小變化響應
   * 
   * For any 視窗大小變化，
   * 系統應該即時重新計算並更新顯示的尺寸資訊
   * 
   * 這個屬性確保：
   * 1. 視窗寬度變化時，可用寬度相應更新
   * 2. 視窗高度變化時，可用高度相應更新
   * 3. 計算出的 iframe 尺寸反映新的可用空間
   * 4. 所有變化都是即時的（通過回調機制）
   */
  it('should update measurements immediately when window size changes', () => {
    fc.assert(
      fc.property(
        // 生成初始視窗尺寸
        fc.record({
          initialWidth: fc.integer({ min: 1024, max: 2560 }),
          initialHeight: fc.integer({ min: 768, max: 1440 }),
          newWidth: fc.integer({ min: 1024, max: 2560 }),
          newHeight: fc.integer({ min: 768, max: 1440 })
        }),
        (config) => {
          // 跳過相同尺寸的測試
          if (config.initialWidth === config.newWidth && 
              config.initialHeight === config.newHeight) {
            return;
          }

          // 設置初始視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.initialWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.initialHeight
          });

          // 創建 DOM 結構
          const sidebar = document.createElement('div');
          sidebar.className = 'ant-layout-sider';
          sidebar.style.width = '200px';
          document.body.appendChild(sidebar);

          // 初始測量
          const initialMeasurements = measurer.measure();
          expect(initialMeasurements.viewport.width).toBe(config.initialWidth);
          expect(initialMeasurements.viewport.height).toBe(config.initialHeight);

          // 計算初始尺寸
          const initialCalculated = calculator.calculate(initialMeasurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 更改視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.newWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.newHeight
          });

          // 重新測量
          const newMeasurements = measurer.measure();
          expect(newMeasurements.viewport.width).toBe(config.newWidth);
          expect(newMeasurements.viewport.height).toBe(config.newHeight);

          // 重新計算尺寸
          const newCalculated = calculator.calculate(newMeasurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 驗證：如果視窗變大，可用空間應該增加（或至少不減少）
          // 如果視窗變小，可用空間應該減少（或至少不增加）
          const widthIncreased = config.newWidth > config.initialWidth;
          const heightIncreased = config.newHeight > config.initialHeight;

          if (widthIncreased) {
            expect(newMeasurements.viewport.width).toBeGreaterThan(initialMeasurements.viewport.width);
          } else if (config.newWidth < config.initialWidth) {
            expect(newMeasurements.viewport.width).toBeLessThan(initialMeasurements.viewport.width);
          }

          if (heightIncreased) {
            expect(newMeasurements.viewport.height).toBeGreaterThan(initialMeasurements.viewport.height);
          } else if (config.newHeight < config.initialHeight) {
            expect(newMeasurements.viewport.height).toBeLessThan(initialMeasurements.viewport.height);
          }

          // 驗證：計算結果應該是有效的
          expect(newCalculated.width).toBeGreaterThan(0);
          expect(newCalculated.height).toBeGreaterThan(0);
          expect(newCalculated.availableSpace.width).toBeGreaterThan(0);
          expect(newCalculated.availableSpace.height).toBeGreaterThan(0);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：視窗大小變化時回調被觸發
   * 
   * For any 視窗大小變化，
   * 所有註冊的回調函數都應該被調用
   */
  it('should trigger callbacks when window size changes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          initialWidth: fc.integer({ min: 1024, max: 2560 }),
          initialHeight: fc.integer({ min: 768, max: 1440 }),
          widthDelta: fc.integer({ min: -500, max: 500 }),
          heightDelta: fc.integer({ min: -300, max: 300 })
        }),
        async (config) => {
          // 確保新尺寸在有效範圍內
          const newWidth = Math.max(800, Math.min(3840, config.initialWidth + config.widthDelta));
          const newHeight = Math.max(600, Math.min(2160, config.initialHeight + config.heightDelta));

          // 跳過沒有變化的情況
          if (newWidth === config.initialWidth && newHeight === config.initialHeight) {
            return;
          }

          // 設置初始視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.initialWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.initialHeight
          });

          // 創建回調
          const callback = vi.fn();
          measurer.onLayoutChange(callback);

          // 模擬視窗大小變化
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: newWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: newHeight
          });

          // 直接調用 notifyChange 方法（繞過 jsdom 的事件系統限制）
          // 在實際瀏覽器中，這會由 resize 事件自動觸發
          (measurer as any).notifyChange();

          // 短暫延遲確保回調執行完成
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證：回調應該被調用
          expect(callback).toHaveBeenCalled();

          // 驗證：回調接收到的測量結果應該反映新的視窗尺寸
          if (callback.mock.calls.length > 0) {
            const measurements = callback.mock.calls[callback.mock.calls.length - 1][0];
            expect(measurements.viewport.width).toBe(newWidth);
            expect(measurements.viewport.height).toBe(newHeight);
          }
        }
      ),
      { numRuns: 50 } // 執行 50 次迭代
    );
  });

  /**
   * 測試：可用空間隨視窗大小變化
   * 
   * For any 視窗大小變化，
   * 計算出的可用空間應該相應變化
   */
  it('should recalculate available space when window resizes', () => {
    fc.assert(
      fc.property(
        fc.record({
          initialWidth: fc.integer({ min: 1024, max: 2560 }),
          initialHeight: fc.integer({ min: 768, max: 1440 }),
          sidebarWidth: fc.integer({ min: 64, max: 300 }),
          headerHeight: fc.integer({ min: 0, max: 100 }),
          footerHeight: fc.integer({ min: 0, max: 100 }),
          widthIncrease: fc.integer({ min: 100, max: 500 })
        }),
        (config) => {
          // 設置初始視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.initialWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.initialHeight
          });

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

          // 初始測量和計算
          const initialMeasurements = measurer.measure();
          const initialAvailableSpace = calculator.calculateAvailableSpace(initialMeasurements);

          // 增加視窗寬度
          const newWidth = config.initialWidth + config.widthIncrease;
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: newWidth
          });

          // 重新測量和計算
          const newMeasurements = measurer.measure();
          const newAvailableSpace = calculator.calculateAvailableSpace(newMeasurements);

          // 驗證：可用寬度應該增加（因為視窗變寬了）
          expect(newAvailableSpace.width).toBeGreaterThan(initialAvailableSpace.width);

          // 驗證：增加的量應該等於視窗寬度的增加量
          const widthIncrease = newAvailableSpace.width - initialAvailableSpace.width;
          expect(widthIncrease).toBe(config.widthIncrease);

          // 驗證：可用高度應該保持不變（因為視窗高度沒變）
          expect(newAvailableSpace.height).toBe(initialAvailableSpace.height);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：比例在視窗大小變化時保持
   * 
   * For any 視窗大小變化，
   * 當使用等比例模式時，計算出的尺寸應該保持 16:9 比例
   */
  it('should maintain aspect ratio when window resizes in contain-center mode', () => {
    fc.assert(
      fc.property(
        fc.record({
          initialWidth: fc.integer({ min: 1024, max: 2560 }),
          initialHeight: fc.integer({ min: 768, max: 1440 }),
          newWidth: fc.integer({ min: 1024, max: 2560 }),
          newHeight: fc.integer({ min: 768, max: 1440 })
        }),
        (config) => {
          // 跳過相同尺寸
          if (config.initialWidth === config.newWidth && 
              config.initialHeight === config.newHeight) {
            return;
          }

          // 設置初始視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.initialWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.initialHeight
          });

          // 創建 Sidebar
          const sidebar = document.createElement('div');
          sidebar.className = 'ant-layout-sider';
          sidebar.style.width = '200px';
          document.body.appendChild(sidebar);

          // 初始計算
          const initialMeasurements = measurer.measure();
          const initialCalculated = calculator.calculate(initialMeasurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 驗證初始比例
          const initialRatio = initialCalculated.width / initialCalculated.height;
          expect(Math.abs(initialRatio - 16 / 9)).toBeLessThan(0.01);

          // 更改視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.newWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.newHeight
          });

          // 重新計算
          const newMeasurements = measurer.measure();
          const newCalculated = calculator.calculate(newMeasurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 驗證新比例仍然是 16:9
          const newRatio = newCalculated.width / newCalculated.height;
          expect(Math.abs(newRatio - 16 / 9)).toBeLessThan(0.01);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：多個監聽器都被通知
   * 
   * For any 數量的監聽器，
   * 當視窗大小變化時，所有監聽器都應該被通知
   */
  it('should notify all registered listeners when window resizes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          numListeners: fc.integer({ min: 1, max: 5 }),
          initialWidth: fc.integer({ min: 1024, max: 2560 }),
          newWidth: fc.integer({ min: 1024, max: 2560 })
        }),
        async (config) => {
          // 跳過相同寬度
          if (config.initialWidth === config.newWidth) {
            return;
          }

          // 設置初始視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.initialWidth
          });

          // 創建多個回調
          const callbacks = Array.from({ length: config.numListeners }, () => vi.fn());

          // 註冊所有回調
          callbacks.forEach(callback => {
            measurer.onLayoutChange(callback);
          });

          // 更改視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.newWidth
          });

          // 直接調用 notifyChange 方法（繞過 jsdom 的事件系統限制）
          // 在實際瀏覽器中，這會由 resize 事件自動觸發
          (measurer as any).notifyChange();

          // 短暫延遲確保回調執行完成
          await new Promise(resolve => setTimeout(resolve, 50));

          // 驗證：所有回調都應該被調用
          callbacks.forEach(callback => {
            expect(callback).toHaveBeenCalled();
          });

          // 驗證：所有回調接收到相同的測量結果
          if (callbacks.length > 1 && callbacks[0].mock.calls.length > 0) {
            const firstMeasurements = callbacks[0].mock.calls[callbacks[0].mock.calls.length - 1][0];
            
            for (let i = 1; i < callbacks.length; i++) {
              if (callbacks[i].mock.calls.length > 0) {
                const measurements = callbacks[i].mock.calls[callbacks[i].mock.calls.length - 1][0];
                expect(measurements.viewport.width).toBe(firstMeasurements.viewport.width);
                expect(measurements.viewport.height).toBe(firstMeasurements.viewport.height);
              }
            }
          }
        }
      ),
      { numRuns: 50 } // 執行 50 次迭代
    );
  });

  /**
   * 測試：尺寸資訊格式正確性
   * 
   * For any 視窗大小變化後的測量結果，
   * 所有尺寸值都應該是非負數
   */
  it('should produce valid non-negative measurements after window resize', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 800, max: 3840 }),
          height: fc.integer({ min: 600, max: 2160 })
        }),
        (config) => {
          // 設置視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.width
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.height
          });

          // 創建基本 DOM 結構
          const sidebar = document.createElement('div');
          sidebar.className = 'ant-layout-sider';
          sidebar.style.width = '200px';
          document.body.appendChild(sidebar);

          // 測量
          const measurements = measurer.measure();

          // 驗證：所有測量值都是非負數
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

          // 驗證：視窗尺寸應該匹配設定值
          expect(measurements.viewport.width).toBe(config.width);
          expect(measurements.viewport.height).toBe(config.height);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：計算結果不超出可用空間
   * 
   * For any 視窗大小變化後的計算結果，
   * iframe 尺寸不應該超出可用空間
   */
  it('should not exceed available space after window resize', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 1024, max: 3840 }),
          height: fc.integer({ min: 768, max: 2160 }),
          sidebarWidth: fc.integer({ min: 64, max: 300 })
        }),
        (config) => {
          // 設置視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.width
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.height
          });

          // 創建 Sidebar
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

          // 測量和計算
          const measurements = measurer.measure();
          const calculated = calculator.calculate(measurements, {
            designRatio: 16 / 9,
            fitMode: 'auto'
          });

          // 驗證：計算出的尺寸不超出可用空間
          expect(calculated.width).toBeLessThanOrEqual(calculated.availableSpace.width);
          expect(calculated.height).toBeLessThanOrEqual(calculated.availableSpace.height);

          // 驗證：計算出的尺寸是正數
          expect(calculated.width).toBeGreaterThan(0);
          expect(calculated.height).toBeGreaterThan(0);

          // 清理
          document.body.innerHTML = '';
        }
      ),
      { numRuns: 100 } // 執行 100 次迭代
    );
  });

  /**
   * 測試：快速連續的視窗大小變化
   * 
   * For any 一系列快速的視窗大小變化，
   * 系統應該能正確處理（通過防抖機制）
   */
  it('should handle rapid window resize events gracefully with debouncing', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          initialWidth: fc.integer({ min: 1024, max: 2560 }),
          resizeSteps: fc.array(
            fc.integer({ min: -100, max: 100 }),
            { minLength: 5, maxLength: 10 }
          )
        }),
        async (config) => {
          // 設置初始視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.initialWidth
          });

          // 創建回調
          const callback = vi.fn();
          measurer.onLayoutChange(callback);

          // 快速連續改變視窗大小
          let currentWidth = config.initialWidth;
          for (const step of config.resizeSteps) {
            currentWidth = Math.max(800, Math.min(3840, currentWidth + step));
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: currentWidth
            });
            window.dispatchEvent(new Event('resize'));
            // 短暫延遲模擬快速連續變化
            await new Promise(resolve => setTimeout(resolve, 10));
          }

          // 等待防抖延遲完成
          await new Promise(resolve => setTimeout(resolve, 200));

          // 驗證：由於防抖，回調調用次數應該少於 resize 事件次數
          // 這證明防抖機制正在工作
          expect(callback.mock.calls.length).toBeLessThan(config.resizeSteps.length);
          expect(callback.mock.calls.length).toBeGreaterThan(0);

          // 驗證：最後一次回調應該反映最終的視窗尺寸
          if (callback.mock.calls.length > 0) {
            const lastMeasurements = callback.mock.calls[callback.mock.calls.length - 1][0];
            expect(lastMeasurements.viewport.width).toBe(currentWidth);
          }
        }
      ),
      { numRuns: 30 } // 執行 30 次迭代（較少因為有多個 async 延遲）
    );
  });
});
