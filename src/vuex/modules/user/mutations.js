export default {
  getUserListBegin(state) {
    state.loading = true;
  },

  getUserListSuccess(state, data) {
    state.loading = false;
    state.userInitData = data;
    state.userTableData = data;
  },

  getUserListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  // 獲取所有人員列表（包括已停用的）
  getAllUserListBegin(state) {
    state.loading = true;
  },
  getAllUserListSuccess(state, data) {
    state.loading = false;
    state.allUserTableData = data;
  },
  getAllUserListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterUserTableBegin(state) {
    state.loading = true;
  },

  filterUserTableSuccess(state, data) {
    state.loading = false;
    state.userTableData = data;
  },

  filterUserTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getUserListOptionsBegin(state) {
    state.loading = true;
  },

  getUserListOptionsSuccess(state) {
    state.loading = false;
  },

  getUserListOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addUserBegin(state) {
    state.loading = true;
  },

  addUserSuccess(state) {
    state.loading = false;
  },

  addUserErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editUserBegin(state) {
    state.loading = true;
  },

  editUserSuccess(state) {
    state.loading = false;
  },

  editUserErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteUserBegin(state) {
    state.loading = true;
  },

  deleteUserSuccess(state) {
    state.loading = false;
  },

  deleteUserErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  // 重設密碼相關 mutations
  resetUserPasswordBegin(state) {
    state.loading = true;
  },
  resetUserPasswordSuccess(state) {
    state.loading = false;
  },
  resetUserPasswordErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  // 永久刪除用戶相關 mutations
  permanentDeleteUserBegin(state) {
    state.loading = true;
  },
  permanentDeleteUserSuccess(state) {
    state.loading = false;
  },
  permanentDeleteUserErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getRoleListBegin(state) {
    state.loading = true;
  },

  getRoleListSuccess(state, data) {
    state.loading = false;
    state.roleInitData = data;
    state.roleTableData = data;
  },

  getRoleListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getRoleOptionsBegin(state) {
    state.loading = true;
  },

  getRoleOptionsSuccess(state) {
    state.loading = false;
  },

  getRoleOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterRoleTableBegin(state) {
    state.loading = true;
  },

  filterRoleTableSuccess(state, data) {
    state.loading = false;
    state.roleTableData = data;
  },

  filterRoleTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addRoleBegin(state) {
    state.loading = true;
  },

  addRoleSuccess(state) {
    state.loading = false;
  },

  addRoleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editRoleBegin(state) {
    state.loading = true;
  },

  editRoleSuccess(state) {
    state.loading = false;
  },

  editRoleErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteRoleBegin(state) {
    state.loading = true;
  },

  deleteRoleSuccess(state) {
    state.loading = false;
  },

  deleteRoleErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
