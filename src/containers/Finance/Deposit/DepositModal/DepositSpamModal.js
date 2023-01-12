import React, { Component } from 'react'
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

export default class DepositSpamModal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const { errorMessage } = this.props
        return <Modal animationType='fade' transparent={true} visible={true}>
            <View style={styles.viewContainer}>
                <View style={styles.viewWrap}>
                    <View style={styles.modalHead}>
                        <Text style={styles.modalHeadText}>แจ้งเตือน</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.changeDepositSpamModal(false)
                            }}
                            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                            style={styles.modalHeadBtn}>
                            <Text style={styles.modalHeadBtnText}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBody}>
                        <View style={styles.modalBodyTextBox}>
                            <Text style={[styles.modalBodyText]}>ช่องทางฝากนี้ งดให้บริการชั่วคราว สมาชิกสามารถใช้ช่องทางการฝากอื่น ๆ หรือ
                                <Text onPress={() => {
                                    this.props.changeDepositSpamModal(false)
                                    Actions.LiveChat()
                                }}
                                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} style={[styles.modalBodyText, { fontWeight: 'bold', }]}> ติดต่อฝ่ายบริการลูกค้า </Text>
                                ขออภัยในความไม่สะดวก.</Text>
                        </View>

                        <View style={styles.modalBodyBtnContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.changeDepositSpamModal(false)
                                }}
                                style={styles.modalBodyBtn}>
                                <Text style={styles.modalBodyBtnText}> ปิด </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewWrap: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: width * .9,
        overflow: 'hidden',
    },
    modalHead: {
        flexDirection: 'row',
        height: 46,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#26aae1',
        paddingHorizontal: 15
    },
    modalHeadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalHeadBtn: {
        width: 28,
        height: 28,
        borderRadius: 1000,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalHeadBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalBody: {
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    modalBodyTextBox: {
        flexDirection: 'row',
        width: width * .9 - 30,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    modalBodyText: {
        color: '#000',
        flexWrap: 'wrap'
    },
    modalBodyBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    modalBodyBtn: {
        marginTop: 15,
        backgroundColor: '#00adef',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 4
    },
    modalBodyBtnText: {
        color: '#fff'
    }
})