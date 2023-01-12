
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
// import Router from 'next/router';
// import Toast from '@/Toast';
// import Modal from '@/Modal';
import { WebView } from 'react-native-webview';
import { ApiPortSB } from '../../../../containers/SbSports/lib/SPORTAPI';
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_getBalanceAll } from '../../../../containers/SbSports/lib/redux/actions/UserInfoAction';
import { connect } from 'react-redux';


class PromotionsDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			/* 优惠详细网址URL */
			modalHtml: this.props.Detail && this.props.Detail.modalHtml || '',
			/* 默认优惠类型 */
			type: 'Bonus',
			/* 默认优惠状态 */
			status: 'Available',
			/* 显示余额不足 */
			Todeposit: false,
			htmlcontent: ''
		};
	}

	componentDidMount() {
	}


	/**
	 * @description: 领取红利
	 * @param {*} id 优惠ID
	*/

	ClaimBonus = (ID) => {
		let postData = {
			playerBonusId: ID
		};
		Toast.loading('请稍候...');
		fetchRequest(ApiPortSB.ClaimBonus, 'POST', postData)
			.then((res) => {
				console.log(res);
				if (res) {
					if (res.isClaimSuccess) {
						Toast.success(res.message);
					} else {
						Toast.error(res.message);
					}
				}
				// Toast.destroy();
			})
			.catch((error) => {
				console.log(error);
			});
	};
	_onNavigationStateChange = (e) => {
		// if (e.url == 'http://livechat.tlc808.com/') {
		// 	LiveChatOpenGlobe()
		// 	this.setState({ onNavigation: false })
		// 	setTimeout(() => {
		// 		//切换回去优惠详情
		// 		this.setState({ onNavigation: true })
		// 	}, 1000);
		// }
	}

	onLoadStart(e) {
		this.setState({ loading: true });
	}

	onLoadEnd(e) {
		this.setState({ loading: false });
	}

	onError(e) {
		this._webView.reload();
	}

	/**
		 * 申请优惠按钮的动作状态:
		   * ------------------------------------------------------------------------------------------------------------------------------
		 * @data 						Promotionsdata
		 * @description:
		 * ------------------------------------------------------------------------------------------------------------------------------
		 * @type  {Bonus} 				立即申请
		 * @type  {Manual} 				立即申请 打开奖金申请表页面
		 * @type  {Other} 				不做任何状态 隐藏按钮
		 * -------------------------------------------------------------------------------------------------------------------------------
		 * @param {Pending} 			@type  {Bonus}	显示待处理按钮
		 * @param {Processing} 			@type  {Bonus} 	显示待处理按钮
		 * -------------------------------------------------------------------------------------------------------------------------------
		 * @param {Serving} 			@type  {Bonus}	显示进度条 => 百分比 => 进度完成率 => 显示所需的营业额
		 * -------------------------------------------------------------------------------------------------------------------------------
		 * @param {Waiting for release} @type  {Bonus}	显示待派发按钮
		 * -------------------------------------------------------------------------------------------------------------------------------
		 * @param {Release}  			@type  {Bonus}	显示领取按钮  when [ isClaimable = true ]  call POST /api/Bonus/Claim
		 * -------------------------------------------------------------------------------------------------------------------------------
		 * @param {Available} 			@type  {Bonus} 	显示立即申请按钮 如果钱包有足够的金额重定向到转账页面，否则重定向到存款页面与选定的奖金
		 * @param {Available} 			@type  {Manual} 显示立即申请按钮 打开优惠申请表页面
		 * -------------------------------------------------------------------------------------------------------------------------------
		 * @param {Served} 				@type  {Bonus} 	显示已领取按钮
		 * @param {Force to served} 	@type  {Bonus} 	显示已领取按钮
		 * -------------------------------------------------------------------------------------------------------------------------------
	*/

	render() {
		const { Todeposit, modalHtml } = this.state;
		const { type, status, contentId, isClaimable, bonusProductList } = this.props.Detail;
		const memberInfo = JSON.parse(localStorage.getItem('memberInfo'));
		let ContactsEmail = memberInfo && memberInfo.Contacts.find((item) => item.ContactType == 'Email');
		let ContactsPhone = memberInfo && memberInfo.Contacts.find((item) => item.ContactType == 'Phone');
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				{/* -----优惠HTML容器---- */}
				{ modalHtml != '' && <WebView
						ref={ref => {
							this._webView = ref;
						}}
						onLoadStart={e => this.onLoadStart(e)}
						onLoadEnd={e => this.onLoadEnd(e)}
						onError={(e) => this.onError(e)}
						//source={{ html: body }}
						//<meta>  防止字體縮小 ,只有ios需要這樣處裡
						source={{ uri: modalHtml }}
						scalesPageToFit={Platform.OS === "ios" ? false : true}
						originWhitelist={["*"]}
						thirdPartyCookiesEnabled={true}
						style={styles.webViewStyle}
					// onNavigationStateChange={this._onNavigationStateChange}
					/>
				{/* ---------END--------- */}
				<View style={styles.activeBtn}>
					{(() => {
						switch (status) {
							case 'Available':
								return (
									/* -------------------只要SB类型的优惠可以申请-------------------- */
									bonusProductList[0].bonusProduct == 'SB' &&
									(
										<Touch
											style={styles.bonusBtn}
											onPress={() => {
												if (type == 'Bonus') {
													/* ---------------余额小于100提示去充值---------------- */
													if (this.props.userInfo.balanceTotal < 100) {
														this.setState({
															Todeposit: true
														});
													} else {
														/* -----------------否则去转账页面----------------- */
														Actions.pop();
														Actions.Transfer({ froms: 'promotions', promotionsDetail: this.props.Detail })
														// window.location.href = `${window.location
														// 	.origin}/transfer?origin=ec2021&id=${bonusProductList[0]
														// 		.bonusID}&wallet=${bonusProductList[0].bonusProduct}`;
													}
												} else if (type == 'Manual') {
													if (
														!memberInfo.FirstName ||
														!(ContactsEmail && ContactsEmail.Status == 'Verified') ||
														!(ContactsPhone && ContactsPhone.Status == 'Verified')
													) {
														Toasts.error('资料不完整，请至个人资料完善！', 3);
														// setTimeout(() => {
														// 	window.location.href = '/';
														// }, 1000);
														return;
													}
													Actions.pop();
													Actions.PromotionsForm({memberInfo,Detail: this.props.Detail})
													// Router.push(
													// 	{
													// 		pathname: `/promotions/[details]?id=${contentId}`,
													// 		query: {
													// 			details: 'promoform',
													// 			id: contentId
													// 		}
													// 	},
													// 	`/promotions/promoform?id=${contentId}`
													// );
												}
											}}
										>

											<Text style={styles.bonusBtnTxt}>立即申请</Text>
										</Touch>
									)
								);
								break;
							case 'Processing':
								return (
									<Touch
										style={styles.bonusBtn}
										onPress={() => {
											Actions.pop();
											Actions.PromotionsForm({memberInfo,Detail: this.props.Detail})
											// Router.push(
											// 	{
											// 		pathname: `/promotions/[details]?id=${contentId}`,
											// 		query: {
											// 			details: 'promoform',
											// 			id: contentId
											// 		}
											// 	},
											// 	`/promotions/promoform?id=${contentId}`
											// );
										}}
									>

										<Text style={styles.bonusBtnTxt}>查看已提交资料</Text>
									</Touch>
								);
								break;
							case 'Serving':
								return (
									bonusProductList && (
										<View>
											<View style={styles.progressBar}>
												<View style={[styles.Progress, { width: (parseInt(bonusProductList[0].percentage) / 100) * (width - 30) }]} />
											</View>
											<Text style={{ textAlign: 'center', fontSize: 13, color: '#111' }}>还需<Text style={{ fontWeight: 'bold' }}>{bonusProductList[0].turnoverNeeded}</Text>流水,可得<Text style={{ fontWeight: 'bold' }}>{bonusProductList[0].bonusAmount}</Text>元红利</Text>
										</View>
									)
								);
								break;
							case 'Release':
								return (
									/* ****** 先检查 isClaimable 为 true *******/
									isClaimable && (
										<Touch
											style={styles.bonusBtnOk}
											onPress={() => {
												this.ClaimBonus(contentId);
											}}
										>

											<Text style={styles.bonusBtnTxt}>领取红利</Text>
										</Touch>
									)
								);
								break;
							case 'Served':
							case 'Force to served':
								return (
									<View
										style={styles.bonusBtnNull}
									>

										<Text style={styles.bonusBtnTxtNull}>已领取</Text>
									</View>
								);
								break;
							default:
								return null;
						}
					})()}
				</View>
				{/*-------------------------------取消优惠弹窗 选择取消的原因 -----------------------------------*/}

				<Modal
					animationType="none"
					transparent={true}
					visible={Todeposit}
					onRequestClose={() => { }}
				>
					<View style={styles.modalMaster}>
						<View style={styles.modalView}>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleTxt}>余额不足</Text>
							</View>
							<Text style={{ lineHeight: 70, textAlign: 'center', color: '#666' }}>您的余额不足，请马上存款。</Text>
							<View style={styles.modalBtn}>
								<Touch onPress={() => { this.setState({ Todeposit: false }) }} style={styles.modalBtnL}>
									<Text style={{ color: '#00A6FF' }}>关闭</Text>
								</Touch>
								<Touch onPress={() => {
									this.setState({ Todeposit: false }, () => { Actions.pop();Actions.DepositCenter({ froms: 'promotions', promotionsDetail: this.props.Detail }) })
								}} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>存款</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>
				{/* <Modal closable={false} className="Proms" title="余额不足" visible={Todeposit}>
					<p className="txt">您的余额不足，请马上存款。</p>
					<div className="flex justify-around">
						<div
							className="Btn-Common"
							onClick={() => {
								this.setState({
									Todeposit: false
								});
							}}
						>
							关闭
						</div>
						<div
							className="Btn-Common active"
							onClick={() => {
								window.location.href = `${window.location
									.origin}/deposit?origin=ec2021&id=${bonusProductList[0]
										.bonusID}&wallet=${bonusProductList[0].bonusProduct}`;
							}}
						>
							存款
						</div>
					</div>
				</Modal> */}
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

	webViewStyle: {
		flex: 1,
		backgroundColor: "#fff",
		borderWidth: 0
		// width: width,
		// height: height,
	},
	activeBtn: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		padding: 15,
	},
	bonusBtnTxt: {
		textAlign: 'center',
		lineHeight: 40,
		color: '#fff',
		fontWeight: 'bold'
	},
	bonusBtnTxtNull: {
		textAlign: 'center',
		lineHeight: 40,
		color: '#BCBEC3',
		fontWeight: 'bold'
	},
	bonusBtn: {
		backgroundColor: '#00A6FF',
		width: width - 30,
		borderRadius: 5,
	},
	bonusBtnOk: {
		backgroundColor: '#33C85D',
		width: width - 30,
		borderRadius: 5,
	},
	bonusBtnNull: {
		backgroundColor: '#EFEFF4',
		width: width - 30,
		borderRadius: 5,
	},
	progressBar: {
		marginTop: 20,
		marginBottom: 20,
		backgroundColor: '#E0E0E0',
		height: 10,
		width: width - 30,
		borderRadius: 50,
	},
	Progress: {
		backgroundColor: '#00A6FF',
		height: 10,
		borderRadius: 50,
	},
})

const mapStateToProps = (state) => ({
	userInfo: state.userInfo
});
const mapDispatchToProps = {
	userInfo_getBalanceSB: (forceUpdate = false) => ACTION_UserInfo_getBalanceSB(forceUpdate),
	userInfo_getBalanceAll: (forceUpdate = false) => ACTION_UserInfo_getBalanceAll(forceUpdate)
};

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsDetail);
