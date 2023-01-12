import React, { Component } from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'
import * as Animatable from 'react-native-animatable'
import { connect } from 'react-redux'
const AnimatableImage = Animatable.Image
const AnimatableView = Animatable.View
const { width, height } = Dimensions.get('window')
import { changeHomeRegistLoginModalAction } from '../../actions/ReducerAction'

const LogoutModalData = {
    home: {
        title: 'โปรโมชั่นฟรีมากมาย',
        Text: `โปรโมชั่นหลากหลายให้เลือกสรร\nพร้อมของรางวัลมากมายสำหรับคุณ`,
        img: require('./../../images/home/homeModalCarousel/logoutHomeModal.png'),
        piwikMenberText1: 'Login_bank_guestview',
        piwikMenberText2: 'Register_bank_guestview'
    },
    profile: {
        title: 'การเดิมพันครบรูปแบบที่สุด',
        Text: `มีให้คุณเลือกสนุกได้หลากหลายทั้งกีฬา คาสิโนสด เกม อีสปอร์ต และหวย`,
        img: require('./../../images/home/homeModalCarousel/logoutHomeModal1.png'),
        piwikMenberText1: 'Login_promo_guestview',
        piwikMenberText2: 'Register_promo_guestview'
    },
    fiance: {
        title: 'การฝาก-ถอนรวดเร็ว',
        Text: `สะดวกสบายด้วยขั้นตอนที่ง่าย และรับรองความปลอดภัยของบัญชี`,
        img: require('./../../images/home/homeModalCarousel/logoutHomeModal2.png'),
        piwikMenberText1: 'Login_promo_guestview',
        piwikMenberText2: 'Register_promo_guestview'
    },
    game: {
        title: 'เว็บไซต์ที่ได้รับความไว้วางใจ',
        Text: `ผู้สนับสนุนทีมนิวคาสเซิล และสเปอร์ส และมีชื่อเสียงเปิดให้บริการมากกว่า 12 ปี`,
        img: require('./../../images/home/homeModalCarousel/logoutHomeModal3.png'),
        piwikMenberText1: 'Login_promo_guestview',
        piwikMenberText2: 'Register_promo_guestview'
    }
}

class HomeModalLoginRegisterContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }


    pageToLogin(type, piwikMenberText) {
        this.props.changeHomeRegistLoginModalAction({
            flag: false,
            page: 'home'
        })
        Actions.pop()
        if (type == 'login') {
            Actions.login({
            })
        } else {
            Actions.Register({
            })
        }
        piwikMenberText && window.PiwikMenberCode(piwikMenberText)
    }

    render() {
        let { flag, page } = this.props.homeRegistLoginModalData
        return <Modal animationType='fade' transparent={true} visible={flag && !ApiPort.UserLogin}>
            <View style={styles.homeModalContainer}>
                <AnimatableView
                    style={styles.homeModalBox}
                    animation={'fadeInDown'}
                    easing='ease-out'
                    iterationCount='1'>
                    <AnimatableImage
                        style={styles.homeModalBanner}
                        resizeMode='stretch'
                        source={LogoutModalData[page].img}
                        animation={'pulse'}
                        easing='ease-out'
                        iterationCount='infinite'
                    ></AnimatableImage>
                    <View style={styles.homeModalWrap}>
                        <Text style={styles.homeModalText}>{LogoutModalData[page].title}</Text>
                        <Text style={{ color: '#58585A', textAlign: 'center', fontSize: 12, paddingHorizontal: 45 }}>{LogoutModalData[page].Text}</Text>
                        <View style={styles.homeModalBtnWrap}>
                            <TouchableOpacity style={[styles.homeModalBtn, styles.homeModalBtn0]}
                                onPress={this.pageToLogin.bind(this, 'login', LogoutModalData[page].piwikMenberText1)}
                            >
                                <Text style={[styles.homeModalBtnText, {
                                    color: '#4FB9ED'
                                }]}>เข้าสู่ระบบ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.homeModalBtn, styles.homeModalBtn1]} onPress={this.pageToLogin.bind(this, 'register', LogoutModalData[page].piwikMenberText2)}>
                                <Text style={styles.homeModalBtnText}>สมัครสมาชิก</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                this.props.changeHomeRegistLoginModalAction({
                                    flag: false,
                                    page: 'home'
                                })
                            }}
                            style={{ paddingBottom: 15 }}>
                            <Text style={{ color: '#4FB9ED', textDecorationLine: 'underline' }}>ทดลองใช้งาน</Text>
                        </TouchableOpacity>
                    </View>
                </AnimatableView>
            </View>
        </Modal>
    }
}

export default HomeModalLoginRegister = connect(
    (state) => {
        return {
            homeRegistLoginModalData: state.homeRegistLoginModalData,
        }
    }, (dispatch) => {
        return {
            changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
        }
    }
)(HomeModalLoginRegisterContainer)



const styles = StyleSheet.create({
    homeModalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    homeModalBox: {
        borderRadius: 8,
        width: width * .9,
        overflow: 'hidden'
    },
    homeModalBanner: {
        width: width * .9,
        height: width * .405
    },
    homeModalWrap: {
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 15,
        paddingBottom: 5,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    homeModalText: {
        color: '#4FB9ED',
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8
    },
    homeModalBtnWrap: {
        marginTop: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (width * .9 - 30)
    },
    homeModalBtn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: (width * .9 - 30) * .46,
        borderRadius: 4,
        borderWidth: 1
    },
    homeModalBtn0: {
        backgroundColor: '#fff',
        borderColor: '#4FB9ED'
    },
    homeModalBtn1: {
        backgroundColor: '#59BA6D',
        borderColor: '#59BA6D'
    },
    homeModalBtnText: {
        color: '#fff'
    }
})