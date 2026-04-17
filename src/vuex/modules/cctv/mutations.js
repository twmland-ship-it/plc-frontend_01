import { clearState } from "../../store.js";
export default {
  getAllCCTVAndOptionsBegin(state) {
    state.loading = true;
  },

  getAllCCTVAndOptionsSuccess(state, data) {
    state.loading = false;
    state.initData = data;
    state.tableData = data;
  },

  getAllCCTVAndOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterDataBegin(state) {
    state.loading = true;
  },

  filterDataSuccess(state, data) {
    state.loading = false;
    state.tableData = data;
  },

  filterDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  importCCTVBegin(state) {
    state.loading = true;
  },

  importCCTVSuccess(state) {
    state.loading = false;
  },

  importCCTVErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addCCTVBegin(state) {
    state.loading = true;
  },
  addCCTVSuccess(state) {
    state.loading = false;
  },

  addCCTVErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editCCTVBegin(state) {
    state.loading = true;
  },

  editCCTVSuccess(state) {
    state.loading = false;
  },

  editCCTVErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteCCTVBegin(state) {
    state.loading = true;
  },

  deleteCCTVSuccess(state) {
    state.loading = false;
  },

  deleteCCTVErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getCCTVImageBegin(state) {
    state.loading = true;
  },

  getCCTVImageSuccess(state) {
    state.loading = false;
  },

  getCCTVImageErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  resetState(state, initState) {
    clearState(state, initState);
  },
};
