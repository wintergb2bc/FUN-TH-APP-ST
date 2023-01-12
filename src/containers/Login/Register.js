import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Dimensions,
    Platform,
    Clipboard,
    NativeModules,
    ImageBackground,
    ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { login } from '../../actions/AuthAction'
import Touch from 'react-native-touch-once'
import DeviceInfo from 'react-native-device-info'  //獲取設備信息
import { ACTION_UserInfo_getBalanceSB, ACTION_UserInfo_login } from '../SbSports/lib/redux/actions/UserInfoAction';
import { namereg, nameErr, passwordReg, phoneReg, EmailReg, GetOnlyNumReg, passwordErrTip1 } from '../../actions/Reg'
import { getLoginMemberInforAction, getMemberInforAction, getBalanceInforAction, getSelfExclusionsAction, changeHomeLiveChatIncognitoAction } from './../../actions/ReducerAction'
import { IphoneXMax } from './../Common/CommonData'
import CryptoJS from "crypto-js"
import base64 from 'crypto-js/enc-base64'
import { v4 as uuidv4 } from 'uuid'
import { parses } from '../../actions/parses';
import moment from 'moment'
const { UMPushModule } = NativeModules

const { width, height } = Dimensions.get('window')

var _byteToHex = [];
var _hexToByte = {};
for (var i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
}

function parse(s, buf, offset) {
    var i = (buf && offset) || 0;
    var ii = 0;

    buf = buf || [];
    s.toLowerCase().replace(/[0-9a-f]{2}/g, function (oct) {
        if (ii < 16) { // Don't overflow!
            buf[i + ii++] = _hexToByte[oct];
        }
    });
    while (ii < 16) {
        buf[i + ii++] = 0;
    }

    return buf;
}
class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabPage: 0,
            username: '',
            password: '',
            version: FUN88Version,
            affCode: '',//代理號
            passwords: '',
            Devicetoken: '', //用戶唯一識別
            userMAC: '', //mac
            seeRegPwd: false,//显示注册密码
            seeRegRePwd: false,//显示注册确认密码
            SeePassword: false,//显示登录密码
            TextColor: 'white',
            None: false,
            keyboardType: 'default',

            logName: '',//登录用户名
            logPwd: '',//登录密码
            regName: '',//注册用户名
            regPwd: '',//注册密码
            regRePwd: '',//注册确认密码
            regNumber: '', //注册手机号
            regEmail: '',//注册邮箱,

            logNameVerify: false,//登录用户名校验
            logPwdVerify: false,//登录密码校验
            regNameVerify: false,// 注册用户名校验
            regPwdVerify: false,//注册密码校验
            regRePwdVerify: false,//注册确认密码校验
            regEmailVerify: false,// 注册邮箱校验
            regNumberVerify: false,// 注册手机号校验

            logNameStat: '',//登录用户名状态
            logPwdStat: '',//登录密码状态
            regNameStat: '', //注册用户名状态
            regPwdStat: '',//注册密码状态
            regRePwdStat: '',//注册确认密码状态
            regEmailStat: '',// 注册邮箱状态
            regNumberStat: '',// 注册手机号状态
            affCodeStat: '',

            logNameErr: '',//登录用户名错误信息
            logPwdErr: '',//登录密码错误信息
            regNameErr: true, //注册用户名错误信息
            regPwdErr: true,//注册密码错误信息
            regRePwdErr: true,//注册确认密码错误信息
            regEmailErr: true,// 注册邮箱错误信息
            regNumberErr: true,// 注册手机号错误信息
            phonePrefixes: [],
            phoneMinLength: 9,
            phoneMaxLength: 9,
            isShowLoginLoading: false,
            getUniqueId: '',

            isRemberPwd: false,
            isShowInforView: true
        }
        this.handleTextInput = this.handleTextInput.bind(this)   //帳號
        this.newlogin = this.newlogin.bind(this)  //登錄
    }


    componentDidMount() {
        this.getMACAddress()
        setTimeout(() => {
            this.getAffCode()
            this.getDeviceToken();  //獲取友盟 DeviceToken //個推用
        }, 3000)

        this.props.getSelfExclusionsAction(true)
        this.getDeviceInfoIos()
        this.getStorageNamePassword()
        this.getUniqueId()
        // this.getPhonePrefixes()

        // this.setState({ logName: 'funvntest100' });
        // this.setState({ logPwd: 'today1234', canLogin: true });
    }


    componentWillUnmount() {
        this.getUnreadNewsCountTimeOut && clearTimeout(this.getUnreadNewsCountTimeOut)
    }

    getStorageNamePassword() {
        //記住密碼尋找
        global.storage.load({
            key: 'username',
            id: 'nameFun88'
        }).then(ret => {
            this.setState({
                logName: ret,
                logNameVerify: true,
                logPwdVerify: true,
            })
        }).catch(err => { })

        global.storage.load({
            key: 'password',
            id: 'passwordFun88'
        }).then(ret => {
            this.setState({
                logPwd: ret,
                passwords: '●●●●●●●'
            })
        }).catch(() => { })
    }

    // 获取代理码
    getAffCode() {
		//Login.js/Main.js，两次获取，防止sdk api慢没拿到
		let GetNative = NativeModules.Openinstall || false
		//获取原生绑定，没有再去拿url带的
        if (GetNative && GetNative.getAffCode) {
            GetNative.getAffCode(CODE => {
                if (CODE && CODE != 'err') {
                    affCodeKex = CODE;
                    this.setState({
                        affCode: CODE,
                    })
                } else {
                    this.getAff()
                }
            });
        } else {
            this.getAff()
        }
    };

    getAff() {
        //缓存检查affcode，没有去检查copy，不会被copy覆盖
        global.storage
            .load({
                key: "affCodeSG",
                id: "affCodeSG"
            })
            .then(ret => {
                affCodeKex = ret
                this.setState({
                    affCode: ret,
                })
            })
            .catch(err => {
                Clipboard.getString().then((content) => {
                    if (content.indexOf('affcode&') == 0) {
                        let Acode = content.split('affcode&')[1]
                        if (Acode) {
                            affCodeKex = Acode
                            this.setState({
                                affCode: Acode,
                            })
                            global.storage.save({
                                key: "affCodeSG", // 注意:请不要在key中使用_下划线符号!
                                id: "affCodeSG", // 注意:请不要在id中使用_下划线符号!
                                data: Acode,
                                expires: null
                            });
                        }
                    }
                }, (error) => { })
            })
    }


    getUniqueId() {
        global.storage
            .load({
                key: "getUniqueId",
                id: "getUniqueId"
            })
            .then(getUniqueId => {
                this.setState({ getUniqueId })
            })
            .catch(err => { })
    }

    getDeviceSignatureBlackBox() {
        let uniqueId = this.state.getUniqueId
        let getUniqueID = DeviceInfo.getUniqueID || DeviceInfo.getUniqueId
        if (uniqueId == '') {
            uniqueId = getUniqueID()
        }
        if (uniqueId && uniqueId.length <= 15) {
            uniqueId = '0' + getUniqueID()
        }
        let GUID = uuidv4()
        let keyHex = CryptoJS.enc.Utf8.parse('@NcRfTjWnZr4u7x!A%D*G-KaPdSgVkYp');
        if (window.common_url.indexOf('staging') > -1) {
            //测试key
            keyHex = CryptoJS.enc.Utf8.parse('WmZq4t7w!z%C*F-JaNdRgUkXp2r5u8x/');
        }
        let ivHex = CryptoJS.lib.WordArray.create(new Uint8Array(parses(GUID)));
        let texts = moment().utc().toISOString().split('.')[0] + 'Z' + uniqueId
        let messageHex = CryptoJS.enc.Utf8.parse(texts);
        let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
            "iv": ivHex,
            "mode": CryptoJS.mode.CBC,
            "padding": CryptoJS.pad.Pkcs7
        });
        var boxValue = GUID + encrypted.ciphertext.toString(base64);
        uniqueId && global.storage.save({
            key: "getUniqueId",
            id: "getUniqueId",
            data: uniqueId,
            expires: null
        });
        return boxValue
    }


    getMACAddress() {
        let address = DeviceInfo.getMACAddress || DeviceInfo.getMacAddress
        address().then(mac => {  //拿mac地址
            this.setState({
                userMAC: mac
            }, () => {
                //this.getDeviceToken()
            })
        })
    }

    getDeviceToken() {  //獲取友盟 DeviceToken //個推用
        UMPushModule && UMPushModule.getDeviceToken && UMPushModule.getDeviceToken((token) => {

            if (token && token != 'deviceTokens') {
                window.Devicetoken = token;
                this.NotificationOne()
            } else {
                this.NotificationOne();
            }

        })
    }

    NotificationOne() {    //第一次用app 友盟個推註冊
        // if (window.isSTcommon_url) return
        let date = {
            'os': Platform.OS == 'ios' ? 'iOS' : 'Android',
            'osVersionCode': DeviceInfo.getVersion(),
            'osVersionNumber': DeviceInfo.getSystemVersion(),
            'deviceModel': DeviceInfo.getModel(),
            'serialNumber': this.state.userMAC,
            'deviceManufacturer': Platform.OS == "ios" ? 'Apple' : 'Android',
            'pushNotificationPlatform': 'umeng+',
            'deviceToken': window.Devicetoken,
            'imei': '',
            'macAddress': this.state.userMAC,
            'memberCode': '',
            'packageName': Platform.OS === "ios" ? appIOSId : appAndroidId,
        }

        fetchRequest(ApiPort.NotificationOne, 'POST', date).then(data => { }).catch(() => { })
    }

    NotificationLogin(user) {   //登錄註冊友盟推送
        // if (window.isSTcommon_url) return
        let date = {
            'topics': '',
            'pushNotificationPlatform': 'umeng+',
            'deviceToken': window.Devicetoken,
            'packageName': Platform.OS === "ios" ? appIOSId : appAndroidId,
            'imei': '',
            'macAddress': this.state.userMAC,
            'membercode': user,
            'serialNumber': this.state.userMAC,
            'os': Platform.OS == 'ios' ? 'iOS' : 'Android',
        }

        fetchRequest(ApiPort.NotificationOne, 'PATCH', date).then(() => { }).catch(() => { })
    }

    getPhonePrefixes() {
        fetchRequest(ApiPort.GetSetting + 'Phone/Prefix?', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    phonePrefixes: res.prefixes,
                    // phoneMinLength: res.minLength,
                    // phoneMaxLength: res.maxLength
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getDeviceInfoIos() {
        global.storage.load({
            key: 'username',
            id: 'namerb88'
        }).then(ret => {
            this.setState({
                logName: ret
            }, () => {
                //拿到用户名去查看快捷登录方式
                if (!noFastLogin) {
                    this.fastLogins('fastLogin')
                }
            })
        }).catch(err => {
        })
        if (Platform.OS === 'android') {
            window.DeviceInfoIos = false
        } else {
            //ios手机型号是有指纹的
            const getModel = DeviceInfo.getModel()
            this.setState({
                isNotIphoneX: IphoneXMax.includes(getModel)
            })
            if (IphoneXMax.indexOf(getModel) > -1) {
                window.DeviceInfoIos = false
            }
        }
    }


    handleTextInput(key, value) {
        this.setState({
            [key]: value.trim()
        })
    }

    //   登录/注册 按钮
    handleSubmit(piwikMenberText) {
        if (this.state.tabPage * 1 === 0) {
            this.newlogin()
        } else {
            this.postRegist()
        }

        piwikMenberText && window.PiwikMenberCode(piwikMenberText)
    }


    /**
     * 登录
     * @param {string} key key为'commonlogin'表示一般登录,否则为快速登录中的其中一种登录方式
     */
    newlogin(key = 'commonlogin', flag) {
        const {
            tabPage,
            logName,
            logPwd,
            regName,
            regPwd,
            isShowLoginLoading,
            isRemberPwd
        } = this.state
        // if(isShowLoginLoading) return
        const username = regName
        const password = regPwd
        let DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox()
        let date = {
            'hostName': common_url,
            'e2': E2Backbox,
            'grantType': 'password',
            'clientId': 'Fun88.TH.App',
            'clientSecret': 'FUNmuittenTH',
            //"SecretKey": "FUNmuittenTH",
            'username': username.trim(),
            'password': password.trim(),
            'scope': 'Mobile.Service offline_access',
            'appId': window.appId,
            'siteId': Platform.OS === 'android' ? 16 : 17,
            'refreshToken': '',
            'deviceSignatureBlackBox': DeviceSignatureBlackBox
        }

        if (isRemberPwd) {
            global.storage.remove({
                key: 'MEMBERINFORACTIONSTORAGE',
                id: 'MEMBERINFORACTIONSTORAGE'
            })

            global.storage.remove({
                key: 'BALANCEINFORACTIONSTORAGE',
                id: 'BALANCEINFORACTIONSTORAGE'
            })
        }

        ApiPort.Token = '' // 寫入用戶token  token要帶Bearer
        ApiPort.access_token = ''

        key == 'commonlogin' && Toast.loading('กำลังเข้าสู่ระบบ กรุณารอสักครู่', 200000000)
        this.setState({
            isShowLoginLoading: true
        })

        userPassword = password //
        fetchRequest(ApiPort.login, 'POST', date).then(data => {
            this.setState({
                isShowLoginLoading: false
            })
            Toast.hide()
            window.gameLoadInfor = {}
            //if (data.isSuccess) {
            this.props.getLoginMemberInforAction({ ...data.memberDetails, isLoginMemberDetails: true, FirstName: data.memberDetails.firstName })
            if (data.accessToken) {
                this.NotificationLogin(username.trim())  //註冊友盟個推
                userNameDB = data.memberDetails.userName

                ApiPort.Token = data.accessToken.token_type + ' ' + data.accessToken.access_token // 寫入用戶token  token要帶Bearer
                ApiPort.ReToken = data.accessToken.refresh_token // 寫入用戶token  token要帶Bearer
                ApiPort.LogoutTokey = data.accessToken.refresh_token
                ApiPort.access_token = data.accessToken.access_token

                isGameLock = data.memberDetails.isGameLock  //用戶能不能玩遊戲
                memberCode = data.memberDetails.memberCode   //寫入用戶 memberCode
                ApiPort.UserLogin = true

                global.localStorage.setItem('loginStatus', '1')
                localStorage.setItem('memberCode', JSON.stringify(data.memberDetails.memberCode));
                localStorage.setItem("memberInfo", JSON.stringify(data.memberDetails));
                this.props.userInfo_login(data.memberDetails.userName); //redux 紀錄登入態


                window.PiwikMenberCode1 && window.PiwikMenberCode1(data.memberDetails.memberCode)
                this.props.getMemberInforAction()
                if (data.memberDetails.revalidate) {
                    Actions.ResetPassword()
                    //ApiPort.UserLogin = false
                    return
                }
                if (data.accessToken.reset_Password) {
                    Actions.ResetPasswordProfile()
                    //ApiPort.UserLogin = false
                    return
                }
                this.props.getBalanceInforAction()

                this.props.login({ username: 'loginok', password: 'loginok' })

                // if (this.props.miniGames) {
                //     Actions.LotteryActive({
                //         miniGames: this.props.miniGames
                //     })
                // }
                if (key == 'commonlogin') {
                    // 一般登录

                } else {
                    //快速登录密码
                    let passwordKey = 'passwordKey' + username.toLowerCase()
                    let passwordID = 'passwordID' + username.toLowerCase()
                    global.storage.save({
                        key: passwordKey, // 注意:请不要在key中使用_下划线符号!
                        id: passwordID, // 注意:请不要在id中使用_下划线符号!
                        data: password,
                        expires: null
                    })
                    if (key == 'LoginFace') {
                        //脸部验证
                        window.faceCheck && window.faceCheck()
                    } else if (key == 'LoginTouch') {
                        //指纹识别
                        window.touchCheck && window.touchCheck()
                    } else if (key == 'LoginPattern') {
                        //九宫格
                        window.patternCheck && window.patternCheck()
                    }
                }
                this.props.changeHomeLiveChatIncognitoAction(false)
                if (flag === 'registLogin') {
                    window.changeHomeModalLoginRegisterStatus && window.changeHomeModalLoginRegisterStatus(true)
                } else {
                    this.props.getSelfExclusionsAction()
                }

                global.storage.save({
                    key: 'username', // 注意:请不要在key中使用_下划线符号!
                    id: 'nameFun88', // 注意:请不要在id中使用_下划线符号!
                    data: username,
                    expires: null
                })

                global.storage.save({
                    key: 'password', // 注意:请不要在key中使用_下划线符号!
                    id: 'passwordFun88', // 注意:请不要在id中使用_下划线符号!
                    data: password,
                    expires: null
                })
                Toast.hide()
            } else {
                let errors = JSON.parse(data.content)
                if (errors.error_details) {
                    Toast.fail(errors.error_details.Message, 2)
                } else {
                    Toast.fail('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง', 2)
                }
                Toast.hide()
            }
            // } else {
            //     Toast.hide()
            //     let errors = data.errors
            //     if (Array.isArray(errors) && errors.length) {
            //         Toast.fail(data.errors[0].message, 2)
            //         let errcode = data.errors.map(v => v.errorCode.toLocaleUpperCase())
            //         if (errcode.includes('MEM00141')) {
            //             Actions.LockedAccount({
            //                 userNameDB: username.trim(),
            //                 attempts: data.attempts
            //             })
            //             return
            //         }
            //     }
            // }
        }).catch(() => {
            this.setState({
                isShowLoginLoading: false
            })
            Toast.hide()
        })
    }

    // 免费开户
    postRegist() {
        const {
            regName,
            regPwd,
            regNumber,
            regEmail,
            affCode
        } = this.state //註冊訊息


        let arr = [regName, regPwd, regEmail, regNumber]
        let arrFilter = arr.filter(v => v.length)
        if (arrFilter.length != arr.length) {
            Toast.fail(`กรุณากรอกข้อมูลให้ครบถ้วนยังมี ${arr.length - arrFilter.length} ช่องว่างอยู่`, 2)
            return
        }


        let regNameErr = false
        if (regName == '') {
            Toast.fail('ไม่สามารถเว้นช่องยูสเซอร์เนมได้', 2)
            regNameErr = false
        } else if (!namereg.test(regName)) {
            Toast.fail(`อนุญาตให้ใช้ตัวอักษร 'A-Z', 'a-z' หรือตัวเลข '0-9' เท่านั้น`, 2)
            regNameErr = false
        } else if (regName.length < 6 || regName.length > 14) {
            Toast.fail('ยูสเซอร์เนมต้องมีขั้นต่ำ 6 ตัวอักษร แต่ไม่มากกว่า 14 ตัวอักษร', 2)
            regNameErr = false
        } else {
            regNameErr = true
        }



        let regPwdErr = false
        if (regPwd == '') {
            Toast.fail('ไม่สามารถเว้นช่องรหัสผ่านได้', 2)
            regPwdErr = false
        } else if (!passwordReg.test(regPwd)) {
            Toast.fail(`เฉพาะ 'A-Z', 'a-z', '0-9' (สามารถใช้อักขระพิเศษในหมู่ ^#$@ ได้)`, 2)
            regPwdErr = false
        } else {
            regPwdErr = true
        }

        let regEmailErr = false
        if (regEmail == '') {
            Toast.fail('ไม่สามารถเว้นช่องอีเมล์ได้', 2)
            regEmailErr = false
        } else if (!EmailReg.test(regEmail)) {
            Toast.fail('รูปแบบอีเมล์ไม่ถูกต้อง', 2)
            regEmailErr = false
        } else {
            regEmailErr = true
        }


        let regNumberErr = false
        if (regNumber.length != 9) {
            Toast.fail('จำนวนหมายเลขโทรศัพท์ต้องมี 9 หลัก', 2)
            regNumberErr = false
        } else {
            regNumberErr = true
        }



        this.setState({
            regNameErr,
            regPwdErr,
            regEmailErr,
            regNumberErr
        })
        if (!(regEmailErr && regNameErr && regPwdErr && regNumberErr)) {
            return
        }

        //電話號碼格式檢測
        const phoneNumber = regNumber.replace(/\s+/g, '')
        let DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox()
        const date = {
            'hostName': common_url,
            'regWebsite': window.regWebsite,
            'language': 'th-th',
            'mobile': '66-' + phoneNumber,
            'MemberCode': regName,
            'userName': regName,
            'mediaCode': '',
            'referer': '',
            'affiliateCode': affCode ? affCode : affCodeKex, //判断用户是否有填写推荐码
            'email': regEmail,
            'password': regPwd,
            'brandCode': 'Fun88',
            'blackBoxValue': E2Backbox,
            'currency': 'THB',



            'wallet': 'MAIN',
            'e2BlackBoxValue': E2Backbox,
            'gender': '',
            'secretQID': '',
            'nationID': '',
            'msgerType': '',
            //msgerType: '',
            'dob': '',
            'placeOfBirth': '',
            'nationality': '1',
            'zipCode': '',
            'city': '',
            'webSiteId': '10',
            'memberTempID': '',
            'mediaCode': '',
            'lastName': '',
            'msgerID': '',
            'secretAnswer': '',
            'address': '',
            'firstName': '',
            'memberTempPassword': '',
            'pixelValue': '',
            'documentId': '',
            'messengers': [
                {
                    'contact': '66-' + phoneNumber,
                    'contactTypeId': '4'
                }
            ],
            'deviceSignatureBlackBox': DeviceSignatureBlackBox
        }

        Toast.loading('กรุณารอสักครู่ อยู่ระหว่างการสมัคร', 2000)
        fetchRequest(ApiPort.MemberRestricted, 'POST', date).then(data => {
            Toast.hide()
            if (data.isSuccess == false) {
                let errors = data.result
                if (errors.Message) {
                    Toast.fail(errors.Message, 2)
                } else {
                    Toast.fail(data.message, 2)
                }
            } else if (data.isSuccess == true) {
                Toast.success('สมัครสมาชิกสำเร็จ', 2)
                userLogin = this.state.regName //
                userPassword = this.state.regPwd //
                this.newlogin('commonlogin', 'registLogin')
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    eyes(key) {
        //顯示密碼
        this.setState({
            [key]: !this.state[key]
        })
    }

    fastLogins(key, piwikMenberText) {
        if (this.state.logName == '' && fastLogin != 'fastLogin') {
            Toast.fail('กรุณากรอกยูสเซอร์เนม.')
            return
        }
        if (namereg.test(this.state.logName) == false && fastLogin != 'fastLogin') {
            Toast.fail('รูปแบบยูสเซอร์เนมไม่ถูกต้อง')
            return
        }
        let fastLoginKey = 'fastLogin' + this.state.logName.toLowerCase()
        let sfastLoginId = 'fastLogin' + this.state.logName.toLowerCase()
        // LoginTouch  LoginPattern
        // Actions.LoginPage({ username: this.state.logName.toLowerCase(), stateType: 'LoginTouch' })
        // return
        storage.load({
            key: fastLoginKey,
            id: sfastLoginId
        }).then(data => {
            if (key === 'fastLogin') {
                Actions.LoginPage({ username: this.state.logName.toLowerCase(), stateType: data })
            } else if (data == key) {
                //快捷登录)
                Actions.LoginPage({ username: this.state.logName.toLowerCase(), stateType: key })
            } else {
                Toast.fail('Bạn chưa cài đặt đăng nhập nhanh, vui lòng đăng nhập bằng phương thức khác', 2)
            }
        }).catch(err => {
            //首次验证
            Actions[key]({ username: this.state.logName.toLowerCase() })
            // Actions.LoginPage({username: this.state.logName, stateType: key})
        })

        piwikMenberText && window.PiwikMenberCode(piwikMenberText)
    }

    render() {
        const {
            version,
            None,
            SeePassword,

            logNameStat, //登录用户名状态
            logPwdStat,//登录密码状态
            regNameStat, //注册用户名状态
            regPwdStat,//注册密码状态
            regRePwdStat,//注册确认密码状态
            regEmailStat,// 注册邮箱状态
            regNumberStat,// 注册手机号状态

            logNameVerify,
            logPwdVerify,
            regNameVerify,// 注册用户名校验
            regPwdVerify,//注册密码校验
            regRePwdVerify,//注册确认密码校验
            regEmailVerify,// 注册邮箱校验
            regNumberVerify,// 注册手机号校验

            logName,
            logPwd,
            regName,
            regPwd,
            regRePwd,
            regNumber,
            regEmail,
            seeRegPwd,
            seeRegRePwd,
            affCode,
            affCodeStat,
            phoneMinLength,
            phoneMaxLength,
            tabPage,
            isShowLoginLoading,
            isRemberPwd,
            regNameErr,
            regPwdErr,
            regEmailErr,
            regNumberErr,
            isShowInforView
        } = this.state

        const { isFrist } = this.props

        const logVerify = logName.trim().length > 0 && logPwd.trim().length > 0
        const regVerify = regNameVerify && regPwdVerify && regRePwdVerify && regEmailVerify && regNumberVerify

        window.Logonregist = () => {
            this.setState({
                username: userLogin,
                userPassword: userPassword,
            })
            this.login(userLogin, userPassword)
        }

        //快速登录验证
        window.fastLogin = (unsename, password, key) => {
            this.setState({
                logName: unsename,
                logPwd: password,
            }, () => {
                this.newlogin(key)
            })
        }
        window.GoHome = () => {   //驗證手機號 成功或 跳過
            ApiPort.UserLogin = true
            let username = 'loginok'
            let password = 'loginok'
            this.props.login({ username, password })
        }

        window.JumpRegist = () => {  //um 指定註冊頁面跳轉用
            this.setState({
                tabPage: 1
            })
        }

        return <View
            style={styles.viewContainer}>
            <KeyboardAwareScrollView>
                {
                    isShowInforView && <View style={styles.depositNoBox}>
                        <Text style={styles.depositNoBoxText}>จำเป็นต้องกรอกให้ครบถ้วน</Text>

                        <TouchableOpacity style={styles.depositNoCloseBtn} onPress={() => {
                            this.setState({
                                isShowInforView: false
                            })
                        }}>
                            <Text style={styles.depositNoCloseBtnText}>X</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={styles.tabContainer}>
                    {/* 用户名 */}
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#4A4A4A' }}>ยูสเซอร์เนม</Text>

                        </View>
                        <TextInput
                            style={[styles.input, {
                                borderBottomColor: regNameErr ? '#4C4C4C34' : '#06ADEF'
                            }]}
                            underlineColorAndroid='transparent'
                            value={regName}
                            placeholder='กรุณากรอกยูสเซอร์เนม'
                            placeholderTextColor='#DDDDDD'
                            textContentType='username'
                            returnKeyType='done'
                            maxLength={14}
                            onChangeText={value =>
                                this.handleTextInput('regName', value)
                            }
                        />
                        <Text style={[styles.ErrorText, { color: '#9B9B9B' }]}>ยูสเซอร์เนมต้องประกอบด้วยอักขระ 6-14 ตัวอักษร</Text>
                    </View>

                    {/* 密码 */}
                    <View >
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: '#4A4A4A' }}>รหัสผ่าน</Text>

                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={[styles.input, {
                                borderBottomColor: regPwdErr ? '#4C4C4C34' : '#06ADEF'
                            }]}
                                underlineColorAndroid='transparent'
                                value={regPwd}
                                placeholder='กรอกรหัสผ่าน (6-20 ตัวอักษร)'
                                placeholderTextColor='#DDDDDD'
                                textContentType='password'
                                secureTextEntry={!seeRegPwd}
                                onChangeText={value => {
                                    this.handleTextInput('regPwd', value)
                                }}
                                maxLength={20}
                            />
                            <View style={{ position: 'absolute', right: 15 }}>
                                <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => this.eyes('seeRegPwd')}>
                                    <Image resizeMode='stretch' source={seeRegPwd ? require('../../images/login/eyes.png') : require('../../images/login/eyeopen.png')} style={{ width: 25, height: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            <Text style={[styles.ErrorText, { color: '#9B9B9B' }]}>รหัสผ่านจะต้องประกอบด้วยอักษรภาษาอังกฤษและตัวเลขอย่างน้อย 6-20 ตัวอักษรเท่านั้น</Text>
                        }
                    </View>

                    {/* 邮箱 */}
                    <View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: '#4A4A4A' }}>อีเมล</Text>
                        </View>
                        <TextInput
                            style={[styles.input, {
                                borderBottomColor: regEmailErr ? '#4C4C4C34' : '#06ADEF'
                            }]}
                            underlineColorAndroid='transparent'
                            keyboardType='email-address'
                            textContentType='emailAddress'
                            value={regEmail}
                            placeholder='กรุณากรอกอีเมล'
                            placeholderTextColor='#DDDDDD'
                            returnKeyType='done'
                            maxLength={50}
                            onChangeText={value =>
                                this.handleTextInput('regEmail', value)
                            }
                        />
                    </View>

                    {/* 联系电话 */}
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#4A4A4A' }}>เบอร์โทร</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TextInput value={'+66'} editable={false} style={
                                [
                                    // styles.input,
                                    {
                                        borderColor: 'transparent',

                                        borderRadius: 0,
                                        position: 'absolute',
                                        left: 0,
                                        top: 5,
                                        bottom: 0,
                                        height: 42,
                                        zIndex: 1000,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 15,
                                        paddingLeft: 12,
                                        borderBottomColor: 'transparent'
                                    }
                                ]
                            }></TextInput>
                            <TextInput
                                style={[{
                                    borderColor: '#F2F2F2',
                                    paddingLeft: 50

                                }, styles.input, { width: width - 30, borderBottomColor: regNumberErr ? '#4C4C4C34' : '#06ADEF' }]}
                                underlineColorAndroid='transparent'
                                keyboardType='number-pad'
                                textContentType='telephoneNumber'
                                // maxLength={phoneMaxLength}
                                value={regNumber}
                                maxLength={9}
                                returnKeyType='done'
                                onChangeText={value => {
                                    let number = GetOnlyNumReg(value)
                                    this.handleTextInput('regNumber', number)
                                }}
                            >
                            </TextInput>
                        </View>
                        <Text style={[styles.ErrorText, { color: '#9B9B9B' }]}>เราจะส่งรหัสการยืนยันทาง sms</Text>
                    </View>

                    {/* 推荐码 */}
                    <View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Text style={{ color: '#4A4A4A' }}>รหัสอ้างอิง</Text>
                        </View>
                        <TextInput
                            style={[{
                            }, styles.input]}
                            underlineColorAndroid='transparent'
                            value={affCode + ''}
                            placeholderTextColor='#fff'
                            returnKeyType='done'
                            onChangeText={affCode =>
                                this.setState({
                                    affCode
                                })
                            }
                            maxLength={8}
                            editable={!affCodeKex}
                        />
                        <Text style={[styles.ErrorText, { color: '#9B9B9B' }]}>ไม่จำเป็น</Text>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={[styles.loginRegisterBtn, {
                                backgroundColor: '#06ADEF'
                            }]}
                            onPress={() => {
                                this.postRegist('Register')
                            }}>
                            <Text style={styles.loginRegisterBtnText}>ลงทะเบียน</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button2}
                            onPress={() => {
                                Actions.pop()
                                Actions.login({
                                })
                            }}
                        >
                            <Text style={styles.button2Text}>ฉันมีบัญชีแล้ว เข้าสู่ระบบเลย</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    }
}

const mapStateToProps = (state) => ({
    authToken: state.auth.authToken,
    email: state.auth.email
})

const mapDispatchToProps = (dispatch) => ({
    login: (loginDetails) => {
        login(dispatch, loginDetails)
    },
    getLoginMemberInforAction: (data) => {
        dispatch(getLoginMemberInforAction(data))
    },
    changeHomeLiveChatIncognitoAction: (flag) => dispatch(changeHomeLiveChatIncognitoAction(flag)),
    userInfo_login: username => ACTION_UserInfo_login(username),
    getMemberInforAction: () => dispatch(getMemberInforAction()),
    getBalanceInforAction: () => dispatch(getBalanceInforAction()),
    getSelfExclusionsAction: (flag) => dispatch(getSelfExclusionsAction(flag)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Register)
const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#F4F4F5',
    },
    tabContainer: {
        paddingHorizontal: 15,
        marginTop: 15
    },
    fastLoginBox: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fastLoginImg: {
        width: 25,
        height: 25,
        marginRight: 8
    },
    fastLoginText: {
        color: '#fff',
        fontSize: 13
    },
    Tologin: {
        width: '100%',
        backgroundColor: '#242424',
        borderColor: '#242424',
        padding: 15,
        // borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 17
    },
    ErrorText: {
        fontSize: 12
    },
    phoneBox: {
        backgroundColor: '#fff',
        width: 50,
        borderWidth: 0,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
        paddingLeft: 0,
        paddingRight: 0,
        position: 'absolute',
        left: 0,
        top: 1,
        zIndex: 10000
    },
    loginRegisterBtn: {
        width: width - 30,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        flexDirection: 'row',
        borderRadius: 6
    },
    loginRegisterBtnText: {
        color: '#fff',
        fontSize: 16
    },
    logoBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
        marginTop: Platform.OS === 'android' ? 50 : (DeviceInfoIos ? 80 : 50),
        marginBottom: 20,
    },
    logoImg: {
        width: 0.5 * width,
        height: 0.115 * width
    },
    forgetBtnWrap: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center'
    },
    forgetBtn: {
        height: 24,
        justifyContent: 'center',
    },
    fogetText1: {
        color: '#fff',
        fontSize: 13,
    },
    fogetText: {
        color: '#fff',
        fontSize: 13,
        textDecorationLine: 'underline'
    },
    input: {
        width: width - 30,
        marginBottom: 6,
        marginTop: 4,
        fontSize: 15,
        borderWidth: 1,
        borderBottomWidth: 2,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        height: 42,
        color: '#000',
        borderColor: '#F2F2F2',
        borderBottomColor: '#4C4C4C34',
        borderRadius: 4
    },
    button2: {
        paddingVertical: 15
    },
    button2Text: {
        fontWeight: 'bold',
        color: '#059DD6',
        textAlign: 'center',
        fontSize: 13,

    },
    NumberAPPBox: {
        marginTop: 40,
        alignItems: 'flex-end',
        marginBottom: 20
    },
    NumberAPP: {
        fontSize: 12,
        color: '#fff',
        textAlign: 'center',
    },
    tabBarBox: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 2,
        marginBottom: 15,
        height: 40,
        overflow: 'hidden',
        width: width - 20,
        marginHorizontal: 10
    },
    tabBarTextBox: {
        height: 40,
        width: (width - 20) / 2
    },
    togTextActive: {
        color: '#00AEEF',
        fontWeight: 'bold'
    },
    togTextNotActive: {
        color: '#fff',
        fontWeight: 'bold'
    },
    loginTopImgBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginBottom: 20
    },
    loginTopImg: {
        width: (width - 10) * .45,
        height: (width - 10) * .45 * .424
    },
    homeCsWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        right: 15,
        top: 0,
        position: 'absolute'
    },
    homeCSImg: {
        width: 28,
        height: 28
    },
    remberPwdBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5
    },
    remberPwdBoxCirlce: {
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#fff',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    remberPwdBoxTExt: {
        color: '#FFFFFF'
    },
    remberPwdBoxCirlce1: {
        color: '#25AEE1',
        fontWeight: 'bold'
    },
    depositNoBox: {
        backgroundColor: '#6B6B6D',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    depositNoBoxText: {
        color: '#fff',
    },
    depositNoBtn: {
        backgroundColor: '#5AC27E',
        borderRadius: 4,
        height: 34,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    depositNoBtnText: {
        color: '#fff'
    },
    depositNoCloseBtn: {
        // position: 'absolute',
        // right: 10,
        // top: 10
    },
    depositNoCloseBtnText: {
        color: '#fff',
        fontSize: 20
    }
})
