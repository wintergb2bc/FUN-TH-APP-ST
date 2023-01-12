import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, ImageBackground, RefreshControl } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import { connect } from 'react-redux'
import { getNewsStatisticsAction } from '../../actions/ReducerAction'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import * as Animatable from 'react-native-animatable'
import LoadingBone from './../Common/LoadingBone'

const { width } = Dimensions.get('window')
const AnimatableView = Animatable.View

const NewsTabDatas = [
	{
		title: 'กล่องข้อความ',
		piwikMenberText: 'Inbox_notificationcenter'
	},
	{
		title: 'ข่าวประกาศอื่นๆ',
		piwikMenberText: 'Announcement_notificationcenter'
	}
]

const InboxMessagesTabDatas = [
	{
		title: 'ธุรกรรม',
		inboxMessagesIndex: 2,
		piwikMenberText: 'Transaction_Inbox'
	},
	{
		title: 'ส่วนบุคคล',
		inboxMessagesIndex: 1,
		piwikMenberText: 'Personal_Inbox'
	}
]

const InboxMessageType2 = [
	{
		title: 'ข่าวประกาศทั้งหมด',
		messageTypeOptionID: 0,
		icon: require('./../../images/message/message0.png')
	},
	{
		title: 'รายการฝากเงิน', // 充值
		messageTypeOptionID: 3,
		icon: require('./../../images/message/message1.png')
	},
	{
		title: 'รายการโอนเงิน', // 转账
		messageTypeOptionID: 4,
		icon: require('./../../images/message/message2.png')
	},
	{
		title: 'รายการถอนเงิน', // 提款
		messageTypeOptionID: 5,
		icon: require('./../../images/message/message3.png')
	},
	{
		title: 'รายการเงินโบนัส', // 优惠
		messageTypeOptionID: 6,
		icon: require('./../../images/message/message4.png')
	}
]

const InboxMessageType1 = [
	{
		title: 'รายการทั้งหมด',
		messageTypeOptionID: 0,
		icon: require('./../../images/message/message0.png')
	},
	{
		title: 'Chung',// General
		messageTypeOptionID: 1,
		icon: require('./../../images/message/message8.png')
	},
	{
		title: 'เงินเดิมพันฟรี', // Promotions
		messageTypeOptionID: 2,
		icon: require('./../../images/message/message7.png')
	},
	// {
	// 	title: 'เงินเดิมพันฟรี', // Promotions
	// 	messageTypeOptionID: 11,
	// 	icon: require('./../../images/account/accountIcon/managerwhite14.png')
	// }
]



const AnnouncementMessageType = [
	{
		title: 'ข่าวประกาศทั้งหมด',
		messageTypeOptionID: 0,
		icon: require('./../../images/message/message0.png')
	},
	{
		title: 'รายละเอียดธนาคาร', //Banking
		messageTypeOptionID: 7,
		icon: require('./../../images/message/message5.png')
	},
	{
		title: 'ข่าวเกี่ยวกับการเดิมพัน',// Product
		messageTypeOptionID: 8,
		icon: require('./../../images/message/message0.png')
	},
	{
		title: 'ข่าวเกี่ยวกับโปรโมชั่น', // Promotions
		messageTypeOptionID: 9,
		icon: require('./../../images/message/message7.png')
	},
	{
		title: 'อื่น ๆ',// General
		messageTypeOptionID: 10,
		icon: require('./../../images/message/message8.png')
	}
]

class MeaagesContainer extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			messageIndex: 0,
			messageModalDropdownIndex: 0, // 下拉

			pageSize: 1000,
			pageIndex: 1,
			totalPage: 0,

			inboxMessagesIndex: 2,
			inboxMessagesListItem: null,
			unreadTransactionCounts: 0,

			announcementsByMember: null,
			unreadPersonalMessageCounts: 0,
			refreshing: false,
			unreadAnnouncementCounts: 0,
			arrowFlag: false
		}
	}

	componentDidMount(props) {
		let newsStatisticsData = this.props.newsStatisticsData
		if (newsStatisticsData) {
			this.setState({
				unreadTransactionCounts: newsStatisticsData.unreadTransactionCounts,
				unreadPersonalMessageCounts: newsStatisticsData.unreadPersonalMessageCounts,
				unreadAnnouncementCounts: newsStatisticsData.unreadAnnouncementCounts
			}, () => {
				this.getInboxMessages(1) // 0
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps && nextProps.newsStatisticsData) {
			let newsStatisticsData = nextProps.newsStatisticsData
			this.setState({
				unreadTransactionCounts: newsStatisticsData.unreadTransactionCounts,
				unreadPersonalMessageCounts: newsStatisticsData.unreadPersonalMessageCounts,
				unreadAnnouncementCounts: newsStatisticsData.unreadAnnouncementCounts
			})
		}
	}

	changeMessageIndex(index, piwikMenberText) {// 最顶部
		if (this.state.messageIndex === index) {
			return
		}

		this.setState({
			messageIndex: index,
			messageModalDropdownIndex: 0,
			inboxMessagesIndex: 2,
			pageIndex: 1
		}, () => {
			index * 1 === 0 ? this.getInboxMessages(1) : this.getAnnouncements(1)
		})

		piwikMenberText && window.PiwikMenberCode(piwikMenberText)
	}

	changeInboxMessagesIndex(index, piwikMenberText) {
		if (this.state.inboxMessagesIndex === index) {
			return
		}
		this.setState({
			messageModalDropdownIndex: 0,
			inboxMessagesIndex: index,
			pageIndex: 1
		}, () => {
			this.getInboxMessages(1)
		})

		piwikMenberText && window.PiwikMenberCode(piwikMenberText)
	}

	changeMessageModalDropdownIndex(index) { // 下拉
		if (this.state.messageModalDropdownIndex == index) return
		this.setState({
			messageModalDropdownIndex: index,
			pageIndex: 1
		}, () => {
			const { messageIndex } = this.state
			messageIndex * 1 === 0 ? this.getInboxMessages(1) : this.getAnnouncements(1)
		})
	}

	getInboxMessages(flag) {
		if (flag == 1 || flag == 3) {
			this.setState({
				inboxMessagesListItem: null
			})
		}
		if (flag == 1 || flag == 3) {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
		}
		if (flag == 1) {
			this.setState({
				totalPage: 0
			})
		}
		const { unreadTransactionCounts, unreadPersonalMessageCounts, unreadAnnouncementCounts, pageSize, pageIndex, messageModalDropdownIndex, inboxMessagesIndex } = this.state
		const messageTypeOptionID = inboxMessagesIndex == 1 ? InboxMessageType1[messageModalDropdownIndex].messageTypeOptionID : InboxMessageType2[messageModalDropdownIndex].messageTypeOptionID
		fetchRequest(ApiPort.GetInboxMessages + `MessageTypeID=${inboxMessagesIndex}&MessageTypeOptionID=${messageTypeOptionID}&PageSize=${pageSize}&PageIndex=${pageIndex}&`, 'GET').then(data => {
			Toast.hide()
			let inboxMessagesListItem = data.InboxMessagesListItem
			if (Array.isArray(inboxMessagesListItem)) {
				let totalGrandRecordCount = data.TotalGrandRecordCount
				this.setState({
					refreshing: false,
					inboxMessagesListItem: inboxMessagesListItem,
					totalPage: totalGrandRecordCount % pageSize === 0 ? totalGrandRecordCount / pageSize : Math.floor(totalGrandRecordCount / pageSize) + 1,
				})

				if (flag == 2) {
					if (inboxMessagesIndex == 2) {
						if (messageModalDropdownIndex == 0) {
							let totalUnreadCount = data.TotalUnreadCount
							this.setState({
								unreadTransactionCounts: totalUnreadCount
							})
						}
						this.props.getNewsStatisticsAction(inboxMessagesIndex, {
							unreadTransactionCounts,
							unreadPersonalMessageCounts,
							unreadAnnouncementCounts
						})
					}

					if (inboxMessagesIndex == 1) {
						let totalUnreadCount = data.TotalUnreadCount
						this.setState({
							unreadPersonalMessageCounts: totalUnreadCount
						}, () => {
							this.props.getNewsStatisticsAction(inboxMessagesIndex, {
								unreadTransactionCounts,
								unreadPersonalMessageCounts: totalUnreadCount,
								unreadAnnouncementCounts
							})
						})
					}
				} else {
					let totalUnreadCount = data.TotalUnreadCount
					this.props.getNewsStatisticsAction(4, {
						unreadTransactionCounts: (inboxMessagesIndex == 2 && messageModalDropdownIndex == 0) ? totalUnreadCount : unreadTransactionCounts,
						unreadPersonalMessageCounts: inboxMessagesIndex == 1 ? totalUnreadCount : unreadPersonalMessageCounts,
						unreadAnnouncementCounts
					})
				}
			}
		}).catch(error => {
			Toast.hide()
		})
	}

	getAnnouncements(flag) {
		if (flag == 1 || flag == 3) {
			this.setState({
				announcementsByMember: null
			})
		}
		if (flag == 1 || flag == 3) {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
		}
		if (flag == 1) {
			this.setState({
				totalPage: 0
			})
		}
		const { unreadTransactionCounts, unreadPersonalMessageCounts, unreadAnnouncementCounts, pageSize, pageIndex, messageModalDropdownIndex } = this.state
		const messageTypeOptionID = AnnouncementMessageType[messageModalDropdownIndex].messageTypeOptionID
		fetchRequest(ApiPort.GetAnnouncements + `MessageTypeOptionID=${messageTypeOptionID}&PageSize=${pageSize}&PageIndex=${pageIndex}&`, 'GET').then(data => {
			Toast.hide()
			let announcementsByMember = data.AnnouncementsByMember
			if (Array.isArray(announcementsByMember)) {
				let totalGrandRecordCount = data.totalGrandRecordCount
				this.setState({
					refreshing: false,
					announcementsByMember: announcementsByMember,
					totalPage: totalGrandRecordCount % pageSize === 0 ? totalGrandRecordCount / pageSize : Math.floor(totalGrandRecordCount / pageSize) + 1,
				})

				if (messageModalDropdownIndex == 0) {
					let unreadAnnouncementCounts = data.TotalUnreadCount
					this.setState({
						unreadAnnouncementCounts
					})
				}

				if (flag == 2) {
					this.props.getNewsStatisticsAction(3, {
						unreadTransactionCounts,
						unreadPersonalMessageCounts,
						unreadAnnouncementCounts: messageModalDropdownIndex == 0 ? data.TotalUnreadCount : unreadAnnouncementCounts
					})
				} else {
					this.props.getNewsStatisticsAction(4, {
						unreadTransactionCounts,
						unreadPersonalMessageCounts,
						unreadAnnouncementCounts: messageModalDropdownIndex == 0 ? data.TotalUnreadCount : unreadAnnouncementCounts
					})
				}
			}
		}).catch(error => {
			Toast.hide()
		})
	}

	createMessageList(item, i) {
		const { messageModalDropdownIndex } = this.state
		let flag = messageModalDropdownIndex * 1 === i * 1
		return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={i}>
			<Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.title}</Text>
		</View>
	}

	getInboxMessageIndividualDetail(v, img, time) {
		!(v.IsRead && v.IsOpen) && this.patchActionOnInboxMessage(v, false)
		if (v.MessageID == 0) return
		let isAppContentFlag = Boolean(v.AppContent)
		if (isAppContentFlag) {
			Actions.MessageDetail({ news: v, flag: true, img, time })
		} else {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
			fetchRequest(ApiPort.GetInboxMessageIndividualDetail + 'MessageID=' + v.MessageID + '&', 'GET').then(res => {
				Toast.hide()
				//if (res.isSuccess && res.PersonalMessage) {
				if (res.PersonalMessage.AppTitle && res.PersonalMessage.AppContent) {
					Actions.MessageDetail({ news: res.PersonalMessage, flag: true, img, time })
				}

				//	}
			}).catch(err => {
				Toast.hide()
			})
		}
	}

	patchActionOnInboxMessage(v, flag) {
		const { inboxMessagesIndex, messageIndex } = this.state
		let personalMessageUpdateItem = flag
			?
			v.map(v => ({
				MessageID: v.MessageID,
				MemberNotificationID: v.MemberNotificationID,
				IsRead: true,
				IsOpen: true
			}))
			:
			[{
				MessageID: v.MessageID,
				MemberNotificationID: v.MemberNotificationID,
				IsRead: true,
				IsOpen: true
			}]
		let params = {
			personalMessageUpdateItem,
			actionBy: this.props.memberInforData.UserName,
			timestamp: moment(new Date()).format('YYYY-MM-DDThh:mm:ss')
		}
		flag && Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PatchActionOnInboxMessage, 'PATCH', params).then(res => {
			Toast.hide()
			//if (res.isSuccess) {
			if (flag) {
				v.forEach(v1 => {
					v1.IsRead = true
					v1.IsOpen = true
				})
				this.setState({})
			} else {
				v.IsRead = true
				v.IsOpen = true
				this.setState({})
			}
			this.getInboxMessages(2)
			//}
		})
	}

	getAnnouncementIndividualDetail(v, img, time) {
		!(v.IsRead && v.IsOpen) && this.patchActionOnAnnouncement(v, false)
		let isContentFLag = Boolean(v.Content)
		if (isContentFLag) {
			Actions.MessageDetail({ news: v, flag: false, img, time })
		} else {
			Toast.loading('กำลังโหลดข้อมูล...', 2000)
			fetchRequest(ApiPort.GetAnnouncementIndividualDetail + 'AnnouncementID=' + v.AnnouncementID + '&', 'GET').then(res => {
				Toast.hide()
					//if (res.isSuccess && res.announcementResponse) {
					(res.announcementResponse.Topic && res.announcementResponse.Content) && Actions.MessageDetail({ news: res.announcementResponse, flag: false, img, time })
				//}
			}).catch(err => {
				Toast.hide()
			})
		}
	}

	patchActionOnAnnouncement(v, flag) {
		let announcementUpdateItem = flag
			?
			v.map(v => ({
				AnnouncementID: v.AnnouncementID,
				IsRead: true,
				IsOpen: true
			}))
			:
			[{
				AnnouncementID: v.AnnouncementID,
				IsRead: true,
				IsOpen: true
			}]
		let params = {
			announcementUpdateItem,
			actionBy: this.props.memberInforData.UserName,
			timestamp: moment(new Date()).format('YYYY-MM-DDThh:mm:ss')
		}
		flag && Toast.loading('กำลังโหลดข้อมูล...', 2000)
		fetchRequest(ApiPort.PatchActionOnAnnouncement, 'PATCH', params).then(res => {
			Toast.hide()
			//if (res.isSuccess) {
			this.getAnnouncements(2)
			//if (res.isSuccess) {
			if (flag) {
				v.forEach(v1 => {
					v1.IsRead = true
					v1.IsOpen = true
				})
				this.setState({})
			} else {
				v.IsRead = true
				v.IsOpen = true
				this.setState({})
			}
			//}
			//	}
		}).catch(err => {
			Toast.hide()
		})
	}

	patchActionMessage() {
		const { messageIndex, inboxMessagesListItem, announcementsByMember, inboxMessagesIndex } = this.state
		if (messageIndex) {
			let announcementsByMemberId = announcementsByMember.filter(v => !(v.IsRead && v.IsOpen))
			announcementsByMemberId.length > 0 && this.patchActionOnAnnouncement(announcementsByMemberId, true)
		} else {
			let inboxMessagesIndexId = inboxMessagesListItem.filter(v => !(v.IsRead && v.IsOpen))
			inboxMessagesIndexId.length > 0 && this.patchActionOnInboxMessage(inboxMessagesIndexId, true)
		}

		let piwikMenberText = messageIndex == 0 ? (inboxMessagesIndex == 2 ? 'Markallasread_transaction_Inbox' : 'Markallasread_personal_Inbox') : 'Markallasread_announcement'
		window.PiwikMenberCode(piwikMenberText)
	}

	renderNewsBone() {
		return Array.from({ length: 10 }, v => v).map((v, i) => {
			return <View
				key={i}
				style={[styles.newsWrap, styles.newsBoneWrap]}
			>
				<LoadingBone></LoadingBone>
			</View>
		})
	}

	refreshingMessage() {
		const { messageIndex } = this.state
		this.setState({
			refreshing: true
		})
		messageIndex * 1 === 0 ? this.getInboxMessages(1) : this.getAnnouncements(1)
	}

	handleViewRef = ref => this.handleMessageView = ref

	changeArrowStatus(arrowFlag) {
		this.setState({
			arrowFlag
		})
	}

	render() {
		window.makeMessagePageAnimatable = (translateX) => {
			window.mainPageIndex = 3
			window.makeFadeInTranslation && this.handleMessageView && this.handleMessageView.animate && this.handleMessageView.animate(window.makeFadeInTranslation(translateX), 300)
		}
		const { arrowFlag, unreadTransactionCounts, unreadPersonalMessageCounts, unreadAnnouncementCounts, pageIndex, totalPage, refreshing, inboxMessagesIndex, inboxMessagesListItem, messageModalDropdownIndex, messageIndex, announcementsByMember } = this.state
		const messageTypeFlag = messageIndex === 0
		const messageType = messageTypeFlag ? (inboxMessagesIndex * 1 === 1 ? InboxMessageType1 : InboxMessageType2) : AnnouncementMessageType
		let counts = messageIndex == 1 ? unreadAnnouncementCounts : (inboxMessagesIndex == 2 ? unreadTransactionCounts : unreadPersonalMessageCounts)
		return <AnimatableView ref={this.handleViewRef} easing={'ease-in-out'} style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
			<View style={[styles.newsWraps, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
				{
					NewsTabDatas.map((v, i) => {
						let flag = messageIndex * 1 === i
						let style = [styles.newsWrapsListText, { color: window.isBlue ? (flag ? '#000' : '#000') : (flag ? '#fff' : 'rgba(255, 255, 255, .2)') }]
						return <TouchableOpacity key={i}
							style={
								[
									styles.newsWrapsList,
									{
										borderBottomWidth: 2,

										borderBottomColor: flag ? '#59BA6D' : '#fff'
									}]}
							onPress={this.changeMessageIndex.bind(this, i, v.piwikMenberText)}
						>
							<Text style={style}>{v.title}</Text>
							{
								//flag && <View style={[styles.newsWrapsListLine]}></View>
							}
							{/* {
								i === 0 && (unreadTransactionCounts + unreadPersonalMessageCounts) > 0 && <Text style={[style, { marginHorizontal: 5 }]}>({unreadTransactionCounts + unreadPersonalMessageCounts})</Text>
							}
							{
								i === 1 && unreadAnnouncementCounts > 0 && <Text style={[style, { marginHorizontal: 5 }]}>({unreadAnnouncementCounts})</Text>
							} */}
						</TouchableOpacity>
					})
				}
			</View>

			<View style={{ backgroundColor: '#F3F4F8', paddingHorizontal: 10 }}>
				{
					messageIndex === 0 && <View style={[styles.rebateWraps]}>
						{
							InboxMessagesTabDatas.map((v, i) => {
								let flag = inboxMessagesIndex === v.inboxMessagesIndex
								return <TouchableOpacity
									key={i}
									onPress={this.changeInboxMessagesIndex.bind(this, v.inboxMessagesIndex, v.piwikMenberText)}
									style={[styles.rebateBox, {
										backgroundColor: window.isBlue ? (flag ? '#3F64C5' : '#fff') : (flag ? '#25AAE1' : '#0F0F0F'),
										width: (width - 20) / 2.1,
									}]}
								>
									<Text style={{ color: window.isBlue ? (flag ? '#fff' : '#58585B') : '#fff' }}>{v.title}</Text>
									{
										//i == 0 && unreadTransactionCounts > 0 && <View style={styles.redDot}></View>
									}
									{
										//i == 1 && unreadPersonalMessageCounts > 0 && <View style={styles.redDot}></View>
									}
								</TouchableOpacity>
							})
						}
					</View>
				}

				{
					!(messageIndex === 0 && inboxMessagesIndex === 1) &&
					<View style={styles.informationModalDropdown}>

						<ModalDropdown
							animated={true}
							options={messageType}
							renderRow={this.createMessageList.bind(this)}
							onSelect={this.changeMessageModalDropdownIndex.bind(this)}
							onDropdownWillShow={() => {
								window.PiwikMenberCode(messageIndex == 0 ? 'Category_transaction_Inbox' : 'Category_announcement')
								this.changeArrowStatus(true)
							}}
							onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
							style={[styles.toreturnModalDropdown, {
								backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#C9C9C9' : '#00CEFF',

							}]}
							dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: messageType.length * 30 + 5 }]}
						>
							<View style={styles.toreturnModalDropdownTextWrap}>
								<Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#707070' : '#fff' }]}>{messageType[messageModalDropdownIndex].title}</Text>
								<ModalDropdownArrow arrowFlag={arrowFlag} />
							</View>
						</ModalDropdown>
					</View>
				}

				<TouchableOpacity style={styles.informationModalDropdownBottom} onPress={this.patchActionMessage.bind(this)}>
					<Text style={[styles.informationModalDropdownBottomText, { color: window.isBlue ? '#4DABE9' : '#00CEFF', textDecorationColor: window.isBlue ? '#4DABE9' : '#00CEFF' }]}>ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
						{
							counts > 0 && `(${counts})`
						}
					</Text>
				</TouchableOpacity>

			</View>

			<ScrollView
				automaticallyAdjustContentInsets={false}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				//style={styles.informationScrollView}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						tintColor={'#25AAE1'}
						onRefresh={this.refreshingMessage.bind(this)}
					/>
				}
			>
				{
					messageIndex === 0
						?
						(
							Array.isArray(inboxMessagesListItem)
								?
								(
									inboxMessagesListItem.length > 0
										?
										inboxMessagesListItem.map((v, i) => {
											let flag = !(v.IsRead && v.IsOpen)
											let tempInboxMessageTypeImg = (inboxMessagesIndex * 1 === 1 ? InboxMessageType1 : InboxMessageType2).find(v1 => v1.messageTypeOptionID * 1 === v.MessageTypeOptionID)
											let time = v.MessageID * 1 === 0 ? moment(v.SendOn).add(8, 'hour').format('MM/DD/YYYY HH:mm:ss') : moment(v.SendOn).add(8, 'hour').format('MM/DD/YYYY HH:mm:ss')
											return <TouchableOpacity
												key={i}
												style={[styles.newsWrap,
												{
													// borderColor: window.isBlue ? (flag ? '#00AEFF' : '#fff') : (flag ? '#727272' : '#3B3B3B'),
													// backgroundColor: window.isBlue ? (flag ? '#D6F2FF' : '#fff') : (flag ? '#3B3B3B' : '#212121')
													//marginBottom: i == inboxMessagesListItem.length - 1 ? 200: 10
												}]}
												onPress={this.getInboxMessageIndividualDetail.bind(this, v, tempInboxMessageTypeImg ? tempInboxMessageTypeImg.icon : '', time)}
											>
												{
													tempInboxMessageTypeImg && <ImageBackground
														resizeMode='stretch'
														source={tempInboxMessageTypeImg.icon}
														style={styles.inboxMessagesListItemImg}>
														{
															flag && <Image
																resizeMode='stretch'
																source={require('./../../images/message/Notification.png')}
																style={styles.Notification}></Image>
														}
													</ImageBackground>
												}
												<View style={styles.informationRight}>
													<View style={styles.informationRightText2Box}>
														<Text style={[styles.informationRightText2, { color: window.isBlue ? '#ABABAC' : 'rgba(255, 255, 255, .4)' }]}>{time}</Text>
													</View>
													<Text style={[styles.informationRightText1, { color: window.isBlue ? '#000' : '#fff' }]}>{v.AppTitle}</Text>
												</View>
											</TouchableOpacity>
										})
										:
										<View style={{ alignItems: 'center' }}>
											<Image resizeMode='stretch' style={{
												width: 80,
												height: 80,
												marginTop: 100
											}} source={require('./../../images/message/Mask.png')}></Image>
											<Text style={[styles.noMessageText, { color: window.isBlue ? '#6C6C6C' : '#fff' }]}>ไม่พบข้อความ</Text>
										</View>
								)
								:
								this.renderNewsBone()
						)
						:
						(
							Array.isArray(announcementsByMember)
								?
								(
									announcementsByMember.length > 0
										?
										announcementsByMember.map((v, i) => {
											let flag = !(v.IsRead && v.IsOpen)
											let tempAnnouncementsByMemberImg = AnnouncementMessageType.find(v1 => v1.messageTypeOptionID * 1 === v.NewsTemplateCategory)
											let time = v.MessageID * 1 === 0 ? moment(v.SendOn).add(8, 'hour').format('MM/DD/YYYY HH:mm:ss') : moment(v.SendOn).add(8, 'hour').format('MM/DD/YYYY HH:mm:ss')
											return <TouchableOpacity
												key={i}
												style={[styles.newsWrap,
												{
													// borderColor: window.isBlue ? (flag ? '#00AEFF' : '#fff') : (flag ? '#727272' : '#3B3B3B'),
													// backgroundColor: window.isBlue ? (flag ? '#D6F2FF' : '#fff') : (flag ? '#3B3B3B' : '#212121')
												}]}
												onPress={this.getAnnouncementIndividualDetail.bind(this, v, tempAnnouncementsByMemberImg ? tempAnnouncementsByMemberImg.icon : '', time)}
											>
												{
													tempAnnouncementsByMemberImg && <ImageBackground
														resizeMode='stretch'
														source={tempAnnouncementsByMemberImg.icon}
														style={styles.inboxMessagesListItemImg}>
														{
															flag && <Image
																resizeMode='stretch'
																source={require('./../../images/message/Notification.png')}
																style={styles.Notification}></Image>
														}
													</ImageBackground>
												}
												<View style={styles.informationRight}>
													<View style={styles.informationRightText2Box}>
														<Text style={[styles.informationRightText2, { color: window.isBlue ? '#ABABAC' : 'rgba(255, 255, 255, .4)' }]}>{time}</Text>
													</View>
													<Text style={[styles.informationRightText1, { color: window.isBlue ? '#000000' : '#fff' }]}>{v.Topic}</Text>
												</View>
											</TouchableOpacity>
										})
										:
										<View style={{ alignItems: 'center' }}>
											<Image resizeMode='stretch' style={{
												width: 80,
												height: 80,
												marginTop: 100
											}} source={require('./../../images/message/Mask.png')}></Image>
											<Text style={[styles.noMessageText, { color: window.isBlue ? '#6C6C6C' : '#fff' }]}>ไม่พบข้อความ</Text>
										</View>
								)
								:
								this.renderNewsBone()
						)
				}
			</ScrollView>
		</AnimatableView>
	}
}

export default Message = connect(
	(state) => {
		return {
			memberInforData: state.memberInforData,
			newsStatisticsData: state.newsStatisticsData,
			stateRouterNameData: state.stateRouterNameData
		}
	},
	(dispatch) => {
		return {
			getNewsStatisticsAction: (flag, unreadCounts) => dispatch(getNewsStatisticsAction(flag, unreadCounts)),
		}
	}
)(MeaagesContainer)

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
	},
	redDot: {
		position: 'absolute',
		width: 8,
		height: 8,
		backgroundColor: '#FF0000',
		top: 0,
		right: 0,
		borderRadius: 10000
	},
	noMessageText: {
		textAlign: 'center',
	},
	Notification: {
		width: 14,
		height: 14,
		position: 'absolute',
		right: -6,
		top: -6
	},
	newsWrap: {
		marginBottom: 10,
		paddingHorizontal: 10,
		paddingVertical: 6,
		flexDirection: 'row',
		alignItems: 'center',
	},
	inboxMessagesListItemImg: {
		width: 30,
		height: 26,
		marginRight: 15
	},
	newsWrapsListText: {
		fontWeight: 'bold'
	},
	newsWraps: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	newsWrapsList: {
		height: 42,
		justifyContent: 'center',
		flexDirection: 'row',
		alignItems: 'center',
		width: (width) / 2,
	},
	newsWrapsListLine: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: 1,
		backgroundColor: '#25AAE1',
		bottom: 8
	},
	rebateWraps: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8,
	},
	rebateBox: {
		height: 38,
		justifyContent: 'center',
		flexDirection: 'row',
		width: (width - 20) / 3.2,
		alignItems: 'center',
		borderRadius: 6,
	},
	informationModalDropdown: {
		marginTop: 8
	},
	toreturnModalDropdown: {
		height: 38,
		borderRadius: 4,
		marginTop: 6,
		borderWidth: 1,
		justifyContent: 'center',
	},
	toreturnDropdownStyle: {
		marginTop: 8,
		width: width - 20,
		shadowColor: '#DADADA',
		shadowRadius: 4,
		shadowOpacity: .6,
		shadowOffset: { width: 2, height: 2 },
		elevation: 4,
	},
	toreturnModalDropdownTextWrap: {
		paddingLeft: 10,
		paddingRight: 10,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	toreturnModalDropdownList: {
		height: 30,
		justifyContent: 'center',
		paddingLeft: 10,
		paddingRight: 10,
	},
	toreturnModalDropdownListText: {},
	toreturnModalDropdownText: {
		fontSize: 13
	},
	informationModalDropdownBottom: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		height: 38,
		alignItems: 'center'
	},
	informationModalDropdownBottomText: {
		fontSize: 15,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	informationScrollView: {
		backgroundColor: '#fff'
	},
	newsBoneWrap: {
		backgroundColor: '#e0e0e0',
		borderColor: 'transparent',
		height: 40,
		overflow: 'hidden'
	},
	informationRight: {
		position: 'relative',
	},
	informationRightText1: {
		fontSize: 13,
		width: width - 80
	},
	informationRightText2Box: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		marginBottom: 6
	},
	informationRightText2: {
		fontSize: 14,
	},
	paginationBox: {
		zIndex: 10,
		position: 'absolute',
		bottom: 0,
		width,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
	},
	paginationBox1: {
		width: width - 20 - 80,
		height: 40,
		justifyContent: 'center'
	},
	paginationBox2: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 40,
	},
	paginationText: {
		color: '#25AAE1'
	},
	paginationWrap: {
		borderWidth: 1,
		borderRadius: 4,
		width: 30,
		height: 30,
		marginHorizontal: 4,
		alignItems: 'center',
		justifyContent: 'center',
		borderColor: '#CCCCCC'
	},
	paginationComWrap: {
		position: 'absolute'
	}
})