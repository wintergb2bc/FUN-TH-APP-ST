import React from 'react'
import { StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text
export default class HomeFirstRegistPop extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkBox: false
        }
    }

    closeModalPop(flag, piwikMenberText) {
        fetchRequest(ApiPort.PostWelcomeCall + `isWelcomeCall=${this.state.checkBox}&`, 'POST').then(res => {
            this.props.changeHomeModalLoginRegisterStatus(false)

            this.props.goFinancePage({})
        }).catch(err => {
            this.props.changeHomeModalLoginRegisterStatus(false)
        })
        piwikMenberText && window.PiwikMenberCode(piwikMenberText)
    }

    

    render() {
        const { checkBox } = this.state
        return <Modal animationType='fade' visible={true} transparent={true}>
            <View style={[styles.modalContainer]}>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Image
                        resizeMode='stretch'
                        source={require('./../../images/home/homeFirstRegistPop/homeFirstRegistPop.webp')}
                        style={styles.homeFirstRegistPop}
                    ></Image>

                    <View style={{
                        alignItems: 'center', transform: [{
                            translateY: -width * .32
                        }]
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                checkBox: !checkBox
                            })
                        }}
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 24, height: 24, backgroundColor: '#fff', borderWidth: 2, borderColor: '#D1D1D1', marginRight: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <AnimatableText
                                    style={{ color: '#28963a', fontSize: 20, fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                                    animation={checkBox ? 'fadeIn' : 'fadeOut'}>✓</AnimatableText>
                            </View>
                            <Text style={{ color: '#FFD800', fontSize: 16 }}>ฉันต้องการและยินดีที่รับการติดต่อจากเจ้าหน้าที่</Text>
                        </TouchableOpacity>
                        <AnimatableText
                            animation={checkBox ? 'fadeIn' : 'fadeOut'}
                            style={{ textAlign: 'center', color: '#03FF2C', marginTop: 10 }}>กรุณาเปิดใช้งานโทรศัพท์ที่ลงทะเบียนไว้
                            เจ้าหน้าที่บริการลูกค้าของเราจะติดต่อคุณในไม่ช้า ขอบคุณค่ะ!</AnimatableText>

                        <TouchableOpacity style={styles.homeModalBtn} onPress={this.closeModalPop.bind(this, true, 'Depositnow_RegisterSuccess')}>
                            <Image
                                resizeMode='stretch'
                                source={require('./../../images/home/homeFirstRegistPop/homeFirstRegistPop_btn.png')}
                                style={styles.homeModalBtn}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    homeFirstRegistPop: {
        width: width * .95,
        height: 1.263 * .95 * width,
        marginBottom: 10
    },
    homeModalBtn: {
        width: width * .6,
        justifyContent: 'center',
        alignItems: 'center',
        height: width * .6 * .234,
        marginTop: 25
    },
    homeModalBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    homeModalCloseBtnText1: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 15
    },
    homeModalCloseBtn2: {
        backgroundColor: '#00AEEF',
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        position: 'absolute',
        top: -35,
        right: 0
    },
    homeModalCloseBtnText2: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20
    }
})