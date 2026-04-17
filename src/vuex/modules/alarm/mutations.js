export default {
  checkAlarmBegin(state) {
    state.loading = true;
  },

  checkAlarmSuccess(state) {
    state.loading = false;
  },

  checkAlarmErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getHistoryOptionsBegin(state) {
    state.loading = true;
  },

  getHistoryOptionsSuccess(state, data) {
    state.loading = false;
    state.historyOptions = data;
  },

  getHistoryOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchHistoryBegin(state) {
    state.loading = true;
  },

  fetchHistorySuccess(state, data) {
    state.loading = false;
    state.historyInitData = data;
    state.historyTableData = data;
  },

  fetchHistoryErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterHistoryBegin(state) {
    state.loading = true;
  },

  filterHistorySuccess(state, data) {
    state.loading = false;
    state.historyTableData = data;
  },

  filterHistoryErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getReliabilityGroupsBegin(state) {
    state.loading = true;
  },

  getReliabilityGroupsSuccess(state, data) {
    state.loading = false;
    state.reliabilityGroup = data;
  },

  getReliabilityGroupsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchReliabilityDataBegin(state) {
    state.loading = true;
  },

  fetchReliabilityDataSuccess(state, data) {
    state.loading = false;
    state.reliabilityInitData = data;
    state.reliabilityTableData = data;
  },

  fetchReliabilityDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterReliabilityDataBegin(state) {
    state.loading = true;
  },

  filterReliabilityDataSuccess(state, data) {
    state.loading = false;
    state.reliabilityTableData = data;
  },

  filterReliabilityDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  resetReliabiliyCountBegin(state) {
    state.loading = true;
  },

  resetReliabiliyCountSuccess(state) {
    state.loading = false;
  },

  resetReliabiliyCountErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addReliabiliyGroupBegin(state) {
    state.loading = true;
  },

  addReliabiliyGroupSuccess(state) {
    state.loading = false;
  },

  addReliabiliyGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editReliabiliyGroupBegin(state) {
    state.loading = true;
  },

  editReliabiliyGroupSuccess(state) {
    state.loading = false;
  },

  editReliabiliyGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteReliabiliyGroupBegin(state) {
    state.loading = true;
  },

  deleteReliabiliyGroupSuccess(state) {
    state.loading = false;
  },

  deleteReliabiliyGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  // 可靠度分析相關 mutations
  getReliabilityAnalysisBegin(state) {
    state.reliabilityAnalysisLoading = true;
  },

  getReliabilityAnalysisSuccess(state, data) {
    state.reliabilityAnalysisLoading = false;
    state.reliabilityAnalysisData = data;
  },

  getReliabilityAnalysisErr(state, err) {
    state.reliabilityAnalysisLoading = false;
    state.error = err;
  },
};
