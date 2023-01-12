import React, { Component } from "react";
import {
	Text,
	Platform,
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions,
	Clipboard,
	Image,
	FlatList,
} from "react-native";
import { Actions } from "react-native-router-flux";
import { Flex, Toast, Modal } from "antd-mobile-rn";
import Touch from "react-native-touch-once";
import euroCommandStyle from './common/euroCommonStyle';
import { countryData } from './common/commonData'
import { doRadarSort } from './common/commonFn'
import { getRequestBody, postRequestBody } from './Request'
import { ApiPortSB } from '../../containers/SbSports/lib/SPORTAPI';

const commandStyle = euroCommandStyle
const { width, height } = Dimensions.get("window");

export default class EuroGroupDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			seasonId: seasonId, // 賽季, 23 = 2016 , 24 = 2020 歐洲杯
			teamProfile: this.props.teamProfile || [],
			teamDetail: {},
			isCCW_bank: 0, // 0 銀行卡，1 ERC，2 TRC
			defenderData: [], // 後衛
			midfielder: [], // 中場
			forward: [], // 前锋
			goalkeeper: [], // 守门员
			readMore: false, // 載入更多
			defaulTeamStat: '',
		};

		this.renderPlayer = this.renderPlayer.bind(this)
	}

	componentWillMount() {

		if (this.props.teamProfile) {
			this.getPlayerData()

			// const {
			// 	averageBallPossessionNormalized,
			// 	goalsScoredNormalized,
			// 	freeKicksNormalized,
			// 	cornerKicksNormalized,
			// 	goalsConceded,
			// } = this.props.teamProfile.teamStat
			const getSafeNum = (num) => { return num ? num : 0;}

			let defaulTeamStat = this.props.teamProfile.teamStat.teamStat

			defaulTeamStat.redYellowcards = getSafeNum(defaulTeamStat.redCards) + getSafeNum(defaulTeamStat.yellowCards);
			defaulTeamStat.averageBallPossessionNormalized = getSafeNum(defaulTeamStat.averageBallPossessionNormalized)
			defaulTeamStat.goalsScoredNormalized = getSafeNum(defaulTeamStat.goalsScoredNormalized)
			defaulTeamStat.freeKicksNormalized = getSafeNum(defaulTeamStat.freeKicksNormalized)
			defaulTeamStat.cornerKicksNormalized = getSafeNum(defaulTeamStat.cornerKicksNormalized)
			defaulTeamStat.goalsConcededNormalized = getSafeNum(defaulTeamStat.goalsConcededNormalized)

			defaulTeamStat.averageBallPossession = getSafeNum(defaulTeamStat.averageBallPossession)
			defaulTeamStat.goalsScored = getSafeNum(defaulTeamStat.goalsScored)
			defaulTeamStat.freeKicks = getSafeNum(defaulTeamStat.freeKicks)
			defaulTeamStat.cornerKicks = getSafeNum(defaulTeamStat.cornerKicks)
			defaulTeamStat.goalsConceded = getSafeNum(defaulTeamStat.goalsConceded)

			this.setState({defaulTeamStat})

		}

	}


	async getPlayerData() { // 球員數據
		const { teamProfile, seasonId } = this.state
		let defenderData = [], midfielder = [], forward = [], goalkeeper = [] //  後衛 中場 前锋 守门员

		this.setState({ loading: true });

		const reqData = {
			platform: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
			seasonId: seasonId,
		}
		console.log('teamProfileteamProfile',teamProfile)
		const playerDB = await postRequestBody(EuroCupDomain + ApiPortSB.getEuroPlayer + `${teamProfile.teamId}`, reqData)
		console.log('playerDB333', playerDB)
		if (playerDB) {
			playerDB.map((item, index) => {
				if (item.positionId == "defender") defenderData.push(item)
				if (item.positionId == "midfielder") midfielder.push(item)
				if (item.positionId == "forward") forward.push(item)
				if (item.positionId == "goalkeeper") goalkeeper.push(item)
			})

			this.setState({ defenderData, midfielder, forward, goalkeeper, playerDB, loading: false })
		}
	}



	TeamData() { // 隊伍分析
		const { teamDetail, teamProfile, defaulTeamStat } = this.state
		const teamStat = defaulTeamStat
		return (
			<View style={[commandStyle.flexColumn, styles.countryWrap,]}>
				<View style={{ width: width * .43, flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center' }}>
					<Text style={[styles.grayColor,{lineHeight: 10}]}>Kiểm Soát Bóng Trung Bình</Text>
					<Text style={styles.grayColor}>{teamStat.averageBallPossession||0}</Text>
				</View>
				<View style={{ width: width * .43, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>Bàn Thắng</Text>
					<Text style={styles.grayColor}>{teamStat.goalsScored|| 0}</Text>
				</View>
				<View style={{ width: width * .43, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>Đá Phạt</Text>
					<Text style={styles.grayColor}>{teamStat.freeKicks||0}</Text>
				</View>
				<View style={{ width: width * .43, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>Thủng Lưới</Text>
					<Text style={styles.grayColor}>{teamStat.goalsConceded||0}</Text>
				</View>
				<View style={{ width: width * .43, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>Phạt Góc</Text>
					<Text style={styles.grayColor}>{teamStat.cornerKicks||0}</Text>
				</View>
				<View style={{ width: width * .43, flexDirection: 'row', justifyContent: 'space-between' }}>
					<Text style={styles.grayColor}>Thẻ Phạt</Text>
					<Text style={styles.grayColor}>{teamStat.redYellowcards||0}</Text>
				</View>
			</View>
		)
	}

	renderPlayerTabs() { // 球員頁籤
		const { isCCW_bank, teamProfile } = this.state
		return (
			<View style={[styles.bankNav, styles.ListBorderRadius, { backgroundColor: isBlue? '#ffffff': '#212121' }]}>
				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 0 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 0 ? '#00A6FF' : isBlue? '#ffffff': '#212121' }]}
				>
					<Text style={{ color: isCCW_bank == 0 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 0 ? 'bold' : 'normal', fontSize: 13 }}>Tiền Đạo</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 1 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 1 ? '#00A6FF': isBlue? '#ffffff': '#212121' }]}
				>
					<Text style={{ color: isCCW_bank == 1 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 1 ? 'bold' : 'normal', fontSize: 13 }}>Tiền Vệ</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 2 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 2 ?'#00A6FF' : isBlue? '#ffffff': '#212121' }]}
				>
					<Text style={{ color: isCCW_bank == 2 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 2 ? 'bold' : 'normal', fontSize: 13}}>Hậu Vệ</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => { this.setState({ isCCW_bank: 3 }) }}
					style={[styles.bankList, styles.ListBorderRadius, { backgroundColor: isCCW_bank == 3 ? '#00A6FF' : isBlue? '#ffffff': '#212121', fontSize: 13 }]}
				>
					<Text style={{ color: isCCW_bank == 3 ? '#ffffff' : '#757575', fontWeight: isCCW_bank == 3 ? 'bold' : 'normal' }}>Thủ Môn</Text>
				</TouchableOpacity>
			</View>
		)
	}

	renderPlayer(data) { // 球員列表
		const { readMore, teamProfile, isCCW_bank } = this.state
		return (
			<View>
				{
					data.map((item, index) => {
						if (!readMore && index >= 5) return // 默認顯示5組
						return (
							<View index={index} style={{ flexDirection: 'row' }}>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
									<Text style={{ color: isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .1, textAlign: 'center' }}>{item.playerNumber}</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text
									style={{ color: '#1C8EFF', lineHeight: 30, fontSize: 12, width: width * .36 }}
									onPress={() => {Actions.EuroPlayerDetail({ playerProfile: item, teamProfile,isCCW_bank });PiwikMenberCode('Engagement Event​','View','Player_Stats_EUROPage')}}
								>
									{item.playerName}
								</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color:  isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .12, textAlign: 'center' }}>{item.matchInfo.played || 0}</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color:  isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .21, textAlign: 'center' }}>{item.matchInfo.shotsOnTarget || 0}</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color:  isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .21, textAlign: 'center' }}>{item.matchInfo.goals || 0}</Text>
								</View>
							</View>
						)
					})
				}

				{
					!readMore && data && data.length > 5 &&
					<Touch onPress={() => this.setState({ readMore: !readMore })}>
						<Text
							style={{ color: '#9E9E9E', lineHeight: 30, fontSize: 11, width: width, textAlign: 'center' }}>
							Xem thêm
						</Text>
					</Touch>
				}
			</View>
		)
	}

	renderGoalkeeper(data) { // 守門員員列表
		const { readMore, teamProfile } = this.state
		return (
			<View>
				{
					data.map((item, index) => {
						if (!readMore && index >= 5) return // 默認顯示5組
						return (
							<View index={index} style={{ flexDirection: 'row', }}>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color: isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .1, textAlign: 'center' }}>{item.playerNumber}</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text
									style={{ color: '#1C8EFF', lineHeight: 30, fontSize: 12, width: width * .36 }}
									onPress={() => {Actions.EuroPlayerDetail({ playerProfile: item, teamProfile }); PiwikMenberCode('Engagement Event​','View','Player_Stats_EUROPage')}}
								>
									{item.playerName}
								</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color: isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .12, textAlign: 'center' }}>{item.matchInfo.played || 0}</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color: isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .21, textAlign: 'center' }}>{item.matchInfo.goalsConceded || 0}</Text>
								</View>
								<View style={{borderBottomWidth: 1, borderBottomColor: isBlue? '#EEEEEE': '#000'}}>
								<Text style={{ color: isBlue?'#000': '#fff', lineHeight: 30, fontSize: 12, width: width * .21, textAlign: 'center' }}>{item.matchInfo.cleanSheets || 0}</Text>
								</View>
							</View>
						)
					})
				}

				{
					!readMore && data && data.length > 5 &&
					<Touch onPress={() => this.setState({ readMore: !readMore })}>
						<Text
							style={{ color: '#9E9E9E', lineHeight: 30, fontSize: 11, width: width, textAlign: 'center' }}>
							Xem thêm
						</Text>
					</Touch>
				}
			</View>
		)
	}

	render() {
		const { teamProfile, teamDetail, isCCW_bank, defenderData, midfielder, forward, goalkeeper, defaulTeamStat } = this.state;
		const teamStat = defaulTeamStat
		console.log('teamProfile',teamProfile)
		const SubCateHeader = ({ name }) => (
			<Text style={commandStyle.subCateTitle,{color: isBlue?'#212121':'#fff'}}>{name}</Text>
		)

		return (
			<ScrollView
			showsHorizontalScrollIndicator={false}
			showsVerticalScrollIndicator={false}
			style={[styles.rootView,{backgroundColor: isBlue? "#F5F7FA": '#000',}]} >
				{/* Flag */}
				<View style={[styles.rootView, { backgroundColor: countryData[teamProfile.id] && countryData[teamProfile.id].bgColor, padding: 10 }]}>

					<View style={{ flexDirection: 'row' }}>
						{/* 左側Flag */}
						<View style={[commandStyle.flexColumn, { width: width * .25 }]}>
							<Image
								resizeMode='contain'
								source={countryData[teamProfile.id] && countryData[teamProfile.id].flag}
								style={{ width: 60, height: 60, }}
							/>
						</View>

						{/* 右側 */}
						<View style={[commandStyle.flexColumn, { padding: 10, width: width * .5 }]}>
							<View style={[{ flexDirection: 'column', alignItems: 'flex-start', width: width * .5, borderBottomWidth: 0 }]}>
								<Text style={[styles.whiteColor, { fontSize: 18, fontWeight: 'bold', textAlign: 'left', color: countryData[teamProfile.id] && countryData[teamProfile.id].txtColor || '#fff' }]}>{teamProfile.name}</Text>
								<Text style={[styles.whiteColor, styles.fontSizeSmall, { lineHeight: 20,color: countryData[teamProfile.id] && countryData[teamProfile.id].txtColor || '#fff' }]}>{teamProfile.group}</Text>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width * .3, }}>
									<Text style={[styles.whiteColor, styles.fontSizeSmall,{color: countryData[teamProfile.id] && countryData[teamProfile.id].txtColor || '#fff'}]}>Dự Đoán {teamProfile.chanceToWin}%</Text>
								</View>
							</View>
						</View>
					</View>
				</View>

				{/* 战力分析 */}
				<View>
					<Text style={[commandStyle.subCateTitle,{color: isBlue?'#212121':'#fff'}]}>Dữ Liệu Đội Bóng</Text>
					<View style={[styles.modalView, { flexDirection: 'row', backgroundColor: isBlue? "#fff": '#212121',}]}>
						{/* 左側雷達 */}
						<View style={[commandStyle.flexColumn, styles.countryWrap, { width: width * .42 }]}>
							{teamStat ? doRadarSort(0, teamProfile.id, teamStat) : null}
						</View>
						{/* 右側數據 */}
						{teamStat ? this.TeamData() : null}
					</View>
				</View>

				{/* 球员分析 */}
				<Text style={[commandStyle.subCateTitle,{color: isBlue?'#212121':'#fff'}]}>Cầu Thủ</Text>
				<View>
					<View style={[{ width: width, backgroundColor: isBlue? "#fff": '#212121', }]}>
						{this.renderPlayerTabs()}
						{/* 列表 */}
						<View>
							<View style={{ flexDirection: 'row', backgroundColor: '#00A6FF', display: 'flex',alignItems: 'center', justifyContent: 'center',paddingLeft: 10,paddingRight: 10 }}>
								<Text style={{ color: '#fff', lineHeight: 30, fontSize: 9, width: width * .1, textAlign: 'center' }}>Số</Text>
								<Text style={{ color: '#fff', lineHeight: 30, fontSize: 9, width: width * .36,paddingLeft: 15 }}>Tên</Text>
								<Text style={{ color: '#fff', fontSize: 9, width: width * .12 }}>Số Trận</Text>
								<Text style={{ color: '#fff', fontSize: 9, width: width * .21, textAlign: 'center' }}>{isCCW_bank == 3 ? 'Thủng Lưới' : 'Trúng Mục Tiêu'}</Text>
								<Text style={{ color: '#fff', fontSize: 9, width: width * .21, textAlign: 'center' }}>{isCCW_bank == 3 ? 'Trận Sạch Lưới' : 'Bàn Thắng'}</Text>
							</View>

							<View style={{ flexDirection: 'row', backgroundColor: isBlue? '#fff': '#212121' }}>
								{isCCW_bank == 0 && forward && this.renderPlayer(forward)}
								{isCCW_bank == 1 && midfielder && this.renderPlayer(midfielder)}
								{isCCW_bank == 2 && defenderData && this.renderPlayer(defenderData)}
								{isCCW_bank == 3 && goalkeeper && this.renderGoalkeeper(goalkeeper)}
							</View>

						</View>
					</View>
				</View>
				<View style={{ marginTop: 40, }}>
					<Text style={{ fontSize: 11, color: isBlue? '#000': '#838383', lineHeight: 50, textAlign: 'center' }}>Bản quyền thuộc về © Fun88 2008 - 2021</Text>
				</View>
			</ScrollView >
		);
	}
}

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		backgroundColor: "#F5F7FA",
	},
	bankNav: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: width,
		height: 40,
		backgroundColor: '#ffffff',
		marginTop: -4,
	},
	bankList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 4,
		height: 40,
	},
	ListBorderRadius: {
		// borderTopLeftRadius: 8,
		// borderTopEndRadius: 8,
	},
	whiteColor: {
		color: '#FFFFFF',
	},
	grayColor: {
		color: '#757575',
		lineHeight: 22,
		fontSize: 10,
	},
	fontSizeSmall: {
		fontSize: 10,
	},
	countryWrap: {
		padding: 10
	},
	modalView: {
		padding: 10,
	},
});
