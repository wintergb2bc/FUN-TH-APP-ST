import React from 'react'
import { StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text
export default class SBGuiderModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkBox: false
        }
    }


    render() {
        const { checkBox } = this.state
        const { istype } = this.props
        return <View style={[styles.modalContainer]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}
                source={istype ? require('./../../images/finance/fianceIconGuide.png') : require('./../../images/finance/fianceIconGuide1.png')}
            />
            {
                <TouchableOpacity style={[styles.closeBtn, {

                }]} onPress={() => {
                    Actions.pop()
                }}></TouchableOpacity>
            }
        </View>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        backgroundColor: '#F4F4F5',
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
    },
    carouselImg: {
        width,
        height,
    },
    closeBtn: {
        height: 150,
        position: 'absolute',
        bottom: 20,
        width,
    },
})