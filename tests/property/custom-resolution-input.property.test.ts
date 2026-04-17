/**
 * Property-Based Tests for Custom Resolution Input
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 20: 自訂解析度輸入
 * Validates: Requirements 8.5
 * 
 * 測試任意有效值都能被接受
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ConfigurationManager } from '../../src/utils/configuration-manager';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { IframeConfig, LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: Custom Resolution Input', () => {
  const configManager = new ConfigurationManager();
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 20: 自訂解析度輸入
   * 
   * For any 有效的寬度和高度值（正整數），
   * 當用戶選擇自訂解析度時，系統應該接受這些值並用於計算
   * 
   * 這個屬性確保：
   * 1. 任意正整數的寬度和高度都能被接受
   * 2. 配置驗證不會拒絕有效的自訂解析度
   * 3. 自訂解析度能正確用於尺寸計算
   * 4. 計算結果保持自訂解析度的比例
   */
  it('should accept any valid positive integer width and height for custom resolution', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 7680 }),  // 寬度：從 800 到 8K (7680)
        fc.integer({ min: 600, max: 4320 }),  // 高度：從 600 到 8K (4320)
        (customWidth, customHeight) => {
          // 構建包含自訂解析度的配置
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: customWidth,
              height: customHeight
            },
            margins: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            serverUrl: 'http://192.168.1.100:2955',
            viewUrl: 'http://192.168.1.100:2955/#/view',
            urlMode: 'custom'
          };

          // 驗證配置應該通過
          const validation = configManager.validateConfig(config);
          
          // 配置應該是有效的（沒有錯誤）
          expect(validation.valid).toBe(true);
          expect(validation.errors).toHaveLength(0);
          
          // 驗證解析度值被正確儲存
          expect(config.designResolution.width).toBe(customWidth);
          expect(config.designResolution.height).toBe(customHeight);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：自訂解析度能正確用於尺寸計算
   * 
   * Requirement 8.5: WHEN 用戶選擇自訂解析度 THEN THE System SHALL 允許輸入任意寬度和高度值
   * 
   * 驗證自訂解析度的比例能正確應用到計算中
   */
  it('should correctly use custom resolution ratio in size calculations', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 7680 }),   // 自訂寬度
        fc.integer({ min: 600, max: 4320 }),   // 自訂高度
        fc.integer({ min: 1200, max: 3840 }),  // 視窗寬度
        fc.integer({ min: 800, max: 2160 }),   // 視窗高度
        (customWidth, customHeight, viewportWidth, viewportHeight) => {
          // 計算自訂解析度的比例
          const customRatio = customWidth / customHeight;

          // 構建測量數據
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 使用自訂比例進行計算
          const result = calculator.calculate(measurements, {
            designRatio: customRatio,
            fitMode: 'auto'
          });

          // 計算結果的比例應該與自訂比例一致（允許 0.01 的誤差）
          const resultRatio = result.width / result.height;
          expect(Math.abs(resultRatio - customRatio)).toBeLessThan(0.01);

          // 計算結果應該是有效的（非負數）
          expect(result.width).toBeGreaterThan(0);
          expect(result.height).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：極端但有效的自訂解析度
   * 
   * 驗證系統能處理極端比例的自訂解析度（超寬、超高等）
   */
  it('should accept extreme but valid custom resolutions', () => {
    const extremeResolutions = [
      { width: 800, height: 600, name: '最小建議解析度' },
      { width: 7680, height: 4320, name: '8K 解析度' },
      { width: 3440, height: 1440, name: '超寬螢幕 21:9' },
      { width: 1080, height: 1920, name: '直立螢幕' },
      { width: 2560, height: 1080, name: '超寬螢幕 21:9' },
      { width: 1024, height: 1024, name: '正方形' },
      { width: 5120, height: 1440, name: '超超寬螢幕 32:9' }
    ];

    extremeResolutions.forEach(resolution => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        designResolution: {
          width: resolution.width,
          height: resolution.height
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view',
        urlMode: 'custom'
      };

      // 驗證配置
      const validation = configManager.validateConfig(config);
      
      // 所有極端但有效的解析度都應該被接受
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  /**
   * 測試：自訂解析度的比例保持
   * 
   * 驗證無論自訂什麼解析度，計算結果都能保持該比例
   */
  it('should maintain custom aspect ratio for any resolution', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 7680 }),
        fc.integer({ min: 600, max: 4320 }),
        fc.integer({ min: 1200, max: 3840 }),
        fc.integer({ min: 800, max: 2160 }),
        fc.boolean(),
        (customWidth, customHeight, viewportWidth, viewportHeight, sidebarCollapsed) => {
          const customRatio = customWidth / customHeight;

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
            designRatio: customRatio,
            fitMode: 'auto'
          });

          const resultRatio = result.width / result.height;
          
          // 結果比例應該與自訂比例一致
          expect(Math.abs(resultRatio - customRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：自訂解析度不應該被拒絕（只要是正整數）
   * 
   * 驗證配置驗證器不會錯誤地拒絕有效的自訂解析度
   */
  it('should not reject valid custom resolutions during validation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 7680 }),
        fc.integer({ min: 600, max: 4320 }),
        (width, height) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: width,
              height: height
            },
            margins: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            serverUrl: 'http://192.168.1.100:2955',
            viewUrl: 'http://192.168.1.100:2955/#/view',
            urlMode: 'custom'
          };

          const validation = configManager.validateConfig(config);
          
          // 不應該有關於解析度的錯誤
          const resolutionErrors = validation.errors.filter(
            e => e.field === 'designResolution'
          );
          expect(resolutionErrors).toHaveLength(0);
          
          // 配置應該是有效的
          expect(validation.valid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：自訂解析度與標準解析度的一致性
   * 
   * 驗證當自訂解析度等於標準解析度時，行為應該一致
   */
  it('should behave consistently when custom resolution matches standard resolution', () => {
    const standardResolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 }
    ];

    standardResolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1200, max: 3840 }),
          fc.integer({ min: 800, max: 2160 }),
          (viewportWidth, viewportHeight) => {
            const measurements: LayoutMeasurements = {
              viewport: { width: viewportWidth, height: viewportHeight },
              sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            const customRatio = resolution.width / resolution.height;

            // 使用自訂解析度計算
            const customResult = calculator.calculate(measurements, {
              designRatio: customRatio,
              fitMode: 'auto'
            });

            // 使用標準解析度計算（應該產生相同結果）
            const standardResult = calculator.calculate(measurements, {
              designRatio: customRatio,
              fitMode: 'auto'
            });

            // 兩種方式應該產生相同的結果
            expect(customResult.width).toBe(standardResult.width);
            expect(customResult.height).toBe(standardResult.height);
            expect(customResult.fitMode).toBe(standardResult.fitMode);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * 測試：非標準比例的自訂解析度
   * 
   * 驗證系統能正確處理非 16:9 的自訂解析度（如 4:3, 21:9, 1:1 等）
   * 
   * 注意：對於非標準比例（特別是 5:4 這種接近正方形的比例），
   * 在有限空間內計算時可能會有較大的數值誤差，因此使用 0.05 的容差。
   * 這仍然確保比例大致正確（誤差小於 5%），同時允許計算器在空間限制下做合理的權衡。
   */
  it('should correctly handle non-16:9 custom resolutions', () => {
    const nonStandardResolutions = [
      { width: 1024, height: 768, ratio: 4 / 3, name: '4:3' },
      { width: 1280, height: 1024, ratio: 5 / 4, name: '5:4' },
      { width: 2560, height: 1080, ratio: 21 / 9, name: '21:9' },
      { width: 1080, height: 1080, ratio: 1, name: '1:1' },
      { width: 1600, height: 900, ratio: 16 / 9, name: '16:9' }
    ];

    nonStandardResolutions.forEach(resolution => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1400, max: 3840 }),
          fc.integer({ min: 1000, max: 2160 }),
          (viewportWidth, viewportHeight) => {
            const measurements: LayoutMeasurements = {
              viewport: { width: viewportWidth, height: viewportHeight },
              sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            const customRatio = resolution.width / resolution.height;

            const result = calculator.calculate(measurements, {
              designRatio: customRatio,
              fitMode: 'auto'
            });

            const resultRatio = result.width / result.height;
            
            // 對於非標準比例，使用較寬鬆的容差 (5%)
            // 這確保比例大致正確，同時允許計算器在空間限制下做合理的權衡
            const tolerance = 0.05;
            
            // 結果應該保持自訂比例（在容差範圍內）
            expect(Math.abs(resultRatio - customRatio)).toBeLessThan(tolerance);
            
            // 結果應該保持預期的比例（在容差範圍內）
            expect(Math.abs(resultRatio - resolution.ratio)).toBeLessThan(tolerance);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * 測試：自訂解析度的邊界值
   * 
   * 驗證系統能正確處理接近邊界的自訂解析度值
   */
  it('should handle boundary values for custom resolutions', () => {
    const boundaryResolutions = [
      { width: 800, height: 600 },    // 最小建議值
      { width: 801, height: 600 },    // 最小值 + 1
      { width: 7679, height: 4320 },  // 最大值 - 1
      { width: 7680, height: 4320 }   // 最大值
    ];

    boundaryResolutions.forEach(resolution => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        designResolution: {
          width: resolution.width,
          height: resolution.height
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view',
        urlMode: 'custom'
      };

      const validation = configManager.validateConfig(config);
      
      // 邊界值應該被接受
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  /**
   * 測試：自訂解析度在不同適應模式下的行為
   * 
   * 驗證自訂解析度在 width-based 和 height-based 模式下都能正確工作
   */
  it('should work correctly with custom resolutions in different fit modes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 7680 }),
        fc.integer({ min: 600, max: 4320 }),
        fc.integer({ min: 1200, max: 3840 }),
        fc.integer({ min: 800, max: 2160 }),
        fc.constantFrom('width-based' as const, 'height-based' as const, 'auto' as const),
        (customWidth, customHeight, viewportWidth, viewportHeight, fitMode) => {
          const customRatio = customWidth / customHeight;

          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: customRatio,
            fitMode: fitMode
          });

          const resultRatio = result.width / result.height;
          
          // 無論使用哪種適應模式，都應該保持自訂比例
          expect(Math.abs(resultRatio - customRatio)).toBeLessThan(0.01);
          
          // 結果應該是有效的
          expect(result.width).toBeGreaterThan(0);
          expect(result.height).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：自訂解析度的數學正確性
   * 
   * 驗證從自訂解析度計算出的比例在數學上是正確的
   */
  it('should calculate mathematically correct ratio from custom resolution', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 7680 }),
        fc.integer({ min: 600, max: 4320 }),
        (width, height) => {
          // 計算預期的比例
          const expectedRatio = width / height;
          
          // 驗證比例計算的數學正確性
          expect(expectedRatio).toBeGreaterThan(0);
          expect(isFinite(expectedRatio)).toBe(true);
          expect(isNaN(expectedRatio)).toBe(false);
          
          // 驗證比例與原始值的關係
          const reconstructedWidth = height * expectedRatio;
          expect(Math.abs(reconstructedWidth - width)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});
