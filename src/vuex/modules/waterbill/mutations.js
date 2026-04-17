export default {
  getMeterListBegin(state) {
    state.loading = true;
  },
  getMeterListSuccess(state, data) {
    state.loading = false;
    state.metersInitData = data;
    state.metersTableData = data;
  },
  getMeterListErr(state, err) {
    state.loading = false;
    state.error = err;
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
    state.loading = false;
    state.metersTableData = data;
  },
  filterMeterTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchFeeListBegin(state) {
    state.loading = true;
  },

  fetchFeeListSuccess(state, data) {
    state.loading = false;
    state.feeListInitData = data;
    state.feeListTableData = data;
  },

  fetchFeeListErr(state, err) {
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

  calculateBegin(state) {
    state.loading = true;
  },
  calculateSuccess(state, { meters, summary }) {
    state.calculateInitData = meters;
    state.calculateTableData = meters;
    state.calculateSummary = summary;
    state.loading = false;
  },
  calculateErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  exportCalculateBegin(state) {
    state.loading = true;
  },

  exportCalculateSuccess(state) {
    state.loading = false;
  },

  exportCalculateErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterCalculateTableBegin(state) {
    state.loading = true;
  },
  filterCalculateTableSuccess(state, data) {
    state.loading = false;
    state.calculateTableData = data;
  },
  filterCalculateTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getScheduleBegin(state) {
    state.loading = true;
  },
  getScheduleSuccess(state, data) {
    state.loading = false;
    state.scheduleInitData = data;
    state.scheduleTableData = data;
  },
  getScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterScheduleBegin(state) {
    state.loading = true;
  },
  filterScheduleSuccess(state, data) {
    state.loading = false;
    state.scheduleTableData = data;
  },
  filterScheduleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getBillListBegin(state) {
    state.loading = true;
  },
  getBillListSuccess(state, data) {
    state.loading = false;
    state.billListInitData = data;
    state.billListTableData = data;
  },
  getBillListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterBillBegin(state) {
    state.loading = true;
  },
  filterBillSuccess(state, data) {
    state.loading = false;
    state.billListTableData = data;
  },
  filterBillErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
