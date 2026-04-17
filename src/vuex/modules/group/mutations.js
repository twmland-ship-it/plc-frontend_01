import { clearState } from "../../store.js";
export default {
  getAllGroupsAndOptionsBegin(state) {
    state.loading = true;
  },

  getAllGroupsAndOptionsSuccess(state, { data }) {
    state.groupInitData = data;
    state.groupTableData = data;
    state.loading = false;
  },

  getAllGroupsAndOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchGroupBegin(state) {
    state.loading = true;
  },

  fetchGroupSuccess(state, data) {
    state.loading = false;
    state.groupInitData = data;
    state.groupTableData = data;
  },

  fetchGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterGroupBegin(state) {
    state.loading = true;
  },

  filterGroupSuccess(state, data) {
    state.loading = false;
    state.groupTableData = data;
  },

  filterGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addGroupBegin(state) {
    state.loading = true;
  },

  addGroupSuccess(state) {
    state.loading = false;
  },

  addGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editGroupBegin(state) {
    state.loading = true;
  },

  editGroupSuccess(state) {
    state.loading = false;
  },

  editGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteGroupBegin(state) {
    state.loading = true;
  },

  deleteGroupSuccess(state) {
    state.loading = false;
  },

  deleteGroupErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllClassBegin(state) {
    state.loading = true;
  },

  getAllClassSuccess(state, data) {
    state.loading = false;
    state.groupClassTableData = data;
    state.groupClassCurrentData = data;
    state.groupClassInitData = data;
  },

  getAllClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchClassBegin(state) {
    state.loading = true;
  },

  fetchClassSuccess(state, data) {
    state.loading = false;
    state.groupClassCurrentData = data;
    state.groupClassTableData = data;
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

  filterGroupClassBegin(state) {
    state.loading = true;
  },

  filterGroupClassSuccess(state, data) {
    state.loading = false;
    state.groupClassTableData = data;
  },

  filterGroupClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addGroupClassBegin(state) {
    state.loading = true;
  },

  addGroupClassSuccess(state) {
    state.loading = false;
  },

  addGroupClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editGroupClassBegin(state) {
    state.loading = true;
  },

  editGroupClassSuccess(state) {
    state.loading = false;
  },

  editGroupClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteGroupClassBegin(state) {
    state.loading = true;
  },

  deleteGroupClassSuccess(state) {
    state.loading = false;
  },

  deleteGroupClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchGroupTagsBegin() {},

  fetchGroupTagsSuccess(state, data) {
    state.groupTags = data;
  },

  fetchGroupTagsErr(state, err) {
    state.error = err;
  },

  editGroupTagsBegin(state) {
    state.loading = true;
  },

  editGroupTagsSuccess(state) {
    state.loading = false;
  },

  editGroupTagsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  resetState(state, initState) {
    clearState(state, initState);
  },
};
