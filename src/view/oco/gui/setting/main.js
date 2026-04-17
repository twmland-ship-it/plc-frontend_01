import DataTables from "@/components/table/DataTable.vue";
import {
  defineComponent,
  onMounted,
  computed,
  ref,
  reactive,
  toRaw,
  watch,
  nextTick,
} from "vue";
import { Main } from "../../styled";
import { useStore } from "vuex";
import { ChildSpan, ActionSpan, ModalWrap } from "./style";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import { getDefaultOcoguiServerUrl, normalizeOcoguiServerUrl } from "@/utils/ocogui";

// 引入新版元件
import PreviewPanel from "@/components/oco/gui/setting/PreviewPanel.vue";
import TemplateManager from "@/components/oco/gui/setting/TemplateManager.vue";

export default defineComponent({
  components: {
    Main,
    DataTables,
    ChildSpan,
    ActionSpan,
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
      iframeHeightMode: "px", // 'px' | 'vh' | 'auto'
      iframeHeightValue: 800, // px 或 vh 的數值
      
      // 新版功能：邊距調整
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      // 設計解析度
      designWidth: 1920,
      designHeight: 1080,
      // iframe 絕對位置和尺寸（由 PreviewPanel 拖曳設定）
      iframeX: null,
      iframeY: null,
      iframeWidth: null,
      iframeHeight: null,
    });

    // 範本管理相關
    const templateManagerVisible = ref(false);
    const handleLoadTemplate = (template) => {
      if (!template || !template.config) return;
      const config = template.config;
      
      if (config.marginTop !== undefined) formState.marginTop = config.marginTop;
      if (config.marginBottom !== undefined) formState.marginBottom = config.marginBottom;
      if (config.marginLeft !== undefined) formState.marginLeft = config.marginLeft;
      if (config.marginRight !== undefined) formState.marginRight = config.marginRight;
      if (config.iframeFit) formState.iframeFit = config.iframeFit;
      if (config.iframeHeightMode) formState.iframeHeightMode = config.iframeHeightMode;
      if (config.iframeHeightValue) formState.iframeHeightValue = config.iframeHeightValue;
      if (config.designWidth) formState.designWidth = config.designWidth;
      if (config.designHeight) formState.designHeight = config.designHeight;
      
      notification.success({ message: `已套用範本：${template.name}` });
    };

    // 處理預覽面板的拖曳更新
    const handlePreviewUpdate = (config) => {
      if (config.marginLeft !== undefined) formState.marginLeft = config.marginLeft;
      if (config.marginTop !== undefined) formState.marginTop = config.marginTop;
      // iframe 絕對位置和尺寸
      if (config.iframeX !== undefined) formState.iframeX = config.iframeX;
      if (config.iframeY !== undefined) formState.iframeY = config.iframeY;
      if (config.iframeWidth !== undefined) formState.iframeWidth = config.iframeWidth;
      if (config.iframeHeight !== undefined) formState.iframeHeight = config.iframeHeight;
      // 設計時的可用空間
      if (config.designAvailableWidth !== undefined) formState.designWidth = config.designAvailableWidth;
      if (config.designAvailableHeight !== undefined) formState.designHeight = config.designAvailableHeight;
    };

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
      formState.iframeX = null;
      formState.iframeY = null;
      formState.iframeWidth = null;
      formState.iframeHeight = null;

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
            formState.iframeHeightMode = parsed.iframeHeightMode || parsed.iframe?.heightMode || "px";
            formState.iframeHeightValue = parsed.iframeHeightValue || parsed.iframe?.heightValue || 800;
            
            // 進階邊距
            if (parsed.iframe?.marginTop !== undefined) formState.marginTop = parsed.iframe.marginTop;
            if (parsed.iframe?.marginBottom !== undefined) formState.marginBottom = parsed.iframe.marginBottom;
            if (parsed.iframe?.marginLeft !== undefined) formState.marginLeft = parsed.iframe.marginLeft;
            if (parsed.iframe?.marginRight !== undefined) formState.marginRight = parsed.iframe.marginRight;
            
            // 設計解析度
            if (parsed.iframe?.designWidth) formState.designWidth = parsed.iframe.designWidth;
            if (parsed.iframe?.designHeight) formState.designHeight = parsed.iframe.designHeight;
            
            // iframe 絕對位置和尺寸
            if (parsed.iframe?.iframeX !== undefined) formState.iframeX = parsed.iframe.iframeX;
            if (parsed.iframe?.iframeY !== undefined) formState.iframeY = parsed.iframe.iframeY;
            if (parsed.iframe?.iframeWidth !== undefined) formState.iframeWidth = parsed.iframe.iframeWidth;
            if (parsed.iframe?.iframeHeight !== undefined) formState.iframeHeight = parsed.iframe.iframeHeight;

            if (parsed.ocoguiViewUrl) {
              formState.ocoguiView = parsed.ocoguiViewUrl;
              formState.ocoguiCustomUrl = parsed.ocoguiViewUrl;
            }
            formState.link = parsed.url || parsed.ocoguiViewUrl || "";

            if (parsed.serverUrl) {
              ocoguiServerUrl.value = normalizeOcoguiServerUrl(parsed.serverUrl);
            } else if (formState.link) {
              try {
                ocoguiServerUrl.value = normalizeOcoguiServerUrl(new URL(formState.link).origin);
              } catch (_) {
                // ignore
              }
            }
          } catch {
            // 舊格式（純 URL 字串）
            formState.link = dataContent;
            formState.ocoguiCustomUrl = dataContent;
            formState.ocoguiUrlMode = "custom";
            try {
              ocoguiServerUrl.value = normalizeOcoguiServerUrl(new URL(dataContent).origin);
            } catch (_) {
              // ignore
            }
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
      formState.iframeHeightMode = "px";
      formState.iframeHeightValue = 800;
      
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    // 計算最終的連結值（用於存儲）
    const computeFinalLink = () => {
      if (formState.type !== 5) return formState.link;

      // 決定實際的 URL
      let finalUrl = "";
      if (formState.ocoguiUrlMode === "select" && formState.ocoguiView) {
        finalUrl = formState.ocoguiView;
      } else {
        finalUrl = formState.ocoguiCustomUrl;
      }

      // serverUrl 處理
      let serverUrlToSave = normalizeOcoguiServerUrl(ocoguiServerUrl.value);

      try {
        if (finalUrl) {
          const base = new URL(serverUrlToSave);
          const u = new URL(finalUrl, base.origin);
          u.protocol = base.protocol;
          u.host = base.host;

          const m = u.pathname.match(/^\/view\/([^/?#]+)/);
          if (m) {
            const viewName = decodeURIComponent(m[1]);
            u.pathname = "/";
            u.search = "";
            u.hash = `#/view?name=${encodeURIComponent(viewName)}`;
          }

          finalUrl = u.toString();
          serverUrlToSave = u.origin;
        }
      } catch (_) {
        // ignore
      }

      // 將設定存為 JSON 格式
      return JSON.stringify({
        embedMode: "iframe",
        urlMode: formState.ocoguiUrlMode,
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
          // iframe 絕對位置和尺寸（由 PreviewPanel 拖曳設定）
          iframeX: formState.iframeX,
          iframeY: formState.iframeY,
          iframeWidth: formState.iframeWidth,
          iframeHeight: formState.iframeHeight,
        }
      });
    };

    // 用於 PreviewPanel 的 URL 計算
    const previewUrl = computed(() => {
      if (formState.ocoguiUrlMode === 'select') return formState.ocoguiView;
      return formState.ocoguiCustomUrl;
    });

    const submit = async () => {
      try {
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
      previewUrl
    };
  },
});
