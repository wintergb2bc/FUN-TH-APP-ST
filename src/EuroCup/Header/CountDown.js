/*
	投注页面 公用头部  赛事比分概况
*/
import React from "react";
import moment from 'moment';
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	View,
	Platform,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	ImageBackground,
	Linking,
	NativeModules,
	Alert,
	UIManager,
	Modal
} from "react-native";
const { width, height } = Dimensions.get("window");
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import SportImage from '../../containers/SbSports/game/RNImage'

//左補0
const padLeft = (str, length) => {
	if (str.length >= length)
		return str;
	else
		return padLeft("0" + str, length);
}

class CountDown extends React.Component {
	constructor() {
		super();

		//如果時間已經超過就直接不顯示，也不會發起倒計時
		this.targetTime = moment(EuroCup2021CountDownEndTime);
		const diffSeconds = this.targetTime.diff(moment(), 'seconds');
		if (diffSeconds > 0) {
			const duration = moment.duration(diffSeconds, 'seconds');
			this.state = {
				isVisible: true,
				day: padLeft(Math.floor(duration.asDays()) + '', 2),
				hour: padLeft(duration.hours() + '', 2),
				minute: padLeft(duration.minutes() + '', 2),
				second: padLeft(duration.seconds() + '', 2),
				isIM_Maintenacne: false,
				HeaderData: [],
            	activeSlide: 0,
			}
		} else {
			this.state = {
				isVisible: false,
				day: 0,
				hour: 0,
				minute: 0,
				second: 0,
				isIM_Maintenacne: false,
				HeaderData: [],
            	activeSlide: 0,
			};
		}

		this.countDown = this.countDown.bind(this);
		this.timer = null;
	}
	componentDidMount() {
		if (this.state.isVisible) {
			this.timer = setInterval(this.countDown, 1000);
		} else {
			this.props.setNoCountDown(true);
		}
		this.checkMaintenanceStatus()
	}

	componentWillUnmount() {
		if (this.timer) {
			clearInterval(this.timer);
		}
	}
	//檢查維護狀態
	checkMaintenanceStatus(name) {
		const { isBTI, isIM, isOW, noTokenBTI, noTokenIM, noTokenOW } = this.props.maintainStatus;
		this.setState({isIM_Maintenacne: isIM})
	};

	countDown() {
		const diffSeconds = this.targetTime.diff(moment(), 'seconds');
		if (diffSeconds <= 0) {
			this.props.setNoCountDown(true);
			this.setState({ isVisible: false });
			if (this.timer) {
				clearInterval(this.timer);
			}
		} else {
			const duration = moment.duration(diffSeconds, 'seconds');
			this.setState({
				day: padLeft(Math.floor(duration.asDays()) + '', 2),
				hour: padLeft(duration.hours() + '', 2),
				minute: padLeft(duration.minutes() + '', 2),
				second: padLeft(duration.seconds() + '', 2),
			})
		}
	}

	goDetaile(EventData) {
		// ${ this.props.Vendor.configs.VendorPage } /detail?sid=${EventData.SportId}&eid=${EventData.EventId}&lid=${EventData.LeagueId}
		let dataList = {
			eid: EventData.EventId,
			sid: EventData.SportId,
			lid: EventData.LeagueId,
			// OE: IsOutRightEvent,
			// BetMore: this.state.PlayBetCart
		}
		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor, EuroCupBet: true })
	}

	_renderBannerItem21 = (item, index) => {
		return (
			<View key={index} style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
				{
					item &&
					<Touch onPress={() => { this.goDetaile(item) }} style={styles.BannerLists}>
						<View style={styles.temass}>
							<SportImage imgsID={item.HomeTeamId} />
							<Text style={styles.temasTxts} numberOfLines={1}>{item.HomeTeamName}</Text>
							{
								item.IsRB &&
									item.HomeRedCard &&
									parseInt(item.HomeRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3, paddingRight: 3 }}>
										<Text style={{ color: '#fff', fontSize: 12 }}>{item.HomeRedCard ?? 0}</Text>
									</View>
								)
									: <Text style={{ color: 'transparent' }}>0</Text>
							}
						</View>
						{
							item.IsRB &&
							<View style={styles.temasVS}>
								<View style={[styles.temasVS, { flexDirection: 'row' }]}>
									<Text style={{ color: item.HomeScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item.HomeScore}</Text>
									<Text style={{ color: '#fff', padding: 8 }}>-</Text>
									<Text style={{ color: item.AwayScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item.AwayScore}</Text>
								</View>
								<View style={styles.gameNumber}>
									<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>{item.RBMinute}'</Text>
								</View>
							</View>
						}
						{
							!item.IsRB &&
							<View style={styles.temasVS}>
								<View style={{ position: 'absolute', top: -10, }}>
									<Text style={{ color: '#fff', fontSize: 12, width: 90, textAlign: 'center' }}>{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
								</View>
								<Text style={{ color: '#fff', padding: 8 }}>VS</Text>
								<Text style={{ color: '#fff', fontSize: 12 }}>Sắp diễn ra</Text>
							</View>
						}

						<View style={styles.temass}>
							<SportImage imgsID={item.AwayTeamId} />
							<Text style={styles.temasTxts} numberOfLines={1}>{item.AwayTeamName}</Text>
							{
								item.IsRB &&
									item.AwayRedCard &&
									parseInt(item.AwayRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3, paddingRight: 3 }}>
										<Text style={{ color: '#fff', fontSize: 12 }}>{item.AwayRedCard ?? 0}</Text>
									</View>
								)
									: <Text style={{ color: 'transparent' }}>0</Text>
							}
						</View>
					</Touch>
				}
			</View>
		);
	}

	render() {
		window.HeaderData = (HeaderData) => {
            HeaderData && HeaderData.length > 0 && this.setState({ HeaderData })
        }

        const {
            HeaderData,
        } = this.state;

        const HeaderLists = HeaderData.slice(0,3)
		const { isVisible, day, hour, minute, second,isIM_Maintenacne } = this.state;
		let scrollViewList = new Array(isVisible? 4: 3).fill(1)
		return (
			<View style={{ flex: 1 }}>
			{
			   !isIM_Maintenacne ?
				<View style={{ paddingLeft: 10, marginTop: 10, }}>
					<ImageBackground
						source={require("../../images/euroSoprt/EuroCup.png")}
						style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
					>
						{
							<ScrollView
								horizontal={true}
								pagingEnabled={true}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
								onMomentumScrollEnd={(e) => {
									let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
									let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

									let activeSlide = 0
									if (offsetY != 0) {
										//滑动块数
										activeSlide = offsetY / oriageScrollWidth
									}
									this.setState({ activeSlide })
								}}
							>
								{
									isVisible &&
									<View style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
										<Text style={{ color: '#fff', fontSize: 13, paddingBottom: 12, }}>Sự kiện diễn ra vào</Text>
										<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', flexDirection: 'row' }}>
											<View style={styles.dateList}>
												<Text style={{ color: '#202939', fontSize: 13, }}>{day}</Text>
											</View>
											<Text style={styles.dateTxt}>Ngày</Text>
											<View style={styles.dateList}>
												<Text style={{ color: '#202939', fontSize: 13, }}>{hour}</Text>
											</View>
											<Text style={styles.dateTxt}>Giờ</Text>
											<View style={styles.dateList}>
												<Text style={{ color: '#202939', fontSize: 13, }}>{minute}</Text>
											</View>
											<Text style={styles.dateTxt}>Phút</Text>
											<View style={styles.dateList}>
												<Text style={{ color: '#202939', fontSize: 13, }}>{second}</Text>
											</View>
											<Text style={styles.dateTxt}>Giây</Text>
										</View>
									</View>
								}
								{
									HeaderLists && HeaderLists.length > 0 &&
									HeaderLists.map((item, index) => {
										return (
											<View key={index}>
												{this._renderBannerItem21(item)}
											</View>
										)
									})
								}
							</ScrollView>
						}
					</ImageBackground>
					<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 10 }}>
						{
							scrollViewList.map((item, index) => {
								return (
									<View key={index} style={this.state.activeSlide == index ? styles.activeSlide : styles.noactiveSlide} />
								)
							})
						}
					</View>
				</View>
				:
				<View style={{ paddingLeft: 10, marginTop: 10, }}>
					<ImageBackground
					source={require("../../images/euroSoprt/EuroCup.png")}
					style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center', }}
					/>
				</View>
			}
		</View>
		);
	}
}

const styles = StyleSheet.create({
	dateList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: 30,
		height: 30,
		backgroundColor: '#FAFAFA',
		borderRadius: 5,

	},
	dateTxt: { color: '#fff', fontSize: 13, paddingLeft: 5, paddingRight: 5 },

	BannerLists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: width - 20,
	},
	temass: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20) * 0.42,
	},
	temasTxts: {
		fontSize: 12,
		color: '#fff',
		width: (width - 20) * 0.4,
		paddingTop: 10,
		textAlign: 'center'
	},
	temasVS: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	gameNumber: {
		backgroundColor: '#eb2121',
		borderRadius: 5,
		width: 30,
	},
    activeSlide: {
		width: 20,
		height: 5,
		backgroundColor: '#00a6ff',
		borderRadius: 10,
		marginLeft: 5,
	},
	noactiveSlide: {
		width: 5,
		height: 5,
		backgroundColor: '#BCBEC3',
		borderRadius: 10,
		marginLeft: 5,
	},
})

const mapStateToProps = state => ({
	userInfo: state.userInfo,
	maintainStatus: state.maintainStatus,
});

export default connect(
	mapStateToProps,
	null,
)(CountDown)




