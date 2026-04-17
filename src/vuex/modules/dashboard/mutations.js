export default {
  getDashboardBegin(state) {
    state.loading = true;
  },

  getDashboardSuccess(state, data) {
    state.loading = false;
    state.data = Object.freeze(data);
  },

  getDashboardErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addChartBegin(state) {
    state.loading = true;
  },

  addChartSuccess(state) {
    state.loading = false;
  },

  addChartErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editChartBegin(state) {
    state.loading = true;
  },

  editChartSuccess(state) {
    state.loading = false;
  },

  editChartErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteChartBegin(state) {
    state.loading = true;
  },

  deleteChartSuccess(state) {
    state.loading = false;
  },

  deleteChartErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchDetailBegin(state) {
    state.loading = true;
  },

  fetchDetailSuccess(state, data) {
    state.loading = false;
    state.detailInitData = data;
    state.detailTableData = data;
  },

  fetchDetailErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterDetailTableBegin(state) {
    state.loading = true;
  },

  filterDetailTableSuccess(state, data) {
    state.loading = false;
    state.detailTableData = data;
  },

  filterDetailTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
