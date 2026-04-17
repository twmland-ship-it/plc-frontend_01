import mutations from "./mutations";
import schedule from "@/demoData/schedule.json";
import { useDatatableFilter } from "@/composable/filter.js";
const state = () => {
  return {
    loading: false,
    error: null,
    currentYear: "",
    holiday: [],
    seasonInitData: [],
    seasonTableData: [],
    workInitData: [],
    workTableData: [],
  };
};

const actions = {
  async getHolidayOptions({ commit }) {
    try {
      commit("getHolidayOptionsBegin");
      // call api
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(schedule.holidayOptions);
        }, 500)
      );
      commit("getHolidayOptionsSuccess");
      return res;
    } catch (err) {
      commit("getHolidayOptionsErr", err);
      throw new Error(err);
    }
  },
  async getHoliday({ commit }, year) {
    try {
      commit("getHolidayBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("getHoliday", year);
          resolve();
        }, 500)
      );
      commit("getHolidaySuccess", { data: schedule.holiday, year });
    } catch (err) {
      commit("getHolidayErr", err);
      throw new Error(err);
    }
  },
  async importCalendar({ state, commit, dispatch }, file) {
    try {
      commit("importCalendarBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("importCalendar", file);
          resolve();
        }, 500)
      );
      dispatch("getHoliday", state.currentYear);
      commit("importCalendarSuccess");
    } catch (err) {
      commit("importCalendarErr", err);
      throw new Error(err);
    }
  },
  async setHoliday({ state, commit, dispatch }, params) {
    try {
      commit("setHolidayBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("setHoliday", params);
          resolve();
        }, 500)
      );
      dispatch("getHoliday", state.currentYear);
      commit("setHolidaySuccess");
    } catch (err) {
      commit("setHolidayErr", err);
      throw new Error(err);
    }
  },
  async getSeasonList({ commit }) {
    try {
      commit("getSeasonListBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
      commit("getSeasonListSuccess", schedule.season);
    } catch (err) {
      commit("getSeasonListErr", err);
      throw new Error(err);
    }
  },

  filterSeason({ state, commit }, searchText) {
    try {
      commit("filterSeasonBegin");
      const res = useDatatableFilter(state.seasonInitData, searchText);
      commit("filterSeasonSuccess", res);
    } catch (err) {
      commit("filterSeasonErr", err);
      throw new Error(err);
    }
  },

  async addSeason({ commit, dispatch }, params) {
    try {
      commit("addSeasonBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("addSeason", params);
          resolve();
        }, 500)
      );
      dispatch("getSeasonList");
      commit("addSeasonSuccess");
    } catch (err) {
      commit("addSeasonErr", err);
      throw new Error(err);
    }
  },

  async editSeason({ commit, dispatch }, params) {
    try {
      commit("editSeasonBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("editSeason", params);
          resolve();
        }, 500)
      );
      dispatch("getSeasonList");
      commit("editSeasonSuccess");
    } catch (err) {
      commit("editSeasonErr", err);
      throw new Error(err);
    }
  },

  async deleteSeason({ commit, dispatch }, id) {
    try {
      commit("deleteSeasonBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("deleteSeason", id);
          resolve();
        }, 500)
      );
      dispatch("getSeasonList");
      commit("deleteSeasonSuccess");
    } catch (err) {
      commit("deleteSeasonErr", err);
      throw new Error(err);
    }
  },

  async getWorkList({ commit }) {
    try {
      commit("getWorkListBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
      commit("getWorkListSuccess", schedule.schedule);
    } catch (err) {
      commit("getWorkListErr", err);
      throw new Error(err);
    }
  },

  async getWorkOption({ commit }) {
    try {
      commit("getWorkOptionBegin");
      // call api
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(schedule.scheduleOptions);
        }, 500)
      );
      commit("getWorkOptionSuccess");
      return res;
    } catch (err) {
      commit("getWorkOptionErr", err);
      throw new Error(err);
    }
  },

  filterWork({ state, commit }, searchText) {
    try {
      commit("filterWorkBegin");
      const res = useDatatableFilter(state.workInitData, searchText);
      commit("filterWorkSuccess", res);
    } catch (err) {
      commit("filterWorkErr", err);
      throw new Error(err);
    }
  },

  async addWork({ commit, dispatch }, params) {
    try {
      commit("addWorkBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("addWork", params);
          resolve();
        }, 500)
      );
      await dispatch("getWorkList");
      commit("addWorkSuccess");
    } catch (err) {
      commit("addWorkErr", err);
      throw new Error(err);
    }
  },

  async editWork({ commit, dispatch }, params) {
    try {
      commit("editWorkBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("editWork", params);
          resolve();
        }, 500)
      );
      await dispatch("getWorkList");
      commit("editWorkSuccess");
    } catch (err) {
      commit("editWorkErr", err);
      throw new Error(err);
    }
  },

  async deleteWork({ commit, dispatch }, id) {
    try {
      commit("deleteWorkBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("deleteWork", id);
          resolve();
        }, 500)
      );
      await dispatch("getWorkList");
      commit("deleteWorkSuccess");
    } catch (err) {
      commit("deleteWorkErr", err);
      throw new Error(err);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
