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

class DailyDealsApplicationContainer extends React.Component {
    constructor(props) {
        super(props)
        let bonusProductList = this.props.bonusProductList || []
        this.state = {
            balanceInforIndex: bonusProductList.length == 1 ? 0 : -99,
            arrowFlag: false,
            balanceInfor: [],
            promotionsDetail: bonusProductList,
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
        // this.props.navigation.setParams({
        // 	title: <Text style={{fontSize: 12}}>Thưởng Miễn Phí Mỗi Ngày</Text>
        // })
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
            <Text style={[styles.WalletModalDropdownListText, { color: window.isBlue ? '#000' : '#fff' }]}>{balanceInforItem ? balanceInforItem.localizedName : item.walletName.toLocaleUpperCase()}</Text>
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
        let tempData = promotionsDetail[balanceInforIndex]
        let params = `bonusItem=${this.props.dailyDeals.bonusItem}&bonusAmount=${tempData.givenAmount}&bonusRuleId=${tempData.bonusRuleID}&bonusGroupID=${tempData.bonusGroupID}&`
        Toast.loading('กำลังโหลดข้อมูล...', 200000)
        fetchRequest(ApiPort.PostApplyDailyDeals + params, 'POST').then(res => {
            Toast.hide()
            if (res) {
                if (res.isSuccess) {
                    // Toast.success(res.message, 1.5)
                    this.setState({
                        isShowModalFlag2: true
                    })
                    this.props.getDailyDealsPromotion()
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
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
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
                                    // Actions.PreferentialRecords({
                                    //     tabIndex: 0
                                    // })
                                    Actions.pop()
                                    Actions.pop()
                                    this.props.changeRewardIndex(1)
                                    // this.props.changeTab(1)
                                    window.PiwikMenberCode('Promo History', 'View', 'Status_DailyDeals')
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
                {
                    Array.isArray(promotionsDetail) && balanceInfor.length > 0 && promotionsDetail.length > 0 &&
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ paddingLeft: 8, color: window.isBlue ? '#333' : '#878787', marginBottom: 5, fontWeight: '600', fontSize: 14 }}>บัญชีที่ต้องการเล่น</Text>

                        <ModalDropdown
                            animated={true}
                            disabled={promotionsDetail.length == 1}
                            options={promotionsDetail}
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
                            <View style={[styles.targetWalletBox, {
                                backgroundColor: promotionsDetail.length == 1 ? (window.isBlue ? '#F2F2F2' : '#212121') : (window.isBlue ? '#fff' : '#0F0F0F'),
                                borderColor: promotionsDetail.length == 1 ? (window.isBlue ? '#C4C4C4' : '#878787') : (window.isBlue ? '#F2F2F2' : '#00CEFF')
                            }]}>
                                <View style={styles.lbimgIconBox}>

                                    <Image
                                        resizeMode='stretch'
                                        source={require('./../../../images/promotion/preferential/preferentialRecord/wallet.png')}
                                        style={styles.promotionListNo}
                                    ></Image>

                                    <Text style={[styles.toreturnModalDropdownText, { color: balanceInforIndex != -99 ? (window.isBlue ? '#000' : '#FFFFFF') : '#B7B7B7' }]}>
                                        {
                                            balanceInforIndex != -99
                                                ?
                                                (
                                                    balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail[balanceInforIndex].wallet.toLocaleUpperCase())
                                                        ?
                                                        balanceInfor.find(v => v.name.toLocaleUpperCase() == promotionsDetail[balanceInforIndex].wallet.toLocaleUpperCase()).localizedName
                                                        :
                                                        promotionsDetail[balanceInforIndex].walletName.toLocaleUpperCase()
                                                )
                                                :
                                                'กรุณาเลือกบัญชี'
                                        }
                                    </Text>
                                </View>
                                {
                                    promotionsDetail.length != 1 && <ModalDropdownArrow arrowFlag={arrowFlag} />
                                }
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
                        <Text style={{ textAlign: 'center', color: window.isBlue ? '#3C3C3C' : '#FFFFFF', fontWeight: 'bold', fontSize: 18.5 }}>{promotionsDetail[0].bonusGroupTitle}</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingHorizontal: 20 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: window.isBlue ? '#707070' : '#C3C3C3', textAlign: 'center' }}>{`เงินฟรีจาก\nสิทธิพิเศษรายวันยอด`}</Text>
                                <Text style={{ color: '#25AAE1', fontWeight: 'bold', fontSize: 18, marginTop: 6 }}>{balanceInforIndex >= 0 ? promotionsDetail[balanceInforIndex].givenAmount : 0}</Text>
                            </View>
                            <View style={{ height: 60, width: 2, backgroundColor: '#F2F2F2' }}></View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ color: window.isBlue ? '#707070' : '#C3C3C3', textAlign: 'center' }}>{`ยอดเดิมพันหมุนเวียน\nที่ต้องปลดล็อก`}</Text>
                                <Text style={{ color: '#25AAE1', fontWeight: 'bold', fontSize: 18, marginTop: 6 }}>{balanceInforIndex >= 0 ? promotionsDetail[balanceInforIndex].releaseValue : 0}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>


            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: balanceInforIndex >= 0 ? (window.isBlue ? '#25AAE1' : '#33C85D') : (window.isBlue ? '#CECECE' : '#000000') }]}
                onPress={() => {
                    if (balanceInforIndex < 0) return
                    this.setState({
                        isShowModalFlag1: true
                    })

                    PiwikMenberCode('Promo Application', 'Click', 'Apply_DailyDeals')
                }}>
                <Text style={styles.closeBtnText}>ตกลง</Text>
            </TouchableOpacity>
        </View>
    }
}

export default DailyDealsApplication = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
        }
    }, (dispatch) => {
        return {

        }
    }
)(DailyDealsApplicationContainer)

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
        bottom: 40,
        height: 40,
        backgroundColor: '#33C85D',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        width: width - 60,
        marginHorizontal: 20,
        borderRadius: 4
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