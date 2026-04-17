export default {
  getHolidayOptionsBegin(state) {
    state.loading = true;
  },

  getHolidayOptionsSuccess(state) {
    state.loading = false;
  },

  getHolidayOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getHolidayBegin(state) {
    state.loading = true;
  },

  getHolidaySuccess(state, { data, year }) {
    state.loading = false;
    state.holiday = data;
    state.currentYear = year;
  },

  getHolidayErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  importCalendarBegin(state) {
    state.loading = true;
  },

  importCalendarSuccess(state) {
    state.loading = false;
  },

  importCalendarErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  setHolidayBegin(state) {
    state.loading = true;
  },

  setHolidaySuccess(state) {
    state.loading = false;
  },

  setHolidayErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getSeasonListBegin(state) {
    state.loading = true;
  },

  getSeasonListSuccess(state, data) {
    state.seasonInitData = data;
    state.seasonTableData = data;
    state.loading = false;
  },

  getSeasonListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterSeasonBegin(state) {
    state.loading = true;
  },

  filterSeasonSuccess(state, data) {
    state.seasonTableData = data;
    state.loading = false;
  },

  filterSeasonErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addSeasonBegin(state) {
    state.loading = true;
  },

  addSeasonSuccess(state) {
    state.loading = false;
  },

  addSeasonErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editSeasonBegin(state) {
    state.loading = true;
  },

  editSeasonSuccess(state) {
    state.loading = false;
  },

  editSeasonErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteSeasonBegin(state) {
    state.loading = true;
  },

  deleteSeasonSuccess(state) {
    state.loading = false;
  },

  deleteSeasonErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getWorkListBegin(state) {
    state.loading = true;
  },

  getWorkListSuccess(state, data) {
    state.workInitData = data;
    state.workTableData = data;
    state.loading = false;
  },

  getWorkListErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getWorkOptionBegin(state) {
    state.loading = true;
  },

  getWorkOptionSuccess(state) {
    state.loading = false;
  },

  getWorkOptionErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterWorkBegin(state) {
    state.loading = true;
  },

  filterWorkSuccess(state, data) {
    state.workTableData = data;
    state.loading = false;
  },

  filterWorkErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addWorkBegin(state) {
    state.loading = true;
  },

  addWorkSuccess(state) {
    state.loading = false;
  },

  addWorkErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editWorkBegin(state) {
    state.loading = true;
  },

  editWorkSuccess(state) {
    state.loading = false;
  },

  editWorkErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteWorkBegin(state) {
    state.loading = true;
  },

  deleteWorkSuccess(state) {
    state.loading = false;
  },

  deleteWorkErr(state, err) {
    state.loading = false;
    state.error = err;
  },
};
