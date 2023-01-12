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
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import React from 'react';
class Promotions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activetab: 0,
			Promotionsdata: ''
		};
	}

	render() {
		const { Promotionsdata, lodings } = this.props;
		let promdata = Promotionsdata != '' ? Promotionsdata.filter((item) => item.status == 'Available') : [];
		return (
			<View style={{ flex: 1 }}>
				<View style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
					{(promdata && promdata.length > 0) ? (
						promdata.map((data, index) => {
							return (
								<Touch
									style={[styles.list,{backgroundColor: isBlue? '#E0E0E0': '#212121',}]}
									key={index}
									onPress={() => {
										/***********检查是否已经登录 ********/
										// Actions.PromotionsDetail({ Detail: data })
										PiwikMenberCode('Promo Nav', 'View', `PromoTnC_(${data.contentId})`)
										Actions.PreferentialPage({
											promotionsDetail: data,
											fromPage: 'preferentialPage',
											isEuro: true,
										})
										// Router.push(
										// 	{
										// 		pathname: `/promotions/[details]?id=${data.contentId}`,
										// 		query: { details: 'promodetail', id: data.contentId }
										// 	},
										// 	`/promotions/promodetail?id=${data.contentId}`
										// );
									}}
								>
									<Image style={{ width: width * 0.92, height: width * 0.92 * 0.38 }} source={data.thumbnailMobileImage? { uri: data.thumbnailMobileImage}: require('../../../images/euroSoprt/euroCup/bg2.png')} defaultSource={require('../../../images/euroSoprt/euroCup/bg2.png')} />
								</Touch>
							);
						})
					) :
						lodings ? (
							[...Array(3)].map((i, k) => {
								return <View style={styles.loding} key={k} >
									<View style={[styles.lodingView,{backgroundColor: isBlue? '#E0E0E0': '#212121',}]}><ActivityIndicator color="#fff" /></View>
								</View>;
							})
						)
						: <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: width, marginTop: 60, }}>
							<Image source={require("../../../images/euroSoprt/euroCup/nodata.png")} style={{ height: 62, width: 62 }} />
							<Text style={{ fontWeight: 'bold', marginTop: 15, color: "#666", textAlign: 'center' }}>Không Có Dữ Liệu</Text>
						</View>

					}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	list: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width * 0.92,
		marginTop: 12,
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
		
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export default Promotions;
