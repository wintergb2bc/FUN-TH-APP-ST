import React from 'react'
import { StyleSheet, Clipboard, Text, View, TouchableOpacity, Dimensions, TextInput, Modal, Image, Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { getBalanceInforAction, changeBonusTurnOverInfor, getPromotionListInforAction, getDepositUserBankAction } from './../../../../actions/ReducerAction'
import ViewShot from 'react-native-view-shot'
import QRCode from 'react-native-qrcode-svg'
import * as Animatable from 'react-native-animatable'
import { getDoubleNum, toThousands, GetOnlyNumReg, getThirdNum, toThousandsAnother } from './../../../../actions/Reg'
import { DatePickerLocale, StepCustom, ListItemstyles, ImgPermissionsText, ImagePickerOption } from './../../../Common/CommonData'
import DepositBankIcon from './../../DepositBankIcon'
const { width, height } = Dimensions.get('window')
import CameraRoll from "@react-native-community/cameraroll";
const AnimatableView = Animatable.View

class LBdepositPageContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			money: this.props.money,
			LbDepositBtnStatus: false,
			transactionId: this.props.transactionId,
			qrDeepLink: encodeURI(this.props.qrDeepLink),
			offlineRefNo: this.props.offlineRefNo,
			paymentMethod: this.props.paymentMethod,
			BankCode: this.props.BankCode,
			BankName: this.props.BankName,
			isQR: this.props.isQR,
			isLbUniqueAmt: true
		}
	}


	componentWillUnmount() {
		if (this.props.isDummyBank) {
			return
		}
		const { transactionId, paymentMethod, money } = this.state
		Actions.FinanceAfter({
			financeType: 'deposit',
			paymentMethod: paymentMethod,
			money,
		})
	}

	payMoney(flag) {
		const { transactionId, paymentMethod, money } = this.state
		Actions.pop()

		window.PiwikMenberCode('Deposit', 'Submit', 'Submit_BankQRPay_Deposit')
	}

	//复制文本
	async copyTXT(txt) {
		Clipboard.setString(txt)
		Toast.success('บันทึกสำเร็จ', 1)
	}

	saveImg() {
		this._viewShotRef.capture()
			.then(uri => {
				this.saveQrCode(uri)
			})
			.catch(() => {
				Toast.fail('ไม่สามารถบันทึก QR ได้', 3)
			})
		window.PiwikMenberCode('Refer_SaveQR')
	}

	saveQrCode(uri) {
		let promise = CameraRoll.save(uri);
		promise
			.then(function (result) {
				Toast.success("บันทึก QR สำเร็จ", 3);
			})
			.catch(function (error) {
				Toast.fail("ไม่สามารถบันทึก QR ได้เนื่องจากไม่มีสิทธิ์เข้าถึงอัลบั้มภาพ", 3);
			});
	}

	render() {
		const { isLbUniqueAmt, isQR, qrDeepLink, money, offlineRefNo, BankCode, BankName } = this.state
		console.log(this.state)
		return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
			{
				this.props.createisDummyBank(this.props.isDummyBank)
			}

			<Modal animationType='fade' transparent={true} visible={isLbUniqueAmt}>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { backgroundColor: '#fff', width: width * .9, paddingHorizontal: 15, paddingVertical: 25, borderWidth: 1, borderColor: '#25AAE1' }]}>
						<Text style={{ color: '#666666', marginBottom: 15, textAlign: 'center' }}>กรุณาโอนเงินเป็นจำนวนทศนิยมตามที่ระบบกำหนด เท่านั้นเพื่อความรวดเร็วในการตรวจสอบและอนุมัติยอดเงิน</Text>
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


			<KeyboardAwareScrollView>
				<View style={[styles.mmpTipBox]}>
					<Text style={styles.mmpTipBoxText}>กรุณาเปิดแบงก์กิ้งแอปเพื่อสแกน QR และโอนเงินตามจำนวนที่ระบบกำหนด ภายใน 5 นาทีเท่านั้น โปรดตรวจสอบให้แน่ใจว่าคุณใช้ธนาคารชื่อเดียวกับ ที่ลงทะเบียนในการฝากมิฉะนั้นการปรับเงินอาจล่าช้า</Text>
				</View>

				<View style={styles.limitLists}>
					<Text style={[styles.limitListsText]}>ยอดฝาก</Text>
					<View style={styles.LBMoneyBox}>
						<TextInput
							value={toThousands(money, ' ')}
							editable={false}
							style={[styles.limitListsInput, { backgroundColor: window.isBlue ? '#F0F0F0' : '#5C5C5C', borderWidth: 0, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }]} />
					</View>
				</View>

				{
					BankName && BankName.length > 0 && <View style={styles.limitLists}>
						<Text style={[styles.limitListsText]}>ธนาคาร</Text>
						<View style={styles.LBMoneyBox}>
							<TextInput
								value={BankName}
								editable={false}
								style={[styles.limitListsInput, { backgroundColor: window.isBlue ? '#F0F0F0' : '#5C5C5C', borderWidth: 0 }]} />
						</View>
					</View>
				}


				<View>
					{
						qrDeepLink.length > 0 &&
						<View>
							<Text style={[styles.limitListsText]}>คิวอาร์โค้ด</Text>
							<View style={[styles.mmpQrcodeBox, { backgroundColor: window.isBlue ? '#F0F0F0' : '#5C5C5C' }]}>
								<ViewShot
									ref={(c) => { this._viewShotRef = c }}
									options={{ format: 'jpg', quality: 0.9 }}
									style={styles.mmpQrcodeWrap}>
									<Image
										source={{ uri: qrDeepLink }}
										style={{ height: (width - 40) * .4, height: (width - 40) * .4 }}
										resizeMode='stretch'
									></Image>
								</ViewShot>
								<TouchableOpacity onPress={this.saveImg.bind(this)} style={styles.copyImgBox} hitSlop={{ top: 15, height: 15 }}>
									<Text style={styles.copyImgBoxText}>บันทึก</Text>
								</TouchableOpacity>
							</View>
						</View>
					}
					<View style={styles.phcNoBox}>
						<View style={styles.phcTextBox}>
							<Text style={styles.phcTextBoxText}>!</Text>
						</View>
						{
							<Text style={{ color: '#E2141C', width: width - 45 }}>คำเตือน : QR Code สามารถใช้ได้เพียง 1 ครั้งเท่านั้น ไม่สามารถ ใช้ซ้ำได้</Text>
						}
					</View>
				</View>

				<View style={styles.limitLists}>
					{
						// offlineRefNo &&	offlineRefNo.length > 0 && <View style={[styles.LBMoneyBox, { marginBottom: 80 }]}>
						// 	<TextInput
						// 		value={offlineRefNo}
						// 		editable={false}
						// 		style={[styles.limitListsInput, { backgroundColor: window.isBlue ? '#E6E6E6' : '#7F7F7F', borderWidth: 0 }]} />
						// 	<TouchableOpacity
						// 		style={[styles.copyTxt]}
						// 		onPress={() => {
						// 			this.copyTXT(offlineRefNo)
						// 		}}>
						// 		<Text style={[styles.bankInfoBtnText]}>คัดลอก</Text>
						// 	</TouchableOpacity>
						// </View>
					}
				</View>
				<View style={[styles.LbAddBankBox]}>
					<TouchableOpacity style={[styles.LBdepositPageBtn2, { backgroundColor: '#25AAE1' }]} onPress={() => {
						this.payMoney(true)
					}}>
						<Text style={styles.LBdepositPageBtnText1}>โอนเงินมาเรียบร้อยแล้ว</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAwareScrollView>


		</View>
	}
}

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff',
		paddingHorizontal: 10,
	},
	mmpTipBoxText: {
		fontSize: 12,
		color: 'red'
	},
	mmpTipBox: {
		marginTop: 15,
		backgroundColor: '#E7F6FD',
		paddingVertical: 6,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: '#79C6EB',
		marginBottom: 10,
		borderRadius: 6
	},
	LbAddBankBox: {
		alignItems: 'center',
	},
	LBdepositPageBtn2: {
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		width: width - 20,
		borderRadius: 6
	},
	LBdepositPageBtnText1: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	limitLists: {
		marginBottom: 10,
	},
	limitListsText: {
		marginBottom: 5,
		color: '#58585B'
	},
	LBMoneyBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	bankInfoBtnText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	copyTxt: {
		backgroundColor: '#00AEEF',
		borderRadius: 3,
		width: 80,
		height: 30,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		right: 10
	},
	limitListsInput: {
		borderWidth: 1,
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		height: 40,
		width: width - 20,
		borderRadius: 4,
		justifyContent: 'center'
	},
	depositIconText: {
		color: '#ffff',
		fontSize: 12
	},
	depositIconTextBox: {
		backgroundColor: '#F12F2F',
		padding: 2,
		paddingHorizontal: 4,
		borderRadius: 10,
		marginLeft: 5,
		transform: [
			{
				translateY: -10
			}
		]
	},
	limitListsBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10
	},
	phcNoBox: {
		flexDirection: 'row',
		marginBottom: 20
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
	mmpQrcodeBox: {
		alignItems: 'center',
		marginBottom: 15,
		width: width - 20,
		justifyContent: 'center',
		borderRadius: 4,
		paddingVertical: 20
	},
	mmpQrcodeWrap: {
		backgroundColor: '#fff',
		width: (width - 40) * .4,
		height: (width - 40) * .4,
		// padding: 15,
		borderRadius: 10,
		overflow: 'hidden'
	},
	bankIconBox: {
		marginBottom: 10
	},
	bankIconBoxImgBox: {
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	bankIconBoxText: {
		textAlign: 'center',
		fontSize: 16,
		fontWeight: 'bold'
	},
	copyImgBox: {
		marginTop: 10,
		display: 'flex',
		width: (width - 40) * .4 + 30,
		backgroundColor: '#25AAE1',
		paddingVertical: 8,
		borderRadius: 6
	},
	copyImgBoxText: {
		color: '#fff',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 16
	},
	modalBox: {
		backgroundColor: '#EFEFEF',
		borderRadius: 6,
		width: width * .95,
		overflow: 'hidden'
	},
	modalContainer: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	rdModalBtn: {
		width: (width * .9) - 30,
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