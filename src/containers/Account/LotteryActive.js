import React from 'react'
import { StyleSheet, View, Dimensions, Image, Platform } from 'react-native'
import { connect } from 'react-redux'
import { getBalanceInforAction } from '../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window')
import FastImage from "react-native-fast-image";
class LotteryActiveContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadD: false,
            loadone: 1,
        }
    }


    render() {
        const { loadone, loadD } = this.state
        const { miniGames } = this.props
        // const patchPostMessageFunction = function () {
        //     var originalPostMessage = window.postMessage;

        //     var patchedPostMessage = function (message, targetOrigin, transfer) {
        //         originalPostMessage(message, targetOrigin, transfer);
        //     };

        //     patchedPostMessage.toString = function () {
        //         return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
        //     };

        //     window.postMessage = patchedPostMessage;
        // };

        // const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

        const patchPostMessageFunction = function () {
            var NativeAppFun = {
                Deposit: (action) => {
                    var us = navigator.userAgent;
                    var isAndroid = us.indexOf('Android') > -1 || us.indexOf('Adr') > -1;
                    if (isAndroid) {
                        window.postMessage(action)
                    } else {
                        window.ReactNativeWebView.postMessage(action)
                    }

                }
            }
            // window.NativeApps = NativeAppFun
            window.postMessage = NativeAppFun.Deposit
        };
        const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';
        return <View style={styles.viewContainer}>
            <WebView
                        onLoadStart={(e) => this.setState({ loadD: false })}
                        onLoadEnd={(e) => this.setState({ loadD: true, loadone: 2 })}
                        source={{ uri: miniGames }}
                        mixedContentMode='always'
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={false}
                        allowsInlineMediaPlayback
                        mediaPlaybackRequiresUserAction
                        allowFileAccess
                        style={{ width, height }}
                        injectedJavaScript={patchPostMessageJsCode}
                        onMessage={event => {
                            if (event.nativeEvent && event.nativeEvent.data) {
                                let action = event.nativeEvent.data
                                if (!action) return
                                if (ApiPort.UserLogin && ['ShowDeposit', 'DepositStack'].includes(action)) {
                                    Actions.DepositStack()
                                }
                                if (!ApiPort.UserLogin && action == 'ShowLogin') {
                                    Actions.login({
                                        miniGames: miniGames
                                    })
                                }
                            }
                        }}
                    />

            {
                !loadD && loadone === 1 && <View style={styles.modalContainer}>
                    <Image
                        resizeMode='stretch'
                        style={{ width: .4 * width, height: .4 * width }}
                        source={require('./../../images/common/game_load.gif')}
                    />
                </View>
            }
        </View>
    }
}

export default LotteryActive = connect(
    (state) => {
        return {
            balanceInforData: state.balanceInforData,
        }
    }, (dispatch) => {
        return {
            getBalanceInforAction: () => dispatch(getBalanceInforAction())
        }
    }
)(LotteryActiveContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#000'
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
    },
})