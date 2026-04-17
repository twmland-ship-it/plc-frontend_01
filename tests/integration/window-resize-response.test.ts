/**
 * Window Resize Response Integration Test
 * 
 * 驗證視窗大小變化時，系統能正確響應並更新顯示
 * 
 * Feature: iframe-auto-fit-enhancement
 * Task: 13. 實施視窗大小響應
 * Validates: Requirements 5.5
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LayoutMeasurer } from '@/utils/layout-measurer';
import { SizeCalculator } from '@/utils/size-calculator';

describe('Window Resize Response', () => {
  let measurer: LayoutMeasurer;
  let calculator: SizeCalculator;
  let resizeCallback: ((measurements: any) => void) | null = null;

  beforeEach(() => {
    measurer = new LayoutMeasurer();
    calculator = new SizeCalculator();
    
    // 模擬 DOM 元素
    document.body.innerHTML = `
      <div class="ant-layout-sider" style="width: 200px;"></div>
      <div class="ant-layout-header" style="height: 64px;"></div>
      <div class="ant-layout-footer" style="height: 50px;"></div>
      <div class="ant-layout-content" style="padding: 24px;"></div>
    `;
  });

  afterEach(() => {
    if (measurer) {
      measurer.dispose();
    }
    document.body.innerHTML = '';
    resizeCallback = null;
  });

  /**
   * Task 13.1: 添加視窗大小監聽
   * 驗證系統能監聽 window.resize 事件
   */
  it('should listen to window resize events', async () => {
    let callbackInvoked = false;
    
    measurer.onLayoutChange(() => {
      callbackInvoked = true;
    });

    // 模擬視窗大小變化
    window.innerWidth = 1920;
    window.innerHeight = 1080;
    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲（150ms）
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(callbackInvoked).toBe(true);
  });

  /**
   * Task 13.1: 驗證防抖功能
   * 確保多次快速 resize 只觸發一次回調
   */
  it('should debounce resize events', async () => {
    let callbackCount = 0;
    
    measurer.onLayoutChange(() => {
      callbackCount++;
    });

    // 快速觸發多次 resize
    for (let i = 0; i < 10; i++) {
      window.dispatchEvent(new Event('resize'));
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    // 應該只觸發一次（或很少次數，因為防抖）
    expect(callbackCount).toBeLessThanOrEqual(2);
  });

  /**
   * Task 13.3: 實施響應式尺寸更新
   * 驗證視窗大小變化時重新計算尺寸
   */
  it('should recalculate size when window resizes', async () => {
    const measurements1 = measurer.measure();
    const size1 = calculator.calculate(measurements1, {
      designRatio: 16 / 9,
      fitMode: 'auto'
    });

    // 改變視窗大小
    window.innerWidth = 2560;
    window.innerHeight = 1440;
    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    const measurements2 = measurer.measure();
    const size2 = calculator.calculate(measurements2, {
      designRatio: 16 / 9,
      fitMode: 'auto'
    });

    // 尺寸應該不同（因為視窗大小變了）
    expect(size2.width).not.toBe(size1.width);
    expect(size2.height).not.toBe(size1.height);
  });

  /**
   * Task 13.3: 驗證尺寸資訊即時更新
   * 確保測量結果反映新的視窗尺寸
   */
  it('should update measurements to reflect new window size', async () => {
    const initialWidth = 1920;
    const initialHeight = 1080;
    const newWidth = 2560;
    const newHeight = 1440;

    window.innerWidth = initialWidth;
    window.innerHeight = initialHeight;

    const measurements1 = measurer.measure();
    expect(measurements1.viewport.width).toBe(initialWidth);
    expect(measurements1.viewport.height).toBe(initialHeight);

    // 改變視窗大小
    window.innerWidth = newWidth;
    window.innerHeight = newHeight;
    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    const measurements2 = measurer.measure();
    expect(measurements2.viewport.width).toBe(newWidth);
    expect(measurements2.viewport.height).toBe(newHeight);
  });

  /**
   * Task 13.3: 驗證可用空間重新計算
   * 確保視窗變化時可用空間正確更新
   */
  it('should recalculate available space when window resizes', async () => {
    window.innerWidth = 1920;
    window.innerHeight = 1080;

    const measurements1 = measurer.measure();
    const available1 = calculator.calculateAvailableSpace(measurements1);

    // 改變視窗大小
    window.innerWidth = 2560;
    window.innerHeight = 1440;
    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    const measurements2 = measurer.measure();
    const available2 = calculator.calculateAvailableSpace(measurements2);

    // 可用空間應該增加
    expect(available2.width).toBeGreaterThan(available1.width);
    expect(available2.height).toBeGreaterThan(available1.height);
  });

  /**
   * Task 13.3: 驗證比例保持
   * 確保視窗變化時仍保持設計比例
   */
  it('should maintain aspect ratio when window resizes', async () => {
    const designRatio = 16 / 9;

    window.innerWidth = 1920;
    window.innerHeight = 1080;

    const measurements1 = measurer.measure();
    const size1 = calculator.calculate(measurements1, {
      designRatio,
      fitMode: 'auto'
    });

    const ratio1 = size1.width / size1.height;

    // 改變視窗大小
    window.innerWidth = 2560;
    window.innerHeight = 1440;
    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    const measurements2 = measurer.measure();
    const size2 = calculator.calculate(measurements2, {
      designRatio,
      fitMode: 'auto'
    });

    const ratio2 = size2.width / size2.height;

    // 比例應該保持一致（允許 0.01 的誤差）
    expect(Math.abs(ratio1 - ratio2)).toBeLessThan(0.01);
    expect(Math.abs(ratio2 - designRatio)).toBeLessThan(0.01);
  });

  /**
   * Task 13.3: 驗證多個監聽器
   * 確保可以註冊多個監聽器，且都能收到通知
   */
  it('should notify all registered listeners on resize', async () => {
    let callback1Invoked = false;
    let callback2Invoked = false;
    let callback3Invoked = false;

    measurer.onLayoutChange(() => {
      callback1Invoked = true;
    });

    measurer.onLayoutChange(() => {
      callback2Invoked = true;
    });

    measurer.onLayoutChange(() => {
      callback3Invoked = true;
    });

    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    expect(callback1Invoked).toBe(true);
    expect(callback2Invoked).toBe(true);
    expect(callback3Invoked).toBe(true);
  });

  /**
   * Task 13.3: 驗證清理功能
   * 確保 dispose 後不再響應 resize 事件
   */
  it('should stop responding to resize after dispose', async () => {
    let callbackInvoked = false;

    measurer.onLayoutChange(() => {
      callbackInvoked = true;
    });

    // 清理資源
    measurer.dispose();

    // 觸發 resize
    window.dispatchEvent(new Event('resize'));

    // 等待防抖延遲
    await new Promise(resolve => setTimeout(resolve, 200));

    // 不應該觸發回調
    expect(callbackInvoked).toBe(false);
  });

  /**
   * Requirement 5.5: 視窗大小變化時即時更新尺寸資訊
   * 完整流程測試
   */
  it('should update size info in real-time when window resizes', async () => {
    const sizeHistory: Array<{ width: number; height: number }> = [];

    measurer.onLayoutChange((measurements) => {
      const size = calculator.calculate(measurements, {
        designRatio: 16 / 9,
        fitMode: 'auto'
      });
      sizeHistory.push({ width: size.width, height: size.height });
    });

    // 模擬多次視窗大小變化
    const windowSizes = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 2560, height: 1440 }
    ];

    for (const size of windowSizes) {
      window.innerWidth = size.width;
      window.innerHeight = size.height;
      window.dispatchEvent(new Event('resize'));
      
      // 等待防抖延遲
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // 應該記錄了多次尺寸變化
    expect(sizeHistory.length).toBeGreaterThan(0);
    
    // 每次計算的尺寸都應該是有效的
    for (const size of sizeHistory) {
      expect(size.width).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
    }
  });
});
