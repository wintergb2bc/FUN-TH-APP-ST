import {ACTION_USERINFO_UPDATE} from '../actions/UserInfoAction';

//用戶全域數據
export const getInitialState = () => ({
  //是否已登入
  isLogin: false,
  //用戶名
  username: "",
  //SB餘額
  balanceSB: 0,
  //總餘額
  balanceTotal: 0,
  //是否正在刷新餘額
  isGettingBalance: false,
  //所有餘額
  allBalance: [],
});

const UserInfoReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case ACTION_USERINFO_UPDATE: //更新數據
      //console.log('===userinfo update to : ', action.payload);
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default UserInfoReducer;
