import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, Platform, Modal, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { changeHomeRegistLoginModalAction, changeDepositTypeAction, getBalanceInforAction, getPromotionListInforAction } from '../../../actions/ReducerAction'
import { toThousands } from '../../../actions/Reg'
import moment from 'moment'
import { WebView } from 'react-native-webview';
import LoadIngWebViewGif from './../../Common/LoadIngWebViewGif'
import * as Animatable from 'react-native-animatable'
import { removeVendorToken } from '../../SbSports/lib/js/util';
import { GameLockText, GameMaintenanceText } from './../../Common/CommonData'
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
class PreferentialPageContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			promotionsDetail: this.props.promotionsDetail,
			loadD: true,
			unfinishedGames: '',
			unfinishedGamesMessages: '',
			isShowunfinishedGames: false,
			isShowDeposit: false,
			bonusProductList: []
		}
	}



	componentWillMount() {
		Toast.hide()
	}

	postSosBonusVerifications(bonusProductList) {
		if (Array.isArray(bonusProductList) && bonusProductList.length) {
			let bonusID = bonusProductList[0].bonusID
			bonusID && window.PiwikMenberCode('Promo Application', 'Submit', `Apply_${bonusID}_PromoPage`)
		}
		if (!ApiPort.UserLogin) {
			this.changePromotionsModalStatus(true)
			return
		}

		const memberInfor = this.props.memberInforData
		let FirstName = memberInfor.FirstName
		if (!FirstName) {
			Actions.Verification({
				fillType: 'name'
			})
			return
		}


		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableBonusApplication && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PostSosBonusVerifications, 'POST').then(res => {
			// 			sosRate: 100
			// dailyAccumulateAmount: 0
			// dailyRemainAmount: 200
			// sosApplyAmount: 30
			// sosCalculatedAmount: 30
			// sosRedeemAmount: 30
			// isSuccess: true
			Toast.hide()
			if (res.isSuccess) {
				this.postSosBonusApplications(bonusProductList)
			} else {
				let errors = res.errorMessage
				Toast.fail(errors || 'สมัครไม่สำเร็จ', 2)

				let unfinishedGames = res.unfinishedGames
				let unfinishedGamesMessages = res.unfinishedGamesMessages
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
		}).catch(err => {
			Toast.hide()
		})
	}

	postSosBonusApplications(bonusProductList) {
		let bonusID = bonusProductList[0].bonusID
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.ChangeSosBonusApplications + 'bonusID=' + bonusID + '&', 'POST').then(res => {
			// 			isSosApplied: true
			// message: 'Chúc mừng bạn đã đăng ký khuyến mãi thành công!'
			// isSuccess: true
			Toast.hide()
			if (res.isSuccess && res.isSosApplied) {
				Toast.success(res.message, 2)
				Actions.pop()
				this.props.getBalanceInforAction()
				this.props.getPromotionListInforAction()
			} else {
				Toast.fail(res.message, 2)



			}
		}).catch(err => {
			Toast.hide()
		})
	}

	submitMemberInfor() {
		const { promotionsDetail } = this.state
		let bonusID = promotionsDetail.bonusId
		bonusID && !this.props.isEuro && window.PiwikMenberCode('Promo Application', 'Submit', `Apply_${bonusID}_PromoPage`)
		if (this.props.isEuro) {
			//欧冠优惠
			PiwikMenberCode('Promo Application​', 'Submit', `Apply_(${this.props.promotionsDetail.contentId})`)
		}
		if (!ApiPort.UserLogin) {
			this.changePromotionsModalStatus(true)
			return
		}


		const memberInfor = this.props.memberInforData
		let FirstName = memberInfor.FirstName
		if (!FirstName) {
			Actions.Verification({
				fillType: 'name'
			})
			return
		}


		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableBonusApplication && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}
		let fromPage = this.props.fromPage
		Actions.PreferentialApplication({
			promotionsDetail,
			fromPage,
			changeTab: (index) => {
				this.props.changeTab && this.props.changeTab(index)
			}
		})
	}

	changePromotionsModalStatus() {
		if (this.props.isEuro) {
			window.EuroLoginShow && window.EuroLoginShow()
			return
		}
		this.props.changeHomeRegistLoginModalAction({
			flag: true,
			page: 'home'
		})
	}

	postClaim() {
		const { promotionsDetail } = this.state
		const bonusProductList = promotionsDetail.bonusProductList
		if (Array.isArray(bonusProductList) && bonusProductList.length) {
			let bonusID = bonusProductList[0].bonusID
			bonusID && window.PiwikMenberCode('Promo Application', 'Submit', `Apply_${bonusID}_PromoPage`)
		}


		if (!ApiPort.UserLogin) {
			this.changePromotionsModalStatus(true)
			return
		}

		const memberInfor = this.props.memberInforData
		let FirstName = memberInfor.FirstName
		if (!FirstName) {
			Actions.Verification({
				fillType: 'name'
			})
			return
		}


		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableBonusApplication && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let params = {
			playerBonusId: promotionsDetail.playerBonusId
		}
		fetchRequest(ApiPort.PostClaim + '?', 'POST', params).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				if (res.isClaimSuccess) {
					this.props.getBalanceInforAction()
					let message = res.messag
					Toast.success(message ? message : 'การอัปเดตสำเร็จ', 2)
					Actions.pop()
					let fromPage = this.props.fromPage
					if (fromPage) {
						if (fromPage === 'PreferentialRecords') {
							this.props.getPromotionsApplications && this.props.getPromotionsApplications()
						} else if (fromPage === 'preferentialPage') {
							this.props.getPromotionListInforAction()
						}
					}
				} else {
					Toast.fail(res.message, 2)
				}
			} else {
				Toast.fail(res.message, 2)
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	getSubmitBtnStatus(promotionsDetail) {
		const { type, status, isClaimable, bonusProduct, bonusProductList, promotionMasterCategory } = promotionsDetail
		let typeUpperCase = type.toLocaleUpperCase()
		let statusUpperCase = status.toLocaleUpperCase().replace(/\s/g, '')
		let promotionMasterCategoryUpperCase = promotionMasterCategory.toLocaleUpperCase()
		if (this.props.freebetType) {
			return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={() => {
				Actions.FreebetSetting({
					promotionsDetail,
					getPromotionsApplications: () => {
						this.props.getPromotionsApplications()
					}
				})
			}}>
				<Text style={styles.closeBtnText}>รับโบนัส</Text>
			</TouchableOpacity>
		}
		if (typeUpperCase === 'BONUS' || typeUpperCase === 'DAILYDEALS') {
			if (statusUpperCase === 'SERVING') {// 1
				let [progress1, progress2] = bonusProductList[0].progress.split('/').map(v => v)
				return <View style={[styles.closeBtnWrap, { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#DFDFDF', height: 56 }]}>
					<View style={[styles.progress]}>
						<AnimatableView
							animation={'fadeInLeftBig'}
							easing='ease-out'
							iterationCount='1'
							style={[styles.progressBar, { width: (width - 20) * ((bonusProductList[0].percentage ? bonusProductList[0].percentage : 0) / 100) }]}></AnimatableView>
					</View>
					<Text style={[styles.closeBtnText, { color: '#111111', fontWeight: 'normal', fontSize: 12 }]}>กรุณาเดิมพันเพิ่ม <Text style={{ fontWeight: 'bold' }}>{progress2}</Text> รับโบนัส <Text style={{ fontWeight: 'bold' }}>{toThousands(bonusProductList[0].bonusAmount)}</Text></Text>
				</View>
			} else if (statusUpperCase === 'RELEASE') {
				const isClaimable = bonusProductList[0].isClaimable
				if (isClaimable) {// 领取 1
					return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.postClaim.bind(this)}>
						<Text style={styles.closeBtnText}>ต้องการ</Text>
					</TouchableOpacity>
				} else {
					return this.createNoButton()
				}
			} else if (statusUpperCase === 'SERVED') {// 已领取 1
				return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#E5E5E5' }]}>
					<Text style={[styles.closeBtnText, { color: '#727272' }]}>รับ</Text>
				</TouchableOpacity>
			} else if (statusUpperCase === 'FORCETOSERVED') {// 已领取 1
				return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#E5E5E5' }]}>
					<Text style={[styles.closeBtnText, { color: '#727272' }]}>รับ</Text>
				</TouchableOpacity>
			} else if (statusUpperCase === 'WAITINGFORRELEASE') {
				return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#DFDFDF' }]}>
					<Text style={styles.closeBtnText}>รอการอนุมัติ</Text>
				</TouchableOpacity>
			} else if (statusUpperCase === 'AVAILABLE') {// 0
				// If wallet has sufficient requirement redirect to Transfer page, else redirect Deposit page with the selected bonus.
				if (this.props.isEuro && (!promotionsDetail.bonusProductList || (promotionsDetail.bonusProductList && promotionsDetail.bonusProductList[0].bonusProduct != 'SB'))) {
					//欧冠不是SB钱包不显示领取
					return <View />
				}
				return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.goFinancePage.bind(this, bonusProductList)}>
					<Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
				</TouchableOpacity>
			} else if (statusUpperCase === 'PENDING') {
				return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#E5E5E5' }]}>
					<Text style={[styles.closeBtnText, { color: '#727272' }]}>รอการอนุมัติ</Text>
				</TouchableOpacity>
			} else {
				return this.createNoButton()
			}
		} else if (typeUpperCase === 'MANUAL') {
			if (statusUpperCase === 'AVAILABLE') {
				if (this.props.isEuro && (!promotionsDetail.bonusProductList || (promotionsDetail.bonusProductList && promotionsDetail.bonusProductList[0].bonusProduct != 'SB'))) {
					//欧冠不是SB钱包不显示领取
					return <View />
				}
				// show bonus application form
				return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.submitMemberInfor.bind(this)}>
					<Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
				</TouchableOpacity>
			} else {
				return this.createNoButton()
			}
		} else if (typeUpperCase === 'OTHER') { // 1
			return this.createNoButton()
		} else if (typeUpperCase === 'SOS') {
			//if (promotionMasterCategoryUpperCase === 'OTHERSPROMOTION') {
			return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.postSosBonusVerifications.bind(this, bonusProductList)}>
				<Text style={styles.closeBtnText}>ร่วมสนุกตอนนี้</Text>
			</TouchableOpacity>
			//}
		} else {
			return this.createNoButton()
		}
	}

	createNoButton() {
		return <View style={[styles.closeBtnWrap, {
			backgroundColor: '#b7b7b7'
		}]}>
			<Text style={styles.closeBtnText}>สมัครอัตโนมัติ</Text>
		</View>
	}

	goFinancePage(bonusProductList) {
		if (Array.isArray(bonusProductList) && bonusProductList.length && !this.props.isEuro) {
			let bonusID = bonusProductList[0].bonusID
			bonusID && window.PiwikMenberCode('Promo Application', 'Submit', `Apply_${bonusID}_PromoPage`)
		}
		if (this.props.isEuro) {
			//欧冠优惠
			PiwikMenberCode('Promo Application​', 'Submit', `Apply_(${this.props.promotionsDetail.contentId})`)
		}
		if (!ApiPort.UserLogin) {
			this.changePromotionsModalStatus(true)
			return
		}
		let selfExclusions = this.props.selfExclusionsData
		if (selfExclusions.DisableDeposit && selfExclusions.SelfExcludeDuration > 0) {
			let SelfExcludeSetDate = moment(selfExclusions.SelfExcludeSetDate).format('YYYY-MM-DD')
			Toast.fail(`คุณได้ทำการตั้งค่าควบคุมการเดิมพันเมื่อวันที่  ${SelfExcludeSetDate} เป็นเวลา (${selfExclusions.SelfExcludeDuration}วัน). หากคุณต้องการความช่วยเหลือกรุณาติดต่อห้องช่วยเหลือสด`, 1500)
			return
		}
		const memberInfor = this.props.memberInforData
		let FirstName = memberInfor.FirstName
		if (FirstName) {
			if (!this.props.balanceInforData.length) return
			if (this.props.isEuro) {
				//欧冠优惠
				Actions.pop()
			}

			let total = this.props.balanceInforData.filter(v => v.name.toLocaleUpperCase() === 'TOTALBAL')[0].balance
			let fromPage = this.props.fromPage
			if (Array.isArray(bonusProductList) &&
				bonusProductList.length &&
				bonusProductList[0].bonusApplicableSite &&
				bonusProductList[0].bonusApplicableSite.toLocaleUpperCase().replace(/\s/g, '') === 'DEPOSITPAGEONLY') {
				// Actions.DepositStack({
				// 	isEuro: this.props.isEuro,
				// 	fromPage,
				// 	bonusProductList: bonusProductList[0],
				// 	bonusApplicableSite: true
				// })
				this.setState({
					isShowDeposit: true,
					bonusProductList: bonusProductList[0]
				})
			} else {
				if (total <= 0) {
					this.setState({
						isShowDeposit: true,
						bonusProductList: bonusProductList[0]
					})
				} else {
					Actions.TransferStack({
						isEuro: this.props.isEuro,
						fromPage,
						bonusProductList: bonusProductList[0],
						getPromotionsApplications: () => {
							this.props.getPromotionsApplications()
						}
					})
				}
			}
		} else {
			Actions.Verification({
				fillType: 'name'
			})
		}
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

	render() {
		const { bonusProductList, isShowDeposit, isShowunfinishedGames, unfinishedGames, unfinishedGamesMessages, loadD, promotionsDetail } = this.state
		return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#000', paddingBottom: this.getSubmitBtnStatus(promotionsDetail) == null ? 0 : 50 }]}>
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

			<Modal animationType='fade' transparent={true} visible={isShowDeposit}>
				<View style={[styles.modalContainer]}>
					<View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', width: width * .9, }]}>
						<View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#25AAE1' : '#212121', alignItems: 'flex-start', paddingLeft: 20 }]}>
							<Text style={styles.modalTopText}>ยอดเงินไม่เพียงพอ</Text>
						</View>
						<View style={styles.modalBody}>
							<Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
								ยอดเงินในบัญชีไม่เพียงพอ กรุณาทำรายการฝาก
							</Text>

							<View style={{ alignItems: 'center' }}>
								<TouchableOpacity style={styles.modalBtn2} onPress={() => {
									this.setState({
										isShowDeposit: false
									})
									Actions.DepositStack({
										isEuro: this.props.isEuro,
										fromPage: this.props.fromPage,
										bonusProductList,
										getPromotionsApplications: () => {
											this.props.getPromotionsApplications()
										}
									})
								}}>
									<Text style={styles.modalBtnText2}>ฝากเงิน</Text>
								</TouchableOpacity></View>
						</View>
					</View>
				</View>
			</Modal>

			<WebView
				source={{
					uri: promotionsDetail.modalHtml,
					headers: {
						'Authorization': ApiPort.Token ? ApiPort.Token : '',
						'Content-Type': 'application/json charset=utf-8',
						'Culture': 'th-th',
					}
				}}
				originWhitelist={['*']}
				onLoadStart={(e) => this.setState({ loadD: true })}
				onLoadEnd={(e) => this.setState({ loadD: false })}
				scalesPageToFit={Platform.OS === 'ios' ? false : true}
				style={{ width: width, flex: 1 }}
				injectedJavaScript={`var ele = document.getElementById('modal-promo')
					if (ele) {
						ele.style.WebkitOverflowScrolling = 'touch'
					}`}
			/>


			<LoadIngWebViewGif loadStatus={loadD} />

			{
				this.getSubmitBtnStatus(promotionsDetail)
			}
		</View>
	}
}

export default PreferentialPage = connect(
	(state) => {
		return {
			balanceInforData: state.balanceInforData,
			memberInforData: state.memberInforData,
			selfExclusionsData: state.selfExclusionsData
		}
	}, (dispatch) => {
		return {
			changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
			getPromotionListInforAction: () => dispatch(getPromotionListInforAction())
		}
	}
)(PreferentialPageContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		position: 'relative',
	},
	closeBtnWrap: {
		position: 'absolute',
		bottom: 40,
		height: 40,
		backgroundColor: '#33C85D',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 100,
		width: width - 20,
		marginHorizontal: 10,
		borderRadius: 4
	},
	closeBtnText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#fff'
	},
	progress: {
		height: 8,
		width: width - 20,
		borderRadius: 6,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: '#D4D2D2',
		marginBottom: 4
	},
	progressBar: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		backgroundColor: '#00AEEF'
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
	gameUnfinishListImgBtn: {
		borderRadius: 5,
		overflow: 'hidden'
	},
	gameUnfinishListImg: {
		width: (.9 * width - 30 - 120) * .9,
		height: (.9 * width - 30 - 120 * .9) * .48
	},
	gameUnfinishListText: {
		color: '#FFFFFF',
		fontSize: 16
	},
	modalTopText: {
		color: '#fff',
		textAlign: 'left'
	},
	reasonText: {
		textAlign: 'center'
	}
})
