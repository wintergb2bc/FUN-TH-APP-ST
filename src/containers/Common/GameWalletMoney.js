import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ImageBackground, Modal, BackHandler, Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')


export default class GameWalletMoney extends React.Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const { fillType, fromPage } = this.state
        return <Modal animationType='fade' visible={this.props.isShowWalletGameModal} transparent={true}>
            <View style={styles.modalViewContainer}>
                <View style={[styles.modalViewBox, {
                    backgroundColor: window.isBlue ? '#FFFFFF' : '#3A3A3C'
                }]}>
                    <View style={styles.phcTextBox}>
                        <Text style={styles.phcTextBoxText}>!</Text>
                    </View>
                    <Text style={[styles.noBankText1, { color: window.isBlue ? '#000' : '#fff' }]}>แจ้งเตือน</Text>


                    <Text style={[styles.modalBodyText, {
                        color: window.isBlue ? '#4A4A4A' : '#BFBFBF'
                    }]}>{`ขณะนี้กระเป๋าเกมของคุณมียอดคงเหลือ\nไม่เพียงพอ กรุณาฝากเงินและโอนเงินเข้า\nกระเป๋าเกมของคุณเพื่อเริ่มต้นการเดิมพัน`}​</Text>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => {
                        this.props.changeShowWalletGameModal(false, true)
                    }}>
                        <Text style={styles.modalBtnText}>ปิด</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    modalViewContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalViewContainer1: {},
    modalWrap: {
        width,
        paddingHorizontal: 10
    },
    modalViewBox: {
        width: width * .9,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        paddingVertical: 40
    },
    phcTextBox: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        backgroundColor: '#E2141C',
        marginBottom: 5
    },
    phcTextBoxText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#fff'
    },
    noBankText1: {
        fontWeight: 'bold',
        fontSize: 16
    },
    modalBodyText: {
        color: '#262626',
        textAlign: 'center',
        paddingBottom: 20,
        paddingTop: 10,
        width: width * .75,
    },
    modalBtn: {
        height: 36,
        width: width * .8,
        backgroundColor: '#25AAE1',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBtnText: {
        color: '#fff'
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
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalGuideContainer: {
        width,
        height,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'red'
    },
    guideBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inforBox: {
        alignItems: 'center'
    },
    guideInforWrap: {
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#FFD23D',
        padding: 5,
        width: 140
    },
    guideInforWrap1: {
        width: (width - 20) * .45
    },
    guideInforText: {
        color: '#FFD23D',
        fontSize: 12
    },
    arrowWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    arrowWrap1: {
        transform: [{
            rotate: '90deg',
        }],
        position: 'absolute',
        width: 40,
        bottom: -30
    },
    line: {
        color: '#FFD23D',
        marginLeft: 4
    },
    arrow: {
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 6,
        borderLeftColor: '#FFD23D',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
    },
    guideFinally: {
        position: 'absolute',
        width,
        paddingHorizontal: 10
    },
    cancleBtn: {
        backgroundColor: '#fff',
        width: 140,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        position: 'absolute',
        bottom: 150
    },
    cancleBtnText: {
        fontWeight: 'bold'
    }
})