
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
import moment from 'moment';
import { ApiPortSB } from '../../../containers/SbSports/lib/SPORTAPI';

class Promotions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			/* 隐藏失效的优惠 */
			HideInvalid: true
		};
	}

	componentDidMount() {
		if (localStorage.getItem('loginStatus') != 1) {
			Toasts.error('กรุณาเข้าสู่ระบบ');
			Actions.LoginModal({ types: 'login' })
			return
		}
	}

	render() {
		const { Promotionsdata } = this.props;
		const { HideInvalid } = this.state;

		/*----------------------
			筛选出失效状态的优惠
		------------------------*/
		let Invalidstatus = [
			'Expired',
			'Served',
			'Force to Serve',
			'Canceled',
			'Claimed',
			'Not eligible',
			'Approved'
		];

		/*------------------------------------------------------------------------------
			筛选出正常显示的优惠数据  Note:只有这些状态才出现在【我的优惠Tab】列表 反之过滤掉
		--------------------------------------------------------------------------------*/
		let Normalstatus = ['Pending', 'Serving', 'Waiting for release', 'Release', 'Processing'];

		const filterData = (status) => {
			let filterDataList =
				Promotionsdata != ''
					? Promotionsdata.filter((item) => {
						return status.some((n) => n === item.status);
					})
					: [];
			return filterDataList;
		};
		/*---------------- 正常的优惠列表 --------------------*/
		let Normaldata = filterData(Normalstatus);
		/*---------------- 失效的优惠列表 ---------------------*/
		let Invaliddata = filterData(Invalidstatus);

		return (
			<View style={{ flex: 1, backgroundColor: '#EFEFF4', paddingTop: 15 }}>
				{/*----------------------------------------------------------------
					正常显示的优惠 如果有数据则显示。没有数据就显示 暂无任何优惠记录
				-------------------------------------------------------------------*/}
				{Promotionsdata != '' ? Normaldata.length != 0 ? (
					Normaldata.map((data, index) => {
						return <PromotionsCard data={data} key={index} Promotions={() => this.props.Promotions()} />;
					})
				) : (
					<View style={styles.ndData}>
						<Image style={{ width: 68, height: 68 }} source={require('../../../images/euroSoprt/euroCup/nodata.png')} />
						<Text style={{ color: '#999999', lineHeight: 25 }}>您暂无任何优惠记录， </Text>
						<Text style={{ color: '#999999', lineHeight: 25 }}>先去优惠页面申请吧！</Text>
					</View>
				) : (
					[...Array(3)].map((i, k) => {
						return <View style={styles.loding} key={k} >
							<View style={styles.lodingView}><ActivityIndicator color="#fff" /></View>
						</View>;
					})
				)}

				{/*-------------------------------
						展示已经失效的优惠
				----------------------------------*/}
				{Promotionsdata != '' &&
					!!Invaliddata.length && (
						<Touch
							onPress={() => {
								this.setState({
									HideInvalid: !HideInvalid
								});
							}}
						>
							{HideInvalid ? (
								<Text style={styles.moreList}>
									失效的优惠已被隐藏 <Text style={{ color: '#00A6FF' }}> 点击查看</Text>
								</Text>
							) : (
								<Text style={styles.moreList}>
									<Text style={{ color: '#00A6FF' }}>点击隐藏 </Text>所有失效的优惠
								</Text>
							)}
						</Touch>
					)}
				{Promotionsdata != '' &&
					!HideInvalid &&
					Invaliddata.map((data, index) => {
						return (
							<View key={index}>
								<PromotionsCard
									data={data}
									dataindex={index}
									Promotions={() => this.props.Promotions()}
								/>
							</View>
						);
					})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	ndData: {
		paddingTop: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
	},
	loding: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width,
		marginTop: 12,
	},
	lodingView: {
		width: width * 0.92,
		height: width * 0.92 * 0.38,
		backgroundColor: '#00000033',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	moreList: {
		textAlign: 'center',
		lineHeight: 35,
		color: '#000000',
		fontSize: 12,
	},
	progressBar: {
		marginTop: 5,
		marginBottom: 5,
		backgroundColor: '#E0E0E0',
		height: 8,
		width: width * 0.7,
		borderRadius: 50,
	},
	Progress: {
		backgroundColor: '#00A6FF',
		height: 8,
		borderRadius: 50,
	},
	Card: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 3,
		width: width - 30,
		marginLeft: 15,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 15,
	},
	LeftContent: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	CenterContent: {
		width: width * 0.7,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
	},
	Bubble: {
		position: 'absolute',
		zIndex: 999,
		top: 28,
		right: 0,
		padding: 6,
		paddingLeft: 10,
		paddingRight: 10,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#00000033',
		backgroundColor: '#EFEFF4',
	},
	goDetail: {
		width: width * 0.69,
		borderWidth: 1,
		borderColor: '#00a6ff',
		height: 35,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
	},


	modalMaster: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0,0.5)',
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
		fontSize: 16,
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
		borderColor: '#caccd0',
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
	selectView: {
		width: width * 0.9,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	selectList: {
		width: width * 0.7,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingBottom: 15,
	},
	acpItem: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		paddingRight: 10,
		width: width * 0.7 * 0.5,
		marginBottom: 15,
	},
	activeSelect: {
		borderWidth: 3,
		borderColor: '#00a6ff',
		width: 15,
		height: 15,
		borderRadius: 30,
		marginRight: 10,
	},
	selectItem: {
		borderWidth: 1,
		borderColor: '#BCBEC3',
		width: 15,
		height: 15,
		borderRadius: 30,
		marginRight: 10,
	},
	otherInput: {
		width: width * 0.5,
		borderWidth: 1,
		borderColor: '#00000033',
		borderRadius: 8,
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginLeft: 10,
	},
})

export default Promotions;

/**
 * 优惠数据 相关类型 还有每个类型 需要对应的条件:
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @data 					| 	Promotionsdata
 * @description:			|
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @type  {Bonus} 			|
 * @type  {Manual} 			|	三种奖金类型 Bonus Manual Other
 * @type  {Other} 			|
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Pending} 		|	=> @type Bonus   展示 待处理和交易编码
 * -----------------------------------------------------------------------------------------------------------------------------------
 *  						|	=> @type Bonus   展示:
 * 												 最后更新时间 = updatedDate
 * 							|				     红利结束时间 	 = bonusProductList(Array) = expireDateTime
 * @param {Serving}			|			         进度条 		= percentage
 * 							|				     还需要多少流水  = turnoverNeeded
 *	 						|				     200红利        = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Waiting for release} => @type Bonus   展示 待派发 => 200紅利 = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Release}  		|	=> @type Bonus   展示 领取 when [ isClaimable = true ]
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Processing} 		|	=> @type Manual  展示 待处理 【查看已提交资料】 按钮
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Served} 			|	=> @type Bonus   失效 已领取  展示=>红利结束时间 bonusProductList = expireDateTime | 200红利 = bonusAmount
 * @param {Force to served} |	=> @type Bonus   失效 已领取  展示=>红利结束时间 bonusProductList = expireDateTime | 200红利 = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Cancelled} 		|	=> @type Bonus   失效 已取消  展示=>红利结束时间 bonusProductList = expireDateTime | 200红利 = bonusAmount
 * -----------------------------------------------------------------------------------------------------------------------------------
 * @param {Approved} 		|	=> @type Manual  失效 已过期  展示=>禁用【查看已提交资料】 按钮
 * @param {Not eligible} 	|   => @type Manual  失效 已过期  展示=>禁用【查看已提交资料】 按钮
 * @param {Expired} 		|	=> @type Bonus   失效 已过期
 * ------------------------------------------------------------------------------------------------------------------------------------
 *
*/
export class PromotionsCard extends React.Component {
	state = {
		/* 展开取消申请优惠弹窗 */
		ShowCancellPopup: false,
		remark: '选错优惠',
		remarkKey: 0
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
	 * @description: 取消优惠
	 * @param {*} bonusID 红利id
	 * @param {*} playerBonusID 优惠id
	 *
	*/

	CancelPromotion = (bonusID, playerBonusID) => {
		Toast.loading('请稍候...');
		let query = `bonusID=${bonusID}&playerBonusID=${playerBonusID}&remark=${this.state.remark}&`;
		fetchRequest(ApiPortSB.CancelPromotion + query, 'POST')
			.then((res) => {
				Toast.hide();
				if (res) {
					if (res.isSuccess) {
						this.setState({
							ShowCancellPopup: false
						});
						Toast.success(res.message);
						this.props.Promotions();
					} else {
						Toast.fail(res.message);
					}
				}
				hide();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { ShowCancellPopup, remark, remarkKey } = this.state;
		const {
			/* 标题 */
			title,
			/* 红利数组 */
			bonusProductList,
			/* 红利状态 */
			status,
			/* 红利ID */
			contentId,
			/* 红利过期时间 */
			endDate,
			bonusId,
			/* 红利的类型 */
			type,
			playerBonusId
		} = this.props.data;
		const { dataindex } = this.props;
		let Bonus = bonusProductList ? bonusProductList[0] : [];
		return (
			<View style={styles.Card}>
				<View style={styles.LeftContent}>
					<Image style={{ width: 40, height: 40 }} source={type == 'Manual' ? require('../../../images/euroSoprt/euroCup/icon_hs.png') : require('../../../images/euroSoprt/euroCup/icon.png')} />
					{/* <Image src={`/img/ec2021/promotions/${type == 'Manual' ? 'icon_hs' : 'icon'}.png`} /> */}
				</View>
				<View style={styles.CenterContent}>
					<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: width * 0.7 }}>
						{/*-------------------------------
							    优惠基本信息
						----------------------------- --*/}
						<Text style={{ color: '#3C3C3C', fontSize: 16, width: width * 0.62 }} numberOfLines={1}>{title}</Text>
						<View>
							{/*--------------------------------------------------------------------------------------
						气泡框 进行中的优惠才显示，点击可以弹出 (取消优惠按钮) 与（不可取消的优惠联系客服提示）
						-----------------------------------------------------------------------------------------*/}
							{type != 'Manual' &&
								(status == 'Waiting for release' ||
									status == 'Processing' ||
									status == 'Pending' ||
									status == 'Serving') && (
									<View sty>
										<TouchableOpacity
											onPress={() => {
												this.setState({
													['ShowBubble' + dataindex]: !this.state['ShowBubble' + dataindex]
												});
											}}
										>
											<Image style={{ width: 20, height: 20 }} source={require('../../../images/euroSoprt/euroCup/set.png')} />
										</TouchableOpacity>
									</View>
								)}
						</View>
					</View>

					{this.state['ShowBubble' + dataindex] && (
						<View style={styles.Bubble}>
							{status != 'Pending' ? (
								<Text>若想取消优惠，请联系客服</Text>
							) : (
								<Touch onPress={() => { this.setState({ ShowCancellPopup: true }); }}>
									<Text>
										取消
									</Text>
								</Touch>
							)}
						</View>
					)}


					{/*--------------------------------
							    优惠结束时间
					---------------------------------*/}
					{status != 'Pending' && <Text style={{ color: '#AEAEAE', fontSize: 12 }}>结束时间：{moment(endDate).format('YYYY-MM-DD hh:mm:ss')}</Text>}

					{/*--------------------------------
					            可领取的红利
					---------------------------------*/}
					{(status == 'Serving' || status == 'Release') && <Text style={{ color: '#00a6ff', }}>{Bonus.bonusAmount}元红利</Text>}

					{/*--------------------------------
								流水进度条
					---------------------------------*/}
					{status == 'Serving' && (
						<View>
							<View style={styles.progressBar}>
								<View style={[styles.Progress, { width: (parseInt(Bonus.percentage) / 100) * (width * 0.7) }]} />
							</View>
							<Text>还需 {Bonus.turnoverNeeded} 流水</Text>
						</View>
					)}

					{/*----------------------------------------
							已达到领取红利的条件 等待领取
					------------------------------------------*/}
					{status == 'Release' && (
						<Touch
							className="Btn GreenBg white"
							onClick={() => {
								this.ClaimBonus(playerBonusId);
							}}
						>
							<Text>领取红利</Text>
						</Touch>
					)}

					{/*---------------------------------
							待处理红利（可取消）
					----------------------------------*/}
					{(status == 'Pending' || status == 'Processing') && (
						<View>
							<Text style={{ color: '#00a6ff', fontSize: 16, lineHeight: 30, }}>待处理</Text>
							{status == 'Pending' && (
								<Text style={{ color: '#AEAEAE', fontSize: 12 }}>
									交易编码 {Bonus.reference.split(':')[1]}
								</Text>
							)}
							{status == 'Processing' && (
								<Touch
									style={styles.goDetail}
									onPress={() => {
										Actions.PromotionsDetail({ Detail: this.props.data })
										// Router.push(
										// 	{
										// 		pathname: `/promotions/[details]?id=${contentId}`,
										// 		query: { details: 'promoform', id: contentId }
										// 	},
										// 	`/promotions/promoform?id=${contentId}`
										// );
									}}
								>
									<Text style={{ color: '#00a6ff' }}>查看已提交资料</Text>
								</Touch>
							)}
						</View>
					)}
				</View>



				{/*-------------------------------取消优惠弹窗 选择取消的原因 -----------------------------------*/}

				<Modal
					animationType="none"
					transparent={true}
					visible={ShowCancellPopup}
					onRequestClose={() => { }}
				>
					<View style={styles.modalMaster}>
						<View style={styles.modalView}>
							<View style={styles.modalTitle}>
								<Text style={styles.modalTitleTxt}>您真的要取消优惠？</Text>
							</View>
							<Text style={{ lineHeight: 30, paddingLeft: 15, width: width * 0.9, textAlign: 'left' }}>取消原因</Text>
							<View style={styles.selectView}>
								<View style={styles.selectList}>
									{['选错优惠', '存款资料错误', '流水太多', '存款未到账', '其他'].map((val, index) => {
										return (
											<Touch
												style={styles.acpItem}
												key={index}
												onPress={() => {
													this.setState({
														remarkKey: index,
														remark: val
													});
												}}
											>
												<View style={[remarkKey === index ? styles.activeSelect : styles.selectItem]} />
												<Text style={{ color: '#BCBEC3', fontSize: 13 }}>{val}</Text>
												{remarkKey == 4 && index == 4 && (
													<View style={styles.otherInput}>
														<TextInput
															multiline={true}
															style={{ width: width * 0.5, paddingLeft: 10 }}
															placeholder='请输入原因'
															value={remark}
															onChangeText={(e) => {
																this.setState({
																	remark: e
																});
															}}
														/>
													</View>
												)}
											</Touch>
										);
									})}
								</View>
							</View>
							<View style={styles.modalBtn}>
								<Touch onPress={() => { this.setState({ ShowCancellPopup: false },() => {this.CancelPromotion(bonusId, playerBonusId);}) }} style={styles.modalBtnL}>
									<Text style={{ color: '#caccd0' }}>确认取消</Text>
								</Touch>
								<Touch onPress={() => { this.setState({ ShowCancellPopup: false }) }} style={styles.modalBtnR}>
									<Text style={{ color: '#fff' }}>保留优惠</Text>
								</Touch>
							</View>
						</View>
					</View>
				</Modal>

				{/* <Modal closable={false} className="Proms" title="您真的要取消优惠？" visible={true}>
					<label>取消原因</label>
					<ul className="cap-list cancell-list">
						{['选错优惠', '存款资料错误', '流水太多', '存款未到账', '其他'].map((val, index) => {
							return (
								<li
									className="cap-item"
									key={index}
									onClick={() => {
										this.setState({
											remarkKey: index,
											remark: val
										});
									}}
								>
									<div className={`cap-item-circle${remarkKey === index ? ' curr' : ''}`} />
									<div className="padding-left-xs">{val}</div>
									{val == '其他' && (
										<Input
											size="large"
											placeholder=""
											value={remarkKey == 4 && remark != '其他' ? remark : ''}
											onChange={(e) => {
												this.setState({
													remark: e.target.value
												});
											}}
										/>
									)}
								</li>
							);
						})}
					</ul>
					<div className="flex justify-around">
						<div
							className="Btn-Common Cancell _active"
							onClick={() => {
								this.CancelPromotion(bonusId, playerBonusId);
							}}
						>
							确认取消
						</div>
						<div
							className="Btn-Common active"
							onClick={() => {
								this.setState({
									ShowCancellPopup: false
								});
							}}
						>
							保留优惠
						</div>
					</div>
				</Modal> */}
			</View>
		);
	}
}
