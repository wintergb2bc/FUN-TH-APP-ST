import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
const { width } = Dimensions.get('window')

export default class ResetPasswordReason extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() { }

    render() {
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <Image
                    resizeMode='stretch'
                    source={require('./../../../images/loginOtp/loginOtpModalImg.png')}
                    style={[styles.loginOtpModalImg1]}></Image>

                <View style={{ paddingHorizontal: 15, }}>
                    <Text style={[styles.reasonTitle, {marginBottom: 10}]}>เรียน สมาชิก FUN88,</Text>
                    <Text style={styles.reasonTitle1}>ขอเรียนแจ้งให้ท่านทราบว่าขณะนี้เว็บไซต์ FUN88 ได้ทำการ เพิ่มระดับการรักษาความปลอดภัยของข้อมูลบัญชี เพื่อการรักษามาตรฐานการบริการสูงสุดให้กับสมาชิก ดังนั้นจึงขอความร่วมมือจากท่านสมาชิกทำการยืนยันข้อมูลเบอร์โทรศัพท์ และอีเมลที่ลงทะเบียนเพื่อความปลอดภัยสูงสุดของบัญชี โดยทำการยืนยันหมายเลข OTP 6 หลักที่ส่งไปยังเบอร์โทรศัพท์ และอีเมลที่ท่านได้ลงทะเบียนไว้กับเรา ทำการยืนยันรหัส OTP 6 หลักตามขั้นตอนที่เว็บไซต์กำหนด หากท่านไม่สามารถทำการยืนยันข้อมูลเบอร์โทรศัพท์หรืออีเมลได้ กรุณาติดต่อเจ้าหน้าที่ฝ่ายบริการ เพื่อให้ความช่วยเหลือ ได้ตลอด 24 ชั่วโมง</Text>
                    <Text style={styles.reasonTitle1}>ขอให้ท่านมั่นใจว่าเราจะเก็บรักษาข้อมูลส่วนบุคคลของท่าน อย่างเคร่งครัด และจะไม่ทำการเผยแพร่ข้อมูลใดๆ หากไม่ได้รับการอนุญาต และเราหวังเป็นอย่างยิ่งว่าจะได้รับความร่วมมือ จากสมาชิกในการยืนยันข้อมูลกับทางเว็บไซต์ในครั้งนี้ </Text>

                    <Text style={styles.reasonTitle}>ขอแสดงความนับถือ ,</Text>
                    <Text style={styles.reasonTitle}>ทีมงาน FUN88</Text>
                </View>
            </ScrollView>
            <View style={[styles.closeBtnWrap]}>
                <TouchableOpacity style={[styles.closeBtnWrap1]} onPress={() => {
                    Actions.pop()
                }}>
                    <Text style={styles.closeBtnText}>ดำเนินการตรวจสอบ</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    reasonTitle: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    reasonTitle1: {
        marginBottom: 15,
        color: '#000'
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 40,
        width: width,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnWrap1: {
        width: width * .9,
        height: 40,
        backgroundColor: '#25AAE1',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    loginOtpModalImg1: {
        width: width,
        height: (width) * .32,
        marginBottom: 15
    },
})