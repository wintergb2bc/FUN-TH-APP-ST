import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, DeviceEventEmitter, TextInput, Modal, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { maskPhone, getName } from '../../../actions/Reg'
const { width, height } = Dimensions.get('window')

export default class DailyDealShipping extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shippingAddress: [],
            shippingAddressIndex: 0,
            dailyDeals: this.props.dailyDeals,
            remark: '',
            modalStatus: false
        }
    }

    componentDidMount() {
        this.getStorageShippingAddress()
        this.listener = DeviceEventEmitter.addListener('shippingAddress', res => {
            this.setState({
                shippingAddress: res
            })
        })
    }

    componentWillUnmount() {
        if (this.listener) { this.listener.remove() }
    }

    getStorageShippingAddress() {
        global.storage.load({
            key: 'shippingAddress',
            id: 'shippingAddress'
        }).then(data => {
            this.setState({
                shippingAddress: data
            })
            this.getShippingAddress()
        }).catch(() => {
            this.getShippingAddress(true)
        })
    }

    getShippingAddress(flag) {
        flag && Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.ChangeShippingAddress, 'GET').then(res => {
            Toast.hide()
            let shippingAddress = res
            if (Array.isArray(shippingAddress)) {

                let defaultShippingAddress = shippingAddress.find(v => v.defaultAddress)
                if (defaultShippingAddress) {
                    let defaultBankIndex = shippingAddress.findIndex(v => v.defaultAddress)
                    shippingAddress.splice(defaultBankIndex, 1)
                    shippingAddress.unshift(defaultShippingAddress)
                }
                this.setState({
                    shippingAddress
                })
                global.storage.save({
                    key: 'shippingAddress',
                    id: 'shippingAddress',
                    data: shippingAddress,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    postApplyDailyDeals() {
        const { dailyDeals, remark, shippingAddress, shippingAddressIndex } = this.state
        if (!shippingAddress.length) return
        const shippingAddressList = shippingAddress[shippingAddressIndex]
        let params = {
            recipientFirstName: shippingAddressList.firstName,
            recipientLastName: shippingAddressList.lastName,
            postalCode: shippingAddressList.postalCode,
            contactNo: shippingAddressList.phoneNumber,
            email: shippingAddressList.email,
            province: shippingAddressList.province,
            district: shippingAddressList.district,
            town: shippingAddressList.town,
            houseNumber: shippingAddressList.houseNumber,
            zone: '',
            address: shippingAddressList.address,
            remark
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostApplyDailyDeals + 'contentId=' + dailyDeals.id + '&bonusAmount=' + dailyDeals.bonusAmount + '&bonusItem=' + dailyDeals.bonusItem + '&', 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success(res.message, 2, () => {
                    this.setState({
                        modalStatus: true
                    })
                })
                this.props.getDailyDealsPromotion && this.props.getDailyDealsPromotion()
            } else {
                Toast.fail(res.message, 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    render() {
        const { modalStatus, remark, shippingAddress, shippingAddressIndex } = this.state
        const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', color: window.isBlue ? '#3C3C3C' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <Modal animationType='fade' visible={modalStatus} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                            <Text style={styles.modalTopText}>สิทธิพิเศษรายวัน</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={[styles.modalBodyText, { color: window.isBlue ? '#000' : '#fff' }]}>ยินดีด้วย! อัปเดทรางวัลของคุณเรียบร้อยแล้ว</Text>
                            <TouchableOpacity style={styles.modalBtnbox} onPress={() => {
                                this.setState({
                                    modalStatus: false
                                })
                                Actions.promotionLogin()
                            }}>
                                <Text style={styles.modalBtnboxText}>เรียบร้อย</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <KeyboardAwareScrollView>
                <View>
                    <Text style={[styles.dailyDealShippingText1, { color: window.isBlue ? '#000' : '#fff' }]}>FUN88 จะทำการจัดส่งของรางวัลตามที่อยู่ที่คุณแจ้งภายใน 30 วัน หากคุณไม่ทำการแจ้งที่อยู่หรือกรอกที่อยู่ไม่ครบถ้วน ทางเราขอสงวนสิทธิ์ในการจัดส่ง</Text>
                </View>
                <View>
                    {
                        shippingAddress.length > 0 && shippingAddress.map((v, i) => {
                            return <TouchableOpacity key={i} style={[styles.shippingAddressBox, { borderColor: shippingAddressIndex === i ? '#25AAE1' : '#fff', backgroundColor: window.isBlue ? '#fff' : '#212121' }]} onPress={() => {
                                this.setState({
                                    shippingAddressIndex: i
                                })
                            }}>

                                <TouchableOpacity style={styles.shippingAddressCorcow} onPress={() => {
                                    Actions.DailyDealAddress({
                                        isAdd: false,
                                        shippingAddress: v,
                                        getShippingAddress: () => {
                                            this.getShippingAddress()
                                        }
                                    })
                                }}>
                                    <Image resizeMode='stretch' source={require('./../../../images/promotion/DailyDeals/change.png')} style={styles.rewardTimeImg}></Image>
                                </TouchableOpacity>
                                <View style={[styles.shippingAddressCircle, { backgroundColor: window.isBlue ? 'transparent' : '#fff' }]}>
                                    {
                                        shippingAddressIndex === i && <View style={styles.shippingAddressCircleInner}></View>
                                    }
                                </View>

                                <View>
                                    <View style={styles.shippingAddressWrap}>
                                        <Text style={[styles.shippingAddressText1, { color: window.isBlue ? '#727272' : '#fff' }]}>ชื่อผู้รับ :</Text>
                                        <Text style={[styles.shippingAddressText2, { color: window.isBlue ? '#727272' : '#fff' }]}>{getName(v.firstName + ' ' + v.lastName)}</Text>
                                    </View>
                                    <View style={styles.shippingAddressWrap}>
                                        <Text style={[styles.shippingAddressText1, { color: window.isBlue ? '#727272' : '#fff' }]}>เบอร์ติดต่อ :</Text>
                                        <Text style={[styles.shippingAddressText2, { color: window.isBlue ? '#727272' : '#fff' }]}>{maskPhone(v.phoneNumber)}</Text>
                                    </View>
                                    <View style={styles.shippingAddressWrap}>
                                        <Text style={[styles.shippingAddressText1, { color: window.isBlue ? '#727272' : '#fff' }]}>ที่อยู่ :</Text>
                                        <Text style={[styles.shippingAddressText2, { color: window.isBlue ? '#727272' : '#fff' }]}>{v.houseNumber}</Text>
                                    </View>
                                    <View style={styles.shippingAddressWrap}>
                                        <Text style={[styles.shippingAddressText1, { color: window.isBlue ? '#727272' : '#fff' }]}>ที่อยู่ไปรษณีย์ :</Text>
                                        <Text style={[styles.shippingAddressText2, { color: window.isBlue ? '#727272' : '#fff' }]}>{v.postalCode}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        })
                    }
                </View>
                <View style={styles.dailyDealShippingBtnBox}>
                    <TouchableOpacity style={styles.dailyDealShippingBtn} onPress={() => {
                        Actions.DailyDealAddress({
                            isAdd: true,
                            getShippingAddress: () => {
                                this.getShippingAddress()
                            }
                        })
                    }}>
                        <Text style={styles.dailyDealShippingBtnText1}>+ ที่อยู่ในการจัดส่งใหม่</Text>
                    </TouchableOpacity>
                </View>

                {
                    shippingAddress.length > 0 && <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>หมายเหตุ</Text>
                        <TextInput
                            value={remark}
                            maxLength={1500}
                            style={[styles.limitListsInput, PasswordInput]}
                            onChangeText={remark => {
                                this.setState({
                                    remark
                                })
                            }} />
                    </View>
                }

                {
                    shippingAddress.length > 0 && <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: shippingAddress.length > 0 ? '#00AEEF' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={this.postApplyDailyDeals.bind(this)}>
                        <Text style={styles.closeBtnText}>เสร็จ</Text>
                    </TouchableOpacity>
                }
            </KeyboardAwareScrollView>

        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: 'relative',
        paddingHorizontal: 10,
        paddingBottom: 50
    },
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 6,
        width: width * .9,
        overflow: 'hidden'
    },
    modalTop: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25AAE1'
    },
    modalTopText: {
        color: '#fff'
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: 'center',
        paddingHorizontal: 20
    },
    modalBodyText: {
        textAlign: 'center'
    },
    modalBtnbox: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: width * .4,
        backgroundColor: '#25AAE1',
        borderRadius: 4,
        marginTop: 15
    },
    modalBtnboxText: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold'
    },
    dailyDealShippingText1: {
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    dailyDealShippingText2: {
        textAlign: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    dailyDealShippingBtnBox: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    dailyDealShippingBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: width * .6,
    },
    dailyDealShippingBtnCircle: {
        borderWidth: 2,
        borderRadius: 100,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        marginRight: 10
    },
    dailyDealShippingBtnText1: {
        fontWeight: 'bold',
        color: '#5AB6E2'
    },
    shippingAddressCorcow: {
        position: 'absolute',
        top: 20,
        zIndex: 10000,
        right: 20
    },
    shippingAddressBox: {
        borderRadius: 6,
        borderWidth: 1,
        width: width - 20,
        padding: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    shippingAddressText1: {
        color: '#727272',
        fontWeight: 'bold'
    },
    shippingAddressText2: {
        color: '#727272'
    },
    shippingAddressWrap: {
        flexDirection: 'row',
        height: 28,
        alignItems: 'center'
    },
    shippingAddressCircle: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#707070',
        borderRadius: 100,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shippingAddressCircleInner: {
        width: 12,
        height: 12,
        backgroundColor: '#25AAE1',
        borderRadius: 100
    },
    limitLists: {
        marginBottom: 40,
    },
    limitListsText: {
        marginBottom: 5,
    },
    limitListsInput: {
        borderWidth: 1,
        // borderTopColor: '#F2F2F2',
        // borderLeftColor: '#F2F2F2',
        // borderRightColor: '#F2F2F2',
        // borderBottomColor: '#4C4C4C34',
        paddingLeft: 6,
        paddingRight: 6,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center'
    },
    closeBtnWrap: {
        marginTop: 20,
        width: width - 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    rewardTimeImg: {
        width: 25,
        height: 25
    }
})