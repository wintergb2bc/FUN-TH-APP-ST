import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Image, UIManager, Modal, DeviceEventEmitter } from 'react-native'
import Toast from '@/containers/Toast'
import { getDoubleNum } from './../../actions/Reg'
import SwitchToggle from 'react-native-switch-toggle'
import { getSelfExclusionsAction } from '../../actions/ReducerAction'
import { connect } from 'react-redux'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import * as Animatable from 'react-native-animatable'
import { ActionConst } from 'react-native-router-flux'
import { Actions } from 'react-native-router-flux'
const { width } = Dimensions.get('window')
const AnimatableView = Animatable.View
const availablePreferenceImg = {
    SPORTSBOOK: {
        img0: require('./../../images/account/FavoriteBet2.png'),
        img1: require('./../../images/account/FavoriteBet22.png'),
    },
    RNG: {
        img0: require('./../../images/account/FavoriteBet3.png'),
        img1: require('./../../images/account/FavoriteBet33.png'),
    },
    LIVEDEALER: {
        img0: require('./../../images/account/FavoriteBet44.png'),
        img1: require('./../../images/account/FavoriteBet4.png'),
    },
    KENO: {
        img0: require('./../../images/account/FavoriteBet1.png'),
        img1: require('./../../images/account/FavoriteBet11.png'),
    },


    // GENERAL: {
    //     img0: require('./../../images/account/FavoriteBet1.png'),
    //     img1: require('./../../images/account/FavoriteBet11.png'),
    // },
}
class FavoriteBetContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            availablePreferenceArr: [
                // {
                //     img0: require('./../../images/account/FavoriteBet1.png'),
                //     img1: require('./../../images/account/FavoriteBet1.png'),
                //     text: 'หวย'
                // },
                // {
                //     img0: require('./../../images/account/FavoriteBet2.png'),
                //     img1: require('./../../images/account/FavoriteBet2.png'),
                //     text: 'กีฬา'
                // },
                // {
                //     img0: require('./../../images/account/FavoriteBet3.png'),
                //     img1: require('./../../images/account/FavoriteBet3.png'),
                //     text: 'สล็อต'
                // },
                // {
                //     img0: require('./../../images/account/FavoriteBet4.png'),
                //     img1: require('./../../images/account/FavoriteBet4.png'),
                //     text: 'คาสิโน'
                // },
            ],
            availablePreferenceArrIndex: 0
        }
    }

    componentDidMount() {
        this.getGamePreference()
    }


    getGamePreference() {
        global.storage.load({
            key: 'availablePreference',
            id: 'availablePreference'
        }).then(res => {
            this.createGamePreference(res)
        }).catch(() => { })
        fetchRequest(ApiPort.GetGamePreference, 'GET').then(res => {
            Toast.hide()
            if (res) {
                this.createGamePreference(res)

                global.storage.save({
                    key: 'availablePreference',
                    id: 'availablePreference',
                    data: res,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }



    createGamePreference(res) {
        let availablePreference = res.availablePreference
        //.filter(v => v != 'ทั่วไป')
        let availablePreferenceArr = Object.keys(res.availablePreference).filter(v => v != 'ทั่วไป').map(v => {
            return {
                localizedName: v,
                id: availablePreference[v],
                img: availablePreferenceImg[availablePreference[v].toLocaleUpperCase()]
            }
        })
        let playerPreference = res.playerPreference
        let availablePreferenceArrIndex = availablePreferenceArr.findIndex(v => v.id.toLocaleUpperCase() === playerPreference.toLocaleUpperCase())

        this.setState({
            availablePreferenceArr,
            availablePreferenceArrIndex: availablePreferenceArrIndex
        })
    }

    postSetGamePreference() {
        const { availablePreferenceArr, availablePreferenceArrIndex } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        let gamePreference = availablePreferenceArr[availablePreferenceArrIndex].id
        let params = {
            gamePreference
        }
        fetchRequest(ApiPort.PostSetGamePreference, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                DeviceEventEmitter.emit('availablePreference', gamePreference.toLocaleUpperCase())
                Actions.pop()
                this.getGamePreference()
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    render() {
        const { availablePreferenceArrIndex, availablePreferenceArr } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingVertical: 10, backgroundColor: '#06ADEF', }}>
                    <Text style={{ textAlign: 'center', color: '#fff', fontSize: 13 }}>คุณสามารถตั้งค่าความชอบของคุณเพื่อดูเกมและรางวัลเพิ่มเติม</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    paddingHorizontal: 10,
                    paddingTop: 25,
                    justifyContent: 'space-between'
                }}>
                    {
                        availablePreferenceArr.map((v, i) => {
                            let flag = availablePreferenceArrIndex == i
                            let img = !flag ? v.img.img0 : v.img.img1
                            return <TouchableOpacity
                                style={{
                                    width: (width - 20) / 3.5,
                                    height: (width - 20) / 3.5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 10000,
                                    borderWidth: 1,
                                    borderColor: '#59BA6D',
                                    marginBottom: 15,
                                    backgroundColor: flag ? '#59BA6D' : '#FFFFFF',
                                    //  marginHorizontal: (i == 1 || i == 4) ? (width - 20 - ((width - 20) / 4) * 3) / 2 : 0
                                }}
                                onPress={() => {
                                    this.setState({
                                        availablePreferenceArrIndex: i
                                    })
                                }}
                                key={i}>
                                {
                                    img && <Image
                                        resizeMode='stretch'
                                        source={img} style={{
                                            width: 40,
                                            height: 40,

                                        }}></Image>
                                }

                                <Text style={{
                                    fontSize: 12,
                                    color: flag ? '#fff' : '#59BA6D'
                                }}>{v.localizedName}</Text>
                            </TouchableOpacity>
                        })
                    }
                </View>
            </ScrollView>

            {
                <AnimatableView
                    animation={'fadeInUp'}
                    easing='ease-out'
                    iterationCount='1'
                    duration={400}
                    style={[styles.closeBtnWrap]}>
                    <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={this.postSetGamePreference.bind(this)}>
                        <Text style={styles.closeBtnText}>บันทึก</Text>
                    </TouchableOpacity>
                </AnimatableView>
            }
        </View>
    }
}

export default FavoriteBet = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            selfExclusionsData: state.selfExclusionsData
        }
    }, (dispatch) => {
        return {
            getSelfExclusionsAction: () => dispatch(getSelfExclusionsAction()),
        }
    }
)(FavoriteBetContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 40,
        width: width - 20,
        marginHorizontal: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
})