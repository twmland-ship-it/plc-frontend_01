/**
 * Property-Based Tests for Template Application Completeness
 * 
 * Feature: iframe-auto-fit-enhancement
 * Property 19: 範本套用完整性
 * Validates: Requirements 9.4
 * 
 * 測試載入範本時所有參數正確套用
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import type { IframeConfig } from '../../src/types/iframe-config';

// Mock the DataService module with factory function
vi.mock('../../src/config/dataService/dataService', () => ({
  DataService: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}));

// Import template API after mocking
import { getTemplate, saveTemplate } from '../../src/api/iframeTemplate';
import { DataService } from '../../src/config/dataService/dataService';

// Get references to the mocked functions
const mockGet = vi.mocked(DataService.get);
const mockPost = vi.mocked(DataService.post);
const mockDelete = vi.mocked(DataService.delete);

describe('Property: Template Application Completeness', () => {
  let mockDatabase: Map<number, any>;
  let nextId: number;

  beforeEach(() => {
    // Reset mock database
    mockDatabase = new Map();
    nextId = 1;
    
    // Clear all mock calls
    vi.clearAllMocks();
    
    // Setup mock implementations
    mockPost.mockImplementation(async (url: string, data: any) => {
      if (url === '/api/iframe-templates') {
        const id = nextId++;
        const template = {
          Id: id,
          Name: data.Name,
          Description: data.Description,
          ConfigJson: data.ConfigJson,
          Tags: data.Tags,
          IsSystemTemplate: data.IsSystemTemplate || false,
          CreatedAt: new Date().toISOString()
        };
        mockDatabase.set(id, template);
        return { 
          data: { Detail: { Id: id } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any
        };
      }
      throw new Error('Unknown endpoint');
    });
    
    mockGet.mockImplementation(async (url: string) => {
      const match = url.match(/\/api\/iframe-templates\/(\d+)/);
      if (match) {
        const id = parseInt(match[1]);
        const template = mockDatabase.get(id);
        if (template) {
          return {
            data: { Detail: template },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
          };
        }
        throw new Error('Template not found');
      }
      throw new Error('Unknown endpoint');
    });
  });

  /**
   * Feature: iframe-auto-fit-enhancement, Property 19: 範本套用完整性
   * 
   * For any 儲存的範本，當用戶載入該範本時，
   * 所有配置參數（顯示模式、高度模式、高度值、邊距等）應該正確套用到表單中
   */
  it('should apply all configuration parameters when loading a template', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ maxLength: 200 }),
          config: fc.record({
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
          })
        }),
        async (template) => {
          // Save the template
          const templateId = await saveTemplate({
            name: template.name,
            description: template.description,
            config: template.config as IframeConfig,
            tags: ''
          });
          
          // Load the template
          const loadedTemplate = await getTemplate(templateId);
          
          // Verify all parameters are correctly applied
          expect(loadedTemplate).toBeDefined();
          expect(loadedTemplate.config).toBeDefined();
          
          // Verify basic settings
          expect(loadedTemplate.config.displayMode).toBe(template.config.displayMode);
          expect(loadedTemplate.config.heightMode).toBe(template.config.heightMode);
          expect(loadedTemplate.config.heightValue).toBe(template.config.heightValue);
          
          // Verify design resolution
          expect(loadedTemplate.config.designResolution).toEqual(template.config.designResolution);
          expect(loadedTemplate.config.designResolution.width).toBe(template.config.designResolution.width);
          expect(loadedTemplate.config.designResolution.height).toBe(template.config.designResolution.height);
          
          // Verify margins
          expect(loadedTemplate.config.margins).toEqual(template.config.margins);
          expect(loadedTemplate.config.margins?.top).toBe(template.config.margins.top);
          expect(loadedTemplate.config.margins?.right).toBe(template.config.margins.right);
          expect(loadedTemplate.config.margins?.bottom).toBe(template.config.margins.bottom);
          expect(loadedTemplate.config.margins?.left).toBe(template.config.margins.left);
          
          // Verify URL settings
          expect(loadedTemplate.config.serverUrl).toBe(template.config.serverUrl);
          expect(loadedTemplate.config.viewUrl).toBe(template.config.viewUrl);
          expect(loadedTemplate.config.urlMode).toBe(template.config.urlMode);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve all parameters including optional fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          description: fc.string({ maxLength: 200 }),
          tags: fc.string({ maxLength: 100 }),
          config: fc.record({
            displayMode: fc.constantFrom('contain-center', 'stretch', 'none'),
            heightMode: fc.constantFrom('px', 'vh', 'auto'),
            heightValue: fc.option(fc.integer({ min: 200, max: 2000 })),
            designResolution: fc.record({
              width: fc.integer({ min: 800, max: 3840 }),
              height: fc.integer({ min: 600, max: 2160 })
            }),
            margins: fc.option(fc.record({
              top: fc.integer({ min: 0, max: 100 }),
              right: fc.integer({ min: 0, max: 100 }),
              bottom: fc.integer({ min: 0, max: 100 }),
              left: fc.integer({ min: 0, max: 100 })
            })),
            serverUrl: fc.constant('http://localhost:3000'),
            viewUrl: fc.constant('http://localhost:3000/view'),
            urlMode: fc.constantFrom('select', 'custom'),
            // Optional compatibility fields
            iframeFit: fc.option(fc.constantFrom('contain-center', 'stretch', 'none')),
            iframeHeightMode: fc.option(fc.constantFrom('px', 'vh', 'auto')),
            iframeHeightValue: fc.option(fc.integer({ min: 200, max: 2000 }))
          })
        }),
        async (template) => {
          // Save the template
          const templateId = await saveTemplate({
            name: template.name,
            description: template.description,
            config: template.config as IframeConfig,
            tags: template.tags
          });
          
          // Load the template
          const loadedTemplate = await getTemplate(templateId);
          
          // Verify all parameters including optional ones
          expect(loadedTemplate.config.displayMode).toBe(template.config.displayMode);
          expect(loadedTemplate.config.heightMode).toBe(template.config.heightMode);
          
          // Check optional heightValue
          if (template.config.heightValue !== null) {
            expect(loadedTemplate.config.heightValue).toBe(template.config.heightValue);
          }
          
          // Check optional margins
          if (template.config.margins !== null) {
            expect(loadedTemplate.config.margins).toEqual(template.config.margins);
          }
          
          // Check optional compatibility fields
          if (template.config.iframeFit !== null) {
            expect(loadedTemplate.config.iframeFit).toBe(template.config.iframeFit);
          }
          
          if (template.config.iframeHeightMode !== null) {
            expect(loadedTemplate.config.iframeHeightMode).toBe(template.config.iframeHeightMode);
          }
          
          if (template.config.iframeHeightValue !== null) {
            expect(loadedTemplate.config.iframeHeightValue).toBe(template.config.iframeHeightValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain parameter integrity across multiple template operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            description: fc.string({ maxLength: 200 }),
            config: fc.record({
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
            })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        async (templates) => {
          // Save all templates
          const templateIds = await Promise.all(
            templates.map(template => 
              saveTemplate({
                name: template.name,
                description: template.description,
                config: template.config as IframeConfig,
                tags: ''
              })
            )
          );
          
          // Load all templates and verify
          for (let i = 0; i < templates.length; i++) {
            const loadedTemplate = await getTemplate(templateIds[i]);
            const originalTemplate = templates[i];
            
            // Verify each template maintains its own parameters
            expect(loadedTemplate.config.displayMode).toBe(originalTemplate.config.displayMode);
            expect(loadedTemplate.config.heightMode).toBe(originalTemplate.config.heightMode);
            expect(loadedTemplate.config.heightValue).toBe(originalTemplate.config.heightValue);
            expect(loadedTemplate.config.designResolution).toEqual(originalTemplate.config.designResolution);
            expect(loadedTemplate.config.margins).toEqual(originalTemplate.config.margins);
            expect(loadedTemplate.config.serverUrl).toBe(originalTemplate.config.serverUrl);
            expect(loadedTemplate.config.viewUrl).toBe(originalTemplate.config.viewUrl);
            expect(loadedTemplate.config.urlMode).toBe(originalTemplate.config.urlMode);
          }
        }
      ),
      { numRuns: 50 }
    );
  });

  it('should correctly apply nested object parameters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          config: fc.record({
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
            urlMode: fc.constantFrom('select', 'custom'),
            // Test nested iframe object
            iframe: fc.record({
              fit: fc.constantFrom('contain-center', 'stretch', 'none'),
              heightMode: fc.constantFrom('px', 'vh', 'auto'),
              heightValue: fc.integer({ min: 200, max: 2000 })
            })
          })
        }),
        async (template) => {
          // Save the template
          const templateId = await saveTemplate({
            name: template.name,
            description: '',
            config: template.config as IframeConfig,
            tags: ''
          });
          
          // Load the template
          const loadedTemplate = await getTemplate(templateId);
          
          // Verify nested objects are correctly preserved
          expect(loadedTemplate.config.designResolution).toEqual(template.config.designResolution);
          expect(loadedTemplate.config.margins).toEqual(template.config.margins);
          
          // Verify nested iframe object if present
          if (template.config.iframe) {
            expect(loadedTemplate.config.iframe).toBeDefined();
            expect(loadedTemplate.config.iframe?.fit).toBe(template.config.iframe.fit);
            expect(loadedTemplate.config.iframe?.heightMode).toBe(template.config.iframe.heightMode);
            expect(loadedTemplate.config.iframe?.heightValue).toBe(template.config.iframe.heightValue);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases in parameter values', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 50 }),
          config: fc.record({
            displayMode: fc.constantFrom('contain-center', 'stretch', 'none'),
            heightMode: fc.constantFrom('px', 'vh', 'auto'),
            // Test edge values
            heightValue: fc.oneof(
              fc.constant(200),  // minimum
              fc.constant(2000), // maximum
              fc.integer({ min: 200, max: 2000 })
            ),
            designResolution: fc.record({
              width: fc.oneof(
                fc.constant(800),  // minimum
                fc.constant(3840), // maximum
                fc.integer({ min: 800, max: 3840 })
              ),
              height: fc.oneof(
                fc.constant(600),  // minimum
                fc.constant(2160), // maximum
                fc.integer({ min: 600, max: 2160 })
              )
            }),
            margins: fc.record({
              top: fc.oneof(fc.constant(0), fc.constant(100), fc.integer({ min: 0, max: 100 })),
              right: fc.oneof(fc.constant(0), fc.constant(100), fc.integer({ min: 0, max: 100 })),
              bottom: fc.oneof(fc.constant(0), fc.constant(100), fc.integer({ min: 0, max: 100 })),
              left: fc.oneof(fc.constant(0), fc.constant(100), fc.integer({ min: 0, max: 100 }))
            }),
            serverUrl: fc.constant('http://localhost:3000'),
            viewUrl: fc.constant('http://localhost:3000/view'),
            urlMode: fc.constantFrom('select', 'custom')
          })
        }),
        async (template) => {
          // Save the template
          const templateId = await saveTemplate({
            name: template.name,
            description: '',
            config: template.config as IframeConfig,
            tags: ''
          });
          
          // Load the template
          const loadedTemplate = await getTemplate(templateId);
          
          // Verify edge values are preserved correctly
          expect(loadedTemplate.config.heightValue).toBe(template.config.heightValue);
          expect(loadedTemplate.config.designResolution.width).toBe(template.config.designResolution.width);
          expect(loadedTemplate.config.designResolution.height).toBe(template.config.designResolution.height);
          expect(loadedTemplate.config.margins?.top).toBe(template.config.margins.top);
          expect(loadedTemplate.config.margins?.right).toBe(template.config.margins.right);
          expect(loadedTemplate.config.margins?.bottom).toBe(template.config.margins.bottom);
          expect(loadedTemplate.config.margins?.left).toBe(template.config.margins.left);
        }
      ),
      { numRuns: 100 }
    );
  });
});
