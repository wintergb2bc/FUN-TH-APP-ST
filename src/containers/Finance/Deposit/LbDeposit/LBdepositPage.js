import React from 'react'
import { StyleSheet, Clipboard, Text, View, TouchableOpacity, Dimensions, TextInput, Image, Alert, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import ModalDropdown from 'react-native-modal-dropdown'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import DepositWalletBouns from '../DepositWalletBouns'
import { connect } from 'react-redux'
import { getBalanceInforAction, changeBonusTurnOverInfor, getPromotionListInforAction, getDepositUserBankAction } from './../../../../actions/ReducerAction'
import { getDoubleNum, toThousands, RealNameReg, ProvinceReg, CityReg, BranchReg, GetOnlyNumReg, getThirdNum } from '../../../../actions/Reg'
import ModalDropdownArrow from './../../../Common/ModalDropdownArrow'
import DepositSpamModal from './../DepositModal/DepositSpamModal'
import RedStar from './../../../Common/RedStar'
import * as Animatable from 'react-native-animatable'
import DatePicker from 'react-native-date-picker'
import { DatePickerLocale, StepCustom, ListItemstyles, ImgPermissionsText, ImagePickerOption } from './../../../Common/CommonData'
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View

const OfflineRefNoBank = ['VCB', 'SAC', 'TEC']
class LBdepositPageContainer extends React.Component {
	constructor(props) {
		super(props)
		const { isOldSix } = this.props
		//const isOldSix = !true
		let lbInfor = this.props.lbInfor
		this.state = {
			LbBankAccounts: this.props.LbBankAccounts, // 公司收款银行
			LbTransferTypes: this.props.LbTransferTypes,
			LbTransferTypesIndex: 0,
			LbBanks: this.props.LbBanks, // 个人新增银行
			bankSetting: this.props.bankSetting,
			LbBanksIndex: 0,
			money: this.props.money,
			depositeDate: new Date(),
			depositeTime: new Date(),
			avatarName: '',//上传的文件名
			avatarSource: '',
			checkBox: false,
			depositingWalletIndex: this.props.depositingWalletIndex,
			balanceInfor: this.props.balanceInfor,
			bonusId: this.props.bonusId,
			depositingWallet: this.props.depositingWallet,
			LbDepositBtnStatus: false,
			depositBank: this.props.depositBank, // 用户存款银行
			depositBankIndex: isOldSix ? 0 : this.props.depositBankIndex,
			isShowDepositBank: true, ///yuweuyeuueweyur
			accountHolderName: '',
			accountHolderNameErr: true,
			accountNumber: '',
			province: '',
			provinceErr: true,
			city: '',
			cityErr: true,
			branch: '',
			branchErr: true,
			bonusTurnOverInfor: {},
			offlineRefNo: '',
			isShowDepositSpamModal: false,
			arrowFlag1: false,
			arrowFlag2: false,
			depositActive: this.props.depositActive,
			isShowRecommendTip: false,
			fileImgFlag: false,
			LbLastSixNumber: '',
			moneyFlag: false,
			isFinishAddBankFlag: false,
			fileSize: '',
			LbType: this.props.isOldSix ? 'LASTSIX' : 'LOCALBANK',
			mmlbOfflineRefNo: '',
			transactionId: '',
			depositingBankAcctNum: '',
			inputIsFouces: false,
			IsDummyBank: false,
			returnedBankDetails: '',
			isErrorModal: false,
			offlineDepositDate: '',
			isShowDataPicker: false,
			lbInfor,
			isLbUniqueSubmitBefor: Boolean(lbInfor && lbInfor.submittedAt && lbInfor.submittedAt.length > 0),
			isConfirmStep: false,
			moneyMinAccept: this.props.moneyMinAccept
		}
	}

	componentDidMount(props) {
		const { depositActive, LbType } = this.state
		const { isOldSix } = this.props
		this.props.navigation.setParams({
			title: 'ธนาคาร',
		})

		if (depositActive == 'LB') {
			isOldSix && this.props.getDepositUserBankAction()
		} else {
			!isOldSix && this.payMoney(true)
		}


		// if (this.props.fromPage === 'preferentialPage' || this.props.fromPage === 'homelPage') {
		// 	let money = this.state.moneyMinAccept + ''
		// 	this.setState({
		// 		//money
		// 	}, () => {
		// 		this.moneyChange(money)
		// 	})
		// }


		this.getDefaultWallet(this.props.memberInfor, this.props.balanceInfor)
	}

	componentWillReceiveProps(nextProps) {

	}

	componentWillUnmount() {
		if (!this.state.isConfirmStep) {
			this.postMemberCancelDeposit()
		}
	}

	getDepositUserBank(props) {
		if (this.state.depositActive == 'LB' && this.props.isOldSix) {
			if (props) {
				let depositUserBankData = props.depositUserBankData
				if (Array.isArray(depositUserBankData)) {
					this.setState({
						depositBank: depositUserBankData
					}, () => {
						this.changeLbDepositBtnStatus()
					})
				}
			}
		} else {
			this.setState({
				depositBank: this.props.depositBank
			}, () => {
				this.changeLbDepositBtnStatus()
			})
		}

	}

	getDefaultWallet(memberInfor, balanceInfor) {
		let preferWallet = memberInfor.PreferWallet
		let depositingWalletIndex = balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL').findIndex(v => v.name === preferWallet)
		this.setState({
			depositingWalletIndex,
			depositingWallet: this.props.fromPage ? this.props.depositingWallet : (preferWallet ? preferWallet : 'MAIN')
		}, () => {
			this.changeLbDepositBtnStatus()
		})
	}

	//复制文本
	async copyTXT(txt) {
		Clipboard.setString(txt)
		Toast.success('คัดลอกสำเร็จ', 1)
	}

	// 后端支持的文件类型='.jpg,.jpeg,.gif,.bmp,.png,.doc,.docx,.pdf'
	// jpg, gif, bmp, png, doc, docx, pdf, heic & heif
	selectPhotoTapped() {
		launchImageLibrary(ImagePickerOption, response => {
			let assets = response.assets

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

			if ((Array.isArray(assets) && assets.length)) {
				let assetsFirst = assets[0]
				this.setState({
					avatarName: assetsFirst.fileName,
					avatarSource: assetsFirst.base64,

					fileSize: assetsFirst.fileSize,
					//fileImgFlag: !(assetsFirst.fileSize <= 1024 * 1024 * 2 && ['JPG', 'GIF', 'BMP', 'PNG', 'DOC', 'DOCX', 'PDF', 'HEIC ', 'HEIF', 'JPEG'].includes((assetsFirst.fileName.split('.')[assetsFirst.fileName.split('.').length - 1]).toLocaleUpperCase()))
					fileImgFlag: !(['JPG', 'GIF', 'BMP', 'PNG', 'DOC', 'DOCX', 'PDF', 'HEIC ', 'HEIF', 'JPEG'].includes((assetsFirst.fileName.split('.')[assetsFirst.fileName.split('.').length - 1]).toLocaleUpperCase()))
				}, () => {
					this.changeLbDepositBtnStatus()
				})
			} else {
				//Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
			}
		})
	}

	//最大最下金额
	moneyChange(money) {
		const { bankSetting } = this.state
		const { MaxBal, MinBal } = bankSetting
		let moneyFlag = money >= MinBal && money <= MaxBal
		this.setState({
			money,
			moneyFlag
		}, () => {
			this.changeLbDepositBtnStatus()
		})
	}

	createLbBankList(item, index) {
		let flag = this.state.depositBankIndex * 1 === index * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
			<Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{`${item.BankName}-${item.AccountNumber.slice(-3)}`}</Text>
			<Text>{item.balance}</Text>
		</View>
	}

	getCalculateBonusTurnOver() {
		this.setState({
			bonusTurnOverInfor: {}
		})
		const { bonusId, money } = this.state
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


	postMemberCancelDeposit() {
		let lbInfor = this.props.lbInfor
		let transactionId = lbInfor.transactionId
		if (Boolean(lbInfor && transactionId)) {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)

			fetchRequest(ApiPort.POSTNoCancellation + 'MemberCancelDeposit?transactionId=' + transactionId + '&', 'POST').then(() => {
				Toast.hide()
			}).catch(err => {
				Toast.hide()
			})
		}
	}

	payMoney(flag) {
		const { bankSetting, depositActive, LbLastSixNumber, offlineRefNo, bonusTurnOverInfor, depositBank, depositBankIndex, LbTransferTypes, LbTransferTypesIndex, money, bonusId, avatarName, avatarSource, depositingWallet, depositeDate, depositeTime, LbBankAccounts, LbDepositBtnStatus } = this.state
		const { isOldSix } = this.props
		const offlineDepositDate1 = moment(depositeDate).format('MM/DD/YYYY') + ' ' + moment(depositeTime).format('HH:mm')
		const offlineDepositDate2 = !this.props.isOldSix ? (moment(depositeDate).format('YYYY-MM-DD') + ' 00:00:00') : (moment(depositeDate).format('YYYY-MM-DD') + ' ' + moment(depositeTime).format('HH:mm') + ':00')
		let offlineDepositDate = depositActive == 'LB' ? offlineDepositDate1 : offlineDepositDate2
		const depositBankList = depositBank[depositBankIndex]
		const IsAutoAssign = bankSetting.IsAutoAssign
		let depositingBankAcctNum = ''
		let data = {}

		depositingBankAcctNum = isOldSix ? LbLastSixNumber :
			LbBankAccounts.AccountNo.substr(LbBankAccounts.AccountNo.length - 6)

		data = {
			// 收款
			depositingBankAcctNum,
			depositingBankName: isOldSix ? '' : LbBankAccounts.EnBankName,
			province: isOldSix ? '' : LbBankAccounts.Province, //收款銀行 省市
			city: isOldSix ? '' : LbBankAccounts.City, //收款銀行 城市
			branch: isOldSix ? '' : LbBankAccounts.Branch, //收款銀行 分行

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
			transferType: LbTransferTypes[LbTransferTypesIndex],
			transfertype: '',
			offlineRefNo: '0',
			isPreferredWalletSet: false, // 是不是首選帳戶
			depositingWallet: depositingWallet, //目標帳戶
			fileBytes: avatarSource ? avatarSource : '',
			fileName: avatarName,
			MethodCode: '',
			blackBoxValue: E2Backbox,
			e2BlackBoxValue: E2Backbox,
			IPAddress: '',
			CurrencyCode: 'THB',
			Address: '',
			BankLogID: '',
		}

		// if (!IsAutoAssign && !isOldSix) {
		// 	data.depositingBankName = LbBankAccounts.EnBankName
		// }
		Toast.loading('กำลังโหลดข้อมูล...', 20000000)
		fetchRequest(ApiPort.PaymentApplications, 'POST', data).then(res => {
			Toast.hide()
			if (res.isSuccess) {




				if (depositActive === 'MMLB') {
					let IsDummyBank = res.IsDummyBank
					this.setState({
						IsDummyBank
					})
				}
				const { transactionId } = res
				if (depositActive === 'MMLB') {
					this.setState({
						returnedBankDetails: res.returnedBankDetails
					})
				}
				this.setState({
					transactionId,
					depositingBankAcctNum,
					offlineDepositDate,
					mmlbOfflineRefNo: res.offlineRefNo || '',
				}, () => {
					this.changeLbDepositBtnStatus()
				})
				//!(depositActive === 'MMLB' && !isOldSix) && this.postDepositImg(transactionId, depositingBankAcctNum, offlineDepositDate)
				const { fromPage } = this.props
				if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {
					this.postApplications(res)
					//let toastFlag = res.bonusResult.toLocaleUpperCase() === 'SUCCESS'
					// if (res.successBonusId && res.successBonusId > 0) {
					// 	this.postApplications(res)
					// 	//this.props.postApplications && this.props.postApplications(res)
					// 	//this.getCalculateBonusTurnOver()
					// 	// if (fromPage === 'preferentialPage') {
					// 	// 	Actions.promotionLogin()
					// 	// } else if (fromPage === 'homelPage') {
					// 	// 	Actions.home()
					// 	// }
					// 	//this.props.getPromotionListInforAction()
					// }
				}


				Actions.pop()
				Actions.FinanceAfter({
					financeType: 'deposit',
					paymentMethod: depositActive,
					money
				})
			} else {
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
						Toast.fail(res.errorMessage, 6)
					} else {
						let errors = res.errors
						if (Array.isArray(errors) && errors.length) {
							let message = errors[0].description
							message && Toast.fail(message, 6)
						}
					}
				}
			}
		}).catch(err => {
			Toast.hide()
		})

		isOldSix && depositActive == 'MMLB' && PiwikMenberCode('Deposit', 'Submit​', `Submit_MomoLB_OldAccount_Deposit`)
	}

	postDepositImg(transactionId, depositingBankAcctNum, offlineDepositDate) {
		const { isOldSix } = this.props
		const { avatarSource, avatarName, depositActive, money } = this.state
		let data = {
			'depositingBankAcctNum': depositingBankAcctNum,
			'offlineDepositDate': offlineDepositDate ? offlineDepositDate : moment(new Date()).format('YYYY-MM-DD HH:MM:SS'),
			'fileName': avatarName || '',
			'fileByte': avatarSource || '',
			'hasQR': false
		}
		Toast.loading('กำลังโหลดข้อมูล...', 20000000000)
		this.setState({
			isConfirmStep: true
		})
		fetchRequest(ApiPort.PaymentApplications1 + `/${transactionId}/ConfirmStep?`, 'POST', data).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				this.props.getBalanceInforAction()
				Actions.pop()
				setTimeout(() => {
					Actions.FinanceAfter({
						financeType: 'deposit',
						paymentMethod: depositActive,
						money
					})
				}, 1000)
			} else {
				let errorMessage = res.errorMessage
				errorMessage && Toast.fail(errorMessage, 1.5)
			}
			// this.setState({
			// 	avatarName: '',
			// 	accountHolderName: '',
			// 	accountNumber: '',
			// 	province: '',
			// 	city: '',
			// 	branch: '',
			// 	bonusTurnOverInfor: {},
			// 	LbLastSixNumber: '',
			// 	money: '',
			// 	avatarSource: null,
			// 	inputIsFouces: false,
			// 	LbDepositBtnStatus: false
			// })
		}).catch(err => {
			Toast.hide()
		})
	}


	postApplications({ transactionId, successBonusId }) {
		this.setState({
			isShowModalFlag1: false
		})
		const { bonusId, money, depositingWallet, charges, balanceInfor, balanceInforIndex, promotionsDetail } = this.state
		console.log(this.state)
		let params = {
			blackBoxValue: E2Backbox,
			e2BlackBoxValue: E2Backbox,
			"bonusId": bonusId,
			"amount": money,
			"bonusMode": "Deposit",
			"targetWallet": depositingWallet,
			"couponText": "",
			"isMax": false,
			transferBonus: null,
			"depositBonus": {
				"depositCharges": charges,
				"depositId": transactionId
			},
			"successBonusId": 0,
		}
		fetchRequest(ApiPort.PostApplications, 'POST', params).then(res => {
			Toast.hide()
			if (res) {
				let bonusResult = res.bonusResult
				if (bonusResult) {
					if (bonusResult.message.toLocaleUpperCase() == 'SUCCESS') {
						Toast.success('สมัครโบนัสสำเร็จ', 2000)
						this.getCalculateBonusTurnOver()
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

	changeLbDepositBtnStatus() {
		const { isOldSix } = this.props
		const { depositBankIndex, depositActive, moneyFlag, fileImgFlag, avatarName, transactionId, LbBankAccounts, offlineRefNo, LbLastSixNumber } = this.state
		let fileImgFlagStatus = (avatarName.length > 0) ? !fileImgFlag : true
		let LbDepositBtnStatus = false
		if (isOldSix) {
			// if (depositActive == 'MMLB') {
			// 	LbDepositBtnStatus = moneyFlag && LbLastSixNumber.length == 6
			// }
			// if (depositActive == 'LB') {
			// 	LbDepositBtnStatus = moneyFlag && LbLastSixNumber.length == 6 && depositBankIndex >= 0
			// }
			LbDepositBtnStatus = moneyFlag && LbLastSixNumber.length == 6 && (true ? true : depositBankIndex >= 0)
		} else {
			LbDepositBtnStatus = true
			// if (depositActive == 'MMLB') {
			// 	LbDepositBtnStatus = true && transactionId
			// }
			// if (depositActive == 'LB') {
			// 	if (LbBankAccounts == null) return
			// 	let offlineRefNoStatus = (OfflineRefNoBank.some(v => v === LbBankAccounts.BankCode)) ? offlineRefNo.length > 0 : true
			// 	LbDepositBtnStatus = true && offlineRefNoStatus
			// }
		}

		this.setState({
			LbDepositBtnStatus: LbDepositBtnStatus && fileImgFlagStatus
		})
	}

	getBonusTurnOverInfor(bonusTurnOverInfor) {
		this.setState({
			bonusTurnOverInfor
		})
	}

	changeDepositSpamModal(isShowDepositSpamModal) {
		this.setState({
			isShowDepositSpamModal
		})
	}

	createErrorModal(isErrorModal) {
		return <Modal animationType='fade' transparent={true} visible={isErrorModal}>
			<View style={[styles.modalContainer, {
				backgroundColor: 'rgba(0, 0, 0, .4)'
			}]}>
				<View style={[styles.modalBox, { borderRadius: 8, backgroundColor: window.isBlue ? '#fff' : '#000', alignItems: 'center', justifyContent: 'center', paddingVertical: 25 }]}>
					<View style={styles.noBankCircle}>
						<Text style={styles.noBankCircleText}>!</Text>
					</View>

					<Text style={[styles.noBankText1, {
						color: window.isBlue ? '#000000' : '#FFFFFF'
					}]}>การฝากเงินล้มเหลว</Text>
					<Text style={[styles.noBankText2, {
						color: window.isBlue ? '#4A4A4A' : '#BFBFBF'
					}]}>ขออภัย รายการฝากของคุณมีปัญหา กรุณาติดต่อฝ่ายบริการลูกค้า</Text>

					<TouchableOpacity style={styles.mmoGuideBtn} onPress={() => {
						this.setState({
							isErrorModal: false
						})
						Actions.pop()
					}}>
						<Text style={styles.mmoGuideBtnText}> ทำรายการฝากใหม่ </Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	}

	changeArrowStatus(tag, arrowFlag) {
		this.setState({
			[tag]: arrowFlag
		})
	}

	changeInputFous(inputIsFouces) {
		this.setState({
			inputIsFouces
		})
	}


	createComDataUploadFile() {
		const { bonusId, lbInfor, avatarSource, isShowDataPicker, isErrorModal, moneyFlag, inputIsFouces, returnedBankDetails, IsDummyBank, transactionId, depositingBankAcctNum, offlineDepositDate, LbType, mmlbOfflineRefNo, LbLastSixNumber, isFinishAddBankFlag, fileImgFlag, isShowRecommendTip, depositActive, arrowFlag1, arrowFlag2, isShowDepositSpamModal, offlineRefNo, accountHolderName, accountHolderNameErr, accountNumber, province, provinceErr, city, cityErr, branch, branchErr, isShowDepositBank, depositBank, depositBankIndex, LbTransferTypes, LbTransferTypesIndex, checkBox, LbBankAccounts, LbBanks, LbBanksIndex, balanceInfor, depositingWalletIndex, bankSetting, money, LbDepositBtnStatus, depositeDate, depositeTime, avatarName } = this.state
		const { bonusApplicableSite,
			isOldSix,
		} = this.props
		//const isOldSix = !true
		const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
		const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
		return <View>

			{
				!(lbInfor && lbInfor.submittedAt && lbInfor.submittedAt.length > 0) && <View style={styles.limitLists}>
					<Text style={[styles.limitListsText]}>วันและเวลา</Text>
					<TouchableOpacity onPress={() => {
						this.setState({
							isShowDataPicker: true
						})
					}} style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width - 20 }]}>
						<View style={[styles.dataBox, {
							width: (width - 20 - 20) * .4
						}]}>
							<Text style={[styles.birthdayDate]}>
								{
									offlineDepositDate != '' && moment(new Date(offlineDepositDate)).format('YYYY-MM-DD')
								}
							</Text>
							<Image source={require('./../../../../images/finance/deposit/LbDeposit/lbcalendar1.png')}
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
			}


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
		</View>
	}

	createSubmitBtn(transactionId, depositingBankAcctNum, offlineDepositDate) {
		const { LbDepositBtnStatus, lbInfor, isOldSix } = this.state
		return <View style={styles.limitLists}>
			<TouchableOpacity
				style={[styles.LBdepositPageBtn1, { backgroundColor: LbDepositBtnStatus ? '#00AEEF' : '#D9D9D9', marginTop: 10 }]}
				onPress={() => {
					if (lbInfor && lbInfor.submittedAt && lbInfor.submittedAt.length > 0) {
						const { transactionId } = lbInfor
						const { offlineDepositDate, LbBankAccounts } = this.state
						this.postDepositImg(transactionId, LbBankAccounts.AccountNo.substr(LbBankAccounts.AccountNo.length - 6), offlineDepositDate)
						return
					}
					this.payMoney()


					let availableMethodsCode = this.props.availableMethodsCode
					if (availableMethodsCode == 'UniqueAmt') {
						window.PiwikMenberCode('Deposit​', 'Submit', `SubmitDeposit_Fast_LocalBank`)
					} else {
						if (isOldSix) {
							window.PiwikMenberCode('Deposit​', 'Submit', `SubmitDeposit_OldBank_LocalBank`)
						} else {
							window.PiwikMenberCode('Deposit​', 'Submit', `SubmitDeposit_Normal_LocalBank`)
						}
					}
				}}>
				<Text style={styles.depositBtnText}>โอนเงินมาเรียบร้อยแล้ว</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.LBdepositPageBtn1, { backgroundColor: '#F4F4F5', borderColor: '#00AEEF', borderWidth: 1, marginTop: 10 }]}
				onPress={() => {
					Actions.pop()
				}}>
				<Text style={[styles.depositBtnText, { color: '#00AEEF' }]}>ยกเลิก</Text>
			</TouchableOpacity>
		</View>
	}

	render() {
		const { bonusId, isLbUniqueSubmitBefor, lbInfor, isShowDataPicker, avatarSource, isErrorModal, moneyFlag, inputIsFouces, returnedBankDetails, IsDummyBank, transactionId, depositingBankAcctNum, offlineDepositDate, LbType, mmlbOfflineRefNo, LbLastSixNumber, isFinishAddBankFlag, fileImgFlag, isShowRecommendTip, depositActive, arrowFlag1, arrowFlag2, isShowDepositSpamModal, offlineRefNo, accountHolderName, accountHolderNameErr, accountNumber, province, provinceErr, city, cityErr, branch, branchErr, isShowDepositBank, depositBank, depositBankIndex, LbTransferTypes, LbTransferTypesIndex, checkBox, LbBankAccounts, LbBanks, LbBanksIndex, balanceInfor, depositingWalletIndex, bankSetting, money, LbDepositBtnStatus, depositeDate, depositeTime, avatarName } = this.state
		const { bonusApplicableSite,
			isOldSix,
			availableMethods
		} = this.props
		//const isOldSix = !true
		const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
		const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
		return <View style={[styles.viewContainer]}>
			{
				isShowDepositSpamModal && <DepositSpamModal changeDepositSpamModal={this.changeDepositSpamModal.bind(this)}></DepositSpamModal>
			}


			<Modal animationType='fade' transparent={true} visible={isLbUniqueSubmitBefor}>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { backgroundColor: '#fff', width: width * .85, paddingHorizontal: 15, paddingVertical: 25 }]}>
						<Text style={{ color: '#666666', marginBottom: 15, textAlign: 'center', fontSize: 12 }}>กรุณาโอนเงินเป็นจำนวนทศนิยมตามที่ระบบกำหนด เท่านั้นเพื่อความรวดเร็วในการตรวจสอบและอนุมัติยอดเงิน</Text>
						<View>
							<TouchableOpacity style={styles.rdModalBtn} onPress={() => {
								this.setState({
									isLbUniqueSubmitBefor: false
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




			<KeyboardAwareScrollView>
				{
					this.props.createisDummyBank(this.props.IsDummyBank || IsDummyBank)
				}
				{
					this.createErrorModal(isErrorModal)
				}
				<View style={styles.LBdepositPageView}>
					{
						this.props.createDepositTopTip && <View style={{ marginHorizontal: 25 }}>{
							this.props.createDepositTopTip()
						}</View>
					}

					{
						lbInfor && lbInfor.submittedAt && lbInfor.submittedAt.length > 0 && <View>
							<Text style={{ color: '#F12F2F', marginHorizontal: 30, fontSize: 12, marginBottom: 10 }}>การทำรายการฝากเริ่มต้น: {moment(lbInfor.submittedAt).format('YYYY-MM-DD HH:MM:SS')} โปรดทำรายการฝาก ของคุณให้เสร็จสิ้นภายใน 30 นาที มิฉะนั้นระบบ จะทำการยกเลิกโดยอัตโนมัติ</Text>


							{
								Array.isArray(availableMethods) && availableMethods.length > 0 && <View style={{ alignItems: 'center' }}>
									<View style={styles.LbSpecialListBox}>
										{
											availableMethods.map((v, i) => {
												let flag = 1 == i
												return <TouchableOpacity style={styles.availableMethods} key={i} onPress={() => { }
												}>
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
						</View>
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
						isOldSix ? <View>
							<View style={styles.limitLists}>
								<Text style={[styles.limitListsText]}>ยอดฝาก<RedStar /></Text>
								<View style={styles.LBMoneyBox}>
									<TextInput
										value={money}
										keyboardType={'decimal-pad'}
										onChangeText={value => {
											this.moneyChange(value)
										}}
										style={[styles.limitListsInput,]} />
								</View>
								{
									<Text style={[styles.depositMoneyText1]}>แจ้งเตือน ฝากเงินขั้นต่ำ {toThousands(bankSetting.MinBal)} บาท สูงสุด {toThousands(bankSetting.MaxBal)} บาทต่อ 1 รายการ</Text>
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


							<View style={styles.limitLists}>
								<Text style={[styles.limitListsText]}>เลขที่บัญชีสมาชิก<RedStar /></Text>
								<ModalDropdown
									animated={true}
									options={depositBank}
									renderRow={this.createLbBankList.bind(this)}
									onSelect={depositBankIndex => {
										this.setState({
											depositBankIndex
										}, () => {
											this.changeLbDepositBtnStatus()
										})
									}}
									onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
									onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
									style={[styles.toreturnModalDropdown]}
									dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: depositBank.length < 10 ? depositBank.length * 32 : 300 }]}
								>
									<View style={[styles.targetWalletBox, {
										backgroundColor: isOldSix ? '#fff' : '#E6E6E6'

									}]}>
										<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#6B6B6B' : '#fff', width: width - 130 }]}>
											{
												depositBankIndex < 0 ? 'กรุณาเลือกบัญชี' : (`${depositBank[depositBankIndex].BankName}-${depositBank[depositBankIndex].AccountNumber.slice(-3)}`)
											}
										</Text>
										{
											<ModalDropdownArrow arrowFlag={arrowFlag1} style={styles.modalDropdownArrow} />
										}
									</View>
								</ModalDropdown>
								<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
									<Text
										onPress={() => {
											Actions.LiveChat()
										}} style={{ color: '#FF0A0A', fontSize: 12 }}>{`ในกรณีที่คุณต้องการเพิ่มบัญชีใหม่ กรุณาติดต่อฝ่ายบริการลูกค้าที่ \n`} <Text style={{ color: '#25AAE1' }}>ห้องช่วยเหลือสด</Text></Text>
								</View>
							</View>


							<View style={styles.limitLists}>
								<Text style={[styles.limitListsText]}>ธนาคาร<RedStar /></Text>
								<View style={styles.LBMoneyBox}>
									<TextInput
										value={'ฝากเข้าบัญชีธนาคารอื่นๆ'}
										editable={false}
										placeholderTextColor={PlaceholderTextColor}
										style={[styles.limitListsInput, { backgroundColor: '#E6E6E6', color: '#989797' }]} />
								</View>
							</View>


							<View style={[styles.limitLists]}>
								<Text style={[styles.limitListsText]}>เลขที่บัญชีเก่า : 6 หลักสุดท้าย<RedStar /></Text>
								<TextInput
									value={LbLastSixNumber}
									maxLength={6}
									keyboardType='number-pad'
									onChangeText={value => {
										let LbLastSixNumber = GetOnlyNumReg(value)
										this.setState({
											LbLastSixNumber
										}, () => {
											this.changeLbDepositBtnStatus()
										})
									}}
									style={[styles.limitListsInput, PasswordInput]} />
							</View>


							{
								this.createComDataUploadFile()
							}

							{
								this.createSubmitBtn()
							}


						</View>
							:
							<View>
								<View style={styles.limitLists}>
									<Text style={[styles.limitListsText]}>ยอดฝาก<RedStar /></Text>
									<View style={styles.LBMoneyBox}>
										<TextInput
											value={(lbInfor && lbInfor.uniqueAmount) ? lbInfor.uniqueAmount + '' : money}
											editable={false}
											placeholderTextColor={PlaceholderTextColor}
											style={[styles.limitListsInput, { backgroundColor: '#F0F0F0', color: '#BE0202' }]} />
										<TouchableOpacity
											style={[styles.copyTxt, {
												position: 'absolute', right: 10
											}]}
											onPress={() => {
												this.copyTXT(money)
											}}>
											<Text style={[styles.bankInfoBtnText]}>คัดลอก</Text>
										</TouchableOpacity>
									</View>
								</View>


								<View style={styles.limitLists}>
									<Text style={[styles.limitListsText]}>ชื่อธนาคาร</Text>
									<View style={styles.LBMoneyBox}>
										<TextInput
											value={`${LbBankAccounts.BankName}_${LbBankAccounts.AccountNo.slice(-4)}`}
											editable={false}
											placeholderTextColor={PlaceholderTextColor}
											style={[styles.limitListsInput, { backgroundColor: '#F0F0F0', color: '#5E5E5E' }]} />
									</View>
								</View>


								<View>
									<View style={styles.limitLists}>
										<Text style={[styles.limitListsText, { color: window.isBlue ? '#2C2C2C' : '#fff' }]}>ยอดฝาก</Text>
										<View style={styles.LBMoneyBox}>
											<TextInput
												value={LbBankAccounts.BankName}
												editable={false}
												style={[styles.limitListsInput, PasswordInput, { color: '#000', backgroundColor: window.isBlue ? '#fff' : '#7F7F7F', borderWidth: 0 }]} />
											<TouchableOpacity
												style={[styles.copyTxt, {
													position: 'absolute', right: 10
												}]}
												onPress={() => {
													this.copyTXT(LbBankAccounts.BankName)
												}}>
												<Text style={[styles.bankInfoBtnText]}>คัดลอก</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.limitLists}>
										<Text style={[styles.limitListsText, { color: window.isBlue ? '#2C2C2C' : '#fff' }]}>ชื่อบัญชี</Text>
										<View style={styles.LBMoneyBox}>
											<TextInput
												value={LbBankAccounts.AccountHolderName}
												editable={false}
												style={[styles.limitListsInput, PasswordInput, { color: '#000', backgroundColor: window.isBlue ? '#fff' : '#7F7F7F', borderWidth: 0 }]} />
											<TouchableOpacity
												style={[styles.copyTxt, {
													position: 'absolute', right: 10
												}]}
												onPress={() => {
													this.copyTXT(LbBankAccounts.AccountHolderName)
												}}>
												<Text style={[styles.bankInfoBtnText]}>คัดลอก</Text>
											</TouchableOpacity>
										</View>
									</View>

									<View style={styles.limitLists}>
										<Text style={[styles.limitListsText, { color: window.isBlue ? '#2C2C2C' : '#fff' }]}>เลขที่บัญชี</Text>
										<View style={styles.LBMoneyBox}>
											<TextInput
												value={LbBankAccounts.AccountNo}
												editable={false}
												style={[styles.limitListsInput, PasswordInput, { color: '#000', backgroundColor: window.isBlue ? '#fff' : '#7F7F7F', borderWidth: 0 }]} />
											{
												<TouchableOpacity
													style={[styles.copyTxt, {
														position: 'absolute', right: 10
													}]}
													onPress={() => {
														this.copyTXT(LbBankAccounts.AccountNo)
													}}>
													<Text style={[styles.bankInfoBtnText]}>คัดลอก</Text>
												</TouchableOpacity>
											}
										</View>
									</View>

									{
										this.createComDataUploadFile()
									}

									{
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


									<View style={styles.limitLists}>
										<Text style={[styles.uploadText, { color: '#4DABE9' }]}>การแจ้งเตือน</Text>
										<Text style={styles.uploadText}>1. โปรดตรวจสอบให้แน่ใจว่าคุณฝากเงินเข้าบัญชีธนาคารที่ถูกต้องจากทางเรา มิฉะนั้นการปรับอาจมีการล่าช้า</Text>
										<Text style={styles.uploadText}>2. หลังจากการฝากเงินเสร็จสิ้นให้คลิกปุ่ม [โอนเงินมาเรียบร้อยแล้ว] และรอดำเนินการ กรุณาอย่าส่งหลายครั้งเพื่อการปรับที่ไว</Text>
										<Text style={[styles.uploadText, { marginTop: 15 }]}>ฝากเงินขั้นต่ำ {toThousands(bankSetting.MinBal)} บาท สูงสุด {toThousands(bankSetting.MaxBal)} บาท ต่อ 1 รายการ</Text>
									</View>

									{
										this.createSubmitBtn()
									}
								</View>

							</View>

					}
				</View>
			</KeyboardAwareScrollView>
		</View>
	}
}

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		paddingTop: 20,
		backgroundColor: '#F4F4F5',
	},
	LBdepositPageBtn2: {
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		width
	},
	LBdepositPageBtn: {
		width: .9 * width,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#25AAE1'
	},
	LBdepositPageBtnText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#25AAE1'
	},
	LbAddBankBox: {
		position: 'absolute',
		width,
		bottom: 0,
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	addLbBankBtnText: {
		color: '#EDEDED',
		paddingHorizontal: 15
	},
	addLbBankBtn: {
		height: 36,
		backgroundColor: '#00AEEF'
	},
	depositMoneyText1: {
		color: '#B1B1B1',
		fontSize: 12,
		marginTop: 5
	},
	depositMoneyText2: {
		color: '#00AEEF',
	},
	depositMoneyText3: {
		color: 'red',
		marginTop: 8
	},
	LBdepositPageTop: {
		backgroundColor: '#F2F2F2',
		paddingTop: 20,
		paddingBottom: 20,
		paddingHorizontal: 10
	},
	LBdepositPageTopText1: {
		fontSize: 16,
		paddingBottom: 5,
		marginTop: 15,
	},
	LBdepositPageTopText2: {
		color: '#58585B',
		fontSize: 11
	},
	LBdepositPageView: {
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 100,
	},
	lbStepContainers: {
		flexDirection: 'row',
		width: width - 80,
		marginHorizontal: 30,
		alignItems: 'center',
		marginBottom: 15
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
	LBdepositPageBtn1: {
		bottom: 0,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1CBD64',
		width: width - 20,
		borderRadius: 6
	},
	LBdepositPageBtnText1: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	bankInfo: {
		backgroundColor: '#EDEDED',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 5,
		height: 44,
		padding: 5,
		marginTop: 5,
		marginBottom: 10,
	},
	bankInfoText: {
		color: '#000',
		fontSize: 11
	},
	limitLists: {
		marginBottom: 10,
	},
	limitListsText: {
		marginBottom: 5,
		color: "#58585B"
	},
	limitListsInput: {
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		height: 40,
		width: width - 20,
		borderRadius: 4,
		justifyContent: 'center',


		borderWidth: 1,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		backgroundColor: '#fff',
		borderBottomColor: '#4C4C4C34',
	},
	LBMoneyBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	datePickerWrapView: {
		flexDirection: 'row',
		height: 40,
		width: width - 20,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	calendarImg: {
		width: 20,
		height: 20,
		position: 'absolute',
		right: 10
	},
	LbdepositTime: {
		color: '#FF0000',
		fontSize: 11,
		marginTop: 5
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
		// height: 30,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap',
		paddingVertical: 8
	},
	toreturnModalDropdown: {
		justifyContent: 'center',
		width: width - 20,
	},
	targetWalletBox: {
		flexDirection: 'row',
		position: 'relative',
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 10,
		height: 40,
		alignItems: 'center',
		width: width - 20,




		borderWidth: 1,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		backgroundColor: '#fff',
		borderBottomColor: '#4C4C4C34',
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
	copyTxt: {
		backgroundColor: '#1DBC65',
		borderRadius: 3,
		width: 80,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bankInfoBtnText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	modalDropdownArrow: {
		right: 10,
		position: 'absolute',
		top: 10
	},
	mmpTipBoxText: {
		fontSize: 12,
		color: 'red'
	},
	mmpTipBox: {
		backgroundColor: '#D6F2FF',
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#00AEFF',
		marginBottom: 10,
		borderRadius: 6,
		marginBottom: 15
	},
	walletSbIcon: {
		width: 18,
		height: 18,
		marginLeft: 10
	},
	recommendTipModal: {
		position: 'absolute',
		zIndex: 1000000000,
		backgroundColor: '#FFF3D0',
		borderWidth: 1,
		borderColor: '#EDE473',
		padding: 8,
		top: -70,
		right: 0
	},
	recommendTipModalText: {
		color: '#000100',
		fontWeight: 'bold'
	},
	recommendTipModalBtnBox: {
		alignItems: 'flex-end',
		marginTop: 6
	},
	recommendTipModalBtn: {
		backgroundColor: '#FFD756',
		borderRadius: 2,
		paddingHorizontal: 15,
		paddingVertical: 5,
		zIndex: 100000,
		marginTop: 6
	},
	recommendTipModalArrow: {
		position: 'absolute',
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: 10,
		borderLeftColor: 'transparent',
		borderBottomColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#FFF4D0',
		bottom: -20,
		zIndex: 1000,
		left: (width - 20) * .35
	},
	recommendTipModalBtnText: {
		fontWeight: 'bold',
	},
	recommendRecordBtnBox: {
		borderWidth: 1,
		borderRadius: 4,
		paddingHorizontal: 5,
		paddingVertical: 10,
		justifyContent: 'center',
		marginBottom: 15,
		alignItems: 'center',
	},
	mmlbText: {
		color: '#26AAE3',
		lineHeight: 20
	},
	limitListsInput1: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	gameButtonBox: {
		flexDirection: 'row',
		marginRight: 10,
	},
	hiddenView: {
		width: 70,
		height: 70,
		position: 'absolute',
		left: -width * .85,
		zIndex: 1000,
		bottom: 5
	},
	homeCsWrap: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	homeCSImg: {
		width: 28,
		height: 28
	},
	homeCsText: {
		color: '#fff',
		fontSize: 12,
	},
	homeLogo: {
		width: .35 * width,
		height: .08 * width,
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
	modalContainer: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
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
	availableMethods: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 30
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
	LbSpecialListCircle: {
		backgroundColor: '#25AAE1',
		width: 10,
		height: 10,
		borderRadius: 10000
	},
	LbSpecialListBox: {
		flexDirection: 'row',
		paddingVertical: 12,
		opacity: .6
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
	depositBtnText: {
		textAlign: 'center',
		color: '#fff',
		fontWeight: 'bold'
	},
})

export default LBdepositPage = connect(
	(state) => {
		return {
			depositUserBankData: state.depositUserBankData,
		}
	}, (dispatch) => {
		return {
			getDepositUserBankAction: () => dispatch(getDepositUserBankAction()),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeBonusTurnOverInfor: (data) => dispatch(changeBonusTurnOverInfor(data)),
			getPromotionListInforAction: () => dispatch(getPromotionListInforAction())
		}
	}
)(LBdepositPageContainer)