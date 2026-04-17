import mutations from "./mutations";
import { DataService } from "@/config/dataService/dataService";
import { useDatatableFilter, useFetchTree } from "@/composable/filter.js";
import { useUUID } from "@/composable/uuid";
import axios from "axios";
import {
  buildOcoguiViewerUrl,
  getDefaultOcoguiServerUrl,
  normalizeOcoguiServerUrl,
} from "@/utils/ocogui";
import * as iframeTemplateApi from "@/api/iframeTemplate";
// import guiDemo from "@/demoData/gui-picture.json";
import dayjs from "dayjs";
const state = () => {
  return {
    loading: false,
    error: null,
    settingInitData: [],
    settingTableData: [],
    customIcon: [],
    symbols: [],
    guiDetail: null,
    classURLs: [],
    ocoguiViews: [], // OCOGUI 可用視圖列表
    ocoguiLoading: false,
    // 預設使用目前頁面主機（避免現場誤用 localhost 指到使用者電腦）
    ocoguiServerUrl: getDefaultOcoguiServerUrl(),
    // iframe 範本管理
    iframeTemplates: [],
    iframeTemplatesLoading: false,
  };
};

const actions = {
  async getOptions({ commit }) {
    try {
      commit("getOptionsBegin");
      // call api
      const res = await Promise.all([
        DataService.get("/api/Media/GetScadaIconList"),
        DataService.get("/api/frontend-setting/category/symbol"),
      ]);
      commit("getOptionsSuccess", {
        icons: res[0].data.Detail.IconList,
        symbols: res[1].data.Detail.FrontendSettings.map((el) =>
          JSON.parse(el.Value)
        ),
      });
    } catch (err) {
      commit("getOptionsErr", err);
      throw new Error(err);
    }
  },

  async addCustomImg({ commit, dispatch }, img) {
    try {
      commit("addCustomImgBegin");
      await DataService.post("/api/Media/CreateNewScadaIcon", {
        IconText: img,
      });
      commit("addCustomImgSuccess");
      await dispatch("getOptions");
    } catch (err) {
      commit("addCustomImgErr", err);
      throw new Error(err);
    }
  },

  async fetchGuiDetail({ commit }, id) {
    try {
      commit("fetchDetailBegin");
      const res = await DataService.get("/api/System/GetPageItem", {
        ItemId: id,
      });
      commit("fetchDetailSuccess", res.data.Detail);
    } catch (err) {
      commit("fetchDetailErr", err);
      throw new Error(err);
    }
  },

  async saveGuiPicture({ state, commit, dispatch }, { allTagList, data }) {
    try {
      commit("savePictureBegin");
      await DataService.post("/api/System/UpdatePageItem", {
        ItemId: state.guiDetail.ItemId,
        Name: state.guiDetail.Name,
        Category: state.guiDetail.Category,
        DataContentJson: JSON.stringify(data),
        TagIdList: allTagList,
      });

      await dispatch("fetchGuiDetail", state.guiDetail.ItemId);
      commit("savePictureSuccess");
    } catch (err) {
      commit("savePictureErr");
      throw new Error(err);
    }
  },

  async addSymbol({ commit, dispatch }, params) {
    try {
      commit("addSymbolBegin");
      const id = useUUID();
      await DataService.post(
        `/api/frontend-setting/category/symbol`,
        {
          Key: id,
          Value: JSON.stringify({ ...params, id }),
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("getOptions");
      commit("addSymbolSuccess");
    } catch (err) {
      commit("addSymbolErr");
      throw new Error(err);
    }
  },

  async editSymbol({ commit, dispatch }, params) {
    try {
      commit("editSymbolBegin");
      await DataService.put(
        `/api/frontend-setting/category/symbol/key/${params.id}`,
        {
          Value: JSON.stringify(params),
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("getOptions");
      commit("editSymbolSuccess");
    } catch (err) {
      commit("editSymbolErr");
      throw new Error(err);
    }
  },

  async deleteSymbol({ commit, dispatch }, id) {
    try {
      commit("deleteSymbolBegin");
      await DataService.delete(
        `/api/frontend-setting/category/symbol/key/${id}`
      );
      await dispatch("getOptions");
      commit("deleteSymbolSuccess");
    } catch (err) {
      commit("deleteSymbolErr");
      throw new Error(err);
    }
  },

  async getGuiTagTrend({ commit }, id) {
    try {
      commit("getTagTrendBegin");

      const apiRes = await DataService.post(
        `/api/history-report/tag-statistic-summaries/search/report-type:detail`,
        {
          TagIds: [id],
          StatisticMethod: "Summation",
          From: dayjs().startOf("day").format("YYYY-MM-DD"),
          To: dayjs().add(1, "day").startOf("day").format("YYYY-MM-DD"),
        },
        {
          "Content-Type": "application/json",
        }
      );
      commit("getTagTrendSuccess");
      return apiRes.data.Detail.Tags[0] ? apiRes.data.Detail.Tags[0].Data : [];
    } catch (err) {
      commit("getTagTrendErr");
      throw new Error(err);
    }
  },

  async sendTagSignal({ commit }, data) {
    try {
      commit("sendTagSignalBegin");
      await DataService.post(`/api/App/SetCurrentTenantModbusTargetValue`, {
        ValuePairList: data.map((el) => ({ Id: el.id, Value: el.signalValue })),
      });
      commit("sendTagSignalSuccess");
    } catch (err) {
      commit("sendTagSignalErr");
      throw new Error(err);
    }
  },

  async addList({ state, commit, dispatch }, params) {
    try {
      commit("addListBegin");
      const pageData = state.guiDetail.DataContentJson
        ? JSON.parse(state.guiDetail.DataContentJson)
        : [];
      pageData.push({ ...params, id: useUUID() });
      const allTagList = [
        ...new Set(
          [].concat(...pageData.map((el) => el.tags.map((el) => el.id)))
        ),
      ];
      await DataService.post("/api/System/UpdatePageItem", {
        ItemId: state.guiDetail.ItemId,
        Name: state.guiDetail.Name,
        Category: state.guiDetail.Category,
        DataContentJson: JSON.stringify(pageData),
        TagIdList: allTagList,
      });

      await dispatch("fetchGuiDetail", state.guiDetail.ItemId);

      commit("addListSuccess");
    } catch (err) {
      commit("addListErr", err);
      throw new Error(err);
    }
  },

  async editList({ dispatch, state, commit }, params) {
    try {
      commit("editListBegin");
      const pageData = state.guiDetail.DataContentJson
        ? JSON.parse(state.guiDetail.DataContentJson)
        : [];
      const tar = pageData.findIndex((el) => el.id === params.id);
      Object.assign(pageData[tar], params);
      const allTagList = [
        ...new Set(
          [].concat(...pageData.map((el) => el.tags.map((el) => el.id)))
        ),
      ];

      await DataService.post("/api/System/UpdatePageItem", {
        ItemId: state.guiDetail.ItemId,
        Name: state.guiDetail.Name,
        Category: state.guiDetail.Category,
        DataContentJson: JSON.stringify(pageData),
        TagIdList: allTagList,
      });

      await dispatch("fetchGuiDetail", state.guiDetail.ItemId);

      commit("editListSuccess");
    } catch (err) {
      commit("editListErr", err);
      throw new Error(err);
    }
  },

  async deleteList({ state, commit, dispatch }, id) {
    try {
      commit("deleteListBegin");
      const pageData = JSON.parse(state.guiDetail.DataContentJson);
      const tar = pageData.findIndex((el) => el.id === id);
      pageData.splice(tar, 1);
      const allTagList = [
        ...new Set(...pageData.map((el) => el.tags.map((el) => el.id))),
      ];
      await DataService.post("/api/System/UpdatePageItem", {
        ItemId: state.guiDetail.ItemId,
        Name: state.guiDetail.Name,
        Category: state.guiDetail.Category,
        DataContentJson: JSON.stringify(pageData),
        TagIdList: allTagList,
      });
      await dispatch("fetchGuiDetail", state.guiDetail.ItemId);

      commit("deleteListSuccess");
    } catch (err) {
      commit("deleteListErr", err);
      throw new Error(err);
    }
  },



  async getAllPages({ commit, dispatch }) {
    try {
      commit("getAllPagesBegin");
      const apiRes = await DataService.get(
        `/api/System/GetPageItemHierarchicalList`
      );

      commit("getAllPagesSuccess", apiRes.data.Detail.PageDetail);
      dispatch("fetchSettingTable");
      return {
        data: apiRes.data.Detail.PageDetail,
        type: apiRes.data.Detail.CategoryList,
      };
    } catch (err) {
      commit("getAllPagesErr", err);
      throw new Error(err);
    }
  },
  async fetchSettingTable({ state, commit }) {
    try {
      commit("fetchSettingTableBegin");
      // call api
      const res = useFetchTree(state.classURLs, state.settingInitData, {
        childProp: "Children",
        childId: "Id",
      });
      commit("fetchSettingTableSuccess", res);
    } catch (err) {
      commit("fetchSettingTableErr", err);
      throw new Error(err);
    }
  },

  async getGuiSettingChild({ commit, dispatch }, id) {
    try {
      commit("getSettingChildBegin", id);
      dispatch("fetchSettingTable");
      commit("getSettingChildSuccess");
    } catch (err) {
      commit("getSettingChildErr", err);
      throw new Error(err);
    }
  },

  guiSettingGoBack({ commit, dispatch }) {
    try {
      commit("guiSettingGoBackBegin");
      dispatch("fetchSettingTable");
      commit("guiSettingGoBackSuccess");
    } catch (err) {
      commit("guiSettingGoBackErr", err);
      throw new Error(err);
    }
  },

  async filterGuiSettingTable({ state, commit }, searchText) {
    try {
      commit("filterSettingTableBegin");

      const res = useDatatableFilter(state.settingInitData, searchText);
      commit("filterSettingTableSuccess", res);
    } catch (err) {
      commit("filterSettingTableErr", err);
      throw new Error(err);
    }
  },
  async editGuiSetting(
    { commit, dispatch },
    { type, name, TagList, DataContentJson, id, link }
  ) {
    try {
      commit("editSettingBegin");
      await DataService.post(`/api/System/UpdatePageItem`, {
        ItemId: id,
        DataContentJson: link || DataContentJson,
        TagIdList: TagList,
        Category: type,
        Name: name,
      });
      await dispatch("getAllPages");
      commit("editSettingSuccess");
    } catch (err) {
      commit("editSettingErr");
      throw new Error(err);
    }
  },

  async addGuiSetting({ commit, dispatch }, { parentId, type, name, link }) {
    try {
      commit("addSettingBegin");
      await DataService.post(`/api/System/CreateNewPageItem`, {
        ParentId: parentId,
        Category: type,
        Name: name,
        DataContentJson: link || null,
      });
      await dispatch("getAllPages");
      commit("addSettingSuccess");
    } catch (err) {
      commit("addSettingErr");
      throw new Error(err);
    }
  },

  async deleteGuiSetting({ commit, dispatch }, id) {
    try {
      commit("deleteSettingBegin");
      await DataService.post(`/api/System/DeletePageItem`, {
        ItemId: id,
      });
      await dispatch("getAllPages");
      commit("deleteSettingSuccess");
    } catch (err) {
      commit("deleteSettingErr");
      throw new Error(err);
    }
  },

  /**
   * 取得 OCOGUI 可用的視圖列表
   * 從 OCOGUI 伺服器的 /api/project 端點取得專案資料，
   * 並從中解析出所有可用的視圖（views）
   *
   * SDK v1.1.0 結構：projectData.hmi.views
   */
  async fetchOcoguiViews({ commit }, customUrl = null) {
    try {
      commit("fetchOcoguiViewsBegin");

      // OCOGUI 伺服器的實際 URL（用於生成視圖連結）
      const ocoguiUrl = normalizeOcoguiServerUrl(customUrl);

      // ✅ 修復 CORS 問題：統一使用代理路徑（開發和生產環境都使用）
      // 生產環境透過 nginx 代理 /ocoguiApi 到 OCOGUI 伺服器，避免跨域問題
      const apiUrl = '/ocoguiApi/api/project';

      // ✅ 效能：只需要 views metadata（供下拉選單），不要把整個專案（可能數百 MB）拉回來
      // 後端支援 lite=1：回 views metadata + start view 完整內容（但這裡只會用到 views 的 id/name/type）
      const response = await axios.get(apiUrl, {
        params: {
          lite: 1,
          _t: Date.now(),
        },
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
        }
      });

      // 解析視圖列表 (SDK v1.1.0 結構)
      // OCOGUI/FUXA 的專案結構中，views 在 hmi.views
      let views = [];
      const projectData = response.data;

      if (projectData && projectData.hmi && projectData.hmi.views) {
        const hmiViews = projectData.hmi.views;
        // views 可能是物件或陣列
        if (Array.isArray(hmiViews)) {
          views = hmiViews.map(v => ({
            id: v.id || v.name,
            name: v.name || v.id,
            type: v.type || 'svg',
            // OCOGUI 使用 hash route（Angular useHash: true）
            // 正確格式：http(s)://host:2955/#/view?name=<viewName>
            url: buildOcoguiViewerUrl(ocoguiUrl, v.name || v.id)
          }));
        } else if (typeof hmiViews === 'object') {
          views = Object.entries(hmiViews).map(([key, v]) => ({
            id: v.id || key,
            name: v.name || key,
            type: v.type || 'svg',
            url: buildOcoguiViewerUrl(ocoguiUrl, v.name || key)
          }));
        }
      }

      commit("fetchOcoguiViewsSuccess", { views, serverUrl: ocoguiUrl });
      return { views, serverUrl: ocoguiUrl };
    } catch (err) {
      console.warn("無法取得 OCOGUI 視圖列表:", err.message);
      commit("fetchOcoguiViewsErr", err);
      // 不拋出錯誤，讓用戶可以手動輸入 URL
      return { views: [], serverUrl: null, error: err.message };
    }
  },

  /**
   * 載入 iframe 配置
   * 
   * @param {Object} context - Vuex context
   * @param {number} id - 配置項目的 ID
   * @returns {Promise<Object>} - iframe 配置
   */
  async loadIframeConfig({ commit }, id) {
    try {
      commit("loadIframeConfigBegin");
      
      const response = await DataService.get('/api/System/GetPageItem', {
        ItemId: id
      });

      const pageItem = response.data.Detail;
      let config = null;
      
      if (pageItem.DataContentJson) {
        const parsed = JSON.parse(pageItem.DataContentJson);
        
        // 標準化配置格式（向後兼容）
        config = {
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
      }

      commit("loadIframeConfigSuccess", config);
      return config;
    } catch (err) {
      commit("loadIframeConfigErr", err);
      throw new Error(`無法載入配置: ${err.message}`);
    }
  },

  /**
   * 儲存 iframe 配置
   * 
   * @param {Object} context - Vuex context
   * @param {Object} params - 參數
   * @param {number} params.id - 配置項目的 ID
   * @param {Object} params.config - iframe 配置
   * @param {string} params.name - 項目名稱
   * @param {number} params.category - 項目類別
   */
  async saveIframeConfig({ commit }, { id, config, name, category }) {
    try {
      commit("saveIframeConfigBegin");

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

      commit("saveIframeConfigSuccess");
    } catch (err) {
      commit("saveIframeConfigErr", err);
      throw new Error(`無法儲存配置: ${err.message}`);
    }
  },

  /**
   * 取得所有 iframe 範本列表
   * 
   * @param {Object} context - Vuex context
   * @param {Object} options - 查詢選項
   * @returns {Promise<Array>} 範本列表
   */
  async fetchIframeTemplates({ commit }, options = {}) {
    try {
      console.log('🔄 Vuex: 開始取得範本列表...', options);
      commit("fetchIframeTemplatesBegin");
      
      const templates = await iframeTemplateApi.listTemplates(options);
      console.log('✅ Vuex: 成功取得範本列表', templates);
      
      commit("fetchIframeTemplatesSuccess", templates);
      return templates;
    } catch (err) {
      console.error('❌ Vuex: 取得範本列表失敗', err);
      commit("fetchIframeTemplatesErr", err);
      throw new Error(`無法取得範本列表: ${err.message}`);
    }
  },

  /**
   * 取得單一 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {number} id - 範本 ID
   * @returns {Promise<Object>} 範本物件
   */
  async getIframeTemplate({ commit: _commit }, id) {
    try {
      const template = await iframeTemplateApi.getTemplate(id);
      return template;
    } catch (err) {
      throw new Error(`無法取得範本: ${err.message}`);
    }
  },

  /**
   * 儲存新的 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {Object} template - 範本資料
   * @returns {Promise<number>} 新建範本的 ID
   */
  async saveIframeTemplate({ commit, dispatch }, template) {
    try {
      console.log('💾 Vuex: 開始儲存範本...', template);
      commit("saveIframeTemplateBegin");
      
      const templateId = await iframeTemplateApi.saveTemplate(template);
      console.log('✅ Vuex: 範本儲存成功，ID:', templateId);
      
      // 重新載入範本列表
      await dispatch("fetchIframeTemplates");
      
      commit("saveIframeTemplateSuccess");
      return templateId;
    } catch (err) {
      console.error('❌ Vuex: 儲存範本失敗', err);
      commit("saveIframeTemplateErr", err);
      throw new Error(`無法儲存範本: ${err.message}`);
    }
  },

  /**
   * 更新 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {Object} params - 參數
   * @param {number} params.id - 範本 ID
   * @param {Object} params.template - 範本資料
   */
  async updateIframeTemplate({ commit, dispatch }, { id, template }) {
    try {
      commit("updateIframeTemplateBegin");
      
      await iframeTemplateApi.updateTemplate(id, template);
      
      // 重新載入範本列表
      await dispatch("fetchIframeTemplates");
      
      commit("updateIframeTemplateSuccess");
    } catch (err) {
      commit("updateIframeTemplateErr", err);
      throw new Error(`無法更新範本: ${err.message}`);
    }
  },

  /**
   * 刪除 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {number} id - 範本 ID
   */
  async deleteIframeTemplate({ commit, dispatch }, id) {
    try {
      commit("deleteIframeTemplateBegin");
      
      await iframeTemplateApi.deleteTemplate(id);
      
      // 重新載入範本列表
      await dispatch("fetchIframeTemplates");
      
      commit("deleteIframeTemplateSuccess");
    } catch (err) {
      commit("deleteIframeTemplateErr", err);
      throw new Error(`無法刪除範本: ${err.message}`);
    }
  },

  /**
   * 複製 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {Object} params - 參數
   * @param {number} params.id - 要複製的範本 ID
   * @param {string} params.newName - 新範本名稱（選填）
   * @returns {Promise<number>} 新範本的 ID
   */
  async duplicateIframeTemplate({ commit, dispatch }, { id, newName }) {
    try {
      commit("duplicateIframeTemplateBegin");
      
      const newId = await iframeTemplateApi.duplicateTemplate(id, newName);
      
      // 重新載入範本列表
      await dispatch("fetchIframeTemplates");
      
      commit("duplicateIframeTemplateSuccess");
      return newId;
    } catch (err) {
      commit("duplicateIframeTemplateErr", err);
      throw new Error(`無法複製範本: ${err.message}`);
    }
  },

  /**
   * 搜尋 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {string} keyword - 搜尋關鍵字
   * @returns {Promise<Array>} 符合的範本列表
   */
  async searchIframeTemplates({ commit: _commit }, keyword) {
    try {
      const templates = await iframeTemplateApi.searchTemplates(keyword);
      return templates;
    } catch (err) {
      throw new Error(`無法搜尋範本: ${err.message}`);
    }
  },

  /**
   * 匯出 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {number} id - 範本 ID
   * @returns {Promise<Object>} 範本 JSON 物件
   */
  async exportIframeTemplate({ commit: _commit }, id) {
    try {
      const templateJson = await iframeTemplateApi.exportTemplate(id);
      return templateJson;
    } catch (err) {
      throw new Error(`無法匯出範本: ${err.message}`);
    }
  },

  /**
   * 匯入 iframe 範本
   * 
   * @param {Object} context - Vuex context
   * @param {Object} templateJson - 範本 JSON 物件
   * @returns {Promise<number>} 新建範本的 ID
   */
  async importIframeTemplate({ commit, dispatch }, templateJson) {
    try {
      commit("importIframeTemplateBegin");
      
      const templateId = await iframeTemplateApi.importTemplate(templateJson);
      
      // 重新載入範本列表
      await dispatch("fetchIframeTemplates");
      
      commit("importIframeTemplateSuccess");
      return templateId;
    } catch (err) {
      commit("importIframeTemplateErr", err);
      throw new Error(`無法匯入範本: ${err.message}`);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
