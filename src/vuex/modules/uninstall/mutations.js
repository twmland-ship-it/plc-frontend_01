export default {
  getDataBegin(state) {
    state.loading = true;
  },

  getDataSuccess(state, data) {
    state.loading = false;
    state.initData = data;
    state.tableData = data;
  },

  getDataErr(state, err) {
    state.loading = false;
    state.error = err;
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
