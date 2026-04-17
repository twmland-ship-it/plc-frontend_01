import mutations from "./mutations";
import waterbill from "@/demoData/system-waterbill.json";
import { useDatatableFilter, useNewDataFilter } from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
import dayjs from "dayjs";
const state = () => ({
  loading: false,
  error: null,
  scheduleInitData: [],
  scheduleTableData: [],
  billListInitData: [],
  billListTableData: [],
  metersInitData: [],
  metersTableData: [],
  feeListInitData: [],
  feeListTableData: [],
  calculateInitData: [],
  calculateTableData: [],
  calculateSummary: {},
});

const actions = {
  async getMeterList({ commit }) {
    try {
      commit("getMeterListBegin");
      const res = await DataService.get(`/api/meter/type:Water`);
      const data = res.data.Detail.Meters.map(
        ({ MeterId, Name, RegionId, Tags }) => ({
          id: MeterId,
          name: Name,
          region: RegionId,
          usage: Tags.find((tag) => tag.Usage === "Consumption")?.TagId,
        })
      );
      commit("getMeterListSuccess", data);
      return data;
    } catch (err) {
      commit("getMeterListErr", err);
    }
  },

  async addMeter({ commit, dispatch }, { name, region, usage }) {
    try {
      commit("addMeterBegin");
      const params = {
        Name: name,
        RegionId: region,
        MeterType: "Water",
        Properties: {
          Unit: "M3Hr",
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

  async editMeter({ commit, dispatch }, { id, name, region, usage }) {
    try {
      commit("editMeterBegin");
      const params = {
        Name: name,
        RegionId: region,
        MeterType: "Water",
        Properties: {
          Unit: "M3Hr",
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

  async fetchFeeList({ commit }) {
    try {
      commit("fetchFeeListBegin");
      const res = await DataService.get(`/api/water-rate/time-settings`);
      const returnData = res.data.Detail.DetailTimes;
      commit("fetchFeeListSuccess", returnData);
    } catch (err) {
      commit("fetchFeeListErr", err);
      throw new Error(err);
    }
  },

  async fetchFeeDetail({ commit }, { year, month }) {
    try {
      commit("fetchFeeDetailBegin");
      const res = await DataService.get(`/api/water-rate/details`, {
        Year: year,
        Month: month,
      });
      commit("fetchFeeDetailSuccess");
      return res.data.Detail;
    } catch (err) {
      commit("fetchFeeDetailErr", err);
      throw new Error(err);
    }
  },

  async addFee({ commit, dispatch }, { year, month, basicFee, detail }) {
    try {
      commit("addFeeBegin");
      await DataService.post(
        `/api/water-rate/details`,
        {
          Year: year,
          Month: month,
          BasicFee: basicFee,
          RateItems: detail,
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("fetchFeeList");
      commit("addFeeSuccess");
    } catch (err) {
      commit("addFeeErr", err);
      throw new Error(err);
    }
  },

  async editFee({ commit, dispatch }, { year, month, basicFee, detail }) {
    try {
      commit("editFeeBegin");
      await DataService.put(
        `/api/water-rate/details`,
        {
          Year: year,
          Month: month,
          BasicFee: basicFee,
          RateItems: detail,
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("fetchFeeList");
      commit("editFeeSuccess");
    } catch (err) {
      commit("editFeeErr", err);
      throw new Error(err);
    }
  },

  async deleteFee({ commit, dispatch }, { year, month }) {
    try {
      commit("deleteFeeBegin");
      await DataService.delete(
        `/api/water-rate/details`,
        {
          Year: year,
          Month: month,
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("fetchFeeList");
      commit("deleteFeeSuccess");
    } catch (err) {
      commit("deleteFeeErr", err);
      throw new Error(err);
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
        `/api/history-report/meter-water-fee-summaries/search`,
        params,
        {
          "Content-Type": "application/json",
        }
      );
      const returnData = {
        meters: res.data.Detail.Meters,
        summary: res.data.Detail.Summary,
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
        `/api/history-report/meter-water-fee-summaries/search/export`,
        params,
        {
          "Content-Type": "application/json",
        },
        "blob"
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      document.body.appendChild(link);
      link.setAttribute("download", fileName);
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

  async getSchedule({ commit }) {
    try {
      commit("getScheduleBegin");
      commit("getScheduleSuccess", waterbill.schedule);
    } catch (err) {
      commit("getScheduleErr", err);
    }
  },

  filterSchedule({ commit, state }, searchText) {
    try {
      commit("filterScheduleBegin");
      const res = useDatatableFilter(state.scheduleInitData, searchText);
      commit("filterScheduleSuccess", res);
    } catch (err) {
      commit("filterScheduleErr", err);
    }
  },

  async getAllBill({ commit }) {
    try {
      commit("getBillListBegin");
      commit("getBillListSuccess", waterbill.billList);
    } catch (err) {
      commit("getBillListErr", err);
    }
  },

  filterBill({ commit, state }, searchText) {
    try {
      commit("filterBillBegin");
      const res = useDatatableFilter(state.billListInitData, searchText);
      commit("filterBillSuccess", res);
    } catch (err) {
      commit("filterBillErr", err);
    }
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
