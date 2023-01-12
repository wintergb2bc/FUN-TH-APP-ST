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
	ActivityIndicator,
	NativeModules,
	Alert,
	UIManager,
	Modal
} from "react-native";
import { Checkbox, Radio, WhiteSpace, WingBlank, Flex, Toast, InputItem, Picker, List, Slider, DatePicker } from 'antd-mobile-rn';
import { WebView } from 'react-native-webview';
import CalendarPicker from 'react-native-calendar-picker';
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

import React from 'react';
import { ApiPortSB } from '../../../../containers/SbSports/lib/SPORTAPI';
class PromotionsRebateDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			/* 优惠详细网址URL */
			modalHtml: '',
			/* 默认优惠类型 */
			type: 'Bonus',
			/* 默认优惠状态 */
			status: 'Available',
			Detail: '',
			Successmsg: '恭喜您！申请成功',
			ShowSuccessPopup: false,
			ShowFailPopup: false,
			Failmsg: '您暂时不符合此好礼资格，建议马上存款。'
		};
	}

	componentDidMount() {
		/*------------- 检索需要准备的数据 ------------*/
		let DailyDealsPromotiondata = JSON.parse(localStorage.getItem('DailyDealsPromotiondata'));
		if (DailyDealsPromotiondata) {
			/*------------- 获取每日好礼优惠的本地数据 ----------*/
			this.Detail(DailyDealsPromotiondata);
		} else {
			/*------------- 请求每日好礼Api获取优惠数据 --------*/
			this.DailyDealsPromotion();
		}
	}


	/**
	 * @description: 每日好礼数据
	*/

	DailyDealsPromotion = () => {
		fetchRequest(ApiPortSB.DailyDealsPromotion + 'eventCategoryType=Euro2021&', 'GET')
			.then((res) => {
				if (res && res.length) {
					/*------ 获得本条优惠的ID ------*/
					// const { id } = Router.router.query;
					/*------ 根据ID筛选出对应的数据 -----*/
					const Detail = res.find((item) => item.id == this.props.ids);
					this.setState(
						{
							Detail: Detail
						}
					);
					localStorage.setItem('DailyDealsPromotiondata', JSON.stringify(res));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	Detail = (data) => {
		console.log(data);
		/*------ 获得本条优惠的ID ------*/
		// const { id } = Router.router.query;
		/*------ 根据ID筛选出对应的数据 -----*/
		const Detail = data.find((item) => item.id == this.props.ids);
		Detail &&
			this.setState(
				{
					Detail: Detail
				}
			);
	};

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
				Toast.hide();
				if (res) {
					if (res.isClaimSuccess) {
						Toast.success(res.message);
					} else {
						Toast.fail(res.message);
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	/**
		   * ---------------------------------------------------------------
		 * @data 						Detail.status
		 * @description:				每日好礼申请优惠按钮的动作状态:
		 * ---------------------------------------------------------------
		 * @param {string} Available 显示立即申请按钮
		 * @bonusType = ManualItems 跳转去收礼地址页面
			 * @其他bonusType = 去直接申请
		 * ---------------------------------------------------------------
		 * @param {string} SoldOut			显示 已售罄 置灰禁止点击
		 * @param {string} grabbed			显示 已参与 置灰禁止点击
		 * ---------------------------------------------------------------
	*/

	/**
	 * @description: 申请每日好礼优惠
	 * @param {*}
	 * @return {Object}
	*/

	ApplyDailyDeals = (Detail) => {
		Toast.loading('请稍候...');
		let query = `contentId=${Detail.id}&bonusItem=${Detail.bonusItem}&bonusAmount=${Detail.bonusAmount}&`;
		fetchRequest(ApiPortSB.ApplyDailyDeals + query, 'POST')
			.then((res) => {
				console.log(res);
				Toast.hide();
				if (res) {
					if (res.isSuccess) {
						this.setState({
							ShowSuccessPopup: true,
							Successmsg: res.message
						});
					} else {
						this.setState({
							ShowFailPopup: true,
							Failmsg: res.message
						});
					}
				}

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

	render() {
		const { Detail, ShowSuccessPopup, Successmsg, ShowFailPopup, Failmsg } = this.state;
		//直接判断这三个状态就行了  简单快捷
		//"Status" = Available 显示 立即申请
		//"Status" = SoldOut   显示 已售罄 没动作
		//"status" = grabbed   显示 已参与 没动作
		const modalHtml = Detail ? Detail.modalHtml : ''
		console.log('DetailDetail', Detail)
		return (
			<View style={{ flex: 1, backgroundColor: '#fff' }}>
				{Detail != '' && (
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
						}
						{/* ---------END--------- */}
						<View style={{paddingBottom: 20}}>
							{(() => {
								switch (Detail.status) {
									case 'Available':
										return Detail.bonusType == 'ManualItems' && Detail.bonusItem != 'Free Spin' ? (

											<Touch
												onPress={() => {
													// Actions.PromotionsAddress({promoid: Detail.id})
													// Router.push(
													// 	{
													// 		pathname: `/promotions/[details]?id=${Detail.id}`,
													// 		query: {
													// 			details: 'addresslist',
													// 			id: Detail.id
													// 		}
													// 	},
													// 	`/promotions/addresslist?id=${Detail.id}`
													// );
												}}

												style={styles.bonusBtn}>
												<Text style={styles.bonusBtnTxt}>立即申请</Text>
											</Touch>
										) : (
											<Touch
												style={styles.bonusBtn}
												onPress={() => {
													this.ApplyDailyDeals(Detail);
												}}
											>
												<Text style={styles.bonusBtnTxt}>立即申请</Text>
											</Touch>
										);
										break;
									case 'SoldOut':
										return <View style={styles.nullbonusBtn}><Text style={styles.nullbonusBtnTxt}>已售罄</Text></View>;
										break;
									case 'grabbed':
										return <View style={styles.nullbonusBtn}><Text style={styles.nullbonusBtnTxt}>已参与</Text></View>;
										break;
									default:
										return null;
								}
							})()}
						</View>
					</View>
				)}
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
									this.setState({ ShowSuccessPopup: false }, () => { this.setState({ ShowSuccessPopup: false },() => {Actions.pop()}) })
								}} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>立即游戏</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>

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
			</View>
		);
	}
}

const styles = StyleSheet.create({
	webViewStyle: {
		flex: 1,
		backgroundColor: "#fff",
		borderWidth: 0
		// width: width,
		// height: height,
	},
	bonusBtnTxt: {
		textAlign: 'center',
		lineHeight: 40,
		color: '#fff',
		fontWeight: 'bold'
	},
	bonusBtn: {
		backgroundColor: '#00A6FF',
		width: width - 30,
		borderRadius: 5,
		marginLeft: 15,
	},
	nullbonusBtnTxt: {
		textAlign: 'center',
		lineHeight: 40,
		color: '#BCBEC3',
		fontWeight: 'bold'
	},
	nullbonusBtn: {
		backgroundColor: '#EFEFF4',
		width: width - 30,
		borderRadius: 5,
		marginLeft: 15,
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
})


export default PromotionsRebateDetail;
