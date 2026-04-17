import type {
  LayoutMeasurements,
  CalculationOptions,
  CalculatedSize
} from '../types/iframe-config';
import { memoize } from './performance';

/**
 * Size Calculator
 * 
 * 根據測量結果計算最佳 iframe 尺寸
 * 支援比例保持、自動適應和居中對齊
 */
export class SizeCalculator {
  // 緩存計算結果以優化性能
  private calculateMemoized: ReturnType<typeof memoize>;

  constructor() {
    // 使用記憶化優化重複計算
    this.calculateMemoized = memoize(
      this._calculateInternal.bind(this),
      (measurements, options) => {
        // 生成緩存鍵
        return JSON.stringify({
          viewport: measurements.viewport,
          sidebar: measurements.sidebar,
          header: measurements.header,
          footer: measurements.footer,
          padding: measurements.contentPadding,
          ratio: options.designRatio,
          fitMode: options.fitMode,
          margins: options.margins
        });
      }
    );
  }
  /**
   * 計算可用空間
   * 
   * 扣除固定元素（Sidebar、Header、Footer）和邊距後的實際可用空間
   * 
   * @param measurements - 佈局測量結果
   * @returns 可用寬度和高度
   */
  calculateAvailableSpace(measurements: LayoutMeasurements): { width: number; height: number } {
    // 計算可用寬度：視窗寬度 - Sidebar 寬度 - 左右邊距
    const availableWidth =
      measurements.viewport.width -
      measurements.sidebar.width -
      measurements.contentPadding.left -
      measurements.contentPadding.right;

    // 計算可用高度：視窗高度 - Header 高度 - Footer 高度 - 上下邊距
    const availableHeight =
      measurements.viewport.height -
      measurements.header.height -
      measurements.footer.height -
      measurements.contentPadding.top -
      measurements.contentPadding.bottom;

    // 確保返回非負值
    return {
      width: Math.max(0, availableWidth),
      height: Math.max(0, availableHeight)
    };
  }

  /**
   * 計算最佳 iframe 尺寸
   * 
   * 根據可用空間和設計比例，計算最佳的 iframe 尺寸
   * 支援三種適應模式：
   * - auto: 自動選擇最佳適應策略
   * - width-based: 以寬度為基準
   * - height-based: 以高度為基準
   * 
   * @param measurements - 佈局測量結果
   * @param options - 計算選項
   * @returns 計算出的尺寸和邊距
   */
  calculate(
    measurements: LayoutMeasurements,
    options: CalculationOptions
  ): CalculatedSize {
    // 使用記憶化版本以優化性能
    return this.calculateMemoized(measurements, options);
  }

  /**
   * 內部計算方法（被記憶化）
   */
  private _calculateInternal(
    measurements: LayoutMeasurements,
    options: CalculationOptions
  ): CalculatedSize {
    try {
      // 計算可用空間
      const availableSpace = this.calculateAvailableSpace(measurements);

      // 驗證可用空間
      if (availableSpace.width <= 0 || availableSpace.height <= 0) {
        throw new Error('Invalid available space: width or height is non-positive');
      }

      const ratio = options.designRatio;

      // 以寬度為基準計算
      const byWidth = {
        width: availableSpace.width,
        height: availableSpace.width / ratio
      };

      // 以高度為基準計算
      const byHeight = {
        width: availableSpace.height * ratio,
        height: availableSpace.height
      };

      // 選擇適合的方案
      let result: CalculatedSize;
      
      if (options.fitMode === 'width-based') {
        result = {
          ...byWidth,
          fitMode: 'width-based',
          margins: { top: 0, right: 0, bottom: 0, left: 0 },
          availableSpace
        };
      } else if (options.fitMode === 'height-based') {
        result = {
          ...byHeight,
          fitMode: 'height-based',
          margins: { top: 0, right: 0, bottom: 0, left: 0 },
          availableSpace
        };
      } else {
        // auto: 選擇不會超出可用空間的方案
        if (byWidth.height <= availableSpace.height) {
          result = {
            ...byWidth,
            fitMode: 'width-based',
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            availableSpace
          };
        } else {
          result = {
            ...byHeight,
            fitMode: 'height-based',
            margins: { top: 0, right: 0, bottom: 0, left: 0 },
            availableSpace
          };
        }
      }

      // 驗證結果
      if (result.width <= 0 || result.height <= 0) {
        throw new Error('Invalid calculation result: width or height is non-positive');
      }

      // 應用用戶自訂邊距或計算居中邊距
      if (options.margins) {
        result.margins = { ...options.margins };
      } else {
        result.margins = this.calculateCenterMargins(availableSpace, result);
      }

      return result;
    } catch (error) {
      console.error('Calculation error:', error);

      // 返回安全的預設值
      const availableSpace = this.calculateAvailableSpace(measurements);
      return {
        width: Math.min(1632, availableSpace.width),
        height: Math.min(918, availableSpace.height),
        fitMode: 'height-based',
        margins: { top: 0, right: 0, bottom: 0, left: 0 },
        availableSpace
      };
    }
  }

  /**
   * 計算居中邊距
   * 
   * 計算使內容在可用空間中水平和垂直居中的邊距
   * 
   * @param availableSpace - 可用空間
   * @param contentSize - 內容尺寸
   * @returns 上、右、下、左邊距
   */
  calculateCenterMargins(
    availableSpace: { width: number; height: number },
    contentSize: { width: number; height: number }
  ): { top: number; right: number; bottom: number; left: number } {
    // 計算水平邊距（左右相等）
    const horizontalMargin = (availableSpace.width - contentSize.width) / 2;

    // 計算垂直邊距（上下相等）
    const verticalMargin = (availableSpace.height - contentSize.height) / 2;

    return {
      top: Math.max(0, verticalMargin),
      right: Math.max(0, horizontalMargin),
      bottom: Math.max(0, verticalMargin),
      left: Math.max(0, horizontalMargin)
    };
  }

  /**
   * 清除緩存
   * 
   * 在需要強制重新計算時調用
   */
  clearCache(): void {
    this.calculateMemoized.cache.clear();
  }
}
