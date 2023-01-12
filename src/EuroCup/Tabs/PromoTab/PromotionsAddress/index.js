const { width, height } = Dimensions.get("window");
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	View,
	Platform,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	Linking,
	NativeModules,
	Alert,
	TextInput,
	ActivityIndicator,
	UIManager,
	Modal
} from "react-native";
import {
	Button,
	Progress,
	WhiteSpace,
	WingBlank,
	InputItem,
	Toast,
	Flex
} from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

import React from 'react';
import { ApiPortSB } from '../../../../containers/SbSports/lib/SPORTAPI';

class PromotionsAddress extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Address: '',
			Remark: '',
			Active: -1,
			Successmsg: '恭喜!您申请成功',
			ShowFailPopup: false,
			ShowSuccessPopup: false,
			Failmsg: '您暂时不符合此好礼资格，建议马上存款。'
		};
	}

	componentDidMount() {
		let Addressdata = JSON.parse(localStorage.getItem('Address'));
		if (Addressdata && Addressdata != '') {
			let havedefault = Addressdata.find((item) => item.defaultAddress == true);
			if (havedefault) {
				this.setState({
					Active: havedefault.id
				});
			} else {
				this.setState({
					Active: Addressdata[0].id
				});
			}
		}
		this.setState({
			promoid: this.props.promoid
		});
	}

	/**
	 * @description: 申请每日好礼优惠
	 * @param {*}
	 * @return {Object}
	*/

	ApplyDailyDeals = () => {
		const { Address } = this.props;
		const { Active, Remark, promoid } = this.state;
		let DailyDealsPromotiondata = JSON.parse(localStorage.getItem('DailyDealsPromotiondata'));
		let promo = DailyDealsPromotiondata.find((item) => item.id == promoid);
		let Addressdata =
			Active == -1
				? Address.find((item) => item.defaultAddress == true)
				: Address.find((item) => item.id == Active);
		let postData = {
			recipientFirstName: Addressdata.firstName,
			recipientLastName: Addressdata.lastName,
			postalCode: Addressdata.postalCode,
			contactNo: Addressdata.phoneNumber,
			email: Addressdata.email,
			province: Addressdata.province,
			district: Addressdata.district,
			town: Addressdata.town,
			address: Addressdata.address,
			village: '---',
			houseNumber: '---',
			zone: '---',
			remark: Remark
		};
		Toast.loading('请稍候...');
		let query = `contentId=${promoid}&bonusItem=${promo.bonusItem}&bonusAmount=${promo.bonusAmount}&`;
		fetchRequest(ApiPortSB.ApplyDailyDeals + query, 'POST', postData)
			.then((res) => {
				Toast.hide();
				if (res) {
					if (res.isSuccess) {
						this.setState({
							Successmsg: res.message,
							ShowSuccessPopup: true
						});
					} else {
						this.setState({
							Failmsg: res.message,
							ShowFailPopup: true
						});
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { Address } = this.props;
		const { id, Remark, Active, promoid, Failmsg, ShowFailPopup, Successmsg, ShowSuccessPopup } = this.state;
		console.log(Address);
		return (
			<View style={{ flex: 1, backgroundColor: '#EFEFF4', padding: 15, }}>
				<ScrollView>
					<Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, lineHeight: 23, marginBottom: 15 }}>FUN88 将在 30天内与您联系并寄出礼品；若没有提交表单将不能兑换此商品，且不完整和错误的信息将会使你丧失兑换礼品的权利</Text>
					{Address != '' &&
						Address.map((data, index) => {
							const {
								firstName,
								lastName,
								phoneNumber,
								province,
								district,
								town,
								address,
								postalCode,
								id,
								defaultAddress
							} = data;
							let status = Active == '-1' ? defaultAddress : Active == id;
							return (
								<View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 }} key={index}>
									<View
										style={styles.address}
										key={index}
										onClick={() => {
											this.setState({
												Active: id
											});
										}}
									>
										<View style={status ? styles.activeCap : styles.cap} />
										<View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>真实姓名</Text>
												<Text style={styles.addressAcont}>{firstName + lastName}</Text>
											</View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>联系电话</Text>
												<Text style={styles.addressAcont}>+86 {phoneNumber}</Text>
											</View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>详细地址</Text>
												<Text style={styles.addressAcont}>{province + district + town + address}</Text>
											</View>
											<View style={styles.addressList}>
												<Text style={styles.addressTitle}>邮政编码</Text>
												<Text style={styles.addressAcont}>{postalCode}</Text>
											</View>
											{/* <img
											src="/ec2021/img/ec2021/svg/edit.svg"
											onClick={() => {
												Router.push(
													{
														pathname: `/promotions/[details]?id=${promoid}&type=${'edit'}&addresskey=${id}`,
														query: {
															details: 'addressform',
															id: promoid,
															type: 'edit',
															addresskey: id
														}
													},
													`/promotions/addressform?id=${promoid}&type=${'edit'}&addresskey=${id}`
												);
											}}
										/> */}
											{defaultAddress && <span className="default">默认地址</span>}
										</View>
									</View>
								</View>
							);
						})}
					<Touch
						style={styles.add}
						onClick={() => {
							// Router.push(
							// 	{
							// 		pathname: `/promotions/[details]?id=${promoid}&type=${'add'}`,
							// 		query: {
							// 			details: 'addressform',
							// 			id: promoid,
							// 			type: 'add'
							// 		}
							// 	},
							// 	`/promotions/addressform?id=${promoid}&type=${'add'}`
							// );
						}}
					>
						<Text style={{ color: '#00A6FF', lineHeight: 40, textAlign: 'center' }}>+ 新增运送地址</Text>
					</Touch>
					{Address != '' && (
						<View>
							<Text className="Remarks">备注</Text>
							<View style={styles.inputView}>
								<TextInput
									style={styles.input}
									underlineColorAndroid="transparent"
									value={registerUsername}
									placeholder="备注"
									placeholderTextColor="#BCBEC3"
									maxLength={14}
									textContentType="username"
									onChangeText={Remark =>
										this.setState({Remark})
									}
								/>
							</View>
							<Touch
								onPress={() => {
									if (Active == '-1') {
										Toasts.error('请选择一条地址');
										return;
									}
									this.ApplyDailyDeals();
								}}
							>
								提交
						</Touch>
						</View>
					)}
				</ScrollView>
				{/* ------------------申请失败弹窗----------------- */}
				<Modal
					animationType="none"
					transparent={true}
					visible={ShowFailPopup}
					onRequestClose={() => { }}
				>
					<View style={styles.modalMaster}>
						<View style={styles.modalView}>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleTxt}>条件不足</Text>
							</View>
							<Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>{Failmsg}</Text>
							<View style={styles.modalBtn}>
								<Touch onPress={() => { this.setState({ ShowFailPopup: false }) }} style={styles.modalBtnL}>
									<Text style={{ color: '#00A6FF' }}>关闭</Text>
								</Touch>
								<Touch onPress={() => {
									this.setState({ ShowFailPopup: false }, () => { Actions.DepositCenter({ from: 'GamePage' }) })
								}} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>存款</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>


				{/* ------------------申请成功弹窗----------------- */}

				<Modal
					animationType="none"
					transparent={true}
					visible={ShowSuccessPopup}
					onRequestClose={() => { }}
				>
					<View style={styles.modalMaster}>
						<View style={styles.modalView}>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleTxt}>申请成功</Text>
							</View>
							<Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>{Successmsg}</Text>
							<View style={styles.modalBtn}>
								<Touch onPress={() => { this.setState({ ShowSuccessPopup: false }) }} style={styles.modalBtnL}>
									<Text style={{ color: '#00A6FF' }}>关闭</Text>
								</Touch>
								<Touch onPress={() => {
									this.setState({ ShowSuccessPopup: false }, () => { this.setState({ ShowSuccessPopup: false }, () => { Actions.pop() }) })
								}} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>立即游戏</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}

export default PromotionsAddress;

const styles = StyleSheet.create({
	inputView: {
		borderRadius: 8,
		borderColor: '#E6E6EB',
		borderWidth: 1,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		paddingLeft: 10,
		paddingRight: 10,
		width: width - 40,
		marginBottom: 15,
	},
	input: {
		width: width - 40,
		height:40,
		color: '#000000',
		textAlign: 'left',
		paddingLeft: 15,
		fontSize: 14,
	},



	modalMaster: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0,0.5)',
	},
	modalView: {
		width: width * 0.9,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 15,
		paddingBottom: 15,
	},
	modalTitle: {
		width: width * 0.9,
		backgroundColor: '#00A6FF',
		borderTopRightRadius: 15,
		borderTopLeftRadius: 15,
	},
	modalTitleTxt: {
		lineHeight: 40,
		textAlign: 'center',
		color: '#fff',
	},
	modalBtn: {
		width: width * 0.9,
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
	},
	modalBtnL: {
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#00A6FF',
		width: width * 0.35,
		height: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalBtnR: {
		borderRadius: 5,
		backgroundColor: '#00A6FF',
		width: width * 0.35,
		height: 42,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},


	add: {
		width: width - 50,
		borderWidth: 1,
		borderColor: '#00A6FF',
	},
	address: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	activeCap: {
		width: 20,
		height: 20,
		marginLeft: 15,
		marginRight: 15,
		borderRadius: 30,
		borderWidth: 4,
		borderColor: '#00A6FF'
	},
	cap: {
		width: 20,
		height: 20,
		marginLeft: 15,
		marginRight: 15,
		borderRadius: 30,
		borderWidth: 1,
		borderColor: '#EFEFF4'
	},
	addressList: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
	addressTitle: {
		fontSize: 12,
		color: '#999',
		paddingLeft: 15,
	},
	addressAcont: {
		fontSize: 12,
		color: '#000000'
	},
})
