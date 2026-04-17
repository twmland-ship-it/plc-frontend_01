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

  calculateBegin(state) {
    state.loading = true;
  },

  calculateSuccess(state, { meters }) {
    state.calculateInitData = meters;
    state.calculateTableData = meters;
    // state.calculateSummary = summary;
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
    state.calculateTableData = data;
    state.loading = false;
  },

  filterCalculateTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
