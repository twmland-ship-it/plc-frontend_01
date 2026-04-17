export default {
  getSettingListBegin(state) {
    state.loading = true;
  },

  getSettingListSuccess(state, data) {
    state.settingListInitData = data;
    state.settingListTableData = data;
    state.loading = false;
  },

  getSettingListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterSettingTableBegin(state) {
    state.loading = true;
  },

  filterSettingTableSuccess(state, data) {
    state.settingListTableData = data;
    state.loading = false;
  },

  filterSettingTableErr(state, err) {
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

  getMeterListBegin(state) {
    state.loading = true;
  },

  getMeterListSuccess(state, data) {
    state.loading = false;
    state.metersInitData = data;
    state.metersTableData = data;
  },

  addMeterBegin(state) {
    state.loading = true;
  },

  addMeterSuccess(state) {
    state.loading = false;
  },

  addMeterErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editMeterBegin(state) {
    state.loading = true;
  },

  editMeterSuccess(state) {
    state.loading = false;
  },

  editMeterErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteMeterBegin(state) {
    state.loading = true;
  },

  deleteMeterSuccess(state) {
    state.loading = false;
  },

  deleteMeterErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterMeterTableBegin(state) {
    state.loading = true;
  },

  filterMeterTableSuccess(state, data) {
    state.metersTableData = data;
    state.loading = false;
  },

  filterMeterTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getMeterListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchGroupsBegin(state) {
    state.loading = true;
  },

  fetchGroupsSuccess(state) {
    state.loading = false;
  },

  fetchGroupsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  calculateVariationBegin(state) {
    state.loading = true;
  },

  calculateVariationSuccess(state, { meters }) {
    state.calculateInitData = meters;
    state.calculateTableData = meters;
    state.loading = false;
  },

  calculateVariationErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  exportVariationBegin(state) {
    state.loading = true;
  },

  exportVariationSuccess(state) {
    state.loading = false;
  },

  exportVariationErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  calculateFeeBegin(state) {
    state.loading = true;
  },

  calculateFeeSuccess(state, { meters, summary }) {
    state.calculateInitData = meters;
    state.calculateTableData = meters;
    state.calculateSummary = summary;
    state.loading = false;
  },

  calculateFeeErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  exportFeeBegin(state) {
    state.loading = true;
  },

  exportFeeSuccess(state) {
    state.loading = false;
  },

  exportFeeErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterCalculateTableBegin(state) {
    state.loading = true;
  },

  filterCalculateTableSuccess(state, data) {
    state.calculateTableData = data;
    state.loading = false;
  },

  filterCalculateTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchFeeListBegin(state) {
    state.loading = true;
  },

  fetchFeeListSuccess(state, data) {
    state.feeListInitData = data;
    state.feeListTableData = data;
    state.loading = false;
  },

  fetchFeeListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchFeeDetailBegin(state) {
    state.loading = true;
  },

  fetchFeeDetailSuccess(state) {
    state.loading = false;
  },

  fetchFeeDetailErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addFeeBegin(state) {
    state.loading = true;
  },

  addFeeSuccess(state) {
    state.loading = false;
  },

  addFeeErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editFeeBegin(state) {
    state.loading = true;
  },

  editFeeSuccess(state) {
    state.loading = false;
  },

  editFeeErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteFeeBegin(state) {
    state.loading = true;
  },

  deleteFeeSuccess(state) {
    state.loading = false;
  },

  deleteFeeErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getScheduleBegin(state) {
    state.loading = true;
  },

  getScheduleSuccess(state, data) {
    state.scheduleInitData = data;
    state.scheduleTableData = data;
    state.loading = false;
  },

  getScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterScheduleBegin(state) {
    state.loading = true;
  },

  filterScheduleSuccess(state, data) {
    state.scheduleTableData = data;
    state.loading = false;
  },

  filterScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addScheduleBegin(state) {
    state.loading = true;
  },

  addScheduleSuccess(state) {
    state.loading = false;
  },

  addScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editScheduleBegin(state) {
    state.loading = true;
  },

  editScheduleSuccess(state) {
    state.loading = false;
  },

  editScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllBillBegin(state) {
    state.loading = true;
  },

  getAllBillSuccess(state, data) {
    state.billListInitData = data;
    state.billListTableData = data;
    state.loading = false;
  },

  getAllBillErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterBillBegin(state) {
    state.loading = true;
  },

  filterBillSuccess(state, data) {
    state.billListTableData = data;
    state.loading = false;
  },

  filterBillErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchAnomalyStatusBegin(state) {
    state.loading = true;
  },

  fetchAnomalyStatusSuccess(state, { anomalyList, anomalyStats }) {
    state.anomalyList = anomalyList;
    state.anomalyStats = anomalyStats;
    state.loading = false;
  },

  fetchAnomalyStatusErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchMeterAnomalyStatusBegin(state) {
    state.loading = true;
  },

  fetchMeterAnomalyStatusSuccess(state, { meterAnomalyList, meterAnomalyStats }) {
    state.meterAnomalyList = meterAnomalyList;
    state.meterAnomalyStats = meterAnomalyStats;
    state.loading = false;
  },

  fetchMeterAnomalyStatusErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
