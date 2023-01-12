import React from 'react'
import { StyleSheet, Text, View, Linking, Dimensions, ScrollView, TouchableOpacity, RefreshControl, Image, TouchableHighlight, Platform, Alert, Clipboard, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { getMemberInforAction, getQueleaActiveCampaignInforAction } from './../../../actions/ReducerAction'
import { toThousands } from './../../../actions/Reg'
import moment from 'moment'
import { RecommendPageTabs, RecommendRules, ReferreeDetailStatus, recommendIcon } from './RecommendData'
import ViewShot from 'react-native-view-shot'
import QRCode from 'react-native-qrcode-svg'
import Share from 'react-native-share'
import { Actions } from 'react-native-router-flux'
import { ImgPermissionsText } from './../../Common/CommonData'
import CameraRoll from "@react-native-community/cameraroll";
import LoadingBone from './../../Common/LoadingBone'
import * as Animatable from 'react-native-animatable'

const { width, height } = Dimensions.get('window')
const ShareDesc = 'รับ 100 บาท! สมัครและฝากเงิน FUN88\nเดิมพันหวยกีฬาคาสิโน\nมารวยไปด้วยกัน'
const AnimatableView = Animatable.View
class RecommendPageContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            refreshing: false,
            FirstName: '',
            email: '',
            tabIndex: 0,
            isShowRecommendTip: false,
            isShowRecommendLink: false,
            recommedType: 'qrcode',
            isSaveQrImg: false,
            isShowCopyTip: false,
            queleaReferrerEligible: {
                isBetAmountMet: false,
                isDepositMet: false,
                isRegisteredMet: false,
                isVerificationMet: false,
            },
            queleaReferrerActivity: {
                dateRegister: '',
                emailVerified: false,
                lastDeposit: '',
                phoneVerified: false,
                totalBets: 0,
                totalDeposits: 0,
            },
            campaignSignUpPreCondition: {},
            isShowcCampaignSignUpPreCondition: false,
            queleaUrl: '',
            referreeDetail: null,
            totalEarnedBonus: 0,
            isShowMoreReferreeDetail: false,
            isFirstGoRecommendPage: true,
            AppGameDomain: ''
        }
    }

    componentDidMount(flag = false) {
        flag && this.setState({
            refreshing: true
        })
        !flag && this.getUserFirstGoRecommendPage()
        this.props.getQueleaActiveCampaignInforAction()
        let queleaActiveCampaignData = this.props.queleaActiveCampaignData
        if (queleaActiveCampaignData && queleaActiveCampaignData.campaignSignUpPreCondition) {
            this.setState({
                campaignSignUpPreCondition: queleaActiveCampaignData.campaignSignUpPreCondition,
                isShowcCampaignSignUpPreCondition: true
            })
        }

        this.getQueleaReferrerEligible()
        this.getQueleaReferrerActivity(flag)
        this.getQueleaReferreeList()
        this.getUserInfor(this.props)
        this.getVietIntroAFriendUrl()
    }

    componentWillReceiveProps(nextProps) {
        let queleaActiveCampaignData = nextProps.queleaActiveCampaignData
        if (nextProps && queleaActiveCampaignData && queleaActiveCampaignData.campaignSignUpPreCondition) {
            this.setState({
                campaignSignUpPreCondition: queleaActiveCampaignData.campaignSignUpPreCondition,
                isShowcCampaignSignUpPreCondition: true
            })
        }

        this.getUserInfor(nextProps)
    }

    componentWillUnmount() {
        this.setTimeoutHideQrTip && clearTimeout(this.setTimeoutHideQrTip)
        this.setTimeoutCopyTip && clearTimeout(this.setTimeoutCopyTip)
        this.setTimeoutSaveQrImg && clearTimeout(this.setTimeoutSaveQrImg)


        global.storage.save({
            key: 'UserFirstGoRecommendPage' + userNameDB,
            id: 'UserFirstGoRecommendPage' + userNameDB,
            data: true,
            expires: null
        })
    }

    getVietIntroAFriendUrl() {
        global.storage.load({
            key: 'AppURLs',
            id: 'AppURLs'
        }).then(res => {
            this.setState({
                AppGameDomain: res.AppGameDomain
            })
        }).catch(() => { })
        fetchRequest(ApiPort.GetAppURLs, 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    AppGameDomain: res.result.AppGameDomain
                })
                global.storage.save({
                    key: 'AppURLs',
                    id: 'AppURLs',
                    data: res.result,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getUserFirstGoRecommendPage() {
        global.storage.load({
            key: 'UserFirstGoRecommendPage' + userNameDB,
            id: 'UserFirstGoRecommendPage' + userNameDB
        }).then(res => {
            this.setState({
                isFirstGoRecommendPage: false
            })
        }).catch(() => {
            this.setState({
                isFirstGoRecommendPage: true
            })
        })
    }


    getUserInfor(props) {
        if (props.memberInforData && props.memberInforData) {
            let Contacts = props.memberInforData.Contacts
            if (Array.isArray(Contacts) && Contacts.length > 0) {
                let email = Contacts.find(v => v.ContactType.toLocaleUpperCase() === 'EMAIL')
                this.setState({
                    FirstName: props.memberInforData.FirstName,
                    email: email ? email.Contact : ''
                })
            }
        }
    }


    getQueleaReferreeList() {
        global.storage.load({
            key: 'QueleaReferreeList' + userNameDB,
            id: 'QueleaReferreeList' + userNameDB
        }).then(res => {
            // this.setState({
            //     referreeDetail: res.referreeDetail,
            //     totalEarnedBonus: res.totalEarnedBonus
            // })
        }).catch(() => {
            this.setState({
                referreeDetail: []
            })
        })
        fetchRequest(ApiPort.GetQueleaReferreeList, 'GET').then(res => {
            Toast.hide()
            let referreeDetail = res.referreeDetail
            this.setState({
                referreeDetail,
                totalEarnedBonus: res.totalEarnedBonus
            })
            global.storage.save({
                key: 'QueleaReferreeList' + userNameDB,
                id: 'QueleaReferreeList' + userNameDB,
                data: res,
                expires: null
            })
        }).catch(err => {
            this.setState({
                referreeDetail: [],
                totalEarnedBonus: 0
            })
            Toast.hide()
        })
    }


    getQueleaReferrerActivity() {
        global.storage.load({
            key: 'QueleaReferrerActivity',
            id: 'QueleaReferrerActivity'
        }).then(res => {
            this.setState({
                queleaReferrerActivity: res
            })
        }).catch(() => {
            Toast.loading('กำลังโหลดข้อมูล...', 2000)
        })
        fetchRequest(ApiPort.GetQueleaReferrerActivity, 'GET').then(res => {
            Toast.hide()
            this.setState({
                refreshing: false
            })
            if (Array.isArray(res) && res.length) {
                this.setState({
                    queleaReferrerActivity: res[0]
                })
                global.storage.save({
                    key: 'QueleaReferrerActivity',
                    id: 'QueleaReferrerActivity',
                    data: res[0],
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    postQueleaReferrerSignUp() {
        const { queleaReferrerEligible, campaignSignUpPreCondition } = this.state
        window.PiwikMenberCode('Refer_Generate')
        if (!(campaignSignUpPreCondition.isByPassSignUpCheck ? true : (queleaReferrerEligible.isBetAmountMet && queleaReferrerEligible.isDepositMet && queleaReferrerEligible.isRegisteredMet && queleaReferrerEligible.isVerificationMet))) return
        // global.storage.load({
        //     key: 'QueleaReferrerSignUp',
        //     id: 'QueleaReferrerSignUp'
        // }).then(res => {
        //     this.setState({
        //         queleaUrl: res
        //     })
        // }).catch(() => {
        //     Toast.loading('กำลังโหลดข้อมูล...', 2000)
        // })
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostQueleaReferrerSignUp, 'POST').then(res => {
            Toast.hide()
            if (res.success) {
                this.setState({
                    queleaUrl: res.queleaUrl,
                    isShowRecommendLink: true
                })
                global.storage.save({
                    key: 'QueleaReferrerSignUp',
                    id: 'QueleaReferrerSignUp',
                    data: res.queleaUrl,
                    expires: null
                })
            } else {
                res.message && Toast.fail(res.message, 1.5)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getQueleaReferrerEligible() {
        global.storage.load({
            key: 'QueleaReferrerEligible',
            id: 'QueleaReferrerEligible'
        }).then(res => {
            this.setState({
                queleaReferrerEligible: res
            })
        }).catch(() => {
            //Toast.loading('กำลังโหลดข้อมูล...', 2000)
        })

        fetchRequest(ApiPort.GetQueleaReferrerEligible, 'GET').then(res => {
            Toast.hide()
            this.setState({
                queleaReferrerEligible: res
            })
            global.storage.save({
                key: 'QueleaReferrerEligible',
                id: 'QueleaReferrerEligible',
                data: res,
                expires: null
            })
        }).catch(err => {
            Toast.hide()
        })
    }




    async copyTXT(txt) {
        Clipboard.setString(txt)
        this.setState({
            isShowCopyTip: true
        })

        this.setTimeoutCopyTip = setTimeout(() => {
            this.setState({
                isShowCopyTip: false
            })
        }, 2500)


        window.PiwikMenberCode('Copy_referral_link')
    }

    shareUrl() {
        if (!Share) {
            Toast.fail('分享失败，请重试')
            return
        }
        const shareOptions = {
            title: '分享给大家',
            url: this.state.queleaUrl,
            failOnCancel: false,
        }

        window.PiwikMenberCode('Refer_ShareQR')
        return Share.open(shareOptions)
    }

    saveImg() {
        this._viewShotRef.capture()
            .then(uri => {
                this.saveQrCode(uri)
            })
            .catch(() => {
                Toast.fail('ไม่สามารถบันทึก QR ได้', 3)
            })
        window.PiwikMenberCode('Refer_SaveQR')
    }

    saveQrCode(uri) {
        let promise = CameraRoll.save(uri);
        promise
            .then(function (result) {
                Toast.success("บันทึก QR สำเร็จ", 3);
            })
            .catch(function (error) {
                Toast.fail("ไม่สามารถบันทึก QR ได้เนื่องจากไม่มีสิทธิ์เข้าถึงอัลบั้มภาพ", 3);
            });
    }

    recommendBymail() {
        const { FirstName, queleaUrl } = this.state
        window.PiwikMenberCode('Refer_Sharenow_email')
        const shareSubject = 'โบนัสแนะนำเพื่อนจาก Fun88'
        const shareFrom = 'จาก: คุณ '
        const email = 'mailto:?subject=' + encodeURIComponent(shareSubject) + '&body=' + encodeURIComponent(shareFrom + '\n' + ShareDesc + '\n' + queleaUrl)
        Linking.canOpenURL(email).then(flag => {
            Linking.openURL(email)
        }).catch(err => {
            Alert.alert('แจ้งเตือน', 'Thiết bị của bạn không hỗ trợ chức năng này, vui lòng sử dụng ứng dụng email khác', [
                { text: 'โอนย้าย' }
            ])
        })
    }


    recommendByLine() {
        const { FirstName, queleaUrl, AppGameDomain } = this.state
        const shareSubject = 'โบนัสแนะนำเพื่อนจาก Fun88'
        const shareFrom = 'จาก: คุณ '
        var lineUrl = "https://line.me/R/msg/text/?" +
            encodeURIComponent(shareFrom + "\n" + ShareDesc + "\n" + queleaUrl);
        console.log(lineUrl)
        Linking.openURL(lineUrl)
    }

    shareWithFbPost() {
        const { queleaUrl } = this.state
        const fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(queleaUrl) + '&quote=' + encodeURIComponent(ShareDesc)
        Linking.openURL(fbUrl)

        window.PiwikMenberCode('Refer_PostFacebook')
    }

    shareWithFbMsg() {
        const { queleaUrl, AppGameDomain } = this.state
        const fbAppId = '253249822594140'
        const fbUrl = 'http://www.facebook.com/dialog/send?app_id=' + fbAppId + '&link=' + encodeURIComponent(queleaUrl) + '&redirect_uri=' + AppGameDomain
        Linking.openURL(fbUrl)

        window.PiwikMenberCode('Refer_ShareFriendMessenger')
    }

    handleViewRef1 = ref => this.view1 = ref

    render() {
        const { isShowMoreReferreeDetail, refreshing, email, FirstName, referreeDetail, totalEarnedBonus, queleaUrl, queleaReferrerActivity, isShowcCampaignSignUpPreCondition, campaignSignUpPreCondition, queleaReferrerEligible, recommedType, tabIndex, isShowRecommendTip, isShowRecommendLink, isSaveQrImg, isShowCopyTip } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#FFF' : '#212121' }]}>
            <View style={{ flexDirection: 'row' }}>
                {
                    RecommendPageTabs.map((tab, i) => {
                        let flag = tabIndex === i
                        return <TouchableOpacity
                            key={i}
                            onPress={() => {
                                this.setState({
                                    tabIndex: i
                                })
                                window.PiwikMenberCode(tab.piwikMenberText)
                            }}
                            style={[
                                styles.recommendPageTab,
                                {
                                    borderBottomColor: window.isBlue ? (flag ? '#00AEEF' : 'transparent') : (flag ? '#25AAE1' : 'transparent'),
                                    width: width / RecommendPageTabs.length
                                }
                            ]}>
                            <Text style={[{ color: window.isBlue ? (flag ? '#25AAE1' : '#999999') : (flag ? '#25AAE1' : '#fff') }, styles.recommendPageTabText]}>{tab.title}</Text>
                        </TouchableOpacity>
                    })}

            </View>

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor={'#25AAE1'}
                        onRefresh={() => {
                            this.componentDidMount(true)
                        }}
                    />
                }
            >

                {
                    tabIndex == 0 && <View>
                        {
                            isShowRecommendTip && <TouchableHighlight onPress={() => {
                                this.setState({
                                    isShowRecommendTip: false
                                })

                                window.PiwikMenberCode('Referfriend_tooltipclose')
                            }} style={styles.modalContainer1}>
                                <Text style={styles.modalContainer1Text}>12331</Text>
                            </TouchableHighlight>
                        }

                        <View style={[styles.viewBlock, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}></View>
                        <View style={{ marginHorizontal: 10 }}>
                            <View style={styles.recommendTimeHead}>
                                <Text style={[styles.recommendComTitle, { marginTop: 0, color: window.isBlue ? '#000' : '#fff' }]}>ขั้นตอน</Text>
                                <View style={styles.recommendTimeImgBox}>
                                    <Image
                                        resizeMode='stretch'
                                        source={window.isBlue ? require('./../../../images/common/timeIcon/blackTime.png') : require('./../../../images/common/timeIcon/whiteTime.png')}
                                        style={styles.recommendTimeImg}
                                    ></Image>
                                    <Text style={[styles.recommendTime, { color: window.isBlue ? '#464646' : '#fff' }]}>อัพเดทล่าสุด: {moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                </View>
                            </View>

                            {
                                isShowcCampaignSignUpPreCondition && <View>
                                    <View style={[styles.recommendStatusList]}>
                                        <View style={styles.recommendStatusListLeft}>
                                            <View style={[styles.recommendStatusListLeftCircle, { backgroundColor: window.isBlue ? (queleaReferrerEligible.isDepositMet ? '#1fdb03' : '#d5d5d5') : (queleaReferrerEligible.isDepositMet ? '#1fdb03' : '#5a5a5a') }]}>
                                                <Text style={[styles.recommendStatusListLeftCircleText, { color: window.isBlue ? '#fff' : '#000' }]}>✓</Text>
                                            </View>

                                            <View style={[styles.recommendStatusListLeftLine, { backgroundColor: queleaReferrerEligible.isDepositMet ? '#1fdb03' : '#e0e0e0' }]}></View>

                                            <View>
                                                <Text style={[styles.recommendStatusListLeftText1, { color: window.isBlue ? '#161616' : '#fff' }]}>ยอดฝาก {toThousands(campaignSignUpPreCondition.totalDepositRequired)} บาท</Text>
                                                {
                                                    !queleaReferrerEligible.isDepositMet && <Text style={[styles.recommendStatusListLeftText2, { color: window.isBlue ? '#161616' : 'rgba(255, 255, 255, .8)' }]}>({toThousands(queleaReferrerActivity.totalDeposits)} / {toThousands(campaignSignUpPreCondition.totalDepositRequired)})</Text>
                                                }
                                            </View>
                                        </View>

                                        {
                                            !queleaReferrerEligible.isDepositMet && <TouchableOpacity style={styles.recommendStatusListRight} onPress={() => {
                                                if (FirstName) {
                                                    Actions.DepositStack()
                                                } else {
                                                    Actions.Verification({
                                                        fillType: 'name',
                                                        fromPage: 'RecommendPage',
                                                        ServiceAction: 'Quelea'
                                                    })
                                                }

                                                window.PiwikMenberCode('Myprogress_depositnow')
                                            }}>
                                                <Text style={styles.recommendStatusListRightText1}>ฝากเงิน</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>

                                    <View style={[styles.recommendStatusList]}>
                                        <View style={styles.recommendStatusListLeft}>
                                            <View style={[styles.recommendStatusListLeftCircle, { backgroundColor: window.isBlue ? (queleaReferrerEligible.isBetAmountMet ? '#1fdb03' : '#d5d5d5') : (queleaReferrerEligible.isBetAmountMet ? '#1fdb03' : '#5a5a5a') }]}>
                                                <Text style={[styles.recommendStatusListLeftCircleText, { color: window.isBlue ? '#fff' : '#000' }]}>✓</Text>
                                            </View>

                                            <View style={[styles.recommendStatusListLeftLine, { backgroundColor: queleaReferrerEligible.isBetAmountMet ? '#1fdb03' : '#e0e0e0' }]}></View>

                                            <View>
                                                <Text style={[styles.recommendStatusListLeftText1, { color: window.isBlue ? '#161616' : '#fff' }]}>ยอดหมุนเวียน {toThousands(campaignSignUpPreCondition.totalBetAmountRequired)} บาท</Text>
                                                {
                                                    !queleaReferrerEligible.isBetAmountMet && <Text style={[styles.recommendStatusListLeftText2, { color: window.isBlue ? '#161616' : 'rgba(255, 255, 255, .8)' }]}>({toThousands(queleaReferrerActivity.totalBets)} / {toThousands(campaignSignUpPreCondition.totalBetAmountRequired)})</Text>
                                                }
                                            </View>
                                        </View>

                                        {
                                            !queleaReferrerEligible.isBetAmountMet && <TouchableOpacity style={[styles.recommendStatusListRight1]}>
                                                <Text style={[styles.recommendStatusListRightText2, { color: window.isBlue ? '#000' : '#fff' }]}>ร่วมสนุกเพิ่ม เพื่อทำยอดให้ครบ</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>

                                    <View style={[styles.recommendStatusList, { marginBottom: 15, height: 'auto' }]}>
                                        <View style={styles.recommendStatusListLeft}>
                                            <View style={[styles.recommendStatusListLeftCircle, { backgroundColor: window.isBlue ? (queleaReferrerEligible.isVerificationMet ? '#1fdb03' : '#d5d5d5') : (queleaReferrerEligible.isVerificationMet ? '#1fdb03' : '#5a5a5a') }]}>
                                                <Text style={[styles.recommendStatusListLeftCircleText, { color: window.isBlue ? '#fff' : '#000' }]}>✓</Text>
                                            </View>

                                            <View>
                                                <Text style={[styles.recommendStatusListLeftText1, { color: window.isBlue ? '#161616' : '#fff' }]}>ยืนยันชื่อจริง & เบอร์โทร</Text>

                                                {
                                                    !queleaReferrerActivity.emailVerified && <Text style={[styles.recommendStatusListLeftText2, { color: window.isBlue ? '#161616' : 'rgba(255, 255, 255, .8)' }]}>(ยังไม่ได้ยืนยันอีเมล)</Text>
                                                }

                                                {
                                                    !queleaReferrerActivity.phoneVerified && <Text style={[styles.recommendStatusListLeftText2, { color: window.isBlue ? '#161616' : 'rgba(255, 255, 255, .8)' }]}>(ยังไม่ได้ยืนยันเบอร์โทรศัพท์)</Text>
                                                }
                                            </View>
                                        </View>

                                        {
                                            !(queleaReferrerActivity.emailVerified && queleaReferrerActivity.phoneVerified) && <TouchableOpacity
                                                style={styles.recommendStatusListRight}
                                                onPress={() => {
                                                    Actions.Verification({
                                                        fillType: FirstName ? (!queleaReferrerActivity.emailVerified ? 'email' : 'phone') : 'name',
                                                        fromPage: 'RecommendPage',
                                                        getQueleaReferrerEligible: () => {
                                                            this.getQueleaReferrerEligible()
                                                        },
                                                        ServiceAction: 'Quelea'
                                                    })

                                                    window.PiwikMenberCode('Myprogress_verifynow')
                                                }}>
                                                <Text style={styles.recommendStatusListRightText1}>ยืนยัน</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={[styles.viewBlock, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}></View>

                        <Modal animationType='fade' visible={isShowRecommendTip} transparent={true}>
                            <View style={styles.modalContainer}>
                                <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F' }]}>
                                    <View style={styles.modalBody}>
                                        <Text style={[styles.modalBodyText, { color: window.isBlue ? '#000' : '#fff' }]}>ข้อมูลโบนัสจะแสดงผลภายใน 90 วัน</Text>
                                        <TouchableOpacity style={styles.modalBtnbox} onPress={() => {
                                            this.setState({
                                                isShowRecommendTip: false
                                            })
                                            // Actions.promotionLogin()
                                        }}>
                                            <Text style={styles.modalBtnboxText}>ตกลง</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>


                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff' }]}>เพื่อนที่แนะนำ</Text>
                            <View style={styles.recommendTipBox}>
                                <Text style={[styles.recommendTipBoxText1, { color: window.isBlue ? '#161616' : '#fff' }]}>โบนัสที่ได้รับ : <Text style={styles.recommendTipBoxText2}>{totalEarnedBonus} บาท</Text></Text>
                                <TouchableOpacity
                                    style={[styles.recommendTipBoxCircle, { backgroundColor: window.isBlue ? '#b2b2b2' : '#25AAE1' }]}
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                    onPress={() => {
                                        this.setState({
                                            isShowRecommendTip: true
                                        })

                                        window.PiwikMenberCode('Referfriend_tooltip')
                                    }}
                                >
                                    <Text style={[styles.recommendTipBoxCircleText, { color: window.isBlue ? '#fff' : '#000' }]}>?</Text>
                                </TouchableOpacity>

                                {
                                    // isShowRecommendTip && <AnimatableView
                                    //     animation={'bounceIn'}
                                    //     easing='ease-out'
                                    //     iterationCount='1'
                                    //     style={styles.recommendTipModal}>
                                    //     <Text style={styles.recommendTipModalText}>Khuyến mãi hiển thị dựa theo tháng hiện tại</Text>
                                    //     <View style={styles.recommendTipModalBtnBox}>
                                    //         <TouchableOpacity style={styles.recommendTipModalBtn} onPress={() => {
                                    //             this.setState({
                                    //                 isShowRecommendTip: false
                                    //             })

                                    //             window.PiwikMenberCode('Referfriend_tooltipclose')
                                    //         }}>
                                    //             <Text style={styles.recommendTipModalBtnText}>ตกลง</Text>
                                    //         </TouchableOpacity>
                                    //     </View>
                                    //     <View style={styles.recommendTipModalArrow}></View>
                                    // </AnimatableView>
                                }
                            </View>

                            <View style={{ paddingBottom: 40 }}>
                                {
                                    <View>
                                        {
                                            Array.isArray(referreeDetail)
                                                ?
                                                (
                                                    referreeDetail.length > 0
                                                        ?
                                                        <View>
                                                            <View>
                                                                {
                                                                    (isShowMoreReferreeDetail ? referreeDetail : referreeDetail.slice(0, 3)).map((v, i) => {
                                                                        let temp = ReferreeDetailStatus[`status${v.referreeTierDetail[0].referrerPayoutStatus}`]
                                                                        return <View key={i} style={[styles.recommendRecordsList, { borderColor: window.isBlue ? '#C3C3C3' : '#25AAE1', backgroundColor: window.isBlue ? 'transparent' : '#161616', }]}>
                                                                            <View style={styles.recommendRecordsListLeft}>
                                                                                <View style={styles.recommendRecordsListLeftBoxImg}>
                                                                                    <Image
                                                                                        resizeMode='stretch'
                                                                                        style={styles.recommendRecordsListLeftImg}
                                                                                        source={require('./../../../images/account/recommend/recommendList.png')}
                                                                                    ></Image>
                                                                                </View>
                                                                            </View>

                                                                            <View style={styles.recommendRecordsListRight}>
                                                                                <View style={styles.recommendRecordsListRightList}>
                                                                                    <Text style={[styles.recommendRecordsListRightListText1, { color: window.isBlue ? '#000' : '#fff' }]}>วันที่สมัคร</Text>
                                                                                    <Text style={[styles.recommendRecordsListRightListText2, { color: window.isBlue ? '#000' : '#fff' }]}>{moment(v.dateRegister).format('DD-MM-YYYY')}</Text>
                                                                                </View>
                                                                                <View style={styles.recommendRecordsListRightList}>
                                                                                    <Text style={[styles.recommendRecordsListRightListText1, { color: window.isBlue ? '#000' : '#fff' }]}>สถานะ</Text>
                                                                                    <Text style={[styles.recommendRecordsListRightListText2, { color: temp ? temp.color : '#000' }]}>{temp ? temp.text : ''}</Text>
                                                                                </View>
                                                                                <View style={styles.recommendRecordsListRightList}>
                                                                                    <Text style={[styles.recommendRecordsListRightListText1, { color: window.isBlue ? '#000' : '#fff' }]}>โบนัส</Text>
                                                                                    <Text style={[styles.recommendRecordsListRightListText2, { color: window.isBlue ? '#000' : '#fff' }]}>{toThousands(v.referreeTierDetail[0].referrerPayoutAmount)}</Text>
                                                                                </View>
                                                                                <View style={styles.recommendRecordsListRightList}>
                                                                                    <Text style={[styles.recommendRecordsListRightListText1, { color: window.isBlue ? '#000' : '#fff' }]}>หมายเลขธุรกรรม</Text>
                                                                                    <Text style={[styles.recommendRecordsListRightListText2, { color: window.isBlue ? '#000' : '#fff' }]}>{v.referreeTierDetail[0].referrerTransactionID ? v.referreeTierDetail[0].referrerTransactionID : '-'}</Text>
                                                                                </View>
                                                                            </View>

                                                                            <LinearGradient
                                                                                colors={['#70D5FF', '#0087E2']}
                                                                                start={{ y: 0, x: 0 }}
                                                                                end={{ y: 1, x: 0 }} style={styles.recommendRecordsListIcon}>
                                                                                <Text style={styles.recommendRecordsListIconText}>{i + 1}</Text>
                                                                            </LinearGradient>
                                                                        </View>
                                                                    })
                                                                }
                                                            </View>

                                                            {
                                                                referreeDetail.length > 3 && <TouchableOpacity style={styles.recommendRecordBtn} onPress={() => {
                                                                    this.setState({
                                                                        isShowMoreReferreeDetail: !isShowMoreReferreeDetail
                                                                    })

                                                                    window.PiwikMenberCode(!isShowMoreReferreeDetail ? 'Myreferred_viewmore' : 'Myreferred_viewless')
                                                                }}>
                                                                    <Text style={styles.recommendRecordBtnText}>{!isShowMoreReferreeDetail ? 'ดูเพิ่มเติม' : 'Thu Gọn'}</Text>
                                                                </TouchableOpacity>
                                                            }
                                                        </View>
                                                        :
                                                        <View style={[styles.recommendRecordBtnBox, { backgroundColor: window.isBlue ? 'transparent' : '#161616', borderColor: window.isBlue ? '#C3C3C3' : '#25AAE1', }]}>
                                                            <Image
                                                                resizeMode='stretch'
                                                                style={styles.norecommengRecords}
                                                                source={require('./../../../images/account/recommend/norecommengRecords.png')}
                                                            ></Image>
                                                            <Text style={[styles.recommendRecordBtnBoxText1, { color: window.isBlue ? '#000' : '#fff' }]}>ไม่พบข้อมูล</Text>
                                                        </View>
                                                )
                                                :
                                                Array.from({ length: 2 }, v => v).map((v, i) => {
                                                    return <View
                                                        key={i}
                                                        style={[styles.recommendRecordsList, { backgroundColor: '#e0e0e0', borderColor: 'transparent', height: 120 }]}
                                                    >
                                                        <LoadingBone></LoadingBone>
                                                    </View>
                                                })
                                        }
                                    </View>
                                }

                            </View>
                        </View>
                    </View>
                }


                {
                    tabIndex == 1 && <View style={{ marginHorizontal: 10 }}>
                        <View style={[styles.viewBlock, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}></View>
                        <View>
                            <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff', marginBottom: 5 }]}>ขั้นตอน</Text>
                            <Text style={[styles.recommendLinkInforText, { color: window.isBlue ? '#161616' : '#fff', marginBottom: 10 }]}>โบนัสนี้สามารถใช้ร่วมกับโปรโมชั่นอื่นได้</Text>

                            {
                                !isShowRecommendLink && isShowcCampaignSignUpPreCondition && <TouchableOpacity
                                    style={[styles.recommendRecordBtn, {
                                        marginTop: 0,
                                        backgroundColor: ((campaignSignUpPreCondition.isByPassSignUpCheck ? true : (queleaReferrerEligible.isBetAmountMet && queleaReferrerEligible.isDepositMet && queleaReferrerEligible.isRegisteredMet && queleaReferrerEligible.isVerificationMet)) ? '#25AAE1' : '#B7B7B7')
                                    }]}
                                    onPress={this.postQueleaReferrerSignUp.bind(this)}>
                                    <Text style={styles.recommendRecordBtnText}>รับลิงก์หรือแชร์ให้เพื่อนสมัคร</Text>
                                </TouchableOpacity>
                            }

                            {
                                isShowRecommendLink && queleaUrl.length > 0 && <View style={styles.recommendLinkContainer}>
                                    <View style={styles.recommendLinkWrap}>
                                        <ScrollView
                                            horizontal={true}
                                            automaticallyAdjustContentInsets={false}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            style={{ marginRight: 15 }}
                                        >
                                            {
                                                <Text style={styles.recommendLinkText}>{queleaUrl}</Text>
                                            }
                                        </ScrollView>

                                        <TouchableOpacity style={styles.recommendLinkBox} onPress={this.copyTXT.bind(this, queleaUrl)}>
                                            <Image
                                                resizeMode='stretch'
                                                style={styles.recommendLinkBoxImg}
                                                source={require('./../../../images/account/recommend/recommendLinkBoxImg.png')}
                                            ></Image>
                                        </TouchableOpacity>

                                        {
                                            isShowCopyTip && <AnimatableView
                                                animation={'bounceIn'}
                                                easing='ease-out'
                                                iterationCount='1'
                                                style={[styles.saveImgTipBox, styles.saveImgTipBox1]}>
                                                <Text style={styles.saveImgTipBoxText}>บันทึกสำเร็จ</Text>
                                                <View style={[styles.saveImgTipArrow, styles.saveImgTipArrow1]}></View>
                                            </AnimatableView>
                                        }
                                    </View>
                                </View>
                            }

                            <Image
                                resizeMode='stretch'
                                source={require('./../../../images/account/recommend/recommendLinkBanner.png')}
                                style={styles.recommendLinkBanner}
                            ></Image>

                            {
                                isShowRecommendLink && queleaUrl.length > 0 && <AnimatableView
                                    animation={'zoomInDown'}
                                    easing='ease-out'
                                    iterationCount='1'
                                    style={styles.recommendWayBox}>
                                    <View style={styles.recommendWayHeadBox}>
                                        {
                                            recommendIcon.map((v, i) => {
                                                let flag = recommedType === v.type
                                                return <TouchableOpacity
                                                    key={i}
                                                    style={[styles.recommendWayHeadIconBox,
                                                    {
                                                        backgroundColor: flag ? '#0763EE' : '#00A6FF',
                                                        // borderTopRightRadius: flag ? 15 : 0,
                                                        // borderBottomLeftRadius: flag ? 15 : 0,
                                                    }]}
                                                    onPress={() => {
                                                        if (recommedType == v.type) return
                                                        this.setState({
                                                            recommedType: v.type
                                                        })

                                                        let tempIndex = recommendIcon.findIndex(v => v.type === recommedType)
                                                        let tempFlag = tempIndex > i
                                                        this.view1 && this.view1[`fadeIn${tempFlag ? 'Right' : 'Left'}`](400)

                                                        window.PiwikMenberCode(v.piwikMenberText)
                                                    }}
                                                >
                                                    <Image
                                                        resizeMode='stretch'
                                                        style={styles.recommendWayHeadIcon}
                                                        source={v.img}
                                                    ></Image>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </View>
                                    <AnimatableView ref={this.handleViewRef1} style={styles.recommendWayDetailBox}>
                                        <Text style={[styles.recommendWayDetailBoxText, { color: window.isBlue ? '#161616' : '#000' }]}>{recommendIcon.find(v => recommedType === v.type).text} {recommedType === 'email' ? FirstName : ''}</Text>

                                        {
                                            recommedType === 'qrcode' && <View>
                                                {
                                                    <View style={[styles.qrcodeWrap]}>
                                                        <ViewShot
                                                            style={[styles.qrcodeBox]}
                                                            ref={(c) => { this._viewShotRef = c }}
                                                            options={{ format: 'jpg', quality: 0.9 }}>
                                                            <QRCode
                                                                value={queleaUrl}
                                                                size={(width - 40) * .35}
                                                                bgColor='#000'
                                                                fgColor='white'
                                                            ></QRCode>
                                                        </ViewShot>
                                                    </View>
                                                }

                                                <View style={styles.linkShareBox}>
                                                    <TouchableOpacity onPress={this.saveImg.bind(this)} style={[styles.linkShareBox1, styles.linkShareBox3]}>
                                                        <Text style={styles.linkShareBoxText}>บันทึก QR CODE</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={this.shareUrl.bind(this)} style={[styles.linkShareBox2, styles.linkShareBox3]}>
                                                        <Text style={styles.linkShareBoxText}>แชร์ QR</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        }

                                        {
                                            recommedType === 'email' && <View style={styles.recommendMailContainer}>
                                                <View style={styles.recommendMailBox}>
                                                    <Text style={[styles.recommendMailBoxText]}>{ShareDesc}</Text>
                                                </View>

                                                <Text style={styles.recommendMailText}>ลิงก์แนะนำรวมอยู่ในข้อความแล้ว</Text>

                                                <TouchableOpacity onPress={this.recommendBymail.bind(this)} style={[styles.linkShareBox1, styles.linkShareBox3, { width: width - 40 }]}>
                                                    <Text style={styles.linkShareBoxText}>แชร์ให้เพื่อนเลย</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }

                                        {
                                            recommedType === 'line' && <View style={styles.recommendMailContainer}>
                                                <View style={styles.recommendMailBox}>
                                                    <Text style={[styles.recommendMailBoxText]}>{ShareDesc}</Text>
                                                </View>

                                                <Text style={styles.recommendMailText}>ลิงก์แนะนำรวมอยู่ในข้อความแล้ว</Text>

                                                <TouchableOpacity onPress={this.recommendByLine.bind(this)} style={[styles.linkShareBox1, styles.linkShareBox3, { width: width - 40 }]}>
                                                    <Text style={styles.linkShareBoxText}>แชร์ให้เพื่อนเลย</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }

                                        {
                                            recommedType === 'facebook' && <View style={styles.recommendMailContainer}>
                                                <View style={styles.recommendFaceBox}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        style={styles.recommendFace}
                                                        source={require('./../../../images/account/recommend/recommendFace.png')}
                                                    ></Image>
                                                    <Text style={styles.recommendFaceBoxText}>{ShareDesc}</Text>
                                                </View>

                                                <TouchableOpacity onPress={this.shareWithFbPost.bind(this)} style={[styles.linkShareBox1, styles.linkShareBox3, { width: width - 40, marginTop: 10, marginBottom: 10 }]}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        style={styles.recommendFaceIcon}
                                                        source={require('./../../../images/account/recommend/recommendFaceIcon1.png')}
                                                    ></Image>
                                                    <Text style={styles.linkShareBoxText}>โพสต์ไปยังเฟสบุ๊คของคุณ</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity onPress={this.shareWithFbMsg.bind(this)} style={[styles.linkShareBox2, styles.linkShareBox3, { width: width - 40 }]}>
                                                    <Image
                                                        resizeMode='stretch'
                                                        style={styles.recommendFaceIcon}
                                                        source={require('./../../../images/account/recommend/recommendFaceIcon2.png')}
                                                    ></Image>
                                                    <Text style={styles.linkShareBoxText}>แชร์ไปยังข้อความทางเฟสบุ๊คเพื่อน</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </AnimatableView>

                                    {
                                        recommedType === 'qrcode' && isSaveQrImg && <AnimatableView
                                            animation={'zoomInDown'}
                                            easing='ease-out'
                                            iterationCount='1'
                                            style={styles.qrcodeOverly}>
                                            <View style={[styles.saveImgTipBox, styles.saveImgTipBox2]}>
                                                <Text style={styles.saveImgTipBoxText}>Đã lưu thành công</Text>
                                                <View style={[styles.saveImgTipArrow, styles.saveImgTipArrow2]}></View>
                                            </View>
                                        </AnimatableView>
                                    }
                                </AnimatableView>
                            }
                        </View>
                        <View style={[styles.viewBlock, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}></View>
                        <View style={{ paddingBottom: 40 }}>
                            <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff' }]}>วิธีเข้าร่วม</Text>
                            <View>
                                {
                                    RecommendRules.map((v, i) => {
                                        return v == 'img'
                                            ?
                                            <View style={styles.recommendFaceIcon1Box}>
                                                <Image
                                                    resizeMode='stretch'
                                                    style={styles.recommendFaceIcon1}
                                                    source={require('./../../../images/account/recommend/recommendFaceIcon9.png')}
                                                ></Image></View>
                                            :
                                            <View key={i} style={styles.recommendRulesBox}>
                                                <Text style={[styles.recommendRulesText, styles.recommendRulesText1, { color: window.isBlue ? '#161616' : '#fff' }]}>{v}</Text>
                                            </View>
                                    })
                                }
                            </View>
                        </View>
                    </View>
                }
            </ScrollView>
        </View>
    }
}

export default RecommendPage = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            queleaActiveCampaignData: state.queleaActiveCampaignData
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            getQueleaActiveCampaignInforAction: () => dispatch(getQueleaActiveCampaignInforAction()),
        }
    }
)(RecommendPageContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    scrollViewContainer: {
        paddingHorizontal: 10
    },
    viewBlock: {
        width,
        height: 10,
    },
    recommendTimeHead: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    recommendTime: {
        fontSize: 11,
    },
    recommendPageTab: {
        justifyContent: 'center',
        height: 46,
        borderBottomWidth: 2,
        alignItems: 'center'
    },
    tabContainerView: {
        width: width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 46,
    },
    recommendPageTabText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    recommendRulesBox: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    recommendRulesText: {},
    recommendComTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 45,
        marginTop: 10
    },
    recommendTimeImgBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    recommendTimeImg: {
        width: 16,
        height: 16,
        marginRight: 4
    },
    recommendRulesText1: {
        width: width - 35,
        flexWrap: 'wrap'
    },
    recommendStatusList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 65
    },
    recommendStatusListLeft: {
        flexDirection: 'row'
    },
    recommendStatusListLeftLine: {
        position: 'absolute',
        left: 10,
        width: 1,
        top: 0,
        bottom: 0,
        zIndex: 10,
        // height: 65
    },
    recommendStatusListLeftCircle: {
        width: 20,
        height: 20,
        borderRadius: 100000,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        position: 'relative',
        zIndex: 100000
    },
    recommendStatusListLeftCircleText: {
        color: '#fff'
    },
    recommendStatusListLeftText1: {
        width: (width - 20) * .59,
    },
    recommendStatusListLeftText2: {
        opacity: .7,
        marginTop: 2
    },
    recommendStatusListRight: {
        backgroundColor: '#33C85D',
        borderRadius: 4,
        width: (width - 20) * .3,
        alignItems: 'center',
        paddingVertical: 5,
        height: 30,
        justifyContent: 'center'
    },
    recommendStatusListRight1: {
        width: (width - 20) * .3,
        alignItems: 'center',
        textAlign: 'center'
    },
    recommendStatusListRightText1: {
        color: '#fff',
        fontSize: 13
    },
    recommendStatusListRightText2: {
        textAlign: 'center',
        flexWrap: 'wrap',
        fontSize: 13
    },
    recommendTipBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    recommendTipBoxText1: {

    },
    recommendTipBoxText2: {
        color: '#25AAE1',
        fontWeight: 'bold'
    },
    recommendTipBoxCircle: {
        width: 18,
        height: 18,
        borderRadius: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4
    },
    recommendTipBoxCircleText: {

    },
    recommendTipModal: {
        position: 'absolute',
        zIndex: 1000000000,
        backgroundColor: '#FFF4D0',
        borderWidth: 1,
        borderColor: '#EDE473',
        padding: 8,
        top: -85,
        left: (width - 20) * .05
    },
    recommendTipModalText: {
        color: '#676767'
    },
    recommendTipModalBtnBox: {
        alignItems: 'flex-end',
        marginTop: 6
    },
    recommendTipModalBtn: {
        backgroundColor: '#FFD756',
        borderRadius: 2,
        paddingHorizontal: 15,
        paddingVertical: 5,
        zIndex: 100000
    },
    recommendTipModalArrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 10,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFF4D0',
        bottom: -20,
        zIndex: 1000,
        right: (width - 20) * .3
    },
    recommendRecordBtnBox: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'center',
        marginBottom: 15,
        alignItems: 'center',
    },
    norecommengRecords: {
        width: 107 * .45,
        height: 88 * .45,
        marginBottom: 5
    },
    recommendRecordBtnBoxText1: {
        textAlign: 'center'
    },
    recommendRecordBtn: {
        backgroundColor: '#25AAE1',
        height: 40,
        borderRadius: 4,
        marginTop: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommendRecordBtnText: {
        color: '#F6F4F4',
        fontWeight: 'bold',
        fontSize: 15
    },
    recommendRecordsList: {
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        overflow: 'hidden'
    },
    recommendRecordsListIcon: {
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 18,
        height: 18
    },
    recommendRecordsListIconText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendRecordsListLeft: {
        borderRadius: 1000,
        width: 80,
        height: 80,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        overflow: 'hidden'
    },
    recommendRecordsListLeftBoxImg: {
        overflow: 'hidden',
        width: 65,
        height: 65,
        borderRadius: 1000,
    },
    recommendRecordsListLeftImg: {
        width: 65,
        height: 65
    },
    recommendRecordsListRight: {

    },
    recommendRecordsListRightList: {
        flexDirection: 'row'
    },
    recommendRecordsListRightListText1: {
        width: 105,
        fontSize: 13,
        marginVertical: 1
    },
    recommendRecordsListRightListText2: {
        fontWeight: 'bold',
        fontSize: 13,
        marginVertical: 1
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
        zIndex: 99,
        marginHorizontal: -10,
        marginVertical: -10
    },
    modalContainer1Text: {
        color: 'transparent',
        fontSize: 0
    },
    recommendLinkContainer: {},
    recommendLinkInforText: {

    },
    recommendLinkWrap: {
        backgroundColor: '#E9E9E9',
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 45,
        marginTop: 15,
        paddingLeft: 15
    },
    recommendLinkBox: {
        width: 60,
        height: 45,
        backgroundColor: '#25AAE1',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },
    recommendLinkBoxImg: {
        width: 20,
        height: 25
    },
    recommendLinkText: {
        color: '#3A3A3A',
    },
    recommendLinkBanner: {
        width: width - 20,
        height: .404 * (width - 20),
        marginVertical: 10
    },
    recommendWayBox: {
        backgroundColor: '#EBE8E8',
        borderRadius: 4,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 15,
        overflow: 'hidden',
        position: 'relative'
    },
    recommendWayHeadBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#00A6FF'
    },
    recommendWayHeadIconBox: {
        width: (width - 20) / 4,
        alignItems: 'center',
        justifyContent: 'center',
        height: 42
    },
    recommendWayHeadIcon: {
        width: 28,
        height: 28
    },
    recommendWayDetailBox: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10
    },
    recommendWayDetailBoxText: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 5
    },
    qrcodeWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    qrcodeBox: {
        backgroundColor: '#fff',
        padding: 10,
        overflow: 'hidden',
    },
    linkShareBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 15,
        width: width - 40
    },
    linkShareBox1: {
        backgroundColor: '#25AAE1'
    },
    linkShareBox2: {
        backgroundColor: '#33C85D'
    },
    linkShareBox3: {
        width: (width - 40) / 2.1,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        flexDirection: 'row'
    },
    linkShareBoxText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    saveImgTipBox: {
        position: 'absolute',
        backgroundColor: '#25AAE1',
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 4,
        zIndex: 100
    },
    saveImgTipBox1: {
        paddingHorizontal: 10,
        top: -45,
        right: 0
    },
    saveImgTipBox2: {
        width: (width - 40) / 2.1,
        left: 10,
        bottom: 65
    },
    saveImgTipBoxText: {
        color: '#fff'
    },
    saveImgTipArrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 10,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#25AAE1',
        zIndex: 1000,
        bottom: -18,
    },
    saveImgTipArrow1: {
        right: 18
    },
    saveImgTipArrow2: {
        left: (width - 40) * .2,
    },
    qrcodeOverly: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        zIndex: 10
    },
    recommendMailContainer: {
        alignItems: 'center'
    },
    recommendMailBox: {
        backgroundColor: '#fff',
        padding: 10,
        paddingBottom: 25,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: '#d6d6d6',
        elevation: 4,
    },
    recommendMailBoxText: {
        fontSize: 16,
        color: '#161616'
    },
    recommendMailText: {
        color: '#16161680',
        marginBottom: 20,
        marginTop: 5,
    },
    recommendFaceBox: {
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 15,
        width: width - 70,
        backgroundColor: '#fff',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: '#d6d6d6',
        elevation: 4,
    },
    recommendFace: {
        width: (width - 90) * .25,
        height: (width - 90) * .25,
    },
    recommendFaceBoxText: {
        width: (width - 90) * .75,
        flexWrap: 'wrap',
        paddingLeft: 10
    },
    recommendFaceIcon: {
        width: 20,
        height: 20,
        marginRight: 8
    },
    recommendFaceIcon1: {
        width: (width - 20) * .8,
        height: (width - 20) * .8 * 1.234
    },
    recommendFaceIcon1Box: {
        alignItems: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#fff',
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
        color: '#fff'
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    modalBodyText: {
        textAlign: 'center'
    },
    modalBtnbox: {
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * .6,
        backgroundColor: '#25AAE1',
        borderRadius: 4,
        marginTop: 15
    },
    modalBtnboxText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
})