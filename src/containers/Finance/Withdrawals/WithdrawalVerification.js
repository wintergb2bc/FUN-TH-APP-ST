import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction } from './../../../actions/ReducerAction'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import * as Animatable from 'react-native-animatable'

const { width } = Dimensions.get('window')
const AnimatableText = Animatable.Text

class WithdrawalVerificationContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageInfor: {
                SNC0001: {
                    title: 'กรุณาทำการยืนยันชื่อ-นามสกุล', // 需要全名验证
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName.png')} style={[styles.WithdrawalVerificationImg0]}></Image>,
                    text1: 'รายการถอนไม่สามารถดำเนินการได้',
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>ระบบจะไม่สามารถดำเนินการถอนหากชื่อบัญชีไม่ตรงกับชื่อที่ลงทะเบียน กรุณาทำการยืนยันข้อมูลชื่อ-นามสกุล โดยการส่งเอกสารเพื่อยืนยันตัวมาที่
                            <Text style={[styles.WithdrawalVerificationText2, { color: window.isBlue ? '#25AAE1' : '#fff' }]}> ประวัติของฉัน > อัปโหลดเอกสาร.</Text></Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#25AAE1' }]}
                            onPress={() => {
                                this.postInsertNewAccountHolderName()
                            }}
                        >
                            <Text style={styles.withdrawalVerificationButton1Text}>อัปโหลดเอกสารตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton2, { borderColor: '#25AAE1', borderWidth: 1 }]} onPress={() => {
                            Actions.pop()
                        }}>
                            <Text style={styles.withdrawalVerificationButton2Text}>ยกเลิก</Text>{/* 取消 */}
                        </TouchableOpacity>
                    </View>
                },
                SNC0002: {
                    title: 'การยืนยันข้อมูลยังไม่สำเร็จ',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName.png')} style={[styles.WithdrawalVerificationImg0]}></Image>,
                    text1: 'รายการถอนไม่สามารถดำเนินการได้',
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>ระบบจะไม่สามารถดำเนินการถอนหากชื่อบัญชีไม่ตรงกับชื่อที่ลงทะเบียน กรุณาทำการยืนยันข้อมูลชื่อ-นามสุกล โดยการส่งเอกสารเพื่อยืนยันตัวมาที่
                            <Text style={[styles.WithdrawalVerificationText2, { color: window.isBlue ? '#25AAE1' : '#fff' }]}> ประวัติของฉัน > อัปโหลดเอกสาร.</Text></Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>ถ้าคุณได้ทำการอัปโหลดเอกสารแล้วกรุณารอการตรวจสอบ หากมีข้อมูลอื่นสอบถามเพิ่มเติมกรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ</Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton3, { backgroundColor: '#25AAE1' }]} onPress={() => {
                            Actions.pop()
                        }}>
                            <Text style={styles.withdrawalVerificationButton3Text}>อัปโหลดเอกสารแล้ว</Text>{/* 我已上传 */}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            //Actions.pop()
                            Actions.Uploadfile({
                                fromPage: 'WithdrawalVerification'
                            })
                        }}>
                            <Text style={[styles.withdrawalVerificationButton1Text, { color: '#25AAE1' }]}>ยืนยันตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.withdrawalVerificationButton2} onPress={() => {
                            Actions.LiveChat()
                        }}>
                            <Text style={styles.withdrawalVerificationButton2Text}>เจ้าหน้าที่ฝ่ายบริการ</Text>{/* 客服 */}
                        </TouchableOpacity>
                    </View>
                },
                SNC0003: {
                    title: 'Thông Báo Đang Xử Lý Xác Minh',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName.png')} style={[styles.WithdrawalVerificationImg0]}></Image>,
                    text1: 'รายการถอนไม่สามารถดำเนินการได้',
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>ข้อมูลบัญชีธนาคารกำลังอยู่ในระหว่างการตรวจสอบ กรุณารอระบบแจ้งสถานะการยืนยันข้อมูล</Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>หากมีข้อมูลอื่นสอบถามเพิ่มเติมกรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการ</Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#25AAE1' }]} onPress={() => {
                            Actions.pop()
                        }}>
                            <Text style={styles.withdrawalVerificationButton1Text}>ตกลง</Text>{/* 知道了 */}
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton2, { borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            Actions.LiveChat()
                        }}>
                            <Text style={styles.withdrawalVerificationButton2Text}>เจ้าหน้าที่ฝ่ายบริการ</Text>{/* 客服 */}
                        </TouchableOpacity>
                    </View>
                },
                CURRENTWITHDRAWALTHRESHOLD: {
                    title: '',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName4.png')} style={[styles.WithdrawalVerificationImg4]}></Image>,
                    text1: 'ยืนยันชื่อ-นามสกุลเพื่อตรวจสอบบัญชีก่อนการถอน',
                    //您已达到最大提款限额。 请在个人资料 -“上传文件页面”上传所需文件以验证您的身份。
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>คุณได้ทำการถอนเงินถึงยอดลิมิตแล้ว กรุณาอัปโหลดเอกสารในหน้า</Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>โปรไฟล์ในหัวข้ออัปโหลดเอกสาร </Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#00AEEF', borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            //Actions.pop()
                            Actions.Uploadfile({
                                fromPage: 'WithdrawalVerification'
                            })
                        }}>
                            <Text style={[styles.withdrawalVerificationButton1Text, { color: '#fff' }]}>ยืนยันตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                    </View>
                },
                DESIREDWITHDRAWALTHRESHOLD: {
                    title: '',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName4.png')} style={[styles.WithdrawalVerificationImg4]}></Image>,
                    text1: 'ทำการถอนเกินลิมิต',
                    //很抱歉，您提交的金额已超过了您帐户的剩余提款限额。 请申请较低金额再次提交或联系在线客服以获取更多详细信息
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>ขออภัยท่านรายการถอนเกินลิมิต กรุณาทำรายการอีกครั้งในจำนวนที่สามารถทำถอนได้ หรือ</Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ </Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton3, { backgroundColor: '#25AAE1' }]} onPress={() => {
                            Actions.pop()
                        }}>
                            <Text style={styles.withdrawalVerificationButton3Text}>ทำรายการถอนใหม่</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.withdrawalVerificationButton2} onPress={() => {
                            Actions.LiveChat()
                        }}>
                            <Text style={styles.withdrawalVerificationButton2Text}>เจ้าหน้าที่ฝ่ายบริการ</Text>{/* 客服 */}
                        </TouchableOpacity>
                    </View>
                },
                KYCRULEID5: {
                    title: '',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName1.png')} style={[styles.WithdrawalVerificationImg3]}></Image>,
                    text1: 'เอกสารที่ต้องการสำหรับการยืนยันบัญชี',
                    //我们注意到您帐户存在异常。 请在个人资料-“上传文件页面”上传所需文件以验证您的身份，或联系在线客服寻求协助
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>เนื่องจากมีการตรวจสอบพบความผิดปกติในบัญชีของท่าน กรุณาส่งเอกสารเพื่อยืนยันตัวตนของท่านโดยการ </Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>อัปโหลดเอกสารในหน้าการตั้งค่าโปรไฟล์ </Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#00AEEF', borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            Actions.pop()
                            Actions.Uploadfile({
                                fromPage: 'WithdrawalVerification'
                            })
                        }}>
                            <Text style={[styles.withdrawalVerificationButton1Text, { color: '#fff' }]}>ยืนยันตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                    </View>
                },
                P106003: {
                    title: '',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName4.png')} style={[styles.WithdrawalVerificationImg4]}></Image>,
                    text1: 'ยืนยันชื่อ-นามสกุลเพื่อตรวจสอบบัญชีก่อนการถอน',
                    //您的提款请求已提交。 但是您已达到最大提款限额。 请在个人资料 -“上传文件页面”上传所需文件以验证您的身份
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>คุณได้ส่งเรื่องถอนเงิน โดยการถอนเงินของคุณถึงยอดลิมิตแล้ว กรุณาอัปโหลดเอกสารในหน้า</Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>โปรไฟล์ในหัวข้ออัปโหลดเอกสาร</Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#00AEEF', borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            //Actions.pop()
                            Actions.Uploadfile({
                                fromPage: 'WithdrawalVerification'
                            })
                        }}>
                            <Text style={[styles.withdrawalVerificationButton1Text, { color: '#fff' }]}>ยืนยันตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                    </View>
                },
                P106004: {
                    title: '',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName1.png')} style={[styles.WithdrawalVerificationImg3]}></Image>,
                    text1: 'เอกสารที่ต้องการสำหรับการยืนยันบัญชี',
                    //我们注意到您帐户存在异常。 请在个人资料-“上传文件页面”上传所需文件以验证您的身份，或联系在线客服寻求协助。
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>เนื่องจากมีการตรวจสอบพบความผิดปกติในบัญชีของท่าน กรุณาส่งเอกสารเพื่อยืนยันตัวตนของท่านโดยการ </Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>อัปโหลดเอกสารในหน้าการตั้งค่าโปรไฟล์ </Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#00AEEF', borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            //Actions.pop()
                            Actions.Uploadfile({
                                fromPage: 'WithdrawalVerification'
                            })
                        }}>
                            <Text style={[styles.withdrawalVerificationButton1Text, { color: '#fff' }]}>ยืนยันตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                    </View>
                },
                P106005: {
                    title: '',
                    img: <Image resizeMode='stretch' source={require('./../../../images/finance/withdrawals/fillName1.png')} style={[styles.WithdrawalVerificationImg3]}></Image>,
                    text1: 'เอกสารที่ต้องการสำหรับการยืนยันชื่อจริง',
                    //您的提款请求已提交。 但是系统检测到您的注册名字与提款银行帐户名称之间存在差异。 请在个人资料 -“上传文件页面”上传所需文件以验证您的身份，或联系在线客服寻求协助。
                    text2: <View style={styles.WithdrawalVerificationbox}>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>เนื่องจากระบบตรวจพบความแตกต่างระหว่างชื่อจริงที่ท่านลงทะเบียนกับชื่อบัญชีผู้ถอน  กรุณาส่งเอกสารเพื่อยืนยันตัวตนของท่านโดยการ</Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>อัปโหลดเอกสารในหน้าการตั้งค่าโปรไฟล์  </Text>
                        <Text style={[styles.WithdrawalVerificationText1, { color: window.isBlue ? '#333' : '#fff' }]}>หลังจากตรวจสอบหลักฐานแล้วทางเราจึงจะดำเนินการรายการถอนของท่าน  </Text>
                    </View>,
                    button: <View style={styles.withdrawalVerificationButtonBox}>
                        <TouchableOpacity style={[styles.withdrawalVerificationButton1, { backgroundColor: '#00AEEF', borderWidth: 1, borderColor: '#25AAE1' }]} onPress={() => {
                            //Actions.pop()
                            Actions.Uploadfile({
                                fromPage: 'WithdrawalVerification'
                            })
                        }}>
                            <Text style={[styles.withdrawalVerificationButton1Text, { color: '#fff' }]}>ยืนยันตอนนี้</Text>{/* 立即验证 */}
                        </TouchableOpacity>
                    </View>
                },
            },
            withdrawalType: this.props.withdrawalType,
            userName: '',
            bankName: this.props.bankName
        }
    }

    componentDidMount() {
        const { withdrawalType, pageInfor } = this.state
        this.props.navigation.setParams({
            title: pageInfor[withdrawalType].title
        })
        if (withdrawalType === 'SNC0001')
            if (this.props.memberInforData) {
                this.setState({
                    userName: this.props.memberInforData.FirstName
                })
            }
    }

    postInsertNewAccountHolderName() {
        const { bankName } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostInsertNewAccountHolderName + 'bankHolderName=' + bankName + '&', 'POST').then(data => {
            Toast.hide()
            if (data.isSuccess) {
                Actions.pop()
                Actions.Uploadfile({
                    fromPage: 'WithdrawalVerification'
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    render() {
        const { userName, bankName, pageInfor, withdrawalType } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
            <TouchableOpacity style={{ marginTop: 40, alignItems: 'center' }} hitSlop={{ top: 15, height: 15, right: 15, bottom: 15 }} onPress={() => {
                Actions.pop()
            }}>
                <Text style={{ color: '#059DD6', fontSize: 20, }}>X</Text>
            </TouchableOpacity>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >



                <View style={[styles.nameBox, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
                    <View alignItems='center'>
                        {pageInfor[withdrawalType].img}
                    </View>
                    <Text style={[styles.homeTitle2, { color: window.isBlue ? '#000' : '#fff' }]}>{pageInfor[withdrawalType].text1}</Text>
                </View>
                <View style={styles.pagesContainer}>
                    {pageInfor[withdrawalType].text2}

                    {
                        withdrawalType === 'SNC0001' &&
                        <View style={styles.nameStatusBox}>
                            <View style={styles.nameStatusBox1}>
                                <Text style={[styles.WithdrawalVerificationText3, { color: window.isBlue ? '#333333' : '#fff', }]}>ชื่อบัญชีที่ใช้ถอนเงิน:</Text>
                                <Text style={[styles.WithdrawalVerificationText4, { color: window.isBlue ? '#333' : '#fff' }]}>{bankName}</Text>
                            </View>
                            <View style={styles.nameStatusBox1}>
                                <Text style={[styles.WithdrawalVerificationText3, { color: window.isBlue ? '#333333' : '#fff', }]}>ชื่อที่ใช้สมัครสมาชิก:</Text>
                                <Text style={[styles.WithdrawalVerificationText4, { color: window.isBlue ? '#333' : '#fff' }]}>{userName}</Text>
                            </View>
                        </View>
                    }
                </View>
            </ScrollView>
            {pageInfor[withdrawalType].button}
        </View>
    }
}

export default WithdrawalVerification = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData
        }
    }, (dispatch) => {
        return {
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(WithdrawalVerificationContainer)

const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: '#fff',
        flex: 1,
    },
    nameStatusBox: {
        alignItems: 'center',
        marginTop: 40
    },
    nameBox: {
        backgroundColor: '#25AAE1',
        position: 'relative',
        paddingHorizontal: 20
    },
    homeTitle1: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    homeTitle2: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        marginBottom: 10
    },
    pagesContainer: {
        marginHorizontal: 15,
        marginTop: 5
    },
    withdrawalVerificationButtonBox: {
        position: 'absolute',
        marginHorizontal: 10,
        zIndex: 1000,
        bottom: 40
    },
    withdrawalVerificationButton1: {
        backgroundColor: '#1CBD64',
        width: width - 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginBottom: 10,
        borderRadius: 6
    },
    withdrawalVerificationButton1Text: {
        color: '#fff',
        fontWeight: 'bold'
    },
    withdrawalVerificationButton2: {
        width: width - 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 6
    },
    withdrawalVerificationButton2Text: {
        color: '#25AAE1',
        fontWeight: 'bold'
    },
    withdrawalVerificationButton3: {
        borderColor: '#25AAE1',
        borderWidth: 1,
        width: width - 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginBottom: 20,
        borderRadius: 6
    },
    withdrawalVerificationButton3Text: {
        color: '#25AAE1',
        fontWeight: 'bold',
        color: '#fff'
    },
    WithdrawalVerificationImg0: {
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        height: 50,
        width: 80,
    },
    WithdrawalVerificationImg3: {
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        height: 75,
        width: 80,
    },
    WithdrawalVerificationImg4: {
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        height: 80,
        width: 80,
    },
    WithdrawalVerificationImg1Box: {
        marginBottom: 15,
        marginTop: 15,
        height: 70,
        width: 70,
        borderWidth: 5,
        borderColor: '#25AAE1',
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center'
    },
    WithdrawalVerificationImg1: {
        textAlign: 'center',
        height: 28,
        width: 38,
    },
    WithdrawalVerificationImg2: {
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        height: 65,
        width: 70,
    },
    WithdrawalVerificationText1: {
        color: window.isBlue ? '#333333' : '#fff',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 15
    },
    WithdrawalVerificationText3: {
        color: window.isBlue ? '#333333' : '#fff',
        textAlign: 'center',
        fontSize: 15
    },
    WithdrawalVerificationText4: {
        color: window.isBlue ? '#333333' : '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 5
    },
    WithdrawalVerificationText2: {
        color: '#25AAE1',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15
    },
    WithdrawalVerificationbox: {
        alignItems: 'center'
    }
})