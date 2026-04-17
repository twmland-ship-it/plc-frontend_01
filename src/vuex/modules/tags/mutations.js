import { clearState } from "../../store.js";
import {
  getTenantScopedItem,
  setTenantScopedItem,
} from "@/utility/tenantContext";
import { invalidateTagListCache } from "@/composable/tagInfo";
export default {
  getRegionsBegin(state) {
    state.loading = true;
  },

  getRegionsSuccess(state, data) {
    state.loading = false;
    state.regionTableData = data;
    state.regionCurrentData = data;
    state.regionInitData = data;
  },

  getRegionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchRegionsBegin(state) {
    state.loading = true;
  },

  fetchRegionsSuccess(state, data) {
    state.loading = false;
    state.regionCurrentData = data;
    state.regionTableData = data;
  },

  fetchRegionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getRegionChildBegin(state, { id, name }) {
    state.loading = true;
    state.regionURLs.push({ id, name });
  },

  getRegionChildSuccess(state) {
    state.loading = false;
  },

  getRegionChildErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  RegionGobackBegin(state) {
    state.loading = true;
    state.regionURLs.pop();
  },

  RegionGobackSuccess(state) {
    state.loading = false;
  },

  RegionGobackErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterRegionTableBegin(state) {
    state.loading = true;
  },

  filterRegionTableSuccess(state, data) {
    state.loading = false;
    state.regionTableData = data;
  },

  filterRegionTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addRegionBegin(state) {
    state.loading = true;
  },

  addRegionSuccess(state) {
    state.loading = false;
  },

  addRegionErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editRegionBegin(state) {
    state.loading = true;
  },

  editRegionSuccess(state) {
    state.loading = false;
  },

  editRegionErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteRegionBegin(state) {
    state.loading = true;
  },

  deleteRegionSuccess(state) {
    state.loading = false;
  },

  deleteRegionErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchChannelsBegin(state) {
    state.loading = true;
  },

  fetchChannelsSuccess(state, data) {
    state.channelTableData = data;
    state.channelInitData = data;
    state.loading = false;
  },

  fetchChannelsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterChannelBegin(state) {
    state.loading = true;
  },

  filterChannelSuccess(state, data) {
    state.channelTableData = data;
    state.loading = false;
  },

  filterChannelErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchChannelOptionsSuccess(state, { dataOptions, typeOptions }) {
    state.channelTypeOptions = typeOptions;
    state.channelDataOptions = dataOptions;
  },

  addChannelBegin(state) {
    state.loading = true;
  },

  addChannelSuccess(state) {
    state.loading = false;
  },

  addChannelErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editChannelBegin(state) {
    state.loading = true;
  },

  editChannelSuccess(state) {
    state.loading = false;
  },

  editChannelErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteChannelBegin(state) {
    state.loading = true;
  },

  deleteChannelSuccess(state) {
    state.loading = false;
  },

  deleteChannelErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchTagLocationsBegin(state) {
    state.loading = true;
  },

  fetchTagLocationsSuccess(state, data) {
    state.loading = false;
    state.tagLocations = data;
  },

  fetchTagLocationsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchTagOptionsBegin(state) {
    state.loading = true;
  },

  fetchTagOptionsSuccess(state, data) {
    state.tagOptions = data;
    state.loading = false;
  },

  fetchTagOptionsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchTagBegin(state) {
    state.loading = true;
  },

  fetchTagSuccess(state, { refreshTime, data }) {
    const lastRefreshTime = getTenantScopedItem("tagRefreshTime");
    let dataArray;
    if (lastRefreshTime !== refreshTime) {
      data.sort((a, b) => (a.SimpleName || '').localeCompare(b.SimpleName || ''));
      const object = {};
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        object[item.Id] = item;
      }
      setTenantScopedItem("tagList", object);
      invalidateTagListCache();
      setTenantScopedItem("tagRefreshTime", refreshTime);
      dataArray = data;
    } else {
      const oldData = getTenantScopedItem("tagList");
      if (oldData && typeof oldData === 'object') {
        dataArray = Object.entries(oldData).map(([id, values]) => ({ Id: id, ...values }));
      } else {
        dataArray = data || [];
      }
    }
    Object.freeze(dataArray);
    state.tagInitData = dataArray;
    state.tagTableData = dataArray;
    state.loading = false;
  },
  fetchTagErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchAdditionPropsBegin(state) {
    state.loading = true;
  },

  fetchAdditionPropsSuccess(state) {
    state.loading = false;
  },

  fetchAdditionPropsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filtertagTableBegin(state) {
    state.loading = true;
  },

  filtertagTableSuccess(state, data) {
    state.loading = false;
    state.tagTableData = data;
  },

  filtertagTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchCurrTagValueBegin() {
    // state.loading = true;
  },

  fetchCurrTagValueSuccess() {
    // state.loading = false;
  },

  fetchCurrTagValueErr(state, err) {
    // state.loading = false;
    state.error = err;
  },

  addTagBegin(state) {
    state.loading = true;
  },

  addTagSuccess(state) {
    state.loading = false;
  },

  addTagErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editTagBegin(state) {
    state.loading = true;
  },

  editTagSuccess(state) {
    state.loading = false;
  },

  editTagErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteTagBegin(state) {
    state.loading = true;
  },

  deleteTagSuccess(state) {
    state.loading = false;
  },

  deleteTagErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchExpTagBegin(state) {
    state.loading = true;
  },

  fetchExpTagSuccess(state, data) {
    state.tagExpTags = data;
    state.loading = false;
  },

  fetchExpTagErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllClassBegin(state) {
    state.loading = true;
  },

  getAllClassSuccess(state, data) {
    state.classTableData = data;
    state.classCurrentData = data;
    state.classInitData = data;
    state.loading = false;
  },

  getAllClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  fetchClassBegin(state) {
    state.loading = true;
  },

  fetchClassSuccess(state, data) {
    state.classTableData = data;
    state.classCurrentData = data;
    state.loading = false;
  },

  fetchClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getClassChildBegin(state, { id, name }) {
    state.classURLs.push({ id, name });
    state.loading = true;
  },

  getClassChildSuccess(state) {
    state.loading = false;
  },

  getClassChildErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  classGobackBegin(state) {
    state.loading = true;
    state.classURLs.pop();
  },

  classGobackSuccess(state) {
    state.loading = false;
  },

  classGobackErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterClassTableBegin(state) {
    state.loading = true;
  },

  filterClassTableSuccess(state, data) {
    state.loading = false;
    state.classTableData = data;
  },

  filterClassTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addClassBegin(state) {
    state.loading = true;
  },

  addClassSuccess(state) {
    state.loading = false;
  },

  addClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editClassBegin(state) {
    state.loading = true;
  },

  editClassSuccess(state) {
    state.loading = false;
  },

  editClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteClassBegin(state) {
    state.loading = true;
  },

  deleteClassSuccess(state) {
    state.loading = false;
  },

  deleteClassErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getAllImportSettingsBegin(state) {
    state.loading = true;
  },

  getAllImportSettingsSuccess(state, data) {
    state.importInitData = data;
    state.importTableData = data;
    state.loading = false;
  },

  getAllImportSettingsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  filterImportTableBegin(state) {
    state.loading = true;
  },

  filterImportTableSuccess(state, data) {
    state.importTableData = data;
    state.loading = false;
  },

  filterImportTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  addImportSettingBegin(state) {
    state.loading = true;
  },

  addImportSettingSuccess(state) {
    state.loading = false;
  },

  addImportSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  editImportSettingBegin(state) {
    state.loading = true;
  },

  editImportSettingSuccess(state) {
    state.loading = false;
  },

  editImportSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  deleteImportSettingBegin(state) {
    state.loading = true;
  },

  deleteImportSettingSuccess(state) {
    state.loading = false;
  },

  deleteImportSettingErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  importDataBegin(state) {
    state.loading = true;
  },

  importDataSuccess(state) {
    state.loading = false;
  },

  importDataErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  getCompareTableBegin(state) {
    state.loading = true;
  },

  getCompareTableSuccess(state) {
    state.loading = false;
  },

  getCompareTableErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  compareTagsBegin(state) {
    state.loading = true;
  },

  compareTagsSuccess(state) {
    state.loading = false;
  },

  compareTagsErr(state, err) {
    state.loading = false;
    state.error = err;
  },

  resetState(state, initState) {
    clearState(state, initState);
  },
};
