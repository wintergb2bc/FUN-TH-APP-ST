import React from 'react'
import ReactNative, { ActivityIndicator, StyleSheet, Modal, Text, View, Image, TouchableOpacity, Dimensions, TextInput, UIManager, Clipboard, Alert, ImageBackground, Vibration, Platform, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DepositWalletBouns from './DepositWalletBouns'
import { connect } from 'react-redux'
import ModalDropdown from 'react-native-modal-dropdown'
import DepositSpamModal from './DepositModal/DepositSpamModal'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction, changeBonusTurnOverInfor, getPromotionListInforAction, getDepositUserBankAction } from './../../../actions/ReducerAction'
import { getDoubleNum, toThousands, GetOnlyNumReg, getThirdNum, toThousandsAnother, getName } from './../../../actions/Reg'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'
import RedStar from './../../Common/RedStar'
import * as Animatable from 'react-native-animatable'
import LoadingBone from './../../Common/LoadingBone'
const AnimatableView = Animatable.View
const AnimatableImage = Animatable.Image
const { width, height } = Dimensions.get('window')
import RdBindReverseDepositAccountModal from './RdDeposit/RdBindReverseDepositAccountModal'
import moment from 'moment'
import DatePicker from 'react-native-date-picker'
import RdDepositModal from './RdDeposit/RdDepositModal'
import ThbqrDepositModal from './ThbqrDeposit/ThbqrDepositModal'
import { launchImageLibrary } from 'react-native-image-picker';
import { ImgPermissionsText, ImagePickerOption } from './../../Common/CommonData'
import { IphoneXMax } from './../../Common/CommonData'
import DeviceInfo from 'react-native-device-info'
const getModel = DeviceInfo.getModel()
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'
const gameHeaderPaddingTop = isIphoneMax ? 45 : 25
//钱包icon
const RdModalText = [
	'บัตรประชาชน',
	'หน้าสมุดบัญชีธนาคารปัจจุบัน',
	'หน้าสมุดบัญชีธนาคารที่ต้องการเปลี่ยน'
]
const DepositImg = {
	RD: require('../../../images/finance/deposit/depositIcon/RD.png'),
	LB: require('../../../images/finance/deposit/depositIcon/LB_active.png'),
	THBQR: require('../../../images/finance/deposit/depositIcon/THBQR.png'),
	TMW: require('../../../images/finance/deposit/depositIcon/TMW.png'),
	EZP: require('../../../images/finance/deposit/depositIcon/EZP.png'),
	BC: require('../../../images/finance/deposit/depositIcon/BC.png'),
	CC: require('../../../images/finance/deposit/depositIcon/CC.png'),
	LINE: require('../../../images/finance/deposit/depositIcon/LINE.png'),
	BQR: require('../../../images/finance/deposit/depositIcon/BQRMD1.png'),
}
const DepositActiveImg = {
	RD: require('../../../images/finance/deposit/depositIcon/RD.png'),
	LB: require('../../../images/finance/deposit/depositIcon/LB.png'),
	THBQR: require('../../../images/finance/deposit/depositIcon/THBQR.png'),
	TMW: require('../../../images/finance/deposit/depositIcon/TMW.png'),
	EZP: require('../../../images/finance/deposit/depositIcon/EZP_active.png'),
	BC: require('../../../images/finance/deposit/depositIcon/BC.png'),
	CC: require('../../../images/finance/deposit/depositIcon/CC.png'),
	LINE: require('../../../images/finance/deposit/depositIcon/LINE.png'),
	BQR: require('../../../images/finance/deposit/depositIcon/BQRMD.png'),
}
const LbBankIcon = {

}
const LBVcbBankType = [
	{
		title: `Chuyển Khoản${'\n'}Nhanh`,
		pik: 'VCBExpress_LocalBank'
	},
	{
		title: `Chuyển Khoản${'\n'}Thông Thường`,
		pik: 'VCBNormal_LocalBank​'
	}
]

const RDImgIocn = {
	KAS: {
		img1: require('./../../../images/finance/deposit/rdIcon/KAS.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_green.png')
	},
	BKK: {
		img1: require('./../../../images/finance/deposit/rdIcon/BKK.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_lightpurple.png')
	},
	KTB: {
		img1: require('./../../../images/finance/deposit/rdIcon/KTB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_lightblue.png')
	},
	BOAPCL: {
		img1: require('./../../../images/finance/deposit/rdIcon/BOAPCL.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_yellow.png')
	},
	CIMBT: {
		img1: require('./../../../images/finance/deposit/rdIcon/CIMBT.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	SCB: {
		img1: require('./../../../images/finance/deposit/rdIcon/SCB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_purple.png')
	},
	TMB: {
		img1: require('./../../../images/finance/deposit/rdIcon/TMB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},



	TTB: {
		img1: require('./../../../images/finance/deposit/rdIcon/TTB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	UOBTPC: {
		img1: require('./../../../images/finance/deposit/rdIcon/UOBTPC.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	LHB: {
		img1: require('./../../../images/finance/deposit/rdIcon/LHB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	SCBTP: {
		img1: require('./../../../images/finance/deposit/rdIcon/SCBTP.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	TGSB: {
		img1: require('./../../../images/finance/deposit/rdIcon/TGSB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	KBP: {
		img1: require('./../../../images/finance/deposit/rdIcon/KBP.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	CBNA: {
		img1: require('./../../../images/finance/deposit/rdIcon/CBNA.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	GHB: {
		img1: require('./../../../images/finance/deposit/rdIcon/GHB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	BFAAAC: {
		img1: require('./../../../images/finance/deposit/rdIcon/BFAAAC.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	MCB: {
		img1: require('./../../../images/finance/deposit/rdIcon/MCB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	IBOT: {
		img1: require('./../../../images/finance/deposit/rdIcon/IBOT.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	TB: {
		img1: require('./../../../images/finance/deposit/rdIcon/TB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	IACBOCPCL: {
		img1: require('./../../../images/finance/deposit/rdIcon/IACBOCPCL.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	TTCRB: {
		img1: require('./../../../images/finance/deposit/rdIcon/TTCRB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	TSMBC: {
		img1: require('./../../../images/finance/deposit/rdIcon/TSMBC.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	THASC: {
		img1: require('./../../../images/finance/deposit/rdIcon/THASC.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	BPT: {
		img1: require('./../../../images/finance/deposit/rdIcon/BPT.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	DBA: {
		img1: require('./../../../images/finance/deposit/rdIcon/DBA.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	BOCPCL: {
		img1: require('./../../../images/finance/deposit/rdIcon/BOCPCL.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	BOANAS: {
		img1: require('./../../../images/finance/deposit/rdIcon/SCB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	JCBBB: {
		img1: require('./../../../images/finance/deposit/rdIcon/SCB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	MICB: {
		img1: require('./../../../images/finance/deposit/rdIcon/MICB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
	TRBOSBR: {
		img1: require('./../../../images/finance/deposit/rdIcon/SCB.png'),
		img2: require('./../../../images/finance/deposit/rdIcon/ic_bank_card_blue.png')
	},
}
const DepositPiwikMenberText = {
	RD: 'LBExpress_DepositPage',
	THBQR: 'LocalbankQR_DepositPage',
	LB: ' LocalBank_DepositPage',
	TMW: 'TrueWallet_DepositPage',
	EZP: 'Easypay_DepositPage',
	BC: 'FastBaht_DepositPage',
	CC: 'Cashcard_DepositPage',
	LINE: 'Line_DepositPage',
	BQR: 'QR_DepositPage',
}

const DepositTipText = {
	BQR: 'QR ฝากเงินทศนิยมแบบใหม่ ! สแกนได้ทั้งแอปธนาคาร และทรูวอลเล็ท',
	TMW: 'ประกาศสำคัญ: กรุณาใช้แอปทรูมันนี่ วอลเล็ท ในการโอนเท่านั้น แอปธนาคารหรือแอปอื่นๆ ไม่รองรับการฝากเงินนี้ QR Code สามารถ ใช้ได้เพียงครั้งเดียวเท่านั้น',
	LB: 'บัญชีในการฝาก-ถอน ต้องเป็นชื่อบัญชีเดียวกับชื่อที่ใช้สมัครเท่านั้น ไม่รองรับการฝากผ่านตู้บุญเติม, 7-Eleven, True wallet และ Airpay ทุกการฝากมียอดหมุนเวียน 1 เท่าก่อนการถอน (หากไม่รับโบนัส)'
}

const LineIcon = [
	{
		img: require('./../../../images/finance/deposit/lineIcon/lineIcon2.png'),
		text: 'พิมพ์ 1 เข้าสู่ระบบ'
	},
	{
		img: require('./../../../images/finance/deposit/lineIcon/lineIcon3.png'),
		text: 'พิมพ์ 2 เข้าสู่ระบบ'
	},
	{
		img: require('./../../../images/finance/deposit/lineIcon/lineIcon4.png'),
		text: 'พิมพ์ 3 เข้าสู่ระบบ'
	},
	{
		img: require('./../../../images/finance/deposit/lineIcon/lineIcon5.png'),
		text: 'พิมพ์ 4 เข้าสู่ระบบ'
	},
	{
		img: require('./../../../images/finance/deposit/lineIcon/lineIcon6.png'),
		text: 'พิมพ์ 5 เข้าสู่ระบบ'
	},
	{
		img: require('./../../../images/finance/deposit/lineIcon/lineIcon7.png'),
		text: 'พิมพ์ 6 เข้าสู่ระบบ'
	},
]

class DepositContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			depositList: [],
			depositActive: '',
			money: '',//金额
			moneyFlag: false,
			moneyMinAccept: '',
			cared: '',//卡号
			caredPin: '',//卡密码
			LbBankAccounts: null,
			bankSetting: {},
			LbBanks: null,
			LbBanksIndex: -9999,
			isShowAddBank: false,
			checkBox: false,
			LbUserAccounterNumber: '',
			LBVcbBankTypeIndex: 0,
			LbBankAccountsIndex: 0,
			LbLastSixNumber: '',
			LbTransferTypes: [],
			lbIsShowFgo: false,
			balanceInfor: [],
			memberInfor: {},
			depositingWalletIndex: 0,
			bonusId: 0,
			depositingWallet: 'MAIN',
			depositBtnStatus: false,
			mmpModalFlag: true,
			mmpQrcode: '',
			mmpInputTop1: 0,
			mmpInputTop2: 0,
			bonusTurnOverInfor: '',
			depositComBank: null,
			depositComBankIndex: -999999,
			charges: 0,
			isShowDepositSpamModal: false,
			availableMethods: [],
			availableMethodsIndex: 0,
			isGetvailableMethods: false,
			arrowFlag: false,
			arrowFlag1: false,
			depositBank: [],
			depositBankIndex: -99999,
			isFinishAddBankFlag: false,
			inputIsFouces: false,
			bannerIndex: 0,
			isShowPhcModal: false,
			PhcInputMoney: '',
			PhcInputMoneyIndex: -9999,
			mmoSubmitInfor: null,
			IsDummyBank: false,
			isErrorModal: false,
			depositingWalletMoney: '',
			isShowRdDepositModal: false,
			rbBankAccounts: null,
			rdBanks: null,
			isRdChangeBnakTipModal: false,
			isShowRdUserBnakModal: false,
			isRdChangeBankModal: false,
			IsReverseDeposit: false,
			accountHolderName: '',
			isRdBindReverseDepositAccountModal: false,
			description: '',
			errorCode: '',
			depositBankRdSettingIndex: 0,
			IsSingleDeposit: false,
			isShowDataPicker: false,
			offlineDepositDate: '',
			avatarName: '',
			avatarSource: '',
			fileImgFlag: false,
			isOldSix: false,
			isShowDepositWalletBouns: false,
			isShowThbqrDepositModal: false,
			isLbUniqueAmt: false,
			depositListBone: Array.from({ length: 10 }, (v, i) => v),
			isLoading: false,
		}
		this.mycomponent1 = React.createRef()
		this.mycomponent2 = React.createRef()
	}

	componentDidMount(props) {
		window.isGamePageToFiance && window.openOrientation && window.openOrientation()
		Toast.hide()
		let memberInfor = this.props.memberInforData
		let balanceInfor = this.props.balanceInforData
		this.setState({
			memberInfor,
			balanceInfor
		})
		this.getDefaultWallet(memberInfor, balanceInfor)
		this.getDepositList()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.balanceInforData) {
			this.setState({
				balanceInfor: nextProps.balanceInforData
			})
		}

		if (nextProps && nextProps.memberInforData) {
			this.setState({
				memberInfor: nextProps.memberInforData
			}, () => {
				this.getDefaultWallet(nextProps.memberInforData, nextProps.balanceInforData)
			})
		}

		this.getDepositUserBank(nextProps)
	}

	componentWillUnmount() {
		window.isGamePageToFiance && window.removeOrientation && window.removeOrientation()
		window.isGamePageToFiance = false
	}

	getDefaultWallet(memberInfor, balanceInfor) {
		if (memberInfor && balanceInfor.length > 0) {
			const { fromPage } = this.props
			this.setState({
				accountHolderName: memberInfor.FirstName,
				IsSingleDeposit: memberInfor.IsSingleDeposit
			})
			if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {
				let { bonusProductList } = this.props
				let bonusProduct = bonusProductList.bonusProduct.toLocaleUpperCase()
				if (bonusProduct) {
					let depositingWalletIndex = balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL').findIndex(v => v.name === bonusProduct)
					let depositingWalletMoney = balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL').find(v => v.name === bonusProduct)
					this.setState({
						depositingWallet: bonusProduct,
						depositingWalletIndex: depositingWalletIndex >= 0 ? depositingWalletIndex : 0,
						bonusId: bonusProductList.bonusID,
						depositingWalletMoney,
						moneyMinAccept: bonusProductList.minAccept
					})
				}
			} else {
				let preferWallet = memberInfor.PreferWallet
				let depositingWalletIndex = balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL').findIndex(v => v.name === preferWallet)
				let depositingWalletMoney = balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL').find(v => v.name === preferWallet)
				this.setState({
					depositingWalletIndex: depositingWalletIndex >= 0 ? depositingWalletIndex : 0,
					depositingWallet: preferWallet ? preferWallet : 'MAIN',
					depositingWalletMoney
				})
			}
		}
	}

	getDepositUserBank(props) {
		if (props) {
			let depositUserBankData = props.depositUserBankData
			if (Array.isArray(depositUserBankData)) {
				if (this.state.depositActive == 'RD') {
					let defaultBank = depositUserBankData.find(v => v.IsReverseDeposit)
					if (defaultBank) {
						let defaultBankIndex = depositUserBankData.findIndex(v => v.IsReverseDeposit)
						depositUserBankData.splice(defaultBankIndex, 1)
						depositUserBankData.unshift(defaultBank)
						this.setState({
							IsReverseDeposit: true
						})
					} else {
						this.setState({
							IsReverseDeposit: false
						})
					}
				}

				this.setState({
					depositBank: depositUserBankData
				}, () => {
					//this.changeLbDepositBtnStatus()
				})
			}
		}
	}

	getDepositList() {
		global.storage.load({
			key: 'depositListName',
			id: 'depositListName'
		}).then(data => {
			this.setState({
				depositList: data
			})
			if (this.props.fromPage === 'transaction') {
				const { depositActive, MethodType } = this.props
				if (data.find(v => v.code.toLocaleUpperCase() == depositActive.toLocaleUpperCase())) {
					this.setState({
						depositActive
					}, () => {
						this.depositSelect(depositActive)
					})
					return
				}
			}
			let depositActive = data[0].code
			this.setState({
				depositActive
			}, () => {
				this.depositSelect(depositActive)
			})

		}).catch(() => {
			Toast.loading('กำลังโหลดข้อมูล...', 200000)
		})

		const depositMethod = ['RD', 'LB', 'THBQR', 'TMW', 'EZP', 'BC', 'CC', 'LINE', 'BQR']
		//const depositMethod = ['BQR']
		fetchRequest(ApiPort.Payment + '?transactionType=deposit&', 'GET').then(res => {
			if (Array.isArray(this.state.depositList) && this.state.depositList.length) {

			} else {
				Toast.hide()
			}
			Toast.hide()
			if (Array.isArray(res) && res.length) {
				let depositList = res.filter(v => depositMethod.includes(v.code.toLocaleUpperCase()))
				if (this.props.fromPage === 'transaction') {
					const { depositActive, MethodType } = this.props
					if (depositList.find(v => v.code.toLocaleUpperCase() == depositActive.toLocaleUpperCase())) {
						this.setState({
							depositActive
						}, () => {
							this.depositSelect(depositActive)
						})
						return
					}
				}
				if (!this.state.depositActive) {
					let depositActive = depositList[0].code
					this.setState({
						depositList,
						depositActive
					}, () => {
						this.depositSelect(depositActive)
					})
				}

				global.storage.save({
					key: 'depositListName',
					id: 'depositListName',
					data: depositList.filter(v => v.code),
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	getpaymentSettings(availableMethodsIndex, flag) {
		this.setState({
			depositComBank: null,
			bankSetting: {},
			depositComBankIndex: -999,
			money: '',//金额
			moneyFlag: false,
			depositBtnStatus: false,
			isGetvailableMethods: true,
			LbBankAccounts: null,
			LbBanks: [],
			LbTransferTypes: [],
			isFinishAddBankFlag: false,
			availableMethodsIndex,
			LbBankAccountsIndex: -999,
			depositBankIndex: -99,
			inputIsFouces: false
		})




		const { availableMethods, depositActive } = this.state

		let methodCode = availableMethods[availableMethodsIndex].MethodCode
		Toast.loading('กำลังโหลดข้อมูล...', 200000)
		fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=' + depositActive + '&MethodCode=' + methodCode + '&isMobile=true&', 'GET').then(res => {
			Toast.hide()
			let depositComBank = res.Banks
			if ((Array.isArray(depositComBank))) {
				this.setState({
					depositComBank,
					bankSetting: res.Setting,
					isGetvailableMethods: false,
					charges: res.Setting.Charges
				}, () => {
					// if (this.props.fromPage === 'preferentialPage' || this.props.fromPage === 'homelPage') {
					// 	let money = this.state.moneyMinAccept + ''
					// 	this.setState({
					// 		//	money
					// 	}, () => {
					// 		this.moneyChange(money)
					// 	})
					// }
					//flag && this.getdepositComBankTempIndex(bankResult.Banks)
				})
			}
		}
		).catch(err => {
			Toast.hide()
		})
	}


	//钱包选择
	depositSelect(key, flag) {
		const { memberInfor, depositActive, depositList } = this.state
		if (flag && key === depositActive) {
			return
		}

		Platform.OS == 'ios' && window.isSTcommon_url && Vibration.vibrate()
		let tempIndex = depositList.findIndex(v => v.code.toLocaleUpperCase() === key.toLocaleUpperCase())
		let index = depositList.findIndex(v => v.code.toLocaleUpperCase() === depositActive.toLocaleUpperCase())
		this.view && this.view[`fadeIn${tempIndex > index ? 'Right' : 'Left'}`](400)

		//let availableMethodsIndex = key === 'FP' ? -999999999999 : 0
		this.setState({
			availableMethodsIndex: 0,
			moneyFlag: false,
			depositActive: key,
			money: '',
			cared: '',
			caredPin: '',
			LbBankAccounts: null,
			LbBanks: null,
			bankSetting: {},
			depositBtnStatus: false,
			walletBounsIndex: false,
			LbTransferTypes: [],
			LBVcbBankTypeIndex: 0,
			LbLastSixNumber: '',
			depositComBank: null,
			depositComBankIndex: -999999,
			charges: 0,
			LbBankAccountsIndex: 0,
			availableMethods: [],
			availableMethodsIndex: 0,
			isGetvailableMethods: false,
			depositBank: [],
			depositBankIndex: ('RD' == key || (key == 'LB' && Array.isArray(this.state.depositBank) && this.state.depositBank.length > 0)) ? 0 : -99999,
			isFinishAddBankFlag: false,
			lbIsShowFgo: false,
			inputIsFouces: false,
			PhcInputMoneyIndex: -9999,
			mmoSubmitInfor: null,
			rdBanks: null,
			LbUserAccounterNumber: '',
			isShowAddBank: false,
			checkBox: false,
			depositBankRdSettingIndex: 0,
			IsReverseDeposit: false,
			fileImgFlag: false,
			avatarName: '',
			avatarSource: '',
			isOldSix: false,
			isOldSix: false
		})


		// if (this.props.fromPage === 'preferentialPage' || this.props.fromPage === 'homelPage') {
		// 	let money = this.state.moneyMinAccept + ''
		// 	this.setState({
		// 		//	money
		// 	}, () => {
		// 		this.moneyChange(money)
		// 	})
		// }

		if (key == 'THBQR') {
			this.getMmpStore()
		}
		if (key == 'LINE') {
			return
		}

		(key === 'LB' || key === 'RD' || key === 'BQR') && this.props.getDepositUserBankAction()
		if (['LB'].includes(key)) {
			const depositListItem = depositList.find(v => v.code.toLocaleUpperCase() === key)
			const availableMethods = depositListItem.availableMethods
			if (Array.isArray(availableMethods) && availableMethods.length > 0) {
				let tempAvailableMethods = availableMethods.filter(v => v.MethodCode.toLocaleUpperCase() !== 'DEFAULT' && v.MethodCode && v.MethodType)
				if (tempAvailableMethods.length > 0) {
					this.setState({
						availableMethods: tempAvailableMethods
					}, () => {
						this.getPaymentLbSettings(0)
					})
					return
				}
			}
		}

		if (key === 'EZP') {
			const depositListItem = depositList.find(v => v.code.toLocaleUpperCase() === key)
			const availableMethods = depositListItem.availableMethods
			if (Array.isArray(availableMethods) && availableMethods.length > 0) {
				let tempAvailableMethods = availableMethods.filter(v => v.MethodCode.toLocaleUpperCase() !== 'DEFAULT' && v.MethodCode && v.MethodType)
				if (tempAvailableMethods.length > 0) {
					this.setState({
						availableMethods: tempAvailableMethods
					}, () => {
						key === 'EZP' && this.getpaymentSettings(0, true)
					})
					return
				}
			}
		}

		Toast.loading('กำลังโหลดข้อมูล...', 200000)
		fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=' + key + '&isMobile=true&', 'GET').then(res => {
			Toast.hide()
			Toast.hide()
			Toast.hide()
			//if (res.isSuccess) {

			let bankResult = res
			if (['LB', 'BQR'].includes(key)) {
				let BankAccounts = bankResult.BankAccounts
				this.setState({
					LbBankAccounts: [...BankAccounts], // 公司收款银行
					LbBanks: bankResult.Banks, // 个人新增银行
					LbTransferTypes: bankResult.TransferTypes
				})

				let depositBank = this.state.depositBank
				if (Array.isArray(depositBank) && depositBank.length) {
					this.setState({
						depositBankIndex: 0
					})
				}

				global.storage.save({
					key: 'DepositLbBanks',
					id: 'DepositLbBanks',
					data: bankResult.Banks,
					expires: null
				})
			} else if (['EZP', 'BC'].includes(key)) {
				let depositComBankTemp = bankResult.Banks
				this.setState({
					depositComBank: depositComBankTemp
				})
			} else if ('RD' == key) {
				this.setState({
					rbBankAccounts: bankResult.BankAccounts,
					rdBanks: bankResult.Banks
				})
			}

			const bankSetting = bankResult.Setting
			//bankSetting.IsAutoAssign = true
			this.setState({
				bankSetting,
				charges: bankSetting.Charges
			}, () => {
				const { money } = this.state
				if (money) {
					const { MaxBal, MinBal } = bankSetting
					const moneyFlag = money >= MinBal && money <= MaxBal
					this.setState({
						moneyFlag
					}, () => {
						this.setDepositBtnStatus()
					})
				}
			})
			//	}
		}).catch(err => {
			Toast.hide()
		})

		DepositPiwikMenberText[key] && window.PiwikMenberCode('Deposit Nav​', 'Click', DepositPiwikMenberText[key])
	}

	getPaymentLbSettings(i) {
		const { money, availableMethods } = this.state
		this.setState({
			bankSetting: {},
			moneyFlag: false,
			availableMethodsIndex: i,
			money: '',
			LbBankAccountsIndex: 0, /// 公司首款
			isOldSix: false, // old 6
			isShowAddBank: false,
			depositBankIndex: (Array.isArray(this.state.depositBank) && this.state.depositBank.length > 0) ? 0 : -99999, // 个人银行


			moneyFlag: false,
			LbBankAccounts: null,
			LbBanks: null,
			bankSetting: {},
			depositBtnStatus: false,
			walletBounsIndex: false,
			LbTransferTypes: [],
			LBVcbBankTypeIndex: 0,
			LbLastSixNumber: '',
			charges: 0,
			isGetvailableMethods: false,

			isFinishAddBankFlag: false,
			inputIsFouces: false,
			mmoSubmitInfor: null,
			rdBanks: null,
			LbUserAccounterNumber: '',
			isShowAddBank: false,
			checkBox: false,
			depositBankRdSettingIndex: 0,
			IsReverseDeposit: false,
			fileImgFlag: false,
			avatarName: '',
			avatarSource: '',
			isOldSix: false,
		})

		if (availableMethods[i].MethodCode.toLocaleUpperCase() == 'UNIQUEAMT') {
			this.setState({
				isLbUniqueAmt: true
			})
		}
		let depositActive1 = 'LB'
		let methodCode = availableMethods[i].MethodCode

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=' + depositActive1 + '&MethodCode=' + methodCode + '&isMobile=true&', 'GET').then(res => {
			Toast.hide()
			//if (res.isSuccess) {
			let bankResult = res
			//.result
			let bankSetting = bankResult.Setting
			const { MaxBal, MinBal } = bankSetting
			const moneyFlag = money >= MinBal && money <= MaxBal

			this.setState({
				LbBankAccounts: bankResult.BankAccounts, // 公司收款银行
				LbBanks: bankResult.Banks, // 个人新增银行
				LbTransferTypes: bankResult.TransferTypes,

				depositBankIndex: (Array.isArray(this.state.depositBank) && this.state.depositBank.length > 0) ? 0 : -99999, // 个人银行
				bankSetting,
				isGetvailableMethods: false,
				moneyFlag,
				charges: bankSetting.Charges
			}, () => {
				if (this.props.fromPage === 'preferentialPage' || this.props.fromPage === 'homelPage') {
					// let money = this.state.moneyMinAccept + ''
					// this.setState({
					// 	//money
					// }, () => {
					// 	this.moneyChange(money)
					// })
				} else {
					this.setDepositBtnStatus()
				}
			})
			// } else {
			// 	this.setDepositBtnStatus()
			// }
		}).catch(err => {
			Toast.hide()
			this.setDepositBtnStatus()
		})
	}


	postApplications({ transactionId, successBonusId }) {
		this.setState({
			isShowModalFlag1: false
		})
		const { bonusId, money, depositingWallet, charges, balanceInfor, balanceInforIndex, promotionsDetail } = this.state

		let data = {
			bonusId: bonusId,
			amount: money,
			bonusMode: "Deposit",
			targetWallet: depositingWallet,
			couponText: "",
			isMax: false,
			transferBonus: null,
			depositBonus: {
				depositCharges: charges,
				depositId: transactionId,
			},
			successBonusId: 0,
			blackBoxValue: E2Backbox,
			e2BlackBoxValue: E2Backbox,
		}
		fetchRequest(ApiPort.PostApplications, 'POST', data).then(res => {
			Toast.hide()
			if (res) {
				let bonusResult = res.bonusResult
				if (bonusResult) {
					if (bonusResult.message.toLocaleUpperCase() == 'SUCCESS') {
						Toast.success('สมัครโบนัสสำเร็จ', 2000)
						this.getCalculateBonusTurnOver(money)
						this.props.getPromotionListInforAction()
					} else {
						Toast.fail('ขอรับโบนัสไม่สำเร็จ', 2000)
					}
				}
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	payMoney() {
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		this.setState({
			isLoading: true
		})
		this.setState({
			depositBtnStatus: false
		})

		const { isOldSix, bankSetting, availableMethods, availableMethodsIndex, charges, bonusTurnOverInfor, depositActive, money, depositingWallet, bonusId, cared, caredPin, memberInfor, lbIsShowFgo, LBVcbBankTypeIndex, depositComBank, depositComBankIndex, LbBankAccounts, LbBankAccountsIndex } = this.state
		let lbFlag = depositActive === 'LB' && lbIsShowFgo && LBVcbBankTypeIndex * 1 === 0
		const { IsAutoAssign } = bankSetting

		if (!(Array.isArray(availableMethods) && availableMethods.length && depositActive == 'LB')) {
			DepositPiwikMenberText[depositActive] && window.PiwikMenberCode('Deposit Nav​', 'Click', `Submit_${DepositPiwikMenberText[depositActive]}_Deposit`)
		}



		let data = {}
		if (depositActive == 'LB') {
			const { isOldSix, offlineDepositDate, avatarSource, avatarName, LbBankAccounts, LbBankAccountsIndex, depositBank, depositBankIndex, LbLastSixNumber, LbTransferTypes, LbTransferTypesIndex } = this.state
			let depositBankList = depositBank[depositBankIndex]
			let compayBank = null

			if (!isOldSix) {
				compayBank = LbBankAccounts[LbBankAccountsIndex]
			}
			data = {
				// 收款
				depositingBankAcctNum: isOldSix ? LbLastSixNumber : compayBank.AccountNo.substr(compayBank.AccountNo.length - 6),
				depositingBankName: isOldSix ? '' : compayBank.EnBankName,
				province: isOldSix ? '' : compayBank.Province, //收款銀行 省市
				city: isOldSix ? '' : compayBank.City, //收款銀行 城市
				branch: isOldSix ? '' : compayBank.Branch, //收款銀行 分行

				// 付款
				bankName: depositBankList.BankName,
				accountNumber: depositBankList.AccountNumber,
				accountHolderName: depositBankList.AccountHolderName,

				domainName: 'Fun88native://',
				bonusId,
				language: 'th-th',
				paymentMethod: depositActive,
				charges: 0,
				amount: money, //錢
				transactionType: 'Deposit',
				isMobile: true, //高捷 false   //快捷 true
				isSmallSet: false,
				refNo: '0',
				offlineDepositDate: offlineDepositDate ? offlineDepositDate : moment(new Date()).format('YYYY-MM-DD HH:MM:SS'),
				successUrl: 'Fun88native://',
				mgmtRefNo: 'Fun88P4MobileApps',
				transferType: LbTransferTypes[0],
				transfertype: '',
				offlineRefNo: '0',
				isPreferredWalletSet: false, // 是不是首選帳戶
				depositingWallet: depositingWallet, //目標帳戶
				fileBytes: avatarSource ? avatarSource : '',
				fileName: avatarName,
				blackBoxValue: E2Backbox,
				e2BlackBoxValue: E2Backbox,
				IPAddress: '',
				CurrencyCode: 'THB',
				Address: '',
				BankLogID: '',
				bonusCoupon: '',
				MethodCode: availableMethods[availableMethodsIndex].MethodCode
			}
		} else if (depositActive === 'CC') {
			data = {
				language: 'th-th',
				paymentMethod: 'CC',
				charges: 0,
				amount: money,
				transactionType: 'Deposit',
				domainName: 'Fun88native://',
				isMobile: true,
				isSmallSet: false,
				bonusId,
				mgmtRefNo: 'Fun88P4MobileApps',
				successUrl: 'Fun88native://',
				depositingWallet,  //目標帳戶
				isPreferredWalletSet: false, // 是不是首選帳戶
				blackBoxValue: E2Backbox,
				e2BlackBoxValue: E2Backbox,
				cardNumber: cared,
				cardPIN: caredPin,
				refNo: cared,
				bonusCoupon: ''
			}
		} else if (['THBQR', 'TMW'].includes(depositActive)) {
			data = {
				language: 'th-th',
				paymentMethod: depositActive,
				charges: 0,
				amount: money,
				transactionType: 'Deposit',
				domainName: 'Fun88native://',
				isMobile: true,
				isSmallSet: false,
				bonusId,
				mgmtRefNo: 'Fun88P4MobileApps',
				successUrl: 'Fun88native://',
				depositingWallet,
				isPreferredWalletSet: false, // 是不是首選帳戶
				blackBoxValue: E2Backbox,
				e2BlackBoxValue: E2Backbox,
				bonusCoupon: ''
			}
		} else if (['EZP', 'BC'].includes(depositActive)) {
			data = {
				language: 'th-th',
				paymentMethod: depositActive,
				charges: 0,
				amount: money,
				transactionType: 'Deposit',
				domainName: 'Fun88native://',
				isMobile: true,
				isSmallSet: false,
				bonusId,
				mgmtRefNo: 'Fun88P4MobileApps',
				successUrl: 'Fun88native://',
				depositingWallet,
				isPreferredWalletSet: false, // 是不是首選帳戶
				blackBoxValue: E2Backbox,
				e2BlackBoxValue: E2Backbox,
				"BankName": IsAutoAssign ? 'nil' : depositComBank[depositComBankIndex].Code,
				bonusCoupon: ''
			}
		} else if (depositActive == 'BQR') {
			let { depositBank, depositBankIndex, LbBankAccounts } = this.state
			let depositBank1 = depositBank[depositBankIndex]
			data = {
				amount: money,
				bonusId,
				isMobile: true,
				depositingWallet,
				language: 'th-th',
				isSmallSet: false,
				blackBoxValue: E2Backbox,
				e2BlackBoxValue: E2Backbox,
				transactionType: 'Deposit',
				isPreferredWalletSet: false, // 是不是首選帳戶
				successUrl: 'Fun88native://',
				domainName: 'Fun88native://',
				mgmtRefNo: 'Fun88P4MobileApps',
				paymentMethod: depositActive,
				"MethodCode": "DEFAULT",
				"charges": 0,
				"MemberCode": memberInfor.MemberCode,
				"MemberName": memberInfor.UserName,
				"RequestedBy": memberInfor.UserName,
				"CurrencyCode": "THB",
				"BankName": depositBank1.BankName,
				"accountNumbeR": depositBank1.AccountNumber,
				"accountHolderName": depositBank1.AccountHolderName,
				"depositingbankacctnum": LbBankAccounts[0].AccountNo.slice(-6),
				"refNo": "0",
				"OfflineRefNo": "0",
				bonusCoupon: ''
			}

			if (!IsAutoAssign) {
				data.depositingBankName = depositBank.EnBankName
			}

		}
		if ('EZP' == depositActive && Array.isArray(availableMethods) && availableMethods.length) {
			data.methodcode = availableMethods[availableMethodsIndex].MethodCode
		}
		data.charges = bankSetting.Charges

		fetchRequest(ApiPort.PaymentApplications, 'POST', data).then(res => {
			Toast.hide()
			this.setState({
				isLoading: false
			})
			if (depositActive == 'LB') {
				this.setState({
					isOldSix: false
				})
			}
			if (res.isSuccess) {
				const { fromPage } = this.props
				if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {
					let toastFlag = res.successBonusId
					this.postApplications(res, this.state.money)
					// if (fromPage === 'preferentialPage') {
					// 	Actions.promotionLogin()
					// } else if (fromPage === 'homelPage') {
					// 	Actions.home()
					// }
					//this.props.getPromotionListInforAction()
					// } else {
					// 	//Toast.fail('Áp dụng giảm giá thất bại', 3)
					// }
				}

				if (['THBQR', 'TMW', 'EZP', 'BC'].includes(depositActive) || lbFlag) {
					Actions.DepositPageStack({
						payHtml: res.redirectUrl,
						money: money,
						paymentMethod: depositActive,
						isEuro: this.props.isEuro,
						transactionId: res.transactionId
					})
				} else if (depositActive == 'LB' && availableMethods[availableMethodsIndex].MethodCode.toLocaleUpperCase() == 'UNIQUEAMT' && !isOldSix) {
					this.goLbStep2Page(false, res)
				} else if (depositActive == 'BQR') {
					let isDummyBank = res.isDummyBank
					Actions.BqrDeposit({
						transactionId: res.transactionId,
						money,
						qrDeepLink: res.qrDeepLink,
						offlineRefNo: res.offlineRefNo,
						paymentMethod: depositActive,
						// BankCode: depositComBank[depositComBankIndex].BankCode,
						BankName: LbBankAccounts[0].BankName,
						isQR: res.isQR,
						isDummyBank,
						createisDummyBank: (isDummyBank) => {
							return this.createisDummyBank(isDummyBank)
						}
					})
				} else {
					//欧冠优惠
					if (this.props.isEuro) {
						Actions.pop()
					}
					Actions.FinanceAfter({
						isEuro: this.props.isEuro,
						financeType: 'deposit',
						paymentMethod: depositActive,
						money,
						fromPage: this.props.fromPage
					})
				}

				this.setState({
					bonusTurnOverInfor: '',
					moneyFlag: false,
					cared: '',
					caredPin: '',
					depositBtnStatus: false,
					LbLastSixNumber: '',
					inputIsFouces: false,
					PhcInputMoneyIndex: -9999,
					isOldSix: false,
					LbBanksIndex: -9999
					// LbBankAccountsIndex: -999
				})

				if (depositActive !== 'MMO') {
					this.setState({
						money: '',
					})
				}

				this.props.getBalanceInforAction()
			} else {
				this.setState({
					isOldSix: false
				})
				if (res.errorMessage == 'P101113') {
					this.setState({
						isErrorModal: true
					})
					return
				}
				if (res.isPopup) {
					this.setState({
						isShowDepositSpamModal: true,
					})
				} else {
					if (res.errorMessage) {
						Toast.fail(res.errorMessage, 3)
					}
				}
				this.setState({
					bonusTurnOverInfor: '',
					money: '',
					moneyFlag: false,
					cared: '',
					caredPin: '',
					depositBtnStatus: false,
					LbLastSixNumber: '',
					offlineDepositDate: ''
					// LbBankAccountsIndex: -999
				})
			}
		}).catch(err => {
			Toast.hide()
			this.setState({
				isOldSix: false
			})
		})
	}


	getDepositAccountByAmount(isOldSix) {
		const {
			depositActive,
			money,
			balanceInfor,
			bankSetting,
			LbBankAccounts,
			LbBanks,
			LbTransferTypes,
			depositingWalletIndex,
			memberInfor,
			LbLastSixNumber,
			LbBankAccountsIndex,
			bonusId,
			depositingWallet,
			depositBank,
			depositBankIndex,
		} = this.state
		const { bonusApplicableSite } = this.props
		let DepositingBankName = LbBankAccounts[LbBankAccountsIndex].EnBankName
		Toast.loading('กำลังโหลด...', 200000)
		let params = `PaymentMethodId=LB&DepositingBankName=${DepositingBankName}&MethodCode=default&Amount=${money}&`
		fetchRequest(ApiPort.GetDepositAccountByAmount + params, 'GET').then(res => {
			Toast.hide()
			if (res.isSuccess) {
				let result = res.result
				let IsDummyBank = result.IsDummyBank
				this.setState({
					IsDummyBank
				}, () => {
					this.goLbStep2Page(isOldSix)
				})
			} else {
				let errors = res.errors
				if (Array.isArray(errors) && errors.length) {
					let errorItem = errors[0]
					if (errorItem.errorCode == 'P101113') {
						this.setState({
							isErrorModal: true
						})
					}
				}
			}
		}).catch(() => {
			Toast.hide()
		})
	}


	goLbStep2Page(isOldSix, lbInfor = {}) {
		const {
			depositActive,
			money,
			balanceInfor,
			bankSetting,
			LbBankAccounts,
			LbBanks,
			LbTransferTypes,
			depositingWalletIndex,
			memberInfor,
			LbLastSixNumber,
			LbBankAccountsIndex,
			bonusId,
			depositingWallet,
			depositBank,
			depositBankIndex,
			bonusApplicableSite,
			availableMethods,
			IsDummyBank,
			moneyMinAccept,
			availableMethodsIndex
		} = this.state

		let availableMethodsCode = ''
		if (Array.isArray(availableMethods) && availableMethods.length && availableMethodsIndex >= 0) {
			availableMethodsCode = availableMethods[availableMethodsIndex]
		}

		Actions.LBdepositPage({
			isOldSix,
			money,
			depositBank: this.state.depositBank,
			depositBankIndex: this.state.depositBankIndex,
			LbBankAccounts: LbBankAccounts[LbBankAccountsIndex],
			createDepositTopTip: (cssObj) => {
				return this.createDepositTopTip(cssObj)
			},
			lbInfor,
			availableMethods,
			IsDummyBank,
			moneyMinAccept,
			availableMethodsCode,


			LbBanks,
			LbTransferTypes,
			balanceInfor,
			depositingWalletIndex,
			bankSetting,
			memberInfor,
			bonusId,
			depositingWallet,
			fromPage: this.props.fromPage,
			bonusProductList: this.props.bonusProductList,
			bonusApplicableSite,
			FirstName: memberInfor.FirstName,
			depositActive,

			createisDummyBank: (IsDummyBank) => {
				return this.createisDummyBank(IsDummyBank)
			}
		})


		this.setState({
			money: '',
			LbLastSixNumber: '',
			depositBtnStatus: false,
			moneyFlag: false,
			//depositBankIndex: -999999,
			inputIsFouces: false,
		})
	}


	getDepositWallet(depositingWallet) {
		this.setState({
			depositingWallet
		})
	}

	getDepositBouns(bonusId) {
		this.setState({
			bonusId
		})
	}

	getBonusTurnOverInfor(bonusTurnOverInfor) {
		this.setState({
			bonusTurnOverInfor
		})
	}

	getCalculateBonusTurnOver(money) {
		this.setState({
			bonusTurnOverInfor: {}
		})
		const { bonusId } = this.state
		let { bonusProductList } = this.props
		fetchRequest(ApiPort.GetCalculateBonusTurnOver + 'bonusId=' + bonusId + '&applyAmount=' + money + '&', 'GET').then(res => {
			Toast.hide()
			if (res.isSuccess) {
				let bonusTurnOverInfor = {
					applyAmount: money,
					...res,
					availableBonusesList: bonusProductList
				}
				this.props.changeBonusTurnOverInfor(bonusTurnOverInfor)
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	caredChange(cared) {
		this.setState({
			cared
		}, () => {
			this.setDepositBtnStatus()
		})
	}

	caredPinChange(caredPin) {
		this.setState({
			caredPin
		}, () => {
			this.setDepositBtnStatus()
		})
	}

	moneyChange(money) {
		const { bankSetting } = this.state
		const { MaxBal, MinBal } = bankSetting
		let moneyFlag = money >= MinBal && money <= MaxBal
		this.setState({
			money,
			moneyFlag
		}, () => {
			this.setDepositBtnStatus()
		})
	}

	setDepositBtnStatus() {
		const { availableMethods, availableMethodsIndex, PhcInputMoneyIndex, bankSetting, depositBank, depositBankIndex, depositComBank, lbIsShowFgo, moneyFlag, LbBankAccounts, LbBankAccountsIndex, LBVcbBankTypeIndex, cared, caredPin, depositActive, depositComBankIndex } = this.state
		const { IsAutoAssign } = bankSetting
		const { isOldSix, LbLastSixNumber } = this.state
		let depositBtnStatus = false
		if (depositActive === 'CC') {
			depositBtnStatus = moneyFlag && cared.length && caredPin.length
		} else if (depositActive === 'LB') {
			if (Array.isArray(availableMethods) && availableMethods.length && availableMethodsIndex >= 0 && availableMethods[availableMethodsIndex].MethodCode.toLocaleUpperCase() == 'UNIQUEAMT' && isOldSix) {
				depositBtnStatus =
					//Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0 && LbBankAccountsIndex >= 0 &&
					Array.isArray(depositBank) && depositBank.length > 0 && depositBankIndex >= 0 &&
					moneyFlag && LbLastSixNumber.length == 6
			} else {
				depositBtnStatus = Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0 && LbBankAccountsIndex >= 0 &&
					Array.isArray(depositBank) && depositBank.length > 0 && depositBankIndex >= 0 &&
					moneyFlag
			}
		} else if (['THBQR', 'TMW'].includes(depositActive)) {
			depositBtnStatus = moneyFlag
		} else if (["EZP", 'BC'].includes(depositActive)) {
			depositBtnStatus = moneyFlag && Array.isArray(depositComBank) && depositComBank.length && depositComBankIndex >= 0
		} else if (depositActive == 'BQR') {
			depositBtnStatus = Array.isArray(depositBank) && depositBank.length && depositBankIndex >= 0 && moneyFlag
		}
		this.setState({
			depositBtnStatus: depositBtnStatus
		})

	}

	createLbBankstList(item, index) {
		let flag = this.state.LbBankAccountsIndex * 1 === index * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: flag ? '#25AAE1' : '#fff' }]} key={index}>
			{
				LbBankIcon[item.BankCode.toLocaleUpperCase()] && <Image
					style={[styles.lbimgIcon, styles[`lbimgIcon${item.BankCode.toLocaleUpperCase()}`]]}
					source={LbBankIcon[item.BankCode.toLocaleUpperCase()]}
					resizeMode='stretch'
				></Image>
			}
			<Text style={[styles.toreturnModalDropdownListText, { color: !flag ? '#000' : '#fff', width: width - 75 }]}>{item.BankName}_{item.AccountNo.slice(-4)}</Text>
		</View>
	}


	//复制文本
	async copyTXT(txt) {
		Clipboard.setString(txt)
		Toast.success('คัดลอกสำเร็จ')
	}

	changeDepositSpamModal(isShowDepositSpamModal) {
		this.setState({
			isShowDepositSpamModal
		})
	}

	changeArrowStatus(tag, arrowFlag) {
		this.setState({
			[tag]: arrowFlag
		})
	}

	changeIsFinishAddBankFlag(isFinishAddBankFlag, bankInfor) {
		this.setState({
			isFinishAddBankFlag,
			//depositBankIndex: 0
		})
		if (bankInfor && bankInfor.isDB) {
			setTimeout(() => {
				let depositBank = this.state.depositBank
				let depositBankIndex = depositBank.findIndex(v => {
					return v.BankName.toLocaleUpperCase() == bankInfor.bankName.trim().toLocaleUpperCase() &&
						v.AccountHolderName.toLocaleUpperCase() == bankInfor.accountHolderName.trim().toLocaleUpperCase() &&
						v.AccountNumber == bankInfor.accountNumber
				}
				)
				if (depositBankIndex >= 0) {
					this.setState({
						depositBankIndex
					}, () => {
						this.setDepositBtnStatus()
					})
				}
			}, 2000)
		} else {
			setTimeout(() => {
				let depositBank = this.state.depositBank
				depositBank.unshift({
					BankName: bankInfor.bankName,
					AccountNumber: bankInfor.accountNumber,
					AccountHolderName: bankInfor.accountHolderName
				})
				this.setState({
					depositBankIndex: 0
				}, () => {
					this.setDepositBtnStatus()
				})
			}, 1500)
		}
	}

	changeInputFous(inputIsFouces) {
		this.setState({
			inputIsFouces
		})
	}

	cc(num) {
		let str = num.toString();
		let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
		return str.replace(reg, "$1,")
	}

	moneyInput(flag) {
		const { charges, inputIsFouces, money, bankSetting, moneyFlag, depositActive, isGetvailableMethods, availableMethods } = this.state
		return <View style={styles.limitLists}>
			<Text style={[styles.limitListsText]}>ยอดฝาก</Text>
			<View style={styles.LBMoneyBox}>
				<TextInput
					value={money}
					keyboardType={'decimal-pad'}
					onChangeText={value => {
						this.moneyChange(value)
					}}
					placeholderTextColor={'#999'}
					//placeholder={(bankSetting.MinBal && flag) ? `Giới hạn gửi tối thiểu ${toThousands(bankSetting.MinBal)} , tối đa ${toThousands(bankSetting.MaxBal)}` : ''}
					onFocus={this.changeInputFous.bind(this, true)}
					style={[styles.limitListsInput]} />
				<RedStar></RedStar>
			</View>

			{
				!flag && <Text style={[styles.depositMoneyText1]}>แจ้งเตือน ฝากเงินขั้นต่ำ {toThousands(bankSetting.MinBal)} บาท สูงสุด {toThousands(bankSetting.MaxBal)} บาทต่อ 1 รายการ</Text>
			}


			{
				!moneyFlag && (money + '').length > 0 && bankSetting.MinBal > money && <Text style={[styles.depositMoneyText1, styles.depositMoneyText3]}>จำนวนเงินต้องไม่ต่ำกว่า {toThousands(bankSetting.MinBal)} บาท</Text>
			}
			{
				!moneyFlag && (money + '').length > 0 && bankSetting.MaxBal < money && <Text style={[styles.depositMoneyText1, styles.depositMoneyText3]}>จำนวนเงินต้องไม่สูงกว่า {toThousands(bankSetting.MaxBal)} บาท</Text>
			}

			{
				inputIsFouces && (money + '').length <= 0 && <Text style={[styles.depositMoneyText1, styles.depositMoneyText3]}>กรุณากรอกจำนวนเงินฝาก</Text>
			}
		</View>
	}


	depositView() {
		const { depositActive, depositComBank, LbBankAccounts } = this.state
		if (['BQR', 'BQR', 'LBQR'].includes(depositActive) && !(Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0)) return
		return (DepositTipText[depositActive] && DepositTipText[depositActive].length > 0) ? <View style={[styles.mmpTipBox]}>
			<Text style={styles.mmpTipBoxText}>{DepositTipText[depositActive]}</Text>
		</View>
			:
			null
	}

	createLbBankList(item, index) {
		let flag = this.state.depositBankIndex * 1 === index * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: flag ? '#25AAE1' : '#fff' }]} key={index}>
			<Text style={[styles.toreturnModalDropdownListText, { color: !flag ? '#000' : '#fff' }]}>{`${item.BankName}-${item.AccountNumber.slice(-3)}`}</Text>
			<Text>{item.balance}</Text>
		</View>
	}

	createLbBanView(flag) {
		const { depositActive, LbBankAccounts, LbBankAccountsIndex, arrowFlag, LbBanks, LbTransferTypes, balanceInfor, depositingWalletIndex, bankSetting, memberInfor, bonusId, depositingWallet, bonusApplicableSite } = this.state
		const { availableMethods, availableMethodsIndex } = this.state
		return <View>
			<View style={styles.limitLists}>
				<Text style={[styles.limitListsText]}>ธนาคาร</Text>
				{
					Array.isArray(LbBankAccounts)
						?
						(
							LbBankAccounts.length > 0 ? <View style={styles.LBbank}>
								<View style={styles.limitLists}>
									<ModalDropdown
										animated={true}
										options={LbBankAccounts}
										renderRow={this.createLbBankstList.bind(this)}
										onSelect={LbBankAccountsIndex => {
											if (this.state.LbBankAccountsIndex === LbBankAccountsIndex) return
											this.setState({
												LbBankAccountsIndex,
												LBVcbBankTypeIndex: 0,
												LbLastSixNumber: '',
												lbIsShowFgo: false
											}, () => {
												this.setDepositBtnStatus()
											})
										}}
										onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag', true)}
										onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag', false)}
										style={[styles.toreturnModalDropdown]}
										dropdownStyle={[styles.toreturnDropdownStyle, { height: LbBankAccounts.length <= 6 ? LbBankAccounts.length * 32 : 6 * 32 }]}
									>
										<View style={[styles.targetWalletBox]}>
											{
												LbBankAccountsIndex == -999
													?
													<Text style={{ color: '#6B6B6B' }}>Chọn ngân hàng</Text>
													:
													<View style={styles.lbimgIconBox}>
														{
															LbBankIcon[LbBankAccounts[LbBankAccountsIndex].BankCode.toLocaleUpperCase()] && <Image style={[styles.lbimgIcon, styles[`lbimgIcon${LbBankAccounts[LbBankAccountsIndex].BankCode.toLocaleUpperCase()}`]]} source={LbBankIcon[LbBankAccounts[LbBankAccountsIndex].BankCode.toLocaleUpperCase()]} resizeMode='stretch'></Image>
														}

														<Text style={[styles.toreturnModalDropdownText]}>{LbBankAccounts[LbBankAccountsIndex].BankName}_{LbBankAccounts[LbBankAccountsIndex].AccountNo.slice(-4)}</Text>
													</View>
											}
											<ModalDropdownArrow arrowFlag={arrowFlag} />
											<RedStar></RedStar>
										</View>
									</ModalDropdown>
								</View>
							</View>
								:
								this.createBnakCs()
						)
						:
						this.createBankLoadBone()
				}
			</View>

			<TouchableOpacity
				onPress={() => {
					if (Array.isArray(availableMethods) && availableMethods.length && availableMethods[availableMethodsIndex].MethodCode.toLocaleUpperCase() == 'UNIQUEAMT') {
						this.setState({
							isOldSix: true,
							LbLastSixNumber: '',
							//depositBankIndex: -9999,
							offlineDepositDate: '',
							fileBytes: '',
							fileName: '',
							money: '',
							LbLastSixNumber: '',
							offlineDepositDate: '',
							avatarSource: '',
							avatarName: '',
							depositBtnStatus: false
						}, () => {
							this.setDepositBtnStatus()
						})
						return
					}



					//Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0 && 
					if (!(Array.isArray(LbBankAccounts) && Array.isArray(this.state.depositBank) && this.state.depositBank.length)) return
					this.goLbStep2Page(true)


					window.PiwikMenberCode('Deposit​', 'Click', `OldAccount_LocalBank`)


					// if (Array.isArray(availableMethods) && availableMethods.length && availableMethods[availableMethodsIndex] == 'UniqueAmt') {
					// 	window.PiwikMenberCode('Deposit​', 'Click', `OldAccount_LocalBank`)
					// } else {
					// 	window.PiwikMenberCode('Deposit​', 'Click', `OldAccount_LocalBank`)
					// }
				}}
				style={[styles.limitLists, { marginTop: 0 }]}
			>
				<Text
					// onPress={() => {
					// 	// this.setState({
					// 	// 	isOldSix: true
					// 	// })
					// }} 
					style={{ color: '#25AAE1' }}>ฝากเข้าบัญชีธนาคารอื่นๆ <Text
						style={{ color: '#25AAE1', textDecorationLine: 'underline' }}>คลิกที่นี่</Text></Text>
			</TouchableOpacity>

		</View>
	}

	handleViewRef = ref => this.view = ref

	renderPage(item) {
		return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
			<Image
				resizeMode='stretch'
				style={styles.carouselImg}
				source={item.item.img} />
		</TouchableOpacity>
	}

	createisDummyBank(IsDummyBank) {
		return <Modal animationType='fade' transparent={true} visible={IsDummyBank}>
			<View style={[styles.modalContainer, {
				backgroundColor: 'rgba(0, 0, 0, .4)'
			}]}>
				<View style={[styles.modalBox, { borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingVertical: 25 }]}>
					<View style={styles.noBankCircle}>
						<Text style={styles.noBankCircleText}>!</Text>
					</View>

					<Text style={[styles.noBankText1, {
						color: '#000000'
					}]}>การฝากเงินล้มเหลว</Text>
					<Text style={[styles.noBankText2, {
						color: '#4A4A4A'
					}]}>ขออภัย ไม่มีธนาคารให้บริการในขณะนี้ รายการฝากนี้จะถูกยกเลิก กรุณาทำรายการฝากด้วยช่องทางอื่น</Text>

					<TouchableOpacity style={styles.mmoGuideBtn} onPress={() => {
						this.setState({
							IsDummyBank: false
						}, () => {
							Actions.pop()
							this.getDepositList()
						})
					}}>
						<Text style={styles.mmoGuideBtnText}>ทำรายการฝากใหม่</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	}

	createErrorModal(isErrorModal) {
		return <Modal animationType='fade' transparent={true} visible={isErrorModal}>
			<View style={[styles.modalContainer, {
				backgroundColor: 'rgba(0, 0, 0, .4)'
			}]}>
				<View style={[styles.modalBox, { borderRadius: 8, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingVertical: 25 }]}>
					<View style={styles.noBankCircle}>
						<Text style={styles.noBankCircleText}>!</Text>
					</View>

					<Text style={[styles.noBankText1, {
						color: '#000000'
					}]}>การฝากเงินล้มเหลว</Text>
					<Text style={[styles.noBankText2, {
						color: '#4A4A4A'
					}]}>ขออภัย รายการฝากของคุณมีปัญหา กรุณาติดต่อฝ่ายบริการลูกค้า</Text>

					<TouchableOpacity style={styles.mmoGuideBtn} onPress={() => {
						this.setState({
							isErrorModal: false
						})
					}}>
						<Text style={styles.mmoGuideBtnText}> ทำรายการฝากใหม่ </Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	}

	createModalDropdown() {
		let { depositComBank, depositComBankIndex, arrowFlag } = this.state
		return <View style={styles.limitLists}>
			<Text style={[styles.limitListsText]}>ธนาคาร</Text>
			{
				Array.isArray(depositComBank)
					?
					(
						depositComBank.length > 0
							?
							<ModalDropdown
								animated={true}
								options={depositComBank}
								renderRow={this.createModalDropdownList.bind(this)}
								onSelect={depositComBankIndex => {
									if (this.state.depositComBankIndex === depositComBankIndex) return
									this.setState({
										depositComBankIndex,
									}, () => {
										this.setDepositBtnStatus()
									})
								}}
								onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag', true)}
								onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag', false)}
								style={[styles.toreturnModalDropdown]}
								dropdownStyle={[styles.toreturnDropdownStyle, { height: depositComBank.length * 32 }]}
							>
								<View style={[styles.targetWalletBox]}>
									<Text style={[styles.toreturnModalDropdownText, { color: depositComBankIndex < 0 ? '#989797' : '#000' }]}>
										{
											depositComBankIndex < 0 ? 'กรุณาเลือกบัญชี' : depositComBank[depositComBankIndex].Name
										}
									</Text>
									<ModalDropdownArrow arrowFlag={arrowFlag} />
								</View>
								<RedStar></RedStar>
							</ModalDropdown>
							:
							this.createBnakCs()
					)
					:
					this.createBankLoadBone()
			}
		</View>
	}



	createLBModalDropdownList(item, index) {
		const { LbBanksIndex, LbBanks } = this.state
		let flag = LbBanksIndex * 1 === index * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: flag ? '#25AAE1' : '#fff' }]} key={index}>
			<Text style={[styles.toreturnModalDropdownListText, { color: flag ? '#fff' : '#000' }]}>
				{
					item.Name
				}
			</Text>
		</View>
	}

	createLBModalDropdown() {
		let { LbBanks, LbBanksIndex, arrowFlag } = this.state
		return <View style={styles.limitLists}>
			<Text style={[styles.limitListsText]}>ธนาคาร</Text>
			{
				Array.isArray(LbBanks)
					?
					(
						LbBanks.length > 0
							?
							<ModalDropdown
								animated={true}
								options={LbBanks}
								renderRow={this.createLBModalDropdownList.bind(this)}
								onSelect={LbBanksIndex => {
									if (this.state.LbBanksIndex === LbBanksIndex) return
									this.setState({
										LbBanksIndex,
									}, () => {
										this.setDepositBtnStatus()
									})
								}}
								onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag', true)}
								onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag', false)}
								style={[styles.toreturnModalDropdown]}
								dropdownStyle={[styles.toreturnDropdownStyle, { width: width - 40, }]}
							>
								<View style={[styles.targetWalletBox, { width: width - 40 }]}>
									<Text style={[styles.toreturnModalDropdownText, { color: LbBanksIndex < 0 ? '#989797' : '#000' }]}>
										{
											LbBanksIndex < 0 ? 'เลือกธนาคาร' : LbBanks[LbBanksIndex].Name
										}
									</Text>
									<ModalDropdownArrow arrowFlag={arrowFlag} />
								</View>
							</ModalDropdown>
							:
							this.createBnakCs()
					)
					:
					this.createBankLoadBone()
			}
		</View>
	}


	//添加
	addBank() {
		const { depositActive, LbBanks, LbBanksIndex, bankList, addDisalbed, LbUserAccounterNumber, accountHolderName, city, province, branch, banksIndex, checkBox } = this.state
		if (LbBanksIndex < 0) {
			Toast.fail('เลือกธนาคาร')
			return
		}

		if (LbUserAccounterNumber.length < 10) {
			Toast.fail('เลขบัญชีไม่ถูกต้อง')
			return
		}

		let params = {
			accountNumber: LbUserAccounterNumber.trim(),
			accountHolderName: accountHolderName.trim(),
			bankName: LbBanks[LbBanksIndex].Name.trim(),
			city: '',
			province: '',
			branch: '',
			type: 'D',
			isDefault: checkBox
		}

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.MemberBanks, 'POST', params).then(data => {
			Toast.hide()
			if (data.isSuccess == true) {
				Toast.success('เพิ่มบัญชีสำเร็จ​')
				this.setState({
					isFinishAddBankFlag: true
				})
				this.props.getDepositUserBankAction()
				this.setState({
					accountNumber: '',
					city: '',
					province: '',
					branch: '',
					LbBanksIndex: -9999,
					isShowAddBank: false,
					LbUserAccounterNumber: '',
					money: '',
					depositBankIndex: depositActive == 'LB' ? 0 : -9999999
				}, () => {
					this.setDepositBtnStatus()
				})


				// if (this.props.fromPage === 'preferentialPage' || this.props.fromPage === 'homelPage') {
				// 	let money = this.state.moneyMinAccept + ''
				// 	this.setState({
				// 		//	money
				// 	}, () => {
				// 		this.moneyChange(money)
				// 	})
				// }

			} else {
				Toast.fail(data.message, 1.5)
			}
		}).catch(error => {
			Toast.hide()
		})
	}


	createBnakCs() {
		return <TouchableOpacity
			onPress={() => {
				Actions.LiveChat()
			}}
			style={[styles.targetWalletBox, styles.targetWalletBoxCs]}>
			<Text style={{ color: '#fff', fontSize: 12 }}>ขออภัยขณะนี้ไม่มีธนาคารเปิดใช้งาน กรุณาติดต่อฝ่ายบริการ</Text>
		</TouchableOpacity>
	}

	createBankLoadBone() {
		return <View style={[styles.targetWalletBox, styles.targetWalletBoxBone]}>
			<LoadingBone></LoadingBone>
		</View>
	}


	createModalDropdownList(item, index) {
		const { depositComBankIndex } = this.state
		let flag = depositComBankIndex * 1 === index * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: flag ? '#25AAE1' : '#fff' }]} key={index}>
			<Text style={[styles.toreturnModalDropdownListText, { color: flag ? '#fff' : '#000' }]}>{item.Name}</Text>
		</View>
	}

	changeisShowRdDepositModal(isShowRdDepositModal) {
		window.PiwikMenberCode('Deposit', 'Click', `Tutorial_LBExpress`)
		this.setState({
			isShowRdDepositModal
		})
	}

	createBankLimit() {
		const { bankSetting } = this.state
		return <View>
			<Text style={{ color: '#4DABE9', fontSize: 12, marginTop: 0 }}>การแจ้งเตือน</Text>
			<Text style={[styles.depositMoneyText1]}>ฝากเงินขั้นต่ำ {toThousands(bankSetting.MinBal)} บาท สูงสุด {toThousands(bankSetting.MaxBal)} บาทต่อ 1 รายการ</Text>
		</View>
	}

	createDepositTopTip() {
		const { depositingWalletMoney, LbBankAccounts, depositActive } = this.state
		if (depositActive === 'BQR' && !((Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0))) return
		if (!Boolean(depositingWalletMoney)) return
		return Boolean(depositingWalletMoney != '' && Array.isArray(Object.keys(depositingWalletMoney)) && Object.keys(depositingWalletMoney).length > 0) ?
			<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Image
						resizeMode='stretch'
						source={require('../../../images/finance/deposit/depositCom.png')}
						style={[styles.depositCom]} />

					<Text style={{ color: '#4FB9ED', fontSize: 13 }}>บัญชีที่ต้องการ : {depositingWalletMoney.localizedName}</Text>
				</View>

				<Text style={{ color: '#4FB9ED', fontSize: 13 }}>{toThousands(depositingWalletMoney.balance)}</Text>
			</View>
			:
			null
	}


	PostBindReverseDepositAccount(temp) {
		this.setState({
			isShowRdUserBnakModal: false
		})
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PostBindReverseDepositAccount + `bankId=${temp.Code}&`, 'POST').then(data => {
			Toast.hide()
			if (!data.isSuccess) {
				let errors = data.errors
				if (Array.isArray(errors) && errors.length) {
					let errors0 = errors[0]
					let { description, errorCode } = errors0
					this.setState({
						description,
						errorCode,
						isRdBindReverseDepositAccountModal: true
					})
				}
			} else {
				Toast.success('บันทึกสำเร็จ')
				//this.props.getDepositUserBankAction()
				this.depositSelect("RD")
			}
		})
	}

	chnageisRdBindReverseDepositAccountModal(isRdBindReverseDepositAccountModal) {
		this.setState({
			isRdBindReverseDepositAccountModal
		})
	}

	// 后端支持的文件类型='.jpg,.jpeg,.gif,.bmp,.png,.doc,.docx,.pdf'
	// jpg, gif, bmp, png, doc, docx, pdf, heic & heif
	selectPhotoTapped() {
		launchImageLibrary(ImagePickerOption, response => {
			if (response.didCancel) {
				this.setState({
					avatarName: '',
					avatarSource: '',

					fileSize: '',
					fileImgFlag: false
				})
			} else if (response.error) {
				Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
			} else if (response.customButton) {
			}
			let assets = response.assets
			if ((Array.isArray(assets) && assets.length)) {
				let assetsFirst = assets[0]
				this.setState({
					avatarName: assetsFirst.fileName,
					avatarSource: assetsFirst.base64,

					fileSize: assetsFirst.fileSize,
					fileImgFlag: !(['JPG', 'GIF', 'BMP', 'PNG', 'DOC', 'DOCX', 'PDF', 'HEIC ', 'HEIF', 'JPEG'].includes((assetsFirst.fileName.split('.')[assetsFirst.fileName.split('.').length - 1]).toLocaleUpperCase()))
					//fileImgFlag: !(assetsFirst.fileSize <= 1024 * 1024 * 2 && ['JPG', 'GIF', 'BMP', 'PNG', 'DOC', 'DOCX', 'PDF', 'HEIC ', 'HEIF', 'JPEG'].includes((assetsFirst.fileName.split('.')[assetsFirst.fileName.split('.').length - 1]).toLocaleUpperCase()))
				}, () => {
					//this.changeLbDepositBtnStatus()
				})
			} else {
				//Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
			}
		})
	}

	getMmpStore() {
		storage.load({
			key: 'ThbqrFirsrtGuider' + window.userNameDB,
			id: 'ThbqrFirsrtGuider' + window.userNameDB
		}).then(data => {
			this.setState({
				isShowThbqrDepositModal: false
			})
		}).catch(() => {
			this.setState({
				isShowThbqrDepositModal: true
			})
		})
	}

	changeIsShowThbqrDepositModal(isShowThbqrDepositModal) {
		this.setState({
			isShowThbqrDepositModal
		})
		global.storage.save({
			key: 'ThbqrFirsrtGuider' + window.userNameDB,
			id: 'ThbqrFirsrtGuider' + window.userNameDB,
			data: true,
			expires: null
		})
	}


	createAddbankMOdel() {
		const {
			availableMethods,
			arrowFlag1,
			depositBank,
			isFinishAddBankFlag,
			depositBankIndex,

			accountHolderName,
			LbUserAccounterNumber,
			checkBox,
			isShowAddBank,
			IsSingleDeposit,
		} = this.state
		const { bonusApplicableSite } = this.props
		return <View>
			{
				Array.isArray(depositBank) && <View style={styles.limitLists}>
					<Text style={[styles.limitListsText]}>เลขที่บัญชีสมาชิก</Text>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20 }}>
						<ModalDropdown
							animated={true}
							disabled={!(Array.isArray(depositBank) && depositBank.length)}
							options={depositBank}
							renderRow={this.createLbBankList.bind(this)}
							onSelect={depositBankIndex => {
								this.setState({
									depositBankIndex
								}, () => {
									this.setDepositBtnStatus()
								})
							}}
							onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
							onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
							style={[styles.toreturnModalDropdown, {
								width: !(IsSingleDeposit && Array.isArray(depositBank) && depositBank.length > 0) ? width - 20 - 60 - 10 : width - 20
							}]}
							dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: depositBank.length <= 6 ? depositBank.length * 32 : 6 * 32 }]}
						>
							<View style={[styles.targetWalletBox, {
								width: !(IsSingleDeposit && Array.isArray(depositBank) && depositBank.length > 0) ? width - 20 - 60 - 10 : width - 20,
								backgroundColor: window.isBlue ? (depositBank.length > 0 ? '#fff' : '#E6E6E6') : (depositBank.length > 0 ? '#000000' : '#7F7F7F'),
								borderColor: window.isBlue ? (depositBank.length > 0 ? '#F2F2F2' : '#E6E6E6') : (depositBank.length > 0 ? '#26AAE3' : '#7F7F7F')
							}]}>
								<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#6B6B6B' : '#fff', fontSize: 12, width: width - 20 - 60 - 40 }]}>
									{
										depositBankIndex < 0 ? 'เลือกธนาคาร' :
											(
												Array.isArray(depositBank) && depositBank.length > 0 && depositBankIndex >= 0 && (`${depositBank[depositBankIndex].BankName}-${depositBank[depositBankIndex].AccountNumber.slice(-3)}`)
											)
									}

								</Text>
								{
									<ModalDropdownArrow arrowFlag={arrowFlag1} style={styles.modalDropdownArrow} />
								}
							</View>
						</ModalDropdown>


						{
							!(IsSingleDeposit && Array.isArray(depositBank) && depositBank.length > 0) &&
							<TouchableOpacity style={[styles.copyTxt, {
								backgroundColor: !isShowAddBank ? '#59BA6D' : '#a6d7b1'
							}]} onPress={() => {
								// Actions.NewBank({
								// 	bankType: 'D',
								// 	fromPage: 'LbDeposit',
								// 	changeIsFinishAddBankFlag: (flag, bankInfor) => {
								// 		this.changeIsFinishAddBankFlag(flag, bankInfor)
								// 	}
								// })
								this.setState({
									isShowAddBank: true,
									LbBanksIndex: -9999,
									LbUserAccounterNumber: '',
									checkBox: false
								})
							}}>
								<Text style={[styles.bankInfoBtnText]}>เพิ่ม</Text>
							</TouchableOpacity>
						}
					</View>

					{
						availableMethods.length == 2 && isFinishAddBankFlag && <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
							<View style={{ width: 18, height: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderColor: '#1DBD65', marginRight: 5 }}>
								<Text style={{ color: '#1DBD65' }}>✓</Text>
							</View>
							<Text style={{ color: '#000', fontSize: 12 }}>บันทึกข้อมูลบัญชีสำเร็จ</Text>
						</View>
					}
					{
						(IsSingleDeposit && Array.isArray(depositBank) && depositBank.length > 0) &&
						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
							<Text
								onPress={() => {
									Actions.LiveChat()
								}} style={{ color: '#FF0A0A', fontSize: 12 }}>{`ในกรณีที่คุณต้องการเพิ่มบัญชีใหม่ กรุณาติดต่อฝ่ายบริการลูกค้าที่ \n`} <Text style={{ color: '#25AAE1', textDecorationLine: 'underline' }}>ห้องช่วยเหลือสด</Text></Text>
						</View>
					}


				</View>
			}

			{
				isShowAddBank && <View style={{ marginHorizontal: 10 }}>
					<View style={styles.limitLists}>
						<Text style={[styles.limitListsText]}>เพิ่มบัญชี</Text>
						<View style={styles.LBMoneyBox}>
							<TextInput
								editable={false}
								value={getName(accountHolderName)}
								style={[styles.limitListsInput, { width: width - 40, backgroundColor: '#E3E3E3', borderColor: '#E3E3E3' }]} />
						</View>
						<Text style={{ color: '#B1B1B1', fontSize: 12, marginTop: 4 }}>ชื่อผู้ฝากต้องตรงกับบัญชีที่ใช้สำหรับการฝากเงิน</Text>
					</View>

					{
						this.createLBModalDropdown()
					}

					<View style={styles.limitLists}>
						<Text style={[styles.limitListsText]}>บัญชีธนาคาร</Text>
						<View style={styles.LBMoneyBox}>
							<TextInput
								value={LbUserAccounterNumber}
								keyboardType='decimal-pad'
								onChangeText={LbUserAccounterNumber => {
									this.setState({
										LbUserAccounterNumber
									})
								}}
								maxLength={19}
								placeholderTextColor={'#989797'}
								placeholder='เลขบัญชีธนาคารจะต้องมี 10~19 หลัก'
								style={[styles.limitListsInput, { width: width - 40 }]} />
						</View>
					</View>

					<TouchableOpacity
						onPress={() => {
							this.setState({
								checkBox: !checkBox
							})
						}}
						style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
						<View
							style={{
								width: 20, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, height: 20,
								backgroundColor: checkBox ? '#00AEEF' : 'transparent',
								borderColor: checkBox ? '#00AEEF' : '#9B9B9B',
							}}>
							{
								checkBox && <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: -2 }}>✓</Text>
							}
						</View>

						<Text style={{ color: '#707070' }}>จำรายละเอียดธนาคารของฉัน</Text>
					</TouchableOpacity>

					<View style={styles.limitLists}>
						<TouchableOpacity
							style={[styles.LBdepositPageBtn1, { backgroundColor: '#00AEEF', width: width - 40, marginTop: 10 }]}
							onPress={this.addBank.bind(this)}>
							<Text style={styles.depositBtnText}>บันทึก</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.LBdepositPageBtn1, { backgroundColor: '#F4F4F5', width: width - 40, borderColor: '#00AEEF', borderWidth: 1, marginTop: 10 }]}
							onPress={() => {
								this.setState({
									isShowAddBank: false
								})
							}}>
							<Text style={[styles.depositBtnText, { color: '#00AEEF' }]}>ยกเลิก</Text>
						</TouchableOpacity>
					</View>
				</View>
			}
		</View>
	}

	render() {
		const {
			depositList,
			depositActive,
			money,
			cared,
			caredPin,
			balanceInfor,
			bankSetting,
			LbBankAccounts,
			LbBanks,
			LBVcbBankTypeIndex,
			LbTransferTypes,
			depositingWalletIndex,
			depositBtnStatus,
			moneyFlag,
			memberInfor,
			mmpModalFlag,
			mmpInputTop1,
			mmpInputTop2,
			LbLastSixNumber,
			LbBankAccountsIndex,
			lbIsShowFgo,
			bonusId,
			depositingWallet,
			charges,
			depositComBank,
			depositComBankIndex,
			isShowDepositSpamModal,
			availableMethods,
			availableMethodsIndex,
			arrowFlag,
			arrowFlag1,
			isGetvailableMethods,
			depositBank,
			isFinishAddBankFlag,
			depositBankIndex,
			isErrorModal,
			depositingWalletMoney,
			isShowRdDepositModal,
			rbBankAccounts,
			rdBanks,
			isRdChangeBnakTipModal,
			isShowRdUserBnakModal,
			isRdChangeBankModal,
			IsReverseDeposit,
			accountHolderName,
			LbBanksIndex,
			LbUserAccounterNumber,
			checkBox,
			isShowAddBank,
			description,
			errorCode,
			isRdBindReverseDepositAccountModal,
			depositBankRdSettingIndex,
			IsSingleDeposit,
			offlineDepositDate,
			isShowDataPicker,
			fileImgFlag,
			avatarName,
			avatarSource,
			isOldSix,
			isShowThbqrDepositModal,
			isLbUniqueAmt,
			moneyMinAccept,
			isLoading,
			depositListBone
		} = this.state
		const { bonusApplicableSite } = this.props
		return <View style={[styles.viewContainer]}>
			{
				isShowDepositSpamModal &&
				<DepositSpamModal changeDepositSpamModal={this.changeDepositSpamModal.bind(this)}></DepositSpamModal>
			}

			<ThbqrDepositModal
				isShowThbqrDepositModal={isShowThbqrDepositModal && depositActive == 'THBQR'}
				changeIsShowThbqrDepositModal={this.changeIsShowThbqrDepositModal.bind(this)}></ThbqrDepositModal>

			{
				isShowRdDepositModal && <RdDepositModal isShowRdDepositModal={isShowRdDepositModal} changeisShowRdDepositModal={this.changeisShowRdDepositModal.bind(this)}></RdDepositModal>
			}

			{
				this.createErrorModal(isErrorModal)
			}

			<Modal animationType='fade' transparent={true} visible={isLbUniqueAmt}>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { backgroundColor: '#fff', width: width * .85, paddingHorizontal: 15, paddingVertical: 25 }]}>
						<Text style={{ color: '#666666', marginBottom: 15, textAlign: 'center' }}>เพื่อการปรับยอดที่รวดเร็วยิ่งขึ้น เราแนะนำให้ทำการฝากตามยอดที่ระบบระบุเท่านั้น</Text>
						<View>
							<TouchableOpacity style={styles.rdModalBtn} onPress={() => {
								this.setState({
									isLbUniqueAmt: false
								})
							}} >
								<Text style={styles.rdModalBtnText}>ปิด</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<DatePicker
				title=' '
				confirmText='เสร็จสิ้น'
				cancelText='  '
				modal
				locale={'th'}
				mode='datetime'
				open={isShowDataPicker}
				date={offlineDepositDate == '' ? new Date() : new Date(offlineDepositDate)}
				maximumDate={new Date()}
				minimumDate={new Date(moment().subtract(89, 'days').format('YYYY-MM-DD'))}
				onConfirm={date => {
					this.setState({
						isShowDataPicker: false,
						offlineDepositDate: moment(date)
					})
					//this.changeRebateDatePicker()
				}}
				onCancel={() => {
					this.setState({
						isShowDataPicker: false
					})
				}}
			/>

			<RdBindReverseDepositAccountModal
				chnageisRdBindReverseDepositAccountModal={this.chnageisRdBindReverseDepositAccountModal.bind(this)}
				description={description}
				errorCode={errorCode}
				isRdBindReverseDepositAccountModal={isRdBindReverseDepositAccountModal}
			/>

			<Modal animationType='fade' transparent={true} visible={isRdChangeBnakTipModal}>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { backgroundColor: '#fff', width: width * .85, paddingHorizontal: 15, paddingVertical: 25 }]}>
						<Image
							style={{ width: 100, height: 100, marginRight: 10 }}
							resizeMode='stretch'
							source={require('./../../../images/finance/deposit/rdIcon/rdModalImg.png')}></Image>
						<Text style={{ fontSize: 18, marginBottom: 10, marginTop: 5 }}>เปลี่ยนบัญชีธนาคาร</Text>
						<Text style={{ color: '#666666', marginBottom: 15 }}>เรียนสมาชิก หากต้องการเปลี่ยนข้อมูลบัญชีธนาคารในการโอนเงิน กรุณาติดต่อฝ่ายบริการลูกค้าและส่งเอกสารดังนี้</Text>
						<View>
							{
								RdModalText.map((v, i) => {
									return <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
										<View style={{ backgroundColor: '#25AAE1', width: 22, height: 22, borderRadius: 10000, marginRight: 5, alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ color: '#fff' }}>{i + 1}</Text>
										</View>
										<Text style={{ color: '#666666' }}>{v}</Text>
									</View>
								})
							}
						</View>
						<View>
							<TouchableOpacity style={styles.rdModalBtn} onPress={() => {
								this.setState({
									isRdChangeBnakTipModal: false
								})
								Actions.LiveChat()

								window.PiwikMenberCode('CS', 'Click', `CS_ChangeBank_LBExpress`)

							}} >
								<Text style={styles.rdModalBtnText}>ติดต่อฝ่ายบริการ</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.rdModalBtn, { backgroundColor: '#fff' }]} onPress={() => {
								this.setState({
									isRdChangeBnakTipModal: false
								})
							}} >
								<Text style={[styles.rdModalBtnText, { color: '#25AAE1' }]}>ปิด</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal animationType='fade' transparent={true} visible={isShowRdUserBnakModal}>
				<View style={[styles.modalContainer, { justifyContent: 'flex-end' }]}>
					<View style={[styles.modalBox1]}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
							<Text style={{ fontWeight: 'bold', fontSize: 16 }}>เลือกธนาคาร</Text>
							<TouchableOpacity style={[styles.closeBtn]} onPress={() => {
								this.setState({
									isShowRdUserBnakModal: false
								})
							}}>
								<Image
									resizeMode='stretch'
									source={require('./../../../images/finance/deposit/rdIcon/closeBtn.png')}
									style={[styles.closeBtnImg]}
								></Image>
							</TouchableOpacity>
						</View>

						<View style={{ height: height * .52 }}>
							<ScrollView>
								{
									depositBank.map((v, i) => {
										let flag = depositBankRdSettingIndex == i
										return <TouchableOpacity style={styles.bankSelectBox} key={i} onPress={() => {
											this.setState({
												depositBankRdSettingIndex: i
											})
										}}>
											<View style={{ flexDirection: 'row', alignItems: 'center' }}>
												<Image
													resizeMode='stretch'
													source={require('./../../../images/finance/deposit/rdIcon/rdBankIcon.png')}
													style={[styles.closeBtnImg, { marginRight: 5 }]}
												></Image>
												<Text style={{ width: width - 100, color: '#000' }}>
													{v.BankName.length > 18 ? v.BankName.substr(0, 18) + ' ' : v.BankName}
													{v.AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
											</View>
											<View style={{ width: 24, height: 24, borderRadius: 10000, borderWidth: 1, borderColor: '#CECECE', alignItems: 'center', justifyContent: 'center' }}>
												{
													flag && <View style={{ width: 18, height: 18, backgroundColor: '#00AEEF', borderRadius: 1000 }}></View>
												}
											</View>
										</TouchableOpacity>
									})
								}
							</ScrollView>

							<View style={{ marginBottom: 20, }}>
								{
									!(IsSingleDeposit && Array.isArray(depositBank) && depositBank.length > 0) && <TouchableOpacity style={styles.bankSelectBox} onPress={() => {
										this.setState({
											isShowRdUserBnakModal: false
										})
										Actions.RdDeposit({
											bankType: 'D',
											depositSelect: () => {
												this.depositSelect('RD')
											}

										})
									}}>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Image
												resizeMode='stretch'
												source={require('./../../../images/finance/deposit/rdIcon/rdBankIcon1.png')}
												style={[styles.closeBtnImg, { marginRight: 5 }]}
											></Image>
											<Text style={{ width: width - 100 }}>เพิ่มบัญชีธนาคาร</Text>
										</View>
										<View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
											<Text style={{ fontSize: 20, fontWeight: 'bold', fontSize: 20, color: '#00AEEF' }}>+</Text>
										</View>
									</TouchableOpacity>
								}


								<TouchableOpacity
									onPress={() => {
										this.PostBindReverseDepositAccount(depositBank[depositBankRdSettingIndex])
										window.PiwikMenberCode('Deposit Nav', 'Click', `SaveBank_LBExpress`)
									}}
									style={{ width: width - 20, height: 40, backgroundColor: '#00AEEF', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
									<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>บันทึก</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>


			<Modal animationType='fade' transparent={true} visible={isRdChangeBankModal}>
				<View style={[styles.modalContainer, { alignItems: 'center', justifyContent: 'center', }]}>
					<View style={[styles.modalBox11, {}]}>
						<Image
							resizeMode='stretch'
							source={require('./../../../images/finance/deposit/rdIcon/rdAddBankErr1.png')}
							style={styles.rdAddBankErr}
						></Image>

						<Text style={{ fontSize: 18, marginVertical: 10, color: '#000' }}>ยืนยันการเปลี่ยนบัญชีธนาคาร</Text>
						<Text style={{ textAlign: 'center', marginBottom: 15, color: '#666666', paddingHorizontal: 5 }}>การเปลี่ยนบัญชีจะมีผลต่อบัญชีที่ใช้ในการฝาก คุณต้องใช้ธนาคารที่เปลี่ยนในการฝากเงินเท่านั้น</Text>

						<View>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										isRdChangeBankModal: false,
										isShowRdUserBnakModal: true,
										depositBankRdSettingIndex: 0
									})
								}}
								style={[styles.closeBtn1, { backgroundColor: '#25AAE1', marginBottom: 15 }]}>
								<Text style={[styles.closeBtnText1, { color: '#fff' }]}>ยืนยันเปลี่ยนบัญชี</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									this.setState({
										isRdChangeBankModal: false
									})
								}}
								style={styles.closeBtn1}>
								<Text style={styles.closeBtnText1}>ยกเลิก</Text>
							</TouchableOpacity>
						</View>

					</View>
				</View>
			</Modal>




			<KeyboardAwareScrollView>
				{/* 钱包选择 */}
				<View style={[styles.depositSelectBox, { backgroundColor: window.isBlue ? '#E5E6E8' : '#212121' }]}>
					{
						(Array.isArray(depositList) && depositList.length > 0)
							?
							depositList.map((item, index) => {
								let code = (item.code || '').toLocaleUpperCase()
								let flag = depositActive === code
								let depositBorderArr = Array.from({ length: 5 }, (v, i) => 5 * i + 4)
								let depositBorderFlag = !depositBorderArr.includes(index * 1)
								return <TouchableOpacity
									key={index}
									onPress={this.depositSelect.bind(this, code, true)}
									style={[styles.depositListBox, {
										backgroundColor: window.isBlue ? (flag ? '#00AEEF' : '#fff') : (flag ? '#00CEFF' : '#212121'),
										borderColor: window.isBlue ? (flag ? '#00AEEF' : '#fff') : (flag ? '#00CEFF' : '#fff'),
										marginRight: depositBorderFlag ? (
											(width - 20 - (((width - 20) / 5.3) * 5)) / 4
										) : 0
									}]}
								>
									<Image resizeMode='stretch' source={window.isBlue ? (flag ? DepositActiveImg[code] : DepositImg[code]) : DepositActiveImg[code]} style={[styles.depostListImg, styles[`depostListImg${code}`]]} />
									<Text style={[styles.depostListName, styles[`depostListName${code}`], { color: window.isBlue ? (flag ? '#fff' : '#2C2C2C') : '#fff' }]}>{item.name}</Text>
									{
										(item.isFast || (item.isFast && item.isNew)) ?
											<View style={styles.depositIcon}>
												<Text style={styles.depositIconText}>FAST</Text>
											</View>
											:
											item.isNew && <View style={styles.depositIcon}>
												<Text style={styles.depositIconText}>NEW</Text>
											</View>
									}
								</TouchableOpacity>

							})
							:
							(
								depositListBone.map((item, index) => {
									let depositBorderArr = Array.from({ length: 5 }, (v, i) => 5 * i + 4)
									let depositBorderFlag = !depositBorderArr.includes(index * 1)
									return <View
										key={index}
										style={[styles.depositListBox, {
											marginRight: depositBorderFlag ? (
												(width - 20 - (((width - 20) / 5.3) * 5)) / 4
											) : 0,
											borderWidth: 1,
											borderColor: '#e0e0e0',
											overflow: 'hidden',
											backgroundColor: '#e0e0e0'
										}]}
									>
										<LoadingBone></LoadingBone>
									</View>
								})
							)
					}
				</View>


				<AnimatableView ref={this.handleViewRef} style={styles.depositContainer}>
					{
						this.createDepositTopTip()
					}


					{
						this.depositView()
					}

					{
						['RD'].includes(depositActive) && <View>
							{
								!(Array.isArray(rbBankAccounts) && rbBankAccounts.length > 0) ? <View style={styles.rdNoBankBox}>
									<Image
										style={styles.rdBankNone}
										resizeMode='stretch'
										source={require('./../../../images/finance/deposit/rdIcon/rdBankNone.png')}></Image>
									<Text style={styles.rdNoBankBoxTetx1}>
										ขณะนี้ธนาคารไม่สามารถให้บริการได้ กรุณาฝากช่องทางอื่นหรือติดต่อ <Text
											onPress={() => {
												Actions.LiveChat()
											}}
											style={styles.rdNoBankBoxTetx2}>ฝ่ายบริการลูกค้า</Text> เพื่อให้ความช่วยเหลือ
									</Text>
								</View>
									:
									(
										Array.isArray(depositBank) && depositBank.length > 0
											?
											<View>
												{
													!IsReverseDeposit && <View style={[styles.rdNoBankBox]}>
														<Image
															style={[styles.rdBankNone]}
															resizeMode='stretch'
															source={require('./../../../images/finance/deposit/rdIcon/rdBankNone1.png')}></Image>
														<Text style={styles.rdbankAdd1}>เลือกบัญชีธนาคาร</Text>
														<Text style={[styles.rdbankAdd2, { color: '#777777' }]}>
															กรุณายืนยันบัญชีธนาคารของคุณสำหรับการฝากเงิน แบบฝากด่วน กรุณาใช้บัญชีที่ผูกในการโอนเงินเท่านั้น เพื่อป้องกันธุรกรรมถูกยกเลิกหรือยอดเงินสูญหาย
														</Text>
													</View>
												}

												{
													IsReverseDeposit && <View style={{ flexDirection: 'row', marginBottom: 10, backgroundColor: '#D9F6FF', borderRadius: 6, padding: 5 }}>
														<View style={{ width: 15, height: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 10000, backgroundColor: '#00A8E5', marginRight: 5 }}>
															<Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>!</Text>
														</View>
														<Text style={{ color: '#2C2C2C', fontSize: 12 }}>{`เนื่องจากบัญชีธนาคารอาจมีการเปลี่ยนแปลง\nโปรดตรวจสอบบัญชีธนาคารก่อนการโอนเงินทุกครั้ง`}</Text>
													</View>
												}

												<View style={[styles.limitLists, {}]}>
													<Text style={styles.rdBankLimitText}><RedStar></RedStar> เลขที่บัญชีสมาชิก</Text>
													<View style={[styles.targetWalletBox, {
														backgroundColor: IsSingleDeposit ? '#D9D9D9' : '#fff',
														borderColor: IsSingleDeposit ? '#D9D9D9' : '#fff',
													}]}>
														<View style={{ flexDirection: 'row', alignItems: 'center' }}>
															<Image
																resizeMode='stretch'
																source={require('./../../../images/finance/deposit/rdIcon/rdBankIcon.png')}
																style={[styles.closeBtnImg, { marginRight: 5 }]}
															></Image>
															<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#323232' : '#fff', width: width - 120 }]}>
																{
																	Boolean(depositBank[depositBankIndex].BankName && depositBank[depositBankIndex].BankName.length > 18) ? depositBank[depositBankIndex].BankName.substr(0, 18) + ' ' : depositBank[depositBankIndex].BankName
																}
																{

																}
																{
																	depositBank[depositBankIndex].AccountNumber.replace(/^(.).*(...)$/, "******$2")
																}
															</Text>
														</View>
														{
															// change
														}
														{
															(depositBank.length > 1 || !IsSingleDeposit) &&
															<TouchableOpacity onPress={() => {
																// if (depositBank.length > 1) {
																this.setState({
																	isRdChangeBankModal: true
																})
																// } else {
																// this.setState({
																// 	isShowRdUserBnakModal: true,
																// 	depositBankRdSettingIndex: 0
																// })
																//}

															}}>

																<Text style={{ color: '#00AEEF', fontSize: 13 }}>เปลี่ยน</Text>
															</TouchableOpacity>
														}
														{
															depositBank.length == 1 && IsSingleDeposit && <Image resizeMode='stretch'
																source={require('./../../../images/finance/deposit/rdIcon/rdright.png')}
																style={[styles.closeBtnImg]}></Image>
														}
													</View>
												</View>

												{
													Array.isArray(depositBank) && depositBank.length == 1 && !depositBank.find(v => v.IsReverseDeposit) &&
													<View style={{ marginTop: 0 }}>
														<Text>กรณีที่คุณต้องการเพิ่มบัญชีใหม่ กรุณาติดต่อ ฝ่ายบริการลูกค้า <Text style={{ color: '#00AEEF' }} onPress={() => {
															Actions.LiveChat()
														}}>ที่ห้องช่วยเหลือสด</Text></Text>
														<TouchableOpacity
															style={[styles.LBdepositPageBtn1, { backgroundColor: '#00AEEF', marginTop: 20 }]}
															onPress={() => {
																this.PostBindReverseDepositAccount(depositBank[0])


																window.PiwikMenberCode('Deposit', 'Click', `ViewAccount_LBExpress`)
															}}>
															<Text style={styles.depositBtnText}>ถัดไป</Text>
														</TouchableOpacity>
													</View>
												}

												{
													IsReverseDeposit && <View>
														<View style={{ flexDirection: 'row', marginVertical: 10 }}>
															<Image resizeMode='stretch'
																source={require('./../../../images/finance/deposit/rdIcon/rdyellow.png')}
																style={[styles.closeBtnImg]}></Image>
															{
																IsSingleDeposit
																	?
																	<Text style={{ color: '#D89906', fontSize: 12 }}>{`ตรวจสอบให้แน่ใจว่าคุณฝากเงินจากบัญชีธนาคารนี้\nเท่านั้นป้องกันยอดเงินสูญหาย หากต้องการเปลี่ยนธนาคาร\n`}
																		<Text onPress={() => {
																			this.setState({
																				isRdChangeBnakTipModal: true
																			})
																		}} style={{ textDecorationLine: 'underline' }}>ตรวจสอบข้อมูลที่นี่</Text>
																	</Text>
																	:
																	<Text style={{ color: '#D89906', fontSize: 12, width: width - 50 }}>เพื่อป้องกันยอดเงินสูญหาย โปรดยืนยันบัญชีที่จะใช้ก่อนการโอนเงิน ระบบจะตรวจสอบเฉพาะบัญชีที่เลือกและมีการยืนยันก่อนการโอนทุกครั้ง</Text>
															}
														</View>



														<View>
															<Text style={styles.rdBankLimitText}><RedStar></RedStar> ธนาคาร Fun88</Text>
															<View style={{ backgroundColor: '#fff', borderRadius: 4, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
																<Image
																	style={{ width: 25, height: 25, marginRight: 10 }}
																	resizeMode='stretch'
																	source={require('./../../../images/finance/deposit/rdIcon/rdBankLimit.png')}></Image>
																<Text style={{ color: '#000000', fontSize: 13, width: width - 20 - 20 - 25 - 10 }}>ขั้นต่ำการฝากเงิน <Text style={{ color: '#25AAE1' }}>{toThousands(bankSetting.MinBal)} บาท สูงสุด {toThousands(bankSetting.MaxBal)} บาท</Text> ต่อรายการ</Text>
															</View>
														</View>



														{
															Array.isArray(rbBankAccounts) && rbBankAccounts.length > 0 && rbBankAccounts.map((v, i) => {
																let BankCode = v.BankCode
																return <ImageBackground
																	resizeMode='stretch'
																	source={RDImgIocn[BankCode].img2}
																	key={i}
																	style={styles.RdBankBg}>
																	<View style={styles.rdBankNameBox}>
																		<Image
																			style={styles.rdBankIcon}
																			resizeMode='stretch'
																			source={RDImgIocn[BankCode].img1}></Image>
																		<Text style={styles.rdBankName}>{v.BankName.toLocaleUpperCase()}</Text>
																	</View>
																	<Text style={styles.rdBankUserNUm}>{v.AccountHolderName.toLocaleUpperCase()}</Text>
																	<Text style={styles.rdBnakNum}>{v.AccountNo}</Text>
																	<TouchableOpacity style={styles.rdCopyBox} onPress={this.copyTXT.bind(this, v.AccountNo)}>
																		<Image style={styles.rdBankCopy}
																			resizeMode='stretch'
																			source={require('./../../../images/finance/deposit/rdIcon/Rdconpy.png')}></Image>
																		<Text style={styles.rdCopyBoxText}>คัดลอกหมายเลขบัญชี</Text>
																	</TouchableOpacity>
																</ImageBackground>
															})
														}
													</View>
												}
											</View>
											:
											<View style={styles.rdNoBankBox}>
												<Image
													style={styles.rdbankAdd}
													resizeMode='stretch'
													source={require('./../../../images/finance/deposit/rdIcon/rdbankAdd.png')}></Image>
												<Text style={styles.rdbankAdd1}>เพิ่มบัญชีธนาคาร</Text>
												<Text style={styles.rdbankAdd2}>กรุณาเพิ่มบัญชีธนาคารก่อนการฝากเงินแบบฝากด่วน หากเพิ่มแล้วจะไม่สามารถแก้ไขข้อมูลได้ กรุณาตรวจสอบให้แน่ใจว่าข้อมูลถูกต้อง เพื่อป้องกันธุรกรรมถูกยกเลิกหรือยอดเงินสูญหาย</Text>
												<TouchableOpacity style={styles.rdAddBank} onPress={() => {
													Actions.RdDeposit({
														bankType: 'D'
													})
												}}>
													<Text style={styles.rdAddBankText}>เพิ่มบัญชีธนาคาร</Text>
												</TouchableOpacity>
											</View>
									)
							}

							{
								(Array.isArray(rbBankAccounts) && rbBankAccounts.length > 0) && <View style={[styles.rdNoBankBox, { marginTop: 20 }]}>
									<TouchableOpacity style={styles.rdnoteBox} onPress={this.changeisShowRdDepositModal.bind(this, true)}>
										<Image
											style={styles.rdnote}
											resizeMode='stretch'
											source={require('./../../../images/finance/deposit/rdIcon/rdnote.png')}></Image>
										<Text style={styles.rdnoteBox1}>ขั้นตอนการฝาก</Text>
									</TouchableOpacity>
								</View>
							}
						</View>
					}


					{
						['THBQR'].includes(depositActive) && <View>
							{
								this.moneyInput()
							}


							<TouchableOpacity style={styles.depositTipBox} onPress={() => {
								Actions.THBQRBankList()
							}}>
								<Text style={styles.depositTipBoxText}>รายชื่อธนาคารที่สามารถฝากเงิน QR Code ได้</Text>
							</TouchableOpacity>

							<View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image style={{ width: 15, height: 15, margin: 3 }} source={require('../../../images/finance/deposit/depositspa.png')}></Image>
									<Text style={styles.depositTipBoxText1}>QR ฝากเงินนี้ใช้สแกนได้เพียงครั้งเดียวเท่านั้น</Text>
								</View>
								<Text style={styles.depositTipBoxText1}>รายการจะปรับภายใน 10 นาทีหลังจากโอนสำเร็จ</Text>
							</View>
						</View>
					}


					{
						['TMW'].includes(depositActive) && <View>
							{
								this.moneyInput()
							}

							<View>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image style={{ width: 15, height: 15, margin: 3 }} source={require('../../../images/finance/deposit/depositspa.png')}></Image>
									<Text style={styles.depositTipBoxText1}>คำเตือน : QR Code สามารถใช้ได้เพียง 1 ครั้งเท่านั้น ไม่สามารถใช้ซ้ำได้</Text>
								</View>
							</View>
						</View>
					}


					{
						['EZP'].includes(depositActive) && <View>

							{
								(Array.isArray(availableMethods) && availableMethods.length > 0) &&
								<View style={{ marginBottom: 0 }}>
									<Text style={[styles.limitListsText]}>เลือกช่องทาง</Text>
									<View style={styles.depositBankList}>
										{
											availableMethods.map((v, i) => {
												let flag = i === availableMethodsIndex
												let methodCode = v.MethodCode.toLocaleUpperCase()
												let methodType = v.MethodType
												return <TouchableOpacity
													onPress={() => {
														this.setState({
															availableMethodsIndex: i
														}, () => {
															i !== availableMethodsIndex && this.getpaymentSettings(i * 1)
														})
													}}
													style={[
														styles.availableMethodsBox,
														{
															backgroundColor: flag ? '#25AAE1' : '#ffffff'
														}
													]}
													key={i}>

													<Text style={[
														styles.availableMethodsText,
														{
															color: !flag ? '#000000' : '#FFFFFF'
														}
													]}>{methodType}</Text>
													{
														(v.isFast || (v.isFast && v.isNew)) ?
															<View style={styles.depositIcon}>
																<Text style={styles.depositIconText}>FAST</Text>
															</View>
															:
															v.isNew && <View style={styles.depositIcon}>
																<Text style={styles.depositIconText}>NEW</Text>
															</View>
													}
												</TouchableOpacity>
											})
										}
									</View>
								</View>
							}

							{
								this.moneyInput(true)
							}


							{
								this.createModalDropdown()
							}

							{
								this.createBankLimit()
							}
						</View>
					}


					{
						['BC'].includes(depositActive) && <View>
							{
								this.moneyInput(true)
							}


							{
								this.createModalDropdown()
							}

							{
								this.createBankLimit()
							}
						</View>
					}


					{/* 充值卡充值 */}
					{
						depositActive == 'CC' && <View>
							{
								this.moneyInput(true)
							}

							<View style={styles.limitLists}>
								<Text style={[styles.limitListsText]}>หมายเลขบัตรเงินสด</Text>
								<View style={styles.LBMoneyBox}>
									<TextInput
										value={cared}
										keyboardType='number-pad'
										onChangeText={value => {
											let cared = GetOnlyNumReg(value)
											this.caredChange(cared)
										}}
										maxLength={16}
										style={[styles.limitListsInput]} />
									<RedStar></RedStar>
								</View>
							</View>

							<View style={styles.limitLists}>
								<Text style={[styles.limitListsText]}>รหัสบัตรเงินสด</Text>
								<View style={styles.LBMoneyBox}>
									<TextInput
										value={caredPin}
										secureTextEntry={true}
										onChangeText={value => { this.caredPinChange(value) }}
										maxLength={10}
										style={[styles.limitListsInput]} />
									<RedStar></RedStar>
								</View>
							</View>

							{
								this.createBankLimit()
							}
						</View>
					}


					{
						depositActive === 'LINE' && <View>
							<Text style={styles.lineTipText1}>แจ้งเตือน</Text>
							<Text style={styles.moneyTip}>ฝากเงินขั้นต่ำ 200 บาท สูงสุด 100,000 บาท ต่อ 1 รายการ</Text>
							<View style={styles.lineBox}>
								<Image
									source={require('./../../../images/finance/deposit/lineIcon/lineIcon1.png')}
									resizeMode='stretch'
									style={styles.lineImg1}></Image>
								<View>
									<Text style={styles.lineTipText1}>ฝากเงินผ่านไลน์นางฟ้า</Text>
									<Text style={styles.lineTipText}>1.ขอรับเลขที่บัญชีทาง Line ID: @funangel</Text>
									<Text style={styles.lineTipText}>2.แจ้งยอดฝากเงิน</Text>
									<Text style={styles.lineTipText}>3.รอทีมงานปรับยอดเงิน 5 - 15 นาที 4.ร่วมสนุกกับทาง Fun88 ได้ทันที</Text>
								</View>
							</View>
							{
								LineIcon.map((v, i) => <View key={i} style={styles.lineBox}>
									<View style={styles.lineTextBox}>
										<Text style={styles.lineText}>{v.text}</Text>
									</View>
									<Image source={v.img} resizeMode='stretch' style={styles.lineImg}></Image>
								</View>)
							}
						</View>
					}

					{
						// 	LbBankAccounts: [...BankAccounts], // 公司收款银行
						// LbBanks: bankResult.Banks, // 个人新增银行
					}


					{
						depositActive === 'BQR' && <View>
							{
								(Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0) ?
									<View>
										<View style={styles.limitLists}>
											<Text style={[styles.limitListsText]}>ชื่อ-นามสกุล</Text>
											<View style={styles.LBMoneyBox}>
												<TextInput
													editable={false}
													value={getName(accountHolderName)}
													style={[styles.limitListsInput, { width: width - 20, backgroundColor: '#E3E3E3', borderColor: '#E3E3E3' }]} />
												<RedStar></RedStar>
											</View>
										</View>


										{
											Array.isArray(depositBank) && <View style={styles.limitLists}>
												<Text style={[styles.limitListsText]}>เลขที่บัญชีสมาชิก</Text>
												<View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20 }}>
													<ModalDropdown
														animated={true}
														disabled={!(Array.isArray(depositBank) && depositBank.length)}
														options={depositBank}
														renderRow={this.createLbBankList.bind(this)}
														onSelect={depositBankIndex => {
															this.setState({
																depositBankIndex
															}, () => {
																this.setDepositBtnStatus()
															})
														}}
														onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
														onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
														style={[styles.toreturnModalDropdown, {
															width: (
																((Array.isArray(depositBank) && depositBank.length == 0))
															) ? width - 20 - 60 - 10 : width - 20
														}]}
														dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: depositBank.length >= 6 ? 6 * 32 : depositBank.length * 32 }]}
													>
														<View style={[styles.targetWalletBox, {
															width: (
																(Array.isArray(depositBank) && depositBank.length == 0)
															) ? width - 20 - 60 - 10 : width - 20,
															backgroundColor: window.isBlue ? (depositBank.length > 0 ? '#fff' : '#E6E6E6') : (depositBank.length > 0 ? '#000000' : '#7F7F7F'),
															borderColor: window.isBlue ? (depositBank.length > 0 ? '#F2F2F2' : '#E6E6E6') : (depositBank.length > 0 ? '#26AAE3' : '#7F7F7F')
														}]}>
															<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#6B6B6B' : '#fff', fontSize: 12, width: width - 20 - 60 - 10 }]}>
																{
																	depositBankIndex < 0 ? 'เลือกธนาคาร' : (`${depositBank[depositBankIndex].BankName}-${depositBank[depositBankIndex].AccountNumber.slice(-3)}`)
																}

															</Text>
															{
																<ModalDropdownArrow arrowFlag={arrowFlag1} style={styles.modalDropdownArrow} />
															}
															<RedStar></RedStar>
														</View>
													</ModalDropdown>


													{
														((Array.isArray(depositBank) && depositBank.length == 0)) && <TouchableOpacity style={[styles.copyTxt, {
															backgroundColor: !isShowAddBank ? '#59BA6D' : '#a6d7b1'
														}]} onPress={() => {
															this.setState({
																isShowAddBank: true,
																LbBanksIndex: -9999,
															})
														}}>
															<Text style={[styles.bankInfoBtnText]}>เพิ่ม</Text>
														</TouchableOpacity>
													}
												</View>

												{
													availableMethods.length == 2 && isFinishAddBankFlag && <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
														<View style={{ width: 18, height: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 100, borderColor: '#1DBD65', marginRight: 5 }}>
															<Text style={{ color: '#1DBD65' }}>✓</Text>
														</View>
														<Text style={{ color: '#000', fontSize: 12 }}>บันทึกข้อมูลบัญชีสำเร็จ</Text>
													</View>
												}
												{
													availableMethods.length != 2 && Array.isArray(depositBank) && depositBank.length == 1 && <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
														<Text
															onPress={() => {
																Actions.LiveChat()
															}} style={{ color: '#FF0A0A', fontSize: 12 }}>{`ในกรณีที่คุณต้องการเพิ่มบัญชีใหม่ กรุณาติดต่อฝ่ายบริการลูกค้าที่ \n`} <Text style={{ color: '#25AAE1', textDecorationLine: 'underline' }}>ห้องช่วยเหลือสด</Text></Text>
													</View>
												}
											</View>
										}

										{
											isShowAddBank && <View style={{ marginHorizontal: 10 }}>
												<View style={styles.limitLists}>
													<Text style={[styles.limitListsText]}>ชื่อ-นามสกุล</Text>
													<View style={styles.LBMoneyBox}>
														<TextInput
															editable={false}
															value={getName(accountHolderName)}
															style={[styles.limitListsInput, { width: width - 40, backgroundColor: '#E3E3E3', borderColor: '#E3E3E3' }]} />
													</View>
													<Text style={{ color: '#B1B1B1', fontSize: 12, marginTop: 4 }}>ชื่อผู้ฝากต้องตรงกับบัญชีที่ใช้สำหรับการฝากเงิน</Text>
												</View>

												{
													this.createLBModalDropdown()
												}

												<View style={styles.limitLists}>
													<Text style={[styles.limitListsText]}>บัญชีธนาคาร</Text>
													<View style={styles.LBMoneyBox}>
														<TextInput
															value={LbUserAccounterNumber}
															keyboardType='decimal-pad'
															onChangeText={LbUserAccounterNumber => {
																this.setState({
																	LbUserAccounterNumber
																})
															}}
															maxLength={19}
															placeholderTextColor={'#989797'}
															placeholder='เลขบัญชีธนาคารจะต้องมี 10~19 หลัก'
															style={[styles.limitListsInput, { width: width - 40 }]} />
													</View>
												</View>

												<TouchableOpacity
													onPress={() => {
														this.setState({
															checkBox: !checkBox
														})
													}}
													style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
													<View
														style={{
															width: 20, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, height: 20,
															backgroundColor: checkBox ? '#00AEEF' : 'transparent',
															borderColor: checkBox ? '#00AEEF' : '#9B9B9B',
														}}>
														{
															checkBox && <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: -2 }}>✓</Text>
														}
													</View>

													<Text style={{ color: '#707070' }}>จำรายละเอียดธนาคารของฉัน</Text>
												</TouchableOpacity>

												<View style={styles.limitLists}>
													<TouchableOpacity
														style={[styles.LBdepositPageBtn1, { backgroundColor: '#00AEEF', width: width - 40, marginTop: 10 }]}
														onPress={this.addBank.bind(this)}>
														<Text style={styles.depositBtnText}>บันทึก</Text>
													</TouchableOpacity>

													<TouchableOpacity
														style={[styles.LBdepositPageBtn1, { backgroundColor: '#F4F4F5', width: width - 40, borderColor: '#00AEEF', borderWidth: 1, marginTop: 10 }]}
														onPress={() => {
															this.setState({
																isShowAddBank: false
															})
														}}>
														<Text style={[styles.depositBtnText, { color: '#00AEEF' }]}>ยกเลิก</Text>
													</TouchableOpacity>
												</View>
											</View>
										}

										{
											!isShowAddBank && this.moneyInput()
										}
									</View>
									:
									<View>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Image style={{ width: 15, height: 15, margin: 3 }} source={require('./../../../images/finance/deposit/depositsp1.png')}></Image>
											<Text style={styles.depositTipBoxText1}>ขณะนี้ธนาคารไม่สามารถให้บริการได้ กรุณาฝากช่องทางอื่นหรือ </Text>
										</View>
										<Text style={[styles.depositTipBoxText1, { marginLeft: 20, textDecorationLine: 'underline' }]} onPress={() => {
											Actions.LiveChat()
										}}>ติดต่อฝ่ายบริการลูกค้า</Text>
									</View>
							}
						</View>
					}

					{
						depositActive === 'LB' && <View>
							<View style={styles.lbStepContainers}>
								<View style={styles.lbStepBox}>
									<Text style={styles.lbStepText}>ขั้นตอนที่</Text>
									<View style={[styles.lbStepCircle]}>
										<Text style={[styles.lbStepCircleText]}>1</Text>
									</View>
								</View>
								<View>
									<Text style={[styles.lbStepText, { color: 'transparent' }]}>ขั้นตอนที่</Text>
									<View style={styles.stepLine}></View>

								</View>
								<View style={styles.lbStepBox}>
									<Text style={styles.lbStepText}>ขั้นตอนที่</Text>
									<View style={[styles.lbStepCircle, { backgroundColor: 'transparent' }]}>
										<Text style={[styles.lbStepCircleText, { color: '#4DABE9' }]}>2</Text>
									</View>
								</View>
							</View>


							{
								Array.isArray(availableMethods) && availableMethods.length > 0 && <View style={{ alignItems: 'center' }}>
									<View style={styles.LbSpecialListBox}>
										{
											availableMethods.map((v, i) => {
												let flag = availableMethodsIndex == i
												return <TouchableOpacity style={styles.availableMethods} key={i} onPress={() => {
													if (i == availableMethodsIndex) return
													this.getPaymentLbSettings(i)

													if (v.MethodCode == "NormalAmt") {
														window.PiwikMenberCode('Deposit​', 'Click', `Normal_LocalBank`)
													}

													if (v.MethodCode == "UniqueAmt") {
														window.PiwikMenberCode('Deposit​', 'Click', `Fast_LocalBank`)
													}

												}}>
													<View style={[styles.LbSpecialListCircleBox, {
														borderColor: flag ? '#25AAE1' : '#DCDCDC'
													}]}>
														{
															flag && <View style={styles.LbSpecialListCircle}></View>
														}
													</View>
													<Text style={{ color: flag ? '#323232' : '#000000' }}>{v.MethodType}</Text>
												</TouchableOpacity>
											})
										}
									</View>
								</View>
							}

							{
								this.moneyInput()
							}


							{
								this.createAddbankMOdel()
							}




							{
								!isOldSix && this.createLbBanView(true)
							}


							<Modal animationType='fade' transparent={true} visible={isOldSix}>
								<View style={[styles.modalContainer, { backgroundColor: '#F4F4F5', paddingHorizontal: 10 }]}>


									<View style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
										width,
										marginBottom: 15,
										backgroundColor: '#06ADEF',
										paddingBottom: 10,
										alignItems: 'center',
										paddingTop: gameHeaderPaddingTop
									}}>
										<TouchableOpacity style={styles.homeLeftWrap} hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }} onPress={() => {
											this.setState({
												isOldSix: false,
												money: '',
												LbLastSixNumber: '',
												offlineDepositDate: '',
												avatarSource: '',
												avatarName: '',
												depositBtnStatus: false

											})
										}}>
											<Image resizeMode='stretch' source={require('./../../../images/tabberIcon/leftIcon.png')} style={styles.leftIcon}></Image>
										</TouchableOpacity>

										<Text style={{
											color: '#fff',
											fontSize: 16,
											fontWeight: 'bold'
										}}>ธนาคาร</Text>

										<TouchableOpacity style={styles.homeCsWrap} onPress={() => {
											Actions.LiveChat()
											window.PiwikMenberCode('CS_topnav')
										}}>
											<Image resizeMode='stretch' source={Boolean(this.props.liveChatData) ? require('./../../../images/tabberIcon/ic_online_cs.gif') : require('./../../../images/tabberIcon/whiteCS.png')} style={styles.homeCSImg}></Image>
										</TouchableOpacity>
									</View>


									{
										isLoading &&
										<View style={styles.registIpkLoadFlag}>
											<View style={styles.registIpkLoadFlag1}>
												<ActivityIndicator size='large' color='#fff' />
												<Text style={{ color: '#fff' }}>กำลังโหลดข้อมูล...</Text>
											</View>
										</View>
									}
									<KeyboardAwareScrollView>

										{
											this.createDepositTopTip()
										}



										<View style={styles.lbStepContainers}>
											<View style={styles.lbStepBox}>
												<Text style={styles.lbStepText}>ขั้นตอนที่</Text>
												<View style={[styles.lbStepCircle]}>
													<Text style={[styles.lbStepCircleText]}>✓</Text>
												</View>
											</View>
											<View>
												<Text style={[styles.lbStepText, { color: 'transparent' }]}>ขั้นตอนที่</Text>
												<View style={styles.stepLine}></View>

											</View>
											<View style={styles.lbStepBox}>
												<Text style={styles.lbStepText}>ขั้นตอนที่</Text>
												<View style={[styles.lbStepCircle, { backgroundColor: 'transparent' }]}>
													<Text style={[styles.lbStepCircleText, { color: '#4DABE9' }]}>2</Text>
												</View>
											</View>
										</View>


										{
											this.moneyInput()
										}

										{
											this.createAddbankMOdel()
										}



										<View>
											<View style={styles.limitLists}>
												<Text style={[styles.limitListsText]}>เลขที่บัญชีเก่า : 6 หลักสุดท้าย</Text>
												<View style={styles.LBMoneyBox}>
													<TextInput
														value={LbLastSixNumber}
														keyboardType={'number-pad'}
														onChangeText={LbLastSixNumber => {
															this.setState({
																LbLastSixNumber
															}, () => {
																this.setDepositBtnStatus()
															})
														}}
														maxLength={6}
														placeholderTextColor={'#989797'}
														style={[styles.limitListsInput]} />
												</View>
											</View>


											<View style={styles.limitLists}>
												<Text style={[styles.limitListsText]}>วันและเวลา</Text>
												<TouchableOpacity onPress={() => {
													this.setState({
														isShowDataPicker: true
													})
												}} style={[{
													flexDirection: 'row',
													justifyContent: 'space-between',
													alignItems: 'center',
													width: width - 20,
												}]}>
													<View style={[styles.dataBox, {
														width: (width - 20 - 20) * .4
													}]}>
														<Text style={[styles.birthdayDate]}>
															{
																offlineDepositDate != '' && moment(new Date(offlineDepositDate)).format('YYYY-MM-DD')
															}
														</Text>
														<Image source={require('./../../../images/finance/deposit/LbDeposit/lbcalendar1.png')}
															resizeMode='stretch' style={styles.calendarImg}></Image>
													</View>
													<View style={styles.dataBox}>
														<Text style={[styles.birthdayDate]}>
															{
																offlineDepositDate != '' && moment(new Date(offlineDepositDate)).format('HH')
															}
														</Text>
													</View>
													<View style={styles.dataBox}>
														<Text style={[styles.birthdayDate]}>
															{
																offlineDepositDate != '' && moment(new Date(offlineDepositDate)).format('mm')
															}
														</Text>
													</View>
												</TouchableOpacity>
											</View>

											<View style={styles.limitLists}>
												<Text style={[styles.limitListsText]}>สลิปการโอน</Text>

												<View style={styles.uploadFile}>
													{
														avatarSource.length > 0 && <Image resizeMode='stretch' source={{ uri: 'data:image/png;base64,' + avatarSource }} style={styles.uploadFileImg1} />
													}

													<TouchableOpacity style={styles.uploadFileBtn} onPress={this.selectPhotoTapped.bind(this)}>
														<Text style={styles.uploadFileBtnText}>อัพโหลดไฟล์</Text>
													</TouchableOpacity>
												</View>
											</View>

											<View style={styles.limitLists}>
												<Text style={[styles.uploadText, { color: '#4DABE9' }]}>การแจ้งเตือน</Text>
												<Text style={styles.uploadText}>1. โปรดตรวจสอบให้แน่ใจว่าคุณฝากเงินเข้าบัญชีธนาคารที่ถูกต้องจากทางเรา มิฉะนั้นการปรับอาจมีการล่าช้า</Text>
												<Text style={styles.uploadText}>2. หลังจากการฝากเงินเสร็จสิ้นให้คลิกปุ่ม [โอนเงินมาเรียบร้อยแล้ว] และรอดำเนินการ กรุณาอย่าส่งหลายครั้งเพื่อการปรับที่ไว</Text>
												<Text style={[styles.uploadText, { marginTop: 15 }]}>ฝากเงินขั้นต่ำ {toThousands(bankSetting.MinBal, '', 'บาท')} สูงสุด {toThousands(bankSetting.MaxBal, '', 'บาท')} ต่อ 1 รายการ</Text>
											</View>

											<View style={styles.limitLists}>
												<TouchableOpacity
													style={[styles.LBdepositPageBtn1, { backgroundColor: depositBtnStatus ? '#00AEEF' : '#D9D9D9', marginTop: 10 }]}
													onPress={() => {
														depositBtnStatus && (
															this.setState({
																isLoading: true
															}, () => {
																this.payMoney()
															})
														)
													}}>
													<Text style={styles.depositBtnText}>โอนเงินมาเรียบร้อยแล้ว</Text>
												</TouchableOpacity>

												<TouchableOpacity
													style={[styles.LBdepositPageBtn1, { backgroundColor: '#F4F4F5', borderColor: '#00AEEF', borderWidth: 1, marginTop: 10, marginBottom: 20 }]}
													onPress={() => {
														this.setState({
															isOldSix: false,
															LbLastSixNumber: '',
															offlineDepositDate: ''
														}, () => {
															this.setDepositBtnStatus()
														})
													}}>
													<Text style={[styles.depositBtnText, { color: '#00AEEF' }]}>ยกเลิก</Text>
												</TouchableOpacity>
											</View>
										</View>
									</KeyboardAwareScrollView>

								</View>
							</Modal>
						</View>
					}


					{
						//bonusApplicableSite &&
						this.props.fromPage && this.props.fromPage.length > 0 && bonusId > 0 &&
						balanceInfor.length > 0 && <DepositWalletBouns
							moneyFlag={moneyFlag}
							money={money}
							bonusId={bonusId}
							bonusApplicableSite={bonusApplicableSite}
							depositingWalletIndex={depositingWalletIndex}
							balanceInfor={balanceInfor}
							getDepositWallet={this.getDepositWallet.bind(this)}
							getDepositBouns={this.getDepositBouns.bind(this)}
							getBonusTurnOverInfor={this.getBonusTurnOverInfor.bind(this)}
							isShowBouns={true}
						></DepositWalletBouns>
					}




					{
						(['THBQR', 'TMW', 'EZP', 'BC', 'CC'].includes(depositActive) || (depositActive === 'BQR' && Array.isArray(LbBankAccounts) && LbBankAccounts.length > 0)) &&
						<TouchableOpacity
							style={[styles.LBdepositPageBtn1, { marginTop: depositActive === 'BQR' ? 10 : 20, backgroundColor: depositBtnStatus ? '#00AEEF' : '#D9D9D9' }]}
							onPress={() => {
								depositBtnStatus && this.payMoney()
							}}>
							<Text style={[styles.depositBtnText, {
								color: depositBtnStatus ? '#fff' : '#A8A8A8'
							}]}>ตกลง</Text>
						</TouchableOpacity>
					}

					{
						(depositActive === 'LB' && !isOldSix) &&
						<TouchableOpacity
							style={[styles.LBdepositPageBtn1, {
								marginTop: 10,
								backgroundColor: depositBtnStatus ? '#00AEEF' : '#D9D9D9'
							}]}
							onPress={() => {
								if (!depositBtnStatus) return


								if (Array.isArray(availableMethods) && availableMethods.length && availableMethods[availableMethodsIndex].MethodCode.toLocaleUpperCase() == 'UNIQUEAMT') {
									depositBtnStatus && this.payMoney()
									return
								}
								this.getDepositAccountByAmount(false)

								if (Array.isArray(availableMethods) && availableMethods.length) {
									if (availableMethods[availableMethodsIndex] == 'UniqueAmt') {
										window.PiwikMenberCode('Deposit​', 'Click', `ConfirmStep1_Fast_LocalBank`)
									} else {
										window.PiwikMenberCode('Deposit​', 'Click', `ConfirmStep1_Normal_LocalBank`)
									}
								}



								//this.goLbStep2Page(false)
							}}>
							<Text style={[styles.depositBtnText, {
								color: depositBtnStatus ? '#fff' : '#A8A8A8'
							}]}>ถัดไป</Text>
						</TouchableOpacity>
					}

				</AnimatableView>
			</KeyboardAwareScrollView>


		</View>
	}
}

export default Deposit = connect(
	(state) => {
		return {
			memberInforData: state.memberInforData,
			balanceInforData: state.balanceInforData,
			depositUserBankData: state.depositUserBankData,
			liveChatData: state.liveChatData

		}
	}, (dispatch) => {
		return {
			getMemberInforAction: () => dispatch(getMemberInforAction()),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
			changeBonusTurnOverInfor: (data) => dispatch(changeBonusTurnOverInfor(data)),
			getPromotionListInforAction: () => dispatch(getPromotionListInforAction()),
			getDepositUserBankAction: () => dispatch(getDepositUserBankAction()),
		}
	}
)(DepositContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#F4F4F5'
	},
	depositContainer: {
		paddingBottom: 50,
		paddingHorizontal: 10,
		paddingTop: 15
	},
	rebateWraps: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
		marginTop: 15
	},
	rebateBox: {
		height: 48,
		justifyContent: 'center',
		flexDirection: 'row',
		width: (width - 20) / 2.1,
		alignItems: 'center',
		borderRadius: 8,
		borderWidth: 1,
		borderBottomWidth: 4
	},
	LbBankAccountsBox: {
		backgroundColor: '#f2f2f2',
		width,
		marginHorizontal: - 10,
		paddingHorizontal: 10,
	},
	LbBankAccountsBoxText: {
		fontSize: 12,
		color: '#FF0000'
	},
	bankInfo: {
		backgroundColor: '#EDEDED',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#F2F2F2',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 5,
		height: 44,
		paddingHorizontal: 8,
		marginBottom: 10,
	},
	bankInfoText: {
		color: '#000',
		width: width - 20 - 70 - 16
	},
	copyTxt: {
		backgroundColor: '#59BA6D',
		borderRadius: 3,
		width: 60,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bankInfoBtnText: {
		color: '#fff',
		fontSize: 13,
		fontWeight: 'bold'
	},
	limitListsText: {
		marginBottom: 5,
		color: '#58585B'
	},
	LBavailableMethodsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 32,
		alignItems: 'center',
		width: width - 60
	},
	lbavailableMethodsBox: {
		width: 18,
		height: 18,
		marginRight: 6,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10000
	},
	lbavailableMethodsBoxInner: {
		width: 8,
		height: 8,
		backgroundColor: '#00AEF3',
		borderRadius: 10000
	},
	modalDropdownArrow: {
		right: 10,
		position: 'absolute',
		top: 10
	},
	depositBtnText: {
		textAlign: 'center',
		color: '#fff',
		fontWeight: 'bold'
	},
	LBdepositPageBtn1: {
		width: width - 20,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#D9D9D9',
		borderRadius: 6
	},
	moneyRankBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 8
	},
	moneyRankBoxBone: {
		backgroundColor: '#e0e0e0',
		overflow: 'hidden',
		borderRadius: 4,
		height: 14,
		flexDirection: 'row',
		alignItems: 'center'
	},
	depositMoneyText1: {
		color: '#B1B1B1',
		fontSize: 12,
		marginTop: 4
	},
	depositMoneyText2: {
		color: '#00AEEF',
	},
	depositMoneyText3: {
		color: 'red',
		marginTop: 8
	},
	mmpTipBoxText: {
		fontSize: 11,
		color: 'red'
	},
	mmpTipBox: {
		backgroundColor: '#E7F6FD',
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#79C6EB',
		marginBottom: 10,
		borderRadius: 6
	},
	lbSpecialBox: {
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'red'
	},
	LBMoneyBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	limitLists: {
		marginBottom: 10,
	},
	limitListsInput: {

		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		height: 40,
		width: width - 20,
		borderRadius: 4,
		justifyContent: 'center',
		color: '#000',


		borderWidth: 1,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		backgroundColor: '#fff',
		borderBottomColor: '#4C4C4C34'
	},
	stepContainer: {
		backgroundColor: '#F2F2F2',
		paddingBottom: 8,
		paddingTop: 4,
		width,
	},
	depositSelectBox: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 10,
		paddingTop: 10,
		backgroundColor: '#F2F2F2'
	},
	depositListBox: {
		backgroundColor: '#FFF',
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20) / 5.3,
		height: 60,
		marginBottom: 8,
		borderRadius: 4,
		borderWidth: 1
	},
	depostListImg: {
		width: 24,
		height: 24
	},
	depostListImgEZP: {
		width: 32,
	},
	depostListImgRD: {
		width: 34,
		height: 24
	},
	depostListImgTMW: {
		width: 40,
	},
	depostListImgBC: {
		width: 30
	},
	depostListImgCC: {
		width: 32
	},
	depositIconText: {
		color: '#fff',
		fontSize: 8
	},
	depositIcon: {
		backgroundColor: '#F12F2F',
		padding: 1.5,
		paddingHorizontal: 4,
		borderRadius: 40,
		position: 'absolute',
		top: 2,
		right: 2
	},
	depostListName: {
		fontSize: 12,
		textAlign: 'center'
	},
	depostListNameBQR: {
		width: 70,
	},
	LBBankTextInfor: {
		paddingHorizontal: 10,
		paddingTop: 25,
	},
	LBBankTextInfor1: {
		color: '#000',
		fontSize: 18,
		paddingBottom: 5
	},
	LBBankTextInfor2: {
		color: '#58585B',
		fontSize: 12
	},
	LBbank: {},
	LbBankIcon: {
		width: 26,
		height: 26,
		marginRight: 10
	},
	LBbankList: {
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderBottomWidth: 2,
		borderColor: '#F2F2F2',
		marginBottom: 4,
		height: 42,
		paddingHorizontal: 10
	},
	toreturnDropdownStyle: {
		width: width - 20,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	toreturnModalDropdownList: {
		height: 30,
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexWrap: 'wrap',
		paddingVertical: 6
	},
	toreturnModalDropdownListText: {
		flexWrap: 'wrap',
	},
	toreturnModalDropdown: {
		justifyContent: 'center',
		width: width - 20,
	},
	targetWalletBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 5,
		paddingRight: 5,
		height: 40,
		borderWidth: 1,
		borderBottomWidth: 2,
		borderBottomColor: '#4C4C4C34',
		alignItems: 'center',
		borderRadius: 4,
		borderColor: '#F2F2F2',
		backgroundColor: '#fff'
	},
	targetWalletBoxCs: {
		borderWidth: 0,
		backgroundColor: '#00AEEF',
		justifyContent: 'center',
		borderBottomWidth: 0
	},
	targetWalletBoxBone: {
		borderWidth: 0,
		backgroundColor: '#e0e0e0',
		overflow: 'hidden',
		borderBottomWidth: 0
	},
	toreturnModalDropdownText: {
		flexWrap: 'wrap',
		width: width - 80,
		color: '#000'
	},
	lbimgIconBox: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	lbimgIcon: {
		width: 30 * .82,
		height: 25 * .82,
		marginRight: 5
	},
	lbimgIconVICB: {
		height: 30 * .82,
	},
	lbimgIconBACA: {
		transform: [
			{
				scaleX: 1.2
			}
		]
	},
	lbimgIconVTTCJSB: {
		transform: [
			{
				scaleY: 1.2
			}
		]
	},
	lbimgIconSAIGONC: {
		height: 30 * .82,
	},
	targetWalletWrap: {
		marginHorizontal: 10,
		width: width - 20,
		marginTop: 10
	},
	fgoInforText: {
		color: '#000',
		marginBottom: 2,
		fontSize: 12
	},
	fgoInforText1: {
		color: '#25AAE1',
		textDecorationLine: 'underline'
	},
	LbSpecialListBox: {
		flexDirection: 'row',
		paddingVertical: 12
	},
	LbSpecialListCircleBox: {
		width: 15,
		height: 15,
		borderWidth: 1,
		borderRadius: 1000,
		borderColor: '#DCDCDC',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8
	},
	availableMethods: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 30
	},
	LbSpecialListCircle: {
		backgroundColor: '#25AAE1',
		width: 10,
		height: 10,
		borderRadius: 10000
	},
	promotionsBox: {
		width: width - 20,
		height: 40,
		marginBottom: 10,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
		backgroundColor: '#e0e0e0',
		marginRight: 8
	},
	select: {
		position: 'absolute',
		right: 0,
		bottom: 0,
		width: 25,
		height: 25
	},
	phcBtn: {
		width: 200,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#D6F2FF',
		borderWidth: 1,
		borderColor: '#26AAE3',
		borderRadius: 4,
		marginTop: 15
	},
	phcBtnText: {
		color: '#25A9E1'
	},
	modalContainer: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	modalBox: {
		backgroundColor: '#EFEFEF',
		borderRadius: 6,
		width: width * .95,
		overflow: 'hidden'
	},
	modalTop: {
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#25AAE1'
	},
	modalTopText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	modalTopTextBtn: {
		position: 'absolute',
		right: 15
	},
	modalBody: {
		paddingTop: 20,
		paddingBottom: 40,
		paddingHorizontal: 15,
	},
	mmoText: {
		paddingHorizontal: 15,
		paddingBottom: 20
	},
	wrapperMmo: {
		backgroundColor: '#D1D1D1',
		paddingHorizontal: 15,
		paddingVertical: 15
	},
	mmoGuide: {
		width: width * .95 - 30,
		height: (width * .95 - 30) * .713
	},
	mmoGuideBtnWrap: {
		alignItems: 'center',
		marginTop: 15
	},
	mmoGuideBtn: {
		alignItems: 'center',
		justifyContent: 'center',
		width: (width * .95 - 30) * .9,
		height: 42,
		backgroundColor: '#25AAE1',
		borderRadius: 6
	},
	mmoGuideBtnText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff'
	},
	wrapper: {
		//width: (width * .95) - 30,
		//overflow: 'hidden',
		borderRadius: 6,
	},
	containerStyle: {
		paddingVertical: 2,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: -25
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
		backgroundColor: '#CACACA'
	},
	carouselImg: {
		width: (width * .95) - 30,
		height: ((width * .95) - 30) * 1.3889,
		borderRadius: 4,
	},

	phcTextBox: {
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 1000,
		backgroundColor: '#E2141C',
		marginRight: 5
	},
	phcTextBoxText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#fff'
	},
	phcNoBox: {
		flexDirection: 'row'
	},
	bqrText: {
		fontSize: 12,
		textAlign: 'center'
	},
	IsUnderMaintenance: {
		backgroundColor: '#F12F2F',
		padding: 1.5,
		borderRadius: 4,
		position: 'absolute',
		top: 0,
		right: 0
	},
	depositBankList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between'
	},
	availableMethodsBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 2,
		height: 40,
		width: (width - 20) * .48,
		marginBottom: 8,



		borderWidth: 1,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		backgroundColor: '#fff',
		borderBottomColor: '#4C4C4C34'
	},
	availableMethodsText: {

	},
	DepositIconImg: {
		width: 22,
		height: 22,
		marginRight: 4
	},
	linkCsText: {
		textDecorationLine: 'underline',
		fontWeight: 'bold'
	},
	noBankCircle: {
		width: 60,
		height: 60,
		backgroundColor: '#FF0000',
		borderRadius: 100000,
		alignItems: 'center',
		justifyContent: 'center'
	},
	noBankText1: {
		textAlign: 'center',
		marginTop: 15,
		fontWeight: 'bold',
		fontSize: 15,
	},
	noBankText2: {
		textAlign: 'center',
		marginBottom: 25,
		marginTop: 10,
		marginHorizontal: 25
	},
	noBankCircleText: {
		fontSize: 36,
		fontWeight: 'bold',
		color: '#fff',
	},
	depositTipBox: {
		marginBottom: 5,
		marginTop: 5
	},
	depositTipBoxText: {
		color: '#25AAE1',
		textDecorationLine: 'underline',
		fontSize: 12
	},
	depositTipBoxText1: {
		color: '#F11818',
		fontSize: 12,
		width: width - 40,
		flexWrap: 'wrap'
	},
	rdNoBankBox: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	rdBankLimitText: {
		color: '#323232',
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 10
	},
	rdBankNone: {
		width: width * .35,
		height: width * .35
	},
	rdbankAdd: {
		width: width * .3,
		height: width * .3
	},
	rdNoBankBoxTetx1: {
		textAlign: 'center'
	},
	rdNoBankBoxTetx2: {
		color: '#00AEEF',
		textAlign: 'center',
		textDecorationLine: 'underline'
	},
	rdbankAdd1: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 5,
		marginTop: 5
	},
	rdbankAdd2: {
		color: '#777777',
		textAlign: 'center',
		marginBottom: 15
	},
	rdAddBankText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff'
	},
	rdAddBank: {
		marginTop: 15,
		marginBottom: 20,
		width: (width - 20) * .9,
		height: 40,
		backgroundColor: '#00AEEF',
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center'
	},
	rdnoteBox: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10
	},
	rdnote: {
		width: 20,
		height: 20,
		marginRight: 8
	},
	rdnoteBox1: {
		color: '#00AEEF',
		textDecorationLine: 'underline'
	},
	lineBox: {
		alignItems: 'center'
	},
	moneyTip: {
		color: '#4A4A4A',
		fontSize: 12
	},
	lineText: {
		textAlign: 'left',
		fontSize: 16,
		fontWeight: '600',
		color: '#6B6B6B'
	},
	lineTextBox: {
		width: (width - 20),
		alignItems: 'flex-start',
		marginVertical: 10
	},
	lineImg: {
		width: (width - 20) * .7,
		height: (width - 20) * .7 * .9,
		marginBottom: 4
	},
	lineImg1: {
		width: (width - 20) * .7,
		height: (width - 20) * .7 * 1.978,
		marginVertical: 10
	},
	lineTipText: {
		color: '#4A4A4A',
		fontSize: 12
	},
	lineTipText1: {
		fontSize: 16,
		color: '#25AAE1'
	},
	depositCom: {
		height: 20,
		width: 20,
		marginRight: 5
	},
	lbStepCircle: {
		width: 30,
		height: 30,
		backgroundColor: '#4DABE9',
		borderWidth: 1,
		borderRadius: 10000,
		borderColor: '#4DABE9',
		alignItems: 'center',
		justifyContent: 'center'
	},
	lbStepCircleText: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16
	},
	lbStepContainers: {
		flexDirection: 'row',
		width: width - 80,
		marginHorizontal: 30,
		alignItems: 'center',
		marginBottom: 15
	},
	lbStepBox: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	lbStepText: {
		color: '#4DABE9',
		fontSize: 10,
		marginBottom: 4
	},
	stepLine: {
		height: 1,
		backgroundColor: '#4DABE9',
		width: (width - 80) * .75
	},
	RdBankBg: {
		width: width - 20,
		height: (width - 20) * .544,
		justifyContent: 'center',
		paddingLeft: 15
	},
	rdBankIcon: {
		width: 40,
		height: 40,
		marginRight: 5,
		borderRadius: 40000,
	},
	rdBankName: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	rdBankUserNUm: {
		color: '#00000080',
		fontSize: 15,
		marginTop: 10
	},
	rdBankNameBox: {
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 40000,
	},
	rdCopyBox: {
		borderWidth: 1,
		borderColor: '#26AAE2',
		borderRadius: 6,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 6,
		width: (width - 20) * .65
	},
	rdBankCopy: {
		width: 20,
		height: 20,
		marginRight: 5
	},
	rdBnakNum: {
		fontSize: 16,
		fontWeight: '500',
		marginVertical: 10
	},
	rdCopyBoxText: {
		color: '#26AAE2',
		fontSize: 16,
		fontWeight: '500'
	},
	rdModalBtn: {
		width: (width * .85) - 30,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		backgroundColor: '#25AAE1',
		borderWidth: 1,
		borderColor: '#25AAE1',
		marginTop: 15
	},
	rdModalBtnText: {
		color: '#fff'
	},
	modalBox1: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		width,
		paddingHorizontal: 10,
		paddingTop: 20,
	},
	closeBtn: {

	},
	closeBtnImg: {
		width: 25,
		height: 25,
	},
	bankSelectBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		borderBottomColor: '#F4F4F5',
		alignItems: 'center',
		paddingVertical: 8
	},
	modalBox11: {
		width: width * .9,
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingVertical: 20,
		paddingHorizontal: 10,
		alignItems: 'center'
	},
	closeBtn1: {
		width: width * .9 - 20,
		height: 40,
		borderColor: '#25AAE1',
		borderWidth: 1,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeBtnText1: {
		color: '#25AAE1'
	},
	rdAddBankErr: {
		width: 66,
		height: 66
	},
	dataBox: {
		backgroundColor: '#fff',
		width: (width - 20 - 20) * .3,
		borderRadius: 4,
		height: 40,
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 10,
		borderWidth: 1,
		paddingLeft: 10,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		borderBottomColor: '#4C4C4C34'
	},
	dataImg: {
		marginTop: 10,
		fontSize: 16,
		fontWeight: 'bold',
		color: '#25AAE1',
		transform: [{
			rotate: '90deg'
		}]
	},
	birthdayDate: {
		marginRight: 6,
		textAlign: 'left',
		color: '#000'
	},
	calendarImg: {
		width: 20,
		height: 20,
		position: 'absolute',
		right: 10
	},
	uploadFileBtnText: {
		color: '#fff'
	},
	uploadText: {
		color: '#58585B',
		fontSize: 12,
		marginBottom: 4
	},
	uploadFileBtn: {
		backgroundColor: '#1DBC65',
		width: 100,
		height: 40,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		right: 10
	},
	uploadFileImg1: {
		marginTop: 15,
		marginBottom: 15,
		width: 80,
		height: 65,
	},
	uploadFile: {
		borderWidth: 1,
		borderRadius: 6,
		borderColor: '#AAAAAA',
		width: width - 20,
		height: 100,
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 10,
		flexDirection: 'row'
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
	homeCsWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10
	},
	homeCSImg: {
		width: 28,
		height: 28
	},
	registIpkLoadFlag: {
		position: 'absolute',
		width,
		right: 0,
		top: 0,
		bottom: 0,
		top: 0,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 1000000
	},
	registIpkLoadFlag1: {
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 10,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		width: 160,
		alignItems: 'center',
		justifyContent: 'center',
	}
})