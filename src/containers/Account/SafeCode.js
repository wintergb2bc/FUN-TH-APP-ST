import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Modal, Image, Clipboard } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import * as Animatable from 'react-native-animatable'

const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
class SafeCodeContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            passcode: '',
            countdownNum: '',
            countdownNumMMSS: '',
            isCopy: false,
            isExpiredDateTime: false,
            isShowModal: false,
            isShowTextTip: false,
            isGetSafeCode: false
        }
    }

    componentDidMount() {
        global.storage.load({
            key: 'PostPasscodeGenerate',
            id: 'PostPasscodeGenerate'
        }).then(res => {
            let expiredDateTime = res.expiredDateTime
            let countdownNum = moment(expiredDateTime).diff(moment(new Date()), 'seconds')
            if (countdownNum > 0) {
                this.setState({
                    passcode: res.passcode + '',
                    countdownNum
                }, () => {
                    this.makeNumInterval()
                })
            } else {
                this.setState({
                    isExpiredDateTime: true
                })
            }
        }).catch(() => { })
    }

    componentWillUnmount() {
        this.setTimeoutHide && clearTimeout(this.setTimeoutHide)
        this.intervalNum && clearInterval(this.intervalNum)
    }

    postPasscodeGenerate() {
        window.PiwikMenberCode('Verification', 'Click', 'Generate_Passcode')
        this.intervalNum && clearInterval(this.intervalNum)
        this.setState({
            isExpiredDateTime: false,
            isShowTextTip: false,
            isGetSafeCode: false,
        })
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostPasscodeGenerate, 'POST').then(res => {
            Toast.hide()
            if (res.isSuccess && res.passcode) {
                const passcode = res.passcode + ''
                if ((this.state.passcode && passcode == this.state.passcode)) {
                    this.setState({
                        isShowTextTip: true
                    })
                }
                let expiredDateTime = res.expiredDateTime
                let countdownNum = moment(expiredDateTime).diff(moment(new Date()), 'seconds')
                this.setState({
                    passcode,
                    countdownNum,
                    isGetSafeCode: true,
                    isExpiredDateTime: false
                }, () => {
                    this.makeNumInterval()
                })

                global.storage.save({
                    key: 'PostPasscodeGenerate',
                    id: 'PostPasscodeGenerate',
                    data: res,
                    expires: null
                })
            } else {
                this.setState({
                    isShowModal: true
                })
            }
        }).catch(err => {
            this.setState({
                isShowModal: true
            })
            Toast.hide()
        })
        window.PiwikMenberCode('Passcode_generate')
    }

    makeNumInterval() {
        function addZero(n) {
            return n < 10 ? '0' + n : n
        }

        let countdownNum = this.state.countdownNum
        this.intervalNum = setInterval(() => {
            if (countdownNum > 0) {
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
                this.intervalNum && clearInterval(this.intervalNum)
                this.setState({
                    isExpiredDateTime: true,
                    isGetSafeCode: false,
                    isShowTextTip: false
                })
                return
            }
        }, 1000)
    }

    async copyTXT(txt) {
        Clipboard.setString(txt)
        this.setState({
            isCopy: true
        })

        this.setTimeoutHide = setTimeout(() => {
            this.setState({
                isCopy: false
            })
        }, 2500)
        window.PiwikMenberCode('Passcode_copy')
    }

    render() {
        const { isGetSafeCode, isShowTextTip, isShowModal, isExpiredDateTime, isCopy, passcode, countdownNumMMSS } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F3F4F8' : '#000' }]}>
            <Modal animationType='fade' transparent={true} visible={isShowModal}>
                <View style={styles.viewModalContainer}>
                    <View style={styles.viewModalBox}>
                        <View style={styles.modalHead}>
                            <Text style={styles.modalHeadText}>ไม่สามารถสร้างรหัสความปลอดภัยได้</Text>
                            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => {
                                this.setState({
                                    isShowModal: false
                                })
                            }}>
                                <Text style={styles.modalCloseBtnText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            <Text style={styles.modalBodyText}>ขออภัยเราไม่สามารถสร้างรหัสความปลอดภัยได้ในขณะนี้เนื่องจากมีเหตุขัดข้อง กรุณาลองอีกครั้งในภายหลัง หรือติดต่อเจ้าหน้าที่ฝ่ายบริการเพื่อขอความช่วยเหลือ</Text>
                            <TouchableOpacity style={styles.modalClBodyBtn} onPress={() => {
                                this.setState({
                                    isShowModal: false
                                })
                                Actions.LiveChat()
                            }}>
                                <Text style={styles.modalClBodyBtnText}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.viewPaddingContainer, { backgroundColor: window.isBlue ? '#FFF' : '#212121' }]}>
                    <View style={styles.pageInforTextWrap}>
                        <Text style={[styles.pageInforText, { color: window.isBlue ? '#000' : '#fff' }]}>รับรหัสความปลอดภัย</Text>
                    </View>
                    <View style={styles.safeCodeTextInfor}>
                        <View>
                            <Text style={[styles.safeCodeTextInfor1, { color: window.isBlue ? '#8E8E8E' : '#fff' }]}>ต้องการยกเลิกโบนัส ตรวจสอบยอดหมุนเวียน ตรวจสอบยอด ได้เสีย และตั้งค่าความเป็นส่วนตัวต่างๆ สามารถรับรหัสความปลอดภัยในการขอทำรายการต่างๆได้ที่นี่ จากนั้นติดต่อฝ่าย บริการของเราที่{`  `}
                                <Text
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                    onPress={() => {
                                        Actions.LiveChat()
                                        window.PiwikMenberCode('Passcode_Livechat')
                                    }}
                                    style={styles.safeCodeTextInfor2}
                                >แชทสด</Text>
                            </Text>
                        </View>

                        {
                            passcode.length > 0 ? <View style={[styles.safeCodeBox]}>
                                <Text style={[styles.safeCodeBoxText1, { color: window.isBlue ? '#000' : '#fff' }]}>รหัสความปลอดภัย</Text>

                                <View style={styles.safeCodeNumBox}>
                                    <View style={styles.safeCodeNumBoxTextBox}>
                                        {
                                            passcode.length > 0 && passcode.split('').map((v, i) => {
                                                return <Text key={i} style={styles.safeCodeNumBoxText}>{v}</Text>
                                            })
                                        }
                                    </View>

                                    <TouchableOpacity onPress={this.copyTXT.bind(this, passcode)} hitSlop={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                                        <Image
                                            resizeMode='stretch'
                                            style={styles.safeCodeImg}
                                            source={require('./../../images/account/safeCodeImg.png')}
                                        ></Image>
                                    </TouchableOpacity>
                                    {
                                        isCopy && <AnimatableView
                                            animation={'bounceIn'}
                                            easing='ease-out'
                                            iterationCount='1'
                                            style={styles.copyOveryTip}>
                                            <Text style={styles.copyOveryTipText}>คัดลอกแล้ว</Text>
                                        </AnimatableView>
                                    }

                                    {
                                        isExpiredDateTime && <AnimatableView
                                            animation={'bounceIn'}
                                            easing='ease-out'
                                            iterationCount='1'
                                            style={styles.copyOveryTip}>
                                            <Text style={[styles.copyOveryTipText, { color: 'red' }]}>รหัสหมดอายุแล้ว</Text>
                                        </AnimatableView>
                                    }

                                </View>



                                {
                                    isExpiredDateTime ?
                                        <Text style={[styles.safeCodeBoxText2, { color: window.isBlue ? '#000' : '#fff' }]}>รหัสหมดอายุแล้ว</Text>
                                        :
                                        <Text style={[styles.safeCodeBoxText2, { color: window.isBlue ? '#000' : '#fff' }]}>รหัสความปลอดภัยจะหมดอายุภายใน {countdownNumMMSS} นาที.</Text>
                                }

                                <View style={styles.safeBtnBox}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (!isGetSafeCode || isExpiredDateTime) {
                                                this.postPasscodeGenerate()
                                            } else {
                                                window.PiwikMenberCode('Verification', 'Click', 'Regenerate_Passcode')
                                            }
                                        }}
                                        style={[styles.safeBtn, { backgroundColor: (!isGetSafeCode || isExpiredDateTime) ? '#33C85D' : '#B9B9B9' }]}
                                    >
                                        <Text style={styles.safeBtnText}>รับรหัสความปลอดภัยใหม่</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                                :
                                <View style={[styles.safeBtnBox, { marginTop: 40 }]}>
                                    <TouchableOpacity style={[styles.safeBtn]} onPress={this.postPasscodeGenerate.bind(this)}>
                                        <Text style={styles.safeBtnText}>รหัสความปลอดภัย</Text>
                                    </TouchableOpacity>
                                </View>
                        }

                        {
                            isShowTextTip && <Text style={styles.safeCodeTop}>{`รหัสปัจจุบันยังคงมีอายุ\nโปรดใช้รหัสผ่านเดิมหรือรอจนกว่าจะหมดอายุ`}</Text>
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    }
}

export default SafeCode = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData
        }
    }, (dispatch) => {
        return {}
    }
)(SafeCodeContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'red'
    },
    pageInforTextWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 40,
        justifyContent: 'center',
    },
    pageInforText: {
        fontSize: 16,
        textAlign: 'center'
    },
    viewPaddingContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 25,
        paddingTop: 15
    },
    safeCodeTextInfor1: {
        flexWrap: 'wrap',
        lineHeight: 18
    },
    safeCodeTextInfor2: {
        color: '#25AAE1',
        textDecorationColor: '#25AAE1',
        textDecorationLine: 'underline',
        lineHeight: 18
    },
    safeBtnBox: {
        alignItems: 'center',
    },
    safeBtn: {
        backgroundColor: '#33C85D',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 60,
        borderRadius: 4,
    },
    safeBtnText: {
        color: '#fff'
    },
    viewModalContainer: {
        width,
        height,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
    },
    viewModalBox: {
        backgroundColor: '#fff',
        borderRadius: 6,
        overflow: 'hidden',
        width: width - 20
    },
    modalHead: {
        height: 45,
        backgroundColor: '#25AAE1',
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalHeadText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalCloseBtn: {
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalCloseBtnText: {
        color: '#fff',
        fontSize: 20
    },
    modalBody: {
        padding: 20
    },
    modalBodyText: {
        textAlign: 'center',
        color: '#323232'
    },
    modalClBodyBtn: {
        backgroundColor: '#33C85D',
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25,
        marginTop: 30
    },
    modalClBodyBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    safeCodeBox: {
        borderWidth: 1,
        borderColor: '#EDEDED',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
        paddingVertical: 40,
        borderColor: '#EDEDED'
    },
    safeCodeBoxText1: {
        fontWeight: 'bold',
        fontSize: 16
    },
    safeCodeBoxText2: {
        fontSize: 13,
        marginBottom: 20
    },
    safeCodeNumBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        height: 40
    },
    safeCodeNumBoxTextBox: {
        flexDirection: 'row'
    },
    safeCodeNumBoxText: {
        color: '#25AAE1',
        fontSize: 30,
        marginHorizontal: 4
    },
    safeCodeImg: {
        width: 52 * .45,
        height: 60 * .45,
        marginLeft: 15
    },
    copyOveryTip: {
        backgroundColor: 'rgba(255, 255, 255, .9)',
        position: 'absolute',
        top: 0,
        right: -20,
        bottom: 0,
        left: -20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    copyOveryTipText: {
        color: '#25AAE1',
        fontWeight: 'bold',
        fontSize: 20
    },
    safeCodeTop: {
        color: 'red',
        textAlign: 'center',
        marginTop: 15
    }
})