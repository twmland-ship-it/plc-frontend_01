export default {
  getLineServiceBegin(state) {
    state.loading = true;
  },

  getLineServiceSuccess(state, data) {
    state.loading = false;
    state.lineServiceInitData = data;
    state.lineServiceTableData = data;
  },

  getLineServiceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterLineServiceListBegin(state) {
    state.loading = true;
  },

  filterLineServiceListSuccess(state, data) {
    state.loading = false;
    state.lineServiceTableData = data;
  },

  filterLineServiceListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addLineServiceBegin(state) {
    state.loading = true;
  },

  addLineServiceSuccess(state) {
    state.loading = false;
  },

  addLineServiceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editLineServiceBegin(state) {
    state.loading = true;
  },

  editLineServiceSuccess(state) {
    state.loading = false;
  },

  editLineServiceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteLineServiceBegin(state) {
    state.loading = true;
  },

  deleteLineServiceSuccess(state) {
    state.loading = false;
  },

  deleteLineServiceErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getSMTPSettingBegin(state) {
    state.loading = true;
  },
  getSMTPSettingSuccess(state, data) {
    state.SMTPSetting = data;
    state.loading = false;
  },

  getProtocolListSuccess(state, data) {
    state.protocolList = data;
  },

  getSMTPSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editSMTPSettingBegin(state) {
    state.loading = true;
  },
  editSMTPSettingSuccess(state) {
    state.loading = false;
  },

  editSMTPSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getGroupsAndOptionsBegin(state) {
    state.loading = true;
  },

  getGroupsAndOptionsSuccess(state, data) {
    state.groupInitData = data;
    state.groupTableData = data;
    state.loading = false;
  },

  getGroupsAndOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterGroupTableBegin(state) {
    state.loading = true;
  },

  filterGroupTableSuccess(state, data) {
    state.groupTableData = data;
    state.loading = false;
  },

  filterGroupTableErr(state, err) {
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

  getMsgHistoryBegin(state) {
    state.loading = true;
  },

  getMsgHistorySuccess(state, data) {
    state.historyMsgIninData = data;
    state.historyMsgTableData = data;
    state.loading = false;
  },

  getMsgHistoryErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterHistoryBegin(state) {
    state.loading = true;
  },

  filterHistorySuccess(state, data) {
    state.historyMsgTableData = data;
    state.loading = false;
  },

  filterHistoryErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getMsgOptionsBegin(state) {
    state.loading = true;
  },

  getMsgOptionsSuccess(state) {
    state.loading = false;
  },

  getMsgOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  sendMsgBegin(state) {
    state.loading = true;
  },

  sendMsgSuccess(state) {
    state.loading = false;
  },

  sendMsgErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
