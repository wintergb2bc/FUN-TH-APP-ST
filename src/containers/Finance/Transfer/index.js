import React from 'react'
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Dimensions, Modal, ScrollView, Linking } from 'react-native'
import { connect } from 'react-redux'
import Toast from '@/containers/Toast'
import ModalDropdown from 'react-native-modal-dropdown'
import { Actions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { getBalanceInforAction, changeDepositTypeAction, changeBonusTurnOverInfor, getPromotionListInforAction } from '../../../actions/ReducerAction'
import { getDoubleNum, GetOnlyNumReg, toThousands } from '../../../actions/Reg'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'
import LoadingBone from './../../Common/LoadingBone'
import { ACTION_UserInfo_getBalanceAll } from '../../SbSports/lib/redux/actions/UserInfoAction';
import { GameLockText, GameMaintenanceText } from './../../Common/CommonData'
import { removeVendorToken } from '../../SbSports/lib/js/util';
const { width, height } = Dimensions.get('window')
const TranferPiwikMenberText = {
	MAIN: 'Main_transfer',
	SBT: 'FUN_sports_transfer',
	SP: 'OW_sports_transfer',
	IPSB: 'IM_sports_transfer',
	CMD: 'CMD_sports_transfer',
	SB: 'FUN_esports_transfer',
	LD: 'Live_transfer',
	AG: 'AG_transfer',
	SLOT: 'Slot_transfer',
	PT: 'PT_slot_transfer',
	IMOPT: 'IMOPT_slot_transfer',
	P2P: 'Gameviet_3Dcasino_transfer',
	IPK: 'Poker_3Dcasino_transfer',
	KENO: 'Transfer_ LotteryFun88/SGW',
	SLC: 'SLC_lottery_transfer'
}
class transferContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			money: '',
			moneyFlag: false,
			balanceInfor: [],
			balanceDoubleInfor: [],
			fromWalletIndex: 0,
			toWalletIndex: 0,
			totalWalletBouns: [],
			walletBouns: [],
			walletBounsIndex: -999,
			bonusTurnOverInfor: {},
			isGetBonusTurnOverInfor: 0,

			fromBalanceInfor: [],
			toBalanceInfor: [],
			tranferMoneyFlag: false,
			minAccept: 0,
			arrowFlag1: false,
			arrowFlag2: false,
			arrowFlag3: false,
			isShowModal: false,
			tempBoneList: '',
			isShowunfinishedGames: false,
			unfinishedGames: '',
			unfinishedGamesMessages: '',
			walletCode: this.props.walletCode,

			TotalBal: 0,
			MAIN: 0,
			isTransferSuccess: false,
			isShowRdDepositModal: false,
			isShowInforView: true,



			isShowTranferBonsModal: false,
			isMoneyClock: false,
			transferFlag: false
		}
	}

	componentDidMount() {
		// this.listGetBouns = DeviceEventEmitter.addListener('listGetBouns', PreferWallet => {
		// 	this.getbalanceIDoublenfor(this.props.balanceInforData, PreferWallet, true)
		// })
		window.isGamePageToFiance && window.openOrientation && window.openOrientation()
		let PreferWallet = this.props.memberInforData.PreferWallet
		this.getbalanceIDoublenfor(this.props.balanceInforData, PreferWallet, true)
		this.getMmpStore()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.balanceInforData && nextProps.memberInforData.PreferWallet) {
			let PreferWallet = nextProps.memberInforData.PreferWallet
			let flag = nextProps.memberInforData.PreferWallet !== this.props.memberInforData.PreferWallet
			this.getbalanceIDoublenfor(nextProps.balanceInforData, PreferWallet, flag)
		}
	}

	componentWillUnmount() {
		if (this.listGetBouns) { this.listGetBouns.remove() }
		window.isGamePageToFiance && window.removeOrientation && window.removeOrientation()
		window.isGamePageToFiance = false
	}



	getMmpStore() {
		storage.load({
			key: 'RebateRecordFirsrtGuider' + window.userNameDB,
			id: 'RebateRecordFirsrtGuider' + window.userNameDB
		}).then(data => {
			this.setState({
				isShowRdDepositModal: false
			})
		}).catch(() => {
			this.setState({
				isShowRdDepositModal: true
			})
		})
	}




	getbalanceIDoublenfor(balanceInforData, PreferWallet, flag) {
		if (!(Array.isArray(balanceInforData) && balanceInforData.length > 0 && PreferWallet)) return
		let balanceInfor = balanceInforData
		//let balanceInfor = balanceInforData.filter(v => v.name !== 'TOTALBAL')
		this.setState({
			balanceInfor,
			fromBalanceInfor: balanceInfor,
			toBalanceInfor: balanceInfor,
			TotalBal: balanceInforData.find(v => v.name == 'TOTALBAL').balance,
			MAIN: balanceInforData.find(v => v.name == 'MAIN').balance
		})

		const { gameCode, fromPage } = this.props
		if (fromPage === 'game') {
			// if (gameCode) {
			// 	let toWalletIndex = balanceInfor.findIndex(v => v.name === gameCode)
			// 	this.setState({
			// 		toWalletIndex
			// 	})
			// }
		} else if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {
			if (!flag) return
			let { bonusProductList } = this.props
			let bonusProduct = bonusProductList.bonusProduct.toLocaleUpperCase()
			if (bonusProduct) {
				let toWalletIndex = balanceInfor.findIndex(v => v.name === bonusProduct)
				this.setState({
					// fromWalletIndex: bonusProduct === 'MAIN' ? 1 : 0,
					fromWalletIndex: -999,
					fromBalanceInfor: balanceInfor,
					toBalanceInfor: balanceInfor,
					toWalletIndex: toWalletIndex < 0 ? 0 : toWalletIndex,
				}, () => {
					this.getBouns(bonusProduct)
				})
			}
		} else {
			let balanceDoubleInfor = balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL').reduce((arr, v, i, self) => arr.concat(!(i % 2) ? [self.slice(i, i + 2)] : []), [])
			this.setState({
				balanceDoubleInfor
			})
			if (flag) {
				let PreferWalleteUpperCase = PreferWallet.toLocaleUpperCase()
				//let toWalletIndex = balanceInfor.findIndex(v => v.name === PreferWalleteUpperCase)
				this.setState({
					// fromWalletIndex: PreferWalleteUpperCase === 'MAIN' ? 0 : 0,
					// toWalletIndex: toWalletIndex < 0 ? 0 : toWalletIndex,
					fromWalletIndex: -999,
					toWalletIndex: -999
				})
				//this.getBouns(PreferWalleteUpperCase)
			}

			let walletCode = this.state.walletCode
			if (walletCode) {
				let toWalletIndex = balanceInfor.findIndex(v => v.name === walletCode)
				this.setState({
					// fromWalletIndex: walletCode === 'MAIN' ? 1 : 0,
					// fromBalanceInfor: balanceInfor,
					toBalanceInfor: balanceInfor,
					toWalletIndex: toWalletIndex < 0 ? 0 : toWalletIndex,
				})
			}
		}
	}


	createLbFromBankstList(type, item, index) {
		const { fromWalletIndex, toWalletIndex, TotalBal } = this.state
		let flag = fromWalletIndex * 1 === index * 1
		return TotalBal > 0 ? (
			item.balance > 0 ? (
				toWalletIndex != index
					?
					<View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
						<View style={styles.formatbalanceInfortTopWrap}>
							<View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle1, { backgroundColor: item.color }]}></View>
							<Text style={{ fontSize: 12, color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{item.localizedName}</Text>
						</View>
						<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{toThousands(item.balance)}</Text>
					</View>
					:
					<View style={[styles.toreturnModalDropdownList, { height: 0, opacity: 0, paddingBottom: 0, paddingTop: 0 }]} key={index}>
						<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>''</Text>
					</View>
			)
				:
				<View style={[styles.toreturnModalDropdownList, { height: 0, opacity: 0, paddingBottom: 0, paddingTop: 0 }]} key={index}>
					<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>''</Text>
				</View>
		)
			:
			(
				index == 0 ? <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
					<View style={styles.formatbalanceInfortTopWrap}>
						<View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle1, { backgroundColor: item.color }]}></View>
						<Text style={{ fontSize: 12, color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{item.localizedName}</Text>
					</View>
					<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{toThousands(item.balance)}</Text>
				</View>
					:
					<View style={[styles.toreturnModalDropdownList, { height: 0, opacity: 0, paddingBottom: 0, paddingTop: 0 }]} key={index}>
						<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>''</Text>
					</View>
			)
	}




	createLbToBankstList(type, item, index) {
		const { fromWalletIndex, toWalletIndex } = this.state
		let flag = toWalletIndex * 1 === index * 1

		return fromWalletIndex != index ? <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
			<View style={styles.formatbalanceInfortTopWrap}>
				<View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle1, { backgroundColor: item.color }]}></View>
				<Text style={{ fontSize: 12, color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{item.localizedName}</Text>
			</View>
			<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{toThousands(item.balance)}</Text>
		</View>
			:
			<View style={[styles.toreturnModalDropdownList, { height: 0, opacity: 0, paddingBottom: 0, paddingTop: 0 }]} key={index}>
				<Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>''</Text>
			</View>
	}


	transfer(item, flag) {  //一鍵轉
		const { fromPage } = this.props
		const { fromBalanceInfor, toBalanceInfor, fromWalletIndex, toWalletIndex, money, walletBouns, walletBounsIndex, bonusTurnOverInfor } = this.state
		// this.mydropdown && this.mydropdown.hide()
		let totalmoney = this.props.balanceInforData.find(v => v.name === 'TOTALBAL').balance
		//return

		// flag   true 一鍵轉

		if (!flag) {
			if (money <= 0) return

			if (!money) {
				Toast.fail('Vui lòng nhập tiền gửi', 2)
				return
			}

			// if (['AG', 'SP', 'IPSB'].includes(toBalanceInfor[toWalletIndex].name)) {
			// 	if (money <= 1) {
			// 		Toast.fail('Số tiền chuyển không thể thấp hơn 1.00', 2)
			// 		return
			// 	}
			// }

			// if (['SP', 'IPSB'].includes(fromBalanceInfor[fromWalletIndex].name)) {
			// 	if (money <= 1) {
			// 		Toast.fail('Số tiền chuyển không thể thấp hơn 1.00', 2)
			// 		return
			// 	}
			// }

			if (toBalanceInfor[toWalletIndex].state === 'UNDERMAINTENANCE') {
				Toast.fail('กระเป๋าเงินอยู่ระหว่างปรับปรุง โปรดลองอีกครั้งในภายหลัง', 2)
				return
			}

			let walletMoney = fromBalanceInfor[fromWalletIndex].balance
			if (walletMoney <= 0) {
				Toast.fail('ยอดเงินไม่เพียงพอ', 2)
				return
			}

			if (walletMoney < money) {
				Toast.fail('ยอดเงินไม่เพียงพอ ', 2)
				return
			}

			// if (toWalletIndex === fromWalletIndex) {
			// 	Toast.fail('โปรดเลือกกระเป๋าเงินอื่น', 2)
			// 	return
			// }
		} else {
			// 一键
			if (item.state === 'UNDERMAINTENANCE') {
				Toast.fail('กระเป๋าเงินอยู่ระหว่างปรับปรุง โปรดลองอีกครั้งในภายหลัง', 2)
				return
			}

			if (totalmoney <= 0) {
				Toast.fail('ยอดเงินไม่เพียงพอม กรุณาฝากเงิน', 2)
				//该帐户的余额不足，无法转移。 请汇款赚钱。
				return
			}
		}

		let data = {
			fromAccount: flag ? 'All' : fromBalanceInfor[fromWalletIndex].name,
			toAccount: flag ? item.name : toBalanceInfor[toWalletIndex].name,
			amount: flag ? 0 : money,
			bonusId: flag ? 0 : ((walletBouns.length && walletBounsIndex >= 0) ? walletBouns[walletBounsIndex].id : 0),
			blackBoxValue: E2Backbox,
			e2BlackBoxValue: E2Backbox,
			bonusCoupon: flag ? '' : 0
		}

		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.Transfer, 'POST', data).then(data => {
			Toast.hide()
			this.props.getBalanceInforAction()
			//getTransferId !=0 轉帳成功
			//getTransferId == 0 轉帳失敗
			let transferId = data.transferId
			if (transferId != 0) {

				Toast.success('โอนสำเร็จ', 3)
				// if (fromPage) {
				// 	if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {

				// 	}
				// }


				//if (data.successBonusId > 0) {
				this.postApplications({
					bonusId: walletBouns[walletBounsIndex].id,
					successBonusId: data.successBonusId,
					transferId: data.transferId
				})
				//}
			} else {
				Toast.fail('จำนวนเงินไม่เพียงพอ', 2)

				let unfinishedGames = data.unfinishedGames
				let unfinishedGamesMessages = data.unfinishedGamesMessages
				if (unfinishedGames) {
					if (Array.isArray(unfinishedGames) && unfinishedGames.length) {
						this.setState({
							isShowunfinishedGames: false,
							unfinishedGames,
							unfinishedGamesMessages
						})
					}
				} else {
					if (unfinishedGamesMessages && unfinishedGamesMessages.length) {
						this.setState({
							isShowunfinishedGames: true,
							unfinishedGamesMessages
						})
					}
				}
			}

			// this.setState({
			// 	money: ''
			// })
			if (this.props.fromPage == 'GamePage') {
				Actions.pop()
			}
		}).catch(error => {
			Toast.hide()
			Toast.fail(data.messages, 2)
		})

		this.setState({
			transferFlag: false
		})
		if (item) {
			item.name && TranferPiwikMenberText[item.name] && window.PiwikMenberCode(TranferPiwikMenberText[item.name])
		}
	}


	postApplications({ bonusId, transferId, successBonusId }) {
		this.setState({
			isShowModalFlag1: false
		})
		const { fromPage, money, depositingWallet, charges, fromBalanceInfor, fromWalletIndex, toBalanceInfor, toWalletIndex } = this.state

		let params = {
			"blackBoxValue": Iovation,
			"e2BlackBoxValue": E2Backbox,
			"blackBox": E2Backbox,
			"bonusId": bonusId,
			"amount": money,
			"bonusMode": "Transfer",
			"targetWallet": toBalanceInfor[toWalletIndex].name,
			"couponText": "",
			"isMax": false,
			"transferBonus": {
				"fromWallet": fromBalanceInfor[fromWalletIndex].name,
				"transactionId": transferId
			},
			"depositBonus": {
				"depositCharges": '',
				"depositId": ''
			},
			"successBonusId": successBonusId * 1
		}

		Toast.loading('กำลังโหลดข้อมูล...', 200000)
		fetchRequest(ApiPort.PostApplications, 'POST', params).then(res => {
			Toast.hide()
			if (res) {
				let bonusResult = res.bonusResult
				if (bonusResult) {
					if (bonusResult.message.toLocaleUpperCase() == 'SUCCESS') {
						if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {
							this.setState({
								isTransferSuccess: true
							})
						}

						Toast.success('สมัครโบนัสสำเร็จ', 2000)
						this.props.getPromotionListInforAction()
						//this.getCalculateBonusTurnOver()
						//this.props.getPromotionsApplications && this.props.getPromotionsApplications()
					} else {
						Toast.fail('ขอรับโบนัสไม่สำเร็จ', 2000)
					}
				}
			}
		}).catch(err => {
			Toast.hide()
		})
	}


	getBouns(name, from) {
		const { fromPage, bonusProductList, money } = this.props
		if (fromPage === 'game') return
		this.setState({
			bonusTurnOverInfor: {},
			walletBounsIndex: -999,
			walletBouns: [],
			totalWalletBouns: [],
			tranferMoneyFlag: false
		})
		const { fromBalanceInfor } = this.state
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.Bonus + '?transactionType=Transfer&wallet=' + name + '&', 'GET').then(res => {
			Toast.hide()
			//if (res.isSuccess) {
			let walletBouns = res
			//.availableBonusesList
			let totalWalletBouns = res
			//.availableBonusesList
			if (walletBouns.length) {
				let walletBounsIndex = 0
				if (fromPage === 'preferentialPage' || fromPage === 'homelPage') {
					let bonusID = bonusProductList.bonusID
					if (bonusID) {
						let tempWalletBounsIndex = walletBouns.findIndex(v => v.id * 1 === bonusID * 1)
						walletBounsIndex = tempWalletBounsIndex >= 0 ? tempWalletBounsIndex : 0
						if (walletBounsIndex >= 0) {
							let tempWalletBounsList = walletBouns[tempWalletBounsIndex]
							this.setState({
								money: tempWalletBounsList.minAccept + ''
							})
						}
					}
				} else {
					// walletBounsIndex = 0
					// walletBounsIndex = walletBouns.length > 0 ? walletBouns.length - 1 : 0

					// if (from === 'to' && totalWalletBouns.length > 0 && (this.state.money + '').length > 0) {
					// 	walletBouns = totalWalletBouns.filter(v => ((v.id > 0 && this.state.money * 1 >= v.minAccept) || v.id == 0))
					// 	walletBounsIndex = walletBouns.length > 0 ? walletBouns.length - 1 : 0
					// }
					walletBounsIndex = -999
				}

				this.setState({
					walletBouns: walletBouns.filter(v => v.id != 0),
					totalWalletBouns,
					walletBounsIndex,
				}, () => {
					this.getCalculateBonusTurnOver()
				})
			} else {
				this.setState({
					tranferMoneyFlag: true
				})
			}
			//}
		}).catch(() => {
			Toast.hide()
		})
	}

	createBounsList(item, index) {
		let flag = this.state.walletBounsIndex * 1 === index * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: '#33C85D', justifyContent: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#00000029', paddingVertical: 10 }]} key={index}>
			<View style={styles.circleView}>
				{
					flag && <View style={styles.circle}></View>
				}
			</View>
			<Text style={[styles.toreturnModalDropdownListText, { color: '#fff', width: width - 80 }]}>{item.title}</Text>
		</View>
	}

	changeBounsIndex(walletBounsIndex) {
		if (walletBounsIndex == this.state.walletBounsIndex) return
		this.setState({
			walletBounsIndex
		}, () => {
			this.getCalculateBonusTurnOver()
		})
	}

	getCalculateBonusTurnOver() {
		this.setState({
			bonusTurnOverInfor: {}
		})
		const { walletBouns, walletBounsIndex, money, fromPage } = this.state
		if (walletBounsIndex == -999) return
		if (walletBouns.length <= 0) return
		let walletBounsList = walletBouns[walletBounsIndex]
		let walletBounsListFlag = walletBounsList.id * 1 === 0
		let tranferMoneyFlag = walletBounsListFlag ? true : (fromPage ? walletBounsList.minAccept * 1 <= money * 1 : money > 0)
		this.setState({
			tranferMoneyFlag,
			minAccept: walletBounsListFlag ? 0 : walletBounsList.minAccept
		})
		if (!(tranferMoneyFlag && walletBounsList.id * 1 > 0 && money > 0 && walletBounsList.minAccept * 1 <= money * 1)) return
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		this.setState({
			isGetBonusTurnOverInfor: 1
		})
		fetchRequest(ApiPort.GetCalculateBonusTurnOver + 'bonusId=' + walletBounsList.id + '&applyAmount=' + money + '&', 'GET').then(res => {
			Toast.hide()
			if (res.isSuccess) {
				let bonusTurnOverInfor = {
					applyAmount: money,
					...res,
					availableBonusesList: walletBounsList
				}
				this.setState({
					bonusTurnOverInfor,
					isGetBonusTurnOverInfor: 2
				})
			}
		}).catch(err => {
			Toast.hide()
			this.setState({
				isGetBonusTurnOverInfor: 2
			})
		})
	}

	changeArrowStatus(tag, arrowFlag) {
		this.setState({
			[tag]: arrowFlag
		})
	}

	checkServingPreBonus(obj, flag) {
		const { toBalanceInfor, toWalletIndex } = this.state
		//toBalanceInfor[toWalletIndex].name
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		this.setState({
			transferFlag: false
		})
		fetchRequest(ApiPort.CheckServingPreBonus + 'Wallet=' + obj.name + '&', 'GET').then(res => {
			Toast.hide()

			if (res.isSuccess && res.isServingPreBonus) {
				this.setState({
					isShowModal: true,
					tempBoneList: obj,
					transferFlag: flag
				})
			} else {
				this.transfer(obj, flag)
			}
		}).catch(err => {
			Toast.hide()
		})
	}


	//请求第三方的游戏接口，返回第三方的游戏大厅的URL地址
	async playGame(item, isDemo) {
		if (isGameLock) {
			Toast.fail(GameLockText, 2)
			// Toast.fail('游戏访问限制' , 2)
			return
		}

		if (window.getCDUActivateStatus) {
			let getCDUActivateStatus = await window.getCDUActivateStatus()
			if (getCDUActivateStatus != 'open') return
		}



		this.setState({
			unfinishedGames: []
		})
		let gameid = item.gameId
		let gametype = item.provider
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
		// 	console.log('===removeVendorToken', targetSport);
		// 	removeVendorToken(targetSport);
		// }

		Toast.loading('กำลังเริ่มเกม...', 2000)
		// Toast.loading('正在启动游戏,请稍候...',200)
		fetchRequest(ApiPort.Game + gameid + '?isDemo=' + isDemo + '&gameId=' + gameid + '&', 'POST', data).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				let data = res
				if (data.errorCode == 2001) {
					Toast.fail(GameLockText, 2)
					return
				}

				if (data.isMaintenance == true) {
					Toast.fail(GameMaintenanceText, 2)
					return
				}

				if (data.gameLobbyUrl.length) {
					global.storage.load({
						key: 'GameSequence',
						id: 'GameSequence'
					}).then(GameSequence => {
						let subProviders = GameSequence.map(v => v.subProviders).flat()
						if (Array.isArray(subProviders)) {
							let walletCodeList = subProviders.find(v => v.code.toLocaleUpperCase() == gametype.toLocaleUpperCase())
							if (walletCodeList) {
								let walletCode = walletCodeList.walletCode
								let walletInfor = this.props.balanceInforData.find(v => v.name == walletCode) || {
									localizedName: '',
									balance: 0
								}
								Actions.GamePage({
									GameOpenUrl: data.gameLobbyUrl,
									gametype,
									gameHeadName: gametype,
									walletCode,
									walletInforBalance: walletInfor.balance
								})
							}
						}

					}).catch(() => { })
				}
			} else {
				Toast.fail(GameMaintenanceText, 2)
			}
		}).catch(() => {
			Toast.hide()
		})
	}


	changeisShowRdDepositModal(isShowRdDepositModal) {
		this.setState({
			isShowRdDepositModal
		})

		global.storage.save({
			key: 'RebateRecordFirsrtGuider' + window.userNameDB,
			id: 'RebateRecordFirsrtGuider' + window.userNameDB,
			data: true,
			expires: null
		})
	}

	render() {
		const { fromPage } = this.props
		const { isMoneyClock, isShowTranferBonsModal, isShowInforView, isShowRdDepositModal, isTransferSuccess, TotalBal, MAIN, walletCode, unfinishedGamesMessages, isShowunfinishedGames, unfinishedGames, tempBoneList, isShowModal, isGetBonusTurnOverInfor, arrowFlag1, arrowFlag2, arrowFlag3, totalWalletBouns, minAccept, tranferMoneyFlag, fromBalanceInfor, toBalanceInfor, bonusTurnOverInfor, walletBouns, walletBounsIndex, money, balanceInfor, fromWalletIndex, toWalletIndex, balanceDoubleInfor } = this.state
		return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F3F3F4' : '#0F0F0F' }]}>
			<Modal animationType='fade' transparent={true} visible={isShowRdDepositModal}>
				<View style={[styles.modalContainer, {
					backgroundColor: '#E5E6E8',
				}]}>
					<Image
						resizeMode='stretch'
						style={styles.carouselImg}
						source={require('./../../../images/finance/transfer/tranferIconGuide.png')}
					/>
					{
						<TouchableOpacity style={styles.closeBtn} onPress={() => {
							this.changeisShowRdDepositModal(false)
						}}></TouchableOpacity>
					}
				</View>
			</Modal>

			<Modal visible={isShowModal} animationType='fade' transparent={true}>
				<View style={styles.modalViewContainer}>
					<View style={styles.modalViewBox}>
						<View style={styles.modalBodyBox}>
							<Image
								resizeMode="stretch"
								style={styles.tranferIcon}
								source={require('./../../../images/finance/transfer/tranferIcon.png')}
							></Image>
							<Text style={styles.modalBodyText1}>บัญชีที่คุณกำลังโอนเข้าอยู่ระหว่างการปลดล็อกเงื่อนไขโบนัส เมื่อโอนเงินแล้วจะไม่สามารถโอนออกได้จนกว่าจะมียอดหมุนเวียนครบ คุณต้องการโอนเข้าบัญชีนี้อยู่หรือไม่ ?</Text>
							<Text style={styles.modalBodyText2}>หมายเหตุ : หากยอดเงินคงเหลือต่ำกว่า 5 บาท โบนัสจะปลดล็อกอัตโนมัตเมื่อโอนเงินเข้า</Text>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										isShowModal: false
									})
									Actions.PreferentialRecords()
								}}
								hitSlop={{ top: 5, bottom: 5 }}
								style={styles.modalBodyBtn}>
								<Text style={styles.modalBodyBtnText}>คลิกเพื่อดูโบนัสของคุณ</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.modalFooter}>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										isShowModal: false
									})
								}}
								style={[styles.modalFooterBtn, styles.modalFooterBtn1]}>
								<Text style={styles.modalFooterBtnText}>ยกเลิก</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									this.setState({
										isShowModal: false
									})
									this.transfer(tempBoneList, this.state.transferFlag)
								}}
								style={styles.modalFooterBtn}>
								<Text style={styles.modalFooterBtnText}>ดำเนินการต่อ</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal transparent={true} visible={isShowunfinishedGames} animationType='fade'>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { width: width * .9, borderRadius: 15, paddingBottom: 15, backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F' }]}>
						<View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
							<Text style={[{ color: '#fff', fontWeight: 'bold', fontSize: 16 }]}>Thông báo:</Text>
						</View>

						<View style={{ paddingHorizontal: 15 }}>
							<Text style={{ textAlign: 'center', color: window.isBlue ? '#58585B' : '#fff', lineHeight: 22 }}>
								{unfinishedGamesMessages}
							</Text>
						</View>

						<View style={{ alignItems: 'center' }}>
							<TouchableOpacity style={[styles.modalBtn2, { marginBottom: 0 }]} onPress={() => {
								this.setState({
									isShowunfinishedGames: false
								})
							}}>
								<Text style={styles.modalBtnText2}> ปิด </Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal transparent={true} visible={Array.isArray(unfinishedGames) && unfinishedGames.length > 0} animationType='fade'>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { width: width * .9, paddingHorizontal: 15, alignItems: 'center', borderRadius: 15, backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
						<View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#25AAE1' : '#212121', width, height: 60 }]}>
							<Text style={[styles.modalBodyText, { color: window.isBlue ? '#FFFFFF' : '#25AAE1', fontWeight: 'bold', fontSize: 16 }]}>รายการล้มเหลว</Text>
						</View>
						<Text style={{ color: window.isBlue ? '#1A1A1A' : '#FFFFFF', marginBottom: 20, textAlign: 'center' }}>{unfinishedGamesMessages}</Text>
						<View style={{ height: (.9 * width - 30 - 120 * .9) * .48 * (unfinishedGames.length >= 3 ? 3 : unfinishedGames.length) + 15 * 2 }}>
							<ScrollView
								automaticallyAdjustContentInsets={false}
								showsHorizontalScrollIndicator={false}
								showsVerticalScrollIndicator={false}
							>
								{
									Array.isArray(unfinishedGames) && unfinishedGames.map((v, i) => {
										return <View key={i} style={styles.gameUnfinishList}>
											<View style={styles.gameUnfinishListImgBtn}>
												<Image
													resizeMode='stretch'
													style={styles.gameUnfinishListImg}
													defaultSource={window.isBlue ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')}
													source={{ uri: v.imgGameName }} ></Image>
											</View>
											<TouchableOpacity style={styles.gameUnfinishListBtn} onPress={this.playGame.bind(this, v, false)}>
												<Text style={styles.gameUnfinishListText}>เล่นเลย</Text>
											</TouchableOpacity>
										</View>
									})
								}
							</ScrollView>
						</View>
						<TouchableOpacity style={styles.modalBtn2} onPress={() => {
							this.setState({
								unfinishedGames: []
							})
						}}>
							<Text style={styles.modalBtnText2}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>


			<Modal animationType='fade' transparent={true} visible={isTransferSuccess}>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
						<View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#25AAE1' : '#212121', height: 40, alignItems: 'flex-start', paddingLeft: 20 }]}>
							<Text style={styles.modalTopText}>สถานะโปรโมชั่น</Text>
						</View>
						<View style={styles.modalBody}>
							<Image
								style={{ height: 50, width: 50, marginBottom: 5 }}
								source={require('./../../../images/promotion/preferential/preferentialRecord/freeRight.png')}
								resizeMode='stretch'></Image>
							<Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
								โอนเงินสำเร็จ
							</Text>
							<View style={styles.modalBtnBox}>
								<TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}
									onPress={() => {
										this.setState({
											isTransferSuccess: false
										})

										if (fromPage) {
											Actions.pop()
											Actions.pop()
										}

									}}
								>
									<Text style={[styles.modalBtnText, { color: '#fff' }]}>เก็บ</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</Modal>

			<Modal animationType='fade' transparent={true} visible={isShowTranferBonsModal}>
				<View style={[styles.modalContainer1]}>
					<View style={styles.modalTopBox}>
						<TouchableOpacity style={styles.closeModalBox} onPress={() => {
							this.setState({
								isShowTranferBonsModal: false
							})
						}}>
							<Text style={styles.closeModalBoxText}>X</Text>
						</TouchableOpacity>
						<Image
							resizeMode='stretch'
							source={require('./../../../images/finance/transfer/tranferAppicon3.png')}
							style={styles.tranferAppicon3}
						></Image>
						<Text style={styles.tranferAppicon3Text}>เรามีโบนัสเพื่อคุณ</Text>
					</View>

					<View style={{}}>
						<ScrollView>
							{
								Array.isArray(walletBouns) && walletBouns.length > 0 && walletBouns.map((v, i) => {
									let flag = walletBounsIndex == i
									return <TouchableOpacity
										onPress={() => {
											this.setState({
												isShowTranferBonsModal: false,
												walletBounsIndex: i,
												money: v.minAccept + ''
											})
										}}
										key={i} style={[styles.modalBounsList,
										{
											backgroundColor: flag ? '#00AEEF' : '#fff'
										}]}>
										<Text style={[styles.modalBounsListText, {
											color: flag ? '#fff' : '#545B5C'
										}]}>{v.title}</Text>
									</TouchableOpacity>
								})
							}

							<Text style={{ color: '#FFFFFF' }}>{`แนะนำ: สมาชิกสามารถสมัครเพื่อรับโบนัสได้ตลอดเวลาในทุกบัญชี เกม คุณสามารถสมัครขอรับโบนัสอื่นๆ ในบัญชีเดียวกันหลังจากที่ คุณได้สมัครขอรับโบนัสเสร็จสมบูรณ์ \nตัวอย่าง: สมาชิกจะต้องสมัครเพื่อเล่นกีฬาหลังจากกรอกโบนัสเงิน ฝากครั้งแรกสำหรับการเดิมพันกีฬา`}</Text>
						</ScrollView>
					</View>



					<TouchableOpacity style={styles.closeModalBtn} onPress={() => {
						this.setState({
							isShowTranferBonsModal: false,
							walletBounsIndex: -999
						})
					}}>
						<Text style={styles.closeModalBtnText}>ขอรับภายหลัง</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{
				isShowInforView && !fromPage && <View style={styles.depositNoBox}>
					<Text style={styles.depositNoBoxText}>กรุณาโอนเงินจากบัญชีหลักของคุณก่อนเริ่มเกมส์</Text>

					<TouchableOpacity style={styles.depositNoCloseBtn} onPress={() => {
						this.setState({
							isShowInforView: false
						})
					}}>
						<Text style={styles.depositNoCloseBtnText}>X</Text>
					</TouchableOpacity>
				</View>
			}
			<ScrollView>

				<View style={{ paddingBottom: height * .15 }}>
					{
						((fromPage === 'preferentialPage' || fromPage === 'homelPage')) && <View style={styles.moneyWalletTextBox1}>
							<View style={styles.moneyWalletTextBox}>
								<Text style={styles.moneyWalletText1}>{toThousands(TotalBal)}</Text>
								<Text style={styles.moneyWalletText}>ยอดรวม</Text>
							</View>
							<View style={styles.viewLine}></View>
							<View style={styles.moneyWalletTextBox}>
								<Text style={styles.moneyWalletText1}>{toThousands(MAIN)}</Text>
								<Text style={styles.moneyWalletText}>บัญชีหลัก</Text>
							</View>
						</View>
					}

					{
						fromPage === 'GamePage' && <View style={[styles.moneyWalletTextBox1, { paddingHorizontal: 10 }]}>
							<View style={styles.gamePageRight}>
								<Image source={require('./../../../images/common/money.png')} style={{ width: 24, height: 24, marginRight: 4, marginRight: 6 }}></Image>
								<Text style={styles.gamePageRightText}>ยอดเงินรวมบัญชีหลัก</Text>
							</View>

							<Text style={styles.gamePageRightText1}>{toThousands(TotalBal)}</Text>
						</View>
					}

					{
						!fromPage && <View style={[styles.targetWalletWrap, { marginHorizontal: 0, width, paddingHorizontal: 10 }]}>
							<TouchableOpacity
								style={[{
									backgroundColor: '#fff',
									alignItems: 'center',
									flexDirection: 'row',
									marginBottom: 6,
									paddingVertical: 10,
									marginHorizontal: -10,
									width,
									paddingHorizontal: 10
								}]}>
								<Image
									source={false ? require('./../../../images/finance/transfer/formatbalanceInfortBox2.png') : require('./../../../images/finance/transfer/formatbalanceInfortBox.png')}
									resizeMode='stretch'
									style={{
										width: 20,
										height: 22,
										marginRight: 6
									}}></Image>
								<Text style={{ fontSize: 14, flexWrap: 'wrap', }}>โอนเงินเข้าทั้งหมด</Text>

								<Text style={{ color: '#FF0000', marginTop: -15 }}>ใหม่</Text>
							</TouchableOpacity>



							<View>
								{
									balanceDoubleInfor.map((v1, i1) => {
										return <View style={styles.formatbalanceInfortBox} key={i1}>
											{
												v1.map((v2, i2) => {
													let balanceInforList = balanceInfor.filter(v => v.balance > 0)
													let overlyMoneyFlag = balanceInforList.length === 1 && balanceInforList[0].name === v2.name
													let isUnderMaintenance = v2.state.toLocaleUpperCase() === 'UNDERMAINTENANCE'
													return <TouchableOpacity
														key={i2}
														style={[styles.formatbalanceInfortWrap]}
														onPress={() => {
															window.PiwikMenberCode('Transfer', 'Submit', `${v2.localizedName}_QuickTransfer`)

															!overlyMoneyFlag && this.checkServingPreBonus(v2, true)
														}}>
														{
															overlyMoneyFlag && <View style={styles.overlyMoney}></View>
														}
														{
															isUnderMaintenance && <View style={styles.overlyMoney}></View>
														}
														<View>
															<View style={styles.formatbalanceInfortTopWrap}>
																<View style={[styles.toreturnModalDropdownCircle, { backgroundColor: isUnderMaintenance ? '#C9C9C9' : v2.color }]}></View>
																<Text style={{ fontSize: 11, flexWrap: 'wrap', marginBottom: 4, color: window.isBlue ? (isUnderMaintenance ? '#C9C9C9' : '#000') : '#fff' }}>{v2.localizedName}</Text>
																{
																	(v2.name === 'SB') && <TouchableOpacity
																		hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
																		onPress={() => {
																			Actions.SBGuiderModal()
																		}}
																		style={styles.walletSbIconBox}>
																		<Image
																			resizeMode='stretch'
																			source={require('./../../../images/finance/walletSbIcon0.png')}
																			style={styles.walletSbIcon}
																		></Image>
																	</TouchableOpacity>
																}
															</View>
															{
																isUnderMaintenance ?
																	<Text style={[styles.formatbalanceInforText, { color: window.isBlue ? '#C9C9C9' : '#fff' }]}>ได้รับการบำรุงรักษา</Text>
																	:
																	<Text style={[styles.formatbalanceInforText, { color: window.isBlue ? '#000' : '#fff' }]}>{toThousands(v2.balance)}</Text>
															}
														</View>


														<Image
															source={isUnderMaintenance ? require('./../../../images/finance/transfer/formatbalanceInfortBox2.png') : require('./../../../images/finance/transfer/formatbalanceInfortBox.png')}
															resizeMode='stretch'
															style={styles.formatbalanceInfortBoxImg}></Image>
													</TouchableOpacity>
												})
											}
										</View>
									})
								}
							</View>
						</View>
					}

					<View style={[styles.targetWalletWrap, { paddingTop: fromPage ? 20 : 0 }]}>
						<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>จากบัญชี</Text>
						{
							fromBalanceInfor.length > 0 && <ModalDropdown
								animated={true}
								options={fromBalanceInfor}
								renderRow={this.createLbFromBankstList.bind(this, 'from')}
								renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => <View></View>}
								onSelect={fromWalletIndex => {
									if (fromWalletIndex < 0) return
									if (fromWalletIndex * 1 === this.state.fromWalletIndex * 1) return
									if (fromWalletIndex >= 0 && toWalletIndex >= 0 && fromBalanceInfor[fromWalletIndex].name === toBalanceInfor[toWalletIndex].name) {
										Toast.fail('โปรดเลือกกระเป๋าเงินอื่น', 2)
										return
									}
									this.setState({
										fromWalletIndex: fromWalletIndex * 1,
									})


									if (!fromPage || fromPage == 'GamePage') {
										let isMoneyClock = fromBalanceInfor[fromWalletIndex].name.toLocaleUpperCase() == 'TOTALBAL'
										let money = isMoneyClock ? fromBalanceInfor[fromWalletIndex].balance + '' : ''
										this.setState({
											isMoneyClock,
											money
										})
										if (TotalBal && toWalletIndex >= 0) {
											let money = isMoneyClock ? (((TotalBal * 1000000 - toBalanceInfor[toWalletIndex].balance * 1000000) / 1000000) + '') : ''
											this.setState({
												money
											})
										}
									}
								}}
								defaultIndex={0}
								onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
								onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
								style={[styles.toreturnModalDropdown, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#fff' : '#00CEFF', borderBottomColor: window.isBlue ? '#4C4C4C34' : '#00CEFF', }]}
								dropdownStyle={[styles.toreturnDropdownStyle, {
									backgroundColor: window.isBlue ? '#fff' : '#212121',
									height: fromBalanceInfor.filter(v => v.balance > 0).length * 30
								}]}
							>
								<View style={[styles.targetWalletBox]}>
									<View style={styles.walletTranferBox}>
										{
											fromWalletIndex >= 0 && <View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle1, { backgroundColor: fromBalanceInfor[fromWalletIndex].color }]}></View>
										}

										<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{fromWalletIndex >= 0 ? fromBalanceInfor[fromWalletIndex].localizedName : 'กรุณาเลือกบัญชี'}</Text>
									</View>
									<View style={styles.walletTranferBox}>
										{
											fromWalletIndex >= 0 && <Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#000' : '#fff', marginRight: 5 }]}>{toThousands(fromBalanceInfor[fromWalletIndex].balance)}</Text>
										}
										<ModalDropdownArrow arrowFlag={arrowFlag1} />
									</View>
								</View>
							</ModalDropdown>
						}
					</View>

					<View style={styles.targetWalletWrap}>
						<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ถึงบัญชี</Text>
						{
							toBalanceInfor.length > 0 && <ModalDropdown
								animated={true}
								disabled={fromPage || this.state.walletCode}
								options={toBalanceInfor}
								renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => <View></View>}
								renderRow={this.createLbToBankstList.bind(this, 'to')}
								onSelect={toWalletIndex => {
									if (toWalletIndex < 0) return
									if (toWalletIndex * 1 === this.state.toWalletIndex * 1) return
									if (fromWalletIndex >= 0 && toWalletIndex >= 0 && fromBalanceInfor[fromWalletIndex].name === toBalanceInfor[toWalletIndex].name) {
										Toast.fail('โปรดเลือกกระเป๋าเงินอื่น', 2)
										return
									}


									if (TotalBal && isMoneyClock) {
										this.setState({
											money: ((TotalBal * 1000000 - toBalanceInfor[toWalletIndex].balance * 1000000) / 1000000) + ''
										})
									}
									this.setState({
										toWalletIndex: toWalletIndex * 1
									}, () => {
										this.getBouns(toBalanceInfor[toWalletIndex].name, 'to')

									})
								}}
								//defaultIndex={toBalanceInfor.length - 1}
								onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag2', true)}
								onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag2', false)}
								style={[styles.toreturnModalDropdown, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#fff' : '#00CEFF', borderBottomColor: window.isBlue ? '#4C4C4C34' : '#00CEFF', }]}
								dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: toBalanceInfor.length * 20 }]}
							>
								<View style={[styles.targetWalletBox, { backgroundColor: (fromPage || this.state.walletCode) ? (window.isBlue ? '#E6E6E6' : '#6F6D6D') : 'transparent' }]}>
									<View style={styles.walletTranferBox}>
										{
											toWalletIndex >= 0 && <View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle1, { backgroundColor: toBalanceInfor[toWalletIndex].color }]}></View>
										}

										<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{toWalletIndex >= 0 ? toBalanceInfor[toWalletIndex].localizedName : 'กรุณาเลือกบัญชี'}</Text>
									</View>
									<View style={styles.walletTranferBox}>
										{
											toWalletIndex >= 0 && <Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#000' : '#fff', marginRight: 5 }]}>{toThousands(toBalanceInfor[toWalletIndex].balance)}</Text>
										}

										<ModalDropdownArrow arrowFlag={arrowFlag2} />
									</View>
								</View>
							</ModalDropdown>
						}
					</View>

					{/* 转账金额 */}
					{
						fromBalanceInfor.length > 0 && <View style={styles.targetWalletWrap}>
							<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>จำนวน</Text>
							<View style={styles.LBMoneyBox}>
								<TextInput
									value={money}
									//keyboardType={fromBalanceInfor[fromWalletIndex].name === 'AG' ? 'number-pad' : 'decimal-pad'}
									keyboardType='decimal-pad'
									editable={!((!fromPage || fromPage == 'GamePage') && isMoneyClock)}
									onChangeText={value => {
										let money = ''
										// if (fromBalanceInfor[fromWalletIndex].name === 'AG') {
										// 	money = GetOnlyNumReg(value)
										// } else {
										// 	money = getDoubleNum(value)
										// }

										money = getDoubleNum(value)

										// if (!fromPage && totalWalletBouns.length > 0) {
										// 	let tempWalletBouns = totalWalletBouns.filter(v => ((v.id > 0 && money * 1 >= v.minAccept) || v.id == 0))
										// 	this.setState({
										// 		walletBouns: tempWalletBouns,
										// 		//walletBounsIndex: tempWalletBouns.length > 0 ? tempWalletBouns.length - 1 : 0
										// 		walletBounsIndex: -999
										// 	})
										// }
										this.setState({
											money,
											bonusTurnOverInfor: {},
										}, () => {
											(fromPage === 'preferentialPage' || fromPage === 'homelPage') && this.getCalculateBonusTurnOver()
										})
									}}
									style={[styles.limitListsInput, { width: width - 20 }]} />
							</View>
							{
								walletBouns.length > 0 && (fromPage === 'preferentialPage' || fromPage === 'homelPage') && walletBouns[walletBounsIndex].id * 1 !== 0 && <View>
									{
										(money + '').length > 0 && minAccept > money && <Text style={[styles.depositMoneyText1, { color: 'red' }]}>ยอดเงินน้อยกว่าที่กำหนดp</Text>
									}
								</View>
							}
						</View>
					}


					{
						!fromPage && <View>
							<View style={[styles.targetWalletWrap, styles.tranferAppiconBox]}>
								<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff', width: width - 20 - 70 }]}>
									{
										walletBounsIndex >= 0
											?
											walletBouns[walletBounsIndex].title
											:
											(
												(Array.isArray(walletBouns) && walletBouns.length > 0) ? `คุณมีโปรโมชั่นที่เลือกรับได้ ${walletBouns.length} รายการ` : `ไม่มีโบนัสสำหรับบัญชีนี้`
											)
									}
								</Text>

								<Image
									resizeMode='stretch'
									source={require('./../../../images/finance/transfer/tranferAppicon.png')}
									style={styles.tranferAppicon1}
								></Image>
							</View>
							<TouchableOpacity style={styles.tranferArrowBox} hitSlop={{ top: 10, bottom: 15 }} onPress={() => {
								if (!(Array.isArray(walletBouns) && walletBouns.length > 0)) return
								this.setState({
									isShowTranferBonsModal: true
								})
							}}>
								<Image
									resizeMode='stretch'
									source={require('./../../../images/finance/transfer/stre-down.png')}
									style={styles.tranferAppicon2}
								></Image>
							</TouchableOpacity>
						</View>
					}


					{
						false && walletBouns.length > 0 && (fromPage !== 'preferentialPage' && fromPage !== 'homelPage' && fromPage !== 'GamePage') && money > 0 && <View style={styles.targetWalletWrap}>
							<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>เลือกโปรโมชั่น</Text>
							<ModalDropdown
								animated={true}
								options={walletBouns}
								renderRow={this.createBounsList.bind(this)}
								onSelect={this.changeBounsIndex.bind(this)}
								style={[styles.toreturnModalDropdown]}
								onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag3', true)}
								onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag3', false)}
								dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}
							>
								<View style={[styles.targetWalletBox, { backgroundColor: '#33C85D' }]}>
									<View style={styles.bonesLeftBox}>
										{
											walletBounsIndex != -999 && <View style={styles.circleView}>
												<View style={styles.circle}></View>
											</View>
										}
										<Text style={[styles.toreturnModalDropdownText, { color: '#fff', width: width - 80 }]}>{walletBounsIndex == -999 ? 'Nhấp để xem khuyến mãi hiện có' : walletBouns[walletBounsIndex].title}</Text>
									</View>

									<ModalDropdownArrow arrowFlag={arrowFlag3} flag={true} />
								</View>
							</ModalDropdown>
						</View>
					}

					{
						bonusTurnOverInfor.isSuccess
							?
							(
								walletBouns.length > 0 && (minAccept <= money) && <View style={styles.targetWalletWrap}>
									<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ข้อมูลโบนัส:</Text>
									<View style={[styles.preferent, { borderColor: window.isBlue ? '#E5E5E5' : '#00AEEF' }]}>
										<Text style={[styles.depostMoney, { textAlign: 'center', color: window.isBlue ? '#000' : '#fff' }]}>{bonusTurnOverInfor.availableBonusesList.title}</Text>
										<View style={styles.preferentialList}>
											<View style={styles.preferentialListBox}>
												<Text style={[styles.preferential, { color: window.isBlue ? '#000' : '#fff' }]}>โบนัสที่ขอรับ</Text>
												<Text style={[styles.preferentialTxt, { color: window.isBlue ? '#000' : '#fff' }]}>{toThousands(bonusTurnOverInfor.applyAmount)}</Text>
											</View>

											<View style={styles.preferentialListBox}>
												<Text style={[styles.preferential, { color: window.isBlue ? '#000' : '#fff' }]}>โบนัสที่ได้รับ</Text>
												<Text style={[styles.preferentialTxt, { color: window.isBlue ? '#000' : '#fff' }]}>{toThousands(bonusTurnOverInfor.bonusGiven)}</Text>
											</View>

											<View style={styles.preferentialListBox}>
												<Text style={[styles.preferential, { color: window.isBlue ? '#000' : '#fff' }]}>ยอดเทิร์นของโบนัส</Text>
												<Text style={[styles.preferentialTxt, { color: window.isBlue ? '#000' : '#fff' }]}>{toThousands(bonusTurnOverInfor.turnOver)}</Text>
											</View>
										</View>
									</View>
								</View>
							)
							:
							(
								isGetBonusTurnOverInfor == 1 && <View style={styles.targetWalletWrap}>
									<Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ข้อมูลโบนัส</Text>
									<View style={[styles.preferent, styles.tanferBoneWrap]}>
										<LoadingBone></LoadingBone>
									</View>
								</View>
							)
					}


					{
						fromPage === 'GamePage' && <View style={styles.transferBtnWrap}>
							<TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: money > 0 ? '#25AAE1' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={() => {
								// this.transfer(null, false)
								this.checkServingPreBonus(fromBalanceInfor[fromWalletIndex], false)
							}}>
								<Text style={styles.LBdepositPageBtnText1}>โอนเงิน</Text>
							</TouchableOpacity>

							<TouchableOpacity style={[styles.LBdepositPageBtn1, {
								borderColor: '#00AEEF',
								borderWidth: 1,
								marginVertical: 15
							}]} onPress={() => {
								Actions.pop()
							}}>
								<Text style={[styles.LBdepositPageBtnText1, { color: '#00AEEF' }]}>ข้าม</Text>
							</TouchableOpacity>

							<TouchableOpacity style={[styles.LBdepositPageBtn1, { marginTop: 10 }]} onPress={() => {
								Actions.pop()
								Actions.DepositStack()
							}}>
								<Text style={[styles.LBdepositPageBtnText1, { color: '#25AAE1' }]}>ฝากเงิน</Text>
							</TouchableOpacity>
						</View>
					}

					{
						(!fromPage || (fromPage === 'preferentialPage' || fromPage === 'homelPage')) &&
						<TouchableOpacity
							style={[styles.LBdepositPageBtn1, styles.LBdepositPageBtn2,
							{
								position: 'relative',
								backgroundColor: ((fromPage === 'preferentialPage' || fromPage === 'homelPage') ? (money >= minAccept && fromWalletIndex >= 0) : (money > 0 && fromWalletIndex >= 0 && toWalletIndex >= 0)) ? '#00AEEF' : ('rgba(0, 0, 0, .4)')
							}]}
							onPress={() => {
								if (!fromPage) {
									window.PiwikMenberCode('Transfer', 'Submit', `Normal_Transfer`)
								}
								if (((fromPage === 'preferentialPage' || fromPage === 'homelPage') ? (money >= minAccept && fromWalletIndex >= 0) : (money > 0 && fromWalletIndex >= 0 && toWalletIndex >= 0))) {
									this.checkServingPreBonus(toBalanceInfor[toWalletIndex], false)
									if (fromPage == 'preferentialPage' && Array.isArray(walletBouns) && walletBouns.length && walletBounsIndex >= 0 && walletBouns[walletBounsIndex].id) {
										window.PiwikMenberCode('Transfer', 'Submit', `Transfer_${walletBouns[walletBounsIndex].id}`)
									}
								}
							}}
						>
							<Text style={styles.LBdepositPageBtnText1}>ส่ง</Text>
						</TouchableOpacity>
					}
				</View>
			</ScrollView>
		</View>
	}
}

export default Transfer = connect(
	(state) => {
		return {
			balanceInforData: state.balanceInforData,
			memberInforData: state.memberInforData,
		}
	}, (dispatch) => {
		return {
			userInfo_getBalanceAll: (forceUpdate = false) => ACTION_UserInfo_getBalanceAll(forceUpdate),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
			changeBonusTurnOverInfor: (data) => dispatch(changeBonusTurnOverInfor(data)),
			getPromotionListInforAction: () => dispatch(getPromotionListInforAction())
		}
	}
)(transferContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
	},
	modalViewContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalViewBox: {
		width: width * .9,
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#EFEFEF',
		alignItems: 'center',
		paddingTop: 20
	},
	modalBodyBox: {
		paddingHorizontal: 15,
		alignItems: 'center'
	},
	tranferIcon: {
		width: 207 * .5,
		height: 181 * .5,
		marginBottom: 30
	},
	modalBodyText1: {
		lineHeight: 20,
		textAlign: 'center'
	},
	modalBodyText2: {
		fontSize: 12,
		color: '#FF0000',
		marginTop: 15,
		textAlign: 'center'
	},
	modalBodyBtnText: {
		color: '#008AEF',
		textDecorationLine: 'underline',
		fontWeight: 'bold',
		fontSize: 14,
		textAlign: 'center',
		marginVertical: 25
	},
	modalFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: '#D0CDCD',
		marginTop: 5
	},
	modalFooterBtnText: {
		color: '#008AEF',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 15
	},
	modalFooterBtn: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 48,
		width: (width * .9) / 2,
	},
	modalFooterBtn1: {
		borderRightWidth: 1,
		borderRightColor: '#D0CDCD'
	},
	tanferBoneWrap: {
		overflow: 'hidden',
		backgroundColor: '#e0e0e0',
		height: 110
	},
	depositMoneyText2: {
		color: '#00AEEF',
	},
	depositMoneyText1: {
		color: '#000',
		fontSize: 12,
		marginTop: 5
	},
	preferentialList: {
		alignItems: 'center',
		justifyContent: 'space-around',
		flexDirection: 'row',
	},
	preferentialListBox: {
		width: (width - 30) / 3,
	},
	preferential: {
		color: '#000',
		textAlign: 'center',
		fontSize: 13,
	},
	preferentialTxt: {
		textAlign: 'center',
		paddingTop: 5,
	},
	preferent: {
		borderWidth: 1,
		borderColor: '#E5E5E5',
		padding: 8,
		paddingHorizontal: 5,
		borderRadius: 4,
		marginBottom: 10,
		backgroundColor: '#fff'
	},
	depostMoney: {
		color: '#000',
		fontWeight: 'bold',
		fontSize: 15,
		marginBottom: 8
	},
	LBdepositPageBtnText1: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	transferBtnWrap: {
		marginTop: 40
	},
	LBdepositPageBtn1: {
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		width: width - 20,
		marginHorizontal: 10,
		borderRadius: 4,
	},
	LBdepositPageBtn2: {
		position: 'absolute',
		bottom: 15,
		width: width - 20,
		marginHorizontal: 0,
		marginHorizontal: 10,
		marginTop: 40
	},
	formatbalanceInforText: {
		fontWeight: 'bold',
		color: '#000',
		fontSize: 13
	},
	formatbalanceInfortBox: {
		flexDirection: 'row',
		marginBottom: 5,
		justifyContent: 'space-between'
	},
	formatbalanceInfortTopWrap: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	formatbalanceInfortWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: (width - 20) / 2.06,
		padding: 4,
		paddingHorizontal: 6,
		backgroundColor: '#fff',
		borderRadius: 6
	},
	overlyMoney: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, .5)',
		zIndex: 20
	},
	limitListsInput: {
		borderWidth: 1,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		backgroundColor: '#fff',
		borderBottomColor: '#4C4C4C34',
		paddingLeft: 10,
		paddingRight: 10,
		fontSize: 14,
		height: 40,
		width: width - 20,
		borderRadius: 4,
		justifyContent: 'center'
	},
	LBMoneyBox: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	limitListsText: {
		marginBottom: 5,
	},
	targetWalletWrap: {
		width: width - 20,
		marginBottom: 10,
		marginHorizontal: 10,
	},
	toreturnModalDropdown: {
		justifyContent: 'center',
		width: width - 20,
	},
	toreturnDropdownStyle: {
		width: width - 20,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	targetWalletBoxWrap: {
		height: 38,
		width,
		marginHorizontal: -10,
		borderWidth: 0,
		marginBottom: 10,
		borderTopWidth: 1,
		borderBottomWidth: 1
	},
	bonesLeftBox: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	targetWalletBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 10,
		paddingRight: 10,
		height: 40,
		alignItems: 'center',
		borderRadius: 4,


		borderWidth: 1,
		borderColor: '#F2F2F2',
		borderBottomWidth: 2,
		backgroundColor: '#fff',
		borderBottomColor: '#4C4C4C34'

	},
	walletTranferBox: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	toreturnModalDropdownCircle: {
		width: 8,
		height: 8,
		borderRadius: 1000,
		backgroundColor: '#DCDCDC',
		marginRight: 5
	},
	toreturnModalDropdownCircle1: {
		height: 12,
		width: 5
	},
	circleView: {
		width: 18,
		height: 18,
		borderColor: '#fff',
		borderWidth: 2,
		borderRadius: 100000,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 6
	},
	circle: {
		width: 10,
		height: 10,
		borderRadius: 1000,
		backgroundColor: '#fff'
	},
	toreturnModalDropdownList: {
		paddingVertical: 6,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	formatbalanceInfortBoxImg: {
		width: 20,
		height: 22,
		position: 'absolute',
		right: 6
	},
	walletSbIcon: {
		width: 20,
		height: 20,
		marginRight: 6
	},
	walletSbIconBox: {
		flexDirection: 'row',
		marginBottom: 10
	},
	walletSbIconText: {
		flexWrap: 'wrap',
		fontSize: 12,
		width: width - 46,
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
	modalContainer: {
		width,
		height,
		backgroundColor: 'rgba(0, 0, 0, .6)',
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
	modalBodyText: {
		textAlign: 'center',
		alignItems: 'center'
	},
	gameUnfinishList: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: .9 * width - 30,
		marginBottom: 15,
	},
	gameUnfinishListBtn: {
		backgroundColor: '#25AAE1',
		borderRadius: 4,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		width: 120
	},
	modalBtn2: {
		backgroundColor: '#25AAE1',
		borderRadius: 8,
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
	modalTop: {
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#25AAE1',
		marginBottom: 20
	},
	moneyWalletTextBox1: {
		backgroundColor: '#06ADEF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 10
	},
	gamePageRight: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	gamePageRightText: {
		fontSize: 16,
		color: '#fff'
	},
	gamePageRightText1: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: 'bold'
	},
	moneyWalletTextBox: {
		alignItems: 'center',
		justifyContent: 'center',
		width: width / 2
	},
	moneyWalletText1: {
		color: '#fff',
		fontSize: 24,
		fontWeight: 'bold'
	},
	moneyWalletText: {
		color: '#fff'
	},
	viewLine: {
		height: 50,
		position: 'absolute',

		width: 1,
		left: width / 2,
		backgroundColor: '#fff'
	},
	modalTopText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold'
	},
	modalBody: {
		paddingBottom: 15,
		paddingHorizontal: 10,
		alignItems: 'center'
	},
	modalBtnBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10
	},
	modalBtn: {
		height: 36,
		width: (width * .9 - 40) * .6,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4
	},
	carouselImg: {
		width,
		height,
	},
	closeBtn: {
		height: 50,
		position: 'absolute',
		bottom: 70,
		width,
	},
	walletSbIconBox: {
		marginLeft: 6
	},
	walletSbIcon: {
		width: 18,
		height: 18
	},
	depositNoBox: {
		backgroundColor: '#6B6B6D',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 25
	},
	depositNoBoxText: {
		textAlign: 'center',
		color: '#fff',
		width: width - 100
	},
	depositNoBtn: {
		backgroundColor: '#5AC27E',
		borderRadius: 4,
		height: 34,
		width: 100,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 10
	},
	depositNoBtnText: {
		color: '#fff'
	},
	depositNoCloseBtn: {
		position: 'absolute',
		right: 10,
		top: 10
	},
	depositNoCloseBtnText: {
		color: '#fff',
		fontSize: 20
	},
	tranferAppiconBox: {
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomColor: '#59BA6D',
		height: 40,
	},
	tranferAppicon1: {
		width: 60,
		height: 30
	},
	tranferAppicon2: {
		width: 20,
		height: 8
	},
	tranferArrowBoxText: {
		color: ''
	},
	tranferArrowBox: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeModalBoxText: {
		fontSize: 22,
		color: '#fff',
		fontWeight: 'bold'
	},
	closeModalBox: {
		color: '#fff'
	},
	tranferAppicon3: {
		width: 50,
		height: 50,
		modalTop: 15,
		marginBottom: 5
	},
	tranferAppicon3Text: {
		fontSize: 16,
		color: '#FFFFFF',
		fontWeight: '500',
	},
	modalTopBox: {
		alignItems: 'center',
		marginBottom: 20
	},
	modalContainer1: {
		width,
		height,
		backgroundColor: '#1CBC64',
		paddingTop: 40,
		alignItems: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingBottom: height * .25
	},
	modalBounsListText: {
		color: '#545B5C'
	},
	modalBounsList: {
		backgroundColor: '#FFFFFF',
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginBottom: 10,
		width: width - 20
	},
	closeModalBtnText: {
		fontSize: 16
	},
	closeModalBtn: {
		width,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 30,
		height: 40,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
		justifyContent: 'center',
	}
})
