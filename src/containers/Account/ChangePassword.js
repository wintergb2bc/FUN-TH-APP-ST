import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, TouchableOpacity, Image, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import { passwordReg, passwordErrTip1 } from '../../actions/Reg'

const { width, height } = Dimensions.get('window')

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '  ',
            confirmNewPassword: ' ',
            newPassword: ' ',

            oldPasswordErr: false,
            newPasswordErr: false,
            isOpenEye1: false,
            isOpenEye2: false,


            isShowModal: false,
            isRelate: this.props.isRelate
        }
    }

    changePwd() {
        const { oldPassword, newPassword, confirmNewPassword, oldPasswordErr, newPasswordErr } = this.state

        const oldPasswordTrim = oldPassword.trim()
        const newPasswordTrim = newPassword.trim()
        const confirmNewPasswordTrim = confirmNewPassword.trim()

        if (oldPassword == '') {
            Toast.fail('ไม่สามารถเว้นช่องรหัสผ่านได้', 2)
            return
        } else if (!passwordReg.test(oldPassword)) {
            Toast.fail(`เฉพาะ 'A-Z', 'a-z', '0-9' (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)`, 2)
            return
        }


        if (newPasswordTrim == '') {
            Toast.fail('ไม่สามารถเว้นช่องรหัสผ่านได้', 2)
            return
        } else if (!passwordReg.test(newPasswordTrim)) {
            Toast.fail(`เฉพาะ 'A-Z', 'a-z', '0-9' (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)`, 2)
            return
        }



        if (oldPassword == newPasswordTrim) {
            Toast.fail('รหัสผ่านใหม่จะต้องไม่ซ้ำรหัสผ่านเดิม', 2)
            return
        }


        const params = {
            'oldPassword': oldPasswordTrim,
            'newPassword': newPasswordTrim
        }

        Toast.loading('กำลังโหลดข้อมูล...', 2000)

        fetchRequest(ApiPort.Password + '?', 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                let message = res.message
                this.setState({
                    isShowModal: true
                })
                //message && Toast.success(message, 2)

            } else {
                let result = res.result
                if (result) {
                    let message = result.Message
                    message && Toast.fail(message, 2)
                }

            }
        }).catch(error => {
            Toast.hide()
        })
    }

    render() {
        const { isOpenEye1, isShowModal, isOpenEye2, oldPassword, newPassword, confirmNewPassword, oldPasswordErr, newPasswordErr, isRelate } = this.state
        const PasswordTextInforColor = { color: window.isBlue ? '#323232' : '#fff' }
        const PasswordInput = {
            backgroundColor: window.isBlue ? '#fff' : '#000',
            color: window.isBlue ? '#323232' : '#fff',
            borderColor: window.isBlue ? '#D1D1D1' : '#00AEEF',
            borderBottomWidth: 2,
            borderBottomColor: '#D1D1D1'
        }
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F3F4F8' : '#000' }]}>
            <Modal transparent={true} visible={isShowModal} animationType='fade'>
                <View style={[styles.modalContainer]}>
                    <View style={styles.modalBox}>
                        <Text style={{ paddingVertical: 15, textAlign: 'center' }}>{`อัปเดตรหัสผ่านสำเร็จ\nเข้าสู่ระบบตอนนี้`}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    isShowModal: false
                                })
                                globalLogout(true)
                            }}
                            style={{
                                height: 44,
                                borderTopColor: '#dedede',
                                borderTopWidth: 1,
                                alignItems: 'center',
                                width: .7 * width,
                                justifyContent: 'center'
                            }}>
                            <Text style={{ color: '#007AFF' }}>ยืนยัน</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    isRelate
                        ?
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <View style={{
                                // width: 60, 
                                // height: 60, 
                                borderRadius: 10000,
                                justifyContent: 'center',
                                alignItems: 'center',
                                ///  backgroundColor: '#FFFFFF', 
                                marginBottom: 4
                            }}>
                                <Image resizeMode='stretch' source={require('./../../images/account/changePwd1.png')} style={{ width: 40, height: 40, marginBottom: 5 }} />
                            </View>
                            <Text style={{ color: '#58585B', fontSize: 14 }}>เปลี่ยนรหัสผ่าน</Text>
                            <Text style={{ color: '#06ADEF', fontSize: 12 }}>เพื่อให้แน่ใจว่าบัญชีของคุณปลอดภัย กรุณาอัปเดตรหัสผ่าน</Text>
                        </View>
                        :
                        <View style={{ alignItems: 'center', marginTop: 15 }}>
                            <View style={{
                                width: 60, height: 60, borderRadius: 10000,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#FFFFFF', marginBottom: 4
                            }}>
                                <Image resizeMode='stretch' source={require('./../../images/account/changePwd.png')} style={{ width: 40, height: 40, marginBottom: 5 }} />
                            </View>
                            <Text style={{ color: '#58585B', fontSize: 16 }}>รหัสผ่าน</Text>
                        </View>
                }

                <View style={[styles.viewPaddingContainer, {}]}>
                    <View style={styles.passwordInputWrap}>
                        {/* 当前密码 ： */}
                        <Text style={[styles.passwordInputText, PasswordTextInforColor]}>รหัสผ่านปัจจุบัน</Text>
                        <View style={{ justifyContent: 'center' }}>
                            <TextInput
                                secureTextEntry={isOpenEye1 ? false : true}
                                value={oldPassword.trim()}
                                placeholder={'กรอกรหัสผ่าน (6-20 ตัวอักษร)'}
                                placeholderTextColor='#D5D2D2'
                                onChangeText={oldPassword => {
                                    this.setState({
                                        oldPassword,
                                        oldPasswordErr: !passwordReg.test(oldPassword)
                                    })
                                }}
                                style={[styles.passwordInput, PasswordInput]}
                            ></TextInput>

                            <View style={{ position: 'absolute', right: 15 }}>
                                <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => {
                                    this.setState({
                                        isOpenEye1: !isOpenEye1
                                    })
                                }}>
                                    <Image resizeMode='stretch' source={isOpenEye1 ? require('../../images/login/eyes.png') : require('../../images/login/eyeopen.png')} style={{ width: 25, height: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View>


                        <Text style={{ color: '#9E9E9E', fontSize: 12, marginTop: 4 }}>รหัสผ่านจะต้องประกอบด้วยอักษรภาษาอังกฤษและตัวเลขอย่างน้อย 6 ถึง 20 ตัวอักษรเท่านั้น</Text>
                        {
                            // !oldPassword
                            //     ?
                            //     <Text style={{ color: 'red', marginTop: 10 }}>Mật khẩu hiện tại không thể để trống.</Text>
                            //     :
                            //     (oldPasswordErr && <Text style={{ color: 'red', marginTop: 10 }}>{passwordErrTip1}</Text>)
                        }
                    </View>

                    <View style={styles.passwordInputWrap}>
                        {/* 新密码： */}
                        <Text style={[styles.passwordInputText, PasswordTextInforColor]}>รหัสผ่านใหม่</Text>
                        <View>
                            <View style={{ justifyContent: 'center' }}>
                                <TextInput
                                    secureTextEntry={isOpenEye2 ? false : true}
                                    value={newPassword.trim()}
                                    placeholder={'กรอกรหัสผ่าน (6-20 ตัวอักษร)'}
                                    placeholderTextColor='#D5D2D2'
                                    style={[styles.passwordInput, PasswordInput]}
                                    onChangeText={newPassword => {
                                        this.setState({
                                            newPassword,
                                            newPasswordErr: !passwordReg.test(newPassword)
                                        })
                                    }}
                                ></TextInput>
                                <View style={{ position: 'absolute', right: 15 }}>
                                    <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => {
                                        this.setState({
                                            isOpenEye2: !isOpenEye2
                                        })
                                    }}>
                                        <Image resizeMode='stretch' source={isOpenEye2 ? require('../../images/login/eyes.png') : require('../../images/login/eyeopen.png')} style={{ width: 25, height: 20 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={{ color: '#9E9E9E', fontSize: 12, marginTop: 4 }}>รหัสผ่านจะต้องประกอบด้วยอักษรภาษาอังกฤษและตัวเลขอย่างน้อย 6 ถึง 20 ตัวอักษรเท่านั้น</Text>
                        </View>
                        {
                            // !newPassword
                            //     ?
                            //     <Text style={{ color: 'red', marginTop: 10 }}>Mật khẩu mới không thể để trống.</Text>
                            //     :
                            //     (
                            //         newPasswordErr
                            //             ?
                            //             <Text style={{ color: 'red', marginTop: 10 }}>{passwordErrTip1}</Text>
                            //             :
                            //             newPassword === oldPassword && <Text style={{ color: 'red', marginTop: 10 }}>Mật khẩu mới không được giống với mật khẩu cũ.</Text>
                            //     )
                        }
                    </View>

                </View>
            </ScrollView>
            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={this.changePwd.bind(this)}>
                <Text style={styles.closeBtnText}>บันทึก</Text>
            </TouchableOpacity>
        </View>

    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    pageInforTextWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 40,
        justifyContent: 'center'
    },
    pageInforText: {
        fontSize: 16
    },
    viewPaddingContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 15,
        paddingTop: 15
    },
    passwordInputWrap: {
        marginBottom: 15,
    },
    passwordInputText: {
        marginBottom: 5,
        fontSize: 13
    },
    passwordInput: {
        borderWidth: 1,
        paddingLeft: 10,
        fontSize: 14,
        height: 42,
        width: width - 20,
        borderRadius: 4
    },
    closeBtnWrap: {
        marginHorizontal: 10,
        width: width - 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 50,
        borderRadius: 6
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBox: {
        width: .7 * width,
        overflow: 'hidden',
        borderRadius: 6,
        backgroundColor: '#F2F2F2',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
})