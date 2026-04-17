<template>
  <div>
    <!-- 動態 Modal：類型 5 使用大視窗，其他使用預設小視窗 -->
    <sdModal
      v-if="modal"
      :title="formState.title"
      :visible="modal"
      :onCancel="closeModal"
      :width="formState.type === 5 ? 1600 : 620"
      :wrapClassName="formState.type === 5 ? 'gui-setting-wide-modal' : ''"
      :centered="formState.type !== 5"
    >
      <ModalWrap>
        <!-- 情境一：非外部連結 (維持舊版簡潔介面) -->
        <a-form
          v-if="formState.type !== 5"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
          labelAlign="left"
          @finish="submit"
        >
          <a-form-item v-if="!formState.id" label="類型" name="type">
            <a-select v-model:value="formState.type">
              <a-select-option v-for="v in typeOptions" :key="v.Id">{{
                v.Name
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="名稱" name="name">
            <a-input v-model:value="formState.name" placeholder="名稱">
            </a-input>
          </a-form-item>
          <!-- 其他類型可能有 link 欄位 -->
          <a-form-item v-if="formState.type !== 5 && formState.type !== 2 && formState.type !== 3" label="連結" name="link">
             <a-input v-model:value="formState.link" placeholder="連結"></a-input>
          </a-form-item>

          <a-row>
            <a-col
              :lg="{ span: 16, offset: 8 }"
              :md="{ span: 15, offset: 9 }"
              :xs="{ span: 24, offset: 0 }"
            >
              <div style="margin-top: 20px;">
                <sdButton
                  v-permission:disable="formState.id ? 'update' : 'create'"
                  class="act-btn"
                  type="primary"
                  html-type="submit"
                  :disabled="loading"
                >
                  儲存
                  <a-spin v-show="loading" size="small" />
                </sdButton>
                <sdButton class="act-btn" type="light" @click="closeModal">
                  取消
                </sdButton>
              </div>
            </a-col>
          </a-row>
        </a-form>

        <!-- 情境二：外部連結 (使用新版雙欄介面 - Tab 版 - 緊湊優化) -->
        <div v-else class="wide-modal-wrapper">
          <a-row :gutter="0" style="height: 100%" :class="{ 'preview-centered': sidebarCollapsed }">
            <!-- 左側：設定表單 (Tab 版) - 可收合 -->
            <a-col v-show="!sidebarCollapsed" :span="8" class="setting-sidebar" style="height: 100%; transition: all 0.3s ease;">
              <div v-show="!sidebarCollapsed" class="sidebar-content">
                <a-form
                  layout="vertical"
                  :model="formState"
                  :rules="rules"
                  @finish="submit"
                  class="compact-form"
                  style="height: 100%; display: flex; flex-direction: column;"
                >
                  <a-tabs default-active-key="1" :animated="false" class="custom-tabs" style="flex: 1;">
                    
                    <!-- Tab 1: 基本與連結 -->
                    <a-tab-pane key="1" tab="基本設定">
                      <div class="tab-scroll-content">
                        <!-- 1. 基本設定 -->
                        <div class="setting-section compact">
                          <div class="section-title small">
                            <unicon name="edit-alt" width="16" class="icon-accent" /> 基本資訊
                          </div>
                          <a-row :gutter="12">
                            <a-col :span="10">
                              <a-form-item v-if="!formState.id" label="類型" name="type" class="compact-item">
                                <a-select v-model:value="formState.type" disabled class="modern-select">
                                  <a-select-option v-for="v in typeOptions" :key="v.Id">{{ v.Name }}</a-select-option>
                                </a-select>
                              </a-form-item>
                            </a-col>
                            <a-col :span="!formState.id ? 14 : 24">
                              <a-form-item label="頁面名稱" name="name" class="compact-item">
                                <a-input v-model:value="formState.name" placeholder="請輸入名稱" />
                              </a-form-item>
                            </a-col>
                          </a-row>
                        </div>

                        <!-- 2. 連結來源 (緊湊版) -->
                        <div class="setting-section compact">
                          <div class="section-title small">
                            <unicon name="link" width="16" class="icon-accent" /> 連結來源
                          </div>
                          
                          <a-row :gutter="12" align="bottom">
                             <a-col :span="14">
                               <a-form-item label="OCOGUI 伺服器位址" class="compact-item">
                                <a-input v-model:value="ocoguiServerUrl" placeholder="例：http://192.168.1.100:2955">
                                  <template #prefix><unicon name="server" width="14" fill="#999" /></template>
                                </a-input>
                              </a-form-item>
                             </a-col>
                             <a-col :span="10">
                                <a-form-item label="連結模式" class="compact-item">
                                  <a-radio-group v-model:value="formState.ocoguiUrlMode" button-style="solid" size="default" style="width: 100%; display: flex;">
                                    <a-radio-button value="select" style="flex: 1; text-align: center;">選擇</a-radio-button>
                                    <a-radio-button value="custom" style="flex: 1; text-align: center;">自訂</a-radio-button>
                                  </a-radio-group>
                                </a-form-item>
                             </a-col>
                          </a-row>

                          <div v-if="formState.ocoguiUrlMode === 'select'" class="view-select-wrapper" style="margin-top: 12px;">
                            <a-form-item label="選擇視圖" class="compact-item" style="margin-bottom: 0;">
                              <div style="display: flex; gap: 8px;">
                                <a-select
                                  v-model:value="formState.ocoguiView"
                                  placeholder="請搜尋或選擇視圖"
                                  :loading="ocoguiLoading"
                                  show-search
                                  allow-clear
                                  style="flex: 1"
                                  :filter-option="(input, option) => option.label?.toLowerCase().includes(input.toLowerCase())"
                                >
                                  <template #suffixIcon><unicon name="angle-down" width="14"/></template>
                                  <a-select-option v-for="view in ocoguiViews" :key="view.id" :value="view.url" :label="view.name">
                                    {{ view.name }}
                                  </a-select-option>
                                </a-select>
                                <a-tooltip title="重新整理列表">
                                  <a-button @click="loadOcoguiViews" :loading="ocoguiLoading" class="refresh-btn">
                                    <unicon name="sync" width="14" fill="#666"/>
                                  </a-button>
                                </a-tooltip>
                              </div>
                            </a-form-item>
                          </div>

                          <a-form-item v-else label="完整連結 URL" class="compact-item" style="margin-top: 12px;">
                            <a-input v-model:value="formState.ocoguiCustomUrl" placeholder="http://...">
                              <template #prefix><unicon name="globe" width="14" fill="#999" /></template>
                            </a-input>
                          </a-form-item>

                          <a-alert
                            v-if="viewerWarningMessage"
                            :type="currentOcoguiTarget.isLegacy ? 'warning' : 'info'"
                            show-icon
                            style="margin-top: 12px;"
                            :message="viewerWarningMessage"
                            description="plc-frontend 正式只支援純 Viewer：`#/view?name=...`。儲存時會自動正規化。"
                          />
                        </div>
                      </div>
                    </a-tab-pane>

                    <!-- Tab 2: 顯示設定 (緊湊優化) -->
                    <a-tab-pane key="2" tab="顯示設定">
                      <div class="tab-scroll-content">
                        <!-- 3. 顯示設定 -->
                        <div class="setting-section no-border compact">
                          <div class="section-title small">
                            <unicon name="desktop" width="16" class="icon-accent" /> 顯示設定
                          </div>
                          <a-row :gutter="12">
                            <a-col :span="12">
                              <a-form-item label="縮放模式" class="compact-item">
                                <a-select v-model:value="formState.iframeFit">
                                  <a-select-option value="contain-center">等比置中</a-select-option>
                                  <a-select-option value="stretch">拉伸滿版</a-select-option>
                                  <a-select-option value="none">原尺寸</a-select-option>
                                </a-select>
                              </a-form-item>
                            </a-col>
                          </a-row>
                          
                          <!-- 高度模式已隱藏，預設為 auto (100%) -->

                          <!-- 進階：設計解析度 -->
                          <div class="subsection-title" style="margin-top: 20px; margin-bottom: 12px; font-weight: 600; color: #555; font-size: 13px;">
                            <span style="border-left: 3px solid #1890ff; padding-left: 8px;">設計解析度與邊距</span>
                          </div>
                          
                          <a-row :gutter="12">
                            <a-col :span="12">
                              <a-form-item label="設計寬度" class="compact-item">
                                <a-input-number v-model:value="formState.designWidth" style="width: 100%" />
                              </a-form-item>
                            </a-col>
                            <a-col :span="12">
                              <a-form-item label="設計高度" class="compact-item">
                                <a-input-number v-model:value="formState.designHeight" style="width: 100%" />
                              </a-form-item>
                            </a-col>
                          </a-row>
                          
                          <div class="margin-label" style="font-size: 12px; margin: 8px 0;">邊距微調 (px)</div>
                          <div class="margin-grid compact-grid">
                            <a-form-item label="上" class="compact-item"><a-input-number v-model:value="formState.marginTop" size="small" class="margin-input" /></a-form-item>
                            <a-form-item label="右" class="compact-item"><a-input-number v-model:value="formState.marginRight" size="small" class="margin-input" /></a-form-item>
                            <a-form-item label="下" class="compact-item"><a-input-number v-model:value="formState.marginBottom" size="small" class="margin-input" /></a-form-item>
                            <a-form-item label="左" class="compact-item"><a-input-number v-model:value="formState.marginLeft" size="small" class="margin-input" /></a-form-item>
                          </div>
                        </div>
                      </div>
                    </a-tab-pane>

                    <!-- Tab 3: 範本管理 (已隱藏) -->
                    <a-tab-pane v-if="false" key="3" tab="範本管理">
                       <div class="tab-scroll-content">
                        <div class="setting-section no-border">
                          <TemplateManager
                            :current-config="getCurrentConfig()"
                            @load-template="handleLoadTemplate"
                          />
                        </div>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </a-form>
              </div>
              
              <!-- 底部固定按鈕區 -->
              <div v-show="!sidebarCollapsed" class="sidebar-footer">
                <a-button key="back" @click="closeModal" size="middle" style="margin-right: 12px; min-width: 80px;">取消</a-button>
                <a-button key="submit" type="primary" size="middle" :loading="loading" @click="submit" style="min-width: 80px;">儲存設定</a-button>
              </div>
            </a-col>

            <!-- 右側：即時預覽 - 動態寬度 -->
            <a-col :span="sidebarCollapsed ? 24 : 16" class="preview-column" :class="{ 'preview-full': sidebarCollapsed }" style="transition: all 0.3s ease;">
              <div class="preview-wrapper">
                <div class="preview-header">
                  <div style="display: flex; align-items: center;">
                    <!-- 收合/展開按鈕 -->
                    <a-button 
                      type="text" 
                      size="small" 
                      @click="sidebarCollapsed = !sidebarCollapsed" 
                      :title="sidebarCollapsed ? '展開設定面板' : '收合設定面板'"
                      style="margin-right: 8px; padding: 4px 8px;"
                    >
                      <unicon :name="sidebarCollapsed ? 'angle-right' : 'angle-left'" width="18" fill="#666"/>
                    </a-button>
                    <unicon name="eye" width="20" fill="#1890ff" style="margin-right: 8px;"/>
                    <span style="font-weight: 600; color: #333; font-size: 16px;">即時預覽效果</span>
                  </div>
                  <!-- 右側資訊 -->
                  <div class="preview-header-info">
                    <!-- 收合時顯示儲存按鈕 -->
                    <a-button 
                      v-if="sidebarCollapsed" 
                      type="primary" 
                      size="small" 
                      :loading="loading" 
                      @click="submit"
                      style="margin-right: 12px;"
                    >
                      儲存設定
                    </a-button>
                    <span class="info-badge">
                      設計解析度: {{ formState.designWidth }} x {{ formState.designHeight }}
                    </span>
                  </div>
                </div>
                <div class="preview-content">
                  <PreviewPanel
                    :url="previewUrl"
                    :config="{
                      iframeFit: formState.iframeFit,
                      iframeHeightMode: formState.iframeHeightMode,
                      iframeHeightValue: formState.iframeHeightValue,
                      marginTop: formState.marginTop,
                      marginBottom: formState.marginBottom,
                      marginLeft: formState.marginLeft,
                      marginRight: formState.marginRight,
                      designWidth: formState.designWidth,
                      designHeight: formState.designHeight,
                      iframeWidth: formState.iframeWidth,
                      iframeHeight: formState.iframeHeight,
                      iframeX: formState.iframeX,
                      iframeY: formState.iframeY
                    }"
                    :designResolution="{ width: formState.designWidth, height: formState.designHeight }"
                    @update-config="handlePreviewUpdate"
                  />
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

      </ModalWrap>
    </sdModal>
    <sdPageHeader
      :title="title"
      class="ninjadash-page-header-main"
      :routes="routes"
    />
    <Main>
      <a-spin v-if="loading"></a-spin>
      <DataTables
        v-if="!loading"
        :filterOption="true"
        :filterOnchange="true"
        :tableData="data"
        :columns="column"
        :rowSelection="false"
        :addOption="permission.create"
        :editOption="permission.update"
        :deleteOption="permission.delete"
        :exportOption="permission.read"
        :backOption="isChild"
        :handleAdd="openAddModal"
        :handleDataSearch="search"
        :handleBack="goBack"
        :expandedRow="null"
      />
    </Main>
  </div>
</template>

<script>
import DataTables from "@/components/table/DataTable.vue";
import {
  defineComponent,
  onMounted,
  computed,
  ref,
  reactive,
  toRaw,
  watch,
} from "vue";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { ChildSpan, ActionSpan, ModalWrap } from "./style";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import {
  normalizeOcoguiViewerUrl,
  getDefaultOcoguiServerUrl,
  normalizeOcoguiServerUrl,
} from "@/utils/ocogui";

// 引入新版元件
import PreviewPanel from "@/components/oco/gui/setting/PreviewPanel.vue";
import TemplateManager from "@/components/oco/gui/setting/TemplateManager.vue";

export default defineComponent({
  components: {
    Main,
    DataTables,
    ModalWrap,
    PreviewPanel,
    TemplateManager,
  },
  setup() {
    const { permission } = usePermission();
    const { dispatch, state } = useStore();
    const isChild = computed(() => state.gui.classURLs.length > 0);
    const title = ref("頁面設定");
    const routes = ref([
      { breadcrumbName: "監控系統" },
      { path: "/gui/setting", breadcrumbName: "頁面設定" },
    ]);
    const loading = computed(() => state.gui.loading);

    onMounted(async () => {
      const res = await dispatch("gui/getAllPages");
      typeOptions.value = res.type;
    });
    // table
    const column = [
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "類型",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const data = computed(() => {
      const res = state.gui.settingTableData.map((el) => {
        const { Id, Name, Category, CategoryText } = el;
        return {
          name:
            Category !== 2 ? (
              <span>{Name}</span>
            ) : (
              <ChildSpan onClick={() => getChild(el)}>{Name}</ChildSpan>
            ),
          type: CategoryText,
          action: (
            <ActionSpan>
              {permission.update ? (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              ) : null}
              {permission.delete ? (
                <span onClick={() => deleteItem(Id)}>
                  <unicon name="trash"></unicon>
                </span>
              ) : null}
            </ActionSpan>
          ),
        };
      });
      return res;
    });

    const search = (e) => {
      dispatch("gui/filterGuiSettingTable", e.target.value);
    };

    const getChild = async ({ Id, Name }) => {
      await dispatch("gui/getGuiSettingChild", Id);
      title.value = Name;
      routes.value.push({ breadcrumbName: Name });
    };

    const goBack = async () => {
      await dispatch("gui/guiSettingGoBack");

      routes.value.pop();
      title.value = routes.value[routes.value.length - 1].breadcrumbName;
    };

    // modal
    const typeOptions = ref([]);
    const modal = ref(false);
    const formState = reactive({
      title: "",
      id: null,
      type: null,
      name: "",
      link: "",
      ocoguiView: null, // 選擇的視圖 { id, name, url }
      ocoguiCustomUrl: "", // 自訂 URL
      ocoguiUrlMode: "select", // 'select' | 'custom'
      // iframe 顯示調整
      iframeFit: "contain-center", // 'none' | 'contain-center' | 'stretch'
      iframeHeightMode: "auto", // 'px' | 'vh' | 'auto' - 預設 auto (100%)
      iframeHeightValue: 800, // px 或 vh 的數值
      
      // 新版功能：邊距調整
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      // 設計解析度
      designWidth: 1920,
      designHeight: 1080,
      // iframe 實際尺寸（用戶調整後的尺寸）
      iframeWidth: null,  // null 表示使用自動計算
      iframeHeight: null,
      // iframe 絕對位置（相對於可用區左上角）
      iframeX: null,
      iframeY: null,
      // 設計時的可用空間（用於檢視時計算相對位置）
      designAvailableWidth: null,
      designAvailableHeight: null,
    });

    // 範本管理相關
    const templateManagerVisible = ref(false);
    
    // 左側面板收合狀態
    const sidebarCollapsed = ref(false);
    
    // 標記是否正在接收預覽面板的更新
    const isUpdatingFromPreview = ref(false);

    const handleLoadTemplate = (template) => {
      console.log('📥 Index.vue 收到 load-template 事件:', template);
      
      if (!template || !template.config) {
        console.warn('❌ 範本資料不完整:', template);
        return;
      }
      
      const config = template.config;
      console.log('📥 開始套用範本配置:', config);
      console.log('📥 載入前的狀態:', {
        marginTop: formState.marginTop,
        marginBottom: formState.marginBottom,
        marginLeft: formState.marginLeft,
        marginRight: formState.marginRight,
        iframeX: formState.iframeX,
        iframeY: formState.iframeY
      });
      
      // 套用所有配置，確保數值正確
      if (config.marginTop !== undefined) {
        const newValue = Number(config.marginTop) || 0;
        console.log(`📝 設定 marginTop: ${formState.marginTop} → ${newValue}`);
        formState.marginTop = newValue;
      }
      if (config.marginBottom !== undefined) {
        const newValue = Number(config.marginBottom) || 0;
        console.log(`📝 設定 marginBottom: ${formState.marginBottom} → ${newValue}`);
        formState.marginBottom = newValue;
      }
      if (config.marginLeft !== undefined) {
        const newValue = Number(config.marginLeft) || 0;
        console.log(`📝 設定 marginLeft: ${formState.marginLeft} → ${newValue}`);
        formState.marginLeft = newValue;
      }
      if (config.marginRight !== undefined) {
        const newValue = Number(config.marginRight) || 0;
        console.log(`📝 設定 marginRight: ${formState.marginRight} → ${newValue}`);
        formState.marginRight = newValue;
      }
      if (config.iframeFit) {
        console.log(`📝 設定 iframeFit: ${formState.iframeFit} → ${config.iframeFit}`);
        formState.iframeFit = config.iframeFit;
      }
      if (config.iframeHeightMode) {
        console.log(`📝 設定 iframeHeightMode: ${formState.iframeHeightMode} → ${config.iframeHeightMode}`);
        formState.iframeHeightMode = config.iframeHeightMode;
      }
      if (config.iframeHeightValue) {
        const newValue = Number(config.iframeHeightValue) || 800;
        console.log(`📝 設定 iframeHeightValue: ${formState.iframeHeightValue} → ${newValue}`);
        formState.iframeHeightValue = newValue;
      }
      if (config.designWidth) {
        const newValue = Number(config.designWidth) || 1920;
        console.log(`📝 設定 designWidth: ${formState.designWidth} → ${newValue}`);
        formState.designWidth = newValue;
      }
      if (config.designHeight) {
        const newValue = Number(config.designHeight) || 1080;
        console.log(`📝 設定 designHeight: ${formState.designHeight} → ${newValue}`);
        formState.designHeight = newValue;
      }
      
      // 重要：載入範本時，清除所有絕對位置和尺寸，讓其根據邊距重新計算
      console.log('🔄 清除絕對位置和尺寸，重新計算');
      formState.iframeX = null;
      formState.iframeY = null;
      formState.iframeWidth = null;
      formState.iframeHeight = null;
      formState.designAvailableWidth = null;
      formState.designAvailableHeight = null;
      
      console.log('✅ 範本配置套用完成，當前 formState:', {
        marginTop: formState.marginTop,
        marginBottom: formState.marginBottom,
        marginLeft: formState.marginLeft,
        marginRight: formState.marginRight,
        iframeFit: formState.iframeFit,
        designWidth: formState.designWidth,
        designHeight: formState.designHeight,
        iframeX: formState.iframeX,
        iframeY: formState.iframeY
      });
      
      notification.success({ message: `已套用範本：${template.name}` });
    };

    // 處理預覽面板的拖曳更新
    const handlePreviewUpdate = (config) => {
      isUpdatingFromPreview.value = true;
      
      if (config.marginLeft !== undefined) formState.marginLeft = config.marginLeft;
      if (config.marginTop !== undefined) formState.marginTop = config.marginTop;
      // 接收調整後的 iframe 寬高
      if (config.iframeWidth !== undefined) formState.iframeWidth = config.iframeWidth;
      if (config.iframeHeight !== undefined) formState.iframeHeight = config.iframeHeight;
      // 接收絕對位置
      if (config.iframeX !== undefined) formState.iframeX = config.iframeX;
      if (config.iframeY !== undefined) formState.iframeY = config.iframeY;
      // 接收設計時的可用空間（用於檢視時計算相對位置）
      if (config.designAvailableWidth !== undefined) formState.designAvailableWidth = config.designAvailableWidth;
      if (config.designAvailableHeight !== undefined) formState.designAvailableHeight = config.designAvailableHeight;
      
      // 更新完成後重置標記
      setTimeout(() => {
        isUpdatingFromPreview.value = false;
      }, 0);
    };
    
    // 監聽手動輸入邊距，清除絕對座標鎖定
    watch(() => formState.marginLeft, (_newVal) => {
      if (!isUpdatingFromPreview.value) {
        formState.iframeX = null; // 清除絕對 X，改用 margin 計算
      }
    });
    
    watch(() => formState.marginTop, (_newVal) => {
      if (!isUpdatingFromPreview.value) {
        formState.iframeY = null; // 清除絕對 Y，改用 margin 計算
      }
    });

    // 取得當前設定供範本使用
    const getCurrentConfig = () => {
      return {
        marginTop: formState.marginTop,
        marginBottom: formState.marginBottom,
        marginLeft: formState.marginLeft,
        marginRight: formState.marginRight,
        iframeFit: formState.iframeFit,
        iframeHeightMode: formState.iframeHeightMode,
        iframeHeightValue: formState.iframeHeightValue,
        designWidth: formState.designWidth,
        designHeight: formState.designHeight,
      };
    };

    // OCOGUI 視圖列表
    const ocoguiViews = computed(() => state.gui.ocoguiViews || []);
    const ocoguiLoading = computed(() => state.gui.ocoguiLoading || false);
    
    // 初始化 OCOGUI 伺服器 URL，優先使用瀏覽器的 hostname，並預設 port 為 2955
    const initDefaultOcoguiUrl = () => {
      try {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        // 如果是 localhost 或 127.0.0.1，使用當前瀏覽器的 hostname，port 預設 2955
        return `${protocol}//${hostname}:2955`;
      } catch (e) {
        return getDefaultOcoguiServerUrl();
      }
    };
    
    const ocoguiServerUrl = ref(initDefaultOcoguiUrl());
    const normalizeViewerTarget = (rawUrl) => normalizeOcoguiViewerUrl(rawUrl, ocoguiServerUrl.value);
    const currentOcoguiRawUrl = computed(() => (
      formState.ocoguiUrlMode === "select" ? formState.ocoguiView : formState.ocoguiCustomUrl
    ));
    const currentOcoguiTarget = computed(() => normalizeViewerTarget(currentOcoguiRawUrl.value));
    const viewerWarningMessage = computed(() => currentOcoguiTarget.value.warnings.join(" "));

    // 載入 OCOGUI 視圖列表
    const loadOcoguiViews = async () => {
      ocoguiServerUrl.value = normalizeOcoguiServerUrl(ocoguiServerUrl.value);
      await dispatch("gui/fetchOcoguiViews", ocoguiServerUrl.value);
    };

    // 當選擇外部連結類型時，自動載入 OCOGUI 視圖
    watch(
      () => formState.type,
      (newType) => {
        if (newType === 5 && ocoguiViews.value.length === 0) {
          loadOcoguiViews();
        }
      }
    );

    // URL 模式選項
    const urlModeOptions = [
      { value: "select", label: "從 OCOGUI 選擇" },
      { value: "custom", label: "自訂網址" },
    ];

    const labelCol = {
      lg: 8,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 16,
      md: 15,
      xs: 24,
    };
    const rules = {
      type: [
        {
          required: true,
          message: "請輸入名稱",
          trigger: "blur",
        },
      ],
      name: [
        {
          required: true,
          message: "請輸入名稱",
          trigger: "blur",
        },
      ],
    };

    const openEditModal = async ({ Id, Name, Category }) => {
      formState.title = "編輯頁面";
      formState.type = Category;
      formState.id = Id;
      formState.name = Name;

      // 重置 OCOGUI 相關欄位
      formState.ocoguiView = null;
      formState.ocoguiCustomUrl = "";
      formState.ocoguiUrlMode = "select";
      
      // 重置進階欄位
      formState.marginTop = 0;
      formState.marginBottom = 0;
      formState.marginLeft = 0;
      formState.marginRight = 0;
      formState.designWidth = 1920;
      formState.designHeight = 1080;
      formState.iframeWidth = null;
      formState.iframeHeight = null;
      formState.iframeX = null;
      formState.iframeY = null;

      // 如果是外部連結類型，獲取連結數據
      if (Category === 5) {
        try {
          await dispatch("gui/fetchGuiDetail", Id);
          const dataContent = state.gui.guiDetail.DataContentJson || "";

          // 嘗試解析為 JSON（新格式）
          try {
            const parsed = JSON.parse(dataContent);
            formState.ocoguiUrlMode = parsed.urlMode || "custom";
            // iframe options
            formState.iframeFit = parsed.iframeFit || parsed.iframe?.fit || "contain-center";
            formState.iframeHeightMode = parsed.iframeHeightMode || parsed.iframe?.heightMode || "auto";
            formState.iframeHeightValue = parsed.iframeHeightValue || parsed.iframe?.heightValue || 800;
            
            // 進階邊距
            if (parsed.iframe?.marginTop !== undefined) formState.marginTop = parsed.iframe.marginTop;
            if (parsed.iframe?.marginBottom !== undefined) formState.marginBottom = parsed.iframe.marginBottom;
            if (parsed.iframe?.marginLeft !== undefined) formState.marginLeft = parsed.iframe.marginLeft;
            if (parsed.iframe?.marginRight !== undefined) formState.marginRight = parsed.iframe.marginRight;
            
            // 設計解析度
            if (parsed.iframe?.designWidth) formState.designWidth = parsed.iframe.designWidth;
            if (parsed.iframe?.designHeight) formState.designHeight = parsed.iframe.designHeight;
            
            // 用戶調整後的 iframe 實際尺寸
            if (parsed.iframe?.iframeWidth) formState.iframeWidth = parsed.iframe.iframeWidth;
            if (parsed.iframe?.iframeHeight) formState.iframeHeight = parsed.iframe.iframeHeight;
            // iframe 絕對位置
            if (parsed.iframe?.iframeX !== undefined) formState.iframeX = parsed.iframe.iframeX;
            if (parsed.iframe?.iframeY !== undefined) formState.iframeY = parsed.iframe.iframeY;
            // 設計時的可用空間
            if (parsed.iframe?.designAvailableWidth) formState.designAvailableWidth = parsed.iframe.designAvailableWidth;
            if (parsed.iframe?.designAvailableHeight) formState.designAvailableHeight = parsed.iframe.designAvailableHeight;

            if (parsed.serverUrl) {
              ocoguiServerUrl.value = normalizeOcoguiServerUrl(parsed.serverUrl);
            } else if (parsed.url || parsed.ocoguiViewUrl) {
              try {
                ocoguiServerUrl.value = normalizeOcoguiServerUrl(new URL(parsed.url || parsed.ocoguiViewUrl).origin);
              } catch (_) {
                // ignore
              }
            }

            const normalizedTarget = normalizeViewerTarget(parsed.url || parsed.ocoguiViewUrl || "");
            formState.link = normalizedTarget.url || parsed.url || parsed.ocoguiViewUrl || "";
            formState.ocoguiView = normalizedTarget.url || null;
            formState.ocoguiCustomUrl = normalizedTarget.url || parsed.url || parsed.ocoguiViewUrl || "";
            formState.ocoguiUrlMode = normalizedTarget.url ? "select" : (parsed.urlMode || "custom");
          } catch {
            // 舊格式（純 URL 字串）
            try {
              ocoguiServerUrl.value = normalizeOcoguiServerUrl(new URL(dataContent).origin);
            } catch (_) {
              // ignore
            }
            const normalizedTarget = normalizeViewerTarget(dataContent);
            formState.link = normalizedTarget.url || dataContent;
            formState.ocoguiView = normalizedTarget.url || null;
            formState.ocoguiCustomUrl = normalizedTarget.url || dataContent;
            formState.ocoguiUrlMode = normalizedTarget.url ? "select" : "custom";
          }

          // 載入 OCOGUI 視圖列表
          loadOcoguiViews();
        } catch (err) {
          formState.link = "";
        }
      } else {
        formState.link = "";
      }

      modal.value = true;
    };

    const openAddModal = () => {
      formState.title = "新增頁面";
      formState.type = isChild.value ? 3 : 2;
      formState.id = null;
      formState.name = "";
      formState.link = "";
      // 重置 OCOGUI 相關欄位
      formState.ocoguiView = null;
      formState.ocoguiCustomUrl = "";
      formState.ocoguiUrlMode = "select";
      // 重置進階欄位
      formState.marginTop = 0;
      formState.marginBottom = 0;
      formState.marginLeft = 0;
      formState.marginRight = 0;
      formState.iframeFit = "contain-center";
      formState.iframeHeightMode = "auto";
      formState.iframeHeightValue = 800;
      formState.iframeWidth = null;
      formState.iframeHeight = null;
      formState.iframeX = null;
      formState.iframeY = null;
      formState.designWidth = 1920;
      formState.designHeight = 1080;
      
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    // 計算最終的連結值（用於存儲）
    const computeFinalLink = () => {
      if (formState.type !== 5) return formState.link;

      const finalUrl = currentOcoguiTarget.value.url || currentOcoguiRawUrl.value || "";
      const serverUrlToSave = currentOcoguiTarget.value.serverUrl || normalizeOcoguiServerUrl(ocoguiServerUrl.value);

      // 將設定存為 JSON 格式
      return JSON.stringify({
        embedMode: "iframe",
        urlMode: finalUrl ? "select" : formState.ocoguiUrlMode,
        url: finalUrl,
        ocoguiViewUrl: finalUrl,
        serverUrl: serverUrlToSave,
        // 向後相容欄位
        iframeFit: formState.iframeFit,
        iframeHeightMode: formState.iframeHeightMode,
        iframeHeightValue: formState.iframeHeightValue,
        // 完整結構
        iframe: {
          fit: formState.iframeFit,
          heightMode: formState.iframeHeightMode,
          heightValue: formState.iframeHeightValue,
          marginTop: formState.marginTop,
          marginBottom: formState.marginBottom,
          marginLeft: formState.marginLeft,
          marginRight: formState.marginRight,
          designWidth: formState.designWidth,
          designHeight: formState.designHeight,
          // 用戶調整後的 iframe 實際尺寸
          iframeWidth: formState.iframeWidth,
          iframeHeight: formState.iframeHeight,
          // iframe 絕對位置（相對於可用區左上角）
          iframeX: formState.iframeX,
          iframeY: formState.iframeY,
          // 設計時的可用空間（用於檢視時計算相對位置）
          designAvailableWidth: formState.designAvailableWidth,
          designAvailableHeight: formState.designAvailableHeight,
        }
      });
    };

    // 用於 PreviewPanel 的 URL 計算
    const previewUrl = computed(() => currentOcoguiTarget.value.url || currentOcoguiRawUrl.value);

    const submit = async () => {
      try {
        if (formState.type === 5 && currentOcoguiRawUrl.value && !currentOcoguiTarget.value.viewName) {
          Modal.error({
            title: "Viewer 連結格式錯誤",
            content: "plc-frontend 掛載 OCOGUI 只支援純 Viewer 連結，請改用 `#/view?name=...` 或從視圖清單選擇。",
          });
          return;
        }

        let title;

        const finalFormState = {
          ...toRaw(formState),
          link: computeFinalLink(),
        };

        if (formState.id) {
          const tar = state.gui.settingTableData.find(
            (el) => el.Id === formState.id
          );
          await dispatch("gui/editGuiSetting", { ...toRaw(tar), ...finalFormState });
          title = "修改成功";
        } else {
          const parentId =
            state.gui.classURLs.length === 0
              ? null
              : state.gui.classURLs[state.gui.classURLs.length - 1];
          await dispatch("gui/addGuiSetting", { parentId, ...finalFormState });
          title = "新增成功";
        }
        modal.value = false;
        notification.success({
          message: title,
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const deleteItem = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("gui/deleteGuiSetting", id);
            notification.success({
              message: "刪除成功",
            });
          } catch (err) {
            Modal.error({
              title: "發生錯誤",
              content: err.message,
            });
          }
        },
      });
    };

    return {
      permission,
      title,
      loading,
      typeOptions,
      modal,
      labelCol,
      formState,
      wrapperCol,
      routes,
      isChild,
      column,
      rules,
      data,
      search,
      goBack,
      closeModal,
      openEditModal,
      openAddModal,
      submit,
      // OCOGUI 相關
      ocoguiViews,
      ocoguiLoading,
      ocoguiServerUrl,
      loadOcoguiViews,
      urlModeOptions,
      // 新版功能
      templateManagerVisible,
      handleLoadTemplate,
      handlePreviewUpdate,
      getCurrentConfig,
      previewUrl,
      currentOcoguiTarget,
      viewerWarningMessage,
      sidebarCollapsed
    };
  },
});
</script>

<style scoped>
/* 寬版 Modal 內部佈局 */
.wide-modal-wrapper {
  height: 100%;
}

/* 左側設定欄 */
.setting-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
  position: relative;
}

.sidebar-content {
  flex: 1;
  overflow: hidden; 
  padding: 0; 
  padding-bottom: 60px; /* 預留底部按鈕空間 */
}

/* Tabs 樣式與字體優化 */
.custom-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
  padding: 0 16px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

/* 修正 Tabs 內容高度問題 */
:deep(.ant-tabs-content-holder) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.ant-tabs-content) {
  flex: 1;
  height: 100%;
}

:deep(.ant-tabs-tabpane) {
  height: 100%;
}

:deep(.ant-tabs-tab) {
  font-size: 15px !important; /* 放大 Tab 字體 */
  font-weight: 500;
  padding: 12px 0 !important;
  margin: 0 16px 0 0 !important;
}

:deep(.ant-tabs-tab-active) {
  font-weight: 700;
}

/* 內容區域：確保高度足夠，但又不產生不必要的捲軸 */
.tab-scroll-content {
  height: 100%;
  overflow-y: auto;
  padding: 16px 20px; /* 稍微減少 padding */
}

/* 緊湊表單樣式 */
.compact-form :deep(.ant-form-item) {
  margin-bottom: 12px; /* 減少間距 */
}

.setting-section.compact {
  margin-bottom: 16px;
  padding-bottom: 16px;
}

.section-title.small {
  font-size: 15px; /* 稍微縮小標題 */
  margin-bottom: 12px;
}

/* 每個設定區塊 */
.setting-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px dashed #e8e8e8;
}

.setting-section.no-border {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.icon-accent {
  fill: #1890ff; /* 主題色 */
  margin-right: 10px;
}

/* 表單字體優化 */
:deep(.ant-form-item-label > label) {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

:deep(.ant-input), :deep(.ant-select-selection-item), :deep(.ant-input-number-input) {
  font-size: 14px;
}

/* 邊距微調網格 (緊湊) */
.margin-grid.compact-grid {
  gap: 8px;
}

.margin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 底部按鈕區 (Sticky) */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 24px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  text-align: right;
  z-index: 10;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.05);
}

/* 收合時預覽區置中 */
.preview-centered {
  justify-content: center;
}

.preview-full {
  display: flex;
  justify-content: center;
}

.preview-full .preview-wrapper {
  max-width: 1200px;
  width: 100%;
}

/* 右側預覽區 */
.preview-column {
  height: 100%;
  background-color: #f5f7fa;
  padding: 20px;
  overflow: hidden; /* 防止內容溢出 */
}

.preview-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}

.preview-header {
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右對齊 */
}

.preview-header-info {
  display: flex;
  align-items: center;
}

.info-badge {
  font-size: 13px;
  color: #555;
  background: #f0f2f5;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  font-weight: 500;
}

.preview-content {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: #f0f2f5;
}

/* 美化滾動條 */
.tab-scroll-content::-webkit-scrollbar {
  width: 6px; /* 更細的滾動條 */
}
.tab-scroll-content::-webkit-scrollbar-thumb {
  background-color: #d9d9d9;
  border-radius: 4px;
}
.tab-scroll-content::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
