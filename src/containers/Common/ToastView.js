import React from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    ActivityIndicator,
    Dimensions,
    Modal,
    Animated,
    Easing
} from "react-native";
import Orientation from 'react-native-orientation-locker';
const { width, height } = Dimensions.get("window")
let ToasViewInstance = null;

class ToastView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            size: 'default',//大小
            types: '',//success，fail，
            title: '',
            msg: '',
            time: 2,//2 * 1000
            isLandscape: false,
        };

        ToasViewInstance = this;
        this.dismissHandler = null;
        this.callBackandler = null;
    }


    componentDidMount() {
        Orientation.addOrientationListener(this._onOrientationDidChange);
    }
    componentWillUnmount() {
        Orientation.removeOrientationListener(this._onOrientationDidChange);
        this.dismissHandler && clearTimeout(this.dismissHandler)
        this.callBackandler && clearTimeout(this.callBackandler)
    }
    _onOrientationDidChange = (orientation) => {
        if (orientation == 'PORTRAIT') {
            //竖屏
            this.setState({isLandscape: false})
        } else {
            //横屏
            this.setState({isLandscape: true})
        }
    }


    static setContentLarge(types = '', title = '', msg = '', time = 3, callBack = function () { }) {
        ToasViewInstance.clearView(() => {
            ToasViewInstance.setView(types, title, msg, time)
        })

        this.callBackandler = setTimeout(() => {
            callBack()
            this.callBackandler && clearTimeout(this.callBackandler)
        }, time * 1000);
    }

    static clearContent() {
        ToasViewInstance.clearView()
    }

    setView = (types, title, msg, time, size) => {
        this.setState({ modalVisible: true, types, title, msg, time, size }, () => { this.timingDismiss() });
    }

    // 恢复默认
    clearView = (callBack = function () { }) => {
        this.dismissHandler && clearTimeout(this.dismissHandler)
        this.setState({
            modalVisible: false,
            types: '',
            title: '',
            msg: '',
            time: 2,
        }, () => { callBack() })
    }

    //倒计时隐藏
    timingDismiss = () => {
        this.dismissHandler = setTimeout(() => {
            this.clearView()
        }, this.state.time * 1000)
    };


    render() {
        const {
            modalVisible,
            types,
            title,
            msg,
            isLandscape,
        } = this.state;

        const { width, height } = Dimensions.get("window")
        return modalVisible && (
            <Modal
                animationType={types == 'loading'? 'none': 'fade'}//用fade时间太短导致第二个Modal无法显示
                transparent={true}
                visible={true}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={[styles.centeredViewLarge, {width, height,}]}>
                    {
                        types != 'loading' &&
                        <View style={styles.modalViewLarge}>
                            <Image
                                resizeMethod={'resize'}
                                source={types == 'success' ? require("../../images/icon/success.png") : types == 'warning' ? require("../../images/icon/warning.png") : require("../../images/icon/fail.png")}
                                style={{ width: 38, height: 38 }}
                            />
                            {title != '' && <Text style={styles.modalTextTitle}>{title}</Text>}
                            {msg != '' && <Text style={[styles.modalTextMsg, { fontSize: title == '' ? 14 : 12 }]}>{msg}</Text>}
                        </View>
                    }
                    {
                        types == 'loading' &&
                        <View style={styles.modalViewLoding}>
                            <LodingAnimated />
                            {msg != '' && <Text style={styles.modalTextLoding}>{msg}</Text>}
                        </View>
                    }
                    {
                        isLandscape && <Text style={{color: 'rgba(0, 0, 0, .4)'}}>001</Text>
                    }
                </View>
            </Modal>
        )
    }
}

export default ToastView;

export class LodingAnimated extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.spinValue = new Animated.Value(0)
    }
    componentDidMount() {
        this.spin();
    }

    spin = () => {
        this.spinValue.setValue(0)
        Animated.timing(this.spinValue, {
            toValue: 1,// 最终值 为1，这里表示最大旋转 360度
            duration: 1500,
            useNativeDriver: true,
            easing: Easing.linear
        }).start(() => this.spin())
    }
    render() {

        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        })
        return (
            <>
                <Animated.Image
                    style={{ transform: [{ rotate: spin }], height: 38, width: 38 }}
                    source={require("../../images/icon/loding.png")}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({

    centeredViewLarge: {
        width: width,
        height: height,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .4)',
        paddingBottom: 50,
    },
    modalViewLarge: {
        width: width * 0.5,
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 15,
        paddingTop: 30,
        paddingBottom: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTextTitle: {
        color: '#2e4d2e',
        fontSize: 16,
        lineHeight: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalTextMsg: {
        color: '#7a837c',
        lineHeight: 25,
        textAlign: 'center',
    },


    modalViewLoding: {
        width: width * 0.4,
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingTop: 40,
        paddingBottom: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTextLoding: {
        color: '#7a837c',
        fontSize: 16,
        paddingTop: 15,
        textAlign: 'center',
    },


});