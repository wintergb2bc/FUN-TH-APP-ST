import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Dimensions, TextInput, Image, Modal, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
const { width, height } = Dimensions.get('window')

export default class RdBindReverseDepositAccountModal extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    closeModal(flag) {
        const { isPop } = this.props
        isPop && Actions.pop()
        if (flag) {
            Actions.LiveChat()
        }
        this.props.chnageisRdBindReverseDepositAccountModal(false)
    }

    render() {
        const {
            description,
            errorCode,
            isRdBindReverseDepositAccountModal,
            isPop
        } = this.props
        return <Modal animationType='fade' transparent={true} visible={isRdBindReverseDepositAccountModal}>
            <View style={[styles.modalContainer, {
                alignItems: 'center',
                justifyContent: 'center',
            }]}>
                <View style={[styles.modalBox1, {}]}>
                    <Image
                        resizeMode='stretch'
                        source={require('./../../../../images/finance/deposit/rdIcon/rdAddBankErr.png')}
                        style={styles.rdAddBankErr}
                    ></Image>

                    <Text style={{ fontSize: 18, marginVertical: 10 }}>ผูกบัญชีไม่สำเร็จ</Text>
                    <Text style={{ textAlign: 'center', marginBottom: 15, color: '#666666' }}>{description}</Text>

                    {
                        errorCode == 'GEN0006' ? <View>
                            <TouchableOpacity
                                onPress={this.closeModal.bind(this, true)}
                                style={[styles.closeBtn1, { backgroundColor: '#25AAE1', marginBottom: 15 }]}>
                                <Text style={[styles.closeBtnText1, { color: '#fff' }]}>ติดต่อฝ่ายบริการลูกค้า</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.closeModal.bind(this, false)}
                                style={styles.closeBtn1}>
                                <Text style={styles.closeBtnText1}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                            :
                            <TouchableOpacity style={[styles.closeBtn1, { backgroundColor: '#25AAE1' }]} onPress={this.closeModal.bind(this, false)}>
                                <Text style={[styles.closeBtnText1, { color: '#fff' }]}>ปิด</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    limitLists: {
        marginBottom: 10
    },
    LBdepositPageBtn2: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width,
        marginTop: 15
    },
    LbAddBankBox: {
        paddingTop: 10,
        position: 'absolute',
        width,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    LBdepositPageBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#25AAE1'
    },
    LBdepositPageBtn: {
        width: .9 * width,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    limitListsInput: {
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center'
    },
    withdrawalText: {
        color: '#000',
        marginBottom: 5
    },
    targetWalletBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 4,
    },
    toreturnModalDropdown: {
        justifyContent: 'center',
        width: width - 20,
    },
    rdSelect: {
        width: 20,
        height: 20,
        margin: 5
    },
    bankSelectBox: {
        flexDirection: 'row',
        paddingHorizontal: 4,
        alignItems: 'center'
    },
    toreturnDropdownStyle: {
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
    },
    toreturnModalDropdownList: {
        // height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: 6
    },
    dropdown: {
        position: 'absolute',
        right: 10,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 5,
        marginTop: 5,
        borderTopColor: '#58585B',//下箭头颜色
        borderLeftColor: '#fff',//右箭头颜色
        borderBottomColor: '#fff',//上箭头颜色
        borderRightColor: '#fff'//左箭头颜色 
    },
    btnWrap: {
        position: 'absolute',
        bottom: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 60,
        marginHorizontal: 30
    },
    LBdepositPageBtn1: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CBD64',
        width: (width - 60) * .45,
        borderRadius: 6,
    },
    LBdepositPageBtnText1: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    walletSbIcon: {
        width: 18,
        height: 18,
        marginLeft: 6
    },
    walletSbIconBox: {
        position: 'absolute',
        left: 8,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 10000
    },
    walletSbIcon1: {
        width: 18,
        height: 18,
    },
    closeBtn: {
        position: 'absolute',
        right: 10,
        top: 20,
    },
    closeBtnImg: {
        width: 25,
        height: 25,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    recommendTipModal: {
        position: 'absolute',
        zIndex: 1000000000,
        backgroundColor: '#139ED8',
        padding: 8,
        bottom: -25,
        right: 0,
        borderRadius: 6,
        width: width - 20,
        paddingRight: 20
    },
    recommendTipModalText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendTipModalBtnBox: {
        alignItems: 'flex-end',
        marginTop: 6
    },
    recommendTipModalBtn: {
        backgroundColor: '#FFD756',
        borderRadius: 2,
        paddingHorizontal: 15,
        paddingVertical: 5,
        zIndex: 100000,
        marginTop: 6
    },
    recommendTipModalArrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 10,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#139ED8',
        top: -20,
        zIndex: 1000,
        left: (width - 20) * .25
    },
    recommendTipModalBtnText: {
        fontWeight: 'bold',
    },
    recommendRecordBtnBox: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'center',
        marginBottom: 15,
        alignItems: 'center',
    },
    modalContainer: {
        width,
        height,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width,
        height: height * .6,
        paddingHorizontal: 10,
        paddingTop: 60,
    },
    rdAddBankErr: {
        width: 66,
        height: 66
    },
    modalBox1: {
        width: width * .9,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    closeBtn1: {
        width: width * .9 - 20,
        height: 40,
        borderColor: '#25AAE1',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText1: {
        color: '#25AAE1'
    }
})