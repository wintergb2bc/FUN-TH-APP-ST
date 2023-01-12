import React from 'react'
import { StyleSheet, View, Dimensions, Modal, Image, RefreshControl, Platform, ImageBackground, ScrollView, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { getBalanceInforAction, changeHomeRegistLoginModalAction } from '../../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import { toThousands } from './../../../actions/Reg'
import Toast from '@/containers/Toast'
import moment from 'moment'
import Rain from './Rain'
import FastImage from "react-native-fast-image";
const { width, height } = Dimensions.get('window')
import * as Animatable from 'react-native-animatable'
const range = count => {
    const array = [];
    for (let i = 0; i < count; i++) {
        array.push(i);
    }
    return array;
};
const imgs = [require("./../../../images/home/lottery/Freebet/angpao.gif")];
const FreebetImg = [
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_18.png'),
        id: '18',
        type: 'เงินเดิมพันฟรี'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_28.png'),
        id: '28',
        type: 'เงินเดิมพันฟรี'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_58.png'),
        id: '58',
        type: 'เงินเดิมพันฟรี'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_88.png'),
        id: '88',
        type: 'เงินเดิมพันฟรี'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_128.png'),
        id: '128',
        type: 'เงินเดิมพันฟรี'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_188.png'),
        id: '188',
        type: 'เงินเดิมพันฟรี'
    },

    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_288.png'),
        id: '288',
        type: 'เงินเดิมพันฟรี'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-Freebet_588.png'),
        id: '588',
        type: 'เงินเดิมพันฟรี'
    },


    {
        img: require('./../../../images/home/lottery/Freebet/TH-RewardPts_28.png'),
        id: '28',
        type: 'แต้มรีวอร์ด'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-RewardPts_58.png'),
        id: '58',
        type: 'แต้มรีวอร์ด'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-RewardPts_88.png'),
        id: '88',
        type: 'แต้มรีวอร์ด'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-RewardPts_128.png'),
        id: '128',
        type: 'แต้มรีวอร์ด'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-RewardPts_288.png'),
        id: '288',
        type: 'แต้มรีวอร์ด'
    },
    {
        img: require('./../../../images/home/lottery/Freebet/TH-RewardPts_588.png'),
        id: '588',
        type: 'แต้มรีวอร์ด'
    },



    {
        img: require('./../../../images/home/lottery/Freebet/TH-MysteryGift.png'),
        id: 'Phần Quà Bí Ẩn'
    },
]

class LotteryContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            eventEndDate: new Date(),
            eventStartDate: new Date(),
            entryPointStartDate: '',
            entryPointEndDate: '',
            promotionsItem: '',
            isShowMoreInforModal: false,
            isShowHistoryModal: false,
            isShowDepositModal: false,
            isShowPrizeModal: false,
            isShowPrizeModalConatiner: false,
            lotteryHistory: [],
            errorCode: '',
            promoId: '',
            totalDepositedDaily: 0,
            totalDepositedEvent: 0,
            prizeName: '',
            prizeId: '',
            lowestTierMinDeposit: '',
            lotteryRandomArr: [],
            prizeImg: '',
            maxGrabFromHighestTier: 0,
            remainingGrabFromCurrentTier: 0, // 当前剩余次数
            remainingGrabFromHighestTier: 0,   // 总共剩余次数
            rotate: 0,
            refreshing: false,
            isClickBtn: true,
            parentHeight: 0,
            parentWidth: 0,
            rainControl: false
        }
    }

    componentDidMount() {
        this.getMiniGamesActiveGame()
    }

    componentWillReceiveProps(nextProps) {

    }

    componentWillUnmount() {
        this.TimeDown && clearInterval(this.TimeDown)
        this.dealyOpenPrize && clearInterval(this.dealyOpenPrize)
        this.intervalGetLotteryRandomArr && clearInterval(this.intervalGetLotteryRandomArr)
        ApiPort.UserLogin && this.props.getBalanceInforAction()
    }

    getMiniGamesActiveGame() {
        const { } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchRequest(ApiPort.MiniGames + 'ActiveGame?', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                let result = res.result
                let { eventEndDate, eventStartDate, promoId, entryPointEndDate, entryPointStartDate } = result

                this.setState({
                    eventEndDate,
                    eventStartDate,
                    promoId,
                    entryPointEndDate: moment(entryPointEndDate).format('DD/MM'),
                    entryPointStartDate: moment(entryPointStartDate).format('DD/MM')
                }, () => {
                    this.getMemberProgress()
                    this.diffTime()
                })

                const startTime = eventStartDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00'; //结束时间
                const endTime = eventEndDate.replace('T', ' ').replace(/\-/g, '/') + ' +08:00'; //结束时间
                let nowEnd = (parseInt(new Date(endTime).getTime() - new Date().getTime()) > 0) && (parseInt(new Date(startTime).getTime() - new Date().getTime()) < 0);

                if (nowEnd) {
                    this.setState({
                        rainControl: true
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getLotteryRandomArr() {
        let lotteryGifArr = [
            require('./../../../images/home/lottery/Popping_Sport.gif'),
            require('./../../../images/home/lottery/Popping_Slot.gif'),
            require('./../../../images/home/lottery/Popping_Casino.gif')
        ]
        let tempLotteryGifArr = lotteryGifArr.sort((a, b) => { return Math.random() - 0.5 })
        let tempLotteryRandomArr = Array.from({ length: 6 }, (v, i) => i).sort((x, y) => Math.random() > 0.5 ? -1 : 1).slice(0, 3)

        this.setState({
            lotteryRandomArr: tempLotteryRandomArr.map((v, i) => (
                {
                    num: v,
                    gif: tempLotteryGifArr[i]
                }
            ))
        })
    }

    getMemberProgress(flag, flag1) {
        if (!ApiPort.UserLogin) {
            flag && this.props.changeHomeRegistLoginModalAction({
                flag: true,
                page: 'game'
            })
            window.isReLotteryFlag = true
            return
        }
        const { promoId } = this.state
        flag && Toast.loading('กำลังโหลดข้อมูล...', 200000000)
        flag1 && this.setState({
            refreshing: true
        })
        fetchRequest(ApiPort.MiniGames + 'MemberProgress?promoId=' + promoId + '&', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                let result = res.result
                let { totalDepositedDaily, totalDepositedEvent, lowestTierMinDeposit, remainingGrabFromCurrentTier, remainingGrabFromHighestTier, maxGrabFromHighestTier } = result
                this.setState({
                    totalDepositedDaily,
                    totalDepositedEvent,
                    lowestTierMinDeposit,
                    maxGrabFromHighestTier,
                    remainingGrabFromCurrentTier,
                    remainingGrabFromHighestTier,
                    refreshing: false
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getPrizeHistory() {
        if (!ApiPort.UserLogin) {
            window.isReLotteryFlag = true
            this.props.changeHomeRegistLoginModalAction({
                flag: true,
                page: 'game'
            })
            return
        }
        this.setState({
            lotteryHistory: []
        })
        const { promoId } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchRequest(ApiPort.MiniGames + 'PrizeHistory?promoId=' + promoId + '&', 'GET').then(res => {
            Toast.hide()
            this.setState({
                isShowHistoryModal: true
            })
            if (res.isSuccess) {
                this.setState({
                    lotteryHistory: res.result
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    potSnatchPrize(i) {
        window.PiwikMenberCode('Engagement_Event', 'Claim', 'SpinLuckyWheel_MidAutumn22')
        if (!ApiPort.UserLogin) {
            window.isReLotteryFlag = true
            this.props.changeHomeRegistLoginModalAction({
                flag: true,
                page: 'game'
            })
            return
        }


        const { promoId, lotteryRandomArr } = this.state
        this.dealyOpenPrize && clearInterval(this.dealyOpenPrize)
        this.setState({
            isClickBtn: false,
            remainingGrabFromCurrentTier: '',
            remainingGrabFromHighestTier: '',
        }, () => {
        })
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchRequest(ApiPort.MiniGames + 'SnatchPrize?promoId=' + promoId + '&', 'POST').then(res => {
            //let res = { "result": { "prizeStatus": 0, "prizeStatusDesc": "PrizeStatus_0", "applyDate": "2022-12-27T10:27:18.71", "prizeId": 6176, "prizeName": "128 แต้มรีวอร์ด", "actualPrizeValue": 128.0, "prizeType": 3, "prizeTypeDesc": "แต้มรีวอร์ด", "platform": "IOS", "remainingGrabFromCurrentTier": 0, "remainingGrabFromHighestTier": 1 }, "isSuccess": true }
            this.getMemberProgress()
            Toast.hide()
            if (res.isSuccess) {
                let result = res.result
                let { prizeName, prizeId, remainingGrabFromCurrentTier,
                    remainingGrabFromHighestTier, actualPrizeValue, prizeTypeDesc } = result
                let prizeImg = ''
                if (!['แต้มรีวอร์ด', 'เงินเดิมพันฟรี'].includes(prizeTypeDesc)) {
                    prizeImg = require('./../../../images/home/lottery/Freebet/TH-MysteryGift.png')
                } else {
                    prizeImg = FreebetImg.find(v => v.id == actualPrizeValue && v.type == prizeTypeDesc).img
                }

                // const rotateArr = {
                //     'เงินเดิมพันฟรี': [
                //         [22.5, 67.5],
                //         [112.5, 157.5],
                //         [202.5, 337.5]
                //     ],
                //     'แต้มรีวอร์ด': [
                //         [67.5, 112.5],
                //         [157.5, 202.5]
                //     ],
                //     'Phần Quà Bí Ẩn': [
                //         [0, 22.5],
                //         [337.5, 360]
                //     ]
                // }
                // let tempPrizeName = prizeName
                // if (prizeName == 'Phần Quà Bí Ẩn') {
                //     tempPrizeName = prizeName
                // } else {
                //     // let numNameArr = prizeName.match(/[0-9]/g)
                //     // if (Array.isArray(numNameArr) && numNameArr.length) {
                //     //     tempPrizeName = prizeName.split(' ')[1]
                //     // }
                //     tempPrizeName = prizeTypeDesc
                // }


                // let rotateTempItem = rotateArr[tempPrizeName].sort(() => Math.random() - 0.5)[0]
                // let randomAnother = Array.from({ length: 40 }, v => v).map((v, i) => i + 50).sort(() => Math.random() - 0.5)[0] * 360
                // let roateItem = rotateTempItem.map((v, i) => v + randomAnother + (i == 0 ? 5 : -5))
                // let rotate = roateItem[0] + Math.random() * (roateItem[1] - roateItem[0])


                this.setState({
                    // isShowPrizeModal: true,
                    prizeName: result.prizeName,
                    prizeId,
                    prizeImg,
                    remainingGrabFromCurrentTier,
                    remainingGrabFromHighestTier,
                    //rotate: rotate,
                    isClickBtn: true
                }, () => {
                })
                this.dealyOpenPrize = setTimeout(() => {
                    this.setState({
                        isShowPrizeModal: true,
                        isShowPrizeModalConatiner: true
                    })
                }, 1500)
            } else {
                let errors = res.errors
                if (Array.isArray(errors) && errors.length) {
                    this.setState({
                        isShowDepositModal: true,
                        errorCode: errors[0].errorCode,
                        message: errors[0].message
                    })
                }
                this.setState({
                    isClickBtn: true
                })
            }
        }).catch(err => {
            Toast.hide()
        })

    }

    diffTime() {
        const { eventEndDate, entryPointEndDate, eventStartDate } = this.state
        // 当前时间 
        const nowTime = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').valueOf()
        const eventStartDate1 = moment(eventStartDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
        const eventEndDate1 = moment(eventEndDate, 'YYYY-MM-DD HH:mm:ss').valueOf()

        let Time = ''
        if (eventStartDate1 - nowTime > 0) {
            Time = eventStartDate
        } else if (nowTime > eventStartDate1 && nowTime < eventEndDate1) {
            Time = eventEndDate
        } else {
            return
        }

        //计算出相差毫秒数
        const diff = moment(Time, 'YYYY-MM-DD HH:mm:ss').valueOf() - nowTime

        //计算出相差天数
        const days = Math.floor(diff / (24 * 3600 * 1000))

        //计算出小时数
        const leave1 = diff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000))

        //计算相差分钟数
        const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000))

        //计算相差秒数
        const leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave3 / 1000)

        if (diff > 0) {
            this.setState({
                days: days > 9 ? days + '' : `0${days}`,
                hours: hours > 9 ? hours + '' : `0${hours}`,
                minutes: minutes > 9 ? minutes + '' : `0${minutes}`,
                seconds: seconds > 9 ? seconds + '' : `0${seconds}`
            })

            this.TimeDown && clearInterval(this.TimeDown)
            this.TimeDown = setInterval(() => {
                this.diffTime()
            }, 1000)
        } else {


        }
    }

    createErrStatus() {
        const { errorCode, lowestTierMinDeposit } = this.state
        let compmentCom1 = <View style={[styles.modalBoayBtnWrap, { justifyContent: 'center' }]}>
            <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnMid]}
                onPress={() => {
                    this.setState({
                        isShowDepositModal: false
                    })
                }}
            >
                <Text style={[styles.modalBoayBtnLeftText, { color: '#fff' }]}>ตกลง</Text>
            </TouchableOpacity>
        </View>
        let compmentCom2 = <View style={styles.modalBoayBtnWrap}>
            <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnLeft]}
                onPress={() => {
                    this.setState({
                        isShowDepositModal: false
                    })
                }}
            >
                <Text style={styles.modalBoayBtnLeftText}>ย้อนกลับ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnRight]}
                onPress={() => {
                    this.setState({
                        isShowDepositModal: false
                    }, () => {
                        const memberInfor = this.props.memberInforData
                        let FirstName = memberInfor.FirstName
                        FirstName ? Actions.DepositStack() : Actions.Verification({
                            fillType: 'name',
                            fromPage: 'lottery'
                        })
                        errorCode === 'MG00012' && window.PiwikMenberCode('Deposit_Nav', 'Click', 'Deposit_ChineseNewYear23')
                    })
                }}
            >
                <Text style={styles.modalBoayBtnRighText}>ฝากตอนนี้</Text>
            </TouchableOpacity>

        </View>
        let viewContainer = {
            MG00001: {
                //Member have pending deposit.
                message: `ขออภัย คุณไม่สามารถเล่นเกมได้\nกรุณารอการปรับยอดเงินฝาก`,
                btnWrap: compmentCom1
            },
            MG00002: {
                // -Member used up all the grab times.
                //-Member still can deposit to get more grab times.
                message: 'คุณได้ใช้สิทธิ์หมดแล้ว กรุณาฝากเงินอีกครั้งเพื่อเล่นต่อ​',
                btnWrap: compmentCom2
            },
            MG00003: {
                // -Member used up all the grab times.
                //-Member cannot deposit to get more grab times.
                message: `คุณใช้สิทธิ์ของวันนี้หมดแล้ว\nกรุณาเล่นเกมใหม่อีกครั้งพรุ่งนี้`,
                btnWrap: compmentCom1
            },
            MG00004: {
                //Member deposited but not yet reach the minimum amount. 
                message: `ยอดฝากวันนี้น้อยกว่า ${lowestTierMinDeposit} บาท\nกรุณาฝากเพิ่มเพื่อรับสิทธิ์`,
                btnWrap: compmentCom2
            },
            MG00005: {
                // When all prize in all tiers finished.
                message: 'รางวัลหมดแล้ว! ขอบคุณที่ร่วมสนุก.',
                btnWrap: compmentCom1
            },
            MG00006: {

            },
            MG00007: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống báo lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Trực Tuyến!',
                btnWrap: compmentCom1
            },
            MG00008: {
                message: '',
                btnWrap: ''
            },
            MG00009: {},
            MG00012: {
                //Members click on the pop-up balloon and didn’t have any deposit yet.
                message: `ฝาก 300 บาท ได้รับ 1 สิทธิ์\nยิ่งฝากมาก ยิ่งมีสิทธิ์มาก`,
                btnWrap: compmentCom2
            },
            MG99997: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống báo lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Trực Tuyến!',
                btnWrap: compmentCom1
            },
            MG99999: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống báo lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Trực Tuyến!',
                btnWrap: compmentCom1
            },
            CUSVAL002: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống báo lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Trực Tuyến!',
                btnWrap: compmentCom1
            },
            GEN0006: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống báo lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Trực Tuyến!',
                btnWrap: compmentCom1
            },
            MG99998: {
                // 抱歉，该活动已结束，请期待我们的下一个活动,
                message: 'Rất tiếc, sự kiện đã kết thúc. Cùng chờ đón sự kiện tiếp theo của chúng tôi',
                btnWrap: compmentCom1
            }
        }
        return viewContainer
    }

    handleViewRef = ref => this.view = ref

    _FailAnimation = ({ style, duration, delay, startY, speed, children }) => {
        return (
            <Animatable.View //下落动画
                style={style}
                duration={duration}
                delay={delay}
                animation={{
                    from: { translateY: startY },
                    to: { translateY: this.state.parentHeight + speed }
                }}
                easing={t => Math.pow(t, 1.2)}
                iterationCount="infinite"
                useNativeDriver
            >
                {children}
            </Animatable.View>
        );
    };

    _imgRandom = imgs => {
        // let r = Math.ceil(Math.random() * imgs.length);
        return (
            <TouchableOpacity
                onPressOut={() => {
                    window.PiwikMenberCode('Engagement_Event', 'Claim', 'GrabAngpao_ChineseNewYear23')
                    this.potSnatchPrize();
                }}
                style={{ width: 50, height: 75 }}
                hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            >
                <Image
                    resizeMode="contain"
                    resizeMethod="auto"
                    source={imgs[0]}
                    style={{ width: 50, height: 75 }}
                />
            </TouchableOpacity>
        );
    };

    _SwingAnimation = ({ delay, duration, children }) => {
        const translateX = Math.random() * -100;
        return (
            <Animatable.View //左右摇摆动画
                animation={{
                    0: {
                        translateX: translateX,
                        rotate: "0deg"
                    },
                    0.5: {
                        translateX: 0,
                        rotate: "-100deg"
                    },
                    1: {
                        translateX: -1 * translateX,
                        rotate: "100deg"
                    }
                }}
                delay={delay}
                duration={duration}
                direction="alternate"
                easing="ease-in-out"
                iterationCount="infinite"
                useNativeDriver
            >
                {children}
            </Animatable.View>
        );
    };



    _onLayout = event => {
        this.setState({
            //   parentWidth: event.nativeEvent.layout.width,
            //   parentHeight: event.nativeEvent.layout.height
            parentWidth: width,
            parentHeight: height
        });
    };

    render() {
        const { rainControl, isClickBtn, refreshing, rotate, eventStartDate, eventEndDate, maxGrabFromHighestTier, lotteryRandomArr, lowestTierMinDeposit, isShowPrizeModal, isShowPrizeModalConatiner, lotteryHistory, message, entryPointStartDate, entryPointEndDate, totalDepositedDaily, promotionsItem, totalDepositedEvent, isShowDepositModal, days, hours, minutes, seconds, isShowMoreInforModal, isShowHistoryModal } = this.state
        const { remainingGrabFromCurrentTier, errorCode, prizeName, prizeImg, remainingGrabFromHighestTier } = this.state

        // let errorCode = 'MG00003'
        // let isShowDepositModal = true
        const LotteryStepInfor = [
            {
                img: require('./../../../images/home/lottery/lotteryIcon1.png'),
                text1: 'ขั้นตอนที่ 1:',
                text2: 'ลงทะเบียนหรือเข้าสู่ระบบบัญชี',
            },
            {
                img: require('./../../../images/home/lottery/lotteryIcon2.png'),
                text1: 'ขั้นตอนที่ 2:',
                text2: `ฝากเงินขั้นต่ำ ${lowestTierMinDeposit} บาท เข้าบัญชี FUN88 ของคุณ`,
            },
            {
                img: require('./../../../images/home/lottery/lotteryIcon3.png'),
                text1: 'ขั้นตอนที่ 3:',
                text2: 'อังเปาปีนี้ คว้าซองแดง!',
            }
        ]
        const eventStartDate1 = moment(eventStartDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
        const eventEndDate1 = moment(eventEndDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
        const nowTime = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').valueOf()


        const {
            // imgs=imgs,
            count = 10, //一次下落的数量
            duration = 10000, //时长
            startY = -150, //起始下落距顶部位置
            speed = 150
        } = this.props;



        let FailAnimation = this._FailAnimation;
        let SwingAnimation = this._SwingAnimation;
        return <View style={styles.viewContainer} onLayout={this._onLayout}>
            {rainControl && (
                <Rain
                    SnatchPrize={this.potSnatchPrize.bind(this)}
                    resetRain={false}
                />)
            }
            {/* 抽奖失败 */}
            <Modal
                visible={isShowDepositModal}
                animationType='fade'
                transparent={true}
            >
                <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        <View style={styles.modalHead}>
                            <Text style={styles.modalHeadLeft}>สถานะ</Text>
                            <TouchableOpacity style={styles.modalHeadRight} onPress={() => {
                                this.setState({
                                    isShowDepositModal: false
                                })
                            }}>
                                <Text style={styles.modalHeadRightText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        {
                            errorCode.length > 0 && isShowDepositModal && <View style={styles.modalBoay}>

                                {
                                    errorCode == 'MG00009'
                                        ?
                                        (
                                            <View>
                                                {/* 很遗憾您的奖励是空的，请再接再厉！ 您今日参与活动的次数已用完，请明天再试 */}
                                                {
                                                    remainingGrabFromHighestTier == 0 && remainingGrabFromCurrentTier == 0 &&
                                                    <View>
                                                        <Text style={[styles.modalBoayText, styles.modalBoayText1]}>ขออภัย คุณไม่ได้รับรางวัล กรุณาเล่นเกมใหม่อีกครั้งพรุ่งนี้</Text>
                                                        <Text style={styles.modalBoayText}>คุณได้ใช้สิทธิ์ของวันนี้หมดแล้ว</Text>
                                                    </View>
                                                }

                                                {/* 很遗憾您的奖励是空的，请再接再厉！ 您参与活动的次数已用完，请存款后再试。 */}
                                                {
                                                    remainingGrabFromHighestTier > 0 && remainingGrabFromCurrentTier == 0 &&
                                                    <View>
                                                        <Text style={[styles.modalBoayText, styles.modalBoayText1]}>{`ขออภัย คุณไม่ได้รับรางวัล\nกรุณาฝากเงินและลองใหม่อีกครั้ง!`}</Text>
                                                        <Text style={styles.modalBoayText}>คุณได้ใช้สิทธิ์หมดแล้ว กรุณาฝากเงินและลองใหม่อีกครั้ง!</Text>
                                                    </View>
                                                }


                                                {/* 很遗憾您的奖励是空的，请再接再厉！ 今天剩余 X 次参与活动的机会 */}
                                                {
                                                    remainingGrabFromCurrentTier > 0 &&
                                                    <View>
                                                        <Text style={[styles.modalBoayText, styles.modalBoayText1]}>{`ขออภัย คุณไม่ได้รับรางวัล\nกรุณาลองใหม่อีกครั้ง!`}</Text>
                                                        <Text style={styles.modalBoayText}>คุณยังเหลือสิทธิ์ <Text style={[styles.prizeInfor, styles.prizeInfor1]}>{remainingGrabFromCurrentTier}</Text> ครั้งในการเล่นเกม!</Text>
                                                    </View>

                                                }
                                            </View>


                                        )
                                        :
                                        <Text style={styles.modalBoayText}>
                                            {
                                                this.createErrStatus()[errorCode].message
                                            }
                                        </Text>
                                }


                                {
                                    errorCode == 'MG00009' ?
                                        (
                                            <View>
                                                {/* 很遗憾您的奖励是空的，请再接再厉！ 您今日参与活动的次数已用完，请明天再试 */}
                                                {
                                                    remainingGrabFromHighestTier == 0 && remainingGrabFromCurrentTier == 0 && <View style={[styles.modalBoayBtnWrap, { justifyContent: 'center' }]}>
                                                        <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnMid]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowDepositModal: false
                                                                })
                                                            }}
                                                        >
                                                            <Text style={[styles.modalBoayBtnLeftText, { color: '#fff' }]}>ตกลง</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                                {/* 很遗憾您的奖励是空的，请再接再厉！ 您参与活动的次数已用完，请存款后再试。 */}
                                                {
                                                    remainingGrabFromHighestTier > 0 && remainingGrabFromCurrentTier == 0 &&
                                                    <View style={styles.modalBoayBtnWrap}>
                                                        <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnLeft]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowDepositModal: false
                                                                })
                                                            }}
                                                        >
                                                            <Text style={styles.modalBoayBtnLeftText}>ย้อนกลับ</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnRight]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowDepositModal: false
                                                                }, () => {
                                                                    Actions.DepositStack()
                                                                    window.PiwikMenberCode('Deposit_Nav', 'Click', 'Deposit_ChineseNewYear23')
                                                                })
                                                            }}
                                                        >
                                                            <Text style={styles.modalBoayBtnRighText}>ฝากตอนนี้</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }

                                                {/* 很遗憾您的奖励是空的，请再接再厉！ 今天剩余 X 次参与活动的机会 */}
                                                {
                                                    remainingGrabFromCurrentTier > 0 &&
                                                    <View style={styles.modalBoayBtnWrap}>
                                                        <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnLeft]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowDepositModal: false
                                                                })
                                                            }}
                                                        >
                                                            <Text style={styles.modalBoayBtnLeftText}>ย้อนกลับ</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnRight]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowDepositModal: false
                                                                }, () => {
                                                                    this.potSnatchPrize()
                                                                })

                                                                window.PiwikMenberCode('Engagement_Event', 'Click', 'GrabMore_ChineseNewYear23')
                                                            }}
                                                        >
                                                            <Text style={styles.modalBoayBtnRighText}>สุ่มอัตโนมัติ</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                }
                                            </View>
                                        )
                                        :
                                        this.createErrStatus()[errorCode].btnWrap
                                }
                            </View>
                        }
                    </View>
                </View>
            </Modal>

            {/* 抽奖成功 */}
            <Modal
                visible={isShowPrizeModal}
                animationType='fade'
                transparent={true}
            >
                <View style={styles.viewModalContainer}>
                    <Image
                        style={styles.getPrizeBg}
                        resizeMode='stretch'
                        source={require('./../../../images/home/lottery/Pop-Up-Prize-BG.gif')}>
                    </Image>

                    {
                        isShowPrizeModalConatiner &&
                        <View style={styles.viewModalPrizeBox}>
                            <Text style={styles.modalContaninerText}>รางวัล</Text>
                            {
                                Boolean(prizeImg) &&
                                <Image
                                    resizeMode='stretch'
                                    source={prizeImg}
                                    style={styles.lotteryIconImg}
                                ></Image>
                            }

                            {
                                // <Text style={styles.modalPrizeText}>Chúc Mừng Bạn Đã Thắng <Text style={styles.prizeInfor}>{prizeName}!</Text></Text>
                            }

                            <Text style={styles.modalPrizeText}>ขอแสดงความยินดี คุณได้รับ
                                {
                                    prizeName.length > 0 && <Text style={styles.prizeInfor}> {prizeName}!</Text>
                                }
                            </Text>

                            {/* 恭喜您获得 XXXXX ! 今天剩余 X 活动次数。 */}
                            {
                                remainingGrabFromCurrentTier > 0 &&
                                <View style={styles.viewModalPrizeBox}>
                                    <Text style={styles.modalPrizeText}>
                                        คุณยังเหลือสิทธิ์ <Text style={styles.prizeInfor}>{remainingGrabFromCurrentTier}</Text> ครั้งในการเล่นเกม!
                                    </Text>

                                    <View style={styles.modalBtnBox}>
                                        <TouchableOpacity style={styles.modalBtnBoxBtnBg}
                                            onPress={() => {
                                                this.setState({
                                                    isShowPrizeModal: false,
                                                    isShowPrizeModalConatiner: false
                                                })
                                            }}
                                        >
                                            <ImageBackground
                                                resizeMode='stretch'
                                                source={require('./../../../images/home/lottery/Button-1.png')}
                                                style={styles.modalBtnBoxBtnBg}>
                                                {
                                                    // <Text style={styles.modalBtnBoxBtnText1}>ย้อนกลับ</Text>
                                                }
                                            </ImageBackground>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.modalBtnBoxBtnBg}
                                            onPress={() => {
                                                this.setState({
                                                    isShowPrizeModal: false,
                                                    isShowPrizeModalConatiner: false
                                                }, () => {
                                                    this.potSnatchPrize()
                                                    window.PiwikMenberCode('Engagement_Event', 'Click', 'GrabMore_ChineseNewYear23')
                                                })
                                            }}
                                        >
                                            <ImageBackground
                                                resizeMode='stretch'
                                                source={require('./../../../images/home/lottery/Button-2.png')}
                                                style={styles.modalBtnBoxBtnBg}>
                                                {
                                                    // <Text style={styles.modalBtnBoxBtnText2}>MỞ NGẪU NHIÊN</Text>
                                                }
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }

                            {/* 恭喜您获得 XXXXX ! 您的活动次数已用完，请存款后再试。 */}
                            {
                                remainingGrabFromCurrentTier == 0 && remainingGrabFromHighestTier > 0 &&
                                <View style={styles.viewModalPrizeBox}>
                                    <Text style={styles.modalPrizeText}>คุณได้ใช้สิทธิ์หมดแล้ว กรุณาฝากเงินอีกครั้งเพื่อเล่นต่อ</Text>
                                    <View style={styles.modalBtnBox}>
                                        <TouchableOpacity style={styles.modalBtnBoxBtnBg}
                                            onPress={() => {
                                                this.setState({
                                                    isShowPrizeModal: false,
                                                    isShowPrizeModalConatiner: false
                                                })
                                            }}
                                        >
                                            <ImageBackground
                                                resizeMode='stretch'
                                                source={require('./../../../images/home/lottery/Button-1.png')}
                                                style={styles.modalBtnBoxBtnBg}>
                                                {
                                                    // <Text style={styles.modalBtnBoxBtnText1}>ย้อนกลับ</Text>
                                                }
                                            </ImageBackground>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.modalBtnBoxBtnBg}
                                            onPress={() => {
                                                this.setState({
                                                    isShowPrizeModal: false,
                                                    isShowPrizeModalConatiner: false
                                                }, () => {
                                                    Actions.DepositStack()
                                                })
                                                window.PiwikMenberCode('Deposit_Nav', 'Click', 'Deposit_ChineseNewYear23')
                                            }}
                                        >
                                            <ImageBackground
                                                resizeMode='stretch'
                                                source={require('./../../../images/home/lottery/Button-3.png')}
                                                style={styles.modalBtnBoxBtnBg}>
                                                {
                                                    // <Text style={styles.modalBtnBoxBtnText2}>ฝากตอนนี้</Text>
                                                }
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }

                            {/* 恭喜您获得 XXXXX ! 您今天的活动次数已用完，请明天再试。 */}
                            {
                                remainingGrabFromHighestTier == 0 &&
                                <View style={styles.viewModalPrizeBox}>
                                    <Text style={styles.modalPrizeText}>{`คุณได้ใช้สิทธิ์ของวันนี้หมดแล้ว\nกรุณาเล่นเกมใหม่อีกครั้งพรุ่งนี้`}</Text>
                                    <View style={[styles.modalBtnBox, { justifyContent: 'center' }]}>
                                        <TouchableOpacity style={styles.modalBtnBoxBtnBg}
                                            onPress={() => {
                                                this.setState({
                                                    isShowPrizeModal: false,
                                                    isShowPrizeModalConatiner: false
                                                })
                                            }}
                                        >
                                            <ImageBackground
                                                resizeMode='stretch'
                                                source={require('./../../../images/home/lottery/Button-4.png')}
                                                style={styles.modalBtnBoxBtnBg}>
                                                {
                                                    // <Text style={styles.modalBtnBoxBtnText1}>ตกลง</Text>
                                                }
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                        </View>
                    }
                </View>
            </Modal>

            {/* 记录 */}
            <Modal
                visible={isShowHistoryModal}
                animationType='fade'
                transparent={true}
            >
                <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        <View style={[styles.modalHead]}>
                            <Text style={styles.modalHeadLeft}>ประวัติการรับรางวัล</Text>
                            <TouchableOpacity style={[styles.modalHeadRight, { right: 15, position: 'absolute' }]} onPress={() => {
                                this.setState({
                                    isShowHistoryModal: false
                                })
                            }}>
                                <Text style={styles.modalHeadRightText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBoay}>
                            <View style={styles.historyHead}>
                                <View style={styles.historyHeadView}>
                                    <Text style={styles.historyHeadText}>วันที่</Text>
                                </View>
                                <View style={styles.historyHeadView}>
                                    <Text style={styles.historyHeadText}>รางวัล</Text>
                                </View>
                                <View style={styles.historyHeadView}>
                                    <Text style={styles.historyHeadText}>สถานะ</Text>
                                </View>
                            </View>

                            {
                                (Array.isArray(lotteryHistory) && lotteryHistory.length > 0)
                                    ?
                                    <View style={{ height: height * .6 }}>
                                        <ScrollView
                                            automaticallyAdjustContentInsets={false}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                        >
                                            {
                                                lotteryHistory.filter(v => v.prizeName != "Empty Prize").map((v, i) => {
                                                    let applyDate = v.applyDate.replace(/T/g, ' ')
                                                    let applyDate1 = applyDate.split('.')[0]
                                                    return <View style={[styles.historyHead, {
                                                        marginVertical: 2,
                                                        backgroundColor: i % 2 ? '#FBD893' : '#F2CD87'
                                                    }]}>
                                                        <View style={[styles.historyHeadView, styles.historyHeadView1]}>
                                                            <Text style={[styles.historyHeadText, { color: '#000000', fontSize: 10 }]}>{applyDate1}</Text>
                                                        </View>
                                                        <View style={[styles.historyHeadView, styles.historyHeadView1]}>
                                                            <Text style={[styles.historyHeadText, { color: '#000000' }]}>{v.prizeName}</Text>
                                                        </View>
                                                        <View style={[styles.historyHeadView, styles.historyHeadView1]}>
                                                            <Text style={[styles.historyHeadText, { color: '#000000' }]}>{v.prizeStatusDesc}</Text>
                                                        </View>
                                                    </View>
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                    :
                                    <Text style={styles.noHistory}>ไม่มีรางวัล</Text>
                            }
                        </View>
                    </View>
                </View>
            </Modal>

            {/* 详情 */}
            <Modal
                visible={isShowMoreInforModal}
                animationType='fade'
                transparent={true}
            >
                <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        <View style={styles.modalHead}>
                            <Text style={styles.modalHeadLeft}>ดูรายละเอียด เงื่อนไข</Text>
                            <TouchableOpacity style={styles.modalHeadRight} onPress={() => {
                                this.setState({
                                    isShowMoreInforModal: false
                                })
                            }}>
                                <Text style={styles.modalHeadRightText}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.modalBoay, { height: height * .6 }]}>
                            <ScrollView
                                automaticallyAdjustContentInsets={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>1. ระยะเวลาโปรโมชั่น :</Text>
                                    <Text style={styles.lotteryInforText}>อั่งเปา คว้าซองแดง : 20 มกราคม - 25 มกราคม 2566 โปรโมชั่นนี้เฉพาะสมาชิก FUN88 เท่านั้น</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>2. ฝากเงินสะสมขั้นต่ำ 300 บาท ในช่วงระยะเวลาโปรโมชั่น จำนวนสิทธิ์ในการเล่นเกมจะขึ้นอยู่กับจำนวนเงินฝากสะสมของสมาชิกในแต่ละวัน</Text>
                                    <Text style={styles.lotteryInforText}>ตามตารางด้านล่างนี้</Text>
                                </View>


                                <View>
                                    <View style={styles.lotteryTrBox}>
                                        <View style={[styles.lotteryTr, styles.lotteryTr1]}>
                                            <Text style={[styles.lotteryTrText, { fontSize: 11 }]}>{`ยอดฝากสะสม\n(บาท)`}</Text>
                                        </View>
                                        <View style={[styles.lotteryTr, styles.lotteryTr2]}>
                                            <Text style={[styles.lotteryTrText, { fontSize: 11 }]}>จํานวนครั้ง</Text>
                                        </View>
                                        <View style={[styles.lotteryTr, styles.lotteryTr3]}>
                                            <Text style={[styles.lotteryTrText, { fontSize: 11 }]}>ระดับสมาชิก</Text>
                                        </View>
                                        <View style={[styles.lotteryTr, styles.lotteryTr4]}>
                                            <Text style={[styles.lotteryTrText, { fontSize: 11 }]}>สะสมสิทธิ์สูงสุด</Text>
                                        </View>
                                    </View>

                                    <View style={styles.lotteryBody}>
                                        <View style={styles.lotteryTrBox1}>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>300 - 999​</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>1,000 - 2,499​</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>2,500 - 4,999</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>5,000 - 9,999​</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr1]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>10,000 ขึ้นไป </Text>
                                            </View>
                                        </View>

                                        <View style={styles.lotteryTrBox1}>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>1</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>2</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>3</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>4</Text>
                                            </View>
                                            <View style={[styles.lotteryTr0, styles.lotteryTr2]}>
                                                <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>5</Text>
                                            </View>
                                        </View>

                                        <View style={[styles.lotteryTrBox2, styles.lotteryTr4, styles.lotteryTrBox3]}>
                                            <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>สมาชิกทุกท่าน​</Text>
                                        </View>

                                        <View style={[styles.lotteryTrBox2, styles.lotteryTr4, styles.lotteryTrBox3]}>
                                            <Text style={[styles.lotteryTrText, styles.lotteryTrText1]}>5 ครั้งต่อวัน</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>หมายเหตุ: สมาชิกสามารถสะสมยอดฝาก ภายใน 1 วัน เท่านั้น</Text>
                                    <Text style={styles.lotteryInforText}>- สมาชิกคลิกที่ ""อั่งเปา"" เพื่อเล่นเกม</Text>
                                    <Text style={styles.lotteryInforText}>- สิทธิ์ในการเล่นเกมและยอดเงินฝาก จะไม่สามารถย้ายไปในวันถัดไปได้</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>ตัวอย่าง :</Text>
                                    <Text style={styles.lotteryInforText}>สมาชิก A ฝากเงิน 300 บาท รับอั่งเปา ได้ 1 ครั้ง</Text>
                                    <Text style={styles.lotteryInforText}>สมาชิก A ฝากเงินเพิ่มในวันเดียวกัน 500 บาท รวมเป็น 800 บาท แต่ยังไม่ถึงเกณฑ์รับสิทธิ์ ""รับอั่งเปา"" เพิ่ม</Text>
                                    <Text style={styles.lotteryInforText}>สมาชิก A จะต้องฝากเงินเพิ่มอีก 200 บาท ให้ครบ 1,000 บาท เพื่อรับอั่งเปาเพิ่มอีก 1 ครั้ง (สมาชิกใช้สิทธิ์ครั้งแรกไปแล้ว เมื่อฝากเงิน 300 บาท)</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>3. รางวัล:</Text>
                                    <Text style={styles.lotteryInforText}>อั่งเปา : เงินเดิมพันฟรี, แต้มรีวอร์ดและ ของขวัญพิเศษ!</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>4. ระยะเวลาในการรับรางวัล:</Text>
                                    <Text style={styles.lotteryInforText}>แต้มรีวอร์ด : จะถูกเครดิตภายใน 30 นาที</Text>
                                    <Text style={styles.lotteryInforText}>ของขวัญพิเศษ! : จะถูกส่งภายใน 30 วันทำการ</Text>
                                    <Text style={styles.lotteryInforText}>เงินเดิมพันฟรี : ปรับเข้ากระเป๋าเงินหลัก ภายใน 30 นาทีหลังจากได้รับรางวัล</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>5. แต้มรีวอร์ด :จะถูกปรับเข้าอัตโนมัติให้กับสมาชิก และจะหมดอายุภายใน 30 วันหลังจากทำการปรับเข้าบัญชี</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>6.เงินเดิมพันฟรี : จะถูกปรับเข้าอัตโนมัติให้กับสมาชิก และจะหมดอายุภายใน 30 วันหลังจากทำการปรับเข้าบัญชี (ยอดเทิร์น 1 เท่าก่อนการถอน)</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>7. สำหรับผู้ได้รับของรางวัลจาก ""ของขวัญพิเศษ!""</Text>
                                    <Text style={styles.lotteryInforText}>* สมาชิกจะได้รับการยืนยันโดย FUN88 จะติดต่อผู้โชคดีที่ได้รับของรางวัลผ่านทางกล่องข้อความ และหมายเลขโทรศัพท์ที่สมาชิกได้ทำการลงทะเบียนไว้ภายใน 7 วัน</Text>
                                    <Text style={styles.lotteryInforText}>* หาก FUN88 ไม่สามารถติดต่อผู้ชนะได้ไม่ว่าด้วยเหตุผลใด ๆ รางวัลของผู้ชนะนั้นจะถือเป็นโมฆะ</Text>
                                    <Text style={styles.lotteryInforText}>* FUN88 ขอสงวนสิทธิ์ในการเปลี่ยนรางวัลเป็นรายการที่มีอยู่แล้ว โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</Text>
                                    <Text style={styles.lotteryInforText}>* ของรางวัลจะถูกส่งภายใน 30 วันทำการ FUN88 จะไม่รับผิดชอบใด ๆ ต่อสิ่งที่สูญหายหรือเสียหายระหว่างการขนส่ง</Text>
                                    <Text style={styles.lotteryInforText}>* FUN88 ขอสงวนสิทธิ์ของรางวัลไม่สามารถแลกเปลี่ยนเป็นโบนัสและรูปแบบอื่น ๆ ได้</Text>
                                </View>
                                <View style={styles.lotteryInforTextBox}>
                                    <Text style={styles.lotteryInforText}>8. ข้อกำหนดและเงื่อนไขทั่วไป</Text>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor={'#25AAE1'}
                        onRefresh={this.getMemberProgress.bind(this, true, true)}
                    />
                }
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    resizeMode='stretch'
                    style={styles.viewContainerBg1}
                    source={require('./../../../images/home/lottery/BG_Mobile-1.png')}
                >
                    <View style={styles.conatienrOne}>
                        <Image
                            resizeMode='stretch'
                            style={styles.viewContainerTitleImg}
                            source={require('./../../../images/home/lottery/Title_TH.png')}
                        ></Image>



                        <View style={styles.lotteryResetTimeBox}>
                            <View style={styles.lotteryResetTimeWrap}>
                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{days.split('')[0]}</Text>
                                    </ImageBackground>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={styles.lotteryResetListTimeBox1}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{days.split('')[1]}</Text>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetTimeIcon1}>:</Text>
                                </View>
                                <View style={styles.lotteryResetListTimeBoxText2Box}>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>วัน</Text>
                                </View>
                            </View>

                            <View style={styles.lotteryResetTimeWrap}>
                                <View style={styles.lotteryResetListTimeBox}>
                                    <View style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox2]}>
                                        <Text style={styles.lotteryResetTimeIcon}></Text>
                                    </View>
                                </View>
                                <Text style={styles.lotteryResetListTimeBoxText2}></Text>
                            </View>

                            <View style={styles.lotteryResetTimeWrap}>
                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{hours.split('')[0]}</Text>
                                    </ImageBackground>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={styles.lotteryResetListTimeBox1}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{hours.split('')[1]}</Text>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetTimeIcon1}>:</Text>
                                </View>
                                <View style={styles.lotteryResetListTimeBoxText2Box}>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>ชั่วโมง</Text>
                                </View>
                            </View>

                            {
                                <View style={styles.lotteryResetTimeWrap}>
                                    <View style={styles.lotteryResetListTimeBox}>
                                        <View style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox2]}>
                                            <Text style={styles.lotteryResetTimeIcon}></Text>
                                        </View>
                                    </View>
                                    <Text style={styles.lotteryResetListTimeBoxText2}></Text>
                                </View>
                            }

                            <View style={styles.lotteryResetTimeWrap}>
                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{minutes.split('')[0]}</Text>
                                    </ImageBackground>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={styles.lotteryResetListTimeBox1}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{minutes.split('')[1]}</Text>
                                    </ImageBackground>
                                    <Text style={styles.lotteryResetTimeIcon1}>:</Text>
                                </View>
                                <View style={styles.lotteryResetListTimeBoxText2Box}>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>นาที</Text>
                                </View>
                            </View>

                            <View style={styles.lotteryResetTimeWrap}>
                                <View style={styles.lotteryResetListTimeBox}>
                                    <View style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox2]}>
                                        <Text style={styles.lotteryResetTimeIcon}></Text>
                                    </View>
                                </View>
                                <Text style={styles.lotteryResetListTimeBoxText2}></Text>
                            </View>

                            <View style={styles.lotteryResetTimeWrap}>
                                <View style={styles.lotteryResetListTimeBox}>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{seconds.split('')[0]}</Text>
                                    </ImageBackground>
                                    <ImageBackground
                                        resizeMode='stretch'
                                        source={require('./../../../images/home/lottery/Countdown-Timer.png')}
                                        style={styles.lotteryResetListTimeBox1}>
                                        <Text style={styles.lotteryResetListTimeBoxText1}>{seconds.split('')[1]}</Text>
                                    </ImageBackground>
                                </View>
                                <View style={styles.lotteryResetListTimeBoxText2Box}>
                                    <Text style={styles.lotteryResetListTimeBoxText2}>วินาที</Text>
                                </View>
                            </View>
                        </View>


                        <ImageBackground
                            resizeMode='stretch'
                            source={require('./../../../images/home/lottery/Date-Container.png')}
                            style={styles.lotteryTime}>
                            <Text style={styles.lotteryTimeText}>20 -25 มกราคม 2566</Text>
                        </ImageBackground>
                    </View>

                    {
                        false && <View style={styles.portalBox}>
                            <Animatable.Image
                                transition={['rotate']}
                                ref={this.handleViewRef}
                                resizeMode='stretch'
                                easing='ease-in-cubic'
                                duration={1000}
                                style={[styles.LuckyWheelFrame, {
                                    transform: [
                                        {
                                            rotate: rotate + 'deg'
                                        }
                                    ]
                                }]}
                                source={require('./../../../images/home/lottery/VN_LuckyWheelFrame.png')}
                            >
                            </Animatable.Image>
                            <TouchableOpacity
                                onPress={this.potSnatchPrize.bind(this)}
                                style={styles.LuckyWheelFrameBtn}
                            >
                                <Image
                                    resizeMode='stretch'
                                    style={styles.LuckyWheelFrameBtn}
                                    source={
                                        ((nowTime < eventEndDate1) && (nowTime > eventStartDate1))
                                            ?
                                            (
                                                isClickBtn ?
                                                    require('./../../../images/home/lottery/VN_Button-Static.gif')
                                                    :
                                                    require('./../../../images/home/lottery/VN_Button-Clicked.gif')
                                            )
                                            :
                                            require('./../../../images/home/lottery/VN_Button-Disabled.gif')
                                    }
                                >
                                </Image>
                            </TouchableOpacity>
                        </View>
                    }
                </ImageBackground>

                <ImageBackground
                    resizeMode='stretch'
                    style={styles.viewContainerBg3}
                    source={require('./../../../images/home/lottery/BG_Mobile-2.png')}
                >
                    <View style={styles.conatienrOne}>
                        <View style={styles.userMoneyBox}>
                            <View style={styles.userMoneyBoxWrap}>
                                <Text style={[styles.userMoneyBoxWrapText1, { fontSize: 13 }]}>ยอดฝากรวมวันนี้</Text>
                                <TouchableOpacity style={styles.resetImgWrap}
                                    onPress={this.getMemberProgress.bind(this, true)}
                                >
                                    <Text style={[styles.userMoneyBoxWrapText1, styles.userMoneyBoxWrapText2]}>{toThousands(totalDepositedDaily, '', 'บาท')}</Text>
                                    <Image
                                        resizeMode='stretch'
                                        style={styles.resetImg}
                                        source={require('./../../../images/home/lottery/reset-1.png')}></Image>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.userMoneyBoxWrap}>
                                <Text style={[styles.userMoneyBoxWrapText1, { fontSize: 13 }]}>สิทธิ์ในการเปิดกล่อง</Text>
                                <Text style={[styles.userMoneyBoxWrapText1, styles.userMoneyBoxWrapText2]}>{remainingGrabFromCurrentTier}</Text>
                            </View>
                        </View>
                    </View>


                    <ImageBackground
                        resizeMode='stretch'
                        style={styles.viewContainerBg2}
                        source={require('./../../../images/home/lottery/How-To_BG_Mobile.png')}
                    >
                        <TouchableOpacity style={styles.openHistoryBtn1} onPress={() => {
                            this.setState({
                                isShowMoreInforModal: true
                            })
                            window.PiwikMenberCode('Engagement_Event', 'View', 'TnC_ChineseNewYear23')
                        }}>
                            <ImageBackground
                                style={[styles.openHistoryBtn1, {
                                    height: width * .45 * 0.3,
                                }]}
                                resizeMode='stretch'
                                source={require('./../../../images/home/lottery/Button-VN_1.png')}
                            >
                            </ImageBackground>
                        </TouchableOpacity>
                    </ImageBackground>

                    <ImageBackground
                        style={styles.PrizesFotter}
                        resizeMode='stretch'
                        source={require('./../../../images/home/lottery/Prizes-Tab_TH.png')}
                    >

                        <TouchableOpacity style={[styles.openHistoryBtn1, {
                            zIndex: 100000
                        }]} onPress={() => {
                            this.getPrizeHistory()
                            window.PiwikMenberCode('Engagement_Event', 'View', 'MyPrize_ChineseNewYear23')
                        }}>
                            <ImageBackground
                                style={styles.openHistoryBtn1}
                                resizeMode='stretch'
                                source={require('./../../../images/home/lottery/Button-VN_2.png')}
                            >
                            </ImageBackground>
                        </TouchableOpacity>
                    </ImageBackground>



                    <ImageBackground
                        style={styles.Footer}
                        resizeMode='stretch'
                        source={require('./../../../images/home/lottery/Footer.png')}
                    ></ImageBackground>
                </ImageBackground>

            </ScrollView>
        </View>
    }
}

export default Lottery = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
            promotionListData: state.promotionListData,
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
            getBalanceInforAction: () => dispatch(getBalanceInforAction()),
            changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
        }
    }
)(LotteryContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#f7cd92'
    },
    viewContainerTitleImg: {
        width: width * 0.82,
        height: width * 0.82 * 0.642,
        marginBottom: 20
    },
    viewContainerBg1: {
        width,
        flex: 1,
        height: width * 1.62,
        position: 'relative',
        paddingTop: width * 0.82 * 0.32,
    },
    viewModalContainer: {
        width,
        height,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
        position: 'relative'
    },
    viewModalBox: {
        backgroundColor: '#FBD893',
        overflow: 'hidden',
        width: width * .96
    },
    modalHead: {
        height: 42,
        backgroundColor: '#E61F29',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalHeadLeft: {
        color: '#FBD893',
        fontWeight: 'bold'
    },
    modalHeadRight: {
        width: 26,
        height: 26,
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#FBD893',
        borderWidth: 2
    },
    modalHeadRightText: {
        color: '#FBD893',
        fontWeight: 'bold'
    },
    modalBoay: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        width: width * .96,
        //height: height * .6,
    },
    modalBoayText: {
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    modalBoayText1: {
        marginBottom: 5
    },
    modalBoayBtnWrap: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 15
    },
    modalBoayBtn: {
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        width: (width * .96 - 40) * .45,
        borderRadius: 10
    },
    modalBoayBtnMid: {
        width: (width * .96 - 40) * .6,
        backgroundColor: '#E61F29'
    },
    modalBoayBtnLeft: {
        backgroundColor: '#FBD893',
        borderWidth: 1,
        borderColor: '#E61F29'
    },
    modalBoayBtnRight: {
        backgroundColor: '#E61F29'
    },
    modalBoayBtnLeftText: {
        color: '#E61F29'
    },
    modalBoayBtnRighText: {
        color: '#fff'
    },
    lotteryResetTimeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.9,
        height: 80,
    },
    lotteryResetTimeWrap: {
        alignItems: 'center',
    },
    lotteryResetListTimeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    lotteryResetListTimeBox1: {
        width: 35,
        height: 35 * 1.37,
        alignItems: 'center',
        justifyContent: 'center',
        //  marginRight: 4
    },
    lotteryResetTimeIcon1: {
        color: '#C01010',
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 3
    },
    lotteryResetListTimeBox3: {
        marginRight: 4
    },
    lotteryResetListTimeBox2: {
        width: 'auto',
        display: 'none'
    },
    lotteryResetListTimeBoxText1: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20
    },
    lotteryResetListTimeBoxText2Box: {
        borderRadius: 100000,
        paddingHorizontal: 8,
        overflow: 'hidden',
        backgroundColor: "#E62711",
        paddingVertical: 2,
    },
    lotteryResetListTimeBoxText2: {
        color: '#fff',
        fontSize: 12,
    },
    lotteryTime: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * .65,
        height: width * .65 * .198,
        marginTop: 45,
    },
    lotteryTimeText: {
        color: '#FFEFD9',
        fontSize: 14,
        fontWeight: 'bold',
    },
    conatienrOne: {
        alignItems: 'center',
        marginBottom: 30
    },
    portalBox: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: .05 * width,
        right: .05 * width,
        zIndex: 9999,
        bottom: -width * 0.9 * .38,
        width: width * 0.9,
        height: width * 0.9
    },
    LuckyWheelFrame: {
        width: width * 0.9,
        height: width * 0.9
    },
    LuckyWheelFrameBtn: {
        width: 80,
        height: 80 * 1.16,
        position: 'absolute'
    },
    portal: {
        width: width * .45,
        height: width * .45 * .9,
    },
    portal0: {
        transform: [
            {
                translateY: 20
            }
        ]
    },
    portal1: {
        transform: [
            {
                translateY: -20,
            },
            {
                translateX: -10
            }
        ]
    },
    portal2: {
        transform: [
            {
                translateY: 10
            }
        ]
    },
    portal3: {
        transform: [
            {
                translateY: -30
            }
        ]
    },
    portal4: {
        transform: [
            {
                translateX: -10
            }
        ]
    },
    portal5: {
        transform: [
            {
                translateX: -10
            }
        ]
    },
    lotteryBtnWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotteryPop: {
        width: width * .45 * .6,
        height: width * .45 * .6 * 1.225,
        position: 'absolute'
    },
    lotteryResetTimeIcon: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    viewContainerBg3: {
        width,
        height: width * 3.4,
        alignItems: 'center',
        position: 'relative',
    },
    lotteryListDemoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 40,
        marginBottom: 40,
        width: (width * .9),
    },
    lotteryListDemo: {
        width: (width * .9) / 5,
        height: (width * .9) / 5,
        marginHorizontal: 7,
        marginVertical: 7
    },
    przeImg: {
        width: width * .7,
        height: width * .7 * .104,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    przeImg1: {
        width: width * .65,
        height: width * .65 * .151,
        marginBottom: 40
    },
    przeImgText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15
    },
    openHistoryBtn: {
        width: width * .6,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E61F29',
        borderRadius: 14
    },
    openHistoryBtn1: {
        width: width * .45,
        height: width * .45 * .264,
        position: 'absolute',
        bottom: 5,
        zIndex: 1000,
    },
    PrizesFotter: {
        width,
        height: width * 1.395,
        alignItems: 'center'
    },
    openHistoryBtnText: {
        color: '#0A2EA9',
        fontWeight: 'bold',
        fontSize: 15
    },
    viewContainerBg2: {
        width,
        height: width * .6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 35
    },
    lotterySteopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    lotterySteopBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotterySteopBox1: {
        width: width * .34,
        marginHorizontal: 10
    },
    lotterySteopImg: {
        width: 56,
        height: 56,
        marginBottom: 10
    },
    lotterySteopText1: {
        color: '#FFE121',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 10
    },
    lotterySteopText2: {
        color: '#FFFFFF',
        fontSize: 10,
        textAlign: 'center'
    },
    viewContainerBg2Text1: {
        color: '#FFEB9C',
        fontWeight: 'bold',
        fontSize: 20
    },
    viewContainerBg2Text2: {
        color: '#FEF681',
        fontSize: 15,
        marginTop: 4,
        marginBottom: 25
    },
    lotteryTimeBox: {
        backgroundColor: '#FFEB9C',
        width: width * .95,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10000,
        marginBottom: 25
    },
    lotteryTimeBoxText: {
        textAlign: 'center',
        color: '#0A2EA9',
        fontSize: 12
    },
    userMoneyBox: {
        flexDirection: 'row',
    },
    userMoneyBoxWrap: {
        borderColor: '#C01010',
        backgroundColor: '#C01010',
        borderWidth: 1,
        borderRadius: 10,
        width: width * .42,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    resetImgWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    resetImg: {
        width: 22,
        height: 22,
        marginLeft: 5
    },
    userMoneyBoxWrapText1: {
        textAlign: 'center',
        color: '#fff',
        marginBottom: 10
    },
    userMoneyBoxWrapText2: {
        marginBottom: 0,
        fontSize: 18,
        color: "#FFEE00"
    },
    viewModalBoxBg: {
        width: width * .96,
        height: width * .96 * .6,
        alignItems: 'center'
    },
    modalBtnBox: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        width: width * .7,
        marginHorizontal: width * .15
    },
    modalBtnBoxBtnBg: {
        width: width * .7 * .45,
        height: width * .7 * .45 * .272,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBtnBoxBtnText1: {
        color: '#13479E'
    },
    modalBtnBoxBtnText2: {
        color: '#403C01'
    },
    modalContaninerText: {
        color: '#E61F29',
        fontSize: 15,
        fontWeight: 'bold'
    },
    lotteryIconImg: {
        width: 66,
        height: 66,
        marginTop: 10,
        marginBottom: 8
    },
    historyHeadText: {
        color: '#fff',
        fontSize: 12,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    historyHead: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#E61F29'
    },
    historyHeadView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        width: (width * .96 - 20) / 3,
    },
    historyHeadView1: {
        paddingHorizontal: 2,
        color: '#000'
    },
    noHistory: {
        textAlign: 'center',
        color: '#000',
        marginTop: 15,
        fontSize: 13,
        backgroundColor: '#F2CD87',
        paddingVertical: 4
    },
    getPrizeBg: {
        width: width,
        height: width,
        position: 'absolute',
    },
    viewModalPrizeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    modalPrizeText: {
        width: width * .76,
        textAlign: 'center',
        color: '#363636',
        fontSize: 13,
        marginBottom: 5
    },
    prizeInfor: {
        color: '#E61F29',
        fontWeight: 'bold',
        fontSize: 15
    },
    prizeInfor1: {
        color: '#E61F29',
        fontSize: 16
    },
    lotteryInforText: {
        color: '#1D1D1D',
        width: width * .96 - 25,
        flexWrap: 'wrap'
    },
    lotteryInforTextBox: {
        marginBottom: 15
    },
    lotteryTrBox: {
        backgroundColor: '#E61F29',
        flexDirection: 'row',
    },
    lotteryTr: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    lotteryTr1: {
        width: (width * .96 - 20) * .35,
    },
    lotteryTr2: {
        width: (width * .96 - 20) * .15,
    },
    lotteryTr3: {
        width: (width * .96 - 20) * .25,
    },
    lotteryTr4: {
        width: (width * .96 - 20) * .25,
    },
    lotteryTrText: {
        fontSize: 12,
        color: '#FBD893',
        textAlign: 'center'
    },
    lotteryTrText1: {
        color: '#1D1D1D'
    },
    lotteryTrBox1: {

    },
    lotteryTr0: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: '#E61F29',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#E61F29'
    },
    lotteryBody: {
        flexDirection: 'row',
        marginBottom: 20
    },
    lotteryTrBox2: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#E61F29',
        borderBottomColor: '#E61F29',
        borderBottomWidth: 1,
    },
    lotteryTrBox3: {
        borderRightColor: '#E61F29',
        borderRightWidth: 1
    },
    Footer: {
        position: 'absolute',
        left: 0,
        width,
        height: width * 0.674,
        bottom: 0,
    }
})