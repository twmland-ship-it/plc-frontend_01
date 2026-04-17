/**
 * Property-Based Tests for Width Adjustment with Aspect Ratio Preservation
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 6: 比例保持下的寬度調整
 * Validates: Requirements 3.4
 * 
 * 測試寬度變化時高度按比例調整
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '../../src/utils/size-calculator';
import type { LayoutMeasurements } from '../../src/types/iframe-config';

describe('Property: Width Adjustment with Aspect Ratio Preservation', () => {
  const calculator = new SizeCalculator();

  /**
   * Feature: iframe-auto-fit-enhancement, Property 6: 比例保持下的寬度調整
   * 
   * For any 寬度調整，當啟用等比例模式時，高度應該按照設計比例相應調整
   * （新高度 = 新寬度 / 設計比例）
   * 
   * 這個屬性確保：
   * 1. 當可用寬度改變時（例如 Sidebar 收合/展開），高度會按比例調整
   * 2. 調整後的尺寸仍然保持原始的設計比例
   * 3. 無論寬度如何變化，寬高比始終等於設計比例
   */
  it('should adjust height proportionally when width changes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 3840 }), // 初始視窗寬度
        fc.integer({ min: 600, max: 2160 }),  // 視窗高度
        fc.integer({ min: -500, max: 500 }),  // 寬度變化量
        (initialWidth, viewportHeight, widthDelta) => {
          const designRatio = 16 / 9;

          // 初始測量
          const initialMeasurements: LayoutMeasurements = {
            viewport: { width: initialWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 調整後的測量（寬度變化）
          const adjustedWidth = Math.max(800, initialWidth + widthDelta);
          const adjustedMeasurements: LayoutMeasurements = {
            viewport: { width: adjustedWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 計算初始尺寸
          const initialResult = calculator.calculate(initialMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 計算調整後的尺寸
          const adjustedResult = calculator.calculate(adjustedMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證兩次計算都保持比例
          const initialRatio = initialResult.width / initialResult.height;
          const adjustedRatio = adjustedResult.width / adjustedResult.height;

          expect(Math.abs(initialRatio - designRatio)).toBeLessThan(0.01);
          expect(Math.abs(adjustedRatio - designRatio)).toBeLessThan(0.01);

          // 驗證高度按比例調整
          // 如果寬度增加，高度也應該增加（保持比例）
          // 如果寬度減少，高度也應該減少（保持比例）
          const expectedAdjustedHeight = adjustedResult.width / designRatio;
          expect(Math.abs(adjustedResult.height - expectedAdjustedHeight)).toBeLessThan(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：Sidebar 收合導致的寬度變化
   * 
   * 當 Sidebar 從展開變為收合時，可用寬度增加，
   * 高度應該按比例相應調整
   */
  it('should adjust height proportionally when sidebar collapses', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1200, max: 3840 }), // 視窗寬度（較大以確保有足夠空間）
        fc.integer({ min: 800, max: 2160 }),  // 視窗高度
        (viewportWidth, viewportHeight) => {
          const designRatio = 16 / 9;

          // Sidebar 展開狀態
          const expandedMeasurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // Sidebar 收合狀態（寬度從 200 變為 64，增加 136px 可用寬度）
          const collapsedMeasurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 64, collapsed: true, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const expandedResult = calculator.calculate(expandedMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const collapsedResult = calculator.calculate(collapsedMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證兩種狀態都保持比例
          const expandedRatio = expandedResult.width / expandedResult.height;
          const collapsedRatio = collapsedResult.width / collapsedResult.height;

          expect(Math.abs(expandedRatio - designRatio)).toBeLessThan(0.01);
          expect(Math.abs(collapsedRatio - designRatio)).toBeLessThan(0.01);

          // 驗證寬度增加時，高度也相應增加（如果不受高度限制）
          const availableSpaceExpanded = calculator.calculateAvailableSpace(expandedMeasurements);
          const availableSpaceCollapsed = calculator.calculateAvailableSpace(collapsedMeasurements);

          // 可用寬度應該增加了 136px (200 - 64)
          expect(availableSpaceCollapsed.width).toBe(availableSpaceExpanded.width + 136);

          // 如果是 width-based 模式，寬度增加應該導致高度增加
          if (expandedResult.fitMode === 'width-based' && collapsedResult.fitMode === 'width-based') {
            expect(collapsedResult.width).toBeGreaterThan(expandedResult.width);
            expect(collapsedResult.height).toBeGreaterThan(expandedResult.height);
            
            // 驗證高度增加的比例與寬度增加的比例一致
            const widthRatio = collapsedResult.width / expandedResult.width;
            const heightRatio = collapsedResult.height / expandedResult.height;
            expect(Math.abs(widthRatio - heightRatio)).toBeLessThan(0.01);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：視窗寬度調整時的比例保持
   * 
   * 當用戶調整瀏覽器視窗寬度時，iframe 尺寸應該按比例調整
   */
  it('should maintain aspect ratio when viewport width changes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),  // 初始視窗寬度
        fc.integer({ min: 600, max: 2160 }),  // 視窗高度
        fc.integer({ min: 800, max: 3840 }),  // 新的視窗寬度
        (initialWidth, viewportHeight, newWidth) => {
          const designRatio = 16 / 9;

          // 初始狀態
          const initialMeasurements: LayoutMeasurements = {
            viewport: { width: initialWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 視窗寬度改變後
          const newMeasurements: LayoutMeasurements = {
            viewport: { width: newWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const initialResult = calculator.calculate(initialMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const newResult = calculator.calculate(newMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證兩種狀態都保持 16:9 比例
          const initialRatio = initialResult.width / initialResult.height;
          const newRatio = newResult.width / newResult.height;

          expect(Math.abs(initialRatio - designRatio)).toBeLessThan(0.01);
          expect(Math.abs(newRatio - designRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：width-based 模式下的寬度調整
   * 
   * 當明確指定以寬度為基準時，寬度變化應該導致高度按比例調整
   */
  it('should adjust height proportionally in width-based mode', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 3840 }), // 視窗寬度
        fc.integer({ min: 1000, max: 2160 }), // 視窗高度（較大以確保不受高度限制）
        fc.boolean(), // Sidebar 狀態
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const designRatio = 16 / 9;

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
            designRatio: designRatio,
            fitMode: 'width-based'
          });

          // 驗證使用 width-based 模式
          expect(result.fitMode).toBe('width-based');

          // 驗證高度 = 寬度 / 設計比例
          const expectedHeight = result.width / designRatio;
          expect(Math.abs(result.height - expectedHeight)).toBeLessThan(1);

          // 驗證比例保持
          const actualRatio = result.width / result.height;
          expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：不同設計比例下的寬度調整
   * 
   * 測試系統能夠正確處理任意設計比例的寬度調整
   */
  it('should adjust height proportionally for any design ratio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 3840 }), // 視窗寬度
        fc.integer({ min: 800, max: 2160 }),  // 視窗高度
        fc.double({ min: 1.0, max: 2.5, noNaN: true }), // 設計比例
        fc.boolean(), // Sidebar 狀態
        (viewportWidth, viewportHeight, designRatio, sidebarCollapsed) => {
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
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證高度按比例計算
          const expectedHeight = result.width / designRatio;
          const actualHeight = result.height;

          // 允許 1px 的誤差（由於浮點數計算）
          expect(Math.abs(actualHeight - expectedHeight)).toBeLessThan(1);

          // 驗證比例保持
          const actualRatio = result.width / result.height;
          expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：連續寬度調整的比例一致性
   * 
   * 測試多次寬度調整後，比例仍然保持一致
   */
  it('should maintain consistent ratio across multiple width adjustments', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 800, max: 3840 }), { minLength: 3, maxLength: 10 }), // 一系列視窗寬度
        fc.integer({ min: 800, max: 2160 }), // 視窗高度
        (widthSequence, viewportHeight) => {
          const designRatio = 16 / 9;
          const results: number[] = [];

          // 對每個寬度進行計算
          widthSequence.forEach(width => {
            const measurements: LayoutMeasurements = {
              viewport: { width: width, height: viewportHeight },
              sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
              header: { height: 64 },
              footer: { height: 50 },
              contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
            };

            const result = calculator.calculate(measurements, {
              designRatio: designRatio,
              fitMode: 'auto'
            });

            const ratio = result.width / result.height;
            results.push(ratio);
          });

          // 驗證所有計算結果的比例都接近設計比例
          results.forEach(ratio => {
            expect(Math.abs(ratio - designRatio)).toBeLessThan(0.01);
          });

          // 驗證所有比例之間的差異很小（一致性）
          const maxRatio = Math.max(...results);
          const minRatio = Math.min(...results);
          expect(maxRatio - minRatio).toBeLessThan(0.02);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * 測試：極端寬度變化下的比例保持
   * 
   * 測試在極端的寬度變化情況下，比例仍然保持
   */
  it('should maintain ratio even with extreme width changes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { from: 800, to: 3840 },   // 從最小到最大
          { from: 3840, to: 800 },   // 從最大到最小
          { from: 1920, to: 1024 },  // 大幅縮小
          { from: 1024, to: 2560 }   // 大幅放大
        ),
        fc.integer({ min: 800, max: 2160 }), // 視窗高度
        (widthChange, viewportHeight) => {
          const designRatio = 16 / 9;

          // 初始寬度
          const initialMeasurements: LayoutMeasurements = {
            viewport: { width: widthChange.from, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          // 變化後的寬度
          const changedMeasurements: LayoutMeasurements = {
            viewport: { width: widthChange.to, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const initialResult = calculator.calculate(initialMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          const changedResult = calculator.calculate(changedMeasurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證兩種狀態都保持比例
          const initialRatio = initialResult.width / initialResult.height;
          const changedRatio = changedResult.width / changedResult.height;

          expect(Math.abs(initialRatio - designRatio)).toBeLessThan(0.01);
          expect(Math.abs(changedRatio - designRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：寬度調整的數學一致性
   * 
   * 驗證 height = width / designRatio 這個數學關係在寬度調整時始終成立
   */
  it('should satisfy mathematical relationship: height = width / designRatio', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),  // 視窗寬度
        fc.integer({ min: 600, max: 2160 }),  // 視窗高度
        fc.double({ min: 1.0, max: 2.5, noNaN: true }), // 設計比例
        (viewportWidth, viewportHeight, designRatio) => {
          const measurements: LayoutMeasurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const result = calculator.calculate(measurements, {
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證數學關係：height = width / designRatio
          const expectedHeight = result.width / designRatio;
          expect(Math.abs(result.height - expectedHeight)).toBeLessThan(1);

          // 或者反過來驗證：width = height * designRatio
          const expectedWidth = result.height * designRatio;
          expect(Math.abs(result.width - expectedWidth)).toBeLessThan(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * 測試：1920x1080 設計解析度的寬度調整
   * 
   * 針對需求中明確提到的 1920x1080 設計解析度進行寬度調整測試
   */
  it('should adjust height proportionally for 1920x1080 design resolution', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),  // 視窗寬度
        fc.integer({ min: 600, max: 2160 }),  // 視窗高度
        fc.boolean(), // Sidebar 狀態
        (viewportWidth, viewportHeight, sidebarCollapsed) => {
          // 1920x1080 的比例
          const designRatio = 1920 / 1080;

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
            designRatio: designRatio,
            fitMode: 'auto'
          });

          // 驗證高度按 1920x1080 的比例調整
          const expectedHeight = result.width / designRatio;
          expect(Math.abs(result.height - expectedHeight)).toBeLessThan(1);

          // 驗證比例接近 16:9
          const actualRatio = result.width / result.height;
          expect(Math.abs(actualRatio - (16 / 9))).toBeLessThan(0.01);
          expect(Math.abs(actualRatio - designRatio)).toBeLessThan(0.01);
        }
      ),
      { numRuns: 100 }
    );
  });
});
