import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

export default class FreebetQualificationsModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return <View>
            <View style={styles.viewContainer}>
                <TouchableOpacity
                    onPress={() => {
                        Actions.pop()
                    }}
                    style={styles.closeBtnTop}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                    <Text style={[styles.closeBtnTopText, { color: '#25AAE1' }]}>X</Text>
                </TouchableOpacity>
                <Image
                    source={require('./../../../images/freeBet/freeBetModal/freebetQualifications.png')}
                    resizeMode='stretch'
                    style={styles.freephoneErorr}
                ></Image>
                <Text style={styles.freephoneErorrText1}>Không hợp lệ nhận thưởng cược miễn phí</Text>
                <Text style={styles.freephoneErorrText2}>Tài khoản của bạn không hợp lệ để nhận Thưởng Cược Miễn Phí. Tuy nhiên, bạn vẫn có thể tham gia các khuyến mãi khác. Vui lòng liên hệ Chăm Sóc Khách Hàng để biết thêm thông tin chi tiết.</Text>
                <TouchableOpacity
                    style={[styles.freeBtn, { width: width - 40, backgroundColor: '#25AAE1', }]}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                        Actions.pop()
                        Actions.LiveChat()
                    }}>
                    <Text style={styles.freeBtnText}>ฝ่ายบริการลูกค้า</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.freeBtn, { width: width - 40 }]} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                    Actions.pop()
                }}>
                    <Text style={[styles.freeBtnText, { color: '#25AAE1' }]}> ปิด </Text>
                </TouchableOpacity>
            </View>
        </View>
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
        width: 174 * 0.6,
        height: 159 * 0.6,
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