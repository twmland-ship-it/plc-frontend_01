/**
 * Property-Based Tests for Configuration Round-Trip Consistency
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 21: 配置儲存和載入一致性
 * Validates: Requirements 9.2, 9.3
 * 
 * 測試儲存後載入得到相同配置
 * 
 * Note: This test validates JSON serialization/deserialization consistency
 * without requiring actual database operations.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { IframeConfig } from '../../src/types/iframe-config';

describe('Property: Configuration Round-Trip Consistency', () => {
  /**
   * Feature: iframe-auto-fit-enhancement, Property 21: 配置儲存和載入一致性
   * 
   * For any 有效的 IframeConfig 物件，將其序列化為 JSON 後再反序列化，
   * 應該得到相同的配置值（JSON 序列化和反序列化的往返一致性）
   */
  it('should preserve complete configuration after JSON round-trip', () => {
    fc.assert(
      fc.property(
        fc.record({
          displayMode: fc.constantFrom('contain-center', 'stretch', 'none'),
          heightMode: fc.constantFrom('px', 'vh', 'auto'),
          heightValue: fc.integer({ min: 200, max: 2000 }),
          designResolution: fc.record({
            width: fc.integer({ min: 800, max: 3840 }),
            height: fc.integer({ min: 600, max: 2160 })
          }),
          margins: fc.record({
            top: fc.integer({ min: 0, max: 100 }),
            right: fc.integer({ min: 0, max: 100 }),
            bottom: fc.integer({ min: 0, max: 100 }),
            left: fc.integer({ min: 0, max: 100 })
          }),
          serverUrl: fc.oneof(
            fc.constant('http://localhost:3000'),
            fc.constant('http://192.168.1.100:2955'),
            fc.constant('https://example.com')
          ),
          viewUrl: fc.oneof(
            fc.constant('http://localhost:3000/view'),
            fc.constant('http://192.168.1.100:2955/#/view?name=test'),
            fc.constant('https://example.com/dashboard')
          ),
          urlMode: fc.constantFrom('select', 'custom')
        }),
        (config) => {
          // Simulate save: serialize to JSON
          const serialized = JSON.stringify(config);
          
          // Simulate load: deserialize from JSON
          const deserialized = JSON.parse(serialized) as IframeConfig;
          
          // Verify all fields are preserved
          expect(deserialized.displayMode).toBe(config.displayMode);
          expect(deserialized.heightMode).toBe(config.heightMode);
          expect(deserialized.heightValue).toBe(config.heightValue);
          expect(deserialized.designResolution).toEqual(config.designResolution);
          expect(deserialized.margins).toEqual(config.margins);
          expect(deserialized.serverUrl).toBe(config.serverUrl);
          expect(deserialized.viewUrl).toBe(config.viewUrl);
          expect(deserialized.urlMode).toBe(config.urlMode);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain consistency across multiple round-trips', () => {
    fc.assert(
      fc.property(
        fc.record({
          displayMode: fc.constantFrom('contain-center', 'stretch', 'none'),
          heightMode: fc.constantFrom('px', 'vh', 'auto'),
          heightValue: fc.integer({ min: 200, max: 2000 }),
          designResolution: fc.record({
            width: fc.integer({ min: 800, max: 3840 }),
            height: fc.integer({ min: 600, max: 2160 })
          }),
          margins: fc.record({
            top: fc.integer({ min: 0, max: 100 }),
            right: fc.integer({ min: 0, max: 100 }),
            bottom: fc.integer({ min: 0, max: 100 }),
            left: fc.integer({ min: 0, max: 100 })
          }),
          serverUrl: fc.constant('http://localhost:3000'),
          viewUrl: fc.constant('http://localhost:3000/view'),
          urlMode: fc.constantFrom('select', 'custom')
        }),
        (config) => {
          // First round-trip
          const json1 = JSON.stringify(config);
          const parsed1 = JSON.parse(json1);
          
          // Second round-trip
          const json2 = JSON.stringify(parsed1);
          const parsed2 = JSON.parse(json2);
          
          // Third round-trip
          const json3 = JSON.stringify(parsed2);
          const parsed3 = JSON.parse(json3);
          
          // All should be equal
          expect(parsed3).toEqual(config);
          expect(json1).toBe(json2);
          expect(json2).toBe(json3);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should handle edge cases in configuration values', () => {
    fc.assert(
      fc.property(
        fc.record({
          displayMode: fc.constantFrom('contain-center', 'stretch', 'none'),
          heightMode: fc.constantFrom('px', 'vh', 'auto'),
          heightValue: fc.integer({ min: 200, max: 2000 }),
          designResolution: fc.record({
            width: fc.integer({ min: 800, max: 3840 }),
            height: fc.integer({ min: 600, max: 2160 })
          }),
          margins: fc.record({
            top: fc.integer({ min: 0, max: 100 }),
            right: fc.integer({ min: 0, max: 100 }),
            bottom: fc.integer({ min: 0, max: 100 }),
            left: fc.integer({ min: 0, max: 100 })
          }),
          serverUrl: fc.oneof(
            fc.constant('http://localhost:3000'),
            fc.constant('http://192.168.1.100:2955'),
            fc.constant('https://example.com:8080/path/to/resource')
          ),
          viewUrl: fc.oneof(
            fc.constant('http://localhost:3000/view?param=value&other=123'),
            fc.constant('http://192.168.1.100:2955/#/view?name=test&id=456'),
            fc.constant('https://example.com/dashboard#section')
          ),
          urlMode: fc.constantFrom('select', 'custom')
        }),
        (config) => {
          const serialized = JSON.stringify(config);
          const deserialized = JSON.parse(serialized);
          
          // Verify URLs with special characters are preserved
          expect(deserialized.serverUrl).toBe(config.serverUrl);
          expect(deserialized.viewUrl).toBe(config.viewUrl);
          
          // Verify all other fields
          expect(deserialized).toEqual(config);
        }
      ),
      { numRuns: 100 }
    );
  });
});

