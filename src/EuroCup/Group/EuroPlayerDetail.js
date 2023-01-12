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
import { countryData, positionMap } from './common/commonData'
import { doRadarSort } from './common/commonFn'


const commandStyle = euroCommandStyle
const { width, height } = Dimensions.get("window");

export default class EuroPlayerDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			seasonId: seasonId, // 賽季, 23 = 2016 , 24 = 2020 歐洲杯
			playerProfile: this.props.playerProfile || [],
			teamProfile: this.props.teamProfile || []
		};

	}

	componentDidMount() { }

	componentWillMount() { }

	goalkeeperAnalysis() { // 守門員
		const { playerProfile, } = this.state
		const playerInfo = playerProfile && playerProfile.matchInfo

		return (
			<View style={[styles.modalView, { borderRadius: 10, backgroundColor: isBlue? "#fff": '#212121' }]}>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Mất Kiểm Soát Bóng</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.lossOfPossession || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Chuyền Bóng Thành Công</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.passesSuccessful || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Tổng Số Chuyền Bóng</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.passesTotal || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Pha Bóng Thành Công</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.tacklesSuccessful || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Tổng Số Pha Tắc Bóng</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.tacklesTotal || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Đã Thi Đấu</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.played || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Số Bàn Bị Thủng Lưới</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.goalsConceded || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Số Trận Giữ Sạch Lưới</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.cleanSheets || 0}</Text>
					</View>

				</View>
			</View>
		)
	}

	playerAnalysis() { // 一般球員
		const { playerProfile, teamProfile } = this.state
		const playerInfo = playerProfile && playerProfile.matchInfo

		return (
			<View style={[styles.modalView, { margin: 20, borderRadius: 10, backgroundColor: isBlue? "#fff": '#212121'}]}>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Tạo Cơ Hội</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.chancesCreated || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Chuyền Bóng Thành Công</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.passesSuccessful || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Tổng Số Chuyền Bóng</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.passesTotal || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Cản Bóng</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25 , fontSize: 18,fontWeight: 'bold'}}>{playerInfo.interceptions || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Tranh Bóng Thành Công</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.dribblesCompleted || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Kiến Tạo</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.assists || 0}</Text>
					</View>

				</View>

				<View style={{ flexDirection: 'row', justifyContent: 'space-around', }}>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Đã Thi Đấu</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.played || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Trúng Mục Tiêu</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.shotsOnTarget || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10 }}>Bàn Thắng</Text>
						<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25 , fontSize: 18,fontWeight: 'bold'}}>{playerInfo.goals || 0}</Text>
					</View>

					<View style={{ flexDirection: 'column', }}>
						<Text style={{ color: '#757575', fontSize: 10, textAlign: 'center' }}>Thẻ Phạt</Text>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.yellowCards || 0}</Text>
							<View style={{ width: 10, height: 15, backgroundColor: '#FCED50', margin: 5, marginBottom: 0 }} />
							<Text style={{ color: isBlue? '#000': '#fff', textAlign: 'center', lineHeight: 25, fontSize: 18,fontWeight: 'bold' }}>{playerInfo.redCards || 0}</Text>
							<View style={{ width: 10, height: 15, backgroundColor: '#CF2C30', margin: 5, marginBottom: 0 }} />
						</View>
					</View>

				</View>
			</View>
		)
	}

	render() {
		const { playerProfile, teamProfile } = this.state
		const SubCateHeader = ({ name }) => (
			<View style={[commandStyle.subCateHeader]}>
				<View style={commandStyle.subCateHeaderLeft}>
					<Text style={commandStyle.subCateTitle,{color: isBlue?'#212121':'#fff'}}>{name}</Text>
				</View>
			</View>
		)

		return (
			<View style={[styles.rootView,{backgroundColor: isBlue? "#F5F7FA": '#000',}]} >
				{/* Flag */}
				<View style={[{ backgroundColor: countryData[teamProfile.id].bgColor, padding: 10 }]}>

					<View style={{ flexDirection: 'row' }}>
						{/* 左側Flag */}
						<View style={[commandStyle.flexColumn, { width: width * .25, borderRadius: 50, }]}>
							<View style={{ width: 60, height: 60, backgroundColor: '#ddd', borderRadius: 50, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' }}>
								<Image
									resizeMode='contain'
									source={countryData[teamProfile.id].jersey}
									style={{ width: 55, height: 55, marginTop: 2 }}
								/>
							</View>
						</View>

						{/* 右側 */}
						<View style={[commandStyle.flexColumn, { padding: 10, width: width * .5 }]}>
							<View style={[{ flexDirection: 'column', alignItems: 'flex-start', width: width * .5, borderBottomWidth: 0 }]}>
								<Text style={[styles.whiteColor, { fontSize: 15, fontWeight: 'bold', textAlign: 'left', color: countryData[teamProfile.id].txtColor, width: width * 0.6 }]} numberOfLines={1}>{playerProfile.playerName}</Text>

								<View style={{ flexDirection: 'row', marginTop: 5 }}>
									<Image
										resizeMode='contain'
										source={countryData[teamProfile.id].flag}
										style={{ width: 20, height: 20, marginRight: 10 }}
									/>
									<Text style={[styles.whiteColor, styles.fontSizeSmall, { lineHeight: 20,color: countryData[teamProfile.id].txtColor }]}>{teamProfile.name}</Text>
								</View>

								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: width * .3, marginTop: 7 }}>
									<Text style={[styles.whiteColor, styles.fontSizeSmall,{color: countryData[teamProfile.id].txtColor}]}>{positionMap[playerProfile.positionId]}</Text>
								</View>

							</View>
						</View>

					</View>
				</View>
				<Text style={[commandStyle.subCateTitle,{color: isBlue?'#212121':'#fff'}]}>Dữ Liệu Cầu Thủ</Text>
				<View style={[commandStyle.subCateBox,{backgroundColor: isBlue? "#fff": '#212121'}]}>
					{playerProfile.positionId == 'goalkeeper' ? this.goalkeeperAnalysis() : this.playerAnalysis()}
				</View>
				<View style={{ position: 'absolute', bottom: 0,left: 0,zIndex: 99,width: width }}>
					<Text style={{ fontSize: 11, color: isBlue? '#000': '#838383', lineHeight: 50, textAlign: 'center' }}>Bản quyền thuộc về © Fun88 2008 - 2021</Text>
				</View>
			</View >
		);
	}
}

const styles = StyleSheet.create({
	rootView: {
		flex: 1,
		
		color: "#fff",
	},
	bankNav: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		width: width * .9,
		height: 40,
		backgroundColor: '#ffffff',
		marginTop: -4,
	},
	bankList: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: width / 4.45,
		height: 40,
	},
	ListBorderRadius: {
		borderTopLeftRadius: 8,
		borderTopEndRadius: 8,
	},
	whiteColor: {
		color: '#FFFFFF',
	},
	grayColor: {
		color: '#757575',
		lineHeight: 20,
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
