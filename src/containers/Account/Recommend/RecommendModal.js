import React, { Component } from 'react'
import { View, Text, Dimensions, Image, TouchableOpacity, StyleSheet, Modal, TouchableHighlight } from 'react-native'
import { Actions } from 'react-native-router-flux'
const { width, height } = Dimensions.get('window')
import { RecommendHomeModalInfor } from './RecommendData'

export default class RecommendModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referreeTaskStatus: {
                isContactVerified: false,
                isDeposited: false,
            },
            firstName: '',
            emailStatus: false,
            phoneStatus: false,
        }
    }

    componentDidMount() {
        const { memberInforData } = this.props
        this.getUserInfor(memberInforData)
        this.getQueleaReferreeTaskStatus()
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.getUserInfor(nextProps.memberInforData)
        }
    }


    getUserInfor(memberInforData) {
        if (!memberInforData.MemberCode) return
        const phoneData = memberInforData.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phoneStatus = phoneData ? !(phoneData.Status.toLocaleLowerCase() === 'unverified') : false

        const emailData = memberInforData.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let emailStatus = emailData ? !(emailData.Status.toLocaleLowerCase() === 'unverified') : false
        this.setState({
            firstName: memberInforData.FirstName,
            emailStatus,
            phoneStatus,
        })
    }

    getQueleaReferreeTaskStatus(flag) {
        fetchRequest(ApiPort.GetQueleaReferreeTaskStatus, 'GET').then(res => {
            this.setState({
                referreeTaskStatus: res,
            })
        }).catch(err => {
        })
    }

    goActionPage() {
        const { referreeTaskStatus, firstName, emailStatus, phoneStatus } = this.state
        this.props.changeDisplayReferee(false)
        if (!firstName) {
            Actions.Verification({
                fillType: 'name',
                fromPage: 'HomeRecommendModal',
                changeDisplayReferee: (flag) => {
                    this.props.changeDisplayReferee(flag)
                },
                ServiceAction: 'Quelea'
            })
            window.PiwikMenberCode('Referred_verifynamenow')
            return
        }
        if (!referreeTaskStatus.isContactVerified) {
            window.PiwikMenberCode('Referred_verifyotpnow')
            if (!emailStatus) {
                Actions.Verification({
                    fillType: 'email',
                    fromPage: 'HomeRecommendModal',
                    changeDisplayReferee: (flag) => {
                        this.props.changeDisplayReferee(flag)
                    },
                    ServiceAction: 'Quelea'
                })
                return
            }

            if (!phoneStatus) {
                Actions.Verification({
                    fillType: 'phone',
                    fromPage: 'HomeRecommendModal',
                    changeDisplayReferee: (flag) => {
                        this.props.changeDisplayReferee(flag)
                    },
                    ServiceAction: 'Quelea'
                })
                return
            }
        }
    }

    render() {
        const { firstName } = this.state
        const { referreeTaskStatus } = this.state
        return <Modal animationType='fade' transparent={true} visible={true}>
            <View style={styles.viewContainer}>
                <View style={styles.viewWrap}>
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => {
                            this.props.changeDisplayReferee(false)
                        }}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Text style={styles.closeBtnText}>X</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalHeadText}>รับโบนัส 100 บาทง่ายๆ</Text>

                    <View>
                        <View style={[styles.recommendList, { backgroundColor: '#25AAE1' }]}>
                            <Text style={[styles.recommendListLeftText, { color: '#fff' }]}>ขั้นตอนที่ 1</Text>
                            <View style={styles.recommendListRight}>
                                <View style={[styles.homeModalIconBox]}>
                                    <Image
                                        resizeMode='stretch'
                                        source={require('./../../../images/account/recommend/recommendModalIconActive1.png')}
                                        style={[styles.homeModalIcon, styles.homeModalIcon0]}
                                    ></Image>
                                </View>
                                <Text style={[styles.recommendListRightText, { color: '#fff' }]}>ลงทะเบียน</Text>
                            </View>
                        </View>
                        <View style={styles.recommendModalIconArrowBox}>
                            <Image
                                resizeMode='stretch'
                                source={true ? require('./../../../images/account/recommend/recommendModalIconArrow.png') : require('./../../../images/account/recommend/recommendModalIconActiveArrow.png')}
                                style={styles.recommendModalIconArrow}
                            ></Image>
                        </View>
                        <View style={[styles.recommendList, { backgroundColor: firstName.length > 0 ? '#25AAE1' : '#fff' }]}>
                            <Text style={[styles.recommendListLeftText, { color: firstName.length > 0 ? '#fff' : '#25AAE1' }]}>ขั้นตอนที่ 2</Text>
                            <View style={styles.recommendListRight}>
                                <View style={[styles.homeModalIconBox]}>
                                    <Image
                                        resizeMode='stretch'
                                        source={firstName.length > 0 ? require('./../../../images/account/recommend/recommendModalIconActive2.png') : require('./../../../images/account/recommend/recommendModalIcon2.png')}
                                        style={[styles.homeModalIcon, styles.homeModalIcon1]}
                                    ></Image>
                                </View>
                                <Text style={[styles.recommendListRightText, { color: firstName.length > 0 ? '#fff' : '#25AAE1' }]}>ยืนยันชื่อนามสกุลจริง</Text>
                            </View>
                        </View>
                        <View style={styles.recommendModalIconArrowBox}>
                            <Image
                                resizeMode='stretch'
                                source={firstName.length > 0 ? require('./../../../images/account/recommend/recommendModalIconArrow.png') : require('./../../../images/account/recommend/recommendModalIconActiveArrow.png')}
                                style={styles.recommendModalIconArrow}
                            ></Image>
                        </View>
                        <View style={[styles.recommendList, { backgroundColor: referreeTaskStatus.isContactVerified ? '#25AAE1' : '#fff' }]}>
                            <Text style={[styles.recommendListLeftText, { color: referreeTaskStatus.isContactVerified ? '#fff' : '#25AAE1' }]}>ขั้นตอนที่ 3</Text>
                            <View style={styles.recommendListRight}>
                                <View style={[styles.homeModalIconBox]}>
                                    <Image
                                        resizeMode='stretch'
                                        source={referreeTaskStatus.isContactVerified ? require('./../../../images/account/recommend/recommendModalIconActive3.png') : require('./../../../images/account/recommend/recommendModalIcon3.png')}
                                        style={[styles.homeModalIcon, styles.homeModalIcon2]}
                                    ></Image>
                                </View>
                                <Text style={[styles.recommendListRightText, { color: referreeTaskStatus.isContactVerified ? '#fff' : '#25AAE1' }]}>ยืนยันเบอร์โทรศัพท์และอีเมล </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.recommendBtn} onPress={this.goActionPage.bind(this)}>
                        <Text style={styles.recommendBtnText}>สมัครสมาชิก</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewWrap: {
        backgroundColor: '#fff',
        borderRadius: 8,
        width: width * .92,
        overflow: 'hidden',
        paddingHorizontal: 10,
        paddingTop: 25,
        paddingBottom: 40
    },
    modalHeadText: {
        color: '#25AAE1',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 25,
        marginBottom: 20
    },
    closeBtn: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 1000,
        borderColor: '#101010',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 100000
    },
    closeBtnText: {
        color: '#101010',
        fontSize: 16
    },
    recommendList: {
        flexDirection: 'row',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#25AAE1',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8
    },
    recommendListLeftText: {
        fontWeight: 'bold'
    },
    recommendListRight: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8
    },
    recommendModalIconArrowBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 30
    },
    recommendModalIconArrow: {
        width: 40 * .6,
        height: 24 * .6,
    },
    homeModalIconBox: {
        marginRight: 8,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeModalIcon: {

    },
    homeModalIcon0: {
        width: 20,
        height: 22
    },
    homeModalIcon1: {
        width: 25,
        height: 20
    },
    homeModalIcon2: {
        width: 18,
        height: 22
    },
    recommendBtn: {
        paddingVertical: 12,
        backgroundColor: '#33C85D',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginTop: 15
    },
    recommendBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})