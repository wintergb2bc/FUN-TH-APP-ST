import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ImageBackground, Modal, BackHandler, Platform } from 'react-native'
import { getMemberInforAction, getBalanceInforAction } from '../../actions/ReducerAction'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { maskPhone, maskEmail } from '../../actions/Reg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DeviceInfo from 'react-native-device-info'
import { IphoneXMax } from './../Common/CommonData'

const getModel = DeviceInfo.getModel()
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'
const { width, height } = Dimensions.get('window')
class LoginOtpPageContainer extends React.Component {
    constructor(props) {
        super(props)
        let fillType = this.props.fillType
        let loginOtpPage = this.props.loginOtpPage
        let phoneEmailCodeLength = 6
        this.state = {
            fillType,
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
            countdownNum: this.props.fillType === 'email' ? 600 : 300,
            countdownNumMMSS: '',
            isShowCountdownNumMMSS: false,
            message: '',
            verificationTimes: '',
            isShowModal: false,
            IsQueleaRegistered: false,
            loginOTP: true,
            smsType: ''
        }
    }

    componentDidMount() {
        this.getMemberContact(this.props.memberInforData)

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.memberInforData) {
            this.getMemberContact(nextProps.memberInforData)
        }
    }

    componentWillUnmount() {
        const { loginOTP } = this.state
        this.intervalNum && clearInterval(this.intervalNum)
        this.setTimeoutHide && clearTimeout(this.setTimeoutHide)

        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
        } else {
            if (loginOTP) {
                this.props.changeLoginOtpStatus(true)
            }
        }
    }

    onBackButtonPressAndroid = () => {
        this.props.navigation.setParams({
            showDialog: false
        })
        return true
    }

    getMemberContact(memberInfor) {
        let contacts = memberInfor.Contacts || memberInfor.contacts
        if (memberInfor && contacts && contacts.length) {
            let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
            let phone = tempPhone ? tempPhone.Contact : ''
            let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
            let email = tempEmail ? tempEmail.Contact : ''
            let IsQueleaRegistered = memberInfor.IsQueleaRegistered
            const loginOTP = memberInfor.loginOTP || memberInfor.LoginOTP
            this.setState({
                memberInfor,
                phone,
                email,
                memberCode: memberInfor.MemberCode,
                IsQueleaRegistered,
                loginOTP
            })
        }
    }

    changePhoneInput(i, val) {
        let v = val.replace(/[^0-9]/g, '')
        // this.refs[`focus${i}`].blur()
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
        fetchRequest(ApiPort.GetVerificationAttempt + `serviceAction=OTP&channelType=${channelType}&`, 'GET').then(data => {
            this.setState({
                verificationTimes: data.remainingAttempt
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
            ServiceAction: 'OTP',
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,

            IsOneTimeService: false,
        }
        this.getVerificationAttempt('SMS')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 20000)
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
            ServiceAction: 'OTP',
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,

            IsOneTimeService: false,
        }
        this.getVerificationAttempt('Voice')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 20000)
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
            Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
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
            ServiceAction: 'OTP',// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000)
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
            Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
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
            ServiceAction: 'OTP',// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 2000)
        fetchRequest(ApiPort.PostPhoneVerifyCode, 'POST', data).then(res => {
            this.catchVerifyCode(false, res)
        }).catch(err => {
            Toast.hide()
        })

        window.PiwikMenberCode('Freebet_SubmitOTP')
    }

    getEmailVerifyCode() {
        let { email, memberCode } = this.state
        this.setState({
            message: '',
            verificationStatus: 0,
            verificationTimes: ''
        })
        let params = {
            'emailVerificationServiceType': 'OTP',
            // 'memberCode': memberCode,
            // 'email': email,
            // 'ipAddress': '',
            // 'SiteId': Platform.OS === 'android' ? 16 : 17,
        }
        this.getVerificationAttempt('Email')
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 20000)
        fetchRequest(ApiPort.GetEmailVerifyCode, 'POST', params).then(res => {
            this.catchVerifyCode(true, res)
        }).catch(err => {
            Toast.hide()
        })



        window.PiwikMenberCode('Verification', 'Click', 'SendCode_Email_LoginOTP')
    }

    sendEmailVerifyCode() {
        const { email, phoneEmailCodeArr, memberCode, phoneEmailCodeLength, countdownNum } = this.state
        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            Toast.fail('กรุณากรอกรหัส OTP ', 2)
            return
        }
        if (countdownNum <= 0) {
            Toast.fail('รหัส OTP นี้หมดอายุการใช้งานแล้ว กรุณาคลิกเพื่อขอรับรหัส OTP อีกครั้ง​', 1.5)
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
            'serviceAction': 'OTP', // VerifyAndUpdate   Revalidation
            'TAC': phoneEmailCodeArr.join(''), // encryptedLink
            'memberCode': memberCode,
            'email': email,
            'ipAddress': ''
        }
        Toast.loading('กำลังส่ง, กรุณารอสักครู่', 20000)
        fetchRequest(ApiPort.PostEmailVerifyTac, 'POST', params).then(res => {
            this.catchVerifyCode(false, res)
        }).catch(err => {
            Toast.hide()
        })




        window.PiwikMenberCode('Verification', 'Submit', 'Verify_Email_LoginOTP')

    }

    catchVerifyCode(flag, res, smsType) {
        const { IsQueleaRegistered } = this.state
        Toast.hide()
        if (flag) {
            this.clearEmailPhoneCode()
            if (res.isSuccess) {
                this.setState({
                    phoneEmailStep: true,
                    countdownNum: this.props.fillType === 'email' ? 600 : 300,
                    smsType
                    //verificationTimes: 3
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                let result = res.result

                let errorCode = (result.errorCode || '')
                if (errorCode.toLocaleUpperCase() == 'SMS004') {
                    this.setState({
                        isShowModal: true
                    })
                    return
                }


                if (result) {
                    let resendCounter = result.resendCounter
                    if (resendCounter == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType: this.props.fillType,
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

                let result = res.result
                if (result) {
                    if (IsQueleaRegistered) {
                        const { queleaReferreeStatus, queleaBonusEligible } = result
                        if (queleaReferreeStatus) {
                            this.PostThroughoutVerification()
                            return
                        } else { }
                        // if (!queleaReferreeStatus) {
                        //     Actions.pop()
                        //     this.props.changeFreebetQualificationsModal(true)
                        //     return
                        // }
                        // if (queleaReferreeStatus && queleaBonusEligible) {
                        //     Actions.pop()
                        //     Actions.FreeBetPage({
                        //         fillType: 'game'
                        //     })
                        //     return
                        // }
                        // if (queleaReferreeStatus && !queleaBonusEligible) {
                        //     Actions.pop()
                        //     this.props.changeDisplayReferee(true) // 推荐好友完成进度弹窗
                        //     return
                        // }
                    } else {
                        Toast.success('ยืนยันสำเร็จ', 3, () => {
                            Actions.pop()
                        })
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
                    let message = result.message || result.errorMessage
                    if (message) {
                        Toast.fail(message, 2)
                    }
                    let errorCode = result.errorCode || ''
                    let remainingAttempt = result.remainingAttempt
                    if (remainingAttempt == 0) {
                        Actions.PhoneEmailErrorModal({
                            fillType: this.props.fillType,
                            fromPage: 'otpRevalidate'
                        })
                    }
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

                        this.setState({
                            verificationTimes: result.remainingAttempt
                        })

                        //let errorMessage = message.split('.') || []
                        this.setState({
                            message: 'Mã xác thực không chính xác, vui lòng kiểm tra lại và chắc chắn bạn nhập đúng mã số được cung cấp.'
                        })
                    }
                }
            }
        }
    }

    PostThroughoutVerification() {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
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
        })
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
        const { smsType, isShowModal, email, verificationTimes, loginOtpPage, fillType, verificationStatus,
            isShowPhoneBtn, phoneEmailCodeLength, message, isShowCountdownNumMMSS, phoneEmailStep, phoneEmailCodeArr, phone, countdownNumMMSS, countdownNum } = this.state
        console.log(this.props)
        return <View style={[styles.viewContainer]}>
            <KeyboardAwareScrollView>
                <ImageBackground
                    source={require('./../../images/freeBet/freebetContactTopBg.png')}
                    resizeMode='stretch'
                    style={[styles.freebetContactTopBg]}
                >
                    <View>
                        <View style={styles.freeTopInfor}>
                            <Text style={styles.freeTopInforText}>{loginOtpPage.title}</Text>
                        </View>
                        <View style={styles.freeTopBody}>
                            <Image
                                source={loginOtpPage.img}
                                resizeMode='stretch'
                                style={styles[`free${fillType}`]}
                            ></Image>
                            <Text style={styles.freePhoneText1}>ยืนยันรหัส OTP</Text>
                            <Text style={styles.freePhoneText2}>{loginOtpPage.text}</Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={[styles.viewPageContainer]}>
                    {
                        fillType == 'phone' && <View>
                            <View>
                                <Text style={styles.boclkInforText}>เบอร์โทรศัพท์</Text>
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
                                            value={maskPhone(phone.includes('-') ? phone.split('-')[1] : phone)}
                                            autoCapitalize='none'
                                            editable={false}
                                        />
                                    </View>
                                }
                            </View>

                            <TouchableOpacity style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38' }]} onPress={() => {
                                Actions.LiveChat()
                                window.PiwikMenberCode('CS_emailverification')
                            }}>
                                <Image source={require('./../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                                <Text style={[styles.phonesupportBoxText, { width: width - 80 }]}>กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ หากคุณต้องการเปลี่ยนแปลงข้อมูลเบอร์โทรศัพท์ที่ลงทะเบียน</Text>
                            </TouchableOpacity>


                            {
                                !phoneEmailStep && <View>
                                    <TouchableOpacity style={[styles.freeBtn, { backgroundColor: '#25AAE1' }]} onPress={() => {
                                        this.getPhoneVerifyCode(1)

                                        window.PiwikMenberCode('Verification', 'Click', 'SendCode_SMS_LoginOTP')
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
                                phoneEmailStep && <View>
                                    <View style={{ marginTop: 8 }}>
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
                                        //message.length > 0 && <Text style={[styles.errorText, { color: verificationStatus == 0 ? '#FF0000' : (verificationStatus == 1 ? '#00C507' : '#FF0000'), marginBottom: 6 }]}>{message}</Text>
                                    }

                                    {
                                        // verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={styles.verificationTextTip3}>Bạn còn (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) lần thử lại.</Text>
                                    }

                                    {
                                        // verificationStatus == 1 && <Text style={styles.successText}>ยืนยันสำเร็จ</Text>
                                    }


                                </View>
                            }
                        </View>
                    }



                    {
                        fillType == 'email' && <View>
                            <View>
                                <Text style={styles.boclkInforText}>อีเมล</Text>
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
                                    </View>
                                }
                            </View>

                            <TouchableOpacity style={[styles.phonesupportBox, { backgroundColor: window.isBlue ? 'transparent' : '#002D38' }]} onPress={() => {
                                Actions.LiveChat()
                                window.PiwikMenberCode('CS_emailverification')
                            }}>
                                <Image source={require('./../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                                <Text style={[styles.phonesupportBoxText, { width: width - 80 }]}>กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ หากคุณต้องการเปลี่ยนแปลงข้อมูลอีเมลที่ลงทะเบียน​</Text>
                            </TouchableOpacity>


                            {
                                !phoneEmailStep && <View>
                                    <TouchableOpacity style={[styles.freeBtn, { backgroundColor: '#32C85D' }]} onPress={this.getEmailVerifyCode.bind(this, 1)}>
                                        <Text style={styles.freeBtnText}>ส่ง</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity style={[styles.freeBtn, { backgroundColor: 'transparent' }]} onPress={this.getEmailVerifyCode.bind(this, 2)}>
                                        <Text style={[styles.freeBtnText, { color: '#37C95D' }]}>Gửi Mã OTP qua Cuộc Gọi</Text>
                                    </TouchableOpacity> */}
                                </View>
                            }


                            {
                                phoneEmailStep && <View>
                                    <View>
                                        <Text style={styles.verificationTextTip1}>กรุณากรอกรหัส OTP ที่ส่งไปยังอีเมลของคุณ</Text>
                                        <Text style={[styles.verificationTextTip1, { marginHorizontal: 25, marginTop: 10 }]}>หมายเหตุ: หากคุณไม่ได้รับรหัส OTP ภายใน 10 นาที กรุณาคลิกที่ "ส่งรหัสอีกครั้ง" เพื่อรับรหัส OTP ใหม่</Text>
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
                                        //message.length > 0 && <Text style={[styles.errorText, { color: verificationStatus == 0 ? '#FF0000' : (verificationStatus == 1 ? '#00C507' : '#FF0000'), marginBottom: 6 }]}>{message}</Text>
                                    }

                                    {
                                        // verificationTimes != '' && verificationTimes * 1 == verificationTimes && <Text style={styles.verificationTextTip3}>Bạn còn (<Text style={styles.verificationTextTip4}>{verificationTimes}</Text>) lần thử lại.</Text>
                                    }

                                    {
                                        //verificationStatus == 1 && <Text style={styles.successText}>ยืนยันสำเร็จ</Text>
                                    }


                                </View>
                            }
                        </View>
                    }


                </View>



                {
                    fillType == 'phone' && phoneEmailStep && <View style={{
                        // position: 'absolute',
                        // bottom: 65,
                        width: width - 20,
                        marginHorizontal: 10,
                        marginTop: 40
                    }}>
                        {
                            verificationStatus !== 1 && <View>
                                <TouchableOpacity
                                    style={[styles.freeBtn, {
                                        backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7',
                                        borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7'
                                    }]}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    onPress={() => {
                                        this.PostVerificationCode(smsType)


                                        window.PiwikMenberCode('Verification', 'Submit', 'Verify_Phone_LoginOTP')
                                    }}>
                                    <Text style={styles.freeBtnText}>ทำการยืนยันตอนนี้</Text>
                                </TouchableOpacity>


                                {
                                    verificationStatus != 1 && <TouchableOpacity
                                        style={[styles.freeBtn, {
                                            backgroundColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1',
                                            borderColor: isShowCountdownNumMMSS ? '#B7B7B7' : '#25AAE1'
                                        }]}
                                        onPress={() => {
                                            !isShowCountdownNumMMSS && (
                                                smsType == 1 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                            )

                                            if (smsType == 2) {
                                                window.PiwikMenberCode('Login OTP', 'Click', 'SendCode_Voice_LoginOTP')
                                            }
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
                                        borderColor: !isShowCountdownNumMMSS ? '#25AAE1' : '#B7B7B7',
                                    }]}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    onPress={() => {
                                        !isShowCountdownNumMMSS && (
                                            smsType == 2 ? this.getPhoneVerifyCode(1) : this.PostVoiceMessageVerify(2)
                                        )
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

                {
                    fillType == 'email' && phoneEmailStep &&
                    <View style={{
                        // position: 'absolute',
                        // bottom: 65,
                        width: width - 20,
                        marginHorizontal: 10,
                        marginTop: 40
                    }}>
                        {
                            verificationStatus !== 1 && <View>
                                <TouchableOpacity
                                    style={[styles.freeBtn, {
                                        backgroundColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7',
                                        borderColor: (phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength) ? '#32C85D' : '#B7B7B7'
                                    }]}
                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                    onPress={this.sendEmailVerifyCode.bind(this)}>
                                    <Text style={styles.freeBtnText}>ทำการยืนยันตอนนี้</Text>
                                </TouchableOpacity>
                            </View>
                        }

                        {
                            verificationStatus != 1 && <TouchableOpacity
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
                        }
                    </View>
                }

                {

                    phoneEmailStep && <TouchableOpacity
                        style={[
                            {
                                color: '#25AAE1',
                                marginTop: 15,
                                alignItems: 'center',
                                width,
                            }
                        ]}
                        onPress={() => {
                            this.props.changeLoginOtpStatus(true)
                        }}
                    >
                        <Text style={styles.changeWayText}>เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                    </TouchableOpacity>
                }
            </KeyboardAwareScrollView>

            {

                !phoneEmailStep && <TouchableOpacity
                    style={[
                        {
                            color: '#25AAE1',
                            marginTop: 10,
                            position: 'absolute',
                            bottom: 35,
                            alignItems: 'center',
                            width
                        }
                    ]}
                    onPress={() => {
                        this.props.changeLoginOtpStatus(true)
                    }}
                >
                    <Text style={styles.changeWayText}>เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                </TouchableOpacity>
            }









            {
                // verificationStatus == 1
                //     ?
                //     <TouchableOpacity
                //         style={[
                //             {
                //                 color: '#25AAE1',
                //                 marginTop: 10,
                //                 //position: 'absolute',
                //                 bottom: 100,
                //                 alignItems: 'center',
                //                 width,
                //                 backgroundColor: '#25AAE1',
                //                 width: width - 20,
                //                 marginHorizontal: 10,
                //                 height: 40,
                //                 borderRadius: 4,
                //                 justifyContent: 'center'
                //             }
                //         ]}
                //         onPress={() => {
                //             this.props.changeLoginOtpStatus(true)
                //         }}
                //     >
                //         <Text style={[styles.changeWayText, { color: '#fff' }]}>222   ถัดไป</Text>
                //     </TouchableOpacity>
                //     :
                //     <TouchableOpacity
                //         style={[
                //             {
                //                 color: '#25AAE1',
                //                 marginTop: 10,
                //                // position: 'absolute',
                //                 bottom: 35,
                //                 alignItems: 'center',
                //                 width
                //             }
                //         ]}
                //         onPress={() => {
                //             this.props.changeLoginOtpStatus(true)
                //         }}
                //     >
                //         <Text style={styles.changeWayText}>111  เปลี่ยนวิธีการยืนยันข้อมูล</Text>
                //     </TouchableOpacity>
            }
        </View>
    }
}

export default LoginOtpPage = connect(
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
        }
    }
)(LoginOtpPageContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff'
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
        color: '#fff',
        fontSize: 12,
        paddingHorizontal: 20
    },
    viewPageContainer: {
        marginHorizontal: 10,
        marginTop: 10
    },
    boclkInforText: {
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 10,
        color: '#000'
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
        borderRadius: 4
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
        marginBottom: 10,
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
        color: '#323232',
        fontSize: 12
    },
    verificationTextTip2: {
        fontWeight: 'normal',
        marginTop: 4,
    },
    verificationTextTip3: {
        textAlign: 'center',
        marginBottom: 10
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
        marginBottom: 10
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
    changeWay1: {
        //  position: 'absolute',
        height: 40,
        // left: 0,
        // right: 0,
        // bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50
    },
    changeWayText: {
        textAlign: 'center',
        color: '#25AAE1',
        fontSize: 15
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
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
})