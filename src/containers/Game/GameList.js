import React from 'react'
import { ActivityIndicator, StyleSheet, TouchableHighlight, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, ScrollView, Modal, Alert } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { changeDepositTypeAction, getBalanceInforAction, changeHomeRegistLoginModalAction } from '../../actions/ReducerAction'
import LoadIngImgActivityIndicator from './../Common/LoadIngImgActivityIndicator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GameLockText, GameMaintenanceText } from './../Common/CommonData'
import Orientation from 'react-native-orientation-locker'
import { removeVendorToken } from '../SbSports/lib/js/util';
const { width, height } = Dimensions.get('window')
import { BlurView, VibrancyView } from "@react-native-community/blur";
import FastImage from "react-native-fast-image";
import moment from 'moment'
class GameListContainer extends React.Component {
	constructor(props) {
		super(props)
		let isMaintenance = false
		let gametype = this.props.data.code
		let tabIndex = this.props.gameTabsKey
		let tabDatas = this.props.data.subProviders
		let gametypeDetail = this.props.data.subProviders[tabIndex].code.toLocaleLowerCase()
		tabDatas.forEach(v => {
			v.title = (gametype.toLocaleUpperCase() == 'KENO' ? (v.name + ' ') : '') + v.productCode
		})
		// if (Array.isArray(tabDatas) && tabDatas.length) {
		// 	if (tabDatas.find(v => v.code === 'TGP_P2P')) {
		// 		isMaintenance = window.isSTcommon_url ? false : true
		// 	}
		// }

		this.state = {
			tabDatas,
			tabIndex,
			gametype,
			gametypeDetail: gametypeDetail,
			GameData: [],
			GameDataFilter: [],
			searchInputText: '',
			searchInputTextLower: '',
			inputBorderStatus: false,
			balanceInfor: [],
			gameKey: Math.round(Math.random() * 100),
			isBrowserOpen: false,
			tempBrowserItem: '',
			tempBrowserIsDemo: '',
			isRegisterPT: false,
			ipkName: '',
			isHaveipkNameModal: false,
			isHaveipkName: false,
			ipkErrTip: '',
			registIpkLoadFlag: false,
			isMaintenance,
			gameLoadObj: {},
			category: [],
			categoryTemp: [],
			recommendedGameList: [],
			isShowVtgFillter: false,
			filterArr: [
				{
					text: 'เกมส์ที่เล่นล่าสุด',//最近玩过的游戏
					id: '最近玩过的游戏'
				},
				{
					text: 'แนะนำ',//推荐游戏
					id: '推荐游戏'
				},
				// {
				// 	text: 'A-Z',
				// 	id: 'A-Z'
				// },
			],
			filterArrId: '',
			vtgTitle: '',
			isShowWalletGameModal: false,
			GameOpenUrl: '',
			gameHeadName: '',
			walletCode: ''
		}
	}

	componentDidMount() {
		this.getStorageGameList()
		let title = this.props.data.subProviders[this.props.gameTabsKey].name
		this.setState({
			vtgTitle: title.toLocaleUpperCase()
		})
		this.props.navigation.setParams({
			title: title.toLocaleUpperCase()
		})
	}


	componentWillUnmount() {
		this.setGif && clearInterval(this.setGif)
	}

	getStorageGameList() {
		const { gametype, gametypeDetail } = this.state
		if (gametype.toLocaleLowerCase() === 'p2p') {
			global.storage.load({
				key: 'GameDatdP2pIpk',
				id: 'GameDatdP2pIpk',
			}).then(data => {
				this.setState({
					GameDataFilter: data.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail),
					//GameData: data
				})
				this.getP2pIpkGame()
			}).catch(() => {
				this.getP2pIpkGame(true)
			})
		} else if (gametype.toLocaleLowerCase() === 'slot') {
			if (gametypeDetail == 'fishing') {
				global.storage.load({
					key: 'GameDatdFish',
					id: 'GameDatdFish',
				}).then(GameDataFilter => {
					//const GameDataFilter = data.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
					this.setState({
						GameDataFilter,
						//GameData: data,
					})
					this.getFish()
				}).catch(() => {
					this.getFish(true)
				})
			} else {
				global.storage.load({
					key: 'GameDatdSlot',
					id: 'GameDatdSlot',
				}).then(data => {
					const GameDataFilter = data.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
					this.setState({
						GameDataFilter,
						//GameData: data,
					})
					this.getSlot()
				}).catch(() => {
					this.getSlot(true)
				})
			}

		} else if (gametype.toLocaleLowerCase() == 'instantgames') {
			global.storage.load({
				key: 'GameDatainstantgames',
				id: 'GameDatainstantgames',
			}).then(data => {
				this.setState({
					GameDataFilter: data,
					//GameData: data,
				})
				this.getInstantGames()
			}).catch(() => {
				this.getInstantGames(true)
			})
		} else if (gametype.toLocaleLowerCase() === 'sportsbook') {
			global.storage.load({
				key: 'GameDatdSportsbook',
				id: 'GameDatdSportsbook',
			}).then(data => {
				const GameDataFilter = data.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
				this.setState({
					GameDataFilter,
					//GameData: data,
				})
				this.getSport()
			}).catch(() => {
				this.getSport(true)
			})

			this.getSportsbookCategories()
			this.getRecommendedGameList()
		} else if (gametype.toLocaleLowerCase() === 'keno') {
			global.storage.load({
				key: 'GameDatd' + gametype,
				id: 'GameDatd' + gametype
			}).then(data => {
				this.setState({
					GameDataFilter: data.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail),
					//GameData: data
				})
				this.getGameList()
			}).catch(() => {
				this.getGameList(true)
			})
		}
	}



	getSport(flag) {
		let { gametypeDetail, gametype } = this.state
		flag && Toast.loading('กำลังโหลดข้อมูล...', 200000)
		//, 'instantgames'
		let requests = ['mobilesportsbook'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {
			Toast.hide()

			let GameData = res[0].filter(v => v.provider == "VTG")
			this.setState({
				GameData,
				GameDataFilter: GameData
			})
			global.storage.save({
				key: 'GameDatdSportsbook',
				id: 'GameDatdSportsbook',
				data: GameData,
				expires: null
			})
		})
	}

	getInstantGames(flag) {
		let { gametypeDetail, gametype } = this.state
		flag && Toast.loading('กำลังโหลดข้อมูล...', 200000)
		//, 'instantgames'
		let requests = ['mobileinstantgames'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {
			Toast.hide()

			let GameData = res[0]
			this.setState({
				//GameData,
				GameDataFilter: GameData
			})
			global.storage.save({
				key: 'GameDatainstantgames',
				id: 'GameDatainstantgames',
				data: GameData,
				expires: null
			})
		})
	}

	getSportsbookCategories() {
		global.storage.load({
			key: 'category',
			id: 'category'
		}).then(category => {
			this.setState({
				category
			})
		}).catch(() => { })

		fetchRequest(ApiPort.Game + 'Sportsbook/Categories?', 'GET').then(res => {
			if (Array.isArray(res) && res.length) {
				let result = res
				let tempArr = result.map(v => v.categoryTitle)
				let categoryTitle = [...new Set(tempArr)]
				let category = categoryTitle.map(v => {
					let tempV = result.filter(v1 => v1.categoryTitle === v)
					return {
						title: v,
						obj: tempV
					}
				})
				this.setState({
					category,
					categoryTemp: [...result,
						// {
						// 	category: "IsRecommendedGames",
						// 	categoryTitle: "Trò Chơi Đề Xuất",
						// 	name: "Bóng Đá"
						// }
					]
				})

				global.storage.save({
					key: 'category',
					id: 'category',
					data: category,
					expires: null
				})
			}
		}).catch(() => {
			Toast.hide()
		})


	}

	getRecommendedGameList() {
		if (!ApiPort.UserLogin) return
		fetchRequest(ApiPort.RecommendedGameList, 'GET').then(res => {
			if (res.isSuccess && Array.isArray(res.gameList) && res.gameList.length) {
				this.setState({//最近玩过的游戏
					recommendedGameList: res.gameList.filter(v => v.providerCode.toLocaleUpperCase() === 'VTG')
				})
			}
		}).catch(() => {
			Toast.hide()
		})
	}


	getFish(flag) {
		let { gametypeDetail, gametype } = this.state
		flag && Toast.loading('กำลังโหลดข้อมูล...', 200000)
		let requests = ['mobilefishing'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {
			Toast.hide()
			let GameDataFilter = res[0]
			//let GameDataFilter = GameData.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
			this.setState({
				//GameData,
				GameDataFilter,
			})
			global.storage.save({
				key: 'GameDatdFish',
				id: 'GameDatdFish',
				data: GameDataFilter,
				expires: null
			})
		})
	}

	getSlot(flag) {
		let { gametypeDetail, gametype } = this.state
		flag && Toast.loading('กำลังโหลดข้อมูล...', 200000)
		let requests = ['mobileslot'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {
			Toast.hide()
			let GameData = res[0]
			let GameDataFilter = GameData.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
			this.setState({
				//GameData,
				GameDataFilter,
			})
			global.storage.save({
				key: 'GameDatdSlot',
				id: 'GameDatdSlot',
				data: GameData,
				expires: null
			})
		})
	}

	getP2pIpkGame(flag) {
		let { gametypeDetail, gametype } = this.state
		flag && Toast.loading('กำลังโหลดข้อมูล...', 200000)
		let requests = ['mobilep2p'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {
			Toast.hide()
			let GameData = res[0]
			let GameDataFilter = GameData.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
			this.setState({
				//GameData,
				GameDataFilter
			})
			global.storage.save({
				key: 'GameDatdP2pIpk',
				id: 'GameDatdP2pIpk',
				data: GameData,
				expires: null
			})
		})
	}


	//请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
	getGameList(flag) {
		let { gametypeDetail, gametype } = this.state
		flag && Toast.loading('กำลังโหลดข้อมูล...', 200000)
		let requests = ['mobilekenolottery'].map(v => fetchRequest(ApiPort.Game + '?gametype=' + v + '&', 'GET'))
		Promise.all(requests).then(res => {
			Toast.hide()
			let GameData = res[0]
			let GameDataFilter = GameData.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
			this.setState({
				//GameData,
				GameDataFilter
			})
			global.storage.save({
				key: 'GameDatdKeno',
				id: 'GameDatdKeno',
				data: GameData,
				expires: null
			})
		})
	}

	async startGame(item, isDemo) {
		let provider = item.provider ? item.provider : item.providerCode
		if (provider) {
			provider.toLocaleUpperCase() === 'VTG' && window.PiwikMenberCode('Game​', 'Launch', `${item.gameName}_V2GVirtualSports​`)
			provider.toLocaleUpperCase() === 'SPR' && window.PiwikMenberCode('Game​', 'Launch', `${item.gameName}_Spribe_InstantGames`)
		}

		if (this.props.data) {
			if (this.props.data.code == "Slot") {
				window.PiwikMenberCode('Game​', 'Launch', `${item.gameName}_${provider}_Slots`)
			} else if (this.props.data.code == "P2P") {
				window.PiwikMenberCode('Game​', 'Launch', `${item.gameName}_${provider}`)
			}
		}


		if (!ApiPort.UserLogin) {
			this.props.changeHomeRegistLoginModalAction({
				flag: true,
				page: 'game'
			})
			return
		}


		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableBetting && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}

		if (isGameLock) {
			Toast.fail(GameLockText, 2)
			// Toast.fail('游戏访问限制' , 2)
			return
		}

		if (window.getCDUActivateStatus) {
			let getCDUActivateStatus = await window.getCDUActivateStatus()
			if (getCDUActivateStatus != 'open') return
		}



		Toast.loading('กำลังเริ่มเกม...', 2000)
		this.playGame(item, isDemo)
	}

	getSpecialFishWallet(gametype) {
		let walletCodeMapping = this.props.walletCodeMapping
		if (walletCodeMapping) {
			for (let key in walletCodeMapping) {
				let tempArr = walletCodeMapping[key]
				let flag = tempArr.some(v => v.toLocaleLowerCase() == gametype.toLocaleLowerCase())
				if (flag) {
					return key
				}
			}
		}
	}

	//请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
	playGame(item, isDemo) {
		const { tabIndex, tabDatas, gametypeDetail } = this.state
		let gameHeadName = this.state.gametypeDetail == "vtg" ? this.state.vtgTitle : tabDatas[tabIndex].title
		let gameid = item.gameId ? item.gameId : item.gameID
		let gametype = item.provider ? item.provider : item.providerCode

		let data = {
			'token': ApiPort.Token.split(' ')[1],
			'provider': gametype,
			//'gameCode': 0,
			'hostName': common_url,
			'productCode': gametype,
			'platform': 'Mobile',
			'mobileLobbyUrl': common_url,
			'sportsMenu': '',
			'bankingUrl': common_url,
			'logoutUrl': common_url + '/accessdenied',
			'supportUrl': common_url,
			Environment: 'development',
			GameCode: '0',
			"SportsMenu": "1,0,t",
			isDemo: isDemo,
			gameId: gameid
		}

		//處理sb2.0遊戲token (開官方網頁版，會刷掉先前獲取的token)
		// const codeToSportMapping = { 'IPSB': 'im', 'OWS': 'saba', 'SBT': 'bti' };
		// const targetSport = codeToSportMapping[gametype.toUpperCase()];
		// if (targetSport) {
		// 	removeVendorToken(targetSport);
		// }

		//if ((gametype + '').toLocaleUpperCase() == 'VTG') {
		this.setRecentPlayedGame(gameid)
		//}
		// Toast.loading('กำลังเริ่มเกม...', 2000)
		// Toast.loading('正在启动游戏,请稍候...',200)
		fetchRequest(ApiPort.Game + gameid + '?isDemo=' + isDemo + '&gameId=' + gameid + '&', 'POST', data).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				let data = res
				if (data.errorCode == 2001) {
					Toast.fail(GameLockText, 2)
					return
				}
				if (data.isGameMaintenance) {
					Toast.fail(GameMaintenanceText, 2)
					return
				}
				let lobbyUrl = data.gameLobbyUrl
				if (lobbyUrl.length) {

					let walletCode = ''
					if (gametypeDetail == "fishing") {
						walletCode = this.getSpecialFishWallet(gametype)
					} else {
						walletCode = this.props.data.subProviders[tabIndex].walletCode
					}


					if (walletCode) {
						this.setState({
							walletCode
						})

						let walletInfor = this.props.balanceInforData.find(v => v.name == walletCode) || {
							localizedName: '',
							balance: 0
						}

						//if (walletInfor.balance <= 0) {
						// this.setState({
						// 	GameOpenUrl: data.lobbyUrl,
						// 	gametype,
						// 	gameHeadName: gameHeadName,
						// 	walletCode: walletCode,
						// 	walletInforBalance: walletInfor.balance
						// })

						// } else {

						// if (!(Array.isArray(this.props.balanceInforData) && this.props.balanceInforData.length > 0)) return
						// if (gametype == 'JKR_SLOT' && Platform.OS == 'ios') {
						// 	Linking.openURL(data.gameLobbyUrl)
						// 	return
						// }
						Actions.GamePage({
							GameOpenUrl: data.gameLobbyUrl,
							gametype,
							gameHeadName: gameHeadName,
							walletCode,
							walletInforBalance: walletInfor.balance
						})
						// }
					}
				}
			}

			if ((gametype + '').toLocaleUpperCase() == 'VTG') {
				this.getRecommendedGameList()
			}
		}).catch(() => {
			Toast.hide()
		})
	}

	createRenderRow(data) {
		const { gametype, gametypeDetail, categoryTemp, filterArrId } = this.state
		let item = data.item
		let categoryTitle = ''
		if (gametypeDetail == 'vtg' && Array.isArray(categoryTemp) && categoryTemp.length) {
			let vtgTempData = item.categories?.filter(v => !["AllGames", "IsRecommendedGames"].includes(v.categoryName))
			if (Array.isArray(vtgTempData) && vtgTempData.length) {
				let vtgName = vtgTempData[0]?.categoryName
				let temp = categoryTemp.find(v => v.category == vtgName)
				if (temp) {
					categoryTitle = temp.name
				}
			} else if (filterArrId == '最近玩过的游戏') {//最近玩过的游戏
				categoryTitle = item.lastGamePlayed
			}
		}

		return <View
			key={data.index}
			style={[styles.gamesWrap, {
				borderBottomWidth: 1,
				borderColor: '#B7B7B7',
				marginHorizontal: 10,
				paddingBottom: 8
			}]}>
			<View style={styles.leftItem}>
				<Image
					style={styles.leftItem}
					resizeMode='stretch'
					source={{ uri: item.imageUrl ? item.imageUrl : item.imagePath }}
					// onLoadStart={this.getLoadImgStatus.bind(this, data.index, false)}
					// onLoadEnd={this.getLoadImgStatus.bind(this, data.index, true)}
					defaultSource={window.isBlue ? require('./../../images/common/loadIcon/loadinglight.jpg') : require('./../../images/common/loadIcon/loadingdark.jpg')}
				/>
				{
					//!this.state.gameLoadObj[`imgStatus${data.index}`] && <LoadIngImgActivityIndicator />
				}
			</View>

			<View style={styles.rightItem}>
				<View style={styles.topTextWrap}>
					<Text style={[styles.topText1, { color: window.isBlue ? '#000' : '#fff', width: 120 }]}>{item.lastGamePlayed ? item.lastGamePlayed : item.gameName}</Text>
					{
						gametypeDetail == 'vtg' ? <Text style={[styles.topText1, { color: window.isBlue ? '#000' : '#fff', fontSize: 12 }]}>
							<Text style={[styles.topText2, { color: '#000' }]}>เกมแข่งม้า <Text style={{ color: '#24ABE1' }}>V2</Text></Text>
						</Text>
							:
							<Text style={styles.topText2}>{this.state.vtgTitle}</Text>
					}
				</View>

				{
					(gametypeDetail == 'vtg' || gametypeDetail == 'spr')
						?
						<View style={styles.bottomTextWrap}>
							<TouchableOpacity style={[styles.bottomTextWrap2, styles.bottomTextCommon, { backgroundColor: '#DEE3E1' }]} onPress={this.startGame.bind(this, item, false)}>
								<Text style={styles.bottomText2}>เล่นเลย</Text>
							</TouchableOpacity>
						</View>
						:
						<View style={styles.bottomTextWrap}>
							<TouchableOpacity style={[
								styles.bottomTextCommon,
								{ backgroundColor: window.isBlue ? '#DEE3E1' : '#1d1d1d' }]} onPress={this.startGame.bind(this, item, false)}>
								<Text style={styles.bottomText1}>เล่นเลย</Text>
							</TouchableOpacity>
							{
								item.isDemoAvailable && <TouchableOpacity
									style={[styles.bottomTextWrap2, styles.bottomTextCommon, {
										backgroundColor: '#F3F4F8',
										marginTop: 6,
									}]}

									onPress={this.startGame.bind(this, item, true)}>
									<Text style={styles.bottomText2}>เกมส์ฟรี</Text>
								</TouchableOpacity>
							}
						</View>
				}
			</View>
		</View>
	}

	changeInputText(searchInputText) {
		this.setState({
			searchInputText: searchInputText.trim(),
			searchInputTextLower: searchInputText.trim().toLowerCase()
		})
	}

	clearFillter() {
		this.state.category.forEach(v => {
			v.obj.forEach(v2 => {
				v2.flag = false
			})
		})
		this.setState({
			filterArrId: ''
		})
	}

	setRecentPlayedGame(id) {
		fetchRequest(ApiPort.SetRecentPlayedGame + 'gameId=' + id + '&', 'POST').then(res => {
			this.props.getRecommendedGameList && this.props.getRecommendedGameList()
		}).catch(() => {
			Toast.hide()
		})
	}

	searchGame() {
		const { searchInputTextLower, GameDataFilter, GameData, gametypeDetail, filterArrId, recommendedGameList } = this.state
		if (gametypeDetail == "vtg") {
			let GameDataFilter = []
			if (filterArrId == '最近玩过的游戏') {//最近玩过的游戏
				GameDataFilter = recommendedGameList
			} else if (filterArrId == '推荐游戏') {//推荐游戏
				GameDataFilter = GameData?.filter(v => (v.categories?.map(v2 => v2.categoryName))?.includes('IsRecommendedGames'))
			} else if (filterArrId == 'A-Z') {//a-z
				GameDataFilter = GameData.sort((a, b) => a.gameName.localeCompare(b.gameName))
			} else {
				GameDataFilter = GameData
			}
			if (searchInputTextLower.length) {
				GameDataFilter = GameDataFilter?.filter(v => (v.lastGamePlayed ? v.lastGamePlayed : v.gameName).toLocaleLowerCase()?.includes(searchInputTextLower))
			}


			const { category } = this.state
			let tempArr = category.reduce((arr, v) => arr.concat(v.obj), [])?.filter(v => v.flag)
			let categoryArr = tempArr?.map(v => v.category)
			if (categoryArr.length) {
				GameDataFilter = GameDataFilter?.filter(v => v.categories)
					?.filter(v => {
						return v.categories?.filter(v2 => {
							return categoryArr?.includes(v2.categoryName)
						}).length > 0
					})

			}


			this.setState({
				isShowVtgFillter: false,
				GameDataFilter
			})
		} else {
			if (searchInputTextLower.length) {
				let tempGameDataFilter = GameDataFilter.filter(v => v.gameName.toLocaleLowerCase().includes(searchInputTextLower))
				this.setState({
					GameDataFilter: tempGameDataFilter
				})
			} else {
				this.setState({
					GameDataFilter: GameData.filter(v => v.provider.toLocaleLowerCase() === gametypeDetail)
				})
			}
		}
	}

	changeInputBorder(flag) {
		this.setState({
			inputBorderStatus: flag
		})
	}



	getLoadImgStatus(i, flag) {
		this.state.gameLoadObj[`imgStatus${i}`] = flag
		this.setState({})
	}

	render() {
		const { isShowWalletGameModal, category, filterArrId, GameData, filterArr, isShowVtgFillter, gametypeDetail, registIpkLoadFlag, ipkErrTip, isHaveipkNameModal, ipkName, isBrowserOpen, searchInputText, inputBorderStatus, GameDataFilter, tabDatas, tabIndex, gameKey } = this.state
		const placeholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : 'rgba(255, 255, 255, .4)'
		return <View style={[styles.viewPage, { backgroundColor: window.isBlue ? '#F3F4F8' : '#0f0f0f' }]}>
			<Modal transparent={true} visible={isShowVtgFillter} animationType='fade'>
				<TouchableHighlight onPress={() => {
					this.setState({
						isShowVtgFillter: false
					})
				}}>
					{
						Platform.OS === 'ios' ?
							<VibrancyView
								blurAmount={4}
								reducedTransparencyFallbackColor="white"
								blurType="light"
								style={[styles.modalContainer, { alignItems: 'flex-end', }]}>
							</VibrancyView>
							:
							<View style={[styles.modalContainer, { alignItems: 'flex-end', }]}></View>
					}
				</TouchableHighlight>

				<View
					style={[styles.vtnFilterBoday, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
					<View>
						<View>
							<View style={[styles.textHeaderBox]}>
								<Text style={[styles.textHeader, {
									color: window.isBlue ? '#232938' : '#7F7F7F'
								}]}>ตัวกรองค้นหาเกม</Text>
							</View>

							<View style={[styles.filterContaienr, {
								borderBottomColor: window.isBlue ? '#DADADD' : '#4E4E4E',
								borderTopColor: window.isBlue ? '#DADADD' : '#4E4E4E',
							}]}>
								<Text style={[styles.filtterH2, { color: window.isBlue ? '#232938' : '#FFFFFF' }]}>เรียงลำดับตาม</Text>
								<View>
									<ScrollView horizontal={true}
										automaticallyAdjustContentInsets={false}
										showsHorizontalScrollIndicator={false}
										showsVerticalScrollIndicator={false}
										contentContainerStyle={[styles.filterBox, {
											borderBottomColor: window.isBlue ? '#DADADD' : '#4E4E4E'
										}]}
									>
										{
											filterArr.map((v, i) => {
												let flag = v.id == filterArrId
												return <TouchableOpacity
													onPress={() => {
														this.setState({
															filterArrId: v.id
														})
													}}
													style={[
														styles.filterList,
														styles[`filterList${i}`],
														{
															backgroundColor: window.isBlue ? (flag ? '#02D75B' : '#FFFFFF') : (flag ? '#02D75B' : '#212121'),
															borderColor: window.isBlue ? (flag ? '#02D75B' : '#DADADD') : (flag ? '#02D75B' : '#7F7F7F'),
														}
													]}
													key={i}>
													<Text style={[
														styles.filterListText,
														{
															color: window.isBlue ? (flag ? '#FFFFFF' : '#7B7F87') : (flag ? '#FFFFFF' : '#7B7F87')
														}
													]}>{v.text}</Text>
												</TouchableOpacity>
											})
										}
									</ScrollView>
								</View>
							</View>


							<View style={[styles.textHeaderBox]}>
								<Text style={[styles.textHeader, {
									color: window.isBlue ? '#232938' : '#7F7F7F'
								}]}>ประเภทเกม</Text>
							</View>
							{
								Array.isArray(category) && category.length > 0 && category.map((v, i) => <View
									key={i}
									style={[styles.filterContaienr, {
										borderBottomColor: window.isBlue ? '#DADADD' : '#4E4E4E',
										borderTopColor: window.isBlue ? '#DADADD' : '#4E4E4E',
										borderBottomWidth: 0,
										borderTopWidth: 0,
										paddingTop: 0,
									}]}>
									<Text style={[styles.filtterH2, { color: window.isBlue ? '#232938' : '#FFFFFF' }]}>{v.title}</Text>
									<View >
										<ScrollView horizontal={true}
											automaticallyAdjustContentInsets={false}
											showsHorizontalScrollIndicator={false}
											showsVerticalScrollIndicator={false}
											contentContainerStyle={[styles.filterBox, {
												borderBottomColor: window.isBlue ? '#DADADD' : '#4E4E4E'
											}]}
										>
											{
												v.obj.map((v1, i1) => {
													let flag = v1.flag
													return <TouchableOpacity
														onPress={() => {
															v1.flag = !v1.flag
															this.setState({})
														}}
														style={[
															styles.filterList,
															{
																backgroundColor: window.isBlue ? (flag ? '#02D75B' : '#FFFFFF') : (flag ? '#02D75B' : '#212121'),
																borderColor: window.isBlue ? (flag ? '#02D75B' : '#DADADD') : (flag ? '#02D75B' : '#7F7F7F'),
															}
														]}
														key={i1}>
														<Text style={[
															styles.filterListText,
															{
																color: window.isBlue ? (flag ? '#FFFFFF' : '#7B7F87') : (flag ? '#FFFFFF' : '#7B7F87')
															}
														]}>{v1.name}</Text>
													</TouchableOpacity>
												})
											}
										</ScrollView>

									</View>
								</View>)
							}
						</View>


						<View style={styles.vtnmodalBtnWrap}>
							<TouchableOpacity
								onPress={this.clearFillter.bind(this)}
								style={[styles.modalBtnWrapBtn, styles.modalBtnWrapBtn1, {
									borderColor: window.isBlue ? '#808080' : '#7F7F7F'
								}]}>
								<Text style={[styles.modalBtnWrapBtnText, styles.modalBtnWrapBtnText1]}>ยกเลิก</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={this.searchGame.bind(this)}
								style={[styles.modalBtnWrapBtn, styles.modalBtnWrapBtn2]}>
								<Text style={[styles.modalBtnWrapBtnText, styles.modalBtnWrapBtnText2]}>ใช้ตัวกรอง</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{
				gametypeDetail == "vtg"
					?
					<View style={[styles.inputBox, styles.inputBox1, { backgroundColor: window.isBlue ? '#00AEEF' : '#212121' }]}>
						<TextInput
							style={[styles.inputWrap, styles.inputWrap1, { borderColor: window.isBlue ? '#009CD7' : '#0F0F0F', color: window.isBlue ? '#000' : '#fff', backgroundColor: window.isBlue ? '#fff' : '#0A0A0A' }, styles[`input${inputBorderStatus}`]]}
							placeholder='ใส่คำค้นหา'
							placeholderTextColor={placeholderTextColor}
							value={searchInputText}
							onChangeText={this.changeInputText.bind(this)}
							onFocus={this.changeInputBorder.bind(this, 'Focus')}
							onBlur={this.changeInputBorder.bind(this, 'Blur')}
						/>
						<TouchableOpacity style={[styles.inputImageWrap, styles.inputImageWrap1]} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} onPress={this.searchGame.bind(this)}>
							<Image resizeMode='stretch' style={[styles.inputImage, styles.inputImage1]} source={require('./../../images/game/searchgame.png')} ></Image>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								if (!ApiPort.UserLogin) {
									this.props.changeHomeRegistLoginModalAction({
										flag: true,
										page: 'game'
									})
									return
								}
								this.setState({
									isShowVtgFillter: true
								})
							}}
							style={[styles.vtgFilter]}>
							<Image resizeMode='stretch' style={[styles.filter1]} source={
								window.isBlue ?
									require('./../../images/game/filter1.png')
									:
									require('./../../images/game/filter2.png')
							} ></Image>
						</TouchableOpacity>
					</View>
					:
					null

			}

			{
				gametypeDetail == "vtg" &&
				<View style={[styles.JackpotBox]}>
					<FastImage
						style={[styles.Jackpot]}
						source={require('./../../images/game/Animated_Jackpot-BG-Mobile.gif')}
						resizeMode='stretch'
					/>
				</View>
			}


			{
				<View style={{ flex: 1, marginTop: this.state.gametype.toLocaleLowerCase() === 'sportsbook' ? 0 : 20 }}>
					<ScrollView
						automaticallyAdjustContentInsets={false}
						showsHorizontalScrollIndicator={false}
						showsVerticalScrollIndicator={false}>
						{
							GameDataFilter.length > 0 ? <FlatList
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								automaticallyAdjustContentInsets={false}
								numColumns={1}
								enableEmptySections={true}
								onEndReachedThreshold={0.1}
								keyExtractor={(item, index) => item.key = index}
								data={GameDataFilter}
								extraData={gameKey}
								renderItem={this.createRenderRow.bind(this)}
							/> : <Text style={{ color: window.isBlue ? '#000' : '#fff', textAlign: 'center', marginTop: 150 }}>ไม่พบข้อมูล</Text>
						}
					</ScrollView>
				</View>
			}
		</View>
	}
}

export default GameList = connect(
	(state) => {
		return {
			selfExclusionsData: state.selfExclusionsData,
			balanceInforData: state.balanceInforData,
		}
	}, (dispatch) => {
		return {
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data))
		}
	}
)(GameListContainer)

const styles = StyleSheet.create({
	viewPage: {
		flex: 1
	},
	modalBtnWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderTopWidth: 1,
		borderTopColor: '#D0CDCD'
	},
	boclkInforText: {
		fontWeight: 'bold',
		marginBottom: 5,
		marginTop: 15
	},
	modalPokerFooterText1: {
		textAlign: 'center',
		fontSize: 12,
		color: '#262626',
		marginTop: 15,
		marginBottom: 10
	},
	ipkErrTip: {
		marginBottom: 10,
		color: 'red',
		textAlign: 'center',
		fontSize: 12
	},
	modalPokerFooterBox: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	modalPokerFooterBox1: {
		width: (.8 * width - 20) / 2.1,
		height: 36,
		backgroundColor: '#25AAE1',
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalPokerFooterBoxText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	inputBase: {
		height: 40,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: 5,
		paddingLeft: 15,
		borderColor: '#B7B7B7',
	},
	modalBtn: {
		width: .4 * width,
		height: 46,
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalBtnText: {
		color: '#008AEF',
		fontWeight: 'bold'
	},
	modalBtn1: {
		borderRightWidth: 1,
		borderRightColor: '#D0CDCD'
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
		width: .8 * width,
		overflow: 'hidden',
		borderRadius: 6,
		backgroundColor: '#fff',
		position: 'relative'
	},
	modalBtn2: {
		backgroundColor: '#25AAE1',
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
		width: .9 * width - 30,
		marginTop: 30,
		marginBottom: 20
	},
	modalBtnText2: {
		color: '#FFFFFF',
		fontSize: 16
	},
	registIpkLoadFlag: {
		position: 'absolute',
		width: .8 * width,
		right: 0,
		top: 0,
		bottom: 0,
		top: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0, 0, 0, .6)'
	},
	modalPokerHead: {
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#25AAE1'
	},
	modalPokerHeadText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	modalPokerBody: {
		paddingHorizontal: 10,
		paddingVertical: 15
	},
	modalPokerBodyText1: {
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#262626',
	},
	modalPokerBodyText2: {
		textAlign: 'center',
		color: '#262626',
		fontSize: 12
	},
	modalBodyText: {
		textAlign: 'center',
		paddingVertical: 25,
		paddingHorizontal: 15,
		alignItems: 'center'
	},
	gameUnfinishListBtn: {
		backgroundColor: '#25AAE1',
		borderRadius: 4,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		width: 120
	},
	gameUnfinishListText: {
		color: '#FFFFFF',
		fontSize: 16
	},
	gameUnfinishListImgBtn: {
		borderRadius: 5,
		overflow: 'hidden'
	},
	gameUnfinishListImg: {
		width: (.9 * width - 30 - 120) * .9,
		height: (.9 * width - 30 - 120 * .9) * .48
	},
	bettingWraps: {
		flexDirection: 'row',
		marginBottom: 5
	},
	bettingBox: {
		height: 46,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 2
	},
	bettingWrapsText: {
		textAlign: 'center'
	},
	tabBarText: {
		fontSize: 12,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	inputBox: {
		position: 'relative',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 7,
		paddingBottom: 7,
		justifyContent: 'center'
	},
	inputBox1: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	inputWrap: {
		borderRadius: 4,
		borderWidth: 1,
		borderStyle: 'solid',
		height: 40,
		paddingLeft: 8,
		color: '#fff',
		fontSize: 12,
		justifyContent: 'center',
		zIndex: 10,
		paddingRight: 50
	},
	inputWrap1: {
		paddingLeft: 40,
		width: width - 75
	},
	inputImageWrap: {
		position: 'absolute',
		right: 22,
		width: 26,
		height: 24,
		zIndex: 10
	},
	inputImageWrap1: {
		left: 22
	},
	vtgFilter: {
		height: 40,
		width: 40,
		borderRadius: 10000,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	filter1: {
		height: 40,
		width: 40,
	},
	inputImage1: {
		transform: [
			{
				rotate: '270deg'
			}
		]
	},
	inputImage: {
		width: 24,
		height: 24
	},
	gamesWrap: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		marginBottom: 20,
		justifyContent: 'space-between',
	},
	leftItem: {
		borderRadius: 4,
		width: (width - 20) * .4,
		height: width * .27,
		overflow: 'hidden'
	},
	rightItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: (width - 20) * .58,
	},
	topTextWrap: {
		marginLeft: 6
	},
	topText1: {
		fontWeight: 'bold'
	},
	topText2: {
		color: '#00AEEF'
	},
	bottomTextWrap: {

		justifyContent: 'flex-end',
	},
	bottomTextWrap1: {
		borderWidth: 1,
		backgroundColor: '#DEE3E1'
	},
	bottomText1: {
		color: '#18C36E',
		fontWeight: 'bold',
	},
	bottomTextWrap2: {
		backgroundColor: '#00D85B',
	},
	bottomTextCommon: {
		borderColor: '#00AEEF',
		alignItems: 'center',
		justifyContent: 'center',
		height: 26,
		borderRadius: 6,
		width: 80,
		borderRadius: 100000
	},
	bottomText2: {
		color: '#18C36E',
		fontWeight: 'bold',
	},
	vtnFilterBoday: {
		width,
		//height: height * .7,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		paddingTop: 10,
		paddingHorizontal: 15,
		paddingBottom: 50,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 100000
	},
	vtnmodalBtnWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 25
	},
	modalBtnWrapBtn: {
		height: 40,
		width: (width - 30) / 2.05,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 6,
		position: 'relative',
		zIndex: 1000000
	},
	modalBtnWrapBtn1: {
		borderWidth: 1
	},
	modalBtnWrapBtn2: {
		backgroundColor: '#24ABE1'
	},
	modalBtnWrapBtnText: {
		fontWeight: 'bold'
	},
	modalBtnWrapBtnText1: {
		color: '#808080'
	},
	modalBtnWrapBtnText2: {
		color: '#fff'
	},
	textHeader: {
		fontSize: 19,
		fontWeight: 'bold',
	},
	textHeaderBox: {
		justifyContent: 'center',
		height: 50,
	},
	filterBox: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
	},
	filterList: {
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 1,
		borderRadius: 10000,
		borderWidth: 1,
		marginRight: 8,
		paddingHorizontal: 8,
		position: 'relative',
		zIndex: 100000
	},
	filterList2: {
		paddingHorizontal: 20
	},
	filterListText: {
		fontSize: 13
	},
	filtterH2: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	filterContaienr: {
		borderBottomWidth: 1,
		borderTopWidth: 1,
		paddingTop: 20,
		paddingBottom: 14
	},
	JackpotBox: {
		width: width - 20,
		height: 0.32 * (width - 20),
		borderRadius: 12,
		marginTop: 10,
		overflow: 'hidden',
		marginBottom: 15,
		marginHorizontal: 10
	},
	Jackpot: {
		width: width - 20,
		height: 0.32 * (width - 20),
		position: 'absolute'
	},
	Jackpot1: {

	},
	Jackpot2: {}
})
