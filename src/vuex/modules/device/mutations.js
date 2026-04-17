import { clearState } from "../../store.js";
export default {
  getAllDeviceAndOptionsBegin(state) {
    state.loading = true;
  },

  getAllDeviceAndOptionsSuccess(state, data) {
    state.deviceInitData = data;
    state.deviceTableData = data;
    state.loading = false;
  },

  getAllDeviceAndOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterDeviceBegin(state) {
    state.loading = true;
  },

  filterDeviceSuccess(state, data) {
    state.deviceTableData = data;
    state.loading = false;
  },

  filterDeviceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addDeviceBegin(state) {
    state.loading = true;
  },

  addDeviceSuccess(state) {
    state.loading = false;
  },

  addDeviceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editDeviceBegin(state) {
    state.loading = true;
  },

  editDeviceSuccess(state) {
    state.loading = false;
  },

  editDeviceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteDeviceBegin(state) {
    state.loading = true;
  },

  deleteDeviceSuccess(state) {
    state.loading = false;
  },

  deleteDeviceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllClassBegin(state) {
    state.loading = true;
  },

  getAllClassSuccess(state, data) {
    state.classTableData = data;
    state.classCurrentData = data;
    state.classInitData = data;
    state.loading = false;
  },

  getAllClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchClassBegin(state) {
    state.loading = true;
  },

  fetchClassSuccess(state, data) {
    state.classTableData = data;
    state.classCurrentData = data;
    state.loading = false;
  },

  fetchClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getClassChildBegin(state, { id, name }) {
    state.classURLs.push({ id, name });
    state.loading = true;
  },

  getClassChildSuccess(state) {
    state.loading = false;
  },

  getClassChildErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  classGobackBegin(state) {
    state.loading = true;
    state.classURLs.pop();
  },

  classGobackSuccess(state) {
    state.loading = false;
  },

  classGobackErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterClassTableBegin(state) {
    state.loading = true;
  },

  filterClassTableSuccess(state, data) {
    state.loading = false;
    state.classTableData = data;
  },

  filterClassTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addClassBegin(state) {
    state.loading = true;
  },

  addClassSuccess(state) {
    state.loading = false;
  },

  addClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editClassBegin(state) {
    state.loading = true;
  },

  editClassSuccess(state) {
    state.loading = false;
  },

  editClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteClassBegin(state) {
    state.loading = true;
  },

  deleteClassSuccess(state) {
    state.loading = false;
  },

  deleteClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  importTagBegin(state) {
    state.loading = true;
  },

  importTagSuccess(state) {
    state.loading = false;
  },

  importTagErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getCompareTableBegin(state) {
    state.loading = true;
  },

  getCompareTableSuccess(state) {
    state.loading = false;
  },

  getCompareTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  compareTagsBegin(state) {
    state.loading = true;
  },

  compareTagsSuccess(state) {
    state.loading = false;
  },

  compareTagsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  resetState(state, initState) {
    clearState(state, initState);
  },
};
