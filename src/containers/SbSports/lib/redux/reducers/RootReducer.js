//這個沒用到 改用appReducer.js

import { combineReducers } from "redux";

import UserInfoReducer from "./UserInfoReducer";
import BetCartReducer from "./BetCartReducer";
import MaintainStatus from "./MaintainStatusReducer";
import RouterLogReducer from "./RouterLogReducer";
import UserSettingReducer from "./UserSettingReducer";

const RootReducer = combineReducers({
  userInfo: UserInfoReducer,
  userSetting: UserSettingReducer,
  betCartInfo: BetCartReducer,
  maintainStatus: MaintainStatus,
  routerLog: RouterLogReducer,
});

export default RootReducer;
