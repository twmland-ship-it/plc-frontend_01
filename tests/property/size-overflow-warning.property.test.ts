/**
 * Property-Based Tests for Size Overflow Warning
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 16: 尺寸超出警告
 * Validates: Requirements 10.2, 10.3
 * 
 * 測試超出視窗尺寸時顯示警告
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { ConfigurationManager } from '../../src/utils/configuration-manager';
import type { IframeConfig } from '../../src/types/iframe-config';

describe('Property: Size Overflow Warning', () => {
  const manager = new ConfigurationManager();
  
  // 保存原始的 window.innerWidth 和 window.innerHeight
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    // 恢復原始值
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
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 16: 尺寸超出警告
   * 
   * For any 用戶輸入的尺寸值，當寬度超過視窗寬度或高度超過視窗高度時，
   * 系統應該顯示警告訊息
   * 
   * 這個屬性確保：
   * 1. 當高度值超過視窗高度時，產生警告
   * 2. 當設計寬度超過視窗寬度時，產生警告
   * 3. 當設計高度超過視窗高度時，產生警告
   * 4. 警告訊息清楚說明可能的問題
   * 5. 警告不會阻止配置儲存（valid 仍為 true）
   */
  it('should warn when height value exceeds viewport height in px mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 1200 }), // 視窗高度
        fc.integer({ min: 1, max: 500 }), // 超出量
        (viewportHeight, excess) => {
          // 設定模擬的視窗高度
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          const heightValue = viewportHeight + excess; // 超過視窗高度

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: heightValue,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該仍然有效（警告不會使配置無效）
          expect(result.valid).toBe(true);
          
          // 應該有警告訊息
          expect(result.warnings.length).toBeGreaterThan(0);
          
          // 警告應該與 heightValue 相關
          const heightWarning = result.warnings.find(w => w.field === 'heightValue');
          expect(heightWarning).toBeDefined();
          expect(heightWarning?.message).toContain('超過視窗高度');
          expect(heightWarning?.message).toContain('裁切');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should warn when design width exceeds viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }), // 視窗寬度
        fc.integer({ min: 1, max: 500 }), // 超出量
        (viewportWidth, excess) => {
          // 設定模擬的視窗寬度
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth
          });

          const designWidth = viewportWidth + excess; // 超過視窗寬度

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: designWidth,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該仍然有效（警告不會使配置無效）
          expect(result.valid).toBe(true);
          
          // 應該有警告訊息
          expect(result.warnings.length).toBeGreaterThan(0);
          
          // 警告應該與 designResolution 相關
          const widthWarning = result.warnings.find(w => 
            w.field === 'designResolution' && w.message.includes('寬度')
          );
          expect(widthWarning).toBeDefined();
          expect(widthWarning?.message).toContain('超過視窗寬度');
          expect(widthWarning?.message).toContain('裁切');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should warn when design height exceeds viewport height', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 1080 }), // 視窗高度
        fc.integer({ min: 1, max: 500 }), // 超出量
        (viewportHeight, excess) => {
          // 設定模擬的視窗高度
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          const designHeight = viewportHeight + excess; // 超過視窗高度

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: designHeight
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該仍然有效（警告不會使配置無效）
          expect(result.valid).toBe(true);
          
          // 應該有警告訊息
          expect(result.warnings.length).toBeGreaterThan(0);
          
          // 警告應該與 designResolution 相關
          const heightWarning = result.warnings.find(w => 
            w.field === 'designResolution' && w.message.includes('高度')
          );
          expect(heightWarning).toBeDefined();
          expect(heightWarning?.message).toContain('超過視窗高度');
          expect(heightWarning?.message).toContain('裁切');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should generate multiple warnings when both width and height exceed viewport', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }), // 視窗寬度
        fc.integer({ min: 768, max: 1080 }), // 視窗高度
        fc.integer({ min: 1, max: 500 }), // 寬度超出量
        fc.integer({ min: 1, max: 500 }), // 高度超出量
        (viewportWidth, viewportHeight, widthExcess, heightExcess) => {
          // 設定模擬的視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          const designWidth = viewportWidth + widthExcess;
          const designHeight = viewportHeight + heightExcess;

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: designWidth,
              height: designHeight
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該仍然有效
          expect(result.valid).toBe(true);
          
          // 應該有至少兩個警告（寬度和高度）
          expect(result.warnings.length).toBeGreaterThanOrEqual(2);
          
          // 應該有寬度警告
          const widthWarning = result.warnings.find(w => 
            w.field === 'designResolution' && w.message.includes('寬度')
          );
          expect(widthWarning).toBeDefined();
          
          // 應該有高度警告
          const heightWarning = result.warnings.find(w => 
            w.field === 'designResolution' && w.message.includes('高度')
          );
          expect(heightWarning).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not warn when dimensions are within viewport bounds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1920, max: 3840 }), // 視窗寬度（大於設計寬度）
        fc.integer({ min: 1080, max: 2160 }), // 視窗高度（大於設計高度）
        fc.integer({ min: 200, max: 1000 }), // 高度值（小於視窗高度）
        (viewportWidth, viewportHeight, heightValue) => {
          // 設定模擬的視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: heightValue,
            designResolution: {
              width: 1920, // 小於視窗寬度
              height: 1080 // 小於視窗高度
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該有效
          expect(result.valid).toBe(true);
          
          // 不應該有關於尺寸超出的警告
          const sizeWarnings = result.warnings.filter(w => 
            (w.field === 'heightValue' || w.field === 'designResolution') &&
            w.message.includes('超過視窗')
          );
          expect(sizeWarnings.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should warn about excessive margins that reduce available space', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }), // 視窗寬度
        fc.integer({ min: 768, max: 1080 }), // 視窗高度
        (viewportWidth, viewportHeight) => {
          // 設定模擬的視窗尺寸
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          // 設定過大的邊距（總和超過視窗寬度的 50%）
          const excessiveMargin = Math.floor(viewportWidth * 0.3); // 左右各 30%，總和 60%

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            margins: {
              top: 0,
              right: excessiveMargin,
              bottom: 0,
              left: excessiveMargin
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該仍然有效
          expect(result.valid).toBe(true);
          
          // 應該有關於邊距過大的警告
          const marginWarning = result.warnings.find(w => 
            w.field === 'margins' && w.message.includes('過大')
          );
          expect(marginWarning).toBeDefined();
          expect(marginWarning?.message).toContain('顯示區域過小');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should warn about excessive vertical margins', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 1080 }), // 視窗高度
        (viewportHeight) => {
          // 設定模擬的視窗高度
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          // 設定過大的垂直邊距（總和超過視窗高度的 50%）
          const excessiveMargin = Math.floor(viewportHeight * 0.3); // 上下各 30%，總和 60%

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            margins: {
              top: excessiveMargin,
              right: 0,
              bottom: excessiveMargin,
              left: 0
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 配置應該仍然有效
          expect(result.valid).toBe(true);
          
          // 應該有關於邊距過大的警告
          const marginWarning = result.warnings.find(w => 
            w.field === 'margins' && w.message.includes('過大')
          );
          expect(marginWarning).toBeDefined();
          expect(marginWarning?.message).toContain('顯示區域過小');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界測試：測試臨界值
   * 
   * 確保剛好等於視窗尺寸時不產生警告，超過時才產生警告
   */
  it('should handle boundary cases correctly', () => {
    // 設定固定的視窗尺寸
    const viewportWidth = 1920;
    const viewportHeight = 1080;
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: viewportWidth
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: viewportHeight
    });

    // 測試：高度值等於視窗高度（不應該警告）
    const configEqual: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'px',
      heightValue: viewportHeight,
      designResolution: {
        width: viewportWidth,
        height: viewportHeight
      },
      serverUrl: 'http://localhost:3000',
      viewUrl: 'http://localhost:3000/view',
      urlMode: 'select'
    };
    
    const resultEqual = manager.validateConfig(configEqual);
    expect(resultEqual.valid).toBe(true);
    const sizeWarningsEqual = resultEqual.warnings.filter(w => 
      w.message.includes('超過視窗')
    );
    expect(sizeWarningsEqual.length).toBe(0);

    // 測試：高度值超過視窗高度 1px（應該警告）
    const configExceed: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'px',
      heightValue: viewportHeight + 1,
      designResolution: {
        width: viewportWidth + 1,
        height: viewportHeight + 1
      },
      serverUrl: 'http://localhost:3000',
      viewUrl: 'http://localhost:3000/view',
      urlMode: 'select'
    };
    
    const resultExceed = manager.validateConfig(configExceed);
    expect(resultExceed.valid).toBe(true);
    expect(resultExceed.warnings.length).toBeGreaterThan(0);
    
    // 應該有關於高度值的警告
    const heightWarning = resultExceed.warnings.find(w => w.field === 'heightValue');
    expect(heightWarning).toBeDefined();
    
    // 應該有關於設計解析度的警告
    const resolutionWarnings = resultExceed.warnings.filter(w => 
      w.field === 'designResolution'
    );
    expect(resolutionWarnings.length).toBeGreaterThanOrEqual(2); // 寬度和高度各一個
  });

  /**
   * 測試警告不影響配置有效性
   * 
   * 確保即使有警告，只要沒有錯誤，配置仍然是有效的
   */
  it('should keep config valid even with warnings', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 1200 }), // 視窗高度
        fc.integer({ min: 200, max: 2000 }), // heightValue（在有效範圍內）
        (viewportHeight, heightValue) => {
          // 確保 heightValue 超過視窗高度（以產生警告）
          // 但仍在有效範圍內（200-2000）
          fc.pre(heightValue > viewportHeight && heightValue <= 2000);

          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight
          });

          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: heightValue,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 即使有警告，配置應該仍然有效
          expect(result.valid).toBe(true);
          
          // 不應該有錯誤
          expect(result.errors.length).toBe(0);
          
          // 應該有警告
          expect(result.warnings.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
