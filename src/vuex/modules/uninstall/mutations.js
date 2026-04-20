export default {
  getDataBegin(state, { isPoll } = {}) {
    state.fetching = true;
  },

  getDataSuccess(state, data) {
    state.fetching = false;
    state.hasLoadedOnce = true;
    state.initData = data;
    state.tableData = data;
    state.error = null;
    state.fatalError = null;
    state.staleWarning = false;
  },

  getDataErrNoData(state, msg) {
    state.fetching = false;
    state.hasLoadedOnce = true;
    state.error = msg;
    state.fatalError = msg;
    state.staleWarning = false;
    state.initData = [];
    state.tableData = [];
  },

  getDataErrHasData(state, msg) {
    state.fetching = false;
    state.hasLoadedOnce = true;
    state.error = msg;
    state.fatalError = null;
    state.staleWarning = true;
  },

  setNameSortOrder(state, order) {
    if (order === "ascend" || order === "descend") {
      state.nameSortOrder = order;
    }
  },

  getOptionsBegin(state) {
    state.loading = true;
  },

  getOptionsSuccess(state) {
    state.loading = false;
  },

  getOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchTagsByClassBegin(state) {
    state.loading = true;
  },

  fetchTagsByClassSuccess(state) {
    state.loading = false;
  },

  fetchTagsByClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchGroupsByClassBegin(state) {
    state.loading = true;
  },

  fetchGroupsByClassSuccess(state) {
    state.loading = false;
  },

  fetchGroupsByClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterTableDataBegin(state) {
    state.loading = true;
  },

  filterTableDataSuccess(state, data) {
    state.loading = false;
    state.tableData = data;
  },

  filterTableDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getProcessDetailBegin(state) {
    state.loading = true;
  },

  getProcessDetailSuccess(state) {
    state.loading = false;
  },

  getProcessDetailErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addProcessBegin(state) {
    state.loading = true;
  },

  addProcessSuccess(state) {
    state.loading = false;
  },

  addProcessErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editProcessBegin(state) {
    state.loading = true;
  },

  editProcessSuccess(state) {
    state.loading = false;
  },

  editProcessErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteProcessBegin(state) {
    state.loading = true;
  },

  deleteProcessSuccess(state) {
    state.loading = false;
  },

  deleteProcessErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
