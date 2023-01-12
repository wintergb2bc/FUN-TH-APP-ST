import React from 'react'
import { StyleSheet, View, Dimensions, Platform, TouchableOpacity, Text } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { changeDepositTypeAction, getBalanceInforAction } from './../../../actions/ReducerAction'
import LoadIngWebViewGif from './../../Common/LoadIngWebViewGif'
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window')

class DepositPageContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loadD: true,
			payHtml: this.props.payHtml,
			isCreateResubmitOnlineDeposit: this.props.isCreateResubmitOnlineDeposit
		}
	}

	componentWillMount(props) {
		if (this.state.isCreateResubmitOnlineDeposit) {
			this.props.navigation.setParams({
				title: 'ส่งรายการฝากเงินอีกครั้ง',
				rightButton: () => {
					return <View style={styles.gameButtonBox}>
						<TouchableOpacity
							hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
							style={[styles.gameButtonBoxWrap]} onPress={() => {
								Actions.pop()
							}}>
							<Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>X</Text>
						</TouchableOpacity>

						<View style={[styles.hiddenView,
						{
							backgroundColor: window.isBlue ? '#00aeef' : '#212121'
						}]}></View>
					</View>
				},
				rightButtonImage: () => {
					return null
				}
			})
		}
	}

	componentWillUnmount() {
		if (this.props.paymentMethod == 'THBQR') {
			Actions.THBQRPage({
				isEuro: this.props.isEuro,
				financeType: 'deposit',
				paymentMethod: this.props.paymentMethod,
				money: this.props.money,
				transactionId: this.props.transactionId
			})
		} else {
			this.closeModal()
		}
		!this.state.loadD && this.props.getBalanceInforAction()
	}

	closeModal() {
		Actions.FinanceAfter({
			isEuro: this.props.isEuro,
			financeType: 'deposit',
			paymentMethod: this.props.paymentMethod,
			money: this.props.money,
			transactionId: this.props.transactionId
		})
	}

	render() {
		const { payHtml, loadD } = this.state
		return <View style={styles.viewContainer}>
			<WebView
				originWhitelist={['*']}
				onLoadStart={(e) => this.setState({ loadD: true })}
				onLoadEnd={(e) => this.setState({ loadD: false })}
				renderLoading={(e) => { }}
				source={['http', 'https'].includes(payHtml.split(':')[0].toLocaleLowerCase()) ? { uri: payHtml } : { html: payHtml }}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				scalesPageToFit={Platform.OS === 'ios' ? false : true}
				style={{ width, height }}
			/>

			<LoadIngWebViewGif loadStatus={loadD} />
		</View>
	}
}

export default DepositPage = connect(
	(state) => {
		return {}
	}, (dispatch) => {
		return {
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data))
		}
	}
)(DepositPageContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1
	},
	gameButtonBox: {
		flexDirection: 'row',
		marginRight: 10
	},
	hiddenView: {
		backgroundColor: 'red',
		width: 40,
		height: 40,
		position: 'absolute',
		left: -width * .95,
		zIndex: 1000,
		bottom: 0
	}
})