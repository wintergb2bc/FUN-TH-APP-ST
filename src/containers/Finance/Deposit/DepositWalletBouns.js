import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Modal, Image } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import Toast from '@/containers/Toast'
const { width, height } = Dimensions.get('window')
import { toThousands } from '../../../actions/Reg'

class WalletBouns extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            balanceInfor: this.props.balanceInfor.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL'),
            targetWalletIndex: 0,
            money: this.props.money,
            moneyFlag: this.props.moneyFlag,
            walletBouns: [],
            walletBounsIndex: 0,
            bounsInforText: '',
            bonusTurnOverInfor: {},
            bonusId: this.props.bonusId,
            bonusApplicableSite: this.props.bonusApplicableSite,
            isShowDepositWalletBouns: false
        }
    }

    componentDidMount(props) {
        let targetWalletIndex = this.props.depositingWalletIndex
        this.setState({
            targetWalletIndex
        }, () => {
            this.getBouns(targetWalletIndex)
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({
                moneyFlag: nextProps.moneyFlag
            })
        }

        if (nextProps && nextProps.money !== this.state.money) {
            this.setState({
                bonusTurnOverInfor: {},
                money: nextProps.money,
            }, () => {
                // this.getCalculateBonusTurnOver()
                // this.bonusCalculate()
            })
        }
    }

    changeWalletIndex(targetWalletIndex, v) {
        this.setState({
            targetWalletIndex,
            walletBounsIndex: 0
        }, () => {
            this.props.getDepositWallet(v.name)
            this.getBouns(targetWalletIndex, true)
        })
    }

    getBouns(targetWalletIndex, flag) {
        this.setState({
            walletBouns: [],
            bounsInforText: '',
            bonusTurnOverInfor: {}
        })
        const { balanceInfor, bonusApplicableSite, bonusId } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.Bonus + '?transactionType=Deposit&wallet=' + balanceInfor[targetWalletIndex].name + '&', 'GET').then(res => {
            Toast.hide()
            let walletBouns = res
            if (Array.isArray(walletBouns) && walletBouns.length) {
                this.setState({
                    walletBouns
                }, () => {
                    if (bonusApplicableSite) {
                        let tempWalletBounsIndex = walletBouns.findIndex(v => v.id * 1 === bonusId)
                        this.setState({
                            walletBounsIndex: tempWalletBounsIndex >= 0 ? tempWalletBounsIndex : 0
                        }, () => {
                            this.getCalculateBonusTurnOver()
                        })
                    } else {
                        this.props.getDepositBouns(walletBouns[0].id)
                        //this.getCalculateBonusTurnOver()
                        //this.bonusCalculate()
                    }
                })
            }
        }).catch(() => {
            Toast.hide()
        })
    }

    getCalculateBonusTurnOver() {
        this.setState({
            bonusTurnOverInfor: {}
        })
        const { moneyFlag, balanceInfor, walletBouns, walletBounsIndex, targetWalletIndex, money } = this.state
        if (!(moneyFlag && walletBouns.length)) return
        fetchRequest(ApiPort.GetCalculateBonusTurnOver + 'bonusId=' + walletBouns[walletBounsIndex].id + '&applyAmount=' + money + '&', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                let bonusTurnOverInfor = {
                    applyAmount: money,
                    ...res,
                    availableBonusesList: walletBouns[walletBounsIndex]
                }
                this.setState({
                    bonusTurnOverInfor
                })
                this.props.getBonusTurnOverInfor(bonusTurnOverInfor)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    bonusCalculate() {
        this.setState({
            bounsInforText: ''
        })
        const { moneyFlag, balanceInfor, walletBouns, walletBounsIndex, targetWalletIndex, money } = this.state
        if (!(moneyFlag && walletBouns.length)) return
        let params = {
            'transactionType': 'deposit',
            'bonusId': walletBouns[walletBounsIndex].bonusCouponID,
            'amount': money,
            'wallet': balanceInfor[targetWalletIndex].name,
            'couponText': 'string',
            'blackBoxValue': E2Backbox,
            'e2BlackBoxValue': E2Backbox,
        }

        fetchRequest(ApiPort.BonusCalculate, 'POST', params).then(data => {
            Toast.hide()
            if (data.errorMessage) {
                this.setState({
                    bounsInforText: data.errorMessage
                })
            }
            if (data.previewMessage) {
                this.setState({
                    bounsInforText: data.previewMessage
                })
            }
        }).catch(() => {
            Toast.hide()
        })
    }

    createWalletList(item, index) {
        let flag = this.state.targetWalletIndex * 1 === index * 1
        return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
            <View style={styles.balanceLeft}>
                <View style={[styles.balanceLeftCircle, { backgroundColor: item.color }]}></View>
                <Text style={[styles.toreturnModalDropdownListText]}>{item.localizedName}</Text>
            </View>
            <Text style={[styles.toreturnModalDropdownListText]}>{toThousands(item.balance)}</Text>
        </View>
    }

    createBounsList(item, index) {
        let flag = this.state.walletBounsIndex * 1 === index * 1
        return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
            <Text style={[styles.toreturnModalDropdownListText]}>{item.title}</Text>
        </View>
    }

    changeBounsIndex(walletBounsIndex, v) {
        this.setState({
            walletBounsIndex
        }, () => {
            this.props.getDepositBouns(v.id)
            //this.bonusCalculate()
            //this.getCalculateBonusTurnOver()
        })
    }

    render() {
        const { isShowDepositWalletBouns, bonusApplicableSite, bonusTurnOverInfor, balanceInfor, targetWalletIndex, walletBouns, walletBounsIndex, bounsInforText } = this.state
        const PasswordInput1 = { backgroundColor: window.isBlue ? (bonusApplicableSite ? 'rgba(0, 0, 0, .1)' : '#fff') : '#000', color: window.isBlue ? '#000' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
        const { isShowBouns } = this.props
        return isShowBouns ? <View style={styles.viewContainer}>
            <Modal animationType='fade' transparent={true} visible={isShowDepositWalletBouns}>
                <View style={styles.homeModalContainer}>
                    <View style={styles.modalBox}>
                        <Image source={require('./../../../images/finance/financeAfter/transferAfter.png')}
                            style={[styles.depositImg]}
                            resizeMode='stretch'></Image>

                        <Text style={[{ color: '#25B869', fontSize: 20, fontWeight: 'bold' }]}>กำลังดำเนินการ</Text>
                        <Text style={[{ color: '#323232', fontSize: 18, marginBottom: 15, marginTop: 5 }]}>เงินฝากจะเข้าสู่บัญชีของคุณใน 15 นาที</Text>

                        <View>
                            <Text style={[styles.depostMoney]}>ยอดฝาก</Text>
                            <View style={[styles.depostMoneyBox, { borderColor: window.isBlue ? '#E5E5E5' : '#7F7F7F', backgroundColor: window.isBlue ? '#F2F2F2' : '#7F7F7F' }]}>
                                <Text style={{ color: window.isBlue ? '#000' : '#fff' }}>{toThousands(this.props.money)}</Text>
                            </View>
                        </View>

                        {
                            bonusTurnOverInfor.isSuccess && <View style={[styles.targetWalletWrap]}>
                                <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ข้อมูลโบนัส</Text>
                                <View style={styles.preferentialList}>
                                    <View style={styles.preferentialListBox}>
                                        <Text style={[styles.preferential]}>โบนัสที่ขอรับ</Text>
                                        <Text style={[styles.preferentialTxt]}>{toThousands(bonusTurnOverInfor.applyAmount)}</Text>
                                    </View>

                                    <View style={styles.preferentialListBox}>
                                        <Text style={[styles.preferential]}>โบนัสที่ได้รับ</Text>
                                        <Text style={[styles.preferentialTxt]}>{toThousands(bonusTurnOverInfor.bonusGiven)}</Text>
                                    </View>

                                    <View style={styles.preferentialListBox}>
                                        <Text style={[styles.preferential]}>ยอดเทิร์นของโบนัส</Text>
                                        <Text style={[styles.preferentialTxt]}>{toThousands(bonusTurnOverInfor.turnOver)}</Text>
                                    </View>
                                </View>
                            </View>
                        }


                        <View style={styles.transferBtnWrap}>
                            <TouchableOpacity style={[styles.LBdepositPageBtn1]} onPress={() => {
                                this.setState({
                                    isShowDepositWalletBouns: false
                                })
                            }}>
                                <Text style={[styles.LBdepositPageBtnText1, { color: '#00AEEF' }]}>สถานะโบนัส</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: '#00AEEF' }]} onPress={() => {
                                this.setState({
                                    isShowDepositWalletBouns: false
                                })

                            }}>
                                <Text style={[styles.LBdepositPageBtnText1, { color: '#fff' }]}>กลับสู้หน้าประวัติรายการ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {
                false && <View style={styles.targetWalletWrap}>
                    <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Đến Tài Khoản</Text>
                    <ModalDropdown
                        disabled={bonusApplicableSite}
                        animated={true}
                        options={balanceInfor}
                        renderRow={this.createWalletList.bind(this)}
                        onSelect={this.changeWalletIndex.bind(this)}
                        style={[styles.toreturnModalDropdown]}
                        dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: balanceInfor.length * 30 + 5 }]}
                    >
                        <View style={[styles.targetWalletBox, PasswordInput1]}>
                            <Text style={[styles.toreturnModalDropdownText]}>{balanceInfor[targetWalletIndex].localizedName}</Text>
                            <View style={[styles.toreturnModalDropdownArrow, { borderTopColor: window.isBlue ? '#000' : '#00CEFF' }]}></View>
                        </View>
                    </ModalDropdown>
                </View>
            }

            {
                walletBouns.length > 0 && <View style={[styles.targetWalletWrap, { marginBottom: 40 }]}>
                    <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}></Text>
                    <ModalDropdown
                        disabled={bonusApplicableSite}
                        animated={true}
                        options={walletBouns}
                        renderRow={this.createBounsList.bind(this)}
                        onSelect={this.changeBounsIndex.bind(this)}
                        style={[styles.toreturnModalDropdown]}
                        dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: walletBouns.length * 30 + 5 }]}
                    >
                        <TouchableOpacity
                            // onPress={() => {
                            //     this.setState({
                            //         isShowDepositWalletBouns: true
                            //     })
                            // }}
                            style={[styles.targetWalletBox, { height: 'auto', paddingVertical: 10, backgroundColor: '#59BA6C' }]}>
                            <Text style={[styles.toreturnModalDropdownText, { color: '#fff' }]}>{walletBouns[walletBounsIndex].title}</Text>
                            {/* <View style={[styles.toreturnModalDropdownArrow, { borderTopColor: window.isBlue ? '#4B4B4B' : '#00CEFF' }]}></View> */}
                        </TouchableOpacity>
                    </ModalDropdown>
                </View>
            }
        </View>
            :
            <View />
    }
}

export default WalletBouns

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    limitListsText: {
        marginBottom: 5,
    },
    preferentialList: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 8,

    },
    preferential: {
        color: '#3C3C3C',
        textAlign: 'center',
        fontSize: 13
    },
    preferentialTxt: {
        textAlign: 'center',
        fontSize: 22,
        color: '#3C3C3C',
        fontWeight: 'bold'
    },
    preferent: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 8,
        paddingHorizontal: 5,
        borderRadius: 4,
        marginBottom: 10
    },
    depostMoney: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 5
    },
    bounsInforText: {
        color: 'red',
        height: 40,
        lineHeight: 40,
        paddingHorizontal: 10
    },
    balanceLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    balanceLeftCircle: {
        width: 8,
        height: 8,
        borderRadius: 100,
        marginRight: 8
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
        height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    toreturnModalDropdown: {
        justifyContent: 'center',
        width: width - 20,
    },
    targetWalletBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#f2f2f2',
        alignItems: 'center',
        borderRadius: 4,
        // shadowColor: '#4C4C4C34',
        // shadowRadius: 4,
        // shadowOpacity: .6,
        // shadowOffset: { width: 2, height: 2 },
        // elevation: 4,
    },
    toreturnModalDropdownArrow: {
        width: 0,
        height: 0,
        marginTop: 5,
        borderStyle: 'solid',
        borderWidth: 5,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent'
    },
    targetWalletWrap: {
        width: width - 20,
        marginBottom: 10
    },
    homeModalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        justifyContent: 'flex-end'
    },
    modalBox: {
        height: height * .8,
        backgroundColor: '#fff',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        overflow: 'hidden',
        alignItems: 'center'
    },
    depositImg: {
        height: .374 * width,
        width: .454 * width,
        marginTop: 20
    },
    depostMoneyBox: {
        borderWidth: 1,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
        marginBottom: 15,
        width: width - 20
    },
    transferBtnWrap: {

    },
    LBdepositPageBtn1: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 20,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: '#00AEEF',
        backgroundColor: '#fff',
        borderRadius: 6,
        marginTop: 10
    },
    LBdepositPageBtnText1: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    preferentialListBox: {
        width: (width - 30) / 3,
    },
})