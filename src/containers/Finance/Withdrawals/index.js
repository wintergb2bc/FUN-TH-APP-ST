import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, Modal } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import Touch from 'react-native-touch-once'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction, getWithdrawalUserBankAction, getWithdrawalLbBankAction } from '../../../actions/ReducerAction'
import { getDoubleNum, toThousands, GetOnlyNumReg, RealNameReg, RealNameErrTip, ProvinceReg, CityReg, BranchReg, getName } from '../../../actions/Reg'
import CheckBox from 'react-native-check-box'
import { Picker } from '@react-native-picker/picker'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'
import RedStar from './../../Common/RedStar'
const { width, height } = Dimensions.get('window')
const RegObj = {
	accountHolderName: RealNameReg,
	province: ProvinceReg,
	city: CityReg,
	branch: BranchReg
}
const WithdrawalIcon1 = {
	LB: require('./../../../images/finance/withdrawals/withdrawalLB.png'),
	EZW: require('./../../../images/finance/withdrawals/withdrawalEzw.png')
}
const WithdrawalIconActive1 = {
	LB: require('./../../../images/finance/withdrawals/withdrawalLBActive.png'),
	EZW: require('./../../../images/finance/withdrawals/withdrawalEzwActive.png')
}


const WithdrawalIcon2 = {
	LB: require('./../../../images/finance/withdrawals/withdrawalLBActive.png'),
	EZW: require('./../../../images/finance/withdrawals/withdrawalEzwActive.png')
}
const WithdrawalIconActive2 = {
	LB: require('./../../../images/finance/withdrawals/withdrawalLBActive.png'),
	EZW: require('./../../../images/finance/withdrawals/withdrawalEzw.png')
}

const WithdrawalPik = {
	LB: {
		LBBtn: 'LocalBank_WithdrawPage',
		LBSub: 'Submit_LB_Withdraw'
	},
	EZW: {
		LBBtn: '',
		LBSub: ''
	},
}

class WithdrawalsContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			withdrawalsBank: [],
			withdrawalsBankIndex: 0,
			withdrawalsSetting: {},
			withdrawalsSettingFlag: false,
			money: '',
			moneyFlag: false,
			paymentWithdrawal: [],
			paymentWithdrawalType: '',
			balanceInfor: [],
			memberInfor: {},
			emailStatus: false,
			phoneStatus: false,
			withdrawalsBtnStatus: false,
			bankAddList: [],
			bankAddListIndex: 0,
			accountHolderName: '',
			accountHolderNameErr: true,
			accountNumber: '',
			province: '',
			provinceErr: true,
			city: '',
			cityErr: true,
			branch: '',
			branchErr: true,
			checkBox: false,
			IsDeposited: false,
			arrowFlag1: false,
			arrowFlag2: false,
			isBankList: false,
			TotalBal: 0,
			isShowVerifedModal: false,
			isShowModal: true,
			memberBanksTransactionHistory: [],
			allowEmail: false,
			allowPhone: false,
			compulsoryVerifyEmail: false,
			compulsoryVerifyPhone: false,
			compulsoryVerifyProfile: false,
			isShowSkip: false
		}
	}

	componentDidMount(props) {
		this.GetSetting()
		this.memberBanksTransactionHistory()
		this.getPaymentWithdrawal()

		this.props.getWithdrawalUserBankAction() // 用户提款银行
		this.getWithdrawalUserBank(this.props)// 用户提款银行

		this.getWithdrawalLbBank(this.props)

		this.setState({
			balanceInfor: this.props.balanceInforData,
			isShowVerifedModal: false,
			isShowModal: true,
		})


	}

	GetSetting() {
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.GetSetting + '?key=withdrawalverification&currency=THB&', 'GET').then(res => {
			Toast.hide()
			let result = res.result
			let { allowEmail, allowPhone, compulsoryVerifyProfile, compulsoryVerifyEmail, compulsoryVerifyPhone } = result

			this.setState({
				allowEmail,
				allowPhone,
				compulsoryVerifyProfile,
				compulsoryVerifyEmail,
				compulsoryVerifyPhone,
			}, () => {
				this.getPhoneEmailVerify(this.props.memberInforData, true)
				if (allowEmail && allowPhone) {
					this.setState({
						isShowSkip: !(compulsoryVerifyEmail && compulsoryVerifyPhone)
					})
					return
				}
				if (allowEmail) {
					this.setState({
						isShowSkip: !compulsoryVerifyEmail
					})
					return
				}
				if (allowPhone) {
					this.setState({
						isShowSkip: !compulsoryVerifyPhone
					})
					return
				}
			})
		}).catch(err => {
			Toast.hide()
		})
	}


	memberBanksTransactionHistory() {
		global.storage.load({
			key: 'memberBanksTransactionHistory',
			id: 'memberBanksTransactionHistory'
		}).then(res => {
			this.setState({
				memberBanksTransactionHistory: res
			})
		}).catch(() => { })

		fetchRequest(ApiPort.GetmemberBanksTransactionHistory, 'GET').then(res => {
			Toast.hide()
			if (Array.isArray(res)) {
				this.setState({
					memberBanksTransactionHistory: res
				})


				global.storage.save({
					key: 'memberBanksTransactionHistory',
					id: 'memberBanksTransactionHistory',
					data: res,
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}


	async getCDUActivateStatus() {
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let getCDUActivate = await this.getCDUActivate()
		Toast.hide()
		if (getCDUActivate.isSuccess) {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
			let getDocumentApprovalStatus = await this.getDocumentApprovalStatus()
			Toast.hide()
			const { isPending } = getDocumentApprovalStatus
			if (isPending == 0) { // 繼續提款
				return true
			} else {
				Toast.loading('กำลังโหลดข้อมูล...', 2000)
				let getWithdrawalNotification = await this.getWithdrawalNotification()
				Toast.hide()
				if (Array.isArray(getWithdrawalNotification) && getWithdrawalNotification.length) {
					let list0 = getWithdrawalNotification[0]
					let kycRuleId = list0.kycRuleId
					if (kycRuleId == 5) { // 你說的那個頁面
						//我们注意到您帐户存在异常。 请在个人资料-“上传文件页面”上传所需文件以验证您的身份，或联系在线客服寻求协助。
						Actions.WithdrawalVerification({
							withdrawalType: 'KYCRULEID5',
							bankName: ''
						})
					} else if ([1, 2, 3, 4, 6].includes(kycRuleId)) {
						Toast.loading('กำลังโหลดข้อมูล...', 2000)
						let getExcludedAffiliate = await this.getExcludedAffiliate()
						Toast.hide()
						if (getExcludedAffiliate.isSuccess) { //  繼續提款
							return true
						} else {
							const { currentWithdrawalThreshold, desiredWithdrawalThreshold } = list0
							if (currentWithdrawalThreshold >= 1) {
								Actions.WithdrawalVerification({
									withdrawalType: 'CURRENTWITHDRAWALTHRESHOLD',
									bankName: ''
								})
								//您已达到最大提款限额。 请在个人资料 -“上传文件页面”上传所需文件以验证您的身份。
								//kyc page 的 message 需要改成泰文 "您已达到最大提款限额。 请在个人资料 -“上传文件页面”上传所需文件以验证您的身份。"
							} else if (desiredWithdrawalThreshold > 1) {
								Actions.WithdrawalVerification({
									withdrawalType: 'DESIREDWITHDRAWALTHRESHOLD',
									bankName: ''
								})
								//kyc page 的 message 需要改成泰文 "很抱歉，您提交的金额已超过了您帐户的剩余提款限额。 请申请较低金额再次提交或联系在线客服以获取更多详细信息"
							} else {
								//繼續提款
								return true
							}
						}
					} else {
						return true
					}
				} else {
					return true
				}
			}
		} else {
			return true
		}
	}


	async getCDUActivate() {
		return fetchRequest(ApiPort.KYCVerification + 'getCDUActivate?', 'GET')
	}


	async getDocumentApprovalStatus() {
		return fetchRequest(ApiPort.KYCVerification + 'getDocumentApprovalStatus?', 'GET')
	}


	async getWithdrawalNotification() {
		return fetchRequest(ApiPort.KYCVerification + 'getWithdrawalNotification?withdrawalAmt=' + this.state.money + '&', 'GET')
	}


	async getExcludedAffiliate(list0) {
		return fetchRequest(ApiPort.KYCVerification + 'getExcludedAffiliate?', 'GET')
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.balanceInforData && Array.isArray(nextProps.balanceInforData) && nextProps.balanceInforData.length) {
			this.setState({
				balanceInfor: nextProps.balanceInforData,
				TotalBal: nextProps.balanceInforData.find(v => v.name === 'TOTALBAL').balance
			})
		}

		if (nextProps && nextProps.memberInforData) {
			this.getPhoneEmailVerify(nextProps.memberInforData, true)
		}
		this.getWithdrawalUserBank(nextProps)
		this.getWithdrawalLbBank(nextProps)
	}

	getWithdrawalUserBank(props) {
		if (props) {
			let withdrawalUserBankData = props.withdrawalUserBankData
			if (Array.isArray(withdrawalUserBankData)) {
				withdrawalUserBankData.forEach((v, i) => {
					v.value = v.BankName + ' ' + v.AccountNumber.replace(/^(.).*(...)$/, "******$2")
					v.label = v.BankName + ' ' + v.AccountNumber.replace(/^(.).*(...)$/, "******$2")
				})
				this.setState({
					withdrawalsBank: withdrawalUserBankData,
					withdrawalsBankIndex: 0,
				})
			}
		}
	}

	getWithdrawalLbBank(props) {
		if (props) {
			let withdrawalLbBankData = props.withdrawalLbBankData
			if (Array.isArray(withdrawalLbBankData) && withdrawalLbBankData.length) {
				this.setState({
					bankAddList: withdrawalLbBankData
				})
			}
		}
	}

	getPhoneEmailVerify(memberInforData, flag) {
		const { allowEmail, allowPhone, compulsoryVerifyPhone, compulsoryVerifyEmail} = this.state
		const memberInfor = memberInforData
		let contacts = memberInfor.Contacts || memberInfor.contacts
		let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
		let emailStatus = tempEmail.Status.toLocaleLowerCase() === 'unverified' // 没有验证 true
		let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
		let phoneStatus = tempPhone.Status.toLocaleLowerCase() === 'unverified'
		let IsDeposited = memberInfor.IsDeposited * 1 === 0
		this.setState({
			// emailStatus,
			// phoneStatus,
			memberInfor,
			IsDeposited,
			accountHolderName: memberInforData.FirstName,
			//isShowVerifedModal: !(emailStatus && phoneStatus)
		})
		if (IsDeposited && !flag) {
			this.props.getMemberInforAction()
		}

		if (allowPhone && allowEmail) {
			this.setState({
				emailStatus,
				phoneStatus,
				isShowVerifedModal: emailStatus || phoneStatus
			})
		}

		if (allowPhone) {
			this.setState({
				emailStatus: false,
				phoneStatus,
				isShowVerifedModal: phoneStatus
			})
			return
		}
		if (allowEmail) {
			this.setState({
				phoneStatus: false,
				emailStatus,
				isShowVerifedModal: emailStatus
			})
			return
		}

	}

	goPhoneEmailVerify() {
		const { phoneStatus, emailStatus, allowPhone, allowEmail } = this.state
		if (allowPhone && allowEmail) {
			if (emailStatus) {
				this.setState({
					isShowVerifedModal: false,
					isShowModal: false
				})
				Actions.WithdrawalPEVerification({
					fillType: 'email',
					fromPage: 'WithdrawalsPage',
					ServiceAction: 'ContactVerification',
					changeisShowModal: (changeisShowModal) => {
						this.componentDidMount()
					},
					allowPhone,
					allowEmail
				})
				return
			}

			if (phoneStatus) {
				this.setState({
					isShowVerifedModal: false,
					isShowModal: false
				})
				Actions.WithdrawalPEVerification({
					fillType: 'phone',
					fromPage: 'WithdrawalsPage',
					ServiceAction: 'ContactVerification',
					changeisShowModal: (changeisShowModal) => {
						this.componentDidMount()
					},
					allowPhone,
					allowEmail
				})
				return
			}

			return
		}

		if (allowPhone && phoneStatus) {
			this.setState({
				isShowVerifedModal: false,
				isShowModal: false
			})
			Actions.WithdrawalPEVerification({
				fillType: 'phone',
				fromPage: 'WithdrawalsPage',
				ServiceAction: 'ContactVerification',
				changeisShowModal: (changeisShowModal) => {
					this.componentDidMount()
				},
				allowPhone,
				allowEmail
			})
			return
		}


		if (allowEmail && emailStatus) {
			this.setState({
				isShowVerifedModal: false,
				isShowModal: false
			})
			Actions.WithdrawalPEVerification({
				fillType: 'email',
				fromPage: 'WithdrawalsPage',
				ServiceAction: 'ContactVerification',
				changeisShowModal: (changeisShowModal) => {
					this.componentDidMount()
				},
				allowPhone,
				allowEmail
			})
			return
		}
	}

	getPaymentWithdrawal(flag) {
		this.getPhoneEmailVerify(this.props.memberInforData)
		global.storage.load({
			key: 'paymentWithdrawal',
			id: 'paymentWithdrawal'
		}).then(data => {
			this.setState({
				paymentWithdrawal: data
			})
		}).catch(() => {

		})
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.Payment + '?transactionType=Withdrawal&', 'GET').then(res => {
			if (Array.isArray(res) && res.length) {
				Toast.hide()
				let paymentWithdrawal = res
				this.setState({
					paymentWithdrawal
				})
				if (paymentWithdrawal[0].code === 'EZW') {
					this.props.getWithdrawalLbBankAction()
				}
				if (this.props.fromPage === 'transaction') {
					const { depositActive, MethodType } = this.props
					if (paymentWithdrawal.find(v => v.code.toLocaleUpperCase() == depositActive.toLocaleUpperCase())) {
						this.setState({
							paymentWithdrawalType: depositActive
						}, () => {
							this.getWithdrawsDetail(depositActive)
						})
						return
					}
				}
				this.getWithdrawsDetail(paymentWithdrawal[0].code)
				global.storage.save({
					key: 'paymentWithdrawal',
					id: 'paymentWithdrawal',
					data: res,
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	getWithdrawsDetail(paymentWithdrawalType, flag) {
		if (paymentWithdrawalType === this.state.paymentWithdrawalType && flag) return
		this.setState({
			paymentWithdrawalType,
			withdrawalsSettingFlag: false,
			money: '',
			withdrawalsBtnStatus: false
		})
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=' + paymentWithdrawalType + '&isMobile=true&', 'GET').then(res => {
			Toast.hide()
			if (res) {
				if (paymentWithdrawalType === 'LB') {
					let bankAddList = res.Banks
					this.setState({
						bankAddList
					})
					global.storage.save({
						key: 'WithdrawalsLbBanks',
						id: 'WithdrawalsLbBanks',
						data: bankAddList,
						expires: null
					})
				}
				this.setState({
					withdrawalsSetting: res.Setting,
					withdrawalsSettingFlag: true
				})
			}
		}).catch(err => {
			Toast.hide()
		})
		WithdrawalPik[paymentWithdrawalType].LBBtn && PiwikMenberCode('Withdrawal Nav', 'Click', WithdrawalPik[paymentWithdrawalType].LBBtn)
	}


	changeWithdrawalsBtnStatus() {
		const { bankAddList, accountHolderNameErr, accountHolderName, provinceErr, province, cityErr, city, branchErr, withdrawalsBank, accountNumber, money, withdrawalsSetting, withdrawalsSettingFlag, branch } = this.state
		const { MinBal, MaxBal } = withdrawalsSetting
		let moneyFlag = money >= MinBal && money <= MaxBal && withdrawalsSettingFlag
		let withdrawalsBtnStatus = false
		if (withdrawalsBank.length > 0) {
			withdrawalsBtnStatus = moneyFlag
		} else {
			withdrawalsBtnStatus = bankAddList.length > 0 && accountNumber.length >= 10 && accountNumber.length <= 19
		}
		this.setState({
			withdrawalsBtnStatus,
			moneyFlag
		})
	}

	async withdrawalsBtn() {
		const { balanceInfor, checkBox, phoneStatus, emailStatus, accountHolderName, accountNumber, province, city, branch, bankAddList, bankAddListIndex, paymentWithdrawalType, money, withdrawalsBankIndex, withdrawalsBank } = this.state
		let mainMoney = balanceInfor.find(v => v.name === 'MAIN').balance
		if (mainMoney <= 0) {
			Toast.fail('ยอดเงินของคุณไม่เพียงพอ', 2)
			return
		}


		let getCDUActivateStatus = await this.getCDUActivateStatus()
		if (!getCDUActivateStatus) return

		let paymentWithdrawalTypeFlag = withdrawalsBank.length > 0
		let withdrawalBank = withdrawalsBank[withdrawalsBankIndex]
		let params = {
			accountNumber: paymentWithdrawalTypeFlag ? withdrawalBank.AccountNumber : accountNumber,
			accountHolderName: paymentWithdrawalTypeFlag ? withdrawalBank.AccountHolderName : accountHolderName,
			bankName: paymentWithdrawalTypeFlag ? withdrawalBank.BankName : bankAddList[bankAddListIndex].Name,
			city: paymentWithdrawalTypeFlag ? withdrawalBank.City : city,
			province: paymentWithdrawalTypeFlag ? withdrawalBank.Province : province,
			branch: paymentWithdrawalTypeFlag ? withdrawalBank.Branch : branch,
			language: 'th-th',
			swiftCode: 'Fun88P4MobileApps',
			paymentMethod: paymentWithdrawalType,
			charges: 0,
			amount: money,
			transactionType: 'Withdrawal',
			domainName: 'Fun88native://',
			isConvenience: true
		}
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PaymentApplications, 'POST', params).then(res => {
			Toast.hide()
			this.setState({
				money: '',
				withdrawalsBtnStatus: false
			})
			if (res.isSuccess) {
				this.props.getBalanceInforAction()
				checkBox && this.setDefault()
				const { isCDUActivate, kycCode } = res

				let errors = res.warnings
				if (Array.isArray(errors) && errors.length) {
					let errorCode = errors[0].Code.toLocaleUpperCase()
					if (['P106003', 'P106004', 'P106005'].some(v => v === errorCode.toLocaleUpperCase())) {
						Actions.WithdrawalVerification({
							withdrawalType: errorCode.toLocaleUpperCase(),
							bankName: ''
						})
					}

				}
				Toast.success('ส่งคำขอถอนเงินสำเร็จ', 2)
				// if (!paymentWithdrawalTypeFlag) {
				// 	this.addWithdrawalBank()
				// 	this.setState({
				// 		accountHolderName: '',
				// 		accountNumber: '',
				// 		province: '',
				// 		city: '',
				// 		branch: ''
				// 	})
				// }
				// Actions.FinanceAfter({
				// 	financeType: 'withdrawal',
				// 	money
				// })
			} else {
				let errors = res.warnings
				if (Array.isArray(errors) && errors.length) {
					// let tempMessage = errors[0].message
					//let message = tempMessage.includes('<br>') ? tempMessage.replace(/<br>/g, '\n') : tempMessage
					let errorCode = errors[0].Code.toLocaleUpperCase()
					if (['SNC0001', 'SNC0002', 'SNC0003'].some(v => v === errorCode)) {
						Actions.WithdrawalVerification({
							withdrawalType: errorCode,
							bankName: paymentWithdrawalTypeFlag ? withdrawalBank.AccountHolderName : accountHolderName
						})
					} else {
						Toast.fail(errors[0].Message, 2)
					}
				} else {
					Toast.fail(res.errorMessage, 2)
				}
			}
		}).catch(err => {
			Toast.hide()
		})

		WithdrawalPik[paymentWithdrawalType].LBSub && PiwikMenberCode('Withdrawal', 'Submit', WithdrawalPik[paymentWithdrawalType].LBSub)
	}

	addWithdrawalBank() {
		const { accountHolderName, accountNumber, province, city, branch, checkBox, bankAddList, bankAddListIndex } = this.state
		let params = {
			accountNumber: accountNumber,
			accountHolderName: accountHolderName,
			bankName: bankAddList[bankAddListIndex].Name,
			city: '',
			province: '',
			branch: '',
			type: 'W',
			isDefault: checkBox
		}
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.MemberBanks, 'POST', params).then(data => {
			Toast.hide()
			if (data.isSuccess) {
				Toast.success('เพิ่มบัญชีสำเร็จ​')
				this.props.getWithdrawalUserBankAction()
			}
		}).catch(err => {
			Toast.hide()
		})
	}


	//这是默认银行
	setDefault() {
		let { withdrawalsBank, withdrawalsBankIndex } = this.state
		let id = withdrawalsBank[withdrawalsBankIndex].BankAccountID
		//Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PATCHMemberBanksDefault + id + '/SetDefault?', 'PATCH').then(res => {
			Toast.hide()
			if (res.isSuccess == true) {
				//Toast.success('การอัปเดตสำเร็จ')
				this.props.getWithdrawalUserBankAction()
			} else {
				//Toast.fail('ติดตั้งไม่สำเร็จ')
			}
		}).catch(error => {
			Toast.hide()
		})
	}


	creatwWithdrawalsBank(tag, item, i) {
		let flag = (tag ? this.state.withdrawalsBankIndex : this.state.bankAddListIndex) * 1 === i * 1
		return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
			<Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{tag ? item.BankName : item.Name}</Text>
		</View>
	}

	addBankChangeValue(type, value) {
		let Err = RegObj[type].test(value)
		this.setState({
			[`${type}Err`]: Err,
			[type]: value
		}, () => {
			this.changeWithdrawalsBtnStatus()
		})
	}

	changeArrowStatus(tag, arrowFlag) {
		this.setState({
			[tag]: arrowFlag
		})
	}


	onChange(value, withdrawalsBankIndex) {
		this.setState({
			withdrawalsBankIndex
		})
	}

	createCheckBoxView() {
		const { checkBox } = this.state
		return <TouchableOpacity
			onPress={() => {
				this.setState({
					checkBox: !checkBox
				})
			}}
			style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
			<View
				style={{
					width: 18, borderWidth: 1, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 6, height: 18,
					backgroundColor: checkBox ? '#00AEEF' : 'transparent',
					borderColor: checkBox ? '#00AEEF' : '#9B9B9B',
				}}>
				{
					checkBox && <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: -2 }}>✓</Text>
				}
			</View>
			<Text style={{ color: '#58585B' }}>ตั้งเป็นบัญชีธนาคารที่ต้องการ</Text>
		</TouchableOpacity>
	}


	buttonAction() {

	}

	changeisShowModal(isShowModal) {
		this.setState({
			isShowModal
		})
	}

	render() {
		const { compulsoryVerifyEmail, isShowSkip,
			compulsoryVerifyPhone, allowEmail, allowPhone, memberBanksTransactionHistory, isBankList, TotalBal, arrowFlag1, moneyFlag, IsDeposited, arrowFlag2, accountHolderNameErr, provinceErr, cityErr, branchErr, checkBox, accountHolderName, accountNumber, province, city, branch, bankAddList, bankAddListIndex, withdrawalsSettingFlag, withdrawalsSetting, withdrawalsBtnStatus, paymentWithdrawalType, paymentWithdrawal, withdrawalsBankIndex, steps, money, withdrawalsBank } = this.state
		const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', color: window.isBlue ? '#3C3C3C' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
		const { emailStatus, phoneStatus, isShowVerifedModal, isShowModal } = this.state
		let memberBanksTransactionHistoryList = ''
		if (Array.isArray(memberBanksTransactionHistory) && memberBanksTransactionHistory.length && Array.isArray(withdrawalsBank) && withdrawalsBank.length && withdrawalsBankIndex >= 0) {
			memberBanksTransactionHistoryList = memberBanksTransactionHistory.find(v => v.AccountNumber == withdrawalsBank[withdrawalsBankIndex].AccountNumber)
		}
		console.log(isShowSkip)
		return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#0F0F0F' }]}>

			<Modal visible={IsDeposited} animationType='fade' transparent={true}>
				<View style={styles.modalViewContainer}>
					<View style={[{
						width: width * .9, borderRadius: 8, overflow: 'hidden',
						backgroundColor: window.isBlue ? '#FFFFFF' : '#3A3A3C',
						alignItems: 'center'
					}]}>
						<View style={{ backgroundColor: '#16A9E4', height: 44, alignItems: 'center', justifyContent: 'center', width }}>
							<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>แจ้งเตือน</Text>
						</View>



						<Text style={[styles.modalBodyText, { color: window.isBlue ? '#4A4A4A' : '#BFBFBF' }]}>คุณต้องมีประวัติการฝากเงินก่อนถอนเงิน</Text>
						<View style={{ alignItems: 'center', marginBottom: 20 }}>
							<TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#59B96C', width: width * .9 * .6 }]} onPress={() => {
								this.setState({
									IsDeposited: false
								})
								this.props.changeDepositTypeAction({
									type: 'deposit'
								})
							}}>
								<Text style={styles.modalBtnText}>ฝากเงิน</Text>
							</TouchableOpacity></View>
					</View>
				</View>
			</Modal>



			<Modal
				visible={isBankList}
				animationType='fade'
				transparent={true}
			>
				<View style={styles.viewModalContainer}>
					<View style={styles.viewModalBox}>
						<View style={[styles.modalHeader, {
							backgroundColor: window.isBlue ? '#fff' : '#f1f1f3'
						}]}>
							<TouchableOpacity style={styles.modalHeaderBtn} onPress={() => {
								this.setState({
									isBankList: false,
									arrowFlag1: false,
								})
							}}>
								<Text style={styles.modalHeaderText}>Done</Text>
							</TouchableOpacity>
						</View>
						<View style={{ backgroundColor: window.isBlue ? '#f1f1f1' : '#c7c7c7' }}>
							{
								Array.isArray(withdrawalsBank) && withdrawalsBank.length > 0 && <Picker
									selectedValue={withdrawalsBank[withdrawalsBankIndex].value}
									onValueChange={this.onChange.bind(this)}>
									{
										withdrawalsBank.map((v, i) => {
											return <Picker.Item
												key={i}
												label={v.label}
												value={v.value}
											/>
										})
									}
								</Picker>
							}
						</View>
					</View>
				</View>
			</Modal>



			<Modal visible={isShowVerifedModal && isShowModal} animationType='fade' transparent={true}>
				<View style={styles.modalViewContainer}>
					<View style={[{
						width: width * .9, borderRadius: 8, overflow: 'hidden',
						backgroundColor: window.isBlue ? '#FFFFFF' : '#3A3A3C'
					}]}>
						<View style={{ backgroundColor: '#16A9E4', height: 44, alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>การตรวจสอบความปลอดภัย</Text>
						</View>
						<View style={{ alignItems: 'center' }}>
							<Image source={require('./../../../images/finance/withdrawals/smartphone.png')} resizeMode='stretch' style={{ width: 59, height: 51, marginVertical: 20 }}></Image>



							<Text style={[{ color: '#3C3C3C' }]}>เพื่อความปลอดภัยในบัญชีกรุณายืนยันข้อมูลส่วนตัว​</Text>
							<View style={{ marginTop: 10 }}>
								{
									allowPhone && emailStatus && <Text style={[{ color: '#3C3C3C', justifyContent: 'center' }]}><Text style={{ fontSize: 20, }}>・</Text>ยืนยันอีเมล</Text>
								}
								{
									allowEmail && phoneStatus && <Text style={[{ color: '#3C3C3C' }]}><Text style={{ fontSize: 20, }}>・</Text>ยืนยันเบอร์โทร</Text>
								}
							</View>
							<View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10 }}>
								<TouchableOpacity style={[
									styles.modalBtn,
									{
										width: width * .9 * .42,
										marginRight: 15,
										borderColor: '#59B96C',
										borderWidth: 1,
										backgroundColor: '#fff'
									}
								]} onPress={() => {
									this.setState({
										isShowVerifedModal: false
									})
									this.props.changeDepositTypeAction({
										type: 'deposit'
									})
								}}>
									<Text style={[styles.modalBtnText, { color: '#3C3C3C' }]}>ยกเลิกการถอน</Text>
								</TouchableOpacity>
								<TouchableOpacity style={[styles.modalBtn, {
									width: width * .9 * .42, backgroundColor: '#59B96C'
								}]} onPress={() => {
									this.setState({
										isShowVerifedModal: false
									})
									this.goPhoneEmailVerify()
								}}>
									<Text style={styles.modalBtnText}>ยืนยันเลย</Text>
								</TouchableOpacity>
							</View>


							{
								isShowSkip && <TouchableOpacity style={{
									paddingBottom: 25
								}} onPress={() => {
									this.setState({
										isShowVerifedModal: false,
										isShowModal: false
									})
								}}>
									<Text style={{ color: '#06ADEF', textDecorationLine: 'underline' }}>ยืนยันภายหลัง</Text>
								</TouchableOpacity>
							}
						</View>
					</View>
				</View>
			</Modal>


			<KeyboardAwareScrollView>
				<View style={[styles.paymentWithdrawalBox]}>
					{
						paymentWithdrawal.length > 0 && paymentWithdrawal.map((v, i) => {
							let flag = paymentWithdrawalType === v.code
							return <TouchableOpacity key={i} onPress={this.getWithdrawsDetail.bind(this, v.code, true)} style={[styles.paymentWithdrawalWrap, { backgroundColor: window.isBlue ? (flag ? '#00AEEF' : '#fff') : (flag ? '#00CEFF' : '#212121'), borderColor: window.isBlue ? (flag ? '#00AEEF' : '#fff') : (flag ? '#00CEFF' : '#fff') }]}>
								<Image source={flag ? (window.isBlue ? WithdrawalIconActive1[v.code] : WithdrawalIconActive2[v.code]) : (window.isBlue ? WithdrawalIcon1[v.code] : WithdrawalIcon2[v.code])} resizeMode='stretch' style={styles[`withdrawal${v.code}Icon`]}></Image>
								<Text style={[{
									color: window.isBlue ? (flag ? '#fff' : '#A3A3A3') : '#fff', flexWrap: 'wrap', lineHeight: 12,
									textAlign: 'center', fontSize: 12
								}]}>{v.name}</Text>
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


				<View style={styles.withdrawalsContainer}>
					{
						withdrawalsBank.length > 0 ? <View>
							<View style={[styles.limitLists]}>
								<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ยอดการถอน <RedStar /></Text>
								<View style={styles.moneyInput}>
									<TextInput
										value={money}
										keyboardType='decimal-pad'
										placeholder={`กรุณากรอกจำนวนมากกว่า ${toThousands(withdrawalsSetting.MinBal)}`}
										style={[styles.inputBorder, PasswordInput]}
										onChangeText={(value) => {
											let money = getDoubleNum(value)
											this.setState({
												money
											}, () => {
												this.changeWithdrawalsBtnStatus()
											})
										}}
									/>
								</View>
								{
									withdrawalsSettingFlag && <Text style={[styles.depositMoneyText1, { color: window.isBlue ? '#B1B1B1' : '#fff' }]}>โอนเงินต่อรายการ : ขั้นต่ำ <Text style={styles.depositMoneyText2}>{toThousands(withdrawalsSetting.MinBal, '', 'บาท')} สูงสุด {toThousands(withdrawalsSetting.MaxBal, '', 'บาท')}</Text></Text>
								}
								{
									!moneyFlag && (money + '').length > 0 && withdrawalsSetting.MinBal > money && <Text style={[styles.depositMoneyText1, { color: 'red' }]}>จำนวนเงินต้องไม่ต่ำกว่า {toThousands(withdrawalsSetting.MinBal, '', 'บาท')}</Text>
								}
								{
									!moneyFlag && (money + '').length > 0 && withdrawalsSetting.MaxBal < money && <Text style={[styles.depositMoneyText1, { color: 'red' }]}>จำนวนเงินต้องไม่สูงกว่า {toThousands(withdrawalsSetting.MaxBal, '', 'บาท')}</Text>
								}
							</View>

							{
								this.props.memberInforData.IsSingleDeposit && Array.isArray(withdrawalsBank) && withdrawalsBank.length == 1
									?
									null
									:
									<View >
										<View style={[styles.limitLists]}>
											<TouchableOpacity style={[styles.addBankBox1]} onPress={() => {
												Actions.NewBank({
													bankType: 'W',
													fromPage: 'withdrawals',
													memberBanksTransactionHistory: () => {
														this.memberBanksTransactionHistory()
													}
												})
											}}>
												<Text style={[styles.addBankBoxTExt]}>+  เพิ่มบัญชีธนาคารใหม่</Text>
											</TouchableOpacity>
										</View>
									</View>
							}



							<View style={[styles.limitLists]}>
								<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>บัญชีธนาคาร <RedStar /></Text>
								<TouchableOpacity
									onPress={() => {
										if (withdrawalsBank.length <= 1) return
										this.setState({
											isBankList: true,
											arrowFlag1: true
										})
									}}
									style={[styles.limitModalDropdownTextWrap, PasswordInput, {
										justifyContent: 'space-between'
									}]}>
									<Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff', width: width * .6 }]}>{withdrawalsBank[withdrawalsBankIndex].BankName}</Text>
									<Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff', }]}>{withdrawalsBank[withdrawalsBankIndex].AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
									{
										withdrawalsBank.length > 1 &&
										<ModalDropdownArrow arrowFlag={arrowFlag1} />
									}
								</TouchableOpacity>
							</View>


							{
								this.createCheckBoxView()
							}



							<View style={{ backgroundColor: '#fff', paddingHorizontal: 10, paddingTop: 8, marginBottom: 50, marginTop: 10 }}>
								<Text style={styles.bankInforList3}>{withdrawalsBank[withdrawalsBankIndex].BankName}</Text>
								<Text style={styles.bankInforList3}>{withdrawalsBank[withdrawalsBankIndex].AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
								{
									Boolean(Array.isArray(memberBanksTransactionHistory) && memberBanksTransactionHistory.length > 0) && Boolean(memberBanksTransactionHistoryList) && <View style={{ marginTop: 8 }}>
										<Text style={styles.bankInforList3}>จำนวนครั้งที่ถอน : {memberBanksTransactionHistoryList.TotalUpToDateTransaction}</Text>
										<Text style={styles.bankInforList3}>จำนวนรวมยอดที่ถอน : {memberBanksTransactionHistoryList.TotalUpToDateAmount}</Text>
									</View>
								}

								<View style={{
									marginTop: 8,
									marginBottom: 8,
									width: width - 20,
									marginHorizontal: -10,
									backgroundColor: '#F4F4F5',
									height: 2,

								}}></View>

								<View style={[styles.bankInforList, {
								}]}>
									<Text style={styles.bankInforList1}>ชื่อธนาคาร</Text>
									<Text style={styles.bankInforList2}>{withdrawalsBank[withdrawalsBankIndex].BankName}</Text>
								</View>
								<View style={styles.bankInforList}>
									<Text style={styles.bankInforList1}>ชื่อจริง</Text>
									<Text style={styles.bankInforList2}>{withdrawalsBank[withdrawalsBankIndex].AccountHolderName}</Text>
								</View>
								<View style={styles.bankInforList}>
									<Text style={styles.bankInforList1}>บัญชีธนาคาร</Text>
									<Text style={styles.bankInforList2}>{withdrawalsBank[withdrawalsBankIndex].AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
								</View>
								{
									false && <View>
										<View style={styles.bankInforList}>
											<Text style={styles.bankInforList1}>จังหวัด</Text>
											<Text style={styles.bankInforList2}>{withdrawalsBank[withdrawalsBankIndex].Province}</Text>
										</View>
										<View style={styles.bankInforList}>
											<Text style={styles.bankInforList1}>อำเภอ</Text>
											<Text style={styles.bankInforList2}>{withdrawalsBank[withdrawalsBankIndex].City}</Text>
										</View>
										<View style={styles.bankInforList}>
											<Text style={styles.bankInforList1}>สาขา</Text>
											<Text style={styles.bankInforList2}>{withdrawalsBank[withdrawalsBankIndex].Branch}</Text>
										</View>
									</View>
								}
							</View>
						</View>
							:
							<View>
								{
									this.createCheckBoxView()
								}

								{/* 银行选择 */}
								{
									bankAddList.length > 0 && <View style={[styles.limitLists]}>
										<Text style={[styles.limitListsText, { color: window.isBlue ? '#58585B' : '#fff' }]}>ชื่อธนาคาร</Text>
										<ModalDropdown
											animated={true}
											options={bankAddList}
											renderRow={this.creatwWithdrawalsBank.bind(this, false)}
											onSelect={bankAddListIndex => {
												this.setState({
													bankAddListIndex
												})
											}}
											onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag2', true)}
											onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag2', false)}
											style={[styles.limitModalDropdown, PasswordInput]}
											dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: bankAddList.length < 10 ? bankAddList.length * 40 : 402 }]}
										>
											<View style={[styles.limitModalDropdownTextWrap]}>
												<Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{bankAddList[bankAddListIndex].Name}</Text>
												<ModalDropdownArrow arrowFlag={arrowFlag2} />
											</View>
										</ModalDropdown>
									</View>
								}


								<View style={[styles.limitLists]}>
									<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ชื่อจริง <RedStar /></Text>
									<View style={styles.moneyInput}>
										<TextInput
											value={getName(accountHolderName)}
											keyboardType='decimal-pad'
											editable={false}
											style={[styles.inputBorder, PasswordInput, { backgroundColor: '#E5E6E8' }]}
										/>
									</View>
									<Text style={{ color: '#B1B1B1', fontSize: 12 }}>ไม่สามารถแก้ไขได้ชื่อผู้ฝากต้องเป็นชื่อเดียวกับชื่อจริงที่คุณลงทะเบียนไว้</Text>
								</View>

								<View style={[styles.limitLists]}>
									<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>บัญชีธนาคาร <RedStar /></Text>
									<View style={styles.moneyInput}>
										<TextInput
											maxLength={19}
											value={accountNumber}
											keyboardType='decimal-pad'
											placeholder={`เลขบัญชีธนาคารจะต้องมี 10~19 หลัก`}
											placeholderTextColor={'#58585B'}
											style={[styles.inputBorder, PasswordInput]}
											onChangeText={value => {
												let accountNumber = GetOnlyNumReg(value)
												this.setState({
													accountNumber
												}, () => {
													this.changeWithdrawalsBtnStatus()
												})
											}}
										/>
									</View>
								</View>


								<TouchableOpacity onPress={() => {
									withdrawalsBtnStatus && this.addWithdrawalBank()
								}}
									style={[styles.closeBtnWrap, { position: 'relative', width: width - 20, marginHorizontal: 0, marginTop: 40, backgroundColor: withdrawalsBtnStatus ? '#00AEEF' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]}>
									<Text style={styles.closeBtnText}>บันทึก</Text>
								</TouchableOpacity>
							</View>
					}
				</View>
			</KeyboardAwareScrollView >
			{
				withdrawalsBank.length > 0 && <TouchableOpacity onPress={() => { withdrawalsBtnStatus && this.withdrawalsBtn() }} style={[styles.closeBtnWrap, { backgroundColor: withdrawalsBtnStatus ? '#00AEEF' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]}>
					<Text style={styles.closeBtnText}>ถอนเงิน</Text>
				</TouchableOpacity>
			}

		</View >
	}
}

export default Withdrawals = connect(
	(state) => {
		return {
			memberInforData: state.memberInforData,
			balanceInforData: state.balanceInforData,
			withdrawalUserBankData: state.withdrawalUserBankData,
			withdrawalLbBankData: state.withdrawalLbBankData,
		}
	}, (dispatch) => {
		return {
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
			getMemberInforAction: () => dispatch(getMemberInforAction()),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			getWithdrawalUserBankAction: () => dispatch(getWithdrawalUserBankAction()),
			getWithdrawalLbBankAction: () => dispatch(getWithdrawalLbBankAction()),
		}
	}
)(WithdrawalsContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff',
		paddingBottom: 50
	},
	modalViewContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalViewBox: {
		width: width * .9,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#EFEFEF',
		alignItems: 'center',
		paddingVertical: 40
	},
	withdrawalsContainer: {
		paddingHorizontal: 10,
		paddingTop: 10,
		backgroundColor: '#F4F4F5'
	},
	modalBodyHead: {
		height: 40,
		backgroundColor: '#25AAE1',
		justifyContent: 'center',
		alignItems: 'center',

	},
	modalBodyHeadText: {
		color: '#fff'
	},
	modalBtnText: {
		color: '#fff'
	},
	modalBodyText: {
		color: '#262626',
		textAlign: 'center',
		paddingBottom: 20,
		paddingTop: 10,
		width: width * .8,
	},
	phcTextBox: {
		width: 60,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 1000,
		backgroundColor: '#E2141C',
		marginBottom: 5
	},
	phcTextBoxText: {
		fontWeight: 'bold',
		fontSize: 30,
		color: '#fff'
	},
	noBankText1: {
		fontWeight: 'bold',
		fontSize: 16
	},
	modalBtn: {
		height: 36,
		width: width * .8,
		backgroundColor: '#25AAE1',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	limitLists: {
		marginBottom: 15,
	},
	limitDropdownStyle: {
		marginTop: 10,
		width: width - 20,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4
	},
	limitModalDropdownTextWrap: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: width - 20,
		height: 40,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#F2F2F2',
		justifyContent: 'space-between',
		borderBottomWidth: 2,
		borderBottomColor: '#4C4C4C34'
	},
	limitModalDropdownText: {
		fontSize: 13,
	},
	limitModalDropdownList: {
		justifyContent: 'center',
		paddingLeft: 6,
		paddingRight: 6,
		paddingVertical: 6
	},
	limitModalDropdownListText: {
		color: '#000'
	},
	addBankCircle: {
		borderRadius: 50,
		width: 22,
		height: 22,
		borderWidth: 2,
		borderColor: '#fff',
		marginRight: 10,
		alignItems: 'center',
		justifyContent: 'center'
	},
	addBankCircleTxt: {
		color: '#fff',
		textAlign: 'center',
		fontWeight: 'bold'
	},
	addBankTextInfor: {
		color: '#25AAE1',
		textDecorationLine: 'underline',
		fontSize: 13
	},
	bankDetailBox: {

	},
	bankTextInforBox: {
		marginBottom: 15
	},
	bankTextInfor1: {
		color: 'rgba(0, 0, 0, .5)',
		fontSize: 13
	},
	bankInforBox: {
		height: 40,
		justifyContent: 'center',
		borderRadius: 4,
		paddingLeft: 10,
		marginTop: 5
	},
	bankTextInfor2: {
		color: 'rgba(0, 0, 0, 1)'
	},
	limitListsText: {
		color: '#000',
		marginBottom: 5
	},
	paymentWithdrawalBox: {
		padding: 10,
		paddingBottom: 10,
		backgroundColor: '#E5E6E8',
		flexDirection: 'row',
	},
	depositMoneyText1: {
		color: '#000',
		fontSize: 12,
		marginTop: 5
	},
	depositMoneyText2: {
		color: '#B1B1B1',
		fontSize: 10
	},
	paymentWithdrawalWrap: {
		paddingTop: 5,
		paddingBottom: 5,
		borderRadius: 4,
		width: 80,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		marginRight: 10
	},
	withdrawalLBIcon: {
		width: 26,
		height: 26
	},
	withdrawalEZWIcon: {
		height: 30,
		width: 70
	},
	moneyInput: {
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	checkBoxText: {
		color: '#000',
		fontSize: 12,
		marginLeft: 10
	},
	inputBorder: {
		borderWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		height: 40,
		width: width - 20,
		borderRadius: 4,
		justifyContent: 'center',
		borderBottomWidth: 2,
		borderBottomColor: '#4C4C4C34'
	},
	closeBtnWrap: {
		position: 'absolute',
		bottom: 10,
		width: width - 20,
		height: 40,
		marginHorizontal: 10,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center'
	},
	closeBtnText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff'
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
	addBankBoxTExt: {
		color: '#fff',
	},
	addBankBox1: {
		height: 36,
		backgroundColor: '#1CBC63',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 4,
		marginHorizontal: 40
	},
	viewModalContainer: {
		width,
		height,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, .2)',
		position: 'relative'
	},
	viewModalBox: {
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	modalHeaderText: {
		color: '#26AAE2',
		fontSize: 18
	},
	modalHeaderBtn: {
		paddingHorizontal: 20,
		height: 44,
		justifyContent: 'center'
	},
	modalHeader: {
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: '#fff'
	},
	bankInforList: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 6
	},
	bankInforList1: {
		color: '#000000',
		width: 100,
	},
	bankInforList2: {
		color: '#58585B',
		opacity: .5,
		width: width - 150,
		flexWrap: 'wrap'
	},
	bankInforList3: {
		color: '#58585B',
		width: width - 40,
		flexWrap: 'wrap'
	}
})