import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native'
import { connect } from 'react-redux'
import ModalDropdown from 'react-native-modal-dropdown'
import * as Animatable from 'react-native-animatable'
import BankCenter from './BankCenter'
import Deposit from './Deposit'
import Withdrawals from './Withdrawals'
import Transfer from './Transfer'
import Records from './Records'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction } from '../../actions/ReducerAction'
import { toThousands } from '../../actions/Reg'
import { Actions } from 'react-native-router-flux'
import FreeBetDepositInforModal from './../FreeBet/FreeBetModal/FreeBetDepositInforModal'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import Toast from '@/containers/Toast'
import moment from 'moment'
const { width } = Dimensions.get('window')
const AnimatableView = Animatable.View
const FinanceType = [
	{
		title: 'ฝากเงิน',
		type: 'deposit',
		piwikMenberText: 'Deposit_mybanking'
	},
	{
		title: 'โอนเงิน',
		type: 'transfer',
		piwikMenberText: 'Transfer_mybaning'
	},
	{
		title: 'ถอนเงิน',
		type: 'withdrawal',
		piwikMenberText: 'Withdraw_mybanking'
	},

	{
		title: 'ข้อมูล',
		type: 'banks',
		piwikMenberText: 'Bankinginfo_mybanking'
	},
	{
		title: 'ประวัติ',
		type: 'records',
		piwikMenberText: 'Transactionrecords_mybanking'
	}
]
class FinanceContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			type: 'deposit',
			recordIndex: 0,
			balanceInfor: [],
			memberInfor: {},
			fromPage: '',
			isShowSbTip: false,
			arrowFlag: false,
			isShowKenoTip: false,
		}
	}

	componentDidMount(props) {
		if (this.props.balanceInforData.length) {
			this.setState({
				balanceInfor: this.props.balanceInforData.filter(v => v.name !== 'TOTALBAL')
			})
		}
		if (this.props.memberInforData) {
			this.setState({
				memberInfor: this.props.memberInforData
			})
		}
		this.props.getMemberInforAction()
		// this.props.getBalanceInforAction()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.balanceInforData.length) {
			this.setState({
				balanceInfor: nextProps.balanceInforData.filter(v => v.name !== 'TOTALBAL')
			})
		}
		if (nextProps && nextProps.memberInforData) {
			this.setState({
				memberInfor: nextProps.memberInforData
			})
		}

		if (nextProps.depositTypeData.type) {
			this.changeFinanceType(nextProps.depositTypeData)
			this.setState({
				recordIndex: nextProps.depositTypeData.index,
			}, () => {
				this.props.changeDepositTypeAction({
					memberInfor: this.props.memberInforData
				})
				this.setState({
					recordIndex: 0,
				})
			})

			let fromPage = nextProps.depositTypeData.fromPage
			if (fromPage) {
				this.setState({
					fromPage
				})
			}
		}
	}

	createWalletList(item, key) {
		const { isShowSbTip, isShowKenoTip } = this.state
		return <View style={styles.WalletModalDropdownList} key={key}>
			<View style={styles.balanceLeft}>
				<View style={[styles.balanceLeftCircle, { backgroundColor: item.color }]}></View>
				<Text style={[styles.WalletModalDropdownListText, { color: window.isBlue ? '#000' : '#fff' }]}>{item.localizedName}</Text>
				{
					(item.name === 'SB') && <TouchableOpacity
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
						onPress={() => {
							Actions.SBGuiderModal({
								istype: true
							})
							this.view1.hide()
							this.changeArrowStatus(false)

						}}
						style={styles.walletSbIconBox}>
						<Image
							resizeMode='stretch'
							source={require('./../../images/finance/walletSbIcon0.png')}
							style={styles.walletSbIcon}
						></Image>
					</TouchableOpacity>
				}
			</View>
			<Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{toThousands(item.balance)}</Text>
		</View>
	}

	changeFinanceType({ type, piwikMenberText }, flag) {
		const { memberInfor } = this.state
		let IsDeposited = memberInfor.IsDeposited * 1 === 1
		if (!memberInfor.MemberCode) return




		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableDeposit && selfExclusions.SelfExcludeDuration > 0 && (['deposit', 'withdrawal'].includes(type))) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}

		// if (type === 'withdrawal' && !IsDeposited) {
		// 	this.setState({
		// 		type,
		// 	})
		// 	return
		// }
		// if (type === 'withdrawal' && flag) {
		// 	let contacts = memberInfor.Contacts || memberInfor.contacts
		// 	let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
		// 	let emailStatus = tempEmail ? (tempEmail.Status.toLocaleLowerCase() === 'verified') : false
		// 	let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
		// 	let phoneStatus = tempPhone ? (tempPhone.Status.toLocaleLowerCase() === 'verified') : false

		// 	if (!(emailStatus && phoneStatus)) {
		// 		Actions.WithdrawalPEVerification()
		// 		return
		// 	}
		// 	// if (emailStatus) {
		// 	// 	Actions.Verification({
		// 	// 		fillType: 'email',
		// 	// 		fromPage: 'homeAccount',
		// 	// 		ServiceAction: 'ContactVerification'
		// 	// 	})
		// 	// 	return
		// 	// }

		// 	// if (phoneStatus) {
		// 	// 	Actions.Verification({
		// 	// 		fillType: 'phone',
		// 	// 		fromPage: 'homeAccount',
		// 	// 	})
		// 	// 	return
		// 	// }
		// }
		if (['deposit', 'withdrawal', 'transfer'].some(v => v == type)) {
			this.props.getBalanceInforAction()
		}
		if (this.state.type === type) return
		this.setState({
			type,
		})

		let pageTitle = FinanceType.find(v => v.type === type).title
		this.props.navigation.setParams({
			title: pageTitle
		})

		piwikMenberText && window.PiwikMenberCode(piwikMenberText)
	}

	handleViewRef = ref => this.handleFinanceView = ref

	changeFreeBetDepositInforModal(fromPage) {
		this.setState({
			fromPage
		})
	}

	changeArrowStatus(arrowFlag) {
		this.setState({
			arrowFlag,
		})
	}


	transfer(item, flag) {  //一鍵轉
		if (!(Array.isArray(this.props.balanceInforData) && this.props.balanceInforData.length)) {
			return
		}
		let totalmoney = this.props.balanceInforData.find(v => v.name === 'TOTALBAL').balance
		// 一键
		if (item.state === 'UNDERMAINTENANCE') {
			Toast.fail('กระเป๋าเงินอยู่ระหว่างปรับปรุง โปรดลองอีกครั้งในภายหลัง', 2)
			return
		}

		if (totalmoney <= 0) {
			Toast.fail('ยอดเงินไม่เพียงพอม กรุณาฝากเงิน', 2)
			//该帐户的余额不足，无法转移。 请汇款赚钱。
			return
		}

		let data = {
			fromAccount: 'All',
			toAccount: 'MAIN',
			amount: 0,
			bonusId: 0,
			blackBoxValue: E2Backbox,
			e2BlackBoxValue: E2Backbox,
			bonusCoupon: flag ? '' : 0
		}

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.Transfer, 'POST', data).then(data => {
			Toast.hide()
			if (data.isSuccess) {
				this.props.getBalanceInforAction()
			} else {
				Toast.fail(data.messages, 2)
			}
		}).catch(error => {
			Toast.hide()
			Toast.fail(data.messages, 2)
		})
	}

	handleViewRef1 = ref => this.view1 = ref


	render() {
		const { arrowFlag, fromPage, type, balanceInfor, recordIndex } = this.state
		window.makeFinancePageAnimatable = (translateX) => {
			window.mainPageIndex = 2
			window.makeFadeInTranslation && this.handleFinanceView && this.handleFinanceView.animate && this.handleFinanceView.animate(window.makeFadeInTranslation(translateX), 300)
		}
		let mainInfor = {
			localizedName: 'Tài Khoản Chính',
			balance: 0
		}
		if (Array.isArray(balanceInfor) && balanceInfor.length) {
			let tempMain = balanceInfor.find(v => v.name === 'MAIN')
			if (tempMain) {
				mainInfor = tempMain
			}
		}
		return <AnimatableView ref={this.handleViewRef} easing={'ease-in-out'} style={{ flex: 1, backgroundColor: '#fff' }}>
			{
				fromPage === 'FreeBetPage' && <FreeBetDepositInforModal
					changeFreeBetDepositInforModal={this.changeFreeBetDepositInforModal.bind(this)}
				/>
			}

			<View style={[styles.headBackground, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
				{
					balanceInfor.length > 0 && <ModalDropdown
						ref={this.handleViewRef1}
						animated={true}
						defaultValue={balanceInfor[0].name}
						options={balanceInfor}
						renderRow={this.createWalletList.bind(this)}
						style={[styles.WalletModalDropdown, { borderBottomColor: window.isBlue ? '#f6f6f6' : '#212121' }]}
						onDropdownWillShow={() => {
							this.setState({
								isShowSbTip: false,
								isShowKenoTip: false
							})
							this.props.getBalanceInforAction()
							window.PiwikMenberCode('Allbalance_mybanking')
							this.changeArrowStatus(true)
						}}
						renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => <View></View>}
						defaultIndex={0}
						onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
						dropdownStyle={[styles.WalletDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: balanceInfor.length * 28 }]}
					>
						<View style={styles.walletBox}>
							<View style={styles.walletLeftBox}>
								<View style={[styles.walletLeftBoxCircle, { borderColor: window.isBlue ? '#58585B' : '#00AEEF' }]}>
									<Text style={[styles.walletLeftBoxText1, { color: window.isBlue ? '#58585B' : '#00AEEF' }]}>฿</Text>
								</View>
								<Text style={[styles.walletLeftBoxText2, { color: window.isBlue ? '#58585B' : '#00AEEF' }]}>{balanceInfor[0].localizedName}</Text>
							</View>
							<View style={styles.walletLeftBox}>
								<Text style={[styles.walletRightBoxText1, { color: window.isBlue ? '#58585B' : '#00AEEF' }]}>{toThousands(balanceInfor[0].balance)}</Text>
								<ModalDropdownArrow arrowFlag={arrowFlag} />
							</View>
						</View>
					</ModalDropdown>
				}
				<View style={[styles.financeTypeBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
					{
						FinanceType.map((v, i) => {
							let flag = v.type === type
							return <TouchableOpacity style={[styles.financeTypeWrap, {
								borderBottomColor: !flag ? '#fff' : '#00AEEF'
							}]} key={i} onPress={this.changeFinanceType.bind(this, v, true)}>
								<Text style={[styles.financeTypeText, { color: window.isBlue ? (flag ? '#25AAE1' : 'rgba(0, 0, 0, .4)') : (flag ? '#fff' : 'rgba(255, 255, 255, .3)') }]}>{v.title}</Text>
								{
									//flag && <View style={[styles.financeTypeLine, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]}></View>
								}
							</TouchableOpacity>
						})
					}
				</View>
			</View>

			{
				type == 'deposit' && <AnimatableView style={{ flex: 1 }} animation={'fadeIn'}>
					<Deposit />
				</AnimatableView>
			}

			{
				type == 'withdrawal' && <AnimatableView style={{ flex: 1 }} animation={'fadeIn'}>
					<Withdrawals />
				</AnimatableView>
			}

			{
				type == 'transfer' && <AnimatableView style={{ flex: 1 }} animation={'fadeIn'}>
					<Transfer />
				</AnimatableView>
			}

			{
				type == 'banks' && <AnimatableView style={{ flex: 1 }} animation={'fadeIn'}>
					<BankCenter />
				</AnimatableView>
			}

			{
				type == 'records' && <AnimatableView style={{ flex: 1 }} animation={'fadeIn'}>
					<Records recordIndex={recordIndex} />
				</AnimatableView>
			}
		</AnimatableView>
	}
}

export default Finance = connect(
	(state) => {
		return {
			selfExclusionsData: state.selfExclusionsData,
			memberInforData: state.memberInforData,
			balanceInforData: state.balanceInforData,
			depositTypeData: state.depositTypeData
		}
	}, (dispatch) => {
		return {
			getMemberInforAction: () => dispatch(getMemberInforAction()),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data))
		}
	}
)(FinanceContainer)

const styles = StyleSheet.create({
	headBackground: {
		// backgroundColor: '#fff',
		// shadowOffset: { width: 2, height: 2 },
		// shadowOpacity: 1,
		// shadowRadius: 5,
		// shadowColor: '#DADADA',
		elevation: 4,
		position: 'relative',
		zIndex: 99,
		paddingTop: 4
	},
	balanceLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	balanceLeftCircle: {
		width: 8,
		height: 8,
		borderRadius: 100,
		marginRight: 8
	},
	financeTypeWrap: {
		position: 'relative',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 5,
		borderBottomWidth: 1
	},
	financeTypeBox: {
		height: 40,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around',
		width,
	},
	financeTypeLine: {
		height: 1,
		backgroundColor: '#00AEEF',
		position: 'absolute',
		bottom: 8,
		right: 0,
		left: 0
	},
	financeTypeText: {
		fontWeight: 'bold',
	},
	walletBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 40,
		paddingHorizontal: 10
	},
	walletLeftBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	walletRightBoxText1: {
		color: '#58585B',
		fontWeight: 'bold',
		marginRight: 5
	},
	walletLeftBoxCircle: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 24,
		height: 24,
		borderWidth: 2,
		borderColor: '#58585B',
		borderRadius: 100000,
		marginRight: 5
	},
	walletLeftBoxText1: {
		color: '#58585B',
		fontWeight: 'bold',
		lineHeight: 16,
		fontSize: 16,
		textAlign: 'center',
	},
	walletLeftBoxText2: {
		color: '#58585B'
	},
	WalletModalDropdown: {
		height: 40,
		borderBottomColor: '#f6f6f6',
		borderBottomWidth: 2,
		width,
	},
	WalletDropdownStyle: {
		width,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	WalletModalDropdownList: {
		height: 28,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	walletSbIconBox: {
		marginLeft: 6
	},
	walletSbIcon: {
		width: 18,
		height: 18
	},
	walletSbTipbox: {
		backgroundColor: '#FFF4D0',
		borderWidth: 1,
		borderColor: '#EDE473',
		position: 'absolute',
		padding: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		right: 60,
		top: -55,
		borderRadius: 4,
		zIndex: 10,
		width: width * .7,
		shadowColor: '#0000001A',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	walletSbTipboxText: {
		color: '#676767',
		fontSize: 12,
		flexWrap: 'wrap',
		width: width * .7 - 40
	},
	walletSbTipboxBtn: {
		marginLeft: 8
	},
	walletSbTipboxBtnText: {
		color: '#676767',
		fontSize: 16
	},
	walletSbTipArrow: {
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: 8,
		borderLeftColor: 'transparent',
		borderBottomColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#FFF4D0',
		position: 'absolute',
		left: 110,
		bottom: -15,
		shadowColor: '#0000001A',
		shadowRadius: 8,
		shadowOpacity: .1,
		shadowOffset: { width: 2, height: 2 },
		elevation: 10
	}
})