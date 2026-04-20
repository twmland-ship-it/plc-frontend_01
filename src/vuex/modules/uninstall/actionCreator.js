import mutations from "./mutations";
import uninstall from "@/demoData/uninstall.json";
import { useDatatableFilter } from "@/composable/filter.js";
import { ElectricPowerUnloadAPI as api } from "@/api/electricPowerUnload";

const state = () => ({
  initData: [],
  tableData: [],

  loading: false,
  fetching: false,
  hasLoadedOnce: false,
  error: null,
  staleWarning: false,
  fatalError: null,
  nameSortOrder: "ascend",
});

const compareSummaryNameAsc = (a, b) => {
  const aName = String(a?.SummaryName ?? "");
  const bName = String(b?.SummaryName ?? "");
  return aName.localeCompare(bName, "zh-Hant", {
    numeric: true,
    sensitivity: "base",
  });
};

const hasSummaryId = (x) => typeof x?.SummaryId === "string" && x.SummaryId.length > 0;

const stableSortByName = (list, sortOrder) => {
  const dir = sortOrder === "descend" ? -1 : 1;
  return [...list].sort((a, b) => {
    const c = compareSummaryNameAsc(a, b);
    if (c !== 0) return c * dir;
    const aId = String(a?.SummaryId ?? "");
    const bId = String(b?.SummaryId ?? "");
    return aId.localeCompare(bId, "en", { sensitivity: "base" }) * dir;
  });
};

const mergeBySummaryId = (oldList, newList, sortOrder) => {
  const oldArr = Array.isArray(oldList) ? oldList.filter(hasSummaryId) : [];
  const newArr = Array.isArray(newList) ? newList.filter(hasSummaryId) : [];

  const newById = new Map(newArr.map((x) => [x.SummaryId, x]));
  const seen = new Set();
  const kept = [];

  oldArr.forEach((oldItem) => {
    const next = newById.get(oldItem.SummaryId);
    if (!next) return;
    kept.push(next);
    seen.add(oldItem.SummaryId);
  });

  const added = [];
  newById.forEach((val, id) => {
    if (!seen.has(id)) added.push(val);
  });

  return stableSortByName([...kept, ...added], sortOrder);
};

const actions = {
  async getData({ commit, state }, payload = {}) {
    const isPoll = !!payload?.isPoll || !!payload?._isPoll;
    try {
      commit("getDataBegin", { isPoll });
      const res = await api.getStatusList();
      const list = res?.data?.Detail?.StageDetailList ?? [];
      const nextList = mergeBySummaryId(state.tableData, list, state.nameSortOrder);
      commit("getDataSuccess", nextList);
    } catch (err) {
      const msg =
        err?.message ? String(err.message) : typeof err === "string" ? err : String(err);
      if (Array.isArray(state.tableData) && state.tableData.length > 0) {
        commit("getDataErrHasData", msg);
      } else {
        commit("getDataErrNoData", msg);
      }
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
          // demo only
          resolve(uninstall.data.find((el) => el.id === id));
        }, 500)
      );
      commit("getProcessDetailSuccess");
      return res;
    } catch (err) {
      commit("getProcessDetailErr", err);
    }
  },

  // ---- legacy/manage APIs (currently unused by status list page) ----
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
      await api.editConsumableTags({
        SummaryId,
        ElectricPowerConsumableTagIdList,
      });
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
      await dispatch("getData");
      commit("editProcessSuccess");
    } catch (err) {
      commit("editProcessErr", err);
      throw err;
    }
  },

  // ---- demo actions ----
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
