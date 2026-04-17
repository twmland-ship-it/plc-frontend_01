import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigurationManager } from '@/utils/configuration-manager';
import type { IframeConfig } from '@/types/iframe-config';

describe('ConfigurationManager', () => {
  let manager: ConfigurationManager;

  beforeEach(() => {
    manager = new ConfigurationManager();
  });

  describe('validateConfig', () => {
    it('should validate a valid configuration', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'px',
        heightValue: 918,
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject height value less than 200px', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'px',
        heightValue: 100, // Too small
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('heightValue');
      expect(result.errors[0].message).toContain('不能小於 200px');
    });

    it('should reject height value greater than 2000px', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'px',
        heightValue: 2500, // Too large
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('heightValue');
      expect(result.errors[0].message).toContain('不能大於 2000px');
    });

    it('should reject invalid URL format', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'not-a-valid-url', // Invalid URL
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const urlError = result.errors.find(e => e.field === 'viewUrl');
      expect(urlError).toBeDefined();
      // 接受任何 URL 相關的錯誤訊息
      expect(urlError?.message).toMatch(/網址/);
    });

    it('should reject negative margin values', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: -10, // Negative margin
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const marginError = result.errors.find(e => e.field === 'margins');
      expect(marginError).toBeDefined();
      expect(marginError?.message).toContain('不能為負數');
    });

    it('should reject invalid design resolution', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        designResolution: {
          width: 0, // Invalid
          height: 0  // Invalid
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const resolutionError = result.errors.find(e => e.field === 'designResolution');
      expect(resolutionError).toBeDefined();
      expect(resolutionError?.message).toContain('必須大於 0');
    });

    it('should validate vh mode height values', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'vh',
        heightValue: 5, // Too small for vh
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const heightError = result.errors.find(e => e.field === 'heightValue');
      expect(heightError).toBeDefined();
      expect(heightError?.message).toContain('不能小於 10');
    });

    it('should accept valid vh mode height values', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'vh',
        heightValue: 80, // Valid vh value
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should handle auto height mode without height value', () => {
      const config: IframeConfig = {
        displayMode: 'contain-center',
        heightMode: 'auto',
        // No heightValue for auto mode
        designResolution: {
          width: 1920,
          height: 1080
        },
        margins: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        serverUrl: 'http://192.168.1.100:2955',
        viewUrl: 'http://192.168.1.100:2955/#/view?name=test',
        urlMode: 'select'
      };

      const result = manager.validateConfig(config);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
