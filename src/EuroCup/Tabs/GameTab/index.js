import React from "react";
// import Image from '@/Image/Image';
import GameList from "./GameList";
// import Router from 'next/router';
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
	findNodeHandle,
	Modal
} from "react-native";
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';

class GameTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//列表/日期切換展示
			displayType: 1,
			footerMarginTop: 0,
			dataIsEmpty: false, //如果空數據不展示切換按鈕
		}

		this.setDataIsEmpty = this.setDataIsEmpty.bind(this);
	}

	componentDidMount() {}

	componentWillUnmount() {
	}

	//如果空數據不展示切換按鈕
	setDataIsEmpty(value) {
		if (value !== this.state.dataIsEmpty) { //有變更才重新設定
			this.setState({ dataIsEmpty: value })
		}
	}

	render() {
		const { displayType } = this.state;
		const { Vendor } = this.props;
		return <View style={{ flex: 1, backgroundColor: isBlue? '#EFEFF4': '#000' }} ref={(c) => { this.ViewRefs = c}}>

			<View className="menu-bar">
				<View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 15 }}>
					{
						!this.state.dataIsEmpty ?
							<View>
								{/* <input className="Game-switch" type="checkbox" hidden checked={displayType === 2} readOnly="readOnly" /> */}
								<Touch style={styles.changeTab}
									onPress={() => {
										let targetWay = 2;
										if (displayType === 2) {
											targetWay = 1;
										}
										this.setState(
											{
												displayType: targetWay
											}
										);
									}}
								>
									<View style={[displayType == 1 ? styles.activeTabs : [styles.activeTabs,{backgroundColor: isBlue? '#E0E0E0': '#212121',}], styles.leftTabs]}>
										<Text style={{ color: displayType == 1 ? '#fff' : '#959595', fontSize: 11 }}>
											Tất cả
          								</Text>
									</View>
									<View style={[displayType == 2 ? styles.activeTabs : [styles.activeTabs,{backgroundColor: isBlue? '#E0E0E0': '#212121',}], styles.rightTabs]}>
										<Text style={{ color: displayType == 2 ? '#fff' : '#959595', fontSize: 11 }}>
											Theo ngày
          								</Text>
									</View>
								</Touch>
							</View>
							: <View style={{ width: 50, height: 20 }} />
					}
					<Touch style={styles.ranking} onPress={() => {Actions.EuroCupGroup()}}>
						<Image source={require("../../../images/euroSoprt/euroCup/badge.png")} style={{ height: 20, width: 15 }} />
						<Text style={{ color: '#fff', paddingLeft: 5, fontSize: 12 }}>Xếp hạng</Text>
					</Touch>
				</View>
			</View>
			<GameList
				scrollTop={this.props.scrollTop}
				Vendor={Vendor}
				DisplayType={displayType}
				setDataIsEmpty={this.setDataIsEmpty}
				noCountDown={this.props.noCountDown}
				showBetRecord={this.props.showBetRecord}
			/>
		</View>
	}
}

const styles = StyleSheet.create({
	ranking: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F35B0E',
		borderRadius: 50,
		height: 26,
		paddingLeft: 10,
		paddingRight: 10,
	},
	changeTab: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: '#E0E0E0',
		width: 120,
		borderRadius: 50,
		paddingLeft: 20,
		paddingRight: 20,
	},
	leftTabs: {
		borderTopLeftRadius: 50,
		borderBottomLeftRadius: 50,
	},
	rightTabs: {
		borderTopRightRadius: 50,
		borderBottomRightRadius: 50,
	},
	activeTabs: {
		backgroundColor: '#00A6FF',
		width: 60,
		height: 26,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	notabs: {
		width: 60,
		height: 26,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	}
})

export default GameTab
