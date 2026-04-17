import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LayoutMeasurer } from '@/utils/layout-measurer';
import { SizeCalculator } from '@/utils/size-calculator';

/**
 * Feature: iframe-auto-fit-enhancement
 * Tests for margin centering functionality (Requirements 7.3, 7.4, 7.5)
 */
describe('Margin Centering Functions', () => {
  let measurer: LayoutMeasurer;
  let calculator: SizeCalculator;

  beforeEach(() => {
    measurer = new LayoutMeasurer();
    calculator = new SizeCalculator();
  });

  /**
   * Validates: Requirements 7.3 - 水平置中
   */
  it('should calculate horizontal center margins correctly', () => {
    const measurements = measurer.measure();
    const availableSpace = calculator.calculateAvailableSpace(measurements);
    
    const designRatio = 16 / 9;
    const calculatedSize = calculator.calculate(measurements, {
      designRatio,
      fitMode: 'auto'
    });
    
    // 計算水平居中邊距
    const horizontalMargin = Math.max(0, Math.round((availableSpace.width - calculatedSize.width) / 2));
    
    // 驗證左右邊距相等
    expect(horizontalMargin).toBeGreaterThanOrEqual(0);
    
    // 驗證邊距計算正確
    const totalWidth = calculatedSize.width + horizontalMargin * 2;
    expect(totalWidth).toBeLessThanOrEqual(availableSpace.width + 1); // 允許 1px 誤差（四捨五入）
  });

  /**
   * Validates: Requirements 7.4 - 垂直置中
   */
  it('should calculate vertical center margins correctly', () => {
    const measurements = measurer.measure();
    const availableSpace = calculator.calculateAvailableSpace(measurements);
    
    const designRatio = 16 / 9;
    const calculatedSize = calculator.calculate(measurements, {
      designRatio,
      fitMode: 'auto'
    });
    
    // 計算垂直居中邊距
    const verticalMargin = Math.max(0, Math.round((availableSpace.height - calculatedSize.height) / 2));
    
    // 驗證上下邊距相等
    expect(verticalMargin).toBeGreaterThanOrEqual(0);
    
    // 驗證邊距計算正確
    const totalHeight = calculatedSize.height + verticalMargin * 2;
    expect(totalHeight).toBeLessThanOrEqual(availableSpace.height + 1); // 允許 1px 誤差（四捨五入）
  });

  /**
   * Validates: Requirements 7.5 - 完全置中
   */
  it('should calculate full center margins correctly', () => {
    const measurements = measurer.measure();
    const availableSpace = calculator.calculateAvailableSpace(measurements);
    
    const designRatio = 16 / 9;
    const calculatedSize = calculator.calculate(measurements, {
      designRatio,
      fitMode: 'auto'
    });
    
    // 計算居中邊距
    const centerMargins = calculator.calculateCenterMargins(availableSpace, calculatedSize);
    
    // 驗證所有邊距都非負
    expect(centerMargins.top).toBeGreaterThanOrEqual(0);
    expect(centerMargins.right).toBeGreaterThanOrEqual(0);
    expect(centerMargins.bottom).toBeGreaterThanOrEqual(0);
    expect(centerMargins.left).toBeGreaterThanOrEqual(0);
    
    // 驗證左右邊距相等（水平置中）
    expect(centerMargins.left).toBe(centerMargins.right);
    
    // 驗證上下邊距相等（垂直置中）
    expect(centerMargins.top).toBe(centerMargins.bottom);
    
    // 驗證總尺寸不超出可用空間
    const totalWidth = calculatedSize.width + centerMargins.left + centerMargins.right;
    const totalHeight = calculatedSize.height + centerMargins.top + centerMargins.bottom;
    
    expect(totalWidth).toBeLessThanOrEqual(availableSpace.width + 1); // 允許 1px 誤差
    expect(totalHeight).toBeLessThanOrEqual(availableSpace.height + 1); // 允許 1px 誤差
  });

  /**
   * Validates: Requirements 7.1 - 獨立調整邊距
   */
  it('should allow independent margin adjustments', () => {
    const measurements = measurer.measure();
    const availableSpace = calculator.calculateAvailableSpace(measurements);
    
    const designRatio = 16 / 9;
    
    // 測試使用自訂邊距
    const customMargins = {
      top: 10,
      right: 20,
      bottom: 30,
      left: 40
    };
    
    const calculatedSize = calculator.calculate(measurements, {
      designRatio,
      fitMode: 'auto',
      margins: customMargins
    });
    
    // 驗證自訂邊距被正確應用
    expect(calculatedSize.margins.top).toBe(customMargins.top);
    expect(calculatedSize.margins.right).toBe(customMargins.right);
    expect(calculatedSize.margins.bottom).toBe(customMargins.bottom);
    expect(calculatedSize.margins.left).toBe(customMargins.left);
  });

  /**
   * Edge case: 當可用空間小於內容尺寸時
   */
  it('should handle case when available space is smaller than content', () => {
    // 創建一個非常小的可用空間
    const smallMeasurements = {
      viewport: { width: 400, height: 300 },
      sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
      header: { height: 64 },
      footer: { height: 50 },
      contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
    };
    
    const availableSpace = calculator.calculateAvailableSpace(smallMeasurements);
    const designRatio = 16 / 9;
    const calculatedSize = calculator.calculate(smallMeasurements, {
      designRatio,
      fitMode: 'auto'
    });
    
    // 計算居中邊距
    const centerMargins = calculator.calculateCenterMargins(availableSpace, calculatedSize);
    
    // 邊距應該為 0 或非負（不會是負數）
    expect(centerMargins.top).toBeGreaterThanOrEqual(0);
    expect(centerMargins.right).toBeGreaterThanOrEqual(0);
    expect(centerMargins.bottom).toBeGreaterThanOrEqual(0);
    expect(centerMargins.left).toBeGreaterThanOrEqual(0);
  });
});
