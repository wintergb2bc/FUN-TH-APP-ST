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
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
import { ApiPortSB } from '../../../containers/SbSports/lib/SPORTAPI';
/* --------优惠列表--------*/
import Promotions from './Promotions';
/* ----------返水----------*/
import PromotionsRebate from './PromotionsRebate';
// /* --------每日好礼--------*/
import PromotionsEverydayGift from './PromotionsEverydayGift';
// /* --------我的优惠--------*/
import PromotionsMy from './PromotionsMy';
class PromoTab extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			lodings: true,
			Promotionsdata: ''
		};
	}

	componentDidMount() {

		/*------------------ 获取本地优惠，加快访问速度 ----------------- */
		let Promotionsdata = JSON.parse(localStorage.getItem('Promotionsdata'));
		if (Promotionsdata) {
			this.setState({
				lodings: false,
				Promotionsdata: Promotionsdata
			});
		}
		this.Promotions();
	}

	/**
	 * @description: 获取优惠数据
	 * @return {*} 优惠列表
	*/

	Promotions = () => {
		fetchRequest(ApiPortSB.GetPromotions + 'promoCategory=SPORT&eventCategoryType=Euro2021&', 'GET')
			.then((res) => {
				if (res && res.promotionList) {
					this.setState({
						lodings: false,
						Promotionsdata: res.promotionList
					});
					res.promotionList.length > 0 && localStorage.setItem('Promotionsdata', JSON.stringify(res.promotionList));
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		const { activetab, Promotionsdata, lodings } = this.state;

		window.PromotionsMyType = () => {
			this.setState({ activetab: 1 });
			this.Promotions();
		}

		return (
			<View>
				<Promotions Promotionsdata={Promotionsdata} lodings={lodings} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	tabTxt: {
		lineHeight: 38,
		textAlign: 'center',
		fontSize: 13,
	},
	tabs: {
		width: width / 4,
		borderBottomWidth: 3,
		borderBottomColor: 'transparent',

	},
	activetab: {
		width: width / 4,
		borderBottomWidth: 3,
		borderBottomColor: '#00A6FF',

	},
	tabsView: {
		width: width,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		borderBottomColor: '#e3e3e8',
		borderBottomWidth: 1,
	}
})

export default PromoTab;
