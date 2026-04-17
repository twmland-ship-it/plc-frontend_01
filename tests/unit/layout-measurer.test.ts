/**
 * Layout Measurer 單元測試
 * 
 * 測試佈局測量器的基本功能
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LayoutMeasurer } from '../../src/utils/layout-measurer';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('LayoutMeasurer', () => {
  let measurer: LayoutMeasurer;

  beforeEach(() => {
    measurer = new LayoutMeasurer();
  });

  afterEach(() => {
    measurer.dispose();
  });

  describe('measure()', () => {
    it('should return valid measurements', () => {
      const measurements = measurer.measure();

      expect(measurements).toBeDefined();
      expect(measurements.viewport).toBeDefined();
      expect(measurements.sidebar).toBeDefined();
      expect(measurements.header).toBeDefined();
      expect(measurements.footer).toBeDefined();
      expect(measurements.contentPadding).toBeDefined();
    });

    it('should measure viewport size', () => {
      const measurements = measurer.measure();

      expect(measurements.viewport.width).toBeGreaterThan(0);
      expect(measurements.viewport.height).toBeGreaterThan(0);
    });

    it('should return default values when elements not found', () => {
      // 確保沒有 sidebar 元素
      const sidebar = document.querySelector('.ant-layout-sider');
      expect(sidebar).toBeNull();

      const measurements = measurer.measure();

      // 應該返回預設值
      expect(measurements.sidebar.width).toBe(200);
      expect(measurements.sidebar.collapsedWidth).toBe(64);
    });

    it('should measure all required properties', () => {
      const measurements = measurer.measure();

      // 檢查所有必要屬性
      expect(typeof measurements.viewport.width).toBe('number');
      expect(typeof measurements.viewport.height).toBe('number');
      expect(typeof measurements.sidebar.width).toBe('number');
      expect(typeof measurements.sidebar.collapsed).toBe('boolean');
      expect(typeof measurements.sidebar.collapsedWidth).toBe('number');
      expect(typeof measurements.header.height).toBe('number');
      expect(typeof measurements.footer.height).toBe('number');
      expect(typeof measurements.contentPadding.top).toBe('number');
      expect(typeof measurements.contentPadding.right).toBe('number');
      expect(typeof measurements.contentPadding.bottom).toBe('number');
      expect(typeof measurements.contentPadding.left).toBe('number');
    });
  });

  describe('onLayoutChange()', () => {
    it('should register callback', () => {
      const callback = vi.fn();
      
      measurer.onLayoutChange(callback);

      // 回調應該被註冊（不會立即調用）
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not throw when adding multiple callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      expect(() => {
        measurer.onLayoutChange(callback1);
        measurer.onLayoutChange(callback2);
      }).not.toThrow();
    });

    it('should warn when adding callback after disposal', () => {
      const callback = vi.fn();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      measurer.dispose();
      measurer.onLayoutChange(callback);

      expect(consoleSpy).toHaveBeenCalledWith(
        'LayoutMeasurer has been disposed, cannot add listener'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('dispose()', () => {
    it('should clean up resources', () => {
      const callback = vi.fn();
      measurer.onLayoutChange(callback);

      measurer.dispose();

      // 再次調用 dispose 不應該拋出錯誤
      expect(() => measurer.dispose()).not.toThrow();
    });

    it('should prevent further operations after disposal', () => {
      measurer.dispose();

      const callback = vi.fn();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      measurer.onLayoutChange(callback);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('with DOM elements', () => {
    beforeEach(() => {
      // 創建測試用的 DOM 結構
      document.body.innerHTML = `
        <div class="ant-layout">
          <div class="ant-layout-sider" style="width: 200px;">Sidebar</div>
          <div class="ant-layout">
            <div class="ant-layout-header" style="height: 64px;">Header</div>
            <div class="ant-layout-content" style="padding: 24px;">Content</div>
            <div class="ant-layout-footer" style="height: 50px;">Footer</div>
          </div>
        </div>
      `;
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should measure sidebar when element exists', () => {
      const measurements = measurer.measure();

      // 應該測量到 sidebar
      expect(measurements.sidebar.width).toBeGreaterThan(0);
    });

    it('should detect sidebar collapsed state', () => {
      // 添加 collapsed class
      const sidebar = document.querySelector('.ant-layout-sider');
      sidebar?.classList.add('ant-layout-sider-collapsed');

      const measurements = measurer.measure();

      expect(measurements.sidebar.collapsed).toBe(true);
    });

    it('should measure header when element exists', () => {
      const measurements = measurer.measure();

      expect(measurements.header.height).toBeGreaterThan(0);
    });

    it('should measure footer when element exists', () => {
      const measurements = measurer.measure();

      expect(measurements.footer.height).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle measurement errors gracefully', () => {
      // 測試當沒有任何 DOM 元素時，應該返回預設值
      const measurements = measurer.measure();

      // 應該返回預設值而不是拋出錯誤
      expect(measurements).toBeDefined();
      expect(measurements.viewport).toBeDefined();
      expect(measurements.sidebar).toBeDefined();
      expect(measurements.header).toBeDefined();
      expect(measurements.footer).toBeDefined();
      expect(measurements.contentPadding).toBeDefined();
      
      // 所有值都應該是有效的數字
      expect(typeof measurements.viewport.width).toBe('number');
      expect(typeof measurements.viewport.height).toBe('number');
      expect(measurements.viewport.width).toBeGreaterThan(0);
      expect(measurements.viewport.height).toBeGreaterThan(0);
    });
  });
});
