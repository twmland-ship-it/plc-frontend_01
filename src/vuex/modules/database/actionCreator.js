import mutations from "./mutations";
import historyData from "@/demoData/database-history.json";
import newHistoryData from "@/demoData/database-history-new.json";
import tagClass from "@/demoData/tag-class.json";
import groupClass from "@/demoData/group-class.json";
import { useDatatableFilter } from "@/composable/filter.js";
import locations from "@/demoData/location.json";
import { DataService } from "@/config/dataService/dataService";
import dayjs from "dayjs";
import { useUUID } from "@/composable/uuid.js";
import useExporter from "@/composable/exporter";
const state = () => ({
  error: null,
  loading: false,
  historyTableData: [],
  historyInitData: [],
  historyScheduleInitData: [],
  historyScheduleTableData: [],
  historyDownloadInitData: [],
  historyDownloadTableData: [],
  commonSearchList: [],
  realtimeInitData: [],
  realtimeTableData: [],
  runtimeInitData: [],
  runtimeTableData: [],
  runtimeCommonSearchList: [],
});

const actions = {
  async fetchDatabaseHistoryOptions({ commit }) {
    try {
      commit("fetchHistoryOptionsBegin");
      const apiRes = await DataService.get(
        `/api/Statistic/GetStatisticParameter`
      );
      commit("fetchHistoryOptionsSuccess");
      return {
        searchType: apiRes.data.Detail.SearchConditionList,
        summaryType: apiRes.data.Detail.StatisticalMethodsList,
        periodType: apiRes.data.Detail.DurationList,
        schedulePeriod: apiRes.data.Detail.ScheduleDurationList,
      };
    } catch (err) {
      commit("fetchHistoryOptionsErr", err);
      throw new Error(err);
    }
  },

  async getSearchList({ commit }) {
    try {
      commit("getSearchListBegin");
      const apiRes = await DataService.get(
        `/api/frontend-setting/category/historySearch`
      );
      commit("getSearchListSuccess", apiRes.data.Detail.FrontendSettings);
    } catch (err) {
      commit("getSearchListErr", err);
      throw new Error(err);
    }
  },

  async addSearch({ commit, dispatch }, value) {
    try {
      commit("addSearchBegin");
      await DataService.post(
        `/api/frontend-setting/category/historySearch`,
        {
          Key: useUUID(),
          Value: value,
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("getSearchList");
      commit("addSearchSuccess");
    } catch (err) {
      commit("addSearchErr", err);
      throw new Error(err);
    }
  },

  async deleteSearch({ commit, dispatch }, id) {
    try {
      commit("deleteSearchBegin");
      await DataService.delete(
        `/api/frontend-setting/category/historySearch/key/${id}`
      );
      await dispatch("getSearchList");
      commit("deleteSearchSuccess");
    } catch (err) {
      commit("deleteSearchErr", err);
      throw new Error(err);
    }
  },

  async getHistoryData(
    { commit },
    { searchType, date, reportSummary, reportType, tags }
  ) {
    try {
      commit("getHistoryDataBegin");
      const apiRes = await DataService.post(
        `/api/history-report/tag-statistic-summaries/search/report-type:${reportType}`,
        {
          TagIds: tags.map((el) => el.id),
          StatisticMethod: reportSummary,
          From: dayjs(date[0]).format("YYYY-MM-DD"),
          To: dayjs(date[1]).format("YYYY-MM-DD"),
        },
        {
          "Content-Type": "application/json",
        }
      );
      if (searchType === "對比報表") {
        commit("getHistoryDataSuccess", newHistoryData.compareData);
      } else {
        commit("getHistoryDataSuccess", apiRes.data.Detail);
      }
    } catch (err) {
      commit("getHistoryDataErr", err);
      throw new Error(err);
    }
  },

  async exportHistoryData(
    { commit },
    { data, columns, fileName, worksheetName, importFile }
  ) {
    try {
      commit("exportHistoryDataBegin");
      // const importData=
      const exportColumns = columns.map((el) => ({
        header: el.title,
        key: el.key,
      }));
      useExporter({
        rowData: data,
        rowColumns: exportColumns,
        fileName,
        importFile,
        worksheetName,
      });
      // const res = await DataService.post(
      //   `/api/history-report/tag-statistic-summaries/search/report-type:${reportType}/export`,
      //   {
      //     TagIds: tags.map((el) => el.id),
      //     StatisticMethod: reportSummary,
      //     From: dayjs(date[0]).format("YYYY-MM-DD"),
      //     To: dayjs(date[1]).format("YYYY-MM-DD"),
      //     ReplaceTagNames: tags.reduce((acc, curr) => {
      //       if (curr.value) {
      //         acc[curr.id] = curr.value;
      //       }
      //       return acc;
      //     }, {}),
      //   },
      //   {
      //     "Content-Type": "application/json",
      //   },
      //   "blob"
      // );

      // const url = window.URL.createObjectURL(
      //   new Blob([res.data], {
      //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //   })
      // );
      // const link = document.createElement("a");
      // link.href = url;
      // document.body.appendChild(link);
      // link.setAttribute("download", fileName);
      // link.click();

      commit("exportHistoryDataSuccess");
    } catch (err) {
      commit("exportHistoryDataErr", err);
      throw new Error(err);
    }
  },

  filterDatabaseHistoryTable({ state, commit }, searchText) {
    try {
      commit("filterHistoryTableBegin");
      const res = useDatatableFilter(state.historyInitData, searchText, {
        deep: true,
      });

      commit("filterHistoryTableSuccess", res);
    } catch (err) {
      commit("filterHistoryTableErr", err);
      throw new Error(err);
    }
  },

  async getHistorySchedule({ commit }) {
    try {
      commit("getHistoryScheduleBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          commit("getHistoryScheduleSuccess", historyData.schedule);
          resolve();
        }, 500)
      );
    } catch (err) {
      commit("getHistoryScheduleErr", err);
      throw new Error(err);
    }
  },

  filterHistorySchedule({ state, commit }, searchText) {
    try {
      commit("filterHistoryScheduleBegin");
      const res = useDatatableFilter(
        state.historyScheduleInitData,
        searchText,
        {
          deep: true,
        }
      );

      commit("filterHistoryScheduleSuccess", res);
    } catch (err) {
      commit("filterHistoryScheduleErr", err);
      throw new Error(err);
    }
  },

  async addHistorySchedule({ commit, dispatch }, params) {
    try {
      commit("addHistoryScheduleBegin");
      console.log("addHistorySchedule", params);
      await dispatch("getHistorySchedule");
      commit("addHistoryScheduleSuccess");
    } catch (err) {
      commit("addHistoryScheduleErr", err);
      throw new Error(err);
    }
  },

  async editHistorySchedule({ commit, dispatch }, params) {
    try {
      commit("editHistoryScheduleBegin");
      console.log("editHistorySchedule", params);
      await dispatch("getHistorySchedule");
      commit("editHistoryScheduleSuccess");
    } catch (err) {
      commit("editHistoryScheduleErr", err);
      throw new Error(err);
    }
  },

  async deleteHistorySchedule({ commit, dispatch }, params) {
    try {
      commit("deleteHistoryScheduleBegin");
      console.log("deleteHistorySchedule", params);
      await dispatch("getHistorySchedule");
      commit("deleteHistoryScheduleSuccess");
    } catch (err) {
      commit("deleteHistoryScheduleErr", err);
      throw new Error(err);
    }
  },

  async getAllHistoryDownload({ commit }) {
    try {
      commit("getAllHistoryDownloadBegin");
      commit("getAllHistoryDownloadSuccess", historyData.download);
    } catch (err) {
      commit("getAllHistoryDownloadErr", err);
      throw new Error(err);
    }
  },

  filterHistoryDownload({ state, commit }, searchText) {
    try {
      commit("filterHistoryDownloadBegin");
      const res = useDatatableFilter(state.historyDownloadInitData, searchText);

      commit("filterHistoryDownloadSuccess", res);
    } catch (err) {
      commit("filterHistoryDownloadErr", err);
      throw new Error(err);
    }
  },

  async fetchRealtimeData({ commit }, params) {
    try {
      commit("fetchRealtimeDataBegin");
      const apiRes = await DataService.post(
        `/api/Statistic/GetRealTimeStaisticSummary`,
        {
          TagIdList: params.tag.map((el) => el.id),
        }
      );
      commit("fetchRealtimeDataSuccess", apiRes.data.Detail.ValueList);
    } catch (err) {
      commit("fetchRealtimeDataErr", err);
      throw new Error(err);
    }
  },

  filterRealtimeTable({ commit, state }, searchText) {
    try {
      commit("filterRealtimeTableBegin");
      const res = useDatatableFilter(state.realtimeInitData, searchText);

      commit("filterRealtimeTableSuccess", res);
    } catch (err) {
      commit("filterRealtimeTableErr", err);
      throw new Error(err);
    }
  },

  async fetchRuntimeOptions({ commit }) {
    try {
      commit("fetchRuntimeOptionsBegin");
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            tagClass: tagClass.data,
            groupClass: groupClass.data,
            locations: locations.data,
          });
        }, 500)
      );

      commit("fetchRuntimeOptionsSuccess");
      return res;
    } catch (err) {
      commit("fetchRuntimeOptionsErr", err);
      throw new Error(err);
    }
  },
  async getRuntimeCommonSearch({ commit }) {
    try {
      commit("getRuntimeCommonSearchBegin");
      const apiRes = await DataService.get(
        `/api/frontend-setting/category/runtimeSearch`
      );

      commit(
        "getRuntimeCommonSearchSuccess",
        apiRes.data.Detail.FrontendSettings
      );
    } catch (err) {
      commit("getRuntimeCommonSearchErr", err);
      throw new Error(err);
    }
  },

  async addRuntimeCommonSearch({ commit, dispatch }, value) {
    try {
      commit("addRuntimeCommonSearchBegin");
      await DataService.post(
        `/api/frontend-setting/category/runtimeSearch`,
        {
          Key: useUUID(),
          Value: value,
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("getRuntimeCommonSearch");
      commit("addRuntimeCommonSearchSuccess");
    } catch (err) {
      commit("addRuntimeCommonSearchErr", err);
      throw new Error(err);
    }
  },

  async deleteRuntimeCommonSearch({ commit, dispatch }, id) {
    try {
      commit("deleteRuntimeCommonSearchBegin");
      await DataService.delete(
        `/api/frontend-setting/category/runtimeSearch/key/${id}`
      );
      await dispatch("getRuntimeCommonSearch");
      commit("deleteRuntimeCommonSearchSuccess");
    } catch (err) {
      commit("deleteRuntimeCommonSearchErr", err);
      throw new Error(err);
    }
  },

  async getRuntimeData({ commit }, params) {
    try {
      commit("getRuntimeDataBegin");
      const apiRes = await DataService.post(
        `/api/System/GetOperatingHourList`,
        {
          TagIdList: params.tags.map((el) => el.id),
        }
      );
      commit("getRuntimeDataSuccess", apiRes.data.Detail.DetailList);
    } catch (err) {
      commit("getRuntimeDataErr", err);
      throw err;
    }
  },

  filterRuntimeTable({ commit, state }, searchText) {
    try {
      commit("filterRuntimeTableBegin");
      const res = useDatatableFilter(state.runtimeInitData, searchText);

      commit("filterRuntimeTableSuccess", res);
    } catch (err) {
      commit("filterRuntimeTableErr", err);
      throw new Error(err);
    }
  },

  async resetRuntime({ commit }, id) {
    try {
      commit("resetRuntimeBegin");
      await DataService.post(`/api/System/ResetOperationgHour`, {
        TagId: id,
      });
      commit("resetRuntimeSuccess");
    } catch (err) {
      commit("resetRuntimeErr", err);
      throw new Error(err);
    }
  },
  async getCustomReportList({ commit }) {
    try {
      commit("getCustomReportListBegin");
      const apiRes = await DataService.get(
        `/api/frontend-setting/category/customReportList`
      );

      commit("getCustomReportListSuccess");
      return apiRes.data.Detail.FrontendSettings.length > 0
        ? JSON.parse(apiRes.data.Detail.FrontendSettings[0].Value)
        : [];
    } catch (err) {
      commit("getCustomReportListErr", err);
      throw new Error(err);
    }
  },

  async exportCustomReport({ commit }, params) {
    try {
      commit("exportCustomReportBegin");
      const res = await DataService.post(
        `/api/history-report/statistic-summaries/combine/search/report-type:${params.ReportType}/export`,
        {
          ...params,
          ElectricityFeeQueryCondition: {},
        },
        {
          "Content-Type": "application/json",
        },
        "blob"
      );
      useExporter("工作表2", res.data);

      // const url = window.URL.createObjectURL(
      //   new Blob([res.data], {
      //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      //   })
      // );
      // const link = document.createElement("a");
      // link.href = url;
      // document.body.appendChild(link);
      // link.setAttribute(
      //   "download",
      //   `${params.FileName}_${dayjs().format("YYYYMMDDHH")}.xlsx`
      // );
      // link.click();
      commit("exportCustomReportSuccess");
    } catch (err) {
      commit("exportCustomReportErr", err);
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
