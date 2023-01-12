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
class PromoRebateHistory extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			datalist: ''
		};
	}

	componentDidMount() {
		let Rebatedata = JSON.parse(localStorage.getItem('Rebatedata'));
		/*------ 获得本条返水的ID ------*/
		// const { id } = Router.router.query;
		/*------ 根据ID筛选出对应的数据 -----*/

		if (Rebatedata) {
			let datalist = Rebatedata.find((item) => item.contentId == this.props.contentId);
			this.setState({
				datalist: datalist.memberPromotionRebateViewData.rebatesSummary[0].rebates
			});
		}
	}

	render() {
		const { datalist } = this.state;
		return (
			<View style={{flex: 1, backgroundColor: '#EFEFF4', padding: 15,}}>
				{datalist != '' ? (
					datalist.map((data, index) => {
						const {
							applyDate,
							rebateCategory,
							validTurnover,
							rebateAmount,
							playerRebateID,
							rebateRate
						} = data;
						return (
							<View style={styles.Historylist} key={index}>
								<View style={styles.hengview}>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>日期</Text>
										<Text style={{ fontSize: 12}}>{moment(applyDate).format('YYYY-MM-DD')}</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>流水</Text>
										<Text style={{ fontSize: 12}}>{validTurnover}</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>类别</Text>
										<Text style={{ fontSize: 12}}>{rebateCategory}</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>返水</Text>
										<Text style={{ fontSize: 12}}>¥{rebateAmount}</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>返水比例</Text>
										<Text style={{ fontSize: 12}}>{rebateRate}% (电脑版)</Text>
									</View>
									<View style={styles.viewlist}>
										<Text style={{color: '#999999', fontSize: 12, paddingRight: 15}}>编号</Text>
										<Text style={{ fontSize: 12}}>{playerRebateID}</Text>
									</View>
								</View>
							</View>
						);
					})
				) : (
					<Text style={{lineHeight: 70,textAlign: 'center'}}>暂无数据</Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	hengview: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	viewlist: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		flexDirection: 'row',
		width: (width - 60) * 0.5,
		paddingBottom: 10,
	},
	Historylist: {
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 10,
		paddingBottom: 15,
	},
})

export default PromoRebateHistory;
