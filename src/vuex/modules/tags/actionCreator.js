import mutations from "./mutations";
import {
  useDatatableFilter,
  useFetchTree,
  useFilterData,
} from "@/composable/filter.js";
import tags from "@/demoData/tags-tag.json";
// import cctv from "@/demoData/cctv-list.json";
import { DataService } from "@/config/dataService/dataService";
// import compareData from "@/demoData/tags-compare.json";
import { getTenantScopedItem } from "@/utility/tenantContext";
import { isHttpNotFoundError } from "@/utility/legacyContractCompat";

// Maintenance rule:
// 1. New tag-list behavior must be added to the current tenant API first.
// 2. LEGACY_COMPAT blocks are temporary fallback code for old field deployments only.
// 3. After backend upgrade, remove the LEGACY_COMPAT blocks instead of extending them.

const fetchCurrentTenantTagList = async (params = null) => {
  try {
    return await DataService.get(`/api/App/GetCurrentTenantTagListAsync`, params ?? {});
  } catch (err) {
    // LEGACY_COMPAT_START
    // Remove this fallback after field backend exposes GetCurrentTenantTagListAsync.
    if (!isHttpNotFoundError(err)) {
      throw err;
    }

    console.warn("[Tags] Current tenant tag list API unavailable, fallback to legacy Tag/GetTagList.");
    return DataService.get(`/api/Tag/GetTagList`, params ?? {});
    // LEGACY_COMPAT_END
  }
};

const hasCachedUsageMetadata = (tagList) => {
  if (!tagList || typeof tagList !== "object") {
    return false;
  }

  return Object.values(tagList).some(
    (tag) => tag?.Usage || tag?.TagUsage
  );
};

const fetchRealtimeTagValuesChunk = async (tagIds) => {
  const normalizedIds = [...new Set((Array.isArray(tagIds) ? tagIds : []).filter(Boolean))];

  if (normalizedIds.length === 0) {
    return [];
  }

  try {
    const apiRes = await DataService.post(`/api/Statistic/GetRealTimeStaisticSummary`, {
      TagIdList: normalizedIds,
    });

    return apiRes.data.Detail.ValueList || [];
  } catch (err) {
    if (normalizedIds.length === 1) {
      return [];
    }

    const middle = Math.ceil(normalizedIds.length / 2);
    const left = await fetchRealtimeTagValuesChunk(normalizedIds.slice(0, middle));
    const right = await fetchRealtimeTagValuesChunk(normalizedIds.slice(middle));
    return [...left, ...right];
  }
};

const initState = () => ({
  error: null,
  loading: false,
  regionTableData: [],
  regionCurrentData: [],
  regionInitData: [],
  regionURLs: [],
  channelTypeOptions: null,
  channelDataOptions: null,
  channelTableData: [],
  channelInitData: [],

  tagInitData: [],
  tagTableData: [],
  tagOptions: {
    useOptions: [],
    unitOptions: [],
    dataTypeOptions: [],
    notifyGroups: [],
    expressionTypeOptions: [],
  },
  tagDevices: [],
  tagCCTV: [],
  tagExpTags: [],
  classInitData: [],
  classCurrentData: [],
  classTableData: [],
  classURLs: [],
  importInitData: [],
  importTableData: [],
});
const state = initState();

const actions = {
  async getTagsRegions({ commit, dispatch }) {
    try {
      commit("getRegionsBegin");
      const apiRes = await DataService.get(`/api/Tag/GetRegionHierarchyList`);
      commit("getRegionsSuccess", apiRes.data.Detail.RegionHierarchyList);
      dispatch("fetchTagsRegions");
      return apiRes.data.Detail.RegionHierarchyList;
    } catch (err) {
      commit("getRegionsErr", err);
      throw new Error(err);
    }
  },

  fetchTagsRegions({ state, commit }) {
    try {
      commit("fetchRegionsBegin");
      const res = useFetchTree(
        state.regionURLs.map((el) => el.id),
        state.regionInitData,
        {
          childProp: "ChildList",
          childId: "Id",
        }
      );
      commit("fetchRegionsSuccess", res);
    } catch (err) {
      commit("fetchRegionsErr", err);
      throw new Error(err);
    }
  },

  async getTagsRegionChild({ commit, dispatch }, { id, name }) {
    try {
      commit("getRegionChildBegin", { id, name });
      dispatch("fetchTagsRegions");
      commit("getRegionChildSuccess");
    } catch (err) {
      commit("getRegionChildErr", err);
      throw new Error(err);
    }
  },

  async tagsRegionGoback({ commit, dispatch }) {
    try {
      commit("RegionGobackBegin");
      dispatch("fetchTagsRegions");
      commit("RegionGobackSuccess");
    } catch (err) {
      commit("RegionGobackErr", err);
      throw new Error(err);
    }
  },

  filterTagsRegionTable({ state, commit }, searchText) {
    try {
      commit("filterRegionTableBegin");
      const res = useDatatableFilter(state.regionCurrentData, searchText);
      commit("filterRegionTableSuccess", res);
    } catch (err) {
      commit("filterRegionTableErr", err);
      throw new Error(err);
    }
  },

  async addTagsRegion({ commit, dispatch }, { parentId, name }) {
    try {
      commit("addRegionBegin");
      // 修改 API 請求格式：ParentId[id] 改成 ParentId，ParentId[name] 不送
      const requestData = {
        RegionName: name,
      };
      
      // 如果有 parentId，則加入 ParentId 欄位
      if (parentId && parentId.id) {
        requestData.ParentId = parentId.id;
      }
      
      await DataService.post(`/api/Tag/CreateNewRegion`, requestData);
      commit("addRegionSuccess");
      await dispatch("getTagsRegions");
    } catch (err) {
      commit("addRegionErr", err);
      throw new Error(err);
    }
  },

  async editTagsRegion({ commit, dispatch }, { id, name }) {
    try {
      commit("editRegionBegin");
      await DataService.post(`/api/Tag/UpdateRegion`, {
        RegionId: id,
        RegionName: name,
      });

      commit("editRegionSuccess");
      await dispatch("getTagsRegions");
    } catch (err) {
      commit("editRegionErr", err);
      throw new Error(err);
    }
  },

  async deleteTagsRegion({ commit, dispatch }, id) {
    try {
      commit("deleteRegionBegin");
      await DataService.post(`/api/Tag/DeleteRegion`, {
        RegionId: id,
      });
      commit("deleteRegionSuccess");
      await dispatch("getTagsRegions");
    } catch (err) {
      commit("deleteRegionErr", err);
      throw new Error(err);
    }
  },

  async fetchTagsChannel({ commit }) {
    try {
      commit("fetchChannelsBegin");
      const apiRes = await DataService.get(
        `/api/Tag/GetTagChannelListByCustomer`
      );

      commit("fetchChannelsSuccess", apiRes.data.Detail.TagChannelList);
      commit("fetchChannelOptionsSuccess", {
        typeOptions: apiRes.data.Detail.TagChannelDriverList,
        dataOptions: apiRes.data.Detail.FetchDataModeList,
      });
    } catch (err) {
      commit("fetchChannelsErr", err);
      throw new Error(err);
    }
  },

  async filterTagsChannelTable({ state, commit }, searchText) {
    try {
      commit("filterChannelBegin");
      const res = useDatatableFilter(state.channelInitData, searchText);
      commit("filterChannelSuccess", res);
    } catch (err) {
      commit("filterChannelErr", err);
      throw new Error(err);
    }
  },

  async addTagsChannel(
    { dispatch, commit },
    { name, type, data, description, status }
  ) {
    try {
      commit("addChannelBegin");
      await DataService.post(`/api/Tag/CreateNewTagChannel`, {
        Status: status,
        TagChannelName: name,
        FetchDataMode: data,
        TagChannelDriver: type,
        Description: description,
      });
      commit("addChannelSuccess");
      await dispatch("fetchTagsChannel");
    } catch (err) {
      commit("addChannelErr", err);
      throw new Error(err);
    }
  },

  async editTagsChannel(
    { dispatch, commit },
    { id, name, type, data, status, description }
  ) {
    try {
      commit("editChannelBegin");
      await DataService.post(`Tag/UpdateTagChannel`, {
        TagChannelId: id,
        TagChannelName: name,
        FetchDataMode: data,
        TagChannelDriver: type,
        Description: description,
        Status: status,
      });
      commit("editChannelSuccess");
      await dispatch("fetchTagsChannel");
    } catch (err) {
      commit("editChannelErr", err);
      throw new Error(err);
    }
  },

  async deleteTagsChannel({ dispatch, commit }, id) {
    try {
      commit("deleteChannelBegin");
      await DataService.post(`/api/Tag/DeleteTagChannel`, {
        TagChannelId: id,
      });
      commit("deleteChannelSuccess");
      await dispatch("fetchTagsChannel");
    } catch (err) {
      commit("deleteChannelErr", err);
      throw new Error(err);
    }
  },

  async getAllTagsAndOptions({ commit }) {
    try {
      commit("fetchTagBegin");
      const lastRefreshTime = getTenantScopedItem("tagRefreshTime");
      const cachedTagList = getTenantScopedItem("tagList");
      let params = null;
      if (lastRefreshTime) {
        params = {
          TagRalatedItemsUpdateTime: lastRefreshTime,
        };
      }
      let apiRes = await fetchCurrentTenantTagList(params);

      if (
        lastRefreshTime &&
        apiRes.data?.Detail?.CheckTagRalatedItemsUpdateTimeOK &&
        !hasCachedUsageMetadata(cachedTagList)
      ) {
        apiRes = await fetchCurrentTenantTagList();
      }

      commit("fetchTagSuccess", {
        refreshTime: apiRes.data.Detail.TagRalatedItemsUpdateTime,
        data: apiRes.data.Detail.TagList,
      });
      return {
        locations: apiRes.data.Detail.RegionHierarchyList,
        tagClass: apiRes.data.Detail.TagCategoryHierarchyList,
        tagList: apiRes.data.Detail.TagList,
        typeOptions: apiRes.data.Detail.TagTypeList,
        saveTypeOptions: apiRes.data.Detail.SaveTypeList,
        logTypeOptions: apiRes.data.Detail.LogInterValType,
        unitOptions: apiRes.data.Detail.UnitList,
        dataTypeOptions: apiRes.data.Detail.DataTypeList,
        alarmStatusOptions: apiRes.data.Detail.AlarmStatusList,
        exceptionUntilOptions: apiRes.data.Detail.AlarmExceptionUntilList,
        exceptionActionOptions: apiRes.data.Detail.AlarmExceptionActionList,
        digitalAlarmValueOptions: apiRes.data.Detail.EnumDigitalAlarmValueList,
        expressionTypeOptions: apiRes.data.Detail.ExpressionModeList,
      };
    } catch (err) {
      commit("fetchTagErr", err);
      throw new Error(err);
    }
  },

  async fetchAdditionProps({ commit }, id) {
    try {
      commit("fetchAdditionPropsBegin");
      const apiRes = await DataService.get(
        `/api/Tag/GetTagProperties`,
        {},
        {
          tags: id,
        }
      );
      commit("fetchAdditionPropsSuccess");
      return apiRes.data.Detail.Properties;
    } catch (err) {
      commit("fetchAdditionPropsErr", err);
      throw new Error(err);
    }
  },

  filterTagsTable({ state, commit }, schemes) {
    try {
      commit("filtertagTableBegin");
      const res = useFilterData(schemes, state.tagInitData);
      commit("filtertagTableSuccess", res);
    } catch (err) {
      commit("filtertagTableErr", err);
      throw new Error(err);
    }
  },

  async fetchCurrTagValue({ commit }, id) {
    try {
      commit("fetchCurrTagValueBegin");
      const apiRes = await DataService.post(
        `/api/Statistic/GetRealTimeStaisticSummary`,
        {
          TagIdList: [id],
        }
      );

      commit("fetchCurrTagValueSuccess");
      return apiRes.data.Detail.ValueList[0];
    } catch (err) {
      commit("fetchCurrTagValueErr", err);
      throw new Error(err);
    }
  },

  async fetchTagListValue(_, tagList) {
    try {
      const chunkSize = 500;
      const chunkedArrays = [];
      const normalizedTagList = [...new Set((Array.isArray(tagList) ? tagList : []).filter(Boolean))];

      for (let i = 0; i < normalizedTagList.length; i += chunkSize) {
        const chunk = normalizedTagList.slice(i, i + chunkSize);
        chunkedArrays.push(chunk);
      }

      const apiRes = await Promise.all(
        chunkedArrays.map((chunk) => fetchRealtimeTagValuesChunk(chunk))
      );

      return apiRes.flat();
    } catch (err) {
      throw new Error(err);
    }
  },

  async addtag(
    { commit, dispatch },
    {
      alarm,
      cctv,
      dataInterval,
      dataType,
      description,
      device,
      ignore,
      initValue,
      log,
      logInterval,
      logIntervalType,
      name,
      region,
      retentive,
      saveType,
      status,
      tagClass,
      type,
      unit,
      valueAddress,
      expression,
      closingContact,
      usage,
    }
  ) {
    const {
      HHContent,
      HHStatus,
      HHValue,
      HIContent,
      HIStatus,
      HIValue,
      LLContent,
      LLStatus,
      LLValue,
      LOContent,
      LOStatus,
      LOValue,
      audio,
      digAlarmContent,
      digAlarmStatus,
      digAlarmValue,
      digNorContent,
      digNorStatus,
      digNorValue,
      exceptionAction,
      exceptionEndAt,
      exceptionStartAt,
      exceptionStatus,
      exceptionUntil,
      notifyGroup,
      sop,
      page,
      status: alarmStatus,
    } = alarm;

    const { status: expStatus, type: expType, valueMultiple } = expression;
    const properties = {
      Usage: usage,
      ContactType: closingContact,
    };
    try {
      commit("addTagBegin");
      await DataService.post(`/api/Tag/CreateNewTag`, {
        Status: status,
        RegionId: region,
        DeviceId: device,
        SimpleTagName: name,
        Description: description,
        CCTVIdList: cctv,
        ValueAddress: valueAddress,
        TagCategoryIdList: tagClass,
        MeasurementUnit: unit,
        DataType: dataType,
        InitialValue: initValue,
        IgnoreThreshold: ignore,
        Type: type,
        RelatedPageId: page,
        // Usage: usage,
        // ClosingContact: closingContact,
        Properties: properties,
        Retentive: retentive,
        SaveType: saveType,
        IsLog: log,
        DataInterval: dataInterval,
        LogInterval: logInterval,
        LogIntervalType: logIntervalType,
        AlarmStatus: alarmStatus,
        IsAlarmAudio: audio,
        AlarmNotifyGroupList: notifyGroup,
        AlarmSop: sop,
        AlarmExceptionStatus: exceptionStatus,
        AlarmExceptionStartAt: exceptionStartAt,
        AlarmExceptionEndAt: exceptionEndAt,
        AlarmExceptionUntil: exceptionUntil,
        AlarmExceptionAction: exceptionAction,
        HHContent,
        HHStatus,
        HHValue,
        HIContent,
        HIStatus,
        HIValue,
        LLContent,
        LLStatus,
        LLValue,
        LOContent,
        LOStatus,
        LOValue,
        DigitalAlarmStatus: digAlarmStatus,
        DigitalAlarmValue: digAlarmValue,
        DigitalAlarmContent: digAlarmContent,
        DigitalNormalStatus: digNorStatus,
        DigitalNormalValue: digNorValue,
        DigitalNormalContent: digNorContent,
        IsUseExpression: expStatus,
        ExpressMode: expType,
        ExpressValue: valueMultiple,
      });
      await dispatch("getAllTagsAndOptions");
      commit("addTagSuccess");
    } catch (err) {
      commit("addTagErr", err);
      throw new Error(err);
    }
  },

  async edittag(
    { commit, dispatch },
    {
      id,
      alarm,
      cctv,
      dataInterval,
      dataType,
      description,
      device,
      ignore,
      initValue,
      log,
      logInterval,
      logIntervalType,
      name,
      region,
      retentive,
      saveType,
      status,
      tagClass,
      type,
      unit,
      valueAddress,
      expression,
      usage,
      closingContact,
    }
  ) {
    const properties = {
      Usage: usage,
      ContactType: closingContact,
    };
    const {
      HHContent,
      HHStatus,
      HHValue,
      HIContent,
      HIStatus,
      HIValue,
      LLContent,
      LLStatus,
      LLValue,
      LOContent,
      LOStatus,
      LOValue,
      audio,
      digAlarmContent,
      digAlarmStatus,
      digAlarmValue,
      digNorContent,
      digNorStatus,
      digNorValue,
      exceptionAction,
      exceptionEndAt,
      exceptionStartAt,
      exceptionStatus,
      exceptionUntil,
      notifyGroup,
      sop,
      page,
      status: alarmStatus,
    } = alarm;
    const { status: expStatus, type: expType, valueMultiple } = expression;
    try {
      commit("editTagBegin");
      await DataService.post(`/api/Tag/UpdateTag`, {
        TagId: id,
        Status: status,
        RegionId: region,
        DeviceId: device,
        SimpleTagName: name,
        Description: description,
        CCTVIdList: cctv,
        ValueAddress: valueAddress,
        TagCategoryIdList: tagClass,
        MeasurementUnit: unit,
        DataType: dataType,
        InitialValue: initValue,
        IgnoreThreshold: ignore,
        Type: type,
        Properties: properties,
        Retentive: retentive,
        SaveType: saveType,
        IsLog: log,
        DataInterval: dataInterval,
        LogInterval: logInterval,
        LogIntervalType: logIntervalType,
        AlarmStatus: alarmStatus,
        IsAlarmAudio: audio,
        AlarmNotifyGroupList: notifyGroup,
        AlarmSop: sop,
        AlarmExceptionStatus: exceptionStatus,
        AlarmExceptionStartAt: exceptionStartAt,
        AlarmExceptionEndAt: exceptionEndAt,
        AlarmExceptionUntil: exceptionUntil,
        AlarmExceptionAction: exceptionAction,
        HHContent,
        HHStatus,
        HHValue,
        HIContent,
        HIStatus,
        HIValue,
        LLContent,
        LLStatus,
        LLValue,
        LOContent,
        LOStatus,
        LOValue,
        RelatedPageId: page,
        DigitalAlarmStatus: digAlarmStatus,
        DigitalAlarmValue: digAlarmValue,
        DigitalAlarmContent: digAlarmContent,
        DigitalNormalStatus: digNorStatus,
        DigitalNormalValue: digNorValue,
        DigitalNormalContent: digNorContent,
        IsUseExpression: expStatus,
        ExpressMode: expType,
        ExpressValue: valueMultiple,
      });
      await dispatch("getAllTagsAndOptions");
      commit("editTagSuccess");
    } catch (err) {
      commit("editTagErr", err);
      throw new Error(err);
    }
  },

  async deleteTag({ commit, dispatch }, id) {
    try {
      commit("deleteTagBegin");
      await DataService.post(`/api/Tag/DeleteTag`, {
        TagId: id,
      });
      await dispatch("getAllTagsAndOptions");
      commit("deleteTagSuccess");
    } catch (err) {
      commit("deleteTagErr", err);
      throw new Error(err);
    }
  },

  async fetchTagsExpTag({ commit }, params) {
    try {
      commit("fetchExpTagBegin");
      // call api
      console.log("fetchTagsExpTag", params);
      commit("fetchExpTagSuccess", tags.tags);
    } catch (err) {
      commit("fetchExpTagErr", err);
      throw new Error(err);
    }
  },

  async getAllClass({ commit, dispatch }) {
    try {
      commit("getAllClassBegin");
      const apiRes = await DataService.get(
        `/api/Tag/GetTagCategoryHierarchyList`
      );
      commit("getAllClassSuccess", apiRes.data.Detail.TagCategoryHierarchyList);
      dispatch("fetchClass");
      return apiRes.data.Detail.TagCategoryHierarchyList;
    } catch (err) {
      commit("getAllClassErr", err);
      throw new Error(err);
    }
  },

  async fetchClass({ commit }) {
    try {
      commit("fetchClassBegin");
      // call api
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
      await DataService.post(`/api/Tag/CreateNewTagCategory`, {
        ParentId: parentId,
        CategoryName: name,
      });
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
      await DataService.post(`/api/Tag/UpdateTagCategory`, {
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
      await DataService.post(`/api/Tag/DeleteTagCategory`, {
        Id: id,
      });
      await dispatch("getAllClass");
      commit("deleteClassSuccess");
    } catch (err) {
      commit("deleteClassErr", err);
      throw new Error(err);
    }
  },

  async getAllImportSettings({ commit }) {
    try {
      commit("getAllImportSettingsBegin");
      const apiRes = await DataService.get(
        `/api/DesigoCc/GetDesigoCcConfigList`
      );
      commit("getAllImportSettingsSuccess", apiRes.data.Detail.ConfigList);
    } catch (err) {
      commit("getAllImportSettingsErr", err);
      throw new Error(err);
    }
  },

  filterImportTable({ state, commit }, searchText) {
    try {
      commit("filterImportTableBegin");
      const res = useDatatableFilter(state.importInitData, searchText);
      commit("filterImportTableSuccess", res);
    } catch (err) {
      commit("filterImportTableErr", err);
      throw new Error(err);
    }
  },

  async addImportSetting(
    { commit, dispatch },
    {
      name,
      serverAddress,
      serverPort,
      appName,
      systemName,
      systemNo,
      username,
      password,
    }
  ) {
    try {
      commit("addImportSettingBegin");
      await DataService.post(`/api/DesigoCc/CreateNewDesigoCcConfig`, {
        ConfigName: name,
        ServerIp: serverAddress,
        ServerPort: serverPort,
        WebAppName: appName,
        SystemName: systemName,
        SystemId: systemNo,
        UserName: username,
        UserPassword: password,
      });
      await dispatch("getAllImportSettings");
      commit("addImportSettingSuccess");
    } catch (err) {
      commit("addImportSettingErr", err);
      throw new Error(err);
    }
  },

  async editImportSetting(
    { commit, dispatch },
    {
      id,
      name,
      serverAddress,
      serverPort,
      appName,
      systemName,
      systemNo,
      username,
      password,
    }
  ) {
    try {
      await DataService.post(`/api/DesigoCc/UpdateDesigoCcConfig`, {
        ConfigId: id,
        ConfigName: name,
        ServerIp: serverAddress,
        ServerPort: serverPort,
        WebAppName: appName,
        SystemName: systemName,
        SystemId: systemNo,
        UserName: username,
        UserPassword: password,
      });
      await dispatch("getAllImportSettings");
      commit("editImportSettingSuccess");
    } catch (err) {
      commit("editImportSettingErr", err);
      throw new Error(err);
    }
  },

  async deleteImportSetting({ commit, dispatch }, id) {
    try {
      commit("deleteImportSettingBegin");
      await DataService.post(`/api/DesigoCc/DeleteDesigoCcConfig`, {
        Id: id,
      });
      await dispatch("getAllImportSettings");
      commit("deleteImportSettingSuccess");
    } catch (err) {
      commit("deleteImportSettingErr", err);
      throw new Error(err);
    }
  },

  async importData({ commit }, id) {
    try {
      commit("importDataBegin");
      await DataService.post(`/api/DesigoCc/ToLoadTagList`, {
        ConfigId: id,
      });
      commit("importDataSuccess");
    } catch (err) {
      commit("importDataErr", err);
      throw new Error(err);
    }
  },

  async getCompareTable({ commit }) {
    try {
      commit("getCompareTableBegin");
      const compareData = await DataService.get(
        `/api/DesigoCc/GetDesigoCCTagList`
      );
      commit("getCompareTableSuccess");
      return compareData.data.Detail.TagList;
    } catch (err) {
      commit("getCompareTableErr", err);
      throw new Error(err);
    }
  },

  async compareTags({ commit }, params) {
    try {
      commit("compareTagsBegin");
      await DataService.post(`/api/DesigoCc/SelectDesigoCCTagList`, {
        SelectedTagList: params.map((el) => ({ TagName: el.Name, ...el })),
      });
      commit("compareTagsSuccess");
    } catch (err) {
      commit("compareTagsErr", err);
      throw new Error(err);
    }
  },

  resetTagsState({ commit }) {
    commit("resetState", initState());
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
