import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, Modal, Platform, ImageBackground, Alert } from 'react-native'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction } from './../../actions/ReducerAction'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import * as Animatable from 'react-native-animatable'
import { maskPhone, maskEmail, RealNameReg, RealNameErrTip, RealXingReg, RealMingReg } from './../../actions/Reg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text

class VerificationContainer extends React.Component {
    constructor(props) {
        super(props)
        let fillType = this.props.fillType
        let fromPage = this.props.fromPage
        let phoneEmailCodeLength = 6
        this.state = {
            name: '',
            name1: '',
            nameErr: false,
            nameErr1: false,
            fillType,
            fromPage,
            pageTitleStatus: this.props.pageTitleStatus,
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
            phoneEmailCodeLength,
            phoneEmailSteps: false,
            phoneEmailCode0: '',
            phoneEmailCode1: '',
            phoneEmailCode2: '',
            phoneEmailCode3: '',
            phoneEmailCode4: '',
            phoneEmailCode5: '',
            memberInfor: {},
            phone: '',
            phoneStatus: true,
            email: '',
            emailStatus: true,
            memberCode: '',
            countdownNum: this.props.fillType === 'email' ? 600 : 300,
            countdownNumMMSS: '',
            isShowCountdownNumMMSS: false,
            verifyCodeErr: false,
            pageInfor: {
                pageTitle: {
                    name: 'Xác Thực Họ Tên Thật',
                    email: 'ยืนยันข้อมูลอีเมล',
                    phone: 'ยืนยันข้อมูลเบอร์โทรศัพท์',
                },
                img: {
                    name: require('./../../images/common/verificationIcon/fillName.png'),
                    email: require('./../../images/common/verificationIcon/fillEmail.png'),
                    phone: require('./../../images/common/verificationIcon/fillPhone1.png'),
                },
                title: {
                    name: 'Hãy cho chúng tôi biết tên của bạn',
                    email: 'ยืนยันรหัส OTP',
                    phone: 'ยืนยันรหัส OTP',
                },
                text: {
                    name: 'Vui lòng đảm bảo họ tên thật của bạn trùng khớp với họ tên đăng ký tài khoản Fun88 để tránh trường hợp giao dịch bị trì hoãn hay bị hủy.',
                    email: 'เพื่อความปลอดภัยของบัญชีคุณโปรดทำตามคำแนะนำด้านล่าง เพื่อยืนยันอีเมลของคุณ',
                    phone: 'เพื่อความปลอดภัยของบัญชี กรุณาทำการยืนยันข้อมูลเบอร์โทรศัพท์ ตามขั้นตอนที่กำหนด',
                }
            },
            smsType: '',
            verificationStatus: 0,
            message: '',
            verificationTimes: '',
            isShowModal: false,
            apiname: '',
            DisplayReferee: false,
            queleaReferreeStatus: false
        }
    }

    componentDidMount() {
        Toast.hide()
        this.getMemberContact(this.props.memberInforData)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.memberInforData) {
            this.getMemberContact(nextProps.memberInforData)
        }
    }

    componentWillUnmount() {
        this.intervalNum && clearInterval(this.intervalNum)
        if ((this.props.fillType === 'email' || this.props.fillType === 'phone') && this.props.fromPage && this.props.fromPage === 'RecommendPage') {
            this.props.getQueleaReferrerEligible && this.props.getQueleaReferrerEligible()
        }
        this.props.getMemberInforAction()
        this.props.changeisShowModal && this.props.changeisShowModal(true)
    }


    getVerificationAttempt(channelType) {
        fetchRequest(ApiPort.GetVerificationAttempt + `serviceAction=${this.props.ServiceAction}&channelType=${channelType}&`, 'GET').then(data => {
            this.setState({
                verificationTimes: data.remainingAttempt
            })
        }).catch(() => { })
    }

    getMemberContact(memberInfor) {
        let contacts = memberInfor.Contacts || memberInfor.contacts
        if (memberInfor && contacts && contacts.length) {
            let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
            let emailStatus = tempEmail ? (tempEmail.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
            let email = tempEmail ? tempEmail.Contact : ''
            let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
            let phoneStatus = tempPhone ? (tempPhone.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
            let phone = tempPhone ? tempPhone.Contact : ''
            this.setState({
                memberInfor,
                phone,
                email,
                emailStatus,
                phoneStatus,
                memberCode: memberInfor.MemberCode,
                name: memberInfor.FirstName,
                DisplayReferee: memberInfor.DisplayReferee
            })
        }
    }

    submitName() {
        const { name, name1, nameErr, fromPage } = this.state
        window.PiwikMenberCode('Submit_name_RegisterSuccess')


        if (!name) {
            Toast.fail('รูปแบบชื่อที่กรอกไม่ถูกต้อง', 2)
            return
        }
        // if (!RealXingReg.test(name)) {
        //     Toast.fail('ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข', 2)
        //     return
        // }


        if (!name1) {
            Toast.fail('รูปแบบชื่อที่กรอกไม่ถูกต้อง', 2)
            return
        }
        // if (!RealMingReg.test(name1)) {
        //     Toast.fail('ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข', 2)
        //     return
        // }

        // if (!name) {
        //     Toast.fail(RealNameErrTip, 2)
        //     return
        // }
        // if (nameErr) {
        //     Toast.fail(RealNameErrTip, 2)
        //     return
        // }

        const params = {
            key: 'FirstName',
            value1: (name.trim() + ' ' + name1.trim()).trim(),
            value2: ''
        }

        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000)
        fetchRequest(ApiPort.Member, 'PATCH', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                if (fromPage === 'homeTabBar') {
                    Actions.pop()
                    Actions.jump('Finance')
                } else if (fromPage === 'homeAccount') {
                    Toast.success('การอัปเดตสำเร็จ', 1.5, () => {
                        Actions.pop()
                        let memberInfor = this.state.memberInfor
                        let contacts = memberInfor.Contacts || memberInfor.contacts
                        let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
                        let emailStatus = tempEmail ? (tempEmail.Status.toLocaleLowerCase() === 'verified') : false
                        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
                        let phoneStatus = tempPhone ? (tempPhone.Status.toLocaleLowerCase() === 'verified') : false
                        if (!(emailStatus && phoneStatus)) {
                            Actions.WithdrawalPEVerification()
                            return
                        }
                        // this.props.changeDepositTypeAction({
                        //     type: this.props.router
                        // })
                    })
                } else if (fromPage === 'homeAccountStack') {
                    Actions.pop()
                    Actions[this.props.router]()
                } else if (fromPage === 'ContactInformation') {
                    let nextPage = this.props.nextPage
                    if (nextPage) {
                        this.setState({
                            fillType: nextPage
                        })
                    }
                } else if (fromPage === 'RecommendPage') {
                    this.setState({
                        fillType: 'email'
                    })
                } else if (fromPage === 'HomeRecommendModal') {
                    Actions.pop()
                    this.props.getMemberInforAction()
                    this.props.changeDisplayReferee(true)
                } else if (fromPage === 'lottery') {
                    Actions.pop()
                    Actions.DepositStack()
                } else {
                    Toast.success('การอัปเดตสำเร็จ', 1.5, () => {
                        Actions.pop()
                    })
                }
            } else {
                Toast.fail('ติดตั้งไม่สำเร็จ', 2)
            }
        }).catch(() => {
            Toast.hide()
        })
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

    getPhoneVerifyCode(smsType) {

        this.setState({
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            verificationTimes: '',
            message: '',
        })
        const { phone, memberCode, memberInfor } = this.state
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            IsOneTimeService: false,
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,
            ServiceAction: this.props.ServiceAction,
        }
        this.setState({
            apiname: ApiPort.GetPhoneVerifyCode
        })
        this.getVerificationAttempt('SMS')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000)
        fetchRequest(ApiPort.GetPhoneVerifyCode, 'POST', data).then(res => {
            this.catchVerifyCode(true, res, smsType)
        }).catch(err => {
            Toast.hide()
        })
        window.PiwikMenberCode('Sendcode_SMSverification')
    }

    ///111
    PostVoiceMessageVerify(smsType) {
        const { phone, memberInfor, verificationStatus } = this.state

        this.clearEmailPhoneCode()
        this.setState({
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            verificationTimes: '',
            message: '',
        })
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: this.props.ServiceAction,
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,

            IsOneTimeService: false,
        }
        this.setState({
            apiname: ApiPort.PostVoiceMessageVerify
        })
        this.getVerificationAttempt('Voice')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 200000)
        fetchRequest(ApiPort.PostVoiceMessageVerify, 'POST', data).then(res => {
            this.catchVerifyCode(true, res, smsType)
        }).catch(err => {
            Toast.hide()
        })
    }

    catchVerifyCode(flag, res, smsType) {
        const { IsQueleaRegistered, emailStatus, fromPage } = this.state
        Toast.hide()
        if (flag) {
            this.clearEmailPhoneCode()
            if (res.isSuccess) {
                this.setState({
                    phoneEmailSteps: true,
                    countdownNum: this.state.fillType === 'email' ? 600 : 300,
                    smsType
                    //verificationTimes: 3
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                let result = res.result
                let errorCode = (result.errorCode || '')
                let resendCounter = result.resendCounter
                if (resendCounter == 0) {
                    Actions.PhoneEmailErrorModal({
                        fillType: this.state.fillType,
                        fromPage: 'ProfileQuelea'
                    })
                }
                if (result) {
                    let message = result.message || result.errorMessage
                    message && Toast.fail(message, 2)
                }
            }
        } else {
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                this.intervalNum && clearInterval(this.intervalNum)
                this.setState({
                    verificationStatus: 1
                })


                if (fromPage == 'WithdrawalsPage') {
                    this.clearEmailPhoneCode()
                    Toast.success('ยืนยันสำเร็จ')
                    let { allowPhone, allowEmail } = this.props
                    if (allowPhone && allowEmail) {
                        if (emailStatus) {
                            this.setState({
                                fillType: 'email'
                            })
                        } else {
                            Actions.pop()
                        }
                        return
                    }
                    Actions.pop()
                    return
                }

                Toast.success('ยืนยันสำเร็จ', 3, () => {
                    Actions.pop()
                })


                let result = res.result || {}
                let queleaReferreeStatus = result.queleaReferreeStatus
                this.setState({
                    queleaReferreeStatus
                }, () => {
                    this.judgeMemberStatus()
                })
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
                    let fillType = this.state.fillType
                    if (verificationTimes == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType: this.state.fillType,
                            fromPage: 'ProfileQuelea'
                        })
                    }

                    if (errorCode.toLocaleUpperCase().includes('REVA0001')) {

                    }


                    // let verificationTimes = message.match(/[0-9]/g)
                    // if (Array.isArray(verificationTimes) && verificationTimes.length) {
                    //     this.setState({
                    //         verificationTimes: verificationTimes[0]
                    //     })
                    // }

                    this.setState({
                        verificationTimes
                    })

                    // let exception = result.exception || ''
                    // if (exception == 'SMS002') {
                    //     this.setState({
                    //         message: 'Mã xác thực không chính xác, vui lòng kiểm tra lại và chắc chắn bạn nhập đúng mã số được cung cấp.'
                    //     })
                    // } else {
                    //     this.setState({
                    //         message
                    //     })
                    // }
                }
            }
        }
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
            Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
            return
        }

        this.setState({
            message: '',
            verificationStatus: 0,
            verificationTimes: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            verificationTimes: '',
            message: '',
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: this.props.ServiceAction,// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        this.setState({
            apiname: ApiPort.PostVoiceMessageTAC
        })
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
        window.PiwikMenberCode('Verification', 'Submit', 'Verify_Phone_ProfilePage')
        flag == 1 ? this.sendPhoneVerifyCode() : this.PostVoiceMessageTAC()
    }

    sendPhoneVerifyCode() {
        const { countdownNum, emailStatus, phoneEmailCodeArr, phoneEmailCodeLength, phone, memberCode, fromPage, memberInfor } = this.state

        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            Toast.fail('กรุณากรอกรหัส OTP ', 2)
            return
        }

        if (countdownNum <= 0) {
            Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
            return
        }


        this.setState({
            verifyCodeErr: false,
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            verificationTimes: '',
            message: '',
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: this.props.ServiceAction,
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        this.setState({
            apiname: ApiPort.PostPhoneVerifyCode
        })
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 20000)
        fetchRequest(ApiPort.PostPhoneVerifyCode, 'POST', data).then(res => {
            this.catchVerifyCode(false, res)
            return
            Toast.hide()
            this.catchVerifyCode(false, res)
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                this.intervalNum && clearInterval(this.intervalNum)
                Toast.success('การอัปเดตสำเร็จ', 1.5)
                if (fromPage === 'homeAccount') {
                    Actions.pop()
                    this.props.changeDepositTypeAction({
                        type: this.props.router
                    })
                    // this.setState({
                    //     phoneStatus: false
                    // })
                    // if (emailStatus) {
                    //     this.setState({
                    //         fillType: 'email',
                    //         phoneEmailSteps: false,
                    //         verifyCodeErr: false,
                    //         countdownNum: 300,
                    //         countdownNumMMSS: '',
                    //     }, () => {
                    //         this.clearEmailPhoneCode()
                    //     })
                    // } else {
                    //     this.props.changeDepositTypeAction({
                    //         type: this.props.router
                    //     })
                    // }
                } else {
                    Actions.pop()
                }
            } else {
                this.clearEmailPhoneCode()
                this.setState({
                    verifyCodeErr: true
                })
            }
        }).catch(err => {
            Toast.hide()
        })

        window.PiwikMenberCode('Verifynow_SMSverification')
    }

    getEmailVerifyCode() {
        window.PiwikMenberCode('Verification', 'Click', `SendCode_Email_ProfilePage`)
        let { email, memberCode } = this.state
        let params = {
            'emailVerificationServiceType': this.props.ServiceAction,
            'serviceAction': this.props.ServiceAction,
            'memberCode': memberCode,
            'email': email,
            'ipAddress': '',
            'SiteId': Platform.OS === 'android' ? 16 : 17,
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 200000)
        this.getVerificationAttempt('Email')
        fetchRequest(ApiPort.GetEmailVerifyCode, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    phoneEmailSteps: true
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                let result = res.result
                let resendCounter = result.resendCounter
                if (resendCounter == 0) {
                    Actions.PhoneEmailErrorModal({
                        fillType: this.state.fillType,
                        fromPage: 'ProfileQuelea'
                    })
                }
                if (result) {
                    let message = result.message || result.errorMessage
                    message && Toast.fail(message, 2)
                }
            }
        }).catch(err => {
            Toast.hide()
        })

        window.PiwikMenberCode('Sendcode_emailverification')
    }


    judgeMemberStatus() {
        const { memberInfor, queleaReferreeStatus } = this.state
        const { IsQueleaRegistered, DisplayReferee } = memberInfor
        if (IsQueleaRegistered) {
            if (queleaReferreeStatus) {
                this.postThroughoutVerification()
            } else {
                if (DisplayReferee) {
                    Actions.pop()
                    this.props.getMemberInforAction()
                    this.props.changeDisplayReferee && this.props.changeDisplayReferee(true)
                    window.windowchangeDisplayReferee(true)
                } else {
                    this.getQueleaReferreeTaskStatus()
                }
            }
        } else {
            Actions.pop()
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


    getQueleaReferreeTaskStatus(flag) {
        Toast.loading('กำลังโหลดข้อมูล...', 200000)
        fetchRequest(ApiPort.GetQueleaReferreeTaskStatus, 'GET').then(res => {
            Toast.hide()
            let { isActiveCampaign, isContactVerified } = res
            if (isActiveCampaign && isContactVerified) {
                this.postThroughoutVerification()
            } else {
                Actions.pop()
                Actions.pop()
            }
            // this.setState({
            //     referreeTaskStatus: res,
            // })
        }).catch(err => {
            Toast.hide()
        })
    }

    sendEmailVerifyCode() {
        window.PiwikMenberCode('Verification', 'Submit', `Verify_Email_ProfilePage`)
        const { countdownNum, phoneStatus, emailStatus, email, phoneEmailCodeArr, memberCode, phoneEmailCodeLength, fromPage } = this.state
        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            Toast.fail('กรุณากรอกรหัส OTP ', 2)
            return
        }

        if (countdownNum <= 0) {
            Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
            return
        }



        this.setState({
            verifyCodeErr: false
        })
        const params = {
            'serviceAction': this.props.ServiceAction, // VerifyAndUpdate   Revalidation
            'TAC': phoneEmailCodeArr.join(''), // encryptedLink
            'memberCode': memberCode,
            'email': email,
            'ipAddress': ''
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 200000)
        fetchRequest(ApiPort.PostEmailVerifyTac, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                this.intervalNum && clearInterval(this.intervalNum)
                Toast.success('การอัปเดตสำเร็จ', 2)
                this.setState({
                    emailStatus: false
                })
                if (fromPage === 'homeAccount') {
                    Actions.pop()
                    this.props.changeDepositTypeAction({
                        type: this.props.router
                    })
                    // if (phoneStatus) {
                    //     this.setState({
                    //         fillType: 'phone',
                    //         phoneEmailSteps: false,
                    //         verifyCodeErr: false,
                    //         countdownNum: 300,
                    //         countdownNumMMSS: '',
                    //     }, () => {
                    //         this.clearEmailPhoneCode()
                    //     })
                    // } else {
                    //     this.props.changeDepositTypeAction({
                    //         type: this.props.router
                    //     })
                    // }
                } else if (fromPage == 'WithdrawalsPage') {
                    this.clearEmailPhoneCode()
                    let { allowPhone, allowEmail } = this.props
                    if (allowPhone && allowEmail) {
                        if (phoneStatus) {
                            this.setState({
                                fillType: 'phone'
                            })
                        } else {
                            Actions.pop()
                        }
                        return
                    }
                    Actions.pop()
                } else if (fromPage === 'RecommendPage') {
                    if (phoneStatus) {
                        this.setState({
                            fillType: 'phone'
                        })
                    } else {
                        Actions.pop()
                    }

                } else {
                    let result = res.result || {}
                    let queleaReferreeStatus = result.queleaReferreeStatus
                    this.setState({
                        queleaReferreeStatus
                    }, () => {
                        this.judgeMemberStatus()
                    })
                }
            } else {
                this.clearEmailPhoneCode()
                this.setState({
                    verifyCodeErr: true
                })



                let result = res.result
                let message = result.message
                message && Toast.fail(message, 2)
                let errorCode = result.errorCode || ''
                let verificationTimes = result.remainingAttempt
                this.setState({
                    verificationTimes

                })
                if (verificationTimes == 0) {
                    Actions.PhoneEmailErrorModal({
                        fillType: this.state.fillType,
                        fromPage: 'ProfileQuelea'
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })
        window.PiwikMenberCode('Verifynow_emailverification')
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
                    countdownNum: this.state.fillType === 'email' ? 600 : 300,
                    //phoneEmailSteps: false,
                    emailPhoneCodeArr: Array.from({ length: this.state.phoneEmailCodeLength }, v => ''),
                    isShowCountdownNumMMSS: false,
                    verifyCodeErr: false,
                    message: '',
                    verificationStatus: 0,
                    message: '',
                })
                this.clearEmailPhoneCode()
                clearInterval(this.intervalNum)
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
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
        })
    }

    render() {
        const { name1, nameErr1, isShowModal, countdownNum, phoneEmailCodeLength, verificationTimes, message, verificationStatus, smsType, memberInfor, nameErr, verifyCodeErr,
            isShowCountdownNumMMSS,
            pageInfor, name, fillType, phoneEmailSteps, phoneEmailCodeArr, phone, email, countdownNumMMSS } = this.state
        //  isShowCountdownNumMMSS = false
        const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', color: window.isBlue ? '#3C3C3C' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
            <KeyboardAwareScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    fillType !== 'name' && <View>
                        {

                            <ImageBackground source={require('./../../images/common/verificationIcon/voiceBg.png')} resizeMode='stretch' style={styles.voiceBg}>
                                <View style={[styles.nameBox, { backgroundColor: 'transparent' }]}>
                                    <Text style={[styles.homeTitle]}>{pageInfor.pageTitle[fillType]}</Text>
                                    <View alignItems='center'>
                                        <Image resizeMode='stretch' source={pageInfor.img[fillType]} style={[styles.homeIdentification, styles[`homeIdentification${fillType}`]]}></Image>
                                    </View>
                                    <View>
                                        <Text style={[styles.homeTextWrap, { fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>{pageInfor.title[fillType]}</Text>
                                        <Text style={[styles.homeTextWrap]}>{pageInfor.text[fillType]}</Text>
                                    </View>
                                </View>
                            </ImageBackground>

                        }

                        {
                            fillType === 'phone' && <View style={[styles.inputBox, { marginTop: 6 }]}>
                                <View>
                                    <View>
                                        <Text style={[styles.boclkInforText, { fontWeight: 'normal', marginBottom: 10, color: window.isBlue ? '#000' : '#B2B2B2' }]}>เบอร์โทรศัพท์</Text>
                                        {
                                            phone.length > 0 && <View style={[styles.phoneTopBox]}>
                                                <View style={[styles.phoneHeadBox, {
                                                    borderColor: window.isBlue ? '#EFEFEF' : '#25AAE1',
                                                    backgroundColor: window.isBlue ? '#EFEFEF' : '#5B5C5D',
                                                }]}>
                                                    <Text style={[styles.phoneHeadBoxText, { color: window.isBlue ? '#636363' : '#FFFFFF' }]}>+{66}</Text>
                                                </View>
                                                <TextInput
                                                    style={[styles.limitListsInput, {
                                                        width: width - 20 - 40 - 10, borderWidth: 1,
                                                        borderColor: window.isBlue ? '#EFEFEF' : '#25AAE1',
                                                        backgroundColor: window.isBlue ? '#EFEFEF' : '#5B5C5D', color: window.isBlue ? '#636363' : '#FFFFFF'
                                                    }]}
                                                    autoComplete='username'
                                                    maxLength={20}
                                                    textContentType='username'
                                                    value={maskPhone(phone.split('-')[1])}
                                                    autoCapitalize='none'
                                                    editable={false}
                                                />
                                            </View>
                                        }
                                    </View>

                                    <TouchableOpacity style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38' }]} onPress={() => {
                                        Actions.LiveChat()
                                        // window.PiwikMenberCode('CS_emailverification')
                                    }}>
                                        <Image source={require('./../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                                        <Text style={[styles.phonesupportBoxText, { width: width - 80 }]}>กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ หากคุณต้องการเปลี่ยนแปลงข้อมูลเบอร์โทรศัพท์ที่ลงทะเบียน</Text>
                                    </TouchableOpacity>


                                    {
                                        !phoneEmailSteps && <View>
                                            <TouchableOpacity style={[styles.freeBtn, { backgroundColor: '#25AAE1' }]} onPress={() => {
                                                window.PiwikMenberCode('Verification', 'Click', 'Sendcode_SMS_ProfilePage')
                                                this.getPhoneVerifyCode(1)
                                            }}>
                                                <Text style={styles.freeBtnText}>ส่งรหัส OTP ทาง SMS</Text>
                                            </TouchableOpacity>

                                            {
                                                // <TouchableOpacity style={[styles.freeBtn, {
                                                //     backgroundColor: 'transparent',
                                                //     borderColor: '#37C95D'
                                                // }]}
                                                //     onPress={this.PostVoiceMessageVerify.bind(this, 2)}>
                                                //     <Text style={[styles.freeBtnText, { color: '#37C95D' }]}>ส่งรหัส OTP ทางโทรศัพท์</Text>
                                                // </TouchableOpacity>
                                            }
                                        </View>
                                    }


                                    {
                                        phoneEmailSteps && <View>
                                            {
                                                // verificationStatus != 1 && <TouchableOpacity
                                                //     style={[styles.freeBtn, {
                                                //         backgroundColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#32C85D',
                                                //         borderColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#32C85D'
                                                //     }]}
                                                //     onPress={() => {
                                                //         !isShowCountdownNumMMSS && (
                                                //             smsType == 1 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                                //         )
                                                //     }}
                                                // >
                                                //     <Text style={[styles.freeBtnText]}>
                                                //         {
                                                //             isShowCountdownNumMMSS ? `${smsType == 1 ? `Gửi lại trong vòng ${countdownNumMMSS}` : `Gọi lại trong ${countdownNumMMSS}`}` : `${smsType == 1 ? 'GỬI LẠI MÃ' : 'โทรอีกครั้ง '}`
                                                //         }
                                                //     </Text>
                                                // </TouchableOpacity>
                                            }

                                            <View style={{ marginTop: 8 }}>
                                                <Text style={styles.verificationTextTip1}>กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์ของคุณ</Text>
                                                <Text style={[styles.verificationTextTip1, styles.verificationTextTip2]}>
                                                    {smsType == 1 ? 'หมายเหตุ: หากคุณไม่ได้รับรหัส OTP ภายใน 5 นาที กรุณาคลิกที่ "ส่งรหัสอีกครั้ง" เพื่อรับรหัส OTP ใหม่' : 'หมายเหตุ: หากคุณไม่ได้รับรหัส OTP ภายใน 5 นาที กรุณาคลิกที่ "โทรขอรหัส OTP " เพื่อรับรหัสใหม่'}
                                                </Text>
                                            </View>

                                            <View style={styles.phoneInputWrap}>
                                                {
                                                    phoneEmailCodeArr.map((v, i) => {
                                                        return <TextInput
                                                            ref={`focus${i}`}
                                                            key={i}
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

                                            {
                                                // message.length > 0 && <Text style={[styles.errorText, { color: verificationStatus == 0 ? '#FF0000' : (verificationStatus == 1 ? '#00C507' : '#FF0000'), marginBottom: 6 }]}>{message}</Text>
                                            }

                                            {
                                                // verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={styles.verificationTextTip3}>Bạn còn (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) lần thử lại.</Text>
                                            }

                                            {
                                                // verificationStatus == 1 && <Text style={styles.successText}>ยืนยันสำเร็จ</Text>
                                            }

                                            {
                                                // verificationStatus !== 1 && <View>
                                                //     <TouchableOpacity
                                                //         style={[styles.freeBtn, {
                                                //             backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7',
                                                //             borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7'
                                                //         }]}
                                                //         hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                //         onPress={this.PostVerificationCode.bind(this, smsType)}>
                                                //         <Text style={styles.freeBtnText}>สมัครสมาชิก</Text>
                                                //     </TouchableOpacity>

                                                //     <TouchableOpacity
                                                //         style={[styles.freeBtn, {
                                                //             backgroundColor: '#FFFFFF',
                                                //             borderColor: !isShowCountdownNumMMSS ? '#32C85D' : '#B7B7B7',
                                                //         }]}
                                                //         hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                //         onPress={() => {
                                                //             !isShowCountdownNumMMSS && (
                                                //                 smsType == 2 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                                //             )
                                                //         }}>
                                                //         <Text style={[styles.freeBtnText, {
                                                //             color: !isShowCountdownNumMMSS ? '#32C85D' : '#B7B7B7'
                                                //         }]}>
                                                //             {
                                                //                 smsType == 1 ? 'Gửi mã qua cuộc gọi' : 'Gửi Mã OTP qua Tin Nhắn SMS'
                                                //             }
                                                //         </Text>
                                                //     </TouchableOpacity>
                                                // </View>
                                            }
                                        </View>
                                    }
                                </View>
                            </View>
                        }

                        {
                            fillType === 'email' && <View style={[styles.inputBox, { marginTop: 6 }]}>
                                <View>
                                    <Text style={[styles.boclkInforText, { color: window.isBlue ? '#000' : '#fff' }]}>อีเมล</Text>
                                    <TextInput
                                        style={[styles.inputBase, { backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F', borderColor: window.isBlue ? '#EFEFEF' : '#00CEFF', color: window.isBlue ? '#000' : '#fff' }]}
                                        autoComplete='username'
                                        maxLength={20}
                                        textContentType='username'
                                        value={maskEmail(email)}
                                        autoCapitalize='none'
                                        editable={false}
                                    />
                                </View>

                                <TouchableOpacity style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38' }]} onPress={() => {
                                    Actions.LiveChat()
                                    window.PiwikMenberCode('CS_emailverification')
                                }}>
                                    <Image source={require('./../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                                    <Text style={[styles.phonesupportBoxText, { width: width - 80 }]}>กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ หากคุณต้องการเปลี่ยนแปลงข้อมูลอีเมลที่ลงทะเบียน​</Text>
                                </TouchableOpacity>

                                {
                                    !phoneEmailSteps && <View>
                                        <TouchableOpacity style={styles.inputBtn} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={this.getEmailVerifyCode.bind(this)}>
                                            <Text style={styles.serchBtnText}>ส่ง</Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                                {
                                    phoneEmailSteps && <View>
                                        <Text style={styles.step2Text}>กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมลของคุณ</Text>

                                        <Text style={styles.step2Text}>หมายเหตุ: หากคุณไม่ได้รับรหัส OTP ภายใน 10 นาที กรุณาคลิกที่ "ส่งรหัสอีกครั้ง" เพื่อรับรหัส OTP ใหม่</Text>
                                        <View style={styles.phoneInputWrap}>
                                            {
                                                phoneEmailCodeArr.map((v, i) => {
                                                    return <TextInput
                                                        ref={`focus${i}`}
                                                        key={i}
                                                        value={this.state[`phoneEmailCode${i}`]}
                                                        style={[styles.phoneInput, { color: window.isBlue ? '#000' : '#fff' }]}
                                                        maxLength={1}
                                                        keyboardType={'number-pad'}
                                                        onChangeText={this.changePhoneInput.bind(this, i)}></TextInput>
                                                })
                                            }
                                        </View>

                                        {
                                            // verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={styles.verificationTextTip3}>Bạn còn (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) lần thử lại.</Text>
                                        }

                                        {
                                            //verifyCodeErr && <Text style={styles.errorText}>Mã OTP không trùng khớp với hệ thống cung cấp.</Text>
                                        }

                                        {
                                            // <Text style={[styles.resetCodeText1, { color: window.isBlue ? '#000' : '#fff' }]}>Gửi lại trong vòng {countdownNumMMSS} <Text
                                            // onPress={() => {
                                            //     !isShowCountdownNumMMSS && this.getEmailVerifyCode()
                                            // }}
                                            // style={[styles.resetCodeText2, { color: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1' }]}>GỬI LẠI MÃ</Text></Text>
                                        }



                                    </View>
                                }
                            </View>
                        }



                    </View>
                }


                {
                    fillType === 'name' && <View style={[{
                        flex: 1,
                        width: width,
                        height,
                        alignItems: 'center',
                    }]}>
                        <View style={{
                            backgroundColor: '#06ADEF',
                            height: 85,
                            paddingTop: 40,
                            width,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10
                        }}>
                            <TouchableOpacity onPress={() => {
                                Actions.pop()
                            }}>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>X</Text>
                            </TouchableOpacity>

                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>ยืนยันบัญชี</Text>


                            <TouchableOpacity style={styles.homeCsWrap} onPress={() => {
                                Actions.LiveChat()
                                window.PiwikMenberCode('CS_topnav')
                            }}>
                                <Image resizeMode='stretch' source={Boolean(this.props.liveChatData) ? require('./../../images/tabberIcon/ic_online_cs.gif') : require('./../../images/tabberIcon/whiteCS.png')} style={styles.homeCSImg}></Image>
                            </TouchableOpacity>



                        </View>
                        <Image resizeMode='stretch' source={pageInfor.img[fillType]} style={[{
                            width: 50, height: 60,
                            marginTop: 20
                        }]}></Image>
                        <Text style={[styles.boclkInforText, { color: window.isBlue ? '#000' : '#fff', fontSize: 16, marginBottom: 5 }]}>กรุณากรอกชื่อจริงของคุณ</Text>
                        <Text style={{ color: '#4DACE9', fontSize: 12, textAlign: 'center', paddingHorizontal: 30, marginBottom: 20 }}>กรุณากรอกชื่อ นามสกุลจริงที่ตรงกับชื่อบัญชีธนาคาร ในการฝาก-ถอน ป้องกันกความล่าช้าหรือยอดเงินถูกยกเลิก เมื่อยืนยันแล้วจะไม่สามารถแก้ไขชื่อได้​</Text>
                        <View style={{ alignItems: 'flex-start', width: width - 20 }}>
                            <Text style={{ color: '#323232', textAlign: 'left', marginBottom: 8 }}>ชื่อจริง</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width - 20 }}>
                            <TextInput
                                style={[styles.inputBase, PasswordInput, {
                                    width: (width - 20) * .46,
                                    backgroundColor: memberInfor.FirstName ? '#EFEFEF' : (window.isBlue ? '#fff' : '#000'),
                                    borderColor: '#D1D1D1',
                                    borderBottomWidth: 3,
                                    borderBottomColor: '#0000000D'
                                }]}
                                autoComplete='username'
                                textContentType='username'
                                value={name}
                                placeholderTextColor='#C4C4C6'
                                editable={!memberInfor.FirstName}
                                autoCapitalize='none'
                                onChangeText={name => {
                                    let nameErr = !(RealNameReg.test(name) && name.trim().length > 0)
                                    console.log(nameErr)
                                    this.setState({
                                        name,
                                        nameErr
                                    })
                                }}
                                maxLength={50}
                                placeholder='ปัญญา'
                            />
                            <TextInput
                                style={[styles.inputBase, PasswordInput, {
                                    width: (width - 20) * .46,
                                    backgroundColor: memberInfor.FirstName ? '#EFEFEF' : (window.isBlue ? '#fff' : '#000'),
                                    borderColor: '#D1D1D1',
                                    borderBottomWidth: 3,
                                    borderBottomColor: '#0000000D'
                                }]}
                                autoComplete='username'
                                textContentType='username'
                                value={name1}
                                editable={!memberInfor.FirstName}
                                placeholderTextColor='#C4C4C6'
                                autoCapitalize='none'
                                onChangeText={name1 => {
                                    let nameErr1 = !(RealNameReg.test(name1) && name1.trim().length > 0)
                                    this.setState({
                                        name1,
                                        nameErr1
                                    })
                                }}
                                maxLength={50}
                                placeholder='สุขใจ'
                            />
                        </View>
                        {
                            // <AnimatableText transition={['opacity']} style={{ color: 'red', marginTop: 10, opacity: nameErr ? 1 : 0 }}>{RealNameErrTip}</AnimatableText>

                        }
                        <View style={{ position: 'absolute', bottom: 60 }}>
                            <TouchableOpacity style={[styles.inputBtn, {
                                width: width - 20,
                                backgroundColor: name1.length > 0 && name.length > 0 ? '#00AEEF' : '#b7b7b7'
                            }]} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                                name1.length > 0 && name.length > 0 && this.submitName(this)
                            }
                            }>
                                <Text style={styles.serchBtnText}>ยืนยัน</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.inputBtn, {
                                width: width - 20,
                                backgroundColor: '#FFFFFF',
                                borderColor: '#00AEEF',
                                borderWidth: 1
                            }]} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                                Actions.pop()
                            }}>
                                <Text style={[styles.serchBtnText, {
                                    color: '#00AEEF'
                                }]}>ภายหลัง</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </KeyboardAwareScrollView>



            {
                fillType == 'email' && <View style={{
                    width: width - 20,
                    marginHorizontal: 10,
                    paddingBottom: 20
                }}>
                    {
                        phoneEmailSteps && <View>
                            <TouchableOpacity style={[styles.inputBtn, {
                                backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7',
                                borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7'
                            }]} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                onPress={this.sendEmailVerifyCode.bind(this)}>
                                <Text style={styles.serchBtnText}>ทำการยืนยันตอนนี้</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.freeBtn, {
                                    backgroundColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1',
                                    borderColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1'
                                }]}
                                onPress={() => {
                                    !isShowCountdownNumMMSS && this.getEmailVerifyCode(1)
                                }}
                            >
                                <Text style={[styles.freeBtnText]}>
                                    {
                                        isShowCountdownNumMMSS ? `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที` : 'โทรอีกครั้ง '
                                    }
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }


                    <TouchableOpacity
                        style={[
                            {
                                marginTop: 10,
                                alignItems: 'center',
                                width,
                                width: width - 20,
                                marginHorizontal: 10,
                                height: 40,
                                borderRadius: 4,
                                justifyContent: 'center'
                            }
                        ]}
                        onPress={() => {
                            Actions.pop()
                        }}
                    >
                        <Text style={[styles.changeWayText, { color: '#25AAE1' }]}>ยืนยันภายหลัง</Text>
                    </TouchableOpacity>

                </View>
            }

            {
                fillType == 'phone' && <View style={{
                    width: width - 20,
                    marginHorizontal: 10,
                    paddingBottom: 20
                }}>
                    {
                        phoneEmailSteps && <View>
                            {
                                verificationStatus !== 1 && <View>
                                    <TouchableOpacity
                                        style={[styles.freeBtn, {
                                            backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7',
                                            borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7'
                                        }]}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                        onPress={this.PostVerificationCode.bind(this, smsType)}>
                                        <Text style={styles.freeBtnText}>ทำการยืนยันตอนนี้</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.freeBtn, {
                                            backgroundColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1',
                                            borderColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1'
                                        }]}
                                        onPress={() => {
                                            !isShowCountdownNumMMSS && (
                                                smsType == 1 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                            )
                                        }}
                                    >
                                        <Text style={[styles.freeBtnText]}>
                                            {
                                                isShowCountdownNumMMSS ? `${smsType == 1 ? `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที` : `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที`}` : `${smsType == 1 ? 'ส่งรหัสอีกครั้ง' : 'ส่งรหัสอีกครั้ง'}`
                                            }
                                        </Text>
                                    </TouchableOpacity>



                                    <TouchableOpacity
                                        style={[styles.freeBtn, {
                                            backgroundColor: '#FFFFFF',
                                            borderColor: !isShowCountdownNumMMSS ? '#25AAE1' : '#B7B7B7',
                                        }]}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                        onPress={() => {
                                            !isShowCountdownNumMMSS && (
                                                smsType == 2 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                            )
                                            if (smsType == 2) {
                                                window.PiwikMenberCode('Verification', 'Click', 'Sendcode_Voice_ProfilePage')
                                            }
                                        }}>
                                        <Text style={[styles.freeBtnText, {
                                            color: !isShowCountdownNumMMSS ? '#25AAE1' : '#B7B7B7'
                                        }]}>
                                            {
                                                smsType == 1 ? 'ส่งรหัส OTP ทางโทรศัพท์' : 'ส่งรหัส OTP ทาง SMS'
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    }



                    <TouchableOpacity
                        style={[
                            {
                                marginTop: 10,
                                alignItems: 'center',
                                width,
                                width: width - 20,
                                marginHorizontal: 10,
                                height: 40,
                                borderRadius: 4,
                                justifyContent: 'center'
                            }
                        ]}
                        onPress={() => {
                            Actions.pop()
                        }}
                    >
                        <Text style={[styles.changeWayText, { color: '#25AAE1' }]}>ยืนยันภายหลัง</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    }
}

export default Verification = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            liveChatData: state.liveChatData
        }
    }, (dispatch) => {
        return {
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(VerificationContainer)

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#fff',
        flex: 1
    },
    resetCodeText1: {
        textAlign: 'center',
        marginTop: 10
    },
    resetCodeText2: {
        color: '#25AAE1',
        textDecorationLine: 'underline'
    },
    step2Text: {
        color: '#323232',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 30
    },
    errorText: {
        color: '#FF0000',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5
    },
    phonesupportBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#25AAE1',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 10,
        marginTop: 10,
    },
    phonesupportBoxImg: {
        width: 30,
        height: 30,
        marginRight: 0
    },
    phonesupportBoxText: {
        color: '#25AAE1',
        fontSize: 12,
        flexWrap: 'wrap'
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
        width: 44,
        height: 44,
        textAlign: 'center'
    },
    circleText: {
        color: '#01633C'
    },
    circleLine: {
        height: 2,
        backgroundColor: '#fff',
        width: width / 2,
        position: 'absolute',
    },
    circleLine1: {
        right: -20,
    },
    circleLine2: {
        left: -20,
    },
    numPageWrap: {
        position: 'relative',
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 5
    },
    circleWrap: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 200,
        height: 34,
        width: 34,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#5ED0FF',
        borderWidth: 5,
        zIndex: 4
    },
    backConatinerText: {
        color: '#25AAE1',
        fontWeight: 'bold'
    },
    backConatiner: {
        // position: 'absolute',
        // bottom: 15,
        flexDirection: 'row',
        width: .3 * width,
        marginHorizontal: .35 * width,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        marginTop: 45
    },
    backConatiner1: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        width: .3 * width,
        marginHorizontal: .35 * width,
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
    },
    serchBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    phoneInforText: {
        color: '#25AAE1',
        fontSize: 12,
        marginTop: 10
    },
    inputBtn: {
        height: 46,
        backgroundColor: '#25AAE1',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    nameBox: {
        backgroundColor: '#25AAE1',
        paddingTop: Platform.OS === 'ios' ? 45 : 30,
        position: 'relative',
        paddingHorizontal: 20
    },
    homeTitle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    nameCircleBox: {
        position: 'absolute',
        backgroundColor: '#25AAE1',
        bottom: width * .9,
        borderRadius: 300,
        transform: [{ scale: 3 }],
        width: width,
        height: width,
        zIndex: -4
    },
    inputBox: {
        marginHorizontal: 10,
    },
    boclkInforText: {
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 5
    },
    phoneTopBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44
    },
    phoneHeadBox: {
        height: 44,
        width: 44,
        backgroundColor: '#EFEFEF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    phoneHeadBoxText: {
        color: '#636363'
    },
    inputBase: {
        height: 44,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        paddingLeft: 15,
        borderColor: '#B7B7B7',
    },
    homeIdentification: {
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        height: 55
    },
    homeIdentificationname: {
        width: 80,
    },
    homeIdentificationphone: {
        width: 50,
    },
    homeIdentificationemail: {
        width: 100,
    },
    homeIdentificationbouns: {
        width: 70,
        height: 80
    },
    homeIdentificationbettingBouns: {
        width: 70,
        height: 80
    },
    homeTextWrap: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12
    },
    bounsText: {
        color: '#232323',
        fontWeight: 'bold'
    },
    bounsGameBox: {
        // backgroundColor: '#EAEAEA',
        marginBottom: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    bounsGameBox1: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (width - 20),
        height: (width - 20) * .24,
    },
    voiceBg: {
        width,
        height: width * .6
    },
    limitListsInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 14,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        borderColor: '#B7B7B7',
    },
    freeBtn: {
        height: 42,
        backgroundColor: '#25AAE1',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    verificationTextTip1: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#323232',
        fontSize: 12
    },
    verificationTextTip2: {
        fontWeight: 'normal',
        marginTop: 4,
    },
    verificationTextTip3: {
        textAlign: 'center',
        marginTop: 10
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
    successText: {
        color: '#00C507',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 15
    },
    verificationTextTip4: {
        color: '#16A9E4'
    },
    homeCsWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    homeCSImg: {
        width: 28,
        height: 28
    },
})