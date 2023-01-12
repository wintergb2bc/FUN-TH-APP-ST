import React from 'react'
import ReactNative, { StyleSheet, View, Dimensions, UIManager, ScrollView, Platform, TouchableOpacity, Image, Text, Modal, TouchableHighlight, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { getBalanceInforAction } from '../../actions/ReducerAction'
import { WebView } from 'react-native-webview';
import LoadIngWebViewGif from './../Common/LoadIngWebViewGif'
import { toThousands } from '../../actions/Reg'
const { width, height } = Dimensions.get('window')
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { IphoneXMax } from './../Common/CommonData'
import DeviceInfo from 'react-native-device-info'
// import BottomTabs from '../SbSports/containers/BottomTabs'
import moment from "moment";
const getModel = DeviceInfo.getModel()
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'
// const gameHeaderPaddingTop = isIphoneMax ? 45 : 25
const eventEndDate = '2022-12-19T14:00:00'; //最後一場
const woldCupEndDate = moment(new Date(eventEndDate), 'YYYY-MM-DD HH:mm:ss').valueOf()
const nowTime = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').valueOf()
import GameWalletMoney from './../Common/GameWalletMoney'
class GamePageContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			loadD: true,
			widthS: width,
			heightS: height,
			gametype: this.props.gametype,
			gameOpenUrl: this.props.GameOpenUrl,
			gameKey: Math.random(),
			arrowFlag: false,
			balanceInfor: [],
			isShowSbTip: false,
			isShowKenoTip: false,
			walletCode: this.props.walletCode,
			isShowWalletModal: false,
			tranferLoading: false,
			walletInfor: {
				localizedName: '',
				balance: 0
			},
			isShowGuide: false,
			gameNewHeaderName: '',
			gameKey1: 0,
			isShowWalletGameModal: false
			//this.props.walletInforBalance <= 0,
		}
	}

	componentDidMount(props) {
		this.loadInterval && clearInterval(this.loadInterval)
		if (this.props.balanceInforData.length) {
			let balanceInfor = this.props.balanceInforData
			this.setState({
				balanceInfor
			}, () => {
				const { balanceInfor, walletCode } = this.state
				let walletInfor = balanceInfor.find(v => v.name == walletCode) || {
					localizedName: '',
					balance: 0
				}

				let isShowWalletGameModal = balanceInfor.filter(v => v.name.toLocaleUpperCase() === 'TOTALBAL')[0].balance <= 0
				this.setState({
					walletInfor,
					isShowWalletGameModal
				})

				if (!isShowWalletGameModal) {
					if (this.props.walletInforBalance <= 0) {
						window.goFinancePage({
							router: 'TransferStack',
							stack: true,
							walletCode,
							fromPage: 'GamePage'
						})
					}
				}
			})
		}
		this.getGameNewHeaderName()
		//this.getIsShowGuide()
		this.isLockToPortrait()
		this.loadInterval = setInterval(() => {
			this.widthHeight()
		}, 1000)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.balanceInforData.length) {
			let balanceInfor = nextProps.balanceInforData
			this.setState({
				balanceInfor
			}, () => {
				const { balanceInfor, walletCode } = this.state
				let walletInfor = balanceInfor.find(v => v.name == walletCode) || {
					localizedName: '',
					balance: 0
				}

				this.setState({
					walletInfor
				})
			})
		}
	}

	componentWillUnmount() {  //離開註銷監聽 
		window.openOrientation && window.openOrientation()
		const { loadD } = this.state
		this.loadInterval && clearInterval(this.loadInterval)
		if (ApiPort.UserLogin && !loadD) {
			this.props.getBalanceInforAction()
		}
	}


	getIsShowGuide() {
		let { gametype } = this.props
		let tempData = gametype
		if (['SPR', 'AVIATOR'].includes(gametype)) {
			tempData = 'SPRAVIATOR'
		}
		global.storage.load({
			key: 'getIsShowGuideData' + tempData + memberCode,
			id: 'getIsShowGuideData' + tempData + memberCode,
		}).then(data => {
			this.setState({
				isShowWalletModal: false,
				isShowGuide: false,
			})
			window.removeOrientation && window.removeOrientation()
		}).catch(() => {
			this.setState({
				isShowWalletModal: true,
				isShowGuide: true,
			})
		})
	}

	changeArrowStatus(arrowFlag) {
		this.setState({
			arrowFlag
		})
	}


	isLockToPortrait() {
		const { gametype } = this.props
		//'GPK', 'NLE', 'EBT', 'IPES', 'SP', 'IPSB'
		if (['TFG',].some(v => v === gametype.toLocaleUpperCase())) {

		} else {
			//解鎖橫豎屏
		}
		window.isGamePageToFiance = false
		this.setState({
			qwer: ''
		})
	}

	widthHeight() {  //重新計算寬高
		const { width, height } = Dimensions.get('window')
		this.setState({
			widthS: width,
			heightS: height,
			gameKey1: Math.random(),
		})
	}

	reloadGamePage() {
		this.setState({
			gameKey: Math.random(),
			gameOpenUrl: this.state.gameOpenUrl,
			loadD: true,
		})
		window.removeOrientation && window.removeOrientation()
		this.isLockToPortrait()
	}

	transfer(item) {  //一鍵轉
		this.modalDropdown && this.modalDropdown.hide()
		this.changeArrowStatus(false)
		const { } = this.state
		// 一键
		if (item.state === 'UNDERMAINTENANCE') {
			Toast.fail('กระเป๋าเงินอยู่ระหว่างปรับปรุง โปรดลองอีกครั้งในภายหลัง', 2)
			return
		}
		let totalmoney = this.props.balanceInforData.find(v => v.name === 'TOTALBAL').balance
		if (totalmoney <= 0) {
			Toast.fail('ยอดเงินไม่เพียงพอม กรุณาฝากเงิน', 2)
			//该帐户的余额不足，无法转移。 请汇款赚钱。
			return
		}
		this.setState({
			tranferLoading: true
		})

		let data = {
			fromAccount: 'All',
			toAccount: item.name,
			amount: 0,
			bonusId: 0,
			blackBoxValue: E2Backbox,
			e2BlackBoxValue: E2Backbox,
			bonusCoupon: ''
		}

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.Transfer, 'POST', data).then(data => {
			Toast.hide()
			this.props.getBalanceInforAction()
			this.setState({
				tranferLoading: false
			})
			if (data.status != 0) {
				Toast.success('โอนสำเร็จ', 3)
			} else {
				Toast.fail('จำนวนเงินไม่เพียงพอ', 2)
			}
		}).catch(error => {
			this.setState({
				tranferLoading: false
			})
			Toast.hide()
			Toast.fail(data.messages, 2)
		})

		window.PiwikMenberCode('Transfer Nav', 'Click', `${item.name}_QuickTransfer_Ingame`)
	}

	activeToPage(type) {
		window.isGamePageToFiance = true
		this.setState({
			isShowSbTip: false,
			isShowKenoTip: false,
			isShowWalletModal: false
		})
		const { walletCode } = this.state
		this.modalDropdown && this.modalDropdown.hide()
		this.changeArrowStatus(false)
		window.goFinancePage({
			router: type,
			stack: true,
			walletCode,
			fromPage: 'GamePage'
		})

		let pikObj = {
			TransferStack: {
				text: 'Transfer Nav',
				type1: 'Click',
				content: 'Transfer_Ingame'
			},
			DepositStack: {
				text: 'Deposit Nav',
				type1: 'Click',
				content: 'Deposit_Ingame'
			}
		}
		const { text, type1, content } = pikObj[type]
		window.PiwikMenberCode(text, type1, content)
	}

	cancleGuide() {
		let { gametype } = this.state
		this.setState({
			isShowGuide: false,
			isShowWalletModal: false
		})
		window.removeOrientation && window.removeOrientation()
		let tempData = gametype
		if (['SPR', 'AVIATOR'].includes(gametype)) {
			tempData = 'SPRAVIATOR'
		}
		global.storage.save({
			key: 'getIsShowGuideData' + tempData + memberCode,
			id: 'getIsShowGuideData' + tempData + memberCode,
			data: true,
			expires: null
		})
	}


	getGameNewHeaderName() {
		global.storage.load({
			key: 'GameSequence',
			id: 'GameSequence'
		}).then(gameSequences => {
			if (gameSequences.length) {
				let { gametype } = this.state
				let gameSequencesSubProviders = gameSequences.map(v => v.subProviders)
				let tempGameSequences = gameSequencesSubProviders.reduce((arr, v) => arr.concat(...v), [])
				let tempGame = tempGameSequences.find(v => v.code == gametype)
				if (tempGame) {
					this.setState({
						gameNewHeaderName: tempGame.gameNewHeaderName
					})
				}
			}
		}).catch(() => { })
	}


	createPgBtnWrap(gameHeaderPaddingTop) {
		const { gametype, } = this.props
		const gameHeadName = this.props.gameHeadName || ''
		const { arrowFlag, balanceInfor, walletInfor, gameNewHeaderName, widthS } = this.state
		return <View style={[styles.headBackgroundBox, {
			backgroundColor: !window.isBlue ? '#212121' : '#00aeef',
			paddingTop: gameHeaderPaddingTop,
			paddingBottom: 5,
			width: widthS
		}]}>
			<View style={styles.headerLeft}>
				{!this.props.isFromSB && <TouchableOpacity
					onPress={() => {
						Actions.pop()
						window.openOrientation && window.openOrientation()
					}}
					style={styles.gameBackImgBox} hitSlop={{ top: 20, bottom: 20, right: 15, left: 20 }}>
					<Image
						style={styles.gameBackImg}
						resizeMode='stretch'
						source={require('./../../images/game/arrow.png')}></Image>
				</TouchableOpacity>}
				<View style={{ width: !this.props.isFromSB ? 120 : 'auto', flexDirection: 'row', alignItems: 'center', marginLeft: !this.props.isFromSB ? 0 : 10 }}>
					<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>{(gameNewHeaderName || '').toLocaleUpperCase()}</Text>
					<TouchableOpacity
						hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
						onPress={() => {
							this.reloadGamePage()
							this.props.getBalanceInforAction()
						}}>
						<Image resizeMode='stretch' source={require('./../../images/game/refresh.png')} style={styles.refreshImg}></Image>
					</TouchableOpacity>
				</View>
			</View>


			<View style={styles.hearRight}>
				{
					Array.isArray(balanceInfor) && balanceInfor.length > 0 && <TouchableOpacity
						onPress={() => {
							this.setState({
								isShowSbTip: false,
								isShowKenoTip: false,
								isShowWalletModal: !this.state.isShowWalletModal
							})
							this.changeArrowStatus(true)
						}}
						style={[styles.walletBox, {
							backgroundColor: window.isBlue ? '#FCFEFF' : '#545457',
							marginRight: !this.props.isFromSB ? 0 : 40
						}]}>
						<View style={styles.walletLeftBox}>
							<Text style={[styles.walletLeftBoxText2, { color: window.isBlue ? '#222' : '#fff', width: !this.props.isFromSB ? 65 : 80 }]} numberOfLines={1}>{walletInfor.localizedName}</Text>
							<Text style={[styles.walletRightBoxText1, { color: window.isBlue ? '#222' : '#fff' }]}>{toThousands(walletInfor.balance)}</Text>
						</View>
						{
							<ModalDropdownArrow arrowFlag={arrowFlag} img={true} />
						}
					</TouchableOpacity>
				}
				{
					//!this.props.isFromSB && (nowTime <= woldCupEndDate) && this.renderWorldCupIcon()
				}

				{!this.props.isFromSB && <TouchableOpacity style={styles.homeCsWrap} onPress={() => {
					Actions.LiveChat()
					window.isGamePageToFiance = true
					window.PiwikMenberCode('CS', 'Launch', 'CS_GameNavigation')

				}}>
					<Image resizeMode='stretch' source={Boolean(this.props.liveChatData) ? require('./../../images/tabberIcon/ic_online_cs.gif') : require('./../../images/tabberIcon/whiteCS.png')} style={styles.homeCSImg}></Image>
				</TouchableOpacity>}
			</View>
		</View>
	}

	renderWorldCupIcon() {
		return <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {
			PiwikMenberCode('Game', 'Launch', 'SB2.0_WCIcon_GameHeader')
			Actions.pop({ type: 'replace' });
			gotoSBIM()
		}}>
			<Image style={{ width: 28, height: 28, alignSelf: 'center' }} resizeMode='stretch' source={require('./../SbSports/images/worldcupIcon.png')}></Image>
			<View style={{ flexDirection: 'row' }}>
				<Text style={{ color: '#FFFDF7', fontSize: 8, fontWeight: 'bold' }}>World Cup</Text>
				<View style={{ backgroundColor: '#EB3323', borderRadius: 2 }}><Text style={{ color: '#FFFDF7', fontSize: 8, fontWeight: 'bold' }}>HOT</Text></View>
			</View>

		</TouchableOpacity>
	}


	createWalletList(gameHeaderPaddingTop) {
		const { isShowGuide, arrowFlag, walletInfor, tranferLoading, isShowSbTip, isShowKenoTip, balanceInfor, walletCode, loadD, gameOpenUrl, gameKey, widthS, heightS, gametype, isShowWalletModal } = this.state
		let flag = widthS > heightS
		return <View style={[styles.modalWrap, {
			width: widthS,
			paddingHorizontal: flag ? 40 : 10,
			backgroundColor: window.isBlue ? '#FCFEFF' : '#333',
		}]}>
			{
				Array.isArray(balanceInfor) && balanceInfor.length > 0 && balanceInfor.map((item, i) => {
					let isUnderMaintenance = item.state.toLocaleUpperCase() === 'UNDERMAINTENANCE'
					return <View
						key={i}
						style={[styles.WalletModalDropdownList, {
							width: widthS - (flag ? 80 : 20),
						}]}>
						<View style={[styles.balanceLeft]}>
							<View style={[styles.balanceLeftCircle, { backgroundColor: item.color }]}></View>
							<Text style={[styles.WalletModalDropdownListText, { color: window.isBlue ? '#000' : '#fff' }]}>{item.localizedName}</Text>
							{
								(item.name === 'SB') && <TouchableOpacity
									hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
									onPress={() => {
										if (item.name === 'SB') {
											Actions.SBGuiderModal({
												istype: true
											})
										}
									}}
									style={styles.walletSbIconBox}>
									<Image
										resizeMode='stretch'
										source={require('./../../images/finance/walletSbIcon0.png')}
										style={styles.walletSbIcon}
									></Image>
								</TouchableOpacity>
							}
						</View>

						<View style={styles.moneyTranferBox}>
							<Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{toThousands(item.balance)}</Text>
							{
								walletCode == item.name ? <TouchableOpacity
									onPress={this.transfer.bind(this, item)}
									style={styles.formatbalanceInfortBox} hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}>
									<Image
										source={isUnderMaintenance ? require('./../../images/finance/transfer/formatbalanceInfortBox2.png') : require('./../../images/finance/transfer/formatbalanceInfortBox.png')}
										resizeMode='stretch'
										style={styles.formatbalanceInfortBoxImg}></Image>
								</TouchableOpacity>
									:
									<View
										style={styles.formatbalanceInfortBox} hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}>
										<View style={styles.formatbalanceInfortBoxImg}></View>
									</View>

							}

						</View>
					</View>
				})
			}

			<View style={[styles.tranferBtnBox]}>
				<TouchableOpacity
					onPress={this.activeToPage.bind(this, 'TransferStack')}
					style={[styles.tranferBtn, {
						width: (width - (flag ? 80 : 20)) * .45,
					}]}>
					<Text style={[styles.tranferBtnText, { color: '#26A9E1' }]}>โอนเงิน</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={this.activeToPage.bind(this, 'DepositStack')}
					style={[styles.tranferBtn, { backgroundColor: '#26A9E1', width: (width - (flag ? 80 : 20)) * .45, }]}>
					<Text style={[styles.tranferBtnText, { color: '#FFFFFF' }]}>ฝากเงิน</Text>
				</TouchableOpacity>
			</View>

			{
				// tranferLoading && <View style={styles.registIpkLoadFlag}>
				// 	<ActivityIndicator size='large' color='#fff' />
				// </View>
			}
		</View>
	}

	changeShowWalletGameModal(isShowWalletGameModal) {
		this.setState({
			isShowWalletGameModal
		}, () => {
			this.getIsShowGuide()
		})
	}


	render() {
		const { isShowWalletGameModal, gameKey1, isShowGuide, arrowFlag, walletInfor, heights, tranferLoading, isShowSbTip, isShowKenoTip, balanceInfor, walletCode, loadD, gameOpenUrl, gameKey, widthS, heightS, gametype, isShowWalletModal } = this.state
		const gameHeaderPaddingTop = widthS > heightS ? 10 : (isIphoneMax ? 45 : 25)
		return <View style={{ width: widthS, height: heightS, flex: 1, backgroundColor: '#000', position: 'relative' }}>
			<GameWalletMoney
				changeShowWalletGameModal={this.changeShowWalletGameModal.bind(this)}
				isShowWalletGameModal={isShowWalletGameModal}
			/>


			{
				this.createPgBtnWrap(gameHeaderPaddingTop)
			}

			{
				isShowWalletModal && <View style={[styles.modalViewContainer]}>
					{
						<View>
							<TouchableHighlight onPress={() => {
								this.setState({
									isShowWalletModal: false
								}, () => {
									this.changeArrowStatus(false)
								})
							}}
								style={[{ height: gameHeaderPaddingTop + 40 + 5 }]}>
								<Text></Text>
							</TouchableHighlight>

							{
								(widthS > heightS) ?
									<View style={{ height: heightS * .5, overflow: 'hidden', width: widthS }}>
										<ScrollView
											automaticallyAdjustContentInsets={false}
											showsHorizontalScrollIndicator={false}
											showsVerticalScrollIndicator={false}
										>
											{
												this.createWalletList(gameHeaderPaddingTop)
											}

										</ScrollView>
									</View>
									:
									this.createWalletList(gameHeaderPaddingTop)
							}


							<TouchableHighlight onPress={() => {
								this.setState({
									isShowWalletModal: false
								}, () => {
									this.changeArrowStatus(false)
								})
							}}
								style={[{ height, width: widthS, backgroundColor: 'rgba(0, 0, 0, .4)' }]}>
								<Text></Text>
							</TouchableHighlight>
						</View>
					}

					{
						isShowGuide &&
						<View
							easing='ease-out'
							style={[styles.modalGuideContainer, {

							}]}>
							<View style={[styles.guideBox, {
								position: 'absolute',
								top: gameHeaderPaddingTop,
								width,
								paddingRight: 44,
								paddingLeft: 10
							}]}>
								<View style={[styles.guideInforWrap]}>
									<Text style={styles.guideInforText}>ตรวจสอบยอดคงเหลือทั้งหมด</Text>
								</View>

								<View style={[styles.arrowWrap]}>
									<Text style={styles.line}>- -</Text>
									<View style={styles.arrow}></View>
								</View>

								<View
									style={[styles.walletBox, {
										backgroundColor: window.isBlue ? '#FCFEFF' : '#545457'
									}]}>
									<View style={styles.walletLeftBox}>
										<Text style={[styles.walletLeftBoxText2, { color: window.isBlue ? '#222' : '#fff', width: 65 }]} numberOfLines={1}>{walletInfor.localizedName}</Text>
										<Text style={[styles.walletRightBoxText1, { color: window.isBlue ? '#222' : '#fff' }]}>{toThousands(walletInfor.balance)}</Text>
									</View>
									{
										<ModalDropdownArrow arrowFlag={arrowFlag} img={true} />
									}
								</View>
							</View>

							<View style={[styles.guideFinally, {
								bottom: height - 40 - 5 - gameHeaderPaddingTop - balanceInfor.length * 35 - 60
							}]}>


								<View style={{ alignItems: 'flex-end', marginBottom: 0 }}>
									<View style={[styles.guideInforWrap, styles.guideInforWrap1]}>
										<Text style={styles.guideInforText}>โอนยอดเงินทั้งหมดเข้ากระเป๋านี้อย่างรวดเร็วเพียงคลิกเดียว</Text>
									</View>
									<View style={[styles.arrowWrap, styles.arrowWrap1]}>
										<Text style={styles.line}>- -</Text>
										<View style={styles.arrow}></View>
									</View>
								</View>

								<View
									style={[styles.WalletModalDropdownList, styles.WalletModalDropdownList1, {
										height: 45,
										marginTop: 40,
										marginBottom: 20,
										backgroundColor: window.isBlue ? '#fff' : '#545457',
										paddingHorizontal: 5
									}]}>
									<View style={styles.balanceLeft}>
										<View style={[styles.balanceLeftCircle, { backgroundColor: walletInfor.color }]}></View>
										<Text style={[styles.WalletModalDropdownListText, { color: window.isBlue ? '#000' : '#fff' }]}>{walletInfor.localizedName}</Text>
									</View>

									<View style={[styles.moneyTranferBox]}>
										<Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{toThousands(walletInfor.balance)}</Text>
										<TouchableOpacity
											style={styles.formatbalanceInfortBox} hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}>
											{
												walletCode == walletInfor.name ?
													<Image
														source={false ? require('./../../images/finance/transfer/formatbalanceInfortBox2.png') : require('./../../images/finance/transfer/formatbalanceInfortBox.png')}
														resizeMode='stretch'
														style={styles.formatbalanceInfortBoxImg}></Image>
													:
													<View
														style={styles.formatbalanceInfortBoxImg}></View>
											}
										</TouchableOpacity>
									</View>

								</View>

								<View style={[styles.guideBox]}>
									<View style={styles.inforBox}>
										<View style={[styles.guideInforWrap, styles.guideInforWrap1]}>
											<Text style={styles.guideInforText}>หรือใช้การโอนเงินตามปกติโดยใส่ยอดตามที่ต้องการ</Text>
										</View>
										<View style={[styles.arrowWrap, styles.arrowWrap1]}>
											<Text style={styles.line}>- -</Text>
											<View style={styles.arrow}></View>
										</View>
									</View>

									<View style={styles.inforBox}>
										<View style={[styles.guideInforWrap, styles.guideInforWrap1]}>
											<Text style={styles.guideInforText}>หากไม่มียอดคงเหลือในบัญชีสามารถทำการฝากเงินได้ที่นี่</Text>
										</View>
										<View style={[styles.arrowWrap, styles.arrowWrap1]}>
											<Text style={styles.line}>- -</Text>
											<View style={styles.arrow}></View>
										</View>
									</View>
								</View>

								<View style={[styles.tranferBtnBox, { marginTop: 40 }]}>
									<View
										style={[styles.tranferBtn, {
											borderColor: window.isBlue ? '#fff' : '#26A9E1',

										}]}>
										<Text style={[styles.tranferBtnText, { color: window.isBlue ? '#fff' : '#26A9E1' }]}>โอนเงิน</Text>
									</View>
									<View
										style={[styles.tranferBtn, { backgroundColor: '#26A9E1' }]}>
										<Text style={[styles.tranferBtnText, { color: '#FFFFFF' }]}>ฝากเงิน</Text>
									</View>
								</View>
							</View>


							<TouchableOpacity onPress={this.cancleGuide.bind(this)} style={styles.cancleBtn}>
								<Text style={styles.cancleBtnText}>เล่นเลย</Text>
							</TouchableOpacity>
						</View>
					}
				</View>
			}

			<Text style={{
				width: 0,
				height: 0,
				opacity: 0,
				fontSize: 0,
			}}>{gameKey1}</Text>

			{
				gameOpenUrl && <WebView
					onLoadStart={(e) => this.setState({ loadD: true })}
					onLoadEnd={(e) => this.setState({ loadD: false })}
					renderLoading={(e) => { }}
					source={{
						uri: gameOpenUrl
					}}
			        originWhitelist={['*']}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            mixedContentMode="always"
                            scalesPageToFit={false}
                          
                            allowsInlineMediaPlayback
                            mediaPlaybackRequiresUserAction={false}
                            allowFileAccess
					style={{ width: widthS, height: heightS, flex: 1 }}
					onNavigationStateChange={(even) => { }}
				/>
			}

			{
				<LoadIngWebViewGif
					top={gameHeaderPaddingTop + 40 + 5}
					loadStatus={loadD}
				/>
			}
			{
				// this.props.isFromSB && <BottomTabs currentTab={3} />
			}

		</View>
	}
}

export default GamePage = connect(
	(state) => {
		return {
			balanceInforData: state.balanceInforData,
			liveChatData: state.liveChatData
		}
	}, (dispatch) => {
		return {
			getBalanceInforAction: () => dispatch(getBalanceInforAction())
		}
	}
)(GamePageContainer)

const styles = StyleSheet.create({
	gameButtonBoxWrap: {
		width: 26,
		height: 26
	},
	gameButtonImg: {
		width: 26,
		height: 26
	},
	gameButtonBox: {
		flexDirection: 'row',
		marginRight: 10
	},
	gameButtonBoxWrap: {
		width: 26,
		height: 26
	},
	gameButtonImg: {
		width: 26,
		height: 26
	},
	homeCsWrap: {
		marginLeft: 6,
		height: 40,
		justifyContent: 'center'
	},
	homeCSImg: {
		width: 28,
		height: 28
	},
	headBackgroundBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 8,
		width,
	},
	gameBackImgBox: {
		marginRight: 4
	},
	gameBackImg: {
		width: 25,
		height: 25
	},
	headerLeft: {
		flexDirection: 'row',
		height: 40,
		alignItems: 'center'
	},
	hearRight: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	balanceLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	balanceLeftCircle: {
		width: 8,
		height: 8,
		borderRadius: 100,
		marginRight: 8
	},
	financeTypeWrap: {
		position: 'relative',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	financeTypeBox: {
		height: 40,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-around',
		width,
	},
	financeTypeLine: {
		height: 1,
		backgroundColor: '#00AEEF',
		position: 'absolute',
		bottom: 8,
		right: 0,
		left: 0
	},
	financeTypeText: {
		fontWeight: 'bold',
		fontSize: 10
	},
	walletBox: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 8,
		justifyContent: 'center',
		height: 40,
		overflow: 'hidden',
		borderRadius: 6,
		overflow: 'hidden',
	},
	walletLeftBox: {
		alignItems: 'flex-end',
		marginRight: 10
	},
	walletRightBoxText1: {
		color: '#58585B',
		fontWeight: 'bold',
		fontSize: 13
	},
	walletLeftBoxCircle: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 20,
		height: 20,
		borderWidth: 2,
		borderColor: '#58585B',
		borderRadius: 10,
		marginRight: 5
	},
	walletLeftBoxText1: {
		color: '#58585B',
		fontWeight: 'bold',
		lineHeight: 16,
		textAlign: 'center',
	},
	walletLeftBoxText2: {
		color: '#58585B',
		fontSize: 10,
		marginBottom: 2
	},
	WalletDropdownStyle: {
		transform: [{
			translateX: 48
		}],
		width,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
		marginTop: 2
	},
	WalletModalDropdownList: {
		height: 35,
		justifyContent: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	WalletModalDropdownList1: {
		backgroundColor: '#fff',
		borderRadius: 6,
	},
	walletSbIconBox: {
		marginLeft: 6
	},
	walletSbIcon: {
		width: 18,
		height: 18
	},
	walletSbTipbox: {
		backgroundColor: '#FFF4D0',
		borderWidth: 1,
		borderColor: '#EDE473',
		position: 'absolute',
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		left: ((width - 10) * .1) / 2,
		top: -60,
		borderRadius: 4,
		zIndex: 10,
		width: (width - 10) * .9,
		shadowColor: '#0000001A',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	walletSbTipboxText: {
		color: '#676767',
		fontSize: 12,
		flexWrap: 'wrap',
		width: (width - 10) * .9 - 40,
		lineHeight: 18
	},
	walletSbTipboxBtn: {
		marginLeft: 8
	},
	walletSbTipboxBtnText: {
		color: '#676767',
		fontSize: 16
	},
	walletSbTipArrow: {
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: 8,
		borderLeftColor: 'transparent',
		borderBottomColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: '#FFF4D0',
		position: 'absolute',
		left: width * .38,
		bottom: -15,
		shadowColor: '#0000001A',
		shadowRadius: 8,
		shadowOpacity: .1,
		shadowOffset: { width: 2, height: 2 },
		elevation: 10
	},
	tranferBtnBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 5,
		paddingBottom: 15,
	},
	tranferBtn: {
		height: 40,
		width: (width - 20) * .45,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 6,
		borderColor: '#26A9E1',
		borderWidth: 2
	},
	tranferBtnText: {
		fontSize: 13
	},
	formatbalanceInfortBox: {
		marginLeft: 14
	},
	formatbalanceInfortBoxImg: {
		width: 22,
		height: 22,
	},
	moneyTranferBox: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	bankerList: {

	},
	refreshImgBox: {
		flexDirection: 'row',
		justifyContent: 'center'
	},
	refreshImg: {
		width: 30,
		height: 30,
		marginLeft: 2
	},
	viewModalContainer: {
		width,
		height,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, .2)',
		position: 'relative'
	},
	viewModalBox: {
		backgroundColor: '#fff',
		overflow: 'hidden',
	},
	modalHeaderText: {
		color: '#26AAE2',
		fontSize: 18
	},
	modalHeaderBtn: {
		paddingHorizontal: 20,
		height: 44,
		justifyContent: 'center'
	},
	modalHeader: {
		height: 44,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: '#fff'
	},
	modalViewContainer: {
		width,
		height,
		position: 'absolute',
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		zIndex: 1000
	},
	modalViewContainer1: {},
	modalWrap: {
	},
	modalViewBox: {
		width: width * .9,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#EFEFEF',
		alignItems: 'center',
		paddingVertical: 40
	},
	phcTextBox: {
		width: 60,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 1000,
		backgroundColor: '#E2141C',
		marginBottom: 5
	},
	phcTextBoxText: {
		fontWeight: 'bold',
		fontSize: 30,
		color: '#fff'
	},
	noBankText1: {
		fontWeight: 'bold',
		fontSize: 16
	},
	modalBodyText: {
		color: '#262626',
		textAlign: 'center',
		paddingBottom: 20,
		paddingTop: 10,
		width: width * .65,
	},
	modalBtn: {
		height: 36,
		width: width * .8,
		backgroundColor: '#25AAE1',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalBtnText: {
		color: '#fff'
	},
	registIpkLoadFlag: {
		position: 'absolute',
		width,
		right: 0,
		top: 0,
		bottom: 0,
		top: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	modalGuideContainer: {
		width,
		height,
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, .7)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	guideBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	inforBox: {
		alignItems: 'center'
	},
	guideInforWrap: {
		borderRadius: 6,
		borderWidth: 1,
		borderStyle: 'dashed',
		borderColor: '#FFD23D',
		padding: 5,
		width: 140
	},
	guideInforWrap1: {
		width: (width - 20) * .45
	},
	guideInforText: {
		color: '#FFD23D',
		fontSize: 12
	},
	arrowWrap: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	arrowWrap1: {
		transform: [{
			rotate: '90deg',
		}],
		position: 'absolute',
		width: 40,
		bottom: -30
	},
	line: {
		color: '#FFD23D',
		marginLeft: 4
	},
	arrow: {
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: 6,
		borderLeftColor: '#FFD23D',
		borderBottomColor: 'transparent',
		borderRightColor: 'transparent',
		borderTopColor: 'transparent',
	},
	guideFinally: {
		position: 'absolute',
		width,
		paddingHorizontal: 10
	},
	cancleBtn: {
		backgroundColor: '#fff',
		width: 140,
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		position: 'absolute',
		bottom: Platform.OS == 'ios' ? height * .2 : height * .1
	},
	cancleBtnText: {
		fontWeight: 'bold',
		color: '#000'
	},
})