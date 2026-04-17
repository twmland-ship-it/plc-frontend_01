/**
 * Property-Based Tests for Invalid Input Validation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 17: 無效輸入驗證
 * Validates: Requirements 10.1
 * 
 * 測試負數、非數字等無效值被拒絕
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ConfigurationManager } from '../../src/utils/configuration-manager';
import type { IframeConfig } from '../../src/types/iframe-config';

describe('Property: Invalid Input Validation', () => {
  const manager = new ConfigurationManager();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 17: 無效輸入驗證
   * 
   * For any 無效的尺寸值（負數、非數字、超出範圍），
   * 系統應該拒絕該值並顯示錯誤訊息
   * 
   * 這個屬性確保：
   * 1. 負數的高度值被拒絕
   * 2. 超出範圍的高度值被拒絕
   * 3. 負數的邊距值被拒絕
   * 4. 負數或零的設計解析度被拒絕
   * 5. 驗證結果包含適當的錯誤訊息
   */
  it('should reject negative height values in px mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: -1 }), // 生成負數
        (negativeHeight) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: negativeHeight,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有錯誤訊息
          expect(result.errors.length).toBeGreaterThan(0);
          
          // 錯誤應該與 heightValue 相關
          const heightError = result.errors.find(e => e.field === 'heightValue');
          expect(heightError).toBeDefined();
          expect(heightError?.message).toContain('不能小於');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject height values below minimum threshold (200px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 199 }), // 小於 200 但大於 0
        (tooSmallHeight) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: tooSmallHeight,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於最小高度的錯誤
          const heightError = result.errors.find(e => e.field === 'heightValue');
          expect(heightError).toBeDefined();
          expect(heightError?.message).toContain('200px');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject height values above maximum threshold (2000px)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2001, max: 10000 }), // 大於 2000
        (tooLargeHeight) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: tooLargeHeight,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於最大高度的錯誤
          const heightError = result.errors.find(e => e.field === 'heightValue');
          expect(heightError).toBeDefined();
          expect(heightError?.message).toContain('2000px');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject negative vh values', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: -1 }), // 負數 vh 值
        (negativeVh) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'vh',
            heightValue: negativeVh,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有錯誤訊息
          expect(result.errors.length).toBeGreaterThan(0);
          
          // 錯誤應該與 heightValue 相關
          const heightError = result.errors.find(e => e.field === 'heightValue');
          expect(heightError).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject vh values below 10', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 9 }), // vh 值小於 10
        (tooSmallVh) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'vh',
            heightValue: tooSmallVh,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於最小 vh 值的錯誤
          const heightError = result.errors.find(e => e.field === 'heightValue');
          expect(heightError).toBeDefined();
          expect(heightError?.message).toContain('10');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject vh values above 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 101, max: 1000 }), // vh 值大於 100
        (tooLargeVh) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'vh',
            heightValue: tooLargeVh,
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於最大 vh 值的錯誤
          const heightError = result.errors.find(e => e.field === 'heightValue');
          expect(heightError).toBeDefined();
          expect(heightError?.message).toContain('100');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject negative margin values', () => {
    fc.assert(
      fc.property(
        fc.record({
          top: fc.integer({ min: -100, max: -1 }),
          right: fc.integer({ min: -100, max: -1 }),
          bottom: fc.integer({ min: -100, max: -1 }),
          left: fc.integer({ min: -100, max: -1 })
        }),
        (negativeMargins) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            margins: negativeMargins,
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於邊距的錯誤
          const marginError = result.errors.find(e => e.field === 'margins');
          expect(marginError).toBeDefined();
          expect(marginError?.message).toContain('不能為負數');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject any negative margin value (even if others are positive)', () => {
    fc.assert(
      fc.property(
        fc.record({
          top: fc.integer({ min: 0, max: 100 }),
          right: fc.integer({ min: 0, max: 100 }),
          bottom: fc.integer({ min: 0, max: 100 }),
          left: fc.integer({ min: -100, max: -1 }) // 只有 left 是負數
        }),
        (mixedMargins) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            margins: mixedMargins,
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗（因為有一個負數邊距）
          expect(result.valid).toBe(false);
          
          // 應該有關於邊距的錯誤
          const marginError = result.errors.find(e => e.field === 'margins');
          expect(marginError).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject zero or negative design resolution width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 0 }), // 零或負數寬度
        (invalidWidth) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: invalidWidth,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於設計解析度的錯誤
          const resolutionError = result.errors.find(e => e.field === 'designResolution');
          expect(resolutionError).toBeDefined();
          expect(resolutionError?.message).toContain('必須大於 0');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject zero or negative design resolution height', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 0 }), // 零或負數高度
        (invalidHeight) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: invalidHeight
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於設計解析度的錯誤
          const resolutionError = result.errors.find(e => e.field === 'designResolution');
          expect(resolutionError).toBeDefined();
          expect(resolutionError?.message).toContain('必須大於 0');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid URL formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('not-a-url'),
          fc.constant('ftp://invalid-protocol.com'),
          fc.constant('just some text'),
          fc.constant('192.168.1.1'), // IP without protocol
          fc.constant('localhost:3000'), // localhost without protocol
          fc.constant('//missing-protocol.com')
        ),
        (invalidUrl) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: invalidUrl,
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於 URL 的錯誤
          const urlError = result.errors.find(e => e.field === 'viewUrl');
          expect(urlError).toBeDefined();
          // 錯誤訊息應該包含 "網址" 相關的文字（可能是格式不正確或協議錯誤）
          expect(urlError?.message).toMatch(/網址/);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should reject invalid server URL formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('invalid-server-url'),
          fc.constant('not a url at all'),
          fc.constant('192.168.1.1:3000') // IP:port without protocol
        ),
        (invalidServerUrl) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: invalidServerUrl,
            viewUrl: 'http://localhost:3000/view',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有關於 serverUrl 的錯誤
          const serverUrlError = result.errors.find(e => e.field === 'serverUrl');
          expect(serverUrlError).toBeDefined();
          // 錯誤訊息應該包含 "網址" 或 "伺服器" 相關的文字
          expect(serverUrlError?.message).toMatch(/網址|伺服器/);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 綜合測試：多個無效值同時存在
   * 
   * 測試當配置中有多個無效值時，驗證器應該捕獲所有錯誤
   */
  it('should catch multiple validation errors in a single config', () => {
    fc.assert(
      fc.property(
        fc.record({
          heightValue: fc.integer({ min: -100, max: -1 }), // 負數高度
          marginTop: fc.integer({ min: -50, max: -1 }), // 負數邊距
          resolutionWidth: fc.integer({ min: -1000, max: 0 }) // 無效解析度
        }),
        (invalidValues) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'px',
            heightValue: invalidValues.heightValue,
            designResolution: {
              width: invalidValues.resolutionWidth,
              height: 1080
            },
            margins: {
              top: invalidValues.marginTop,
              right: 0,
              bottom: 0,
              left: 0
            },
            serverUrl: 'not-a-valid-url',
            viewUrl: 'also-not-valid',
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有多個錯誤
          expect(result.errors.length).toBeGreaterThanOrEqual(3);
          
          // 應該包含各種類型的錯誤
          const errorFields = result.errors.map(e => e.field);
          expect(errorFields).toContain('heightValue');
          expect(errorFields).toContain('margins');
          expect(errorFields).toContain('designResolution');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界測試：測試邊界值
   * 
   * 確保邊界值被正確處理（例如 200px 應該被接受，199px 應該被拒絕）
   */
  it('should correctly handle boundary values for height', () => {
    // 測試最小邊界：199 應該被拒絕
    const configTooSmall: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'px',
      heightValue: 199,
      designResolution: { width: 1920, height: 1080 },
      serverUrl: 'http://localhost:3000',
      viewUrl: 'http://localhost:3000/view',
      urlMode: 'select'
    };
    
    const resultTooSmall = manager.validateConfig(configTooSmall);
    expect(resultTooSmall.valid).toBe(false);

    // 測試最小邊界：200 應該被接受
    const configMinValid: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'px',
      heightValue: 200,
      designResolution: { width: 1920, height: 1080 },
      serverUrl: 'http://localhost:3000',
      viewUrl: 'http://localhost:3000/view',
      urlMode: 'select'
    };
    
    const resultMinValid = manager.validateConfig(configMinValid);
    expect(resultMinValid.valid).toBe(true);

    // 測試最大邊界：2000 應該被接受
    const configMaxValid: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'px',
      heightValue: 2000,
      designResolution: { width: 1920, height: 1080 },
      serverUrl: 'http://localhost:3000',
      viewUrl: 'http://localhost:3000/view',
      urlMode: 'select'
    };
    
    const resultMaxValid = manager.validateConfig(configMaxValid);
    expect(resultMaxValid.valid).toBe(true);

    // 測試最大邊界：2001 應該被拒絕
    const configTooLarge: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'px',
      heightValue: 2001,
      designResolution: { width: 1920, height: 1080 },
      serverUrl: 'http://localhost:3000',
      viewUrl: 'http://localhost:3000/view',
      urlMode: 'select'
    };
    
    const resultTooLarge = manager.validateConfig(configTooLarge);
    expect(resultTooLarge.valid).toBe(false);
  });
});
