import React from 'react'
import ReactNative, { StyleSheet, Text, View, UIManager, Image, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { connect } from 'react-redux'
import { changePromotionIndexAction, changeHomeRegistLoginModalAction } from '../../actions/ReducerAction'
import Preferential from './Preferential'
import PreferentialRecords from './Preferential/PreferentialRecords'
import DailyDeals from './DailyDeals'
import RebateRecord from './RebateRecord'
import * as Animatable from 'react-native-animatable'
// import BottomTabs from '../SbSports/containers/BottomTabs'
const AnimatableView = Animatable.View
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')
class PromotionContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tabIndex: 0,
			bannerIndex: 0,
			isShowModal: false,
			posTop: 88
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.promotionIndexData) {
			setTimeout(() => {
				this.setState({
					tabIndex: nextProps.promotionIndexData.tabIndex
				}, () => {
					//this.props.changePromotionIndexAction.bind({})
				})
			}, 200)
		}
	}

	changeTab(i) {
		this.setState({
			tabIndex: i
		})
	}


	handleViewRef = ref => this.handlePromotionView = ref


	renderPage(item) {
		return <View key={item.item.page}
			style={{
				position: 'absolute',
				left: width / (item.item.page),
				top: this.state.posTop,
			}}>
			<View style={[
				styles.promotionsTab,
				{
					borderBottomColor: (true ? '#25AAE1' : 'transparent'),
					width: width / 4,
					borderBottomWidth: 0,
					backgroundColor: '#fff'
				}
			]}>
				<Text style={{ color: true ? '#25AAE1' : '#AAAAAA', fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}>{item.item.title}</Text>
			</View>
			<Image
				source={require('./../../images/promotion/Group3671.png')}
				resizeMode='stretch'
				style={[styles.promotionWrapImg]}
			></Image>

			<Text style={{ color: '#fff', marginLeft: - 296 * .4 * .5, marginTop: 20 }}>{item.item.text}</Text>
		</View>
	}


	changeModal(isShowModal) {
		this.setState({
			isShowModal
		})
	}

	render() {
		const { tabIndex, bannerIndex, isShowModal } = this.state
		const { isFromSB } = this.props
		const TabDatasLogout = [
			{
				title: 'โปรโมชั่น', // 优惠，
				piwikMenberText: 'Promo_PromoPage',
				component: <Preferential key={tabIndex} changeModal={this.changeModal.bind(this)} isRebate={true} isFromSB={isFromSB}></Preferential>
			},
			{
				title: 'โบนัสของฉัน', // 优惠历史
				piwikMenberText: 'MyPromo_promopage',
				component: <PreferentialRecords changeModal={this.changeModal.bind(this)} isFromSB={isFromSB}></PreferentialRecords>

			},
			{
				title: 'เงินคืน', // 返水优惠
				piwikMenberText: 'Rebate_promopage',
				component: <Preferential key={tabIndex} isRebate={false} isFromSB={isFromSB}></Preferential>
			},
			{
				title: 'สิทธิรายวัน', // dail
				piwikMenberText: 'DailyDeals_promopage',
				component: <DailyDeals></DailyDeals>
			}
		]

		const TabDatasLogin = [
			{
				title: 'โปรโมชั่น',
				piwikMenberText: 'Promo_promopage',
				component: <Preferential changeTab={this.changeTab.bind(this)} changeModal={this.changeModal.bind(this)} isRebate={true} isFromSB={isFromSB}></Preferential>
			},
			{
				title: 'โบนัสของฉัน', // 优惠历史
				piwikMenberText: 'MyPromo_promopage',
				component: <PreferentialRecords changeModal={this.changeModal.bind(this)} isFromSB={isFromSB}></PreferentialRecords>

			},
			{
				title: 'เงินคืน', //返水纪律
				piwikMenberText: 'Rebate_promopage',
				component: <RebateRecord></RebateRecord>
			},
			{
				title: 'สิทธิรายวัน',
				piwikMenberText: 'DailyDeals_promopage',
				component: <DailyDeals
					changeTab={this.changeTab.bind(this)}
				></DailyDeals>
			}
		]

		const TabDatas = ApiPort.UserLogin ? TabDatasLogin : TabDatasLogout

		window.makePromotionPageAnimatable = (translateX) => {
			window.mainPageIndex = 1
			window.makeFadeInTranslation && this.handlePromotionView && this.handlePromotionView.animate && this.handlePromotionView.animate(window.makeFadeInTranslation(translateX), 300)
		}

		return <AnimatableView onLayout={event => {
			this.setState({
				posTop: event.nativeEvent.layout.y
			})

		}} ref={this.handleViewRef} easing={'ease-in-out'} style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
			<View style={{ flexDirection: 'row' }}>
				{
					TabDatas.map((v, i) => {
						let flag = i == tabIndex
						return <TouchableOpacity
							key={i}
							onPress={() => {
								if (!ApiPort.UserLogin && i == 1) {
									this.props.changeHomeRegistLoginModalAction({
										flag: true,
										page: 'home'
									})
									return
								}
								this.changeTab(i)
								TabDatas[i].piwikMenberText && window.PiwikMenberCode('Promo', 'Click', TabDatas[i].piwikMenberText)
							}}
							style={[
								styles.promotionsTab,
								{
									borderBottomColor: window.isBlue ? (flag ? '#25AAE1' : 'transparent') : (flag ? '#25AAE1' : 'transparent'),
									width: width / TabDatas.length
								}
							]}>
							<Text style={{ color: window.isBlue ? (flag ? '#25AAE1' : '#AAAAAA') : (flag ? '#fff' : 'rgba(255, 255, 255, .5)'), fontSize: 11, fontWeight: 'bold', textAlign: 'center' }}>{v.title}</Text>
						</TouchableOpacity>
					})
				}
			</View>

			{
				TabDatas[tabIndex].component
			}

			{/* Tabbar */}
			{
				// isFromSB && <BottomTabs currentTab={1} />
			}
		</AnimatableView>
	}
}

export default Promotion = connect(
	(state) => {
		return {
			promotionIndexData: state.promotionIndexData
		}
	}, (dispatch) => {
		return {
			changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
			changePromotionIndexAction: (data) => dispatch(changePromotionIndexAction(data))
		}
	}
)(PromotionContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1
	},
	promotionsTab: {
		justifyContent: 'center',
		height: 46,
		borderBottomWidth: 2,
		alignItems: 'center'
	},
	tabContainerView: {
		width: width,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 46,
	},
	modalContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .5)',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalBox: {
		backgroundColor: 'red',
		position: 'absolute',
		height: 100,
		width: 100
	},
	promotionWrapImg: {
		width: 296 * .4,
		height: 334 * .4,
		marginLeft: - 296 * .4 * .5,
		marginTop: 10
	},
	containerStyle: {
		paddingVertical: 2,
		position: 'absolute',
		left: 0,
		right: 0,
		top: 380
	},
	gameScrollViewBox: {
		flexDirection: 'row',
	},
	dotStyle: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 0,
		backgroundColor: '#00CEFF'
	},
	inactiveDotStyle: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 0,
		backgroundColor: '#fff'
	},
})