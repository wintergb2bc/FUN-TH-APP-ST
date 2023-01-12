
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
// import DateRange from '@/DateRange/';
/* 最近30天 */
let Last30days = new Date(moment(new Date()).subtract(1, 'months').format('YYYY/MM/DD HH:mm:ss'));
/* 今天 */
let Today = new Date();
class PromotionsRebate extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			dateRangeVisible: false,
			DateFrom: Last30days,
			DateTo: Today,
			active: true,
			Rebatedata: '',
			Loading: true,
			ActiveTime: false
		};
	}

	componentDidMount() {
		if (localStorage.getItem('loginStatus') != 1) {
			Toasts.error('กรุณาเข้าสู่ระบบ');
			Actions.LoginModal({ types: 'login' })
			return
		}
		this.PromotionsRebate();
	}

	/**
	 * @description: 获取优惠返水的数据
	*/
	PromotionsRebate = () => {
		const { DateFrom, DateTo } = this.state;
		/* ---------------------开始时间------------------------ */
		let From = moment(DateFrom).format('YYYY-MM-DD HH:mm:ss');
		/* ---------------------结束时间------------------------ */
		let To = moment(DateTo).format('YYYY-MM-DD HH:mm:ss');
		let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&DateFrom=${From}&DateTo=${To}&`;
		this.setState({
			Loading: true
		});
		fetchRequest(ApiPort.GetPromotions + query, 'GET')
			.then((res) => {
				if (res && res.length) {
					this.setState({
						Rebatedata: res
					});
					localStorage.setItem('Rebatedata', JSON.stringify(res));
				}
				this.setState({
					Loading: false
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { dateRangeVisible, DateFrom, DateTo, active, Rebatedata, Loading, ActiveTime } = this.state;
		return (
			<View style={{ flex: 1, }}>
				<View style={styles.Menu}>
					<Text style={{ color: '#666666', fontSize: 12, }}>
						总得返水: đ{Rebatedata != '' ? Rebatedata[0].memberPromotionRebateViewData.totalPayout : 0}
					</Text>
					<View style={styles.dateView}>
						<Touch
							style={[!ActiveTime ? styles.activeDate : styles.noActiveDate]}
							onPress={() => {
								this.setState(
									{
										active: true,
										DateFrom: Last30days,
										DateTo: Today
									},
									() => {
										this.PromotionsRebate();
									}
								);
							}}

						>
							<Text style={{ color: !ActiveTime ? '#00A6FF' : '#666666', fontSize: 12 }}>近30天</Text>
						</Touch>
						<View
							style={[ActiveTime ? styles.activeDate : styles.noActiveDate]}
							onClick={() => {
								this.setState({
									dateRangeVisible: true,
									active: false
								});
							}}
						>
							<Text style={{ color: ActiveTime ? '#00A6FF' : '#666666', fontSize: 12, paddingRight: 8, }}>
								{ActiveTime ? (
									`${moment(DateFrom).format('MM/DD')}至${moment(DateTo).format('MM/DD')}`
								) : (
									'日期'
								)}
							</Text>
							<Image style={{ width: 13, height: 13 }} source={ActiveTime ? require('../../../images/euroSoprt/euroCup/calendar.png') : require('../../../images/euroSoprt/euroCup/calendarW.png')} />
						</View>
					</View>

					{/* 日期范围 */}
					{/* <DateRange
						dateRangeVisible={dateRangeVisible}
						onClose={(type) => {
							this.setState({ dateRangeVisible: false }, () => {
								if (type == '确认') {
									this.PromotionsRebate();
								}
							});
						}}
						onChange={(time) => {
							this.setState({
								DateFrom: time[0],
								DateTo: time[1],
								ActiveTime: true
							});
						}}
						value={[ DateFrom, DateTo ]}
						note={'搜索时间范围为30天内，并可搜索90天之内的返水记录。'}
					/> */}
				</View>

				{Rebatedata != '' && !Loading ? (
					Rebatedata.map((data, index) => {
						const { rebatesSummary } = data.memberPromotionRebateViewData;
						let Nulldata = rebatesSummary.length == 0;
						let memberCategory = !Nulldata ? rebatesSummary[0].memberCategory : 'Normal';
						let totalTurnover = !Nulldata ? rebatesSummary[0].totalTurnover : '-';
						let totalRebateAmount = !Nulldata ? 'đ' + rebatesSummary[0].totalRebateAmount : '-';

						return (
							<View style={styles.Content} key={index}>
								<Image style={{ width: 80, height: 80 }} source={{ uri: data.thumbnailMobileImage || '' }} />
								<View style={styles.ContentRight}>
									<View style={styles.lists}>
										<Text style={styles.listTxt}>会员等级</Text>
										<Text style={styles.listTxt}>{memberCategory == 'Normal' ? '普通会员' : 'VIP会员'}</Text>
									</View>
									<View style={styles.lists}>
										<Text style={styles.listTxt}>30天内所达流水</Text>
										<Text style={styles.listTxt}>{totalTurnover == '' ? '-' : totalTurnover}</Text>
									</View>
									<View style={styles.lists}>
										<Text style={styles.listTxt}>30天内所得返水</Text>
										<Text style={styles.listTxt}>{totalRebateAmount == '' ? '-' : totalRebateAmount}</Text>
									</View>
									{!Nulldata ? (
										<Touch
											style={styles.goDetaile}
											onPress={() => {
												Actions.PromoRebateHistory({ contentId: data.contentId })
												// Router.push(
												// 	{
												// 		pathname: `/promotions/[details]?id=${data.contentId}`,
												// 		query: { details: 'rebatehistory', id: data.contentId }
												// 	},
												// 	`/promotions/rebatehistory?id=${data.contentId}`
												// );
											}}
										>
											<Text style={{ fontSize: 12, color: '#00A6FF' }}>查看历史</Text>
										</Touch>
									) : (
										<View style={styles.naData}>
											<Text style={{ fontSize: 12, color: '#BCBEC3' }}>暂时无记录，快开始投注吧！</Text>
										</View>
									)}
								</View>
							</View>
						);
					})
				) : Loading ? (
					[...Array(3)].map((i, k) => {
						return <View style={styles.loding} key={k} >
							<View style={styles.lodingView}><ActivityIndicator color="#fff" /></View>
						</View>;
					})
				) : (
					<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
						<Image style={{ width: 68, height: 68 }} source={require('../../../images/euroSoprt/euroCup/nodata.png')} />
						<Text style={{ color: '#999999', lineHeight: 30 }}>暂无数据</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
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
	Menu: {
		width: width,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		padding: 15,
	},
	activeDate: {
		borderWidth: 1,
		borderColor: '#00A6FF',
		borderRadius: 50,
		padding: 7,
		paddingLeft: 12,
		paddingRight: 12,
		marginLeft: 10,
		marginLeft: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	noActiveDate: {
		borderWidth: 1,
		borderColor: '#666666',
		borderRadius: 50,
		padding: 7,
		paddingLeft: 12,
		paddingRight: 12,
		marginLeft: 10,
		marginLeft: 10,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	dateView: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	Content: {
		width: width - 30,
		marginLeft: 15,
		borderRadius: 10,
		padding: 15,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#fff',
		marginTop: 15,
	},
	ContentRight: {
		paddingLeft: 12,
	},
	lists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
	},
	listTxt: {
		width: width * 0.3,
		color: '#000',
		fontSize: 12,
		lineHeight: 25,
	},
	naData: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#EFEFF4',
		borderRadius: 5,
		width: width * 0.6,
		height: 38,
	},
	goDetaile: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#00A6FF',
		borderWidth: 1,
		borderRadius: 5,
		width: width * 0.6,
		height: 36,
	},
})

export default PromotionsRebate;
