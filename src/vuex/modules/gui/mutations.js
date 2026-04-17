export default {
  getOptionsBegin(state) {
    state.loading = true;
  },

  getOptionsSuccess(state, { icons, symbols }) {
    state.loading = false;
    state.customIcon = icons;
    state.symbols = symbols;
  },

  getOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addCustomImgBegin(state) {
    state.loading = true;
  },

  addCustomImgSuccess(state) {
    state.loading = false;
  },

  addCustomImgErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchDetailBegin(state) {
    state.loading = true;
  },

  fetchDetailSuccess(state, data) {
    state.loading = false;
    state.guiDetail = data;
  },

  fetchDetailErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addListBegin(state) {
    state.loading = true;
  },

  addListSuccess(state) {
    state.loading = false;
  },

  addListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editListBegin(state) {
    state.loading = true;
  },

  editListSuccess(state) {
    state.loading = false;
  },

  editListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteListBegin(state) {
    state.loading = true;
  },

  deleteListSuccess(state) {
    state.loading = false;
  },



  deleteListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllPagesBegin(state) {
    state.loading = true;
  },

  getAllPagesSuccess(state, data) {
    state.loading = false;
    const frozen = Object.freeze(data);
    state.settingInitData = frozen;
    state.settingTableData = frozen;
  },

  getAllPagesErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchSettingTableBegin(state) {
    state.loading = true;
  },

  fetchSettingTableSuccess(state, data) {
    state.loading = false;
    state.settingTableData = data;
  },

  fetchSettingTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getSettingChildBegin(state, id) {
    state.loading = true;
    state.classURLs.push(id);
  },

  getSettingChildSuccess(state) {
    state.loading = false;
  },

  getSettingChildErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  guiSettingGoBackBegin(state) {
    state.loading = true;
    state.classURLs.pop();
  },

  guiSettingGoBackSuccess(state) {
    state.loading = false;
  },

  guiSettingGoBackErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterSettingTableBegin(state) {
    state.loading = true;
  },

  filterSettingTableSuccess(state, data) {
    state.loading = false;
    state.settingTableData = data;
  },

  filterSettingTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editSettingBegin(state) {
    state.loading = true;
  },

  editSettingSuccess(state) {
    state.loading = false;
  },

  editSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addSettingBegin(state) {
    state.loading = true;
  },

  addSettingSuccess(state) {
    state.loading = false;
  },

  addSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteSettingBegin(state) {
    state.loading = true;
  },

  deleteSettingSuccess(state) {
    state.loading = false;
  },

  deleteSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  savePictureBegin(state) {
    state.loading = true;
  },

  savePictureSuccess(state) {
    state.loading = false;
  },

  savePictureErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addSymbolBegin(state) {
    state.loading = true;
  },

  addSymbolSuccess(state) {
    state.loading = false;
  },

  addSymbolErr(state, err) {
    state.loading = false;
    state.error = err;
  },
  editSymbolBegin(state) {
    state.loading = true;
  },

  editSymbolSuccess(state) {
    state.loading = false;
  },

  editSymbolErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteSymbolBegin(state) {
    state.loading = true;
  },

  deleteSymbolSuccess(state) {
    state.loading = false;
  },

  deleteSymbolErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getTagTrendBegin(state) {
    state.loading = true;
  },

  getTagTrendSuccess(state) {
    state.loading = false;
  },

  getTagTrendErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  sendTagSignalBegin(state) {
    state.loading = true;
  },

  sendTagSignalSuccess(state) {
    state.loading = false;
  },

  sendTagSignalErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  // OCOGUI 視圖列表相關
  fetchOcoguiViewsBegin(state) {
    state.ocoguiLoading = true;
  },

  fetchOcoguiViewsSuccess(state, { views, serverUrl }) {
    state.ocoguiLoading = false;
    state.ocoguiViews = views;
    state.ocoguiServerUrl = serverUrl;
  },

  fetchOcoguiViewsErr(state, err) {
    state.ocoguiLoading = false;
    state.ocoguiViews = [];
    state.error = err;
  },

  // iframe 配置管理相關
  loadIframeConfigBegin(state) {
    state.loading = true;
  },

  loadIframeConfigSuccess(state, _config) {
    state.loading = false;
    // 可以選擇將配置存入 state，或直接在組件中使用
  },

  loadIframeConfigErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  saveIframeConfigBegin(state) {
    state.loading = true;
  },

  saveIframeConfigSuccess(state) {
    state.loading = false;
  },

  saveIframeConfigErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  // iframe 範本管理相關
  fetchIframeTemplatesBegin(state) {
    state.iframeTemplatesLoading = true;
  },

  fetchIframeTemplatesSuccess(state, templates) {
    state.iframeTemplatesLoading = false;
    state.iframeTemplates = templates;
  },

  fetchIframeTemplatesErr(state, err) {
    state.iframeTemplatesLoading = false;
    state.error = err;
  },

  saveIframeTemplateBegin(state) {
    state.loading = true;
  },

  saveIframeTemplateSuccess(state) {
    state.loading = false;
  },

  saveIframeTemplateErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  updateIframeTemplateBegin(state) {
    state.loading = true;
  },

  updateIframeTemplateSuccess(state) {
    state.loading = false;
  },

  updateIframeTemplateErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteIframeTemplateBegin(state) {
    state.loading = true;
  },

  deleteIframeTemplateSuccess(state) {
    state.loading = false;
  },

  deleteIframeTemplateErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  duplicateIframeTemplateBegin(state) {
    state.loading = true;
  },

  duplicateIframeTemplateSuccess(state) {
    state.loading = false;
  },

  duplicateIframeTemplateErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  importIframeTemplateBegin(state) {
    state.loading = true;
  },

  importIframeTemplateSuccess(state) {
    state.loading = false;
  },

  importIframeTemplateErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
