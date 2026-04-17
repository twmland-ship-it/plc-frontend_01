<template>
  <div class="template-manager">
    <!-- 範本管理標題 -->
    <div class="template-header">
      <h3>配置範本管理</h3>
      <a-space>
        <a-button 
          type="primary" 
          @click="showSaveDialog"
          :loading="saving"
        >
          <template #icon><SaveOutlined /></template>
          儲存為範本
        </a-button>
        <a-button 
          @click="showImportDialog"
          :loading="importing"
        >
          <template #icon><ImportOutlined /></template>
          匯入範本
        </a-button>
      </a-space>
    </div>

    <!-- 搜尋框 -->
    <div class="template-search">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜尋範本名稱或描述..."
        @search="handleSearch"
        allow-clear
      >
        <template #prefix><SearchOutlined /></template>
      </a-input-search>
    </div>

    <!-- 範本列表 -->
    <div class="template-list">
      <a-spin :spinning="loading">
        <a-empty v-if="filteredTemplates.length === 0" description="沒有找到範本" />
        
        <a-list
          v-else
          :data-source="filteredTemplates"
          item-layout="horizontal"
          class="template-row-list"
        >
          <template #renderItem="{ item }">
            <a-list-item
              :class="{ 'system-template-row': item.IsSystemTemplate }"
            >
              <template #actions>
                <a-dropdown :trigger="['click']" placement="bottomRight">
                  <a-button type="text" size="small">
                    <template #icon><MoreOutlined /></template>
                    操作
                    <DownOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="load" @click="handleLoad(item)">
                        <template #icon><DownloadOutlined /></template>
                        載入範本
                      </a-menu-item>
                      <a-menu-item key="update" @click="handleUpdate(item)">
                        <template #icon><EditOutlined /></template>
                        更新為當前狀態
                      </a-menu-item>
                      <a-menu-item key="export" @click="handleExport(item)">
                        <template #icon><ExportOutlined /></template>
                        匯出範本
                      </a-menu-item>
                      <a-menu-item key="duplicate" @click="handleDuplicate(item)">
                        <template #icon><CopyOutlined /></template>
                        複製範本
                      </a-menu-item>
                      <a-menu-divider v-if="!item.IsSystemTemplate" />
                      <a-menu-item v-if="!item.IsSystemTemplate" key="delete" @click="handleDelete(item)" class="danger-item">
                        <template #icon><DeleteOutlined /></template>
                        刪除範本
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>

              <a-list-item-meta>
                <template #title>
                  <div class="template-title">
                    <span class="template-name">{{ item.Name }}</span>
                    <a-tag v-if="item.IsSystemTemplate" color="blue" size="small">系統範本</a-tag>
                  </div>
                </template>
                
                <template #description>
                  <div class="template-meta">
                    <div class="template-description">
                      {{ item.Description || '無描述' }}
                    </div>
                    <div class="template-info">
                      <span class="info-item">
                        <CalendarOutlined />
                        {{ formatDate(item.CreatedAt) }}
                      </span>
                      <span v-if="item.Tags" class="info-item">
                        <TagsOutlined />
                        {{ item.Tags }}
                      </span>
                    </div>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </a-spin>
    </div>

    <!-- 儲存範本對話框 -->
    <a-modal
      :visible="saveDialogVisible"
      title="儲存為範本"
      @ok="handleSaveTemplate"
      @cancel="handleSaveCancel"
      :confirm-loading="saving"
    >
      <a-form :model="saveForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="範本名稱" required>
          <a-input
            v-model:value="saveForm.name"
            placeholder="請輸入範本名稱"
            :maxlength="100"
            show-count
          />
        </a-form-item>

        <a-form-item label="範本描述">
          <a-textarea
            v-model:value="saveForm.description"
            placeholder="請輸入範本描述（選填）"
            :rows="3"
            :maxlength="500"
            show-count
          />
        </a-form-item>

        <a-form-item label="標籤">
          <a-input
            v-model:value="saveForm.tags"
            placeholder="請輸入標籤，以逗號分隔（選填）"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 匯入範本對話框 -->
    <a-modal
      :visible="importDialogVisible"
      title="匯入範本"
      @ok="handleImportTemplate"
      @cancel="handleImportCancel"
      :confirm-loading="importing"
    >
      <a-upload-dragger
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        accept=".json"
        :max-count="1"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p class="ant-upload-text">點擊或拖曳檔案到此區域上傳</p>
        <p class="ant-upload-hint">
          支援 JSON 格式的範本檔案
        </p>
      </a-upload-dragger>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import { message, Modal } from 'ant-design-vue';
import {
  SaveOutlined,
  ImportOutlined,
  ExportOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CopyOutlined,
  SearchOutlined,
  CalendarOutlined,
  TagsOutlined,
  InboxOutlined,
  MoreOutlined,
  DownOutlined,
  EditOutlined
} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const props = defineProps({
  currentConfig: {
    type: Object,
    required: true
  },
  // 預設 true；在 GUI 設定頁會改為 false，避免後端尚未提供 API 時一直打 404
  autoLoad: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['load-template']);

const store = useStore();

// 狀態
const loading = ref(false);
const saving = ref(false);
const importing = ref(false);
const searchKeyword = ref('');
const templates = ref([]);

// 儲存對話框
const saveDialogVisible = ref(false);
const saveForm = ref({
  name: '',
  description: '',
  tags: ''
});

// 匯入對話框
const importDialogVisible = ref(false);
const fileList = ref([]);
const importedData = ref(null);

// 計算屬性：過濾後的範本列表
const filteredTemplates = computed(() => {
  if (!searchKeyword.value) {
    return templates.value;
  }

  const keyword = searchKeyword.value.toLowerCase();
  return templates.value.filter(template => {
    const name = (template.Name || '').toLowerCase();
    const description = (template.Description || '').toLowerCase();
    const tags = (template.Tags || '').toLowerCase();
    
    return name.includes(keyword) || 
           description.includes(keyword) || 
           tags.includes(keyword);
  });
});

// 載入範本列表
const loadTemplates = async () => {
  try {
    loading.value = true;
    templates.value = await store.dispatch('gui/fetchIframeTemplates', {
      includeSystem: true
    });
  } catch (error) {
    // 靜默處理所有錯誤，避免影響使用者體驗（目前範本功能尚未啟用）
    console.debug('載入範本列表失敗 (已忽略):', error);
    templates.value = [];
  } finally {
    loading.value = false;
  }
};

// 顯示儲存對話框
const showSaveDialog = () => {
  // 重置表單
  saveForm.value = {
    name: '',
    description: '',
    tags: ''
  };
  
  // 使用 nextTick 確保響應式更新
  nextTick(() => {
    saveDialogVisible.value = true;
  });
};

// 儲存範本
const handleSaveTemplate = async () => {
  if (!saveForm.value.name || !saveForm.value.name.trim()) {
    message.warning('請輸入範本名稱');
    return;
  }

  try {
    saving.value = true;

    const template = {
      name: saveForm.value.name.trim(),
      description: saveForm.value.description.trim(),
      config: props.currentConfig,
      tags: saveForm.value.tags.trim()
    };

    await store.dispatch('gui/saveIframeTemplate', template);
    
    message.success('範本儲存成功');
    saveDialogVisible.value = false;
    
    // 重新載入範本列表
    await loadTemplates();
  } catch (error) {
    console.error('❌ 儲存範本失敗:', error);
    message.error(`儲存範本失敗: ${error.message}`);
  } finally {
    saving.value = false;
  }
};

// 取消儲存
const handleSaveCancel = () => {
  saveDialogVisible.value = false;
};

// 更新範本
const handleUpdate = (template) => {
  if (template.IsSystemTemplate) {
    message.warning('系統範本無法更新');
    return;
  }
  
  Modal.confirm({
    title: '確認更新範本',
    content: `確定要用當前配置更新範本「${template.Name}」嗎？原有配置將被覆蓋。`,
    okText: '確定',
    cancelText: '取消',
    onOk: async () => {
      try {
        console.log('🔄 開始更新範本:', template.Name);
        console.log('📝 當前配置:', props.currentConfig);
        
        const updatedTemplate = {
          name: template.Name,
          description: template.Description,
          config: props.currentConfig,
          tags: template.Tags
        };

        await store.dispatch('gui/updateIframeTemplate', {
          id: template.Id,
          template: updatedTemplate
        });
        
        console.log('✅ 範本更新成功');
        message.success('範本更新成功');
        
        // 重新載入範本列表
        await loadTemplates();
        console.log('✅ 範本列表重新載入完成');
      } catch (error) {
        console.error('❌ 更新範本失敗:', error);
        message.error(`更新範本失敗: ${error.message}`);
      }
    }
  });
};

// 載入範本
const handleLoad = (template) => {
  if (!template || !template.ConfigJson) {
    message.error('範本資料不完整');
    return;
  }
  
  Modal.confirm({
    title: '確認載入範本',
    content: `確定要載入範本「${template.Name}」嗎？當前的配置將被覆蓋。`,
    okText: '確定',
    cancelText: '取消',
    onOk: async () => {
      try {
        console.log('📥 開始載入範本:', template.Name);
        console.log('📥 範本原始資料:', template);
        
        // 解析配置
        const config = JSON.parse(template.ConfigJson);
        console.log('📥 解析後的配置:', config);
        
        // 發送事件給父組件
        emit('load-template', {
          name: template.Name,
          config: config
        });
        
        console.log('✅ 範本載入事件已發送');
        message.success('範本載入成功');
      } catch (error) {
        console.error('❌ 載入範本失敗:', error);
        message.error(`載入範本失敗: ${error.message}`);
      }
    }
  });
};

// 匯出範本
const handleExport = async (template) => {
  try {
    const templateJson = await store.dispatch('gui/exportIframeTemplate', template.Id);
    
    // 創建下載連結
    const blob = new Blob([JSON.stringify(templateJson, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.Name}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    message.success('範本匯出成功');
  } catch (error) {
    console.error('❌ 匯出範本失敗:', error);
    message.error(`匯出範本失敗: ${error.message}`);
  }
};

// 複製範本
const handleDuplicate = (template) => {
  Modal.confirm({
    title: '確認複製範本',
    content: `確定要複製範本「${template.Name}」嗎？`,
    okText: '確定',
    cancelText: '取消',
    onOk: async () => {
      try {
        await store.dispatch('gui/duplicateIframeTemplate', {
          id: template.Id,
          newName: `${template.Name} (副本)`
        });
        
        message.success('範本複製成功');
        
        // 重新載入範本列表
        await loadTemplates();
      } catch (error) {
        message.error(`複製範本失敗: ${error.message}`);
      }
    }
  });
};

// 刪除範本
const handleDelete = (template) => {
  Modal.confirm({
    title: '確認刪除範本',
    content: `確定要刪除範本「${template.Name}」嗎？此操作無法復原。`,
    okText: '確定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        await store.dispatch('gui/deleteIframeTemplate', template.Id);
        
        message.success('範本刪除成功');
        
        // 重新載入範本列表
        await loadTemplates();
      } catch (error) {
        message.error(`刪除範本失敗: ${error.message}`);
      }
    }
  });
};

// 搜尋範本
const handleSearch = () => {
  // 搜尋邏輯已在 computed 中實現
};

// 顯示匯入對話框
const showImportDialog = () => {
  // 重置狀態
  fileList.value = [];
  importedData.value = null;
  
  // 使用 nextTick 確保響應式更新
  nextTick(() => {
    importDialogVisible.value = true;
  });
};

// 處理檔案上傳前
const handleBeforeUpload = (file) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      importedData.value = json;
      fileList.value = [file];
    } catch (error) {
      message.error('檔案格式不正確，請上傳有效的 JSON 檔案');
    }
  };
  
  reader.readAsText(file);
  
  // 阻止自動上傳
  return false;
};

// 匯入範本
const handleImportTemplate = async () => {
  if (!importedData.value) {
    message.warning('請先選擇要匯入的檔案');
    return;
  }

  try {
    importing.value = true;
    
    await store.dispatch('gui/importIframeTemplate', importedData.value);
    
    message.success('範本匯入成功');
    importDialogVisible.value = false;
    
    // 重新載入範本列表
    await loadTemplates();
  } catch (error) {
    console.error('❌ 匯入範本失敗:', error);
    message.error(`匯入範本失敗: ${error.message}`);
  } finally {
    importing.value = false;
  }
};

// 取消匯入
const handleImportCancel = () => {
  importDialogVisible.value = false;
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

// 組件掛載時載入範本列表
onMounted(() => {
  if (props.autoLoad) {
    loadTemplates();
  }
});

// 讓父層可在展開面板時手動觸發載入
defineExpose({
  loadTemplates
});
</script>

<style scoped lang="scss">
.template-manager {
  padding: 16px;
  background: #fff;
  border-radius: 4px;

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      flex: 1;
      min-width: 200px;
    }

    .ant-space {
      flex-shrink: 0;
    }
  }

  .template-search {
    margin-bottom: 20px;
  }

  .template-list {
    min-height: 300px;

    .template-row-list {
      .ant-list-item {
        padding: 16px 20px;
        border-bottom: 1px solid #f0f0f0;
        transition: all 0.3s;

        &:hover {
          background-color: #fafafa;
        }

        &.system-template-row {
          border-left: 3px solid #1890ff;
          background-color: #f6ffed;
        }

        &:last-child {
          border-bottom: none;
        }
      }

      .ant-list-item-action {
        margin-left: 16px;
        flex-shrink: 0;

        .ant-btn {
          margin: 0 4px;
        }
      }

      .ant-list-item-meta {
        flex: 1;
        min-width: 0;
      }

      .ant-list-item-meta-content {
        flex: 1;
        min-width: 0;
      }
    }

    .template-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;

      .template-name {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .template-meta {
      .template-description {
        color: #666;
        margin-bottom: 8px;
        line-height: 1.4;
        word-break: break-word;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .template-info {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

        .info-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999;
          font-size: 12px;
          white-space: nowrap;

          .anticon {
            font-size: 14px;
            flex-shrink: 0;
          }
        }
      }
    }
  }

  // 下拉選單樣式
  :deep(.ant-dropdown-menu) {
    .ant-dropdown-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;

      &.danger-item {
        color: #ff4d4f;

        &:hover {
          background-color: #fff2f0;
          color: #ff4d4f;
        }

        .anticon {
          color: #ff4d4f;
        }
      }

      .anticon {
        font-size: 14px;
        width: 14px;
        text-align: center;
      }
    }
  }
}
</style>
