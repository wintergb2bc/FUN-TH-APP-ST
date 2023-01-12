import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, TouchableOpacity, Platform, Image } from 'react-native'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')
const LockedStatusData = [
    {
        img: require('./../../../images/account/lockedAccount/lockedFail.png'),
        title: 'Tài khoản của bạn đang bị tạm khóa.',
        infor: 'Mọi thắc mắc vui lòng liên hệ Chăm sóc Khách hàng.',
        pageTitle: 'Lỗi',
        btnText: 'Chat Trực Tuyến'
    },
    {
        img: require('./../../../images/account/lockedAccount/lockedSuccess.png'),
        title: 'Tài khoản của bạn đã được kích hoạt lại thành công.',
        infor: 'Nhấn OK để tiếp tục.',
        pageTitle: 'ยืนยันสำเร็จ',
        btnText: 'OK'
    }
]

export default class LockedAccountVerificationStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: this.props.status
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: LockedStatusData[this.state.status].pageTitle
        })
    }

    render() {
        const { status } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <Image source={LockedStatusData[status].img} resizeMode='stretch' style={styles.lockedImg}></Image>
                <Text style={styles.lockedText1}>{LockedStatusData[status].title}</Text>
                {
                    !status && <Text style={styles.lockedText2}>Bạn chỉ có thể nhập thông tin tối đa (<Text style={{ color: '#00AEEF' }}>{this.props.attempts}</Text>) lần.</Text>
                }
                <Text style={styles.lockedText2}>{LockedStatusData[status].infor}</Text>
            </ScrollView>
            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#33C85D' : '#25AAE1' }]} onPress={() => {
                status ? Actions.login({
                    types: 'login'
                })
                    :
                    Actions.LiveChat()
            }}>
                <Text style={styles.closeBtnText}>{LockedStatusData[status].btnText}</Text>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    scrollViewContainer: {
        alignItems: 'center',
        paddingTop: .1 * height
    },
    lockedImg: {
        width: .45 * width,
        height: .482 * width,
        marginBottom: 20
    },
    lockedText1: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    lockedText2: {
        textAlign: 'center'
    }
})