import React from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, TextInput, Platform, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { maskPhone, maskEmail } from './../../../actions/Reg'
import { getPromotionListInforAction } from '../../../actions/ReducerAction'
import { color } from 'react-native-reanimated'
const { width, height } = Dimensions.get('window')

class PromotionApplicationContaienr extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //firstName: '',
            name: '',
            phone: '',
            email: '',
            remark: '',
            pageFromFlag: this.props.pageFrom === 'PreferentialRecords',
            isSuccess: false
        }
    }

    componentDidMount() {
        const { pageFromFlag } = this.state
        this.setState({
            name: userNameDB,
        })
        if (pageFromFlag) {
            this.getPropsMemberContact()
        } else {
            this.getMemberContact()
        }
    }

    getMemberContact() {
        let memberInfor = this.props.memberInforData
        let contacts = memberInfor.Contacts || memberInfor.contacts
        let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let email = tempEmail ? tempEmail.Contact : ''
        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phone = tempPhone ? tempPhone.Contact : ''
        this.setState({
            phone,
            email,
            //firstName: memberInfor.FirstName,
            nameErr: true
        })
    }

    getPropsMemberContact() {
        const { promotionsDetail } = this.props
        this.setState({
            phone: promotionsDetail.manualContact,
            email: promotionsDetail.manualEmail,
            remark: promotionsDetail.manualRemark,
        })
    }

    submitPromotion() {
        const { firstName, phone, email, remark, name, nameErr } = this.state
        // if (!firstName) {
        //     if (!(nameErr && name)) {
        //         Toast.fail(RealNameErrTip, 2)
        //         return
        //     }
        // }
        let parmas = {
            firstName: name,
            promoId: this.props.promotionsDetail.contentId,
            remark: remark,
            Mobile: phone,
            Email: email,
            platform: Platform.OS
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PromotionsPost + '?', 'POST', parmas).then(data => {
            Toast.hide()
            if (data.isSuccess) {
                if (data.isPromoApplied) {
                    Toast.success(data.message, 2)
                    const { fromPage } = this.props
                    // if (fromPage) {
                    //     if (fromPage === 'preferentialPage') {
                    //         Actions.promotionLogin()
                    //     } else if (fromPage === 'homelPage') {
                    //         Actions.home()
                    //     }
                    // }
                    this.setState({
                        isSuccess: true
                    })
                    this.props.getPromotionListInforAction()
                } else {
                    Toast.fail(data.message, 2)
                }
            } else {
                Toast.fail(data.message, 2)
            }
        }).catch(error => {
            Toast.hide()
        })
    }

    render() {
        const { isSuccess, pageFromFlag, name, phone, email, remark, nameErr, firstName } = this.state
        return <View style={[styles.viewContainer]}>
            {
                pageFromFlag && <View style={styles.limitLists}>
                    <Text style={[styles.promationText, { color: window.isBlue ? '#000' : '#fff' }]}>{this.props.promotionsDetail.title}</Text>
                </View>
            }


            <Modal animationType='fade' transparent={true} visible={isSuccess}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                            <Text style={styles.modalTopText}>ขอรับโบนัส</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
                                การสมัครโปรโมชั่นสำเร็จ กรุณาไปที่เมนู “โบนัสของฉัน” เพื่อตรวจสอบ?
                            </Text>

                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}
                                    onPress={() => {
                                        this.setState({
                                            isSuccess: false
                                        })
                                        Actions.pop()
                                        Actions.pop()
                                        this.props.changeTab(1)
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>โบนัสของฉัน</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>



            <KeyboardAwareScrollView>


                <View style={[styles.limitLists, { marginBottom: 15 }]}>
                    <Text style={[styles.limitListsText]}>หมายเหตุ</Text>
                    {
                        !pageFromFlag
                            ?
                            <TextInput
                                rows={10}
                                editable={!pageFromFlag}
                                style={[styles.textareaItem, { backgroundColor: pageFromFlag ? '#F1F1F1' : '#fff' }]}
                                value={remark}
                                onChangeText={remark => {
                                    this.setState({
                                        remark
                                    })
                                }}

                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                multiline={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                                returnKeyType="done"
                            ></TextInput>
                            :
                            <Text style={[styles.limitListsInput]}>{remark}</Text>
                    }
                </View>


                <View style={styles.limitLists}>
                    <Text style={[styles.limitListsText]}>ยูสเซอร์เนม</Text>
                    <TextInput
                        value={name}
                        maxLength={20}
                        editable={false}
                        style={[styles.limitListsInput]}
                    />
                </View>

                {
                    email.length > 0 && <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText]}>อีเมล</Text>
                        <TextInput
                            value={pageFromFlag ? maskEmail(email) : maskEmail(email)}
                            editable={false}
                            style={[styles.limitListsInput]}
                        />
                    </View>
                }

                {
                    phone.length > 0 && <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText]}>เบอร์ติดต่อ</Text>
                        <TextInput
                            value={maskPhone(phone)}
                            editable={false}
                            style={[styles.limitListsInput]}
                        />
                    </View>
                }

                <Text style={{ color: '#868383', fontSize: 12 }}>หากคุณต้องการทำการเปลี่ยนแปลงข้อมูลเบอร์โทรและอีเมล กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ</Text>


                {
                    !pageFromFlag && <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.submitPromotion.bind(this)}>
                        <Text style={styles.closeBtnText}>เสร็จ</Text>
                    </TouchableOpacity>
                }
            </KeyboardAwareScrollView>


        </View>
    }
}

export default PreferentialApplication = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData
        }
    }, (dispatch) => {
        return {
            getPromotionListInforAction: () => dispatch(getPromotionListInforAction())
        }
    }
)(PromotionApplicationContaienr)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#F3F5F6',
        paddingTop: 15
    },
    promationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
        textAlign: 'center',
        width: width - 20,
    },
    limitLists: {
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    limitListsText: {
        fontWeight: 'bold',
        width: 90,
        color: '#323232'
    },
    limitListsInput: {
        paddingLeft: 6,
        paddingRight: 6,
        fontSize: 14,
        borderRadius: 4,
        justifyContent: 'center',
        marginBottom: 5,
        fontSize: 12,
        color: '#3C3C3C'
    },
    promotionText: {
        fontSize: 13
    },
    promotionText1: {
        color: '#00AEEF',
        textDecorationLine: 'underline',
        marginTop: 2
    },
    closeBtnWrap: {
        bottom: 0,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00ADEF',
        marginTop: 20,
        borderRadius: 6
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    textareaItem: {
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 4,
        height: 80,
        width: width - 20 - 90,
        paddingHorizontal: 10
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
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#25AAE1',
        paddingLeft: 20
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
    promotionListNo: {
        width: 26,
        height: 22,
        marginRight: 5
    },
})