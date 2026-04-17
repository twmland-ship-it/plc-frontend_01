/**
 * Unit Tests: Template Management Flow
 * 
 * Tests for task 12.5:
 * - 測試儲存範本流程
 * - 測試載入範本流程
 * - 測試刪除範本流程
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as iframeTemplateApi from '@/api/iframeTemplate';
import type { IframeConfig } from '@/types/iframe-config';

// Mock DataService
vi.mock('@/config/dataService/dataService', () => ({
  DataService: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

import { DataService } from '@/config/dataService/dataService';

describe('Template Management Flow', () => {
  // 測試用的範本配置
  const mockConfig: IframeConfig = {
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

  const mockTemplate = {
    Id: 1,
    Name: '測試範本',
    Description: '這是一個測試範本',
    ConfigJson: JSON.stringify(mockConfig),
    Tags: 'test,demo',
    IsSystemTemplate: false,
    CreatedAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    // 清除所有 mock
    vi.clearAllMocks();
  });

  describe('儲存範本流程 (Save Template Flow)', () => {
    /**
     * Requirement 9.1: 提供「儲存為範本」選項
     * Requirement 9.2: 要求輸入範本名稱和描述
     */
    it('should save a new template with name and description', async () => {
      // Arrange
      const template = {
        name: '測試範本',
        description: '這是一個測試範本',
        config: mockConfig,
        tags: 'test,demo'
      };

      const mockResponse = {
        data: {
          Detail: {
            Id: 1
          }
        }
      };

      (DataService.post as any).mockResolvedValue(mockResponse);

      // Act
      const templateId = await iframeTemplateApi.saveTemplate(template);

      // Assert
      expect(DataService.post).toHaveBeenCalledWith('/api/iframe-templates', {
        Name: '測試範本',
        Description: '這是一個測試範本',
        ConfigJson: JSON.stringify(mockConfig),
        Tags: 'test,demo',
        IsSystemTemplate: false
      });
      expect(templateId).toBe(1);
    });

    it('should trim whitespace from template name', async () => {
      // Arrange
      const template = {
        name: '  測試範本  ',
        description: '  描述  ',
        config: mockConfig,
        tags: '  tag1, tag2  '
      };

      const mockResponse = {
        data: {
          Detail: {
            Id: 2
          }
        }
      };

      (DataService.post as any).mockResolvedValue(mockResponse);

      // Act
      await iframeTemplateApi.saveTemplate(template);

      // Assert
      // Note: Only name is trimmed in the actual implementation
      expect(DataService.post).toHaveBeenCalledWith('/api/iframe-templates', {
        Name: '測試範本',
        Description: '  描述  ',
        ConfigJson: JSON.stringify(mockConfig),
        Tags: '  tag1, tag2  ',
        IsSystemTemplate: false
      });
    });

    it('should reject empty template name', async () => {
      // Arrange
      const template = {
        name: '',
        description: '描述',
        config: mockConfig,
        tags: ''
      };

      // Act & Assert
      await expect(iframeTemplateApi.saveTemplate(template))
        .rejects
        .toThrow('範本名稱不能為空');
    });

    it('should reject template name with only whitespace', async () => {
      // Arrange
      const template = {
        name: '   ',
        description: '描述',
        config: mockConfig,
        tags: ''
      };

      // Act & Assert
      await expect(iframeTemplateApi.saveTemplate(template))
        .rejects
        .toThrow('範本名稱不能為空');
    });

    it('should reject template without config', async () => {
      // Arrange
      const template = {
        name: '測試範本',
        description: '描述',
        config: null as any,
        tags: ''
      };

      // Act & Assert
      await expect(iframeTemplateApi.saveTemplate(template))
        .rejects
        .toThrow('配置資料不能為空');
    });

    it('should handle save errors gracefully', async () => {
      // Arrange
      const template = {
        name: '測試範本',
        description: '描述',
        config: mockConfig,
        tags: ''
      };

      (DataService.post as any).mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(iframeTemplateApi.saveTemplate(template))
        .rejects
        .toThrow('無法儲存範本');
    });

    it('should save template with optional fields empty', async () => {
      // Arrange
      const template = {
        name: '最小範本',
        description: '',
        config: mockConfig,
        tags: ''
      };

      const mockResponse = {
        data: {
          Detail: {
            Id: 3
          }
        }
      };

      (DataService.post as any).mockResolvedValue(mockResponse);

      // Act
      const templateId = await iframeTemplateApi.saveTemplate(template);

      // Assert
      expect(templateId).toBe(3);
      expect(DataService.post).toHaveBeenCalledWith('/api/iframe-templates', {
        Name: '最小範本',
        Description: '',
        ConfigJson: JSON.stringify(mockConfig),
        Tags: '',
        IsSystemTemplate: false
      });
    });

    it('should serialize complex config correctly', async () => {
      // Arrange
      const complexConfig: IframeConfig = {
        ...mockConfig,
        margins: {
          top: 10,
          right: 20,
          bottom: 30,
          left: 40
        }
      };

      const template = {
        name: '複雜範本',
        description: '包含複雜配置',
        config: complexConfig,
        tags: 'complex'
      };

      const mockResponse = {
        data: {
          Detail: {
            Id: 4
          }
        }
      };

      (DataService.post as any).mockResolvedValue(mockResponse);

      // Act
      await iframeTemplateApi.saveTemplate(template);

      // Assert
      const callArgs = (DataService.post as any).mock.calls[0][1];
      const savedConfig = JSON.parse(callArgs.ConfigJson);
      expect(savedConfig.margins).toEqual({
        top: 10,
        right: 20,
        bottom: 30,
        left: 40
      });
    });
  });

  describe('載入範本流程 (Load Template Flow)', () => {
    /**
     * Requirement 9.3: 顯示可用範本列表供選擇
     * Requirement 9.4: 套用該範本的所有參數設定
     */
    it('should list all available templates', async () => {
      // Arrange
      const mockTemplates = [
        mockTemplate,
        {
          ...mockTemplate,
          Id: 2,
          Name: '另一個範本'
        }
      ];

      const mockResponse = {
        data: {
          Detail: mockTemplates
        }
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      const templates = await iframeTemplateApi.listTemplates();

      // Assert
      expect(DataService.get).toHaveBeenCalledWith('/api/iframe-templates', {
        includeSystem: true,
        tags: undefined
      });
      expect(templates).toHaveLength(2);
      expect(templates[0].Name).toBe('測試範本');
      expect(templates[1].Name).toBe('另一個範本');
    });

    it('should filter templates by tags', async () => {
      // Arrange
      const mockResponse = {
        data: {
          Detail: [mockTemplate]
        }
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      await iframeTemplateApi.listTemplates({ tags: 'test' });

      // Assert
      expect(DataService.get).toHaveBeenCalledWith('/api/iframe-templates', {
        includeSystem: true,
        tags: 'test'
      });
    });

    it('should exclude system templates when requested', async () => {
      // Arrange
      const mockResponse = {
        data: {
          Detail: []
        }
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      await iframeTemplateApi.listTemplates({ includeSystem: false });

      // Assert
      expect(DataService.get).toHaveBeenCalledWith('/api/iframe-templates', {
        includeSystem: false,
        tags: undefined
      });
    });

    it('should get a single template by id', async () => {
      // Arrange
      const mockResponse = {
        data: {
          Detail: mockTemplate
        }
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      const template = await iframeTemplateApi.getTemplate(1);

      // Assert
      expect(DataService.get).toHaveBeenCalledWith('/api/iframe-templates/1');
      expect(template.Name).toBe('測試範本');
      expect(template.config).toEqual(mockConfig);
    });

    it('should parse ConfigJson when loading template', async () => {
      // Arrange
      const mockResponse = {
        data: {
          Detail: mockTemplate
        }
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      const template = await iframeTemplateApi.getTemplate(1);

      // Assert
      expect(template.config).toBeDefined();
      expect(template.config.displayMode).toBe('contain-center');
      expect(template.config.designResolution.width).toBe(1920);
      expect(template.config.designResolution.height).toBe(1080);
    });

    it('should handle load errors gracefully', async () => {
      // Arrange
      (DataService.get as any).mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(iframeTemplateApi.getTemplate(999))
        .rejects
        .toThrow('無法取得範本');
    });

    it('should handle empty template list', async () => {
      // Arrange
      const mockResponse = {
        data: {
          Detail: []
        }
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      const templates = await iframeTemplateApi.listTemplates();

      // Assert
      expect(templates).toEqual([]);
    });

    it('should handle missing Detail in response', async () => {
      // Arrange
      const mockResponse = {
        data: {}
      };

      (DataService.get as any).mockResolvedValue(mockResponse);

      // Act
      const templates = await iframeTemplateApi.listTemplates();

      // Assert
      expect(templates).toEqual([]);
    });
  });

  describe('刪除範本流程 (Delete Template Flow)', () => {
    /**
     * Requirement 9.5: 要求確認並從列表中移除
     */
    it('should delete a template by id', async () => {
      // Arrange
      (DataService.delete as any).mockResolvedValue({});

      // Act
      await iframeTemplateApi.deleteTemplate(1);

      // Assert
      expect(DataService.delete).toHaveBeenCalledWith('/api/iframe-templates/1');
    });

    it('should handle delete errors gracefully', async () => {
      // Arrange
      (DataService.delete as any).mockRejectedValue(new Error('Delete failed'));

      // Act & Assert
      await expect(iframeTemplateApi.deleteTemplate(1))
        .rejects
        .toThrow('無法刪除範本');
    });

    it('should handle deleting non-existent template', async () => {
      // Arrange
      (DataService.delete as any).mockRejectedValue(new Error('Template not found'));

      // Act & Assert
      await expect(iframeTemplateApi.deleteTemplate(999))
        .rejects
        .toThrow('無法刪除範本');
    });
  });

  describe('範本管理整合流程 (Integrated Template Management)', () => {
    /**
     * 測試完整的範本管理流程：儲存 → 列表 → 載入 → 刪除
     */
    it('should complete full template lifecycle', async () => {
      // 1. 儲存範本
      const saveResponse = {
        data: {
          Detail: {
            Id: 1
          }
        }
      };
      (DataService.post as any).mockResolvedValue(saveResponse);

      const template = {
        name: '生命週期測試',
        description: '測試完整流程',
        config: mockConfig,
        tags: 'lifecycle'
      };

      const templateId = await iframeTemplateApi.saveTemplate(template);
      expect(templateId).toBe(1);

      // 2. 列出範本（應該包含剛儲存的）
      const listResponse = {
        data: {
          Detail: [{
            Id: 1,
            Name: '生命週期測試',
            Description: '測試完整流程',
            ConfigJson: JSON.stringify(mockConfig),
            Tags: 'lifecycle',
            IsSystemTemplate: false,
            CreatedAt: '2024-01-01T00:00:00Z'
          }]
        }
      };
      (DataService.get as any).mockResolvedValue(listResponse);

      const templates = await iframeTemplateApi.listTemplates();
      expect(templates).toHaveLength(1);
      expect(templates[0].Name).toBe('生命週期測試');

      // 3. 載入範本
      const getResponse = {
        data: {
          Detail: {
            Id: 1,
            Name: '生命週期測試',
            Description: '測試完整流程',
            ConfigJson: JSON.stringify(mockConfig),
            Tags: 'lifecycle',
            IsSystemTemplate: false,
            CreatedAt: '2024-01-01T00:00:00Z'
          }
        }
      };
      (DataService.get as any).mockResolvedValue(getResponse);

      const loadedTemplate = await iframeTemplateApi.getTemplate(1);
      expect(loadedTemplate.config).toEqual(mockConfig);

      // 4. 刪除範本
      (DataService.delete as any).mockResolvedValue({});
      await iframeTemplateApi.deleteTemplate(1);
      expect(DataService.delete).toHaveBeenCalledWith('/api/iframe-templates/1');
    });

    it('should handle duplicate template names', async () => {
      // Arrange
      const template = {
        name: '重複名稱',
        description: '第一個',
        config: mockConfig,
        tags: ''
      };

      const mockResponse1 = {
        data: {
          Detail: {
            Id: 1
          }
        }
      };

      const mockResponse2 = {
        data: {
          Detail: {
            Id: 2
          }
        }
      };

      (DataService.post as any)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2);

      // Act
      const id1 = await iframeTemplateApi.saveTemplate(template);
      const id2 = await iframeTemplateApi.saveTemplate({
        ...template,
        description: '第二個'
      });

      // Assert
      expect(id1).toBe(1);
      expect(id2).toBe(2);
      expect(DataService.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('範本複製功能 (Template Duplication)', () => {
    /**
     * 測試範本複製功能
     */
    it('should duplicate an existing template', async () => {
      // Arrange - 先取得原範本
      const getResponse = {
        data: {
          Detail: mockTemplate
        }
      };
      (DataService.get as any).mockResolvedValue(getResponse);

      // Arrange - 儲存複製的範本
      const saveResponse = {
        data: {
          Detail: {
            Id: 2
          }
        }
      };
      (DataService.post as any).mockResolvedValue(saveResponse);

      // Act
      const newId = await iframeTemplateApi.duplicateTemplate(1);

      // Assert
      expect(DataService.get).toHaveBeenCalledWith('/api/iframe-templates/1');
      expect(DataService.post).toHaveBeenCalledWith('/api/iframe-templates', {
        Name: '測試範本 (副本)',
        Description: '這是一個測試範本',
        ConfigJson: JSON.stringify(mockConfig),
        Tags: 'test,demo',
        IsSystemTemplate: false
      });
      expect(newId).toBe(2);
    });

    it('should duplicate with custom name', async () => {
      // Arrange
      const getResponse = {
        data: {
          Detail: mockTemplate
        }
      };
      (DataService.get as any).mockResolvedValue(getResponse);

      const saveResponse = {
        data: {
          Detail: {
            Id: 3
          }
        }
      };
      (DataService.post as any).mockResolvedValue(saveResponse);

      // Act
      const newId = await iframeTemplateApi.duplicateTemplate(1, '自訂名稱');

      // Assert
      expect(DataService.post).toHaveBeenCalledWith('/api/iframe-templates', {
        Name: '自訂名稱',
        Description: '這是一個測試範本',
        ConfigJson: JSON.stringify(mockConfig),
        Tags: 'test,demo',
        IsSystemTemplate: false
      });
      expect(newId).toBe(3);
    });
  });

  describe('範本匯出匯入功能 (Template Export/Import)', () => {
    /**
     * 測試範本匯出和匯入功能
     */
    it('should export template as JSON', async () => {
      // Arrange
      const getResponse = {
        data: {
          Detail: mockTemplate
        }
      };
      (DataService.get as any).mockResolvedValue(getResponse);

      // Act
      const exportedJson = await iframeTemplateApi.exportTemplate(1);

      // Assert
      expect(exportedJson.name).toBe('測試範本');
      expect(exportedJson.description).toBe('這是一個測試範本');
      expect(exportedJson.config).toEqual(mockConfig);
      expect(exportedJson.tags).toBe('test,demo');
      expect(exportedJson.version).toBe('1.0');
      expect(exportedJson.exportedAt).toBeDefined();
    });

    it('should import template from JSON', async () => {
      // Arrange
      const importJson = {
        name: '匯入的範本',
        description: '從 JSON 匯入',
        config: mockConfig,
        tags: 'imported',
        version: '1.0',
        exportedAt: '2024-01-01T00:00:00Z'
      };

      const saveResponse = {
        data: {
          Detail: {
            Id: 5
          }
        }
      };
      (DataService.post as any).mockResolvedValue(saveResponse);

      // Act
      const newId = await iframeTemplateApi.importTemplate(importJson);

      // Assert
      expect(DataService.post).toHaveBeenCalledWith('/api/iframe-templates', {
        Name: '匯入的範本',
        Description: '從 JSON 匯入',
        ConfigJson: JSON.stringify(mockConfig),
        Tags: 'imported',
        IsSystemTemplate: false
      });
      expect(newId).toBe(5);
    });

    it('should reject invalid import JSON', async () => {
      // Arrange
      const invalidJson = {
        // 缺少 name 和 config
        description: '無效的 JSON'
      };

      // Act & Assert
      await expect(iframeTemplateApi.importTemplate(invalidJson as any))
        .rejects
        .toThrow('範本格式不正確');
    });
  });
});
