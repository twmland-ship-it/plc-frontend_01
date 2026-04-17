/**
 * 測試框架設置驗證
 * 
 * 本測試文件驗證 Vitest 和 fast-check 是否正確安裝和配置
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('測試框架設置', () => {
  it('Vitest 應該正常運作', () => {
    expect(true).toBe(true);
  });

  it('fast-check 應該正常運作', () => {
    fc.assert(
      fc.property(
        fc.integer(),
        (n) => {
          return n === n; // 任何整數都等於自己
        }
      ),
      { numRuns: 10 }
    );
  });

  it('測試環境變數應該正確設置', () => {
    expect(window.innerWidth).toBe(1920);
    expect(window.innerHeight).toBe(1080);
  });

  it('localStorage mock 應該正常運作', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.getItem('test')).toBe('value');
    localStorage.removeItem('test');
    expect(localStorage.getItem('test')).toBeNull();
  });

  it('ResizeObserver mock 應該存在', () => {
    expect(typeof ResizeObserver).toBe('function');
    const observer = new ResizeObserver(() => {});
    expect(observer).toBeDefined();
  });

  it('MutationObserver mock 應該存在', () => {
    expect(typeof MutationObserver).toBe('function');
    const observer = new MutationObserver(() => {});
    expect(observer).toBeDefined();
  });
});

describe('TypeScript 類型定義', () => {
  it('應該能夠導入類型定義', async () => {
    const types = await import('@/types/iframe-config');
    
    expect(types.DEFAULT_CONFIG).toBeDefined();
    expect(types.DEFAULT_MEASUREMENTS).toBeDefined();
    expect(types.COMMON_RESOLUTIONS).toBeDefined();
  });

  it('預設配置應該有正確的值', async () => {
    const { DEFAULT_CONFIG } = await import('@/types/iframe-config');
    
    expect(DEFAULT_CONFIG.displayMode).toBe('contain-center');
    expect(DEFAULT_CONFIG.heightMode).toBe('px');
    expect(DEFAULT_CONFIG.heightValue).toBe(918);
    expect(DEFAULT_CONFIG.designResolution.width).toBe(1920);
    expect(DEFAULT_CONFIG.designResolution.height).toBe(1080);
  });

  it('預設測量值應該有正確的值', async () => {
    const { DEFAULT_MEASUREMENTS } = await import('@/types/iframe-config');
    
    expect(DEFAULT_MEASUREMENTS.viewport.width).toBe(1920);
    expect(DEFAULT_MEASUREMENTS.viewport.height).toBe(1080);
    expect(DEFAULT_MEASUREMENTS.sidebar.width).toBe(200);
    expect(DEFAULT_MEASUREMENTS.sidebar.collapsedWidth).toBe(64);
  });

  it('常見解析度應該包含標準值', async () => {
    const { COMMON_RESOLUTIONS } = await import('@/types/iframe-config');
    
    expect(COMMON_RESOLUTIONS.length).toBeGreaterThan(0);
    
    // 檢查是否包含 Full HD
    const fullHD = COMMON_RESOLUTIONS.find(
      r => r.width === 1920 && r.height === 1080
    );
    expect(fullHD).toBeDefined();
  });
});
