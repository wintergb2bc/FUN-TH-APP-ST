/**
 * 人脸样本采集封装（百度AI-SDK）
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    NativeModules,
    NativeEventEmitter,
    ScrollView,
    Platform,
    TextInput,
    Dimensions
} from 'react-native';
import Toast from '@/containers/Toast'

import FingerprintScanner from 'react-native-fingerprint-scanner';
import Touch from "react-native-touch-once";
import { passwordReg } from "../../actions/Reg";
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get("window");

export default class FastLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkActive: '',
            loginOut: false,
            isShowKey: false
        };
    }
    componentDidMount() {
        let fastLoginKey = 'fastLogin' + this.props.username;
        let sfastLoginId = 'fastLogin' + this.props.username;
        storage.load({
            key: fastLoginKey,
            id: sfastLoginId
        })
            .then(data => {
                this.setState({ checkActive: data })
            })
            .catch(err => { })

        this.getKey()
    }

    getKey() {
        let fastLoginKey = 'fastLogin' + this.props.username + 'tuxxing';
        let sfastLoginId = 'fastLogin' + this.props.username + 'tuxxing';
        // LoginTouch  LoginPattern
        // Actions.LoginPage({ username: this.state.logName.toLowerCase(), stateType: 'LoginTouch' })
        // return
        storage.load({
            key: fastLoginKey,
            id: sfastLoginId
        }).then(data => {
            this.setState({
                isShowKey: true
            })
        }).catch(err => {
            this.setState({
                isShowKey: false
            })
        })
    }

    removetuxxing() {
        let fastLoginKey = 'fastLogin' + this.props.username + 'tuxxing';
        let sfastLoginId = 'fastLogin' + this.props.username + 'tuxxing';
        global.storage.remove({
            key: fastLoginKey,
            id: sfastLoginId
        })

        this.setState({
            isShowKey: false
        })
    }


    checkout(key) {
        if (key == this.state.checkActive) { return }
        if (key) {
            let passwordKey = 'passwordKey' + this.props.username.toLowerCase()
            let passwordID = 'passwordID' + this.props.username.toLowerCase()
            global.storage.save({
                key: passwordKey, // 注意:请不要在key中使用_下划线符号!
                id: passwordID, // 注意:请不要在id中使用_下划线符号!
                data: userPassword,
                expires: null
            })

            Actions[key]({ username: this.props.username.toLowerCase(), fastChange: true })
        } else {
            //快捷登录方式
            let fastLoginKey = 'fastLogin' + this.props.username;
            let sfastLoginId = 'fastLogin' + this.props.username;
            global.storage.remove({
                key: fastLoginKey,
                id: sfastLoginId,
            });
            this.setState({ checkActive: '' })
        }
    }
    //切换登录方式密码验证
    login(username, password, key) {
        let date = {
            "hostName": common_url,
            "e2": E2Backbox,
            "grantType": "password",
            "clientId": "Fun88.TH.App",
            "clientSecret": "FUNmuittenTH",
            //"SecretKey": "FUNmuittenTH",
            "username": username,
            "password": password,
            "scope": "Mobile.Service offline_access",
            "appId": window.appId,
            "siteId": Platform.OS === 'android' ? 16 : 17,
            "refreshToken": ''
        };
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.login, "POST", date)
            .then(data => {
                Toast.hide();
                this.setState({ loginOut: true })
                if (data.accessToken) {
                    ApiPort.Token = data.accessToken.token_type + " " + data.accessToken.access_token; // 寫入用戶token  token要帶Bearer
                    ApiPort.ReToken = data.accessToken.refresh_token; // 寫入用戶token  token要帶Bearer
                    isGameLock = data.memberDetails.isGameLock; //用戶能不能玩遊戲
                    memberCode = data.memberDetails.memberCode; //寫入用戶 memberCode
                    window.PiwikMenberCode1 && window.PiwikMenberCode1(memberCode)
                    noFastLogin = false//用户可以使用快捷登录
                    //脸部验证
                    key == 'LoginFace' && window.faceCheck && window.faceCheck()
                    //指纹识别
                    key == 'LoginTouch' && window.touchCheck && window.touchCheck()
                    //九宫格
                    key == 'LoginPattern' && window.patternCheck && window.patternCheck()
                }
            })
            .catch(() => {
                Toast.fail("Mật khẩu không chính xác, vui lòng nhập lại", 2);
                //密码错误,请重新输入
            })
    }

    render() {
        window.fastChangeLogin = (username, password, key) => {
            this.login(username, password, key)
            this.getKey()
        }
        window.checkActiveType = (checkActive) => {
            this.setState({ checkActive })
            this.getKey()
        }
        const { checkActive } = this.state;
        const checkType = DeviceInfoIos && 'LoginTouch' || 'LoginFace';
        const managerListsText = { color: window.isBlue ? 'rgba(0, 0, 0, .5)' : '#FFFFFF' }
        const managerListsBackgroundColor = window.isBlue ? '#FFFFFF' : '#212121'
        const arrowRightImg = window.isBlue ? require('./../../images/common/arrowIcon/right0.png') : require('./../../images/common/arrowIcon/right1.png')
        const managerListsStyle = [styles.managerLists, { backgroundColor: managerListsBackgroundColor }]
        return (
            <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F5F8' : '#0F0F0F' }]}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {/* <View style={styles.pageInforTextWrap}>
                        <Text style={[styles.pageInforText, { color: window.isBlue ? '#3C3C3C' : '#FFFFFF' }]}>Đăng Nhập Nhanh</Text>
                    </View> */}
                    {
                        // Platform.OS == "ios" &&
                        // <Touch onPress={() => {this.checkout(checkType)}}>
                        //     <View style={styles.selectList}>
                        //         <View style={{flexDirection:'row'}}>
                        //             <Image
                        //                 resizeMode="stretch"
                        //                 source={require("../../images/login/faceRecogition.png")}
                        //                 style={{ width: 20, height: 20 }}
                        //             />
                        //             <Text style={{color: '#474747',paddingLeft:15,lineHeight:20}}>使用Đăng nhập bằng tính năng nhận diện khuôn mặt</Text>
                        //         </View>
                        //         {!DeviceInfoIos && <View style={checkActive=='LoginFace'?styles.checkBoxAcitve: styles.checkBox}></View>}
                        //         {DeviceInfoIos && <View style={checkActive=='LoginTouch'?styles.checkBoxAcitve: styles.checkBox}></View>}
                        //     </View>
                        // </Touch>
                    }
                    {
                        //!DeviceInfoIos &&
                        <Touch onPress={() => {
                            if (checkActive == '') {
                                this.checkout('LoginTouch')
                                return
                            }
                            if(checkActive == 'LoginPattern') {
                                this.checkout('')
                                this.removetuxxing()
                                this.checkout('LoginTouch')
                                return
                            }
                          
                        }} style={managerListsStyle}>
                            <View style={styles.managerListsTouch} >
                                <View style={styles.loginBox}>
                                    <Image resizeMode='stretch' source={(Platform.OS == "ios" && DeviceInfoIos) ?
                                        require('./../../images/login/faceID1.png')
                                        :
                                        require('./../../images/login/zhiwen.png')
                                    }
                                        style={[styles.loginType]}></Image>
                                    <Text style={managerListsText}>{(Platform.OS == "ios" && DeviceInfoIos) ? 'เข้าสู่ระบบผ่าน Face ID' : 'เข้าสู่ระบบด้วยลายนิ้วมือ'}</Text>
                                </View>
                                {/* <View style={checkActive == 'LoginTouch' ? styles.checkBoxAcitve : styles.checkBox}></View> */}
                                {
                                    !(checkActive == 'LoginFace' || checkActive == 'LoginTouch')
                                        ?
                                        <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
                                        :
                                        <View style={(checkActive == 'LoginFace' || checkActive == 'LoginTouch') ? styles.checkBoxAcitve : styles.checkBox}>
                                            {
                                                (checkActive == 'LoginFace' || checkActive == 'LoginTouch') && <View style={{ width: 12, height: 12, borderRadius: 1000, backgroundColor: '#25AAE1' }} />
                                            }
                                        </View>
                                }

                            </View>
                        </Touch>
                    }

                    {
                        Platform.OS == "android" &&
                        <Touch onPress={() => {
                            if (checkActive == '') {
                                this.checkout('LoginPattern')
                                return
                            }

                            if (checkActive == 'LoginTouch') {
                                this.checkout('')
                                this.removetuxxing()
                                this.checkout('LoginPattern')
                                return
                            }
                        }} style={managerListsStyle}>
                            <View style={styles.managerListsTouch} >
                                <View style={styles.loginBox}>
                                    <Image resizeMode='stretch' source={require('./../../images/login/loginType1.png')}
                                        style={[styles.loginType]}></Image>
                                    <Text style={managerListsText}>เข้าสู่ระบบด้วยรหัสแพทเทิร์น</Text>
                                </View>
                                {/* <View style={checkActive == 'LoginPattern' ? styles.checkBoxAcitve : styles.checkBox}></View> */}

                                {
                                    checkActive !== 'LoginPattern'
                                        ?
                                        <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
                                        :
                                        <View style={checkActive == 'LoginPattern' ? styles.checkBoxAcitve : styles.checkBox}>
                                            {
                                                checkActive == 'LoginPattern' && <View style={{ width: 12, height: 12, borderRadius: 1000, backgroundColor: '#25AAE1' }} />
                                            }
                                        </View>
                                }
                            </View>
                        </Touch>
                    }

                    {
                        Platform.OS == "android" &&
                        this.state.isShowKey &&
                        <Touch onPress={() => {
                            Actions['LoginPattern']({ username: this.props.username.toLowerCase(), fastChange: true })
                        }} style={managerListsStyle}>
                            <View style={styles.managerListsTouch} >
                                <View style={styles.loginBox}>
                                    <Image resizeMode='stretch' source={require('./../../images/login/loginTypeKey.png')}
                                        style={[styles.loginType]}></Image>
                                    <Text style={managerListsText}>เข้าสู่ระบบด้วยรหัสแพทเทิร์น</Text>
                                </View>
                                <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
                            </View>
                        </Touch>
                    }


                    {
                        <Touch onPress={() => {
                            this.checkout('')
                            this.removetuxxing()
                        }} style={managerListsStyle}>
                            <View style={styles.managerListsTouch} >
                                <View style={styles.loginBox}>
                                    <Image resizeMode='stretch' source={require('./../../images/login/loginType2.png')}
                                        style={[styles.loginType]}></Image>
                                    <Text style={managerListsText}>ปิดคุณสมบัติการลงชื่อเข้าใช้ด่วนทั้งหมด</Text>
                                </View>
                                <Text style={managerListsText}></Text>
                                <View style={checkActive == '' ? styles.checkBoxAcitve : styles.checkBox}>
                                    {
                                        checkActive == '' && <View style={{ width: 12, height: 12, borderRadius: 1000, backgroundColor: '#25AAE1' }} />
                                    }
                                </View>
                            </View>
                        </Touch>
                    }
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loginType: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    viewContainer: {
        flex: 1,
        paddingTop: 15
    },
    loginBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    managerListsTouch: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    managerLists: {
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F4F5F8'
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
    arrowRight: {
        width: 10,
        height: 18,
    },
    checkBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#DCDCDC',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkBoxAcitve: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#00AEEF',
        alignItems: 'center',
        justifyContent: 'center'
    }
})