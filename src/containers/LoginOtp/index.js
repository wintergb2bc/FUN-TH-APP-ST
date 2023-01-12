import React from 'react'
import { View, Text, Dimensions, StyleSheet, Modal, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { getFreeBetInforAction } from './../../actions/ReducerAction'
import * as Animatable from 'react-native-animatable'
import Toast from '@/containers/Toast'
const AnimatableView = Animatable.View
const { width, height } = Dimensions.get('window')

let LoginOtpWayTol = [
    {
        text: 'ยืนยันข้อมูลเบอร์โทรศัพท์',
        img: require('./../././../images/loginOtp/loginOtpWay1.png'),
        type: 'phone',
        loginOtpPage: {
            title: 'ยืนยันข้อมูลเบอร์โทรศัพท์',
            img: require('./../././../images/loginOtp/phone.png'),
            text: 'เพื่อความปลอดภัยของบัญชี กรุณาทำการยืนยันข้อมูลเบอร์โทรศัพท์ ตามขั้นตอนที่กำหนด'
        },
        isShowWay: true,
        piwikMenberText: 'Phone_loginOTP',
    },
    {
        text: 'ยืนยันข้อมูลอีเมล',
        img: require('./../././../images/loginOtp/loginOtpWay2.png'),
        type: 'email',
        loginOtpPage: {
            title: 'ยืนยันข้อมูลอีเมล',
            img: require('./../././../images/loginOtp/eamil.png'),
            text: 'เพื่อความปลอดภัยของบัญชีคุณโปรดทำตามคำแนะนำด้านล่าง เพื่อยืนยันอีเมลของคุณ'
        },
        isShowWay: true,
        piwikMenberText: 'Email_loginOTP'
    },
    {
        text: 'ติดต่อเจ้าหน้าที่ฝ่ายบริการ',
        img: require('./../././../images/loginOtp/loginOtpWay3.png'),
        type: 'cs',
        isShowWay: true,
        piwikMenberText: 'CS_loginOTP'
    }
]
class LoginOtpContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowLoginOtpText: true,
            LoginOtpWay: [],
            PhoneVerifyAttempt: '',
            EmailVerifyAttempt: '',
            isLoading: true
        }
    }

    componentDidMount() {
        this.getVerificationAttempt()
    }


    getVerificationAttempt() {
        this.setState({
            isLoading: true
        })
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        let requests = ['SMS', 'Email'].map(v => fetchRequest(ApiPort.GetVerificationAttempt + `serviceAction=OTP&channelType=${v}&`, 'GET'))
        Toast.hide()
        Promise.all(requests).then(res => {
            this.setState({
                isLoading: false
            })
            this.setState({
                PhoneVerifyAttempt: res[0] && res[0].remainingAttempt,
                EmailVerifyAttempt: res[1] && res[1].remainingAttempt
            }, () => {
                this.getMemberDetailInfor(this.props.memberInforData)
            })
        }).catch(err => {
            this.setState({
                isLoading: false
            })
        })
    }

    getMemberDetailInfor(memberInfor) {
        // if (!memberInfor.MemberCode) return
        let { PhoneVerifyAttempt, EmailVerifyAttempt } = this.state
        if (PhoneVerifyAttempt <= 0 && EmailVerifyAttempt <= 0) {
            this.setState({
                LoginOtpWay: LoginOtpWayTol.filter(v => v.type === 'cs')
            })
        } else {
            if (PhoneVerifyAttempt <= 0) {
                this.setState({
                    LoginOtpWay: LoginOtpWayTol.filter(v => !['phone', 'cs'].includes(v.type))
                })
            } else if (EmailVerifyAttempt <= 0) {
                this.setState({
                    LoginOtpWay: LoginOtpWayTol.filter(v => !['email', 'cs'].includes(v.type))
                })
            } else {
                this.setState({
                    LoginOtpWay: LoginOtpWayTol.filter(v => !['cs'].includes(v.type))
                })
            }
        }
    }

    goLoginOtp(v) {
        const { type, loginOtpPage, img, piwikMenberText } = v
        this.props.changeLoginOtpStatus(false)
        if (type === 'cs') {
            globalLogout && globalLogout()

            setTimeout(() => {
                Actions.LiveChat()
            }, 1500)
            // Actions.LiveChat({
            //     fromPage: 'loginOtp',
            //     changeLoginOtpStatus: (isShowLoginOtp) => {
            //         this.props.changeLoginOtpStatus(isShowLoginOtp)
            //     }
            // })
        } else {
            Actions.LoginOtpPage({
                fillType: type,
                loginOtpPage,
                changeLoginOtpStatus: (isShowLoginOtp) => {
                    Actions.pop()
                    this.props.changeLoginOtpStatus(isShowLoginOtp)
                },
                changeDisplayReferee: (isShowDisplayReferee) => {
                    this.props.changeDisplayReferee(isShowDisplayReferee)
                }
            })
        }


        if (type == 'email') {
            piwikMenberText && window.PiwikMenberCode('Verification', 'Click', 'Email_LoginOTP')
        } else if (type == 'phone') {
            piwikMenberText && window.PiwikMenberCode('Verification', 'Click', 'Phone_LoginOTP')
        }

    }

    createView() {
        return <View style={{ flex: 1, width, alignItems: 'center' }}>
            <Image
                resizeMode='stretch'
                source={require('./../../images/loginOtp/loginOtpModalImg.png')}
                style={[styles.loginOtpModalImg, styles.loginOtpModalImg1]}></Image>
            <View>

                <View style={{ paddingHorizontal: 15 }}>
                    <Text style={[styles.viewModalBoxBodyText1, styles.viewModalBoxBodyText2, { marginTop: 15 }]}>เรียน สมาชิก FUN88,</Text>
                    <Text style={styles.viewModalBoxBodyText2}>ขอเรียนแจ้งให้ท่านทราบว่าขณะนี้เว็บไซต์ FUN88 ได้ทำการ เพิ่มระดับการรักษาความปลอดภัยของข้อมูลบัญชี เพื่อการรักษามาตรฐานการบริการสูงสุดให้กับสมาชิก ดังนั้นจึงขอความร่วมมือจากท่านสมาชิกทำการยืนยันข้อมูลเบอร์โทรศัพท์ และอีเมลที่ลงทะเบียนเพื่อความปลอดภัยสูงสุดของบัญชี โดยทำการยืนยันหมายเลข OTP 6 หลักที่ส่งไปยังเบอร์โทรศัพท์ และอีเมลที่ท่านได้ลงทะเบียนไว้กับเรา ทำการยืนยันรหัส OTP 6 หลักตามขั้นตอนที่เว็บไซต์กำหนด หากท่านไม่สามารถทำการยืนยันข้อมูลเบอร์โทรศัพท์หรืออีเมลได้ กรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการ เพื่อให้ความช่วยเหลือ ได้ตลอด 24 ชั่วโมง</Text>
                    <Text style={styles.viewModalBoxBodyText2}>ขอให้ท่านมั่นใจว่าเราจะเก็บรักษาข้อมูลส่วนบุคคลของท่าน อย่างเคร่งครัด และจะไม่ทำการเผยแพร่ข้อมูลใดๆ หากไม่ได้รับการอนุญาต และเราหวังเป็นอย่างยิ่งว่าจะได้รับความร่วมมือ จากสมาชิกในการยืนยันข้อมูลกับทางเว็บไซต์ในครั้งนี้</Text>
                    <Text style={styles.viewModalBoxBodyText1}>ขอแสดงความนับถือ</Text>
                    <Text style={styles.viewModalBoxBodyText1}>ทีมงาน FUN88</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.viewModalBoxBodyBtn1, {
                position: 'absolute',
                bottom: 60
            }]} onPress={() => {
                this.setState({
                    isShowLoginOtpText: true
                })
                window.PiwikMenberCode('Back_loginOTP')
            }}>
                <Text style={styles.viewModalBoxBodyBtnText1}>ดำเนินการตรวจสอบ</Text>
            </TouchableOpacity>
        </View>
    }

    render() {
        const { isLoading, LoginOtpWay, isShowLoginOtpText } = this.state
        let isCsOnly = false
        if (Array.isArray(LoginOtpWay) && LoginOtpWay.length == 1) {
            if (LoginOtpWay[0].type == "cs") {
                isCsOnly = true
            }
        }
        return <Modal
            animationType='fade'
            transparent={true}
            visible={true}>
            {
                isCsOnly && isShowLoginOtpText && <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        {
                            isLoading && <View style={styles.registIpkLoadFlag}>
                                <ActivityIndicator size='large' color='#fff' />
                            </View>
                        }


                        <AnimatableView
                            animation={isShowLoginOtpText ? 'slideInUp' : 'slideOutDown'}
                            easing='ease-out-cubic'
                            duration={400}
                            style={[styles.viewModalBoxBody, { display: isShowLoginOtpText ? 'flex' : 'none' }]}>
                            <Image
                                resizeMode='stretch'
                                source={require('./../../images/loginOtp/loginOtpModalImg.png')}
                                style={styles.loginOtpModalImg}></Image>
                            <Text style={styles.viewModalBoxBodyTitle}>การตรวจสอบความปลอดภัย</Text>
                            <Text style={styles.viewModalBoxBodyText}>โปรดตรวจสอบข้อมูลของคุณเพื่อให้แน่ใจว่าบัญชีของคุณปลอดภัยจาก การป้องกันทางไซเบอร์, การป้องกันการโจรกรรม และลดความเสี่ยงในการทำธุรกรรม</Text>
                            <TouchableOpacity style={[styles.viewModalBoxBodyBtn, {
                                width: (width * .95) - 30,
                            }]} onPress={() => {
                                this.setState({
                                    isShowLoginOtpText: false
                                })

                                window.PiwikMenberCode('Details_loginOTP')
                            }}>
                                <Text style={styles.viewModalBoxBodyBtnText}>ข้อมูลเพิ่มเติม</Text>
                            </TouchableOpacity>
                            <View style={styles.viewModalBoxBodyBox}>
                                {
                                    LoginOtpWay.filter(v => v.isShowWay).map((v, i) => {
                                        return <TouchableOpacity
                                            onPress={this.goLoginOtp.bind(this, v)}
                                            key={i}
                                            style={[styles.viewModalBoxBodyList, styles[`viewModalBoxBodyList${i}`]]}>
                                            <Image resizeMode='stretch' source={v.img} style={[styles.loginOtpWayImg, styles[`loginOtpWayImg${v.type}`]]}></Image>
                                            <Text style={styles.viewModalBoxBodyListText}>{v.text}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </AnimatableView>


                    </View>
                </View>
            }

            {
                isCsOnly && !isShowLoginOtpText && <View style={{
                    backgroundColor: '#FFFFFF',
                    width,
                    height,
                    flex: 1,
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#06ADEF',
                        height: 85,
                        paddingTop: 40,
                        width,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 10
                    }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>การตรวจสอบความปลอดภัย</Text>
                    </View>
                    {
                        !isShowLoginOtpText && this.createView()
                    }
                </View>
            }


            {
                !isCsOnly && <View style={{
                    backgroundColor: '#FFFFFF',
                    width,
                    height,
                    flex: 1,
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#06ADEF',
                        height: 85,
                        paddingTop: 40,
                        width,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 10
                    }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>การตรวจสอบความปลอดภัย</Text>
                    </View>
                    {
                        isShowLoginOtpText ?
                            <View style={{ flex: 1, width, alignItems: 'center' }}>
                                <View style={{ paddingTop: 25, marginBottom: 15 }}>
                                    <Text style={{
                                        paddingHorizontal: 30,
                                        textAlign: 'center',
                                        color: 'rgba(0, 0, 0, .8)'
                                    }}>โปรดตรวจสอบข้อมูลของคุณเพื่อให้แน่ใจว่าบัญชีของคุณปลอดภัยจากการป้องกันทางไซเบอร์,การป้องกันการโจรกรรม และลดความเสี่ยงในการทำธุรกรรม</Text>
                                </View>

                                <View style={styles.viewModalBoxBodyBox}>
                                    {
                                        LoginOtpWay.filter(v => v.isShowWay).map((v, i) => {
                                            return <TouchableOpacity
                                                onPress={this.goLoginOtp.bind(this, v)}
                                                key={i}
                                                style={[styles.viewModalBoxBodyList, styles[`viewModalBoxBodyList${i}`]]}>
                                                <Image resizeMode='stretch' source={v.img} style={[styles.loginOtpWayImg, styles[`loginOtpWayImg${v.type}`]]}></Image>
                                                <Text style={styles.viewModalBoxBodyListText}>{v.text}</Text>
                                            </TouchableOpacity>
                                        })
                                    }
                                </View>

                                <TouchableOpacity style={[styles.viewModalBoxBodyBtn, {
                                    position: 'absolute',
                                    bottom: 60
                                }]} onPress={() => {
                                    this.setState({
                                        isShowLoginOtpText: false
                                    })

                                    window.PiwikMenberCode('Details_loginOTP')
                                }}>
                                    <Text style={styles.viewModalBoxBodyBtnText}>ข้อมูลเพิ่มเติม</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            this.createView()
                    }
                </View>
            }
        </Modal>
    }
}

export default LoginOtp = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
        }
    }
)(LoginOtpContainer)

const styles = StyleSheet.create({
    viewModalContainer: {
        width,
        height,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
    },
    viewModalBox: {
        width: width * .95,
        backgroundColor: '#fff',
        borderRadius: 6,
        overflow: 'hidden'
    },
    loginOtpModalImg: {
        width: width * .95,
        height: (width * .95) * .32
    },
    loginOtpModalImg1: {
        width: width,
        height: (width) * .32
    },
    viewModalBoxBody: {
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom: 25
    },
    viewModalBoxBodyTitle: {
        fontWeight: 'bold',
        fontSize: 19,
        color: '#25AAE1'
    },
    viewModalBoxBodyText: {
        textAlign: 'center',
        lineHeight: 20,
        marginVertical: 10
    },
    viewModalBoxBodyBtn: {
        borderWidth: 1,
        borderColor: '#25AAE1',
        borderRadius: 4,
        paddingVertical: 10,
        width: (width) - 30,
        alignItems: 'center'
    },
    viewModalBoxBodyBtnText: {
        color: '#25AAE1',
        fontWeight: 'bold',
        fontSize: 15,
        //textDecorationLine: 'underline'
    },
    viewModalBoxBodyBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: (width * .95 - 30),
        marginTop: 15
    },
    viewModalBoxBodyList: {
        width: (width * .95 - 30) / 3.2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#25AAE1',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewModalBoxBodyList1: {
        marginHorizontal: ((width * .95 - 30) - ((width * .95 - 30) / 3.2) * 3) / 2
    },
    viewModalBoxBodyListText: {
        color: '#32C85D',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 16,
        fontSize: 12
    },
    loginOtpWayImgphone: {
        height: 50,
        width: 40,
        marginBottom: 5
    },
    loginOtpWayImgemail: {
        height: 30,
        marginTop: 10,
        marginBottom: 15,
        width: 60
    },
    loginOtpWayImgcs: {
        width: 40,
        height: 40,
        marginTop: 5,
        marginBottom: 10
    },
    viewModalBoxBodyText1: {
        fontWeight: 'bold',
        color: '#000'
    },
    viewModalBoxBodyText2: {
        marginBottom: 10,
        color: '#000'
    },
    viewModalBoxBodyBtn1: {
        backgroundColor: '#25AAE1',
        width: (width) - 30,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 5,
    },
    viewModalBoxBodyBtnText1: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registIpkLoadFlag: {
        position: 'absolute',
        width,
        right: 0,
        top: 0,
        bottom: 0,
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)',
        zIndex: 1000
    },
})