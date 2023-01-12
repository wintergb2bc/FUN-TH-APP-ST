/**
 * 人脸样本采集封装（百度AI-SDK）
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Modal,
    Text,
    View,
    Image,
    NativeModules,
    NativeEventEmitter,
    ScrollView,
    Platform,
    TextInput,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Toast from '@/containers/Toast'

import PasswordGesture from './gesturePassword/index'

import Touch from "react-native-touch-once";
import { passwordReg } from "../../actions/Reg";
import styles from './style'
import { Actions } from 'react-native-router-flux';
import { connect } from "react-redux";
import { login } from "../../actions/AuthAction";


const { width, height } = Dimensions.get("window");
class LoginPattern extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesArray: [],
            passwordValue: '',
            validation: '',
            message: 'การตั้งค่ารหัสแพทเทิร์นนี้สำหรับเข้าสู่ระบบแบบรวดเร็ว\nกรุณาลากรหัสตั้งแต่ 4-9 หลัก',
            status: 'normal',
            timeOut: 300,
            beforPassword: '',//首次图形密码
        };
    }

    handleTextInput(passwordValue) {
        this.setState({ passwordValue })
    }

    okBtn() {
        if (passwordReg.test(this.state.passwordValue) == false) {
            Toast.fail("เฉพาะ 'A-Z', 'a-z', '0-9' (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)", 2);
            return;
        }
        //Toast.loading('กำลังโหลดข้อมูล...', 2000)
        //登录验证密码是否正确
        if (this.props.fastChange) {
            //快捷登录切换
            window.fastChangeLogin && window.fastChangeLogin(this.props.username, this.state.passwordValue, 'LoginPattern')
        } else {
            //首页快捷登录
            window.fastLogin && window.fastLogin(this.props.username, this.state.passwordValue, 'LoginPattern')
        }

    }

    onEnd(password) {
        const { timeOut, beforPassword } = this.state;
        if (beforPassword === '') {
            if (password.length < 4) {
                this.setState({
                    status: 'wrong',
                });
                Toast.fail("กรุณาลากรหัสตั้งแต่ 4-9 หลัก", 2);
                return;
            }
            this.setState({ beforPassword: password })
            if (timeOut) {
                this.time = setTimeout(() => {
                    this.setState({
                        status: 'normal',
                        message: 'กรุณายืนยันรหัสแพทเทิร์นอีกครั้ง',
                    });
                }, timeOut)
            }
        } else {
            if (password === beforPassword) {
                this.setState({
                    status: 'right',
                });


                let fastLoginKey = 'fastLogin' + this.props.username + 'tuxxing';
                let sfastLoginId = 'fastLogin' + this.props.username + 'tuxxing';
                global.storage.save({
                  key: fastLoginKey,
                  id: sfastLoginId,
                  data: 'tuxxing',
                  expires: null
                });



                // setTimeout(() => {
                //     this.setState({ validation: 'ok' })
                //     this.goHome()
                // }, 350);
            } else {
                this.setState({
                    status: 'wrong',
                    message: 'รหัสไม่ตรงกัน กรุณาใส่รหัสใหม่อีกครั้ง',
                });
            }
        }
    }

    onStart() {
        this.setState({ status: 'normal' })
        if (this.state.beforPassword != '') {
            this.setState({
                message: 'กรุณายืนยันรหัสแพทเทิร์นอีกครั้ง',
            });
        }
        if (this.state.timeOut) {
            clearTimeout(this.time);
        }
    }

    //重新输入
    errorBack() {
        this.setState({
            status: 'normal',
            beforPassword: '',
            message: 'การตั้งค่ารหัสแพทเทิร์นนี้สำหรับเข้าสู่ระบบแบบรวดเร็ว\nกรุณาลากรหัสตั้งแต่ 4-9 หลัก',
        });
    }

    goHome() {
        //保存图形密码
        let storageKey = 'patternKey' + this.props.username;
        let storageId = 'patternId' + this.props.username
        global.storage.save({
            key: storageKey,
            id: storageId,
            data: this.state.beforPassword,
            expires: null
        });
        //快捷登录方式
        let fastLoginKey = 'fastLogin' + this.props.username;
        let sfastLoginId = 'fastLogin' + this.props.username;
        global.storage.save({
            key: fastLoginKey,
            id: sfastLoginId,
            data: 'LoginPattern',
            expires: null
        });
        //验证成功跳转
        setTimeout(() => {
            if (!this.props.fastChange) {
                let username = "loginok";
                let password = "loginok";
                this.props.login({ username, password });
            } else {
                window.checkActiveType && window.checkActiveType('LoginPattern')
                Actions.pop()
            }
        }, 2000);
    }

    render() {
        window.patternCheck = (key) => {
            this.setState({ validation: 'active' })

        }
        const { validation, passwordValue, beforPassword } = this.state;
        return (<LinearGradient style={styles.viewContainer} colors={["rgba(0, 174, 239, 1)", "rgba(0, 0, 0, 0.5)"]} locations={[0.3, 1]}>
            {/* <ScrollView
                contentContainerStyle={{ flex: 1 }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            > */}

          
            {
                <Modal animationType='fade' transparent={true} visible={this.state.status == 'right'}>
                    <View style={[styles.modalContainer]}>
                        <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                            <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                                <Text style={styles.modalTopText}>การแจ้งเตือนรหัสแพทเทิร์น</Text>
                            </View>
                            <View style={styles.modalBody}>
                                <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
                                    การตั้งค่ารหัสแพทเทิร์นสำเร็จ คุณสามารถใช้งานได้
                                </Text>

                                <View style={styles.modalBtnBox}>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({ validation: 'ok' })
                                        this.goHome()
                                    }} style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}>
                                        <Text style={[styles.modalBtnText, { color: '#fff' }]}>การตั้งค่าเสร็จสิ้น</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            }


            {
                validation != 'active' ?
                    <View>
                        <View>
                            {
                                validation === '' && <View style={styles.validation}>
                                    <Text style={styles.titleTxt}>กรุณาใส่รหัสเพื่อเปิดการใช้งาน</Text>
                                    <Image
                                        resizeMode="stretch"
                                        source={require("../../images/login/unlockOKK.png")}
                                        style={{ width: .25 * width, height: .25 * width, marginTop: 30 }}
                                    />
                                    <Text style={styles.username}>{this.props.username}</Text>
                                    <View style={styles.passInput}>
                                        <Text style={styles.longinTouchInputText}>รหัสผ่าน</Text>
                                        <TextInput
                                            placeholder='กรุณาใส่รหัสสผ่าน (6-20 ตัวอักษร)'
                                            style={styles.longinTouchInput}
                                            value={passwordValue}
                                            placeholderTextColor="rgba(0, 0, 0, .5)"
                                            secureTextEntry={true}
                                            onChangeText={value => this.handleTextInput(value)}
                                        />
                                    </View>
                                    <View>
                                        <Touch onPress={() => { this.okBtn() }}>
                                            <View style={[styles.onBtn, {
                                                marginHorizontal: 30,
                                                width: width - 90,
                                            }]}>
                                                <Text style={styles.okBtnTxt}>ยืนยัน</Text>
                                            </View>
                                        </Touch>

                                        {
                                            // !ApiPort.UserLogin && <View>
                                            //     <TouchableOpacity style={{ height: 34, justifyContent: 'center', alignItems: 'center', marginTop: 15 }} onPress={() => {
                                            //     Actions.pop()
                                            // }}>
                                            //     <Text style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}>Đăng Nhập Thông Thường</Text>
                                            // </TouchableOpacity>
                                            // </View>
                                        }
                                    </View>
                                </View>
                            }


                            {
                                validation === 'ok' && <View style={styles.validation}>
                                    <Text style={styles.titleTxt}>{`รหัสแพทเทิร์นของคุณได้ถูกบันทึกเรียบร้อยแล้ว\nคุณสามารถทำการเข้าระบบได้ทันที`}</Text>
                                    <View style={{ marginLeft: 15 }}>
                                        <Image
                                            resizeMode="stretch"
                                            source={require("../../images/login/unlockOK.png")}
                                            style={{ width: .4 * width, height: .273 * width }}
                                        />
                                    </View>
                                    <Text style={styles.username}>{this.props.username}</Text>
                                </View>
                            }
                        </View>
                    </View>
                    :
                    <PasswordGesture
                        ref="pg"
                        status={this.state.status}
                        message={this.state.message}
                        onStart={() => this.onStart()}
                        onEnd={password => this.onEnd(password)}
                        innerCircle={true}
                        outerCircle={true}
                        allowCross={true}
                        interval={this.state.timeOut}
                        normalColor={"#fff"}
                        rightColor={"#00B324"}
                        wrongColor={"red"}
                        textStyle={{ textAlign: "center", lineHeight: 22, color: "#fff" }}
                        style={{ backgroundColor: 'transparent' }}
                    >
                        {beforPassword != "" && (
                            <View style={[styles.patternTxt, { top: height / 1.4 }]}>
                                <Touch onPress={() => { this.errorBack() }}>
                                    <View style={styles.onBtn}>
                                        <Text style={styles.okBtnTxt}>กรุณาใส่รหัสแพทเทิร์นอีกครั้ง</Text>
                                    </View>
                                </Touch>
                            </View>
                        )}
                    </PasswordGesture>
            }
            {/* </ScrollView> */}
        </LinearGradient>
        );
    }
}


const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
    login: loginDetails => {
        login(dispatch, loginDetails);
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPattern);