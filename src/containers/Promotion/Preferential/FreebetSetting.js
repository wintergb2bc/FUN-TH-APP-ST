import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, TextInput, Image, Modal } from 'react-native'
import ModalDropdown from 'react-native-modal-dropdown'
import { connect } from 'react-redux'
import ModalDropdownArrow from '../../Common/ModalDropdownArrow'
import { toThousands } from '../../../actions/Reg'
import * as Animatable from 'react-native-animatable'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View

class FreebetSettingContainer extends React.Component {
    constructor(props) {
        super(props)
        let promotionsDetail = this.props.promotionsDetail
        let bonusProductList = promotionsDetail.bonusProductList || []
        this.state = {
            balanceInforIndex: bonusProductList.length == 1 ? 0 : -99,
            arrowFlag: false,
            balanceInfor: [],
            promotionsDetail,
            isShowModalFlag1: false,
            isShowModalFlag2: false,
            isShowModalFlag3: false
        }
    }

    componentDidMount() {
        if (this.props.balanceInforData.length) {
            this.setState({
                balanceInfor: this.props.balanceInforData.filter(v => !['TOTALBAL', 'MAIN'].includes(v.category.toLocaleUpperCase()))
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.balanceInforData.length) {
            this.setState({
                balanceInfor: nextProps.balanceInforData.filter(v => !['TOTALBAL', 'MAIN'].includes(v.category.toLocaleUpperCase()))
            })
        }
    }

    createWalletList(item) {
        const { balanceInfor } = this.state
        let balanceInforItem = balanceInfor.find(v => v.name.toLocaleUpperCase() == item.wallet.toLocaleUpperCase())
        return <View style={styles.WalletModalDropdownList}>
            <View style={[styles.balanceLeftCircle, { backgroundColor: balanceInforItem ? balanceInforItem.color : '#C1DFFF' }]}></View>
            <Text style={[styles.WalletModalDropdownListText, { color: window.isBlue ? '#000' : '#fff' }]}>{balanceInforItem ? balanceInforItem.localizedName : item.wallet.toLocaleUpperCase()}</Text>
        </View>
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    submitMemberInfor() {
        this.setState({
            isShowModalFlag1: false
        })
        const { balanceInfor, balanceInforIndex, promotionsDetail } = this.state
        let params = {
            "blackBox": E2Backbox,
            "bonusId": promotionsDetail.bonusProductList[balanceInforIndex].bonusID,
            "amount": promotionsDetail.bonusProductList[balanceInforIndex].bonusAmount,
            "bonusMode": "Transfer",
            "targetWallet": promotionsDetail.bonusProductList[balanceInforIndex].wallet,
            "transferBonus": {
                "isFreeBet": true
            }
        }

        Toast.loading('กำลังโหลดข้อมูล...', 200000)
        fetchRequest(ApiPort.PostApplications, 'POST', params).then(res => {
            Toast.hide()
            if (res) {
                let bonusResult = res.bonusResult || { message: '' }

                if (bonusResult.message.toLocaleUpperCase() == 'SUCCESS') {
                    // Toast.success(res.message, 1.5)
                    this.setState({
                        isShowModalFlag2: true
                    })
                    this.props.getPromotionsApplications()
                } else {
                    // Toast.fail(res.message, 1.5)
                    this.setState({
                        isShowModalFlag3: true
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    render() {
        const { promotionsDetail, balanceInfor, arrowFlag, balanceInforIndex, isShowModalFlag1, isShowModalFlag2, isShowModalFlag3 } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#EDEDED' : '#212121' }]}>
            <Modal animationType='fade' transparent={true} visible={isShowModalFlag1}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                            <Text style={styles.modalTopText}>คำเตือน</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
                                โปรดทราบ เมื่อกดยืนยันรับโบนัสเดิมพันฟรีบัญชี จะถูกล็อคชั่วคราว จนกว่าจะทำยอดหมุนเวียนครบตามกำหนด
                            </Text>

                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#25AAE1' }]} onPress={() => {
                                    this.setState({
                                        isShowModalFlag1: false
                                    })
                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#25AAE1' }]}>ยกเลิก</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}
                                    onPress={this.submitMemberInfor.bind(this)}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>ตกลง ฉันเข้าใจแล้ว</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal animationType='fade' transparent={true} visible={isShowModalFlag2}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#25AAE1' : '#212121', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }]}>
                            <Text style={{ color: '#fff' }}>โบนัสสิทธิพิเศษรายวัน</Text>
                            <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, top: 10 }}
                                onPress={() => {
                                    this.setState({
                                        isShowModalFlag2: false
                                    })
                                }}
                            >
                                <Text style={[styles.modalTopText, { textAlign: 'right', fontSize: 20 }]}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.modalBody, { alignItems: 'center' }]}>
                            <Image
                                style={{ height: 60, width: 60, marginBottom: 15 }}
                                source={require('./../../../images/promotion/preferential/preferentialRecord/freeRight.png')}
                                resizeMode='stretch'></Image>
                            <Text style={{ color: '#00CC33', fontSize: 16, marginBottom: 10, textAlign: 'center' }}>กดรับสำเร็จ</Text>
                            <Text style={[styles.reasonText, { color: window.isBlue ? '#262626' : '#fff' }]}>เข้าร่วมโปรโมชั่นเรียบร้อยแล้ว</Text>

                            <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#25AAE1', width: width * .9 - 40, marginTop: 20 }]}
                                onPress={() => {
                                    this.setState({
                                        isShowModalFlag2: false
                                    })
                                    Actions.PreferentialRecords({
                                        tabIndex: 0
                                    })
                                }}
                            >
                                <Text style={[styles.modalBtnText, { color: '#fff' }]}>ตรวจสอบสถานะ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal animationType='fade' transparent={true} visible={isShowModalFlag3}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#25AAE1' : '#212121', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 }]}>
                            <Text style={{ color: '#fff' }}>โบนัสสิทธิพิเศษรายวัน</Text>
                            <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, top: 10 }}
                                onPress={() => {
                                    this.setState({
                                        isShowModalFlag3: false
                                    })
                                }}
                            >
                                <Text style={[styles.modalTopText, { textAlign: 'right', fontSize: 20 }]}>X</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.modalBody, {}]}>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ height: 60, width: 60, marginBottom: 15 }}
                                    source={require('./../../../images/promotion/preferential/preferentialRecord/freeRight1.png')}
                                    resizeMode='stretch'></Image>
                            </View>
                            <Text style={{ color: '#FF2727', fontSize: 18, marginBottom: 10, textAlign: 'center' }}>ไม่สามารถกดรับได้</Text>
                            <Text style={[styles.reasonText, { color: window.isBlue ? '#262626' : '#fff' }]}>เกิดข้อผิดพลาด โปรดลองอีกครั้ง หรือติดต่อฝ่ายบริการลูกค้า เพื่อขอรับความช่วยเหลือ</Text>


                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#25AAE1' }]} onPress={() => {
                                    this.setState({
                                        isShowModalFlag3: false
                                    })
                                    Actions.LiveChat()
                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#25AAE1' }]}>ติดต่อฝ่ายบริการลูกค้า</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}
                                    onPress={() => {
                                        this.setState({
                                            isShowModalFlag3: false
                                        })
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>ตกลง</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: window.isBlue ? '#000' : '#fff' }}>{promotionsDetail.title}</Text>
                {
                    Array.isArray(promotionsDetail.bonusProductList) && balanceInfor.length > 0 && promotionsDetail.bonusProductList.length > 0 &&
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ paddingLeft: 8, color: window.isBlue ? '#333' : '#878787', marginBottom: 5, fontWeight: '600', fontSize: 16, textAlign: 'center' }}>{`เงินฟรีจาก\nสิทธิพิเศษรายวันยอด`}</Text>

                        <ModalDropdown
                            animated={true}
                            options={promotionsDetail.bonusProductList}
                            renderRow={this.createWalletList.bind(this)}
                            style={[styles.WalletModalDropdown, { borderBottomColor: window.isBlue ? '#f6f6f6' : '#212121' }]}
                            onDropdownWillShow={this.changeArrowStatus.bind(this, true)}
                            onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
                            onSelect={balanceInforIndex => {
                                this.setState({
                                    balanceInforIndex
                                })
                            }}
                            dropdownStyle={[styles.WalletDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}
                        >
                            <View style={[styles.targetWalletBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: window.isBlue ? '#F2F2F2' : '#00CEFF' }]}>
                                <View style={styles.lbimgIconBox}>

                                    <Image
                                        resizeMode='stretch'
                                        source={require('./../../../images/promotion/preferential/preferentialRecord/wallet.png')}
                                        style={styles.promotionListNo}
                                    ></Image>


                                    {/* {
                                        balanceInforIndex != -99 && <View style={[styles.balanceLeftCircle, {
                                            backgroundColor: balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusProductList[balanceInforIndex].wallet.toLocaleUpperCase()) ? balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusProductList[balanceInforIndex].wallet.toLocaleUpperCase()).color : '#C1DFFF'
                                        }]}></View>
                                    } */}
                                    <Text style={[styles.toreturnModalDropdownText, { color: balanceInforIndex != -99 ? (window.isBlue ? '#000' : '#FFFFFF') : '#B7B7B7' }]}>
                                        {
                                            balanceInforIndex != -99
                                                ?
                                                (
                                                    balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusProductList[balanceInforIndex].wallet.toLocaleUpperCase())
                                                        ?
                                                        balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail.bonusProductList[balanceInforIndex].wallet.toLocaleUpperCase()).localizedName
                                                        :
                                                        promotionsDetail.bonusProductList[balanceInforIndex].wallet.toLocaleUpperCase()
                                                )
                                                :
                                                'กรุณาเลือกบัญชี'
                                        }
                                    </Text>
                                </View>
                                <ModalDropdownArrow arrowFlag={arrowFlag} />
                            </View>
                        </ModalDropdown>

                    </View>
                }
                <View>
                    <Text style={{ paddingLeft: 8, color: window.isBlue ? '#333' : '#878787', marginBottom: 5, fontWeight: '600', fontSize: 16 }}>รายละเอียด</Text>

                    <View style={{
                        backgroundColor: window.isBlue ? '#fff' : '#000', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 4, shadowColor: window.isBlue ? '#DADADA' : '#000',
                        shadowRadius: 4,
                        shadowOpacity: .6,
                        shadowOffset: { width: 2, height: 2 },
                        elevation: 4,
                        borderWidth: 1,
                        borderColor: window.isBlue ? '#F2F2F2' : '#000'
                    }}>
                        <Text style={{ textAlign: 'center', color: window.isBlue ? '#3C3C3C' : '#FFFFFF', fontWeight: '500', fontSize: 18 }}>{promotionsDetail.title}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 20 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: window.isBlue ? '#707070' : '#C3C3C3' }}>เงินฟรีจาก สิทธิพิเศษรายวันยอด</Text>
                                <Text style={{ color: '#25AAE1', fontWeight: 'bold', fontSize: 18, marginTop: 6 }}>{balanceInforIndex >= 0 ? toThousands(promotionsDetail.bonusProductList[balanceInforIndex].bonusAmount) : toThousands(0)}</Text>
                            </View>
                            <View style={{ height: 60, width: 2, backgroundColor: '#F2F2F2' }}></View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: window.isBlue ? '#707070' : '#C3C3C3', textAlign: 'center' }}>{`ยอดเดิมพันหมุนเวียน\nที่ต้องปลดล็อก`}</Text>
                                <Text style={{ color: '#25AAE1', fontWeight: 'bold', fontSize: 18, marginTop: 6 }}>{balanceInforIndex >= 0 ? toThousands(promotionsDetail.bonusProductList[balanceInforIndex].turnoverNeeded) : toThousands(0)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>


            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: balanceInforIndex >= 0 ? (window.isBlue ? '#33C85D' : '#33C85D') : (window.isBlue ? '#CECECE' : '#000000') }]}
                onPress={() => {
                    if (balanceInforIndex < 0) return
                    this.setState({
                        isShowModalFlag1: true
                    })
                }}>
                <Text style={styles.closeBtnText}>Xác nhận</Text>
            </TouchableOpacity>
        </View>
    }
}

export default FreebetSetting = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
        }
    }, (dispatch) => {
        return {

        }
    }
)(FreebetSettingContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 10
    },
    WalletModalDropdownList: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 20
    },
    balanceLeftCircle: {
        width: 8,
        height: 8,
        borderRadius: 100,
        marginRight: 8
    },
    WalletModalDropdown: {
        height: 40,
        borderBottomColor: '#f6f6f6',
        borderBottomWidth: 1,
        width: width - 20,
    },
    WalletDropdownStyle: {
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
    },
    targetWalletBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        height: 42,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#F2F2F2',
    },
    lbimgIconBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
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
        width: (width * .9 - 40) * .48,
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
    promotionListNo: {
        width: 26,
        height: 22,
        marginRight: 5
    },
})