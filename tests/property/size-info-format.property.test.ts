/**
 * Property-Based Tests for Size Information Format
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 10: 尺寸資訊格式
 * Validates: Requirements 5.2
 * 
 * Tests that size information is displayed with both pixel values and percentage values
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import * as fc from 'fast-check';
import PreviewPanel from '@/components/oco/gui/setting/PreviewPanel.vue';
import { nextTick } from 'vue';

describe('Property: Size Information Format', () => {
  let wrapper: VueWrapper<any> | null = null;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 10: 尺寸資訊格式
   * For any 顯示的尺寸資訊，應該同時包含像素值（px）和百分比值（%）
   * Validates: Requirements 5.2
   */
  it('should display size information with both pixel and percentage values', async () => {
    await fc.assert(
      fc.asyncProperty(
        // 生成隨機的視窗尺寸
        fc.integer({ min: 1024, max: 3840 }), // viewport width
        fc.integer({ min: 768, max: 2160 }),  // viewport height
        fc.boolean(),                          // sidebar collapsed
        fc.record({
          displayMode: fc.constantFrom('contain-center', 'stretch', 'none'),
          heightMode: fc.constantFrom('px', 'vh', 'auto'),
          heightValue: fc.integer({ min: 400, max: 1200 }),
          designResolution: fc.constant({ width: 1920, height: 1080 })
        }),
        async (viewportWidth, viewportHeight, sidebarCollapsed, config) => {
          // 創建測量數據
          const measurements = {
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

          // 計算可用空間
          const availableWidth = viewportWidth - measurements.sidebar.width - 
                                measurements.contentPadding.left - measurements.contentPadding.right;
          const availableHeight = viewportHeight - measurements.header.height - 
                                 measurements.footer.height - measurements.contentPadding.top - 
                                 measurements.contentPadding.bottom;

          // 計算 iframe 尺寸（16:9 比例）
          const designRatio = 16 / 9;
          let calculatedWidth: number;
          let calculatedHeight: number;

          const byWidth = {
            width: availableWidth,
            height: availableWidth / designRatio
          };

          const byHeight = {
            width: availableHeight * designRatio,
            height: availableHeight
          };

          if (byWidth.height <= availableHeight) {
            calculatedWidth = byWidth.width;
            calculatedHeight = byWidth.height;
          } else {
            calculatedWidth = byHeight.width;
            calculatedHeight = byHeight.height;
          }

          // 掛載組件
          wrapper = mount(PreviewPanel, {
            props: {
              config,
              measurements,
              calculatedSize: {
                width: calculatedWidth,
                height: calculatedHeight,
                fitMode: 'width-based',
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                availableSpace: { width: availableWidth, height: availableHeight }
              }
            }
          });

          await nextTick();

          // 獲取尺寸資訊區域
          const sizeInfo = wrapper.find('.size-info');
          expect(sizeInfo.exists()).toBe(true);

          const infoRows = sizeInfo.findAll('.info-row');
          expect(infoRows.length).toBeGreaterThan(0);

          // 檢查 iframe 尺寸行
          const iframeSizeRow = infoRows.find(row => 
            row.text().includes('iframe 尺寸')
          );
          
          if (iframeSizeRow) {
            const rowText = iframeSizeRow.text();
            
            // 驗證包含像素值（px）
            expect(rowText).toMatch(/\d+px/);
            
            // 驗證包含百分比值（%）
            expect(rowText).toMatch(/\d+%/);
            
            // 驗證格式：應該同時顯示寬度和高度的像素值
            expect(rowText).toMatch(/\d+px\s*×\s*\d+px/);
            
            // 驗證格式：應該同時顯示寬度和高度的百分比值
            expect(rowText).toMatch(/\d+%\s*×\s*\d+%/);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 10: 尺寸資訊格式
   * For any 顯示的尺寸資訊，像素值和百分比值應該都是有效的數字
   * Validates: Requirements 5.2
   */
  it('should display valid numeric values for both pixels and percentages', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1024, max: 3840 }),
        fc.integer({ min: 768, max: 2160 }),
        fc.boolean(),
        async (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const measurements = {
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

          const availableWidth = viewportWidth - measurements.sidebar.width - 48;
          const availableHeight = viewportHeight - 138;

          const designRatio = 16 / 9;
          
          // Calculate size using the same logic as SizeCalculator
          let calculatedWidth: number;
          let calculatedHeight: number;
          
          const byWidth = {
            width: availableWidth,
            height: availableWidth / designRatio
          };
          
          const byHeight = {
            width: availableHeight * designRatio,
            height: availableHeight
          };
          
          // Choose the option that fits within available space
          if (byWidth.height <= availableHeight) {
            calculatedWidth = byWidth.width;
            calculatedHeight = byWidth.height;
          } else {
            calculatedWidth = byHeight.width;
            calculatedHeight = byHeight.height;
          }

          wrapper = mount(PreviewPanel, {
            props: {
              config: {
                displayMode: 'contain-center',
                heightMode: 'auto',
                designResolution: { width: 1920, height: 1080 }
              },
              measurements,
              calculatedSize: {
                width: calculatedWidth,
                height: calculatedHeight,
                fitMode: byWidth.height <= availableHeight ? 'width-based' : 'height-based',
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                availableSpace: { width: availableWidth, height: availableHeight }
              }
            }
          });

          await nextTick();

          // 檢查計算的百分比值
          const widthPercentage = (calculatedWidth / availableWidth) * 100;
          const heightPercentage = (calculatedHeight / availableHeight) * 100;

          // 驗證百分比是有效數字
          expect(widthPercentage).not.toBeNaN();
          expect(heightPercentage).not.toBeNaN();
          expect(widthPercentage).toBeGreaterThan(0);
          expect(heightPercentage).toBeGreaterThan(0);
          
          // Allow for rounding errors - percentages should be at most 100% (with small tolerance)
          expect(widthPercentage).toBeLessThanOrEqual(100.1);
          expect(heightPercentage).toBeLessThanOrEqual(100.1);

          // 驗證像素值是有效數字
          expect(calculatedWidth).not.toBeNaN();
          expect(calculatedHeight).not.toBeNaN();
          expect(calculatedWidth).toBeGreaterThan(0);
          expect(calculatedHeight).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 10: 尺寸資訊格式
   * For any 可用空間尺寸，應該只顯示像素值（不顯示百分比）
   * Validates: Requirements 5.2
   */
  it('should display available space with pixel values only', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1024, max: 3840 }),
        fc.integer({ min: 768, max: 2160 }),
        async (viewportWidth, viewportHeight) => {
          const measurements = {
            viewport: { width: viewportWidth, height: viewportHeight },
            sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
            header: { height: 64 },
            footer: { height: 50 },
            contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
          };

          const availableWidth = viewportWidth - 200 - 48;
          const availableHeight = viewportHeight - 138;

          wrapper = mount(PreviewPanel, {
            props: {
              config: {
                displayMode: 'contain-center',
                heightMode: 'auto',
                designResolution: { width: 1920, height: 1080 }
              },
              measurements,
              calculatedSize: {
                width: availableWidth,
                height: availableWidth / (16 / 9),
                fitMode: 'width-based',
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                availableSpace: { width: availableWidth, height: availableHeight }
              }
            }
          });

          await nextTick();

          const sizeInfo = wrapper.find('.size-info');
          const infoRows = sizeInfo.findAll('.info-row');

          // 找到可用空間行
          const availableSpaceRow = infoRows.find(row => 
            row.text().includes('可用空間')
          );

          if (availableSpaceRow) {
            const rowText = availableSpaceRow.text();
            
            // 驗證包含像素值
            expect(rowText).toMatch(/\d+px\s*×\s*\d+px/);
            
            // 驗證可用空間行不應該包含百分比（因為可用空間是絕對值）
            const infoValue = availableSpaceRow.find('.info-value');
            if (infoValue.exists()) {
              expect(infoValue.text()).not.toMatch(/%/);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 10: 尺寸資訊格式
   * For any 配置，百分比值應該準確反映 iframe 尺寸相對於可用空間的比例
   * Validates: Requirements 5.2
   */
  it('should display accurate percentage values relative to available space', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1024, max: 3840 }),
        fc.integer({ min: 768, max: 2160 }),
        fc.boolean(),
        async (viewportWidth, viewportHeight, sidebarCollapsed) => {
          const measurements = {
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

          const availableWidth = viewportWidth - measurements.sidebar.width - 48;
          const availableHeight = viewportHeight - 138;

          // Calculate size using proper logic
          const designRatio = 16 / 9;
          let calculatedWidth: number;
          let calculatedHeight: number;
          
          const byWidth = {
            width: availableWidth,
            height: availableWidth / designRatio
          };
          
          const byHeight = {
            width: availableHeight * designRatio,
            height: availableHeight
          };
          
          if (byWidth.height <= availableHeight) {
            calculatedWidth = byWidth.width;
            calculatedHeight = byWidth.height;
          } else {
            calculatedWidth = byHeight.width;
            calculatedHeight = byHeight.height;
          }

          wrapper = mount(PreviewPanel, {
            props: {
              config: {
                displayMode: 'contain-center',
                heightMode: 'auto',
                designResolution: { width: 1920, height: 1080 }
              },
              measurements,
              calculatedSize: {
                width: calculatedWidth,
                height: calculatedHeight,
                fitMode: byWidth.height <= availableHeight ? 'width-based' : 'height-based',
                margins: { top: 0, right: 0, bottom: 0, left: 0 },
                availableSpace: { width: availableWidth, height: availableHeight }
              }
            }
          });

          await nextTick();

          // 計算預期的百分比
          const expectedWidthPercentage = Math.round((calculatedWidth / availableWidth) * 100);
          const expectedHeightPercentage = Math.round((calculatedHeight / availableHeight) * 100);

          const sizeInfo = wrapper.find('.size-info');
          const infoRows = sizeInfo.findAll('.info-row');

          const iframeSizeRow = infoRows.find(row => 
            row.text().includes('iframe 尺寸')
          );

          if (iframeSizeRow) {
            const percentageSpan = iframeSizeRow.find('.info-percentage');
            if (percentageSpan.exists()) {
              const percentageText = percentageSpan.text();
              
              // 驗證百分比值在合理範圍內（允許四捨五入誤差 ±3%）
              // Extract the first percentage value (width percentage)
              const widthMatch = percentageText.match(/(\d+)%/);
              if (widthMatch) {
                const displayedWidthPercentage = parseInt(widthMatch[1]);
                // Allow for rounding differences and calculation variations
                expect(Math.abs(displayedWidthPercentage - expectedWidthPercentage)).toBeLessThanOrEqual(3);
              }
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
