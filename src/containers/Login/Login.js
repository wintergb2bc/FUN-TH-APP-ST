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
import { namereg, passwordReg, phoneReg, EmailReg, GetOnlyNumReg, passwordErrTip1 } from '../../actions/Reg'
import { changeHomeLiveChatIncognitoAction, getLoginMemberInforAction, getMemberInforAction, getBalanceInforAction, getSelfExclusionsAction } from './../../actions/ReducerAction'
import RedStar from './../Common/RedStar'
import { IphoneXMax } from './../Common/CommonData'
import CryptoJS from "crypto-js"
import base64 from 'crypto-js/enc-base64'
import { v4 as uuidv4 } from 'uuid'
import { parses } from '../../actions/parses';
import moment from 'moment'
import PiwikProSdk from "@piwikpro/react-native-piwik-pro-sdk";
const { UMPushModule } = NativeModules
const REGS = {
    'logName': namereg,
    'logPwd': passwordReg,
    'regName': namereg,
    'regPwd': passwordReg,
    'regRePwd': passwordReg,
    'regNumber': phoneReg,
    'regEmail': EmailReg
}
const { width, height } = Dimensions.get('window')

const loginRegistData = [
    {
        title: 'ĐĂNG NHẬP',
        label: 'ĐĂNG NHẬP',
        value: 0,
        activeColor: '#fff',
        type: 'login',
        piwikMenberText: 'Login_page'
    },
    {
        title: 'ร่วมสนุกตอนนี้',
        label: 'ร่วมสนุกตอนนี้',
        value: 1,
        activeColor: '#fff',
        type: 'register',
        piwikMenberText: 'Register_page'
    },
]

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
class Login extends React.Component {
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
            regNameErr: '', //注册用户名错误信息
            regPwdErr: '',//注册密码错误信息
            regRePwdErr: '',//注册确认密码错误信息
            regEmailErr: '',// 注册邮箱错误信息
            regNumberErr: '',// 注册手机号错误信息
            phonePrefixes: [],
            phoneMinLength: 9,
            phoneMaxLength: 9,
            isShowLoginLoading: false,
            getUniqueId: '',

            isRemberPwd: false
        }
        this.handleTextInput = this.handleTextInput.bind(this)   //帳號
        this.checkTextInput = this.checkTextInput.bind(this)  //密碼
        this.newlogin = this.newlogin.bind(this)  //登錄
        this.foget = this.foget.bind(this)  //忘記用戶名
    }


    componentDidMount() {
        this.getMACAddress()
        setTimeout(() => {
            this.getAffCode()
            this.getDeviceToken();  //獲取友盟 DeviceToken //個推用
        }, 3000)
        if (this.props.types) {
            let tabPage = loginRegistData.findIndex(v => v.type === this.props.types)
            this.setState({
                tabPage: tabPage * 1
            })
        }
        this.props.getSelfExclusionsAction(true)
        this.getDeviceInfoIos()
        this.getUniqueId()
        // this.getPhonePrefixes()

        // this.setState({ logName: 'funvntest100' });
        // this.setState({ logPwd: 'today1234', canLogin: true });
    }


    componentWillUnmount() {
        this.getUnreadNewsCountTimeOut && clearTimeout(this.getUnreadNewsCountTimeOut)
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
            id: 'nameFun88'
        }).then(ret => {

            this.setState({
                logName: ret,
                logNameVerify: true,
                logPwdVerify: true,
            }, () => {
                //拿到用户名去查看快捷登录方式
                if (!noFastLogin) {
                    this.fastLogins('fastLogin')
                }
            })
        }).catch(err => {
        })

        global.storage.load({
            key: 'password',
            id: 'passwordFun88'
        }).then(ret => {
            this.setState({
                logPwd: ret,
                passwords: '●●●●●●●',
                isRemberPwd: true
            })
        }).catch(() => {
            this.setState({
                isRemberPwd: false
            })
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



    /**
     * 对输入框进行校验
     * @param {string} key
     * @param {string} value
     */
    checkTextInput(key, value) {
        const { phonePrefixes, phoneMinLength, phoneMaxLength } = this.state
        const REG = REGS[key]
        // if (key === 'regNumber') {
        //     let strValue = value + ''
        //     let flag1 = strValue.length >= phoneMinLength && strValue.length <= phoneMaxLength

        //     let phonePrefixes1 = phonePrefixes.filter(v => v.length === 1)
        //     let phonePrefixes2 = phonePrefixes.filter(v => v.length === 2)
        //     let phonePrefixes3 = phonePrefixes.filter(v => v.length === 3)

        //     let regNumber1 = strValue.slice(0, 1)
        //     let regNumber2 = strValue.slice(0, 2)
        //     let regNumber3 = strValue.slice(0, 3)


        //     let flag2 = phonePrefixes1.includes(regNumber1) || phonePrefixes2.includes(regNumber2) || phonePrefixes3.includes(regNumber3)
        //     let flag = flag1 && flag2
        //     if (!flag) {
        //         this.setState({
        //             [`${key}Verify`]: false,
        //             [`${key}Stat`]: 'error',
        //         })
        //         return false
        //     } else {
        //         this.setState({
        //             [`${key}Verify`]: true,
        //             [`${key}Stat`]: 'Focus',
        //             [`${key}Err`]: ''
        //         })
        //         return true
        //     }

        // } else {
        if (REG.test(value) == false) {
            this.setState({
                [`${key}Verify`]: false,
                [`${key}Stat`]: 'error',
            })
            return false
        } else {
            this.setState({
                [`${key}Verify`]: true,
                [`${key}Stat`]: 'Focus',
                [`${key}Err`]: ''
            })
            return true
        }
        // }
    }



    handleTextInput(key, value) {
        const checckResult = this.checkTextInput(key, value)

        this.setState({
            [key]: value
        })
    }

    //   登录/注册 按钮
    handleSubmit(piwikMenberText) {
        if (this.state.tabPage * 1 === 0) {
            this.newlogin('commonlogin')
        } else {
            this.postRegist()
        }

        piwikMenberText && window.PiwikMenberCode(piwikMenberText)
    }


    /**
     * 登录
     * @param {string} key key为'commonlogin'表示一般登录,否则为快速登录中的其中一种登录方式
     */
    newlogin(key, flag) {
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
        const username = tabPage * 1 === 0 ? logName : regName
        const password = tabPage * 1 === 0 ? logPwd : regPwd

        if (username == '') {
            Toast.fail('ข้อมูลยูสเซอร์เนม และรหัสผ่านไม่ถูกต้อง​​', 2)
            return
        } else if (!namereg.test(username)) {
            Toast.fail(`อนุญาตให้ใช้ตัวอักษร 'A-Z', 'a-z' หรือตัวเลข '0-9' เท่านั้น`, 2)
            return
        }

        if (password == '') {
            Toast.fail('ข้อมูลยูสเซอร์เนม และรหัสผ่านไม่ถูกต้อง​​', 2)
            return
        }


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

        // if (isRemberPwd) {
        global.storage.remove({
            key: 'MEMBERINFORACTIONSTORAGE',
            id: 'MEMBERINFORACTIONSTORAGE'
        })

        global.storage.remove({
            key: 'BALANCEINFORACTIONSTORAGE',
            id: 'BALANCEINFORACTIONSTORAGE'
        })
        //}

        ApiPort.Token = '' // 寫入用戶token  token要帶Bearer
        ApiPort.access_token = ''

        //key == 'commonlogin' && 
        Toast.loading('กำลังเข้าสู่ระบบ กรุณารอสักครู่', 200000000)
        this.setState({
            isShowLoginLoading: true
        })

        userPassword = password //
        fetchRequest(ApiPort.login, 'POST', date).then(data => {
            Toast.hide()
            this.setState({
                isShowLoginLoading: false
            })
            window.gameLoadInfor = {}
            // if (data.isSuccess) {
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

                noFastLogin = false//用户可以使用快捷登录
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


                // if (this.props.miniGames) {
                //     Actions.LotteryActive({
                //         miniGames: this.props.miniGames
                //     })
                // }
                if (key == 'commonlogin') {
                    // 一般登录
                    this.props.login({ username: 'loginok', password: 'loginok' })
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

                if (isRemberPwd) {
                    global.storage.save({
                        key: 'password', // 注意:请不要在key中使用_下划线符号!
                        id: 'passwordFun88', // 注意:请不要在id中使用_下划线符号!
                        data: password,
                        expires: null
                    })
                } else {
                    global.storage.remove({
                        key: 'password', // 注意:请不要在key中使用_下划线符号!
                        id: 'passwordFun88', // 注意:请不要在id中使用_下划线符号!
                    })
                }

                Toast.hide()
            } else {
                let error_details = data.error_details
                if (error_details) {
                    let Message = error_details.Message
                    Message.length && Toast.fail(Message, 2)
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
            regRePwd,
            regNumber,
            regEmail,
            affCode
        } = this.state //註冊訊息

        if (regPwd !== regRePwd) {
            Toast.fail('Mật khẩu không trùng khớp', 2)
            return
        }


        //電話號碼格式檢測
        const phoneNumber = regNumber.replace(/\s+/g, '')
        let DeviceSignatureBlackBox = this.getDeviceSignatureBlackBox()
        const date = {
            'currency': 'THB',
            'wallet': 'MAIN',
            'referer': '',
            'blackBoxValue': E2Backbox,
            'e2BlackBoxValue': E2Backbox,
            'gender': '',
            'secretQID': '',
            'nationID': '',
            'msgerType': '',
            //msgerType: '',
            'dob': '',
            'placeOfBirth': '',
            'hostName': common_url,
            'regWebsite': window.regWebsite,
            'nationality': '1',
            'language': 'th-th',
            'mobile': '66-' + phoneNumber,
            'zipCode': '',
            'city': '',
            'webSiteId': '10',
            'brandCode': 'Fun88',
            'userName': regName,
            'memberTempID': '',
            'mediaCode': '',
            'affiliateCode': affCode ? affCode : affCodeKex, //判断用户是否有填写推荐码
            'lastName': '',
            'email': regEmail,
            'msgerID': '',
            'password': regPwd,
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
        fetchRequest(ApiPort.Member, 'POST', date).then(data => {
            Toast.hide()
            if (data.isSuccess == false) {
                if (data.message) {
                    Toast.fail(data.message, 2)
                } else {
                    let errors = data.errors
                    if (Array.isArray(errors) && errors.length > 0) {
                        let msg = errors[0].description
                        Toast.fail(msg, 2)
                    }
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


    //忘記密碼 名字
    foget(key, piwikMenberText) {
        Actions[key]()
        piwikMenberText && window.PiwikMenberCode(piwikMenberText)
    }

    eyes(key) {
        //顯示密碼
        this.setState({
            [key]: !this.state[key]
        })
    }

    onInputFocus = (key) => {
        if (this.state[key] != 'error') {
            this.setState({
                [key]: 'Focus',
                None: height < 600 ? true : false,
            })
        }
    }

    onInputBlur = (key) => {
        if (this.state[key] != 'error') {
            this.setState({
                [key]: 'ok',
                None: height < 600 ? true : false,
            })
        }
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
                Toast.fail('คุณยังไม่ทำการตั้งค่า กรุณาเข้าระบบด้วยทางเลือกอื่น', 2)
            }
        }).catch(err => {
            //首次验证
            Actions[key]({ username: this.state.logName.toLowerCase() })
            // Actions.LoginPage({username: this.state.logName, stateType: key})
        })
    }

    PiwikMenberCode1(data) {

        if (!data) return
        PiwikProSdk.setUserId(data);
    }


    checkPiwikMenberCode(track, action = 'touch', name = 'defaultName') {
        if (!track) return
        const options = {
            name: name,
            path: 'path',
            value: '1.0.0',
            customDimensions: { 1: '' },
        }
        PiwikProSdk.trackCustomEvent(track, action, options);
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
            isRemberPwd
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

        window.PiwikMenberCode = (track, action = 'touch', name = 'defaultName') => {
            this.checkPiwikMenberCode(track, action, name)
        }

        window.PiwikMenberCode1 = (data) => {
            this.PiwikMenberCode1(data)
        }

        return <ImageBackground
            source={require('./../../images/login/login_bg.png')}
            resizeMode='stretch'
            style={styles.viewContainer}>

            <KeyboardAwareScrollView>
                {this.props.from == 'sbhome' && <TouchableOpacity onPress={() => {
                    Actions.pop();
                }}
                    style={{ position: 'absolute', top: 60, left: 10, width: 50, height: 50 }}>
                    <View>
                        <Image
                            resizeMode='stretch'
                            source={require('../../images/login/back-icon.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </View>
                    {/* <Text style={{color:'#fff',fontSize:18}}>{`<`}</Text> */}
                </TouchableOpacity>}
                <View style={[styles.logoBox]}>
                    <Image
                        resizeMode='stretch'
                        source={require('../../images/login/logo.png')}
                        style={styles.logoImg}
                    />

                    <TouchableOpacity style={styles.homeCsWrap} onPress={() => {
                        Actions.LiveChat()
                        window.PiwikMenberCode('CS', 'Launch', 'Livechat_Header')
                    }}>
                        <Image resizeMode='stretch' source={Boolean(this.props.liveChatData) ? require('./../../images/tabberIcon/ic_online_cs.gif') : require('./../../images/tabberIcon/whiteCS.png')} style={styles.homeCSImg}></Image>
                    </TouchableOpacity>
                </View>

                <View style={styles.loginTopImgBox}>
                    <ImageBackground
                        source={require('../../images/login/login_icon1.png')}
                        resizeMode='stretch'
                        style={styles.loginTopImg}
                    >
                        <Text style={styles.login_icon1Text1}>นิวคาสเซิล</Text>
                        <Text style={styles.login_icon1Text2}>ผู้สนับสนุนอย่างเป็นทางการ</Text>
                    </ImageBackground>
                    <ImageBackground
                        source={require('../../images/login/login_icon2.png')}
                        resizeMode='stretch'
                        style={styles.loginTopImg}
                    >
                        <Text style={styles.login_icon1Text1}>สเปอร์ส</Text>
                        <Text style={styles.login_icon1Text2}>หุ้นส่วนทางการในเอเชีย</Text>
                    </ImageBackground>
                </View>

                <View style={styles.tabContainer}>
                    <View style={{ top: None == true ? -50 : 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#fff' }}>ยูสเซอร์เนม</Text>
                            <RedStar />
                        </View>
                        <TextInput
                            style={[{
                                borderColor: 'white'
                                // borderColor: logNameStat == 'error' ? 'red' : logNameStat == 'ok' ? 'white' : logNameStat == 'Focus' ? '#00AEEF' : 'white'
                            }, styles.input]}
                            underlineColorAndroid='transparent'
                            value={logName}
                            placeholder='กรอกยูสเซอร์เนม'
                            placeholderTextColor='rgba(1,1,1,.5)'
                            textContentType='username'
                            returnKeyType='done'
                            onChangeText={value =>
                                this.handleTextInput('logName', value)
                            }
                            onFocus={() => this.onInputFocus('logNameStat')}
                            onBlur={() => this.onInputBlur('logNameStat')}
                        />

                        {/* {
                                logNameStat == 'error' &&
                                <Text style={[styles.ErrorText]}>Tên đăng nhập cần có 6-14 ký tự bao gồm cả chữ và số</Text>
                            } */}
                    </View>

                    <View style={{ top: None == true ? -50 : 0 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#fff' }}>รหัสผ่าน</Text>
                            <RedStar />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={[{
                                borderColor: logPwdStat == 'error' ? 'red' : logPwdStat == 'ok' ? 'white' : logPwdStat == 'Focus' ? '#00AEEF' : 'white'
                            }, styles.input]}
                                underlineColorAndroid='transparent'
                                value={logPwd}
                                placeholder='กรอกรหัสผ่าน (6-20 ตัวอักษร)'
                                placeholderTextColor='rgba(1,1,1,.5)'
                                textContentType='password'
                                secureTextEntry={!SeePassword}
                                onChangeText={logPwd => {
                                    this.setState({
                                        logPwd,
                                        logPwdStat: logPwd.trim().length ? 'ok' : 'error'
                                    })
                                    //this.handleTextInput('logPwd', value)
                                }}
                                onFocus={() => this.onInputFocus('logPwdStat')}
                                onBlur={() => this.onInputBlur('logPwdStat')}
                            />
                            <View style={{ position: 'absolute', right: 15 }}>
                                <TouchableOpacity hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} onPress={() => this.eyes('SeePassword')}>
                                    <Image resizeMode='stretch' source={SeePassword ? require('../../images/login/eyes.png') : require('../../images/login/eyeopen.png')} style={{ width: 25, height: 20 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {
                            logPwdStat == 'error' && <Text style={[styles.ErrorText]}>ไม่สามารถเว้นช่องรหัสผ่านได้</Text>
                        }
                    </View>

                    <View>
                        <TouchableOpacity style={styles.remberPwdBox} onPress={() => {
                            this.setState({
                                isRemberPwd: !isRemberPwd
                            })

                        }}>
                            {
                                <View style={[styles.remberPwdBoxCirlce, {
                                    backgroundColor: isRemberPwd ? '#25AEE1' : '#fff'
                                }]}>
                                    {
                                        isRemberPwd && <Text style={styles.remberPwdBoxCirlce1}>✓</Text>
                                    }
                                </View>
                            }
                            <Text style={styles.remberPwdBoxTExt}>จํารหัสผ่าน</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.forgetBtnWrap}>
                        {/* 忘记密码 */}
                        <TouchableOpacity onPress={() => this.foget('fogetpassword', 'forgetPW_login')} style={styles.forgetBtn}>
                            <Text style={styles.fogetText}>ลืมรหัสผ่าน?</Text>
                        </TouchableOpacity>
                        <Text style={styles.fogetText1}> | </Text>
                        {/* 忘记用户名 */}
                        <TouchableOpacity onPress={() => this.foget('fogetname', 'forgetUN_login')} style={styles.forgetBtn}>
                            <Text style={styles.fogetText}>ลืมยูสเซอร์เนม?</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity
                            style={[styles.loginRegisterBtn, {
                                backgroundColor: '#25AEE1'
                                // logVerify ? 'rgba(0, 174, 239, 1)' : '#242424' 
                            }]}
                            onPress={() => {
                                //logVerify && 
                                this.handleSubmit('Login')


                                window.PiwikMenberCode('Login', 'Submit', 'Login')
                            }}>
                            {
                                // isShowLoginLoading && <ActivityIndicator size='small' color='#fff' style={{ marginRight: 10 }} />
                            }
                            <Text style={styles.loginRegisterBtnText}>เข้าสู่ระบบ</Text>
                        </TouchableOpacity>

                        {
                            isFrist && <TouchableOpacity
                                style={[styles.loginRegisterBtn, { backgroundColor: '#68C277' }]}
                                onPress={() => {
                                    Actions.pop()
                                    Actions.Register()
                                }}>
                                <Text style={styles.loginRegisterBtnText}>ลงทะเบียน</Text>
                            </TouchableOpacity>
                        }

                        {
                            !isFrist && <View style={{ marginTop: 10 }}>
                                {
                                    Platform.OS == 'ios' &&
                                    <Touch style={[styles.fastLoginBox]} onPress={() => {
                                        this.fastLogins('LoginTouch')

                                        if (DeviceInfoIos) {
                                            window.PiwikMenberCode('Login', 'Submit', 'FaceID_login')
                                        } else {
                                            window.PiwikMenberCode('Login', 'Submit', 'Fingerprint_login')
                                        }
                                    }}>
                                        <Image
                                            resizeMode='stretch'
                                            source={DeviceInfoIos ? require('../../images/login/faceID.png') : require('../../images/login/fingerprint.png')}
                                            style={styles.fastLoginImg}
                                        />
                                        <Text style={styles.fastLoginText}>{DeviceInfoIos ? 'เข้าสู่ระบบผ่าน Face ID?' : 'ตั้งค่า รหัสลายนิ้วมือ'}</Text>
                                    </Touch>
                                }

                                {
                                    Platform.OS == 'android' &&
                                    <View>
                                        {
                                            <Touch style={[styles.fastLoginBox]} onPress={() => {
                                                this.fastLogins('LoginTouch')

                                                window.PiwikMenberCode('Login', 'Submit', 'Fingerprint_login')
                                            }}>
                                                <Image
                                                    resizeMode='stretch'
                                                    source={require('../../images/login/fingerprint.png')}
                                                    style={styles.fastLoginImg}
                                                />
                                                <Text style={styles.fastLoginText}>ตั้งค่า รหัสลายนิ้วมือ</Text>
                                            </Touch>
                                        }
                                        <Touch style={[styles.fastLoginBox]} onPress={() => {
                                            this.fastLogins('LoginPattern')

                                            window.PiwikMenberCode('Login', 'Submit', 'Pattern_login')
                                        }}>
                                            <Image
                                                resizeMode='stretch'
                                                source={require('../../images/login/unlockScan.png')}
                                                style={styles.fastLoginImg}
                                            />
                                            <Text style={styles.fastLoginText}>เข้าสู่ระบบผ่านการใช้รหัส?</Text>
                                        </Touch>
                                    </View>
                                }
                            </View>
                        }


                        {
                            !isFrist && <TouchableOpacity
                                style={{
                                    alignItems: 'center',
                                    marginTop: 5
                                }}
                                onPress={() => {
                                    Actions.pop()
                                    Actions.Register()

                                    window.PiwikMenberCode('Register', 'Submit', 'Submit_Register')
                                }}>
                                <Text style={{
                                    color: '#FFFFFF'

                                }}>คุณยังไม่มีบัญชีใช่หรือไม่?</Text>
                            </TouchableOpacity>
                        }

                        <TouchableOpacity
                            style={styles.button2}
                            onPress={() => {
                                Actions.pop()
                                Actions.jump('home')

                                window.PiwikMenberCode('Guestview_login')
                                //this.look()
                            }}
                        >
                            <Text style={styles.button2Text}>ทดลองใช้งาน</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </KeyboardAwareScrollView>
            <View style={styles.NumberAPPBox}>
                <Text style={styles.NumberAPP}>แอปเวอชั่น {version}</Text>
            </View>
        </ImageBackground>
    }
}

const mapStateToProps = (state) => ({
    authToken: state.auth.authToken,
    email: state.auth.email,
    liveChatData: state.liveChatData
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    tabContainer: {
        paddingHorizontal: 15
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
        color: 'red',
        marginBottom: 5,
        marginTop: -5
    },
    phoneBox: {
        backgroundColor: '#F2F2F2',
        width: 50,
        borderColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
        paddingLeft: 0,
        paddingRight: 0
    },
    loginRegisterBtn: {
        width: width - 30,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        flexDirection: 'row'
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
        marginTop: 5,
        marginBottom: Platform.OS === 'ios' ? 10 : 5,
        fontSize: 15,
        borderWidth: 1,
        backgroundColor: '#fff',
        padding: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5,
        color: 'rgba(1,1,1,0.5)'
    },
    button2: {
        paddingVertical: 15
    },
    button2Text: {
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        fontSize: 13,

    },
    NumberAPPBox: {
        position: 'absolute',
        right: 15,
        zIndex: 1000,
        bottom: 40
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
    login_icon1Text1: {
        color: '#fff',
        fontWeight: 'bold'
    },
    login_icon1Text2: {
        fontSize: 8,
        color: '#fff',
    },
    loginTopImg: {
        width: (width - 10) * .46,
        height: (width - 10) * .46 * .424,
        justifyContent: 'center',
        paddingLeft: 70
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
        color: '#fff',
        fontWeight: 'bold'
    }
})