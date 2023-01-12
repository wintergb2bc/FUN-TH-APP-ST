import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, TouchableOpacity, Platform, Image } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')
let LoginOtpWayTol = [
    {
        text: 'ยืนยันข้อมูลเบอร์โทรศัพท์',
        img: require('./../../../images/loginOtp/loginOtpWay1.png'),
        type: 'phone',
        loginOtpPage: {
            title: 'ยืนยันข้อมูลเบอร์โทรศัพท์',
            img: require('./../../../images/loginOtp/phone.png'),
            text: 'เพื่อความปลอดภัยของบัญชี กรุณาทำการยืนยันข้อมูลเบอร์โทรศัพท์ ตามขั้นตอนที่กำหนด'
        },
        isShowWay: true,
        piwikMenberText: 'Phone_loginOTP',
    },
    {
        text: 'ยืนยันข้อมูลอีเมล',
        img: require('./../../../images/loginOtp/loginOtpWay2.png'),
        type: 'email',
        loginOtpPage: {
            title: 'ยืนยันข้อมูลอีเมล',
            img: require('./../../../images/loginOtp/eamil.png'),
            text: 'เพื่อความปลอดภัยของบัญชีคุณโปรดทำตามคำแนะนำด้านล่าง เพื่อยืนยันอีเมลของคุณ'
        },
        isShowWay: true,
        piwikMenberText: 'Email_loginOTP'
    },
    {
        text: 'ติดต่อเจ้าหน้าที่ฝ่ายบริการ',
        img: require('./../../../images/loginOtp/loginOtpWay3.png'),
        type: 'cs',
        isShowWay: true,
        piwikMenberText: 'CS_loginOTP'
    }
]
class ResetPasswordContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            LoginOtpWay: [],
            PhoneVerifyAttempt: '',
            EmailVerifyAttempt: '',
        }
    }

    componentDidMount() {
        this.getVerificationAttempt()
    }

    getVerificationAttempt() {
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        let requests = ['SMS', 'Email'].map(v => fetchRequest(ApiPort.GetVerificationAttempt + `serviceAction=Revalidate&channelType=${v}&`, 'GET'))
        Promise.all(requests).then(res => {
            Toast.hide()
            this.setState({
                PhoneVerifyAttempt: res[0] && res[0].remainingAttempt,
                EmailVerifyAttempt: res[1] && res[1].remainingAttempt
            }, () => {
                this.getMemberDetailInfor(this.props.memberInforData)
            })
        }).catch(err => {
            Toast.hide()
        })
    }

    getMemberDetailInfor(memberInfor) {
        const { LoginOtpWay } = this.state
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

    // componentWillUnmount() {
    //     ApiPort.UserLogin = false
    // }

    changeResetPassword(v) {
        const { type } = v
        if (type === 'cs') {
            globalLogout && globalLogout()

            setTimeout(() => {
                Actions.LiveChat()
            }, 1500)
        }
        else {
            Actions.ResetPasswordVerification({
                verificationType: type
            })
        }

    }

    render() {
        const { LoginOtpWay } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>


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
                                    onPress={this.changeResetPassword.bind(this, v)}
                                    key={i}
                                    style={[styles.viewModalBoxBodyList, styles[`viewModalBoxBodyList${i}`]]}>
                                    <Image resizeMode='stretch' source={v.img} style={[styles.loginOtpWayImg, styles[`loginOtpWayImg${v.type}`]]}></Image>
                                    <Text style={styles.viewModalBoxBodyListText}>{v.text}</Text>
                                </TouchableOpacity>
                            })
                        }
                    </View>


                </View>
            </ScrollView>
            <TouchableOpacity style={[styles.viewModalBoxBodyBtn, {
                position: 'absolute',
                bottom: 60,
            }]} onPress={() => {
                Actions.ResetPasswordReason()
            }}>
                <Text style={styles.viewModalBoxBodyBtnText}>ข้อมูลเพิ่มเติม</Text>
            </TouchableOpacity>
        </View>
    }
}

export default ResetPassword = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
        }
    }
)(ResetPasswordContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        alignItems: 'center'
    },
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
        fontWeight: 'bold'
    },
    viewModalBoxBodyText2: {
        marginBottom: 10
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