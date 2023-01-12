import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ScrollView, Platform, ImageBackground, Modal } from 'react-native'
import { getMemberInforAction } from './../../../actions/ReducerAction'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { maskPhone, maskEmail } from './../../../actions/Reg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const { width, height } = Dimensions.get('window')

class ResetPasswordVerificationContainer extends React.Component {
    constructor(props) {
        super(props)
        let phoneEmailCodeLength = 6
        this.state = {
            verificationType: this.props.verificationType,
            pageTitleStatus: this.props.pageTitleStatus,
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
            phoneEmailCodeLength,
            phoneEmailStep: 0,
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
            countdownNum: this.props.verificationType === 'email' ? 600 : 300,
            countdownNumMMSS: '',
            isShowCountdownNumMMSS: false,
            verifyCodeErr: false,
            pageInfor: {
                pageTitle: {
                    email: 'ยืนยันข้อมูลอีเมล',
                    phone: 'ยืนยันข้อมูลเบอร์โทรศัพท์',
                },
                img: {
                    email: require('./../../../images/common/verificationIcon/fillEmail.png'),
                    phone: require('./../../../images/common/verificationIcon/fillPhone1.png'),
                },
                title: {
                    email: 'ยืนยันรหัส OTP',
                    phone: 'ยืนยันรหัส OTP',
                },
                text: {
                    email: 'เพื่อความปลอดภัยของบัญชีคุณโปรดทำตามคำแนะนำด้านล่าง เพื่อยืนยันอีเมลของคุณ',
                    phone: 'เพื่อความปลอดภัยของบัญชี กรูณาทำการยืนยันข้อมูลเบอร์โทรศัพท์ ตามขั้นตอนที่กำหนด',
                }
            },
            phoneEmailSteps: false,
            message: '',
            verificationTimes: '',
            smsType: 1,
            isShowModal: false,
            verificationStatus: 0
        }
    }

    componentDidMount() {
        Toast.hide()
        const { verificationType, pageInfor } = this.state
        this.props.navigation.setParams({
            title: pageInfor.pageTitle[verificationType]
        })
        this.getMemberContact(this.props.memberInforData)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.memberInforData) {
            this.getMemberContact(nextProps.memberInforData)
        }
    }

    componentWillUnmount() {
        this.intervalNum && clearInterval(this.intervalNum)
    }

    getMemberContact(memberInforData) {
        let memberInfor = memberInforData
        let contacts = memberInfor.Contacts || memberInfor.contacts
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
            memberCode: memberInfor.MemberCode
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


    getVerificationAttempt(channelType) {
        // fetchRequest(ApiPort.GetVerificationAttempt + 'serviceAction=OTP&channelType=SMS&', 'GET').then(data => {

        // }).catch(() => { })
        // fetchRequest(ApiPort.GetVerificationAttempt + 'serviceAction=OTP&channelType=Voice&', 'GET').then(data => {

        // }).catch(() => { })
        fetchRequest(ApiPort.GetVerificationAttempt + `serviceAction=Revalidate&channelType=${channelType}&`, 'GET').then(data => {
            this.setState({
                verificationTimes: data.remainingAttempt
            })
        }).catch(() => { })
    }

    getPhoneVerifyCode(smsType) {
        const { phone, memberCode, memberInfor } = this.state

        this.setState({
            verificationTimes: '',
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
            verificationTimes: ''
        })
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            IsOneTimeService: false,
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,
            ServiceAction: 'Revalidate',
        }
        this.getVerificationAttempt('SMS')
        Toast.loading('ยอดเงินไม่เพียงพอ', 2000)
        fetchRequest(ApiPort.GetPhoneVerifyCode, 'POST', data).then(res => {
            this.catchVerifyCode(true, res, smsType)
            return
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    phoneEmailStep: 1
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                Toast.fail(res.result.message)
            }
        }).catch(err => {
            Toast.hide()
        })

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
            verificationTimes: ''
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'Revalidate',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('ยอดเงินไม่เพียงพอ', 2000)
        fetchRequest(ApiPort.PostPhoneVerifyCode, 'POST', data).then(res => {
            Toast.hide()
            this.catchVerifyCode(false, res)
            return
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                this.intervalNum && clearInterval(this.intervalNum)
                Toast.success('การอัปเดตสำเร็จ', 1.5)
                this.setState({
                    phoneEmailStep: 2
                })
                this.clearEmailPhoneCode()
            } else {
                this.clearEmailPhoneCode()
                this.setState({
                    verifyCodeErr: true
                })
            }
        }).catch(err => {
            Toast.hide()
        })
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
            verificationTimes: ''
        })
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'Revalidate',
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,

            IsOneTimeService: false,
        }
        this.getVerificationAttempt('Voice')
        Toast.loading('ยอดเงินไม่เพียงพอ', 20000)
        fetchRequest(ApiPort.PostVoiceMessageVerify, 'POST', data).then(res => {
            this.catchVerifyCode(true, res, smsType)
        }).catch(err => {
            Toast.hide()
        })
    }

    catchVerifyCode(flag, res, smsType) {
        const { IsQueleaRegistered } = this.state
        Toast.hide()
        if (flag) {
            this.clearEmailPhoneCode()
            if (res.isSuccess) {
                this.setState({
                    phoneEmailSteps: true,
                    countdownNum: this.props.verificationType === 'email' ? 600 : 300,
                    smsType,
                    verificationStatus: 0
                    //verificationTimes: 3
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                let result = res.result
                if (result) {
                    let resendCounter = result.resendCounter
                    if (resendCounter == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType: this.props.verificationType,
                            fromPage: 'otpRevalidate'
                        })
                    }

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

                Toast.success('ยืนยันสำเร็จ', 3, () => {
                    // Actions.pop()
                    // Actions.ChangePasswordRE()
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
                    let message = result.message || result.errorMessage
                    let errorCode = result.errorCode || ''
                    let remainingAttempt = result.remainingAttempt






                    if (remainingAttempt == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType: this.props.verificationType,
                            fromPage: 'otpRevalidate'
                        })
                    }

                    message && Toast.fail(message, 2)



                    if (errorCode) {
                        this.setState({
                            message: message
                        })
                    } else {
                        // let verificationTimes = message.match(/[0-9]/g)
                        // if (Array.isArray(verificationTimes) && verificationTimes.length) {
                        //     this.setState({
                        //         verificationTimes: verificationTimes[0]
                        //     })
                        // }

                        // let errorMessage = message.split('.') || []
                        this.setState({
                            verificationTimes: result.remainingAttempt
                        })
                        this.setState({
                            message: 'Mã xác thực không chính xác, vui lòng kiểm tra lại và chắc chắn bạn nhập đúng mã số được cung cấp.'
                        })
                    }
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
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0,
            verificationTimes: '',
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'Revalidate',// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('ยอดเงินไม่เพียงพอ', 2000)
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

    getEmailVerifyCode() {
        let { email, memberCode } = this.state
        this.setState({
            verificationStatus: 0
        })
        let params = {
            'emailVerificationServiceType': 'Revalidate',
            'memberCode': memberCode,
            'email': email,
            'ipAddress': '',
            'SiteId': Platform.OS === 'android' ? 16 : 17,
        }
        Toast.loading('ยอดเงินไม่เพียงพอ', 20000)
        this.getVerificationAttempt('Email')
        fetchRequest(ApiPort.GetEmailVerifyCode, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    phoneEmailStep: 1,
                    phoneEmailSteps: true
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                this.setState({
                    phoneEmailSteps: false
                })
                let result = res.result
                if (result) {
                    let resendCounter = result.resendCounter
                    if (resendCounter == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType: this.props.verificationType,
                            fromPage: 'otpRevalidate'
                        })
                    }

                    let message = result.message || result.errorMessage
                    message && Toast.fail(message, 2)
                }

            }
        }).catch(err => {
            Toast.hide()
        })
    }

    sendEmailVerifyCode() {
        const { countdownNum, phoneStatus, emailStatus, email, phoneEmailCodeArr, memberCode, phoneEmailCodeLength } = this.state
        this.setState({
            verificationStatus: 0
        })
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
            'serviceAction': 'Revalidate', // VerifyAndUpdate   Revalidate
            'TAC': phoneEmailCodeArr.join(''), // encryptedLink
            'memberCode': memberCode,
            'email': email,
            'ipAddress': ''
        }
        Toast.loading('ยอดเงินไม่เพียงพอ', 20000)
        fetchRequest(ApiPort.PostEmailVerifyTac, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                // this.props.getMemberInforAction()
                // this.intervalNum && clearInterval(this.intervalNum)
                // Toast.success('การอัปเดตสำเร็จ', 2)
                // this.setState({
                //     phoneEmailStep: 2,
                //     verificationStatus: 1
                // })
                // this.clearEmailPhoneCode()

                this.props.getMemberInforAction()
                this.intervalNum && clearInterval(this.intervalNum)
                this.setState({
                    verificationStatus: 1,
                    phoneEmailStep: 2,
                })

                Toast.success('ยืนยันสำเร็จ', 3, () => {
                    // Actions.pop()
                    // Actions.ChangePasswordRE()
                })
            } else {
                this.setTimeoutHide = setTimeout(() => {
                    this.clearEmailPhoneCode()
                }, 1500)
                // this.clearEmailPhoneCode()
                this.setState({
                    verifyCodeErr: true,
                    verificationStatus: 2,
                    verificationTimes: res.result.remainingAttempt
                })

                let result = res.result
                let errorCode = result.errorCode || ''
                let remainingAttempt = result.remainingAttempt
                if (remainingAttempt == 0) {
                    Actions.PhoneEmailErrorModal({
                        fillType: this.props.verificationType,
                        fromPage: 'otpRevalidate'
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    makeNumInterval() {
        clearInterval(this.intervalNum)
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
                    countdownNum: this.props.verificationType === 'email' ? 600 : 300,
                    phoneEmailStep: 0,
                    emailPhoneCodeArr: Array.from({ length: this.state.phoneEmailCodeLength }, v => ''),
                    isShowCountdownNumMMSS: false,
                    verifyCodeErr: false,
                    message: '',
                    verificationTimes: '',
                    verificationStatus: 0,
                    message: '',
                    isShowPhoneBtn: false,
                    verificationStatus: 0,
                    verificationTimes: ''
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
                [`phoneEmailCode${i}`]: '',
                verificationStatus: 0
            })
        }
        this.setState({
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
        })
    }

    render() {
        const { countdownNum, phoneEmailCodeLength, isShowModal, smsType,
            verificationStatus,
            verificationTimes,
            phoneEmailSteps,
            message, verifyCodeErr, isShowCountdownNumMMSS, pageInfor, verificationType, phoneEmailStep, phoneEmailCodeArr, phone, email, countdownNumMMSS } = this.state
        // let phoneEmailSteps = true
        // let verificationStatus = 0
        console.log(verificationStatus)
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
            <KeyboardAwareScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    true
                        ?
                        <ImageBackground source={require('./../../../images/common/verificationIcon/voiceBg.png')} resizeMode='stretch' style={styles.voiceBg}>
                            <View style={[styles.nameBox, { backgroundColor: 'transparent' }]}>
                                <Text style={[styles.homeTitle]}>{pageInfor.pageTitle[verificationType]}</Text>
                                <View alignItems='center'>
                                    <Image resizeMode='stretch' source={pageInfor.img[verificationType]} style={[styles.homeIdentification, styles[`homeIdentification${verificationType}`]]}></Image>
                                </View>
                                <View>
                                    <Text style={[styles.homeTextWrap, { fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>{pageInfor.title[verificationType]}</Text>
                                    <Text style={[styles.homeTextWrap]}>{pageInfor.text[verificationType]}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                        :
                        <View style={[styles.nameBox, { backgroundColor: window.isBlue ? '#00AEEF' : '#212121' }]}>
                            <Text style={[styles.homeTitle]}>{pageInfor.pageTitle[verificationType]}</Text>
                            <View alignItems='center'>
                                <Image resizeMode='stretch' source={pageInfor.img[verificationType]} style={[styles.homeIdentification, styles[`homeIdentification${verificationType}`]]}></Image>
                            </View>
                            <View>
                                <Text style={[styles.homeTextWrap, { fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>{pageInfor.title[verificationType]}</Text>
                                <Text style={[styles.homeTextWrap]}>{pageInfor.text[verificationType]}</Text>
                            </View>
                            <View style={[styles.nameCircleBox, { backgroundColor: window.isBlue ? '#00AEEF' : '#212121' }]}></View>
                        </View>
                }


                {
                    verificationType == 'phone' && <View style={[styles.inputBox]}>
                        <View>
                            <Text style={styles.boclkInforText}>เบอร์โทรศัพท์</Text>
                            {
                                phone.length > 0 && <View style={[styles.phoneTopBox]}>
                                    <View style={[styles.phoneHeadBox]}>
                                        <Text style={[styles.phoneHeadBoxText]}>+{66}</Text>
                                    </View>
                                    <TextInput
                                        style={[styles.limitListsInput, { width: width - 20 - 40 - 10, borderWidth: 0, backgroundColor: '#EFEFEF', color: '#636363' }]}
                                        autoComplete='username'
                                        maxLength={20}
                                        textContentType='username'
                                        value={maskPhone(phone.includes('-') ? phone.split('-')[1] : phone)}
                                        autoCapitalize='none'
                                        editable={false}
                                    />
                                </View>
                            }
                        </View>

                        <TouchableOpacity style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38', marginBottom: 15 }]} onPress={() => {
                            Actions.LiveChat()
                            window.PiwikMenberCode('CS_emailverification')
                        }}>
                            <Image source={require('./../../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                            <Text style={[styles.phonesupportBoxText, { width: width - 80 }]}>กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ หากคุณต้องการเปลี่ยนแปลงข้อมูลเบอร์โทรศัพท์ที่ลงทะเบียน</Text>
                        </TouchableOpacity>


                        {
                            !phoneEmailSteps && <View>
                                <TouchableOpacity style={[styles.freeBtn, { backgroundColor: '#25AAE1' }]} onPress={this.getPhoneVerifyCode.bind(this, 1)}>
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
                                    //     111
                                    //         {
                                    //             isShowCountdownNumMMSS ? `${smsType == 1 ? `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที` : `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที`}` : `${smsType == 1 ? 'ส่งรหัสอีกครั้ง' : 'โทรอีกครั้ง '}`
                                    //         }
                                    //     </Text>
                                    // </TouchableOpacity>
                                }

                                <View>
                                    <Text style={styles.verificationTextTip1}>กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรศัพท์ของคุณ </Text>
                                    <Text style={[styles.verificationTextTip1, { marginHorizontal: 25, marginTop: 10 }]}>
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
                                    //  verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={styles.verificationTextTip3}>Bạn còn (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) lần thử lại.</Text>
                                }

                                {
                                    verificationStatus == 1 && <TouchableOpacity
                                        style={[styles.inputBtn, { marginTop: 80 }]}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                        onPress={() => {
                                            Actions.ChangePasswordRE({
                                                isRelate: true
                                            })
                                        }}>
                                        <Text style={styles.serchBtnText}>ถัดไป</Text>
                                    </TouchableOpacity>
                                }

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

                                        {
                                            phoneEmailSteps && verificationStatus != 1 &&
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
                                                        isShowCountdownNumMMSS ? `${smsType == 1 ? `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที` : `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที`}` : `${smsType == 1 ? 'ส่งรหัสอีกครั้ง' : 'โทรอีกครั้ง '}`
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        }

                                        <TouchableOpacity
                                            style={[styles.freeBtn, {
                                                backgroundColor: '#FFFFFF',
                                                borderColor: !isShowCountdownNumMMSS ? '#25AAE1' : '#B7B7B7'
                                            }]}
                                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                            onPress={() => {
                                                !isShowCountdownNumMMSS && (
                                                    smsType == 2 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                                )
                                            }}>
                                            <Text style={[styles.freeBtnText, {
                                                color: !isShowCountdownNumMMSS ? '#25AAE1' : '#B7B7B7',
                                            }]}>
                                                {
                                                    smsType == 1 ? 'ส่งรหัส OTP ทางโทรศัพท์' : 'ส่งรหัส OTP ทาง SMS'
                                                }
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.changeWay1, { marginTop: 15 }]}
                                            onPress={() => {
                                                Actions.pop()
                                            }}
                                        >
                                            <Text style={styles.changeWayText}>เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                }

                {
                    verificationType === 'email' && <View style={[styles.inputBox, { marginTop: 10 }]}>
                        {
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
                        }

                        <TouchableOpacity style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38', marginBottom: 0 }]} onPress={() => {
                            Actions.LiveChat()
                            window.PiwikMenberCode('CS_emailverification')
                        }}>
                            <Image source={require('./../../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                            <Text style={[styles.phonesupportBoxText, { width: width - 80 }]}>กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ หากคุณต้องการเปลี่ยนแปลงข้อมูลอีเมลที่ลงทะเบียน​</Text>
                        </TouchableOpacity>


                        {
                            !phoneEmailSteps && <View>
                                <TouchableOpacity
                                    style={[styles.inputBtn, { backgroundColor: '#32C85D' }]}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    onPress={() => {
                                        this.getEmailVerifyCode()
                                    }}
                                >
                                    <Text style={styles.serchBtnText}>ส่ง</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            phoneEmailSteps && <View>
                                <Text style={[styles.step2Text, { marginTop: 10, marginBottom: 15 }]}>กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมลของคุณ</Text>
                                <Text style={styles.step2Text}> หมายเหตุ: หากคุณไม่ได้รับรหัส OTP ภายใน 10 นาที กรุณาคลิกที่ "ส่งรหัสอีกครั้ง" เพื่อรับรหัส OTP ใหม่</Text>
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
                                    // verifyCodeErr && <Text style={styles.errorText}>Mã OTP không trùng khớp với hệ thống cung cấp.</Text>
                                }

                                {
                                    //verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={styles.verificationTextTip3}>Bạn còn (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) lần thử lại.</Text>
                                }

                                {
                                    // isShowCountdownNumMMSS && <Text style={[styles.resetCodeText1, { color: window.isBlue ? '#000' : '#fff' }]}>Gửi lại trong vòng {countdownNumMMSS} <Text style={[styles.resetCodeText2, { color: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1' }]}>GỬI LẠI MÃ</Text></Text>
                                }


                                {
                                    phoneEmailStep !== 2 && <View>
                                        <TouchableOpacity
                                            style={[styles.freeBtn, {
                                                backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7',
                                                borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7'
                                            }]}
                                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                            onPress={() => {
                                                phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength && this.sendEmailVerifyCode()
                                            }}
                                        >
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
                                                    isShowCountdownNumMMSS ? `รหัส OTP จะถูกส่งภายใน ${countdownNumMMSS} นาที` : 'ส่งรหัสอีกครั้ง'
                                                }
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.changeWay1, { marginTop: 15 }]}
                                            onPress={() => {
                                                Actions.pop()
                                            }}
                                        >
                                            <Text style={styles.changeWayText}>เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                                        </TouchableOpacity>
                                    </View>
                                }



                                {
                                    phoneEmailStep === 2 && <TouchableOpacity
                                        style={styles.inputBtn}
                                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                        onPress={() => {
                                            Actions.ChangePasswordRE({
                                                isRelate: true
                                            })
                                        }}>
                                        <Text style={styles.serchBtnText}>ถัดไป</Text>
                                    </TouchableOpacity>
                                }


                            </View>
                        }

                        {
                            // phoneEmailStep === 2 && <View style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38' }]}>
                            //     <Image source={require('./../../../images/account/resetPasswordVerification.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                            //     <Text style={styles.phonesupportBoxText}>Correct OTP. Please click 'Next' to change youraccount password.</Text>
                            // </View>
                        }
                    </View>
                }

                {
                    // verificationType === 'phone' && phoneEmailSteps && verificationType !== 'email' && 
                    // phoneEmailSteps && verificationStatus != 1 &&
                    // <TouchableOpacity
                    //     style={[styles.changeWay1]}
                    //     onPress={() => {
                    //         Actions.pop()
                    //     }}
                    // >
                    //     <Text style={styles.changeWayText}>1111   เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                    // </TouchableOpacity>
                }
            </KeyboardAwareScrollView>
            {
                verificationType === 'email' && <View style={styles.resetBtnBox}>

                    {
                        // phoneEmailStep === 1 && <TouchableOpacity
                        //     style={styles.inputBtn}
                        //     hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        //     onPress={() => {
                        //         this.sendEmailVerifyCode()
                        //     }}
                        // >
                        //     <Text style={styles.serchBtnText}>Xác Nhận</Text>
                        // </TouchableOpacity>
                    }
                    {
                        // phoneEmailStep === 2 && <TouchableOpacity
                        //     style={styles.inputBtn}
                        //     hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        //     onPress={() => {
                        //         Actions.ChangePasswordRE()
                        //     }}>
                        //     <Text style={styles.serchBtnText}>Tiếp Theo</Text>
                        // </TouchableOpacity>
                    }
                    {
                        // phoneEmailStep !== 2 && <TouchableOpacity style={styles.backConatiner} onPress={() => { Actions.pop() }}>
                        //     <Text style={styles.backConatinerText}>Xác Thực Sau</Text>
                        // </TouchableOpacity>
                    }
                </View>
            }

            {
                // !(verificationType === 'phone' && phoneEmailSteps) && verificationType !== 'email' && 
                !phoneEmailSteps &&
                <TouchableOpacity
                    style={[styles.changeWay]}
                    onPress={() => {
                        Actions.pop()
                    }}
                >
                    <Text style={styles.changeWayText}>เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                </TouchableOpacity>
            }
        </View>
    }
}

export default ResetPasswordVerification = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction())
        }
    }
)(ResetPasswordVerificationContainer)

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
        color: '#00AEEF',
        textDecorationLine: 'underline'
    },
    step2Text: {
        color: '#323232',
        fontSize: 12,
        textAlign: 'center',
        width: width - 80,
        marginHorizontal: 30
    },
    errorText: {
        color: '#FF0000',
        marginTop: 10,
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: 'bold'
    },
    phonesupportBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#00AEEF',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 6
    },
    phonesupportBoxImg: {
        width: 30,
        height: 24,
        marginRight: 8
    },
    phonesupportBoxText: {
        color: '#00AEEF',
        fontSize: 12,
        width: width - 80
    },
    phoneInputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 25
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
        color: '#00AEEF',
        fontWeight: 'bold'
    },
    resetBtnBox: {
        position: 'absolute',
        bottom: 30,
        width,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    backConatiner: {
        flexDirection: 'row',
        width,
        alignItems: 'center',
        height: 45,
        justifyContent: 'center'
    },
    serchBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    phoneInforText: {
        color: '#00AEEF',
        fontSize: 12,
        marginTop: 10
    },
    inputBtn: {
        height: 38,
        backgroundColor: '#00AEEF',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        width: width - 20
    },
    nameBox: {
        backgroundColor: '#00AEEF',
        position: 'relative',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 45 : 30,
    },
    homeTitle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    nameCircleBox: {
        position: 'absolute',
        backgroundColor: '#00AEEF',
        bottom: width * .9,
        borderRadius: 300,
        transform: [{ scale: 3 }],
        width: width,
        height: width,
        zIndex: -4
    },
    inputBox: {
        marginHorizontal: 10,
        marginTop: 10
    },
    boclkInforText: {
        fontWeight: 'bold',
        marginBottom: 10
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
        marginBottom: 10,
        marginTop: 10,
        height: 55
    },
    homeIdentificationphone: {
        width: 50,
    },
    homeIdentificationemail: {
        width: 100,
    },
    homeTextWrap: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12
    },
    voiceBg: {
        width,
        height: width * .6
    },
    freeBtn: {
        height: 40,
        backgroundColor: '#25AAE1',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    changeWay: {
        position: 'absolute',
        height: 40,
        left: 0,
        right: 0,
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    changeWay1: {
        // position: 'absolute',
        // height: 40,
        // left: 0,
        // right: 0,
        // bottom: 10,
        marginTop: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    changeWayText: {
        textAlign: 'center',
        color: '#25AAE1',
        fontSize: 15
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
    verificationTextTip1: {
        textAlign: 'center',
        color: '#323232',
        fontSize: 12
    },
    verificationTextTip2: {
        fontWeight: 'normal',
        marginTop: 4,
    },
    verificationTextTip3: {
        textAlign: 'center',
        marginBottom: 10,
        marginTop: 5
    },
    verificationTextTip4: {
        color: '#16A9E4'
    },
    successText: {
        color: '#00C507',
        textAlign: 'center',
        fontStyle: 'italic',
        fontSize: 12,
        fontWeight: 'bold'
    },
})