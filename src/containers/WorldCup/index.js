import React from 'react'
import { StyleSheet, View, Dimensions, Modal, Image, RefreshControl, Platform, ImageBackground, ScrollView, TouchableOpacity, Text } from 'react-native'
import { connect } from 'react-redux'
import { getBalanceInforAction } from '../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import moment from 'moment'
const { width, height } = Dimensions.get('window')
import * as Animatable from 'react-native-animatable'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import LoadingBone from './../Common/LoadingBone'
import FastImage from "react-native-fast-image";
import { GameLockText, GameMaintenanceText } from './../Common/CommonData'
import Touch from 'react-native-touch-once'
import { toThousandsAnother } from './../../actions/Reg'

class WorldCupContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerIndex1: 0,
            bannerIndex2: 0,
            bannerIndex3: 0,
            bannerData1: '',
            bannerData2: '',
            newsList: '',
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
            refreshing: false,
            isClickBtn: true,
            modalCountryFlag: false,
            countryList: '',
            countryIcon: {
                'Argentina': require('./../../images/worldCup/countryIcon/ARG.jpg'),
                "Australia": require('./../../images/worldCup/countryIcon/AUS.jpg'),
                "Belgium": require('./../../images/worldCup/countryIcon/BEL.jpg'),
                "Brazil": require('./../../images/worldCup/countryIcon/BRA.jpg'),
                "Canada": require('./../../images/worldCup/countryIcon/CAN.jpg'),
                "Cameroon": require('./../../images/worldCup/countryIcon/CMR.jpg'),
                "Costa Rica": require('./../../images/worldCup/countryIcon/CRC.jpg'),
                "Croatia": require('./../../images/worldCup/countryIcon/CRO.jpg'),
                "Denmark": require('./../../images/worldCup/countryIcon/DEN.jpg'),
                "Ecuador": require('./../../images/worldCup/countryIcon/ECU.jpg'),
                "England": require('./../../images/worldCup/countryIcon/ENG.jpg'),
                "Spain": require('./../../images/worldCup/countryIcon/ESP.jpg'),
                "France": require('./../../images/worldCup/countryIcon/FRA.jpg'),
                "Germany": require('./../../images/worldCup/countryIcon/GER.jpg'),
                "Ghana": require('./../../images/worldCup/countryIcon/GHA.jpg'),
                "Iran": require('./../../images/worldCup/countryIcon/IRN.jpg'),
                "Japan": require('./../../images/worldCup/countryIcon/JPN.jpg'),
                "South Korea": require('./../../images/worldCup/countryIcon/KOR.jpg'),
                "Saudi Arabia": require('./../../images/worldCup/countryIcon/KSA.jpg'),
                "Morocco": require('./../../images/worldCup/countryIcon/MAR.jpg'),
                "Mexico": require('./../../images/worldCup/countryIcon/MEX.jpg'),
                "Netherlands": require('./../../images/worldCup/countryIcon/NED.jpg'),
                "Poland": require('./../../images/worldCup/countryIcon/POL.jpg'),
                "Portugal": require('./../../images/worldCup/countryIcon/POR.jpg'),
                "Qatar": require('./../../images/worldCup/countryIcon/QAT.jpg'),
                "Senegal": require('./../../images/worldCup/countryIcon/SEN.jpg'),
                "Serbia": require('./../../images/worldCup/countryIcon/SRB.jpg'),
                "Switzerland": require('./../../images/worldCup/countryIcon/SUI.jpg'),
                "Tunisia": require('./../../images/worldCup/countryIcon/TUN.jpg'),
                "Uruguay": require('./../../images/worldCup/countryIcon/URU.jpg'),
                "United States": require('./../../images/worldCup/countryIcon/USA.jpg'),
                "Wales": require('./../../images/worldCup/countryIcon/WAL.jpg')
            },
            isShowInfor: 1,
            gameSequences: []
        }
    }

    componentDidMount(props) {
        ApiPort.UserLogin && this.getCustomFlag()
        this.getMiniGamesActiveGame()
        this.getWorldCupBanner()
        this.getWorldCupNews()

        global.storage.load({
            key: 'GameSequence',
            id: 'GameSequence'
        }).then(gameSequences => {
            this.setState({
                gameSequences
            })
        }).catch(() => { })
    }

    getCustomFlag() {
        fetchRequest(ApiPort.GetCustomFlag + `flagKey=TeamPreferenceWC22&`, 'GET').then(res => {
            if (res.isSuccess) {
                let modalCountryFlag = res.result.worldCupTeamPreference
                if (modalCountryFlag) {
                    this.getTeamsWC22()
                    this.setState({
                        modalCountryFlag: true
                    })
                }
            }
        })
    }

    getTeamsWC22() {
        global.storage.load({
            key: 'countryList',
            id: 'countryList'
        }).then(res => {
            this.setState({
                countryList: res
            })
        }).catch(() => { })

        fetchRequest(ApiPort.GetTeamsWC22, 'GET').then(res => {
            if (res.isSuccess) {
                this.setState({
                    countryList: res.result.sort((a, b) => a.localizedName.localeCompare(b.localizedName))
                })

                global.storage.save({
                    key: 'countryList',
                    id: 'countryList',
                    data: res.result,
                    expires: null
                })
            }
        })
    }

    postTeamPreferencesWC22(flag) {
        let teamIds = ''
        if (flag) {
            const { countryList } = this.state
            let tempArr = countryList.filter(v => v.flag).map(v => v.id)
            if (tempArr.length == 0) {
                teamIds = ''
                // Toast.fail('Please select at least 1 and max 3 teams.', 100)
                // return
            } else if (tempArr.length >= 4) {
                // Toast.fail('Sorry, you can only choose up to 3 teams.', 100)
                return
            } else {
                teamIds = tempArr.join()
            }
        } else {
            teamIds = '0'
        }
        this.setState({
            modalCountryFlag: false
        })
        fetchRequest(ApiPort.PostTeamPreferencesWC22 + `teamIds=${teamIds}&`, 'POST').then(res => {
            if (res.isSuccess && res.result) {

            }
        })
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
                    promoId: promoId + '',
                    entryPointEndDate: moment(entryPointEndDate).format('DD/MM'),
                    entryPointStartDate: moment(entryPointStartDate).format('DD/MM')
                }, () => {
                    this.getMemberProgress()
                    this.diffTime()
                    //  this.potSnatchPrize()
                })
            } else {

            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getMemberProgress(flag) {
        if (!ApiPort.UserLogin && flag !== true) {
            flag && Actions.login()
            window.isReLotteryFlag = true
            return
        }
        const { promoId } = this.state
        flag && Toast.loading('กำลังโหลดข้อมูล...', 200000000)
        if (flag === true) {
            this.getWorldCupBanner()
            this.getWorldCupNews()
            this.setState({
                refreshing: true
            })
        }
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
        const diff = (new Date(Time)).getTime() - nowTime

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
                <ImageBackground
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/Button-1.png')}
                    style={[styles.modalBoayBtn, styles.modalBoayBtnMid]}>
                    <Text style={[styles.modalBoayBtnLeftText, { color: '#fff' }]}>OK</Text>
                </ImageBackground>
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
                <ImageBackground
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/Button-1.png')}
                    style={[styles.modalBoayBtn, styles.modalBoayBtnLeft]}>
                    <Text style={styles.modalBoayBtnLeftText}>TRỞ VỀ</Text>
                </ImageBackground>

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
                        // errorCode === 'MG00012' &&
                        //     window.PiwikMenberCode('Deposit_Nav', 'Click', 'Deposit_NationalDay2022')
                    })
                }}
            >
                <ImageBackground
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/Button-2.png')}
                    style={[styles.modalBoayBtn, styles.modalBoayBtnRight]}>
                    <Text style={styles.modalBoayBtnRighText}>GỬI TIỀN NGAY</Text>
                </ImageBackground>
            </TouchableOpacity>

        </View>
        let viewContainer = {
            MG00001: {
                //Member have pending deposit.
                message: 'Rất tiếc, bạn không thể chơi ngay bây giờ, vui lòng chờ giao dịch gửi tiền được cập nhật.',
                btnWrap: compmentCom1
            },
            MG00002: {
                // -Member used up all the grab times.
                //-Member still can deposit to get more grab times.
                message: ' Bạn đã hết lượt chơi, hãy gửi thêm tiền để tiếp tục. ​',
                btnWrap: compmentCom2
            },
            MG00003: {
                // -Member used up all the grab times.
                //-Member cannot deposit to get more grab times.
                message: `Bạn đã hết lượt chơi của ngày hôm nay, \nvui lòng quay lại vào ngày mai.`,
                btnWrap: compmentCom1
            },
            MG00004: {
                //Member deposited but not yet reach the minimum amount. 
                message: `Tổng số tiền gửi hôm nay thấp hơn ${lowestTierMinDeposit}.000 VND, \nhãy gửi thêm để bắt đầu chơi.`,
                btnWrap: compmentCom2
            },
            MG00005: {
                // When all prize in all tiers finished.
                message: 'Rất tiếc, bạn đã chậm chân, giải thưởng đã hết.',
                btnWrap: compmentCom1
            },
            MG00006: {

            },
            MG00007: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Khách Hàng!',
                btnWrap: compmentCom1
            },
            MG00008: {
                message: '',
                btnWrap: ''
            },
            MG00009: {},
            MG00012: {
                //Members click on the pop-up balloon and didn’t have any deposit yet.
                message: `Gửi ${lowestTierMinDeposit}.000 VNĐ để bắt đầu chơi! \nGửi càng nhiều, cơ hội thắng càng cao`,
                btnWrap: compmentCom2
            },
            MG99997: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Khách Hàng!',
                btnWrap: compmentCom1
            },
            MG99999: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Khách Hàng!',
                btnWrap: compmentCom1
            },
            CUSVAL002: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Khách Hàng!',
                btnWrap: compmentCom1
            },
            GEN0006: {
                // 系统出现错误，请联系客服
                message: 'Hệ thống lỗi, vui lòng liên hệ Bộ Phận Hỗ Trợ Khách Hàng!',
                btnWrap: compmentCom1
            },
            MG99998: {
                // 抱歉，该活动已结束，请期待我们的下一个活动,
                message: 'Rất tiếc, sự kiện đã kết thúc. Cùng chờ đón sự kiện tiếp theo của FUN88!',
                btnWrap: compmentCom1
            }
        }
        return viewContainer
    }


    potSnatchPrize(i) {
        if (!ApiPort.UserLogin) {
            window.isReLotteryFlag = true
            Actions.login()
            return
        }


        const { promoId, lotteryRandomArr } = this.state
        // if (i) {
        //     let flag = lotteryRandomArr.find(v => v.num == i)
        //     if (flag) {
        //     } else {
        //         return
        //     }
        // }
        Toast.loading('กำลังโหลดข้อมูล...', 20000)

        this.dealyOpenPrize && clearInterval(this.dealyOpenPrize)

        this.setState({
            isClickBtn: false,
            remainingGrabFromCurrentTier: 0,
            remainingGrabFromHighestTier: '',
        }, () => {
        })

        fetchRequest(ApiPort.MiniGames + 'SnatchPrize?promoId=' + promoId + '&', 'POST').then(res => {
            this.getMemberProgress()
            Toast.hide()
            if (res.isSuccess) {
                let result = res.result
                let { prizeName, prizeId, remainingGrabFromCurrentTier,
                    remainingGrabFromHighestTier, actualPrizeValue, prizeTypeDesc } = result
                let prizeImg = prizeName == 'คะแนนสะสม' ? require('./../../images/worldCup/Prize_RewardPts-SEA.png') : require('./../../images/worldCup/Prize_Freebets-SEA.png')

                this.setState({
                    isShowPrizeModal: true,
                    prizeName,
                    prizeId,
                    prizeImg,
                    remainingGrabFromCurrentTier,
                    remainingGrabFromHighestTier,
                    isClickBtn: true
                }, () => {
                })
                this.dealyOpenPrize = setTimeout(() => {
                    this.setState({
                        //isShowPrizeModal: true,
                        isShowPrizeModalConatiner: true
                    })
                }, 1500)
            } else {
                let errors = res.errors
                if (Array.isArray(errors) && errors.length) {
                    let errorCode = errors[0].errorCode
                    if (errorCode == 'MG00009') {
                        this.setState({
                            isShowPrizeModal: true,
                            isClickBtn: true,
                            errorCode
                        }, () => {
                        })
                        this.dealyOpenPrize = setTimeout(() => {
                            this.setState({
                                //isShowPrizeModal: true,
                                isShowPrizeModalConatiner: true
                            })
                        }, 1500)
                        return
                    }
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


    getWorldCupBanner() {
        const { } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchCupRequest(ApiPort.GetWorldCupBanner + 'worldcup_main', 'GET').then(res => {
            Toast.hide()
            this.setState({
                bannerData1: res
            })
        }).catch(err => {
            Toast.hide()
        })

        fetchCupRequest(ApiPort.GetWorldCupBanner + 'worldcup_game', 'GET').then(res => {
            Toast.hide()
            this.setState({
                bannerData2: res
            })
        }).catch(err => {
            Toast.hide()
        })
    }

    getWorldCupNews() {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchCupRequest(ApiPort.GetWorldCupNews, 'GET').then(res => {
            Toast.hide()
            this.setState({
                newsList: res.data
            })
        }).catch(err => {
            Toast.hide()
        })
    }

    getWorldCupNewsDetail(v) {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchCupRequest(ApiPort.GetWorldCupNews + '/' + v.id, 'GET').then(res => {
            Toast.hide()
            if (res.data) {
                let flag = Object.keys(res.data)
                if (!(Array.isArray(flag) && flag.length)) return
                Actions.WordNewsDetails({
                    newsDetails: res.data,
                    id: v.id
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    renderMainPage(item) {
        return <TouchableOpacity key={item.index} style={[styles.carouselImg1]}
            onPress={this.bannerMainAction.bind(this, item.item)}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg1}
                defaultSource={require('./../../images/worldCup/Default-Banner-Main_VN.jpg')}
                source={{ uri: item.item.cmsImageUrl }} />
        </TouchableOpacity>
    }

    renderGamePage(item) {
        return <TouchableOpacity key={item.index} style={[styles.carouselImg3]} onPress={this.bannerGameAction.bind(this, item.item)}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg3}
                defaultSource={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                source={{ uri: item.item.cmsImageUrl }} />
        </TouchableOpacity>
    }

    renderNewsPage(item) {
        let isShowPlayerIcon = item.item.isShowPlayerIcon
        return <TouchableOpacity key={item.index} style={[styles.carouselImg, styles.carouselImg2]} onPress={this.getWorldCupNewsDetail.bind(this, item.item)}>
            {
                isShowPlayerIcon > 0 && <View style={styles.IconVideoBox}>
                    <Image style={styles.IconVideo}
                        resizeMode='stretch'
                        source={require('./../../images/worldCup/Icon-Video.png')}></Image>
                </View>
            }
            <View style={styles.newOverly}>
                {
                    item.item.title.length > 0 && <Text style={styles.newOverlyText}>{item.item.title}</Text>
                }
            </View>
            <Image
                resizeMode='stretch'
                style={[styles.carouselImg, styles.carouselImg2]}
                defaultSource={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                source={{ uri: item.item.thumbnail }} />
        </TouchableOpacity>
    }

    bannerMainAction(item) {
        let { action } = item
        let { actionName, matchInfo } = action
        if (actionName === 'Promotion') {
            let { ID } = action
            let promotionListData = this.props.promotionListData
            window.PiwikMenberCode('Promo Nav', 'View ', `${ID}_PromoTnC_WCPage2022`)
            if (Array.isArray(promotionListData) && promotionListData.length) {
                let promotionsList = promotionListData.find(v => v.contentId * 1 === ID * 1)
                if (promotionsList) {
                    Actions.PreferentialPage({
                        promotionsDetail: promotionsList,
                        fromPage: 'homelPage'
                    })
                    return
                }
            }
        } else if (actionName == "Match") {
            let { match_id, teamId, time, Vendor } = matchInfo
            window.PiwikMenberCode('Game ', 'View ', `${match_id}_IMSP_WCPage2022`)
            if (!ApiPort.UserLogin) {
                Actions.login()
                return
            }

            global.storage.load({
                key: 'GameSequence',
                id: 'GameSequence'
            }).then(gameSequences => {
                if (gameSequences.length) {
                    let gameSequencesCasino = gameSequences.find(v => v.code.toLocaleUpperCase() === "SPORTSBOOK").subProviders
                    let tempGame = gameSequencesCasino.find(v => v.productCode == "IM")

                    if (tempGame) {
                        let gametype = tempGame.code.toLocaleUpperCase()
                        if (tempGame.isMaintenance) {
                            Toast.fail(GameMaintenanceText, 2)
                            return
                        }
                        let gameLobbyUrl = tempGame.gameLobbyUrl
                        if (gameLobbyUrl.length) {
                            Actions.GamePage({
                                GameOpenUrl: gameLobbyUrl,
                                gametype,
                                gameHeadName: `${tempGame.name} ${tempGame.productCode}`,
                                walletCode: tempGame.walletCode
                            })
                        } else {
                            Toast.fail('ระบบขัดข้อง กรุณาลองใหม่ภายหลัง', 1)
                        }
                    }
                }
            }).catch(() => { })
        }

    }


    bannerGameAction(item) {
        const { action, title } = item
        const { gameId, cgmsVendorCode, launchMode } = action
        window.PiwikMenberCode('Game​', 'Launch', `${title}_${cgmsVendorCode}_WCPage2022`)


        if (!ApiPort.UserLogin) {
            window.isReLotteryFlag = true
            Actions.login()
            return
        }
        let data = {
            'token': ApiPort.Token.split(' ')[1],
            'provider': cgmsVendorCode,
            //'gameCode': 0,
            'hostName': common_url,
            'productCode': cgmsVendorCode,
            'platform': 'Mobile',
            'mobileLobbyUrl': common_url,
            'sportsMenu': '',
            'bankingUrl': common_url,
            "vendorQuery": "sportid=1",
            'logoutUrl': common_url + '/accessdenied',
            'supportUrl': common_url
        }
        Toast.loading('กำลังเริ่มเกม...', 2000)
        // Toast.loading('正在启动游戏,请稍候...',200)
        fetchRequest(ApiPort.Game + gameId + '?isDemo=' + false + '&gameId=' + gameId + '&', 'POST', data).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                const { gameSequences } = this.state
                let data = res.gameResponse
                if (data.errorCode == 2001) {
                    Toast.fail(GameLockText, 2)
                    return
                }

                if (data.errorCode == 0) {
                    if (data.isMaintenance == true) {
                        Toast.fail(GameMaintenanceText, 2)
                        return
                    }

                    if (Array.isArray(gameSequences) && gameSequences.length) {
                        let gameSequencesSubProviders = gameSequences.map(v => v.subProviders)
                        let tempGameSequences = gameSequencesSubProviders.reduce((arr, v) => arr.concat(...v), [])
                        let tempGame = tempGameSequences.find(v => v.code == cgmsVendorCode)
                        if (tempGame) {
                            let { name, productCode } = tempGame
                            let gameHeadName = name + ' ' + productCode

                            if (data.lobbyUrl.length) {
                                Actions.GamePage({
                                    GameOpenUrl: data.lobbyUrl,
                                    gametype: cgmsVendorCode,
                                    gameHeadName,
                                    walletCode: tempGame.walletCode
                                })
                            }
                        }
                    }
                } else {
                    Toast.fail(GameMaintenanceText, 2)
                }
            }
        }).catch(() => {
            Toast.hide()
        })

    }

    render() {
        const { countryIcon, countryList, modalCountryFlag, promoId, isClickBtn, refreshing, eventStartDate, eventEndDate, maxGrabFromHighestTier, lotteryRandomArr, lowestTierMinDeposit, isShowPrizeModal, isShowPrizeModalConatiner, lotteryHistory, message, entryPointStartDate, entryPointEndDate, totalDepositedDaily, promotionsItem, totalDepositedEvent, isShowDepositModal, days, hours, minutes, seconds, isShowMoreInforModal, isShowHistoryModal } = this.state
        const { bannerData1, bannerData2, bannerIndex1, bannerIndex2, bannerIndex3, newsList } = this.state
        const { isShowInfor, remainingGrabFromCurrentTier, errorCode, prizeName, prizeImg, remainingGrabFromHighestTier } = this.state
        // errorCode = 'MG00001'
        //Toast.hide()
        // isShowPrizeModalConatiner = true
        // errorCode = 'MG00009'
        // remainingGrabFromHighestTier = 2
        // remainingGrabFromCurrentTier = 0
        const eventStartDate1 = moment(eventStartDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
        const eventEndDate1 = moment(eventEndDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
        const nowTime = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').valueOf()

        let Tag = window.isFastImage ? FastImage : Image

        return <View style={styles.viewContainer}>
            {/* 抽奖失败 */}
            <Modal
                visible={isShowDepositModal}
                animationType='fade'
                transparent={true}
            >
                <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        <View style={styles.modalHead}>
                            <Text style={styles.modalHeadLeft}>Lưu Ý</Text>
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
                                    <Text style={styles.modalBoayText}>
                                        {
                                            this.createErrStatus()[errorCode].message
                                        }
                                    </Text>
                                }


                                {
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
                        source={require('./../../images/worldCup/Pop-Up_SEA.gif')}></Image>
                    <View style={styles.getPrizeBg1}>
                        {
                            isShowPrizeModalConatiner &&
                            (
                                errorCode == 'MG00009' ?
                                    <View style={[styles.viewModalPrizeBox, styles.viewModalPrizeBox1]}>
                                        <View>
                                            {/* 很遗憾您的奖励是空的，请再接再厉！ 您今日参与活动的次数已用完，请明天再试  done*/}
                                            {
                                                remainingGrabFromHighestTier == 0 && remainingGrabFromCurrentTier == 0 &&
                                                <View style={{ paddingHorizontal: 40 }}>
                                                    <View>
                                                        <Text style={[styles.modalBoayText, styles.modalBoayText1]}>Rất tiếc bạn không thắng giải thưởng nào! </Text>
                                                        <Text style={styles.modalBoayText}>Bạn đã hết lượt chơi của ngày hôm nay, vui lòng quay lại vào ngày mai.</Text>
                                                    </View>

                                                    <View style={[styles.modalBoayBtnWrap, { justifyContent: 'center' }]}>
                                                        <TouchableOpacity style={[styles.modalBoayBtn, styles.modalBoayBtnMid]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowPrizeModal: false,
                                                                    isShowPrizeModalConatiner: false
                                                                })
                                                            }}
                                                        >
                                                            <ImageBackground
                                                                resizeMode='stretch'
                                                                source={require('./../../images/worldCup/Button-Pop-Up_1.png')}
                                                                style={styles.modalBtnBoxBtnBg}>
                                                                <Text style={[styles.modalBoayBtnLeftText, { color: '#fff' }]}>OK</Text>
                                                            </ImageBackground>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }

                                            {/* 很遗憾您的奖励是空的，请再接再厉！ 您参与活动的次数已用完，请存款后再试。 */}
                                            {
                                                remainingGrabFromHighestTier > 0 && remainingGrabFromCurrentTier == 0 &&
                                                <View >
                                                    <View style={{ paddingHorizontal: 45, marginTop: 20 }}>
                                                        <Text style={[styles.modalBoayText]}>Rất tiếc bạn không thắng giải thưởng nào, vui lòng gửi tiền và thử lại.</Text>
                                                    </View>

                                                    <View style={[styles.modalBoayBtnWrap, {}]}>
                                                        <TouchableOpacity style={[styles.modalBtnBoxBtnBg, {
                                                            transform: [{
                                                                translateX: 15
                                                            }]
                                                        }]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowPrizeModal: false,
                                                                    isShowPrizeModalConatiner: false
                                                                })
                                                            }}
                                                        >
                                                            <ImageBackground
                                                                resizeMode='stretch'
                                                                source={require('./../../images/worldCup/Button-Pop-Up_1.png')}
                                                                style={styles.modalBtnBoxBtnBg}>
                                                                <Text style={styles.modalBoayBtnLeftText}>TRỞ VỀ</Text>
                                                            </ImageBackground>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.modalBtnBoxBtnBg, {
                                                            transform: [{
                                                                translateX: -15
                                                            }]
                                                        }]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowPrizeModal: false,
                                                                    isShowPrizeModalConatiner: false
                                                                }, () => {
                                                                    Actions.DepositStack()
                                                                    window.PiwikMenberCode('Deposit_Nav', 'Click', 'Deposit_WCPage2022')
                                                                })
                                                            }}
                                                        >
                                                            <ImageBackground
                                                                resizeMode='stretch'
                                                                source={require('./../../images/worldCup/Button-Pop-Up_2.png')}
                                                                style={styles.modalBtnBoxBtnBg}>
                                                                <Text style={[styles.modalBoayBtnRighText, { color: '#fff' }]}>GỬI TIỀN NGAY</Text>
                                                            </ImageBackground>

                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }


                                            {/* 很遗憾您的奖励是空的，请再接再厉！ 今天剩余 X 次参与活动的机会 */}
                                            {
                                                remainingGrabFromCurrentTier > 0 &&
                                                <View>
                                                    <View style={{ paddingHorizontal: 45 }}>
                                                        <Text style={[styles.modalBoayText, styles.modalBoayText1]}>Rất tiếc bạn không thắng giải thưởng nào, hãy thử lại!</Text>
                                                        <Text style={styles.modalBoayText}>Bạn vẫn còn <Text style={[styles.prizeInfor, styles.prizeInfor1]}>{remainingGrabFromCurrentTier}</Text> số lượt chơi!</Text>
                                                    </View>

                                                    <View style={[styles.modalBoayBtnWrap, {}]}>
                                                        <TouchableOpacity style={[styles.modalBtnBoxBtnBg, {
                                                            transform: [{
                                                                translateX: 18
                                                            }]
                                                        }]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowPrizeModal: false,
                                                                    isShowPrizeModalConatiner: false
                                                                })
                                                            }}
                                                        >
                                                            <ImageBackground
                                                                resizeMode='stretch'
                                                                source={require('./../../images/worldCup/Button-Pop-Up_1.png')}
                                                                style={styles.modalBtnBoxBtnBg}>
                                                                <Text style={styles.modalBoayBtnLeftText}>TRỞ VỀ</Text>
                                                            </ImageBackground>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity style={[styles.modalBtnBoxBtnBg, {
                                                            transform: [{
                                                                translateX: -18
                                                            }]
                                                        }]}
                                                            onPress={() => {
                                                                this.setState({
                                                                    isShowPrizeModal: false,
                                                                    isShowPrizeModalConatiner: false
                                                                }, () => {
                                                                    this.potSnatchPrize()
                                                                })

                                                                window.PiwikMenberCode('Engagement_Event', 'Click', 'GrabMore_WCPage2022')
                                                            }}
                                                        >
                                                            <ImageBackground
                                                                resizeMode='stretch'
                                                                source={require('./../../images/worldCup/Button-Pop-Up_2.png')}
                                                                style={styles.modalBtnBoxBtnBg}>
                                                                <Text style={[styles.modalBoayBtnRighText, { color: '#fff' }]}>เล่นเลย</Text>
                                                            </ImageBackground>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            }
                                        </View>
                                    </View>
                                    :
                                    <View style={[styles.viewModalPrizeBox, styles.viewModalPrizeBox2]}>

                                        {
                                            (prizeImg + '').length > 0 &&
                                            <Image
                                                resizeMode='stretch'
                                                source={prizeImg}
                                                style={styles.lotteryIconImg}
                                            ></Image>
                                        }
                                        {
                                            <Text style={[styles.modalPrizeText, styles.modalPrizeText2]}>Chúc Mừng Bạn Đã Thắng <Text style={styles.prizeInfor}>{prizeName}!</Text></Text>
                                        }


                                        {/* 恭喜您获得 XXXXX ! 今天剩余 X 活动次数。 */}
                                        {
                                            remainingGrabFromCurrentTier > 0 &&
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={[styles.modalPrizeText, styles.modalPrizeText2]}>Bạn vẫn còn <Text style={styles.prizeInfor}>{remainingGrabFromCurrentTier}</Text> lượt chơi!</Text>
                                                <View style={styles.modalBtnBox}>
                                                    <TouchableOpacity style={[styles.modalBtnBoxBtnBg, styles.modalBtnBoxBtnBg11]}
                                                        onPress={() => {
                                                            this.setState({
                                                                isShowPrizeModal: false,
                                                                isShowPrizeModalConatiner: false
                                                            })
                                                        }}
                                                    >
                                                        <ImageBackground
                                                            resizeMode='stretch'
                                                            source={require('./../../images/worldCup/Button-Pop-Up_1.png')}
                                                            style={[styles.modalBtnBoxBtnBg, styles.modalBtnBoxBtnBg12]}>
                                                            {
                                                                <Text style={styles.modalBtnBoxBtnText1}>TRỞ VỀ</Text>
                                                            }
                                                        </ImageBackground>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[styles.modalBtnBoxBtnBg, styles.modalBtnBoxBtnBg22]}
                                                        onPress={() => {
                                                            this.setState({
                                                                isShowPrizeModal: false,
                                                                isShowPrizeModalConatiner: false
                                                            }, () => {
                                                                this.potSnatchPrize()
                                                                window.PiwikMenberCode('Engagement_Event', 'Click', 'GrabMore_WCPage2022')
                                                            })
                                                        }}
                                                    >
                                                        <ImageBackground
                                                            resizeMode='stretch'
                                                            source={require('./../../images/worldCup/Button-Pop-Up_2.png')}
                                                            style={[styles.modalBtnBoxBtnBg, styles.modalBtnBoxBtnBg12]}>
                                                            {
                                                                <Text style={[styles.modalBtnBoxBtnText2]}>เล่นเลย</Text>
                                                            }
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }

                                        {/* 恭喜您获得 XXXXX ! 您的活动次数已用完，请存款后再试。 */}
                                        {
                                            remainingGrabFromCurrentTier == 0 && remainingGrabFromHighestTier > 0 &&
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={[styles.modalPrizeText, styles.modalPrizeText2]}>Bạn đã hết lượt chơi, hãy gửi thêm tiền để tiếp tục.</Text>
                                                <View style={styles.modalBtnBox}>
                                                    <TouchableOpacity style={[styles.modalBtnBoxBtnBg, {
                                                        transform: [{
                                                            translateX: 14
                                                        }]
                                                    }]}
                                                        onPress={() => {
                                                            this.setState({
                                                                isShowPrizeModal: false,
                                                                isShowPrizeModalConatiner: false
                                                            })
                                                        }}
                                                    >
                                                        <ImageBackground
                                                            resizeMode='stretch'
                                                            source={require('./../../images/worldCup/Button-Pop-Up_1.png')}
                                                            style={styles.modalBtnBoxBtnBg}>
                                                            {
                                                                <Text style={styles.modalBtnBoxBtnText1}>TRỞ VỀ</Text>
                                                            }
                                                        </ImageBackground>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[styles.modalBtnBoxBtnBg, {
                                                        transform: [{
                                                            translateX: -14
                                                        }]
                                                    }]}
                                                        onPress={() => {
                                                            this.setState({
                                                                isShowPrizeModal: false,
                                                                isShowPrizeModalConatiner: false
                                                            }, () => {
                                                                Actions.DepositStack()
                                                            })
                                                            window.PiwikMenberCode('Deposit_Nav', 'Click', 'Deposit_WCPage2022')
                                                        }}
                                                    >
                                                        <ImageBackground
                                                            resizeMode='stretch'
                                                            source={require('./../../images/worldCup/Button-Pop-Up_2.png')}
                                                            style={styles.modalBtnBoxBtnBg}>
                                                            {
                                                                <Text style={styles.modalBtnBoxBtnText2}>GỬI TIỀN NGAY</Text>
                                                            }
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }

                                        {/* 恭喜您获得 XXXXX ! 您今天的活动次数已用完，请明天再试。 */}
                                        {
                                            remainingGrabFromHighestTier == 0 &&
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={[styles.modalPrizeText, styles.modalPrizeText2]}>Bạn đã hết lượt chơi của ngày hôm nay, vui lòng quay lại vào ngày mai.</Text>
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
                                                            source={require('./../../images/worldCup/Button-Pop-Up_1.png')}
                                                            style={styles.modalBtnBoxBtnBg}>
                                                            {
                                                                <Text style={styles.modalBtnBoxBtnText1}>OK</Text>
                                                            }
                                                        </ImageBackground>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }
                                    </View>
                            )
                        }
                    </View>
                </View>
            </Modal>

            {/* 国家列表 */}
            <Modal
                visible={modalCountryFlag}
                animationType='fade'
                transparent={true}
            >
                <View style={styles.viewModalContainer}>
                    <View style={[styles.viewModalBox, styles.viewModalBox1]}>
                        <View style={[styles.modalHead1]}>
                            <Text style={[styles.modalHeadLeft, styles.modalHeadLeft1, { fontSize: 14, paddingHorizontal: 40 }]}>Vui lòng chọn đội World Cup của bạn, tối đa 3 đội</Text>
                        </View>

                        <View style={[styles.modalBoay, styles.modalBoay1]}>
                            <ScrollView
                                automaticallyAdjustContentInsets={false}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                <View style={styles.countryWrap}>
                                    {
                                        Array.isArray(countryList) && countryList.length > 0 && countryList.map((v, i) =>
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => {
                                                    v.flag = !v.flag
                                                    this.setState({})
                                                }}
                                                style={[styles.countryList]}>
                                                <View style={[styles.isChecked, {
                                                    backgroundColor: v.flag ? '#00A6FF' : '#fff',
                                                    borderColor: v.flag ? '#00A6FF' : '#E6E6EB'
                                                }]}>
                                                    {
                                                        v.flag && <Text style={styles.isCheckedText}>✓</Text>
                                                    }
                                                </View>
                                                {
                                                    <Image
                                                        style={styles.countryListIcon}
                                                        resizeMode='stretch'
                                                        source={countryIcon[v.englishName]}></Image>
                                                }
                                                <Text>{v.localizedName}</Text>
                                            </TouchableOpacity>
                                        )
                                    }
                                </View>
                            </ScrollView>
                            {
                                Array.isArray(countryList) && countryList.length > 0 && countryList.filter(v => v.flag).length >= 4 && <Text style={styles.errorTip}>Rất tiếc, bạn chỉ có thể chọn tối đa 3 đội.</Text>
                            }
                            {
                                Array.isArray(countryList) && countryList.length > 0 && countryList.filter(v => v.flag).length <= 0 && <Text style={styles.errorTip}>Vui lòng chọn tối thiểu 1 đội, tối đa 3 đội.</Text>
                            }
                            <View style={styles.counteryBtnWrap}>
                                <TouchableOpacity
                                    onPress={this.postTeamPreferencesWC22.bind(this, false)}
                                    style={[styles.counteryBtn, styles.counteryBtn1]}>
                                    <Text style={[styles.counteryBtnText, styles.counteryBtnText1]}>Hủy</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.counteryBtn, styles.counteryBtn2]} onPress={this.postTeamPreferencesWC22.bind(this, true)}>
                                    <Text style={[styles.counteryBtnText, styles.counteryBtnText2]}>บันทึก</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor={'#25AAE1'}
                        onRefresh={this.getMemberProgress.bind(this, true)}
                    />
                }
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/BG_2.png')}
                    style={styles.wrapper}>
                    {
                        (Array.isArray(bannerData1) && bannerData1.length > 0) ?
                            <View style={{ flexDirection: 'row' }}>
                                <Carousel
                                    data={bannerData1}
                                    renderItem={this.renderMainPage.bind(this)}
                                    sliderWidth={width - 40}
                                    itemWidth={width - 40}
                                    inactiveSlideScale={1}
                                    autoplay={true}
                                    loop={true}
                                    autoplayDelay={500}
                                    autoplayInterval={4000}
                                    onSnapToItem={index => { this.setState({ bannerIndex3: index }) }}
                                />
                                <Pagination
                                    dotsLength={bannerData1.length}
                                    activeDotIndex={bannerIndex3}
                                    containerStyle={styles.containerStyle}
                                    dotStyle={styles.dotStyle}
                                    inactiveDotStyle={styles.inactiveDotStyle}
                                    inactiveDotOpacity={1}
                                    inactiveDotScale={0.6}
                                />
                            </View>
                            :
                            <Image
                                resizeMode='stretch'
                                style={styles.carouselImg11}
                                source={require('./../../images/worldCup/Default-Banner-Main_VN.jpg')}
                            />
                    }
                </ImageBackground>

                <ImageBackground
                    style={styles.section2}
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/BG_1.png')}>
                    <View style={styles.inforBox}>
                        <Image
                            source={require('./../../images/worldCup/Text-Decoration_L.png')}
                            style={[styles.inforImg, styles.inforImg1]}
                            resizeMode='stretch'></Image>
                        <Text style={styles.inforBoxText}>MINI GAME​</Text>
                        <Image
                            source={require('./../../images/worldCup/Text-Decoration_R.png')}
                            style={[styles.inforImg, styles.inforImg2]}
                            resizeMode='stretch'></Image>
                    </View>

                    <View style={{ marginHorizontal: 15 }}>
                        <View style={styles.inforContainer}>
                            <View style={styles.inforContainerList}>
                                <View style={[styles.inforContainerListLine]}>
                                    <Text style={styles.inforContainerListText}>{remainingGrabFromCurrentTier}</Text>
                                </View>
                                <Text style={[styles.inforContainerListText1, { textAlign: 'left' }]}>{`Tổng Số Lượt Chơi​\nCộng Dồn`}</Text>
                            </View>

                            <View style={styles.inforContainerList}>
                                <View style={[styles.inforContainerListLine, styles.inforContainerListLine1]}>
                                    <Text style={styles.inforContainerListText}>{toThousandsAnother(totalDepositedDaily + '', ' VND')}</Text>
                                    <TouchableOpacity hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                                        onPress={this.getMemberProgress.bind(this)}
                                    >
                                        <Image
                                            style={styles.Refresh}
                                            resizeMode='stretch'
                                            source={require('./../../images/worldCup/Icon-Refresh.png')}></Image>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.inforContainerListText1}>{`Tổng Số Tiền Gửi\nHôm Nay`}</Text>
                            </View>
                        </View>


                        <View style={styles.itemBox}>
                            <TouchableOpacity style={styles.itemBoxList} onPress={() => {
                                if (!ApiPort.UserLogin) {
                                    window.isReLotteryFlag = true
                                    Actions.login()
                                    return
                                }
                                Actions.LotteryHostory({
                                    promoId
                                })
                                window.PiwikMenberCode('Engagement_Event​', 'View', 'MyPrize_WCPage2022')
                            }}>
                                <Image style={styles.itemBoxImg1}
                                    resizeMode='stretch'
                                    source={require('./../../images/worldCup/Icon-Gift.png')}></Image>
                                <Text style={styles.itemBoxListText1}>{`Lịch Sử Thưởng\nCủa Tôi`}</Text>
                                <Text style={styles.itemBoxListText2}>&gt;</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                Actions.LotteryRule()
                                window.PiwikMenberCode('Engagement_Event​', 'View', 'TnC_WCPage2022​')
                            }} style={styles.itemBoxList}>
                                <Image style={styles.itemBoxImg1}
                                    resizeMode='stretch'
                                    source={require('./../../images/worldCup/Icon-Rules.png')}></Image>
                                <Text style={styles.itemBoxListText1}>{`Điều Khoản Và\nĐiều Kiện`}</Text>
                                <Text style={styles.itemBoxListText2}>&gt;</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {
                        nowTime > eventEndDate1 ? <Tag
                            style={styles.SEA_GameNotStarted}
                            resizeMode='stretch'
                            source={require('./../../images/worldCup/BG-EN_EventFinished.gif')} />
                            :
                            <View>
                                {
                                    isShowInfor == 1 &&
                                    // nowTime < eventEndDate1 && 
                                    <ImageBackground
                                        style={styles.SEA_GameNotStarted}
                                        resizeMode='stretch'
                                        source={require('./../../images/worldCup/BG-SEA_GameNotStarted.jpg')}>
                                        <Image
                                            source={require('./../../images/worldCup/Text-Title_VN.png')}
                                            style={[styles.SEA_GameNotStartedLogo]}
                                            resizeMode='stretch'></Image>

                                        <View style={styles.lotteryResetTimeBox}>
                                            <View style={styles.lotteryResetTimeWrap}>
                                                <View style={styles.lotteryResetListTimeBox}>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{days.split('')[0]}</Text>
                                                    </ImageBackground>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={styles.lotteryResetListTimeBox1}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{days.split('')[1]}</Text>
                                                    </ImageBackground>
                                                </View>
                                                <Text style={styles.lotteryResetListTimeBoxText2}>Ngày</Text>
                                            </View>

                                            <View style={styles.lotteryResetTimeWrap}>
                                                <View style={styles.lotteryResetListTimeBox}>
                                                    <View style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox2]}>
                                                        <Text style={styles.lotteryResetTimeIcon}>:</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.lotteryResetListTimeBoxText2}></Text>
                                            </View>

                                            <View style={styles.lotteryResetTimeWrap}>
                                                <View style={styles.lotteryResetListTimeBox}>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{hours.split('')[0]}</Text>
                                                    </ImageBackground>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={styles.lotteryResetListTimeBox1}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{hours.split('')[1]}</Text>
                                                    </ImageBackground>
                                                </View>
                                                <Text style={styles.lotteryResetListTimeBoxText2}>Giờ</Text>
                                            </View>

                                            {
                                                <View style={styles.lotteryResetTimeWrap}>
                                                    <View style={styles.lotteryResetListTimeBox}>
                                                        <View style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox2]}>
                                                            <Text style={styles.lotteryResetTimeIcon}>:</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.lotteryResetListTimeBoxText2}></Text>
                                                </View>
                                            }

                                            <View style={styles.lotteryResetTimeWrap}>
                                                <View style={styles.lotteryResetListTimeBox}>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{minutes.split('')[0]}</Text>
                                                    </ImageBackground>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={styles.lotteryResetListTimeBox1}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{minutes.split('')[1]}</Text>
                                                    </ImageBackground>
                                                </View>
                                                <Text style={styles.lotteryResetListTimeBoxText2}>Phút</Text>
                                            </View>

                                            <View style={styles.lotteryResetTimeWrap}>
                                                <View style={styles.lotteryResetListTimeBox}>
                                                    <View style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox2]}>
                                                        <Text style={styles.lotteryResetTimeIcon}>:</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.lotteryResetListTimeBoxText2}></Text>
                                            </View>

                                            <View style={styles.lotteryResetTimeWrap}>
                                                <View style={styles.lotteryResetListTimeBox}>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={[styles.lotteryResetListTimeBox1, styles.lotteryResetListTimeBox3]}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{seconds.split('')[0]}</Text>
                                                    </ImageBackground>
                                                    <ImageBackground
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/Countdown.png')}
                                                        style={styles.lotteryResetListTimeBox1}>
                                                        <Text style={styles.lotteryResetListTimeBoxText1}>{seconds.split('')[1]}</Text>
                                                    </ImageBackground>
                                                </View>
                                                <Text style={styles.lotteryResetListTimeBoxText2}>Giây</Text>
                                            </View>
                                        </View>


                                        <ImageBackground
                                            style={styles.ActivityTime}
                                            resizeMode='stretch'
                                            source={require('./../../images/worldCup/ActivityTime.png')}
                                        >
                                            <Text style={styles.ActivityTimeText}>Thời gian: {moment(eventStartDate).format('MM/DD,HH:MM')} - {moment(eventEndDate).format('MM/DD,HH:MM')} (GMT+8)</Text>
                                        </ImageBackground>

                                        <View style={styles.SEA_GameNotStartedBtnWrap}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    ((nowTime < eventEndDate1) && (nowTime > eventStartDate1)) && this.setState({
                                                        isShowInfor: 2
                                                    })
                                                }}
                                                style={[styles.SEA_GameNotStartedBtnWrapImg, styles.SEA_GameNotStartedBtnWrapImg1]}>
                                                <Image
                                                    resizeMode='stretch'
                                                    source={
                                                        ((nowTime < eventEndDate1) && (nowTime > eventStartDate1)) ?
                                                            require('./../../images/worldCup/Button-Play.png')
                                                            :
                                                            require('./../../images/worldCup/Button-Play_Disabled.png')
                                                    }
                                                    style={styles.SEA_GameNotStartedBtnWrapImg}></Image>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        isShowInfor: 3
                                                    })
                                                }}
                                                style={[styles.SEA_GameNotStartedBtnWrapImg, styles.SEA_GameNotStartedBtnWrapImg2]}>
                                                <Image
                                                    resizeMode='stretch'
                                                    source={require('./../../images/worldCup/Button-How.png')}
                                                    style={styles.SEA_GameNotStartedBtnWrapImg}></Image>
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>
                                }


                                {
                                    isShowInfor == 2 && <ImageBackground
                                        style={[styles.SEA_GameNotStarted, styles.SEA_GameNotStarted1]}
                                        resizeMode='stretch'
                                        source={require('./../../images/worldCup/BG-SEA_GameStarted.jpg')}>
                                        {
                                            <Tag style={styles.ball1}
                                                resizeMode='stretch'
                                                source={require('./../../images/worldCup/ball/SEA_GoalKeeper-Static.gif')} />
                                        }
                                        {
                                            <Touch
                                                style={styles.ball2}
                                                onPress={() => {
                                                    this.potSnatchPrize()
                                                    window.PiwikMenberCode('Engagement_Event', 'Claim', 'Kick_WCPage2022')
                                                }}>
                                                {
                                                    <Tag style={styles.ball2}
                                                        resizeMode='stretch'
                                                        source={require('./../../images/worldCup/ball/Click-The-Ball_VN.gif')} />
                                                }
                                            </Touch>
                                        }
                                    </ImageBackground>
                                }


                                {
                                    isShowInfor == 3 && <ImageBackground
                                        style={styles.SEA_GameNotStarted}
                                        resizeMode='stretch'
                                        source={require('./../../images/worldCup/BG-SEA_GameStarted.jpg')}>
                                        {
                                            <ImageBackground
                                                style={[styles.SEA_GameNotStarted, styles.SEA_GameNotStarted1]}
                                                resizeMode='stretch'
                                                source={require('./../../images/worldCup/HowToPlay_VN.png')}>
                                                {
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                isShowInfor: 1
                                                            })
                                                        }}
                                                        style={styles.playLottery}></TouchableOpacity>
                                                }
                                            </ImageBackground>
                                        }
                                    </ImageBackground>
                                }
                            </View>
                    }
                </ImageBackground>

                <ImageBackground
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/BG_2.png')}
                    style={[styles.section2,]}>
                    <View style={styles.inforBox}>
                        <Image
                            source={require('./../../images/worldCup/Text-Decoration_L.png')}
                            style={[styles.inforImg, styles.inforImg1]}
                            resizeMode='stretch'></Image>
                        <Text style={styles.inforBoxText}>GAME KHÁC</Text>
                        <Image
                            source={require('./../../images/worldCup/Text-Decoration_R.png')}
                            style={[styles.inforImg, styles.inforImg2]}
                            resizeMode='stretch'></Image>
                    </View>

                    {
                        (Array.isArray(bannerData2) && bannerData2.length > 0)
                            ?
                            <View style={{ flexDirection: 'row', width: width - 15, marginLeft: 15 }}>
                                <Carousel
                                    layout={"default"}
                                    data={bannerData2}
                                    renderItem={this.renderGamePage.bind(this)}
                                    sliderWidth={width * .7}
                                    itemWidth={width * .7}
                                    inactiveSlideScale={1}
                                    autoplay={true}
                                    loop={true}
                                    autoplayDelay={500}
                                    autoplayInterval={4000}
                                    onSnapToItem={index => { this.setState({ bannerIndex2: index }); }}
                                />
                                <Pagination
                                    dotsLength={bannerData2.length}
                                    activeDotIndex={bannerIndex2}
                                    containerStyle={styles.containerStyle}
                                    dotStyle={styles.dotStyle}
                                    inactiveDotStyle={styles.inactiveDotStyle}
                                    inactiveDotOpacity={1}
                                    inactiveDotScale={0.6}
                                />
                            </View>
                            :
                            <Image
                                resizeMode='stretch'
                                style={styles.carouselImg33}
                                source={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                            />
                    }
                </ImageBackground>

                <ImageBackground
                    resizeMode='stretch'
                    source={require('./../../images/worldCup/BG_1.png')}
                    style={styles.section2}>
                    <View style={styles.inforBox}>
                        <Image
                            source={require('./../../images/worldCup/Text-Decoration_L.png')}
                            style={[styles.inforImg, styles.inforImg1]}
                            resizeMode='stretch'></Image>
                        <Text style={styles.inforBoxText}>TIN TỨC</Text>
                        <Image
                            source={require('./../../images/worldCup/Text-Decoration_R.png')}
                            style={[styles.inforImg, styles.inforImg2]}
                            resizeMode='stretch'></Image>
                    </View>
                    {
                        (Array.isArray(newsList) && newsList.length > 0) ?
                            <View style={{ flexDirection: 'row' }}>
                                <Carousel
                                    layout={"default"}
                                    data={newsList.filter(v => v.sticky)}
                                    renderItem={this.renderNewsPage.bind(this)}
                                    sliderWidth={width}
                                    itemWidth={width - 40}
                                    inactiveSlideScale={1}
                                    autoplay={true}
                                    loop={true}
                                    autoplayDelay={500}
                                    autoplayInterval={4000}
                                    onSnapToItem={index => { this.setState({ bannerIndex1: index }); }}
                                />
                                <Pagination
                                    dotsLength={newsList.filter(v => v.sticky).length}
                                    activeDotIndex={bannerIndex1}
                                    containerStyle={styles.containerStyle}
                                    dotStyle={styles.dotStyle}
                                    inactiveDotStyle={styles.inactiveDotStyle}
                                    inactiveDotOpacity={1}
                                    inactiveDotScale={0.6}
                                />
                            </View>
                            :
                            <Image
                                resizeMode='stretch'
                                style={[styles.carouselImg22, {
                                    height: (width - 80) * .728
                                }]}
                                source={require('./../../images/worldCup/Default-Banner-Games_VN.jpg')}
                            />
                    }

                    <View style={styles.newsBox}>
                        {
                            Array.isArray(newsList) && newsList.length > 0 && <View>
                                {
                                    (newsList.filter(v => !v.sticky).slice(0, 3)).map((v, i) => <TouchableOpacity
                                        onPress={this.getWorldCupNewsDetail.bind(this, v)}
                                        style={styles.newsList}
                                        key={i}>
                                        <View style={styles.newsListImgBox}>
                                            <Image resizeMode='stretch'
                                                source={{ uri: v.thumbnail }}
                                                style={styles.newsListImg}></Image>
                                        </View>

                                        <View style={styles.newsListTextBox}>
                                            <Text style={styles.newsListText1}>{v.title}</Text>
                                            <Text style={styles.newsListText2}>{moment(v.updatedDate).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                        </View>

                                        {
                                            v.isShowPlayerIcon &&
                                            <View style={[styles.IconVideoBox, styles.IconVideoBox1]}>
                                                <Image style={[styles.IconVideo, styles.IconVideo1]}
                                                    resizeMode='stretch'
                                                    source={require('./../../images/worldCup/Icon-Video.png')}></Image>
                                            </View>
                                        }
                                    </TouchableOpacity>)
                                }

                                {
                                    newsList.length > 3 && <TouchableOpacity style={styles.moreNewsBtn} onPress={() => {
                                        Actions.WordNewsAll({
                                            newsList
                                        })
                                    }}>
                                        <Text style={styles.moreNewsBtnText}>Xem Tất Cả</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        }

                        <Text style={styles.brand}>Mọi Bản Quyền Thuộc FUN88 2008 - 2022</Text>
                    </View>
                </ImageBackground>
            </ScrollView>
        </View>
    }
}

export default WorldCup = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
            promotionListData: state.promotionListData,
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
            getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(WorldCupContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        //  backgroundColor: '#0B3E85'
    },
    wrapper: {
        paddingHorizontal: 15,
        paddingTop: 15,
        marginBottom: 0,
        borderRadius: 6,
        paddingBottom: 40
    },
    containerStyle: {
        paddingVertical: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -25
    },
    dotStyle: {
        width: 10,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#FFE786'
    },
    inactiveDotStyle: {
        width: 5,
        backgroundColor: '#B8B8B8'
    },
    carouselImg1: {
        width: width - 48,
        height: (width - 48) * 1.02,
        borderRadius: 8,
        position: 'relative'
    },
    carouselImg11: {
        width: width - 20,
        height: (width - 50) * .9,
    },
    carouselImg3: {
        width: width * .68,
        height: (width * .68) * .615,
        borderRadius: 6
    },
    carouselImg33: {
        width: width,
        height: (width - 20) * .615
    },
    carouselImg: {
        width: width - 50,
        height: (width - 50) * .9,
        borderRadius: 4,
        position: 'relative'
    },
    carouselImg2: {
        width: width - 50,
        height: (width - 50) * .45,
        borderRadius: 6
    },
    carouselImg22: {
        width,
        height: (width - 80) * .45
    },
    section2: {
        width,
        //marginBottom: 25
        paddingBottom: 40,
    },
    inforBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 80
    },
    inforImg: {
        width: 50,
        height: 50 * 0.404
    },
    inforImg1: {
        marginRight: 10
    },
    inforImg2: {
        marginLeft: 10
    },
    inforBoxText: {
        color: '#FFE786',
        fontSize: 22
    },
    Refresh: {
        width: 16,
        height: 16,
        marginLeft: 6
    },
    inforContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
        borderBottomWidth: 1,
        marginBottom: 20,
        borderBottomColor: '#0B3E85'
    },
    inforContainerList: {},
    inforContainerListLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    inforContainerListLine1: {
        justifyContent: 'flex-end',
    },
    inforContainerListText: {
        color: '#FFE786',
        fontSize: 18,
        fontWeight: '600',
    },
    inforContainerListText1: {
        color: '#E2E2E2',
        fontSize: 12,
        textAlign: 'right'
    },
    itemBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    itemBoxList: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemBoxImg1: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    itemBoxListText1: {
        color: '#FFE786',
        paddingRight: 6,
        fontSize: 11
    },
    itemBoxListText2: {
        color: '#FFE786',
        marginLeft: 5
    },
    SEA_GameNotStarted: {
        width: width - 30,
        height: (width - 30) * 1.05,
        marginHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        overflow: 'hidden'
    },
    playLottery: {
        position: 'absolute',
        height: 50,
        width: 200,
        bottom: 50,
    },
    SEA_GameNotStartedLogo: {
        width: width * .4,
        height: width * .4 * 0.81
    },
    lotteryResetTimeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width * 0.9,
        marginTop: 10
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
        height: 35 * .98,
        alignItems: 'center',
        justifyContent: 'center',
        //  marginRight: 4
    },
    lotteryResetListTimeBox3: {
        marginRight: 4
    },
    lotteryResetListTimeBox2: {
        width: 'auto',
    },
    lotteryResetListTimeBoxText1: {
        color: '#FFE786',
        fontWeight: 'bold',
        fontSize: 20,
        transform: [{
            translateY: -2
        }]
    },
    lotteryResetListTimeBoxText2: {
        color: '#E2E2E2',
        fontSize: 12
    },
    lotteryTime: {
        alignItems: 'center',
        justifyContent: 'center',
        width: width * .78,
        height: width * .78 * .215,
        marginTop: 20,
        marginBottom: 20,
    },
    lotteryTimeText: {
        color: '#FFEFD9',
        fontSize: 13
    },
    lotteryResetTimeIcon: {
        color: '#FFE786',
        fontSize: 22,
        fontWeight: 'bold'
    },
    ActivityTime: {
        width: (width - 30) * .94,
        height: (width - 30) * .94 * .118,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    ActivityTimeText: {
        color: '#FFE786',
        textAlign: 'center',
        fontSize: 12
    },
    SEA_GameNotStartedBtnWrap: {
        flexDirection: 'row'
    },
    SEA_GameNotStartedBtnWrapImg: {
        width: 60,
        height: 60
    },
    SEA_GameNotStartedBtnWrapImg1: {
        marginRight: 15
    },
    newsBox: {
        width: width - 30,
        marginHorizontal: 15,
        marginTop: 40
    },
    newsList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    newsListImg: {
        width: (width - 30) * .35,
        height: 75,
        borderRadius: 8,
        overflow: 'hidden'
    },
    newsListTextBox: {
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, .3)',
        width: (width - 30) * .65 - 15,
    },
    newsListText1: {
        color: '#FFFFFF',
        fontSize: 13,
        flexWrap: 'wrap',
    },
    newsListText2: {
        color: 'rgba(255, 255, 255, .6)',
        fontSize: 11
    },
    newsListImgBox: {
        width: (width - 20) * .35,
        height: 75,
        borderRadius: 8,
        overflow: 'hidden'
    },
    moreNewsBtn: {
        width: width - 20,
        height: 48,
        backgroundColor: '#FFE05C',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    moreNewsBtnText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    brand: {
        textAlign: 'center',
        color: '#A0C9BF',
        marginTop: 60,
        marginBottom: 80,
        fontSize: 12
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
        backgroundColor: '#fff',
        overflow: 'hidden',
        width: width * .88
    },
    modalHead: {
        height: 42,
        backgroundColor: '#013C85',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalHeadLeft: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalHeadRight: {
        width: 26,
        height: 26,
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        borderWidth: 2,
        position: 'absolute',
        right: 10
    },
    modalHeadRightText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalBoay: {
        // paddingHorizontal: 10,
        paddingVertical: 30,
        width: width * .88,
        //height: height * .6,
    },
    modalBoayText: {
        color: '#484848',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '400',
        paddingHorizontal: 10,
    },
    modalBoayText1: {
        marginBottom: 20
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
        width: (width * .88 - 40) * .5,
        borderRadius: 10
    },
    modalBoayBtnMid: {
        width: (width * .88 - 40) * .45,
        //backgroundColor: '#F6DAB5'
    },
    modalBoayBtnLeft: {
        // backgroundColor: '#FF734A'
    },
    modalBoayBtnRight: {
        // backgroundColor: '#F6DAB5'
    },
    modalBoayBtnLeftText: {
        color: '#fff'
    },
    modalBoayBtnRighText: {
        color: '#927D25',
    },
    getPrizeBg: {
        width: width * .95,
        height: width * .95,
        paddingTop: 30,
    },
    getPrizeBg1: {
        position: 'absolute',
    },
    modalBtnBoxBtnBg: {
        width: width * .96 * .45,
        height: width * .95 * .45 * .27,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBtnBoxBtnBg1: {
        transform: [{
            translateX: 10
        }]
    },
    modalBtnBoxBtnBg2: {
        transform: [{
            translateX: -10
        }]
    },
    modalBtnBoxBtnBg11: {
        transform: [{
            translateX: 12
        }]
    },
    modalBtnBoxBtnBg22: {
        transform: [{
            translateX: -12
        }]
    },
    modalBtnBoxBtnBg12: {
        width: width * .96 * .48,
        height: width * .95 * .48 * .27,
    },
    viewModalPrizeBox: {

        width: width * .95,
        flex: 1,
        // backgroundColor: 'blue'
    },
    viewModalPrizeBox1: {
        paddingTop: 0,
    },
    viewModalPrizeBox2: {
        // backgroundColor: 'red',
        alignItems: 'center',
        transform: [{
            translateY: -45
        }]
    },
    modalPrizeText: {
        width: width * .96 * .8,
        textAlign: 'center',
        color: '#012557',
        fontSize: 14,
        marginBottom: 5
    },
    modalPrizeText2: {
        width: width * .96 * .74,
    },
    prizeInfor: {
        color: '#1B8EF0',
        fontWeight: 'bold'
    },
    prizeInfor1: {
        color: '#EACF7A'
    },
    modalContaninerText: {
        color: '#F6DAB5',
        fontSize: 15,
        fontWeight: 'bold'
    },
    modalBtnBox: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-between'
    },
    modalBtnBoxBtnText1: {
        color: '#FFFFFF',
        fontSize: 12
    },
    modalBtnBoxBtnText2: {
        color: '#FFFFFF',
        fontSize: 12
    },
    modalContaninerText: {
        color: '#F6DAB5',
        fontSize: 15,
        fontWeight: 'bold'
    },
    modalHead1: {
        paddingVertical: 15,
        backgroundColor: '#00ADEF'
    },
    modalHeadLeft1: {
        color: '#FFFFFF',
        textAlign: 'center'
    },
    countryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    countryList: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 15,
        alignItems: 'center',
        width: (width * .88) / 2,
    },
    isChecked: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    isCheckedText: {
        color: '#fff'
    },
    modalBoay1: {
        height: height * .5,
        paddingVertical: 15
    },
    viewModalBox1: {
        borderRadius: 16,
        overflow: 'hidden'
    },
    countryListIcon: {
        height: 18,
        width: 28,
        marginRight: 8
    },
    counteryBtnWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    counteryBtn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: (width * .88 - 40) * .47,
        borderWidth: 1,
        borderColor: '#00ADEF',
        borderRadius: 8,
        marginTop: 15

    },
    counteryBtn1: {},
    counteryBtn2: {
        backgroundColor: '#00ADEF'
    },
    counteryBtnText: {},
    counteryBtnText1: {
        color: '#00ADEF'
    },
    counteryBtnText2: {
        color: '#FFFFFF'
    },
    errorTip: {
        fontSize: 12,
        color: '#FF0000',
        marginLeft: 20,
        marginTop: 15
    },
    IconVideoBox: {
        borderRadius: 1000,
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        top: 20,
        left: 20,
        zIndex: 100000
    },
    IconVideo: {
        width: 30,
        height: 30
    },
    IconVideoBox1: {
        left: 8,
        top: 8,
        width: 30,
        height: 30
    },
    IconVideo1: {
        width: 15,
        height: 15
    },
    newOverlyText: {
        color: '#fff',
        flexWrap: 'wrap',
        width: width - 120
    },
    newOverly: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .4)',
        zIndex: 1000,
        justifyContent: 'flex-end',
        padding: 15
    },
    ball1: {
        width: width * .8,
        height: width * .8 * 1.05,
        position: 'absolute'
    },
    ball2: {
        width: width * .8,
        height: width * .8 * 1.05,
        position: 'absolute'
    },
    SEA_GameNotStarted1: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    lotteryIconImg: {
        width: 80,
        height: 80,
        marginTop: 8,
        marginBottom: 8
    },
})