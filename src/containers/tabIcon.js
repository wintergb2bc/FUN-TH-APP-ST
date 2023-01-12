import React, { Component } from 'react'
import { View, Image, Text, StyleSheet, Dimensions, Platform } from 'react-native'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import DeviceInfo from 'react-native-device-info'
import { IphoneXMax } from './Common/CommonData'
import FastImage from "react-native-fast-image";
const AnimatableView = Animatable.View
const { width } = Dimensions.get('window')
const getModel = DeviceInfo.getModel()
const IsNotIphoneX = Platform.OS === 'ios' && IphoneXMax.includes(getModel)
import LinearGradient from 'react-native-linear-gradient'
class TabIconContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newsStatistics: false
        }
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({
                newsStatistics: nextProps.newsStatisticsData.totalNew
            })
        }
    }

    handleViewRef = ref => this.view = ref



    createSprIcon(navigationKey) {
        let sprStatus = window.sprStatus
        return navigationKey == 'spr' ? (
            sprStatus.isComingSoon ? <View style={styles.sprBox}>
                <Text style={styles.sprBoxText}>เร็วๆนี้</Text>
            </View>
                :
                (
                    sprStatus.isNew && <View style={styles.sprBox}>
                        <Text style={styles.sprBoxText}>NEW</Text>
                    </View>
                )
        )
            :
            null
    }

    render() {
        let selected = this.props.focused
        let data = {
            home: {
                title: `หน้าหลัก`,
                icon: require('./../images/tabberIcon/homeActive.png')
            },
            promotionLogin: {
                title: `โปรโมชั่น`,
                icon: require('./../images/tabberIcon/promotionLoginActive.png')
            },
            Finance: {
                title: `ธนาคาร`,
                icon: require('./../images/tabberIcon/depositActive.png')
            },
            news: {
                title: `แจ้งเตือน​`,
                icon: require('./../images/tabberIcon/noticeActive.png')
            },
            PersonalAccount: {
                title: !ApiPort.UserLogin ? `ประวัติของฉัน​` : `ประวัติของฉัน​`,
                icon: require('./../images/tabberIcon/managerActive.png')
            },
            spr: {
                title: `Aviator`,
                icon: require('./../images/tabberIcon/spr2.png')
            }
        }
        let navigationKey = this.props.navigation.state.key
        let param = data[navigationKey]
        let isCenterTabbar = false
        const tabBarStyle = [
            styles.tabbarContainer,
            {
                zIndex: navigationKey == 'spr' ? 9999 : -1,
                borderColor: isCenterTabbar ? (window.isBlue ? (selected ? '#25AAE1' : '#F0F0F0') : selected ? '#00AEEF' : '#000') : (window.isBlue ? (selected ? 'transparent' : 'transparent') : selected ? 'transparent' : 'transparent'),
                borderTopColor: isCenterTabbar ? (window.isBlue ? (selected ? '#25AAE1' : '#F0F0F0') : (selected ? '#00AEEF' : '#000')) : (window.isBlue ? (selected ? '#00AEEF' : 'transparent') : (selected ? '#00AEEF' : 'transparent')),
                backgroundColor: isCenterTabbar ?
                    (window.isBlue ? (selected ? '#25AAE1' : '#FFF') : (selected ? '#00AEEF' : '#000')) :
                    (window.isBlue ? (selected ? 'transparent' : 'transparent') : (selected ? 'transparent' : 'transparent')),

            }
        ]
        const tabBarTextStyle = [
            styles.tabbarItem,
            {
                color: '#fff',
                fontSize: navigationKey == 'PersonalAccount' ? 10 : 12
            }
        ]
        return selected
            ?
            <LinearGradient
                colors={['#237ca2', '#5aaad1']}
                start={{ y: 0, x: 0 }}
                end={{ y: 1, x: 0 }}
                style={tabBarStyle}
            >
                {
                    navigationKey === 'news' && this.state.newsStatistics > 0 && ApiPort.UserLogin && <FastImage
                        source={require('./../images/tabberIcon/Notificationgif.gif')}
                        style={styles.newsCircle}
                        resizeMode='stretch' />
                }
                {
                    navigationKey == 'spr' && this.createSprIcon(navigationKey)
                }
                <Image resizeMode='stretch' style={[styles.tabIconImg, styles[`tabIconImg${navigationKey}`]]} source={param.icon} />
                <Text transition={['color']} style={tabBarTextStyle}>{param.title}</Text>

            </LinearGradient>
            :
            <View
                style={tabBarStyle}>
                {
                    navigationKey === 'news' && this.state.newsStatistics > 0 && ApiPort.UserLogin && <FastImage
                        source={require('./../images/tabberIcon/Notificationgif.gif')}
                        style={styles.newsCircle}
                        resizeMode='stretch' />
                }
                {
                    navigationKey == 'spr' && this.createSprIcon(navigationKey)
                }
                <Image resizeMode='stretch' style={[styles.tabIconImg, styles[`tabIconImg${navigationKey}`]]} source={param.icon} />
                <Text transition={['color']} style={tabBarTextStyle}>{param.title}</Text>
            </View>
    }
}

export default TabIcon = connect(
    (state) => {
        return {
            newsStatisticsData: state.newsStatisticsData
        }
    }, (dispatch) => {
        return {}
    }
)(TabIconContainer)

const styles = StyleSheet.create({
    tabbarContainer: {
        flex: 1,
        width: width / 6,
        alignItems: 'center',
        justifyContent: 'center',
        //borderTopWidth: 2,
        // paddingTop: 8,
        position: 'relative',
    },
    newsCircle: {
        width: 18,
        height: 18,
        position: 'absolute',
        top: 4,
        right: 16,
        zIndex: 100
    },
    tabIconImg: {
        width: 24,
        height: 24,
        marginTop: 4,
        marginBottom: 4,
    },
    tabIconImgPersonalAccount: {
        width: 24,
    },
    tabIconImgnews: {
        width: 20,
    },
    tabbarItem: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center'
    },
    sprBox: {
        backgroundColor: '#FF0000',
        borderRadius: 100000,
        paddingHorizontal: 5,
        height: 14,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: -5,
        zIndex: 100
    },
    sprBoxText: {
        fontSize: 8,
        color: '#fff'
    }
})