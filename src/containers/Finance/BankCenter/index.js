import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, TouchableOpacity, Dimensions, Image, DeviceEventEmitter } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Touch from 'react-native-touch-once'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { getDepositUserBankAction, getWithdrawalUserBankAction, memberInforData } from './../../../actions/ReducerAction'
import LoadingBone from './../../Common/LoadingBone'
import { GetOnlyNumReg, RealNameReg, RealNameErrTip, ProvinceReg, CityReg, BranchReg, getName, toThousands } from '../../../actions/Reg'
const { width } = Dimensions.get('window')

class BankCenterContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			depositBank: null,
			withdrawalsBank: null,
			isOpenBank: false,
			bankIndex: -9999,
			memberBanksTransactionHistory: null,
			isShowEditBank: false,
			BankAccountID: ''
		}
	}

	componentDidMount() {
		//this.props.getDepositUserBankAction()
		//this.getDepositUserBank(this.props)


		this.props.getWithdrawalUserBankAction()
		this.getWithdrawalUserBank(this.props)

		this.getMemberBanksTransactionHistory()
	}

	componentWillReceiveProps(nextProps) {
		this.getDepositUserBank(nextProps)
		this.getWithdrawalUserBank(nextProps)
	}

	getDepositUserBank(props) {
		if (props) {
			let depositUserBankData = props.depositUserBankData
			if (Array.isArray(depositUserBankData)) {
				this.setState({
					depositBank: depositUserBankData
				})
			}
		}
	}

	getMemberBanksTransactionHistory(flag) {
		global.storage.load({
			key: 'memberBanksTransactionHistory',
			id: 'memberBanksTransactionHistory'
		}).then(res => {
			this.setState({
				memberBanksTransactionHistory: res
			})
		}).catch(() => { })
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.GetmemberBanksTransactionHistory, 'GET').then(res => {
			Toast.hide()
			if (Array.isArray(res)) {
				let memberBanksTransactionHistory = res.sort((a, b) => b.Code - a.Code)
				this.setState({
					memberBanksTransactionHistory
				})


				global.storage.save({
					key: 'memberBanksTransactionHistory',
					id: 'memberBanksTransactionHistory',
					data: memberBanksTransactionHistory,
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	getWithdrawalUserBank(props) {
		if (props) {
			let withdrawalUserBankData = props.withdrawalUserBankData
			if (Array.isArray(withdrawalUserBankData)) {
				let withdrawalsBank = withdrawalUserBankData.sort((a, b) => b.Code - a.Code)
				this.setState({
					withdrawalsBank
				})
				if (withdrawalsBank.length) {
					this.setState({
						BankAccountID: withdrawalsBank[0].BankAccountID
					})
				}
			}
		}
	}

	deleteCard() {
		let { BankAccountID } = this.state
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.DELETEMemberBanksDefault + BankAccountID + '?', 'DELETE').then(res => {
			Toast.success('ลบธนาคารสำเร็จ', 2000)
			this.props.getDepositUserBankAction()
			this.props.getWithdrawalUserBankAction()
			this.getMemberBanksTransactionHistory()
			this.setState({
				BankAccountID: '',
				isShowEditBank: false,
				bankIndex: -9999999999
			})
			//Actions.pop()
		}).catch(error => {
			Toast.hide()
		})
	}

	//这是默认银行
	setDefault(id, type) {
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PATCHMemberBanksDefault + id + '/SetDefault?', 'PATCH').then(res => {
			Toast.hide()
			if (res.isSuccess == true) {
				Toast.success('การอัปเดตสำเร็จ')
				type === 'Deposit' ? this.props.getDepositUserBankAction() : this.props.getWithdrawalUserBankAction()
			} else {
				Toast.fail('ติดตั้งไม่สำเร็จ')
			}
		}).catch(error => {
			Toast.hide()
		})
	}

	renderNewsBone() {
		return Array.from({ length: 2 }, v => v).map((v, i) => {
			return <View
				key={i}
				style={[styles.bankBox, styles.bankBoxWrap]}
			>
				<LoadingBone></LoadingBone>
			</View>
		})
	}


	render() {
		const { isShowEditBank, BankAccountID, memberBanksTransactionHistory, withdrawalsBank, depositBank, isOpenBank, bankIndex } = this.state
		const arrowRightImg = window.isBlue ? require('./../../../images/common/arrowIcon/right0.png') : require('./../../../images/common/arrowIcon/right1.png')
		return <View style={[styles.viewContainer, {
			paddingBottom: isShowEditBank ? 80 : 0
		}]}>
			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			>
			{
				// IsSingleDeposit=true，是指只能有一個銀行資料，如果都沒有新增過銀行資料，新增按鈕要顯示
			}
				{
					((this.props.memberInforData.IsSingleDeposit && Array.isArray(withdrawalsBank) && withdrawalsBank.length == 0)
						|| !this.props.memberInforData.IsSingleDeposit)
					&&
					<Touch onPress={() => {
						this.setState({
							isShowEditBank: false
						})
						Actions.NewBank({
							bankType: 'W',
							getMemberBanksTransactionHistory: () => {
								this.getMemberBanksTransactionHistory()
							}
						})
					}} style={styles.addBankBox}>
						<View style={styles.addBank}>
							<View style={styles.addTxtCircle}><Text style={styles.addTxtCircleText}>+</Text></View>
							<Text style={styles.addBankText}>เพิ่มบัญชีธนาคารใหม่</Text>
						</View>
					</Touch>
				}

				<View>
					{
						!this.props.memberInforData.IsSingleDeposit && Array.isArray(withdrawalsBank) && withdrawalsBank.length > 0 &&
						<TouchableOpacity onPress={() => {
							this.setState({
								isShowEditBank: !isShowEditBank
							})
						}} style={{ paddingBottom: 15, alignItems: 'flex-end' }} hitSlop={{ left: 20, right: 20 }}>
							<Text style={{ color: '#06ADEF' }}>{!isShowEditBank ? 'แก้ไข' : 'ยกเลิก '}</Text>
						</TouchableOpacity>
					}
					<View>
						{
							Array.isArray(withdrawalsBank)
								?
								(
									withdrawalsBank.length > 0 && withdrawalsBank.map((item, index) => {
										return <View
											// onPress={() => {
											// 	Actions.BankDetails({
											// 		bankInfor: item,
											// 		bankType: 'W',
											// 		//bankIcon: BankIcon[item.BankNameEn.toLocaleUpperCase().replace(/\s/g, '')]
											// 	})
											// }}
											style={[styles.bankBox]} key={index}>
											<View style={[styles.bankList, {
												flexDirection: 'row',
												alignItems: 'center'
											}]}>

												{
													isShowEditBank && <TouchableOpacity style={[styles.bankInnerBox1, {
														backgroundColor: BankAccountID == item.BankAccountID ? '#00ADEF' : '#FFFFFF'
													}]} onPress={() => {
														this.setState({
															BankAccountID: item.BankAccountID
														})
													}}>
														{
															BankAccountID == item.BankAccountID && <View style={[styles.bankInnerBox2]}></View>
														}
													</TouchableOpacity>
												}


												<View>
													<Text style={[styles.bankNameText]}>{item.BankName}</Text>
													<Text style={[styles.bankNameText]}>{item.AccountNumber.replace(/^().*(...)$/, "***$2")}</Text>
													{
														Boolean(Array.isArray(memberBanksTransactionHistory) && memberBanksTransactionHistory.length) && <View>
															<Text style={[styles.bankNameText]}>จำนวนครั้งที่ถอน : {memberBanksTransactionHistory.find(v => v.AccountNumber = item.AccountNumber).TotalUpToDateTransaction}</Text>
															<Text style={[styles.bankNameText]}>จำนวนรวมยอดที่ถอน : {toThousands(memberBanksTransactionHistory.find(v => v.AccountNumber = item.AccountNumber).TotalUpToDateAmount, '', '')}</Text>
														</View>
													}
												</View>
											</View>
											{
												bankIndex == index && <View>
													<View style={[styles.bankInfor, { marginTop: 10 }]}>
														<Text style={styles.bankInfor1}>ชื่อธนาคาร</Text>
														<Text style={styles.bankInfor2}>{item.BankName}</Text>
													</View>
													<View style={styles.bankInfor}>
														<Text style={styles.bankInfor1}>ชื่อจริง</Text>
														<Text style={styles.bankInfor2}>{getName(item.AccountHolderName)}</Text>
													</View>
													<View style={styles.bankInfor}>
														<Text style={styles.bankInfor1}>บัญชีธนาคาร</Text>
														<Text style={styles.bankInfor2}>{item.AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
													</View>
													<View style={styles.bankInfor}>
														<Text style={styles.bankInfor1}>จังหวัด</Text>
														<Text style={styles.bankInfor2}>{item.Province}</Text>
													</View>
													<View style={styles.bankInfor}>
														<Text style={styles.bankInfor1}>อำเภอ</Text>
														<Text style={styles.bankInfor2}>{item.City}</Text>
													</View>
													<View style={styles.bankInfor}>
														<Text style={styles.bankInfor1}>สาขา</Text>
														<Text style={styles.bankInfor2}>{item.Branch}</Text>
													</View>
												</View>
											}
											<Touch style={styles.bankArrowBox} onPress={() => {
												if (bankIndex == index) {
													this.setState({
														isOpenBank: true,
														bankIndex: -9999999999
													})
												} else {
													this.setState({
														isOpenBank: true,
														bankIndex: index
													})
												}
											}}>


												{
													item.IsDefault ?
														<View style={styles.bankInforImgBox} onPress={() => {
															this.setDefault(item.BankAccountID, 'Withdrawal')
														}}>
															<Image source={require('./../../../images/finance/bankInfor.png')} style={[styles.bankInforImg]} />
															<Text>บัญชีธนาคารที่ต้องการ</Text>
														</View>
														:
														<View style={styles.bankInforImgBox}></View>
												}

												<Image source={arrowRightImg} style={[styles.recordBoxImg1, {
													transform: [{
														rotate: bankIndex != index ? '0deg' : '90deg'
													}]
												}]} />
											</Touch>

											{
												// item.IsDefault && <View style={styles.setDefault}>
												// 	<View style={styles.defaultBox}>
												// 		<Text style={styles.defaultBoxText}>✓</Text>
												// 	</View>
												// 	<Text style={styles.bankText1}>Mặc Định</Text>
												// </View>
											}
											{
												// !item.IsDefault && <TouchableOpacity style={[styles.setDefault, { backgroundColor: '#1CBD64', paddingHorizontal: 2 }]} onPress={() => { this.setDefault(item.BankAccountID, 'Withdrawal') }}>
												// 	<Text style={styles.bankText2}>Chọn Mặc Định</Text>
												// </TouchableOpacity>
											}
										</View>
									})
								)
								:
								this.renderNewsBone()
						}
					</View>


				</View>
			</ScrollView>

			{
				isShowEditBank && <View style={styles.bankBtnBox}>
					<TouchableOpacity style={[styles.bankBtn]}
						onPress={() => {
							BankAccountID > 0 && this.deleteCard()

						}}>
						<Text style={[styles.bankBtnText]}>ลบ</Text>
					</TouchableOpacity>



					<TouchableOpacity style={[styles.bankBtn, { backgroundColor: '#00AEEF' }]}
						onPress={() => {
							this.setState({
								isShowEditBank: false,
								//BankAccountID: ''
							})
							if (BankAccountID > 0) {
								let bankInfor = withdrawalsBank.findIndex(v => v.BankAccountID == BankAccountID)
								let bankInforAccountNumber = withdrawalsBank[bankInfor].AccountNumber
								if (bankInfor >= 0) {
									Actions.NewBank({
										bankType: 'W',
										bankInfor: withdrawalsBank[bankInfor],
										memberBanksTransactionHistory: memberBanksTransactionHistory.find(v => v.AccountNumber == bankInforAccountNumber),
										getMemberBanksTransactionHistory: () => {
											this.getMemberBanksTransactionHistory()
										},
										isSetDefault: true
									})
								}
							}
						}}>
						<Text style={[styles.bankBtnText, { color: '#fff' }]}>แก้ไข</Text>
					</TouchableOpacity>
				</View>
			}
		</View>
	}
}

export default BankCenter = connect(
	(state) => {
		return {
			depositUserBankData: state.depositUserBankData,
			withdrawalUserBankData: state.withdrawalUserBankData,
			memberInforData: state.memberInforData,
		}
	}, (dispatch) => {
		return {
			getDepositUserBankAction: () => dispatch(getDepositUserBankAction()),
			getWithdrawalUserBankAction: () => dispatch(getWithdrawalUserBankAction()),
		}
	}
)(BankCenterContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#F3F3F4',
		paddingHorizontal: 10,
		paddingTop: 15,
	},
	addTxtCircle: {
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 5
	},
	addBankText: {
		color: '#fff',
		fontSize: 14,
		fontWeight: 'bold'
	},
	bankList: {
		borderBottomWidth: 1,
		borderBottomColor: '#F3F3F4',
		paddingBottom: 10,
		paddingHorizontal: 10,
	},

	addTxtCircleText: {
		color: '#fff',
		textAlign: 'center',
		fontSize: 14,
		fontWeight: 'bold'
	},

	recordBoxImg1: {
		width: 14,
		height: 14,
	},
	setDefault: {
		position: 'absolute',
		right: 30,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	defaultBox: {
		width: 20,
		height: 20,
		borderRadius: 100,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1CBD64',
		marginRight: 5
	},
	defaultBoxText: {
		color: '#fff',
	},
	bankText1: {
		color: '#1CBD64',
		fontSize: 11,
		fontWeight: 'bold'
	},
	bankText2: {
		color: '#fff',
		fontSize: 11,
		padding: 3
	},
	bankBox: {
		display: 'flex',
		backgroundColor: '#fff',
		paddingTop: 10,
		marginBottom: 10
	},
	bankBoxWrap: {
		overflow: 'hidden',
		backgroundColor: '#e0e0e0',
		height: 55,
	},
	addBank: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#1CBD64',
		borderRadius: 3,
		flexDirection: 'row',
		width: 220,
		height: 35,
		marginBottom: 10
	},
	addBankBox: {
		alignItems: 'center',
	},
	bankArrowBox: {
		height: 35,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: 15
	},
	bankInfor: {
		flexDirection: 'row',
		paddingLeft: 15,
		paddingVertical: 2
	},
	bankInfor1: {
		width: 100,
		color: '#000'
	},
	bankInfor2: {
		color: 'gray',
		width: width - 150,
	},
	bankNameText: {
		width: width - 50,
		flexWrap: 'wrap',
		color: '#000'
	},
	bankInforImg: {
		width: 25,
		height: 25,
		marginRight: 10
	},
	bankInforImgBox: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	bankInnerBox2: {
		width: 12,
		height: 12,
		backgroundColor: '#fff',
		borderRadius: 10000
	},
	bankInnerBox1: {
		width: 20,
		height: 20,
		borderRadius: 10000,
		borderWidth: 1,
		borderColor: '#CECECE',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10
	},
	bankBtnBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		position: 'absolute',
		bottom: 0,
		paddingVertical: 20,
		width: width - 20,
		marginHorizontal: 10
	},
	bankBtn: {
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderRadius: 4,
		borderColor: '#00AEEF',
		width: (width - 20) * .46,
		height: 38
	},
	bankBtnText: {
		color: '#00AEEF'
	}
})