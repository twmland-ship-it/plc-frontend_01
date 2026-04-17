import mutations from "./mutations";
import notify from "@/demoData/notify.json";
import { useDatatableFilter } from "@/composable/filter.js";
import { DataService } from "@/config/dataService/dataService";
const state = () => {
  return {
    loading: false,
    error: null,
    lineServiceInitData: [],
    lineServiceTableData: [],
    SMTPSetting: {
      smtpAddress: "",
      smptPort: "",
      username: "",
      password: "",
      protocol: "",
    },
    protocolList: [],
    groupInitData: [],
    groupTableData: [],
    historyMsgIninData: [],
    historyMsgTableData: [],
  };
};

const actions = {
  async getLineService({ commit }) {
    try {
      commit("getLineServiceBegin");
      const res = await DataService.get(`/api/Message/GetLineServiceList`);
      const returnData = res.data.Detail.ServiceList.map((el) => ({
        id: el.Id,
        name: el.Name,
        clientId: el.ClientId,
        clientSecret: el.ClientSecret,
      }));
      commit("getLineServiceSuccess", returnData);
    } catch (err) {
      commit("getLineServiceErr", err);
      throw new Error(err);
    }
  },

  filterLineServiceList({ state, commit }, searchText) {
    try {
      commit("filterLineServiceListBegin");
      const res = useDatatableFilter(state.lineServiceInitData, searchText);
      commit("filterLineServiceListSuccess", res);
    } catch (err) {
      commit("filterLineServiceListErr", err);
      throw new Error(err);
    }
  },
  async addLineService({ commit, dispatch }, { name, clientId, clientSecret }) {
    try {
      commit("addLineServiceBegin");
      await DataService.post(`/api/Message/CreateNewLineService`, {
        Name: name,
        ClientId: clientId,
        ClientSecret: clientSecret,
      });
      await dispatch("getLineService");
      commit("addLineServiceSuccess");
    } catch (err) {
      commit("addLineServiceErr", err);
      throw new Error(err);
    }
  },

  async editLineService(
    { commit, dispatch },
    { id, name, clientId, clientSecret }
  ) {
    try {
      commit("editLineServiceBegin");
      await DataService.post(
        `/api/Message/UpdateLineService
`,
        {
          Id: id,
          Name: name,
          ClientId: clientId,
          ClientSecret: clientSecret,
        }
      );
      await dispatch("getLineService");
      commit("editLineServiceSuccess");
    } catch (err) {
      commit("editLineServiceErr", err);
      throw new Error(err);
    }
  },

  async deleteLineService({ commit, dispatch }, id) {
    try {
      commit("deleteLineServiceBegin");
      await DataService.post(`/api/Message/DeleteLineService`, {
        Id: id,
      });
      await dispatch("getLineService");
      commit("deleteLineServiceSuccess");
    } catch (err) {
      commit("deleteLineServiceErr", err);
      throw new Error(err);
    }
  },

  async getSMTPSetting({ commit }) {
    try {
      commit("getSMTPSettingBegin");

      // 使用真實API呼叫
      const res = await DataService.get("/api/Message/GetSMTPSetting");
      const smptSetting = res.data.Detail.SmptSetting;
      const data = {
        smtpAddress: smptSetting?.ServerDomain || "",
        smptPort: smptSetting?.Port ? String(smptSetting.Port) : "",
        username: smptSetting?.SenderEmail || "",
        password: smptSetting?.SenderPassword || "",
        protocol: smptSetting?.ProtocalCode !== undefined ? smptSetting.ProtocalCode : "",
      };
      commit("getSMTPSettingSuccess", data);
      commit("getProtocolListSuccess", res.data.Detail.ProtocalList || []);

    } catch (err) {
      commit("getSMTPSettingErr", err);
      // 如果API失敗，使用測試資料作為備援
      console.warn("API呼叫失敗，改以測試資料填入 SMTP 設定");
      const testData = {
        smtpAddress: "ms2.hinet.net",
        smptPort: "100",
        username: "oco@email.com",
        password: "",
        protocol: 1, // 對應TLS協定
      };
      const testProtocolList = [
        { Id: 0, Name: "SSL" },
        { Id: 1, Name: "TLS" }
      ];

      commit("getSMTPSettingSuccess", testData);
      commit("getProtocolListSuccess", testProtocolList);
    }
  },

  async editSMTPSetting({ commit }, formData) {
    try {
      commit("editSMTPSettingBegin");
      const requestData = {
        ServerDomain: formData.address,
        Port: parseInt(formData.port),
        SenderEmail: formData.username,
        SenderPassword: formData.password,
        ProtocalCode: parseInt(formData.protocol), // 確保轉為數字
      };

      // 呼叫真實的API
      await DataService.post("/api/Message/UpdateSMTPSetting", requestData);

      commit("editSMTPSettingSuccess");
    } catch (err) {
      commit("editSMTPSettingErr", err);
      throw new Error(err);
    }
  },

  async getGroupsAndOptions({ commit }) {
    try {
      commit("getGroupsAndOptionsBegin");
      const res = await DataService.get(
        `/api/Message/GetMessageGroupDetailList`
      );
      commit(
        "getGroupsAndOptionsSuccess",
        res.data.Detail.MessageGroupDetailList
      );
      return {
        duration: res.data.Detail.DurationUntilList,
        type: res.data.Detail.MessageImformMethodList,
      };
    } catch (err) {
      commit("getGroupsAndOptionsErr", err);
      throw new Error(err);
    }
  },

  filterGroupTable({ state, commit }, searchText) {
    try {
      commit("filterGroupTableBegin");
      const res = useDatatableFilter(state.groupInitData, searchText);
      commit("filterGroupTableSuccess", res);
    } catch (err) {
      commit("filterGroupTableErr", err);
      throw new Error(err);
    }
  },

  async addGroup(
    { commit, dispatch },
    { name, starttime, endtime, until, values, type }
  ) {
    try {
      commit("addGroupBegin");
      await DataService.post(`/api/Message/CreateNewSmsGroup`, {
        Name: name,
        StartTime: starttime,
        EndTime: endtime,
        InformMethod: type,
        DurationUntil: until,
        MessageTargetList: values.map((el) => ({
          Name: el.name,
          Number: el.value,
        })),
      });
      dispatch("getGroupsAndOptions");
      commit("addGroupSuccess");
    } catch (err) {
      commit("addGroupErr", err);
      throw new Error(err);
    }
  },

  async editGroup(
    { commit, dispatch },
    { id, name, starttime, endtime, until, values, type }
  ) {
    try {
      commit("editGroupBegin");
      await DataService.post(`/api/Message/UpdateSmsGroup`, {
        GroupId: id,
        Name: name,
        StartTime: starttime,
        EndTime: endtime,
        InformMethod: type,
        DurationUntil: until,
        MessageTargetList: values.map((el) => ({
          Name: el.name,
          Number: el.value,
        })),
      });
      dispatch("getGroupsAndOptions");
      commit("editGroupSuccess");
    } catch (err) {
      commit("editGroupErr", err);
      throw new Error(err);
    }
  },

  async deleteGroup({ commit, dispatch }, id) {
    try {
      commit("deleteGroupBegin");
      await DataService.post(`/api/Message/DeleteSmsGroup`, {
        GroupId: id,
      });
      dispatch("getGroupsAndOptions");
      commit("deleteGroupSuccess");
    } catch (err) {
      commit("deleteGroupErr", err);
      throw new Error(err);
    }
  },

  async getMsgHistory({ commit }) {
    try {
      commit("getMsgHistoryBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve();
        }, 500)
      );
      commit("getMsgHistorySuccess", notify.history);
    } catch (err) {
      commit("getMsgHistoryErr", err);
      throw new Error(err);
    }
  },

  filterHistoryTable({ state, commit }, searchText) {
    try {
      commit("filterHistoryBegin");
      const res = useDatatableFilter(state.historyMsgIninData, searchText);
      commit("filterHistorySuccess", res);
    } catch (err) {
      commit("filterHistoryErr", err);
      throw new Error(err);
    }
  },

  async getMsgOptions({ commit }) {
    try {
      commit("getMsgOptionsBegin");
      // call api
      const res = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(notify.options);
        }, 500)
      );
      commit("getMsgOptionsSuccess");
      return res;
    } catch (err) {
      commit("getMsgOptionsErr", err);
      throw new Error(err);
    }
  },

  async sendMsg({ commit }, params) {
    try {
      commit("sendMsgBegin");
      // call api
      await new Promise((resolve) =>
        setTimeout(() => {
          console.log("sendMsg", params);
          resolve();
        }, 500)
      );
      commit("sendMsgSuccess");
    } catch (err) {
      commit("sendMsgErr", err);
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
