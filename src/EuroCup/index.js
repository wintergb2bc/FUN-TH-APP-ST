// import Layout from '@/Layout';
import CountDown from './Header/CountDown';
import React from 'react';
// import Tabs, {TabPane} from "rc-tabs";
import GameTab from "./Tabs/GameTab";
import PromoTab from "./Tabs/PromoTab";
// import Router from "next/router";
// import {checkIsLogin,redirectToLogin} from "$LIB/js/util";
import VendorIM from '../containers/SbSports/lib/vendor/im/VendorIM';
import MiniEvent from '../containers/SbSports/game/Betting/MiniEvent';
import HeaderView from './Header/index'
import HeaderList from './Header/HeaderList'
import BetRecordTab from './Tabs/BetRecordTab/index'
import EuroLogin from './EuroLogin'
const { width, height } = Dimensions.get("window");
import ReactNative, {
	StyleSheet,
	Text,
	Image,
	findNodeHandle,
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
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';


class EuroCup2021 extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedTab: 1,
			scrollTop: 0,
			noCountDown: false, //是否有倒計時(影響內容高度)
			//從詳情頁過來的 縮小的比分框
			showMiniEvent: false,
			miniEventId: null,
			miniSportId: 1,
			miniLeagueId: null,
			miniShowType: 0,
			footerMarginTop: 15,
			isposation: false,
		};

		this.setNoCountDown = this.setNoCountDown.bind(this);
		this.showBetRecord = this.showBetRecord.bind(this);

		this.BetRecordTabRef = React.createRef();
	}
	componentWillMount() {
		if(ApiPort.UserLogin) {
			const IMloginPromise = VendorIM.getTokenFromGateway().catch((e) => {
				// this.props.maintainStatus_noTokenIM(true);
				console.log('im login failed', e);
			});
		}
	}

	componentDidMount() {
		//處理tab自動切換
		// const {query} = this.props.router;
		// const tabMapping = {"betrecord": "2", "promo": "3"}
		// console.log('===query.tab',query.tab);
		// if (query.tab) {
		// 	const mappingTabKey = tabMapping[query.tab];
		// 	if (mappingTabKey) {
		// 		this.setState({selectedTab: mappingTabKey} );
		// 	}
		// }
	}

	componentWillUnmount() {
	}

	//處理沒有倒計時的樣式
	setNoCountDown(value) {
		if (value !== this.state.noCountDown) { //有變更才重新設定
			this.setState({ noCountDown: value })
		}
	}

	//處理投注後切換注單tab
	showBetRecord(wagertype = 'unsettle') {
		this.setState(
			{ selectedTab: "2" }, //"betrecord": "2"
			() => {
				setTimeout(() => {
					if (this.BetRecordTabRef) {
						this.BetRecordTabRef.showTabDataAndUpdateUrl(wagertype)
					}
				}, 1000); //等一秒再加載
			}
		);
	}

	tabChange(key) {
		if (this.state.selectedTab !== key) {
			if (!ApiPort.UserLogin && key == 2) {
				this.setState({EuroLogin: true})
				return
			}
			if(key == 2) {
				PiwikMenberCode('Engagement Event','View','BetRecord_EUROPage')
			}
			this.setState({ selectedTab: key }, () => { });
			//更新網址鏈接
			// const { pathname, query } = this.props.router;
			// let cloneQuery = Object.assign({}, query);
			// //更換path配置
			// const tabMapping = {"2": "betrecord" , "3": "promo" }
			// const mappingTabParam = tabMapping[key];
			// //console.log('===',mappingTabParam,'|||',key, JSON.stringify(cloneQuery));
			// if (mappingTabParam) {
			// 	cloneQuery.tab = mappingTabParam;
			// } else {
			// 	delete cloneQuery['tab'];
			// }
			// const params = new URLSearchParams(cloneQuery);
			// const hasParams = (JSON.stringify(cloneQuery) !== '{}');
			// //用replace，避免用戶可以點擊back返回
			// Router.replace(pathname + (hasParams ? '?' + params.toString() : ''), undefined, { shallow: true });
		}
	}
	//处理底部
	getBtnPos = (e) => {
        NativeModules.UIManager.measure(e.target, (x, y, width, heightView, px, py) => {
			if(heightView < EuroViewHeight - 60 ) {
				let top = EuroViewHeight - heightView - 80 - (DeviceInfoIos? 15: 0)
				this.setState({footerMarginTop: top > 0 && top || 15})
			} else {
				this.setState({footerMarginTop: 15})
			}
        });
    }
	//获取当前高度
	getBtnPosa = (e) => {
        NativeModules.UIManager.measure(e.target, (x, y, width, heightView, px, py) => {
			window.EuroViewHeight = heightView
        });
    }

	render() {
		const {
			selectedTab,
			scrollTop,
		} = this.state

		window.MiniEventShowEuroCup = (showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType) => {
			this.setState({
				showMiniEvent, miniEventId, miniSportId, miniLeagueId, miniShowType
			})
		}
		window.ChangeTabs = (key) => {
			this.tabChange(key)
		}
		window.EuroLoginShow = () => {
			this.setState({EuroLogin: true})
		}
		return (
			<View style={{ flex: 1, backgroundColor: isBlue? '#efeff4': '#000' }} onLayout={(e) => this.getBtnPosa(e)}>
				{ this.state.EuroLogin && <EuroLogin EuroLogin={(EuroLogin) => { this.setState({EuroLogin})}} /> }
				<HeaderView />
				<ScrollView
					onScroll={(e) => {
						let offsetY = e.nativeEvent.contentOffset.y; //滑动距离
						let scrollTop = offsetY
						this.setState({scrollTop})
					}}
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
					style={{flex: 1}}
				>
					<View style={{flex: 1}} onLayout={(e) => this.getBtnPos(e)} ref={(c) => {this.ViewRefs = c}}>
					<CountDown setNoCountDown={this.setNoCountDown} Vendor={VendorIM} />
					{/* <HeaderList Vendor={VendorIM} /> */}
					{/* Tabs */}
					<View style={[styles.tabs,{backgroundColor: isBlue?'#E0E0E0': '#212121',}]}>
						<Touch onPress={() => { this.tabChange(1) }} style={[selectedTab == 1 ? [styles.activeTabs,{backgroundColor: isBlue? '#EFEFF4': '#000',}] : styles.noTabs]}>
							<Text style={{ color: selectedTab == 1 ? '#00A6FF' : '#616161' }}>Trận Đấu</Text>
						</Touch>
						<Touch onPress={() => { this.tabChange(2) }} style={[selectedTab == 2 ? [styles.activeTabs,{backgroundColor: isBlue? '#EFEFF4': '#000',}] : styles.noTabs]}>
							<Text style={{ color: selectedTab == 2 ? '#00A6FF' : '#616161' }}>Lịch Sử Cược</Text>
						</Touch>
						<Touch onPress={() => { this.tabChange(3) }} style={[selectedTab == 3 ? [styles.activeTabs,{backgroundColor: isBlue? '#EFEFF4': '#000',}] : styles.noTabs]}>
							<Text style={{ color: selectedTab == 3 ? '#00A6FF' : '#616161' }}>Khuyến Mãi</Text>
						</Touch>
					</View>
					{
						selectedTab == 1 &&
						<GameTab scrollTop={scrollTop} Vendor={VendorIM} noCountDown={this.state.noCountDown} showBetRecord={this.showBetRecord} />
					}
					{
						selectedTab == 2 &&
						<BetRecordTab />
					}
					{
						selectedTab == 3 &&
						<PromoTab />
					}
					</View>
					<View style={{width: 150,height: this.state.footerMarginTop}} ></View>
					<View>
						<Text style={{ fontSize: 11, color: isBlue? '#000': '#838383', textAlign: 'center' }}>Bản quyền thuộc về © Fun88 2008 - 2021</Text>
					</View>
				</ScrollView>
				{/* 缩小详情页面 */}
				<View style={{paddingBottom: DeviceInfoIos? 20: 0, backgroundColor: isBlue?'#fff': '#000'}}>
					{this.state.showMiniEvent ? (
						<MiniEvent
							Vendor={VendorIM}
							EventId={this.state.miniEventId}
							SportId={this.state.miniSportId}
							LeagueId={this.state.miniLeagueId}
							ShowType={this.state.miniShowType}
							CloseMini={() => {
								this.setState({ showMiniEvent: false, miniEventId: null, miniSportId: 1, miniLeagueId: null, miniShowType: 0 });

								//更新網址鏈接
								// const { pathname, query } = this.props.router;
								// let cloneQuery = Object.assign({}, query);
								// //刪除mini配置
								// delete cloneQuery['miniEventId'];
								// delete cloneQuery['miniSportId'];
								// delete cloneQuery['miniLeagueId'];
								// delete cloneQuery['miniShowType'];
								// const params = new URLSearchParams(cloneQuery);
								// //用replace，避免用戶可以點擊back返回
								// Router.replace(pathname + '?' + params.toString(), undefined, { shallow: true });
							}}
						/>
					) : null}
				</View>
			</View>
			// <Layout>
			// 	<div className="Games-content">
			// 		<CountDown setNoCountDown={this.setNoCountDown} />
			// 		<Tabs
			// 			prefixCls="tabsNormal"
			// 			className="main-tabs"
			// 			activeKey={this.state.selectedTab}
			// 			defaultActiveKey={"1"}
			// 			onTabClick={(key) => {
			// 				if (this.state.selectedTab !== key) {
			// 					if (key == '2' && !checkIsLogin()) {
			// 						redirectToLogin();
			// 						return false;
			// 					}

			// 					this.setState({selectedTab: key},() => {});
			// 					//更新網址鏈接
			// 					const { pathname, query } = this.props.router;
			// 					let cloneQuery = Object.assign({}, query);
			// 					//更換path配置
			// 					const tabMapping = {"2": "betrecord" , "3": "promo" }
			// 					const mappingTabParam = tabMapping[key];
			// 					//console.log('===',mappingTabParam,'|||',key, JSON.stringify(cloneQuery));
			// 					if (mappingTabParam) {
			// 						cloneQuery.tab = mappingTabParam;
			// 					} else {
			// 						delete cloneQuery['tab'];
			// 					}
			// 					const params = new URLSearchParams(cloneQuery);
			// 					const hasParams = (JSON.stringify(cloneQuery) !== '{}');
			// 					//用replace，避免用戶可以點擊back返回
			// 					Router.replace(pathname + (hasParams ? '?' + params.toString() : ''), undefined, { shallow: true });
			// 				}
			// 			}}
			// 		>
			// 			<TabPane tab={`赛事`} key="1">
			// 				<GameTab Vendor={this.props.Vendor} noCountDown={this.state.noCountDown} showBetRecord={this.showBetRecord}/>
			// 			</TabPane>
			// 			<TabPane tab={`注单`} key="2">
			// 				<BetRecordTab customRef={(ref) => this.BetRecordTabRef = ref} Vendor={this.props.Vendor} noCountDown={this.state.noCountDown}/>
			// 			</TabPane>
			// 			<TabPane tab={`优惠`} key="3">
			// 				<PromoTab />
			// 			</TabPane>
			// 		</Tabs>
			// 	</div>
			// </Layout>
		);
	}
}

const styles = StyleSheet.create({
	tabs: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		flexDirection: 'row',

		width: width,
		height: 40,
		marginTop: 10,
	},
	activeTabs: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.33,
		height: 36,

		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
	},
	noTabs: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.33,
		height: 36,
	},
})

export default EuroCup2021;
