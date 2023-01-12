import React from 'react'
import { StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text
export default class LoginErrModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkBox: false
        }
    }

    closeModalPop(flag, piwikMenberText) {

    }



    render() {

        return <Modal animationType='fade' transparent={true} visible={!true}>
            <View style={[styles.modalContainer]}>
                <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                    <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                        <Text style={styles.modalTopText}>การแจ้งเตือนรหัสแพทเทิร์น</Text>
                    </View>
                    <View style={styles.modalBody}>
                        <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
                            การตั้งค่ารหัสแพทเทิร์นสำเร็จ คุณสามารถใช้งานได้
                        </Text>

                        <View style={styles.modalBtnBox}>
                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}>
                                <Text style={[styles.modalBtnText, { color: '#fff' }]}>ตการตั้งค่าเสร็จสิ้น</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({

    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#EFEFEF',
        borderRadius: 6,
        width: width * .9,
        overflow: 'hidden'
    },
    modalTop: {
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25AAE1'
    },
    modalTopText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    modalBtnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    modalBtn: {
        height: 40,
        width: (width * .9 - 40),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    modalBtnText: {
        fontWeight: 'bold'
    },
    reasonText: {
        textAlign: 'center'
    },
})