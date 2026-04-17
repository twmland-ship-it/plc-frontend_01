/**
 * iframe 配置範本 API
 * 
 * 提供範本的 CRUD 操作：
 * - 儲存範本
 * - 載入範本
 * - 列出所有範本
 * - 刪除範本
 * 
 * 注意：目前使用 localStorage 暫存，後端 API 實作後可切換
 */
import {
  getTenantScopedItem,
  migrateLegacyStorageKeyToTenantScope,
  setTenantScopedItem,
} from "@/utility/tenantContext";

// localStorage key
const STORAGE_KEY = "iframe-templates";

// 從 localStorage 讀取範本列表
function getStoredTemplates() {
  try {
    migrateLegacyStorageKeyToTenantScope(STORAGE_KEY);
    const stored = getTenantScopedItem(STORAGE_KEY);
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

// 儲存範本列表到 localStorage
function setStoredTemplates(templates) {
  setTenantScopedItem(STORAGE_KEY, templates);
}

// 產生唯一 ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * 取得所有範本列表
 * 
 * @param {Object} options - 查詢選項
 * @param {boolean} options.includeSystem - 是否包含系統範本（預設: true）
 * @param {string} options.tags - 標籤過濾（選填）
 * @returns {Promise<Array>} 範本列表
 */
export async function listTemplates(options = {}) {
  console.log('📋 API: 開始取得範本列表...', options);
  const { tags } = options;
  
  let templates = getStoredTemplates();
  console.log(`📋 API: 從 localStorage 讀取到 ${templates.length} 個範本`);
  
  // 標籤過濾
  if (tags) {
    templates = templates.filter(t => t.Tags && t.Tags.includes(tags));
    console.log(`📋 API: 標籤過濾後剩餘 ${templates.length} 個範本`);
  }
  
  console.log('✅ API: 範本列表取得完成', templates);
  return templates;
}

/**
 * 取得單一範本
 * 
 * @param {number|string} id - 範本 ID
 * @returns {Promise<Object>} 範本物件
 */
export async function getTemplate(id) {
  const templates = getStoredTemplates();
  const template = templates.find(t => t.Id === id || t.Id === String(id));
  
  if (!template) {
    throw new Error('找不到範本');
  }
  
  // 解析 ConfigJson
  if (template.ConfigJson) {
    template.config = JSON.parse(template.ConfigJson);
  }
  
  return template;
}

/**
 * 儲存新範本
 * 
 * @param {Object} template - 範本資料
 * @param {string} template.name - 範本名稱（必填）
 * @param {string} template.description - 範本描述（選填）
 * @param {Object} template.config - iframe 配置物件（必填）
 * @param {string} template.tags - 標籤（選填，以逗號分隔）
 * @returns {Promise<string>} 新建範本的 ID
 */
export async function saveTemplate(template) {
  console.log('💾 API: 開始儲存範本...', template);
  
  // 驗證必填欄位
  if (!template.name || !template.name.trim()) {
    throw new Error('範本名稱不能為空');
  }
  
  if (!template.config) {
    throw new Error('配置資料不能為空');
  }

  const templates = getStoredTemplates();
  console.log(`💾 API: 目前有 ${templates.length} 個範本`);
  
  const newTemplate = {
    Id: generateId(),
    Name: template.name.trim(),
    Description: template.description || '',
    ConfigJson: JSON.stringify(template.config),
    Tags: template.tags || '',
    IsSystemTemplate: false,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  
  templates.push(newTemplate);
  setStoredTemplates(templates);
  
  console.log('✅ API: 範本儲存成功', newTemplate);
  console.log(`💾 API: 現在總共有 ${templates.length} 個範本`);
  
  return newTemplate.Id;
}

/**
 * 更新現有範本
 * 
 * @param {number|string} id - 範本 ID
 * @param {Object} template - 範本資料
 * @param {string} template.name - 範本名稱
 * @param {string} template.description - 範本描述
 * @param {Object} template.config - iframe 配置物件
 * @param {string} template.tags - 標籤
 * @returns {Promise<void>}
 */
export async function updateTemplate(id, template) {
  // 驗證必填欄位
  if (!template.name || !template.name.trim()) {
    throw new Error('範本名稱不能為空');
  }
  
  if (!template.config) {
    throw new Error('配置資料不能為空');
  }

  const templates = getStoredTemplates();
  const index = templates.findIndex(t => t.Id === id || t.Id === String(id));
  
  if (index === -1) {
    throw new Error('找不到要更新的範本');
  }
  
  templates[index] = {
    ...templates[index],
    Name: template.name.trim(),
    Description: template.description || '',
    ConfigJson: JSON.stringify(template.config),
    Tags: template.tags || '',
    UpdatedAt: new Date().toISOString()
  };
  
  setStoredTemplates(templates);
}

/**
 * 刪除範本
 * 
 * @param {number|string} id - 範本 ID
 * @returns {Promise<void>}
 */
export async function deleteTemplate(id) {
  const templates = getStoredTemplates();
  const filtered = templates.filter(t => t.Id !== id && t.Id !== String(id));
  
  if (filtered.length === templates.length) {
    throw new Error('找不到要刪除的範本');
  }
  
  setStoredTemplates(filtered);
}

/**
 * 複製範本
 * 
 * @param {number|string} id - 要複製的範本 ID
 * @param {string} newName - 新範本名稱（選填，預設為 "原名稱 (副本)"）
 * @returns {Promise<string>} 新範本的 ID
 */
export async function duplicateTemplate(id, newName = null) {
  // 先取得原範本
  const original = await getTemplate(id);
  
  if (!original) {
    throw new Error('找不到要複製的範本');
  }

  // 建立新範本
  const newTemplate = {
    name: newName || `${original.Name} (副本)`,
    description: original.Description,
    config: original.config,
    tags: original.Tags
  };

  return await saveTemplate(newTemplate);
}

/**
 * 搜尋範本
 * 
 * @param {string} keyword - 搜尋關鍵字（搜尋名稱和描述）
 * @returns {Promise<Array>} 符合的範本列表
 */
export async function searchTemplates(keyword) {
  const templates = getStoredTemplates();
  
  if (!keyword) {
    return templates;
  }
  
  const lowerKeyword = keyword.toLowerCase();
  return templates.filter(t => {
    const name = (t.Name || '').toLowerCase();
    const description = (t.Description || '').toLowerCase();
    const tags = (t.Tags || '').toLowerCase();
    return name.includes(lowerKeyword) || 
           description.includes(lowerKeyword) || 
           tags.includes(lowerKeyword);
  });
}

/**
 * 匯出範本為 JSON 檔案
 * 
 * @param {number|string} id - 範本 ID
 * @returns {Promise<Object>} 範本 JSON 物件
 */
export async function exportTemplate(id) {
  console.log('📤 API: 開始匯出範本，ID:', id);
  
  const template = await getTemplate(id);
  console.log('📤 API: 取得範本資料:', template);
  
  if (!template) {
    throw new Error('找不到要匯出的範本');
  }

  const exportData = {
    name: template.Name,
    description: template.Description,
    config: template.config,
    tags: template.Tags,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  console.log('✅ API: 範本匯出資料準備完成:', exportData);
  return exportData;
}

/**
 * 匯入範本從 JSON 物件
 * 
 * @param {Object} templateJson - 範本 JSON 物件
 * @returns {Promise<string>} 新建範本的 ID
 */
export async function importTemplate(templateJson) {
  // 驗證格式
  if (!templateJson.name || !templateJson.config) {
    throw new Error('範本格式不正確');
  }

  const template = {
    name: templateJson.name,
    description: templateJson.description || '',
    config: templateJson.config,
    tags: templateJson.tags || ''
  };

  return await saveTemplate(template);
}

export default {
  listTemplates,
  getTemplate,
  saveTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
  searchTemplates,
  exportTemplate,
  importTemplate
};
