import mutations from "./mutations";
import bill from "@/demoData/system-bill.json";
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
  settingListInitData: [],
  settingListTableData: [],
  calculateInitData: [],
  calculateTableData: [],
  calculateSummary: {},
  anomalyList: [],
  anomalyStats: {
    total: 0,
    disconnected: 0,
    stale: 0,
    fresh: 0,
  },
  meterAnomalyList: [],
  meterAnomalyStats: {
    total: 0,
    disconnected: 0,
    stale: 0,
    fresh: 0,
  },
});

const actions = {
  async getSettingList({ commit }) {
    try {
      commit("getSettingListBegin");
      const res = await DataService.get(`/api/electricity-contract-setting`);
      const data = res.data.Detail.ElectricityContractSettings.map(
        ({
          Id,
          ElectricityNumber,
          Name,
          PowerSupplyType,
          TimeOfUseSegment,
          ContractType,
          ContractCapacity,
          BackupCapacity,
          HalfPeekContractCapacity,
          SaturdayHalfPeakContractCapacity,
          OffPeakContractCapacity,
          NonSummerMonthContractCapacity,
        }) => {
          // 根據契約類型決定如何對應容量欄位
          let capacity, nonSummerCapacity, regularCapacity;
          
          if (PowerSupplyType === "LowVoltage" && ContractType === "Demand" && TimeOfUseSegment === 0) {
            // 低壓需量契約非時間電價：使用專用欄位
            nonSummerCapacity = NonSummerMonthContractCapacity || 0;
            regularCapacity = ContractCapacity || 0;
            capacity = 0; // 一般容量欄位設為 0
          } else {
            // 其他契約類型：使用一般容量欄位
            capacity = ContractCapacity || 0;
            nonSummerCapacity = 0;
            regularCapacity = 0;
          }
          
          return {
            id: Id,
            no: ElectricityNumber,
            name: Name,
            type: PowerSupplyType,
            contract: ContractType,
            timePeriod: TimeOfUseSegment,
            capacity: capacity,
            spareCapacity: BackupCapacity,
            offPeakCapacity: OffPeakContractCapacity,
            satHalfPeakCapacity: SaturdayHalfPeakContractCapacity,
            halfPeakCapacity: HalfPeekContractCapacity,
            nonSummerCapacity: nonSummerCapacity,
            regularCapacity: regularCapacity,
          };
        }
      );

      commit("getSettingListSuccess", data);
      return res;
    } catch (err) {
      commit("getSettingListErr", err);
      throw new Error(err);
    }
  },

  filterSettingTable({ commit, state }, searchText) {
    try {
      commit("filterSettingTableBegin");
      const res = useDatatableFilter(state.settingListInitData, searchText);

      commit("filterSettingTableSuccess", res);
    } catch (err) {
      commit("filterSettingTableErr", err);
      throw new Error(err);
    }
  },

  async addSetting(
    { commit, dispatch },
    {
      no,
      name,
      type,
      contract,
      timePeriod,
      capacity,
      spareCapacity,
      offPeakCapacity,
      satHalfPeakCapacity,
      halfPeakCapacity,
      nonSummerCapacity,
      regularCapacity,
    }
  ) {
    try {
      commit("addSettingBegin");

      // 基礎參數
      const params = {
        ElectricityNumber: no,
        Name: name,
        PowerSupplyType: type,
        TimeOfUseSegment: timePeriod,
        ContractType: contract,
        BackupCapacity: spareCapacity,
        OffPeakContractCapacity: offPeakCapacity,
        SaturdayHalfPeakContractCapacity: satHalfPeakCapacity,
        HalfPeekContractCapacity: halfPeakCapacity,
      };

      // 根據契約類型決定使用哪些容量欄位
      if (type === "LowVoltage" && contract === "Demand" && timePeriod === 0) {
        // 低壓需量契約非時間電價：使用新的專用欄位
        params.NonSummerMonthContractCapacity = nonSummerCapacity || 0;
        params.ContractCapacity = regularCapacity || 0;
      } else {
        // 其他契約類型：使用現有的容量欄位
        params.ContractCapacity = capacity || 0;
      }

      await DataService.post(`/api/electricity-contract-setting`, params, {
        "Content-Type": "application/json",
      });
      await dispatch("getSettingList");
      commit("addSettingSuccess");
    } catch (err) {
      commit("addSettingErr", err);
      throw new Error(err);
    }
  },

  async editSetting(
    { commit, dispatch },
    {
      id,
      no,
      name,
      type,
      contract,
      timePeriod,
      capacity,
      spareCapacity,
      offPeakCapacity,
      satHalfPeakCapacity,
      halfPeakCapacity,
      nonSummerCapacity,
      regularCapacity,
    }
  ) {
    try {
      commit("editSettingBegin");
      
      // 基礎參數
      const params = {
        ElectricityNumber: no,
        Name: name,
        PowerSupplyType: type,
        TimeOfUseSegment: timePeriod,
        ContractType: contract,
        BackupCapacity: spareCapacity,
        OffPeakContractCapacity: offPeakCapacity,
        SaturdayHalfPeakContractCapacity: satHalfPeakCapacity,
        HalfPeekContractCapacity: halfPeakCapacity,
      };

      // 根據契約類型決定使用哪些容量欄位
      if (type === "LowVoltage" && contract === "Demand" && timePeriod === 0) {
        // 低壓需量契約非時間電價：使用新的專用欄位
        params.NonSummerMonthContractCapacity = nonSummerCapacity || 0;
        params.ContractCapacity = regularCapacity || 0;
      } else {
        // 其他契約類型：使用現有的容量欄位
        params.ContractCapacity = capacity || 0;
      }

      await DataService.put(`/api/electricity-contract-setting/${id}`, params, {
        "Content-Type": "application/json",
      });
      await dispatch("getSettingList");
      commit("editSettingSuccess");
    } catch (err) {
      commit("editSettingErr", err);
      throw new Error(err);
    }
  },

  async deleteSetting({ commit, dispatch }, id) {
    try {
      commit("deleteSettingBegin");
      await DataService.delete(`/api/electricity-contract-setting/${id}`);
      await dispatch("getSettingList");
      commit("deleteSettingSuccess");
    } catch (err) {
      commit("deleteSettingErr", err);
      throw new Error(err);
    }
  },

  async getMeterList({ commit }) {
    try {
      commit("getMeterListBegin");
      const res = await DataService.get(`/api/meter/type:Electricity`);
      const data = res.data.Detail.Meters.map(
        ({ MeterId, MeterName, RegionId, Tags, Properties, RegionName }) => ({
          id: MeterId,
          name: MeterName,
          region: RegionId,
          regionName: RegionName,
          electric: Tags.find((tag) => tag.Usage === "Consumption")?.TagId,
          power: Tags.find((tag) => tag.Usage === "Power")?.TagId,
          unit: Properties["Unit"],
          contract: Properties["ContractSetting"],
        })
      );
      commit("getMeterListSuccess", data);
      return data;
    } catch (err) {
      commit("getMeterListErr", err);
      throw new Error(err);
    }
  },

  async addMeter(
    { commit, dispatch },
    { name, region, contract, unit, power, electric }
  ) {
    try {
      commit("addMeterBegin");
      const params = {
        Name: name,
        RegionId: region,
        MeterType: "Electricity",
        Properties: {
          Unit: unit,
          ContractSetting: contract,
        },
        Tags: [
          {
            TagId: power,
            Usage: "Power",
          },
          {
            TagId: electric,
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

  async editMeter(
    { commit, dispatch },
    { id, name, region, contract, unit, power, electric }
  ) {
    try {
      commit("editMeterBegin");
      const params = {
        Name: name,
        RegionId: region,
        MeterType: "Electricity",
        Properties: {
          Unit: unit,
          ContractSetting: contract,
        },
        Tags: [
          {
            TagId: power,
            Usage: "Power",
          },
          {
            TagId: electric,
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

  async fetchAnomalyStatus({ commit }) {
    try {
      commit("fetchAnomalyStatusBegin");
      const services = [
        { code: 0, name: "DesigoCC" },
        { code: 6, name: "OBIX" },
        { code: 7, name: "Modbus" },
      ];

      const results = await Promise.allSettled(
        services.map(async (service) => {
          const res = await DataService.get(
            "/ServiceConnection/GetServiceSendRealtimeDataTimeAsync",
            {
              ServiceCode: service.code,
            }
          );

          const detail = res?.data?.Detail || {};
          return {
            serviceCode: service.code,
            serviceName: service.name,
            freshnessState: detail.FreshnessState || "Unknown",
            thresholdSeconds: detail.ThresholdSeconds || 0,
            ageSeconds: detail.AgeSeconds || 0,
            isFresh: !!detail.IsFresh,
            isStale: !!detail.IsStale,
            isDisconnected: !!detail.IsDisconnected,
            lastReceivedTime: detail.DateTimeText || "-",
          };
        })
      );

      const anomalyList = results.map((result, index) => {
        const service = services[index];
        if (result.status === "fulfilled") {
          const item = result.value;
          const level = item.isDisconnected
            ? "Disconnected"
            : item.isStale
              ? "Stale"
              : "Fresh";

          return {
            ...item,
            level,
            message:
              level === "Disconnected"
                ? "已超過中斷門檻，需立即檢查"
                : level === "Stale"
                  ? "資料延遲中，建議追蹤連線品質"
                  : "資料更新正常",
          };
        }

        return {
          serviceCode: service.code,
          serviceName: service.name,
          freshnessState: "Disconnected",
          thresholdSeconds: 0,
          ageSeconds: 0,
          isFresh: false,
          isStale: false,
          isDisconnected: true,
          lastReceivedTime: "-",
          level: "Disconnected",
          message: "查詢失敗或服務未回應，請檢查連線",
        };
      });

      const anomalyStats = {
        total: anomalyList.length,
        disconnected: anomalyList.filter((x) => x.level === "Disconnected").length,
        stale: anomalyList.filter((x) => x.level === "Stale").length,
        fresh: anomalyList.filter((x) => x.level === "Fresh").length,
      };

      commit("fetchAnomalyStatusSuccess", { anomalyList, anomalyStats });
      return anomalyList;
    } catch (err) {
      commit("fetchAnomalyStatusErr", err);
      throw new Error(err?.message || "取得資料異常狀態失敗");
    }
  },

  async fetchMeterAnomalyStatus(
    { commit },
    { staleAfterMinutes = 60, disconnectedAfterMinutes = 120, historyWindowHours = 24 } = {}
  ) {
    try {
      commit("fetchMeterAnomalyStatusBegin");
      const res = await DataService.get("/api/meter/anomalies/type:Electricity", {
        staleAfterMinutes,
        disconnectedAfterMinutes,
        historyWindowHours,
      });

      const detail = res?.data?.Detail || {};
      const meterAnomalyList = (detail.Meters || []).map((item) => ({
        meterId: item.MeterId,
        meterName: item.MeterName,
        regionId: item.RegionId,
        consumptionTagId: item.ConsumptionTagId,
        lastValue: item.LastValue,
        lastValueTimeText: item.LastValueTimeText || "-",
        dataAgeMinutes: item.DataAgeMinutes || 0,
        unchangedMinutes: item.UnchangedMinutes || 0,
        freshnessState: item.FreshnessState || "Unknown",
        isFresh: !!item.IsFresh,
        isStale: !!item.IsStale,
        isDisconnected: !!item.IsDisconnected,
        isLowerBoundByWindow: !!item.IsLowerBoundByWindow,
        message: item.Message || "",
      }));

      const meterAnomalyStats = {
        total: detail.Total || meterAnomalyList.length,
        disconnected:
          detail.Disconnected ||
          meterAnomalyList.filter((x) => x.isDisconnected).length,
        stale: detail.Stale || meterAnomalyList.filter((x) => x.isStale).length,
        fresh: detail.Fresh || meterAnomalyList.filter((x) => x.isFresh).length,
      };

      commit("fetchMeterAnomalyStatusSuccess", {
        meterAnomalyList,
        meterAnomalyStats,
      });
      return meterAnomalyList;
    } catch (err) {
      commit("fetchMeterAnomalyStatusErr", err);
      throw new Error(err?.message || "取得電表異常狀態失敗");
    }
  },

  filterMeterTable({ commit, state }, searchText) {
    try {
      commit("filterMeterTableBegin");
      const res = useNewDataFilter(state.metersInitData, searchText, ["name"]);

      commit("filterMeterTableSuccess", res);
    } catch (err) {
      commit("filterMeterTableErr", err);
      throw new Error(err);
    }
  },

  async calculateVariation({ commit }, { meters, date }) {
    try {
      commit("calculateVariationBegin");
      const params = {
        MeterIds: meters.map((el) => el.value),
        From: dayjs(date[0]).format("YYYY-MM-DD"),
        To: dayjs(date[1]).format("YYYY-MM-DD"),
      };
      const res = await DataService.post(
        `/api/history-report/meter-statistic-summaries/variation/search/type:Electricity`,
        params,
        {
          "Content-Type": "application/json",
        }
      );
      const returnData = {
        meters: res.data.Detail.Meters,
      };
      commit("calculateVariationSuccess", returnData);
    } catch (err) {
      commit("calculateVariationErr", err);
      throw new Error(err);
    }
  },

  async exportVariation({ commit }, { meters, date, fileName }) {
    try {
      commit("exportVariationBegin");
      const params = {
        MeterIds: meters.map((el) => el.value),
        From: dayjs(date[0]).format("YYYY-MM-DD"),
        To: dayjs(date[1]).format("YYYY-MM-DD"),
      };
      const res = await DataService.post(
        `/api/history-report/meter-statistic-summaries/variation/search/type:Electricity/export`,
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
      commit("exportVariationSuccess");
    } catch (err) {
      commit("exportVariationErr", err);
      throw new Error(err);
    }
  },

  async calculateFee({ commit }, { meters, date }) {
    try {
      commit("calculateFeeBegin");
      const params = {
        MeterIds: meters.map((el) => el.value),
        From: dayjs(date[0]).format("YYYY-MM-DD"),
        To: dayjs(date[1]).format("YYYY-MM-DD"),
      };
      const res = await DataService.post(
        `/api/history-report/meter-electricity-fee-summaries/search`,
        params,
        {
          "Content-Type": "application/json",
        }
      );
      const returnData = {
        meters: res.data.Detail.Meters,
        summary: res.data.Detail.Summary,
      };
      commit("calculateFeeSuccess", returnData);
    } catch (err) {
      commit("calculateFeeErr", err);
      throw new Error(err);
    }
  },

  async exportFee({ commit }, { meters, date, fileName }) {
    try {
      commit("exportFeeBegin");
      const params = {
        MeterIds: meters.map((el) => el.value),
        From: dayjs(date[0]).format("YYYY-MM-DD"),
        To: dayjs(date[1]).format("YYYY-MM-DD"),
      };
      const res = await DataService.post(
        `/api/history-report/meter-electricity-fee-summaries/search/export`,
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
      commit("exportFeeSuccess");
    } catch (err) {
      commit("exportFeeErr", err);
      throw new Error(err);
    }
  },

  filterCalculateTable({ commit, state }, searchText) {
    try {
      commit("filterCalculateTableBegin");
      const res = useDatatableFilter(state.calculateInitData, searchText, {
        deep: true,
      });
      commit("filterCalculateTableSuccess", res);
    } catch (err) {
      commit("filterCalculateTableErr", err);
      throw new Error(err);
    }
  },

  async fetchFeeList({ commit }, { supply, segment }) {
    try {
      commit("fetchFeeListBegin");
      const res = await DataService.get(
        `/api/electricity-rate/power-supply/${supply}/segment/${segment}/time-settings`
      );
      const returnData = res.data.Detail.DetailTimes;
      commit("fetchFeeListSuccess", returnData);
    } catch (err) {
      commit("fetchFeeListErr", err);
      throw new Error(err);
    }
  },

  async fetchFeeDetail({ commit }, { year, month, supply, segment }) {
    try {
      commit("fetchFeeDetailBegin");
      const res = await DataService.get(
        `/api/electricity-rate/power-supply/${supply}/segment/${segment}/details`,
        { Year: year, Month: month }
      );
      commit("fetchFeeDetailSuccess");
      return res.data.Detail;
    } catch (err) {
      commit("fetchFeeDetailErr", err);
      throw new Error(err);
    }
  },

  async addFee(
    { dispatch, commit },
    {
      year,
      month,
      weekDay,
      saturday,
      offPeakDay,
      supply,
      segment,
      summer,
      noSummer,
      summerMonth,
    }
  ) {
    const {
      contractRegular: summerDemandContractRegular,
      contractNonSummer: summerDemandContractNonSummer,
      contractSaturdayHalfPeak: summerDemandContractSaturdayHalfPeak,
      contractOffPeak: summerDemandContractOffPeak,
      weekdaysPeak: summerMobileRateWeekdaysPeak,
      weekdaysHalfPeak: summerMobileRateWeekdaysHalfPeak,
      weekdaysOffPeak: summerMobileRateWeekdaysOffPeak,
      saturdayHalfPeak: summerMobileRateSaturdayHalfPeak,
      saturdayOffPeak: summerMobileRateSaturdayOffPeak,
      sundayAndOffDayPeak: summerMobileRateSundayAndOffDayPeak,
    } = summer;

    const {
      contractRegular: noSummerDemandContractRegular,
      contractNonSummer: noSummerDemandContractNonSummer,
      contractSaturdayHalfPeak: noSummerDemandContractSaturdayHalfPeak,
      contractOffPeak: noSummerDemandContractOffPeak,
      weekdaysPeak: noSummerMobileRateWeekdaysPeak,
      weekdaysHalfPeak: noSummerMobileRateWeekdaysHalfPeak,
      weekdaysOffPeak: noSummerMobileRateWeekdaysOffPeak,
      saturdayHalfPeak: noSummerMobileRateSaturdayHalfPeak,
      saturdayOffPeak: noSummerMobileRateSaturdayOffPeak,
      sundayAndOffDayPeak: noSummerMobileRateSundayAndOffDayPeak,
    } = noSummer;
    try {
      commit("addFeeBegin");
      await DataService.post(
        `/api/electricity-rate/power-supply/${supply}/segment/${segment}/details`,
        {
          Year: year,
          Month: month,
          PeakTimeRanges: {
            Weekdays: weekDay.map((el) => ({
              ...el,
              StartTime: el.StartTime.format("HH:mm:ss"),
              EndTime: el.EndTime.format("HH:mm:ss"),
            })),
            Saturday: saturday.map((el) => ({
              ...el,
              StartTime: el.StartTime.format("HH:mm:ss"),
              EndTime: el.EndTime.format("HH:mm:ss"),
            })),
            OffPeakDay: offPeakDay,
          },
          SummerMonth: {
            StartDate: summerMonth.startDate,
            EndDate: summerMonth.endDate,
          },
          DetailItems: [
            {
              IsSummer: true,
              BasicRateSinglePhase: 0,
              BasicRateThreePhase: 0,
              BasicRateDeviceContractByDevice: 0,
              BasicRateDeviceContractByHouse: 0,
              DemandContractByHouse: 0,
              DemandContractRegular: summerDemandContractRegular,
              DemandContractNonSummer: summerDemandContractNonSummer,
              DemandContractSaturdayHalfPeak:
                summerDemandContractSaturdayHalfPeak,
              DemandContractOffPeak: summerDemandContractOffPeak,
              MobileRateWeekdaysPeak: summerMobileRateWeekdaysPeak,
              MobileRateWeekdaysHalfPeak: summerMobileRateWeekdaysHalfPeak,
              MobileRateWeekdaysOffPeak: summerMobileRateWeekdaysOffPeak,
              MobileRateSaturdayHalfPeak: summerMobileRateSaturdayHalfPeak,
              MobileRateSaturdayOffPeak: summerMobileRateSaturdayOffPeak,
              MobileRateSundayAndOffDayPeak:
                summerMobileRateSundayAndOffDayPeak,
              MobileRateExceedKwh: 0,
              MobileRateExceedPrice: 0,
            },
            {
              IsSummer: false,
              BasicRateSinglePhase: 0,
              BasicRateThreePhase: 0,
              BasicRateDeviceContractByDevice: 0,
              BasicRateDeviceContractByHouse: 0,
              DemandContractByHouse: 0,
              DemandContractRegular: noSummerDemandContractRegular,
              DemandContractNonSummer: noSummerDemandContractNonSummer,
              DemandContractSaturdayHalfPeak:
                noSummerDemandContractSaturdayHalfPeak,
              DemandContractOffPeak: noSummerDemandContractOffPeak,
              MobileRateWeekdaysPeak: noSummerMobileRateWeekdaysPeak,
              MobileRateWeekdaysHalfPeak: noSummerMobileRateWeekdaysHalfPeak,
              MobileRateWeekdaysOffPeak: noSummerMobileRateWeekdaysOffPeak,
              MobileRateSaturdayHalfPeak: noSummerMobileRateSaturdayHalfPeak,
              MobileRateSaturdayOffPeak: noSummerMobileRateSaturdayOffPeak,
              MobileRateSundayAndOffDayPeak:
                noSummerMobileRateSundayAndOffDayPeak,
              MobileRateExceedKwh: 0,
              MobileRateExceedPrice: 0,
            },
          ],
        },
        {
          "Content-Type": "application/json",
        }
      );

      await dispatch("fetchFeeList", { segment, supply });
      commit("addFeeSuccess");
    } catch (err) {
      commit("addFeeErr", err);
      throw new Error(err);
    }
  },

  async editFee(
    { dispatch, commit },
    {
      year,
      month,
      weekDay,
      saturday,
      offPeakDay,
      supply,
      segment,
      summer,
      noSummer,
      summerMonth,
    }
  ) {
    const {
      contractRegular: summerDemandContractRegular,
      contractNonSummer: summerDemandContractNonSummer,
      contractSaturdayHalfPeak: summerDemandContractSaturdayHalfPeak,
      contractOffPeak: summerDemandContractOffPeak,
      weekdaysPeak: summerMobileRateWeekdaysPeak,
      weekdaysHalfPeak: summerMobileRateWeekdaysHalfPeak,
      weekdaysOffPeak: summerMobileRateWeekdaysOffPeak,
      saturdayHalfPeak: summerMobileRateSaturdayHalfPeak,
      saturdayOffPeak: summerMobileRateSaturdayOffPeak,
      sundayAndOffDayPeak: summerMobileRateSundayAndOffDayPeak,
    } = summer;

    const {
      contractRegular: noSummerDemandContractRegular,
      contractNonSummer: noSummerDemandContractNonSummer,
      contractSaturdayHalfPeak: noSummerDemandContractSaturdayHalfPeak,
      contractOffPeak: noSummerDemandContractOffPeak,
      weekdaysPeak: noSummerMobileRateWeekdaysPeak,
      weekdaysHalfPeak: noSummerMobileRateWeekdaysHalfPeak,
      weekdaysOffPeak: noSummerMobileRateWeekdaysOffPeak,
      saturdayHalfPeak: noSummerMobileRateSaturdayHalfPeak,
      saturdayOffPeak: noSummerMobileRateSaturdayOffPeak,
      sundayAndOffDayPeak: noSummerMobileRateSundayAndOffDayPeak,
    } = noSummer;
    try {
      commit("editFeeBegin");
      await DataService.put(
        `/api/electricity-rate/power-supply/${supply}/segment/${segment}/details`,
        {
          Year: year,
          Month: month,
          PeakTimeRanges: {
            Weekdays: weekDay.map((el) => ({
              ...el,
              StartTime: el.StartTime.format("HH:mm:ss"),
              EndTime: el.EndTime.format("HH:mm:ss"),
            })),
            Saturday: saturday.map((el) => ({
              ...el,
              StartTime: el.StartTime.format("HH:mm:ss"),
              EndTime: el.EndTime.format("HH:mm:ss"),
            })),
            OffPeakDay: offPeakDay,
          },
          SummerMonth: {
            StartDate: summerMonth.startDate,
            EndDate: summerMonth.endDate,
          },
          DetailItems: [
            {
              IsSummer: true,
              BasicRateSinglePhase: 0,
              BasicRateThreePhase: 0,
              BasicRateDeviceContractByDevice: 0,
              BasicRateDeviceContractByHouse: 0,
              DemandContractByHouse: 0,
              DemandContractRegular: summerDemandContractRegular,
              DemandContractNonSummer: summerDemandContractNonSummer,
              DemandContractSaturdayHalfPeak:
                summerDemandContractSaturdayHalfPeak,
              DemandContractOffPeak: summerDemandContractOffPeak,
              MobileRateWeekdaysPeak: summerMobileRateWeekdaysPeak,
              MobileRateWeekdaysHalfPeak: summerMobileRateWeekdaysHalfPeak,
              MobileRateWeekdaysOffPeak: summerMobileRateWeekdaysOffPeak,
              MobileRateSaturdayHalfPeak: summerMobileRateSaturdayHalfPeak,
              MobileRateSaturdayOffPeak: summerMobileRateSaturdayOffPeak,
              MobileRateSundayAndOffDayPeak:
                summerMobileRateSundayAndOffDayPeak,
              MobileRateExceedKwh: 0,
              MobileRateExceedPrice: 0,
            },
            {
              IsSummer: false,
              BasicRateSinglePhase: 0,
              BasicRateThreePhase: 0,
              BasicRateDeviceContractByDevice: 0,
              BasicRateDeviceContractByHouse: 0,
              DemandContractByHouse: 0,
              DemandContractRegular: noSummerDemandContractRegular,
              DemandContractNonSummer: noSummerDemandContractNonSummer,
              DemandContractSaturdayHalfPeak:
                noSummerDemandContractSaturdayHalfPeak,
              DemandContractOffPeak: noSummerDemandContractOffPeak,
              MobileRateWeekdaysPeak: noSummerMobileRateWeekdaysPeak,
              MobileRateWeekdaysHalfPeak: noSummerMobileRateWeekdaysHalfPeak,
              MobileRateWeekdaysOffPeak: noSummerMobileRateWeekdaysOffPeak,
              MobileRateSaturdayHalfPeak: noSummerMobileRateSaturdayHalfPeak,
              MobileRateSaturdayOffPeak: noSummerMobileRateSaturdayOffPeak,
              MobileRateSundayAndOffDayPeak:
                noSummerMobileRateSundayAndOffDayPeak,
              MobileRateExceedKwh: 0,
              MobileRateExceedPrice: 0,
            },
          ],
        },
        {
          "Content-Type": "application/json",
        }
      );

      await dispatch("fetchFeeList", { supply, segment });
      commit("editFeeSuccess");
    } catch (err) {
      commit("editFeeErr", err);
      throw new Error(err);
    }
  },

  async deleteFee({ dispatch, commit }, { year, month, supply, segment }) {
    try {
      commit("deleteFeeBegin");
      await DataService.delete(
        `/api/electricity-rate/power-supply/${supply}/segment/${segment}/details`,
        {
          Year: year,
          Month: month,
        },
        {
          "Content-Type": "application/json",
        }
      );
      await dispatch("fetchFeeList", { supply, segment });
      commit("deleteFeeSuccess");
    } catch (err) {
      commit("deleteFeeErr", err);
      throw new Error(err);
    }
  },

  // 獲取電價時間設定列表
  async fetchTimeSettings({ commit }, { supply, segment }) {
    try {
      commit("fetchFeeListBegin");
      const res = await DataService.get(
        `/api/electricity-rate/power-supply/${supply}/segment/${segment}/time-settings`
      );
      commit("fetchFeeListSuccess", res.Detail?.DetailTimes || []);
      return res.Detail?.DetailTimes || [];
    } catch (err) {
      commit("fetchFeeListErr", err);
      throw new Error(err);
    }
  },

  // 低壓非時間電價專用 action
  async addLowVoltageNonTimeFee({ dispatch, commit }, formData) {
    try {
      commit("addFeeBegin");

      // 建構 API 請求資料，年月從主頁面的 formData 中取得
      const temporaryMultiplier = formData.temporaryMultiplier ? parseFloat(formData.temporaryMultiplier) : 1;
      const requestData = {
        TemporaryUsageMultiplier: temporaryMultiplier,
        Year: parseInt(formData.year),  // 從主頁面標題帶入的年份
        Month: parseInt(formData.month), // 從主頁面標題帶入的月份
        SummerMonth: {
          StartDate: formData.summerMonth.startDate,
          EndDate: formData.summerMonth.endDate
        },
        PeakTimeRanges: {
          WeekDays: [
            {
              PeakType: 0,
              StartTime: "00:00:00",
              EndTime: "00:00:00",
              UseType: 1
            }
          ]
        },
        DetailItems: [
          // 夏月電價
          {
            DataYear: parseInt(formData.year),   // 從主頁面標題帶入
            DataMonth: parseInt(formData.month), // 從主頁面標題帶入
            BasicRateSinglePhase: 0,
            BasicRateThreePhase: 0,
            BasicRateDeviceContractByDevice: parseFloat(formData.summer.deviceContract) || 0,
            BasicRateDeviceContractByHouse: 0,
            DemandContractByHouse: 0,
            DemandContractRegular: parseFloat(formData.summer.demandContractRegular) || 0,
            DemandContractNonSummer: parseFloat(formData.summer.demandContractNonSummer) || 0,
            DemandContractSaturdayHalfPeak: 0,
            DemandContractOffPeak: 0,
            MobileRateWeekdaysPeak: parseFloat(formData.summer.mobileRate) || 0,
            MobileRateWeekdaysHalfPeak: 0,
            MobileRateWeekdaysOffPeak: 0,
            MobileRateSaturdayHalfPeak: 0,
            MobileRateSaturdayOffPeak: 0,
            MobileRateSundayAndOffDayPeak: 0,
            MobileRateExceedKwh: 0,
            MobileRateExceedPrice: 0,
            IsSummer: true
          },
          // 非夏月電價
          {
            DataYear: parseInt(formData.year),   // 從主頁面標題帶入
            DataMonth: parseInt(formData.month), // 從主頁面標題帶入
            BasicRateSinglePhase: 0,
            BasicRateThreePhase: 0,
            BasicRateDeviceContractByDevice: parseFloat(formData.noSummer.deviceContract) || 0,
            BasicRateDeviceContractByHouse: 0,
            DemandContractByHouse: 0,
            DemandContractRegular: parseFloat(formData.noSummer.demandContractRegular) || 0,
            DemandContractNonSummer: parseFloat(formData.noSummer.demandContractNonSummer) || 0,
            DemandContractSaturdayHalfPeak: 0,
            DemandContractOffPeak: 0,
            MobileRateWeekdaysPeak: parseFloat(formData.noSummer.mobileRate) || 0,
            MobileRateWeekdaysHalfPeak: 0,
            MobileRateWeekdaysOffPeak: 0,
            MobileRateSaturdayHalfPeak: 0,
            MobileRateSaturdayOffPeak: 0,
            MobileRateSundayAndOffDayPeak: 0,
            MobileRateExceedKwh: 0,
            MobileRateExceedPrice: 0,
            IsSummer: false
          }
        ]
      };

      await DataService.post(
        `/api/electricity-rate/power-supply/0/segment/0/details`,
        requestData,
        {
          "Content-Type": "application/json",
        }
      );

      await dispatch("fetchFeeList", { supply: "LowVoltage", segment: 0 });
      commit("addFeeSuccess");
    } catch (err) {
      commit("addFeeErr", err);
      throw new Error(err);
    }
  },

  // 低壓非時間電價編輯專用 action
  async editLowVoltageNonTimeFee({ dispatch, commit }, formData) {
    try {
      commit("editFeeBegin");

      // 建構 API 請求資料，年月從主頁面的 formData 中取得
      const temporaryMultiplier = formData.temporaryMultiplier ? parseFloat(formData.temporaryMultiplier) : 1;
      const requestData = {
        TemporaryUsageMultiplier: temporaryMultiplier,
        Year: parseInt(formData.year),  // 從主頁面標題帶入的年份
        Month: parseInt(formData.month), // 從主頁面標題帶入的月份
        SummerMonth: {
          StartDate: formData.summerMonth.startDate,
          EndDate: formData.summerMonth.endDate
        },
        PeakTimeRanges: {
          WeekDays: [
            {
              PeakType: 0,
              StartTime: "00:00:00",
              EndTime: "00:00:00",
              UseType: 1
            }
          ]
        },
        DetailItems: [
          // 夏月電價
          {
            DataYear: parseInt(formData.year),
            DataMonth: parseInt(formData.month),
            BasicRateSinglePhase: 0,
            BasicRateThreePhase: 0,
            BasicRateDeviceContractByDevice: parseFloat(formData.summer.deviceContract) || 0,
            BasicRateDeviceContractByHouse: 0,
            DemandContractByHouse: 0,
            DemandContractRegular: parseFloat(formData.summer.demandContractRegular) || 0,
            DemandContractNonSummer: parseFloat(formData.summer.demandContractNonSummer) || 0,
            DemandContractSaturdayHalfPeak: 0,
            DemandContractOffPeak: 0,
            MobileRateWeekdaysPeak: parseFloat(formData.summer.mobileRate) || 0,
            MobileRateWeekdaysHalfPeak: 0,
            MobileRateWeekdaysOffPeak: 0,
            MobileRateSaturdayHalfPeak: 0,
            MobileRateSaturdayOffPeak: 0,
            MobileRateSundayAndOffDayPeak: 0,
            MobileRateExceedKwh: 0,
            MobileRateExceedPrice: 0,
            IsSummer: true
          },
          // 非夏月電價
          {
            DataYear: parseInt(formData.year),
            DataMonth: parseInt(formData.month),
            BasicRateSinglePhase: 0,
            BasicRateThreePhase: 0,
            BasicRateDeviceContractByDevice: parseFloat(formData.noSummer.deviceContract) || 0,
            BasicRateDeviceContractByHouse: 0,
            DemandContractByHouse: 0,
            DemandContractRegular: parseFloat(formData.noSummer.demandContractRegular) || 0,
            DemandContractNonSummer: parseFloat(formData.noSummer.demandContractNonSummer) || 0,
            DemandContractSaturdayHalfPeak: 0,
            DemandContractOffPeak: 0,
            MobileRateWeekdaysPeak: parseFloat(formData.noSummer.mobileRate) || 0,
            MobileRateWeekdaysHalfPeak: 0,
            MobileRateWeekdaysOffPeak: 0,
            MobileRateSaturdayHalfPeak: 0,
            MobileRateSaturdayOffPeak: 0,
            MobileRateSundayAndOffDayPeak: 0,
            MobileRateExceedKwh: 0,
            MobileRateExceedPrice: 0,
            IsSummer: false
          }
        ]
      };

      await DataService.put(
        `/api/electricity-rate/power-supply/0/segment/0/details`,
        requestData,
        {
          "Content-Type": "application/json",
        }
      );

      await dispatch("fetchFeeList", { supply: "LowVoltage", segment: 0 });
      commit("editFeeSuccess");
    } catch (err) {
      commit("editFeeErr", err);
      throw new Error(err);
    }
  },

  async getSchedule({ commit }) {
    try {
      commit("getScheduleBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
      commit("getScheduleSuccess", bill.schedule);
    } catch (err) {
      commit("getScheduleErr", err);
      throw new Error(err);
    }
  },

  filterSchedule({ state, commit }, searchText) {
    try {
      commit("filterScheduleBegin");
      const res = useDatatableFilter(state.scheduleInitData, searchText);

      commit("filterScheduleSuccess", res);
    } catch (err) {
      commit("filterScheduleErr", err);
      throw new Error(err);
    }
  },

  async addSchedule({ dispatch, commit }, data) {
    try {
      commit("addScheduleBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("addSchedule", data);
          resolve();
        }, 1000)
      );
      commit("addScheduleSuccess");
      await dispatch("getSchedule");
    } catch (err) {
      commit("addScheduleErr", err);
      throw new Error(err);
    }
  },

  async editSchedule({ dispatch, commit }, data) {
    try {
      commit("editScheduleBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("editSchedule", data);
          resolve();
        }, 1000)
      );
      commit("editScheduleSuccess");
      await dispatch("getSchedule");
    } catch (err) {
      commit("editScheduleErr", err);
      throw new Error(err);
    }
  },

  async getAllBill({ commit }) {
    try {
      commit("getAllBillBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
      commit("getAllBillSuccess", bill.billList);
    } catch (err) {
      commit("getAllBillErr", err);
      throw new Error(err);
    }
  },

  filterBill({ state, commit }, searchText) {
    try {
      commit("filterBillBegin");
      const res = useDatatableFilter(state.billListInitData, searchText);

      commit("filterBillSuccess", res);
    } catch (err) {
      commit("filterBillErr", err);
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
