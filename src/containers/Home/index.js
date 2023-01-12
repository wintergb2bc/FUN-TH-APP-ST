import React from 'react'
import { Linking, Modal, Share, StyleSheet, Text, Image, ActivityIndicator, View, Platform, ScrollView, Dimensions, TouchableOpacity, NativeModules, RefreshControl, DeviceEventEmitter, ImageBackground } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import HomeFreeBetModal from './../FreeBet'
import Maintenance from './Maintenance'
import { connect } from 'react-redux'
import { getMemberInforAction, getBalanceInforAction, changeHomeRegistLoginModalAction, changeDepositTypeAction, getNewsStatisticsAction, getSelfExclusionsAction, getPromotionListInforAction } from '../../actions/ReducerAction'
import { toThousands } from '../../actions/Reg'
import moment from 'moment'
import PiwikProSdk from "@piwikpro/react-native-piwik-pro-sdk";
import FastImage from "react-native-fast-image";
import * as Animatable from 'react-native-animatable'
import RecommendModal from './../Account/Recommend/RecommendModal'
import FreebetQualificationsModal from './../FreeBet/FreeBetModal/FreebetQualificationsModal'
import { DepositDatas } from './../Common/CommonData'
import LoadIngImgActivityIndicator from './../Common/LoadIngImgActivityIndicator'
import LoginOtp from './../LoginOtp'
import LoadingBone from './../Common/LoadingBone'
import { GameLockText, GameMaintenanceText } from './../Common/CommonData'
import HomeFirstRegistPop from './HomeFirstRegistPop'
import Touch from 'react-native-touch-once';
import { timeout_fetch } from '../SbSports/lib/SportRequest';
import { getAllVendorToken, removeVendorToken } from '../SbSports/lib/js/util';
import UploadfileModal from './../Account/Uploadfile/UploadfileModal'
const { Openinstall } = NativeModules
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
const AnimatableImage = Animatable.Image
const GamePiwikMenberText1 = ['Sports_homepage', 'Esport_homepage', 'Live_homepage', 'Slot_homepage', '3Dcasino_homepage', 'Lottery_homepage']
const GamePiwikMenberText2 = {
	VTG: 'V2G_VirtualSports_Home', // 1
	OWS: 'OW_Sports_Home ',
	IPSB: 'IM_Sports_Home',
	CMD: 'CMD_Sports_Home',
	SBT: 'BTI_Sports_Home',
	TFG: 'TF_Esports_Home',
	IPES: 'IM_Esports_Home',
	SPR: 'Spribe_InstantGames_Home',
	GPI: 'GPI_LiveDealer_Home',
	EBT: 'eBET_LiveDealer_Home',
	EVO: 'EVO_LiveDealer_Home',
	SXY: 'SEXY_LiveDealer_Home',
	SAL: 'SA_LiveDealer_Home',
	NLE: 'N2_LiveDealer_Home',
	AG: 'AG_LiveDealer_Home',
	WMC: 'WM_LiveDealer_Home',
	TG_LIVECASINO: 'PP_LiveDealer_Home',
	PGS: 'PG_Slots_Home',
	TG_SLOT: 'PP_Slots_Home',
	JKR_SLOT: 'JK_Slots_Home',
	MGSQF: 'MGS_Slots_Home',
	JIF: 'Jilli_Fishing_Home',
	PNG: 'PNG_Slots_Home',
	SPG: 'SG_Slots_Home',
	BSG: 'BSG_Slots_Home',
	SWF: 'SW_Slots_Home',
	CQG: 'GQ9_Slots_Home',
	IMOPT: 'PT_Slots_Home',
	IMONET: 'NET_Slots_Home',
	FISHING: 'Fishing_Home',
	TGP_P2P: 'KingMaker_P2P_Home',
	KPK: 'KingPoker_P2P_Home',
	JKR_P2P: 'Joker_P2P_Home',
	TCG: 'TC_Lottery_Home',
	GPK: 'GPK_Lottery_Home',
	SLC: 'SLC_Lottery_Home'

}

const PromotionAvailablePreference = {
	LIVEDEALER: {
		promotioncategoryId: 4,
		pageType: 'Casino'
	},
	SPORTSBOOK: {
		promotioncategoryId: 2,
		pageType: 'Sport'
	},
	RNG: {
		promotioncategoryId: 5,
		pageType: 'Slot'
	},
	KENO: {
		promotioncategoryId: 3,
		pageType: 'Keno'
	},
	GENERAL: {
		promotioncategoryId: 1,
		pageType: 'Member'
	}
}

class HomeContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			bannerData: null,
			bannerIndex: 0,
			gameTabsKey: 0,
			gameSequences: [],
			promotions: [],
			eligible: '',
			isDeposited: false,
			isGetMemberInfor: false,
			refreshing: false,
			isGetEligible: false,
			isShowModalHomeFreeBet: true,
			isFreebetQualificationsModal: false,
			promotioncategoryId: 1,
			pageType: 'Member',
			isMaintenance: false,
			retryAfter: '',
			homeModalLoginRegisterStatus: false,
			homeModalLoginRegisterStatus1: false,
			isShowGameModal: false,
			tempGameInfor: '',
			tempGameCode: '',
			isGetGameLoadUrl: false,

			DisplayReferee: false,
			isShowDisplayReferee: true,
			IsQueleaRegistered: false,

			isShowLoginOtp: true,
			loginOTP: false,

			gameLoadObj: {},

			miniGames: [],
			miniGamesIndex: 0,
			featureIcoloadObj: {},
			SBGameModal: false,
			SBCurrentGame: {},
			isShowWalletGameModal: false,
			balanceInforData: [],
			GameOpenUrl: '',
			gametype: '',
			gameHeadName: '',
			walletCode: '',
			recommendedGameList: [],
			recommendedGameTitle: '',
			aviatorObj: {
				provider: '',
				gameId: '',
				tempArr: ''
			},
			isShowHasMoneyView: false,
			isShowUploadModal: false,
			isShowUploadGuideModal: false,
			sprStatus: '',
			walletCodeMapping: ''
		}
	}

	componentDidMount(props) {
		// this.getIMGameisMaintenance()
		//this.getMaintenanceStatus()
		this.getMiniGames()
		this.getSprMaintenanceStatus()
		// ApiPort.UserLogin && this.props.getSelfExclusionsAction()
		this.getSequence()
		this.getMemberBalance(this.props)
		this.getPromotionList(this.props)
		this.props.getPromotionListInforAction()
		this.getBlockBox()
		//!ApiPort.UserLogin && this.getGameList()
		//this.getDepositList(true)
		this.getRecommendedGameList()
		this.getBannerChange()
		this.getLoginCDUActivateStatus()
		if (ApiPort.UserLogin) {
			//@友盟推送PMA 並登錄成功 帶入pma頁面
			//@benji
			if (UmPma == true) {  //@UmPma 全局參數
				setTimeout(() => {
					Actions.jump('news')
					UmPma = false
				}, 1000)
			}
		}
		Toast.hide()
	}


	getSprMaintenanceStatus() {
		fetchRequest(ApiPort.GetMaintenanceStatus + 'ProviderCode=AVIATOR&', 'GET').then(res => {
			this.setState({
				sprStatus: res
			})
			window.sprStatus = res
		})
	}

	componentWillReceiveProps(nextProps) {
		if (ApiPort.UserLogin) {
			this.getMemberBalance(nextProps)
		}

		this.getPromotionList(nextProps)
	}

	getBannerChange() {
		if (ApiPort.UserLogin) {
			this.availablePreference = DeviceEventEmitter.addListener('availablePreference', res => {
				
				this.getGamePreference()
				if (this.availablePreference) { this.availablePreference.remove() }
				//}
			})
			this.getGamePreference()
		} else {
			this.getBanner()
		}
	}


	async getLoginCDUActivateStatus() {
		// 111111111
		if (!ApiPort.UserLogin) return
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let getCDUActivate = await this.getCDUActivate()
		let getExcludedAffiliate = await this.getExcludedAffiliate()
		let getWithdrawalNotification = await this.getWithdrawalNotification()
		let getDocumentApprovalStatus = await this.getDocumentApprovalStatus()
		Toast.hide()

		let isAffiliateMember = getExcludedAffiliate.isSuccess
		let kycRuleId = Array.isArray(getWithdrawalNotification) && getWithdrawalNotification.length ? getWithdrawalNotification[0].kycRuleId : ''
		let isPending = getDocumentApprovalStatus.isPending


		if (isAffiliateMember) {
			//&& isPending == -1
			if (kycRuleId == 5) {
				this.getStorageUserNameDB()
			}
		} else {
			this.getStorageUserNameDB()
		}
	}

	getStorageUserNameDB() {
		global.storage.load({
			key: 'getLiveAnnouncement' + window.userNameDB,
			id: 'getLiveAnnouncement' + window.userNameDB,
		}).then(data => {
		}).catch(() => {
			this.getStorageUserNameDB1()

			global.storage.save({
				key: 'getLiveAnnouncement' + window.userNameDB,
				id: 'getLiveAnnouncement' + window.userNameDB,
				data: window.userNameDB,
				expires: null
			})
		})
	}

	async getStorageUserNameDB1() {
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let getLiveAnnouncement = await this.getLiveAnnouncement()
		Toast.hide()
		if (getLiveAnnouncement.isSuccess) {
			this.setState({
				isShowUploadModal: true
			})
		}
	}

	async getExcludedAffiliate(list0) {
		return fetchRequest(ApiPort.KYCVerification + 'getExcludedAffiliate?', 'GET')
	}

	async getDocumentApprovalStatus() {
		return fetchRequest(ApiPort.KYCVerification + 'getDocumentApprovalStatus?', 'GET')
	}


	async getLiveAnnouncement(list0) {
		return fetchRequest(ApiPort.KYCVerification + 'getLiveAnnouncement?', 'GET')
	}


	async getCDUActivateStatus() {
		if (!ApiPort.UserLogin) return
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let getCDUActivate = await this.getCDUActivate()
		Toast.hide()
		if (getCDUActivate.isSuccess) {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
			let getWithdrawalNotification = await this.getWithdrawalNotification()
			Toast.hide()
			if (Array.isArray(getWithdrawalNotification) && getWithdrawalNotification.length) {
				let list0 = getWithdrawalNotification[0]
				let kycRuleId = list0.kycRuleId
				if (kycRuleId == 5) { // 5
					Toast.loading('กำลังโหลดข้อมูล...', 2000)
					let getKYCLockActivity = await this.getKYCLockActivity()
					Toast.hide()
					const { isKycGameLock, isKycDepositLock } = getKYCLockActivity
					if (isKycGameLock) { //我们注意到您帐户存在异常。 请在个人资料-“上传文件页面”上传所需文件以验证您的身份，或联系在线客服寻求协助。
						Actions.WithdrawalVerification({
							withdrawalType: 'KYCRULEID5',
							bankName: ''
						})
					} else {
						if (isKycDepositLock) { //我们注意到您帐户存在异常。 请在个人资料-“上传文件页面”上传所需文件以验证您的身份，或联系在线客服寻求协助
							Actions.WithdrawalVerification({
								withdrawalType: 'KYCRULEID5',
								bankName: ''
							})
						} else {
							return 'open'
						}
					}
				} else { // Continue process
					return 'open'
				}
			} else {
				return 'open'
			}
		} else {// Continue process
			return 'open'
		}
	}

	async getCDUActivate() {
		return fetchRequest(ApiPort.KYCVerification + 'getCDUActivate?', 'GET')
	}


	async getWithdrawalNotification() {
		return fetchRequest(ApiPort.KYCVerification + 'getWithdrawalNotification?withdrawalAmt=' + 0 + '&', 'GET')
	}

	async getKYCLockActivity() {
		return fetchRequest(ApiPort.KYCVerification + 'getKYCLockActivity?', 'GET')
	}

	changeShowUploadModal({ isShowUploadModal, isShowUploadGuideModal }) {
		this.setState({
			isShowUploadModal,
			isShowUploadGuideModal
		})
	}


	getRecommendedGameList() {
		if (!ApiPort.UserLogin) return

		global.storage.load({
			key: 'getRecommendedGameList',
			id: 'getRecommendedGameList'
		}).then(res => {
			this.setState({//最近玩过的游戏
				recommendedGameList: res.gameList,
				recommendedGameTitle: res.title,
				recommendedGameImg: res.type.toLocaleUpperCase() == 'RECOMMENDED' ? require('./../../images/home/homeIcon55.png') : require('./../../images/home/homeIcon5.png'),
			})
		}).catch(() => { })

		fetchRequest(ApiPort.RecommendedGameList, 'GET').then(res => {
			if (res.isSuccess && Array.isArray(res.gameList) && res.gameList.length) {
				this.setState({//最近玩过的游戏
					recommendedGameList: res.gameList,
					recommendedGameTitle: res.title,
					recommendedGameImg: res.type.toLocaleUpperCase() == 'RECOMMENDED' ? require('./../../images/home/homeIcon55.png') : require('./../../images/home/homeIcon5.png'),
				})

				global.storage.save({
					key: 'getRecommendedGameList',
					id: 'getRecommendedGameList',
					data: res,
					expires: null
				})
			}
		}).catch(() => {
			Toast.hide()
		})
	}

	componentWillUnmount() {
		if (this.availablePreference) { this.availablePreference.remove() }
	}


	getWalletProviderMapping() {
		global.storage.load({
			key: 'walletCodeMapping',
			id: 'walletCodeMapping'
		}).then(data => {
			this.setState({
				walletCodeMapping: data,
			})
		}).catch(() => { })
		fetchRequest(ApiPort.WalletProviderMapping, 'GET').then(res => {
			if (res) {
				this.setState({
					walletCodeMapping: res
				})
				const { gameSequences } = this.state
				let walletProviderMapping = res
				gameSequences.forEach(v1 => {
					v1.subProviders.forEach(v2 => {
						for (let v3 in walletProviderMapping) {
							let tempList = walletProviderMapping[v3].map(v => v.toLocaleUpperCase()) || []

							let walletInfor = tempList.find(v => v.includes(v2.code.toLocaleUpperCase()))
							if (walletInfor) {
								v2.walletCode = v3.toLocaleUpperCase()
							}
							if (v2.code == "AVIATOR") {
								v2.walletCode = 'P2P'
							}

							// if (v2.code == "FISHING") {
							// 	v2.walletCode = 'FISH'
							// }
						}
					})
				})
				global.storage.save({
					key: 'GameSequence',
					id: 'GameSequence',
					data: this.state.gameSequences,
					expires: null
				})
				global.storage.save({
					key: 'walletCodeMapping',
					id: 'walletCodeMapping',
					data: res,
					expires: null
				})
			}
		}
		).catch(err => {
		})
	}

	// 獲取維護資訊
	getMaintenanceStatus = () => {
		const providers = ['IPSB']; // 樂天堂體育、IM體育
		let processed = [];

		providers.forEach(function (provider) {
			processed.push(fetchRequest(`${ApiPort.GetProvidersMaintenanceStatus}provider=${provider}&`));
		});

		Promise.all(processed).then((res) => {
			let IMSportStatus;

			if (res) {
				IMSportStatus =
					res[0].ErrorCode == 0 && res[0].Result && res[0].Result.find((v) => v.PlatformGroup === 'Apps')['IsMaintenance'];

				this.props.maintainStatus_setIM(IMSportStatus === true);

				//和token獲取狀態一起判斷
				// IMSportStatus = this.checkMaintenanceStatus('im');
			}
		});
	};
	getIMGameisMaintenance() {
		//获取im欧冠是否维护
		let params = {
			'token': ApiPort.UserLogin ? ApiPort.Token.split(' ')[1] : '',
			'provider': 'IPSB',
			'hostName': common_url,
			'productCode': 'IPSB',
			'platform': 'Mobile',
			'mobileLobbyUrl': common_url,
			'sportsMenu': '',
			'bankingUrl': common_url,
			'logoutUrl': common_url + '/accessdenied',
			'supportUrl': common_url
		}
		fetchRequest(ApiPort.Game + '0?isDemo=false&', 'POST', params).then(res => {
			let data = res.gameResponse
			if (data.isMaintenance == true) {
				this.props.maintainStatus_setIM(true);
			}
		}).catch(() => {

		})
	}



	getDepositList(flag) {
		if (!ApiPort.UserLogin) return
		const depositMethod = ['RD', 'LB', 'THBQR', 'TMW', 'EZP', 'BC', 'CC', 'LINE', 'BQR']
		fetchRequest(ApiPort.Payment + '?transactionType=deposit&', 'GET').then(res => {
			if (Array.isArray(res) && res.length) {
				let depositList = res.filter(v => depositMethod.includes(v.code.toLocaleUpperCase()))

				global.storage.save({
					key: 'depositListName',
					id: 'depositListName',
					data: depositList.filter(v => v.code),
					expires: null
				})
			}

			if (flag) {
				this.props.getNewsStatisticsAction('all')
			}
		}).catch(err => { })
	}

	refreshingHome() {
		this.setState({
			refreshing: true,
			isShowLoginOtp: true
			//isShowModalHomeFreeBet: true
		})
		this.getBannerChange()
		this.getSequence(true)
		this.props.getPromotionListInforAction()
		this.getMemberBalance()
		//this.getGameList()
		this.getMiniGames()
		if (ApiPort.UserLogin) {
			this.props.getMemberInforAction()
			this.props.getNewsStatisticsAction('all')
			this.props.getSelfExclusionsAction()
			this.props.getBalanceInforAction()
			//this.getDepositList()
			this.getRecommendedGameList()
		}
		this.getSprMaintenanceStatus()
	}


	getMiniGames() {
		fetchRequest(ApiPort.GetMiniGamesBanners, 'GET').then(res => {
			if (res.isSuccess) {
				let miniGames = res.result

				this.setState({
					miniGames
				})

				if (!ApiPort.UserLogin) return
				if (window.isReLotteryFlag) {
					let miniGame = miniGames.find(v => v.name.toLocaleUpperCase() === 'CHINESENEWYEAR23')
					miniGame && Actions.Lottery()
					window.isReLotteryFlag = false
				}

				if (window.isBannerReSqrFlag) {
					const { gameSequences } = this.state
					let miniGame = miniGames.find(v => v.providerCode.toLocaleUpperCase() === 'SPR')
					let { redirectUrl } = miniGame
					const tempKenoArr = gameSequences.find(v => v.code.toLocaleUpperCase() === 'InstantGames'.toLocaleUpperCase())
					const item = tempKenoArr.subProviders[0]
					if (redirectUrl.length) {
						this.checkGameWallet({
							gameLobbyUrl: redirectUrl,
							item,
							gametype: 'SPR',
							gameHeadName: `${item.name} ${item.productCode}`,
							walletCode: item.walletCode,
							isFromSB: window.isFromSB ? true : false
						})
					}
					window.isBannerReSqrFlag = false
					window.isFromSB = false

				}


				global.storage.save({
					key: 'miniGames',
					id: 'miniGames',
					data: miniGames,
					expires: null
				})
			}
		}).catch(err => { })
	}

	getGameList(flag) {
		let requests = ['mobileslot', 'mobilep2p', 'mobilekenolottery', 'mobileinstantgames', 'mobilesportsbook'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {

			global.storage.save({
				key: 'GameDatdSlotFish',
				id: 'GameDatdSlotFish',
				data: res[0],
				expires: null
			})

			global.storage.save({
				key: 'GameDatdP2pIpk',
				id: 'GameDatdP2pIpk',
				data: res[1],
				expires: null
			})


			global.storage.save({
				key: 'GameDatdKeno',
				id: 'GameDatdKeno',
				data: res[2],
				expires: null
			})

			global.storage.save({
				key: 'GameDatainstantgames',
				id: 'GameDatainstantgames',
				data: res[3],
				expires: null
			})

			global.storage.save({
				key: 'GameDatdSportsbook',
				id: 'GameDatdSportsbook',
				data: res[4].filter(v => v.provider == "VTG"),
				expires: null
			})

		}).catch(err => { })
	}


	getGamePreference() {
		if (!ApiPort.UserLogin) return
		fetchRequest(ApiPort.GetGamePreference, 'GET').then(res => {
			//if (res.isSuccess) {
			let playerPreference = res.playerPreference.toLocaleUpperCase()
			if (playerPreference) {
				let PromotionAvailablePreferenceList = PromotionAvailablePreference[playerPreference] || PromotionAvailablePreference['GENERAL']
				let promotioncategoryId = PromotionAvailablePreferenceList.promotioncategoryId + ''
				let pageType = PromotionAvailablePreferenceList.pageType
				this.setState({
					promotioncategoryId: promotioncategoryId ? promotioncategoryId : 1,
					pageType,
					bannerIndex: 0,
				}, () => {
					this.getBanner(pageType)
				})
			}
			//}
		}).catch(err => { })
	}

	getMemberBalance(props) {
		if (!(ApiPort.UserLogin && props)) return
		this.setState({
			isGetEligible: false,
			eligible: '',
			isGetMemberInfor: false,
			DisplayReferee: false,
			IsQueleaRegistered: false
		})
		let balanceInforData = props.balanceInforData
		if (balanceInforData && Array.isArray(balanceInforData) && balanceInforData.length > 0) {
			this.setState({
				TotalBal: balanceInforData.find(v => v.name === 'TOTALBAL').balance,
				isShowHasMoneyView: balanceInforData.find(v => v.name === 'TOTALBAL').balance <= 0,
				balanceInforData,
			})
		}

		let memberInfor = props.memberInforData
		if (!(Boolean(memberInfor) && Boolean(memberInfor.MemberCode))) return
		this.setState({
			loginOTP: memberInfor.LoginOTP || memberInfor.loginOTP
		})
		if (memberInfor) {
			if (memberInfor.freeBetStatus) {
				this.setState({
					isGetEligible: true,
					eligible: memberInfor.freeBetStatus.eligible,
					homeModalLoginRegisterStatus: false
				})
			} else {
				this.setState({
					homeModalLoginRegisterStatus1: this.state.homeModalLoginRegisterStatus
				})
			}
			const DisplayReferee = memberInfor.DisplayReferee
			const IsQueleaRegistered = memberInfor.IsQueleaRegistered
			const loginOTP = memberInfor.LoginOTP
			this.setState({
				isGetMemberInfor: true,
				DisplayReferee,
				IsQueleaRegistered,
				loginOTP
			})
		}
	}

	getPromotionList(props) {
		if (!props) return
		let promotions = props.promotionListData
		if (Array.isArray(promotions) && promotions.length) {
			this.setState({
				promotions
			})
		}
	}
	getSequence(flag) {
		global.storage.load({
			key: 'GameSequence',
			id: 'GameSequence'
		}).then(gameSequences => {
			if (gameSequences.length) {
				let gameSequencesCasino = gameSequences.find(v => v.code.toLocaleUpperCase() === 'CASINO')
				this.setState({
					gameSequences
				})
			}
		}).catch(() => { })
		fetchRequest(ApiPort.Sequence, 'GET').then(gameSequences => {
			this.setState({
				refreshing: false
			})
			//if (res.isSuccess) {
			if (Array.isArray(gameSequences) && gameSequences.length) {
				let gameSequencesCasino = gameSequences.find(v => v.code.toLocaleUpperCase() === 'CASINO')
				gameSequences.forEach(v1 => {
					v1.subProviders.forEach(v2 => {
						v2.gameNewHeaderName = v1.name
					})
				})
				let tempData = gameSequences.find(v => v.code.toUpperCase() === 'INSTANTGAMES')
				if (tempData) {
					let tempsubProviders = tempData.subProviders
					if (Array.isArray(tempsubProviders) && tempsubProviders.length) {
						let tempArr = tempsubProviders[1]
						if (tempArr) {
							this.getSprHotGameId(tempArr)
						}
					}
				}
				this.setState({
					gameSequences: gameSequences
				}, () => {
					ApiPort.UserLogin && this.getWalletProviderMapping()
				})
			}
			//}
		}).catch(() => { })
	}

	getSprHotGameId(tempArr) {
		let { code } = tempArr
		fetchRequest(ApiPort.Game + '?gametype=' + 'mobileinstantgames' + '&', 'GET').then(res => {
			// if (res.isSuccess) {
			let gameList = res
			if (Array.isArray(gameList) && gameList.length) {
				let tempList = gameList.find(v => v.launchGameCode.toUpperCase() == code.toUpperCase())
				if (tempList) {
					let aviatorObj = {
						provider: tempList.provider,
						gameId: tempList.gameId,
						tempArr
					}
					this.setState({
						aviatorObj
					}, () => {
						window.isReSqrFlag && window.openSprHotGame()
					})
				}
			}
			//}
		})
	}

	async openSprHotGame(flag) {
		if (!ApiPort.UserLogin) {
			Toast.fail('กรุณาเข้าสู่ระบบ', 2)
			Actions.login({ types: 'login' })
			return
		}


		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableBetting && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}

		let gametype = ''
		let gameid = ''
		let tempArr = ''
		if (flag) {
			const { gameSequences } = this.state
			gametype = flag.providerCode
			gameid = flag.gameID
			tempArr = gameSequences.map(v => v.subProviders).flat().find(v => v.code == flag.providerCode)
		} else {
			const { aviatorObj } = this.state
			if (!(aviatorObj.provider && aviatorObj.gameId)) {
				return
			}
			gametype = aviatorObj.provider
			gameid = aviatorObj.gameId
			tempArr = aviatorObj.tempArr
		}


		if (tempArr && tempArr.name) {
			window.PiwikMenberCode('Game', 'Launch', `${tempArr.name}_Spribe_InstantGames_HotGame`)
		}




		let params = {
			'token': ApiPort.UserLogin ? ApiPort.Token.split(' ')[1] : '',
			'provider': gametype,
			'hostName': common_url,
			'productCode': gametype,
			'platform': 'Mobile',
			'mobileLobbyUrl': common_url,
			'sportsMenu': '',
			'bankingUrl': common_url,
			'logoutUrl': common_url + '/accessdenied',
			'supportUrl': common_url,
			gameid
		}

		Toast.loading('กำลังเริ่มเกม...', 2000)
		// Toast.loading('正在启动游戏,请稍候...', 2000)
		fetchRequest(ApiPort.Game + gameid + '?isDemo=false&', 'POST', params).then(res => {
			Toast.hide()
			let data = res
			if (res.isSuccess) {
				if (data.errorCode == 2001) {
					Toast.fail(GameLockText, 2)
					return
				}

				let gameLobbyUrl = data.gameLobbyUrl
				if (gameLobbyUrl.length) {

					if (!flag) {
						window.isReSqrFlag = false
					}
					this.checkGameWallet({ gameLobbyUrl, item: tempArr, gametype })
				} else {
					Toast.fail(GameMaintenanceText, 2)
				}
			} else {
				Toast.fail(GameMaintenanceText, 2)
			}
		}).catch(() => {
			Toast.fail('ระบบขัดข้อง กรุณาลองใหม่ภายหลัง', 1)
			// Toast.fa
		})
	}

	/** 獲取黑盒子參數*/
	getBlockBox() {
		Openinstall && Openinstall.getE2BlackBox && Openinstall.getE2BlackBox((error, event) => {
			if (error) {
			} else {
				Iovation = event
				E2Backbox = event
			}
		})
	}

	getBanner(pageType) {
		global.storage.load({
			key: 'homeBanner',
			id: 'homeBanner'
		}).then(data => {
			this.setState({
				bannerData: data,
			})
		}).catch(() => { })
		fetchRequest(ApiPort.Banner + `pageType=main&isLogin=${ApiPort.UserLogin}&playerPreference=${ApiPort.UserLogin ? pageType : 'Member'}&`, 'GET').then(data => {
			if (Array.isArray(data)) {
				this.setState({
					bannerData: data
				})
				global.storage.save({
					key: 'homeBanner',
					id: 'homeBanner',
					data: data,
					expires: null
				})
			}
		}).catch(err => {

		})
	}

	async playGameSort(item, gameTabsKey) {
		const { isGetGameLoadUrl } = this.state
		let gameCode = item.code.toLocaleUpperCase()
		let subProvidersCode = item.subProviders[gameTabsKey].code.toLocaleUpperCase()
		let code = item.subProviders[gameTabsKey].code

		if (('INSTANTGAMES' == gameCode && code == 'AVIATOR')) {
			if (!ApiPort.UserLogin) {
				window.isReSqrFlag = true
			}
			window.openSprHotGame()
			return
		}
		if (
			('SPORTSBOOK' == gameCode && subProvidersCode != 'VTG') ||
			('INSTANTGAMES' == gameCode && code == 'AVIATOR') ||
			(['ESPORTS', 'CASINO', 'KENO'].includes(gameCode))
		) {
			// if (item.subProviders[gameTabsKey].code == 'OWS') {
			// 	if (ApiPort.UserLogin) {
			// 		//已登入 先獲取token後跳轉
			// 		Toast.loading("กำลังโหลด...")
			// 		getAllVendorToken()
			// 			.finally(() => {
			// 				//不管成功或失敗都跳轉
			// 				Toast.hide();
			// 				lowerV = 'SABA';
			// 				Actions.SbSports({
			// 					sbType: 'OWS'
			// 				});
			// 			});
			// 	} else {
			// 		//未登入 直接跳轉
			// 		lowerV = 'SABA';
			// 		Actions.SbSports({
			// 			sbType: 'OWS'
			// 		});
			// 	}
			// 	return
			// }
			if (ApiPort.UserLogin) {
				// if (gameCode === 'CASINO' && (subProvidersCode === 'AG')) {
				if (isGameLock) {
					Toast.fail(GameLockText, 2)
					return
				}
				// 	this.setState({
				// 		isShowGameModal: true,
				// 		tempGameInfor: item.subProviders[gameTabsKey],
				// 		tempGameCode: gameCode
				// 	})
				// } else {
				this.playGame(item.subProviders[gameTabsKey], gameCode)
				// }
			} else {
				Toast.fail('กรุณาเข้าสู่ระบบ', 2)
				Actions.login({ types: 'login' })
			}

			if (code == 'AVIATOR') {
				let subProviders = item.subProviders
				if (Array.isArray(subProviders) && subProviders.length) {
					let temp = subProviders[gameTabsKey]
					if (temp) {
						window.PiwikMenberCode('Game​', 'Launch', `${temp.name}_SpribeInstantGames_HotGame`)
					}
				}
			}
		} else {
			this.navigateToSceneGame('GameList', item, gameTabsKey)
		}

		if (item.code == "Slot") {
			subProvidersCode && GamePiwikMenberText2[subProvidersCode] && window.PiwikMenberCode('Game', 'View', GamePiwikMenberText2[subProvidersCode])
		} if (item.code == "P2P") {
			subProvidersCode && GamePiwikMenberText2[subProvidersCode] && window.PiwikMenberCode('Game Nav', 'View', GamePiwikMenberText2[subProvidersCode])
		} else {
			subProvidersCode && GamePiwikMenberText2[subProvidersCode] && window.PiwikMenberCode('Game', ['VTG'].includes(subProvidersCode) ? 'Click' : 'Launch', GamePiwikMenberText2[subProvidersCode])
		}

	}


	playGame(item, gameCode, isOpen) {
		if (!ApiPort.UserLogin) {
			Toast.fail('กรุณาเข้าสู่ระบบ', 2)
			Actions.login({ types: 'login' })
			return
		}

		if (isGameLock) {
			Toast.fail(GameLockText, 2)
			return
		}
		let gametype = item.code.toLocaleUpperCase()
		if (item.isMaintenance) {
			Toast.fail(GameMaintenanceText, 2)
			return
		}
		const { balanceInforData } = this.state
		let gameLobbyUrl = item.gameLobbyUrl
		if (gameLobbyUrl.length) {
			// if (isOpen) {
			// 	Linking.openURL(gameLobbyUrl)
			// } else {
			this.checkGameWallet({
				gameLobbyUrl,
				item,
				gametype
			})
			// }
		} else {
			Toast.fail('ระบบขัดข้อง กรุณาลองใหม่ภายหลัง', 1)
		}
	}




	navigateToSceneGame(key, item, gameTabsKey) {
		Actions[key]({
			data: item, gameTabsKey,
			getRecommendedGameList: () => {
				this.getRecommendedGameList()
			},
			walletCodeMapping: this.state.walletCodeMapping
		})
	}

	renderPage(item) {
		return <TouchableOpacity key={item.index} style={[styles.carouselImg]} onPress={this.getBannerAction.bind(this, item)}>
			<Image
				resizeMode='stretch'
				style={styles.carouselImg}
				defaultSource={window.isBlue ? require('./../../images/common/loadIcon/loadinglight.jpg') : require('./../../images/common/loadIcon/loadingdark.jpg')}
				source={{ uri: item.item.cmsImageUrl }} />
		</TouchableOpacity>
	}

	async getBannerAction(item) {
		// this.getLoginCDUActivateStatus()
		// return
		item && item.item && PiwikMenberCode('HomeBanner', 'Click', item.item.id + "_" + item.item.name)
		const { promotions } = this.state
		const { id, promoId, url } = item.item.action
		let idNum = id * 1

		const bannerID = item.item.id || ''
		const bannerName = item.item.name || ''

		window.PiwikMenberCode('Banner', 'Click', `${bannerID}_${bannerName}_Home`)
		if ([0, 2, 8, 10, 11, 12, 13, 14, 15, 16, 17].includes(idNum)) return
		if ([1].includes(idNum)) {
			let promotionsList = promotions.find(v => v.contentId * 1 === item.item.id * 1)
			if (promotionsList) {
				this.openPref(promotionsList)
			} else {
				this.openPref(
					{
						"title": "",
						"desc": "",
						"modalHtml": url,
						"htmlPath": url,
						"category": [
							"2"
						],
						"status": "",
						"type": "",
						"isUsableOutSchedule": '',
						"isCashBack": '',
						"startDate": "",
						"endDate": "",
						"contentId": '',
						"promotionMasterCategory": "",
						"isExpiredServedBonus": '',
						"updatedDate": "",
						"runningRebate": '',
						"isClaimable": '',
						"isVip": '',
						"isFeaturedPromo": '',
						"isPredefinedBonus": '',
						"isExpiringFeaturedPromo": '',
						"isJustForYouPromo": '',
						"percentage": 0,
						"thumbnailImage": "",
						"thumbnailMobileImage": ""
					}
				)
			}
		} else if ([3, 4, 5, 6].includes(idNum)) {
			Actions.jump('promotionLogin')
		} else if ([7, 9].includes(idNum)) {
			if (!ApiPort.UserLogin) {
				this.props.changeHomeRegistLoginModalAction({
					flag: true,
					page: 'fiance'
				})
				return
			}
			let router = idNum === 7 ? 'deposit' : 'transfer'
			this.goFinancePage({
				router
			})
		} else if (idNum === 19) {
			let { vendorQuery } = item.item.action
			if (!ApiPort.UserLogin) {
				this.props.changeHomeRegistLoginModalAction({
					flag: true,
					page: 'game'
				})
				return
			}
			if (isGameLock) {
				Toast.fail(GameLockText, 2)
				return
			}


			let selfExclusions = this.props.selfExclusionsData
			if (selfExclusions.DisableBetting && selfExclusions.SelfExcludeDuration > 0) {
				let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
				Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
				return
			}


			let getCDUActivateStatus = await this.getCDUActivateStatus()
			if (getCDUActivateStatus != 'open') return

			let params = {
				'token': ApiPort.UserLogin ? ApiPort.Token.split(' ')[1] : '',
				'provider': 'IPSB',
				'hostName': common_url,
				'productCode': 'IPSB',
				'platform': 'Mobile',
				'mobileLobbyUrl': common_url,
				'sportsMenu': '',
				'bankingUrl': common_url,
				'logoutUrl': common_url + '/accessdenied',
				'supportUrl': common_url,
				'vendorQuery': vendorQuery
			}

			//處理sb2.0遊戲token (開官方網頁版，會刷掉先前獲取的token)
			// removeVendorToken('im');

			Toast.loading('กำลังเริ่มเกม...', 2000)
			// Toast.loading('正在启动游戏,请稍候...', 2000)
			fetchRequest(ApiPort.Game + 0 + '?isDemo=false&', 'POST', params).then(data => {

				Toast.hide()
				if (data.isSuccess) {
					if (data.errorCode == 2001) {
						Toast.fail(GameLockText, 2)
						return
					}

					if (data.isGameMaintenance) {
						Toast.fail(GameLockText, 2)
						return
					}
					if (data.gameLobbyUrl.length) {
						const tempKenoSport = this.state.gameSequences.find(v => v.code.toLocaleUpperCase() === 'SPORTSBOOK')
						if (tempKenoSport.subProviders) {
							const subProviders = tempKenoSport.subProviders
							let ipsbItem = subProviders.find(v => v.code.toLocaleUpperCase() === 'IPSB')
							if (ipsbItem) {
								Actions.GamePage({
									GameOpenUrl: data.lobbyUrl,
									gametype: 'IPSB',
									gameHeadName: `${ipsbItem.name} ${ipsbItem.productCode}`,
									walletCode: 'SB'
								})
							}
						}

					}


				} else {
					Toast.fail(GameMaintenanceText, 2)
				}
			}).catch(() => {
				Toast.hide()
				Toast.fail('ระบบขัดข้อง กรุณาลองใหม่ภายหลัง', 1)
				// Toast.fail('网络故障，请稍候再试',1)
			})
		}
	}

	openPref(v) {
		Actions.PreferentialPage({
			promotionsDetail: v,
			fromPage: 'homelPage'
		})

		if (Array.isArray(v.bonusProductList) && v.bonusProductList.length) {
			if (v.bonusProductList[0].bonusID) {
				window.PiwikMenberCode(`${v.bonusProductList[0].bonusID}__homepage`)
			}
		}
	}

	renderhomeCarouse(item) {
		const { gameSequences, gameTabsKey } = this.state
		let gameSequencesArr = item.subProviders
		let number = gameSequences[gameTabsKey].subProviders.length
		return <View style={[styles.gameContent]} key={item.index}>
			<ScrollView
				horizontal={true}
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={[styles.gameScrollViewBox, styles[`gameScrollViewBox${number}`]]}
			>
				{
					gameSequencesArr.map((v2, i2) => {
						return <TouchableOpacity
							key={i2}
							style={[styles.gameWrap, styles[`gameWrap${number}`]]}
							onPress={() => {
								// if (v2.code == 'IPSB' || v2.code == 'SBT') {
								// 	this.setState({ SBGameModal: true, SBCurrentGame: v2 })
								// 	return
								// }
								// ['KENO', 'CASINO'] || 

								let code = ["OWS", "IPSB", "CMD", "SBT", "TFG", "IPES", "AVIATOR", "GPI", "EBT", "EVO", "SXY", "SAL", "NLE", "AG", "WMC", "TG_LIVECASINO", "TCG", "GPK", "SLC"]


								if (!ApiPort.UserLogin) {
									let subProviders = gameSequences[gameTabsKey].subProviders[i2].code
									if (code.includes(subProviders.toUpperCase())) {
										this.props.changeHomeRegistLoginModalAction({
											flag: true,
											page: 'game'
										})
										return
									}

								}


								let code2 = ['ESPORTS', 'CASINO']
								let subProviders = gameSequences[gameTabsKey].code.toUpperCase()
								if (code2.includes(subProviders)
									|| (

										subProviders == 'SPORTSBOOK' && gameSequences[gameTabsKey].subProviders[i2].code != 'VTG'
									)
									||
									(
										subProviders == 'INSTANTGAMES' && gameSequences[gameTabsKey].subProviders[i2].code != 'SPR'
									)
								) {
									let selfExclusions = this.props.selfExclusionsData
									if (selfExclusions.DisableBetting && selfExclusions.SelfExcludeDuration > 0) {
										let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
										Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
										return
									}
								}
								this.playGameSort(gameSequences[gameTabsKey], i2)
							}}>
							<Image
								source={{ uri: v2.imageUrl }}
								style={[styles.gameWrap, styles[`gameWrap${number}`]]}
								resizeMode='stretch'
							/>

							<View style={{ position: 'absolute', right: 5, top: 5, zIndex: 100, flexDirection: 'row' }}>
								{
									v2.isNew &&
									<View style={[styles.iconImg, { backgroundColor: '#ff0000' }]}>
										<Text style={styles.iconImgText}>NEW</Text>
									</View>
								}
								{
									v2.isHot &&
									<View style={[styles.iconImg, { backgroundColor: '#F19E39' }]}>
										<Text style={styles.iconImgText}>HOT</Text>
									</View>
								}
								{
									v2.isTournament &&
									<View style={[styles.iconImg, { backgroundColor: '#3373ff' }]}>
										<Text style={styles.iconImgText}>TOURNAMENT</Text>
									</View>
								}
							</View>

							<LinearGradient
								colors={['#00000000', '#000']}
								start={{ y: 0, x: 0 }}
								end={{ y: 1, x: 0 }}
								style={[styles.rewardImg1]}
							>
								<Text style={styles.textInfor2}>{v2.name.toLocaleUpperCase()}</Text>
							</LinearGradient>
						</TouchableOpacity>
					})
				}
			</ScrollView>
		</View>
	}

	changeFreeModalStatus(isShowModalHomeFreeBet) {
		this.setState({
			isShowModalHomeFreeBet
		})
	}

	async goFinancePage({ router, walletCode, callBack, fromPage, stack }) {
		let FirstName = this.props.memberInforData.FirstName
		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableDeposit && selfExclusions.SelfExcludeDuration > 0 && (['deposit', 'withdrawal'].includes(router))) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}

		if (FirstName) {
			let getCDUActivateStatus = await this.getCDUActivateStatus()
			if (getCDUActivateStatus != 'open') return
			if (stack) {
				Actions[router]({
					walletCode,
					fromPage,
					onBack: () => {
						(callBack && (typeof callBack == 'function')) && callBack()
					}
				})
			} else {
				if (router) {
					this.props.changeDepositTypeAction({
						type: router
					})
				} else {
					if (selfExclusions.DisableDeposit && selfExclusions.SelfExcludeDuration > 0) {
						let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
						Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
						this.props.changeDepositTypeAction({
							type: 'transfer'
						})
						return
					}
					Actions.jump('Finance')
				}
			}
		} else {
			Actions.Verification({
				fillType: 'name',
				fromPage: 'homeTabBar',
			})
		}
	}

	changeMaintenanceStatus(isMaintenance, retryAfter) {
		this.setState({
			isMaintenance,
			retryAfter
		})
	}

	changeHomeModalLoginRegisterStatus(homeModalLoginRegisterStatus) {
		this.setState({
			homeModalLoginRegisterStatus
		})
	}

	openBrowserGame(flag) {
		this.setState({
			isShowGameModal: false
		})
		if (flag) {
			const { tempGameInfor, tempGameCode } = this.state
			this.playGame(tempGameInfor, tempGameCode, true)
		} else {
			this.setState({
				tempGameInfor: '',
				tempGameCode: ''
			})
		}
	}

	checkPiwikMenberCode(track, action = 'touch', name = 'defaultName') {
		if (!track) return
		const options = {
			name: name,
			path: 'path',
			value: '1.0.0',
			customDimensions: { 1: '' },
		}

		console.log(track, action)
		PiwikProSdk.trackCustomEvent(track, action, options);
	}

	PiwikMenberCode1(data) {
console.log(data)
		if (!data) return
		PiwikProSdk.setUserId(data);
	}

	makeFadeInTranslation(translateX) {
		return {
			from: {
				opacity: 1,
				translateX: translateX,
			},
			to: {
				opacity: 1,
				translateX: 0,
			}
		}
	}

	handleViewRef = ref => this.handleHomeView = ref

	changeDisplayReferee(isShowDisplayReferee) {
		this.setState({
			isShowDisplayReferee
		})
	}

	getLoadImgStatus(i, flag) {
		this.state.gameLoadObj[`imgStatus${i}`] = flag
		this.setState({})
	}

	changeLoginOtpStatus(isShowLoginOtp) {
		this.setState({
			isShowLoginOtp
		})
	}

	goMiniGamesActive(v) {
		const { gameName, webViewUrl, providerCode, category, redirectUrl, type, name } = v
		const { gameSequences } = this.state
		let typeUpperCase = type.toLocaleUpperCase()

		//window.PiwikMenberCode('Banner', 'Click', `${name}_Feature_Home`)
		if (!typeUpperCase) return
		if (typeUpperCase === 'PROVIDER') {
			const providerCodeUpperCase = providerCode.toLocaleUpperCase()
			if (providerCodeUpperCase) {
				const tempKenoArr = gameSequences.find(v => v.code.toLocaleUpperCase() === category.toLocaleUpperCase())
				if (tempKenoArr) {
					const subProviders = tempKenoArr.subProviders
					const gameTabsKey = subProviders.findIndex(v => v.code.toLocaleUpperCase() === providerCodeUpperCase)
					gameTabsKey >= 0 && this.navigateToSceneGame('GameList', tempKenoArr, gameTabsKey)
					window.PiwikMenberCode('Game', 'Click', 'V2G_VirtualSports_FeatureBanner')
				}
			}
		} else if (typeUpperCase === 'MINIGAME') {
			Actions.Lottery()
			window.PiwikMenberCode('Engagement_Event', 'Click', 'Enter_ChineseNewYear23')
		} else if (typeUpperCase === 'REDIRECT') {
			window.PiwikMenberCode('Game', 'Launch', 'Aviator_InstantGames_FeaturedBanner')
			if (!ApiPort.UserLogin) {
				Toast.fail('กรุณาเข้าสู่ระบบ', 2)
				Actions.login({ types: 'login' })
				window.isBannerReSqrFlag = true
				return
			}
			const providerCodeUpperCase = providerCode.toLocaleUpperCase()
			if (providerCodeUpperCase) {
				const tempKenoArr = gameSequences.find(v => v.code.toLocaleUpperCase() === 'INSTANTGAMES')
				if (tempKenoArr) {
					const item = tempKenoArr.subProviders[0]
					if (redirectUrl.length) {
						this.checkGameWallet({
							gameLobbyUrl: redirectUrl,
							item,
							gametype: 'SPR'
						})
					}
				}
			}
		}
	}

	changeDomain(key, v) {
		key !== 'version' && globalLogout(true)
		if (key === 'ST') {
			window.common_url = 'https://kongstagingfun88.gamealiyun.com'
		} else if (key === 'SL1') {
			window.common_url = 'https://gatewayfun88thsl.gamealiyun.com'

			window.IMAccessCode = '2cc03acc80b3693c'
			window.IMApi = 'https://gatewayimvn.bbentropy.com/api/mobile/'
			window.CacheApi = 'https://sapivn.leyouxi211.com'

		} else if (key === 'SL2') {
			window.common_url = 'https://gatewayfun88thsl.gamealiyun.com'
		} else if (key === 'LIVE') {
			window.common_url = 'https://gatewayfun88th.gamealiyun.com'

		} else if (key === 'storage') {
			global.storage.clearMap()
		} else if (key === 'version') {
			window.CheckUptateGlobe && window.CheckUptateGlobe()
		} else if (key === 'STOHHER') {
			window.common_url = `https://kongstaging${v}fun88.gamealiyun.com`
		}
		global.storage.clearMap()
		this.refreshingHome()
	}

	renderMiniGamesPage(item) {
		return <TouchableOpacity
			key={item.index}
			style={[styles.evoInforBox, {
				height: item.item.type == "MiniGame" ? (width - 20) * .25 : .25 * (width - 20)
			}]}
			onPress={this.goMiniGamesActive.bind(this, item.item)}>
			{
				<FastImage
					onLoadStart={() => {
						this.state.featureIcoloadObj[`imgStatus${item.index}`] = false
						this.setState({})
					}}
					onLoadEnd={() => {
						this.state.featureIcoloadObj[`imgStatus${item.index}`] = true
						this.setState({})
					}}
					resizeMode='stretch'
					source={{ uri: item.item.bannerUrl }}
					style={[styles.evoInfor, {
						height: item.item.type == "MiniGame" ? (width - 20) * .25 : .25 * (width - 20)
					}]}
				/>
			}

			{
				!this.state.featureIcoloadObj[`imgStatus${item.index}`] && <View style={styles.activeLoadBoxIcon}>
					<ActivityIndicator size='small' color={window.isBlue ? '#00CEFF' : '#25AAE1'} style={styles.activeLoadIcon} />
				</View>
			}
		</TouchableOpacity>
	}

	//開啟Ｖender Game
	openVenderGame() {
		const { SBCurrentGame } = this.state
		PiwikMenberCode('Game', 'Launch', `${SBCurrentGame.productCode == 'IM' ? 'IM' : 'BTi'}Sports_Vendor_Home`)
		this.setState({ SBGameModal: false })
		this.playGame(SBCurrentGame, 'SPORTSBOOK')
	}

	//前往SB Game
	goToSBGame() {
		const { SBCurrentGame } = this.state
		PiwikMenberCode('Game', 'Launch', `${SBCurrentGame.productCode == 'IM' ? 'IM' : 'BTi'}Sport_SB2.0_Home`)
		this.setState({ SBGameModal: false })
		if (ApiPort.UserLogin) {
			//已登入 先獲取token後跳轉
			Toast.loading("กำลังโหลด...");
			getAllVendorToken()
				.finally(() => {
					//不管成功或失敗都跳轉
					lowerV = SBCurrentGame.productCode
					Toast.hide();
					Actions.SbSports({
						sbType: SBCurrentGame.code
					});
				});
		} else {
			//未登入 直接跳轉
			lowerV = SBCurrentGame.productCode
			Actions.SbSports({
				sbType: SBCurrentGame.code
			});
		}

	}

	changeShowWalletGameModal(isShowWalletGameModal, openGame) {
		this.setState({
			isShowWalletGameModal
		})
		if (openGame) {
			const {
				GameOpenUrl,
				gametype,
				gameHeadName,
				walletCode
			} = this.state

			//if (!(Array.isArray(this.props.balanceInforData) && this.props.balanceInforData.length > 0)) return
			Actions.GamePage({
				GameOpenUrl,
				gametype,
				gameHeadName,
				walletCode,
				isFromSB: isSBFlag
			})
			window.isSBFlag = false
		}
	}

	async checkGameWallet({ gameLobbyUrl, item, gametype }) {
		const { balanceInforData } = this.state
		let walletInfor = balanceInforData.find(v => v.name == item.walletCode) || {
			localizedName: '',
			balance: 0
		}
		// if (walletInfor.balance <= 0) {
		// 	this.setState({
		// 		GameOpenUrl: gameLobbyUrl,
		// 		gametype,
		// 		gameHeadName: `${item.name} ${item.productCode}`,
		// 		walletCode: item.walletCode
		// 	})
		// 	this.changeShowWalletGameModal(true)
		// } else {
		let getCDUActivateStatus = await this.getCDUActivateStatus()
		if (getCDUActivateStatus != 'open') return


		//if (!(Array.isArray(this.props.balanceInforData) && this.props.balanceInforData.length > 0)) return
		Actions.GamePage({
			GameOpenUrl: gameLobbyUrl,
			gametype,
			gameHeadName: `${item.name} ${item.productCode}`,
			walletCode: item.walletCode,
			walletInforBalance: walletInfor.balance
		}, () => {
			this.setState({
				GameOpenUrl: '',
				gametype: '',
				gameHeadName: '',
				walletCode: '',
				isFromSB: isSBFlag
			})
			window.isSBFlag = false
		})
		//}
	}


	postPromotions(promotionsDetail) {
		if (!ApiPort.UserLogin) {
			this.props.changeHomeRegistLoginModalAction({
				flag: true,
				page: 'home'
			})
			return
		}

		const memberInfor = this.props.memberInforData
		let FirstName = memberInfor.FirstName
		if (!FirstName) {
			Actions.Verification({
				fillType: 'name'
			})
			return
		}

		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableBonusApplication && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}



		const { type, status, isClaimable, bonusProduct, bonusProductList, promotionMasterCategory } = promotionsDetail
		let typeUpperCase = type.toLocaleUpperCase()
		let statusUpperCase = status.toLocaleUpperCase().replace(/\s/g, '')
		let promotionMasterCategoryUpperCase = promotionMasterCategory.toLocaleUpperCase()
		if (typeUpperCase === 'BONUS' || typeUpperCase === 'DAILYDEALS') {
			if (statusUpperCase === 'SERVING') {// 1

			} else if (statusUpperCase === 'RELEASE') {
				const isClaimable = bonusProductList[0].isClaimable
				if (isClaimable) {// 领取 1
					this.postClaim(promotionsDetail)
				} else {
					return null
				}
			} else if (statusUpperCase === 'SERVED') {// 已领取 1

			} else if (statusUpperCase === 'FORCETOSERVED') {// 已领取 1

			} else if (statusUpperCase === 'WAITINGFORRELEASE') {

			} else if (statusUpperCase === 'AVAILABLE') {// 0
				this.goFinancePagePomotions(bonusProductList)
			} else {
				return null
			}
		} else if (typeUpperCase === 'MANUAL') {
			if (statusUpperCase === 'AVAILABLE') {
				this.submitMemberInfor(promotionsDetail)
			} else {
				return null
			}
		} else if (typeUpperCase === 'OTHER') { // 1
			return null
		} else if (typeUpperCase === 'SOS') {
			this.postSosBonusVerifications(bonusProductList)
		} else {
			return null
		}

	}


	postClaim(promotionsDetail) {
		const bonusProductList = promotionsDetail.bonusProductList
		if (Array.isArray(bonusProductList) && bonusProductList.length) {
			let bonusID = bonusProductList[0].bonusID
			bonusID && window.PiwikMenberCode(bonusID + '_apply_promopage')
		}

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let params = {
			playerBonusId: promotionsDetail.playerBonusId
		}
		fetchRequest(ApiPort.PostClaim + '?', 'POST', params).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				if (res.isClaimSuccess) {
					this.props.getBalanceInforAction()
					let message = res.messag
					Toast.success(message ? message : 'การอัปเดตสำเร็จ', 2)
					Actions.pop()
					let fromPage = this.props.fromPage
					if (fromPage) {
						if (fromPage === 'PreferentialRecords') {
							this.props.getPromotionsApplications && this.props.getPromotionsApplications()
						} else if (fromPage === 'preferentialPage') {
							this.props.getPromotionListInforAction()
						}
					}
				} else {
					Toast.fail(res.message, 2)
				}
			} else {
				Toast.fail(res.message, 2)
			}
		}).catch(err => {
			Toast.hide()
		})
	}


	goFinancePagePomotions(bonusProductList) {
		if (Array.isArray(bonusProductList) && bonusProductList.length && !this.props.isEuro) {
			let bonusID = bonusProductList[0].bonusID
			bonusID && window.PiwikMenberCode(bonusID + '_apply_promopage')
		}

		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableDeposit && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}
		const memberInfor = this.props.memberInforData
		let FirstName = memberInfor.FirstName
		if (FirstName) {
			if (!this.props.balanceInforData.length) return
			if (this.props.isEuro) {
				//欧冠优惠
				Actions.pop()
			}

			let total = this.props.balanceInforData.filter(v => v.name.toLocaleUpperCase() === 'TOTALBAL')[0].balance
			let fromPage = this.props.fromPage
			if (Array.isArray(bonusProductList) &&
				bonusProductList.length &&
				bonusProductList[0].bonusApplicableSite &&
				bonusProductList[0].bonusApplicableSite.toLocaleUpperCase().replace(/\s/g, '') === 'DEPOSITPAGEONLY') {
				Actions.DepositStack({
					isEuro: this.props.isEuro,
					fromPage,
					bonusProductList: bonusProductList[0],
					bonusApplicableSite: true
				})
			} else {
				if (total <= 0) {
					Actions.DepositStack({
						isEuro: this.props.isEuro,
						fromPage,
						bonusProductList: bonusProductList[0]
					})
				} else {
					Actions.TransferStack({
						isEuro: this.props.isEuro,
						fromPage,
						bonusProductList: bonusProductList[0]
					})
				}
			}
		} else {
			Actions.Verification({
				fillType: 'name'
			})
		}
	}

	submitMemberInfor(promotionsDetail) {
		let bonusID = promotionsDetail.bonusId
		bonusID && !this.props.isEuro && window.PiwikMenberCode(bonusID + '_apply_promopage')
		if (this.props.isEuro) {
			//欧冠优惠
			PiwikMenberCode('Promo Application​', 'Submit', `Apply_(${this.props.promotionsDetail.contentId})`)
		}

		let fromPage = this.props.fromPage
		Actions.PreferentialApplication({
			promotionsDetail,
			fromPage,
		})
	}


	postSosBonusVerifications(bonusProductList) {
		if (Array.isArray(bonusProductList) && bonusProductList.length) {
			let bonusID = bonusProductList[0].bonusID
			bonusID && window.PiwikMenberCode(bonusID + '_apply_promopage')
		}
		if (!ApiPort.UserLogin) {
			this.props.changeHomeRegistLoginModalAction({
				flag: true,
				page: 'home'
			})
			return
		}
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PostSosBonusVerifications, 'POST').then(res => {
			// 			sosRate: 100
			// dailyAccumulateAmount: 0
			// dailyRemainAmount: 200
			// sosApplyAmount: 30
			// sosCalculatedAmount: 30
			// sosRedeemAmount: 30
			// isSuccess: true
			Toast.hide()
			if (res.isSuccess) {
				this.postSosBonusApplications(bonusProductList)
			} else {
				let errors = res.errorMessage
				Toast.fail(errors || 'สมัครไม่สำเร็จ', 2)

				let unfinishedGames = res.unfinishedGames
				let unfinishedGamesMessages = res.unfinishedGamesMessages
				if (unfinishedGames) {
					if (Array.isArray(unfinishedGames) && unfinishedGames.length) {
						this.setState({
							isShowunfinishedGames: false,
							unfinishedGames,
							unfinishedGamesMessages
						})
					}
				} else {
					if (unfinishedGamesMessages && unfinishedGamesMessages.length) {
						this.setState({
							isShowunfinishedGames: true,
							unfinishedGamesMessages
						})
					}
				}
			}
		}).catch(err => {
			Toast.hide()
		})
	}


	postSosBonusApplications(bonusProductList) {
		let bonusID = bonusProductList[0].bonusID
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.ChangeSosBonusApplications + 'bonusID=' + bonusID + '&', 'POST').then(res => {
			// 			isSosApplied: true
			// message: 'Chúc mừng bạn đã đăng ký khuyến mãi thành công!'
			// isSuccess: true
			Toast.hide()
			if (res.isSuccess && res.isSosApplied) {
				Toast.success(res.message, 2)
				Actions.pop()
				this.props.getBalanceInforAction()
				this.props.getPromotionListInforAction()
			} else {
				Toast.fail(res.message, 2)



			}
		}).catch(err => {
			Toast.hide()
		})
	}



	createSprIcon() {
		let { sprStatus } = this.state
		if (sprStatus != '') {
			if (sprStatus.isComingSoon) {
				return 'เร็วๆนี้'
			} else {
				if (sprStatus.isNew) {
					return 'NEW!'
				} else {
					return ''
				}
			}
		} else {
			return ''
		}
	}


	render() {
		const { sprStatus, isShowUploadModal, isShowUploadGuideModal, isShowHasMoneyView, recommendedGameImg, recommendedGameList, recommendedGameTitle, SBGameModal, isShowWalletGameModal, miniGamesIndex, isFreebetQualificationsModal, homeModalLoginRegisterStatus1, retryAfter, isShowLoginOtp, loginOTP, miniGames, featureIcoloadObj, isShowDisplayReferee, DisplayReferee, IsQueleaRegistered, isShowModalHomeFreeBet, isShowGameModal, homeModalLoginRegisterStatus, isMaintenance, promotioncategoryId, isGetEligible, refreshing, isGetMemberInfor, eligible, bannerData, bannerIndex, gameTabsKey, gameSequences, TotalBal, promotions } = this.state
		const managerListsBackgroundColor = window.isBlue ? '#fff' : '#212121'
		const managerListsStyle = [styles.managerLists, { backgroundColor: managerListsBackgroundColor }]
		const managerListsText = { color: window.isBlue ? 'rgba(0, 0, 0, .5)' : '#fff' }
		window.goFinancePage = (obj) => {
			this.goFinancePage(obj || {})
		}
		window.changeMaintenance = (flag, retryAfter) => {
			this.changeMaintenanceStatus(flag, retryAfter)
		}
		window.changeHomeModalLoginRegisterStatus = (flag) => {
			this.changeHomeModalLoginRegisterStatus(flag)
		}
		window.PiwikMenberCode = (track, action = 'touch', name = 'defaultName') => {
			this.checkPiwikMenberCode(track, action, name)
		}
		window.makeFadeInTranslation = (translateX) => {
			return this.makeFadeInTranslation(translateX)
		}
		window.makeHomePageAnimatable = (translateX) => {
			window.mainPageIndex = 0
			window.makeFadeInTranslation && this.handleHomeView && this.handleHomeView.animate && this.handleHomeView.animate(this.makeFadeInTranslation(translateX), 300)
		}
		window.PiwikMenberCode1 = (data) => {
			this.PiwikMenberCode1(data)
		}

		window.windowchangeDisplayReferee = (flag) => {
			this.changeDisplayReferee(flag)
		}
		window.goToVenderGame = (type) => {
			const { gameSequences } = this.state
			const Vender = gameSequences[0].subProviders.find(v => v.productCode.toLocaleUpperCase() === type)
			this.playGame(Vender, 'SPORTSBOOK')
		}

		window.openSprHotGame = () => {
			this.openSprHotGame()
		}

		window.gotoSBIM = () => {
			if (ApiPort.UserLogin) {
				//已登入 先獲取token後跳轉
				Toast.loading("กำลังโหลด...");
				getAllVendorToken()
					.finally(() => {
						//不管成功或失敗都跳轉
						lowerV = 'IM'
						Toast.hide();
						Actions.SbSports({
							sbType: 'IPSB',
							gotoWorldCup: true
						});
					});
			} else {
				//未登入 直接跳轉
				lowerV = 'IM'
				Actions.SbSports({
					sbType: 'IPSB'
				});
			}
		}

		window.getCDUActivateStatus = () => {
			return this.getCDUActivateStatus()
		}

		window.isSTcommon_url = window.common_url.includes('staging')
		return <AnimatableView ref={this.handleViewRef} easing={'ease-in-out'} style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#FFF' : '#000' }]}>
			{
				isMaintenance && <Maintenance retryAfter={moment(new Date(retryAfter)).diff(moment(new Date()), 'seconds')} changeMaintenanceStatus={this.changeMaintenanceStatus.bind(this)}></Maintenance>
			}

			{
				ApiPort.UserLogin && isShowLoginOtp && loginOTP &&
				<LoginOtp
					changeDisplayReferee={this.changeDisplayReferee.bind(this)}
					changeLoginOtpStatus={this.changeLoginOtpStatus.bind(this)}
				/>
			}

			{
				<UploadfileModal
					isShowUploadModal={isShowUploadModal}
					isShowUploadGuideModal={isShowUploadGuideModal}
					changeShowUploadModal={this.changeShowUploadModal.bind(this)}
				></UploadfileModal>
			}




			{
				ApiPort.UserLogin && DisplayReferee && isShowDisplayReferee && isGetMemberInfor &&
				<RecommendModal
					memberInforData={this.props.memberInforData}
					changeDisplayReferee={this.changeDisplayReferee.bind(this)}
				/>
			}

			{
				ApiPort.UserLogin && homeModalLoginRegisterStatus && homeModalLoginRegisterStatus1 && isGetMemberInfor && <HomeFirstRegistPop
					goFinancePage={this.goFinancePage.bind(this)}
					changeHomeModalLoginRegisterStatus={this.changeHomeModalLoginRegisterStatus.bind(this)}
				/>
			}

			{
				(ApiPort.UserLogin && !IsQueleaRegistered && isGetMemberInfor && isGetEligible && isShowModalHomeFreeBet && window.isBlue && !['promotionLogin', 'Finance', 'news', 'PersonalAccount'].includes(this.props.stateRouterNameData)) && <HomeFreeBetModal
					eligible={eligible}
					changeFreeModalStatus={this.changeFreeModalStatus.bind(this)}
				/>
			}

			<Modal transparent={true} visible={isShowGameModal} animationType='fade'>
				<View style={[styles.modalContainer]}>
					<View style={styles.modalBox}>
						<Text style={styles.modalBodyText}>Để trải nghiệm được tốt hơn, trò chơi này sẽ được mở trên một cửa sổ mới trên trình duyệt di dộng của bạn.</Text>
						<View style={styles.modalBtnWrap}>
							<TouchableOpacity style={[styles.modalBtn, styles.modalBtn1]} onPress={this.openBrowserGame.bind(this, false)}>
								<Text style={styles.modalBtnText}>ยกเลิก</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.modalBtn} onPress={this.openBrowserGame.bind(this, true)}>
								<Text style={styles.modalBtnText}>ตกลง</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>


			{/* SB sport開啟提醒彈窗 */}
			<Modal transparent={true} visible={SBGameModal} animationType='fade'>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { paddingVertical: 20 }]}>
						<Text style={styles.iconSBClose} onPress={() => this.setState({ SBGameModal: false })}>X</Text>
						<Image source={require('./../SbSports/images/warnBlue.png')} resizeMode='stretch' style={styles.warnBlueImage}></Image>
						<Text style={[styles.modalBodyText]}>Vui lòng chọn phiên bản giao diện cược</Text>
						<View style={styles.modSBbutton}>
							<TouchableOpacity style={styles.SBbuttonStyle1}
								onPress={() => this.openVenderGame()}
							>
								<Text style={{ textAlign: 'center', color: '#00A6FF' }}>Thông Thường</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.SBbuttonStyle2}
								onPress={() => this.goToSBGame()}
							>
								<Text style={{ textAlign: 'center', color: '#fff' }}>Nâng Cao</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>


			{
				ApiPort.UserLogin && isShowHasMoneyView &&
				<View style={styles.depositNoBox}>
					<Text style={styles.depositNoBoxText}>บัญชีของคุณมียอดเงินไม่เพียงพอ โปรดทำการฝากเงินเพื่อร่วมสนุกไปกับเรา</Text>
					<TouchableOpacity style={styles.depositNoBtn} onPress={() => {
						this.goFinancePage({
							router: 'deposit'
						})
					}}>
						<Text style={styles.depositNoBtnText}>ฝากเงิน</Text>
					</TouchableOpacity>

					<TouchableOpacity style={styles.depositNoCloseBtn} onPress={() => {
						this.setState({
							isShowHasMoneyView: false
						})
					}}>
						<Text style={styles.depositNoCloseBtnText}>X</Text>
					</TouchableOpacity>
				</View>
			}

			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						tintColor={'#25AAE1'}
						onRefresh={this.refreshingHome.bind(this)}
					/>
				}
			>

				{
					Array.isArray(bannerData) && bannerData.length > 0
						?
						<View style={styles.wrapper}>
							<Carousel
								data={bannerData}
								renderItem={this.renderPage.bind(this)}
								sliderWidth={width - 20}
								itemWidth={width - 20}
								autoplay={true}
								loop={true}
								autoplayDelay={500}
								autoplayInterval={4000}
								onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
							/>
							<Pagination
								dotsLength={bannerData.length}
								activeDotIndex={bannerIndex}
								containerStyle={styles.containerStyle}
								dotStyle={styles.dotStyle}
								inactiveDotStyle={styles.inactiveDotStyle}
								inactiveDotOpacity={1}
								inactiveDotScale={0.6}
							/>
						</View>
						:
						(
							bannerData == null && <View style={[styles.wrapper, { backgroundColor: '#e0e0e0' }]}>
								<LoadingBone></LoadingBone>
							</View>
						)
				}

				{
					ApiPort.UserLogin ? (
						isGetMemberInfor && <View style={[styles.homeDepositBox]}>
							<View style={styles.homeDepositLeft}>
								<Text style={[styles.homeDepositText1, { color: window.isBlue ? '#53A7DC' : '#fff' }]}>{toThousands(TotalBal)}</Text>
								<Text style={[styles.homeDepositText2, { color: window.isBlue ? '#58585B' : '#00CEFF' }]}>ยอดรวม</Text>
							</View>
							<View style={styles.homeDepositRight}>
								{
									DepositDatas.map((v, i) => <TouchableOpacity key={i} style={[styles.homeDepositWrap, styles[`homeDepositWrap${i}`]]} onPress={() => {
										this.goFinancePage({
											router: v.router
										})
										if (v.router == 'deposit') {
											window.PiwikMenberCode('Deposit Nav', 'Click', 'Deposit_Home')
										} else if (v.router == 'transfer') {
											window.PiwikMenberCode('Transfer Nav', 'Click', 'Transfer_Home')
										} else if (v.router == 'withdrawal') {
											window.PiwikMenberCode('Withdrawal Nav', 'Click', 'Withdrawal_Home')
										}
									}}>
										<Image source={window.isBlue ? v.img1 : v.img} resizeMode='stretch' style={styles.gameDepositImg}></Image>
										<Text style={[styles.gameDepositInfor, { color: window.isBlue ? '#58585B' : '#00CEFF' }]}>{v.title}</Text>
									</TouchableOpacity>)
								}
							</View>
						</View>
					)
						:
						<View style={styles.homeLoginBox}>
							<Text style={styles.homeLoginBoxText}>ยินดีต้อนรับเข้าสู่ FUN88</Text>

							<View style={styles.homeLoginBtnBox}>
								<TouchableOpacity
									onPress={() => {
										Actions.login({
										})
										window.PiwikMenberCode('Navigation', 'Click', `Login_Home`)
									}}
									style={[styles.homeLoginBtn, { backgroundColor: '#4DACEA', marginRight: 10 }]}>
									<Text style={styles.homeLoginBtnBoxText}>เข้าสู่ระบบ</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => {
									Actions.Register()

									window.PiwikMenberCode('Registration Nav', 'Click', `Register_Home`)
								}} style={[styles.homeLoginBtn, { backgroundColor: '#72B874' }]}>
									<Text style={styles.homeLoginBtnBoxText}>ลงทะเบียน</Text>
								</TouchableOpacity>
							</View>
						</View>
				}



				{
					Array.isArray(miniGames) && miniGames.length > 0 && (
						<View>
							{
								miniGames.length === 1 ? miniGames.map((v, i) => {
									return <TouchableOpacity
										key={i}
										style={styles.evoInforBox}
										onPress={this.goMiniGamesActive.bind(this, v)}>
										<FastImage
											onLoadStart={() => {
												this.state.featureIcoloadObj[`imgStatus${i}`] = false
												this.setState({})
											}}
											onLoadEnd={() => {
												this.state.featureIcoloadObj[`imgStatus${i}`] = true
												this.setState({})
											}}
											resizeMode='stretch'
											source={{ uri: v.bannerUrl }}
											style={[styles.evoInfor, {
												height: v.type == "MiniGame" ? (width - 20) * .25 : .25 * (width - 20)
											}]}
										></FastImage>

										{
											!this.state.featureIcoloadObj[`imgStatus${i}`] && <View style={styles.activeLoadBoxIcon}>
												<ActivityIndicator size='small' color={window.isBlue ? '#00CEFF' : '#25AAE1'} style={styles.activeLoadIcon} />
											</View>
										}
									</TouchableOpacity>
								})
									:
									<View style={{
										marginBottom: 25,
									}}>
										<Carousel
											style={{
												marginBottom: 20
											}}
											data={miniGames}
											renderItem={this.renderMiniGamesPage.bind(this)}
											sliderWidth={width}
											itemWidth={width}
											autoplay={true}
											loop={true}
											autoplayDelay={500}
											autoplayInterval={4000}
											onSnapToItem={index => { this.setState({ miniGamesIndex: index }) }}
										/>
										<Pagination
											dotsLength={miniGames.length}
											activeDotIndex={miniGamesIndex}
											containerStyle={[styles.containerStyle, {
												bottom: -25,
											}]}
											dotStyle={[styles.dotStyle, {
												backgroundColor: '#25AEE1',
												width: 12,
												height: 12,
												borderRadius: 100000,
												marginHorizontal: 0
											}]}
											inactiveDotStyle={[styles.inactiveDotStyle, {
												backgroundColor: '#E8E8E8',
												width: 12,
												height: 12,
												borderRadius: 100000,
												marginHorizontal: 0
											}]}
											inactiveDotOpacity={1}
											inactiveDotScale={0.6}
										/>
									</View>
							}
						</View>
					)
				}

				{
					ApiPort.UserLogin && (
						Array.isArray(recommendedGameList) && recommendedGameList.length > 0 ? <View>
							<View style={[styles.gameContainer]}>
								<View style={[styles.continerTextWarp]}>
									<View style={styles.homeIconBox}>
										<Image
											resizeMode='stretch'
											style={styles.homeIcon}
											source={recommendedGameImg}
										></Image>
										{
											recommendedGameTitle.length > 0 && <Text style={[styles.continerText, { color: window.isBlue ? '#000' : '#FFF' }]}>
												{
													recommendedGameTitle
												}
											</Text>
										}
									</View>
								</View>
							</View>

							<View style={{ marginHorizontal: 10, width: width - 20 }}>
								<ScrollView
									horizontal={true}
									automaticallyAdjustContentInsets={false}
									showsHorizontalScrollIndicator={false}
									showsVerticalScrollIndicator={false}
								>
									<View style={{ flexDirection: 'row', }}></View>
									{
										recommendedGameList.map((v, i) => {
											return <TouchableOpacity
												key={i}
												style={[{
													width: (width - 20) * .4,
													height: (width - 20) * .4 * .615,
													marginRight: 10,
													borderRadius: 4,
													overflow: 'hidden'
												}]}
												onPress={() => {
													this.openSprHotGame(v)
												}}>
												<Image
													source={{ uri: v.imagePath }}
													style={{
														width: (width - 20) * .4,
														height: (width - 20) * .4 * .615,
													}}
													resizeMode='stretch' />

												<LinearGradient
													colors={['#00000000', '#000']}
													start={{ y: 0, x: 0 }}
													end={{ y: 1, x: 0 }}
													style={[
														styles.rewardImg1,
														{
															//height: 50
														}]}
												>
													<Text style={[styles.textInfor2, { fontSize: 12, textAlign: 'center' }]}>{v.lastGamePlayed.toLocaleUpperCase()}</Text>
												</LinearGradient>
											</TouchableOpacity>
										})
									}
								</ScrollView>
							</View>
						</View>
							:
							<View>
								<View style={[styles.gameContainer]}>
									<View style={[styles.continerTextWarp]}>
										<View style={styles.homeIconBox}>
											<Image
												resizeMode='stretch'
												style={styles.homeIcon}
												source={require('./../../images/home/homeIcon5.png')}
											></Image>
											<Text style={[styles.continerText, { color: window.isBlue ? '#000' : '#FFF' }]}>เกมส์ที่เล่นล่าสุด</Text>
										</View>
									</View>
								</View>

								<View style={[{ marginHorizontal: 10, backgroundColor: '#e0e0e0', height: (width - 20) * .4 * .615, width: width - 20, overflow: 'hidden' }]}>
									<LoadingBone></LoadingBone>
								</View>
							</View>
					)
				}

				<View style={{ height: 5, width, backgroundColor: '#EBEBEB', marginTop: 10 }}></View>

				{
					(Array.isArray(gameSequences) && gameSequences.length > 0) ? <View>
						<View style={[styles.gameContainer]}>
							<View style={[styles.continerTextWarp]}>
								<View style={styles.homeIconBox}>
									<Image
										resizeMode='stretch'
										style={styles.homeIcon}
										source={require('./../../images/home/homeIcon2.png')}
									></Image>
									<Text style={[styles.continerText, { color: window.isBlue ? '#000' : '#FFF' }]}>เกมส์ทั้งหมด</Text>
								</View>
							</View>

							<ScrollView
								horizontal={true}
								automaticallyAdjustContentInsets={false}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
							>
								<View style={{ flexDirection: 'row' }}>
									{
										gameSequences.map((v, i) => {
											let flag = i * 1 === this.state.gameTabsKey
											return <TouchableOpacity
												key={i}
												onPress={() => {
													this.setState({
														gameTabsKey: i
													})
													GamePiwikMenberText1[i] && window.PiwikMenberCode(GamePiwikMenberText1[i])
												}}

												style={[
													styles.gameTabbar,
													{
														backgroundColor: flag ? '#06ADEE' : '#fff'
													}
												]}
											>
												<Text style={[styles.gameBarText,
												{
													color: !flag ? '#06ADEE' : '#fff'
												}
												]}>{` ${v.name.toUpperCase()} `}</Text>

												{
													Boolean(this.createSprIcon()) && Boolean(this.createSprIcon().length) &&
													v.code.toLocaleUpperCase() === 'InstantGames'.toLocaleUpperCase() &&
													<Text style={{ color: 'red', position: 'absolute', top: 2, right: 0, fontSize: 8, fontWeight: 'bold' }}>
														{
															this.createSprIcon()
														}
													</Text>
												}
											</TouchableOpacity>
										})
									}
								</View>
							</ScrollView>
						</View>

						{
							this.renderhomeCarouse(gameSequences[this.state.gameTabsKey])
						}
					</View>
						:
						<View style={[styles.gameContainer]}>
							<View style={[styles.continerTextWarp]}>
								<Text style={[styles.continerText, { color: window.isBlue ? '#000' : '#FFF' }]}>เกมส์ทั้งหมด</Text>
							</View>

							<View style={styles.loadBox}>
								<LoadingBone></LoadingBone>
							</View>

							<View style={[{ backgroundColor: '#e0e0e0', width: width - 20, overflow: 'hidden', height: (width - 20) * .36 * .98, }]}>
								<LoadingBone></LoadingBone>
							</View>
						</View>
				}


				<View style={{ height: 5, width, backgroundColor: '#EBEBEB', marginTop: 10 }}></View>

				<View style={styles.gameContainer}>
					<View style={[styles.continerTextWarp, styles.continerTextWarp1]}>
						<View style={styles.homeIconBox}>
							<Image
								resizeMode='stretch'
								style={styles.homeIcon}
								source={require('./../../images/home/homeIcon1.png')}
							></Image>
							<Text style={[styles.continerText, { color: window.isBlue ? '#000' : '#FFF' }]}>โปรโมชั่น</Text>
						</View>
						<TouchableOpacity hitSlop={{ left: 30, right: 30, top: 30, bottom: 30 }} onPress={() => {
							Actions.jump('promotionLogin')
							window.PiwikMenberCode('More_promo_homepage')
						}}>
							<Text style={[{ color: window.isBlue ? '#4FB9ED' : '#25AAE1' }]}>ดูทั้งหมด  ></Text>
						</TouchableOpacity>
					</View>

					<View>
						<ScrollView
							horizontal={true}
							automaticallyAdjustContentInsets={false}
							showsHorizontalScrollIndicator={false}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={styles.gameScrollViewBox}
						>
							{
								Array.isArray(promotions) && promotions.length > 0 ?
									promotions.filter(v =>
									//Array.isArray(v.category) && v.category.length && v.category[0] * 1 === promotioncategoryId * 1
									((
										(v.type.toLocaleUpperCase() === 'BONUS' && v.status.toLocaleUpperCase() === 'AVAILABLE')
										||
										(v.type.toLocaleUpperCase() === 'MANUAL' && v.status.toLocaleUpperCase() === 'AVAILABLE')
										||
										(v.type.toLocaleUpperCase() === 'OTHER' && !v.status)
										||
										(v.type.toLocaleUpperCase() === 'SOS')
									))
									).map((v, i) => {
										let now = moment(new Date())
										let endDate = v.endDate
										if (!endDate) {
											return
										}
										let endDate1 = endDate.split('GMT +08')[0].trim()
										let period1 = moment(new Date(endDate1)).format('YYYY/MM/DD HH:MM:SS')
										let end = moment(new Date(period1))

										let dura = end.format('x') - now.format('x')
										let tempTime = moment.duration(dura);
										let day = tempTime.days()
										let hour = tempTime.hours()
										let min = tempTime.minutes()
										return <LinearGradient
											key={i}
											colors={['#279FEB', '#8AD2F6']}
											start={{ y: 0, x: 0 }}
											end={{ y: 0, x: 1 }}
											style={[styles.promotionsBox]}
										>
											<View style={styles.promotionsBoxIcone1}></View>
											<View style={styles.promotionsBoxIcone2}></View>

											<View style={styles.proyionContaonre}>
												<Image
													resizeMode='stretch'
													style={{ width: 30, height: 30, marginRight: 5 }}
													source={require('./../../images/home/homeIcon3.png')}
												></Image>
												<View>
													<Text ellipsizeMode={'tail'} numberOfLines={1} style={{ color: '#FFFFFF', fontSize: 12, flexWrap: 'nowrap', width: (width - 20) * .8 - 70 }}>{v.title}</Text>
													<View style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Text ellipsizeMode={'tail'} numberOfLines={1} style={{ color: '#FFFFFF', fontSize: 12, marginRight: 6, width: (width - 20) * .28 }}>{v.desc}</Text>
														<View style={styles.promoyionCon}>
															<Image
																resizeMode='stretch'
																style={{ width: 12, height: 12, marginRight: 4 }}
																source={require('./../../images/home/homeIcon4.png')}
															></Image>
															{
																<Text style={{ color: '#000', fontSize: 10 }}>{day}วัน {hour}ชั่วโมง {min}นาที</Text>
															}
														</View>
													</View>
												</View>
											</View>

											<View style={styles.promotionBox}>
												<Text style={{ color: '#fff' }}>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</Text>
											</View>
											<View style={{ flexDirection: 'row' }}>
												<TouchableOpacity
													onPress={this.postPromotions.bind(this, v)}
													style={styles.promotionRight}>
													<Text style={{ color: '#fff', fontSize: 12 }}>ขอรับตอนนี้</Text>
												</TouchableOpacity>
												<TouchableOpacity
													onPress={this.openPref.bind(this, v)}
													style={styles.promotionLeft}>
													<Text style={{ color: '#fff', fontSize: 12 }}>ข้อมูลเพิ่มเติม</Text>
												</TouchableOpacity>
											</View>
											{
												// v.isJustForYouPromo && <View style={[styles.preferentTag, { backgroundColor: '#0dbe02' }]}>
												// 	<Text style={styles.preferentTagText}>เฉพาะคุณ</Text>
												// </View>
											}
											{
												// v.isFeaturedPromo && <View style={[styles.preferentTag, { backgroundColor: '#ff6b44' }]}>
												// 	<Text style={styles.preferentTagText}>จำกัด</Text>
												// </View>
											}
										</LinearGradient>

									})
									:
									Array.from({ length: 2 }, v => v).map((v, i) => {
										return <View
											key={i}
											style={[styles.promotionsBox, { backgroundColor: '#e0e0e0' }]}
										>
											<LoadingBone></LoadingBone>
										</View>
									})
							}
						</ScrollView>

					</View>
				</View>


				{
					window.isSTcommon_url &&
					<View>
						<View style={[...managerListsStyle, styles.managerListsMargin]}>
							<Touch style={styles.managerListsTouch}>
								<Text style={managerListsText}>当前Domain API</Text>
							</Touch>
							<Touch style={styles.managerListsTouch}>
								<Text style={{ color: 'red', fontWeight: 'bold' }}>{window.common_url}</Text>
							</Touch>
						</View>
						<View style={[...managerListsStyle, styles.managerListsMargin]}>
							<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'ST')}>
								<View style={styles.managerListsLeft}>
									<Text style={managerListsText}>切换到ST Default</Text>
								</View>
								{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
							</Touch>
						</View>
						{
							Array.from({ length: 6 }, (v, i) => `0${i + 1}`).map((v, i) => {
								return <View style={[...managerListsStyle, styles.managerListsMargin]} key={i}>
									<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'STOHHER', v)}>
										<View style={styles.managerListsLeft}>
											<Text style={managerListsText}>切换到ST {v}</Text>
										</View>
										{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
									</Touch>
								</View>
							})
						}
						<View style={[...managerListsStyle, styles.managerListsMargin]}>
							<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'SL1')}>
								<View style={styles.managerListsLeft}>
									<Text style={managerListsText}>切换到SL  https://gatewayfun88thsl.gamealiyun.com</Text>
								</View>
								{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
							</Touch>
						</View>
						{
							// 	<View style={[...managerListsStyle, styles.managerListsMargin]}>
							// 	<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'SL2')}>
							// 		<View style={styles.managerListsLeft}>
							// 			<Text style={managerListsText}>切换到SL  https://gatewayvn.fun5533.com</Text>
							// 		</View>
							// 		{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
							// 	</Touch>
							// </View>
						}
						<View style={[...managerListsStyle, styles.managerListsMargin]}>
							<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'LIVE')}>
								<View style={styles.managerListsLeft}>
									<Text style={managerListsText}>切换到LIVE</Text>
								</View>
								{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
							</Touch>
						</View>
						<View style={[...managerListsStyle, styles.managerListsMargin]}>
							<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'storage')}>
								<View style={styles.managerListsLeft}>
									{/* <Image resizeMode='stretch' source={managerImg8} style={styles.managerListsImg}></Image> */}
									<Text style={managerListsText}>清除缓存</Text>
								</View>
								{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
							</Touch>
						</View>
						<View style={[...managerListsStyle, styles.managerListsMargin]}>
							<Touch style={styles.managerListsTouch} onPress={this.changeDomain.bind(this, 'version')}>
								<View style={styles.managerListsLeft}>
									{/* <Image resizeMode='stretch' source={managerImg8} style={styles.managerListsImg}></Image> */}
									<Text style={managerListsText}>检测版本</Text>
								</View>
								{/* <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, { opacity: window.isBlue ? .2 : 1 }]}></Image> */}
							</Touch>
						</View>
					</View>
				}

				{/* <Touch
					style={{ position: 'absolute', top: 100, left: width*0.5-50, width: 100 ,height: 50, backgroundColor: 'red'}}
					onPress={() => {
						if (ApiPort.UserLogin) {
							//已登入 先獲取token後跳轉
							Toast.loading("加载中...");
							getAllVendorToken()
								.finally(() => {
									//不管成功或失敗都跳轉
									Toast.hide();
									Actions.SbSports({
										sbType: 'IPSB'
									});
								});
						} else {
							//未登入 直接跳轉
							Actions.SbSports({
								sbType: 'IPSB'
							});
						}
					}}
				>
					<Text style={{ color: 'white', fontWeight: 'bold', lineHeight: 50, textAlign: 'center', width: 100 }}>SB2.0暫時入口</Text>
				</Touch> */}

			</ScrollView>
		</AnimatableView>
	}
}

export default Home = connect(
	(state) => {
		return {
			memberInforData: state.memberInforData,
			balanceInforData: state.balanceInforData,
			stateRouterNameData: state.stateRouterNameData,
			selfExclusionsData: state.selfExclusionsData,
			promotionListData: state.promotionListData
		}
	}, (dispatch) => {
		return {
			changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
			getMemberInforAction: () => dispatch(getMemberInforAction()),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
			getNewsStatisticsAction: (flag, unreadCounts) => dispatch(getNewsStatisticsAction(flag, unreadCounts)),
			getSelfExclusionsAction: () => dispatch(getSelfExclusionsAction()),
			getPromotionListInforAction: () => dispatch(getPromotionListInforAction()),
		}
	}
)(HomeContainer)

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 5,
		height: 100
	},
	maintenanceBg: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		zIndex: 1000,
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	modalContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .5)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	homeGameIcon: {
		width: 40,
		height: 25,
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1000
	},
	promotionRight: {
		height: 30,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: '#fff',
		width: 110,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 5
	},
	promotionLeft: {
		height: 28,
		width: 110,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#59BA6D',
		marginLeft: 5,
		borderRadius: 4,
	},
	proyionContaonre: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		width: (width - 20) * .8,
	},
	promoyionCon: {
		flexDirection: 'row',
		alignItems: 'center',
		// width: (width - 20) * .8,
		// justifyContent: 'flex-end',
		// paddingRight: 20,
		// marginTop: 2
	},
	promotionBox: {
		width: (width - 20) * .8,
		height: 10,
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 4,
		marginBottom: 8
	},
	modalBox: {
		width: .8 * width,
		overflow: 'hidden',
		borderRadius: 6,
		backgroundColor: '#fff',
		position: 'relative'
	},
	modalBodyText: {
		textAlign: 'center',
		paddingVertical: 25,
		paddingHorizontal: 15,
		alignItems: 'center'
	},
	modalBtnWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#D0CDCD'
	},
	modalBtn: {
		width: .4 * width,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalBtnText: {
		color: '#008AEF',
		fontWeight: 'bold'
	},
	modalBtn1: {
		borderRightWidth: 1,
		borderRightColor: '#D0CDCD'
	},
	promotionsBox: {
		width: (width - 20) * .8,
		marginRight: 10,
		height: 105,
		marginBottom: 10,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	promotionsBoxIcone1: {
		width: 20,
		height: 20,
		borderRadius: 1000,
		position: 'absolute',
		zIndex: 10000,
		backgroundColor: '#fff',
		left: -10
	},
	promotionsBoxIcone2: {
		width: 20,
		height: 20,
		borderRadius: 1000,
		position: 'absolute',
		zIndex: 10000,
		backgroundColor: '#fff',
		right: -10
	},
	preferentImg: {
		width: width - 20,
		height: 140,
	},
	preferentTagBox: {
		position: 'absolute',
		top: 10,
		right: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	preferentTag: {
		borderRadius: 4,
		paddingVertical: 8,
		paddingHorizontal: 10,
		zIndex: 1000,
		marginLeft: 10
	},
	preferentTagText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	viewContainer: {
		flex: 1
	},
	continerText: {
		fontWeight: 'bold',
		fontSize: 16
	},
	containerStyle: {
		paddingVertical: 2,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 5
	},
	gameScrollViewBox: {
		flexDirection: 'row',
	},
	gameScrollViewBox2: {
		width: width - 20,
		justifyContent: 'space-between'
	},
	gameScrollViewBox3: {
		width: width - 20,
		justifyContent: 'space-between'
	},
	dotStyle: {
		width: 20,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 3,
		backgroundColor: '#00CEFF'
	},
	inactiveDotStyle: {
		width: 10,
		backgroundColor: '#fff'
	},
	wrapper: {
		height: (width - 20) * .53333,
		margin: 10,
		marginBottom: 0,
		overflow: 'hidden',
		borderRadius: 6,
		marginBottom: 10
	},
	evoInforBox: {
		marginHorizontal: 10,
		marginTop: 15,
		width: width - 20,
		height: .25 * (width - 20)
	},
	activeLoadBoxIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0,
		backgroundColor: 'rgba(255, 255, 255, .6)'
	},
	activeLoadIcon: {},
	evoInfor: {
		width: width - 20,
		height: .25 * (width - 20)
	},
	gameContainer: {
		marginHorizontal: 10
	},
	gameTabbar: {
		height: 36,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#06ADEE',
		borderRadius: 4,
		marginRight: 8,
		width: 100
	},
	gameBarText: {
		fontSize: 14,
		textAlign: 'center',
		paddingHorizontal: 2,
		fontWeight: 'bold',
	},
	specialBox: {
		position: 'absolute',
		top: 0,
		right: 0,
		backgroundColor: '#ff4141',
		borderRadius: 10000,
		paddingHorizontal: 4,
		paddingVertical: 2
	},
	specialBoxText: {
		fontSize: 10,
		color: '#fff'
	},
	newgame: {
		color: '#FF0000',
		fontSize: 11,
		top: 0,
		right: -6,
		zIndex: 1000,
		position: 'absolute',
		fontWeight: 'bold'
	},
	gameTabbarLine: {
		position: 'absolute',
		left: 0,
		bottom: 5,
		right: 0,
		height: 2
	},
	gameContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		width: width,
		backgroundColor: '#4DABE9',
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginTop: 10
	},
	carouselImg: {
		width: width - 20,
		height: (width - 20) * .53333,
		borderRadius: 4
	},
	gameBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		marginTop: 10
	},
	gameWrap: {
		width: (width - 20) * .3,
		height: (width - 20) * .32,
		marginRight: 8,
		borderRadius: 4,
		overflow: 'hidden',
	},
	gameWrap2: {
		width: (width - 20) * .485,
		height: (width - 20) * .32,
		marginRight: 0,
	},
	gameWrap3: {
		width: (width - 20) / 3.15,
		height: (width - 20) * .32,
		marginRight: 0,
	},
	textInfor2: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 14
	},
	rewardImg1: {
		height: 40,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingBottom: 6,
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'center',
	},
	textWrap: {
		position: 'absolute',
		bottom: 10,
		left: 6,
		zIndex: 15
	},
	gameBgOverly: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		backgroundColor: 'rgba(0, 0, 0, .2)',
		zIndex: 10
	},
	textInfor1: {
		color: '#00AEEF',
		fontWeight: 'bold',
		fontSize: 14
	},

	homeDepositBox: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 10,
		marginHorizontal: 10,
	},
	homeDepositLeft: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: 20
	},
	homeDepositText1: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	homeDepositText2: {

	},
	homeDepositRight: {
		flexDirection: 'row',
	},
	homeDepositWrap: {
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#53A7DC',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		width: 45,
		paddingVertical: 2
	},
	homeDepositWrap1: {
		marginHorizontal: 10
	},
	gameDepositImg: {
		width: 22,
		height: 22,
	},
	gameDepositInfor: {
		fontSize: 11,
		marginTop: 1
	},
	continerTextWarp: {
		justifyContent: 'center',
		paddingVertical: 10
	},
	continerTextWarp1: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	loadBox: {
		height: 40,
		backgroundColor: '#e0e0e0',
		marginVertical: 10,
		borderRadius: 4,
		overflow: 'hidden'
	},
	iconImg: {
		paddingHorizontal: 6,
		paddingVertical: 2,
		backgroundColor: 'red',
		borderRadius: 10000
	},
	iconImgText: {
		color: '#fff',
		fontSize: 10
	},
	managerLists: {
		height: 50,
		justifyContent: 'center',
		marginBottom: 1
	},
	managerListsMargin: {
		marginBottom: 8
	},
	managerListsTouch: {
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	managerListsLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	warnBlueImage: {
		width: 55,
		height: 55,
		alignSelf: 'center'
	},
	iconSBClose: {
		fontSize: 15,
		color: '#00A6FF',
		alignSelf: 'flex-end',
		fontWeight: 'bold',
		marginRight: 15
	},
	modSBbutton: {
		flexDirection: 'row',
		paddingHorizontal: 20,
		alignSelf: 'center'
	},
	SBbuttonStyle1: {
		borderWidth: 1,
		borderColor: '#00A6FF',
		width: width * .3,
		paddingVertical: 10,
		borderRadius: 8,
		marginRight: 15
	},
	SBbuttonStyle2: {
		backgroundColor: '#00A6FF',
		width: width * .3,
		paddingVertical: 10,
		borderRadius: 8
	},
	homeIcon: {
		width: 20,
		height: 20,
		marginRight: 5
	},
	homeIcon2: {
		width: 32,
		height: 32,
	},
	homeIconBox: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	homeLoginBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 10
	},
	homeLoginBtnBox: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	homeLoginBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 35,
		width: 80,
		borderRadius: 6
	},
	homeLoginBtnBoxText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	homeLoginBoxText: {
		fontWeight: 'bold',
		fontSize: 12
	},
	depositNoBox: {
		backgroundColor: '#6B6B6D',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10
	},
	depositNoBoxText: {
		textAlign: 'center',
		color: '#fff',
		width: width - 100
	},
	depositNoBtn: {
		backgroundColor: '#5AC27E',
		borderRadius: 4,
		height: 34,
		width: 100,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10
	},
	depositNoBtnText: {
		color: '#fff'
	},
	depositNoCloseBtn: {
		position: 'absolute',
		right: 10,
		top: 10
	},
	depositNoCloseBtnText: {
		color: '#fff',
		fontSize: 20
	},
	sprBox: {
		backgroundColor: '#FF0000',
		borderRadius: 100000,
		paddingHorizontal: 4,
		height: 14,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		right: -5,
		zIndex: 100
	},
	sprBoxText: {
		fontSize: 8,
		color: '#fff'
	}
})
