import React from 'react'
import { TouchableOpacity, Platform, BackHandler, StyleSheet, Text, Image, Dimensions, View, NativeModules, Clipboard, DeviceEventEmitter } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Stack, Scene, Router, Actions, Lightbox, Modal, ActionConst } from 'react-native-router-flux'
import { IphoneXMax } from './Common/CommonData'
const getModel = DeviceInfo.getModel()
const IsNotIphoneX = Platform.OS === 'ios' && IphoneXMax.includes(getModel)
import { logout } from '../actions/AuthAction'
import Orientation from "react-native-orientation-locker";

import Login from './Login/Login'
import Register from './Login/Register'
import Fogetname from './Login/Fogetname'
import Fogetpassword from './Login/Fogetpassword'
import LoginTouch from './LoginPage/LoginTouch'
import LoginPattern from './LoginPage/LoginPattern'
import LoginFace from './LoginPage/LoginFace'
import LoginPage from './LoginPage/LoginPage'
import FastLogin from './LoginPage/FastLogin'

import Home from './Home'
import Lottery from './Home/Lottery'
import FreeBetPage from './FreeBet/FreeBetPage'
import FreebetQualificationsModal from './FreeBet/FreeBetModal/FreebetQualificationsModal'

import GameList from './Game/GameList'
import GamePage from './Game/GamePage'

import PreferentialTab from './Promotion'
import PreferentialRecords from './Promotion/Preferential/PreferentialRecords'
import PreferentialPage from './Promotion/Preferential/PreferentialPage'
import PreferentialApplication from './Promotion/Preferential/PreferentialApplication'
import FreebetSetting from './Promotion/Preferential/FreebetSetting'
import RebateRecord from './Promotion/RebateRecord'
import RebateRecordDetail from './Promotion/RebateRecord/RebateRecordDetail'
import DailyDealAddress from './Promotion/DailyDeals/DailyDealAddress'
import DailyDealShipping from './Promotion/DailyDeals/DailyDealShipping'
import DailyDealPage from './Promotion/DailyDeals/DailyDealPage'
import DailyDealsApplication from './Promotion/DailyDeals/DailyDealsApplication'

import Finance from './Finance'
import Deposit from './Finance/Deposit'
import BqrDeposit from './Finance/Deposit/BqrDeposit'
import Records from './Finance/Records'
import SBGuiderModal from './Finance/SBGuiderModal'
import RecordsDatails from './Finance/Records/recordsDatails'
import RecordsManualDeposit from './Finance/Records/RecordsManualDeposit'
import RedoDepositTransaction from './Finance/Records/RedoDepositTransaction'
import Transfer from './Finance/Transfer'
import Withdrawals from './Finance/Withdrawals'
import WithdrawalVerification from './Finance/Withdrawals/WithdrawalVerification'
import WithdrawalPEVerification from './Finance/Withdrawals/WithdrawalPEVerification'
import LBdepositPage from './Finance/Deposit/LbDeposit/LBdepositPage'
import DepositPage from './Finance/Deposit/DepositPage'
import FinanceAfter from './Finance/FinanceAfter'
import NewBank from './Finance/BankCenter/NewBank'
import BankDetails from './Finance/BankCenter/BankDetails'
import THBQRBankList from './Finance/Deposit/ThbqrDeposit/THBQRBankList'
import THBQRPage from './Finance/Deposit/ThbqrDeposit/THBQRPage'
import RdDeposit from './Finance/Deposit/RdDeposit'

import LiveChat from './LiveChat'

import LoginOtpPage from './LoginOtp/loginOtpPage'
import PhoneEmailErrorModal from './Common/PhoneEmailErrorModal'

import PersonalAccount from './Account'
import Verification from './Account/Verification'
import HelpCenter from './Account/HelpCenter'
import MemberInfor from './Account/MemberInfor'
import ChangePassword from './Account/ChangePassword'
import ContactInformation from './Account/ContactInformation'
import FavoriteBet from './Account/FavoriteBet'
import Uploadfile from './Account/Uploadfile'
import UploadFileDetail from './Account/Uploadfile/UploadFileDetail'
import UploadFileStatus from './Account/Uploadfile/UploadFileStatus'
import UploadfileDemo from './Account/Uploadfile/UploadfileDemo'
import LimitUser from './Account/LimitUser'
import SafeCode from './Account/SafeCode'
import BettingHistory from './Account/BettingHistory'
import ResetPassword from './Account/ResetPassword'
import ResetPasswordReason from './Account/ResetPassword/ResetPasswordReason'
import ResetPasswordVerification from './Account/ResetPassword/ResetPasswordVerification'
import ResetPasswordProfile from './Account/ResetPassword/ResetPasswordProfile'
import LockedAccount from './Account/LockedAccount'
import LockedAccountVerification from './Account/LockedAccount/LockedAccountVerification'
import LockedAccountVerificationStatus from './Account/LockedAccount/LockedAccountVerificationStatus'
import Recommend from './Account/Recommend'
import RecommendPage from './Account/Recommend/RecommendPage'
import RecommendRuler from './Account/Recommend/RecommendRuler'
import Leaderboard from './Account/Leaderboard'


import Restricted from './Restricted'

import Message from './Message'
import MessageDetail from './Message/MessageDetail'

import TabIcon from './tabIcon' //下面導航配置

import DeviceInfo from 'react-native-device-info' //獲取設備信息

//欧冠
// import EuroCup from '../EuroCup/index'
// // import DrawerContent from './DrawerContent';
// import EuroCupGroup from '../EuroCup/Group/index'
// import EuroGroupDetail from '../EuroCup/Group/EuroGroupDetail'
// import EuroPlayerDetail from '../EuroCup/Group/EuroPlayerDetail'
// import PromotionsDetail from '../EuroCup/Tabs/PromoTab/PromotionsDetail/index'
// import PromotionsForm from '../EuroCup/Tabs/PromoTab/PromotionsForm/index'
// import PromoRebateHistory from '../EuroCup/Tabs/PromoTab/PromoRebateHistory/index'
// import PromotionsRebateDetail from '../EuroCup/Tabs/PromoTab/PromotionsRebateDetail/index'
// import PromotionsBank from './Bank/PromotionsBank'
// import PromotionsAddress from '../EuroCup/Tabs/PromoTab/PromotionsAddress/index'

// import SbSports from './../containers/SbSports/containers/index';
// import Rules from './../containers/SbSports/containers/Help/Rules';
// import BetTutorial from './../containers/SbSports/containers/Betting/tutorial';
// import Betting_detail from './../containers/SbSports/game/Betting-detail/index';
// import betRecord from './../containers/SbSports/containers/Betting/betRecord';
// import search from './../containers/SbSports/containers/search';
// import TransferSb from './../containers/SbSports/containers/TransferSb';
// import Setting from './../containers/SbSports/containers/Setting/Setting';
// import SetTingModle from './../containers/SbSports/containers/Setting/SetTingModle';
// import NewsSb from './../containers/SbSports/containers/News';
// import NewsDetailSb from './../containers/SbSports/containers/NewsDetail';
// import NotificationDetail from "./../containers/SbSports/containers/notificationDetail";
// import SbShare from "./SbSports/game/Betting-detail/SbShare";

import { ACTION_UserInfo_logout } from "./SbSports/lib/redux/actions/UserInfoAction";
import WorldCup from './../containers/WorldCup'
import WordNewsAll from './../containers/WorldCup/WordNewsAll'
import WordNewsDetails from './../containers/WorldCup/WordNewsDetails'
import LotteryHostory from './../containers/WorldCup/LotteryHostory'
import LotteryRule from './../containers/WorldCup/LotteryRule'



import { changeHomeRegistLoginModalAction, getStateRouterNameAction, getNewsStatisticsAction, getBalanceInforAction } from './../actions/ReducerAction'
import { ApiConfig } from 'sbtech-sports-data-api-client';
// import { ApiPort } from '../lib/SPORTAPI';
const RouterWithRedux = connect()(Router)




let backTime = 0

const onBackPress = () => {
	if (Actions.state.index == 0) {
		if (Platform.OS === 'android') {
			Toast.fail('กดอีกครั้งเพื่อออกจากแอป', 3)
			// Toast.info('再按一次退出应用', 3)
			if (backTime == 1) {
				BackHandler.exitApp()
			}
			backTime++
			//BackHandler.exitApp()
			setTimeout(() => {
				backTime = 0
			}, 3000)
			return true
		}
	}
	return true
}
const { width } = Dimensions.get('window')
class Main extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}

		this.Devicetoken = ''
		this.userMAC = ''
		this.sprStatus = {
			isComingSoon: false,
			isNew: false,
		}
	}

	componentDidMount(props) {
		this.openOrientation()
		this.getDeviceInfoIos()
		let address = DeviceInfo.getMACAddress || DeviceInfo.getMacAddress
		address().then(mac => {
			//拿mac地址
			this.userMAC = mac
		})
		setTimeout(() => {
			this.getAffCode()//获取affcode
		}, 3000);
	}

	componentWillMount() {
		this.openOrientation()
	}


	componentWillUnmount() {
		this.removeOrientation()
	}

	openOrientation() {
		//锁定竖屏
		if (Platform.OS === "ios") {
			Orientation.lockToPortrait();
			Orientation.removeOrientationListener(this._onOrientationChange); //先移掉再加上，避免多個Listener同時使用，造成怎麼樣都無法旋轉
			Orientation.addOrientationListener(this._onOrientationChange);
		} else {
			Orientation.lockToPortrait();
		}
	}

	_onOrientationChange(props) {
		Orientation.lockToPortrait();
	}

	removeOrientation() {
		//移除锁定竖屏
		if (Platform.OS === "ios") {
			Orientation.unlockAllOrientations();
			Orientation.removeOrientationListener(this._onOrientationChange);
		} else {
			Orientation.unlockAllOrientations();
		}
	}


	//判断iphonex以上型号
	getDeviceInfoIos = () => {
		if (Platform.OS === "android") {
			window.DeviceInfoIos = false;
		} else {
			//ios手机型号是有指纹的
			let iphoneXMax = [
				"iPhone 5",
				"iPhone 5s",
				"iPhone 6",
				"iPhone 6s",
				"iPhone 6s Plus",
				"iPhone 7",
				"iPhone 7 Plus",
				"iPhone 8",
				"iPhone 8 Plus",
				"iPhone SE"
			];
			const getModel = DeviceInfo.getModel();
			if (iphoneXMax.indexOf(getModel) > -1) {
				window.DeviceInfoIos = false;
			}
		}
	};
	// 获取代理码
	getAffCode() {
		//Login.js/Main.js，两次获取，防止sdk api慢没拿到
		let GetNative = NativeModules.Openinstall || false
		//获取原生绑定，没有再去拿url带的
		if (GetNative && GetNative.getAffCode) {
			GetNative.getAffCode(CODE => {
				if (CODE && CODE != 'err') {
					affCodeKex = CODE;
				} else {
					this.getAff()
				}
			});
		} else {
			this.getAff()
		}
	};

	getAff() {
		//缓存检查affcode，没有去检查copy，不会被copy覆盖
		global.storage
			.load({
				key: "affCodeSG",
				id: "affCodeSG"
			})
			.then(ret => {
				affCodeKex = ret
			})
			.catch(err => {
				Clipboard.getString().then((content) => {
					if (content.indexOf('affcode&') == 0) {
						let Acode = content.split('affcode&')[1]
						if (Acode) {
							affCodeKex = Acode
							global.storage.save({
								key: "affCodeSG", // 注意:请不要在key中使用_下划线符号!
								id: "affCodeSG", // 注意:请不要在id中使用_下划线符号!
								data: Acode,
								expires: null
							});
						}
					}
				}, (error) => { })
			})
	}




	logout(flag) {
		if (!ApiPort.UserLogin) return

		ApiPort.Token = ''
		ApiPort.UserLogin = false
		window.gameLoadInfor = {}
		this.props.logout();
		this.props.userInfo_logout(); //清空redux用戶資料
		global.localStorage.setItem("loginStatus", 0);
		//清理vendor緩存
		localStorage.removeItem('IM_Token');
		localStorage.removeItem('IM_MemberCode');
		localStorage.removeItem('IM_MemberType');
		localStorage.removeItem('IM_Token_ExpireTime');
		localStorage.removeItem('BTI_Token');
		localStorage.removeItem('BTI_MemberCode');
		localStorage.removeItem('BTI_JWT');
		localStorage.removeItem('BTI_Token_ExpireTime');
		localStorage.removeItem('SABA_Token');
		localStorage.removeItem('SABA_MemberCode');
		localStorage.removeItem('SABA_JWT');
		localStorage.removeItem('SABA_Token_ExpireTime');
		Actions.login({ types: 'login' })

		let data = {
			client_id: 'Fun88.TH.App',
			client_secret: 'FUNmuittenTH',
			//"SecretKey": "FUNmuittenTH",
			refresh_token: ApiPort.LogoutTokey,
			access_token: ApiPort.access_token,
			membercode: memberCode,
			deviceToken: window.Devicetoken,
			packageName: 'net.funpodium.fun88.thb',
			imei: '',
			macAddress: this.userMAC,
			serialNumber: this.userMAC,
			pushNotificationPlatform: 'umeng+',
			os: Platform.OS,
			'siteId': Platform.OS === 'android' ? 16 : 17,
		}

		global.storage.remove({
			key: 'MEMBERINFORACTIONSTORAGE',
			id: 'MEMBERINFORACTIONSTORAGE'
		})

		global.storage.remove({
			key: 'BALANCEINFORACTIONSTORAGE',
			id: 'BALANCEINFORACTIONSTORAGE'
		})

		if (flag) {
			// global.storage.remove({
			// 	key: 'username',
			// 	id: 'nameFun88'
			// })

			global.storage.remove({
				key: 'password',
				id: 'passwordFun88'
			})
		}

		ApiPort.LogoutTokey = ''
		ApiPort.access_token = ''
		noFastLogin = true
		fetchRequest(ApiPort.logout, 'POST', data).then(data => {

		}).catch(error => {
			Toast.hide()
		})
	}
	renderLeftBack(flag) {
		return <TouchableOpacity style={styles.homeLeftWrap} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
			Actions.pop()
		}}>
			{
				flag == 'X'
					?
					<Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginLeft: 6 }}>X</Text>
					:
					<Image resizeMode='stretch' source={require('./../images/tabberIcon/leftIcon.png')} style={styles.leftIcon}></Image>
			}
		</TouchableOpacity>
	}

	renderRightCSButton() {
		return <TouchableOpacity style={styles.homeCsWrap} onPress={() => {
			Actions.LiveChat()
			window.PiwikMenberCode('CS_topnav')
		}}>
			<Image resizeMode='stretch' source={Boolean(this.props.liveChatData) ? require('./../images/tabberIcon/ic_online_cs.gif') : require('./../images/tabberIcon/whiteCS.png')} style={styles.homeCSImg}></Image>
		</TouchableOpacity>
	}

	goSprGamePage(key) {
		window.openSprHotGame()
		return
		console.log(1212)
		global.storage.load({
			key: 'miniGames',
			id: 'miniGames'
		}).then(miniGames => {
			global.storage.load({
				key: 'GameSequence',
				id: 'GameSequence'
			}).then(gameSequences => {
				if (miniGames.length && gameSequences.length) {
					let miniGame = miniGames.find(v => v.providerCode.toLocaleUpperCase() === 'SPR')
					let { redirectUrl } = miniGame
					const tempKenoArr = gameSequences.find(v => v.code.toLocaleUpperCase() === 'InstantGames'.toLocaleUpperCase())
					const item = tempKenoArr.subProviders[0]
					redirectUrl.length && Actions.GamePage({
						GameOpenUrl: redirectUrl,
						gametype: 'SPR',
						gameHeadName: `${item.name} ${item.productCode}`,
						walletCode: item.walletCode,
						isFromSB: key == 'sb'
					})
					window.isReSqrFlag = false
					window.PiwikMenberCode('Game', 'Launch', 'Aviator_InstantGames_BottomNav')
				}
			}).catch(() => { })
		}).catch(() => { })
		window.CheckUptateGlobe && window.CheckUptateGlobe(false)
	}

	render() {
		const homeLogoImg = window.isBlue ? require('./../images/common/logoIcon/whiteLogo.png') : require('./../images/common/logoIcon/blueLogo.png')

		window.openOrientation = () => {
			this.openOrientation();
		};
		window.removeOrientation = () => {
			this.removeOrientation();
		};

		window.globalLogout = (flag) => {
			this.logout(flag)
		}

		window.PiwikEvent = () => {

		}

		window.goSprGamePage = (v) => {
			this.goSprGamePage(v)
		}

		return <RouterWithRedux
			navigationBarStyle={[styles.navBar, { backgroundColor: NAVBGColor }]}
			titleStyle={styles.navTitle}
			sceneStyle={styles.routerScene}
			backAndroidHandler={onBackPress}
			onStateChange={(prevState, newState, action) => {
				if (action.routeName) {
					this.props.getStateRouterNameAction(action.routeName)
					if (ApiPort.UserLogin) {
						['home', 'promotionLogin', 'news', 'PersonalAccount'].some(v => v === action.routeName) && this.props.getNewsStatisticsAction('all')
					}

					if (action.routeName == 'GamePage' || action.routeName == 'Betting_detail') {
						Orientation.unlockAllOrientations()
						if (state.routeName == 'GamePage') {

						} else {

						}
					}
					//console.log('===Router State Changed',prevState,newState,action);
					//判斷當前是否還可以執行Actions.pop(); 用於sb2.0"返回樂天堂"按鈕(=0則無法pop，因為沒有上層scene了)
					//幾乎全部都在lightbox內，所以有多層結構，要往內找 root => lightbox => 實際要摸的stack
					let routeIndex = 0;
					const lightbox = newState && newState.routes ? newState.routes[newState.index] : null;
					if (lightbox) {
						const stacks = lightbox.routes ? lightbox.routes[lightbox.index] : null;
						routeIndex = stacks.index;
					}
					window.currentRouteIndex = routeIndex;
				}
			}}>
			<Modal key='modal' hideNavBar>
				<Lightbox key='lightbox'>
					<Stack key='root' headerLayoutPreset={'center'}>
						<Stack
							initial={this.props.scene === 'drawer'}
							hideNavBar
							key='drawer'
							navigationBarStyle={{ backgroundColor: '#00AEEF', borderBottomWidth: 0, overflow: 'hidden' }}
							type={ActionConst.REPLACE}
						>



							{
								ApiPort.UserLogin
									?
									<Scene
										key='tabbar'
										tabs={true}
										hideNavBar
										tabBarPosition='bottom'
										showLabel={false}
										tabBarStyle={[styles.tabBarStyle, { backgroundColor: window.isBlue ? '#26a9e1' : '#060000' }]}
										tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
									>
										<Scene
											key='home'
											component={Home}
											icon={TabIcon}
											renderTitle={() => {
												return <Image resizeMode='stretch' source={homeLogoImg} style={styles.homeLogo} />
											}}
											renderRightButton={this.renderRightCSButton.bind(this)}
											onEnter={() => {
												window.PiwikMenberCode('Navigation', 'Click', 'Home_Bottomnav')
												window.makeHomePageAnimatable && window.makeHomePageAnimatable(15)
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
											renderLeftButton={() => {
												return <TouchableOpacity
													onPress={() => {
														Actions.Recommend()
														window.PiwikMenberCode('Referfriend_Homepage')
													}}
													style={{
														marginLeft: 10,
														flexDirection: 'row',
														alignItems: 'center'
													}}>
													<Image source={require('./../images/common/money.png')} style={{
														width: 24,
														height: 24,
														marginRight: 4
													}}></Image>
													<Text style={{ color: '#FFFFFF', fontSize: 12 }}>แนะนำเพื่อน</Text>
												</TouchableOpacity>
											}}
										/>
										<Scene
											key='promotionLogin'
											component={PreferentialTab}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											title='โปรโมชั่น'
											renderRightButton={this.renderRightCSButton.bind(this)}
											onEnter={() => {
												window.PiwikMenberCode('Promo Nav', 'Click', 'Promo_Bottomnav')
												window.makePromotionPageAnimatable && window.makePromotionPageAnimatable(window.mainPageIndex > 1 ? 8 : -8)
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
										<Scene
											key='Finance'
											component={Finance}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											title='ฝากเงิน'
											renderRightButton={this.renderRightCSButton.bind(this)}
											tabBarOnPress={() => {
												this.props.getBalanceInforAction()
												window.goFinancePage()
												window.PiwikMenberCode('Deposit Nav', 'Click', 'Deposit_Bottomnav')
											}}
											onEnter={() => {
												window.makeFinancePageAnimatable && window.makeFinancePageAnimatable(window.mainPageIndex > 2 ? 8 : -8)
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
										<Scene
											key='spr'
											component={Login}
											tabBarOnPress={() => {
												this.goSprGamePage()

												window.PiwikMenberCode('Game', 'Launch', 'Aviator_InstantGames_Bottomnav')
											}}
											sprStatus={this.sprStatus}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
										/>
										<Scene
											key='news'
											component={Message}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											title='แจ้งเตือน'
											renderRightButton={this.renderRightCSButton.bind(this)}
											onEnter={() => {
												window.PiwikMenberCode('Account', 'Click', 'Notification_Bottomnav')
												window.makeMessagePageAnimatable && window.makeMessagePageAnimatable(window.mainPageIndex > 3 ? 8 : -8)
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
										<Scene
											key='PersonalAccount'
											title='ประวัติของฉัน'
											renderRightButton={this.renderRightCSButton.bind(this)}
											component={PersonalAccount}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											onEnter={() => {
												window.makePersonalAccountPageAnimatable && window.makePersonalAccountPageAnimatable(-15)
												window.PiwikMenberCode('Account', 'Click', 'Profile_Bottomnav')
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
									</Scene>
									:
									<Scene
										key='tabbar'
										hideNavBar
										tabs={true}
										tabBarPosition='bottom'
										showLabel={false}
										tabBarStyle={[styles.tabBarStyle, { backgroundColor: window.isBlue ? '#25AAE1' : '#060000' }]}
										tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}
									>
										<Scene
											key='home'
											renderTitle={() => {
												return <Image resizeMode='stretch' source={homeLogoImg} style={styles.homeLogo} />
											}}
											component={Home}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											renderLeftButton={() => {
												return <TouchableOpacity
													onPress={() => {
														Actions.Recommend()
														window.PiwikMenberCode('Referfriend_Homepage')
													}}
													style={{
														marginLeft: 10,
														flexDirection: 'row',
														alignItems: 'center'
													}}>
													<Image source={require('./../images/common/money.png')} style={{
														width: 24,
														height: 24,
														marginRight: 4
													}}></Image>
													<Text style={{ color: '#FFFFFF', fontSize: 12 }}>แนะนำเพื่อน</Text>
												</TouchableOpacity>
											}}
											renderRightButton={this.renderRightCSButton.bind(this)}
											onEnter={() => {
												window.PiwikMenberCode('Navigation', 'Click', 'Home_Bottomnav')
												window.makeHomePageAnimatable && window.makeHomePageAnimatable(15)
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
										<Scene
											key='promotionLogin'
											component={PreferentialTab}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											title='โปรโมชั่น'
											renderRightButton={this.renderRightCSButton.bind(this)}
											onEnter={() => {
												window.makePromotionPageAnimatable && window.makePromotionPageAnimatable(window.mainPageIndex > 1 ? 8 : -8)
												window.PiwikMenberCode('Promo Nav', 'Click', 'Promo_Bottomnav')
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
										<Scene
											key='Finance'
											component={Login}
											tabBarOnPress={() => {
												this.props.changeHomeRegistLoginModalAction({
													flag: true,
													page: 'fiance'
												})
												window.PiwikMenberCode('Deposit Nav', 'Click', 'Deposit_Bottomnav')
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
										/>
										<Scene
											key='spr'
											sprStatus={this.sprStatus}
											component={Login}
											tabBarOnPress={() => {
												window.PiwikMenberCode('Game', 'Launch', 'Aviator_InstantGames_Bottomnav')
												// window.isReSqrFlag = true
												// Actions.login({ types: 'login' })
												this.props.changeHomeRegistLoginModalAction({
													flag: true,
													page: 'game'
												})
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
										/>
										<Scene
											key='news'
											sprStatus={sprStatus}
											component={Login}
											tabBarOnPress={() => {
												// Actions.login({ types: 'login' })
												window.PiwikMenberCode('Account', 'Click', 'Notification_Bottomnav')
												this.props.changeHomeRegistLoginModalAction({
													flag: true,
													page: 'profile'
												})
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
										/>
										<Scene
											key='PersonalAccount'
											title='ประวัติของฉัน'
											renderRightButton={this.renderRightCSButton.bind(this)}
											component={PersonalAccount}
											icon={TabIcon}
											titleStyle={styles.titleStyle}
											onEnter={() => {
												window.makePersonalAccountPageAnimatable && window.makePersonalAccountPageAnimatable(-15)
												window.PiwikMenberCode('Account', 'Click', 'Profile_Bottomnav')
												window.CheckUptateGlobe && window.CheckUptateGlobe(false)
											}}
										/>
									</Scene>
							}
						</Stack>

						<Scene
							hideNavBar
							key='login'
							title='Đăng nhập'
							titleStyle={styles.titleStyle}
							component={Login}
							renderBackButton={() => (null)} // removing back button
						/>

						<Scene
							key='LoginFace'
							title={'ตั้งค่า Face ID'}
							titleStyle={styles.titleStyle}
							component={LoginFace}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='LoginPattern'
							title={'เข้าสู่ระบบโดยรหัสแพทเทิร์น'}
							titleStyle={styles.titleStyle}
							component={LoginPattern}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='LoginTouch'
							title={'ตั้งค่า รหัสลายนิ้วมือ'}
							titleStyle={styles.titleStyle}
							component={LoginTouch}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>




						<Scene
							key='Register'
							title={'สมัคร'}
							titleStyle={styles.titleStyle}
							component={Register}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='fogetname'
							title={'ลืมยูสเซอร์เนม'}
							titleStyle={styles.titleStyle}
							component={Fogetname}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='fogetpassword'
							title={'ลืมรหัสผ่าน'}
							titleStyle={styles.titleStyle}
							component={Fogetpassword}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='FreebetQualificationsModal'
							component={FreebetQualificationsModal}
							titleStyle={styles.titleStyle}
							hideNavBar={true}
							headerLayoutPreset={'center'}
						/>

						<Scene
							key='GameList'
							component={GameList}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
							titleStyle={styles.titleStyle}
						/>

						<Scene
							key='MessageDetail'
							title='ธุรกรรม'
							titleStyle={styles.titleStyle}
							component={MessageDetail}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='BettingHistory'
							title='ประวัติการเดิมพัน'
							titleStyle={styles.titleStyle}
							component={BettingHistory}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='Recommend'
							title='แนะนำเพื่อน'
							titleStyle={styles.titleStyle}
							component={Recommend}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='RecommendPage'
							title='แนะนำเพื่อน'
							titleStyle={styles.titleStyle}
							component={RecommendPage}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='RecommendRuler'
							title='แนะนำเพื่อน'
							titleStyle={styles.titleStyle}
							component={RecommendRuler}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='ResetPassword'
							title='การตรวจสอบความปลอดภัย'
							component={ResetPassword}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='ResetPasswordReason'
							title='ความปลอดภัยของระบบบัญชี'
							component={ResetPasswordReason}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='ResetPasswordVerification'
							component={ResetPasswordVerification}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							hideNavBar
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='ResetPasswordProfile'
							component={ResetPasswordProfile}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							title='Profile Update'
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='LockedAccount'
							component={LockedAccount}
							title='Lỗi'
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='LockedAccountVerification'
							component={LockedAccountVerification}
							title='Xác Thực Mở Khoá Tài'
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>
						<Scene
							key='LockedAccountVerificationStatus'
							component={LockedAccountVerificationStatus}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='Restricted'
							component={Restricted}
							hideNavBar={true}
						/>

						<Scene
							key='MemberInfor'
							component={MemberInfor}
							title='ข้อมูลพื้นฐาน'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='HelpCenter'
							component={HelpCenter}
							title='ศูนย์ช่วยเหลือ'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>




						<Scene
							key='ChangePasswordRE'
							component={ChangePassword}
							title='เปลี่ยนรหัสผ่าน'
							titleStyle={styles.titleStyle}
							renderLeftButton={() => {
								return null
							}}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='ChangePassword'
							component={ChangePassword}
							title='เปลี่ยนรหัสผ่าน'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='ContactInformation'
							component={ContactInformation}
							title='ข้อมูลการติดต่อ'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='FavoriteBet'
							component={FavoriteBet}
							title='การเดิมพันที่ชอบ'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>





						<Scene
							key='FastLogin'
							component={FastLogin}
							title='ประวัติของฉัน'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='Uploadfile'
							component={Uploadfile}
							title='อัปโหลดเอกสาร'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='UploadFileDetail'
							component={UploadFileDetail}
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='Leaderboard'
							component={Leaderboard}
							titleStyle={styles.titleStyle}
							title='  '
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderTitle={() => {
								//return <Image resizeMode='stretch' source={homeLogoImg} style={styles.homeLogo} />
							}}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='SafeCode'
							component={SafeCode}
							title='รับรหัสความปลอดภัย'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='LimitUser'
							component={LimitUser}
							title='ตั้งค่าส่วนตัว'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='PreferentialTab'
							title='โปรโมชั่น'
							// title='优惠活动'
							component={PreferentialTab}
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>
						<Scene
							key='DailyDealAddress'
							component={DailyDealAddress}
							title='ที่อยู่ในการจัดส่ง'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='DailyDealPage'
							component={DailyDealPage}
							title='ข้อมูลโปรโมชั่น'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='RebateRecordDetail'
							component={RebateRecordDetail}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							titleStyle={styles.titleStyle}
							tabBarStyle={{ backgroundColor: '#D5D5D5' }}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='Lottery'
							component={Lottery}
							title='ซินเจียยู่อี่ ซินนี้ฮวดไช้'
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							navigationBarStyle={{
								backgroundColor: '#C90808'
							}}
							backButtonTintColor='#fff'
							titleStyle={[styles.titleStyle, { fontSize: 13 }]}
							tabBarStyle={{ backgroundColor: '#E61F29' }}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>


						<Scene
							key='WorldCup'
							title='FUN88 x World Cup 2022'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							headerLayoutPreset={'center'}
							component={WorldCup}
							renderRightButton={this.renderRightCSButton.bind(this)}
						>
						</Scene>


						<Scene
							key='WordNewsAll'
							title='TIN TỨC'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							headerLayoutPreset={'center'}
							component={WordNewsAll}
							renderRightButton={this.renderRightCSButton.bind(this)}
						>
						</Scene>

						<Scene
							key='WordNewsDetails'
							title='TIN TỨC'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							headerLayoutPreset={'center'}
							component={WordNewsDetails}
							renderRightButton={this.renderRightCSButton.bind(this)}
						>
						</Scene>


						<Scene
							key='LotteryHostory'
							title='Lịch Sử Thưởng Của Tôi'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							headerLayoutPreset={'center'}
							component={LotteryHostory}
							renderRightButton={this.renderRightCSButton.bind(this)}
						>
						</Scene>

						<Scene
							key='LotteryRule'
							title='Điều Khoản Và Điều Kiện'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							headerLayoutPreset={'center'}
							component={LotteryRule}
							renderRightButton={this.renderRightCSButton.bind(this)}
						>
						</Scene>

						<Scene
							key='DailyDealShipping'
							component={DailyDealShipping}
							title='ที่อยู่ในการจัดส่ง'
							titleStyle={styles.titleStyle}
							//back
							renderLeftButton={this.renderLeftBack.bind(this)}
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='WithdrawalVerification'
							component={WithdrawalVerification}
							hideNavBar
						// titleStyle={styles.titleStyle}
						// back
						// backButtonTintColor='#fff'
						// renderLeftButton={() => {
						// 	return null
						// }}
						//renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						<Scene
							key='WithdrawalPEVerification'
							title='ยืนยันบัญชี'
							component={WithdrawalPEVerification}
							titleStyle={styles.titleStyle}
							// back
							// backButtonTintColor='#fff'
							renderLeftButton={this.renderLeftBack.bind(this, 'X')}
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>

						{/* ====== SB 2.0 ====== start
						<Scene
							titleStyle={styles.titleStyle}
							key="SbSports"
							component={SbSports}
							panHandlers={null}
							hideNavBar
						/>
						<Scene
							titleStyle={styles.titleStyle}
							key="TransferSb"
							component={TransferSb}
							title="Chuyển Khoản" //转账
							// renderRightButton={this.renderRightCSButton.bind(this)}
							back
							backButtonTintColor="#fff"
						// navigationBarStyle={styles.navigationBarStyleSB}
						/>
						<Stack
							key="NewsSb"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="NewsSb" component={NewsSb} />
						</Stack>
						<Scene
							titleStyle={styles.titleStyle}
							hideNavBar
							key="NewsDetailSb"
							component={NewsDetailSb}
							title="消息详情"
							back
							backButtonTintColor="#fff"
							navigationBarStyle={styles.navigationBarStyleSB}
						/>
						<Scene
							titleStyle={styles.titleStyle}
							hideNavBar
							key="NotificationDetail"
							component={NotificationDetail}
							title="消息详情"
							back
							backButtonTintColor="#fff"
							navigationBarStyle={styles.navigationBarStyleSB}
						/>
						<Stack
							key="BetTutorial"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="BetTutorial" component={BetTutorial} />
						</Stack>

						<Stack
							key="Rules"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="Rules" component={Rules} />
						</Stack>
						<Scene
							titleStyle={styles.titleStyle}
							key="Setting"
							component={Setting}
							title="Cài Đặt Hệ Thống"
							back
							backButtonTintColor="#fff"
							navigationBarStyle={[styles.navigationBarStyleSB, { backgroundColor: isBlue ? '#00a6ff' : '#000' }]}
						/>
						<Scene
							titleStyle={styles.titleStyle}
							key="SetTingModle"
							component={SetTingModle}
							title="Tùy Chỉnh Tiền Cược"//自定义快捷金额
							back
							backButtonTintColor="#fff"
							navigationBarStyle={[styles.navigationBarStyleSB, { backgroundColor: isBlue ? '#00a6ff' : '#000' }]}
						/>
						<Stack
							key="search"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="search" component={search} />
						</Stack>
						<Stack
							key="betRecord"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="betRecord" component={betRecord} />
						</Stack>
						<Stack
							key="Betting_detail"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="Betting_detail" component={Betting_detail} />
						</Stack>
						<Stack
							key="SbShare"
							headerLayoutPreset="center"
							navigationBarStyle={styles.navigationBarStyleHeightsmall}
							hideNavBar
						>
							<Scene key="SbShare" component={SbShare} />
						</Stack>
						<Scene
							key='SbPromotion'
							title='โปรโมชั่น'
							component={PreferentialTab}
							titleStyle={styles.titleStyle}
							back
							backButtonTintColor='#fff'
							renderRightButton={this.renderRightCSButton.bind(this)}
						/>*/}
						{/* ====== SB 2.0 ====== end*/}

					</Stack>
				</Lightbox>

				<Stack
					key='LiveChat'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='ฝ่ายบริการลูกค้า'
					headerLayoutPreset={'center'}
					titleStyle={styles.titleStyle}
				>
					<Scene component={LiveChat} />
				</Stack>

				<Stack
					key='TransferStack'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='โอนเงิน'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={Transfer} />
				</Stack>

				<Stack
					key='PreferentialPage'
					title='ข้อมูลโบนัส'
					titleStyle={styles.titleStyle}
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={PreferentialPage} />
				</Stack>

				<Stack
					key='GamePage'
					titleStyle={styles.titleStyle}
					// back
					hideNavBar={true}
					backButtonTintColor='#fff'
					headerLayoutPreset={'center'}
				>
					<Scene component={GamePage} />
				</Stack>

				<Stack
					key='FreeBetPage'
					titleStyle={styles.titleStyle}
					hideNavBar={true}
					headerLayoutPreset={'center'}
				>
					<Scene component={FreeBetPage} />
				</Stack>

				<Stack
					key='PreferentialRecords'
					headerLayoutPreset={'center'}
					title='โปรโมชั่น'
					titleStyle={styles.titleStyle}
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={PreferentialRecords} />
				</Stack>

				<Stack
					key='LoginOtpPage'
					hideNavBar={true}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene
						component={LoginOtpPage}
					></Scene>
				</Stack>

				<Stack
					key='BqrDeposit'
					//back
					backButtonTintColor='#fff'
					title='QR ฝากเงินทศนิยม'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderLeftButton={this.renderLeftBack.bind(this, 'X')}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='BqrDeposit' component={BqrDeposit} />
				</Stack>


				<Stack
					key='DepositStack'
					//back
					backButtonTintColor='#fff'
					title='ฝากเงิน'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderLeftButton={this.renderLeftBack.bind(this, 'X')}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={Deposit} />
				</Stack>

				<Stack
					key='WithdrawalsStack'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='RÚT TIỀN'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={Withdrawals} />
				</Stack>


				<Stack
					key='LoginPage'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					title='  '
					backButtonTintColor='#fff'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={LoginPage} />
				</Stack>


				<Stack
					key='LBdepositPage'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='Ngân Hàng Địa Phương'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='LBdepositPage' component={LBdepositPage} />
				</Stack>

				<Stack
					key='PreferentialApplication'
					headerLayoutPreset={'center'}
					title='ขอรับโบนัส'
					titleStyle={styles.titleStyle}
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={PreferentialApplication} />
				</Stack>

				<Stack
					key='FreebetSetting'
					title='Thưởng Miễn Phí'
					titleStyle={styles.titleStyle}
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={FreebetSetting} />
				</Stack>

				<Stack
					key='DailyDealsApplication'
					title='ข้อมูลรับโบนัสเดิมพันฟรี'
					titleStyle={[styles.titleStyle, { fontSize: 14 }]}
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={DailyDealsApplication} />
				</Stack>


				<Stack
					key='NewBank'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='ข้อมูลธนาคาร'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='NewBank' component={NewBank} />
				</Stack>

				<Stack
					key='THBQRBankList'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='รายชื่อธนาคาร'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='THBQRBankList' component={THBQRBankList} />
				</Stack>


				<Stack
					key='RdDeposit'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='เพิ่มบัญชีธนาคาร'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='RdDeposit' component={RdDeposit} />
				</Stack>





				<Stack
					key='THBQRPage'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='ฝากเงิน'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='THBQRPage' component={THBQRPage} />
				</Stack>




				<Stack
					key='SBGuiderModal'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					hideNavBar
					backButtonTintColor='#fff'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='SBGuiderModal' component={SBGuiderModal} />
				</Stack>


				<Stack
					key='Records'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					title='ประวัติการทำรายการ'
					backButtonTintColor='#fff'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='Records' component={Records} />
				</Stack>

				<Stack
					key='RecordsDatails'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='RecordsDatails' component={RecordsDatails} />
				</Stack>

				<Stack
					key='RecordsManualDeposit'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='ประวัติการฝาก'  //存款紀錄
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='RecordsManualDeposit' component={RecordsManualDeposit} />
				</Stack>

				<Stack
					key='RecordsManualWithdrawal'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='ประวัติการถอน' //提款紀錄
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='RecordsManualDeposit' component={RecordsManualDeposit} />
				</Stack>


				<Stack
					key='RedoDepositTransaction'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='ส่งรายการฝากเงินอีกครั้ง'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='RedoDepositTransaction' component={RedoDepositTransaction} />
				</Stack>

				<Stack
					key='FinanceAfter'
					hideNavBar
				// back
				// backButtonTintColor='#fff'
				// titleStyle={styles.titleStyle}
				// headerLayoutPreset={'center'}
				//renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='FinanceAfter' component={FinanceAfter} />
				</Stack>

				<Stack
					key='BankDetails'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='CHI TIẾT NGÂN HÀNG'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene key='BankDetails' component={BankDetails} />
				</Stack>

				<Stack
					key='UploadFileStatusStack'
					// back
					// backButtonTintColor='#fff'
					// title='Biên Lai Gửi Tiền'
					// titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					hideNavBar={true}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={UploadFileStatus} />
				</Stack>

				<Stack
					key='UploadfileDemo'
					//back
					renderLeftButton={this.renderLeftBack.bind(this)}
					backButtonTintColor='#fff'
					title='เอกสารยืนยันตัวตน'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
				>
					<Scene component={UploadfileDemo} />
				</Stack>



				<Stack
					key='Verification'
					titleStyle={styles.titleStyle}
					hideNavBar={true}
					headerLayoutPreset={'center'}
				>
					<Scene
						component={Verification}
					/>
				</Stack>

				<Stack
					key='PhoneEmailErrorModal'
					titleStyle={styles.titleStyle}
					hideNavBar={true}
					headerLayoutPreset={'center'}
				>
					<Scene
						component={PhoneEmailErrorModal}
					/>
				</Stack>

				<Stack
					key='DepositPageStack'
					//back
					title='    '
					backButtonTintColor='#fff'
					titleStyle={styles.titleStyle}
					headerLayoutPreset={'center'}
					renderRightButton={this.renderRightCSButton.bind(this)}
					renderLeftButton={this.renderLeftBack.bind(this, 'X')}
				>
					<Scene
						key='DepositPageStack' component={DepositPage} />
				</Stack>



				{

					// 	<Stack
					// 	key="EuroCup"
					// 	headerLayoutPreset="center"
					// 	navigationBarStyle={[styles.navigationBarStyleHeightsmall, { backgroundColor: isBlue ? '#00a6ff' : '#212121', }]}
					// >
					// 	<Scene key="EuroCup" component={EuroCup} />
					// </Stack>
					// <Stack
					// 	key="EuroCupGroup"
					// 	headerLayoutPreset="center"
					// 	back
					// 	backButtonTintColor="#fff"
					// 	navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: isBlue ? '#00a6ff' : '#212121', }]}
					// >
					// 	<Scene titleStyle={styles.titleStyle} key="EuroCupGroup" component={EuroCupGroup} title="Dữ liệu" renderRightButton={this.renderRightCSButton.bind(this)} />
					// </Stack>
					// <Stack
					// 	key="EuroGroupDetail"
					// 	headerLayoutPreset="center"
					// 	back
					// 	backButtonTintColor="#fff"
					// 	navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: isBlue ? '#00a6ff' : '#212121', }]}
					// >
					// 	<Scene titleStyle={styles.titleStyle} key="EuroGroupDetail" component={EuroGroupDetail} title="Đội Bóng" renderRightButton={this.renderRightCSButton.bind(this)} />
					// </Stack>
					// <Stack
					// 	key="LoginModal"
					// 	hideNavBar={true}
					// 	headerLayoutPreset="center"
					// 	navigationBarStyle={[styles.navigationBarStyleHeightsmall, { backgroundColor: isBlue ? '#00a6ff' : '#212121', }]}
					// >
					// 	<Scene key="Login" component={Login} />
					// </Stack>
					// <Stack
					// 	key="EuroPlayerDetail"
					// 	headerLayoutPreset="center"
					// 	back
					// 	backButtonTintColor="#fff"
					// 	navigationBarStyle={[styles.navigationBarStyle, { backgroundColor: isBlue ? '#00a6ff' : '#212121', }]}
					// >
					// 	<Scene titleStyle={styles.titleStyle} key="EuroPlayerDetail" component={EuroPlayerDetail} title="Dữ Liệu Cầu Thủ" renderRightButton={this.renderRightCSButton.bind(this)} />
					// </Stack>
				}
			</Modal>
		</RouterWithRedux>
	}
}

const mapStateToProps = state => {
	return {
		scene: state.scene.scene,
		liveChatData: state.liveChatData
	}
}

const mapDispatchToProps = dispatch => ({
	logout: loginDetails => {
		logout(dispatch, loginDetails)
	},
	userInfo_logout: () => dispatch(ACTION_UserInfo_logout()),
	getBalanceInforAction: () => dispatch(getBalanceInforAction()),
	getStateRouterNameAction: (data) => dispatch(getStateRouterNameAction(data)),
	changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
	getNewsStatisticsAction: (flag, unreadCounts) => dispatch(getNewsStatisticsAction(flag, unreadCounts)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Main)

const styles = StyleSheet.create({
	navigationBarStyleHeightsmall: {
		borderBottomWidth: 0,
	},
	navigationBarStyle: {

		borderBottomWidth: 0,
	},
	navigationBarStyleSB: {
		backgroundColor: "#00a6ff",
		borderBottomWidth: 0,
		height: Platform.OS === "ios" ? 44 : 50
		// paddingHorizontal: 20,
	},
	navBar: {
		// height: 80,
		// color: '#fff'
	},
	navBarBX: {
		height: 0,
		borderColor: '#000',
		borderBottomWidth: 0,
	},
	routerScene: {
		padding: 0
	},
	navTitle: {
		color: 'white'
	},
	tabBarStyle: {
		height: IsNotIphoneX ? 55 : 54
	},
	tabBarSelectedItemStyle: {
		backgroundColor: '#fff',
	},
	titleStyle: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	homeCsWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	homeCSImg: {
		width: 28,
		height: 28
	},
	homeLeftWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 5
	},
	leftIcon: {
		width: 24,
		height: 24
	},
	homeCsText: {
		color: '#fff',
		fontSize: 12,
	},
	homeLogo: {
		width: .35 * width,
		height: .08 * width,
	},
	hiddenView: {
		width: 40,
		height: 40,
		zIndex: 1000,
		marginLeft: 10,
		marginTop: 10
	},
})
