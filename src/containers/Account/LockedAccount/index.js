import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, TouchableOpacity, Platform, Image } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

const { width } = Dimensions.get('window')

export default class LockedAccount extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() { }

    componentWillUnmount() {
        ApiPort.UserLogin = false
    }

    render() {
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={[styles.nameBox, { backgroundColor: window.isBlue ? '#25AAE1' : '#212121' }]}>
                    <View alignItems='center'>
                        <Image resizeMode='stretch' source={require('./../../../images/common/verificationIcon/fillName.png')} style={[styles.homeIdentification]}></Image>
                    </View>
                    <View>
                        <Text style={[styles.homeTextWrap, { fontWeight: 'bold', fontSize: 16, marginBottom: 10 }]}>Tài khoản của bạn đang bị tạm khóa.</Text>
                        <Text style={[styles.homeTextWrap]}>Vui lòng liên hệ Chăm sóc Khách hàng hoặc hoàn thành Xác thực Tài khoản bằng cách trả lời câu hỏi bảo mật để mở khóa.</Text>
                    </View>
                    <View style={[styles.nameCircleBox, { backgroundColor: window.isBlue ? '#00AEEF' : '#212121' }]}></View>
                </View>
            </ScrollView>

            <View style={styles.resetBtnBox}>
                {
                    this.props.attempts > 0 && <TouchableOpacity
                        style={styles.inputBtn}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        onPress={() => {
                            Actions.LockedAccountVerification({
                                userNameDB: this.props.userNameDB,
                                attempts: this.props.attempts
                            })
                        }}>
                        <Text style={styles.serchBtnText}>Xác Thực</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.backConatiner} onPress={() => { Actions.LiveChat() }}>
                    <Text style={styles.backConatinerText}>Chat Trực Tuyến</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    nameBox: {
        backgroundColor: '#25AAE1',
        // paddingTop: 10,
        position: 'relative',
        paddingHorizontal: 20
    },
    homeIdentification: {
        textAlign: 'center',
        marginBottom: 15,
        marginTop: 15,
        height: 55,
        width: 80,
    },
    homeTextWrap: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12
    },
    nameCircleBox: {
        position: 'absolute',
        backgroundColor: '#25AAE1',
        bottom: width * .9,
        borderRadius: 300,
        transform: [{ scale: 3 }],
        width: width,
        height: width,
        zIndex: -4
    },
    resetBtnBox: {
        position: 'absolute',
        bottom: 30,
        width,
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    inputBtn: {
        height: 45,
        borderWidth: 1,
        borderColor: '#25AAE1',
        backgroundColor: 'transparent',
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        width: width - 20
    },
    serchBtnText: {
        color: '#25AAE1',
        fontWeight: 'bold'
    },
    backConatiner: {
        flexDirection: 'row',
        width: width - 20,
        alignItems: 'center',
        height: 45,
        justifyContent: 'center',
        backgroundColor: '#1CBD64'
    },
    backConatinerText: {
        color: '#fff',
        fontWeight: 'bold'
    },
})