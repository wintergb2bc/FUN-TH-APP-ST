import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, ImageBackground, RefreshControl, Modal } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import { connect } from 'react-redux'
import { changePromotionIndexAction, changeHomeRegistLoginModalAction } from '../../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import LoadIngImgActivityIndicator from './../../Common/LoadIngImgActivityIndicator'
import * as Animatable from 'react-native-animatable'
import { NoRecordText, SelectTimeText } from './../../Common/CommonData'
import LoadingBone from './../../Common/LoadingBone'
import Toast from '@/containers/Toast'
import DatePicker from 'react-native-date-picker'
const AnimatableView = Animatable.View
const AnimatableImage = Animatable.Image
const { width, height } = Dimensions.get('window')
const rewardDatas = [
    {
        title: 'สิทธิรายวัน',
        img0: require('./../../../images/promotion/DailyDeals/gift0.png'),
        img1: require('./../../../images/promotion/DailyDeals/gift1.png'),
        piwikMenberText: 'dailydeal_promopage'
    },
    {
        title: 'ประวัติ',
        img0: require('./../../../images/promotion/DailyDeals/file0.png'),
        img1: require('./../../../images/promotion/DailyDeals/file1.png'),
        piwikMenberText: 'History_dailydeal_promopage'
    }
]
import DatePickerCommon from './../../Common/DatePickerCommon'
const DataArr = [
    {
        title: 'วัน',
        day: 0
    },
    {
        title: 'สัปดาห์',
        day: 6
    },
    {
        title: 'เดือน',
        day: 29
    },
]

class DailyDealsContainers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            rewardIndex: 0,
            dailyDealsPromotion: null,
            dailyDealsHistory: '',
            gameLoadObj: {},
            refreshing: false,
            currentDateLabel: 0,
            minDate: moment().subtract(89, 'days').format('YYYY/MM/DD'),
            dateFrom: moment().subtract(0, 'days').format('YYYY/MM/DD'),
            dateTo: moment().format('YYYY/MM/DD'),
            isShowDataPicker: false,
            dateType: 'from'
        }
    }

    componentDidMount() {
        this.getDailyDealsPromotion()
    }

    getDailyDealsHistory(flag) {
        const { dateFrom, dateTo } = this.state
        this.setState({
            dailyDealsHistory: {}
        })
        Toast.loading('กำลังโหลดข้อมูล...', 1000)
        flag && this.setState({
            refreshing: true
        })
        fetchRequest(ApiPort.GetDailyDealsHistory + `dateFrom=${dateFrom}&dateTo=${dateTo}&`, 'GET').then(res => {
            Toast.hide()
            this.setState({
                refreshing: false
            })
            if (Array.isArray(res)) {
                global.storage.save({
                    key: 'dailyDealsHistory',
                    id: 'dailyDealsHistory',
                    data: res,
                    expires: null
                })
                this.setState({
                    dailyDealsHistory: res
                })
            }
        }).catch(err => {
            Toast.hide()
            this.setState({
                refreshing: false
            })
        })
    }

    getDailyDealsPromotion(flag) {
        global.storage.load({
            key: 'dailyDealsPromotion',
            id: 'dailyDealsPromotion'
        }).then(data => {
            this.setState({
                dailyDealsPromotion: data
            })
        }).catch(err => {
            Toast.loading('กำลังโหลดข้อมูล...', .4)
        })
        flag && this.setState({
            refreshing: true
        })
        fetchRequest(ApiPort.GetDailyDealsPromotion, 'GET').then(res => {
            Toast.hide()
            this.setState({
                refreshing: false
            })
            if (Array.isArray(res)) {
                global.storage.save({
                    key: 'dailyDealsPromotion',
                    id: 'dailyDealsPromotion',
                    data: res,
                    expires: null
                })
                this.setState({
                    dailyDealsPromotion: res
                })
            }
        }).catch(err => {
            Toast.hide()
            this.setState({
                refreshing: false
            })
        })
    }

    changeRewardIndex(index) {
        if (index == this.state.rewardIndex) return
        if (!ApiPort.UserLogin && index == 1) {
            this.props.changeHomeRegistLoginModalAction({
                flag: true,
                page: 'home'
            })
            return
        }
        this.setState({
            rewardIndex: index
        }, () => {
            if (this.view0 && this.view1) {
                if (index == 1) {
                    this.view1.fadeInRight(400)
                } else {
                    this.view0.fadeInLeft(400)
                }
            }
        })
        this.setState({
            dailyDealsHistory: ''
        })
        index === 0 && this.getDailyDealsPromotion()

        rewardDatas[index].piwikMenberText && window.PiwikMenberCode(rewardDatas[index].piwikMenberText)
    }

    createDailyDealsStatus(v) {
        let { status, quantity } = v
        const statusUpperCase = status.toLocaleUpperCase().replace(/\s/g, '')
        if (['AVAILABLE', 'GRABBED'].includes(statusUpperCase)) {
            return <AnimatableView
                animation={'pulse'}
                easing='ease-out'
                iterationCount='infinite'
                resizeMode='stretch'
                style={styles.rewardBtnWrap}>
                <Text style={styles.rewardBtnText}>คงเหลือ {quantity}</Text>
            </AnimatableView>
        } else if (statusUpperCase === 'SOLDOUT') {
            return <View style={[styles.rewardBtnWrap, { backgroundColor: '#7F7F7F' }]}>
                <Text style={styles.rewardBtnText}>ขอรับเต็มจำนวน</Text>
            </View>
        }
    }

    goDailyDealPage(v) {
        if (!ApiPort.UserLogin) {
            this.props.changeHomeRegistLoginModalAction({
                flag: true,
                page: 'home'
            })
            return
        }


        Actions.DailyDealPage({
            dailyDeals: v,
            getDailyDealsPromotion: () => {
                this.getDailyDealsPromotion()
            },
            changeTab: (i) => {
                this.props.changeTab(i)
            },
            changeRewardIndex: (i) => {
                this.changeRewardIndex(i)
                this.getDailyDealsHistory()
            }
        })
        let bonusID = v.id
        bonusID && window.PiwikMenberCode(bonusID + '_promopage')
        window.PiwikMenberCode('Promo Nav', 'View', 'DailyDeals_PromoPage')
    }

    getLoadImgStatus(i, flag) {
        this.state.gameLoadObj[`imgStatus${i}`] = flag
        this.setState({})
    }

    changeBettingHistoryDatesIndex(label, i) {
        this.setState({
            currentDateLabel: label * 1,
            dateFrom: moment().subtract(label, 'days').format('YYYY/MM/DD')
        })
    }

    changeBettingDatePicker(type, date) {
        this.setState({
            [type]: moment(date).format('YYYY-MM-DD'),
        })
    }

    handleViewRef0 = ref => this.view0 = ref

    handleViewRef1 = ref => this.view1 = ref


    openPickerModal(type) {
        this.setState({
            isShowDataPicker: true,
            dateType: type
        })
    }


    render() {
        const { dateType, isShowDataPicker, refreshing, rewardIndex, dailyDealsPromotion, dailyDealsHistory, currentDateLabel, minDate, dateTo, dateFrom } = this.state
        const RewardHistoryText1Color = { color: window.isBlue ? '#25AAE1' : '#fff' }
        const RewardHistoryText2Color = { color: window.isBlue ? '#3C3C3C' : '#fff' }
        const CalendarImg = window.isBlue ? require('./../../../images/common/calendarIcon/calendar0.png') : require('./../../../images/common/calendarIcon/calendar1.png')
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F2F2F2' : '#212121' }]}>
            {
                <View style={[styles.rebateWraps, { marginBottom: 8 }]}>
                    {
                        rewardDatas.map((v, i) => {
                            let flag = rewardIndex === i
                            return <TouchableOpacity
                                key={i}
                                onPress={this.changeRewardIndex.bind(this, i)}
                                style={[styles.rebateBox, {
                                    backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#0F0F0F'),
                                    borderColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#646464'),
                                    borderBottomColor: window.isBlue ? (flag ? '#009CD6' : '#DADADA') : (flag ? '#009CD6' : '#646464'),
                                    width: (width - 20) / 2.1,
                                }]}
                            >
                                {
                                    flag
                                        ?
                                        <AnimatableImage
                                            animation={'rubberBand'}
                                            easing='ease-out'
                                            iterationCount='infinite'
                                            resizeMode='stretch'
                                            source={window.isBlue ? (flag ? v.img1 : v.img0) : v.img1}
                                            style={styles.rewardImg}></AnimatableImage>
                                        :
                                        <Image source={window.isBlue ? (flag ? v.img1 : v.img0) : v.img1} style={styles.rewardImg}></Image>
                                }
                                <Text style={{ color: window.isBlue ? (flag ? '#fff' : 'rgba(0, 0, 0, .56)') : '#fff' }}>{v.title}</Text>
                            </TouchableOpacity>
                        })
                    }
                </View>
            }

            <DatePicker
                locale={'th'}
                title=' '
                confirmText='เสร็จสิ้น'
                cancelText='  '
                modal
                mode='date'
                open={isShowDataPicker}
                date={new Date(dateType == 'from' ? dateFrom : dateTo)}
                maximumDate={new Date()}
                minimumDate={new Date(minDate)}
                onConfirm={date => {
                    this.setState({
                        isShowDataPicker: false
                    })
                    this.changeBettingDatePicker(dateType == 'from' ? 'dateFrom' : 'dateTo', date)
                }}
                onCancel={() => {
                    this.setState({
                        isShowDataPicker: false
                    })
                }}
            />


            {
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            tintColor={'#25AAE1'}
                            onRefresh={() => {
                                rewardIndex === 0 ? this.getDailyDealsPromotion(true) : this.getDailyDealsHistory(true)
                            }}
                        />
                    }
                >
                    <AnimatableView ref={this.handleViewRef0}>
                        {
                            rewardIndex === 0 && (
                                Array.isArray(dailyDealsPromotion)
                                    ?
                                    (
                                        dailyDealsPromotion.length > 0 ? dailyDealsPromotion.map((v, i) => {
                                            let now = moment(new Date())
                                            let tempPeriod = v.period.split('-')[1].toLocaleUpperCase()
                                            let period = (tempPeriod.replace(/[A-Z]/g, '')).trim()
                                            let periodArr = period.split(' ')
                                            let periodStr1 = periodArr[0]
                                            let periodStr2 = periodArr[1]
                                            let periodStr1Arr = periodStr1.split('/')
                                            let periodStr = periodStr1Arr[2] + '/' + periodStr1Arr[1] + '/' + periodStr1Arr[0]
                                            let period1 = periodStr + ' ' + periodStr2
                                            let end = moment(new Date(period1))


                                            let dura = end.format('x') - now.format('x')
                                            let tempTime = moment.duration(dura);
                                            let day = tempTime.days()
                                            let hour = tempTime.hours()
                                            let min = tempTime.minutes()
                                            return <AnimatableView key={i} delay={400 * i} animation={i % 2 ? 'bounceInDown' : 'fadeIn'}>
                                                <TouchableOpacity style={[styles.rewardBox]} onPress={this.goDailyDealPage.bind(this, v)} >
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={{ uri: v.imagePath }}
                                                        style={[styles.rewardBoxImg]}
                                                        onLoadStart={this.getLoadImgStatus.bind(this, i, false)}
                                                        onLoadEnd={this.getLoadImgStatus.bind(this, i, true)}
                                                        defaultSource={window.isBlue ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')}
                                                    >
                                                        <LinearGradient
                                                            colors={['#00000000', '#0000004D', '#000']}
                                                            start={{ y: 0, x: 0 }}
                                                            end={{ y: 1, x: 0 }}
                                                            style={[styles.rewardBoxImg, { opacity: .9 }]}
                                                        >
                                                            <View style={styles.rewardTextWrap}>
                                                                <Text style={styles.rewardTex1}>{v.title}</Text>
                                                                <Text style={styles.rewardTex2}>{v.description}</Text>
                                                                {
                                                                    this.createDailyDealsStatus(v)
                                                                }
                                                                <View style={styles.rewardTime}>
                                                                    <Image resizeMode='stretch' source={require('./../../../images/promotion/DailyDeals/rewardTime.png')} style={styles.rewardTimeImg}></Image>
                                                                    <Text style={styles.rewardTimeText}>{hour}ชั่วโมง {min}นาที</Text>
                                                                </View>
                                                                {
                                                                    !this.state.gameLoadObj[`imgStatus${i}`] && <LoadIngImgActivityIndicator />
                                                                }
                                                            </View>
                                                        </LinearGradient>
                                                    </ImageBackground>
                                                </TouchableOpacity>
                                            </AnimatableView>
                                        })
                                            :
                                            <Text style={[styles.noRecord, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
                                    )
                                    :
                                    Array.from({ length: 4 }, v => v).map((v, i) => {
                                        return <View style={[styles.rewardBox, styles.rewardBoxImg, { backgroundColor: '#e0e0e0' }]} key={i}>
                                            <LoadingBone></LoadingBone>
                                        </View>
                                    })
                            )
                        }
                    </AnimatableView>

                    <AnimatableView ref={this.handleViewRef1}>
                        {
                            rewardIndex === 1 && <View>
                                <DatePickerCommon
                                    dateTo={dateTo}
                                    dateFrom={dateFrom}
                                    fromPage={'BettingHistory'}
                                    changeBettingDatePicker={this.changeBettingDatePicker.bind(this)}
                                ></DatePickerCommon>
                                <TouchableOpacity style={[styles.searchBtn]}
                                    onPress={() => {
                                        this.getDailyDealsHistory()
                                    }}
                                >
                                    <Text style={{ color: '#fff' }}>ค้นหา</Text>
                                </TouchableOpacity>
                                {
                                    dailyDealsHistory === ''
                                        ?
                                        <Text style={[styles.noRecord, { color: window.isBlue ? '#000' : '#fff' }]}>{SelectTimeText}</Text>
                                        :
                                        (
                                            (Array.isArray(dailyDealsHistory) ?
                                                (
                                                    dailyDealsHistory.length > 0 ? dailyDealsHistory.map((v, i) => {
                                                        return <AnimatableView key={i} delay={400 * i} animation={i % 2 ? 'bounceInDown' : 'fadeIn'}>
                                                            <View style={[styles.rewardHistory, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#DBDBDB' : '#626262' }]}>
                                                                <View style={styles.rewardHistoryTextWrap}>
                                                                    <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>วันที่ทำรายการ</Text>
                                                                    <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{moment(v.applyDate).format('YYYY-MM-DD')}</Text>
                                                                </View>
                                                                <View style={styles.rewardHistoryTextWrap}>
                                                                    <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>หมายเลขอ้างอิง</Text>
                                                                    <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.refID}</Text>
                                                                </View>
                                                                <View style={[styles.rewardHistoryTextWrap, styles.rewardHistoryTextWrap1]}>
                                                                    <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>โบนัส</Text>
                                                                    <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.item}</Text>
                                                                </View>
                                                                <View style={[styles.rewardHistoryTextWrap, styles.rewardHistoryTextWrap1]}>
                                                                    <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>โปรโมชั่น</Text>
                                                                    <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.description}</Text>
                                                                </View>
                                                                <View style={styles.rewardHistoryTextWrap}>
                                                                    <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>สถานะ</Text>
                                                                    <Text style={[styles.rewardHistoryText2, RewardHistoryText2Color]}>{v.status}</Text>
                                                                </View>
                                                                <View style={[styles.rewardHistoryTextWrap, styles.rewardHistoryTextWrap1]}>
                                                                    <Text style={[styles.rewardHistoryText1, RewardHistoryText1Color]}>หมายเหตุ</Text>
                                                                    <TouchableOpacity onPress={() => {
                                                                        this.props.changeTab(1)
                                                                    }}>
                                                                        <Text style={[styles.arewardHistoryText2, { color: '#25AAE1', fontSize: 11, textDecorationLine: 'underline' }]}>คลิกเพื่อตรวจสอบสถานะยอดหมุนเวียนสะสม</Text>
                                                                    </TouchableOpacity>

                                                                </View>
                                                            </View>
                                                        </AnimatableView>
                                                    })
                                                        :
                                                        <Text style={[styles.noRecord, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
                                                )
                                                :
                                                Array.from({ length: 4 }, v => v).map((v, i) => {
                                                    return <View style={[styles.rewardBox, styles.rewardBoxImg, { backgroundColor: '#e0e0e0' }]} key={i}>
                                                        <LoadingBone></LoadingBone>
                                                    </View>
                                                })
                                            )
                                        )
                                }
                            </View>
                        }
                    </AnimatableView>
                </ScrollView>
            }
        </View>
    }
}

export default DailyDeals = connect(
    (state) => {
        return {
            promotionIndexData: state.promotionIndexData
        }
    }, (dispatch) => {
        return {
            changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
        }
    }
)(DailyDealsContainers)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        padding: 10,
        paddingBottom: 0
    },
    rebateWraps: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    rebateBox: {
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        width: (width - 20) / 3.2,
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderBottomWidth: 3
    },
    rewardImg: {
        width: 20,
        height: 20,
        marginRight: 6
    },
    rewardBox: {
        marginBottom: 10,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative'
    },
    rewardBoxImg: {
        width: width - 20,
        height: 160,
    },
    rewardTextWrap: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        zIndex: 15,
        backgroundColor: 'rgba(0, 0, 0, .2)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    rewardTime: {
        backgroundColor: '#848484BF',
        padding: 4,
        paddingLeft: 6,
        paddingRight: 6,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        position: 'absolute',
        top: 5,
        right: 5
    },
    rewardTimeImg: {
        width: 18,
        height: 18,
        marginRight: 5
    },
    rewardTimeText: {
        color: '#fff'
    },
    rewardTex1: {
        fontSize: 17,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 30,
        textAlign: 'center'
    },
    rewardTex2: {
        color: '#fff',
        marginTop: 5,
        marginBottom: 5,
        fontSize: 13,
        textAlign: 'center'
    },
    rewardBtnWrap: {
        backgroundColor: '#33C85D',
        borderRadius: 4,
        paddingHorizontal: 25,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6
    },
    rewardBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    rewardHistory: {
        borderRadius: 5,
        marginBottom: 10,
        padding: 4,
        paddingHorizontal: 5,
        borderWidth: 1
    },
    rewardHistoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rewardHistoryTextWrap: {
        flexDirection: 'row',
        paddingVertical: 5,
        alignItems: 'center',
    },
    rewardHistoryTextWrap1: {

    },
    rewardHistoryText1: {
        width: 110,
        fontSize: 12
    },
    rewardHistoryText2: {
        fontSize: 12
    },
    noRecord: {
        textAlign: 'center',
        marginTop: 200
    },
    bettingWraps: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    bettingBox: {
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        width: (width - 20) / 3.2,
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#DBDBDB'
    },
    bettingDatePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: (width - 20),
        borderWidth: 1,
        borderRadius: 4
    },
    datePickerWrapView: {
        flexDirection: 'row',
        height: 40,
        width: (width - 20) * .6 / 2.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBtnImg1: {
        width: 20,
        height: 20,
        marginRight: 6
    },
    calendarImg: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 8
    },
    recordStyle: {
        borderRadius: 4,
        borderWidth: 1,
        width: (width - 36) / 2.05,
    },
    bettingDatePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    searchBtn: {
        width: width - 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#06ADEF',
        borderRadius: 4,
        marginTop: 10,
        marginBottom: 10
    },
    searchBtnImg: {
        width: 26,
        height: 26
    },
    cancleBox: {
        height: 40,
        width: 65,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 4
    }
})