import React from 'react'
import { StyleSheet, View, Dimensions, Platform, TouchableOpacity, Text, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { changeDepositTypeAction, getBalanceInforAction } from './../../../../actions/ReducerAction'
import QRCode from 'react-native-qrcode-svg'

const { width, height } = Dimensions.get('window')

class THBQRPageContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loadD: true,
            loadone: 1,
            //payHtml: 'https://www.baidu.com/',
            isCreateResubmitOnlineDeposit: this.props.isCreateResubmitOnlineDeposit
        }
    }

    componentWillMount(props) {
        this.props.navigation.setParams({
            title: 'ฝากเงิน',
            rightButton: () => {
                return <View style={styles.gameButtonBox}>
                    <TouchableOpacity
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                        style={[styles.gameButtonBoxWrap]} onPress={() => {
                            Actions.pop()
                        }}>
                        <Text style={{ fontSize: 20, color: '#fff', fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity>

                    <View style={[styles.hiddenView,
                    {
                        backgroundColor: window.isBlue ? '#00aeef' : '#212121'
                    }]}></View>
                </View>
            },
            rightButtonImage: () => {
                return null
            }
        })
    }

    componentWillUnmount() {
        this.props.getBalanceInforAction()

        Actions.FinanceAfter({
            isEuro: this.props.isEuro,
            financeType: 'deposit',
            paymentMethod: this.props.paymentMethod,
            money: this.props.money,
            transactionId: this.props.transactionId
        })
    }


    render() {
        const { payHtml, loadD, loadone } = this.state
        return <View style={styles.viewContainer}>
            <View style={styles.depositPage}>
                {
                    //     <QRCode
                    //     value={payHtml}
                    //     size={(width - 40) * .35}
                    //     bgColor='#000'
                    //     fgColor='white'
                    // ></QRCode>
                }
                <Image
                    style={{
                        width: (width - 40) * .3,
                        height: (width - 40) * .3
                    }}
                    resizeMode='stretch'
                    source={require('./../../../../images/finance/deposit/THBQRIcon/qr.png')}></Image>
                <Text style={styles.depositTetxt}>QR ฝากเงินของท่านจะถูกเปิดอีกหน้าต่างหนึ่ง กรุณาตรวจสอบให้แน่ใจว่ามีการสแกน และทำการฝากมาแล้ว</Text>
                <View>
                    <TouchableOpacity style={[styles.btnWrap]} onPress={() => {
                        Actions.pop()
                    }}>
                        <Text style={[styles.btnWrapText, styles.btnWrapText1]}>ส่งอีกครั้ง</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        Actions.pop()
                        Actions.Records()
                    }} style={[styles.btnWrap, styles.btnWrap1]}>
                        <Text style={[styles.btnWrapText, styles.btnWrapText2]}>ฝากเรียบร้อยแล้ว</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }
}

export default THBQRPage = connect(
    (state) => {
        return {}
    }, (dispatch) => {
        return {
            getBalanceInforAction: () => dispatch(getBalanceInforAction()),
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data))
        }
    }
)(THBQRPageContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#F4F4F5',

    },
    depositPage: {
        paddingHorizontal: 10,
        paddingTop: 40,
        backgroundColor: '#fff',
        paddingBottom: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnWrap: {
        width: width - 20,
        height: 40,
        borderWidth: 1,
        borderColor: '#00AEEF',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15
    },
    btnWrapText: {
        color: '#00AEEF'
    },
    depositTetxt: {
        textAlign: 'center',
        paddingHorizontal: 40,
        marginBottom: 20,
        marginTop: 20
    },
    btnWrap1: {
        backgroundColor: '#00AEEF'
    },
    btnWrapText2: {
        color: '#fff'
    },
    btnWrapText1: {

    },
    gameButtonBox: {
        flexDirection: 'row',
        width: 80,
        height: 40,
        position: 'absolute',
        left: -width,
        zIndex: 1000,
        bottom: 0,
        backgroundColor: '#00AEEF',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 15
    },
    gameButtonBoxWrap: {
        position: 'absolute',
        left: -100
    }

})