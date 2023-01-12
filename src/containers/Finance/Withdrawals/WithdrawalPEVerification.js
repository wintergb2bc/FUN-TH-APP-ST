import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ImageBackground, Modal, BackHandler, Platform } from 'react-native'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction } from '../../../actions/ReducerAction'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { maskPhone, maskEmail } from '../../../actions/Reg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeviceInfo from 'react-native-device-info'
import { IphoneXMax } from './../../Common/CommonData'

const getModel = DeviceInfo.getModel()
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'
const { width, height } = Dimensions.get('window')
class WithdrawalPEVerificationContainer extends React.Component {
    constructor(props) {
        super(props)
        let loginOtpPage = this.props.loginOtpPage
        let phoneEmailCodeLength = 6
        this.state = {
            fillType: 'email',
            loginOtpPage,
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
            phoneEmailCodeLength,
            verificationStatus: 0,
            phoneEmailStep: false,
            isShowPhoneBtn: false,
            phoneEmailCode0: '',
            phoneEmailCode1: '',
            phoneEmailCode2: '',
            phoneEmailCode3: '',
            phoneEmailCode4: '',
            phoneEmailCode5: '',
            memberInfor: {},
            phone: '',
            email: '',
            memberCode: '',
            countdownNum: 300,
            countdownNumMMSS: '',
            isShowCountdownNumMMSS: false,
            message: '',
            verificationTimes: '',
            isShowModal: false,
            IsQueleaRegistered: false,
            loginOTP: true,
            smsType: '',
            emailStatus: false,
            phoneStatus: true,

            isEmailSuccess: false,
            isPhoneSuccess: false,

            WithdrawalPEVerificationTimePhone: '',
            WithdrawalPEVerificationTimeEmail: '',
            isCLick: false
        }
    }

    componentDidMount() {
        this.getMemberContact(this.props.memberInforData, true)

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        }


        let { allowPhone, allowEmail } = this.props
        if (allowPhone && allowEmail) {
            if (this.props.fillType == 'phone') {
                this.setState({
                    isEmailSuccess: true
                })
            }
        }

    }

    componentWillUnmount(a) {
        const { isCLick, smsType, countdownNum, loginOTP, isEmailSuccess, isPhoneSuccess, fillType, WithdrawalPEVerificationTimeEmail, WithdrawalPEVerificationTimePhone } = this.state
        this.intervalNum && clearInterval(this.intervalNum)
        this.setTimeoutHide && clearTimeout(this.setTimeoutHide)

        // if (Platform.OS === 'android') {
        //     BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        // } else {
        //     if (loginOTP) {
        //         //this.props.changeLoginOtpStatus(true)
        //         Actions.pop()
        //     }
        // }
        this.props.getMemberInforAction()

        this.props.changeisShowModal && this.props.changeisShowModal(true)





        if (fillType == 'email') {
            if (countdownNum > 0 && countdownNum != 600 && isCLick && !isEmailSuccess && WithdrawalPEVerificationTimeEmail) {
                global.storage.save({
                    key: 'WithdrawalPEVerificationTimeEmail' + window.userNameDB,
                    id: 'WithdrawalPEVerificationTimeEmail' + window.userNameDB,
                    data: WithdrawalPEVerificationTimeEmail,
                    expires: null
                })

            }

        }

        if (fillType == 'phone') {
            if (countdownNum > 0 && countdownNum != 300 && isCLick && !isPhoneSuccess && WithdrawalPEVerificationTimePhone) {
                global.storage.save({
                    key: 'WithdrawalPEVerificationTimePhone' + window.userNameDB,
                    id: 'WithdrawalPEVerificationTimePhone' + window.userNameDB,
                    data: WithdrawalPEVerificationTimePhone + '-' + smsType,
                    expires: null
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.memberInforData) {
            this.getMemberContact(nextProps.memberInforData)
        }
    }

    onBackButtonPressAndroid = () => {
        this.props.navigation.setParams({
            showDialog: false
        })
        return true
    }

    getMemberContact(memberInfor, flag) {
        let contacts = memberInfor.Contacts || memberInfor.contacts
        if (memberInfor && contacts && contacts.length) {
            const phoneData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
            let phoneStatus = phoneData ? (phoneData.Status.toLocaleLowerCase() === 'verified') : false
            const phone = phoneData ? phoneData.Contact : ''
            const emailData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
            let emailStatus = emailData ? (emailData.Status.toLocaleLowerCase() === 'verified') : false
            const email = emailData ? emailData.Contact : ''
            let IsQueleaRegistered = memberInfor.IsQueleaRegistered
            const loginOTP = memberInfor.loginOTP || memberInfor.LoginOTP
            // let phoneStatus = false
            // let emailStatus = true
            // if (emailStatus && !phoneStatus) {
            // fillType = 'email'
            // } else {
            //     fillType = 'email'
            // }
            //fillType = 'phone'
            let fillType = this.props.fillType


            if (flag) {
                if (fillType == 'email') {
                    global.storage.load({
                        key: 'WithdrawalPEVerificationTimeEmail' + window.userNameDB,
                        id: 'WithdrawalPEVerificationTimeEmail' + window.userNameDB
                    }).then(data => {
                        if (!data) return
                        let nowDate = (new Date()).getTime()
                        let diffTime = (nowDate - data) / 1000
                        if (diffTime < 600) {
                            this.refs[`focus0`].focus()
                            this.setState({
                                countdownNum: 600 - diffTime,
                                phoneEmailStep: true,
                            }, () => {
                                this.makeNumInterval()
                            })
                        }
                    }).catch(() => {

                    })
                }

                if (fillType == 'phone') {
                    global.storage.load({
                        key: 'WithdrawalPEVerificationTimePhone' + window.userNameDB,
                        id: 'WithdrawalPEVerificationTimePhone' + window.userNameDB
                    }).then(res => {
                        if (!res) return
                        let temp = res.split('-')
                        let [data, smsType] = temp
                        let nowDate = (new Date()).getTime()
                        let diffTime = (nowDate - data) / 1000
                        if (diffTime < 300) {
                            this.refs[`focus0`].focus()
                            this.setState({
                                countdownNum: 300 - diffTime,
                                phoneEmailStep: true,
                                smsType
                            }, () => {
                                this.makeNumInterval()
                            })
                        }
                    }).catch(() => {

                    })
                }
            }
            this.setState({
                memberInfor,
                phone,
                email,
                memberCode: memberInfor.MemberCode,
                IsQueleaRegistered,
                loginOTP,
                phoneStatus,
                emailStatus,
                fillType,
                countdownNum: fillType === 'email' ? 600 : 300,
            })

            if (fillType == 'email') {
                this.getVerificationAttempt('Email')
            } else {
                this.getVerificationAttempt('SMS')
            }
        }
    }

    changePhoneInput(i, val) {
        let v = val.replace(/[^0-9]/g, '')
        //this.refs[`focus${i}`].blur()
        if ((i + 1) < this.state.phoneEmailCodeLength && (v + '')) {
            this.refs[`focus${i + 1}`].focus()
        }
        this.setState({
            [`phoneEmailCode${i}`]: v
        })
        this.state.phoneEmailCodeArr[i] = v
    }

    getVerificationAttempt(channelType) {
        // fetchRequest(ApiPort.GetVerificationAttempt + 'serviceAction=OTP&channelType=SMS&', 'GET').then(data => {

        // }).catch(() => { })
        // fetchRequest(ApiPort.GetVerificationAttempt + 'serviceAction=OTP&channelType=Voice&', 'GET').then(data => {

        // }).catch(() => { })
        fetchRequest(ApiPort.GetVerificationAttempt + `serviceAction=WithdrawalVerification&channelType=${channelType}&`, 'GET').then(data => {
            this.setState({
                verificationTimes: data.remainingAttempt || data.remaningAttempt
            })
        }).catch(() => {

        })
    }

    getPhoneVerifyCode(smsType) {
        const { phone, memberInfor, verificationStatus } = this.state

        this.clearEmailPhoneCode()
        this.setState({
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: ''
        })
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'WithdrawalVerification',
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,

            IsOneTimeService: false,
        }
        this.getVerificationAttempt('SMS')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000000)
        fetchRequest(ApiPort.GetPhoneVerifyCode, 'POST', data).then(res => {
            this.catchVerifyCode(true, res, smsType)
        }).catch(err => {
            Toast.hide()
        })
        // window.PiwikMenberCode(flag ? 'Freebet_SendOTP_SMS' : 'Freebet_OTPSwitch_SMS')
    }

    ///111
    PostVoiceMessageVerify(smsType) {
        const { phone, memberInfor, verificationStatus } = this.state

        this.clearEmailPhoneCode()
        this.setState({
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: ''
        })
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'WithdrawalVerification',
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,

            IsOneTimeService: false,
        }
        this.getVerificationAttempt('Voice')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000000)
        fetchRequest(ApiPort.PostVoiceMessageVerify, 'POST', data).then(res => {
            this.catchVerifyCode(true, res, smsType)
        }).catch(err => {
            Toast.hide()
        })
    }

    PostVoiceMessageTAC() {
        const { phoneEmailCodeArr, phoneEmailCodeLength, phone, memberInfor, countdownNum } = this.state

        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            this.setState({
                message: 'กรุณากรอกรหัส OTP '
            })
            return
        }

        if (countdownNum <= 0) {
            this.setState({
                message: 'Mã xác thực đã hết hạn, vui lòng nhấp GỬI LẠI MÃ​ để được gửi lại mã khác.'
            })
            this.clearEmailPhoneCode()
            return
        }

        this.setState({
            message: '',
            verificationStatus: 0,
            verificationTimes: ''
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'WithdrawalVerification',// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 200000)
        fetchRequest(ApiPort.PostVoiceMessageTAC, 'POST', data).then(res => {
            this.catchVerifyCode(false, res)
        }).catch(err => {
            Toast.hide()
        })
    }

    PostVerificationCode(flag) {
        // let isShowCountdownNumMMSS = this.state.isShowCountdownNumMMSS
        // if (isShowCountdownNumMMSS) {

        // }
        flag == 1 ? this.sendPhoneVerifyCode() : this.PostVoiceMessageTAC()
    }

    sendPhoneVerifyCode() {
        const { phoneEmailCodeArr, phoneEmailCodeLength, phone, memberInfor, countdownNum } = this.state

        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            this.setState({
                message: 'กรุณากรอกรหัส OTP '
            })
            return
        }

        if (countdownNum <= 0) {
            this.setState({
                message: 'Mã xác thực đã hết hạn, vui lòng nhấp GỬI LẠI MÃ​ để được gửi lại mã khác.'
            })
            this.clearEmailPhoneCode()
            return
        }

        this.setState({
            message: '',
            verificationStatus: 0,
            verificationTimes: ''
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'WithdrawalVerification',// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 200000)
        fetchRequest(ApiPort.PostPhoneVerifyCode, 'POST', data).then(res => {
            this.catchVerifyCode(false, res)
        }).catch(err => {
            Toast.hide()
        })

        window.PiwikMenberCode('Freebet_SubmitOTP')
    }

    getEmailVerifyCode() {
        window.PiwikMenberCode('Verification', 'Click', `Sendcode_Email_WithdrawPage`)


        let { email, memberCode } = this.state
        this.setState({
            message: '',
            verificationStatus: 0,
            verificationTimes: ''
        })
        let params = {
            'emailVerificationServiceType': 'WithdrawalVerification',
            // 'memberCode': memberCode,
            // 'email': email,
            // 'ipAddress': '',
            // 'SiteId': Platform.OS === 'android' ? 16 : 17,
        }
        this.getVerificationAttempt('Email')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000000)
        fetchRequest(ApiPort.GetEmailVerifyCode, 'POST', params).then(res => {
            if (res.isSuccess) {
            }
            this.catchVerifyCode(true, res)
        }).catch(err => {
            Toast.hide()
        })
    }

    sendEmailVerifyCode() {
        window.PiwikMenberCode('Verification', 'Submit', `Verify_Email_WithdrawPage`)
        const { email, phoneEmailCodeArr, memberCode, phoneEmailCodeLength, countdownNum } = this.state
        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            Toast.fail('กรุณากรอกรหัส OTP ', 2)
            return
        }
        if (countdownNum <= 0) {
            // Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
            this.setState({
                message: 'รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​'
            })
            return
        }
        this.setState({
            verifyCodeErr: false,
            verificationTimes: ''
        })
        const params = {
            'serviceAction': 'WithdrawalVerification', // VerifyAndUpdate   Revalidation
            'TAC': phoneEmailCodeArr.join(''), // encryptedLink
            'memberCode': memberCode,
            'email': email,
            'ipAddress': ''
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000000)
        fetchRequest(ApiPort.PostEmailVerifyTac, 'POST', params).then(res => {
            this.catchVerifyCode(false, res)
        }).catch(err => {
            Toast.hide()
        })
    }

    judgeMemberStatus(queleaReferreeStatus) {
        const { memberInfor } = this.state
        const { IsQueleaRegistered, DisplayReferee } = memberInfor
        if (IsQueleaRegistered) {
            if (queleaReferreeStatus) {
                this.postThroughoutVerification()
            } else {
                // if (DisplayReferee) {
                //     Actions.pop()
                //     this.props.getMemberInforAction()
                //     this.props.changeDisplayReferee && this.props.changeDisplayReferee(true)
                //     window.windowchangeDisplayReferee(true)
                // } else {
                //     this.getQueleaReferreeTaskStatus()
                // }
            }
        } else {
            // Actions.pop()
        }
    }


    postThroughoutVerification() {
        Toast.loading('กำลังโหลดข้อมูล...', 200000)
        fetchRequest(ApiPort.PostThroughoutVerification, 'POST').then(res => {
            Toast.hide()
            let queleaEligibleStatus = res.queleaEligibleStatus
            if (queleaEligibleStatus) {
                Actions.pop()
                Actions.FreeBetPage({
                    fillType: 'game'
                })
            } else {
                Actions.pop()
                Actions.FreebetQualificationsModal()
            }
        }).catch(() => {
            Toast.hide()
            Actions.pop()
        })
    }


    catchVerifyCode(flag, res, smsType) {
        const { IsQueleaRegistered, fillType, phoneStatus,
            emailStatus } = this.state

        Toast.hide()
        // 发送
        if (flag) {
            this.clearEmailPhoneCode()
            if (res.isSuccess) {
                if (fillType == 'phone') {
                    this.setState({
                        WithdrawalPEVerificationTimePhone: (new Date()).getTime()
                    })
                }
                if (fillType == 'email') {
                    this.setState({
                        WithdrawalPEVerificationTimeEmail: (new Date()).getTime()
                    })
                }
                this.setState({
                    phoneEmailStep: true,
                    isCLick: true,
                    countdownNum: this.state.fillType === 'email' ? 600 : 300,
                    smsType
                    //verificationTimes: 3
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                let result = res.result



                if (result) {
                    let message = result.message || result.errorMessage || ''
                    message && Toast.fail(message, 2)
                    let resendCounter = result.resendCounter
                    if (resendCounter == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType,
                            fromPage: 'Withdrawal'
                        })
                    }
                }
            }
        } else {
            // 验证
            if (res.isSuccess) {
                Toast.success('ยืนยันเสร็จแล้ว')
                this.props.getMemberInforAction()
                this.setState({
                    isCLick: false
                })
                this.intervalNum && clearInterval(this.intervalNum)
                if (fillType === 'email') {
                    this.setState({
                        verificationStatus: 1,
                        isEmailSuccess: true,
                        WithdrawalPEVerificationTimeEmail: ''
                    })
                    global.storage.remove({
                        key: 'WithdrawalPEVerificationTimeEmail' + window.userNameDB,
                        id: 'WithdrawalPEVerificationTimeEmail' + window.userNameDB,
                    });

                } else {
                    this.setState({
                        isPhoneSuccess: true,
                        verificationStatus: 1,
                        WithdrawalPEVerificationTimePhone: ''
                    })

                    global.storage.remove({
                        key: 'WithdrawalPEVerificationTimePhone' + window.userNameDB,
                        id: 'WithdrawalPEVerificationTimePhone' + window.userNameDB,
                    });
                }
                return


                let result = res.result
                if (result) {
                    // 11111
                    if (fillType === 'email') {
                        if (!phoneStatus) {
                            setTimeout(() => {
                                this.setState({
                                    fillType: 'phone',
                                    phoneEmailStep: false,
                                    countdownNum: this.state.fillType === 'email' ? 600 : 300,
                                    verificationStatus: 0,
                                })
                                this.clearEmailPhoneCode()
                            }, 2000)
                        } else {
                            setTimeout(() => {
                                Actions.pop()
                                this.props.changeDepositTypeAction({
                                    type: 'withdrawal'
                                })


                                let queleaReferreeStatus = result.queleaReferreeStatus
                                queleaReferreeStatus && this.judgeMemberStatus(queleaReferreeStatus)
                            }, 1000)
                        }
                    } else {
                        setTimeout(() => {
                            Actions.pop()
                            this.props.changeDepositTypeAction({
                                type: 'withdrawal'
                            })


                            let queleaReferreeStatus = result.queleaReferreeStatus
                            queleaReferreeStatus && this.judgeMemberStatus(queleaReferreeStatus)
                        }, 1000)
                    }
                }
            } else {
                this.setState({
                    verificationStatus: 2
                })
                this.setTimeoutHide = setTimeout(() => {
                    this.clearEmailPhoneCode()
                }, 1500)
                let result = res.result
                if (result) {
                    let message = result.message || result.errorMessage || ''
                    message && Toast.fail(message, 2)
                    let verificationTimes = result.remainingAttempt
                    let errorCode = result.errorCode || ''


                    if (verificationTimes == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType,
                            fromPage: 'Withdrawal'
                        })
                    }

                    this.setState({
                        verificationTimes
                    })
                }
            }
        }
    }


    makeNumInterval() {
        this.intervalNum && clearInterval(this.intervalNum)
        this.setState({
            isShowCountdownNumMMSS: true
        })
        function addZero(n) {
            return n < 10 ? '0' + n : n
        }
        let countdownNum = this.state.countdownNum
        this.intervalNum = setInterval(() => {
            if (countdownNum !== 0) {
                countdownNum--
                this.setState({
                    countdownNum
                })
                let min = addZero(Math.floor(countdownNum / 60 % 60))
                let sec = addZero(Math.floor(countdownNum % 60))
                this.setState({
                    countdownNumMMSS: min + ':' + sec
                })
            } else {
                this.setState({
                    countdownNum: 0,
                    message: '',
                    // emailPhoneCodeArr: Array.from({ length: this.state.phoneEmailCodeLength }, v => ''),
                    isShowCountdownNumMMSS: false,
                    isShowPhoneBtn: true
                })
                //this.clearEmailPhoneCode()
                this.intervalNum && clearInterval(this.intervalNum)
            }
        }, 1000)
    }

    clearEmailPhoneCode() {
        const { phoneEmailCodeLength } = this.state
        for (let i = 0; i < phoneEmailCodeLength; i++) {
            this.setState({
                [`phoneEmailCode${i}`]: ''
            })
        }
        this.setState({
            //message: '',
            verificationStatus: 0,
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
        })
    }

    render() {
        const { isEmailSuccess, isPhoneSuccess } = this.state
        let { allowPhone, allowEmail } = this.props
        const { smsType, isShowModal, email, verificationTimes, loginOtpPage, fillType, verificationStatus, emailStatus, phoneStatus,
            isShowPhoneBtn, phoneEmailCodeLength, message, isShowCountdownNumMMSS, phoneEmailStep, phoneEmailCodeArr, phone, countdownNumMMSS, countdownNum } = this.state
        return <View style={[styles.viewContainer]}>
            <KeyboardAwareScrollView>
                <View style={[styles.viewPageContainer]}>
                    <Text style={[styles.headTitle, { color: window.isBlue ? "#000" : '#FFFFFF' }]}>ยืนยันบัญชีของคุณต่อ</Text>
                    {
                        (allowPhone, allowEmail) && <View>
                            <View style={styles.stepBox}>
                                <View style={styles.stepContainer}>
                                    <View style={styles.stepContainerCircle}>
                                        {
                                            isEmailSuccess && <Text style={styles.stepContainerCircleText}>✓</Text>
                                        }
                                    </View>
                                </View>

                                <View style={[styles.stepBoxLineBox]}>
                                    <View style={[styles.stepBoxLine, { backgroundColor: isEmailSuccess ? '#06ADEF' : '#D9DCE9' }]}></View>
                                </View>

                                <View style={styles.stepContainer}>
                                    <View style={[styles.stepContainerCircle, {
                                        backgroundColor: (fillType === 'phone' && isEmailSuccess) ? '#06ADEF' : '#D9DCE9',
                                        borderColor: (fillType === 'phone' && isEmailSuccess) ? '#06ADEF' : '#D9DCE9'
                                    }]}>
                                    </View>
                                </View>
                            </View>
                        </View>
                    }

                    {
                        //     <View>
                        //     {
                        //         (!emailStatus && !phoneStatus) && <Text style={{ color: window.isBlue ? '#323232' : '#FFFFFF', fontWeight: 'bold' }}>Bước {fillType === 'phone' ? 2 : 1}/2: Xác thực {fillType === 'phone' ? 'số điện thoại' : 'địa chỉ email'}</Text>
                        //     }
                        //     <Text style={{ color: '#25AAE1', fontSize: 12 }}>{fillType === 'phone' ? 'Mã xác thực OTP dùng một lần dẽ được cung cấp qua số điện thoại của bạn' : 'Vui lòng thực hiện theo hướng dẫn sẽ được gửi vào địa chỉ email của bạn'}</Text>
                        // </View>
                    }

                    {
                        fillType == 'email' && <View>
                            <View style={styles.vertionBox}>
                                <Image source={require('./../../../images/finance/withdrawals/email.png')} resizeMode='stretch' style={[styles.vertionBoxIMg]}></Image>
                                <Text style={styles.newTetxt1}>ยืนยันอีเมล</Text>
                                <Text style={styles.newTetxt2}>กรุณาทำตามขั้นตอนโดยเราจะส่งรหัสยืนยันไปที่อีเมลคุณ</Text>
                            </View>
                            <View>
                                <Text style={styles.boclkInforText}>อีเมล:</Text>
                                {
                                    phone.length > 0 && <View style={[styles.phoneTopBox]}>
                                        <TextInput
                                            style={[styles.limitListsInput, { width: width - 20, borderWidth: 0, backgroundColor: '#EFEFEF' }]}
                                            autoComplete='username'
                                            maxLength={20}
                                            textContentType='username'
                                            value={maskEmail(email)}
                                            autoCapitalize='none'
                                            editable={false}
                                        />
                                        {
                                            isEmailSuccess
                                                ?
                                                <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 5, bottom: 3, top: 3, }}>
                                                    <Image resizeMode='stretch' source={require('./../../../images/account/check1.png')} style={[styles.checkedImg]}></Image>
                                                    <Text style={{ color: '#1CBC63', fontSize: 12 }}>ยืนยันแล้ว</Text>
                                                </View>
                                                :
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        !isShowCountdownNumMMSS && this.getEmailVerifyCode(1)
                                                    }}
                                                    style={{ backgroundColor: isShowCountdownNumMMSS ? '#ACAAAC' : '#00AEEF', width: 80, height: 34, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 3, bottom: 3, top: 3, borderRadius: 1 }}>
                                                    <Text style={{ fontSize: isShowCountdownNumMMSS ? 12 : 14, color: '#fff', textAlign: 'center' }}>
                                                        {
                                                            isShowCountdownNumMMSS ? `ส่งรหัสอีกครั้ง\n(${countdownNumMMSS})` : `ส่ง`
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                        }

                                    </View>
                                }
                                <Text style={{ color: '#AAA9AC', fontSize: 12, textAlign: 'center', marginTop: 4 }}>หากต้องการเปลี่ยนอีเมล กรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการลูกค้า</Text>
                            </View>

                            {
                                isEmailSuccess
                                    ?
                                    <View>
                                        <TouchableOpacity
                                            style={[styles.freeBtn, {
                                                backgroundColor: '#25AAE1', marginTop: 150,
                                                borderColor: '#25AAE1'
                                            }]}
                                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                            onPress={() => {
                                                if (allowPhone && allowEmail) {
                                                    if (!phoneStatus) {
                                                        this.setState({
                                                            fillType: 'phone',
                                                            phoneEmailStep: false,
                                                            countdownNum: this.state.fillType === 'email' ? 600 : 300,
                                                            verificationStatus: 0,
                                                            isShowCountdownNumMMSS: false
                                                        })
                                                        this.clearEmailPhoneCode()
                                                    } else {
                                                        Actions.pop()
                                                    }
                                                } else {
                                                    Actions.pop()
                                                }
                                            }}>
                                            <Text style={[styles.freeBtnText, {
                                                color: '#fff'
                                            }]}>ถัดไป</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: '#AAA9AC', textAlign: 'center', fontSize: 12, marginTop: 10 }}>คุณยังสามารถยืนยันข้อมูลได้อีก (5) ครั้ง</Text>
                                    </View>
                                    :
                                    <View>
                                        <View style={{ marginTop: 20 }}>
                                            <Text style={styles.verificationTextTip1}>กรุณากรอกรหัสยืนยันที่ส่งไปยังอีเมลคุณ</Text>
                                            <Text style={[styles.verificationTextTip1, styles.verificationTextTip2]}>หมายเหตุ : กรุณาตรวจสอบอีเมลขยะก่อนทำรายการส่งใหม่ หากคุณไม่ได้รับรหัสภายใน 10 นาทีโปรดคลิกที่ “ส่งรหัสอีกครั้ง” เพื่อรับรหัสใหม่</Text>
                                        </View>


                                        <View style={styles.phoneInputWrap}>
                                            {
                                                phoneEmailCodeArr.map((v, i) => {
                                                    return <TextInput
                                                        ref={`focus${i}`}
                                                        key={i}
                                                        editable={isShowCountdownNumMMSS}
                                                        value={this.state[`phoneEmailCode${i}`]}
                                                        style={[styles.phoneInput,
                                                        {
                                                            borderColor: verificationStatus == 0 ? '#D4D4D4' : (verificationStatus == 1 ? '#00C507' : '#FF0000')
                                                        }]}
                                                        maxLength={1}
                                                        keyboardType={'number-pad'}
                                                        onChangeText={this.changePhoneInput.bind(this, i)}></TextInput>
                                                })
                                            }
                                        </View>

                                        <View>
                                            <TouchableOpacity
                                                style={[styles.freeBtn, {
                                                    backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#25AAE1' : '#B9B7BA',
                                                    borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#25AAE1' : '#B9B7BA',

                                                }]}
                                                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                onPress={() => {
                                                    isShowCountdownNumMMSS && this.sendEmailVerifyCode()
                                                }}>
                                                <Text style={[styles.freeBtnText, {
                                                    color: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#ffffff' : '#DAD8DB',
                                                }]}>ยืนยันเลย</Text>
                                            </TouchableOpacity>

                                            {
                                                verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={[styles.verificationTextTip3, { marginTop: 5 }]}>คุณยังสามารถยืนยันข้อมูลได้อีก (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) ครั้ง</Text>
                                            }

                                            <TouchableOpacity
                                                style={[styles.freeBtn, {
                                                    backgroundColor: '#F4F4F6'
                                                }]}
                                                onPress={() => {
                                                    Actions.pop()
                                                }}
                                            >
                                                <Text style={styles.changeWayText}>ยืนยันภายหลัง</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                            }
                        </View>
                    }


                    {
                        fillType == 'phone' && <View>
                            <View style={styles.vertionBox}>
                                <Image source={require('./../../../images/finance/withdrawals/phone.png')} resizeMode='stretch' style={[styles.vertionBoxIMg, { width: 45 }]}></Image>
                                <Text style={styles.newTetxt1}>เบอร์โทรศัพท์</Text>
                                <Text style={styles.newTetxt2}>{`ยืนยันเบอร์โทรศัพท์ที่ท่านใช้งาน และเลือกรับรหัส OTP\n(One Time Password) ทาง SMS หรือ โทรศัพท์`}</Text>
                            </View>
                            <View>
                                <Text style={styles.boclkInforText}>เบอร์โทรศัพท์:</Text>
                                {
                                    phone.length > 0 && <View style={[styles.phoneTopBox]}>
                                        <View style={[styles.phoneHeadBox]}>
                                            <Text style={[styles.phoneHeadBoxText]}>+{66}</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.limitListsInput, { width: width - 20 - 40 - 10, borderWidth: 0, backgroundColor: '#EFEFEF' }]}
                                            autoComplete='username'
                                            maxLength={20}
                                            textContentType='username'
                                            value={maskPhone(phone.split('-')[1])}
                                            autoCapitalize='none'
                                            editable={false}
                                        />
                                        {
                                            isPhoneSuccess && <View style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', right: 5, bottom: 3, top: 3, }}>
                                                <Image resizeMode='stretch' source={require('./../../../images/account/check1.png')} style={[styles.checkedImg]}></Image>
                                                <Text style={{ color: '#1CBC63', fontSize: 12 }}>ยืนยันแล้ว</Text>
                                            </View>
                                        }
                                    </View>
                                }

                                <Text style={{ color: '#AAA9AC', fontSize: 12, textAlign: 'center', marginTop: 4 }}>กรุณาติดต่อห้องแชทสดหากคุณต้องการอัพเดทเบอร์โทรศัพท์</Text>
                            </View>



                            {
                                isPhoneSuccess
                                    ?
                                    <View>
                                        <TouchableOpacity
                                            style={[styles.freeBtn, {
                                                backgroundColor: '#25AAE1', marginTop: 150,
                                                borderColor: '#25AAE1'
                                            }]}
                                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                            onPress={() => {
                                                Actions.pop()
                                                // this.setState({
                                                //     fillType: 'phone',
                                                //     phoneEmailStep: false,
                                                //     countdownNum: this.state.fillType === 'email' ? 600 : 300,
                                                //     verificationStatus: 0,
                                                // })
                                                // this.clearEmailPhoneCode()
                                            }}>
                                            <Text style={[styles.freeBtnText, {
                                                color: '#fff'
                                            }]}>ถัดไป</Text>
                                        </TouchableOpacity>
                                        <Text style={{ color: '#AAA9AC', textAlign: 'center', fontSize: 12, marginTop: 10 }}>คุณยังสามารถยืนยันข้อมูลได้อีก (5) ครั้ง</Text>
                                    </View>
                                    :
                                    <View>
                                        <View style={{ marginTop: 20 }}>
                                            <Text style={styles.verificationTextTip1}>กรุณากรอกรหัสที่ส่งไปยังเบอร์โทรศัพท์ของท่าน</Text>
                                            <Text style={[styles.verificationTextTip1, styles.verificationTextTip2]}>หมายเหตุ : หากคุณไม่ได้รับรหัส OTP ภายใน 5 นาที กรุณาคลิกที่ “ส่งรหัสอีกครั้ง” เพื่อรับรหัส OTP ใหม่</Text>
                                        </View>


                                        <View style={styles.phoneInputWrap}>
                                            {
                                                phoneEmailCodeArr.map((v, i) => {
                                                    return <TextInput
                                                        ref={`focus${i}`}
                                                        key={i}
                                                        editable={isShowCountdownNumMMSS}
                                                        value={this.state[`phoneEmailCode${i}`]}
                                                        style={[styles.phoneInput,
                                                        {
                                                            borderColor: verificationStatus == 0 ? '#D4D4D4' : (verificationStatus == 1 ? '#00C507' : '#FF0000')
                                                        }]}
                                                        maxLength={1}
                                                        keyboardType={'number-pad'}
                                                        onChangeText={this.changePhoneInput.bind(this, i)}></TextInput>
                                                })
                                            }
                                        </View>


                                        <View>
                                            <TouchableOpacity
                                                style={[styles.freeBtn, {
                                                    backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#25AAE1' : '#B9B7BA',
                                                    borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#25AAE1' : '#B9B7BA',
                                                }]}
                                                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                onPress={this.PostVerificationCode.bind(this, smsType)}>
                                                <Text style={[styles.freeBtnText, {
                                                    color: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#ffffff' : '#DAD8DB',
                                                }]}>ยืนยันเลย</Text>
                                            </TouchableOpacity>

                                            {
                                                verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={[styles.verificationTextTip3, { marginTop: 5 }]}>คุณยังสามารถยืนยันข้อมูลได้อีก (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) ครั้ง</Text>
                                            }
                                        </View>



                                        {
                                            !phoneEmailStep && <View>
                                                <TouchableOpacity style={[styles.freeBtn, { backgroundColor: '#25AAE1', borderRadius: 0, width: width - 80, marginHorizontal: 30 }]} onPress={() => {
                                                    this.getPhoneVerifyCode(1)

                                                    window.PiwikMenberCode('Verification', 'Click', 'Sendcode_SMS_WithdrawPage')
                                                }}>
                                                    <Text style={styles.freeBtnText}>ส่งรหัสทาง SMS</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }


                                        {
                                            phoneEmailStep && <View>
                                                {
                                                    verificationStatus != 1 && <TouchableOpacity
                                                        style={[styles.freeBtn, {
                                                            backgroundColor: isShowCountdownNumMMSS ? '#25AAE1' : '#32C85D',
                                                            borderColor: isShowCountdownNumMMSS ? '#25AAE1' : '#32C85D',
                                                            width: width - 80, marginHorizontal: 30
                                                        }]}
                                                        onPress={() => {
                                                            !isShowCountdownNumMMSS && (
                                                                smsType == 1 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                                            )

                                                            window.PiwikMenberCode('Verification', 'Submit', 'Verify_Phone_WithdrawPage')
                                                        }}
                                                    >
                                                        <Text style={[styles.freeBtnText]}>
                                                            {
                                                                isShowCountdownNumMMSS ? `${smsType == 1 ? `ส่งรหัสอีกครั้งใน ${countdownNumMMSS}` : `ส่งรหัสอีกครั้งใน ${countdownNumMMSS}`}` : `${smsType == 1 ? 'ส่งรหัสอีกครั้ง' : 'ส่งรหัสอีกครั้ง'}`
                                                            }
                                                        </Text>
                                                    </TouchableOpacity>
                                                }

                                                {
                                                    //verificationStatus == 1 && <Text style={styles.successText}>Xác Thực Thành Công</Text>
                                                }
                                            </View>
                                        }


                                        {
                                            phoneEmailStep && verificationStatus !== 1 && <View>
                                                <TouchableOpacity
                                                    style={[styles.freeBtn, {
                                                        backgroundColor: '#F4F4F6',
                                                        borderColor: !isShowCountdownNumMMSS ? '#25AAE1' : '#D4D4D4',
                                                        width: width - 80, marginHorizontal: 30
                                                    }]}
                                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                    onPress={() => {
                                                        !isShowCountdownNumMMSS && (
                                                            smsType == 2 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                                        )

                                                        if (smsType == 2) {
                                                            window.PiwikMenberCode('Verification', 'Click', 'Sendcode_Voice_WithdrawPage')
                                                        }
                                                    }}>
                                                    <Text style={[styles.freeBtnText, {
                                                        color: !isShowCountdownNumMMSS ? '#25AAE1' : '#DAD8DB'
                                                    }]}>
                                                        {
                                                            smsType == 1 ? 'ส่งรหัสด้วยการโทร' : 'ส่งรหัสทาง SMS'
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        }

                                        <TouchableOpacity
                                            style={[styles.freeBtn, {
                                                backgroundColor: '#F4F4F6',
                                                borderWidth: 0,
                                                marginTop: 0
                                            }]}
                                            onPress={() => {
                                                Actions.pop()
                                            }}
                                        >
                                            <Text style={[styles.changeWayText, {
                                                textDecorationLine: 'underline'
                                            }]}>ยืนยันภายหลัง</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    }
                </View>
            </KeyboardAwareScrollView>
        </View>
    }
}

export default WithdrawalPEVerification = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            freeBetData: state.freeBetData,
            withdrawalLbBankData: state.withdrawalLbBankData
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            getBalanceInforAction: () => dispatch(getBalanceInforAction()),
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
        }
    }
)(WithdrawalPEVerificationContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#F4F4F6'
    },
    freebetContactTopBg: {
        width: width,
        height: width * .6,
        paddingHorizontal: 10,
        paddingTop: isIphoneMax ? 45 : 25,
    },
    freebetContactTopBgPos: {
        backgroundColor: '#14b6fd',
        width: width,
        height: width * .6,
        paddingHorizontal: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0
    },
    freeTopInfor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    freeTopInforText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    freeTopBody: {
        alignItems: 'center',
        paddingTop: 10
    },
    freephone: {
        width: 137 * .34,
        height: 178 * .34
    },
    freeemail: {
        width: 241 * .38,
        height: 122 * .38,
        marginVertical: 5
    },
    freePhoneText1: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    freePhoneText2: {
        textAlign: 'center',
        color: '#fff'
    },
    viewPageContainer: {
        marginHorizontal: 10,
        marginTop: 15
    },
    headTitle: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        color: '#000000'
    },
    stepBox: {
        flexDirection: 'row',
        width: width - 100,
        marginHorizontal: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        marginBottom: 15
    },
    stepContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepBoxLine: {
        height: 4,
        width: width - 100 - 40,
    },
    stepBoxLineBox: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0
    },
    stepContainerText: {
        color: '#25AAE1',
        fontWeight: 'bold'
    },
    stepContainerCircle: {
        width: 20,
        height: 20,
        marginTop: 2,
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#24aae1',
        borderWidth: 1,
        borderColor: '#24aae1'
    },
    stepContainerCircleText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    boclkInforText: {
        marginTop: 4,
        marginBottom: 5,
        color: '#000',
        marginTop: 15,
        fontSize: 14
    },
    phoneTopBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        borderRadius: 2,
    },
    phoneHeadBox: {
        height: 40,
        width: 40,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,


        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderBottomWidth: 2,
        borderBottomColor: '#4C4C4C34'
    },
    phoneHeadBoxText: {
        color: '#000'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    phonesupportBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#25AAE1',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: 10,
        marginBottom: 0,
        borderRadius: 6
    },
    phonesupportBoxImg: {
        width: 28,
        height: 28,
        marginRight: 8
    },
    phonesupportBoxText: {
        color: '#25AAE1',
        fontSize: 12,
        flexWrap: 'wrap',
        width: width - 80
    },
    verificationTextTip1: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
        fontSize: 12
    },
    verificationTextTip2: {
        fontWeight: 'normal',
        marginTop: 4,
        color: '#AAA9AC',
        opacity: .8
    },
    verificationTextTip3: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#AAA9AC',
        fontSize: 12
    },
    verificationTextTip4: {
        color: '#16A9E4'
    },
    phoneInputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    phoneInput: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#D4D4D4',
        width: 40,
        height: 40,
        textAlign: 'center',
        color: '#000',
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    errorText: {
        color: '#FF0000',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: 'bold'
    },
    successText: {
        color: '#00C507',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: 'bold'
    },
    resetCodeText1: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 2,
        color: '#000'
    },
    limitListsInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 14,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        borderColor: '#B7B7B7',


        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderBottomWidth: 2,
        backgroundColor: '#fff',
        borderBottomColor: '#4C4C4C34'
    },
    changeWay: {
        position: 'absolute',
        height: 40,
        left: 0,
        right: 0,
        bottom: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
    posBtnBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10,
        width: width - 20,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    changeWay1: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40
    },
    changeWayText: {
        textAlign: 'center',
        color: '#25AAE1',
        fontSize: 14
    },
    viewModalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
    },
    closeBtnTop: {
        position: 'absolute',
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10000,
        top: 40,
        right: 10,
        zIndex: 1000
    },
    closeBtnTopText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    freephoneErorrphone: {
        width: 50,
        height: 50 * 1.767,
        marginTop: 30,
        marginBottom: 10
    },
    freephoneErorremail: {
        width: 299 * .4,
        height: 157 * .4,
        marginTop: 30,
        marginBottom: 10
    },
    freephoneErorrText1: {
        color: '#25AAE1',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 15,
        marginTop: 15,
    },
    freephoneErorrText2: {
        textAlign: 'center',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    freeBtn: {
        height: 40,
        backgroundColor: '#25AAE1',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    vertionBoxIMg: {
        width: 60,
        height: 60
    },
    vertionBox: {
        alignItems: 'center'
    },
    newTetxt1: {
        color: '#000000',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4
    },
    newTetxt2: {
        color: '#00AEEF',
        fontSize: 12,
        textAlign: 'center'
    },
    checkedImg: {
        width: 18,
        height: 18,
        marginRight: 4
    },
})