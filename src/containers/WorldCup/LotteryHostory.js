import React from 'react'
import { StyleSheet, Text, View, Dimensions, ImageBackground,  Platform, TouchableOpacity, Image, ScrollView } from 'react-native'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'
import Share from 'react-native-share'
const { width, height } = Dimensions.get('window')
import Video from 'react-native-video';
import Toast from '@/containers/Toast'

const AnimatableView = Animatable.View
export default class LotteryHostory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            promoId: this.props.promoId,
            lotteryHistory: '',
            contentOffsetY: 0
        }
    }

    componentDidMount() {
        this.getPrizeHistory()
    }

    getPrizeHistory() {
        const { promoId } = this.state
        //Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchRequest(ApiPort.MiniGames + 'PrizeHistory?promoId=' + promoId + '&', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    lotteryHistory: res.result.filter(v => v.prizeName != "Empty Prize")
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    onScrollPreferential(event) {
        let contentOffsetY = event.nativeEvent.contentOffset.y
        this.setState({
            contentOffsetY
        })
    }

    render() {
        const { lotteryHistory, contentOffsetY } = this.state
        return <ImageBackground
            resizeMode='stretch'
            source={require('./../../images/worldCup/BG_1.png')}
            style={[styles.viewContainer]}>
            {
                (Array.isArray(lotteryHistory) && lotteryHistory.length > 0)
                    ?
                    <View style={styles.modalBoay}>
                        <View style={styles.historyHead}>
                            <View style={styles.historyHeadView}>
                                <Text style={styles.historyHeadText}>Ngày</Text>
                            </View>
                            <View style={styles.historyHeadView}>
                                <Text style={styles.historyHeadText}>Giải Thưởng</Text>
                            </View>
                            <View style={styles.historyHeadView}>
                                <Text style={styles.historyHeadText}>Trạng Thái</Text>
                            </View>
                        </View>

                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ref={view => { this.scrollView = view }}
                            onScroll={this.onScrollPreferential.bind(this)}
                            scrollEventThrottle={10}
                        >
                            {
                                <View>
                                    <ScrollView
                                        automaticallyAdjustContentInsets={false}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {
                                            lotteryHistory.map((v, i) => <View style={[styles.historyHead, {
                                                marginVertical: 4,
                                                backgroundColor: i % 2 ? '#EEEEE4' : '#EEEEE4',
                                                borderRadius: 10,
                                                marginHorizontal: 10
                                            }]}>
                                                <View style={[styles.historyHeadView, styles.historyHeadView1]}>
                                                    <Text style={[styles.historyHeadText, styles.historyHeadText1]}>{moment(v.applyDate).format('YYYY-MM-DD HH:MM:SS')}</Text>
                                                </View>
                                                <View style={[styles.historyHeadView, styles.historyHeadView1]}>
                                                    <Text style={[styles.historyHeadText, styles.historyHeadText1]}>{v.prizeName}</Text>
                                                </View>
                                                <View style={[styles.historyHeadView, styles.historyHeadView1]}>
                                                    <Text style={[styles.historyHeadText, styles.historyHeadText1]}>{v.prizeStatusDesc}</Text>
                                                </View>
                                            </View>)
                                        }
                                    </ScrollView>
                                </View>
                            }
                        </ScrollView>
                        {
                            contentOffsetY > 0 && <TouchableOpacity
                                onPress={() => {
                                    this.scrollView.scrollTo({ x: 0, y: 0, animated: true }, 1)
                                }}
                                style={styles.ArrowWrap}>
                                <Image resizeMode='stretch'
                                    source={require('./../../images/worldCup/Icon-Arrow.png')}
                                    style={styles.Arrow}></Image>
                                <Text style={styles.ArrowWrapTExt}>Về Đầu Trang​</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    :
                    <View style={styles.EmptyPrizeBox}>
                        <Image
                            resizeMode='stretch'
                            source={require('./../../images/worldCup/Icon-EmptyPrize.png')}
                            style={[styles.EmptyPrize]}
                        ></Image>
                        <Text style={styles.noHistory}>Không có giải thưởng nào</Text>
                    </View>
            }
        </ImageBackground>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    historyHead: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    historyHeadView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 15,
        width: (width - 40) / 3,
        paddingTop: 25
    },
    historyHeadView1: {
        paddingBottom: 10,
        paddingTop: 10
    },
    historyHeadText: {
        color: '#656565',
        flexWrap: 'wrap',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    historyHeadText1: {
        fontWeight: 'normal'
    },
    modalBoay: {
        marginVertical: 20,
        marginHorizontal: 10,
        width: width - 20,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderRadius: 10,
        marginBottom: 40,
        flex: 1
    },
    ArrowWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(37, 174, 225, .7)',
        borderRadius: 100000,
        width: 50,
        paddingVertical: 10,
        position: 'absolute',
        right: 10,
        bottom: 10
    },
    Arrow: {
        height: 25,
        width: 25,
        marginBottom: 5
    },
    ArrowWrapTExt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 10
    },
    EmptyPrizeBox: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    EmptyPrize: {
        width: 80,
        height: 90,
        marginTop: height * .28
    },
    noHistory: {
        textAlign: 'center',
        color: '#D1B88E',
        marginTop: 15,
        fontSize: 16
    },
})