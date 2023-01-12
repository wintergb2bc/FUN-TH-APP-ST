import React from 'react'
import { StyleSheet, Platform, Linking, View, Keyboard, Dimensions, Image, TouchableOpacity, Text } from 'react-native'
import Toast from '@/containers/Toast'
import { changeHomeLiveChatIncognitoAction } from './../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import LoadIngWebViewGif from './../Common/LoadIngWebViewGif'
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window')
import { connect } from 'react-redux'
const WEBVIEW_REF = 'webview'
const patchPostMessageFunction = function () {
	var originalPostMessage = window.postMessage

	var patchedPostMessage = function (message, targetOrigin, transfer) {
		originalPostMessage(message, targetOrigin, transfer)
	}

	patchedPostMessage.toString = function () {
		return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
	}

	window.postMessage = patchedPostMessage
}
const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';


let fireLoad = false
class LiveChatContainer extends React.Component {
	constructor(props) {
		super(props)
		//this._onNavigationStateChange = this._onNavigationStateChange.bind(this)
		this.state = {
			LiveChatKey: 0,
			initialHeight: height - 80,
			heightXJ: height - 80,
			keyboardOpen: 0,
			loadD: true,
			LiveChatX: '',
			incognito: true
		}
	}

	componentDidMount(props) {
		window.isGamePageToFiance && window.openOrientation && window.openOrientation()
		global.storage.load({
			key: 'livechaturl',
			id: 'livechaturl'
		}).then(livechaturl => {
			this.setState({
				LiveChatX: livechaturl,
				incognito: false
			})
		}).catch(() => {
			this.setState({
				incognito: true
			})
			if (this.props.liveUrl) {
				this.setState({
					LiveChatX: 'https://cranberryapp.hihi2u.com/app'
				})
			} else {
				this.getLiveChat()
			}
		})


		this.props.navigation.setParams({
			title: 'ฝ่ายบริการลูกค้า',
			leftButton: () => {
				return <View style={styles.gameButtonBox}>
					<TouchableOpacity
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
						style={[styles.gameButtonBoxWrap1]} onPress={() => {
							global.storage.remove({
								key: 'livechaturl',
								id: 'livechaturl'
							})
							this.props.changeHomeLiveChatIncognitoAction(false)
							Actions.pop()
						}}>
						<Image resizeMode='stretch' source={require('./../../images/tabberIcon/leftIcon.png')} style={styles.homeCSImg1}></Image>
					</TouchableOpacity>

					<TouchableOpacity
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
						style={[styles.gameButtonBoxWrap2]} onPress={() => {
							global.storage.save({
								key: 'livechaturl',
								id: 'livechaturl',
								data: this.state.LiveChatX,
								expires: null
							})
							this.props.changeHomeLiveChatIncognitoAction(true)
							Actions.pop()
						}}>
						<Image resizeMode='stretch' source={require('./../../images/tabberIcon/csLoad.png')} style={styles.homeCSImg2}></Image>
					</TouchableOpacity>
				</View>
			}
		})
		// //  监听键盘打开事件
		// this.keyboardDidShowListener = Keyboard.addListener(
		// 	'keyboardDidShow',
		// 	this._keyboardDidShow.bind(this)
		// )
		// //  监听键盘关闭事件
		// this.keyboardDidHideListener = Keyboard.addListener(
		// 	'keyboardDidHide',
		// 	this._keyboardDidHide.bind(this)
		// )

		// setTimeout(() => {   //防止亂彈瀏覽器
		// 	fireLoad = true
		// }, 5000)
	}

	getLiveChat() {
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.LiveChat, 'GET').then(data => {
			Toast.hide()
			//if (data.isSuccess) {
			this.setState({
				LiveChatX: data.url,
				// LiveChatXTSrc: data.liveChatUrl.url+ betInfo,
				LiveChatKey: Math.random(),
			})
			//}
		}).catch(error => {
			Toast.hide()
		})
	}

	componentWillUnmount() {
		window.isGamePageToFiance && window.removeOrientation && window.removeOrientation()
		window.isGamePageToFiance = false
		Toast.hide()
		// this.keyboardDidShowListener.remove()
		// this.keyboardDidHideListener.remove()
		this.setState({
			LiveChatX: ''
		})

		let fromPage = this.props.fromPage
		if (fromPage) {
			if (fromPage === 'Maintenance') {
				window.changeMaintenance && window.changeMaintenance(true)
				return
			}
			if (fromPage === 'loginOtp') {
				this.props.changeLoginOtpStatus && this.props.changeLoginOtpStatus(true)
				return
			}
		}
	}

	// _keyboardDidShow(e) {
	// 	this.setState({
	// 		heightXJ: this.state.initialHeight - e.endCoordinates.height - 20
	// 	})
	// }

	// _keyboardDidHide(e) {
	// 	this.setState({ heightXJ: this.state.initialHeight })
	// }

	// _onNavigationStateChange(e) {
	// 	const { LiveChatX } = this.state
	// 	if (LiveChatX && e.url) {
	// 		let oldDomain = LiveChatX.split('://')[1] && LiveChatX.split('://')[1].split('/')[0] || false
	// 		let newDomain = e.url.split('://')[1] && e.url.split('://')[1].split('/')[0] || false
	// 		if (oldDomain && newDomain && oldDomain != newDomain) {
	// 			Linking.openURL(e.url);
	// 			setTimeout(() => {
	// 				reloadLiveChat();
	// 			}, 500)
	// 		}
	// 	}
	// }

	render() {
		const { heightXJ, LiveChatKey, LiveChatX, loadD } = this.state
		window.reloadLiveChat = () => {
			this.setState({
				loadD: true,
				LiveChatKey: Math.random(),
			})
		}
		return <View style={styles.viewContainer}>
			{
				LiveChatX.length > 0 && (
					<WebView
						// domStorageEnabled={true}
						incognito={this.state.incognito} //缓存
						// cacheMode={'LOAD_NO_CACHE'}
						// cacheEnabled={true}
						// saveFormDataDisabled={false}
						key={LiveChatKey}
						onLoadStart={(e) => this.setState({ loadD: true })}
						onLoadEnd={(e) => this.setState({ loadD: false })}
						source={{
							uri: LiveChatX,
							// headers: {
							// 	'Authorization': ApiPort.Token ? ApiPort.Token : '',
							// 	'Content-Type': 'application/json charset=utf-8',
							// 	'Culture': 'th-th',
							// }
						}}
						originWhitelist={['*']}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						mixedContentMode="always"
						scalesPageToFit={false}
						allowsInlineMediaPlayback
						mediaPlaybackRequiresUserAction={false}
						allowFileAccess
						style={{ width: width, height: heightXJ, marginTop: 0 }}
					/>
				)
			}

			{
				LiveChatX.length > 0 && <LoadIngWebViewGif loadStatus={loadD} />
			}
		</View>
	}
}

export default LiveChat = connect(
	(state) => {
		return {
			memberInforData: state.memberInforData,
			balanceInforData: state.balanceInforData,
			stateRouterNameData: state.stateRouterNameData,
			selfExclusionsData: state.selfExclusionsData,
			promotionListData: state.promotionListData
		}
	}, (dispatch) => {
		return {
			changeHomeLiveChatIncognitoAction: (flag) => dispatch(changeHomeLiveChatIncognitoAction(flag)),
		}
	}
)(LiveChatContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	gameButtonBoxWrap1: {
		flexDirection: 'row',
		marginRight: 10,
		position: 'absolute',
		left: 8
	},
	homeCSImg1: {
		width: 24,
		height: 24
	},
	gameButtonBoxWrap2: {
		flexDirection: 'row',
		position: 'absolute',
		left: width - 32
	},
	homeCSImg2: {
		width: 24,
		height: 24
	},
	gameButtonBox: {
		flexDirection: 'row',
		marginRight: 10,
		backgroundColor: 'red',
		width,
		// height: 40,
		flexDirection: 'row',
		alignItems: 'center'
	}
})