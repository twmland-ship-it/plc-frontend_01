import { createStore } from "vuex";
import themeLayout from "./modules/themeLayout/actionCreator";
import auth from "./modules/auth/actionCreator";
import database from "./modules/database/actionCreator";
import alarm from "./modules/alarm/actionCreator";
import cctv from "./modules/cctv/actionCreator";
import bill from "./modules/bill/actionCreator";
import waterbill from "./modules/waterbill/actionCreator";
import btu from "./modules/btu/actionCreator";
import device from "./modules/device/actionCreator";
import tags from "./modules/tags/actionCreator";
import group from "./modules/group/actionCreator";
import dashboard from "./modules/dashboard/actionCreator";
import gui from "./modules/gui/actionCreator";
import uninstall from "./modules/uninstall/actionCreator";
import notify from "./modules/notify/actionCreator";
import schedule from "./modules/schedule/actionCreator";
import user from "./modules/user/actionCreator";
export default createStore({
  modules: {
    themeLayout,
    database,
    alarm,
    cctv,
    bill,
    waterbill,
    btu,
    tags,
    device,
    group,
    auth,
    gui,
    dashboard,
    uninstall,
    notify,
    schedule,
    user,
  },
});

export function clearState(tarState, initData) {
  Object.keys(tarState).forEach((key) => {
    if (!initData[key]) {
      delete tarState[key];
    }
  });
  Object.keys(initData).forEach((key) => {
    tarState[key] = initData[key];
  });
}
