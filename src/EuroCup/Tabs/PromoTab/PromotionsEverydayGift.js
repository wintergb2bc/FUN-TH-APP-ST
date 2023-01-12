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
import CalendarPicker from 'react-native-calendar-picker';
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

import React from 'react';
// import Router from 'next/router';
// import LazyLoad from 'react-image-lazy-load';
// import Countdown from 'react-countdown';
import { ApiPortSB } from '../../../containers/SbSports/lib/SPORTAPI';
import moment from 'moment';
const minDate = [new Date(new Date().getTime() - 7257600000), new Date(new Date().getTime() - 7257600000)];
const maxDate = [new Date(), new Date()];
/* 最近30天 */
let Last30days = new Date(moment(new Date()).subtract(1, 'months').format('YYYY/MM/DD HH:mm:ss'));
/* 今天 */
let Today = new Date();
class PromotionsEverydayGift extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			DailyDeals: '',
			Address: []
		};
	}

	componentDidMount() {
		let DailyDealsPromotiondata = JSON.parse(localStorage.getItem('DailyDealsPromotiondata'));
		if (DailyDealsPromotiondata) {
			this.setState({
				DailyDeals: DailyDealsPromotiondata
			});
		}
		this.DailyDealsPromotion();
		this.ShippingAddress();
	}

	/**
	 * @description: 每日好礼数据
	*/

	DailyDealsPromotion = () => {
		fetchRequest(ApiPortSB.DailyDealsPromotion + 'eventCategoryType=Euro2021&', 'GET')
			.then((res) => {
				if (res && res.length) {
					this.setState({
						DailyDeals: res
					});
					localStorage.setItem('DailyDealsPromotiondata', JSON.stringify(res));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	/**
	 * @description: 获取会员的收礼地址列表
	 * @return {Array}
	*/

	ShippingAddress = () => {
		fetchRequest(ApiPortSB.ShippingAddress, 'GET')
			.then((res) => {
				if (res) {
					this.setState({
						Address: res
					});
					localStorage.setItem('Address', JSON.stringify(res));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { activetab, DailyDeals, Address } = this.state;
		return (
			<View style={{ flex: 1, backgroundColor: '#EFEFF4' }}>
				<View style={styles.Menu}>
					<Touch
						style={[activetab == 0 ? styles.activetab : styles.tab]}
						onPress={() => {
							this.setState({
								activetab: 0
							});
						}}
					>
						<Image style={{ width: 18, height: 18 }} source={require('../../../images/euroSoprt/euroCup/libao.png')} />
						<Text style={{ color: activetab == 0 ? '#fff' : '#3C3C3C', paddingLeft: 10 }}>每日好礼</Text>
					</Touch>
					<Touch
						style={[activetab == 1 ? styles.activetab : styles.tab]}
						onPress={() => {
							this.setState({
								activetab: 1
							});
						}}
					>
						<Image style={{ width: 18, height: 18 }} source={activetab == 1 ? require('../../../images/euroSoprt/euroCup/calendar3.png') : require('../../../images/euroSoprt/euroCup/calendarW.png')} />
						<Text style={{ color: activetab == 1 ? '#fff' : '#3C3C3C', paddingLeft: 10, }}>好礼记录</Text>
					</Touch>
				</View>
				{activetab == 0 ? DailyDeals != '' ? <EverydayGift DailyDeals={DailyDeals} /> : (
					[...Array(3)].map((i, k) => {
						return <View style={styles.loding} key={k} >
							<View style={styles.lodingView}><ActivityIndicator color="#fff" /></View>
						</View>;
					})
				) : <View />}
				{activetab == 1 && <EverydayGiftHistory Address={Address} />}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	Menu: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexDirection: 'row',
		width: width,
		paddingTop: 15,
		paddingBottom: 15,
	},
	activetab: {
		width: width * 0.4,
		height: 45,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 5,
		backgroundColor: '#00A6FF',
	},
	tab: {
		width: width * 0.4,
		height: 45,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		borderRadius: 5,
		backgroundColor: '#fff',
	},
	Giftlist: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 15,
	},
	Times: {
		position: 'absolute',
		top: 5,
		right: 5,
		zIndex: 999,
	},
	giftState: {
		position: 'absolute',
		zIndex: 9999,
		bottom: 12,
		backgroundColor: '#33C85D',
		padding: 5,
		borderRadius: 5,
	},
	giftStateNull: {
		position: 'absolute',
		zIndex: 9999,
		bottom: 12,
		backgroundColor: '#CACACA',
		padding: 5,
		borderRadius: 5,
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
	activeDate: {
		borderWidth: 1,
		borderColor: '#00A6FF',
		borderRadius: 50,
		padding: 7,
		width: 60,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginRight: 15,
	},
	Historylist: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 15,
		marginTop: 15,
		width: width - 30,
		marginLeft: 15,
	},
	title: {
		fontSize: 12,
		color: '#999999',
		width: 60,
		lineHeight: 25,
	},
	count: {
		width: width * 0.3,
		fontSize: 12,
		color: '#000',
	},
	list: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
	},
})

export default PromotionsEverydayGift;

/* --------------每日好礼列表------------------ */
export class EverydayGift extends React.Component {
	state = {};

	componentWillUnmount() {
		this.setState = () => false;
	}
	render() {
		const { DailyDeals } = this.props;
		// const Completionist = () => <span>活动结束</span>;
		// const renderer = ({ hours, minutes, seconds, completed }) => {
		// 	if (completed) {
		// 		return <Completionist />;
		// 	} else {
		// 		return (
		// 			<span>
		// 				{hours}小时 {minutes}分钟
		// 			</span>
		// 		);
		// 	}
		// };
		return DailyDeals.map((data, index) => {
			const { status, quantity, imagePath, period, id, endDate } = data;
			let time = period.split(' - ')[1];
			return (
				<Touch
					style={styles.Giftlist}
					key={index}
					onPress={() => {
						if (localStorage.getItem('loginStatus') != 1) {
							Toasts.error('กรุณาเข้าสู่ระบบ');
							Actions.LoginModal({ types: 'login' })
							return
						}
						if (status == 'SoldOut') return;
						Actions.PromotionsRebateDetail({ ids: id })
						// Router.push(
						// 	{
						// 		pathname: `/promotions/[details]?id=${id}`,
						// 		query: { details: 'rebatedetail', id: id }
						// 	},
						// 	`/promotions/rebatedetail?id=${id}`
						// );
					}}
				>
					<View>
						<Image style={{ width: width * 0.92, height: width * 0.92 * 0.38 }} source={{ uri: imagePath || '' }} defaultSource={require('../../../images/euroSoprt/euroCup/bg2.png')} />
						{/* <Countdown date={new Date(time)} renderer={renderer} /> */}
					</View>
					<View style={styles.Times}>

					</View>
					{(status == 'Available' || status == 'Grabbed') &&
						<View style={styles.giftState}>
							<Text style={{ color: '#fff', fontSize: 12, }}>仅剩{quantity}</Text>
						</View>
					}
					{status == 'SoldOut' && (
						<View style={styles.giftStateNull}>
							<Text style={{ color: '#888888', fontSize: 12, }}>
								已售罄
								</Text>
						</View>
					)}
				</Touch>
			);
		});
	}
}

/* --------------每日好礼记录------------------ */
export class EverydayGiftHistory extends React.Component {
	state = {
		DateFrom: Last30days,
		DateTo: Today,
		GiftHistory: '',
		Loading: true,
		dateRangeVisible: false
	};

	componentDidMount() {
		if (localStorage.getItem('loginStatus') != 1) {
			Toasts.error('กรุณาเข้าสู่ระบบ');
			Actions.login({ types: 'login' })
			return
		}
		this.DailyDealsHistory();
	}
	/**
	 * @description: 获取优惠返水的数据
	*/
	DailyDealsHistory = () => {
		const { DateFrom, DateTo } = this.state;
		/* ---------------------开始时间------------------------ */
		let From = moment(DateFrom).format('YYYY-MM-DD HH:mm:ss');
		/* ---------------------结束时间------------------------ */
		let To = moment(DateTo).format('YYYY-MM-DD HH:mm:ss');
		let query = `promoCategory=SPORT&promoSecondType=rebatepromotion&eventCategoryType=Euro2021&DateFrom=${From}&DateTo=${To}&`;
		this.setState({
			Loading: true,
			dateRangeVisible: false,
		});
		fetchRequest(ApiPortSB.DailyDealsHistory + query, 'GET')
			.then((res) => {
				if (res) {
					this.setState({
						GiftHistory: res
					});
				}
				this.setState({
					Loading: false
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	onDateChange = (date, type) => {
		if (type === 'END_DATE') {
			this.setState({
				DateTo: date,
			});
		} else {
			this.setState({
				DateFrom: date,
			});
		}
	}

	render() {
		const { Loading, DateFrom, DateTo, GiftHistory, dateRangeVisible } = this.state;
		const { Address } = this.props;
		console.log('GiftHistoryGiftHistory', GiftHistory)
		const startDate = DateFrom ? DateFrom.toString() : '';
		const endDate = DateTo ? DateTo.toString() : '';
		return (
			<View style={{ flex: 1 }}>
				<View style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
					<Touch
						style={styles.activeDate}
						onPress={() => {
							this.setState({
								dateRangeVisible: true
							});
						}}
					>
						<Text style={{ color: '#00A6FF', fontSize: 12, paddingRight: 8, }}>
							日期
					</Text>
						<Image style={{ width: 13, height: 13 }} source={require('../../../images/euroSoprt/euroCup/calendar.png')} />
					</Touch>
				</View>
				{/* --------------日期范围----------- */}
				{/* <DateRange
					dateRangeVisible={dateRangeVisible}
					onClose={(type) => {
						this.setState({ dateRangeVisible: false }, () => {
							if (type == '确认') {
								this.DailyDealsHistory();
							}
						});
					}}
					onChange={(time) => {
						this.setState({
							DateFrom: time[0],
							DateTo: time[1]
						});
					}}
					value={[DateFrom, DateTo]}
					note={'搜索时间范围为30天内，并可搜索90天之内的好礼记录。'}
				/> */}
				{GiftHistory != '' ? (
					GiftHistory.length > 0 && GiftHistory.map((data, index) => {
						const { applyDate, refID, description, item, status, remarks, memberShippingDetail } = data;
						let AddressCheck;
						if (remarks === '点击更多详情' && JSON.stringify(memberShippingDetail) != '{}') {
							const {
								address,
								city,
								contactNumber,
								district,
								email,
								firstName,
								houseNum,
								lastName,
								province,
								zipCode
							} = memberShippingDetail;
							AddressCheck = Address.find(
								(item) =>
									item.address == address &&
									item.city == city &&
									item.contactNumber == contactNumber &&
									item.district == district &&
									item.email == email &&
									item.firstName == firstName &&
									item.houseNum == houseNum &&
									item.lastName == lastName &&
									item.province == province &&
									item.zipCode == zipCode
							);
						}
						return (
							<View style={styles.Historylist} key={index}>
								<View style={styles.list}>
									<Text style={styles.title}>交易日期</Text>
									<Text style={styles.count}>{applyDate.split(' ')[0]}</Text>

									<Text style={styles.title}>商品</Text>
									<Text style={styles.count}>{item}</Text>
								</View>

								<View style={styles.list}>
									<Text style={styles.title}>参考号</Text>
									<Text style={styles.count}>{refID}</Text>

									<Text style={styles.title}>状态</Text>
									<Text style={styles.count}>{status}</Text>
								</View>

								<View style={styles.list}>
									<Text style={styles.title}>优惠好礼</Text>
									<Text style={styles.count}>{description}</Text>

									<Text style={styles.title}>备注</Text>
									{remarks == '点击更多详情' ? (
										<Touch
											onPress={() => {
												// if (AddressCheck) { }
												// // Router.push(
												// // 	{
												// // 		pathname: `/promotions/[details]?type=${'readOnly'}&addresskey=${AddressCheck.id}`,
												// // 		query: {
												// // 			details: 'addressform',
												// // 			type: 'edit',
												// // 			addresskey: AddressCheck.id
												// // 		}
												// // 	},
												// // 	`/promotions/addressform?type=${'readOnly'}&addresskey=${AddressCheck.id}`
												// // );
											}}
										>
											<Text style={{ color: '#00a6ff', fontSize: 12 }}>点击更多详情</Text>
										</Touch>
									) : (
										<Text style={styles.count}>{remarks}</Text>
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
						<Text>暂无数据</Text>
					</View>
				)}

				<Modal transparent={true} animationType={'slide'} visible={this.state.dateRangeVisible} onRequestClose={() => { }}>
					<View style={{ width, height, position: 'relative' }}>
						<View style={{ flex: 1 }}>
							<TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>
								<View style={{ position: 'absolute', width, height, top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }} />
							</TouchableOpacity>
						</View>

						<View style={{ flex: 1, justifyContent: 'flex-end', }}>

							<View style={{ paddingTop: 20, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>

								<View style={{ flex: 1, left: 18 }}>
									<TouchableOpacity onPress={() => this.setState({ dateRangeVisible: false })}>
										<Text style={{ color: '#00a6ff' }}>关闭</Text>
									</TouchableOpacity>
								</View>

								<View style={{ flex: 1 }}><Text>选择日期</Text></View>
								<View style={{ flex: 0.3 }}>
									<TouchableOpacity onPress={() => this.DailyDealsHistory()}>
										<Text style={{ color: '#00a6ff' }}>确认</Text>
									</TouchableOpacity>
								</View>
							</View>

							<View style={{ paddingTop: 20, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
								<View style={styles.textDateA}>
									<Text style={{ color: '#00a6ff', flex: 0.9, paddingLeft: 10 }}>从</Text>
									<Text style={{ color: '#00a6ff' }}>{moment(startDate).format('YYYY-MM-DD')} </Text>
								</View>

								<View style={{ width: 20 }}></View>
								<View style={styles.textDateB}>
									<Text style={{ color: '#000', flex: 0.9, paddingLeft: 10 }}>至</Text>
									<Text style={{ color: '#000' }}>{moment(endDate || (new Date())).format('YYYY-MM-DD')} </Text>
								</View>

							</View>

							<View style={{ flex: 1, backgroundColor: '#FFFFFF', }}>
								<CalendarPicker
									startFromMonday={true}
									allowRangeSelection={true}
									minDate={moment(minDate[0]).format('YYYY-MM-DD')}
									maxDate={moment(maxDate[0]).format('YYYY-MM-DD')}
									weekdays={['一', '二', '三', '四', '五', '六', '日']}
									months={['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一', '十二']}
									previousTitle="<"
									nextTitle=">"
									selectedDayColor="#00a6ff"
									selectedDayTextColor="#fff"
									scaleFactor={375}
									textStyle={{
										fontFamily: 'Cochin',
										color: '#000000',
									}}
									onDateChange={this.onDateChange}
								/>


							</View>
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}
