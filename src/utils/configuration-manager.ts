/**
 * Configuration Manager
 * 
 * 管理 iframe 配置的驗證、儲存和載入
 * 整合 Vuex store 進行狀態管理
 */

import type { IframeConfig, ValidationResult, ValidationError, ValidationWarning } from '@/types/iframe-config';
import { DataService } from '@/config/dataService/dataService';

/**
 * 配置管理器類別
 */
export class ConfigurationManager {
  /**
   * 驗證配置
   * 
   * @param config - 要驗證的配置
   * @returns 驗證結果，包含錯誤和警告
   */
  validateConfig(config: IframeConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 驗證高度值
    if (config.heightMode === 'px' && config.heightValue !== undefined) {
      if (config.heightValue < 200) {
        errors.push({
          field: 'heightValue',
          message: '高度值不能小於 200px'
        });
      }
      if (config.heightValue > 2000) {
        errors.push({
          field: 'heightValue',
          message: '高度值不能大於 2000px'
        });
      }
      if (typeof window !== 'undefined' && config.heightValue > window.innerHeight) {
        warnings.push({
          field: 'heightValue',
          message: '高度值超過視窗高度，可能導致內容被裁切'
        });
      }
    }

    // 驗證 vh 模式的高度值
    if (config.heightMode === 'vh' && config.heightValue !== undefined) {
      if (config.heightValue < 10) {
        errors.push({
          field: 'heightValue',
          message: 'vh 值不能小於 10'
        });
      }
      if (config.heightValue > 100) {
        errors.push({
          field: 'heightValue',
          message: 'vh 值不能大於 100'
        });
      }
    }

    // 驗證 URL 格式
    if (config.viewUrl !== undefined && config.viewUrl !== null) {
      // 檢查是否為空字串或只有空白
      const trimmedViewUrl = config.viewUrl.trim();
      if (trimmedViewUrl === '') {
        errors.push({
          field: 'viewUrl',
          message: '網址不能為空'
        });
      } else {
        // 先檢查基本格式：必須以 http:// 或 https:// 開頭
        if (!trimmedViewUrl.startsWith('http://') && !trimmedViewUrl.startsWith('https://')) {
          errors.push({
            field: 'viewUrl',
            message: '網址必須使用 http:// 或 https:// 協議'
          });
        } else {
          // 檢查是否有三個斜線（http:/// 或 https:///）
          if (trimmedViewUrl.startsWith('http:///') || trimmedViewUrl.startsWith('https:///')) {
            errors.push({
              field: 'viewUrl',
              message: '網址格式不正確，請輸入完整的 URL（例如：http://192.168.1.100:2955）'
            });
          } else if (trimmedViewUrl.includes(' ')) {
            // 檢查 URL 中是否包含空格
            errors.push({
              field: 'viewUrl',
              message: '網址不能包含空格'
            });
          } else {
            try {
              const url = new URL(config.viewUrl);
              
              // 確保 URL 有正確的協議（http 或 https）
              if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                errors.push({
                  field: 'viewUrl',
                  message: '網址必須使用 http:// 或 https:// 協議'
                });
              }
              
              // 確保 URL 有主機名稱（不能為空）
              // hostname 可能是空字串，這是無效的
              if (!url.hostname || url.hostname.trim() === '') {
                errors.push({
                  field: 'viewUrl',
                  message: '網址格式不正確，請輸入完整的 URL（例如：http://192.168.1.100:2955）'
                });
              }
              
              // 檢查是否有無效的用戶信息格式（例如 http://@example.com）
              if (url.username === '' && config.viewUrl.includes('@')) {
                errors.push({
                  field: 'viewUrl',
                  message: '網址格式不正確，請輸入完整的 URL（例如：http://192.168.1.100:2955）'
                });
              }
              
              // 驗證端口號（如果有的話）
              if (url.port) {
                const portNum = parseInt(url.port, 10);
                if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                  errors.push({
                    field: 'viewUrl',
                    message: '網址的端口號無效，必須在 1-65535 之間'
                  });
                }
              }
            } catch (error) {
              // URL 構造失敗，表示格式完全錯誤
              errors.push({
                field: 'viewUrl',
                message: '網址格式不正確，請輸入完整的 URL（例如：http://192.168.1.100:2955）'
              });
            }
          }
        }
      }
    }

    // 驗證 serverUrl 格式
    if (config.serverUrl !== undefined && config.serverUrl !== null) {
      // 檢查是否為空字串或只有空白
      const trimmedServerUrl = config.serverUrl.trim();
      if (trimmedServerUrl === '') {
        errors.push({
          field: 'serverUrl',
          message: '伺服器網址不能為空'
        });
      } else {
        // 先檢查基本格式：必須以 http:// 或 https:// 開頭
        if (!trimmedServerUrl.startsWith('http://') && !trimmedServerUrl.startsWith('https://')) {
          errors.push({
            field: 'serverUrl',
            message: '伺服器網址必須使用 http:// 或 https:// 協議'
          });
        } else {
          // 檢查是否有三個斜線（http:/// 或 https:///）
          if (trimmedServerUrl.startsWith('http:///') || trimmedServerUrl.startsWith('https:///')) {
            errors.push({
              field: 'serverUrl',
              message: '伺服器網址格式不正確'
            });
          } else if (trimmedServerUrl.includes(' ')) {
            // 檢查 URL 中是否包含空格
            errors.push({
              field: 'serverUrl',
              message: '伺服器網址不能包含空格'
            });
          } else {
            try {
              const url = new URL(config.serverUrl);
              
              // 確保 URL 有正確的協議（http 或 https）
              if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                errors.push({
                  field: 'serverUrl',
                  message: '伺服器網址必須使用 http:// 或 https:// 協議'
                });
              }
              
              // 確保 URL 有主機名稱（不能為空）
              // hostname 可能是空字串，這是無效的
              if (!url.hostname || url.hostname.trim() === '') {
                errors.push({
                  field: 'serverUrl',
                  message: '伺服器網址格式不正確'
                });
              }
              
              // 檢查是否有無效的用戶信息格式（例如 http://@example.com）
              if (url.username === '' && config.serverUrl.includes('@')) {
                errors.push({
                  field: 'serverUrl',
                  message: '伺服器網址格式不正確'
                });
              }
              
              // 驗證端口號（如果有的話）
              if (url.port) {
                const portNum = parseInt(url.port, 10);
                if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
                  errors.push({
                    field: 'serverUrl',
                    message: '伺服器網址的端口號無效，必須在 1-65535 之間'
                  });
                }
              }
            } catch (error) {
              // URL 構造失敗，表示格式完全錯誤
              errors.push({
                field: 'serverUrl',
                message: '伺服器網址格式不正確'
              });
            }
          }
        }
      }
    }

    // 驗證邊距值
    if (config.margins) {
      const { top, right, bottom, left } = config.margins;
      if (top < 0 || right < 0 || bottom < 0 || left < 0) {
        errors.push({
          field: 'margins',
          message: '邊距值不能為負數'
        });
      }

      // 檢查邊距是否過大
      if (typeof window !== 'undefined') {
        const totalHorizontalMargin = left + right;
        const totalVerticalMargin = top + bottom;
        
        if (totalHorizontalMargin > window.innerWidth * 0.5) {
          warnings.push({
            field: 'margins',
            message: '左右邊距總和過大，可能導致內容顯示區域過小'
          });
        }
        
        if (totalVerticalMargin > window.innerHeight * 0.5) {
          warnings.push({
            field: 'margins',
            message: '上下邊距總和過大，可能導致內容顯示區域過小'
          });
        }
      }
    }

    // 驗證設計解析度
    if (config.designResolution) {
      const { width, height } = config.designResolution;
      
      if (width <= 0 || height <= 0) {
        errors.push({
          field: 'designResolution',
          message: '設計解析度的寬度和高度必須大於 0'
        });
      }
      
      if (width < 800 || height < 600) {
        warnings.push({
          field: 'designResolution',
          message: '設計解析度過小，建議至少使用 800x600'
        });
      }

      if (typeof window !== 'undefined') {
        if (width > window.innerWidth) {
          warnings.push({
            field: 'designResolution',
            message: '設計寬度超過視窗寬度，可能導致內容被裁切'
          });
        }
        
        if (height > window.innerHeight) {
          warnings.push({
            field: 'designResolution',
            message: '設計高度超過視窗高度，可能導致內容被裁切'
          });
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * 載入配置
   * 
   * @param id - 配置項目的 ID
   * @returns Promise<IframeConfig> - 載入的配置
   */
  async loadConfig(id: number): Promise<IframeConfig> {
    try {
      const response = await DataService.get('/api/System/GetPageItem', {
        ItemId: id
      });

      const pageItem = response.data.Detail;
      
      // 解析 JSON 配置
      let config: IframeConfig;
      if (pageItem.DataContentJson) {
        const parsed = JSON.parse(pageItem.DataContentJson);
        
        // 處理舊格式的配置（向後兼容）
        config = this.normalizeConfig(parsed);
      } else {
        // 如果沒有配置，返回預設值
        config = this.getDefaultConfig();
      }

      return config;
    } catch (error) {
      console.error('Failed to load config:', error);
      throw new Error(`無法載入配置: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  /**
   * 儲存配置
   * 
   * @param id - 配置項目的 ID
   * @param config - 要儲存的配置
   * @param name - 項目名稱
   * @param category - 項目類別
   */
  async saveConfig(
    id: number,
    config: IframeConfig,
    name: string,
    category: number
  ): Promise<void> {
    try {
      // 驗證配置
      const validation = this.validateConfig(config);
      if (!validation.valid) {
        const errorMessages = validation.errors.map(e => e.message).join('; ');
        throw new Error(`配置驗證失敗: ${errorMessages}`);
      }

      // 序列化配置
      const configJson = JSON.stringify(config);

      // 儲存到後端
      await DataService.post('/api/System/UpdatePageItem', {
        ItemId: id,
        Name: name,
        Category: category,
        DataContentJson: configJson,
        TagIdList: [] // iframe 配置不需要 tag
      });
    } catch (error) {
      console.error('Failed to save config:', error);
      throw new Error(`無法儲存配置: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }

  /**
   * 標準化配置格式（向後兼容）
   * 
   * @param parsed - 解析後的配置物件
   * @returns 標準化的配置
   */
  private normalizeConfig(parsed: any): IframeConfig {
    // 處理舊格式的配置
    const config: IframeConfig = {
      displayMode: parsed.displayMode || parsed.iframeFit || 'contain-center',
      heightMode: parsed.heightMode || parsed.iframeHeightMode || 'auto',
      heightValue: parsed.heightValue || parsed.iframeHeightValue,
      designResolution: parsed.designResolution || {
        width: 1920,
        height: 1080
      },
      margins: parsed.margins || {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      serverUrl: parsed.serverUrl || '',
      viewUrl: parsed.viewUrl || '',
      urlMode: parsed.urlMode || 'select'
    };

    return config;
  }

  /**
   * 取得預設配置
   * 
   * @returns 預設的 IframeConfig
   */
  private getDefaultConfig(): IframeConfig {
    return {
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
      serverUrl: '',
      viewUrl: '',
      urlMode: 'select'
    };
  }
}

// 匯出單例實例
export const configurationManager = new ConfigurationManager();
