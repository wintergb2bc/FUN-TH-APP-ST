import React, { Component } from 'react'
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    StatusBar,
    Linking,
    Modal
} from 'react-native'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import CodePush from 'react-native-code-push'
import AppReducer from './reducers/AppReducer'
import localStorage from "./actions/localStorage";
import Service from './actions/Service' //請求
import ServiceSB from './containers/SbSports/actions/Service' //請求
import Domain from './Domain' //域名
import Api from './actions/Api' //api
import storage from './actions/Storage'
import { timeout_fetch } from "./containers/SbSports/lib/SportRequest";
import HostConfig from "./containers/SbSports/lib/Host.config";
import Main from './containers/Main'
import HomeModalLoginRegister from './containers/Home/HomeModalLoginRegister'
import SplashScreen from 'react-native-splash-screen'
import HomeModalCarousel from './containers/Home/HomeModalCarousel'
import PiwikProSdk from "@piwikpro/react-native-piwik-pro-sdk";
const store = createStore(AppReducer, applyMiddleware(thunk))
import {
    ACTION_MaintainStatus_NoTokenBTI,
    ACTION_MaintainStatus_NoTokenIM,
    ACTION_MaintainStatus_NoTokenSABA,
} from './containers/SbSports/lib/redux/actions/MaintainStatusAction';
import EventData from "./containers/SbSports/lib/vendor/data/EventData";
import { Actions } from "react-native-router-flux";
import VendorIM from './containers/SbSports/lib/vendor/im/VendorIM';
import VendorSABA from './containers/SbSports/lib/vendor/saba/VendorSABA';
import VendorBTI from './containers/SbSports/lib/vendor/bti/VendorBTI';
// import Buffer from 'buffer';
// if (typeof this.Buffer === 'undefined') {
//     this.Buffer = Buffer.Buffer;
//   }
//codepush key線上
const IosLive = ''
const AndroidLive = ''

const { width, height } = Dimensions.get('window')

//字體不跟者 手機設置改變
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false })

class App extends Component {
    constructor() {
        super()
        this.state = {
            progress: '',
            restartAllowed: true,
            updataTexe: '',
            updataGo: false,
            codePushProgress: 'Cập nhật tiến độ: 0%',//更新進度
            // codePushProgress:'更新进度: 0%',//更新進度
            CodeKey: Platform.OS === 'android' ? CodePushKeyAndroid : CodePushKeyIOS,
            isMandatory: false, //是否強制更新
            percent: 0,
            CloseVersion: false,
            canUpdata: false,
            updataMsg: [],
            update: '',
            CheckUptate: false,
            homeHomeStatus: false
        }
        this.appInitUrl = null; //喚醒Url
        this.preGetAppInitUrlPromise = this.preGetAppInitUrl();
        this.getHomeModalStatusPromise = null; //因為下面用settimeout延遲執行，要加Promise去等完成，不然跳轉動作會被setState刷掉
    }

    //添加此代码
    delayed() {
        SplashScreen.hide()
    }

    componentWillMount() {
        // global.Toasts = Toasts;
        this.getHomeModalStatusPromise = new Promise(resolve => {
            setTimeout(async () => {
                this.delayed()
                await this.getHomeModalStatus();
                resolve(true);
            }, 1000) //啟動圖消失
        })
        this.getAppVersion()
        setInterval(() => {
            this.getAppVersion()
        }, 30000)

        const defaultCachePromise = new Promise(resolve => resolve(null));

        // window.initialCache = {};
        // ['IM', 'SABA', 'BTI'].map(s => {
        //     window.initialCache[s] = { isUsed: false, isUsedForHeader: false, cachePromise: defaultCachePromise };
        // })

        // //獲取初始緩存數據
        // window.getInitialCache = (VendorName) => {
        //     window.initialCache[VendorName].cachePromise = timeout_fetch(
        //         fetch(HostConfig.Config.CacheApi + '/cache/v4/' + VendorName.toLowerCase())
        //         , 3000 //最多查3秒，超過放棄
        //     )
        //         .then(response => response.json())
        //         .then(jsonData => {
        //             let newData = {};
        //             newData.trCount = jsonData.trCount;
        //             newData.count = jsonData.count;
        //             newData.list = jsonData.list.map(ev => EventData.clone(ev)); //需要轉換一下

        //             console.log('===get initialCache of', VendorName, newData);

        //             return newData;
        //         })
        //         .catch((e) => {
        //             console.log('===== cached ' + VendorName + ' data has exception', e);
        //             window.initialCache[VendorName].isUsed = true; //報錯 就標記為已使用
        //         })
        //     return window.initialCache[VendorName].cachePromise;
        // }

        //獲取首屏緩存服務器數據(IM)
        // window.getInitialCache('IM')
        //     .finally(() => {
        //         //等IM獲取到，才獲取其他Vendor
        //         ['SABA', 'BTI'].map(VendorName => {
        //             window.getInitialCache(VendorName);
        //         })
        //     })

        //全局綁定維護狀態切換函數
        global.maintainStatus_noTokenBTI = (isNoToken) => store.dispatch(ACTION_MaintainStatus_NoTokenBTI(isNoToken));
        global.maintainStatus_noTokenIM = (isNoToken) => store.dispatch(ACTION_MaintainStatus_NoTokenIM(isNoToken));
        global.maintainStatus_noTokenSABA = (isNoToken) => store.dispatch(ACTION_MaintainStatus_NoTokenSABA(isNoToken));
    }

    componentDidMount() {
        global.storage.load({
            key: 'homeHomeStatus',
            id: 'homeHomeStatus'
        }).then(data => {
            Actions.login()
        }).catch(() => {

        })

        this.piwikInit()
        //   timeout_fetch(
        // fetch(HostConfig.Config.CacheApi + '/ec2021leagues')
        // ,3000 //最多查3秒，超過放棄
        //  )
        // .then(response => response.json())
        // .then(jsonData => {
        //  window.EuroCup2021LeagueIds = jsonData.data;
        // })
        // .catch(() => null)

        setTimeout(() => {
            CodePush.allowRestart()//在加载完了，允许重启
        }, 1500)

        //app未開啟情況下，被scheme喚醒處理
        this.callAppInitialUrl();
        //APP已開啟情況下，在背景中被scheme喚醒(監聽)
        Linking.addEventListener('url', this.callAppEventHandler);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this.callAppEventHandler);
    }
    piwikInit() {
        //初始化piwik
        // if (window.SBTDomain && window.SBTDomain.length) {
        const piwikKey = window.common_url == 'https://gatewayfun88th.gamealiyun.com' ? 'f1c30a68-baf3-4ace-a8d1-5d051aab7def' : 'b9428397-fd04-49d1-90bc-87c749e74535'
        PiwikProSdk.init('https://analytics.ravelz.com', piwikKey)
        // }
    }
    //app已開啟，在背景被scheme喚醒 處理函數
    callAppEventHandler = (event) => {
        console.log('===callAppEventHandler', event);
        this.handleCallAppUrl(event.url, 'event');
    }

    //APP未開啟，scheme喚醒APP判斷
    callAppInitialUrl = async () => {
        await this.getHomeModalStatusPromise; //homeModal有延遲執行，等跑完才處理，不然跳轉動作會被setState刷掉
        console.log('===CallAppInitialUrl', this.appInitUrl);
        this.handleCallAppUrl(this.appInitUrl, 'init');
    }

    //喚醒app url公用處理函數
    handleCallAppUrl = (url, source) => {
        console.log(`=====[${source}]handleCallAppUrl 0`, url);

        if (url) {
            if (source === 'init') {
                //初始url只用一次，拿到就可以清理掉了，這個函數裡面的url參數是by value，不會被影響
                this.appInitUrl = null;
            }

            //fun88vn://sb20?deeplink=im&sid=2&eid=45678&lid=89012  sb2.0專用
            const urlData = url.split("//")[1];
            const urlArray = urlData.split('?');
            const linkType = urlArray[0];

            console.log(`=====[${source}]handleCallAppUrl 1`, url, urlData, linkType);

            //只先支持 sb2.0
            if (linkType === 'sb20') {
                const queryStrings = urlArray[1];

                let list = {};
                queryStrings &&
                    queryStrings.split("&").forEach((item, i) => {
                        list[item.split("=")[0]] = item.split("=")[1] || "";
                    });

                //處理代理號，存入storage
                if (list.aff && list.aff.length > 0) {
                    global.storage.save({
                        key: "affCodeSG", // 注意:请不要在key中使用_下划线符号!
                        id: "affCodeSG", // 注意:请不要在id中使用_下划线符号!
                        data: list.aff,
                        expires: null,
                    });
                }

                console.log(`=====[${source}]handleCallAppUrl 2`, url, urlData, linkType, list);
                if (list.token && list.rtoken) {
                    //token登入，不確定是否能用，目前沒使用，先註解，如果後續要啟用，需要再測試
                    // window.isMobileOpen = true;
                    // Actions.Login({openList: list});
                } else if (list.deeplink && list.sid && list.eid && list.lid) {
                    console.log(`=====[${source}]handleCallAppUrl 3`, url, urlData, linkType, list);
                    //檢查是否剛好開啟Modal，是的話先關閉，然後才開體育詳情頁
                    if (this.state.homeHomeStatus || this.state.homeHomeStatus2) {
                        this.setState({ homeHomeStatus: false, homeHomeStatus2: false }, () => {
                            window.openSB20Detail &&
                                window.openSB20Detail(list.deeplink, list.sid, list.eid, list.lid);
                        });
                    } else {
                        window.openSB20Detail &&
                            window.openSB20Detail(list.deeplink, list.sid, list.eid, list.lid);
                    }
                }
            }
        }
    }

    //獲取並存下喚醒Url => 用來判斷是否展示全屏倒數廣告頁
    preGetAppInitUrl = () => {
        return Linking.getInitialURL().then((url) => {
            console.log('===preGetAppInitUrl', url);
            this.appInitUrl = url;
            return url;
        }).catch(err => {
            console.log('===preGetAppInitUrl has error', err);
            return null;
        });
    }

    getHomeModalStatus = async () => {
        //先等拿到喚醒url，才能判斷要不要展示全屏倒數廣告頁
        await this.preGetAppInitUrlPromise;
        let showHomeModal = true; //默認展示
        if (this.appInitUrl && this.appInitUrl.indexOf('fun88vn://sb20') !== -1) {
            //如果有sb2.0 deep link 就不展示全屏倒數廣告頁，直接進賽事詳情頁
            showHomeModal = false;
        }
        console.log('===getHomeModalStatus:showHomeModal', showHomeModal);

        return new Promise(resolve => {
            global.storage.load({
                key: 'homeHomeStatus',
                id: 'homeHomeStatus'
            }).then(data => {
                this.runCodePush()
                this.setState({
                    homeHomeStatus: false
                }, () => {
                    resolve(true);
                })
            }).catch(() => {
                this.setState({
                    homeHomeStatus: showHomeModal
                }, () => {
                    resolve(true);
                })
            })
        })
    }

    runCodePush() {
        CodePush.disallowRestart()//禁止重启
        //this.syncImmediate() //开始检查更新
        CodePush.checkForUpdate(this.state.CodeKey).then((update) => {
            this.apk_package = update  // 更新状态等信息
            if (update) {
                this.state.isMandatory = update.isMandatory
                this.state.update = update
                if (update.isMandatory == true) {
                    this.syncImmediate()
                    return
                }
                this.syncImmediate()
                // 有可用的更新，这时进行一些控制更新提示弹出层的的操作
            } else {
                // 没有可用的更新
                this.setState({ CheckUptate: true })
            }
        })
    }

    closeHomeModal() {
        this.setState({
            homeHomeStatus: false
        })
        this.runCodePush()
        global.storage.save({
            key: 'homeHomeStatus',
            id: 'homeHomeStatus',
            data: true,
            expires: null
        })
    }

    getAppVersion() {   //關閉版本
        if (window.isSTcommon_url) return
        fetch('https://www.zdhrb60.com/CMSFiles/F1APP/F1M2THUpdate.json?v=' + Math.random(), { method: 'GET' }).then((response) => headerData = response.json()).then((responseData) => {       // 获取到的数据处理
            if (UpdateV != responseData.version) {
                if (Platform.OS === 'ios') {
                    if (responseData.ios == true) {
                        this.setState({
                            CloseVersion: true,
                        })
                    }
                }

                if (Platform.OS === 'android') {
                    if (responseData.android == true) {
                        this.setState({
                            CloseVersion: true,
                        })
                    }
                }
            }
        }).catch((error) => { // 错误处理

        })
    }

    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.setState({ syncMessage: 'Kiểm tra cập nhật' })
                break
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.setState({ syncMessage: 'Tải gói' })
                // this.setState({ syncMessage: '下载包' })
                break
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.setState({ syncMessage: 'Awaiting user action.' })
                break
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.setState({ syncMessage: 'Cài đặt bản cập nhật' })
                // this.setState({ syncMessage: '正在安装更新' })
                break
            case CodePush.SyncStatus.UP_TO_DATE:
                this.setState({ syncMessage: 'App up to date.', progress: false })
                break
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.setState({ syncMessage: 'Cập nhật bị hủy bởi người dùng', progress: false })
                // this.setState({ syncMessage: '更新被用户取消', progress: false })
                break
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.setState({ syncMessage: 'Update installed and will be applied on restart.', progress: false, updataGo: false })
                break
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.setState({ syncMessage: 'Một lỗi không xác định đã xảy ra dddeeeexxx', progress: false, updataGo: false })
                // this.setState({ syncMessage: '一个未知的错误发生dddeeeexxx', progress: false,updataGo:false })
                break
        }
    }

    codePushDownloadDidProgress(progress) {
        let percent = parseInt(progress.receivedBytes / progress.totalBytes * 100)
        this.setState({
            percent: percent,    // 为了显示进度百分比
        })

        if (this.state.isMandatory == false) {
            if (percent === 100) {
                setTimeout(() => {
                    this.onButtonClick2()
                }, 3000)
            }
        }
        this.setState({ progress })
    }

    toggleAllowRestart() {
        this.state.restartAllowed ? CodePush.disallowRestart() : CodePush.allowRestart()
        this.setState({ restartAllowed: !this.state.restartAllowed })
    }

    getUpdateMetadata() {
        CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING).then((metadata: LocalPackage) => {
            this.setState({ syncMessage: metadata ? JSON.stringify(metadata) : 'Running binary version', progress: false })
        }, (error: any) => {
            this.setState({ syncMessage: 'Error: ' + error, progress: false })
        })
    }

    /** Update is downloaded silently, and applied on restart (recommended) */
    sync() {
        CodePush.sync(
            {},
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        )
    }

    syncImmediate() {
        this.setState({
            canUpdata: false
        })

        if (this.state.isMandatory == true) {
            CodePush.sync(
                { installMode: CodePush.InstallMode.ON_NEXT_RESUME },
                this.codePushStatusDidChange.bind(this),
                this.codePushDownloadDidProgress.bind(this)
            )
        }

        if (this.state.isMandatory == false) {
            CodePush.sync(
                { installMode: CodePush.InstallMode.ON_NEXT_RESUME },
                this.codePushStatusDidChange.bind(this),
                this.codePushDownloadDidProgress.bind(this)
            )
        }
    }

    onButtonClick2(msg) {
        const { update } = this.state
        let msgt = update.description
        let msg2 = msgt.split(',').join('\n')
        this.setState({
            canUpdata: true,
            updataMsg: msg2.split('-').filter(Boolean),
        })
    }


    //手動檢測版本更新
    CheckUptate(loding) {
        if (!loding) {
            if (!this.state.CheckUptate) { return }
            this.setState({ CheckUptate: false })
        }
        // CodePush.disallowRestart()//禁止重启
        //this.syncImmediate() //开始检查更新
        //loding && Toast.loading('กำลังตรวจสอบ', 20)
        // Toast.loading('检测版本中,请稍候...',200)
        CodePush.checkForUpdate(this.state.CodeKey).then((update) => {
            //Toast.hide()
            if (update) {
                this.apk_package = update  // 更新状态等信息
                this.state.isMandatory = update.isMandatory
                this.state.update = update
                this.syncImmediate()
            } else {
                //Toast.success('Đã là phiên bản mới nhất', 2)
                // 没有可用的更新
                this.setState({ CheckUptate: true })
                loding && window.reloadPersonalAccountState && window.reloadPersonalAccountState(true)
            }
        }).catch(err => {
            //Toast.hide()
        })
    }


    // onButtonClickLogin(msg) {
    //     if (this.state.CloseVersion == true) {
    //         return
    //     }
    //     let msgt = msg.description
    //     let msg2 = msgt.split(',').join('\n')
    //     Modal.alert('Cập nhật nhắc nhở:', msg2, [
    //         { text: 'Cập nhật ngay', onPress: () => this.syncImmediateLogin() }
    //     ])
    // }


    syncImmediateLogin() {
        if (this.state.isMandatory == true) {
            CodePush.sync(
                { installMode: CodePush.InstallMode.IMMEDIATE },
                this.codePushStatusDidChange.bind(this),
                this.codePushDownloadDidProgressLogin.bind(this)
            )
            this.setState({
                updataGo: true
            })
        }

        if (this.state.isMandatory == false) {
            CodePush.sync(
                { installMode: CodePush.InstallMode.ON_NEXT_RESUME },
                this.codePushStatusDidChange.bind(this),
                this.codePushDownloadDidProgressLogin.bind(this)
            )
        }
    }

    codePushDownloadDidProgressLogin(progress) {
        let percent = parseInt(progress.receivedBytes / progress.totalBytes * 100)
        this.setState({
            percent: percent,    // 为了显示进度百分比
        })

        if (percent === 100) {
            CodePush.allowRestart()
            setTimeout(() => {
                CodePush.restartApp()
            }, 5000)
        }
        this.setState({ progress })
    }

    UpdataApp() {   //更新版本
        Linking.openURL('https://773fn.com')
    }

    render() {
        const { updataGo, canUpdata, updataMsg, percent, CloseVersion, homeHomeStatus } = this.state

        //SB2.0 deeplink 開啟特定賽事 (原為 window.openApp 已改名)
        // window.openSB20Detail = (vendor, sid, eid, lid) => {
        //     console.log('=====openSB20Detail', vendor, sid, eid, lid, window.currentRouteIndex);

        //     if (window.currentRouteIndex === undefined) {
        //         Actions.reset('lightbox', {}); //修復某些頁面不在lightbox下(例如：首頁點選進入單一優惠頁）跳出後不關閉app，打開分享鏈接，會沒辦法跳過去SB2.0詳情頁的問題 =>先跳到lightbox再轉過去
        //     }
        //     let dataList = { eid, sid, lid }
        //     if (vendor.toLowerCase() == 'im') {
        //         Actions.Betting_detail({ dataList, from: 'deeplink', Vendor: VendorIM })
        //     } else if (vendor.toLowerCase() == 'bti') {
        //         Actions.Betting_detail({ dataList, from: 'deeplink', Vendor: VendorBTI })
        //     } else if (vendor.toLowerCase() == 'saba') {
        //         Actions.Betting_detail({ dataList, from: 'deeplink', Vendor: VendorSABA })
        //     }

        // }

        window.CheckUptateGlobe = (CodePushLoading = true) => {
            this.CheckUptate(CodePushLoading)
        }

        let versionArr = window.FUN88Version.split('.')
        let updateNum = (versionArr[versionArr.length - 1] * 1 + 1) + ''
        versionArr.pop()
        versionArr.push(updateNum)
        let newVersion = versionArr.join('.')
        return <Provider store={store}>
            <View style={{ flex: 1, zIndex: 1 }}>
                <Text style={{ position: 'absolute', top: 40, zIndex: 10000, color: '#000', left: 40 }}>{window.FUN88Version}
                <Text style={{ color: 'red'}}>{
                    window.common_url == 'https://gatewayfun88th.gamealiyun.com' ? '   live Domian    ' : '     ST DOmain      '
                }</Text>

                {
                    (window.userNameDB && window.userNameDB.length > 0) && window.userNameDB
                }

                {
                    `   `
                }
                {
                   ( window.userPassword && window.userPassword.length > 0) && window.userPassword
                }
                </Text>
                
                <HomeModalLoginRegister />
                <Modal animationType='fade' visible={canUpdata} transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.popBoxUpdata}>
                            <View style={styles.popBoxUpdataInforBox}>
                                <Text style={styles.popBoxUpdataInfor}>อัปเดทเวอร์ชั่นแล้ว</Text>
                            </View>
                            <Image style={styles.fundownload} resizeMode='stretch' source={require('./images/app/updataapp.png')} />
                            <View style={styles.updateTextBox}>
                                <Text style={styles.updateText1}>ใช้งานง่าย สะดวกกว่าเดิม </Text>
                                {
                                    // updataMsg.length > 0 && updataMsg.map((v, i) => {
                                    //     return <Text key={i}>- {v}</Text>
                                    // })
                                }
                            </View>
                            <TouchableOpacity onPress={() => {

                                this.setState({
                                    canUpdata: false
                                }, () => { })
                                CodePush.restartApp()
                            }} style={styles.appUpdateBtn}>
                                <Text style={styles.appUpdateBtnText}>อัปเดททันที</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal animationType='fade' visible={CloseVersion} transparent={true}>
                    <View style={styles.modalContainer}>
                        <View style={styles.popBoxUpdata1}>
                            <View style={[styles.popBoxUpdataInforBox, { backgroundColor: '#25AAE1', paddingVertical: 15 }]}>
                                <Text style={[styles.popBoxUpdataInfor, { color: '#fff' }]}>อัปเดทเวอร์ชั่นแล้ว</Text>
                            </View>
                            <View style={[styles.updateTextBox1]}>
                                <Text style={styles.updateText3}>FUN88 อัปเดทเวอร์ชั่นใหม่ล่าสุดเป็น {newVersion}</Text>

                            </View>
                            <TouchableOpacity onPress={() => this.UpdataApp()} style={styles.appUpdateBtn}>
                                <Text style={styles.appUpdateBtnText}>อัปเดททันที</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* <GameLoadPage></GameLoadPage> */}
                {
                    !ApiPort.UserLogin && homeHomeStatus && <HomeModalCarousel closeHomeModal={this.closeHomeModal.bind(this)} />
                }

                <Main />

                <StatusBar barStyle='light-content' />
            </View>
        </Provider>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    popBoxUpdata: {
        width: width - 40,
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
        paddingVertical: 15
    },
    popBoxUpdataInforBox: {
        alignItems: 'center',
        paddingBottom: 15
    },
    popBoxUpdataInfor: {
        color: '#25AAE1',
        fontSize: 16,
        fontWeight: 'bold'
    },
    fundownload: {
        width: width - 40,
        height: (width - 40) * .708,
    },
    appUpdateBtn: {
        backgroundColor: '#00AEEF',
        width: width - 80,
        marginHorizontal: 20,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    appUpdateBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    updateTextBox: {
        paddingHorizontal: 10,
        marginVertical: 15
    },
    updateText1: {
        color: '#4A4A4A',
        fontWeight: '400',
        fontSize: 14
    },
    updateText2: {
        color: '#000',
    },
    popBoxUpdata1: {
        width: width - 40,
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
        paddingBottom: 10
    },
    updateTextBox1: {
        marginVertical: 10
    },
    updateText3: {
        color: '#000',
        textAlign: 'center',
        marginBottom: 10
    }
})

/**
 * Configured with a MANUAL check frequency for easy testing. For production apps, it is recommended to configure a
 * different check frequency, such as ON_APP_START, for a 'hands-off' approach where CodePush.sync() does not
 * need to be explicitly called. All options of CodePush.sync() are also available in this decorator.
 */
let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL }

App = CodePush(codePushOptions)(App)

export default App
