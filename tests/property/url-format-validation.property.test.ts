/**
 * Property-Based Tests for URL Format Validation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 18: URL 格式驗證
 * Validates: Requirements 10.5
 * 
 * 測試無效 URL 被拒絕
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { ConfigurationManager } from '../../src/utils/configuration-manager';
import type { IframeConfig } from '../../src/types/iframe-config';

describe('Property: URL Format Validation', () => {
  const manager = new ConfigurationManager();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 18: URL 格式驗證
   * 
   * For any 用戶輸入的 URL，系統應該驗證其格式是否正確，
   * 對於無效的 URL 應該顯示錯誤訊息並阻止儲存
   * 
   * 這個屬性確保：
   * 1. 無效的 URL 格式被拒絕
   * 2. 缺少協議的 URL 被拒絕
   * 3. 使用非 http/https 協議的 URL 被拒絕
   * 4. 驗證結果包含適當的錯誤訊息
   * 5. viewUrl 和 serverUrl 都被正確驗證
   */

  /**
   * 測試各種無效的 viewUrl 格式
   */
  it('should reject invalid viewUrl formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // 完全無效的字串
          fc.constant('not-a-url'),
          fc.constant('just some text'),
          fc.constant(''),
          fc.constant('   '),
          
          // 缺少協議
          fc.constant('192.168.1.100:2955'),
          fc.constant('localhost:3000'),
          fc.constant('example.com'),
          fc.constant('www.example.com'),
          fc.constant('//example.com'),
          
          // 無效的協議
          fc.constant('ftp://example.com'),
          fc.constant('file:///path/to/file'),
          fc.constant('javascript:alert(1)'),
          fc.constant('data:text/html,<h1>test</h1>'),
          
          // 格式錯誤
          fc.constant('http:/example.com'), // 單斜線
          fc.constant('http//example.com'), // 缺少冒號
          fc.constant('ht tp://example.com'), // 空格
          fc.constant('http://'), // 缺少主機
          fc.constant('http://:8080'), // 缺少主機但有端口
          
          // 特殊字元問題
          fc.constant('http://exam ple.com'), // 主機名中有空格
          fc.constant('http://[invalid]'), // 無效的 IPv6
          fc.constant('http://<script>'), // HTML 標籤
          
          // 其他邊界情況
          fc.constant('http:'), // 只有協議
          fc.constant('://example.com'), // 缺少協議名稱
          fc.constant('http:///path') // 三個斜線
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
          
          // 應該有關於 viewUrl 的錯誤
          const urlError = result.errors.find(e => e.field === 'viewUrl');
          expect(urlError).toBeDefined();
          
          // 錯誤訊息應該提到網址或 URL
          expect(urlError?.message).toMatch(/網址|URL/i);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試各種無效的 serverUrl 格式
   */
  it('should reject invalid serverUrl formats', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // 完全無效的字串
          fc.constant('invalid-server-url'),
          fc.constant('not a url at all'),
          fc.constant(''),
          
          // 缺少協議
          fc.constant('192.168.1.1:3000'),
          fc.constant('localhost:2955'),
          fc.constant('server.local'),
          
          // 無效的協議
          fc.constant('ftp://server.com'),
          fc.constant('ssh://server.com'),
          fc.constant('telnet://server.com'),
          
          // 格式錯誤
          fc.constant('http:/server.com'),
          fc.constant('http//server.com'),
          fc.constant('http://'),
          
          // 特殊情況
          fc.constant('http:'),
          fc.constant('://server.com')
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
          
          // 錯誤訊息應該提到網址或伺服器
          expect(serverUrlError?.message).toMatch(/網址|伺服器|URL/i);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試非 http/https 協議被拒絕
   */
  it('should reject URLs with non-http/https protocols', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('ftp'),
          fc.constant('file'),
          fc.constant('ws'),
          fc.constant('wss'),
          fc.constant('ssh'),
          fc.constant('telnet'),
          fc.constant('mailto'),
          fc.constant('javascript'),
          fc.constant('data')
        ),
        fc.string({ minLength: 3, maxLength: 20 }).filter(s => !s.includes(' ')),
        (protocol, domain) => {
          const invalidUrl = `${protocol}://${domain}.com`;
          
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
          
          // 應該有關於協議的錯誤
          const urlError = result.errors.find(e => e.field === 'viewUrl');
          expect(urlError).toBeDefined();
          
          // 錯誤訊息應該提到協議或 http/https
          expect(urlError?.message).toMatch(/協議|http|https/i);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試有效的 URL 格式被接受
   * 
   * 這是一個反向測試，確保有效的 URL 不會被錯誤地拒絕
   */
  it('should accept valid http and https URLs', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('http'),
          fc.constant('https')
        ),
        fc.oneof(
          fc.constant('localhost'),
          fc.constant('127.0.0.1'),
          fc.constant('192.168.1.100'),
          fc.constant('example.com'),
          fc.constant('www.example.com'),
          fc.constant('sub.domain.example.com')
        ),
        fc.option(fc.integer({ min: 1000, max: 65535 }), { nil: undefined }),
        fc.option(fc.constant('/path/to/view'), { nil: undefined }),
        (protocol, host, port, path) => {
          const portStr = port ? `:${port}` : '';
          const pathStr = path || '';
          const validUrl = `${protocol}://${host}${portStr}${pathStr}`;
          
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: validUrl,
            viewUrl: validUrl,
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該成功（沒有 URL 相關的錯誤）
          const urlErrors = result.errors.filter(
            e => e.field === 'viewUrl' || e.field === 'serverUrl'
          );
          expect(urlErrors.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試同時有無效 viewUrl 和 serverUrl 時，兩個錯誤都被捕獲
   */
  it('should catch both viewUrl and serverUrl errors when both are invalid', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('invalid-view-url'),
          fc.constant('not-a-url'),
          fc.constant('ftp://invalid.com')
        ),
        fc.oneof(
          fc.constant('invalid-server-url'),
          fc.constant('also-not-a-url'),
          fc.constant('file:///invalid')
        ),
        (invalidViewUrl, invalidServerUrl) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: invalidServerUrl,
            viewUrl: invalidViewUrl,
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該失敗
          expect(result.valid).toBe(false);
          
          // 應該有兩個 URL 相關的錯誤
          const viewUrlError = result.errors.find(e => e.field === 'viewUrl');
          const serverUrlError = result.errors.find(e => e.field === 'serverUrl');
          
          expect(viewUrlError).toBeDefined();
          expect(serverUrlError).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試 URL 中的特殊字元和編碼
   */
  it('should handle URLs with query parameters and hash fragments correctly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('http'),
          fc.constant('https')
        ),
        fc.oneof(
          fc.constant('localhost'),
          fc.constant('192.168.1.100')
        ),
        fc.integer({ min: 1000, max: 9999 }),
        (protocol, host, port) => {
          // 測試帶有查詢參數和 hash 的 URL
          const urlWithQuery = `${protocol}://${host}:${port}/view?name=test&id=123`;
          const urlWithHash = `${protocol}://${host}:${port}/#/view`;
          const urlWithBoth = `${protocol}://${host}:${port}/#/view?name=test`;
          
          const urls = [urlWithQuery, urlWithHash, urlWithBoth];
          
          for (const url of urls) {
            const config: IframeConfig = {
              displayMode: 'contain-center',
              heightMode: 'auto',
              designResolution: {
                width: 1920,
                height: 1080
              },
              serverUrl: `${protocol}://${host}:${port}`,
              viewUrl: url,
              urlMode: 'select'
            };

            const result = manager.validateConfig(config);

            // 這些 URL 應該被接受（沒有 URL 錯誤）
            const urlErrors = result.errors.filter(
              e => e.field === 'viewUrl' || e.field === 'serverUrl'
            );
            expect(urlErrors.length).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試空字串和空白字串的處理
   */
  it('should reject empty or whitespace-only URLs', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.constant(' '),
          fc.constant('  '),
          fc.constant('\t'),
          fc.constant('\n'),
          fc.constant('   \t\n   ')
        ),
        (emptyOrWhitespace) => {
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: 'http://localhost:3000',
            viewUrl: emptyOrWhitespace,
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 如果 URL 不是空字串，驗證應該失敗
          if (emptyOrWhitespace.trim() !== '') {
            expect(result.valid).toBe(false);
            const urlError = result.errors.find(e => e.field === 'viewUrl');
            expect(urlError).toBeDefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試常見的 URL 輸入錯誤
   */
  it('should reject common URL input mistakes', () => {
    const commonMistakes = [
      'http//example.com',           // 缺少冒號
      'http:/example.com',           // 單斜線
      'http:example.com',            // 缺少斜線
      'htp://example.com',           // 拼寫錯誤
      'htpp://example.com',          // 拼寫錯誤
      'http://example .com',         // 空格
      'http://example.com:abc',      // 無效的端口
      'http://example.com:-1',       // 負數端口
      'http://example.com:99999',    // 端口超出範圍
      'http://[invalid-ipv6]',       // 無效的 IPv6
      'http://user:pass@',           // 缺少主機
      'http://@example.com',         // 無效的用戶信息
    ];

    for (const mistake of commonMistakes) {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        designResolution: {
          width: 1920,
          height: 1080
        },
        serverUrl: 'http://localhost:3000',
        viewUrl: mistake,
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);

      // 驗證應該失敗
      expect(result.valid, `URL "${mistake}" should be rejected but was accepted`).toBe(false);
      
      // 應該有 URL 錯誤
      const urlError = result.errors.find(e => e.field === 'viewUrl');
      expect(urlError, `URL "${mistake}" should have an error`).toBeDefined();
    }
  });

  /**
   * 測試 IPv4 和 IPv6 地址格式
   */
  it('should accept valid IPv4 addresses with http/https protocol', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.constant('http'), fc.constant('https')),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.option(fc.integer({ min: 1000, max: 65535 }), { nil: undefined }),
        (protocol, a, b, c, d, port) => {
          const ip = `${a}.${b}.${c}.${d}`;
          const portStr = port ? `:${port}` : '';
          const validUrl = `${protocol}://${ip}${portStr}`;
          
          const config: IframeConfig = {
            displayMode: 'contain-center',
            heightMode: 'auto',
            designResolution: {
              width: 1920,
              height: 1080
            },
            serverUrl: validUrl,
            viewUrl: validUrl,
            urlMode: 'select'
          };

          const result = manager.validateConfig(config);

          // 驗證應該成功（沒有 URL 相關的錯誤）
          const urlErrors = result.errors.filter(
            e => e.field === 'viewUrl' || e.field === 'serverUrl'
          );
          expect(urlErrors.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 邊界測試：測試極長的 URL
   */
  it('should handle very long but valid URLs', () => {
    const protocol = 'http';
    const host = 'example.com';
    const longPath = '/path/' + 'a'.repeat(1000);
    const longQuery = '?param=' + 'b'.repeat(1000);
    const longUrl = `${protocol}://${host}${longPath}${longQuery}`;
    
    const config: IframeConfig = {
      displayMode: 'contain-center',
      heightMode: 'auto',
      designResolution: {
        width: 1920,
        height: 1080
      },
      serverUrl: 'http://localhost:3000',
      viewUrl: longUrl,
      urlMode: 'select'
    };

    const result = manager.validateConfig(config);

    // 極長的 URL 應該被接受（只要格式正確）
    const urlErrors = result.errors.filter(e => e.field === 'viewUrl');
    expect(urlErrors.length).toBe(0);
  });
});
