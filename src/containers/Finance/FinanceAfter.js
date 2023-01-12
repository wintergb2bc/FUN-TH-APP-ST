import React from 'react'
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Dimensions, Image, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { toThousands, toThousandsAnother } from './../../actions/Reg'
import { changeDepositTypeAction, changeBonusTurnOverInfor, changePromotionIndexAction } from '../../actions/ReducerAction'
import Touch from 'react-native-touch-once'
import moment from 'moment'
import Toast from '@/containers/Toast'

const { width, height } = Dimensions.get('window')
const PageInfor = {
	deposit: {
		//title: 'GỬI TIỀN',
		img: require('./../../images/finance/financeAfter/transferAfter.png'),
		text1: 'กำลังดำเนินการ',
		text2: 'Bạn vui lòng chờ cập nhật',
		inputText: 'Số Tiền Gửi'
	},
	transfer: {
		title: 'Chuyển Khoản',
		img: require('./../../images/finance/financeAfter/transferAfter.png'),
		text1: 'Chuyển khoản thành công',
		text2: 'Khuyến mãi được áp dụng',
		inputText: 'Số Tiền chuyển'
	},
	withdrawal: {
		title: 'RÚT TIỀN',
		img: require('./../../images/finance/financeAfter/withdrawalAfter.png'),
		text1: 'Gửi lệnh thành công',
		text2: 'Bạn vui lòng chờ cập nhật',
		inputText: 'Số Tiền Rút'
	}
}

class FinanceAfterContainer extends React.Component {
	constructor(props) {
		super(props)
		let isLb = ['LB', 'MMLB', 'BQR'].includes(this.props.paymentMethod)
		this.state = {
			type: this.props.financeType,
			countdownNum: isLb ? 1800 : 600,
			countdownNumMMSS: isLb ? '30:00' : '10:00'
		}
	}

	componentDidMount() {
		this.props.navigation.setParams({
			title: PageInfor[this.state.type].title
		})
		this.state.type === 'deposit' && this.makeNumInterval()
	}

	componentWillUnmount() {
		this.props.changeBonusTurnOverInfor({})
		this.intervalNum && clearInterval(this.intervalNum)
	}

	makeNumInterval() {
		function addZero(n) {
			return n < 10 ? '0' + n : n
		}
		let countdownNum = this.state.countdownNum
		this.intervalNum = setInterval(() => {
			if (countdownNum !== 0) {
				countdownNum--
				this.setState({
					countdownNum
				})
				let min = addZero(Math.floor(countdownNum / 60 % 60))
				let sec = addZero(Math.floor(countdownNum % 60))
				this.setState({
					countdownNumMMSS: min + ':' + sec
				})
			} else {
				Actions.pop()
				this.intervalNum && clearInterval(this.intervalNum)
				this.props.changeDepositTypeAction({
					type: 'records',
					index: Object.keys(PageInfor).findIndex(v => v === 'deposit')
				})
			}
		}, 1000)
	}

	conformPaymentApplications() {
		Toast.loading('กำลังโหลดข้อมูล...', 20000000000)
		const transactionId = this.props.transactionId
		let data = {
			"depositingBankAcctNum": "",
			"offlineDepositDate": moment(new Date()).format('YYYY-MM-DDTHH:MM:SS') + 'Z',
			"fileName": "",
			"fileByte": "",
			"hasQR": false
		}
		fetchRequest(ApiPort.PaymentApplications1 + `/${transactionId}/ConfirmStep?`, 'POST', data).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				Actions.pop()
				this.props.changeDepositTypeAction({
					type: 'records',
					index: Object.keys(PageInfor).findIndex(v => v === type)
				})
			} else {
				Toast.fail(res.errorMessage, 2)
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	render() {
		const { countdownNumMMSS, type } = this.state
		const bonusTurnOverInfor = this.props.bonusTurnOverInforData
		return bonusTurnOverInfor.isSuccess ?
			<View>
				<Modal animationType='fade' transparent={true} visible={true}>
					<View style={styles.homeModalContainer}>
						<View style={styles.modalBox}>
							<Image source={require('./../../images/finance/financeAfter/transferAfter.png')}
								style={[styles.depositImg]}
								resizeMode='stretch'></Image>

							<Text style={[{ color: '#25B869', fontSize: 20, fontWeight: 'bold' }]}>กำลังดำเนินการ</Text>
							<Text style={[{ color: '#323232', fontSize: 18, marginBottom: 15, marginTop: 5 }]}>เงินฝากจะเข้าสู่บัญชีของคุณใน 15 นาที</Text>

							<View>
								<Text style={[styles.depostMoney]}>ยอดฝาก</Text>
								<View style={[styles.depostMoneyBox, { borderColor: window.isBlue ? '#E5E5E5' : '#7F7F7F', backgroundColor: window.isBlue ? '#F2F2F2' : '#7F7F7F' }]}>
									<Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{toThousands(this.props.money)}</Text>
								</View>
							</View>

							{
								bonusTurnOverInfor.isSuccess && <View style={[styles.targetWalletWrap]}>
									<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ข้อมูลโบนัส</Text>
									<View style={styles.preferentialList}>
										<View style={styles.preferentialListBox}>
											<Text style={[styles.preferential]}>โบนัสที่ขอรับ</Text>
											<Text style={[styles.preferentialTxt]}>{toThousands(bonusTurnOverInfor.applyAmount)}</Text>
										</View>

										<View style={styles.preferentialListBox}>
											<Text style={[styles.preferential]}>โบนัสที่ได้รับ</Text>
											<Text style={[styles.preferentialTxt]}>{toThousands(bonusTurnOverInfor.bonusGiven)}</Text>
										</View>

										<View style={styles.preferentialListBox}>
											<Text style={[styles.preferential]}>ยอดเทิร์นของโบนัส</Text>
											<Text style={[styles.preferentialTxt]}>{toThousands(bonusTurnOverInfor.turnOver)}</Text>
										</View>
									</View>
								</View>
							}


							<View style={styles.transferBtnWrap}>
								<TouchableOpacity style={[styles.LBdepositPageBtn1]} onPress={() => {
									Actions.pop()
									Actions.pop()
									Actions.pop()
									this.props.changeBonusTurnOverInfor({ isSuccess: false })
									Actions.PreferentialRecords()
								}}>
									<Text style={[styles.LBdepositPageBtnText1, { color: '#00AEEF' }]}>สถานะโบนัส</Text>
								</TouchableOpacity>

								<TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: '#00AEEF' }]} onPress={() => {
									Actions.pop()
									Actions.pop()
									Actions.pop()
									this.props.changeBonusTurnOverInfor({ isSuccess: false })
									this.props.changeDepositTypeAction({
										type: 'records',
										index: Object.keys(PageInfor).findIndex(v => v === type)
									})

								}}>
									<Text style={[styles.LBdepositPageBtnText1, { color: '#fff' }]}>กลับสู้หน้าประวัติรายการ</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
			</View>
			:
			<View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#000', marginTop: -width * .3 }]}>
				<Image source={PageInfor[type].img} style={[styles.depositImg, styles[`top${type}Img`], {
					height: .65 * width * .82,
					width: .65 * width,
					marginTop: 0
				}]} resizeMode='stretch'></Image>
				<Text style={styles.depositText}>{PageInfor[type].text1}</Text>
				<Text style={{ color: '#36AAE1', fontSize: 18, fontWeight: '400', marginVertical: 4 }}>{countdownNumMMSS}</Text>
				<Text style={{ textAlign: 'center', color: '#323232', fontSize: 13, marginBottom: 20 }}>รายการฝากจะปรับเข้าสู่บัญชีอัตโนมัติเมื่อทำการโอนเงินสำเร็จ</Text>

				<TouchableOpacity style={styles.depositBtn} onPress={() => {
					Actions.pop()
					Actions.Records()


					window.PiwikMenberCode('Transaction Record​', 'View', `View_TransactionRecord_Deposit`)
				}}>
					<Text style={styles.depositBtnText}>กลับสู่หน้าประวัติรายการ</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => {
					Actions.pop()
				}} style={[styles.depositBtn, {
					backgroundColor: '#fff'
				}]} >
					<Text style={[styles.depositBtnText, { color: '#00AEEF' }]}>กลับสู่หน้าฝาก</Text>
				</TouchableOpacity>

				{
					// <TouchableOpacity style={styles.depositBtn} onPress={() => {
					// 	// if (type === 'deposit' && this.props.paymentMethod === 'PHC') {
					// 	// 	this.conformPaymentApplications()
					// 	// } else {
					// 	Actions.pop()
					// 	this.props.changeDepositTypeAction({
					// 		type: 'records',
					// 		index: Object.keys(PageInfor).findIndex(v => v === type)
					// 	})

					// 	this.props.paymentMethod === 'VP' && window.PiwikMenberCode('Vietelpay_successful_history')
					// 	//}
					// }}>
					// 	<Text style={styles.depositBtnText}>Xem Lịch Sử Giao Dịch</Text>
					// </TouchableOpacity>
				}
			</View>
	}
}

export default FinanceAfter = connect(
	(state) => {
		return {
			bonusTurnOverInforData: state.bonusTurnOverInforData
		}
	}, (dispatch) => {
		return {
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
			changeBonusTurnOverInfor: (data) => dispatch(changeBonusTurnOverInfor(data)),
			changePromotionIndexAction: (data) => dispatch(changePromotionIndexAction(data))
		}
	}
)(FinanceAfterContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		position: 'relative',
		paddingHorizontal: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	depositImg: {
		marginBottom: 0,
		marginTop: 20
	},
	topdepositImg: {
		height: .374 * width,
		width: .454 * width,
	},
	toptransferImg: {
		height: .374 * width,
		width: .34 * width,
	},
	topwithdrawalImg: {
		height: .258 * width,
		width: .45 * width,
	},
	headerTop: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 15
	},
	depositText: {
		fontSize: 16,
		color: '#33C85D',
		fontWeight: 'bold',
		marginBottom: 5
	},
	depositText1: {},
	depostMoney: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 15,
		marginBottom: 5
	},
	depostMoneyBox: {
		borderWidth: 1,
		backgroundColor: '#E5E5E5',
		borderRadius: 4,
		height: 40,
		justifyContent: 'center',
		paddingLeft: 10,
		marginBottom: 15,
		// shadowColor: '#00000029',
		// shadowRadius: 4,
		// shadowOpacity: .8,
		// shadowOffset: { width: 2, height: 2 },
		// elevation: 4
	},

	limitListsText: {
		marginBottom: 5,
	},
	preferentialList: {
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingTop: 8,

	},
	preferentialListBox: {},
	preferential: {
		color: '#000',
		textAlign: 'center',
		fontSize: 13
	},
	preferent: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		padding: 8,
		paddingHorizontal: 5,
		borderRadius: 4,
		marginBottom: 10
	},
	preferentialTitle: {
		color: '#000',
		fontSize: 13,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	preferentialTxt: {
		color: '#000',
		textAlign: 'center',
		fontWeight: 'bold',
		paddingTop: 5,
	},
	promationBtn: {
		borderWidth: 1,
		borderColor: '#25AAE1',
		borderRadius: 2,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center'
	},
	promationBtnText: {
		color: '#25AAE1',
		fontWeight: 'bold'
	},
	depositBtn: {
		width: width - 20,
		marginHorizontal: 10,
		height: 40,
		backgroundColor: '#00AEEF',
		borderWidth: 1,
		borderColor: '#00AEEF',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		marginTop: 10
	},
	depositBtnText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	cancleBtn: {
		height: 50,
		alignItems: 'center',
		justifyContent: 'center'
	},
	homeModalContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		justifyContent: 'flex-end'
	},
	modalBox: {
		height: height * .9,
		backgroundColor: '#fff',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		overflow: 'hidden',
		alignItems: 'center'
	},
	depositImg: {
		height: .374 * width,
		width: .454 * width,
		marginTop: 20
	},
	depostMoneyBox: {
		borderWidth: 1,
		backgroundColor: '#E5E5E5',
		borderRadius: 4,
		height: 40,
		justifyContent: 'center',
		paddingLeft: 10,
		marginBottom: 15,
		width: width - 20
	},
	transferBtnWrap: {

	},
	LBdepositPageBtn1: {
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		width: width - 20,
		marginHorizontal: 10,
		borderWidth: 1,
		borderColor: '#00AEEF',
		backgroundColor: '#fff',
		borderRadius: 6,
		marginTop: 10
	},
	LBdepositPageBtnText1: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	preferentialListBox: {
		width: (width - 30) / 3,
	},
	homeModalContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		justifyContent: 'flex-end'
	},
	modalBox: {
		height: height * .85,
		backgroundColor: '#fff',
		borderTopRightRadius: 20,
		borderTopLeftRadius: 20,
		overflow: 'hidden',
		alignItems: 'center'
	},
	targetWalletWrap: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		padding: 8,
		paddingHorizontal: 5,
		borderRadius: 4,
		marginBottom: 10,
		backgroundColor: '#fff'
	},
})