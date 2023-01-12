import React, { Component } from 'react'
import { Text, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { getDepositUserBankAction, getWithdrawalUserBankAction } from '././../../../actions/ReducerAction'
import { getName } from '././../../../actions/Reg'
const { width } = Dimensions.get('window')

class BankDetailsContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bankInfor: this.props.bankInfor
        }
    }

    deleteCard() {
        let id = this.props.bankInfor.BankAccountID
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.DELETEMemberBanksDefault + id + '?', 'DELETE').then(res => {
            Toast.hide()
            this.props.bankType === 'D' && this.props.getDepositUserBankAction()
            this.props.bankType === 'W' && this.props.getWithdrawalUserBankAction()
            Actions.pop()
        }).catch(error => {
            Toast.hide()
        })
    }

    render() {
        const { bankInfor } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ paddingHorizontal: 10 }}
            >
                <View style={styles.bankBox}>
                    {
                        this.props.bankIcon && <Image
                            resizeMode='stretch'
                            source={this.props.bankIcon}
                            style={styles.bankIcon} />
                    }

                    <View>
                        <Text style={{ color: window.isBlue ? '#000' : '#fff', width: width - 140 }}>{bankInfor.BankName}</Text>
                        <Text style={{ color: '#58585B', width: width - 120 }}>{bankInfor.AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
                    </View>
                    {
                        bankInfor.IsDefault && <View style={styles.setDefault}>
                            <View style={styles.defaultBox}>
                                <Text style={styles.defaultBoxText}>✓</Text>
                            </View>
                            <Text style={{ color: '#1CBD64', fontSize: 11, fontWeight: 'bold' }}>Mặc Định</Text>
                        </View>
                    }
                </View>
                <View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ color: window.isBlue ? '#707070' : 'rgba(255, 255, 255, .5)' }}>Tên Chủ Tài Khoản Ngân Hàng</Text>
                        <Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{getName(bankInfor.AccountHolderName)}</Text>
                    </View>
                    <View style={{ paddingTop: 15 }}>
                        <Text style={{ color: window.isBlue ? '#707070' : 'rgba(255, 255, 255, .5)' }}>Số Tài Khoản Ngân Hàng</Text>
                        <Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{bankInfor.AccountNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
                    </View>
                    {
                        //     <View style={{ paddingTop: 15 }}>
                        //     <Text style={{ color: window.isBlue ? '#707070' : 'rgba(255, 255, 255, .5)' }}>Tỉnh</Text>
                        //     <Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{bankInfor.Province}</Text>
                        // </View>
                        // <View style={{ paddingTop: 15 }}>
                        //     <Text style={{ color: window.isBlue ? '#707070' : 'rgba(255, 255, 255, .5)' }}>Thành Phố</Text>
                        //     <Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{bankInfor.City}</Text>
                        // </View>
                        // <View style={{ paddingTop: 15 }}>
                        //     <Text style={{ color: window.isBlue ? '#707070' : 'rgba(255, 255, 255, .5)' }}>Chi Nhánh</Text>
                        //     <Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{bankInfor.Branch}</Text>
                        // </View>
                    }
                </View>
                {
                    window.isSTcommon_url && <TouchableOpacity onPress={this.deleteCard.bind(this)}>
                        <Text>telate</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    }
}

export default BankDetails = connect(
    (state) => {
        return {}
    }, (dispatch) => {
        return {
            getDepositUserBankAction: () => dispatch(getDepositUserBankAction()),
            getWithdrawalUserBankAction: () => dispatch(getWithdrawalUserBankAction()),
        }
    }
)(BankDetailsContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    defaultBoxText: {
        color: '#fff',
    },
    setDefault: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    defaultBox: {
        width: 20,
        height: 20,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CBD64',
        marginRight: 5
    },
    bankBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#4C4C4C34',
        borderBottomWidth: 1,
        paddingVertical: 20
    },
    bankIcon: {
        width: 30 * .82,
        height: 25 * .82,
        marginRight: 5
    },
})