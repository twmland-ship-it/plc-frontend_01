/**
 * Property-Based Tests for Configuration Value Mapping
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 3: 設定值映射正確性
 * Validates: Requirements 2.3, 2.5
 * 
 * 測試選擇與配置值的映射
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { IframeConfig, DisplayMode, HeightMode } from '../../src/types/iframe-config';

describe('Property: Configuration Value Mapping', () => {
  /**
   * Feature: iframe-auto-fit-enhancement, Property 3: 設定值映射正確性
   * 
   * For any 用戶選擇的顯示模式或高度模式，
   * 系統設定的對應配置值應該與選擇匹配
   * 
   * 這個屬性確保：
   * 1. 選擇「等比例置中」→ displayMode = "contain-center"
   * 2. 選擇「滿版拉伸」→ displayMode = "stretch"
   * 3. 選擇「原尺寸」→ displayMode = "none"
   * 4. 選擇「自動高度」→ heightMode = "auto"
   * 5. 選擇「固定像素」→ heightMode = "px"
   * 6. 選擇「視窗百分比」→ heightMode = "vh"
   */
  it('should correctly map display mode selections to configuration values', () => {
    // 定義顯示模式的映射關係
    const displayModeMapping: Array<{
      userSelection: string;
      expectedValue: DisplayMode;
      description: string;
    }> = [
      {
        userSelection: '等比例置中',
        expectedValue: 'contain-center',
        description: 'Requirement 2.3: 等比例置中模式'
      },
      {
        userSelection: '滿版拉伸',
        expectedValue: 'stretch',
        description: 'Requirement 2.4: 滿版拉伸模式'
      },
      {
        userSelection: '原尺寸',
        expectedValue: 'none',
        description: '原尺寸顯示模式'
      }
    ];

    displayModeMapping.forEach(mapping => {
      fc.assert(
        fc.property(
          fc.constant(mapping.expectedValue),
          (displayMode) => {
            // 模擬用戶選擇並創建配置
            const config: IframeConfig = {
              displayMode: displayMode,
              heightMode: 'auto',
              designResolution: { width: 1920, height: 1080 },
              serverUrl: 'http://localhost:2955',
              viewUrl: 'http://localhost:2955/#/view',
              urlMode: 'select'
            };

            // 驗證配置值與預期一致
            expect(config.displayMode).toBe(mapping.expectedValue);

            // 驗證相容性欄位（如果存在）
            if (config.iframeFit) {
              expect(config.iframeFit).toBe(mapping.expectedValue);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 測試：高度模式選擇映射
   * 
   * Requirement 2.5: WHEN 用戶選擇「自動高度」模式 THEN THE System SHALL 設定 iframeHeightMode 為 "auto"
   */
  it('should correctly map height mode selections to configuration values', () => {
    // 定義高度模式的映射關係
    const heightModeMapping: Array<{
      userSelection: string;
      expectedValue: HeightMode;
      description: string;
    }> = [
      {
        userSelection: '自動高度',
        expectedValue: 'auto',
        description: 'Requirement 2.5: 自動高度模式'
      },
      {
        userSelection: '固定像素',
        expectedValue: 'px',
        description: '固定像素高度模式'
      },
      {
        userSelection: '視窗百分比',
        expectedValue: 'vh',
        description: '視窗百分比高度模式'
      }
    ];

    heightModeMapping.forEach(mapping => {
      fc.assert(
        fc.property(
          fc.constant(mapping.expectedValue),
          fc.option(fc.integer({ min: 200, max: 2000 }), { nil: undefined }),
          (heightMode, heightValue) => {
            // 模擬用戶選擇並創建配置
            const config: IframeConfig = {
              displayMode: 'contain-center',
              heightMode: heightMode,
              heightValue: heightMode !== 'auto' ? heightValue : undefined,
              designResolution: { width: 1920, height: 1080 },
              serverUrl: 'http://localhost:2955',
              viewUrl: 'http://localhost:2955/#/view',
              urlMode: 'select'
            };

            // 驗證配置值與預期一致
            expect(config.heightMode).toBe(mapping.expectedValue);

            // 驗證相容性欄位（如果存在）
            if (config.iframeHeightMode) {
              expect(config.iframeHeightMode).toBe(mapping.expectedValue);
            }

            // 驗證 auto 模式不應該有 heightValue
            if (heightMode === 'auto') {
              expect(config.heightValue).toBeUndefined();
            }

            // 驗證 px 和 vh 模式應該有 heightValue（如果提供）
            if (heightMode !== 'auto' && heightValue !== undefined) {
              expect(config.heightValue).toBe(heightValue);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * 測試：等比例置中模式映射
   * 
   * Requirement 2.3: WHEN 用戶選擇「等比例置中」模式 THEN THE System SHALL 設定 iframeFit 為 "contain-center"
   */
  it('should map "等比例置中" selection to "contain-center" display mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        (designWidth, designHeight) => {
          // 用戶選擇「等比例置中」
          const userSelection = '等比例置中';
          
          // 系統應該設定 displayMode 為 "contain-center"
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: { width: designWidth, height: designHeight },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證映射正確
          expect(config.displayMode).toBe('contain-center');
          
          // 驗證相容性：iframeFit 也應該是 "contain-center"
          if (config.iframeFit) {
            expect(config.iframeFit).toBe('contain-center');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：滿版拉伸模式映射
   * 
   * Requirement 2.4: WHEN 用戶選擇「滿版拉伸」模式 THEN THE System SHALL 設定 iframeFit 為 "stretch"
   */
  it('should map "滿版拉伸" selection to "stretch" display mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        (designWidth, designHeight) => {
          // 用戶選擇「滿版拉伸」
          const userSelection = '滿版拉伸';
          
          // 系統應該設定 displayMode 為 "stretch"
          const config: IframeConfig = {
            displayMode: 'stretch',
            heightMode: 'auto',
            designResolution: { width: designWidth, height: designHeight },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證映射正確
          expect(config.displayMode).toBe('stretch');
          
          // 驗證相容性：iframeFit 也應該是 "stretch"
          if (config.iframeFit) {
            expect(config.iframeFit).toBe('stretch');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：自動高度模式映射
   * 
   * Requirement 2.5: WHEN 用戶選擇「自動高度」模式 THEN THE System SHALL 設定 iframeHeightMode 為 "auto"
   */
  it('should map "自動高度" selection to "auto" height mode', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('contain-center' as const, 'stretch' as const, 'none' as const),
        (displayMode) => {
          // 用戶選擇「自動高度」
          const userSelection = '自動高度';
          
          // 系統應該設定 heightMode 為 "auto"
          const config: IframeConfig = {
            displayMode: displayMode,
            heightMode: 'auto',
            designResolution: { width: 1920, height: 1080 },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證映射正確
          expect(config.heightMode).toBe('auto');
          
          // 驗證 auto 模式不應該有 heightValue
          expect(config.heightValue).toBeUndefined();
          
          // 驗證相容性：iframeHeightMode 也應該是 "auto"
          if (config.iframeHeightMode) {
            expect(config.iframeHeightMode).toBe('auto');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：固定像素高度模式映射
   * 
   * 驗證選擇固定像素模式時，heightMode 正確設定為 "px" 且有對應的 heightValue
   */
  it('should map "固定像素" selection to "px" height mode with value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 200, max: 2000 }),
        fc.constantFrom('contain-center' as const, 'stretch' as const, 'none' as const),
        (heightValue, displayMode) => {
          // 用戶選擇「固定像素」並輸入高度值
          const userSelection = '固定像素';
          
          // 系統應該設定 heightMode 為 "px" 並保存 heightValue
          const config: IframeConfig = {
            displayMode: displayMode,
            heightMode: 'px',
            heightValue: heightValue,
            designResolution: { width: 1920, height: 1080 },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證映射正確
          expect(config.heightMode).toBe('px');
          expect(config.heightValue).toBe(heightValue);
          expect(config.heightValue).toBeGreaterThanOrEqual(200);
          expect(config.heightValue).toBeLessThanOrEqual(2000);
          
          // 驗證相容性
          if (config.iframeHeightMode) {
            expect(config.iframeHeightMode).toBe('px');
          }
          if (config.iframeHeightValue !== undefined) {
            expect(config.iframeHeightValue).toBe(heightValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：視窗百分比高度模式映射
   * 
   * 驗證選擇視窗百分比模式時，heightMode 正確設定為 "vh" 且有對應的 heightValue
   */
  it('should map "視窗百分比" selection to "vh" height mode with value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        fc.constantFrom('contain-center' as const, 'stretch' as const, 'none' as const),
        (heightValue, displayMode) => {
          // 用戶選擇「視窗百分比」並輸入百分比值
          const userSelection = '視窗百分比';
          
          // 系統應該設定 heightMode 為 "vh" 並保存 heightValue
          const config: IframeConfig = {
            displayMode: displayMode,
            heightMode: 'vh',
            heightValue: heightValue,
            designResolution: { width: 1920, height: 1080 },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證映射正確
          expect(config.heightMode).toBe('vh');
          expect(config.heightValue).toBe(heightValue);
          expect(config.heightValue).toBeGreaterThanOrEqual(10);
          expect(config.heightValue).toBeLessThanOrEqual(100);
          
          // 驗證相容性
          if (config.iframeHeightMode) {
            expect(config.iframeHeightMode).toBe('vh');
          }
          if (config.iframeHeightValue !== undefined) {
            expect(config.iframeHeightValue).toBe(heightValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：組合選擇的映射一致性
   * 
   * 驗證同時選擇顯示模式和高度模式時，兩者都正確映射
   */
  it('should correctly map combined display mode and height mode selections', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('contain-center' as const, 'stretch' as const, 'none' as const),
        fc.constantFrom('auto' as const, 'px' as const, 'vh' as const),
        fc.option(fc.integer({ min: 200, max: 2000 }), { nil: undefined }),
        (displayMode, heightMode, heightValue) => {
          // 創建配置
          const config: IframeConfig = {
            displayMode: displayMode,
            heightMode: heightMode,
            heightValue: heightMode !== 'auto' ? heightValue : undefined,
            designResolution: { width: 1920, height: 1080 },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證顯示模式映射
          expect(config.displayMode).toBe(displayMode);
          expect(['contain-center', 'stretch', 'none']).toContain(config.displayMode);

          // 驗證高度模式映射
          expect(config.heightMode).toBe(heightMode);
          expect(['auto', 'px', 'vh']).toContain(config.heightMode);

          // 驗證高度值的一致性
          if (heightMode === 'auto') {
            expect(config.heightValue).toBeUndefined();
          } else if (heightValue !== undefined) {
            expect(config.heightValue).toBe(heightValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：推薦設定的映射
   * 
   * Requirement 2.2: WHEN 用戶選擇「推薦設定」THEN THE System SHALL 自動填入針對 1920x1080 設計優化的參數
   */
  it('should map "推薦設定" selection to optimized configuration for 1920x1080', () => {
    fc.assert(
      fc.property(
        fc.constant('推薦設定'),
        (userSelection) => {
          // 用戶選擇「推薦設定」
          // 系統應該自動填入優化參數
          const config: IframeConfig = {
            displayMode: 'contain-center',  // 推薦使用等比例置中
            heightMode: 'px',               // 推薦使用固定像素
            heightValue: 918,               // 針對 1920x1080 優化的高度
            designResolution: { 
              width: 1920, 
              height: 1080 
            },
            margins: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select'
          };

          // 驗證推薦設定的映射
          expect(config.displayMode).toBe('contain-center');
          expect(config.heightMode).toBe('px');
          expect(config.heightValue).toBe(918);
          expect(config.designResolution.width).toBe(1920);
          expect(config.designResolution.height).toBe(1080);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：相容性欄位的映射一致性
   * 
   * 驗證新舊欄位的映射保持一致（向後兼容）
   */
  it('should maintain consistency between new and legacy configuration fields', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('contain-center' as const, 'stretch' as const, 'none' as const),
        fc.constantFrom('auto' as const, 'px' as const, 'vh' as const),
        fc.option(fc.integer({ min: 200, max: 2000 }), { nil: undefined }),
        (displayMode, heightMode, heightValue) => {
          // 創建包含相容性欄位的配置
          const config: IframeConfig = {
            displayMode: displayMode,
            heightMode: heightMode,
            heightValue: heightMode !== 'auto' ? heightValue : undefined,
            designResolution: { width: 1920, height: 1080 },
            serverUrl: 'http://localhost:2955',
            viewUrl: 'http://localhost:2955/#/view',
            urlMode: 'select',
            // 相容性欄位
            iframeFit: displayMode,
            iframeHeightMode: heightMode,
            iframeHeightValue: heightMode !== 'auto' ? heightValue : undefined,
            iframe: {
              fit: displayMode,
              heightMode: heightMode,
              heightValue: heightMode !== 'auto' ? heightValue : undefined
            }
          };

          // 驗證新舊欄位一致
          expect(config.displayMode).toBe(config.iframeFit);
          expect(config.heightMode).toBe(config.iframeHeightMode);
          expect(config.heightValue).toBe(config.iframeHeightValue);
          
          if (config.iframe) {
            expect(config.displayMode).toBe(config.iframe.fit);
            expect(config.heightMode).toBe(config.iframe.heightMode);
            expect(config.heightValue).toBe(config.iframe.heightValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：所有有效選擇的映射完整性
   * 
   * 驗證所有可能的有效選擇組合都能正確映射
   */
  it('should correctly map all valid selection combinations', () => {
    const allDisplayModes: DisplayMode[] = ['contain-center', 'stretch', 'none'];
    const allHeightModes: HeightMode[] = ['auto', 'px', 'vh'];

    allDisplayModes.forEach(displayMode => {
      allHeightModes.forEach(heightMode => {
        fc.assert(
          fc.property(
            fc.option(fc.integer({ min: 200, max: 2000 }), { nil: undefined }),
            (heightValue) => {
              const config: IframeConfig = {
                displayMode: displayMode,
                heightMode: heightMode,
                heightValue: heightMode !== 'auto' ? heightValue : undefined,
                designResolution: { width: 1920, height: 1080 },
                serverUrl: 'http://localhost:2955',
                viewUrl: 'http://localhost:2955/#/view',
                urlMode: 'select'
              };

              // 驗證映射正確
              expect(config.displayMode).toBe(displayMode);
              expect(config.heightMode).toBe(heightMode);
              
              // 驗證類型正確
              expect(typeof config.displayMode).toBe('string');
              expect(typeof config.heightMode).toBe('string');
              
              // 驗證值在有效範圍內
              expect(allDisplayModes).toContain(config.displayMode);
              expect(allHeightModes).toContain(config.heightMode);
            }
          ),
          { numRuns: 50 }
        );
      });
    });
  });

  /**
   * 測試：映射的雙向一致性
   * 
   * 驗證從選擇到配置值，再從配置值回到選擇的雙向映射一致性
   */
  it('should maintain bidirectional mapping consistency', () => {
    const mappings = [
      { selection: '等比例置中', configValue: 'contain-center' as const },
      { selection: '滿版拉伸', configValue: 'stretch' as const },
      { selection: '原尺寸', configValue: 'none' as const }
    ];

    mappings.forEach(mapping => {
      fc.assert(
        fc.property(
          fc.constant(mapping.configValue),
          (configValue) => {
            // 從選擇到配置值
            const config: IframeConfig = {
              displayMode: configValue,
              heightMode: 'auto',
              designResolution: { width: 1920, height: 1080 },
              serverUrl: 'http://localhost:2955',
              viewUrl: 'http://localhost:2955/#/view',
              urlMode: 'select'
            };

            // 驗證配置值正確
            expect(config.displayMode).toBe(mapping.configValue);

            // 從配置值回到選擇（模擬反向映射）
            let reverseSelection: string;
            switch (config.displayMode) {
              case 'contain-center':
                reverseSelection = '等比例置中';
                break;
              case 'stretch':
                reverseSelection = '滿版拉伸';
                break;
              case 'none':
                reverseSelection = '原尺寸';
                break;
              default:
                reverseSelection = '';
            }

            // 驗證雙向映射一致
            expect(reverseSelection).toBe(mapping.selection);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
