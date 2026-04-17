import mutations from "./mutations";
import { useFilterData } from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
const initState = () => ({
  loading: false,
  error: null,
  locations: [],
  initData: [],
  tableData: [],
});

const state = initState();

const actions = {
  async getAllCCTVAndOptions({ commit }) {
    try {
      commit("getAllCCTVAndOptionsBegin");
      const CCTVRes = await DataService.get(`/api/CCTV/GetCCTVList`);
      const regionRes = await DataService.get(
        `/api/Tag/GetRegionHierarchyList`
      );
      commit("getAllCCTVAndOptionsSuccess", CCTVRes.data.Detail.CCTVList);
      return {
        CCTVList: CCTVRes.data.Detail.CCTVList,
        locations: regionRes.data.Detail.RegionHierarchyList,
      };
    } catch (err) {
      commit("getAllCCTVAndOptionsErr", err);
      throw new Error(err);
    }
  },

  filterCCTVTable({ state, commit }, schemes) {
    try {
      commit("filterDataBegin");
      const res = useFilterData(schemes, state.initData);
      commit("filterDataSuccess", res);
    } catch (err) {
      commit("filterDataErr", err);
      throw new Error(err);
    }
  },

  async importCCTV({ commit }) {
    try {
      commit("importCCTVBegin");
      await DataService.get(`/api/CCTV/ToLoadCCTVList`);
      commit("importCCTVSuccess");
    } catch (err) {
      commit("importCCTVErr", err);
    }
  },

  async addCCTV(
    { dispatch, commit },
    {
      name,
      description,
      username,
      password,
      manufacturer,
      model,
      region,
      streamUri,
    }
  ) {
    try {
      commit("addCCTVBegin");
      await DataService.post(`/api/CCTV/CreateNewCCTV`, {
        Name: name,
        Description: description,
        UserName: username,
        Password: password,
        Manufacturer: manufacturer,
        Model: model,
        RegionId: region,
        ProfileUrl: streamUri,
      });
      commit("addCCTVSuccess");
      await dispatch("getAllCCTVAndOptions");
    } catch (err) {
      commit("addCCTVErr", err);
      throw new Error(err);
    }
  },

  async editCCTV(
    { dispatch, commit },
    {
      id,
      name,
      description,
      username,
      password,
      manufacturer,
      model,
      region,
      streamUri,
    }
  ) {
    try {
      commit("editCCTVBegin");
      await DataService.post(`/api/CCTV/UpdateCCTV`, {
        Id: id,
        Name: name,
        Description: description,
        UserName: username,
        Password: password,
        Manufacturer: manufacturer,
        Model: model,
        RegionId: region,
        ProfileUrl: streamUri,
      });
      commit("editCCTVSuccess");
      await dispatch("getAllCCTVAndOptions");
    } catch (err) {
      commit("editCCTVErr", err);
      throw new Error(err);
    }
  },

  async deleteCCTV({ dispatch, commit }, id) {
    try {
      commit("deleteCCTVBegin");
      await DataService.post(`/api/CCTV/DeleteCCTV`, {
        Id: id,
      });
      commit("deleteCCTVSuccess");
      await dispatch("getAllCCTVAndOptions");
    } catch (err) {
      commit("deleteCCTVErr", err);
      throw new Error(err);
    }
  },

  async getCCTVImage({ commit }, cctvs) {
    try {
      commit("getCCTVImageBegin");
      let url = `/api/CCTV/images?`;
      cctvs.forEach((cctv) => {
        url += `CctvId=${cctv}&`;
      });
      await DataService.get(url);
      commit("getCCTVImageSuccess");
    } catch (err) {
      commit("getCCTVImageErr", err);
      throw new Error(err);
    }
  },

  resetCCTVState({ commit }) {
    commit("resetState", initState());
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
