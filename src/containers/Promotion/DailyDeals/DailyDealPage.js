import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, Platform, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import LoadIngWebViewGif from './../../Common/LoadIngWebViewGif'
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window')
export default class DailyDealPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dailyDeals: this.props.dailyDeals,
            loadD: true,
            bonusProductList: []
        }
    }

    componentDidMount() {

    }

    componentWillMount() {
        Toast.hide()
    }

    checkDailyDealAddress(v) {
        let bonusID = v.id
        bonusID && window.PiwikMenberCode(bonusID + '_apply_dailydeal')

        if (!ApiPort.UserLogin) {
            this.changePromotionsModalStatus(true)
            return
        }
        Actions.DailyDealShipping({
            dailyDeals: v,
            getDailyDealsPromotion: () => {
                this.props.getDailyDealsPromotion()
            }
        })
    }


    postDailyDealAddress(dailyDeals) {
        let bonusID = dailyDeals.id
        bonusID && window.PiwikMenberCode(bonusID + '_apply_dailydeal')

        if (!ApiPort.UserLogin) {
            this.changePromotionsModalStatus(true)
            return
        }

        if (dailyDeals.bonusRuleGroupID && dailyDeals.bonusRuleGroupID.dailyDeals != 0) {
            this.getDailyDealsBonusRuleInfo()
            return
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostApplyDailyDeals + 'contentId=' + dailyDeals.id + '&bonusAmount=' + dailyDeals.bonusAmount + '&bonusItem=' + dailyDeals.bonusItem + '&', 'POST').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success(res.message, 2, () => {
                })
                Actions.pop()
                this.props.getDailyDealsPromotion()
            } else {
                Toast.fail(res.message, 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    getDailyDealsBonusRuleInfo() {
        let bonusRuleGroupID = this.state.dailyDeals.bonusRuleGroupID
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetDailyDealsBonusRuleInfo + `bonusGroupId=${bonusRuleGroupID}&`, 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                let bonusProductList = res.result
                if (Array.isArray(bonusProductList) && bonusProductList.length) {
                    Actions.DailyDealsApplication({
                        bonusProductList,
                        dailyDeals: this.props.dailyDeals,
                        getDailyDealsPromotion: () => {
                            this.props.getDailyDealsPromotion()
                        },
                        changeTab: (i) => {
                            this.props.changeTab(i)
                        },
                        changeRewardIndex: (i) => {
                            this.props.changeRewardIndex(i)
                        }
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })
        window.PiwikMenberCode('Promo Nav', 'Click', 'Claim_DailyDeals')
    }

    createDailyDealsStatus(v) {
        let { bonusType, bonusItem, status, quantity } = v
        const bonusTypeUpperCase = bonusType.toLocaleUpperCase().replace(/\s/g, '')
        const bonusItemUpperCase = bonusItem.toLocaleUpperCase().replace(/\s/g, '')
        const statusUpperCase = status.toLocaleUpperCase().replace(/\s/g, '')
        if (bonusTypeUpperCase === 'MANUALITEMS') {
            if (['TICKET', 'ELECTRONICITEMS', 'FUN88MERCHANDISE', 'SPORTSITEM', 'EXCLUSIVEITEM', 'PROMOTIONITEM', 'FREESPIN'].find(v => v === bonusItemUpperCase)) {
                if (statusUpperCase === 'AVAILABLE') {
                    if ('FREESPIN' === bonusItemUpperCase) {
                        return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.postDailyDealAddress.bind(this, v)}>
                            <Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
                        </TouchableOpacity>
                    } else {
                        return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.checkDailyDealAddress.bind(this, v)}>
                            <Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
                        </TouchableOpacity>
                    }
                } else if (statusUpperCase === 'SOLDOUT' && quantity * 1 === 0) {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>หมด</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'GRABBED') {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>รับ</Text>
                    </TouchableOpacity>
                } else {
                    return null
                }
            } else {
                return null
            }
        } else if (bonusTypeUpperCase === 'MONEY') {
            if (bonusItemUpperCase === 'MONEY') {
                if (statusUpperCase === 'AVAILABLE') {
                    return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.postDailyDealAddress.bind(this, v)}>
                        <Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'SOLDOUT' && quantity * 1 === 0) {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>หมด</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'GRABBED') {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>รับ</Text>
                    </TouchableOpacity>
                } else {
                    return null
                }
            } else {
                return null
            }
        } else if (bonusTypeUpperCase === 'REWARDSPOINT') {
            if (bonusItemUpperCase === 'REWARDSPOINT') {
                if (statusUpperCase === 'AVAILABLE') {
                    return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.postDailyDealAddress.bind(this, v)}>
                        <Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'SOLDOUT' && quantity * 1 === 0) {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>หมด</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'GRABBED') {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>รับ</Text>
                    </TouchableOpacity>
                } else {
                    return null
                }
            } else {
                return null
            }
        } else if (bonusTypeUpperCase === 'FREESPIN') {
            if (bonusItemUpperCase === 'FREESPIN') {
                if (statusUpperCase === 'AVAILABLE') {
                    return <TouchableOpacity style={[styles.closeBtnWrap]} onPress={this.postDailyDealAddress.bind(this, v)}>
                        <Text style={styles.closeBtnText}>ขอรับตอนนี้</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'SOLDOUT' && quantity * 1 === 1) {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>หมด</Text>
                    </TouchableOpacity>
                } else if (statusUpperCase === 'GRABBED') {
                    return <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.closeBtnText, { color: '#AFAFAF' }]}>รับ</Text>
                    </TouchableOpacity>
                } else {
                    return null
                }
            } else {
                return null
            }
        } else {
            return null
        }
    }


    changePromotionsModalStatus() {

    }

    render() {
        const { loadD, dailyDeals } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#000', paddingBottom: this.createDailyDealsStatus(dailyDeals) == null ? 0 : 50 }]}>

            <WebView
                originWhitelist={['*']}
                onLoadStart={(e) => this.setState({ loadD: true })}
                onLoadEnd={(e) => this.setState({ loadD: false })}
                source={{ uri: dailyDeals.modalHtml }}
                scalesPageToFit={Platform.OS === 'ios' ? false : true}
                style={{ width: width, height: height }}
                injectedJavaScript={`var ele = document.getElementById('modal-promo')
if (ele) {
    ele.style.WebkitOverflowScrolling = 'touch'
}`}
            />

            <LoadIngWebViewGif loadStatus={loadD} />

            {
                this.createDailyDealsStatus(dailyDeals)
            }
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#fff'
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 40,
        height: 40,
        backgroundColor: '#33C85D',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        width: width - 20,
        marginHorizontal: 10,
        borderRadius: 4
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    }
})