import { combineReducers } from 'redux'

import AuthReducer from './AuthReducer'
import ProfileReducer from './ProfileReducer'
import SceneReducer from './SceneReducer'
import { memberInforData, balanceInforData, walletsInforData, depositTypeData, homeRegistLoginModalData, bonusTurnOverInforData, promotionIndexData, newsStatisticsData, stateRouterNameData, selfExclusionsData, promotionListData, queleaActiveCampaignData, freeBetData, withdrawalUserBankData, depositUserBankData, withdrawalLbBankData, depositLbBankData, liveChatData } from './MemberInforReducer'


import UserInfoReducer from "../containers/SbSports/lib/redux/reducers/UserInfoReducer";
import UserSettingReducer from "../containers/SbSports/lib/redux/reducers/UserSettingReducer";
import BetCartReducer from "../containers/SbSports/lib/redux/reducers/BetCartReducer";
import MaintainStatus from "../containers/SbSports/lib/redux/reducers/MaintainStatusReducer";
//import RouterLogReducer from "../containers/SbSports/lib/redux/reducers/RouterLogReducer"; //這個用不到 mobile才有用



const AppReducer = combineReducers({
  userInfo: UserInfoReducer,
  userSetting: UserSettingReducer,
  betCartInfo: BetCartReducer,
  maintainStatus: MaintainStatus,
  //routerLog: RouterLogReducer, //這個用不到 mobile才有用


  auth: AuthReducer,
  profile: ProfileReducer,
  scene: SceneReducer,
  memberInforData,
  balanceInforData,
  walletsInforData,
  depositTypeData,
  bonusTurnOverInforData,
  homeRegistLoginModalData,
  liveChatData,
  promotionIndexData,
  newsStatisticsData,
  stateRouterNameData,
  selfExclusionsData,
  promotionListData,
  queleaActiveCampaignData,
  freeBetData,
  withdrawalUserBankData,
  depositUserBankData,
  withdrawalLbBankData,
  depositLbBankData
})

export default AppReducer
