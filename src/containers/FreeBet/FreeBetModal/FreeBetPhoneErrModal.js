import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Image } from 'react-native'


const { width, height } = Dimensions.get('window')

export default class FreeBetPhoneErrModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return <Modal animationType='fade' visible={true} transparent={true}>
            <View style={styles.viewContainer}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.changeFreeBetPhoneErrModal(false)
                    }}
                    style={styles.closeBtnTop}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                    <Text style={[styles.closeBtnTopText, { color: '#25AAE1' }]}>X</Text>
                </TouchableOpacity>
                <Image
                    source={require('./../../../images/freeBet/freeBetModal/freephoneErorr.png')}
                    resizeMode='stretch'
                    style={styles.freephoneErorr}
                ></Image>
                <Text style={styles.freephoneErorrText1}>Vượt Quá Số Lần Xác Thực Cho Phép</Text>
                <Text style={styles.freephoneErorrText2}>Bạn đã vượt quá số lần xác thực số điện thoại cho phép. Vui lòng thử lại sau 24 giờ tại trang Hồ Sơ Của Tôi để nhận tiền cược miễn phí.</Text>
                <TouchableOpacity style={[styles.freeBtn, { width: width - 40 }]} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                    this.props.changeFreeBetPhoneErrModal(false)

                    window.PiwikMenberCode('Freebet_exceedOTP_close')
                }}>
                    <Text style={styles.freeBtnText}> ปิด </Text>
                </TouchableOpacity>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
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
    freephoneErorr: {
        width: 50,
        height: 50 * 1.767,
        marginTop: 30,
        marginBottom: 10
    },
    freephoneErorrText1: {
        color: '#25AAE1',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 18,
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