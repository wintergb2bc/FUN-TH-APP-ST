import React, { Component } from 'react'
import { ActivityIndicator, Text, StyleSheet, View, Image, ScrollView, TouchableOpacity, Dimensions, Linking, RefreshControl, Modal, Platform } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import Touch from 'react-native-touch-once'
import { maskPhone, maskEmail } from '../../actions/Reg'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction, changeHomeRegistLoginModalAction } from './../../actions/ReducerAction'
import { connect } from 'react-redux'
import moment from 'moment'
import { toThousands, getName } from '../../actions/Reg'
import { DepositDatas } from './../Common/CommonData'

let { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View

class PersonalAccountContainer extends Component {
	constructor(props) {
		super(props)
		this.actionToPage = this.actionToPage.bind(this)
		this.state = {
			checked: true,
			currentLevelRank: '',
			memberInfo: '',
			walletsInfor: [],
			memberInfoFlag: false,
			TotalBal: 0,
			refreshing: false,
			modalType: '',
			VietIntroAFriendUrl: '',
			AppGameDomain: '',
			Fun88RewardUrl: window.isSTcommon_url ? 'http://member.stagingp4.fun88.biz/lm/?lng=TH' : 'https://www.luckyf99.com/th-th',
			affiliateUrlLM: '',
			isShowVersion: false,
			emailStatus: true,
			email: '',
			phoneStatus: true,
			phone: '',
			isUpload: '',
			isEligible: false,
			leaderboardUrl: '',
			isShowInforView: false,
			isCDUActivate: '',
			// isShowUploadFileView: false,
			isFinishMemberInfor: false,
			isFinishContactInformation: false
		}
	}

	componentDidMount() {
		//this.getVietIntroAFriendUrl()
		//this.getDomain()
		if (!ApiPort.UserLogin) return
		if (this.props.memberInforData && this.props.balanceInforData.length) {
			let memberInforData = this.props.memberInforData
			this.setState({
				memberInfo: memberInforData,
				memberInfoFlag: true,
				TotalBal: this.props.balanceInforData.find(v => v.name === 'TOTALBAL').balance
			})

		}
		this.getCDUActivateStatus()
		this.GetLeaderboard()


		//this.getPromotionSummary()
		this.props.getMemberInforAction()
		this.props.getBalanceInforAction()
		this.getMemberDetailInfor(this.props.memberInforData)
		//this.props.getWalletsInforAction()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps) {
			if (nextProps.memberInforData) {
				let memberInforData = nextProps.memberInforData
				this.setState({
					memberInfo: memberInforData,
					memberInfoFlag: true,
				})
			}
			if (nextProps.balanceInforData.length) {
				this.setState({
					memberInfoFlag: true,
					TotalBal: nextProps.balanceInforData.find(v => v.name === 'TOTALBAL').balance
				})
			}
		}

		if (nextProps && nextProps.memberInforData) {
			this.getMemberDetailInfor(nextProps.memberInforData)
		}
	}

	async getCDUActivateStatus() {
		if (!ApiPort.UserLogin) return
		let getExcludedAffiliate = await this.getExcludedAffiliate()
		if (getExcludedAffiliate.isSuccess) {
			let getWithdrawalNotification = await this.getWithdrawalNotification()
			if (Array.isArray(getWithdrawalNotification) && getWithdrawalNotification.length) {
				let kycRuleId = getWithdrawalNotification[0].kycRuleId
				if (kycRuleId == 5) {
					this.getCDUActivateWrap()
				} else { //Hide Document Upload Page
					this.setState({
						//isShowUploadFileView: false
						isUpload: ''
					})
				}
			}
		} else {
			this.getCDUActivateWrap()
		}
	}

	async getCDUActivateWrap() {
		// this.setState({
		// 	isShowUploadFileView: true
		// })
		let getCDUActivate = await this.getCDUActivate()
		if (getCDUActivate.isSuccess) {//Upload Document "ใหม่" new
			this.setState({
				isUpload: 'NEW'
			})
		} else {//Upload Document "Coming Soon"
			this.setState({
				isUpload: 'เร็วๆนี้'
			})
		}
	}


	async getExcludedAffiliate(list0) {
		return fetchRequest(ApiPort.KYCVerification + 'getExcludedAffiliate?', 'GET')
	}

	async getCDUActivate() {
		return fetchRequest(ApiPort.KYCVerification + 'getCDUActivate?', 'GET')
	}


	async getWithdrawalNotification() {
		return fetchRequest(ApiPort.KYCVerification + 'getWithdrawalNotification?withdrawalAmt=' + 0 + '&', 'GET')
	}



	GetLeaderboard() {
		if (!ApiPort.UserLogin) return
		fetchRequest(ApiPort.GetLeaderboard, 'GET').then(res => {
			let isEligible = res.isEligible
			this.setState({
				isEligible: res.isEligible,
				refreshing: false
			})
			if (isEligible) {
				let leaderboard = res.leaderboard
				if (leaderboard) {
					let data = leaderboard.data
					if (data) {
						this.setState({
							leaderboardUrl: data.url
						})
					}
				}
			}
		})
	}

	getMemberDetailInfor(memberInfor) {
		if (!((Boolean(memberInfor) && Boolean(memberInfor.MemberCode)))) return
		const phoneData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
		let phoneStatus = phoneData ? (phoneData.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
		const phone = phoneData ? phoneData.Contact : ''
		const emailData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
		let emailStatus = emailData ? (emailData.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
		const email = emailData ? emailData.Contact : ''
		let line = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'line')
		let isLineCode = line ? Boolean(line.Contact) : false
		this.setState({
			emailStatus,
			phoneStatus,
			memberInfor,
			phone,
			email,
			isShowInforView: !(!emailStatus && !phoneStatus && memberInfor.FirstName.length > 0),
			isFinishMemberInfor: !Boolean(memberInfor.FirstName && memberInfor.DOB && memberInfor.Gender && memberInfor.SecurityAnswer),
			isFinishContactInformation: !Boolean(memberInfor.Address.Address && memberInfor.Address.City && memberInfor.Address.Country && isLineCode && memberInfor.OfferContacts.TimeRange != '0000')
		})
	}

	getDomain() {
		global.storage.load({
			key: 'Fun88RewardUrl',
			id: 'Fun88RewardUrl'
		}).then(Fun88RewardUrl => {
			this.setState({
				Fun88RewardUrl
			})
		}).catch(() => { })
		fetchRequest(ApiPort.GetRewardURLs, 'GET').then(res => {
			Toast.hide()
			//if (res.isSuccess) {
			let Fun88RewardUrl = res.Fun88RewardUrl
			this.setState({
				Fun88RewardUrl
			})
			global.storage.save({
				key: 'Fun88RewardUrl',
				id: 'Fun88RewardUrl',
				data: Fun88RewardUrl,
				expires: null
			})
			//}
		}).catch(err => {
			Toast.hide()
		})
	}

	getPromotionSummary(flag) {
		fetchRequest(ApiPort.GetPromotionSummary, 'GET').then(res => {
			Toast.hide()
			if (flag) {
				this.setState({
					refreshing: false
				})
			}
			if (res.isSuccess) {
				this.setState({
					currentLevelRank: res.rewardPointInfo.currentLevelRank - 1
				})
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	//跳轉
	async actionToPage(key, piwikMenberText) {
		const { isUpload, leaderboardUrl } = this.state
		if (key == 'Uploadfile') {
			window.PiwikMenberCode('Account', 'Submit', 'CDU_ProfilePage')
		} else if (key == 'RecommendPage') {
			window.PiwikMenberCode('Promo', 'View', 'RAF_ProfilePage')
		} else if (key == 'Leaderboard') {
			window.PiwikMenberCode('Promo', 'Click', 'Tournament_ProfilePage')
		} else if (key == 'BettingHistory') {
			window.PiwikMenberCode('Account', 'View', 'BetRecord_ProfilePage')
		} else if (key == 'FastLogin') {
			window.PiwikMenberCode('Account', 'Click', 'QuickLogin_ProfilePage')
		}

		if (['HelpCenter', 'RecommendPage'].includes(key)) {
			if ('RecommendPage' == key) {
				Actions.Recommend()
				return
			}
			Actions[key]()
			return
		}

		if (!ApiPort.UserLogin) {
			this.props.changeHomeRegistLoginModalAction({
				flag: true,
				page: 'profile'
			})
			return
		}

		if (key == 'Leaderboard') {
			if (leaderboardUrl == '') {
				return
			}
		}

		if (key == 'Uploadfile') {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
			let getWithdrawalNotification = await this.getWithdrawalNotification()
			Toast.hide()
			let kycRuleId = getWithdrawalNotification[0].kycRuleId
			if (kycRuleId == 0) {
				Actions[key]({
					isUpload: '',
					leaderboardUrl,
					username: userNameDB.toLowerCase()
				})
				return
			}
		}

		Actions[key]({
			isUpload,
			leaderboardUrl,
			username: userNameDB.toLowerCase()
		})
	}

	getVietIntroAFriendUrl() {
		global.storage.load({
			key: 'AppURLs',
			id: 'AppURLs'
		}).then(res => {
			this.setState({
				VietIntroAFriendUrl: res.ThaiIntroAFriendUrl,
				affiliateUrlLM: res.affiliateUrlLM,
				AppGameDomain: res.AppGameDomain
			})
		}).catch(() => { })
		fetchRequest(ApiPort.GetAppURLs, 'GET').then(res => {
			Toast.hide()
			this.setState({
				VietIntroAFriendUrl: res.ThaiIntroAFriendUrl,
				affiliateUrlLM: res.affiliateUrlLM,
				AppGameDomain: res.AppGameDomain
			})
			global.storage.save({
				key: 'AppURLs',
				id: 'AppURLs',
				data: res,
				expires: null
			})
		}).catch(err => {
			Toast.hide()
		})
	}


	Mlogout() {
		globalLogout(true)
		window.PiwikMenberCode('Logout_profile')
	}

	refreshingHome() {
		if (!ApiPort.UserLogin) return
		this.setState({
			refreshing: true
		})
		this.getCDUActivateStatus()
		this.GetLeaderboard()
		//this.getVietIntroAFriendUrl()
		//this.getDomain()
		//this.getPromotionSummary(true)
		this.props.getMemberInforAction()
		this.props.getBalanceInforAction()
	}

	openBrowserGame(modalType) {
		this.setState({
			modalType
		})
	}

	closeBrowserGame() {
		const { Fun88RewardUrl, affiliateUrlLM } = this.state
		if (this.state.modalType === 'Fun88RewardUrl' && Fun88RewardUrl) {
			Linking.openURL(Fun88RewardUrl)
		}
		// if (this.state.modalType === 'agent' && affiliateUrlLM) {
		// 	Linking.openURL(affiliateUrlLM)
		// }
		if (this.state.modalType === 'download') {
			Linking.openURL('https://773fn.com')
		}
		this.setState({
			modalType: ''
		})
	}

	reloadPersonalAccountState(isShowVersion) {
		this.setState({
			isShowVersion
		})
	}

	goVerification(name) {
		const { memberInfor } = this.state
		// if (memberInfor.FirstName) {
		Actions.Verification({
			fillType: name,
			fromPage: 'ContactInformation',
			ServiceAction: 'ContactVerification'
		})
		// } else {
		// Actions.Verification({
		// 	fillType: 'name',
		// 	nextPage: name,
		// 	fromPage: 'ContactInformation',
		// 	ServiceAction: 'ContactVerification'
		// })
		// }
	}



	handleViewRef = ref => this.handlePersonalAccountView = ref

	render() {
		const { affiliateUrlLM, Fun88RewardUrl, isFinishContactInformation, isFinishMemberInfor, isShowUploadFileView, isShowInforView, isEligible, isUpload, isShowVersion, emailStatus, phoneStatus, currentLevelRank, memberInfo, phone, email, checked, refreshing, TotalBal, memberInfoFlag, modalType } = this.state
		const managerListsBackgroundColor = window.isBlue ? '#fff' : '#212121'
		const managerListsStyle = [styles.managerLists, { backgroundColor: managerListsBackgroundColor }]
		const managerListsText = { color: window.isBlue ? 'rgba(0, 0, 0, .5)' : '#fff' }
		const arrowRightImg = require('./../../images/common/arrowIcon/right0.png')

		window.reloadPersonalAccountState = (isShowVersion) => {
			this.reloadPersonalAccountState(isShowVersion)
		}
		window.makePersonalAccountPageAnimatable = (translateX) => {
			window.mainPageIndex = 4
			window.makeFadeInTranslation && this.handlePersonalAccountView && this.handlePersonalAccountView && this.handlePersonalAccountView.animate(window.makeFadeInTranslation(translateX), 300)
		}
		return <AnimatableView ref={this.handleViewRef} easing={'ease-in-out'} style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#00AEEF' : '#212121' }]}>
			<Modal transparent={true} visible={modalType.length > 0} animationType='fade'>
				<View style={[styles.modalContainer]}>
					<View style={styles.modalBox}>
						<View style={{ backgroundColor: '#00AEEF', alignItems: 'center', justifyContent: 'center', height: 40 }}>
							<Text style={{ color: '#FFFFFF' }}>แจ้งเตือน</Text>
						</View>
						<Text style={styles.modalBodyText}>เปิดใช้งานด้วยเบราว์เซอร์</Text>
						<View style={styles.modalBtnWrap}>
							<TouchableOpacity style={[styles.modalBtn, styles.modalBtn1]} onPress={() => {
								this.setState({
									modalType: ''
								})
							}}>
								<Text style={styles.modalBtnText}>ยกเลิก</Text>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#00AEEF' }]} onPress={() => {
								this.closeBrowserGame()
							}}>
								<Text style={[styles.modalBtnText, { color: '#fff' }]}>ยืนยัน</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			<Modal transparent={true} visible={isShowVersion} animationType='fade'>
				<View style={[styles.modalContainer]}>
					<View style={styles.modalBox}>
						<Text style={styles.modalBodyText}>Bạn đang sử dụng phiên bản mới nhất</Text>
						<TouchableOpacity style={[styles.modalBtnWrap1]} onPress={() => {
							this.setState({
								isShowVersion: false
							})
						}}>
							<Text style={[styles.modalBtnWrap1Text]}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			{
				ApiPort.UserLogin && isShowInforView && <View style={styles.depositNoBox}>
					<Text style={styles.depositNoBoxText}>3 ขั้นตอนในการถอนเงินอย่างรวดเร็ว</Text>
					{
						<Text style={styles.depositNoBoxText}>1.ชื่อ</Text>
					}

					{
						<Text style={styles.depositNoBoxText}>2.อีเมล</Text>
					}


					{
						<Text style={styles.depositNoBoxText}>3.เบอร์โทร</Text>
					}

					<TouchableOpacity style={styles.depositNoCloseBtn} onPress={() => {
						this.setState({
							isShowInforView: false
						})
					}}>
						<Text style={styles.depositNoCloseBtnText}>X</Text>
					</TouchableOpacity>
				</View>
			}
			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						tintColor={'#fff'}
						onRefresh={this.refreshingHome.bind(this)}
					/>
				}
			>

				<View style={{ backgroundColor: window.isBlue ? '#EDEDED' : '#000' }}>
					{
						ApiPort.UserLogin ? <View>
							<View style={{ backgroundColor: '#00AEEF' }}>
								{
									!memberInfoFlag && <View style={styles.registIpkLoadFlag}>
										<ActivityIndicator size='large' color='#fff' />
									</View>
								}


								<View style={styles.inforList}>
									<Text style={styles.inforListText1}>ยูสเซอร์เนม</Text>
									{
										memberInfoFlag && <Text style={styles.inforListText2}>{userNameDB}</Text>
									}
								</View>
								<View style={styles.inforList}>
									<Text style={styles.inforListText1}>ไอดีสมาชิก</Text>
									{
										memberInfoFlag && <Text style={styles.inforListText2}>{memberInfo.MemberCode}</Text>
									}
								</View>
								<View style={styles.inforList}>
									<Text style={styles.inforListText1}>วันที่ลงทะเบียน</Text>
									{
										memberInfoFlag && <Text style={styles.inforListText2}>{moment(memberInfo.RegisterDate).format('YYYY/MM/DD')}</Text>
									}
								</View>

								<View style={styles.inforList}>
									<Text style={styles.inforListText1}>ชื่อจริง</Text>
									{
										memberInfoFlag && <Text style={[styles.inforListText2, {
											opacity: memberInfo.FirstName.length <= 0 ? .5 : 1
										}]}>{memberInfo.FirstName.length <= 0 ? 'ชื่อจริงของคุณ' : getName(memberInfo.FirstName)}</Text>
									}


									{
										memberInfoFlag && memberInfo.FirstName.length <= 0 &&
										<Touch
											onPress={this.goVerification.bind(this, 'name')}
											style={styles.phoneBox}>
											<Text style={{ color: '#fff' }}>ยืนยันเลย</Text>
										</Touch>
									}
								</View>

								<View style={styles.inforList}>
									<Text style={styles.inforListText1}>อีเมล</Text>
									{
										memberInfoFlag && <Text style={styles.inforListText2}>{maskEmail(email)}</Text>
									}


									{
										memberInfoFlag && (
											emailStatus
												?
												<Touch
													onPress={this.goVerification.bind(this, 'email')}
													style={styles.phoneBox}>
													<Text style={{ color: '#fff' }}>ยืนยันเลย</Text>
												</Touch>
												:
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													<Image resizeMode='stretch' source={require('./../../images/account/check2.png')} style={[styles.checkedImg]}></Image>
													<Text style={{ color: '#fff' }}>ยืนยันแล้ว</Text>
												</View>
										)
									}
								</View>


								<View style={styles.inforList}>
									<Text style={styles.inforListText1}>เบอร์โทร</Text>
									{
										memberInfoFlag && <Text style={styles.inforListText2}>{`**_${maskPhone(phone.split('-').length === 2 ? phone.split('-')[1] : phone.split('-')[0])}`}</Text>
									}


									{
										memberInfoFlag && (
											phoneStatus
												?
												<Touch
													onPress={this.goVerification.bind(this, 'phone')}
													style={styles.phoneBox}>
													<Text style={{ color: '#fff' }}>ยืนยันเลย</Text>
												</Touch>
												:
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													<Image resizeMode='stretch' source={require('./../../images/account/check2.png')} style={[styles.checkedImg]}></Image>
													<Text style={{ color: '#fff' }}>ยืนยันแล้ว</Text>
												</View>
										)
									}
								</View>
								{
									memberInfoFlag && <Text style={{ color: 'rgba(255, 255, 255, .6)', textAlign: 'center', paddingVertical: 15 }}>เข้าสู่ระบบล่าสุด:  {moment(memberInfo.LastLoginTime).format('YYYY/MM/DD')}</Text>
								}
							</View>


							<View style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, backgroundColor: '#059DD6' }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
									<Text style={{ color: 'rgba(255, 255, 255, .5)' }}>ยอดรวม</Text>
									<Text style={{ color: '#fff', fontSize: 18, marginLeft: 15 }}>{toThousands(TotalBal)}</Text>
								</View>

								<Touch style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => {
									window.goFinancePage()

									piwikMenberText && window.PiwikMenberCode('Account', 'Click', 'Bankinginfo_ProfilePage')
								}}>
									<Text style={{ color: '#fff', marginRight: 10 }}>ดูทั้งหมด</Text>
									<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
								</Touch>
							</View>

							<Text style={{ color: '#4A4A4A', paddingVertical: 10, paddingHorizontal: 10 }}>ตั้งค่า : อัปเดตประวัติ</Text>
						</View>
							:
							<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/managerwhiteBanner.png')} style={[{ width, height: width * .574 }]}></Image>
					}



					<View style={managerListsStyle}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('FavoriteBet') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account1.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>การเดิมพันที่ชอบ</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					<View style={managerListsStyle}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('MemberInfor') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account4.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>ข้อมูลทั่วไปของคุณ</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								{
									isFinishMemberInfor && <Text style={{ color: '#969696', fontSize: 16 }}>แก้ไข</Text>
								}
								<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, {
									marginLeft: 15
								}]}></Image>
							</View>
						</Touch>
					</View>


					<View style={managerListsStyle}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('ContactInformation') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account2.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>ข้อมูลการติดต่อ</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								{
									isFinishContactInformation && <Text style={{ color: '#969696', fontSize: 16 }}>แก้ไข</Text>
								}
								<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, {
									marginLeft: 15
								}]}></Image>
							</View>
						</Touch>
					</View>

					{
						Boolean(isUpload.length) && <View style={[...managerListsStyle]}>
							<Touch style={styles.managerListsTouch} onPress={() => this.actionToPage('Uploadfile', 'CDU_profile')}>
								<View style={styles.managerListsLeft}>
									<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account3.png')} style={styles.managerListsImg}></Image>
									<Text style={managerListsText}>อัพโหลดเอกสาร</Text>
								</View>
								<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
									{
										isUpload.length > 0 &&
										<View style={{
											backgroundColor: isUpload == 'NEW' ? '#54B968' : 'red',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 1000,
											paddingHorizontal: 10,
											height: 28
										}}>
											<Text style={{ color: '#fff', fontSize: 12 }}>{isUpload}</Text>
										</View>
									}
									<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, {
										marginLeft: 15
									}]}></Image>
								</View>

							</Touch>
						</View>
					}




					<View style={[...managerListsStyle, { marginTop: 8 }]}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('RecommendPage', 'Referfriend_profile') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account5.png')} style={[styles.managerListsImg, { height: 25 }]}></Image>
								<Text style={managerListsText}>แนะนำเพื่อน</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					{
						isEligible && <View style={[...managerListsStyle]}>
							<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('Leaderboard', 'Leaderboard') }}>
								<View style={styles.managerListsLeft}>
									<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account14.png')} style={styles.managerListsImg}></Image>
									<Text style={managerListsText}>ทัวร์นาเมนต์</Text>
								</View>
								<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
							</Touch>
						</View>
					}


					<View style={[...managerListsStyle]}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('BettingHistory', 'Betrecord_profile') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account6.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>ประวัติการเดิมพัน</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					<View style={[...managerListsStyle]}>
						<Touch style={styles.managerListsTouch} onPress={() => this.actionToPage('ChangePassword')}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account7.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>เปลี่ยนรหัสผ่าน</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					<View style={managerListsStyle}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('SafeCode', 'Passcode_Profile') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account8.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>รับรหัสความปลอดภัย</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					<View style={[...managerListsStyle]}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('LimitUser', 'Selfexclusion_profile') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account9.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>ตั้งค่าส่วนตัว</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#969696', fontSize: 16 }}>เปิด</Text>
								<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, {
									marginLeft: 15
								}]}></Image>
							</View>
						</Touch>
					</View>

					<View style={[...managerListsStyle,]}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('HelpCenter', '') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account10.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>ศูนย์ช่วยเหลือ</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>


					<View style={[managerListsStyle, styles.managerListsMargin]}>
						<Touch style={styles.managerListsTouch} onPress={() => { this.actionToPage('FastLogin') }}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={Platform.OS == 'ios' ? require('./../../images/account/accountIcon/account11.png') : require('./../../images/account/accountIcon/account111.png')} style={styles.managerListsImg}></Image>
								<Text style={managerListsText}>{Platform.OS == 'ios' ? 'Face ID / ยืนยันผ่านทัชไอดี' : 'เข้าสู่ระบบแบบรวดเร็ว'}</Text>
							</View>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#969696', fontSize: 16 }}>เปิด</Text>
								<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight, {
									marginLeft: 15
								}]}></Image>
							</View>
						</Touch>
					</View>


					<View style={[...managerListsStyle]}>
						<Touch style={styles.managerListsTouch} onPress={() => {
							//Linking.openURL(Fun88RewardUrl)
							this.openBrowserGame('Fun88RewardUrl')
						}}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account12.png')} style={[styles.managerListsImg, { height: 24 }]}></Image>
								<Text style={managerListsText}>พันธมิตร</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					<View style={[...managerListsStyle]}>
						<Touch style={styles.managerListsTouch} onPress={() => {
							//Linking.openURL('https://773fn.com')
							this.openBrowserGame('download')
						}}>
							<View style={styles.managerListsLeft}>
								<Image resizeMode='stretch' source={require('./../../images/account/accountIcon/account13.png')} style={[styles.managerListsImg, { height: 24 }]}></Image>
								<Text style={managerListsText}>หน้าดาวน์โหลด</Text>
							</View>
							<Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
						</Touch>
					</View>

					{
						ApiPort.UserLogin && <TouchableOpacity style={[styles.managerLogout, {
							backgroundColor: '#fff',
							flexDirection: 'row'
						}]} onPress={() => { this.Mlogout() }}>
							<Image resizeMode='stretch'
								source={require('./../../images/account/accountIcon/logout.png')}
								style={[
									{
										width: 25,
										height: 20,
										marginRight: 10
									}
								]}></Image>
							<Text style={[styles.managerLogoutText, { color: '#1CBD64' }]}>ออกจากระบบ</Text>
						</TouchableOpacity>
					}

					{
						!ApiPort.UserLogin &&
						<TouchableOpacity style={[styles.managerLogout, {
							backgroundColor: '#68C477',
							width: width - 20,
							marginHorizontal: 10,
							borderRadius: 6
						}]} onPress={() => {
							Actions.Register()
						}}>
							<Text style={styles.managerLogoutText}>ลงทะเบียน</Text>
						</TouchableOpacity>
					}
					<Text style={[{ textAlign: 'center', paddingVertical: 15, color: '#58585B' }]}>แอปเวอชั่น {window.FUN88Version}</Text>
				</View>
			</ScrollView>
			<View style={[styles.overlyContainer, { backgroundColor: window.isBlue ? '#EDEDED' : '#000' }]}></View>
		</AnimatableView>
	}
}

export default PersonalAccount = connect(
	(state) => {
		return {
			memberInforData: state.memberInforData,
			balanceInforData: state.balanceInforData,
		}
	}, (dispatch) => {
		return {
			changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
			getMemberInforAction: () => dispatch(getMemberInforAction()),
			getBalanceInforAction: () => dispatch(getBalanceInforAction()),
			changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data))
		}
	}
)(PersonalAccountContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1
	},
	FUN88VersionBox: {
		flexDirection: 'row'
	},
	inforList: {
		flexDirection: 'row',
		paddingHorizontal: 10,
		height: 34,
		alignItems: 'center',
	},
	inforListText1: {
		color: 'rgba(255, 255, 255, .6)',
		width: 90,
	},
	inforListText2: {
		color: '#fff',
		width: 150
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
		width: .9 * width,
		overflow: 'hidden',
		borderRadius: 10,
		backgroundColor: '#fff',
		position: 'relative'
	},
	modalBodyText: {
		textAlign: 'center',
		paddingVertical: 15,
		paddingHorizontal: 15,
		alignItems: 'center',
		color: '#58585B'
	},
	modalBtnWrap1Text: {
		fontWeight: 'bold',
		color: '#008AEF'
	},
	modalBtnWrap1: {
		height: 40,
		justifyContent: 'center',
		borderTopWidth: 1,
		borderTopColor: '#D0CDCD',
		alignItems: 'center'
	},
	modalBtnWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		marginBottom: 15
	},
	modalBtn: {
		width: (.9 * width - 30) * .48,
		height: 38,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#00AEEF',
		borderRadius: 6
	},
	modalBtn1: {

	},
	modalBtnText: {
		color: '#008AEF',
		fontWeight: 'bold'
	},
	overlyContainer: {
		width,
		height: height * .4,
		left: 0,
		right: 0,
		bottom: 0,
		position: 'absolute',
		zIndex: -10,
		backgroundColor: 'red'
	},
	memberInforBox: {
		borderBottomWidth: 2,
		paddingBottom: 12,
		paddingTop: 5
	},
	memberInforWrap: {
		alignItems: 'center'
	},
	vipIcon: {
		width: 80,
		height: 80,
		marginBottom: 5
	},
	arrowRight: {
		width: 19 * .5,
		height: 35 * .5,
	},
	memberInforText1: {
		color: '#fff'
	},
	memberInforText2: {
		color: 'rgba(255, 255, 255, .8)',
		marginTop: 2,
		marginBottom: 2,
		fontSize: 20
	},
	memberInforText3: {
		color: 'rgba(255, 255, 255, .8)'
	},
	homeDepositBox: {
		height: 60,
		flexDirection: 'row',
		alignItems: 'center',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		width,
		justifyContent: 'space-between',
		marginBottom: 8
	},
	homeDepositLeft: {
		width: width * .35,
		justifyContent: 'center',
		alignItems: 'center'
	},
	homeDepositText1: {
		fontSize: 16,
		fontWeight: 'bold'
	},
	homeDepositText2: {
		marginTop: 3,
		fontSize: 12
	},
	homeDepositRight: {
		flexDirection: 'row',
		width: width * .65,
		justifyContent: 'space-around'
	},
	homeDepositWrap: {
		alignItems: 'center'
	},
	homeDepositWrap0: {
		borderRightWidth: 1,
		borderColor: '#00000029',
		transform: [{ translateX: 8 }],
		paddingRight: 8
	},
	homeDepositWrap1: {},
	homeDepositWrap2: {
		borderLeftWidth: 1,
		borderColor: '#00000029',
		paddingLeft: 8,
		transform: [{ translateX: -8 }],
	},
	gameDepositImg: {
		width: 28,
		height: 28,
	},
	gameDepositInfor: {
		fontSize: 11,
		marginTop: 1
	},
	managerLists: {
		height: 50,
		justifyContent: 'center',
		marginBottom: 1
	},
	managerListsMargin: {
		marginBottom: 8
	},
	managerListsTouch: {
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	managerListsLeft: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	managerListsImg: {
		width: 28,
		height: 28,
		marginRight: 8
	},
	managerLogout: {
		marginTop: 15,
		backgroundColor: '#33C85D',
		height: 46,
		alignItems: 'center',
		justifyContent: 'center',
	},
	managerLogoutText: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#fff'
	},
	checkedImg: {
		width: 18,
		height: 18,
		marginRight: 4
	},
	phoneBox: {
		width: 100,
		height: 26,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#FFFFFF',
		borderRadius: 2
	},
	depositNoBox: {
		backgroundColor: '#6B6B6D',
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 10
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
	registIpkLoadFlag: {
		position: 'absolute',
		width,
		right: 0,
		top: 0,
		bottom: 0,
		top: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
})