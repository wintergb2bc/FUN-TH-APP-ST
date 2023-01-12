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
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { connect } from "react-redux";
import { login } from "../../actions/AuthAction";
import Toast from '@/containers/Toast'

import Touch from "react-native-touch-once";
import { passwordReg } from "../../actions/Reg";
import styles from './style'
import { Actions } from 'react-native-router-flux';

const FaceCheckHelper = NativeModules.PushFaceViewControllerModule;


const { width, height } = Dimensions.get("window");
class LoginFace extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imagesArray: [],
            passwordValue: '',
            validation: '',
        };
    }
    componentDidMount() {
        if (Platform.OS === 'ios') {
            const FaceCheckModules = Platform.select({
                android: () => FaceCheckHelper,
                ios: () => NativeModules.RNIOSExportJsToReact
            })();
            const NativeModule = new NativeEventEmitter(FaceCheckModules);
            this.ficeIDListen = NativeModule.addListener('FaceCheckHelper', (data) => this.faceCheckCallback(data));
        }
        // let storageKey = 'faceKey' + this.props.username;
        // let storageId = 'faceId' + this.props.username
        // global.storage.remove({
        //     key: storageKey,
        //     id: storageId,
        // });
    }
    componentWillUnmount() {
        this.ficeIDListen && this.ficeIDListen.remove();
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
            window.fastChangeLogin && window.fastChangeLogin(this.props.username, this.state.passwordValue, 'LoginFace')
        } else {
            //首页快捷登录
            window.fastLogin && window.fastLogin(this.props.username, this.state.passwordValue, 'LoginFace')
        }
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
            //储存用户脸部图
            let facedata = { img: imgeList[0] };
            let storageKey = 'faceKey' + this.props.username;
            let storageId = 'faceId' + this.props.username
            global.storage.save({
                key: storageKey,
                id: storageId,
                data: facedata,
                expires: null
            });
            //快捷登录方式
            let fastLoginKey = 'fastLogin' + this.props.username;
            let sfastLoginId = 'fastLogin' + this.props.username;
            global.storage.save({
                key: fastLoginKey,
                id: sfastLoginId,
                data: 'LoginFace',
                expires: null
            });
            this.props.navigation.setParams({
                title: "ตั้งค่าสแกนใบหน้าเรียบร้อย"
            });
            this.setState({ validation: 'ok' })
            //验证成功跳转
            setTimeout(() => {
                if (!this.props.fastChange) {
                    let username = "loginok";
                    let password = "loginok";
                    this.props.login({ username, password });
                } else {
                    window.checkActiveType && window.checkActiveType('LoginFace')
                    Actions.pop()
                }
            }, 2000);
        } else if (data.remindCode == 36) {
            Toast.fail("ช่องทางยืนยันหมดอายุแล้ว กรุณายืนยันอีกครั้ง", 2);
        }
    }
    //活体验证录入图片
    getImg() {
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
                1, //张张嘴
                2, //向右摇头
                3, //向左摇头
                4, //抬头
                5, //低头
                6, //摇头
            ], //活体动作列表
            'order': true,//是否按顺序进行活体动作
            'sound': true, // 提示音，默认不开启
        };
        FaceCheckHelper.openPushFaceViewController(obj);
        // 如果都不设置，需要传 {} 空对象， 建议设置 liveActionArray
        // FaceCheckHelper.openPushFaceViewController( {} );
    }

    render() {
        window.faceCheck = (key) => {
            this.getImg()
        }
        const { validation, passwordValue } = this.state;
        return (
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
                <View>
                    {
                        validation == '' &&
                        <View style={styles.validation}>
                            <Text style={styles.titleTxt}>กรุณาใส่รหัสผ่านเพื่อยืนยันการเปิดใช้งาน</Text>
                            <Image
                                resizeMode="stretch"
                                source={require("../../images/login/faceRecogitionNO.png")}
                                style={{ width: 60, height: 60 }}
                            />
                            <Text style={styles.username}>{this.props.username}</Text>
                            <View style={styles.passInput}>
                                <TextInput
                                    style={{ width: width - 30, padding: 8 }}
                                    value={passwordValue}
                                    placeholderTextColor="#474747"
                                    placeholder="Mật khẩu："
                                    textContentType="password"
                                    secureTextEntry={true}
                                    onChangeText={value => this.handleTextInput(value)}
                                />
                            </View>
                            <View>
                                <Touch onPress={() => { this.okBtn() }}>
                                    <View style={styles.onBtn}>
                                        <Text style={styles.okBtnTxt}>ยืนยัน</Text>
                                    </View>
                                </Touch>
                                {
                                    !ApiPort.UserLogin && <View>
                                        <TouchableOpacity style={{ height: 34, justifyContent: 'center', alignItems: 'center', marginTop: 15 }} onPress={() => {
                                            Actions.pop()
                                        }}>
                                            <Text style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}>Đăng Nhập Thông Thường</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>
                        </View>
                    }
                    {
                        validation == 'ok' &&
                        <View style={styles.validation}>
                            <Text style={styles.titleTxt}>การตั้งค่าสำเร็จ</Text>
                            <View style={{ marginLeft: 25 }}>
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../images/login/facegropSuccess.png")}
                                    style={{ width: 80, height: 63 }}
                                />
                            </View>
                            <Text style={styles.username}>{this.props.username}</Text>
                        </View>
                    }
                </View>
            </View>
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
)(LoginFace);
