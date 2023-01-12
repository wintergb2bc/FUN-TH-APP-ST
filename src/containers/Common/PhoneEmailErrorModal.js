import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ImageBackground, Modal, BackHandler, Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')
const ModalInforText = {
    phone: {
        img: require('./../../images/freeBet/freeBetModal/freephoneErorr.png'),
        text1: 'คุณทำการยืนยันข้อมูลเกิน 5 ครั้ง กรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการ เพื่อช่วยเหลือการยืนยันข้อมูล หรือลองใหม่อีกครั้งหลังจาก 24 ชั่วโมง',
        textWithdrawal: 'คุณทำการยืนยันข้อมูลเกิน 5 ครั้งกรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการ เพื่อช่วยเหลือการยืนยันข้อมูลหรือลองใหม่อีกครั้งหลังจาก 24 ชั่วโมง'
    },
    email: {
        img: require('./../../images/loginOtp/emailErr.png'),
        imgWithdrawal: require('./../../images/loginOtp/emailErr2.png'),
        text1: 'คุณทำการยืนยันข้อมูลเกิน 5 ครั้ง กรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการ เพื่อช่วยเหลือการยืนยันข้อมูล หรือลองใหม่อีกครั้งหลังจาก 24 ชั่วโมง',
        textWithdrawal: 'คุณทำการยืนยันข้อมูลเกิน 5 ครั้งกรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการ เพื่อช่วยเหลือการยืนยันข้อมูลหรือลองใหม่อีกครั้งหลังจาก 24 ชั่วโมง'
    }
}

export default class PhoneEmailErrorModal extends React.Component {
    constructor(props) {
        super(props)
        let fillType = this.props.fillType
        this.state = {
            fillType,
            fromPage: this.props.fromPage,
        }
    }

    render() {
        const { fillType, fromPage } = this.state
        return <Modal animationType='fade' visible={true} transparent={true}>
            <View style={styles.viewModalContainer}>
                {
                    // fromPage === 'ProfileQuelea' && 
                    <TouchableOpacity
                        onPress={() => {
                            if (fromPage == 'ProfileQuelea') {
                                Actions.pop()
                                Actions.pop()
                            } else {
                                Actions.pop()
                            }
                        }}
                        style={styles.closeBtnTop}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                        <Text style={[styles.closeBtnTopText, { color: '#25AAE1' }]}>X</Text>
                    </TouchableOpacity>
                }
                <Image
                    source={(fromPage === 'Withdrawal' && fillType === 'email') ? ModalInforText.email.imgWithdrawal : ModalInforText[fillType].img}
                    resizeMode='stretch'
                    style={styles[`freephoneErorr${fillType}`]}
                ></Image>
                <Text style={styles.freephoneErorrText1}>คุณทำการยืนยันข้อมูลเกินที่กำหนด</Text>
                <Text style={styles.freephoneErorrText2}>{ModalInforText[fillType][fromPage === 'Withdrawal' ? 'textWithdrawal' : 'text1']}</Text>
                <TouchableOpacity style={[styles.freeBtn, { width: width - 40 }]} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                    Actions.pop()
                    if (fromPage === 'Withdrawal') {
                        Actions.pop()
                        Actions.home()
                    } else if (fromPage === 'otpRevalidate') {
                        globalLogout(true)

                        setTimeout(() => {
                            Actions.LiveChat()
                        }, 2000)
                    } else if (fromPage == 'ProfileQuelea') {
                        Actions.pop()
                        setTimeout(() => {
                            Actions.LiveChat()
                        }, 100);
                    }
                }}>
                    <Text style={styles.freeBtnText}>{(fromPage === 'Withdrawal') ? 'ติดต่อเจ้าหน้าที่ฝ่ายบริการ' : 'ติดต่อเจ้าหน้าที่ฝ่ายบริการ'}</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'red'
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
        height: 46,
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
})