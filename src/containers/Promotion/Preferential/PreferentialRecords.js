import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, Modal, TextInput, ImageBackground, TouchableHighlight, RefreshControl } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import { toThousands } from '../../../actions/Reg'
import { getBalanceInforAction } from '../../../actions/ReducerAction'
import { connect } from 'react-redux'
import LoadIngImgActivityIndicator from './../../Common/LoadIngImgActivityIndicator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import LoadingBone from './../../Common/LoadingBone'
import * as Animatable from 'react-native-animatable'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
const CancleReason = [
	'กดขอรับผิดพลาด',
	'ยอดหมุนเวียนที่ต้องทำมากเกินไป',
	'ทำรายการฝากผิดบัญชี',
	'รายการฝากยังไม่สำเร็จ',
	''
]
const InboxMessagesTabDatas = [
	{
		title: 'โปรโมชั่นที่เข้าร่วมแล้ว',
		piwikMenberText: 'Transaction_Inbox'
	},
	{
		title: 'เงินเดิมพันฟรี',
		piwikMenberText: 'Personal_Inbox'
	}
]

const BonusStatusText = {
	PROCESSING: {
		color: '#FF7700',
		text: 'กำลังดำเนินการ'
	},
	SUCCESS: {
		color: '#33C85D',
		text: 'สำเร็จ'
	},
	FAILED: {
		color: '#FF0000',
		text: 'ล้มเหลว'
	}
}

const BonusGivenType = {
	givenType1: {
		text: 'โบนัส', // money
	},
	givenType2: {
		text: 'คะแนนสะสม', // reward point
	},
	givenType3: {
		text: 'หมุนฟรี', // free spin
	},
	givenType4: {
		text: 'N/A' // manual items
	}
}


const DailyDealsIcon = {
	AG: require('./../../../images/promotion/preferential/preferentialRecord/CASINO.jpg'),
	LD: require('./../../../images/promotion/preferential/preferentialRecord/CASINO.jpg'),

	CMD: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_SPORT.jpg'),
	SBT: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_SPORT.jpg'),
	SP: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_SPORT.jpg'),
	IPSB: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_SPORT.jpg'),

	LBK: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_KENO.jpg'),
	SGW: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_KENO.jpg'),
	SLC: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_KENO.jpg'),
	YBK: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_KENO.jpg'),
	KENO: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_KENO.jpg'),

	IPK: require('./../../../images/promotion/preferential/preferentialRecord/POKER.jpg'),

	KYG: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_P2P.jpg'),
	YBP: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_P2P.jpg'),
	P2P: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_P2P.jpg'),

	IMOPT: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_SLOT.jpg'),
	SLOT: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_SLOT.jpg'),

	MAIN: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_MAIN.jpg'),

	SB: require('./../../../images/promotion/preferential/preferentialRecord/SB.jpg'),

	YBF: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_Fishing.jpg'),
	FISH: require('./../../../images/promotion/preferential/preferentialRecord/Promotion-Mobile-Category-Icon_Fishing.jpg'),


	// 	VIP: require('./../../../images/promotion/preferential/preferentialRecord/VIP.jpg'),
	// 	WithoutTurnover: require('./../../../images/promotion/preferential/preferentialRecord/WithoutTurnover.jpg'),
	// 	Exclusive: require('./../../../images/promotion/preferential/preferentialRecord/Exclusive.jpg'),
}

const StatusUpperCase1 = ['PENDING', 'SERVING', 'WAITINGFORRELEASE', 'RELEASE', 'PROCESSING', 'SUCCESS', 'FAILED']
const StatusUpperCase2 = ['SERVED', 'FORCETOSERVED', 'CANCELED', 'EXPIRED', 'APPROVED', 'NOTELIGIBLE']
class PreferentialRecordsContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			promotionListUnExpired: '',
			promotionListExpired: [],
			isShowExpired: false,
			isShowDelateModal: false,
			cancleIndex: 0,
			otherCancle: '',
			bonusId: '',
			playerBonusId: '',
			toggleIndex: 0,
			isShowToggle: false,
			gameLoadObj: {},
			refreshing: false,
			tabIndex: this.props.tabIndex || 0,
			freebetArr: [],
			promotionListFreebet: '',
			isShowRdDepositModal: true
		}
	}

	componentDidMount() {
		this.getPromotionsApplications()
		this.getMmpStore()
	}


	getMmpStore() {
		storage.load({
			key: 'PreferentialRecordsFirsrtGuider' + window.userNameDB,
			id: 'PreferentialRecordsFirsrtGuider' + window.userNameDB
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

	getPromotionsApplications(flag) {
		flag && this.setState({
			refreshing: true
		})
		global.storage.load({
			key: 'promotionListUnExpired',
			id: 'promotionListUnExpired'
		}).then(data => {
			this.setState({
				promotionListUnExpired: data
			})
		}).catch(err => {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
		})
		global.storage.load({
			key: 'promotionListExpired',
			id: 'promotionListExpired'
		}).then(data => {
			this.setState({
				promotionListExpired: data
			})
		}).catch(err => {
			////Toast.loading('กำลังโหลดข้อมูล...', 2000)
		})
		global.storage.load({
			key: 'promotionListFreebet',
			id: 'promotionListFreebet'
		}).then(data => {
			this.setState({
				promotionListFreebet: data
			})
		}).catch(err => {
			//Toast.loading('กำลังโหลดข้อมูล...', 2000)
		})

		fetchRequest(ApiPort.Promotions + `?promoSecondType=all&`, 'GET').then(res => {
			Toast.hide()
			this.setState({
				refreshing: false
			})
			if (Array.isArray(res) && res.length) {
				let tempPromotionList = res.filter(v => ['BONUS', 'MANUAL', 'DAILYDEALS'].find(v1 => v1 === v.type.toLocaleUpperCase()))
				let promotionListUnExpired = []
				let promotionListExpired = []
				let promotionListFreebet = tempPromotionList.filter(v => Array.isArray(v.category) && v.category.map(v => v * 1).includes(18))
				tempPromotionList.forEach(v => {
					const statusUpperCase = v.status.toLocaleUpperCase().replace(/\s/g, '')
					if (StatusUpperCase2.includes(statusUpperCase)) {
						promotionListExpired.push(v)
						//promotionListExpired.sort((a, b) => new Date(b.bonusProductList[0].appliedDate).getTime() - new Date(a.bonusProductList[0].appliedDate).getTime())
					} else if (StatusUpperCase1.includes(statusUpperCase)) {
						promotionListUnExpired.push(v)
						//promotionListUnExpired.sort((a, b) => new Date(b.bonusProductList[0].appliedDate).getTime() - new Date(a.bonusProductList[0].appliedDate).getTime())
					}
				})

				this.setState({
					promotionListUnExpired,
					promotionListExpired,
					promotionListFreebet
				})
				global.storage.save({
					key: 'promotionListUnExpired',
					id: 'promotionListUnExpired',
					data: promotionListUnExpired,
					expires: null
				})
				global.storage.save({
					key: 'promotionListExpired',
					id: 'promotionListExpired',
					data: promotionListExpired,
					expires: null
				})
				global.storage.save({
					key: 'promotionListFreebet',
					id: 'promotionListFreebet',
					data: promotionListFreebet,
					expires: null
				})
			}
		}).catch(err => {
			Toast.hide()
			this.setState({
				refreshing: false
			})
		})
	}

	postClaim(v) {
		const { playerBonusId } = v
		this.setState({
			isShowToggle: false
		})
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		let params = {
			playerBonusId
		}
		fetchRequest(ApiPort.PostClaim + '?', 'POST', params).then(res => {
			Toast.hide()
			if (res.isSuccess) {
				if (res.isClaimSuccess) {
					v.bonusProductList[0].isClaimable = false
					this.setState({})
					this.props.getBalanceInforAction()
					let message = res.messag
					Toast.success(message ? message : 'การอัปเดตสำเร็จ', 2)
				} else {
					Toast.fail(res.message, 2)
				}
				this.getPromotionsApplications()
			} else {
				Toast.fail(res.message, 2)
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	openPref(v, toggleIndex) {
		this.setState({
			toggleIndex: toggleIndex * 1,
			isShowToggle: false
		})
		if (!v.modalHtml) return
		Actions.PreferentialPage({
			promotionsDetail: v,
			getPromotionsApplications: () => {
				this.getPromotionsApplications()
			},
			fromPage: 'PreferentialRecords'
		})
	}

	getLoadImgStatus(i, flag) {
		this.state.gameLoadObj[`imgStatus${i}`] = flag
		this.setState({})
	}

	createPromotionLeft(v, i, isFreebet, isDaily) {
		const defaultSource = true ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')
		const bonusProductList = v.bonusProductList

		let tempFlag = Array.isArray(bonusProductList) && bonusProductList.length && DailyDealsIcon[bonusProductList[0].wallet]

		return <TouchableOpacity style={styles.promotionLeft} onPress={() => { this.openPref(v, i) }}>
			{
				(isDaily && tempFlag) ?
					(
						<View style={[styles.thumbnailMobileImage, styles.thumbnailMobileImage1]}>
							<Image
								resizeMode='stretch'
								source={DailyDealsIcon[bonusProductList[0].wallet]}
								defaultSource={defaultSource}
								style={[styles.thumbnailMobileImage, styles.thumbnailMobileImageDaily]}
							/>
						</View>
					)
					:




					(
						Boolean(v.thumbnailMobileImage || v.thumbnailImage)
							?
							<View style={styles.thumbnailMobileImage}>
								<Image
									resizeMode='stretch'
									onLoadStart={this.getLoadImgStatus.bind(this, i, false)}
									onLoadEnd={this.getLoadImgStatus.bind(this, i, true)}
									source={(v.thumbnailMobileImage || v.thumbnailImage) ? { uri: v.thumbnailMobileImage || v.thumbnailImage } : defaultSource}
									defaultSource={defaultSource}
									style={styles.thumbnailMobileImage}
								/>
								{
									!this.state.gameLoadObj[`imgStatus${i}`] && <LoadIngImgActivityIndicator />
								}
							</View>
							:
							(
								<View style={styles.thumbnailMobileImage}>
									{
										isFreebet
											?
											<Image
												resizeMode='stretch'
												source={require('./../../../images/freeBet/freebetIcon.png')}
												defaultSource={defaultSource}
												style={styles.thumbnailMobileFreeImage}
											/>
											:
											<ImageBackground
												source={defaultSource}
												resizeMode='stretch'
												style={styles.thumbnailMobileImage}
											>
												<View style={styles.notThumbnailMobileImage}>
													<Text style={styles.notThumbnailMobileImageText}>{v.title}</Text>
												</View>
											</ImageBackground>
									}
								</View>
							)
					)
			}
		</TouchableOpacity>
	}


	createPromotionStatus(v, i) {
		const { isShowToggle, toggleIndex } = this.state
		const { type, status, bonusProductList } = v
		const typeUpperCase = type.toLocaleUpperCase().replace(/\s/g, '')
		const statusUpperCase = status.toLocaleUpperCase().replace(/\s/g, '')
		let bonusProductLists = {}
		if (Array.isArray(bonusProductList) && bonusProductList.length) {
			bonusProductLists = bonusProductList[0]
		} else {
			bonusProductLists = {
				bonusName: v.title,
				appliedDate: v.startDate.includes('GMT') ? v.startDate.split('GMT')[0] : v.startDate,
				expiredDate: v.endDate.includes('GMT') ? v.endDate.split('GMT')[0] : v.endDate,
				reference: '',
				percentage: 0,
				isClaimable: '',
				bonusGivenType: 99999999,
				bonusAmount: '',
				bonusCategory: ''
			}
		}
		const PromotionImg = window.isBlue ? require('./../../../images/promotion/preferential/preferentialRecord/laji0.png') : require('./../../../images/promotion/preferential/preferentialRecord/laji1.png')
		const promotionRightTopText = [styles.promotionRightTopText]
		const promotionRightTopText1 = [styles.promotionRightTopText1, { color: window.isBlue ? '#3C3C3C' : '#fff' }]
		const promotionWrapView = [styles.promotionWrapView]
		const promotionRightBottomText1 = [styles.promotionRightBottomText1, { color: window.isBlue ? '#25AAE1' : '#00AEEF' }]
		const oerlyModal = [styles.oerlyModal, { backgroundColor: window.isBlue ? 'rgba(248, 248, 248, .6)' : 'rgba(24, 24, 24, .6)' }]
		const PromotionImg1 = [styles.PromotionImg, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]
		const bonusGivenTypeNum = bonusProductLists.bonusGivenType * 1
		const bonusGivenTypeItem = BonusGivenType[`givenType${bonusGivenTypeNum}`]
		const bonusGivenTypeText = bonusGivenTypeItem ? bonusGivenTypeItem.text : ''
		const bonusCategory = bonusProductLists.bonusCategory.toLocaleUpperCase().replace(/\s/g, '')
		const isFreebet = bonusCategory === 'FREEBETBONUS'
		const isShowTipFlag = (statusUpperCase !== 'PENDING' || isFreebet) && isShowToggle && toggleIndex === i
		if (typeUpperCase === 'BONUS' || typeUpperCase === 'DAILYDEALS') {
			if (['PENDING', 'SERVING', 'WAITINGFORRELEASE', 'RELEASE', 'SUCCESS', 'FAILED', 'PROCESSING'].find(v => v === statusUpperCase)) {
				let [progress1, progress2] = [0, 0]
				if ('SERVING' === statusUpperCase) {
					let progress = bonusProductLists.progress
					if (progress && progress.includes('/')) {
						[progress1, progress2] = bonusProductLists.progress.split('/').map(v => v)
					}
				}

				let isClaimable = false
				if ('RELEASE' === statusUpperCase) {
					isClaimable = bonusProductLists.isClaimable
				}

				return <View key={i} style={promotionWrapView}>
					{
						this.createPromotionLeft(v, i, isFreebet, typeUpperCase === 'DAILYDEALS')
					}

					<View style={styles.promotionRight}>
						<View style={styles.promotionRightTop}>
							{/* <Text style={promotionRightTopText}>Thưởng Cập Nhật Sau</Text> */}
							<Text style={promotionRightTopText}>{v.title}</Text>
							<Text style={promotionRightTopText1}>วันที่ทำรายการ:{bonusProductLists.appliedDate ? moment(bonusProductLists.appliedDate).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
							<Text style={promotionRightTopText1}>หมดเวลา:{!isFreebet ? (bonusProductLists.expiredDate ? moment(bonusProductLists.expiredDate).format('YYYY-MM-DD HH:mm:ss') : '') : '-'}</Text>
						</View>

						{
							(statusUpperCase === 'PENDING' && !isFreebet) && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>รอการอนุมัติ</Text>
								<Text style={[styles.promotionRightBottomText2]}>{bonusProductLists.reference}</Text>
							</View>
						}

						{
							statusUpperCase === 'SERVING' && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>
									<Text style={{ fontWeight: 'bold', fontSize: 22 }}>
										{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)}
									</Text>
									{typeUpperCase === 'DAILYDEALS' ? ' thưởng cược miễn phí' : ` ${bonusGivenTypeText}`}
								</Text>
								<View style={[styles.progress]}>
									<AnimatableView
										animation={'fadeInLeftBig'}
										easing='ease-out'
										iterationCount='1'
										style={[styles.progressBar, { width: (width - 140) * ((bonusProductLists.percentage ? bonusProductLists.percentage : 0) / 100), backgroundColor: window.isBlue ? '#00AEEF' : '#00CEFF' }]}></AnimatableView>
								</View>
								<Text>
									{
										typeUpperCase === 'DAILYDEALS'
											?
											'ข้อมูลเพิ่มเติม'
											:
											'ต้องทำยอดหมุนเวียนอีก'
									} {toThousands(progress2) + (typeUpperCase === 'DAILYDEALS' ? ' doanh thu' : ' บาท')}
								</Text>
							</View>
						}

						{
							statusUpperCase === 'WAITINGFORRELEASE' && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)} {bonusGivenTypeText}</Text>
								<TouchableOpacity style={[styles.promotionBtn]}>
									<Text style={[styles.promotionBtnText, { color: '#fff' }]}>รอการอนุมัติ</Text>
								</TouchableOpacity>
							</View>
						}

						{
							statusUpperCase === 'RELEASE' && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)} {bonusGivenTypeText}</Text>
								{
									isClaimable && <TouchableOpacity style={[styles.promotionBtn, { backgroundColor: '#33C85D' }]} onPress={this.postClaim.bind(this, v)}>
										<Text style={[styles.promotionBtnText, { color: '#fff' }]}>ต้องการ</Text>
									</TouchableOpacity>
								}
							</View>
						}

						{
							['SUCCESS', 'FAILED', 'PROCESSING'].includes(statusUpperCase) && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)} {bonusGivenTypeText}</Text>
								<Text style={[promotionRightBottomText1, { color: BonusStatusText[statusUpperCase].color, marginTop: 2 }]}>{BonusStatusText[statusUpperCase].text}</Text>
								{
									!isFreebet && <Text style={[styles.promotionRightBottomText2]}>{bonusProductLists.reference}</Text>
								}
							</View>
						}
					</View>

					{
						(statusUpperCase === 'PENDING' && !isFreebet) && <TouchableOpacity
							style={styles.PromotionImgWrap}
							onPress={this.delatePromotion.bind(this, v.playerBonusId, v.bonusId)}
							hitSlop={{ left: 15, top: 15, bottom: 15, right: 15 }}
						>
							<Image source={PromotionImg} resizeMode='stretch' style={PromotionImg1}></Image>
						</TouchableOpacity>
					}
					{
						(statusUpperCase !== 'PENDING' || isFreebet) && this.createToggle1(i)
					}
					{
						this.createToggle2(isShowTipFlag)
					}

					{
						isShowTipFlag && this.createToggle3()
					}
				</View>
			} else if (['EXPIRED', 'CANCELED', 'FORCETOSERVED', 'SERVED'].find(v => v === statusUpperCase)) {
				let reprogress = 0
				if ('EXPIRED' === statusUpperCase) {
					let [progress1, progress2] = [0, 0]
					let progress = bonusProductLists.progress
					if (progress && progress.includes('/')) {
						[progress1, progress2] = bonusProductLists.progress.split('/').map(v => v)
					}
					let progressNum1 = progress1.replace(/,/g, '') * 1
					let progressNum2 = progress2.replace(/,/g, '') * 1
					reprogress = progressNum2 - progressNum1
				}

				return <View key={i} style={promotionWrapView}>
					<View style={oerlyModal}></View>
					{
						this.createPromotionLeft(v, i, isFreebet, typeUpperCase === 'DAILYDEALS')
					}
					<View style={styles.promotionRight}>
						<View style={styles.promotionRightTop}>
							{/* <Text style={promotionRightTopText}>Thưởng Cập Nhật Sau</Text> */}
							<Text style={promotionRightTopText}>{v.title}</Text>
							<Text style={promotionRightTopText1}>วันที่ทำรายการ:{bonusProductLists.appliedDate ? moment(bonusProductLists.appliedDate).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
							<Text style={promotionRightTopText1}>หมดเวลา:{!isFreebet ? (bonusProductLists.expiredDate ? moment(bonusProductLists.expiredDate).format('YYYY-MM-DD HH:mm:ss') : '') : '-'}</Text>
						</View>

						{
							statusUpperCase === 'CANCELED' && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)} {bonusGivenTypeText}</Text>
								<View style={[styles.promotionBtn]}>
									<Text style={[styles.promotionBtnText]}>ยกเลิก</Text>
								</View>
							</View>
						}

						{
							statusUpperCase === 'EXPIRED' && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)} {bonusGivenTypeText}</Text>
								<View style={[styles.progress]}>
									<View style={[styles.progressBar, { width: (width - 140) * ((bonusProductLists.percentage ? bonusProductLists.percentage : 0) / 100), backgroundColor: window.isBlue ? '#00AEEF' : '#00CEFF' }]}></View>
								</View>
								<Text style={[promotionRightTopText1, { fontSize: 14 }]}>กรุณาเดิมพันเพิ่ม {toThousands(reprogress)}</Text>
								<View style={[styles.promotionBtn]}>
									<Text style={[styles.promotionBtnText]}>หมดอายุ</Text>
								</View>
							</View>
						}

						{
							(statusUpperCase === 'FORCETOSERVED' || statusUpperCase === 'SERVED') && <View style={styles.promotionRightBottom}>
								<Text style={promotionRightBottomText1}>{bonusGivenTypeNum != 4 && toThousands(bonusProductLists.bonusAmount)} {bonusGivenTypeText}</Text>
								<View style={[styles.promotionBtn]}>
									<Text style={[styles.promotionBtnText]}>เรียบร้อย</Text>
								</View>
							</View>
						}
					</View>
					{
						statusUpperCase !== 'PENDING' && this.createToggle1(i)
					}
				</View>
			} else {
				return null
			}
		} else if (typeUpperCase === 'MANUAL' || typeUpperCase === 'DAILYDEALS') {
			if (['PROCESSING', 'APPROVED', 'NOTELIGIBLE'].find(v => v === statusUpperCase)) {
				return <View key={i} style={promotionWrapView}>
					{
						'PROCESSING' !== statusUpperCase && <View style={oerlyModal}></View>
					}
					{
						this.createPromotionLeft(v, i, isFreebet, typeUpperCase === 'DAILYDEALS')
					}
					<View style={styles.promotionRight}>
						<View style={styles.promotionRightTop}>
							{/* <Text style={promotionRightTopText}>เฉพาะคุณ</Text> */}
							<Text style={promotionRightTopText}>{v.title}</Text>
							<Text style={promotionRightTopText1}>วันที่ทำรายการ:{bonusProductLists.appliedDate ? moment(bonusProductLists.appliedDate).format('YYYY-MM-DD HH:mm:ss') : ''}</Text>
							<Text style={promotionRightTopText1}>หมดเวลา:{!isFreebet ? (bonusProductLists.expiredDate ? moment(bonusProductLists.expiredDate).format('YYYY-MM-DD HH:mm:ss') : '') : '-'}</Text>
						</View>

						<View style={styles.promotionRightBottom}>
							<Text style={promotionRightBottomText1}>รอการตรวจสอบ</Text>
							<TouchableOpacity style={[styles.promotionBtn, { backgroundColor: 'PROCESSING' === statusUpperCase ? '#fff' : 'rgba(0, 0, 0, .2)', borderColor: '#25AAE1', borderWidth: 1 }]} onPress={() => {
								this.setState({
									isShowToggle: false
								})
								Actions.PreferentialApplication({
									promotionsDetail: v,
									pageFrom: 'PreferentialRecords'
								})
							}}>
								<Text style={[styles.promotionBtnText, { color: '#25AAE1' }]}>{statusUpperCase == 'NOTELIGIBLE' ? 'Không hợp lệ' : 'ดูรายการขอรับโบนัส'}</Text>
							</TouchableOpacity>
						</View>
					</View>
					{
						statusUpperCase !== 'PENDING' && this.createToggle1(i)
					}
					{
						this.createToggle2(isShowTipFlag && 'PROCESSING' === statusUpperCase)
					}
					{
						isShowTipFlag && 'PROCESSING' === statusUpperCase && this.createToggle3()
					}
				</View>
			} else {
				return null
			}
		} else {
			return null
		}
	}

	delatePromotion(playerBonusId, bonusId) {
		this.setState({
			isShowDelateModal: true,
			isShowToggle: false,
			cancleIndex: 0,
			playerBonusId,
			bonusId,
			otherCancle: ''
		})
	}

	postCancelPromotion() {
		const { cancleIndex, otherCancle, playerBonusId, bonusId } = this.state
		let remark = cancleIndex === CancleReason.length - 1 ? otherCancle : CancleReason[cancleIndex]
		this.setState({
			isShowDelateModal: false
		})
		Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PostCancelPromotion + 'playerBonusId=' + playerBonusId + '&bonusId=' + bonusId + '&remark=' + remark + '&', 'POST').then(res => {
			Toast.hide()
			if (res.isSuccess) {
				this.getPromotionsApplications()
				this.setState({
					playerBonusId: '',
					bonusId: '',
					cancleIndex: 0,
					otherCancle: '',
				})
				Toast.success('ลบสำเร็จ', 2)
			} else {
				Toast.fail(res.message, 2)
			}
		}).catch(err => {
			Toast.hide()
		})
	}

	changeToggleStatus(isShowToggle, toggleIndex) {
		this.setState({
			isShowToggle,
			toggleIndex: isShowToggle ? toggleIndex * 1 : ''
		})
	}

	createToggle1(i) {
		const ToggleIcon = window.isBlue ? require('./../../../images/promotion/preferential/preferentialRecord/setting1.png') : require('./../../../images/promotion/preferential/preferentialRecord/setting2.png')
		return <TouchableOpacity
			style={styles.PromotionImgWrap}
			onPress={this.changeToggleStatus.bind(this, this.state.toggleIndex == i ? !this.state.isShowToggle : true, i)}
			hitSlop={{ left: 15, top: 15, bottom: 15, right: 15 }}
		>
			<Image source={ToggleIcon} resizeMode='stretch' style={styles.ToggleIcon}></Image>
		</TouchableOpacity>
	}

	createToggle2(flag, flag1, flag2) {
		return flag ? <AnimatableView
			animation={'bounceIn'}
			easing='ease-out'
			iterationCount='1'
			style={[styles.toggleBox, {
				backgroundColor: window.isBlue ? '#fff' : '#000',
				borderColor: window.isBlue ? '#fff' : '#000',
			}]}>
			<View style={[styles.toggleArrow, { borderBottomColor: window.isBlue ? '#fff' : '#000', right: flag1 ? 22 : 6 }]}></View>
			{
				flag2
					?
					<Text style={[styles.toggleTextBox]}>
						<Text style={[styles.toggleText1, { color: window.isBlue ? '#000' : '#fff' }]}>โบนัสเดิมพันฟรีสุดพิเศษสำหรับคุณ ขอรับก่อนหมดอายุ</Text>
					</Text>
					:
					<Text style={[styles.toggleTextBox]}>
						<Text style={[styles.toggleText1, { color: window.isBlue ? '#000' : '#fff' }]}>
							กรุณาติดต่อ
							<Text
								onPress={() => {
									this.changeToggleStatus(false)
									Actions.LiveChat()
								}}
								style={styles.toggleText2}> เจ้าหน้าที่ฝ่ายบริการ</Text> สำหรับการขอยกเลิก โบนัสสิทธิพิเศษรายวัน.</Text>
					</Text>
			}
		</AnimatableView>
			:
			null
	}

	createToggle3() {
		return <TouchableHighlight onPress={this.changeToggleStatus.bind(this, false)} style={styles.modalContainer1}>
			<Text style={styles.modalContainer1Text}>12331</Text>
		</TouchableHighlight>
	}

	changeTabIndex(tabIndex) {
		if (tabIndex == this.state.tabIndex) return
		this.setState({
			tabIndex
		})
		if (this.view0 && this.view1) {
			if (tabIndex == 1) {
				this.view1.fadeInRight(400)
			} else {
				this.view0.fadeInLeft(400)
			}
		}
		//tabIndex == 0 &&
		this.getPromotionsApplications()
	}

	handleViewRef0 = ref => this.view0 = ref

	handleViewRef1 = ref => this.view1 = ref

	renderPage(item) {
		return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
			<Image
				resizeMode='stretch'
				style={styles.carouselImg}
				source={item.item.img} />
			{
				<TouchableOpacity style={styles.closeBtn} onPress={() => {
					this.changeisShowRdDepositModal(false)
				}}></TouchableOpacity>
			}
		</TouchableOpacity>
	}

	changeisShowRdDepositModal(isShowRdDepositModal) {
		this.setState({
			isShowRdDepositModal
		})
		global.storage.save({
			key: 'PreferentialRecordsFirsrtGuider' + window.userNameDB,
			id: 'PreferentialRecordsFirsrtGuider' + window.userNameDB,
			data: true,
			expires: null
		})
	}

	render() {
		const { isShowRdDepositModal, promotionListFreebet, freebetArr, tabIndex, refreshing, isShowToggle, otherCancle, cancleIndex, promotionListUnExpired, promotionListExpired, isShowExpired, isShowDelateModal } = this.state
		const bannerData = [
			{
				img: require('./../../../images/promotion/preferential/preferentialRecord/PreferentialRecords4.png'),
			}
		]

		return <View style={[styles.viewContainer, { backgroundColor: '#FAFAFB' }]}>
			<Modal animationType='fade' transparent={true} visible={isShowDelateModal}>
				<View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, .6)'}]}>
					<KeyboardAwareScrollView>
						<View style={[styles.modalContainer, { backgroundColor: 'transparent' }]}>
							<View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F' }]}>
								<View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
									<Text style={styles.modalTopText}>ท่านต้องการยืนยันการยกเลิกโบนัสใช่หรือไม่</Text>
								</View>
								<View style={styles.modalBody}>
									<Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>สาเหตุการยกเลิกโบนัส</Text>
									<View>
										{
											CancleReason.map((v, i) => {
												return <TouchableOpacity style={styles.reasonList} key={i} onPress={() => {
													this.setState({
														cancleIndex: i
													})
												}}>
													<View style={[styles.reasonCircle, { backgroundColor: window.isBlue ? 'transparent' : '#fff' }]}>
														{
															cancleIndex * 1 === i * 1 && <View style={styles.reasonInnerCircle}></View>
														}
													</View>
													{
														v ? <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>{v}</Text>
															: <View style={styles.otherReason}>
																<Text style={{ color: window.isBlue ? '#000' : '#fff' }}>อื่นๆ：</Text>
																<TextInput
																	style={[styles.otherReasonInput, { borderBottomColor: window.isBlue ? '#000' : '#707070', color: window.isBlue ? '#000' : '#fff' }]}
																	value={otherCancle}
																	onChangeText={otherCancle => {
																		this.setState({
																			otherCancle
																		})
																	}}
																></TextInput>
															</View>
													}
												</TouchableOpacity>
											})
										}

									</View>
									<View style={styles.modalBtnBox}>
										<TouchableOpacity style={[styles.modalBtn, { borderColor: '#25AAE1' }]} onPress={() => {
											this.setState({
												isShowDelateModal: false,
												playerBonusId: '',
												bonusId: ''
											})
										}}>
											<Text style={[styles.modalBtnText, { color: '#25AAE1' }]}>ยืนยันการยกเลิกโบนัส</Text>
										</TouchableOpacity>
										<TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]} onPress={this.postCancelPromotion.bind(this)}>
											<Text style={[styles.modalBtnText, { color: '#fff' }]}>เก็บโบนัสนี้ไว้ภายหลัง</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
					</KeyboardAwareScrollView>
				</View>
			</Modal>


			<Modal animationType='fade' transparent={true} visible={isShowRdDepositModal}>
				<View style={[styles.modalContainer]}>
					<Carousel
						data={bannerData}
						renderItem={this.renderPage.bind(this)}
						sliderWidth={width}
						itemWidth={width}
						useScrollView={true}
						onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
					/>
				</View>
			</Modal>


			{
				isShowToggle && <TouchableHighlight onPress={this.changeToggleStatus.bind(this, false)} style={styles.modalContainer1}>
					<Text style={styles.modalContainer1Text}>12331</Text>
				</TouchableHighlight>
			}
			{
				// 	<View style={[styles.rebateWraps]}>
				// 	{
				// 		InboxMessagesTabDatas.map((v, i) => {
				// 			let flag = tabIndex === i
				// 			return <TouchableOpacity
				// 				key={i}
				// 				onPress={this.changeTabIndex.bind(this, i)}
				// 				style={[styles.rebateBox, {
				// 					backgroundColor: window.isBlue ? (flag ? '#06ADEF' : '#fff') : (flag ? '#25AAE1' : '#0F0F0F'),
				// 					borderColor: window.isBlue ? (flag ? '#06ADEF' : '#fff') : (flag ? '#25AAE1' : '#646464'),

				// 					width: (width - 20) / 2.02,
				// 				}]}
				// 			>
				// 				<Text style={{ color: window.isBlue ? (flag ? '#fff' : '#3C3C3C') : '#fff' }}>{v.title}</Text>
				// 			</TouchableOpacity>
				// 		})
				// 	}
				// </View>
			}
			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				style={{ zIndex: 9999 }}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						tintColor={'#25AAE1'}
						onRefresh={this.getPromotionsApplications.bind(this, true)}
					/>
				}
			>

				<AnimatableView ref={this.handleViewRef0}>
					{
						tabIndex == 0 && <View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F3F4F8', paddingVertical: 10 }}>
								<View>
									<Text style={[styles.myPromotionSrotsText2, { color: window.isBlue ? '#737373' : '#A5A5A5' }]}>คุณสามารถตรวจสอบสถานะ และประวัติในการรับโบนัส</Text>
									<Text style={[styles.myPromotionSrotsText2, { color: window.isBlue ? '#737373' : '#A5A5A5' }]}>อัพเดทล่าสุด: {moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}</Text>
								</View>
								<TouchableOpacity
									onPress={() => {
										this.changeisShowRdDepositModal(true)
									}}
									style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, alignItems: 'center', borderColor: '#4FAEEA', backgroundColor: '#FFFFFF', justifyContent: 'center', height: 30, paddingHorizontal: 5 }}>
									<Image
										source={require('./../../../images/promotion/preferential/preferentialIcon/promotion00.png')}
										resizeMode='stretch'
										style={{ width: 20, height: 20, marginRight: 5 }}
									></Image>
									<Text style={{ color: '#4FAEEA', fontSize: 13 }}>คู่มือโบนัสต่างๆ</Text>
								</TouchableOpacity>
							</View>

							{
								promotionListUnExpired !== ''
									?
									Array.isArray(promotionListUnExpired) && (
										promotionListUnExpired.length > 0 ?
											<View>
												{
													promotionListUnExpired.length > 0 && promotionListUnExpired.map((v, i) => {
														return <AnimatableView key={i} delay={400 * i} animation={i % 2 ? 'fadeInDown' : 'fadeIn'}>
															{
																this.createPromotionStatus(v, i)
															}
														</AnimatableView>

													})
												}
											</View>
											:
											<AnimatableView
												animation={'slideInUp'}
												easing='ease-out'
												style={styles.promotionListNoBox}>
												<Image
													resizeMode='stretch'
													source={require('./../../../images/promotion/preferential/preferentialRecord/promotionListNo.png')}
													style={styles.promotionListNo}
												></Image>
												<Text style={[styles.promotionListNoBoxText, { color: window.isBlue ? '#000' : '#fff' }]}>คุณไม่มีการรับโบนัสใดๆ กรุณาไปที่หน้าโปรโมชั่นเพื่อขอรับโบนัส</Text>
											</AnimatableView>
									)
									:
									Array.from({ length: 5 }, v => v).map((v, i) => {
										return <View key={i} style={[styles.promotionsBox, { backgroundColor: '#e0e0e0' }]}>
											<LoadingBone></LoadingBone>
										</View>
									})
							}


							{
								promotionListExpired.length > 0 && <View>
									<View style={styles.promotionBottomTextWrap}>
										<Text style={[styles.promotionBottomText0, { color: window.isBlue ? '#000' : '#fff' }]}>
											<Text hitSlop={{ top: 5, bottom: 20 }}
												onPress={() => {
													this.setState({
														isShowExpired: !isShowExpired,
														isShowToggle: false
													})
													window.PiwikMenberCode('Viewhistory_mypromo_promopage')
												}}
												style={[styles.promotionBottomText1, { color: window.isBlue ? '#25AAE1' : '#00CEFF' }]}>คลิกที่นี่  </Text>
											เพื่อดูข้อมูลโบนัสที่ได้รับ, หมดอายุ หรือถูกยกเลิก</Text>
									</View>

									<AnimatableView
										//animation={isShowExpired ? 'fadeInUp' : 'zoomOutDown'}
										easing='ease-out'
										iterationCount='1'
										style={{ display: isShowExpired ? 'flex' : 'none' }}
									>
										{
											promotionListExpired.length > 0 && promotionListExpired.map((v, i) => {
												return this.createPromotionStatus(v, i)
											})
										}
									</AnimatableView>
								</View>
							}
						</View>
					}
				</AnimatableView>

				<AnimatableView ref={this.handleViewRef1}>
					{
						tabIndex == 1 && <View >
							{
								promotionListFreebet.length > 0
									?
									promotionListFreebet.filter(v => !['serving', 'canceled'].includes(v.status.toLocaleLowerCase())).map((v, i) => {
										return <AnimatableView key={i} delay={400 * i} animation={i % 2 ? 'fadeInDown' : 'fadeIn'}>
											<ImageBackground
												source={window.isBlue ? require('./../../../images/promotion/preferential/preferentialRecord/freebetBg1.png') : require('./../../../images/promotion/preferential/preferentialRecord/freebetBg2.png')}
												resizeMode='stretch'
												style={styles.freebetBgImg}
											>
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													<Text numberOfLines={1} style={{ color: '#25AAE1', lineHeight: 40, width: width - 60 }}>{v.title}</Text>
												</View>
												<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
													{/* <Text>{v.endDate}</Text> */}
													<Text style={{ color: window.isBlue ? '#737373' : '#C3C3C3', fontSize: 12 }}>วันที่สิ้นสุด  : {moment(v.endDate.split('GMT')[0].trim()).format('YYYY-MM-DD HH:MM:SS')}</Text>
													<TouchableOpacity
														onPress={() => {
															this.setState({
																isShowToggle: false
															})
															Actions.PreferentialPage({
																promotionsDetail: v,
																getPromotionsApplications: () => {
																	this.getPromotionsApplications()
																},
																fromPage: 'PreferentialRecords',
																freebetType: true
															})
														}}
														style={{
															backgroundColor: '#25AAE1', height: 40, width: 90,
															justifyContent: 'center', alignItems: 'center', borderRadius: 6
														}}>
														<Text style={{ fontSize: 12, color: '#FFFFFF', textAlign: 'center' }}>รับโบนัส</Text>
													</TouchableOpacity>


												</View>


												<TouchableOpacity
													onPress={this.changeToggleStatus.bind(this, this.state.toggleIndex == i ? !this.state.isShowToggle : true, i)}
													style={{
														backgroundColor: '#25AAE1',
														width: 20,
														height: 20,
														borderRadius: 10000,
														alignItems: 'center', position: 'absolute', right: 20, top: 10,
														justifyContent: 'center'
													}}>
													<Text style={{ color: '#fff' }}>i</Text>
												</TouchableOpacity>

												{
													this.createToggle2(isShowToggle && this.state.toggleIndex === i, true, true)
												}
											</ImageBackground>
										</AnimatableView>
									})
									:
									<AnimatableView
										animation={'slideInUp'}
										easing='ease-out'
										style={styles.promotionListNoBox}>
										<Image
											resizeMode='stretch'
											source={require('./../../../images/promotion/preferential/preferentialRecord/promotionListNo.png')}
											style={styles.promotionListNo}
										></Image>
										<Text style={[styles.promotionListNoBoxText, { color: window.isBlue ? '#000' : '#fff' }]}>Không có thưởng miễn phí</Text>
									</AnimatableView>
							}
						</View>
					}
				</AnimatableView>
			</ScrollView>
		</View>
	}
}

export default PreferentialRecords = connect(
	(state) => {
		return {}
	}, (dispatch) => {
		return {
			getBalanceInforAction: () => dispatch(getBalanceInforAction())
		}
	}
)(PreferentialRecordsContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		paddingHorizontal: 8,
		position: 'relative',
	},
	promotionsBox: {
		width: width - 20,
		height: 140,
		marginBottom: 10,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	notThumbnailMobileImageText: {
		fontSize: 11,
		textAlign: 'center',
		color: '#fff'
	},
	notThumbnailMobileImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, .6)',
		paddingHorizontal: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	promotionListNoBox: {
		alignItems: 'center',
		marginTop: 100
	},
	promotionListNo: {
		width: 100,
		height: 100,
		marginBottom: 10
	},
	promotionListNoBoxText: {
		textAlign: 'center',
		paddingHorizontal: 50
	},
	promotionLeft: {
		width: 100,
		justifyContent: 'center'
	},
	thumbnailMobileImage: {
		width: 100,
		height: 80,
		borderRadius: 4,
		overflow: 'hidden',
		alignItems: 'center'
	},
	thumbnailMobileImage1: {
		borderRadius: 1000000,
		width: 80,
		marginLeft: 10
	},
	thumbnailMobileImageDaily: {
		width: 80,
	},
	thumbnailMobileFreeImage: {
		width: 80,
		height: 80,
		borderRadius: 4,
		overflow: 'hidden'
	},
	oerlyModal: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(248, 248, 248, .6)',
		zIndex: 99999,
		borderRadius: 5
	},
	modalContainer: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#E5E6E8'
	},
	modalBox: {
		backgroundColor: '#EFEFEF',
		borderRadius: 6,
		width: width * .9,
		overflow: 'hidden'
	},
	modalTop: {
		height: 40,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#25AAE1'
	},
	modalTopText: {
		color: '#fff',
		fontSize: 16
	},
	modalBody: {
		paddingTop: 20,
		paddingBottom: 15,
		paddingHorizontal: 20
	},
	modalBtnBox: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 20
	},
	modalBtn: {
		height: 34,
		width: 135,
		borderWidth: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 4
	},
	modalBtnText: {
		fontWeight: 'bold',
		fontSize: 13
	},
	reasonList: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
	},
	reasonCircle: {
		width: 18,
		height: 18,
		borderWidth: 1,
		borderColor: '#707070',
		borderRadius: 100,
		marginRight: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	reasonInnerCircle: {
		width: 12,
		height: 12,
		backgroundColor: '#25AAE1',
		borderRadius: 100
	},
	reasonText: {
		color: '#262626'
	},
	otherReason: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	otherReasonInput: {
		height: 34,
		borderBottomWidth: 1,
		borderBottomColor: '#000',
		width: width * .5,
		paddingLeft: 10,
		marginLeft: 10
	},
	myPromotionSrotsTextWrap: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		height: 18,
		marginBottom: 10,
		alignItems: 'center'
	},
	myPromotionSrotsText1: {
		fontSize: 10,
		fontWeight: 'bold'
	},
	myPromotionSrotsText2: {
		fontSize: 10
	},
	promotionWrapView: {
		borderRadius: 5,
		marginBottom: 10,
		flexDirection: 'row',
		paddingHorizontal: 8,
		paddingTop: 15,
		paddingBottom: 15,
		position: 'relative',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#DBDBDB',
		backgroundColor: '#fff'
	},
	promotionLeftCircle: {
		width: 80,
		height: 80,
		borderRadius: 100,
		backgroundColor: '#727272',
		alignItems: 'center',
		justifyContent: 'center'
	},
	promotionLeftText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
	promotionRight: {
		justifyContent: 'space-between',
		width: width - 140
	},
	promotionRightTop: {
		marginBottom: 5,
		flexWrap: 'wrap'
	},
	promotionRightTopText: {
		fontWeight: 'bold',
		fontSize: 14,
		width: width - 160,
		color: '#3C3C3C'
	},
	promotionRightTopText1: {
		color: '#AEAEAE',
		fontSize: 11
	},
	promotionRightBottomText1: {
		fontSize: 16.5,
		fontWeight: 'bold'
	},
	progress: {
		height: 8,
		borderRadius: 6,
		overflow: 'hidden',
		position: 'relative',
		backgroundColor: '#D4D2D2',
		marginTop: 5,
		marginBottom: 5
	},
	progressBar: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		backgroundColor: '#00AEEF'
	},
	promotionBtn: {
		backgroundColor: 'rgba(0, 0, 0, .2)',
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		marginTop: 5
	},
	promotionBtnText: {
		color: '#727272',
		fontWeight: 'bold'
	},
	promotionRightBottomText2: {
		marginTop: 5,
		fontSize: 13
	},
	PromotionImgWrap: {
		position: 'absolute',
		top: 8,
		right: 8,
		zIndex: 100
	},
	PromotionImg: {
		width: 18,
		height: 20
	},
	promotionBottomTextWrap: {
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 20,
		marginTop: 40,
		marginHorizontal: 5
	},
	promotionBottomText0: {
		marginBottom: 5,
		textAlign: 'center'
	},
	promotionBottomText1: {
		textDecorationLine: 'underline',
		color: '#000000'
	},
	ToggleIcon: {
		width: 20,
		height: 20
	},
	modalContainer1: {
		width,
		height,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 1
	},
	modalContainer1Text: {
		color: 'transparent',
		fontSize: 0
	},
	toggleBox: {
		position: 'absolute',
		padding: 10,
		top: 40,
		right: 0,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#fff',
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.6,
		shadowRadius: 10,
		shadowColor: '#000',
		elevation: 4,
		zIndex: 999,
		width: width - 140,
		borderRadius: 4
	},
	toggleArrow: {
		width: 0,
		height: 0,
		borderStyle: 'solid',
		borderWidth: 8,
		borderLeftColor: 'transparent',
		borderTopColor: 'transparent',
		borderRightColor: 'transparent',
		position: 'absolute',
		top: -15,
		right: 6
	},
	toggleTextBox: {
		flexWrap: 'wrap',
		width: width - 150
	},
	toggleText1: {
		flexWrap: 'wrap',
		fontSize: 12,
	},
	toggleText2: {
		color: '#2199e8',
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	rebateWraps: {
		flexDirection: 'row',
		marginBottom: 10,
		justifyContent: 'space-between',
	},
	rebateBox: {
		height: 40,
		justifyContent: 'center',
		flexDirection: 'row',
		width: (width - 20) / 2.2,
		alignItems: 'center',
		borderRadius: 4,
		borderWidth: 1,
		borderBottomWidth: 3
	},
	freebetBgImg: {
		width: width - 20,
		height: (width - 20) * .35,
		marginBottom: 10,
		paddingVertical: 20,
		paddingHorizontal: 20,
		justifyContent: 'space-between'
	},
	carouselImg: {
		width,
		height,
	},
	closeBtn: {
		height: 50,
		position: 'absolute',
		bottom: 60,
		width,
	}
})