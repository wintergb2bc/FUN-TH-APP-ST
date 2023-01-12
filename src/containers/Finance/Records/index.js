import React from 'react'
import ReactNative, { StyleSheet, ScrollView, Text, View, Image, TouchableOpacity, Dimensions, Clipboard, UIManager, Modal, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { getBalanceInforAction } from '../../../actions/ReducerAction'
import { toThousands, toThousandsAnother } from '../../../actions/Reg'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'
import DatePickerCommon from './../../Common/DatePickerCommon'
import { SelectTimeText, NoRecordText } from './../../Common/CommonData'
import LoadingBone from './../../Common/LoadingBone'

const { width, height } = Dimensions.get('window')

const RecordsTab = [
	{
		title: 'ฝาก',
		text: 'deposit'
	},
	{
		title: 'โอน',
		text: 'Transfer'
	},
	{
		title: 'ถอน',
		text: 'Withdrawal'
	},
]

const DepositStatusPending = { //'Pending'
	text: 'ดำเนินการ',
	color: '#F0A800',
}
const DepositStatus = {
	StatusId1: DepositStatusPending,
	StatusId2: {// 'Approved'
		text: 'สำเร็จ',//'Hoàn Tất',
		color: '#21DB00',
	},
	StatusId3: {//'Rejected'
		text: 'ยกเลิก',
		color: '#F11818',
	},
	StatusId4: DepositStatusPending,
	StatusId5: {
		text: 'หมดเวลา',
		color: '#E30000',
	}
}

const TfStatus = {
	'StatusId-1': {// 'Approved'
		text: 'รอดำเนินการ',//'Hoàn Tất',
		color: '#25AAE1',
	},
	'StatusId-2': {// 'Approved'
		text: 'รอดำเนินการ',//'Hoàn Tất',
		color: '#25AAE1',
	},
	StatusId0: {// 'Approved'
		text: 'กำลังดำเนินการ',//'Hoàn Tất',
		color: '#83E300',
	},
	StatusId1: {// 'Approved'
		text: 'สำเร็จ',//'Hoàn Tất',
		color: '#83E300',
	},
	StatusId2: {//'Rejected'   -1
		text: 'ยกเลิก', // 等待浏览
		color: '#009DE3',
	},
	StatusId3: {  // ==  -2 狀態 
		text: 'ยกเลิก',
		color: '#FF0000',
	}
}

const WithdrawalStatusPending = {
	text: 'รอดำเนินการ', // 进行中
	color: '#F0A800',
	borderColor: '#009DE3',
	backgroundColor: '#009DE3'
}
const WithdrawalStatus = {
	StatusId1: {
		text: 'กำลังดำเนินการ', // 等待浏览
		color: '#009DE3',
		borderColor: '#009DE3',
		backgroundColor: '#fff'
	},
	StatusId2: WithdrawalStatusPending,
	StatusId3: WithdrawalStatusPending,
	StatusId4: {
		text: 'สําเร็จ', //'Hoàn Tất', // 已完成
		color: '#21DB00',
		borderColor: '#83E300',
		backgroundColor: '#83E300'
	},
	StatusId5: {
		text: 'ไม่สำเร็จ',//'Từ Chối', // 拒绝
		color: '#E30000',
		borderColor: '#E30000',
		backgroundColor: '#E30000'
	},
	StatusId6: {
		text: 'ยกเลิก', // 取消
		color: '#E30000',
		borderColor: '#E30000',
		backgroundColor: '#E30000'
	},
	StatusId7: {
		text: 'รอดำเนินการ', // 等待浏览
		color: '#009DE3',
		borderColor: '#009DE3',
		backgroundColor: '#fff'
	},
	StatusId8: WithdrawalStatusPending,
	StatusId9: WithdrawalStatusPending,
	StatusId10: {
		text: 'สำเร็จบางส่วน', // 部分成功
		color: '#21DB00',
		borderColor: '#83E300',
		backgroundColor: '#83E300'
	}
}

const DeposiBanktList = [
	{
		code: '',
		name: 'ทั้งหมด'
	},
	{
		code: 'LB',
		name: 'บัญชีภายในประเทศ'
	},
	{
		code: 'RD',
		name: 'ฝากเงินด่วน'
	},
	{
		code: 'THBQR',
		name: 'QR ฝากเงิน'
	},
	{
		code: 'EZP',
		name: 'อีซี่เพย์'
	},
	{
		code: 'TMW',
		name: 'ทรูมันนี่ วอลเล็ท'
	},
	{
		code: 'LINE',
		name: 'ไลน์'
	},
	{
		code: 'BC',
		name: 'Fast Baht'
	},
	{
		code: 'CC',
		name: 'บัตรเงินสด'
	},
	{
		code: 'BQR',
		name: 'QR ฝากเงินทศนิยม'
	}
]
const DepositName = DeposiBanktList.filter(v => v.code).reduce((obj, v) => {
	obj[v.code] = v.name
	return obj
}, {})
const WithdrawalBankList = [
	{
		code: '',
		name: 'ทั้งหมด'
	},
	{
		code: 'LB',
		name: 'แบบภายในประเทศ'
	},
	{
		code: 'EZW',
		name: 'อีซี่เพย์'
	},
]

const OtherTranferName = {
	WITHDRAWING: 'การถอนตัว',
	REBATE: 'เงินคืน',
	ADJUSTMENT: 'การปรับ',
	CASH: 'การปรับ',
	BONUS: 'โปรโมชั่น',
	PLAYER_BONUS: 'การปรับ',
	BONUS_ADJUSTMENT: 'การปรับ',
	REWARD_POINT: 'คะแนนสะสม'
}
const WithdrawalName = WithdrawalBankList.filter(v => v.code).reduce((obj, v) => {
	obj[v.code] = v.name
	return obj
}, {})

class RecordsContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			recordIndex: this.props.recordIndex || 0,
			dateFrom: moment().subtract(6, 'days').format('YYYY-MM-DD'),
			dateTo: moment().format('YYYY-MM-DD'),
			depositListIndex: 0,
			depositRecordsList: '',
			withdrawalListIndex: 0,
			withdrawalRecordsList: '',
			tranferRecordsList: '',
			CheckTransactionId: '',
			fromBalanceInfor: [],
			toBalanceInfor: [],
			fromWalletIndex: 0,
			toWalletIndex: 0,
			balanceInfor: [],
			arrowFlag1: false,
			arrowFlag2: false,
			isShowTipModal: false,
			mmpInputTop1: 0,
			mmpInputTop2: 0,
			bannerIndex: 0,
			isShowRdDepositModal: false
		}

		this.mycomponent1 = React.createRef()
		this.mycomponent2 = React.createRef()
	}

	componentDidMount(props) {
		this.changeBettingHistoryDatesIndex(this.state.recordIndex)
		this.getBalanceInfor(this.props.balanceInforData)
		this.getMmpStore()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.balanceInforData) {
			this.getBalanceInfor(nextProps.balanceInforData)
		}
	}

	getBalanceInfor(balanceInforData) {
		if (!(Array.isArray(balanceInforData) && balanceInforData.length)) return
		let balanceInfor = [{ localizedName: 'ทั้งหมด', name: '' }, ...this.props.balanceInforData.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL')]
		let PreferWallet = this.props.memberInforData.PreferWallet.toLocaleUpperCase()
		this.setState({
			balanceInfor,
			fromWalletIndex: 0,
			fromBalanceInfor: balanceInfor,
			toWalletIndex: 0,
			toBalanceInfor: balanceInfor,
		})
	}

	getDepositWithdrawalsRecords(flag1) {
		const { recordIndex, dateFrom, dateTo, depositListIndex, withdrawalListIndex } = this.state

		if (flag1) {
			this.setState({
				depositRecordsList: null,
				withdrawalRecordsList: null
			})
		}

		const tempData = RecordsTab[recordIndex]
		let flag = tempData.text === 'deposit'
		let bankCode = flag ? DeposiBanktList[depositListIndex].code : WithdrawalBankList[withdrawalListIndex].code
		let bankcoeStr = bankCode ? bankCode : ''
		flag1 && Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.BankingHistory + 'transactionType=' + tempData.text + '&paymentMethod=' + bankcoeStr + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&', 'GET').then(data => {
			Toast.hide()
			if (Array.isArray(data.historyList)) {
				if (flag) {
					let depositRecordsList = data.historyList
					depositRecordsList.forEach(v1 => {
						v1.depositWithdrawalsName = DepositName[v1.PaymentMethodId]
						//v1.StatusId = 1
					})
					this.setState({
						depositRecordsList
					})
				} else {
					let withdrawalRecordsList = data.historyList
					withdrawalRecordsList.forEach(v1 => {
						v1.depositWithdrawalsName = WithdrawalName[v1.PaymentMethodId]
					})
					this.setState({
						withdrawalRecordsList
					})
				}

				this.getModalSaveDate()
			} else {
				this.setState({
					depositRecordsList: [],
					withdrawalRecordsList: []
				})
				let errorMessage = data.errorMessage
				errorMessage && Toast.fail(errorMessage, 1.5)
			}
		}).catch(error => {
			Toast.hide()
		})
	}

	getTranferRecords() {
		const { fromBalanceInfor, fromWalletIndex, toBalanceInfor, toWalletIndex, dateFrom, dateTo } = this.state
		if (!(Array.isArray(fromBalanceInfor) && fromBalanceInfor.length)) return
		if (fromBalanceInfor[fromWalletIndex].name === toBalanceInfor[toWalletIndex].name && fromBalanceInfor[fromWalletIndex].name && toBalanceInfor[toWalletIndex].name) {
			Toast.fail('โปรดเลือกกระเป๋าเงินอื่น', 2)
			return
		}
		this.setState({
			tranferRecordsList: null
		})

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.TransferApplicationsByDate + '?fromWallet=' + fromBalanceInfor[fromWalletIndex].name + '&toWallet=' + toBalanceInfor[toWalletIndex].name + '&dateFrom=' + dateFrom + ' 00:00:00.000&dateTo=' + dateTo + ' 23:59:59.000&', 'GET').then(data => {
			Toast.hide()
			let tranferRecordsList = data
			//.transactionHistories
			//if (data.isSuccess) {
			this.setState({
				tranferRecordsList
			})
			//}
		}).catch(error => {
			Toast.hide()
		})
	}

	changeBettingHistoryDatesIndex(i) {

		if (i == 0) {
			window.PiwikMenberCode('Transaction Record', 'View', `View_TransactionRecord_Deposit`)
		} else if (i == 1) {
			window.PiwikMenberCode('Transaction Record', 'View', `View_TransactionRecord_Transfer`)
		} else if (i == 2) {
			window.PiwikMenberCode('Transaction Record', 'View', `View_TransactionRecord_Withdraw`)
		}
		this.setState({
			CheckTransactionId: '',
			recordIndex: i,
			depositListIndex: 0,
			withdrawalListIndex: 0,
			// fromWalletIndex: 0,
			// toWalletIndex: 0,
			tranferRecordsList: '',
			withdrawalRecordsList: '',
			depositRecordsList: ''
		})
	}

	changeBettingDatePicker(type, date) {
		this.setState({
			[type]: moment(date).format('YYYY-MM-DD'),
		})
	}

	createDeposiBankList(item, i) {
		const { depositListIndex } = this.state
		let flag = depositListIndex * 1 === i * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]}>
			<Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.name}</Text>
		</View>
	}

	createWithdrawalBankList(item, i) {
		const { withdrawalListIndex } = this.state
		let flag = withdrawalListIndex * 1 === i * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]}>
			<Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.name}</Text>
		</View>
	}

	createTranferFromWalletIndexList(item, i) {
		const { fromWalletIndex } = this.state
		let flag = fromWalletIndex * 1 === i * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]}>
			<Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
		</View>
	}

	createTranferToWalletIndexList(item, i) {
		const { toWalletIndex } = this.state
		let flag = toWalletIndex * 1 === i * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]}>
			<Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
		</View>
	}

	changeWalletIndex(wallet, index) {
		this.setState({
			[wallet]: index
		})
	}

	cancaleWithdrawalReload() {
		this.props.getBalanceInforAction()
		this.getDepositWithdrawalsRecords()
	}

	changeArrowStatus(tag, arrowFlag) {
		this.setState({
			[tag]: arrowFlag
		})
	}

	async copyTXT(txt) {
		this.setState({
			CheckTransactionId: txt
		})
		Clipboard.setString(txt)

		Toast.success('คัดลอกแล้ว', 1.5)
	}


	getMmpStore() {
		if (!ApiPort.UserLogin) return
		storage.load({
			key: 'recordMemberStatusFirsrtGuider' + window.userNameDB,
			id: 'recordMemberStatusFirsrtGuider' + window.userNameDB
		}).then(data => {
			this.setState({
				isShowRdDepositModal: false
			})
		}).catch(() => {
			this.setState({
				isShowRdDepositModal: true
			})
		})
	}

	changeisShowRdDepositModal(isShowRdDepositModal) {
		this.setState({
			isShowRdDepositModal
		})
		global.storage.save({
			key: 'recordMemberStatusFirsrtGuider' + window.userNameDB,
			id: 'recordMemberStatusFirsrtGuider' + window.userNameDB,
			data: true,
			expires: null
		})
	}

	renderPage(item) {
		return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
			<Image
				resizeMode='stretch'
				style={styles.carouselImg}
				source={item.item.img} />
			{
				item.index == 1 && <TouchableOpacity style={styles.closeBtn} onPress={() => {
					this.changeisShowRdDepositModal(false)
				}}></TouchableOpacity>
			}
		</TouchableOpacity>
	}

	render() {
		const { isShowRdDepositModal, bannerIndex, historyList, isShowTipModal, mmpInputTop1, CheckTransactionId, arrowFlag1, arrowFlag2, balanceInfor, tranferRecordsList, fromWalletIndex, toWalletIndex, toBalanceInfor, fromBalanceInfor, withdrawalRecordsList, recordIndex, dateFrom, dateTo, depositListIndex, depositRecordsList, withdrawalListIndex } = this.state
		const bannerData = [
			{
				img: require('./../../../images/finance/record/recordMemberStatus1.png'),
			},
			{
				img: require('./../../../images/finance/record/recordMemberStatus2.png'),
			}
		]
		return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
			<Modal animationType='fade' transparent={true} visible={isShowRdDepositModal}>
				<View style={[styles.modalContainer]}>
					<Carousel
						data={bannerData}
						renderItem={this.renderPage.bind(this)}
						sliderWidth={width}
						itemWidth={width}
						useScrollView={true}
						inactiveSlideScale={1}
						onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
					/>
				</View>
			</Modal>

			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.bettingWraps}>
					{
						RecordsTab.map((v, i) => {
							let flag = i * 1 === recordIndex * 1
							return <TouchableOpacity
								key={i}
								style={[styles.bettingBox, {
									backgroundColor: window.isBlue ? (flag ? '#00AEEF' : 'transparent') : (flag ? '#25AAE1' : 'transparent'),
									borderLeftColor: i == 1 ? (flag ? '#00AEEF' : (window.isBlue ? '#f8f8f9' : '#646464')) : 'transparent',
									borderLeftWidth: i == 1 ? 1 : 0,
									borderRightColor: i == 1 ? (flag ? '#00AEEF' : (window.isBlue ? '#f8f8f9' : '#646464')) : 'transparent',
									borderRightWidth: i == 1 ? 1 : 0,
								}]}
								onPress={() => {
									this.changeBettingHistoryDatesIndex(i)
								}}
							>
								<Text style={[{ color: window.isBlue ? (flag ? '#fff' : '#999999') : '#fff', fontWeight: flag ? 'bold' : 'normal', fontSize: 14 }]}>{v.title}</Text>
							</TouchableOpacity>
						})
					}
				</View>
				{/* 充值记录 */}
				{
					recordIndex == 0 && <View style={styles.recordContainer}>
						<View style={[styles.fillterBox, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
							<DatePickerCommon
								changeBettingDatePicker={this.changeBettingDatePicker.bind(this)}
								dateFrom={dateFrom}
								dateTo={dateTo}
								fromPage={'record'}
							></DatePickerCommon>
							<View style={styles.serchBtnBox}>
								<ModalDropdown
									animated={true}
									options={DeposiBanktList}
									renderRow={this.createDeposiBankList.bind(this)}
									onSelect={depositListIndex => {
										this.setState({
											depositListIndex
										})
									}}
									onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
									onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
									style={[styles.toreturnModalDropdown, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#DDDDDD' : '#00CEFF', width: (width - 36) * .7 }]}
									dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: DeposiBanktList.length * 30 + 5 }]}
								>
									<View style={styles.toreturnModalDropdownTextWrap}>
										<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#707070' : '#fff' }]}>{DeposiBanktList[depositListIndex].name}</Text>
										<ModalDropdownArrow arrowFlag={arrowFlag1} />
									</View>
								</ModalDropdown>

								<TouchableOpacity style={[styles.serchBtn, { width: (width - 36) * .25 }]} onPress={this.getDepositWithdrawalsRecords.bind(this, true)}>
									<Text style={styles.serchBtnText}>ค้นหา</Text>
								</TouchableOpacity>
							</View>

							<View style={styles.recordIconBox}>
								<Image
									source={require('./../../../images/finance/record/recordIcon1.png')}
									resizeMode='stretch'
									style={styles.recordIcon}
								></Image>
								<Text style={styles.recordIconText}>สามารถเลือกดูได้ 7 วัน โดยข้อมูลจะโชว์ย้อนหลังได้ 90 วัน</Text>
							</View>
						</View>

						<View ref={this.mycomponent1}>
							{
								depositRecordsList === ''
									?
									<Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff', marginTop: 100 }]}>{SelectTimeText}</Text>
									:
									Array.isArray(depositRecordsList)
										?
										(

											depositRecordsList.length > 0 ? depositRecordsList.map((item, index) => {
												return <TouchableOpacity
													onPress={() => {
														Actions.RecordsManualDeposit({
															item, datailsType: 'deposit',
															getDepositWithdrawalsRecords: () => {
																this.getDepositWithdrawalsRecords()
															}
														})
													}}
													style={[styles.deposiBanktList, {
														borderTopColor: window.isBlue ? '#fff' : '#5C5C5C',
														backgroundColor: window.isBlue ? '#fff' : '#212121',
													}]}
													key={index}>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
														<View>
															<Text style={[styles.recordBoxText, { color: window.isBlue ? '#58585B' : '#fff', fontWeight: 'bold', fontSize: 14 }]}>{item.PaymentMethodName}
															</Text>
														</View>

														<Text style={styles.depositStatusBoxText, { color: DepositStatus[`StatusId${item.StatusId}`].color, fontSize: 12 }}>{DepositStatus[`StatusId${item.StatusId}`].text}</Text>
													</View>

													<Text style={[styles.recordBoxText, { color: window.isBlue ? '#999999' : 'rgba(255, 255, 255, .5)', fontSize: 11 }]}>{moment(item.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
													<Text style={[styles.recordBoxText1, { color: window.isBlue ? '#58585B' : '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'right' }]}>{toThousands(item.Amount)}</Text>

													<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
														<Text style={[styles.recordBoxText1, { fontSize: 12, color: window.isBlue ? '#BFBFBF' : '#fff' }]}>{item.TransactionId}</Text>
														<TouchableOpacity
															hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
															onPress={this.copyTXT.bind(this, item.TransactionId)}
															style={[styles.copyBtnSty, { backgroundColor: window.isBlue ? '#FFFFFF' : '#25AAE1' }]}>
															<Text style={{ color: window.isBlue ? '#25AAE1' : '#FFFFFF' }}>คัดลอก</Text>
														</TouchableOpacity>
														{CheckTransactionId == item.TransactionId &&
															<View style={styles.gogostyle}><Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text></View>
														}
													</View>
												</TouchableOpacity>
											})
												:
												<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
													<Image
														source={require('./../../../images/records/icon.png')}
														resizeMode='stretch'
														style={{ width: 60, height: 60 }}
													></Image>
													<Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
												</View>
										)
										:
										<View>
											{
												Array.from({ length: 4 }, v => v).map((v, i) => {
													return <View style={[styles.deposiBanktList, { overflow: 'hidden', borderColor: 'transparent', height: 120, backgroundColor: '#e0e0e0' }]} key={i}>
														<LoadingBone></LoadingBone>
													</View>
												})
											}
										</View>
							}
						</View>
					</View>
				}

				{/* 转账记录 */}
				{
					recordIndex == 1 && <View style={styles.recordContainer}>
						<View style={[styles.fillterBox, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
							<DatePickerCommon
								changeBettingDatePicker={this.changeBettingDatePicker.bind(this)}
								dateFrom={dateFrom}
								dateTo={dateTo}
								fromPage={'record'}
							></DatePickerCommon>


							<TouchableOpacity style={styles.serchBtn} onPress={this.getTranferRecords.bind(this)}>
								<Text style={styles.serchBtnText}>ค้นหา</Text>
							</TouchableOpacity>


							<View style={styles.recordIconBox}>
								<Image
									source={require('./../../../images/finance/record/recordIcon1.png')}
									resizeMode='stretch'
									style={styles.recordIcon}
								></Image>
								<Text style={styles.recordIconText}>สามารถเลือกดูได้ 7 วัน โดยข้อมูลจะโชว์ย้อนหลังได้ 90 วัน</Text>
							</View>
						</View>

						<View>
							{
								tranferRecordsList === ''
									?
									<Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff', marginTop: 100 }]}>{SelectTimeText}</Text>
									:
									Array.isArray(tranferRecordsList)
										?
										(

											tranferRecordsList.length > 0 ? tranferRecordsList.map((item, index) => {
												let tempFromWalletName = balanceInfor.find(v => v.name === item.creditAccount.toLocaleUpperCase())
												let fromWalletName = tempFromWalletName ? tempFromWalletName.localizedName : (OtherTranferName[item.creditAccount.toLocaleUpperCase()] ? OtherTranferName[item.creditAccount.toLocaleUpperCase()] : item.creditAccount.toLocaleUpperCase())
												let tempToWalletName = balanceInfor.find(v => v.name === item.debitAccount.toLocaleUpperCase())
												let toWalletName = tempToWalletName ? tempToWalletName.localizedName : (OtherTranferName[item.debitAccount.toLocaleUpperCase()] ? OtherTranferName[item.debitAccount.toLocaleUpperCase()] : item.debitAccount.toLocaleUpperCase())

												return <View style={[styles.deposiBanktList, {
													borderTopColor: window.isBlue ? '#fff' : '#5C5C5C',
													backgroundColor: window.isBlue ? '#fff' : '#212121',

												}]}
													key={index}>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
														<View>
															<Text style={[styles.recordBoxText, { color: window.isBlue ? '#58585B' : '#fff', width: width - 180, flexWrap: 'wrap', fontSize: 14, fontWeight: 'bold' }]}>{fromWalletName} > {toWalletName}</Text>
														</View>
														{
															<Text style={styles.depositStatusBoxText, {
																color: (
																	TfStatus[`StatusId${item.status}`]
																		?
																		TfStatus[`StatusId${item.status}`].color
																		:
																		"#25AAE1"
																), fontSize: 12
															}}>{
																	TfStatus[`StatusId${item.status}`]
																		?
																		TfStatus[`StatusId${item.status}`].text
																		:
																		'รอดำเนินการ'
																}</Text>
														}
													</View>

													<Text style={[styles.recordBoxText, { color: window.isBlue ? '#999999' : 'rgba(255, 255, 255, .5)', fontSize: 11 }]}>{moment(item.transactionDate).format('DD-MM-YYYY HH:mm')}</Text>
													<Text style={[styles.recordBoxText1, { color: window.isBlue ? '#58585B' : '#00AEEF', fontWeight: 'bold', fontSize: 20, textAlign: 'right' }]}>{toThousands(item.amount)}</Text>

													<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
														<Text style={[styles.recordBoxText1, { fontSize: 12, color: window.isBlue ? '#BFBFBF' : '#fff' }]}>{item.id}</Text>
														<TouchableOpacity
															hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
															onPress={this.copyTXT.bind(this, item.id + '')}
															style={[styles.copyBtnSty, { backgroundColor: window.isBlue ? '#FFFFFF' : '#25AAE1' }]}>
															<Text style={{ color: window.isBlue ? '#25AAE1' : '#FFFFFF' }}>คัดลอก</Text>
														</TouchableOpacity>
														{
															CheckTransactionId == item.id &&
															<View style={styles.gogostyle}><Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text></View>
														}
													</View>
												</View>
											})
												:
												<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
													<Image
														source={require('./../../../images/records/icon.png')}
														resizeMode='stretch'
														style={{ width: 60, height: 60 }}
													></Image>
													<Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
												</View>
										)
										:
										<View>
											{
												Array.from({ length: 4 }, v => v).map((v, i) => {
													return <View style={[styles.deposiBanktList, { overflow: 'hidden', borderColor: 'transparent', height: 120, backgroundColor: '#e0e0e0' }]} key={i}>
														<LoadingBone></LoadingBone>
													</View>
												})
											}
										</View>
							}
						</View>

					</View>
				}


				{/* 提款记录 */}
				{
					recordIndex == 2 && <View style={styles.recordContainer}>
						<View style={[styles.fillterBox, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
							<DatePickerCommon
								changeBettingDatePicker={this.changeBettingDatePicker.bind(this)}
								dateFrom={dateFrom}
								dateTo={dateTo}
								fromPage={'record'}
							></DatePickerCommon>

							<View style={styles.serchBtnBox}>
								<ModalDropdown
									animated={true}
									options={WithdrawalBankList}
									renderRow={this.createWithdrawalBankList.bind(this)}
									onSelect={withdrawalListIndex => {
										this.setState({
											withdrawalListIndex
										})
									}}
									onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
									onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
									style={[styles.toreturnModalDropdown, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#DDDDDD' : '#00CEFF', width: (width - 36) * .7 }]}
									dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: WithdrawalBankList.length * 30 + 5 }]}
								>
									<View style={styles.toreturnModalDropdownTextWrap}>
										<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#707070' : '#fff' }]}>{WithdrawalBankList[withdrawalListIndex].name}</Text>
										<ModalDropdownArrow arrowFlag={arrowFlag1} />
									</View>
								</ModalDropdown>

								<TouchableOpacity style={[styles.serchBtn, { width: (width - 36) * .25 }]} onPress={this.getDepositWithdrawalsRecords.bind(this, true)}>
									<Text style={styles.serchBtnText}>ค้นหา</Text>
								</TouchableOpacity>

							</View>


							<View style={styles.recordIconBox}>
								<Image
									source={require('./../../../images/finance/record/recordIcon1.png')}
									resizeMode='stretch'
									style={styles.recordIcon}
								></Image>
								<Text style={styles.recordIconText}>สามารถเลือกดูได้ 7 วัน โดยข้อมูลจะโชว์ย้อนหลังได้ 90 วัน</Text>
							</View>

						</View>

						<View>
							{
								withdrawalRecordsList === ''
									?
									<Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff', marginTop: 100 }]}>{SelectTimeText}</Text>
									:
									Array.isArray(withdrawalRecordsList)
										?
										(

											withdrawalRecordsList.length > 0 ? withdrawalRecordsList.map((item, index) => {
												return <TouchableOpacity
													onPress={() => {
														Actions.RecordsManualWithdrawal({
															item, datailsType: 'withdrawal',
															cancaleWithdrawalReload: () => {
																this.cancaleWithdrawalReload()
															},
															getDepositWithdrawalsRecords: () => {
																this.getDepositWithdrawalsRecords()
															}
														})
													}}
													style={[styles.deposiBanktList, {
														borderTopColor: window.isBlue ? '#fff' : '#5C5C5C',
														backgroundColor: window.isBlue ? '#fff' : '#212121',
													}]}
													key={index}>
													<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
														<View>
															{
																<Text style={[styles.recordBoxText, { color: window.isBlue ? '#58585B' : '#fff', fontWeight: 'bold', fontSize: 14 }]}>{item.PaymentMethodName}</Text>
															}
														</View>

														<Text style={[styles.depositStatusBoxText, { color: WithdrawalStatus[`StatusId${item.StatusId}`].color }]}>{WithdrawalStatus[`StatusId${item.StatusId}`].text}</Text>
													</View>

													<Text style={[styles.recordBoxText, { color: window.isBlue ? '#999999' : 'rgba(255, 255, 255, .5)', fontSize: 11 }]}>{moment(item.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
													<Text style={[styles.recordBoxText1, { color: window.isBlue ? '#58585B' : '#fff', fontWeight: 'bold', fontSize: 20, textAlign: 'right' }]}>{toThousands(item.Amount)}</Text>

													<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
														<Text style={[styles.recordBoxText1, { fontSize: 12, color: window.isBlue ? '#BFBFBF' : '#fff' }]}>{item.TransactionId}</Text>
														<TouchableOpacity
															hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
															onPress={this.copyTXT.bind(this, item.TransactionId)}
															style={[styles.copyBtnSty, { backgroundColor: window.isBlue ? '#FFFFFF' : '#25AAE1' }]}>
															<Text style={{ color: window.isBlue ? '#25AAE1' : '#FFFFFF' }}>คัดลอก</Text>
														</TouchableOpacity>
														{CheckTransactionId == item.TransactionId &&
															<View style={styles.gogostyle}><Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text></View>
														}
													</View>
												</TouchableOpacity>
											})
												:
												<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
													<Image
														source={require('./../../../images/records/icon.png')}
														resizeMode='stretch'
														style={{ width: 60, height: 60 }}
													></Image>
													<Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
												</View>
										)
										:
										<View>
											{
												Array.from({ length: 4 }, v => v).map((v, i) => {
													return <View style={[styles.deposiBanktList, { overflow: 'hidden', borderColor: 'transparent', height: 120, backgroundColor: '#e0e0e0' }]} key={i}>
														<LoadingBone></LoadingBone>
													</View>
												})
											}
										</View>
							}

						</View>
					</View>
				}
			</ScrollView>
		</View>
	}
}

export default Records = connect(
	(state) => {
		return {
			balanceInforData: state.balanceInforData,
			memberInforData: state.memberInforData,
		}
	}, (dispatch) => {
		return {
			getBalanceInforAction: () => dispatch(getBalanceInforAction())
		}
	}
)(RecordsContainer)


const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		position: 'relative',
	},
	recordContainer: {
		marginHorizontal: 10,
		width: width - 20
	},
	recordBoxImg: {
		position: 'absolute',
		left: 0,
		width: 26,
		height: 26,
	},
	recordBoxImg1: {
		position: 'absolute',
		right: 10,
		width: 14,
		height: 14,
	},
	deposiBanktList: {
		backgroundColor: '#fff',
		// width: width,
		// marginHorizontal: -10,
		marginBottom: 10,
		paddingTop: 10,
		//paddingBottom: 55,
		paddingHorizontal: 10,
		justifyContent: 'center',
		borderTopWidth: 1,
		borderRadius: 10
	},
	recordBoxText: {
		color: '#9B9B9B',
		fontSize: 12
	},
	recordBoxText1: {
		color: '#58585B'
	},
	recordBox1: {
		width: width - 20,
		position: 'relative',
		alignItems: 'center',
		marginBottom: 20
	},
	recordBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 2
	},
	recordBox2: {
		paddingLeft: 26,
		width: width - 20
	},
	serchBtnBox: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	fillterBox: {
		backgroundColor: '#fff',
		paddingHorizontal: 8,
		paddingTop: 8,
		borderBottomLeftRadius: 4,
		borderBottomRightRadius: 4,
		marginBottom: 15
	},
	serchBtn: {
		height: 40,
		backgroundColor: '#25AAE1',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 8,
		marginBottom: 10,
	},
	serchBtnText: {
		color: '#fff'
	},
	recordIconBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	recordIcon: {
		width: 14,
		height: 14,
		marginRight: 4
	},
	recordIconText: {
		color: '#26ADE6',
		fontSize: 12
	},
	toreturnModalDropdownList: {
		height: 30,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	bettingWraps: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 10,
		overflow: 'hidden',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		backgroundColor: '#fff',
		marginTop: 10
	},
	bettingBox: {
		height: 38,
		justifyContent: 'center',
		flexDirection: 'row',
		width: (width - 20) / 3,
		alignItems: 'center',
	},
	toreturnModalDropdown: {
		height: 40,
		borderRadius: 4,
		marginTop: 8,
		borderWidth: 1,
		justifyContent: 'center',
	},
	toreturnDropdownStyle: {
		marginTop: 10,
		width: width - 36,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4
	},
	toreturnModalDropdownTextWrap: {
		paddingHorizontal: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	toreturnModalDropdownText: {
		fontSize: 13
	},
	depositStatusBox: {
		position: 'absolute',
		right: 10,
		bottom: 10,
		flexDirection: 'row',
		height: 30,
		width: 180,
		alignItems: 'center',
		borderRadius: 100,
		justifyContent: 'center',
		// paddingHorizontal: 15
	},
	depositStatusBox1: {
		position: 'absolute',
		right: 10,
		bottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 100,
		justifyContent: 'center',
		backgroundColor: '#83E300',
		paddingHorizontal: 15,
		paddingVertical: 4,
		marginLeft: 10
	},
	depositStatusBoxText: {
		color: '#fff',
		fontSize: 11,
		fontWeight: 'bold'
	},
	depositStatusImg: {
		marginRight: 5,
		width: 15,
		height: 15
	},
	tranferWallet: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	tranferWalletModalDropdown: {
		width: (width - 36) / 2.05,
		marginHorizontal: 0
	},
	tranferWalletModalDropdownStyle: {
		width: (width - 36) / 2.05,
	},
	recordText: {
		textAlign: 'center'
	},
	gogostyle: {
		backgroundColor: '#14ADF0',
		borderRadius: 120000000,
		width: 20,
		height: 20,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10
	},
	posBox: {
		//position: 'absolute',
		// backgroundColor: 'red',
		height: 40,
		width: width - 20,
	},
	speclialItem: {
		backgroundColor: '#fff',
		borderRadius: 4,
		marginLeft: -10,
		paddingLeft: 10,
		width: width - 130,
	},
	copyBtnSty: {
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: '#25AAE1',
		marginLeft: 15
	},
	carouselImg: {
		width,
		height,
	},
	closeBtn: {
		height: 50,
		position: 'absolute',
		bottom: 50,
		width,
	},
	modalContainer: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E5E6E8'
	},
})