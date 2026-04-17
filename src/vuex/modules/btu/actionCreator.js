import mutations from "./mutations";
import { useNewDataFilter, useDatatableFilter } from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
import dayjs from "dayjs";
const state = () => ({
  loading: false,
  error: null,
  metersInitData: [],
  metersTableData: [],
  calculateInitData: [],
  calculateTableData: [],
  calculateSummary: {},
});

const actions = {
  async getMeterList({ commit }) {
    try {
      commit("getMeterListBegin");
      const res = await DataService.get(`/api/meter/type:Btu`);
      const data = res.data.Detail.Meters.map(
        ({ MeterId, Name, RegionId, Tags, Properties }) => ({
          id: MeterId,
          name: Name,
          region: RegionId,
          usage: Tags.find((tag) => tag.Usage === "Consumption")?.TagId,
          unit: Properties["Unit"],
        })
      );
      commit("getMeterListSuccess", data);
      return data;
    } catch (err) {
      commit("getMeterListErr", err);
    }
  },

  async addMeter({ commit, dispatch }, { name, region, usage, unit }) {
    try {
      commit("addMeterBegin");
      const params = {
        Name: name,
        RegionId: region,
        MeterType: "Btu",
        Properties: {
          Unit: unit,
        },
        Tags: [
          {
            TagId: usage,
            Usage: "Consumption",
          },
        ],
      };
      await DataService.post(`/api/meter`, params, {
        "Content-Type": "application/json",
      });

      await dispatch("getMeterList");
      commit("addMeterSuccess");
    } catch (err) {
      commit("addMeterErr", err);
      throw new Error(err);
    }
  },

  async editMeter({ commit, dispatch }, { id, name, region, usage, unit }) {
    try {
      commit("editMeterBegin");
      const params = {
        Name: name,
        RegionId: region,
        MeterType: "Btu",
        Properties: {
          Unit: unit,
        },
        Tags: [
          {
            TagId: usage,
            Usage: "Consumption",
          },
        ],
      };
      await DataService.put(`/api/meter/${id}`, params, {
        "Content-Type": "application/json",
      });
      await dispatch("getMeterList");
      commit("editMeterSuccess");
    } catch (err) {
      commit("editMeterErr", err);
      throw new Error(err);
    }
  },

  async deleteMeter({ commit, dispatch }, id) {
    try {
      commit("deleteMeterBegin");
      await DataService.delete(`/api/meter/${id}`);
      await dispatch("getMeterList");
      commit("deleteMeterSuccess");
    } catch (err) {
      commit("deleteMeterErr", err);
      throw new Error(err);
    }
  },

  filterMeterTable({ commit, state }, searchText) {
    try {
      commit("filterMeterTableBegin");
      const res = useNewDataFilter(state.metersInitData, searchText, ["name"]);
      commit("filterMeterTableSuccess", res);
    } catch (err) {
      commit("filterMeterTableErr", err);
    }
  },

  async calculate({ commit }, { meters, date }) {
    try {
      commit("calculateBegin");

      const params = {
        MeterIds: meters.map((el) => el.value),
        From: dayjs(date[0]).format("YYYY-MM-DD"),
        To: dayjs(date[1]).format("YYYY-MM-DD"),
      };
      const res = await DataService.post(
        `/api/history-report/meter-statistic-summaries/variation/search/type:Btu`,
        params,
        {
          "Content-Type": "application/json",
        }
      );
      const returnData = {
        meters: res.data.Detail.Meters,
      };
      commit("calculateSuccess", returnData);
    } catch (err) {
      commit("calculateErr", err);
      throw new Error(err);
    }
  },

  async exportCalculate({ commit }, { meters, date, fileName }) {
    try {
      commit("exportCalculateBegin");
      const params = {
        MeterIds: meters.map((el) => el.value),
        From: dayjs(date[0]).format("YYYY-MM-DD"),
        To: dayjs(date[1]).format("YYYY-MM-DD"),
      };
      const res = await DataService.post(
        `/api/history-report/meter-statistic-summaries/variation/search/type:Btu/export`,
        params,
        {
          "Content-Type": "application/json",
        },
        "blob"
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.ms-excel",
        })
      );
      const link = document.createElement("a");
      link.setAttribute("download", fileName);
      link.href = url;
      document.body.appendChild(link);
      link.click();
      commit("exportCalculateSuccess");
    } catch (err) {
      commit("exportCalculateErr", err);
      throw new Error(err);
    }
  },

  filterCalculateTable({ commit, state }, searchText) {
    try {
      commit("filterCalculateTableBegin");
      const res = useDatatableFilter(state.calculateInitData, searchText);
      commit("filterCalculateTableSuccess", res);
    } catch (err) {
      commit("filterCalculateTableErr", err);
    }
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
