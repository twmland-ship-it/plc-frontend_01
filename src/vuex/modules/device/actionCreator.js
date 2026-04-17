import mutations from "./mutations";
import {
  useDatatableFilter,
  useFilterData,
  useFetchTree,
} from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
const initState = () => ({
  error: null,
  loading: false,
  deviceTableData: [],
  deviceInitData: [],
  classInitData: [],
  classCurrentData: [],
  classTableData: [],
  classURLs: [],
});
const state = initState();
const actions = {
  async getAllDeviceAndOptions({ commit }) {
    try {
      commit("getAllDeviceAndOptionsBegin");
      const apiRes = await DataService.get(`/api/Tag/GetDeviceList`);
      commit("getAllDeviceAndOptionsSuccess", apiRes.data.Detail.DeviceList);
      return {
        deviceList: apiRes.data.Detail.DeviceList,
        locations: apiRes.data.Detail.RegionHierarchyList,
        rateOptions: apiRes.data.Detail.Options.BaudRateOptionList,
        addressStartOptions:
          apiRes.data.Detail.Options.AddressStarFromtOptionList,
        dataFormateOptions: apiRes.data.Detail.Options.DataFormatOptionList,
        channelOptions: apiRes.data.Detail.TagChannelList,
        deviceClassOptions: apiRes.data.Detail.DeviceCategoryHierarchyList,
      };
    } catch (err) {
      commit("getAllDeviceAndOptionsErr", err);
      throw new Error(err);
    }
  },

  filterTagsDeviceTable({ state, commit }, schemes) {
    try {
      commit("filterDeviceBegin");
      const res = useFilterData(schemes, state.deviceInitData);
      commit("filterDeviceSuccess", res);
    } catch (err) {
      commit("filterDeviceErr", err);
      throw new Error(err);
    }
  },

  async addDevice(
    { commit, dispatch },
    {
      channel,
      name,
      classId,
      description,
      addressStart,
      dataFormate,
      station,
      ip,
      TCPPort,
      rate,
      RTUPort,
      regionId,
      status,
      endpoint,
      username,
      password,
      webAppName,
      systemName,
      systemId,
    }
  ) {
    try {
      commit("addDeviceBegin");
      // call api
      await DataService.post(`/api/Tag/CreateNewDevice`, {
        TagChannelId: channel,
        DeviceName: name,
        DeviceCategoryId: classId,
        Description: description,
        DeviceDataAddressStartFrom: addressStart,
        DeviceDataFormat: dataFormate,
        StationNo: station,
        IP: ip,
        TcpPort: TCPPort,
        BaudRate: rate,
        RtuPort: RTUPort,
        RegionId: regionId,
        Status: status,
        ObixProtocalPrefix: endpoint,
        UserName: username,
        Password: password,
        WebAppName: webAppName,
        SystemName: systemName,
        SystemId: systemId,
        EndPoint: endpoint,
      });
      await dispatch("getAllDeviceAndOptions");
      commit("addDeviceSuccess");
    } catch (err) {
      commit("addDeviceErr", err);
      throw new Error(err);
    }
  },

  async editDevice(
    { commit, dispatch },
    {
      channel,
      name,
      classId,
      description,
      addressStart,
      dataFormate,
      station,
      ip,
      TCPPort,
      rate,
      RTUPort,
      regionId,
      status,
      id,
      endpoint,
      username,
      password,
      webAppName,
      systemName,
      systemId,
    }
  ) {
    try {
      commit("editDeviceBegin");
      await DataService.post(`/api/Tag/UpdateDevice`, {
        DeviceId: id,
        TagChannelId: channel,
        DeviceName: name,
        DeviceCategoryId: classId,
        Description: description,
        DeviceDataAddressStartFrom: addressStart,
        DeviceDataFormat: dataFormate,
        StationNo: station,
        IP: ip,
        TcpPort: TCPPort,
        BaudRate: rate,
        RtuPort: RTUPort,
        RegionId: regionId,
        Status: status,
        ObixProtocalPrefix: endpoint,
        UserName: username,
        Password: password,
        WebAppName: webAppName,
        SystemName: systemName,
        SystemId: systemId,
        EndPoint: endpoint,
      });
      await dispatch("getAllDeviceAndOptions");
      commit("editDeviceSuccess");
    } catch (err) {
      commit("editDeviceErr", err);
      throw new Error(err);
    }
  },

  async deleteDevice({ commit, dispatch }, id) {
    try {
      commit("deleteDeviceBegin");
      await DataService.post(`/api/Tag/DeleteDevice`, {
        DeviceId: id,
      });
      await dispatch("getAllDeviceAndOptions");
      commit("deleteDeviceSuccess");
    } catch (err) {
      commit("deleteDeviceErr", err);
      throw new Error(err);
    }
  },

  async getAllClass({ commit, dispatch }) {
    try {
      commit("getAllClassBegin");
      const apiRes = await DataService.get(
        `/api/Tag/GetDeviceCategoryHierarchyList`
      );
      commit(
        "getAllClassSuccess",
        apiRes.data.Detail.DeviceCategoryHierarchyList
      );
      dispatch("fetchClass");
    } catch (err) {
      commit("getAllClassErr", err);
      throw new Error(err);
    }
  },

  async fetchClass({ commit }) {
    try {
      commit("fetchClassBegin");
      const res = useFetchTree(
        state.classURLs.map((el) => el.id),
        state.classInitData,
        {
          childProp: "ChildList",
          childId: "Id",
        }
      );
      commit("fetchClassSuccess", res);
    } catch (err) {
      commit("fetchClassErr", err);
      throw new Error(err);
    }
  },

  async getClassChild({ commit, dispatch }, { id, name }) {
    try {
      commit("getClassChildBegin", { id, name });
      dispatch("fetchClass");
      commit("getClassChildSuccess");
    } catch (err) {
      commit("getClassChildErr", err);
      throw new Error(err);
    }
  },

  async classGoback({ commit, dispatch }) {
    try {
      commit("classGobackBegin");
      dispatch("fetchClass");
      commit("classGobackSuccess");
    } catch (err) {
      commit("classGobackErr", err);
      throw new Error(err);
    }
  },

  filterClassTable({ state, commit }, searchText) {
    try {
      commit("filterClassTableBegin");
      const res = useDatatableFilter(state.classCurrentData, searchText);
      commit("filterClassTableSuccess", res);
    } catch (err) {
      commit("filterClassTableErr", err);
      throw new Error(err);
    }
  },

  async addClass({ commit, dispatch }, { parentId, name }) {
    try {
      commit("addClassBegin");
      // 修改 API 請求格式：ParentId[id] 改成 ParentId，ParentId[name] 不送
      const requestData = {
        CategoryName: name,
      };
      
      // 如果有 parentId，則加入 ParentId 欄位
      if (parentId && parentId.id) {
        requestData.ParentId = parentId.id;
      }
      
      await DataService.post(`/api/Tag/CreateNewDeviceCategory`, requestData);
      await dispatch("getAllClass");
      commit("addClassSuccess");
    } catch (err) {
      commit("addClassErr", err);
      throw new Error(err);
    }
  },

  async editClass({ commit, dispatch }, { id, name }) {
    try {
      commit("editClassBegin");
      await DataService.post(`/api/Tag/UpdateDeviceCategory`, {
        Id: id,
        Name: name,
      });
      await dispatch("getAllClass");
      commit("editClassSuccess");
    } catch (err) {
      commit("editClassErr", err);
      throw new Error(err);
    }
  },

  async deleteClass({ commit, dispatch }, id) {
    try {
      commit("deleteClassBegin");
      await DataService.post(`/api/Tag/DeleteDeviceCategory`, {
        Id: id,
      });
      await dispatch("getAllClass");
      commit("deleteClassSuccess");
    } catch (err) {
      commit("deleteClassErr", err);
      throw new Error(err);
    }
  },

  async importTag({ commit, dispatch }, id) {
    try {
      commit("importTagBegin");
      await DataService.post(`/api/Obix/ToLoadObixTagList`, {
        DeviceId: id,
      });
      await dispatch("getAllDeviceAndOptions");
      commit("importTagSuccess");
    } catch (err) {
      commit("importTagErr", err);
      throw new Error(err);
    }
  },

  async getCompareTable({ commit }, id) {
    try {
      commit("getCompareTableBegin");
      const compareData = await DataService.get(`/api/Obix/GetObixTagList`, {
        DeviceId: id,
      });
      commit("getCompareTableSuccess");
      return compareData.data.Detail.ObixTagList;
    } catch (err) {
      commit("getCompareTableErr", err);
      throw new Error(err);
    }
  },

  async compareTags({ commit }, params) {
    try {
      commit("compareTagsBegin");
      await DataService.post(`/api/Obix/SelectObixTagList`, {
        DeviceId: params.id,
        SelectedTagList: params.tags.map((el) => ({
          TagId: el.TagId,
          Address: el.Address,
        })),
      });
      commit("compareTagsSuccess");
    } catch (err) {
      commit("compareTagsErr", err);
      throw new Error(err);
    }
  },

  resetState({ commit }) {
    commit("resetState", initState());
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
