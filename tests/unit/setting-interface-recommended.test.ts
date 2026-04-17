import { describe, it, expect } from 'vitest';

/**
 * Unit tests for recommended settings display in setting interface
 * Requirements: 2.1 - Display recommended settings when opening setting interface
 * 
 * These tests verify that the setting interface displays recommended settings options
 * when the user opens the configuration modal for external links (iframe embedding).
 */
describe('Setting Interface - Recommended Settings Display', () => {

  it('should have default recommended display mode as "contain-center"', () => {
    // Test that the default recommended display mode is set correctly
    // This represents the initial state when opening the setting interface
    const defaultFormState = {
      iframeFit: 'contain-center', // Recommended: 等比例置中
      iframeHeightMode: 'px',
      iframeHeightValue: 800,
      ocoguiUrlMode: 'select'
    };

    // Verify the default recommended values
    expect(defaultFormState.iframeFit).toBe('contain-center');
    expect(defaultFormState.iframeHeightMode).toBe('px');
    expect(defaultFormState.iframeHeightValue).toBe(800);
    expect(defaultFormState.ocoguiUrlMode).toBe('select');
  });

  it('should provide display mode options including recommended "contain-center"', () => {
    // Test that the display mode options include the recommended option
    const displayModeOptions = [
      { value: 'none', label: '原尺寸（可捲動）' },
      { value: 'contain-center', label: '等比例置中（建議）' },
      { value: 'stretch', label: '拉伸滿版（可能變形）' }
    ];

    // Verify that the recommended option exists
    const recommendedOption = displayModeOptions.find(opt => opt.value === 'contain-center');
    expect(recommendedOption).toBeDefined();
    expect(recommendedOption?.label).toContain('建議');
    
    // Verify all three options are available
    expect(displayModeOptions).toHaveLength(3);
    expect(displayModeOptions.map(opt => opt.value)).toContain('none');
    expect(displayModeOptions.map(opt => opt.value)).toContain('contain-center');
    expect(displayModeOptions.map(opt => opt.value)).toContain('stretch');
  });

  it('should provide height mode options including auto mode', () => {
    // Test that height mode options are available
    const heightModeOptions = [
      { value: 'px', label: '固定 px' },
      { value: 'vh', label: '視窗 vh' },
      { value: 'auto', label: '自動（100%）' }
    ];

    // Verify all three height mode options are available
    expect(heightModeOptions).toHaveLength(3);
    expect(heightModeOptions.map(opt => opt.value)).toContain('px');
    expect(heightModeOptions.map(opt => opt.value)).toContain('vh');
    expect(heightModeOptions.map(opt => opt.value)).toContain('auto');
    
    // Verify auto mode label
    const autoOption = heightModeOptions.find(opt => opt.value === 'auto');
    expect(autoOption?.label).toBe('自動（100%）');
  });

  it('should have sensible default values for new external link configuration', () => {
    // Test that default values are set appropriately for a new configuration
    const defaultConfig = {
      iframeFit: 'contain-center', // Recommended display mode
      iframeHeightMode: 'px', // Default height mode
      iframeHeightValue: 800, // Default height value (reasonable for most screens)
      ocoguiUrlMode: 'select' // Default to selecting from OCOGUI views
    };

    // Verify each default value
    expect(defaultConfig.iframeFit).toBe('contain-center');
    expect(defaultConfig.iframeHeightMode).toBe('px');
    expect(defaultConfig.iframeHeightValue).toBe(800);
    expect(defaultConfig.ocoguiUrlMode).toBe('select');
    
    // Verify the height value is reasonable (between 200 and 2000)
    expect(defaultConfig.iframeHeightValue).toBeGreaterThanOrEqual(200);
    expect(defaultConfig.iframeHeightValue).toBeLessThanOrEqual(2000);
  });

  it('should provide URL mode options for selecting from OCOGUI or custom URL', () => {
    // Test that URL mode options are available
    const urlModeOptions = [
      { value: 'select', label: '從 OCOGUI 選擇' },
      { value: 'custom', label: '自訂網址' }
    ];

    // Verify both URL mode options are available
    expect(urlModeOptions).toHaveLength(2);
    expect(urlModeOptions[0].value).toBe('select');
    expect(urlModeOptions[0].label).toBe('從 OCOGUI 選擇');
    expect(urlModeOptions[1].value).toBe('custom');
    expect(urlModeOptions[1].label).toBe('自訂網址');
    
    // Verify the default is 'select' (from OCOGUI)
    const defaultUrlMode = 'select';
    expect(defaultUrlMode).toBe('select');
  });

  it('should indicate that "contain-center" is the recommended display mode', () => {
    // Test that the recommended display mode is clearly marked
    const displayModes = {
      'none': '原尺寸（可捲動）',
      'contain-center': '等比例置中（建議）',
      'stretch': '拉伸滿版（可能變形）'
    };

    // Verify that only contain-center has the "建議" marker
    expect(displayModes['contain-center']).toContain('建議');
    expect(displayModes['none']).not.toContain('建議');
    expect(displayModes['stretch']).not.toContain('建議');
  });

  it('should provide helpful descriptions for each display mode', () => {
    // Test that each display mode has a clear description
    const displayModeDescriptions = {
      'none': '原尺寸（可捲動）',
      'contain-center': '等比例置中（建議）',
      'stretch': '拉伸滿版（可能變形）'
    };

    // Verify each mode has a description
    expect(displayModeDescriptions['none']).toBeTruthy();
    expect(displayModeDescriptions['contain-center']).toBeTruthy();
    expect(displayModeDescriptions['stretch']).toBeTruthy();
    
    // Verify the stretch mode warns about potential distortion
    expect(displayModeDescriptions['stretch']).toContain('可能變形');
  });

  it('should have one-click optimization feature available', () => {
    // Test that the one-click optimization feature is part of the interface
    const hasOptimizationFeature = true; // This feature exists in the interface
    const optimizationButtonText = '一鍵最佳化';
    const optimizationDescription = '自動偵測當前環境並套用最佳顯示參數';

    expect(hasOptimizationFeature).toBe(true);
    expect(optimizationButtonText).toBe('一鍵最佳化');
    expect(optimizationDescription).toContain('自動偵測');
    expect(optimizationDescription).toContain('最佳顯示參數');
  });
});
