export default {
  fetchHistoryOptionsBegin(state) {
    state.loading = true;
  },

  fetchHistoryOptionsSuccess(state) {
    state.loading = false;
  },

  fetchHistoryOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getSearchListBegin(state) {
    state.loading = true;
  },

  getSearchListSuccess(state, data) {
    state.commonSearchList = data;
    state.loading = false;
  },

  getSearchListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addSearchBegin(state) {
    state.loading = true;
  },

  addSearchSuccess(state) {
    state.loading = false;
  },

  addSearchErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteSearchBegin(state) {
    state.loading = true;
  },

  deleteSearchSuccess(state) {
    state.loading = false;
  },

  deleteSearchErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getHistoryDataBegin(state) {
    state.loading = true;
  },

  getHistoryDataSuccess(state, data) {
    state.historyInitData = data;
    state.historyTableData = data;
    state.loading = false;
  },

  getHistoryDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  exportHistoryDataBegin(state) {
    state.loading = true;
  },

  exportHistoryDataSuccess(state) {
    state.loading = false;
  },

  exportHistoryDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterHistoryTableBegin(state) {
    state.loading = true;
  },

  filterHistoryTableSuccess(state, data) {
    state.loading = false;
    state.historyTableData = data;
  },

  filterHistoryTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getHistoryScheduleBegin(state) {
    state.loading = true;
  },

  getHistoryScheduleSuccess(state, data) {
    state.historyScheduleInitData = data;
    state.historyScheduleTableData = data;
    state.loading = false;
  },

  getHistoryScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterHistoryScheduleBegin(state) {
    state.loading = true;
  },

  filterHistoryScheduleSuccess(state, data) {
    state.historyScheduleTableData = data;
    state.loading = false;
  },

  filterHistoryScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addHistoryScheduleBegin(state) {
    state.loading = true;
  },

  addHistoryScheduleSuccess(state) {
    state.loading = false;
  },

  addHistoryScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editHistoryScheduleBegin(state) {
    state.loading = true;
  },

  editHistoryScheduleSuccess(state) {
    state.loading = false;
  },

  editHistoryScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteHistoryScheduleBegin(state) {
    state.loading = true;
  },

  deleteHistoryScheduleSuccess(state) {
    state.loading = false;
  },

  deleteHistoryScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllHistoryDownloadBegin(state) {
    state.loading = true;
  },

  getAllHistoryDownloadSuccess(state, data) {
    state.historyDownloadInitData = data;
    state.historyDownloadTableData = data;
    state.loading = false;
  },

  getAllHistoryDownloadErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterHistoryDownloadBegin(state) {
    state.loading = true;
  },

  filterHistoryDownloadSuccess(state, data) {
    state.historyDownloadTableData = data;
    state.loading = false;
  },

  filterHistoryDownloadErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchRealtimeDataBegin(state) {
    state.loading = true;
  },

  fetchRealtimeDataSuccess(state, data) {
    state.realtimeInitData = data;
    state.realtimeTableData = data;
    state.loading = false;
  },

  fetchRealtimeDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterRealtimeTableBegin(state) {
    state.loading = true;
  },

  filterRealtimeTableSuccess(state, data) {
    state.realtimeTableData = data;
    state.loading = false;
  },

  filterRealtimeTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchRuntimeOptionsBegin(state) {
    state.loading = true;
  },

  fetchRuntimeOptionsSuccess(state) {
    state.loading = false;
  },

  fetchRuntimeOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getRuntimeCommonSearchBegin(state) {
    state.loading = true;
  },

  getRuntimeCommonSearchSuccess(state, data) {
    state.runtimeCommonSearchList = data;
    state.loading = false;
  },

  getRuntimeCommonSearchErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addRuntimeCommonSearchBegin(state) {
    state.loading = true;
  },

  addRuntimeCommonSearchSuccess(state) {
    state.loading = false;
  },

  addRuntimeCommonSearchErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteRuntimeCommonSearchBegin(state) {
    state.loading = true;
  },

  deleteRuntimeCommonSearchSuccess(state) {
    state.loading = false;
  },

  deleteRuntimeCommonSearchErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getRuntimeDataBegin(state) {
    state.loading = true;
  },

  getRuntimeDataSuccess(state, data) {
    state.runtimeInitData = data;
    state.runtimeTableData = data;
    state.loading = false;
  },

  getRuntimeDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterRuntimeTableBegin(state) {
    state.loading = true;
  },

  filterRuntimeTableSuccess(state, data) {
    state.runtimeTableData = data;
    state.loading = false;
  },

  filterRuntimeTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  resetRuntimeBegin(state) {
    state.loading = true;
  },

  resetRuntimeSuccess(state) {
    state.loading = false;
  },

  resetRuntimeErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getCustomReportListBegin(state) {
    state.loading = true;
  },

  getCustomReportListSuccess(state, data) {
    state.customReportList = data;
    state.loading = false;
  },

  getCustomReportListErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
