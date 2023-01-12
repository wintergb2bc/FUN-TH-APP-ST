/*
    投注页面 公用头部  赛事比分概况
*/
import React from "react";
import moment from 'moment';
import ReactNative, {
    StyleSheet,
    Text,
    Image,
    View,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    ImageBackground,
    Linking,
    
    NativeModules,
    Alert,
    UIManager,
    Modal
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Actions } from "react-native-router-flux";
import Touch from 'react-native-touch-once';
import SportImage from '../../containers/SbSports/game/RNImage'

//左補0
const padLeft = (str, length) => {
    if (str.length >= length)
        return str;
    else
        return padLeft("0" + str, length);
}

class HeaderList extends React.Component {
    constructor() {
        super();

        this.state = {
            HeaderData: [],
            activeSlide: 0,
        };

    }
    componentDidMount() {

    }

    componentWillUnmount() {

    }
	goDetaile(EventData) {
		// ${ this.props.Vendor.configs.VendorPage } /detail?sid=${EventData.SportId}&eid=${EventData.EventId}&lid=${EventData.LeagueId}
		let dataList = {
			eid: EventData.EventId,
			sid: EventData.SportId,
			lid: EventData.LeagueId,
			// OE: IsOutRightEvent,
			// BetMore: this.state.PlayBetCart
		}
		PiwikEvent('Match', 'Launch', 'Mainpage_banner')
		Actions.Betting_detail({ dataList, Vendor: this.props.Vendor })
	}

    _renderBannerItem21 = (item, index) => {
		return (
			<View key={index} style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
				{
					item &&
					<Touch onPress={() => { this.goDetaile(item) }} style={styles.BannerLists}>
						<View style={styles.temass}>
							<SportImage imgsID={item.HomeTeamId} />
							<Text style={styles.temasTxts} numberOfLines={1}>{item.HomeTeamName}</Text>
							{
								item.IsRB &&
									item.HomeRedCard &&
									parseInt(item.HomeRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3, paddingRight: 3 }}>
										<Text style={{ color: '#fff', fontSize: 12 }}>{item.HomeRedCard ?? 0}</Text>
									</View>
								)
									: <Text style={{ color: 'transparent' }}>0</Text>
							}
						</View>
						{
							item.IsRB &&
							<View style={styles.temasVS}>
								<View style={[styles.temasVS, { flexDirection: 'row' }]}>
									<Text style={{ color: item.HomeScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item.HomeScore}</Text>
									<Text style={{ color: '#fff', padding: 8 }}>-</Text>
									<Text style={{ color: item.AwayScore > 0 ? '#fff' : '#efeff4', fontSize: 12 }}>{item.AwayScore}</Text>
								</View>
								<View style={styles.gameNumber}>
									<Text style={{ color: '#fff', textAlign: 'center', lineHeight: 30 }}>{item.RBMinute}'</Text>
								</View>
							</View>
						}
						{
							!item.IsRB &&
							<View style={styles.temasVS}>
								<View style={{ position: 'absolute', top: -10, }}>
									<Text style={{ color: '#fff', fontSize: 12, width: 90, textAlign: 'center' }}>{item.getEventDateMoment().format('MM/DD HH:mm')}</Text>
								</View>
								<Text style={{ color: '#fff', padding: 8 }}>VS</Text>
								<Text style={{ color: '#fff', fontSize: 12 }}>chưa bắt đầu</Text>
							</View>
						}

						<View style={styles.temass}>
							<SportImage imgsID={item.AwayTeamId} />
							<Text style={styles.temasTxts} numberOfLines={1}>{item.AwayTeamName}</Text>
							{
								item.IsRB &&
									item.AwayRedCard &&
									parseInt(item.AwayRedCard) > 0 ? (
									<View style={{ backgroundColor: 'red', borderRadius: 5, paddingLeft: 3, paddingRight: 3 }}>
										<Text style={{ color: '#fff', fontSize: 12 }}>{item.AwayRedCard ?? 0}</Text>
									</View>
								)
									: <Text style={{ color: 'transparent' }}>0</Text>
							}
						</View>
					</Touch>
				}
			</View>
		);
	}


    render() {
        window.HeaderData = (HeaderData) => {
            HeaderData && HeaderData.length > 0 && this.setState({ HeaderData })
        }

        const {
            HeaderData,
        } = this.state;

        const HeaderLists = HeaderData.slice(0,3)

        return (
            <View style={{ flex: 1 }}>
                {

                    <View style={{ paddingLeft: 10, marginTop: 10, }}>
                        <ImageBackground
                            source={require("../../images/euroSoprt/EuroCup.png")}
                            style={{ width: width - 20, height: (width - 20) * 0.334, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {
                                 HeaderLists && HeaderLists.length > 0 &&
                                <ScrollView
                                    horizontal={true}
                                    pagingEnabled={true}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    onMomentumScrollEnd={(e) => {
                                        let offsetY = e.nativeEvent.contentOffset.x; //滑动距离
                                        let oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度

                                        let activeSlide = 0
                                        if (offsetY != 0) {
                                            //滑动块数
                                            activeSlide = offsetY / oriageScrollWidth
                                        }
                                        this.setState({ activeSlide })
                                    }}
                                >
                                    {
                                        HeaderLists.map((item, index) => {
                                            return (
                                                <View key={index}>
                                                    {this._renderBannerItem21(item)}
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            }
                        </ImageBackground>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingTop: 10 }}>
                            {
                                HeaderLists && HeaderLists.length > 0 &&
                                HeaderLists.map((item, index) => {
                                    return (
                                        <View key={index} style={this.state.activeSlide == index ? styles.activeSlide : styles.noactiveSlide} />
                                    )
                                })
                            }
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({

	BannerLists: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		width: width - 20,
	},
	temass: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: (width - 20) * 0.42,
	},
	temasTxts: {
		fontSize: 12,
		color: '#fff',
		width: (width - 20) * 0.4,
		paddingTop: 10,
		textAlign: 'center'
	},
	temasVS: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	gameNumber: {
		backgroundColor: '#eb2121',
		borderRadius: 5,
		width: 30,
	},
    activeSlide: {
		width: 20,
		height: 5,
		backgroundColor: '#00a6ff',
		borderRadius: 10,
		marginLeft: 5,
	},
	noactiveSlide: {
		width: 5,
		height: 5,
		backgroundColor: '#BCBEC3',
		borderRadius: 10,
		marginLeft: 5,
	},

})

export default HeaderList;
