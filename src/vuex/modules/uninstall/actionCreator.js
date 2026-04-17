import mutations from "./mutations";
import uninstall from "@/demoData/uninstall.json";
import { useDatatableFilter } from "@/composable/filter.js";
import { ElectricPowerUnloadAPI as api } from "@/api/electricPowerUnload";

const state = () => ({
  initData: [],
  tableData: [],

  loading: false,
  error: null,
});

const actions = {
  async getData({ commit }) {
    try {
      commit("getDataBegin");
      // 優先呼叫後端查詢目前卸載地區（含階段明細）
      const res = await api.getSummaryDetailList();
      const list = res?.data?.Detail?.SummaryDetailList ?? [];
      commit("getDataSuccess", list);
    } catch (err) {
      // 後端查詢失敗時，保留 demoData 當作回退，避免影響其他功能
      console.warn("GetElectricPowerUnloadStageGroupDetailList 失敗，使用 demoData 回退", err);
      commit("getDataSuccess", uninstall.data);
    }
  },

  async getOptions({ commit }) {
    try {
      commit("getOptionsBegin");
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(uninstall.options);
        }, 500)
      );
      commit("getOptionsSuccess");
      return res;
    } catch (err) {
      commit("getOptionsErr", err);
    }
  },

  async fetchTagsByClass({ commit }) {
    try {
      commit("fetchTagsByClassBegin");
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(uninstall.tags);
        }, 500)
      );
      commit("fetchTagsByClassSuccess");
      return res;
    } catch (err) {
      commit("fetchTagsByClassErr", err);
    }
  },

  async fetchGroupsByClass({ commit }) {
    try {
      commit("fetchGroupsByClassBegin");
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(uninstall.groups);
        }, 500)
      );

      commit("fetchGroupsByClassSuccess");
      return res;
    } catch (err) {
      commit("fetchGroupsByClassErr", err);
    }
  },

  filterTableData({ state, commit }, searchText) {
    try {
      commit("filterTableDataBegin");
      const res = useDatatableFilter(state.initData, searchText);
      commit("filterTableDataSuccess", res);
    } catch (err) {
      commit("filterTableDataErr", err);
    }
  },

  async getProcessDetail({ commit }, id) {
    try {
      commit("getProcessDetailBegin");
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          console.log("getProcessDetail", id);
          resolve(uninstall.data.find((el) => el.id === id));
        }, 500)
      );
      commit("getProcessDetailSuccess");
      return res;
    } catch (err) {
      commit("getProcessDetailErr", err);
    }
  },

  // ---- 以下為對齊文件的實際 API 封裝：保持與現有流程隔離 ----
  async createSummary(
    { commit, dispatch },
    { Name, Mode, ContinuedSecond, IsLoad, ContractCapacity }
  ) {
    try {
      commit("addProcessBegin");
      await api.createSummary({
        Name,
        Mode,
        ContinuedSecond,
        IsLoad,
        ContractCapacity,
      });
      // 新增後可選擇重新取列表（目前仍為 demo）
      await dispatch("getData");
      commit("addProcessSuccess");
    } catch (err) {
      commit("addProcessErr", err);
      throw err;
    }
  },

  async editSummary(
    { commit, dispatch },
    { Id, Name, Mode, ContinuedSecond, IsLoad, ContractCapacity }
  ) {
    try {
      commit("editProcessBegin");
      await api.editSummary({
        Id,
        Name,
        Mode,
        ContinuedSecond,
        IsLoad,
        ContractCapacity,
      });
      await dispatch("getData");
      commit("editProcessSuccess");
    } catch (err) {
      commit("editProcessErr", err);
      throw err;
    }
  },

  async deleteSummary({ commit, dispatch }, { Id }) {
    try {
      commit("deleteProcessBegin");
      await api.deleteSummary({ Id });
      await dispatch("getData");
      commit("deleteProcessSuccess");
    } catch (err) {
      commit("deleteProcessErr", err);
      throw err;
    }
  },

  async setConsumableTags(
    { commit },
    { SummaryId, ElectricPowerConsumableTagIdList }
  ) {
    try {
      commit("editProcessBegin");
      await api.editConsumableTags({ SummaryId, ElectricPowerConsumableTagIdList });
      commit("editProcessSuccess");
    } catch (err) {
      commit("editProcessErr", err);
      throw err;
    }
  },

  async editStageGroup(
    { commit },
    {
      ModifyMode, // 1=create, 3=edit, 4=delete
      SummaryId,
      StageId,
      StageCode,
      StageName,
      UnloadULmt,
      LoadLLmt,
      UnloadAlarmTagId,
    }
  ) {
    try {
      commit("editProcessBegin");
      await api.editStageGroup({
        ModifyMode,
        SummaryId,
        StageId,
        StageCode,
        StageName,
        UnloadULmt,
        LoadLLmt,
        UnloadAlarmTagId,
      });
      commit("editProcessSuccess");
    } catch (err) {
      commit("editProcessErr", err);
      throw err;
    }
  },

  async editStageTag(
    { commit, dispatch },
    { StageDetailId, SummaryId, TagList }
  ) {
    try {
      commit("editProcessBegin");
      await api.editStageTag({ StageDetailId, SummaryId, TagList });
      // 成功後重新載入列表，以反映最新 TagList
      await dispatch("getData");
      commit("editProcessSuccess");
    } catch (err) {
      commit("editProcessErr", err);
      throw err;
    }
  },

  // ---- 既有 demo 流程：先保留，避免其他地方受影響 ----
  async addProcess({ commit, dispatch }, data) {
    try {
      commit("addProcessBegin");
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("addProcess", data);
          resolve();
        }, 500)
      );
      dispatch("getData");
      commit("addProcessSuccess");
    } catch (err) {
      commit("addProcessErr", err);
    }
  },

  async editProcess({ commit, dispatch }, data) {
    try {
      commit("editProcessBegin");
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("editProcess", data);
          resolve();
        }, 500)
      );
      dispatch("getData");
      commit("editProcessSuccess");
    } catch (err) {
      commit("editProcessErr", err);
    }
  },

  async deleteProcess({ commit, dispatch }, id) {
    try {
      commit("deleteProcessBegin");
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log(id);
          resolve();
        }, 500)
      );
      dispatch("getData");
      commit("deleteProcessSuccess");
    } catch (err) {
      commit("deleteProcessErr", err);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
