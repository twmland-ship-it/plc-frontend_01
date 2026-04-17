import mutations from "./mutations";
import { useDatatableFilter } from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
import dayjs from "dayjs";
const state = () => ({
  loading: false,
  error: null,
  historyInitData: [],
  historyTableData: [],
  reliabilityGroup: [],
  reliabilityInitData: [],
  reliabilityTableData: [],
  reliabilityAnalysisLoading: false,
  reliabilityAnalysisData: null,
});

const actions = {
  async checkAlarm({ commit }, id) {
    try {
      commit("checkAlarmBegin");
      let params;
      if (id) {
        params = {
          AcknowledgeTarget: 2,
          AlarmSummaryId: id,
        };
      } else {
        params = {
          AcknowledgeTarget: 1,
        };
      }
      await DataService.post(`/api/Alarm/AcknowledgeAlarm`, params);
      commit("checkAlarmSuccess");
    } catch (err) {
      commit("checkAlarmErr", err);
      throw new Error(err);
    }
  },
  async getHistoryOptions({ commit }) {
    try {
      commit("getHistoryOptionsBegin");
      const apiRes = await DataService.get(
        `/api/Alarm/GetAlarmHistoryParameter`
      );
      commit("getHistoryOptionsSuccess");
      return {
        searchType: apiRes.data.Detail.QueryConditionList,
      };
    } catch (err) {
      commit("getHistoryOptionsErr", err);
      throw new Error(err);
    }
  },

  async fetchAlarmHistory({ commit }, { searchType, tags, date }) {
    try {
      commit("fetchHistoryBegin");
      const apiRes = await DataService.post(
        `/api/Alarm/GetAlarmHistoryResult`,
        {
          SearchCondition: searchType,
          TargetIdList: tags.map((el) => el.id),
          StartTime: date ? dayjs(date[0]).startOf("day").format("YYYY-MM-DD HH:mm:ss") : dayjs().subtract(7, 'day').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          EndTime: date ? dayjs(date[1]).endOf("day").format("YYYY-MM-DD HH:mm:ss") : dayjs().endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        }
      );
      commit("fetchHistorySuccess", apiRes.data.Detail.AlarmDetailList);
    } catch (err) {
      commit("fetchHistoryErr", err);
      throw new Error(err);
    }
  },

  filterAlarmHistory({ state, commit }, searchText) {
    try {
      commit("filterHistoryBegin");
      const res = useDatatableFilter(state.historyInitData, searchText);
      commit("filterHistorySuccess", res);
    } catch (err) {
      commit("filterHistoryErr", err);
      throw new Error(err);
    }
  },

  async getReliabilityGroups({ commit }) {
    try {
      commit("getReliabilityGroupsBegin");
      const apiRes = await DataService.get(`/api/ReliabilityAnalysis/groups`);
      commit(
        "getReliabilityGroupsSuccess",
        apiRes.data.Detail.ReliabilityAnalysisGroups
      );
    } catch (err) {
      commit("getReliabilityGroupsErr", err);
      throw new Error(err);
    }
  },

  async resetReliabiliyCount({ commit, dispatch }, id) {
    try {
      commit("resetReliabiliyCountBegin");
      await DataService.post(
        `/api/ReliabilityAnalysis/group/${id}/faultrecord/reset`
      );
      commit("resetReliabiliyCountSuccess");
      await dispatch("getReliabilityGroups");
    } catch (err) {
      commit("resetReliabiliyCountErr", err);
      throw new Error(err);
    }
  },

  async addReliabiliyGroup(
    { commit, dispatch },
    { count, groups, name, tags }
  ) {
    try {
      commit("addReliabiliyGroupBegin");
      await DataService.post(
        `/api/ReliabilityAnalysis/group`,
        {
          ReliabilityAnalysisGroupName: name,
          FaultToleranceCount: count,
          TagGroups: groups,
          Tags: tags,
        },
        {
          "Content-Type": "application/json",
        }
      );
      commit("addReliabiliyGroupSuccess");
      await dispatch("getReliabilityGroups");
    } catch (err) {
      commit("addReliabiliyGroupErr", err);
      throw new Error(err);
    }
  },

  async editReliabiliyGroup(
    { commit, dispatch },
    { id, count, groups, name, tags }
  ) {
    try {
      commit("editReliabiliyGroupBegin");
      await DataService.put(
        `/api/ReliabilityAnalysis/group/${id}`,
        {
          ReliabilityAnalysisGroupName: name,
          FaultToleranceCount: count,
          TagGroups: groups,
          Tags: tags,
        },
        {
          "Content-Type": "application/json",
        }
      );
      commit("editReliabiliyGroupSuccess");
      await dispatch("getReliabilityGroups");
    } catch (err) {
      commit("editReliabiliyGroupErr", err);
      throw new Error(err);
    }
  },

  async deleteReliabiliyGroup({ commit, dispatch }, id) {
    try {
      commit("deleteReliabiliyGroupBegin");
      await DataService.delete(`/api/ReliabilityAnalysis/group/${id}`, null);
      commit("deleteReliabiliyGroupSuccess");
      await dispatch("getReliabilityGroups");
    } catch (err) {
      commit("deleteReliabiliyGroupErr", err);
      throw new Error(err);
    }
  },

  async fetchReliabilityDetail({ commit }, id) {
    try {
      commit("fetchReliabilityDataBegin");
      const apiRes = await DataService.get(
        `/api/ReliabilityAnalysis/group/${id}/fault-detail`
      );
      commit(
        "fetchReliabilityDataSuccess",
        apiRes.data.Detail.TagFaultDetailItems
      );
    } catch (err) {
      commit("fetchReliabilityDataErr", err);
      throw new Error(err);
    }
  },

  filterReliabilityData({ state, commit }, searchText) {
    try {
      commit("filterReliabilityDataBegin");
      const res = useDatatableFilter(state.reliabilityInitData, searchText);
      commit("filterReliabilityDataSuccess", res);
    } catch (err) {
      commit("filterReliabilityDataErr", err);
      throw new Error(err);
    }
  },

  // 可靠度分析相關 actions
  async getReliabilityAnalysis({ commit }) {
    try {
      commit("getReliabilityAnalysisBegin");
      const apiRes = await DataService.get(`/api/ReliabilityAnalysis/GetReliabilityAnalysList`);
      if (apiRes.data.ReturnCode === 1) {
        commit("getReliabilityAnalysisSuccess", apiRes.data.Detail);
      } else {
        throw new Error(apiRes.data.Message || "獲取可靠度分析數據失敗");
      }
    } catch (err) {
      commit("getReliabilityAnalysisErr", err);
      throw new Error(err.message || "獲取可靠度分析數據失敗");
    }
  },

  async resetOperatingHour(context, { TagId }) {
    try {
      const apiRes = await DataService.post(`/api/System/ResetOperationgHour`, { TagId });
      if (apiRes.data.ReturnCode === 1) {
        return apiRes.data;
      } else {
        throw new Error(apiRes.data.Message || "重置失敗");
      }
    } catch (err) {
      throw new Error(err.message || "重置失敗");
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
