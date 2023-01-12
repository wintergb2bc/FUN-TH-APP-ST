

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
class PromotionsForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			message: '',
			success: false
		};
	}

	componentDidMount() { }

	componentWillUnmount() { }

	ApplicationsBonus = (ID) => {
		const { FirstName, Contacts } = this.props.memberInfo;
		let ContactsPhone = Contacts.find((item) => item.ContactType == 'Phone');
		let postData = {
			firstName: FirstName,
			promoId: ID,
			category: '',
			remark: this.state.message,
			platform: Platform.OS,
			RecipientContactNo: ContactsPhone.Contact
		};
		Toast.loading('请稍候...');
		fetchRequest(ApiPortSB.ApplicationsBonus, 'POST', postData)
			.then((res) => {
				Toast.hide();
				if (res) {
					if (res.isSuccess && res.isPromoApplied) {
						this.setState({
							success: true
						});
					} else {
						Toast.fail(res.message);
					}
				}
			})
			.catch((error) => {
				Toast.hide();
				console.log(error);
			});
	};

	render() {
		const { title, contentId, status } = this.props.Detail;
		const { firstName, manualRemark, Contacts } = this.props.memberInfo;
		const { message, success } = this.state;
		let ContactsEmail = Contacts && Contacts.find((item) => item.ContactType == 'Email');
		let ContactsPhone = Contacts && Contacts.find((item) => item.ContactType == 'Phone');
		{
			/* ***************************************
			如果是 Processing 只可以查看资料 不可编辑
			**************************************** */
		}
		let statuscheck = status == 'Processing';
		return (
			<View style={{ flex: 1, backgroundColor: '#fff', padding: 15, }}>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					<Text style={styles.titles}>{title}</Text>
					<View>
						<Text style={styles.txt}>用户名</Text>
						<View style={styles.viewInput}>
							<Text style={{ color: '#202939' }}>{firstName}</Text>
						</View>
					</View>
					<View>
						<Text style={styles.txt}>电子邮箱</Text>
						<View style={styles.viewInput}>
							<Text style={{ color: '#202939' }}>{ContactsEmail.Contact.substr(0, 0) + '******' + ContactsEmail.Contact.substr(6)}</Text>
						</View>

						<Text style={{ color: '#666666', fontSize: 12, paddingTop: 10, }}>
							如果您想更新电子邮箱，请联系我们的<Text style={{ color: '#00a6ff' }}>在线客服</Text>
						</Text>
					</View>
					<View>
						<Text style={styles.txt}>联系电话</Text>
						<View style={styles.viewInput}>
							<Text style={{ color: '#202939' }}>{'******' + ContactsPhone.Contact.slice(-4)}</Text>
						</View>
						<Text style={{ color: '#666666', fontSize: 12, paddingTop: 10, }}>
							如果您想更新联系电话，请联系我们的<Text style={{ color: '#00a6ff' }}>在线客服</Text>
						</Text>
					</View>
					<View>
						<Text style={styles.txt}>留言</Text>
						<View style={styles.inputBg}>
							<TextInput
								editable={!statuscheck ? false : true}
								style={styles.input}
								underlineColorAndroid="transparent"
								value={!statuscheck ? message : manualRemark}
								placeholder="请输入留言"
								placeholderTextColor="#666666"
								maxLength={14}
								textContentType="username"
								onChangeText={message => {
									this.setState({ message });
								}}
							/>
						</View>
					</View>
					{!statuscheck && (
						<Touch
							style={styles.bonusBtn}
							onPress={() => {
								this.ApplicationsBonus(contentId);
							}}
						>
							<Text style={styles.bonusBtnTxt}>提交</Text>
						</Touch>
					)}
					<Modal
						animationType="none"
						transparent={true}
						visible={success}
						onRequestClose={() => { }}
					>
						<View style={styles.modalMaster}>
							<View style={styles.modalView}>
							<Image style={{ width: 60, height: 60 }} source={require('../../../../images/euroSoprt/icon-done.png')} />
								<Text style={{ lineHeight: 30, textAlign: 'center', color: '#111', fontSize: 16 }}>完成申请</Text>
								<Text style={{ lineHeight: 30, textAlign: 'center', color: '#111' }}>请到“我的优惠”页面查看</Text>
								<View style={styles.modalBtn}>
									<Touch onPress={() => { this.setState({ success: false }) }} style={styles.modalBtnL}>
										<Text style={{ color: '#00A6FF' }}>关闭</Text>
									</Touch>
									<Touch onPress={() => {
										this.setState({ success: false }, () => { })
									}} style={styles.modalBtnR}>
										<Text style={{ color: '#fff' }}>我的优惠</Text>
									</Touch>
								</View>
							</View>
						</View>
					</Modal>
					{/* <Modal className="Proms" visible={success}>
					<div className="Content">
						<Image src="/img/ec2021/svg/success.svg" />
						<big>完成申请</big>
						<p>请到“我的优惠”页面查看</p>
					</div>
					<div className="flex justify-around">
						<div
							className="Btn-Common"
							onClick={() => {
								this.setState({
									success: false
								});
							}}
						>
							关闭
						</div>
						<div
							className="Btn-Common active"
							onClick={() => {
								Router.push({
									pathname: '/',
									query: { tab: 'promo', key: 1 }
								});
							}}
						>
							我的优惠
						</div>
					</div>
				</Modal> */}
				</ScrollView>
			</View>
		);
	}
}
const styles = StyleSheet.create({
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
		paddingTop: 15,
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



	titles: {
		paddingBottom: 25,
		fontWeight: 'bold',
		color: '#000',
		fontSize: 16,
	},
	txt: {
		color: '#666666',
		lineHeight: 30,
	},
	viewInput: {
		backgroundColor: '#EFEFF4',
		borderRadius: 8,
		width: width - 30,
		height: 40,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 15,
	},
	inputBg: {
		borderRadius: 8,
		backgroundColor: '#EFEFF4',
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: width - 30,
	},
	input: {
		width: width - 30,
		paddingLeft: 15,
		height: 40,
		color: '#202939',
		textAlign: 'left',
	},
	bonusBtn: {
		backgroundColor: '#00A6FF',
		width: width - 30,
		borderRadius: 5,
		marginTop: 30
	},
	bonusBtnTxt: {
		textAlign: 'center',
		lineHeight: 40,
		color: '#fff',
		fontWeight: 'bold'
	},
})
export default PromotionsForm;
