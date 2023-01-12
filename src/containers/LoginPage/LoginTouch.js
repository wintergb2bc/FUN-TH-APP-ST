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
  ImageBackground,
  ScrollView,
  Platform,
  TextInput,
  Dimensions,
  Modal,
  TouchableOpacity
} from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Toast from '@/containers/Toast'
import { connect } from "react-redux";
import { login } from "../../actions/AuthAction";

import FingerprintScanner from 'react-native-fingerprint-scanner';
import Touch from "react-native-touch-once";
import { passwordReg } from "../../actions/Reg";
import styles from './style'
import { Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get("window");
class LoginTouch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      passwordValue: '',
      validation: '',
      errorMessage: '',
      validationActive: '',
    };
  }

  componentDidMount() {
    FingerprintScanner
      .isSensorAvailable()
      .then(() => {
        // this.setState({popupShowed: true})
      })
      .catch(error => {
        if (Platform.OS == "ios") {
          this.errorMessageIos(error.name)
        } else {
          this.errorMessage(error.name)
        }
      });
    if (DeviceInfoIos) {
      this.props.navigation.setParams({
        title: 'ตั้งค่า Face ID'
      });
    }
  }
  componentWillUnmount() {
    Platform.OS == "android" && FingerprintScanner.release();
  }
  //ios使用，锁屏后重启app；
  errorMessageIos(err) {
    let message = '';
    const iphoneX = DeviceInfoIos;
    console.log('errorMessageIos', err);
    switch (err) {
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
        //message = '验证错误次数过多，请使用密码登录';
        message = 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน';
        break;

      default:
        //message = '验证错误次数过多，请使用密码登录'
        message = 'การยืนยันขัดข้องเกินกำหนด กรุณาเข้าสู่ระบบด้วยรหัสผ่าน';
        break;
    }
    Toast.fail(message, 2)
    Actions.pop()
  }
  //指纹验证错误提示
  errorMessage(err, key) {
    let message = '';
    const iphoneX = DeviceInfoIos;
    console.log('errorMessage', key, err);
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
        message = iphoneX && 'ยืนยันการสแกน Face ID ไม่สำเร็จ' || 'การสแกนลายนิ้วมือไม่สำเร็จ';
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
        //message = '系统已取消验证';
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
    Toast.fail(message, 2)
    Actions.pop()
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
      window.fastChangeLogin && window.fastChangeLogin(this.props.username, this.state.passwordValue, 'LoginTouch')
    } else {
      //首页快捷登录
      window.fastLogin && window.fastLogin(this.props.username, this.state.passwordValue, 'LoginTouch')
    }
  }
  successActive() {
    //快捷登录方式
    let fastLoginKey = 'fastLogin' + this.props.username;
    let sfastLoginId = 'fastLogin' + this.props.username;
    global.storage.save({
      key: fastLoginKey,
      id: sfastLoginId,
      data: 'LoginTouch',
      expires: null
    });
    if (DeviceInfoIos) {
      this.props.navigation.setParams({
        title: 'ตั้งค่าสแกนใบหน้าเรียบร้อย'
      });
    }

    this.setState({ validation: 'ok' })
    //验证成功跳转
    setTimeout(() => {
      if (!this.props.fastChange) {
        let username = "loginok";
        let password = "loginok";
        this.props.login({ username, password });
      } else {
        window.checkActiveType && window.checkActiveType('LoginTouch')
        Actions.pop()
      }
    }, 2000);
  }

  render() {
    const { validation, passwordValue, validationActive } = this.state;
    window.touchCheck = (key) => {
      this.setState({ validationActive: 'active' })
    }
    return (
      <ImageBackground
        source={require('./../../images/login/login_bg.png')}
        resizeMode='stretch'
        style={styles.viewContainer}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 20 }}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View>
            {
              validation == '' && <View style={styles.validation}>
                <Text style={styles.titleTxt}>{DeviceInfoIos ? 'กรุณากรอกรหัสผ่านเพื่อเปิดการใช้งาน เข้าสู่ระบบผ่าน Face ID' : 'กรุณาใส่รหัสผ่านเพื่อยืนยันการเปิดใช้งาน'}</Text>
                <Image
                  resizeMode="stretch"
                  source={
                    DeviceInfoIos ? require("../../images/login/faceRecogitionNO.png")
                      : require("../../images/login/fingerprintScanNo.png")
                  }
                  style={DeviceInfoIos ? styles.loginTouch1 : styles.loginTouch2}
                />
                <Text style={styles.username}>{this.props.username}</Text>
                <View style={styles.passInput}>
                  <Text style={styles.longinTouchInputText}>รหัสผ่าน</Text>
                  <TextInput
                    style={styles.longinTouchInput}
                    value={passwordValue}
                    placeholderTextColor="#474747"
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
                    // !ApiPort.UserLogin && <View>
                    //   <TouchableOpacity style={{ height: 34, justifyContent: 'center', alignItems: 'center', marginTop: 15 }} onPress={() => {
                    //     Actions.pop()
                    //   }}>
                    //     <Text style={{ textAlign: 'center', color: '#fff', textDecorationLine: 'underline' }}>Đăng Nhập Thông Thường</Text>
                    //   </TouchableOpacity>
                    // </View>
                  }
                </View>
                {
                  validationActive === 'active' && Platform.OS == "ios" &&
                  <FingerprintPopupIOS errCallback={(err) => { this.errorMessage(err) }} successCallback={() => { this.successActive() }} />
                }
                {
                  validationActive === 'active' && Platform.OS == "android" &&
                  <FingerprintPopupAndroid errCallback={(err) => { this.errorMessage(err) }} successCallback={() => { this.successActive() }} />
                }
              </View>
            }
            {
              validation == 'ok' &&
              <View style={styles.validation}>
                <Text style={styles.titleTxt}>{DeviceInfoIos && 'บันทึก Face ID ของคุณแล้ว ตอนนี้คุณสามารถใช้เพื่อเข้าสู่ระบบได้อย่างรวดเร็ว' || 'คุณมีการยืนยันลายนิ้วมือแล้ว สามารถเข้าสู่ระบบด้วยลายนิ้วมือ'}</Text>
                <View style={{}}>
                  <Image
                    resizeMode="stretch"
                    source={
                      DeviceInfoIos ? require("../../images/login/facegropSuccess.png")
                        : require("../../images/login/fingerprintScanOK.png")
                    }
                    style={DeviceInfoIos ? styles.loginTouchOK1 : styles.loginTouchOK2}
                  />
                </View>
                <Text style={styles.username}>{this.props.username}</Text>
              </View>
            }
          </View>
        </ScrollView>
        <View style={styles.NumberAPPBox}>
          <Text style={styles.NumberAPP}>แอปเวอชั่น {FUN88Version}</Text>
        </View>
      </ImageBackground>
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
)(LoginTouch);

export class FingerprintPopupIOS extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {
    FingerprintScanner
      .authenticate({ description: 'แจ้งเตือน กรุณาใช้การสแกนลายนิ้ว', fallbackEnabled: false })
      .then(() => {
        this.props.successCallback()
      })
      .catch((error) => {
        this.props.errCallback(error.name);
      });
  }

  render() {
    return false;
  }
}
;

export class FingerprintPopupAndroid extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      active: true,
      errorMessage: '',
    };
  }

  componentDidMount() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttempted })
      .then(() => {
        this.props.successCallback()
      })
      .catch((error) => {
        // this.props.errCallback(error.name);
        this.errorMessage(error.name)
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  //验证失败
  handleAuthenticationAttempted = (error) => {
    this.errorMessage(error.name)
  };
  //指纹验证错误提示
  errorMessage(err) {
    let message = '';
    switch (err) {
      case 'AuthenticationNotMatch':
        //不匹配
        //message = '指纹匹配失败';
        message = 'การสแกนลายนิ้วมือไม่ตรงกัน';
        break;
      case 'AuthenticationFailed':
        //指纹不匹配
        //message = '指纹匹配失败';
        message = 'การสแกนลายนิ้วมือไม่สำเร็จ';
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
        //message = '系统已取消验证';
        message = 'ยกเลิกการยืนยัน';
        break;
      case 'PasscodeNotSet':
        //手机没有设置密码
        //message = '您还未设置密码';
        message = 'โทรศัพท์ของคุณยังไม่มีการตั้งรหัสผ่าน';
        break;
      case 'FingerprintScannerNotAvailable':
        //无法使用指纹功能
        //message = '指纹登入无法启动，此手机没有指纹识别功能';
        message = 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
        break;
      case 'FingerprintScannerNotEnrolled':
        //手机没有预先设置指纹
        //message = '指纹登入无法启动，您手机内还未设置指纹';
        message = 'ไม่สามารถเปิดใช้งานการเข้าสู่ระบบด้วยการสแกนลายนิ้วมือได้ และยังไม่มีการตั้งค่าการสแกนลายนิ้วมือในโทรศัพท์ของคุณ';
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
        //message = '此手机不支持指纹识别';
        message = 'ไม่สามารถเปิดใช้งานการสแกนลายนิ้วมือได้ โทรศัพท์ไม่ได้เปิดการตั้งค่าหรือไม่รองรับการเข้าใช้งานผ่านการสแกนลายนิ้วมือ';
        break;
      case 'DeviceLocked':
        //认证不成功，锁定30秒
        //message = '指纹已禁用，请30秒后重试';
        message = 'การสแกนลายนิ้วมือถูกปิดใช้งาน กรุณาลองอีกครั้งใน 30 วินาที';
        setTimeout(() => {
          Actions.pop()
        }, 2000);
        break;

      default:
        //message = '未知原因导致无法使用指纹功能'
        message = 'ไม่สามารถใช้งานการสแกนลายนิ้วมือได้โดยไม่ทราบสาเหตุ'
        break;
    }
    this.setState({ errorMessage: '' })
    setTimeout(() => {
      this.setState({ errorMessage: message })
    }, 1000);
  }


  render() {

    return (
      <View>
        <Modal
          animationType="none"
          transparent={true}
          visible={this.state.active}
          onRequestClose={() => { }}
        >
          <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: width, height: height, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <View style={{ width: width * .8, backgroundColor: '#EFEFEF', borderRadius: 12, paddingVertical: 15 }}>
              {
                // <Text style={{ color: '#000', fontSize: 21, fontWeight: 'bold', lineHeight: 40, }}>Lưu ý</Text>
              }
              {
                // <Text style={{ color: '#000', fontSize: 16 }}>แจ้งเตือน</Text>
              }
              {
                // <Text style={{ color: '#000', fontSize: 16 }}>สามารถเข้าสู่ระบบด้วยลายนิ้วมือ</Text>
              }
              <View style={{ alignItems: 'center', marginBottom: 10, marginTop: 15 }}>
                <Image
                  resizeMode="stretch"
                  source={require("../../images/login/GroupRed.png")}
                  style={{ width: 70, height: 70, marginBottom: 20 }}
                />
              </View>
              <Text style={{ color: '#000', fontSize: 16, textAlign: 'center' }}>{'คุณมีการยืนยันลายนิ้วมือแล้ว' || this.state.errorMessage || ''}</Text>
              <Text style={{ color: '#000', fontSize: 14, textAlign: 'center' }}>สามารถเข้าสู่ระบบด้วยลายนิ้วมือ</Text>
              <Touch
                onPress={() => { this.setState({ active: false }) }}
                style={{
                  backgroundColor: '#EFEFEF',
                  alignItems: 'center',
                  marginTop: 20,
                  borderTopWidth: 1,
                  borderTopColor: 'gray',
                  justifyContent: 'center',
                  paddingTop: 15
                }}>
                <Text style={{ color: '#007AFF', fontSize: 20 }}>ยกเลิก</Text>
              </Touch>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
