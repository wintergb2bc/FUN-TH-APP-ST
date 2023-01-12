import React from "react";
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
	Modal,
	Clipboard,
	RefreshControl,
	Button
} from "react-native";
import HostConfig from "../../../containers/SbSports/lib/Host.config";
import Touch from "react-native-touch-once";
import { connect } from "react-redux";
import ComboBonusModal from '../../../containers/SbSports/game/ComboBonusModal'
// import fetch from 'fetch-with-proxy';
import { Flex, Toast, WingBlank, WhiteSpace, Accordion, Tabs, TabPane, Drawer } from "antd-mobile-rn";
import { Actions } from "react-native-router-flux";
import VendorIM from "../../../containers/SbSports/lib/vendor/im/VendorIM";
import moment from 'moment'
import CalendarPicker from 'react-native-calendar-picker';

const { width, height } = Dimensions.get("window");

const dateRadioSource = [{
	text: "7 ngày gần nhất",
	piwik: 'Betrecord_today',
	value: 1
}, {
	text: "14 ngày gần nhất",
	piwik: 'Betrecord_yesterday',
	value: 2
}, {
	text: "30 ngày gần nhất",
	piwik: 'Betrecord_7days',
	value: 3
},
	// {
	//   text: "日期",
	//   piwik: 'Betrecord_daterange',
	//   value: 4
	// }
]

const minDate = [new Date(new Date().getTime() - 7257600000), new Date(new Date().getTime() - 7257600000)];
const maxDate = [new Date(), new Date()];


class Betting extends React.Component {


	constructor(props) {
		super(props);
		this.state = {
			vendor: "bti",
			page: "unsettle",
			dateRadio: 1,
			date: [new Date(), new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)],
			showDateRange: false,
			unsettleWagersList: [],
			settledWagersList: [],
			showComboBonusModal: false,
			checkActive: 'IM',
			onTab: '1',
			nowShowType: [],
			onRefresh: false,
			visible4: false,
			selectedStartDate: moment(minDate[0]).format('YYYY-MM-DD'),
			selectedEndDate: moment(maxDate[0]).format('YYYY-MM-DD'),

		};


		this.totalBetCurrency = 0;
		this.totalWinCurrency = 0;
		this.getAlreadyBetHistory = this.getAlreadyBetHistory.bind(this);
		this.onDateChange = this.onDateChange.bind(this);

		this.VendorMapping = {
			// 'BTI': VendorBTI,
			'IM': VendorIM,
		}

		this.currentVendor = VendorIM;
	}

	componentWillMount() {
		window.openOrientation && window.openOrientation()
	}

	componentWillUnmount() {

	}

	componentDidMount() {
		const lowerV = 'IM';
		const vendor = VendorIM;
		let currentV = this.state.vendor;
		let currentP = this.state.page;
		if (vendor) {
			this.currentVendor = vendor;
			this.setState({ vendor: 'IM' });
			currentV = 'IM';
		}
		this.doQuery(this.currentVendor);

		//this.updateUrl(currentV,currentP);
	}

	doQuery(Vendor) {
		//console.log(Vendor,'Vendor')
		this.currentVendor = Vendor;
		// 查詢未結算注單
		this.currentVendor.getUnsettleWagers()
			.then(data => {
				const filteredData = this.filterERUOCupWagers(data)
				this.setState({ unsettleWagersList: filteredData });
			});
		// 查詢已結算注單
		this.getAlreadyBetHistory(this.state.date);
	}

	//過濾歐洲杯注單數據
	filterERUOCupWagers(data) {
		let filteredData = [];
		if (data && data.length > 0) {
			filteredData = data.filter(d => {
				if (d && d.WagerItems && d.WagerItems.length > 0) {
					for (let ii = 0; ii < d.WagerItems.length; ii++) {
						const wagerItem = d.WagerItems[ii]
						if (window.EuroCup2021LeagueIds.indexOf(wagerItem.LeagueId) !== -1) {
							return true;
						}
					}
				}
				return false;
			});
		}
		return filteredData;
	}

	//   PopUpLiveChat = (betId, eventDate) => {
	// 	  this.FUN88Live && this.FUN88Live.close();
	// 	  this.FUN88Live = window.open(
	// 		'about:blank',
	// 		'chat',
	// 		'toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=540, height=650'
	// 	  );
	// 	  const serverUrl = localStorage.getItem('serverUrl');
	// 	  serverUrl ? this.openServer(betId ? (serverUrl + "&CUSTOM!MatchStartDate=" + moment(eventDate).utcOffset(0).format("YYYY-MM-DD HH:mm:ss") + "&CUSTOM!BetslipID=" + betId) : serverUrl) : fetchRequest(ApiPort.GETLiveChat).then((res) => {
	// 		  //console.log(res)
	// 		  if (res) {
	// 			localStorage.setItem('serverUrl', res.url);
	// 			this.openServer(betId ? (res.url + "&CUSTOM!MatchStartDate=" + moment(eventDate).utcOffset(0).format("YYYY-MM-DD HH:mm:ss") + "&CUSTOM!BetslipID=" + betId) : res.url);
	// 		  }
	// 	  });
	//   }
	openServer = (serverUrl) => {
		this.FUN88Live.document.title = 'FUN88在线客服';
		this.FUN88Live.location.href = serverUrl;
		this.FUN88Live.focus();
	}

	getAlreadyBetHistory(key) {

		const { selectedStartDate, selectedEndDate } = this.state;

		let date = typeof key === "number" ? [new Date(), new Date()] : key;
		let sechdate = [];
		const startDate = selectedStartDate ? selectedStartDate.toString() : '';
		const endDate = selectedEndDate ? selectedEndDate.toString() : '';

		switch (key) {
			case 1:
				date = [new Date(), new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)];
				sechdate = [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')]
				break;
			case 2:
				date = [new Date(), new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)];
				sechdate = [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')]
				break;
			case 3:
				date = [new Date(), new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)];
				sechdate = [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')]
				break;
			case 4:
				date = [endDate, startDate]
				sechdate = [moment(endDate).format('YYYY-MM-DD'), moment(startDate).format('YYYY-MM-DD')]
				break;
			default:
				sechdate = [moment(date[0]).format('YYYY-MM-DD'), moment(date[1]).format('YYYY-MM-DD')]
				break;
		}
		this.setState({ date })
		Toast.loading('Tải vui lòng đợi...', 6);
		this.currentVendor.getSettledWagers(sechdate[1], sechdate[0])
			.then(data => {
				//console.log('getSettledWagers', data)
				Toast.hide();
				this.totalBetCurrency = 0;
				this.totalWinCurrency = 0;
				data.forEach((val) => {
					this.totalBetCurrency += parseFloat(val.BetAmount);
					this.totalWinCurrency += parseFloat(val.WinLossAmount);
				})
				//過濾數據
				const filteredData = this.filterERUOCupWagers(data)
				this.setState({ settledWagersList: filteredData, onRefresh: false });
			})
			.catch(err => {
				Toast.hide();
				//console.log(err)
				this.setState({ onRefresh: false });
			});
	}
	onChange = date => this.setState({ date })
	dateChange() {
		this.getAlreadyBetHistory(4);
		this.setState({ visible4: false })
		// this.setState({dateRadio: 4})
	}

	getWagerScore(wagerItemData) {
		if (wagerItemData.HomeTeamFTScore !== null || wagerItemData.AwayTeamFTScore !== null) {
			return '[' + (wagerItemData.HomeTeamFTScore ?? 0) + '-' + (wagerItemData.AwayTeamFTScore ?? 0) + ']';
		}
		return '';
	}

	checkMaintenanceStatus = (name) => {
		const { isBTI, isIM, isOW, noTokenBTI, noTokenIM, noTokenOW } = this.props.maintainStatus;
		const { isLogin } = ApiPort.UserLogin; //有登入才額外判斷 token獲取狀態
		switch (name) {
			case 'bti':
				return isBTI;
			case 'im':
				return isIM;
			case 'ow':
				return isOW ;
			default:
				return false;
		}
	};

	checkActive(checkActive) {
		if (checkActive == 'BTI') {
			PiwikEvent('BetRecord', 'View', 'Betrecord_BTi')
		} else if (checkActive == 'IM') {
			PiwikEvent('BetRecord', 'View', 'Betrecord_IM')
		} else {
			PiwikEvent('BetRecord', 'View', 'Betrecord_Saba')
			return
		}
		if (checkActive == this.state.checkActive) { return }
		let id = checkActive == 'BTI' ? 0 : 1;
		let onNavigation = this.state.onNavigation
		onNavigation += 1
		this.setState({ checkActive, onNavigation, dateRadio: 1, nowShowType: [], date: [new Date(), new Date()] }, () => {
			this.doQuery(this.VendorMapping[checkActive]);
		})

	}


	onTabClick(key) {    //tabs切換
		if (key == 1) {
			PiwikEvent('BetRecord', 'View', 'Betrecord_Openbets')
		} else {
			PiwikEvent('BetRecord', 'View', 'Betrecord_Settledbets')
		}
		this.setState({
			onTab: key,
			nowShowType: [],
		})

	}

	TocuhShowType(key) {
		let nowShowType = this.state.nowShowType
		//console.log(key,'nowshow')
		if (nowShowType[key] == key) {
			nowShowType[key] = 'a';
		} else {
			nowShowType[key] = key
		}


		this.setState({
			nowShowType
		})
	}


	//复制
	copy(txt) {
		PiwikEvent('BetRecord', 'View', 'Betrecord_copyID')
		try {
			const value = String(txt)
			Clipboard.setString(value);
			Toast.info(" Đã sao chép", 2);
		} catch (error) {
			//console.log(error);

		}

	}


	_contentViewScroll = (e) => {
		this.setState({
			onRefresh: true
		})
		this.getAlreadyBetHistory(this.state.date);
		this.doQuery(this.currentVendor);
	}

	onDateChange(date, type) {
		if (type === 'END_DATE') {
			this.setState({
				selectedEndDate: date,
			});
		} else {
			this.setState({
				selectedStartDate: date,
			});
		}
	}


	render() {
		const {
			checkActive, onTab, settledWagersList, nowShowType, onRefresh, selectedStartDate, selectedEndDate, unsettleWagersList
		} = this.state;
		const btiIsMaintenance = true// this.checkMaintenanceStatus('bti');
		const imIsMaintenance =  this.checkMaintenanceStatus('im');



		const startDate = selectedStartDate ? selectedStartDate.toString() : '';
		const endDate = selectedEndDate ? selectedEndDate.toString() : '';

		return (
			<View style={styles.rootView,{backgroundColor: isBlue?"#efeff4": '#000',}}>

				<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>{/*Tabs*/}


					<View style={[styles.Typs]}>
						<Touch onPress={() => { this.onTabClick('1') }}>
							<Text style={onTab == 1 ? styles.TypsTextHover : styles.TypsText}>Đang chờ/ยกเลิก {unsettleWagersList && unsettleWagersList.length}</Text>
							{
								<View style={{ backgroundColor: onTab == 1 ? '#00A6FF' : '#E0E0E0', height: 3, width: 120 }}></View>
							}
						</Touch>
					</View>



					<View style={styles.Typs}>
						<Touch onPress={() => { this.onTabClick('2') }}>
							<Text style={onTab == 2 ? styles.TypsTextHover : styles.TypsText}>Xác nhận {settledWagersList && settledWagersList.length}</Text>
							<View style={{ backgroundColor: onTab == 2 ? '#00A6FF' : '#E0E0E0', height: 3, width: 120 }}></View>
						</Touch>
					</View>


				</View>
				{
					imIsMaintenance &&
					<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: width, marginTop: 30, }}>
						<Image source={require("../../../images/euroSoprt/euroCup/tool.png")} style={{ height: 62, width: 62 }} />
						<Text style={{ fontWeight: 'bold', marginTop: 15, color: isBlue? "#666": '#fff', textAlign: 'center' }}>Hệ thống đang nâng cấp</Text>
						<Text style={{ fontWeight: 'bold', marginTop: 15, color: "#999", textAlign: 'center' }}>Hiện tại thể thao IM đang được bảo trì. </Text>
						<Text style={{ fontWeight: 'bold', marginTop: 8, color: "#999", textAlign: 'center' }}>Vui lòng quay lại sau.</Text>
					</View>
				}
				{
					!imIsMaintenance &&
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl refreshing={onRefresh} onRefresh={() => this._contentViewScroll()} />
					}
				>
					{onTab == 1 && <Text style={{ lineHeight: 30, fontSize: 12, color: '#666666', textAlign: 'center' }}>Chỉ hiển thị các cược Cúp EURO 2021 tại Thể Thao IM</Text>}
					{onTab == 1 && this.state.unsettleWagersList.length > 0 ?
						<View style={{ justifyContent: "center", alignItems: 'center' }}>
							{this.state.unsettleWagersList.map((val, key) => {
								console.log('valvalval',val)
								return val.WagerType != 2 ?


									<View style={{ justifyContent: "center", alignItems: 'center', backgroundColor: isBlue? '#fff': '#212121', marginTop: 10, width: width }}>
										<View style={{ width: width - 30, paddingTop: 20, paddingBottom: 7 }}>
											<TouchableOpacity onPress={() => {
												this.TocuhShowType(key);
											}}>
												<View>
													<View style={{ flexDirection: 'row', }}>
														<Text style={{fontSize: 13, paddingTop: 3,color: isBlue? '#000': '#fff'}}>{val.WagerItems[0].SelectionDesc}</Text>
														<Text style={{ color: '#00a6ff', fontSize: 18 }}> @{val.WagerItems[0].Odds}</Text>
													</View>
													{val.WagerItems[0].LineDesc &&
														<View style={{ paddingTop: 5 }}>
															<Text style={{ color: '#bcbec3', width: width * 0.6,fontSize: 13 }}>{val.WagerItems[0].LineDesc}</Text>
														</View>
													}
												</View>
												<View style={{ top: -25, right: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
													<Text style={{ color: val.WagerStatusName == 'Đang Xử Lý'?'#FFB232':val.WagerStatusName =='Đã Xác Nhận' ? '#999': 'red', textAlign: 'right' }}>
													{val.WagerStatusName =='Đang Xử Lý'? 'Đang chờ' : val.WagerStatusName =='Đã Xác Nhận' ? 'Xác nhận' : val.WagerStatusName == 'Từ Chối'? 'ยกเลิก': val.WagerStatusName }
													</Text>
													<View style={nowShowType[key] == key ? styles.arrows : styles.arrow}></View>
												</View>
											</TouchableOpacity>
										</View>


										<View style={nowShowType[key] == key ? [styles.showContext,{borderColor: isBlue?'#dde0e6': '#000'}] : [styles.hideContext,{borderColor: isBlue?'#dde0e6': '#000'}]}>
											{val.WagerItems.map(item => (
												<View key={item.EventId} style={{ paddingTop: 10, paddingBottom: 10 }}>
													<View>
														{val.WagerItems[0].IsOutRightEvent
															? <Text style={{ fontWeight: 'bold', color: isBlue?'#666': '#fff', fontSize: 12 }}>{val.WagerItems[0].OutRightEventName}</Text>
															: <Text style={{ fontWeight: 'bold', color: isBlue?'#666': '#fff', fontSize: 12 }}>{val.WagerItems[0].HomeTeamName} VS {val.WagerItems[0].AwayTeamName} {this.getWagerScore(val.WagerItems[0])}</Text>
														}
														<View>

														</View>
													</View>
													<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>{val.WagerItems[0].LeagueName}</Text>
													<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>Trận đấu bắt đầu: {val.WagerItems[0].getEventDateMoment().format('MM/DD HH:mm')}</Text>
												</View>
											))}
											<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderColor: isBlue? '#dde0e6': '#000', borderTopWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
												<Text style={{ color: '#666', fontSize: 12 }}>Tiền cược: <Text style={{ color: isBlue? '#000': '#fff', fontWeight: 'bold' }}>{val.BetAmount}đ</Text></Text>
												<Text style={{ color: '#666', fontSize: 12, paddingTop: 3 }}>Tiền thắng cược: <Text style={{ color: '#EB2121', fontSize: 14 }}>{val.PotentialPayoutAmount}đ</Text></Text>
											</View>
											<View style={{ width: width - 30 }}>
												<View style={{ flexDirection: 'row' }}>
													<Text style={{ color: '#666', fontSize: 12 }}>Mã vé cược: {val.WagerId}</Text>
													<View style={{ paddingLeft: 1 }}>
														<Touch onPress={() => { this.copy(val.WagerId) }}>
															<Text style={{ color: '#00a6ff', fontSize: 12 }}>Sao chép</Text>
														</Touch>
													</View>
												</View>
												<View style={{ }}>
													<Text style={{ color: '#666', fontSize: 12, paddingTop: 3 }}>
														{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
													</Text>
												</View>
												<Touch
													style={{ position: 'absolute', right: 15, }}
													onPress={() => {
														Actions.LiveChat()
														PiwikEvent('Live Chat', 'Launch', 'Betrecord_CS')
													}}>
													<View style={{ paddingLeft: 2 }}>
														<Image resizeMode='stretch' source={require('../../../images/euroSoprt/cs.png')} style={{ width: 28, height: 28 }} />
													</View>
												</Touch>
											</View>
										</View>
									</View>
									: <View style={{ backgroundColor: isBlue? '#fff': '#212121', marginTop: 10, width: width }}>
										<View style={{ justifyContent: "center", alignItems: 'center', paddingTop: 20, paddingBottom: 7 }}>
											<TouchableOpacity onPress={() => {
												this.TocuhShowType(key);
											}}>

												<View style={{ flexDirection: 'row', width: width - 20, top: -5 }}>
													<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
														<View>
															<Text style={{ fontSize: 14, fontWeight: 'bold', color: '#666' }}>Cược hỗn hợp</Text>
														</View>
														<View style={{ paddingLeft: 10 }}>
															<Text style={{ fontSize: 13, color: '#666' }}>{val.ComboCount}{val.ComboTypeName.replace(' ', '').replace('x',' x ')} {val.Odds ? '@' + val.Odds : ''}</Text>
														</View>
														{
															val.HasComboBonus ?
																<Touch
																	onPress={() => {
																		this.setState({
																			showComboBonusModal: true
																		});
																	}} style={styles.gift}>
																	<View style={styles.giftBg}>
																		<Image resizeMode='stretch' source={require('../../../images/euroSoprt/betting/orange.png')} style={{ width: 40, height: 28 }} />
																	</View>
																	<Text style={{ color: '#fff', fontSize: 12, }}>{val.ComboBonusPercentage}%</Text>
																	<Image resizeMode='stretch' source={require('../../../images/euroSoprt/betting/gift.png')} style={{ width: 15, height: 15 }} />
																</Touch> : null
														}
													</View>
													<View style={{ right: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
														<Text style={{ color: val.WagerStatusName == 'Đang Xử Lý'?'#FFB232':val.WagerStatusName =='Đã Xác Nhận' ? '#999': 'red', textAlign: 'right'}}>
															{val.WagerStatusName =='Đang Xử Lý'? 'Đang chờ' : val.WagerStatusName =='Đã Xác Nhận' ? 'Xác nhận' : val.WagerStatusName == 'Từ Chối'? 'ยกเลิก': val.WagerStatusName }
														</Text>
														<View style={nowShowType[key] == key ? styles.arrows : styles.arrow}></View>
													</View>
												</View>
											</TouchableOpacity>
										</View>
										<ScrollView
											showsHorizontalScrollIndicator={false}
											showsVerticalScrollIndicator={false}
										>
											<View style={nowShowType[key] == key ? [styles.showContext,{borderColor: isBlue?'#dde0e6': '#000'}] : [styles.hideContext,{borderColor: isBlue?'#dde0e6': '#000'}]}>
												{val.WagerItems.map(item => (
													<View key={item.EventId} style={{ paddingLeft: 10, paddingTop: 10, paddingBottom: 10, borderColor: isBlue? '#dde0e6': '#000', borderBottomWidth: 1 }}>

														<View>
															<View style={{ flexDirection: 'row' }}>
																<Text style={{ fontWeight: 'bold', color: '#666' }}>{item.SelectionDesc}</Text>
																<Text style={{ fontWeight: 'bold', color: '#00a6ff' }}> @{item.Odds}</Text>
															</View>
															<View>
																<Text style={{ color: '#666', fontSize: 12 }}>{item.LineDesc}</Text>
															</View>
														</View>
														<View style={{ paddingTop: 10 }}>
															{item.IsOutRightEvent
																? <Text style={{ color: isBlue? '#000': '#fff', fontSize: 12, fontWeight: 'bold' }}>{item.OutRightEventName}</Text>
																: <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
															}
														</View>
														<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>{item.LeagueName}</Text>
														<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>Trận đấu bắt đầu: {item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
													</View>
												))}


												<View style={{ paddingTop: 10, paddingLeft: 10 }}>
													<View>
														<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 10 }}>
															<Text style={{ color: '#666', fontSize: 12 }}>Tiền cược: <Text style={{ color: isBlue? '#000': '#fff', fontWeight: 'bold' }}>{val.BetAmount}đ</Text></Text>
															<Text style={{ color: '#666', fontSize: 12, paddingTop: 3 }}>Tiền thắng cược: <Text style={{ color: '#EB2121', fontSize: 14, }}>{val.PotentialPayoutAmount}đ</Text></Text>
														</View>
														<View>
															{val.HasComboBonus && <Text style={{ color: '#666', fontSize: 12 }}>Lợi nhuận bổ sung: <Text>{val.ComboBonusWinningsAmount}đ</Text></Text>}
															{val.FreeBetAmount > 0 && <Text style={{ color: '#666', fontSize: 12 }}> Cược miễn phí: <Text>{val.FreeBetAmount}đ</Text></Text>}
														</View>
													</View>
													<View style={{ flexDirection: 'row', width: width - 20 }}>
														<View style={{ paddingTop: 5, flex: 1 }}>
															<View style={{ flexDirection: 'row' }}>
																<Text style={{ color: '#666', fontSize: 12 }}>Mã vé cược:</Text>
																<Text style={{ color: '#666', fontSize: 12 }}>{val.WagerId}</Text>
																<View style={{ paddingLeft: 2, paddingTop: 1 }}>
																	<Touch onPress={() => { this.copy(val.WagerId) }}>
																		<Text style={{ color: '#00a6ff', fontSize: 12 }}>Sao chép</Text>
																	</Touch>
																</View>
															</View>
															<Text style={{ color: '#666', fontSize: 12, paddingTop: 3 }}>
																{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
															</Text>
														</View>
														<Touch onPress={() => {
															Actions.LiveChat()
															PiwikEvent('Live Chat', 'Launch', 'Betrecord_CS')
														}}>
															<View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', paddingLeft: 2 }}>
																<Image resizeMode='stretch' source={require('../../../images/euroSoprt/cs.png')} style={{ width: 28, height: 28, }} />
															</View>
														</Touch>
													</View>
												</View>

											</View>
										</ScrollView>
									</View>
							})}
						</View> : onTab == 1 && <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: width, marginTop: 30, }}>
							<Image source={require("../../../images/euroSoprt/euroCup/nodata.png")} style={{ height: 62, width: 62 }} />
							<Text style={{ fontWeight: 'bold', marginTop: 15, color: "#666", textAlign: 'center' }}>Không Có Dữ Liệu</Text>
						</View>

					}

					{/*未結算*/}

					{onTab == 2 &&
						<View style={{ justifyContent: "center", alignItems: 'center', }}>
							<View style={{ paddingTop: 10, paddingBottom: 5 }}>
								<View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: width }}>
									{dateRadioSource.map((v, i) => {
										return <View key={i}>
											<Touch
												onPress={() => {
													PiwikEvent('BetRecord', 'View', v.piwik)
													if (v.value === 4) {
														this.setState({ visible4: true, dateRadio: 4 })
													} else {
														this.setState({ dateRadio: v.value })
														this.getAlreadyBetHistory(v.value)
													}
												}} >
												<View
													key={"btn" + i}
													style={this.state.dateRadio === v.value ? styles.active : styles.noactive}
												>
													{v.value != 4 ?

														<Text style={[this.state.dateRadio === v.value ? styles.textactive : styles.textnoactive, { textAlign: 'center' }]}>{v.text}</Text>
														: <View style={{ flexDirection: 'row' }}>
															<Text style={[this.state.dateRadio === v.value ? styles.textactive : styles.textnoactive, { textAlign: 'center', paddingRight: 5 }]}>{v.text}</Text>
															{this.state.dateRadio === v.value ?
																<Image source={require('../../../images/euroSoprt/calendarhover.png')} style={{ width: 13, height: 14 }} />
																:
																<Image source={require('../../../images/euroSoprt/calendar.png')} style={{ width: 13, height: 14 }} />
															}
														</View>
													}
												</View>
											</Touch>
										</View>
									})}
								</View>
								<Text style={{ lineHeight: 30, fontSize: 12, color: '#666666', textAlign: 'center' }}>Chỉ hiển thị các cược Cúp EURO 2021 tại Thể Thao IM</Text>
								{/* <View style={{ flexDirection: 'row', paddingTop: 5 }}>
                  <Text style={{ color: "#666" }}>总计 {this.state.settledWagersList.length} 单  </Text>
                  <Text style={{ color: "#666" }}>总投注额 : đ{this.totalBetCurrency.toFixed(2)}</Text>
                  <Text style={{ color: "#666" }}>总输赢 : đ{this.totalWinCurrency.toFixed(2)}</Text>
                </View> */}
							</View>
							{this.state.settledWagersList.length ? <View style={{ justifyContent: "center", alignItems: 'center', }}>


								{this.state.settledWagersList.map((val, key) => {
									return val.WagerType != 2 ? <View style={{ backgroundColor: isBlue? '#fff': '#212121', marginTop: 10, width: width }}>
										<View style={{ justifyContent: "center", alignItems: 'center', paddingTop: 20, paddingBottom: 7 }}>
											<TouchableOpacity onPress={() => {
												this.TocuhShowType(key);
											}}>
												<View style={{ flexDirection: 'row', width: width - 40, }}>
													<View style={{ flex: 1 }}>
														<View style={{ flexDirection: 'row' }}>
															<Text style={{color: isBlue? '#000': '#fff'}}>{val.WagerItems[0].SelectionDesc}</Text>
															<Text style={{ color: '#00a6ff', fontWeight: 'bold' }}> @{val.WagerItems[0].Odds}</Text>
														</View>
														{val.WagerItems[0].LineDesc &&
															<View style={{ paddingTop: 5 }}>
																<Text style={{ color: '#bcbec3' }}>{val.WagerItems[0].LineDesc}</Text>
															</View>
														}
													</View>
													<View style={{ width: 30, height: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', top: -5 }}>
														<View style={[styles.he, val.WinLossAmount < 0 ? styles.level : val.WinLossAmount > 0 && styles.lost]}>
															<Text style={[styles.TextHe,val.WinLossAmount < 0 ? styles.Textlevel : val.WinLossAmount > 0 && styles.Textlost]}>{val.WinLossAmount > 0 ? "THẮNG" : val.WinLossAmount < 0 ? "THUA" : "HÒA"}</Text>
														</View>
														<View style={[styles.arrow, { top: -12 }]}></View>
													</View>
												</View>

											</TouchableOpacity>
										</View>
										<View style={nowShowType[key] == key ? [styles.showContext,{borderColor: isBlue?'#dde0e6': '#000'}] : [styles.hideContext,{borderColor: isBlue?'#dde0e6': '#000'}]}>
											{val.WagerItems.map(item => (
												<View key={item.EventId} style={{ paddingTop: 10, paddingLeft: 18, paddingBottom: 10 }}>
													<View>
														{val.WagerItems[0].IsOutRightEvent
															? <Text style={{ fontWeight: 'bold', color: '#666' }}>{item.OutRightEventName}</Text>
															: <Text style={{ fontWeight: 'bold', color: '#666' }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
														}
														<View>

														</View>
													</View>
													<Text style={{ color: '#666', paddingTop: 2, fontSize: 12, }}>{item.LeagueName}</Text>
													<Text style={{ color: '#666', paddingTop: 2, fontSize: 12, }}>Trận đấu bắt đầu：{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
													{
														item.GameResult ?
															<View style={{ alignItems: 'flex-end', marginTop: -16, right: 15 }}>
																<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>Tỉ Số {item.GameResult}</Text>
															</View>
															: null
													}
												</View>
											))}
											<View style={{ flexDirection: 'row', borderColor: isBlue? '#dde0e6': '#000', borderTopWidth: 1, padding: 10, paddingLeft: 18, width: width, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Text style={{ color: '#666', fontSize: 12 }}>Tiền cược: <Text style={{ color: '#000', fontWeight: 'bold' }}>{val.BetAmount}đ</Text></Text>
												<Text style={{ color: '#666', fontSize: 12 }}>Tiền thắng cược:<Text style={{ color: '#EB2121', fontSize: 14  }}>{val.WinLossAmount}đ</Text></Text>
											</View>
											<View style={{ flexDirection: 'row', paddingLeft: 18, }}>
												<View>
													<View>
														{val.FreeBetAmount > 0 ? <Text style={{ color: '#666', fontSize: 12 }}> Cược miễn phí<Text style={{ color: isBlue? '#000': '#fff', fontWeight: 'bold' }}>{val.FreeBetAmount}đ</Text></Text> : null}
													</View>
												</View>
												<View style={{ flexDirection: 'row', width: width - 30 }}>
													<View>
														<View style={{ flexDirection: 'row' }}>
															<Text style={{ color: '#666', fontSize: 12 }}>Mã vé cược: </Text>
															<Text style={{ color: '#666', fontSize: 12 }}>{val.WagerId}</Text>
															<View style={{ paddingLeft: 1 }}>
																<Touch onPress={() => { this.copy(val.WagerId) }}>
																	<Text style={{ color: '#00a6ff', fontSize: 12 }}> Sao chép</Text>
																</Touch>
															</View>
														</View>
														<Text style={{ color: '#666', fontSize: 12, paddingTop: 3 }}>
															{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
														</Text>
													</View>
													<Touch
														style={{ position: 'absolute', right: 50, }}
														onPress={() => {
															Actions.LiveChat()
															PiwikEvent('Live Chat', 'Launch', 'Betrecord_CS')
														}}>
														<View style={{ left: 20 }}>
															<Image resizeMode='stretch' source={require('../../../images/euroSoprt/cs.png')} style={{ width: 28, height: 28 }} />
														</View>
													</Touch>
												</View>
											</View>
										</View>
									</View> : <View style={{ backgroundColor: isBlue? '#fff': '#212121', marginTop: 10, width: width }}>
										<View style={{ justifyContent: "center", alignItems: 'center', paddingTop: 20, paddingBottom: 7 }}>
											<TouchableOpacity onPress={() => {
												this.TocuhShowType(key);
											}}
												style={{ flexDirection: 'row' }}>
												<View style={{ flexDirection: 'row', width: width - 70, alignItems: 'center', justifyContent: 'flex-start' }}>
													<View>
														<Text style={{color: isBlue? '#000': '#fff'}}>Cược hỗn hợp</Text>
													</View>
													<View style={{ paddingLeft: 10 }}>
														<Text style={{ fontSize: 12, color: isBlue? '#666': '#fff' }}>{val.ComboCount}{val.ComboTypeName.replace(' ', '').replace('x',' x ')} {val.Odds ? '@' + val.Odds : ''}</Text>
													</View>
													{
														val.HasComboBonus ?
															<Touch
																onPress={() => {
																	this.setState({
																		showComboBonusModal: true
																	});
																}} style={styles.gift}>
																<View style={styles.giftBg}>
																	<Image resizeMode='stretch' source={require('../../../images/euroSoprt/betting/orange.png')} style={{ width: 40, height: 28 }} />
																</View>
																<Text style={{ color: '#fff', fontSize: 12 }}>{val.ComboBonusPercentage}%</Text>
																<Image resizeMode='stretch' source={require('../../../images/euroSoprt/betting/gift.png')} style={{ width: 15, height: 15 }} />
															</Touch> : null
													}
												</View>
												<View style={{ width: 30, height: 30, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', top: -5 }}>
													<View style={[styles.he, val.WinLossAmount < 0 ? styles.level : val.WinLossAmount > 0 && styles.lost]}>
														<Text style={[styles.TextHe,val.WinLossAmount < 0 ? styles.Textlevel : val.WinLossAmount > 0 && styles.Textlost]}>{val.WinLossAmount > 0 ? "THẮNG" : val.WinLossAmount < 0 ? "THUA" : "HÒA"}</Text>
													</View>
													<View style={[styles.arrow, { top: -12 }]}></View>
												</View>
											</TouchableOpacity>
										</View>



										<View style={nowShowType[key] == key ? [styles.showContext,{borderColor: isBlue?'#dde0e6': '#000'}] : [styles.hideContext,{borderColor: isBlue?'#dde0e6': '#000'}]}>
											<View>

												{val.WagerItems.map(item => {
													return <View style={{ paddingLeft: 18, paddingTop: 10, paddingBottom: 10, borderColor: isBlue? '#dde0e6': '#000', borderBottomWidth: 1 }}>
														<View>
															<View style={{ flexDirection: 'row' }}>
																<Text style={{ fontWeight: 'bold', color: '#666' }}>{item.SelectionDesc}</Text>
																<Text style={{ fontWeight: 'bold', color: '#00a6ff' }}> @{item.Odds}</Text>
															</View>
															<View>
																<Text style={{ color: '#666', fontSize: 12 }}>{item.LineDesc}</Text>
															</View>
														</View>

														<View style={{ paddingTop: 10 }}>
															{item.IsOutRightEvent
																? <Text style={{ color: '#000', fontSize: 12, fontWeight: 'bold' }}>{item.OutRightEventName}</Text>
																: <Text style={{ color: '#666', fontSize: 12, fontWeight: 'bold' }}>{item.HomeTeamName} VS {item.AwayTeamName} {this.getWagerScore(item)}</Text>
															}
														</View>
														<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>{item.LeagueName}</Text>
														<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>Trận đấu bắt đầu: {item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
														{
															item.GameResult ?
																<View style={{ alignItems: 'flex-end', marginTop: -16, right: 15 }}>
																	<Text style={{ color: '#666', paddingTop: 2, fontSize: 12 }}>Tỉ Số {item.GameResult}</Text>
																</View>
																: null
														}

													</View>
												})}
											</View>

											<View style={{ paddingTop: 10, paddingLeft: 18 }}>
												<View>
													<View style={{display: 'flex',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between', width: width - 40}}>
														<Text style={{ color: '#666', fontSize: 12 }}>Tiền cược: <Text style={{ color: isBlue?'#000': '#fff', }}>{val.BetAmount}đ</Text></Text>
														<Text style={{ color: '#666', fontSize: 12 }}>Tiền thắng cược: <Text style={{ color: '#EB2121', fontSize: 14  }}>{val.WinLossAmount}đ</Text></Text>
													</View>
													<View>
														{val.HasComboBonus && <Text style={{ color: '#666', fontSize: 12 }}> Lợi nhuận bổ sung: <Text style={{ color: isBlue?'#000': '#fff', }}>{Number(val.ComboBonusWinningsAmount).toFixed(2)}đ</Text></Text>}
														{val.FreeBetAmount > 0 && <Text style={{ color: '#666', fontSize: 12 }}>Cược miễn phí: <Text style={{ color: isBlue?'#000': '#fff', }}>{val.FreeBetAmount}đ</Text></Text>}
													</View>
												</View>
												<View>
													<View style={{ flexDirection: 'row', width: width - 20 }}>
														<View style={{ paddingTop: 10, flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
															<View style={{ flexDirection: 'row' }}>
																<Text style={{ color: '#666', fontSize: 12 }}>Mã vé cược: </Text>
																<Text style={{ color: '#666', fontSize: 12 }}>{val.WagerId}</Text>
															</View>
															<View style={{ paddingLeft: 2, paddingTop: 1 }}>
																<Touch onPress={() => { this.copy(val.WagerId) }}>
																	<Text style={{ color: '#00a6ff', fontSize: 12 }}> Sao chép</Text>
																</Touch>
															</View>
														</View>
														<Touch onPress={() => {
															Actions.LiveChat()
															PiwikEvent('Live Chat', 'Launch', 'Betrecord_CS')
														}}>

															<View style={{ right: 10, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
																<Image resizeMode='stretch' source={require('../../../images/euroSoprt/cs.png')} style={{ width: 28, height: 28, }} />
															</View>
														</Touch>
													</View>
													<Text style={{ color: '#666', fontSize: 12 }}>
														{val.getCreateTimeMoment().format('YYYY-MM-DD HH:mm:ss')}{val.OddsTypeName ? '(' + val.OddsTypeName + ')' : ''}
													</Text>


												</View>
											</View>




										</View>
									</View>
								})}
							</View> :
								<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: width, marginTop: 30, }}>
									<Image source={require("../../../images/euroSoprt/euroCup/nodata.png")} style={{ height: 62, width: 62 }} />
									<Text style={{ fontWeight: 'bold', marginTop: 15, color: "#666", textAlign: 'center' }}>Không Có Dữ Liệu</Text>
								</View>

							}
						</View>
					}



					<View style={{ height: 60 }}></View>



					<Modal transparent={true} animationType={'slide'} visible={this.state.visible4} onRequestClose={() => { }}>
						<View style={{ width, height, position: 'relative' }}>
							<View style={{ flex: 1 }}>
								<TouchableOpacity onPress={() => this.setState({ visible4: false })}>
									<View style={{ position: 'absolute', width, height, top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }} />
								</TouchableOpacity>
							</View>

							<View style={{ flex: 1, justifyContent: 'flex-end', }}>

								<View style={{ paddingTop: 20, flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>

									<View style={{ flex: 1, left: 18 }}>
										<TouchableOpacity onPress={() => this.setState({ visible4: false })}>
											<Text style={{ color: '#00a6ff' }}>关闭</Text>
										</TouchableOpacity>
									</View>

									<View style={{ flex: 1 }}><Text>选择日期</Text></View>
									<View style={{ flex: 0.3 }}>
										<TouchableOpacity onPress={() => this.dateChange()}>
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

					{
						this.state.showComboBonusModal &&
						<ComboBonusModal
							visible={this.state.showComboBonusModal}
							onClose={() => {
								this.setState({
									showComboBonusModal: false
								});
							}}
						/>
					}

				</ScrollView>
				}
			</View>
		);
	}
}

const mapStateToProps = state => ({
    userInfo: state.userInfo,
    maintainStatus: state.maintainStatus,
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Betting);

const styles = StyleSheet.create({
	gift: {
		display: 'flex',
		justifyContent: 'space-around',
		paddingRight: 5,
		alignItems: 'center',
		flexDirection: 'row',
		width: 45,
		height: 28,
	},
	giftBg: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 75,
		height: 35,
	},
	textDateA: {
		borderColor: '#00a6ff', borderWidth: 1, borderRadius: 6, width: width / 2.3, paddingTop: 10, paddingBottom: 10, flexDirection: 'row'
	},
	textDateB: {
		borderColor: '#bcbec3', borderWidth: 1, borderRadius: 6, width: width / 2.3, paddingTop: 10, paddingBottom: 10, flexDirection: 'row'
	},
	lost: {
		borderRadius: 50,
		backgroundColor: '#c7f7d3',
		flexDirection: 'column',
		justifyContent: 'center',
		width: 32,
		height: 32,
		display: 'flex',
		alignItems: 'center',
	},
	level: {
		borderRadius: 50,
		backgroundColor: '#ffcfcf',
		flexDirection: 'column',
		justifyContent: 'center',
		width: 32,
		height: 32,
		display: 'flex',
		alignItems: 'center',
	},
	he: {
		borderRadius: 50,
		backgroundColor: '#ddd',
		flexDirection: 'column',
		justifyContent: 'center',
		width: 32,
		height: 32,
		display: 'flex',
		alignItems: 'center',
	},
	Textlost: {
		color: '#0ccc3c',
		textAlign: 'center',
		fontSize: 8,
	},
	Textlevel: {
		color: '#eb2121',
		textAlign: 'center',
		fontSize: 8,
	},
	TextHe: {
		color: '#888',
		textAlign: 'center',
		fontSize: 8,
	},
	textactive: {
		color: '#00a6ff',
		fontSize: 12,
	},
	textnoactive: {
		color: '#666',
		fontSize: 12,
	},
	active: {

		paddingLeft: 6,
		paddingRight: 6,
		borderColor: '#00a6ff',
		height: 28,
		borderWidth: 1,
		borderRadius: 17,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	noactive: {
		paddingLeft: 6,
		paddingRight: 6,
		height: 28,
		borderColor: '#666',
		borderWidth: 1,
		borderRadius: 17,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	hideContext: {
		display: 'none',
		borderColor: '#dde0e6', borderTopWidth: 1, paddingBottom: 10,
		height: 0,
	},
	showContext: {
		borderColor: '#dde0e6', borderTopWidth: 1, paddingBottom: 10
	},
	Typs: {
		display: 'flex',
		width: 120,
		justifyContent: 'center',
		alignItems: 'center',
	},
	TypsText: {
		textAlign: 'center',
		color: '#616161',
		lineHeight: 30,
	},
	TypsTextHover: {
		textAlign: 'center',
		color: '#00A6FF',
		lineHeight: 30,
	},
	rootView: {
		flex: 1,
		backgroundColor: "#efeff4",
	},
	webViewStyle: {
		flex: 1,
		backgroundColor: "#fff",
		borderWidth: 0
	},
	topNav: {
		width: width,
		height: 50,
		backgroundColor: '#00a6ff',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		position: 'relative',
		zIndex: 99999999,
	},
	btnType: {
		backgroundColor: '#0A92E0',
		borderRadius: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	btnList: {
		width: 88,
		backgroundColor: '#00A6FF',
		borderRadius: 50,
	},
	btnTxt: {
		textAlign: 'center',
		lineHeight: 32,
	},
	arrow: {
		top: -4,
		left: 8,
		width: 8,
		height: 8,
		borderColor: '#999',
		borderRightWidth: 2,
		borderBottomWidth: 2,
		transform: [{ rotate: '45deg' }],
	},
	arrows: {
		top: -4,
		left: 8,
		width: 8,
		height: 8,
		borderColor: '#999',
		borderLeftWidth: 2,
		borderTopWidth: 2,
		transform: [{ rotate: '45deg' }],
	},
});
