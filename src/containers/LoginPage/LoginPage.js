/**
 * 人脸样本采集封装（百度AI-SDK）
 */
import React, { Component } from 'react';
import LinearGradient from "react-native-linear-gradient";
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
    Dimensions,
    ImageBackground,
    Modal,
    TouchableOpacity
} from 'react-native';
import PasswordGesture from './gesturePassword/index'
import Toast from '@/containers/Toast'
import Video from "react-native-video";
import styles from './style'

import Touch from "react-native-touch-once";
import { Actions } from 'react-native-router-flux';
import FingerprintScanner from 'react-native-fingerprint-scanner';

const FaceCheckHelper = NativeModules.PushFaceViewControllerModule;

const { width, height } = Dimensions.get("window");

export default class LoginPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesArray: [],
            stateType: this.props.stateType,
            faceAccessToken: '',//百度token，30天过期
            userFaceData: '',//用户脸部识别资料
            touchActive: false,//指纹解锁
            errorMessage: '',
            message: 'การตั้งค่ารหัสแพทเทิร์นนี้สำหรับเข้าสู่ระบบแบบรวดเร็ว\nกรุณาลากรหัสตั้งแต่ 4-9 หลัก',
            status: 'normal',
            timeOut: 300,
            patternPassword: '',//九宫格密码
            touchLogin: 0,
            patternPasswordTime: 0
        };
    }
    componentDidMount() {
        //記住密碼尋找
        let passwordKey = 'passwordKey' + this.props.username;
        let passwordID = 'passwordID' + this.props.username
        global.storage
            .load({
                key: passwordKey,
                id: passwordID
            })
            .then(ret => {
                this.setState({ passwordValue: ret });
            })
            .catch(err => {
                //密码失效
                Toast.fail("หมดเวลายืนยัน กรุณายืนยันอีกครั้ง", 2);
                this.fastLoginRemove()
                Actions.pop();
            });
        if (this.props.stateType == 'LoginFace') {
            //人脸识别
            let storageKey = 'faceKey' + this.props.username;
            let storageId = 'faceId' + this.props.username
            storage.load({
                key: storageKey,
                id: storageId
            })
                .then(data => {
                    if (data.img) {
                        this.getFaceAccessToken()
                        this.setState({ userFaceData: data, faceAccessToken: data.accessToken })
                    } else {
                        //用户图片数据失效，请重新验证登录
                        Toast.fail("หมดเวลายืนยัน กรุณายืนยันอีกครั้ง", 2);
                        global.storage.remove({
                            key: storageKey,
                            id: storageId,
                        });
                        this.fastLoginRemove()
                    }
                })
                .catch(err => {
                    Toast.fail("หมดเวลายืนยัน กรุณายืนยันอีกครั้ง", 2);
                    this.fastLoginRemove()
                })
            const FaceCheckModules = Platform.select({
                android: () => FaceCheckHelper,
                ios: () => NativeModules.RNIOSExportJsToReact
            })();
            const NativeModule = new NativeEventEmitter(FaceCheckModules);
            this.ficeIDListen = NativeModule.addListener('FaceCheckHelper', (data) => this.faceCheckCallback(data));
        } else if (this.props.stateType == 'LoginTouch') {
            //指纹解锁验证
            FingerprintScanner
                .isSensorAvailable()
                .then(() => {
                    this.setState({ touchActive: true })
                })
                .catch(error => {
                    if (Platform.OS == "ios") {
                        this.errorMessageIos()
                    } else {
                        this.errorMessage(error.name)
                    }

                });
        } else {
            //九宫格密码
            let storageKey = 'patternKey' + this.props.username;
            let storageId = 'patternId' + this.props.username;
            storage.load({
                key: storageKey,
                id: storageId
            })
                .then(data => {
                    if (data) {
                        this.setState({ patternPassword: data })
                    } else {
                        //九宫格密码失效
                        Toast.fail("หมดเวลายืนยัน กรุณายืนยันอีกครั้ง", 2);
                        global.storage.remove({
                            key: storageKey,
                            id: storageId,
                        });
                        this.fastLoginRemove()
                    }
                })
                .catch(() => {
                    Toast.fail("หมดเวลายืนยัน กรุณายืนยันอีกครั้ง", 2);
                    this.fastLoginRemove()

                })
        }
    }
    componentWillUnmount() {
        Platform.OS == "android" && FingerprintScanner.release();
        this.ficeIDListen && this.ficeIDListen.remove();
    }
    fastLoginRemove() {
        //清除快捷登录方式
        let storageKey = 'fastLogin' + this.props.username;
        let storageId = 'fastLogin' + this.props.username;
        global.storage.remove({
            key: storageKey,
            id: storageId,
        });
        Actions.pop();
    }

    //人脸检查监听
    faceCheckCallback(data) {
        if (data.remindCode == 0) {
            let imgeList = [];
            let imagesName = Object.keys(data.images); // bestImage liveEye liveYaw liveMouth yawRight yawLeft pitchUp pitchDown
            imagesName.map((info, index) => {
                let image = data.images[info]
                if (Platform.OS === 'ios' && info === 'bestImage' && typeof (image) !== 'string') {
                    image = data.images.bestImage[0]
                }
                imgeList.unshift(image)
            })
            this.validationCheck(imgeList[0])
        } else if (data.remindCode == 36) {
            Toast.fail("ช่องทางยืนยันหมดอายุแล้ว กรุณายืนยันอีกครั้ง", 2);
        }
    }
    //获取百度脸部识别AccessToken
    getFaceAccessToken() {
        fetch("https://www.rb1005.com/face/", { method: "GET" })
            .then(response => (headerData = response.json()))
            .then(responseData => {
                let data = JSON.parse(responseData)
                if (data) {
                    this.setState({ faceAccessToken: data.access_token })
                    let facedata = this.state.userFaceData;
                    facedata.accessToken = data.access_token;

                    //储存用户toekn
                    let storageKey = 'faceKey' + this.props.username;
                    let storageId = 'faceId' + this.props.username
                    global.storage.save({
                        key: storageKey,
                        id: storageId,
                        data: facedata,
                        expires: null
                    });
                }
            })
            .catch(error => { });
    }
    validationCheck(img) {
        let data = {
            token: this.state.faceAccessToken,
            image1: this.state.userFaceData.img,
            image2: img,
        }
        fetch('https://www.rb1005.com/face/faceCheck.php', {
            method: 'POST',
            // body: JSON.stringify(data),
            body: `token=${data.token}&image1=${data.image1}&image2=${data.image2}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then(res => {
            return res.json();
        }).then(json => {
            if (Number(json.score) > 80) {
                window.fastLogin && window.fastLogin(this.props.username, this.state.passwordValue, 'commonlogin')
                this.setState({ errorMessage: '' })
            } else {
                this.setState({ errorMessage: 'การยืนยันขัดข้อง กรุณาลองอีกครั้ง' })
            }
        }).catch(err => {
            Toast.fail('การยืนยันไม่สำเร็จ กรุณาลองอีกครั้ง', 2)
        })
    }
    //点击验证
    faceChack() {
        let obj = {
            //质量校验设置
            'quality': {
                'minFaceSize': 200,// 设置最小检测人脸阈值 默认是200
                'cropFaceSizeWidth': 400,// 设置截取人脸图片大小 默认是 400
                'occluThreshold': 0.5,// 设置人脸遮挡阀值 默认是 0.5
                'illumThreshold': 40,// 设置亮度阀值 默认是 40
                'blurThreshold': 0.7,// 设置图像模糊阀值 默认是 0.7
                'EulurAngleThrPitch': 10,// 设置头部姿态角度 默认是 10
                'EulurAngleThrYaw': 10,// 设置头部姿态角度 默认是 10
                'EulurAngleThrRoll': 10,// 设置头部姿态角度 默认是 10
                'isCheckQuality': true,// 设置是否进行人脸图片质量检测 默认是 true
                'conditionTimeout': 10,// 设置超时时间 默认是 10
                'notFaceThreshold': 0.6,// 设置人脸检测精度阀值 默认是0.6
                'maxCropImageNum': 1,// 设置照片采集张数 默认是 1
            },
            'liveActionArray': [
                0, //眨眨眼
            ], //活体动作列表
            'order': true,//是否按顺序进行活体动作
            'sound': true, // 提示音，默认不开启
        };
        FaceCheckHelper.openPushFaceViewController(obj);
        // 如果都不设置，需要传 {} 空对象， 建议设置 liveActionArray
        // FaceCheckHelper.openPushFaceViewController( {} );
    }


    //ios使用，锁屏后重启app；
    errorMessageIos() {
        Toast.fail('การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน', 2)
        Actions.pop()
    }
    //指纹验证错误提示
    errorMessage(err, key) {
        let message = '';
        const iphoneX = DeviceInfoIos;
        //iphonex没有指纹识别，提示语不同
        switch (err) {
            case 'AuthenticationNotMatch':
                //不匹配
                //message = iphoneX && '脸部识别匹配失败1' || '指纹匹配失败';
                message = iphoneX && 'การสแกน Face ID ไม่ตรงกัน' || 'การสแกนลายนิ้วมือไม่ตรงกัน';
                break;
            case 'AuthenticationFailed':
                //指纹不匹配
                //message = iphoneX && '脸部识别匹配失败' || '指纹匹配失败';
                message = iphoneX && 'ยืนยันการสแกน Face ID ไม่สำเร็จ' || `รหัสผ่านไม่ถูกต้อง\nโปรดตรวจสอบให้แน่ใจว่าข้อมูลถูกต้อง​`;
                break;
            case 'UserCancel':
                //点击取消
                //message = '您已取消验证';
                message = 'คุณได้ยกเลิกการยืนยัน';
                break;
            case 'UserFallback':
                //点击输入密码
                //message = '您已取消验证 ';
                message = 'คุณได้ยกเลิกการยืนยัน ';
                break;
            case 'SystemCancel':
                //进入后台
                message = 'ยกเลิกการยืนยัน';
                break;
            case 'PasscodeNotSet':
                //手机没有设置密码
                //message = '您还未设置密码';
                message = 'โทรศัพท์ของคุณยังไม่มีการตั้งรหัสผ่าน';
                break;
            case 'FingerprintScannerNotAvailable':
                //无法使用指纹功能
                //message = iphoneX && '脸部登入无法启动，此手机没有脸部识别功能' || '指纹登入无法启动，此手机没有指纹识别功能';
                message = iphoneX && 'ไม่สามารถเปิดใช้งาน Face ID ได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับ Face ID' || 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
                break;
            case 'FingerprintScannerNotEnrolled':
                //手机没有预先设置指纹
                //message = iphoneX && '脸部登入无法启动，您手机内还未设置脸部识别' || '指纹登入无法启动，您手机内还未设置指纹识别';
                message = iphoneX && 'ไม่สามารถเปิดใช้งานการเข้าสู่ระบบด้วย Face ID ได้ และยังไม่มีการตั้งค่า Face ID ในโทรศัพท์ของคุณ' || 'ไม่สามารถเปิดใช้งานการเข้าสู่ระบบด้วยการสแกนลายนิ้วมือได้ และยังไม่มีการตั้งค่าการสแกนลายนิ้วมือในโทรศัพท์ของคุณ';
                break;
            case 'FingerprintScannerUnknownError':
                if (Platform.OS === 'ios') {
                    //ios错误四次提示,锁屏后重启app；
                    //message = '验证错误次数过多，请使用密码登录';
                    message = 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน';
                    setTimeout(() => {
                        Actions.pop()
                    }, 2000);
                    return;
                }
                break;
            case 'FingerprintScannerNotSupported':
                //设备不支持
                //message = iphoneX && '脸部登入无法启动，您手机内还未设置脸部识别' || '此手机不支持指纹识别';
                message = iphoneX && 'ไม่สามารถเปิดใช้งาน Face ID ได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับ Face ID' || 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
                break;
            case 'DeviceLocked':
                //认证不成功，锁定30秒
                //message = iphoneX && '验证错误次数过多，请使用密码登录' || '指纹已禁用，请30秒后重试';
                message = iphoneX && 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน' || 'การสแกนลายนิ้วมือถูกปิดใช้งาน กรุณาลองอีกครั้งใน 30 วินาที';
                break;

            default:
                //message = iphoneX && '未知原因导致无法使用脸部功能' || '未知原因导致无法使用指纹功能'
                message = iphoneX && 'ไม่สามารถใช้งาน Face ID ได้โดยไม่ทราบสาเหตุ' || 'ไม่สามารถใช้งานการสแกนลายนิ้วมือได้โดยไม่ทราบสาเหตุ'
                break;
        }
        this.setState({ errorMessage: '' })
        setTimeout(() => {
            this.setState({ errorMessage: message, touchActive: true })
        }, 1000);
        if (!key) {
            //指纹初始化错误才返回
            setTimeout(() => {
                Actions.pop()
            }, 2000);
        }
    }

    //九宫格输入结束
    onEnd(password) {
        const { patternPassword } = this.state;
        if (password === patternPassword) {
            this.setState({ status: 'right' });
            setTimeout(() => {
                window.fastLogin && window.fastLogin(this.props.username, this.state.passwordValue, 'commonlogin')
            }, 350);
        } else {
            let patternPasswordTime1 = this.state.patternPasswordTime
            if (patternPasswordTime1 < 4) {
                patternPasswordTime1++
                this.setState({
                    patternPasswordTime: patternPasswordTime1
                })
            } else {
                // Actions.pop()
            }

            this.setState({ status: 'wrong' });
            Toast.fail("รหัสไม่ถูกต้อง กรุณากรอกใหม่ ถ้าคุณกรอกผิด 5 ครั้ง บัญชีคุณจะออกจากระบบ", 2);
        }
    }
    //九宫格输入开始
    onStart() {
        this.setState({ status: 'normal' });
        if (this.state.timeOut) {
            clearTimeout(this.time);
        }
    }

    touchSuccess() {
        this.setState({ touchActive: false })
        window.fastLogin && window.fastLogin(this.props.username, this.state.passwordValue, 'commonlogin')
    }
    fastLogins(key) {
        let fastLoginKey = 'fastLogin' + this.props.username;
        let sfastLoginId = 'fastLogin' + this.props.username;
        global.storage.save({
            key: fastLoginKey,
            id: sfastLoginId,
            data: key,
            expires: null
        });
    }

    render() {
        const { stateType, errorMessage, touchActive } = this.state;
        return <ImageBackground
            source={require('./../../images/login/login_bg.png')}
            resizeMode='stretch'
            style={[styles.viewContainer, {
            }]}>
            {/* <ScrollView
                contentContainerStyle={{ flex: 1 }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            > */}
           
            <Modal animationType='fade' transparent={true} visible={this.state.patternPasswordTime == 5}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                            <Text style={styles.modalTopText}>รหัสไม่ถูกต้อง</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
                                รหัสไม่ถูกต้อง กรุณากรอกใหม่ ถ้าคุณกรอกผิด 5 ครั้ง บัญชีคุณจะออกจากระบบ
                            </Text>

                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity onPress={() => {
                                    Actions.pop()
                                    this.setState({
                                        patternPasswordTime: 0
                                    })
                                }} style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}>
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>ยืนยัน</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            {
                stateType != 'LoginPattern' ?
                    <View>
                        {
                            stateType != 'LoginPattern' &&
                            <View>
                                <View style={[styles.validation, { marginTop: 10 }]}>
                                    <Image
                                        resizeMode="stretch"
                                        source={require("../../images/common/logoIcon/whiteLogo.png")}
                                        style={{
                                            width: .4 * width,
                                            height: .4 * .22 * width,
                                        }}
                                    />
                                    <Text style={[styles.titleTxt, { fontSize: 16, color: '#fff', marginBottom: 50 }]}>ยินดีต้อนรับ!</Text>
                                    {
                                        // <Text style={{ color: '#fff', marginBottom: 20, textAlign: 'center', marginTop: 8 }}>{this.props.username}</Text>
                                    }
                                    {
                                        //脸部识别
                                        stateType == 'LoginFace' &&
                                        <View>
                                            <Touch onPress={() => { this.faceChack() }} style={styles.validation}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={require("../../images/login/faceID.png")}
                                                    style={{ width: 65, height: 65 }}
                                                />
                                            </Touch>
                                            <Text style={[styles.username, { color: '#fff', fontWeight: 'bold' }]}>ใช้ระบบจดจำใบหน้า</Text>
                                        </View>
                                    }
                                    {
                                        //指纹识别
                                        stateType == 'LoginTouch' &&
                                        <View>
                                            <Touch onPress={() => { }} style={styles.validation}>
                                                <Image
                                                    resizeMode="stretch"
                                                    source={
                                                        DeviceInfoIos ? require("../../images/login/faceID.png")
                                                            : require("../../images/login/fingerprint.png")
                                                    }
                                                    style={{ width: DeviceInfoIos ? 65 : 65, height: DeviceInfoIos ? 65 : 65, marginBottom: 10 }}
                                                />
                                            </Touch>
                                            <Text style={[styles.username, { color: '#fff', fontWeight: 'bold' }]}>{DeviceInfoIos ? 'ใช้ระบบจดจำใบหน้า' : 'รหัสลายนิ้วมือ'}</Text>
                                            {
                                                touchActive && Platform.OS == "ios" &&
                                                <FingerprintPopupIOS errCallback={(err, key) => { this.errorMessage(err, key) }} successCallback={() => { this.touchSuccess() }} />
                                            }
                                            {
                                                touchActive && Platform.OS == "android" &&
                                                <FingerprintPopupAndroid errCallback={(err, key) => { this.errorMessage(err, key) }} successCallback={() => { this.touchSuccess() }} />
                                            }
                                        </View>
                                    }
                                    <Text style={[styles.username, { color: 'red', marginBottom: height / 3.2 }]}>{errorMessage != '' && errorMessage}</Text>
                                    <Touch onPress={() => { Actions.pop() }} style={[{ height: 38, justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: '#00AEEF', width: width * .7, borderRadius: 4 }]}>
                                        <Text style={{ textAlign: 'center', color: '#fff', }}>รหัสเข้าสู่ระบบ</Text>
                                    </Touch>
                                </View>
                            </View>
                        }
                    </View>
                    :
                    // 九宫格插件布局特殊处理
                    <PasswordGesture
                        ref="pg"
                        status={this.state.status}
                        message={""}
                        onStart={() => this.onStart()}
                        onEnd={password => this.onEnd(password)}
                        innerCircle={true}
                        outerCircle={true}
                        interval={this.state.timeOut}
                        normalColor={"#fff"}
                        rightColor={"#00B324"}
                        wrongColor={"red"}
                        style={{ backgroundColor: 'transparent', position: "relative", top: 0 }}
                    >
                        <View style={[styles.patternTxt, {
                            position: 'absolute',
                            top: 30
                        }]}>
                            <Image
                                resizeMode="stretch"
                                source={require("../../images/common/logoIcon/whiteLogo.png")}
                                style={{
                                    width: .4 * width,
                                    height: .4 * .22 * width,
                                }}
                            />
                            <Text style={{ textAlign: 'center', fontSize: 16, color: '#fff', marginTop: 10 }}>ยินดีต้อนรับ!</Text>
                            {
                                // <Text style={{ textAlign: 'center', color: '#fff', marginBottom: 10 }}>{this.props.username}</Text>
                            }
                            <Text style={{ textAlign: 'center', color: '#fff', marginTop: 15 }}>กรุณาใส่รหัสแพทเทิร์น</Text>
                        </View>
                        <Touch
                            onPress={() => {
                                Actions.pop();
                            }}
                            style={[styles.patternTxt, { top: height / 1.3,
                            height: 38, 
                            justifyContent: 'center',
                             alignItems: 'center', 
                             left: width * .15, 
                             right: width * .15, 
                             backgroundColor: '#00AEEF',
                              width: width * .7, 
                              borderRadius: 4
                        }]}
                        >
                            <Text style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}>รหัสเข้าสู่ระบบ</Text>
                        </Touch>
                    </PasswordGesture>
            }
            {/* </ScrollView> */}
        </ImageBackground>
    }
}



class FingerprintPopupIOS extends React.Component {
    componentDidMount() {
        FingerprintScanner
            .authenticate({ description: 'แจ้งเตือน กรุณาใช้การสแกนลายนิ้ว', fallbackEnabled: false })
            .then(() => {
                this.props.successCallback();
            })
            .catch((error) => {
                this.props.errCallback(error.name, 'err');
            });
    }

    render() {
        return false;
    }
}
class FingerprintPopupAndroid extends React.Component {
    componentDidMount() {
        FingerprintScanner
            .authenticate({ onAttempt: this.handleAuthenticationAttempted })
            .then(() => {
                this.props.successCallback()
            })
            .catch((error) => {
                this.props.errCallback(error.name);
            });
    }
    //验证失败
    handleAuthenticationAttempted = (error) => {
        this.props.errCallback(error.name, 'err');
    };

    render() {
        return false;
    }
}