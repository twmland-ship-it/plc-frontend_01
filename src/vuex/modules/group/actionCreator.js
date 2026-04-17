import mutations from "./mutations";
import group from "@/demoData/tags-group.json";
import {
  useDatatableFilter,
  useFetchTree,
  useFilterData,
} from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
const initState = () => ({
  error: null,
  loading: false,
  groupLocations: [],
  groupTableData: [],
  groupInitData: [],
  groupClassInitData: [],
  groupClassCurrentData: [],
  groupClassTableData: [],
  classURLs: [],
  groupTags: [],
});
const state = initState();

const actions = {
  async getAllGroupsAndOptions({ commit }) {
    try {
      commit("getAllGroupsAndOptionsBegin");
      const apiRes = await DataService.get(`/api/Tag/GetGroupHierarchyList`);
      commit("getAllGroupsAndOptionsSuccess", {
        data: apiRes.data.Detail.GroupHierarchyList,
      });
      return {
        locations: apiRes.data.Detail.RegionHierarchyList,
        groupClass: apiRes.data.Detail.GroupCategoryHierarchyList,
      };
    } catch (err) {
      commit("getAllGroupsAndOptionsErr", err);
      throw new Error(err);
    }
  },

  async fetchTagsGroup({ commit }, params) {
    try {
      commit("fetchGroupBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("fetchTagsGroup", params);
          resolve();
        }, 500)
      );
      commit("fetchGroupSuccess", group.data);
    } catch (err) {
      commit("fetchGroupErr", err);
      throw new Error(err);
    }
  },

  filterGroupTable({ state, commit }, schemes) {
    try {
      commit("filterGroupBegin");
      const res = useFilterData(schemes, state.groupInitData);
      commit("filterGroupSuccess", res);
    } catch (err) {
      commit("filterGroupErr", err);
      throw new Error(err);
    }
  },

  async addGroup(
    { commit, dispatch },
    { id, name, class: groupClass, description, region, tags, groups }
  ) {
    try {
      commit("addGroupBegin");
      await DataService.post(`/api/Tag/CreateNewGroup`, {
        GroupId: id,
        GroupName: name,
        GroupCategoryIdList: groupClass,
        Description: description,
        RegionId: region,
        TagIdList: tags,
        GroupIdList: groups,
      });
      await dispatch("getAllGroupsAndOptions");
      commit("addGroupSuccess");
    } catch (err) {
      commit("addGroupErr", err);
      throw new Error(err);
    }
  },

  async editGroup(
    { commit, dispatch },
    { id, name, class: groupClass, description, region, tags, groups }
  ) {
    try {
      commit("editGroupBegin");
      await DataService.post(`/api/Tag/UpdateGroup`, {
        GroupId: id,
        GroupName: name,
        GroupCategoryIdList: groupClass,
        Description: description,
        RegionId: region,
        TagIdList: tags,
        GroupIdList: groups,
      });
      await dispatch("getAllGroupsAndOptions");
      commit("editGroupSuccess");
    } catch (err) {
      commit("editGroupErr", err);
      throw new Error(err);
    }
  },

  async deleteGroup({ commit, dispatch }, id) {
    try {
      commit("deleteGroupBegin");
      await DataService.post(`/api/Tag/DeleteGroup`, {
        GroupId: id,
      });
      await dispatch("getAllGroupsAndOptions");
      commit("deleteGroupSuccess");
    } catch (err) {
      commit("deleteGroupErr", err);
      throw new Error(err);
    }
  },

  async getAllClass({ commit, dispatch }) {
    try {
      commit("getAllClassBegin");
      const apiRes = await DataService.get(
        `/api/Tag/GetGroupCategoryHierarchyList`
      );
      commit(
        "getAllClassSuccess",
        apiRes.data.Detail.DeviceCategoryHierarchyList
      );
      dispatch("fetchClass");
      return apiRes.data.Detail.DeviceCategoryHierarchyList;
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
        state.groupClassInitData,
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

  filterTagsGroupClassTable({ state, commit }, searchText) {
    try {
      commit("filterGroupClassBegin");
      const res = useDatatableFilter(state.groupClassCurrentData, searchText);
      commit("filterGroupClassSuccess", res);
    } catch (err) {
      commit("filterGroupClassErr", err);
      throw new Error(err);
    }
  },

  async addTagsGroupClass({ commit, dispatch }, { parentId, name }) {
    try {
      commit("addGroupClassBegin");
      // 修改 API 請求格式：ParentId[id] 改成 ParentId，ParentId[name] 不送
      const requestData = {
        GroupCategoryName: name,
      };
      
      // 如果有 parentId，則加入 ParentId 欄位
      if (parentId && parentId.id) {
        requestData.ParentId = parentId.id;
      }
      
      await DataService.post(`/api/Tag/CreateNewGroupCategory`, requestData);
      await dispatch("getAllClass");
      commit("addGroupClassSuccess");
    } catch (err) {
      commit("addGroupClassErr", err);
      throw new Error(err);
    }
  },

  async editTagsGroupClass({ commit, dispatch }, { id, name }) {
    try {
      commit("editGroupClassBegin");
      await DataService.post(`/api/Tag/UpdateGroupCategory`, {
        GroupCategoryId: id,
        GroupCategoryName: name,
      });
      await dispatch("getAllClass");
      commit("editGroupClassSuccess");
    } catch (err) {
      commit("editGroupClassErr", err);
      throw new Error(err);
    }
  },

  async deleteTagsGroupClass({ commit, dispatch }, id) {
    try {
      commit("deleteGroupClassBegin");
      await DataService.post(`/api/Tag/DeleteGroupCategory`, {
        GroupCategoryId: id,
      });
      await dispatch("getAllClass");
      commit("deleteGroupClassSuccess");
    } catch (err) {
      commit("deleteGroupClassErr", err);
      throw new Error(err);
    }
  },

  async fetchTagsGroupTags({ commit }, params) {
    try {
      commit("fetchGroupTagsBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("fetchTagsGroupTags", params);
          resolve();
        }, 500)
      );
      commit("fetchGroupTagsSuccess", group.tags);
    } catch (err) {
      commit("fetchGroupTagsErr", err);
      throw new Error(err);
    }
  },

  resetGroupState({ commit }) {
    commit("resetState", initState());
  },
};
export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
