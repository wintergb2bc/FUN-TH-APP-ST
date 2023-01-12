import Toasts from 'react-native-tiny-toast'
import { StyleSheet, Dimensions, Platform, Vibration } from 'react-native'
const { width, height } = Dimensions.get('window')
import { IphoneXMax } from './Common/CommonData'
import DeviceInfo from 'react-native-device-info'
const getModel = DeviceInfo.getModel()
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'


let styleIOS = {
    minHeight: 88,
    paddingTop: 45,
}
let styleAndroid = {
    minHeight: 64,
    paddingTop: 26,
}

let style = isIphoneMax ? styleIOS : styleAndroid

let commonStyle = {
    width,
    marginTop: -1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderRadius: 0,
    paddingBottom: 15
}


export default Toast = {
    success: (msg, time, fun) => {
        Toasts.hide()
        Toasts.hide()
        Toasts.hide()
        Toasts.hide()
        // Vibration.vibrate()
        Toasts.show(msg || '', {
            position: 1,
            containerStyle: { backgroundColor: '#1DBD65', ...commonStyle, ...style },
            textStyle: { color: '#ffffff', paddingLeft: 0, fontSize: 14, flexWrap: 'wrap', width: width - 20 },
            duration: 1500
        })
        if (time != '' && fun) {
            if (typeof fun == 'function') {
                fun()
            }
        }
    },
    fail: (msg, time, fun) => {
        Toasts.hide()
        Toasts.hide()
        Toasts.hide()
        Toasts.hide()
        //Vibration.vibrate()
        Toasts.show(msg || '', {
            position: 1,
            containerStyle: { backgroundColor: '#6B6B6D', ...commonStyle, ...style },
            textStyle: { color: '#ffffff', paddingLeft: 0, fontSize: 14, flexWrap: 'wrap', width: width - 20 },
            duration: 1500
        })

        if (time != '' && fun) {
            if (typeof fun == 'function') {
                fun()
            }
        }
    },

    loading: (msg, time = 3500, fun) => {
        Toasts.showLoading(msg || '', {
            duration: time
        })

        if (time != '' && fun) {
            if (typeof fun == 'function') {
                fun()
            }
        }
    },

    hide: (msg, time, fun) => {
        Toasts.hide(msg || '', {})
        Toasts.hide()
        Toasts.hide()
        Toasts.hide()
        Toasts.hide()
        if (fun) {
            if (typeof fun == 'function') {
                fun()
            }
        }
    },
}