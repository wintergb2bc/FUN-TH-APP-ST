import React from 'react'
import { StyleSheet, Text, Image, View, ScrollView, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { getPromotionListInforAction } from './../../actions/ReducerAction'
import { Actions } from 'react-native-router-flux'
import * as Animatable from 'react-native-animatable'

const AnimatableImage = Animatable.Image
const AnimatableView = Animatable.View
const { width, height } = Dimensions.get('window')

class RestrictedContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            viewRandom: Math.random()
        }
    }



    componentWillUnmount() {
        window.isShowRestrictedPage = false
        this.props.getPromotionListInforAction()
    }

    refreshPage() {
        Actions.pop()
        this.setState({
            viewRandom: Math.random()
        })
    }

    render() {
        const { } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#FFF' : '#000' }]} key={this.state.viewRandom}>
            <AnimatableImage
                source={require('./../../images/restricted/restrictedBg.jpg')}
                resizeMode='stretch'
                style={styles.viewImgContainer}
                animation={'bounceInDown'}
                easing='ease-out'
                iterationCount='1'
            ></AnimatableImage>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 50 }}
            >
                <View style={styles.restrictedBox}>
                    <View style={styles.restrictedImgBox}>
                        <AnimatableImage
                            animation={'fadeInLeftBig'}
                            easing='ease-out'
                            resizeMode='stretch'
                            iterationCount='1'
                            source={require('../../images/login/logo.png')}
                            style={styles.logoImg}
                        />
                        <AnimatableImage
                            style={styles.restrictedImg}
                            source={require('./../../images/restricted/restrictedImg.png')}
                            resizeMode='stretch'
                            animation={'pulse'}
                            easing='ease-out'
                            iterationCount='infinite'
                        ></AnimatableImage>
                    </View>

                    <AnimatableView
                        animation={'fadeInRight'}
                        easing='ease-out'
                        resizeMode='stretch'
                        iterationCount='1'
                    >
                        <Text style={styles.restrictedTextTop}>การเข้าสู่ระบบถูกจำกัด</Text>

                        <Text style={[styles.restrictedText, { marginBottom: 20 }]}>เข้าใช้งานเว็บไซต์จากตำแหน่ง พื้นที่ หรือประเทศที่ไม่ได้รับอนุญาต ขออภัยในความไม่สะดวก หากมีข้อสอบถามเพิ่มเติม กรุณาติดต่อ เจ้าหน้าที่ฝ่ายบริการลูกค้า</Text>

                        <TouchableOpacity style={styles.restrictedBtn} onPress={this.refreshPage.bind(this)}>
                            <Text style={styles.restrictedBtnText}>รีเฟรชแอปพลิเคชั่น</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.restrictedBtn} onPress={() => {
                            Actions.LiveChat({
                                liveUrl: true
                            })
                        }}>
                            <Text style={styles.restrictedBtnText}>ติดต่อฝ่ายบริการ 24/7</Text>
                        </TouchableOpacity>
                    </AnimatableView>
                </View>
            </ScrollView>
        </View>
    }
}

export default Restricted = connect(
    (state) => {
        return {}
    }, (dispatch) => {
        return {
            getPromotionListInforAction: () => dispatch(getPromotionListInforAction())
        }
    }
)(RestrictedContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    viewImgContainer: {
        width,
        height,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0
    },
    restrictedBox: {
        paddingHorizontal: 10,
    },
    restrictedImgBox: {
        alignItems: 'center'
    },
    restrictedImg: {
        width: .78 * width,
        height: .78 * width,
        marginBottom: 10,
        marginTop: 15
    },
    restrictedTextTop: {
        color: '#27aee1',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    restrictedText: {
        color: '#000',
    },
    restrictedBtn: {
        width: width - 20,
        height: 40,
        borderWidth: 1,
        borderColor: '#27aee1',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    restrictedBtnText: {
        color: '#27aee1'
    },
    logoImg: {
        width: 0.5 * width,
        height: 0.115 * width
    }
})