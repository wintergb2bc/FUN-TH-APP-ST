import React from 'react'
import { View, Text, Dimensions, StyleSheet, Modal, TouchableOpacity, ImageBackground } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { toThousands } from '../../actions/Reg'
import { connect } from 'react-redux'
import { getFreeBetInforAction } from './../../actions/ReducerAction'

const { width, height } = Dimensions.get('window')
const HomeFreeBackgroundImg = {
    homeFreeImg1: {
        img: require('./../../images/freeBet/homeFreeImg1.png'),
        height: width * 1.3,
        paddingTop: width * .74
    },
    homeFreeImg2: {
        img: require('./../../images/freeBet/homeFreeImg2.png'),
        height: width * 1.3,
        paddingTop: width * .85
    }
}
class HomeFreeBetModalContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            homeFreeItem: {
                text: '',
                btnText: ''
            },
            eligible: this.props.eligible === true,
        }
    }

    componentDidMount() {
        if (this.state.eligible) {
            this.props.getFreeBetInforAction()
        }
        this.getFreeBet(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getFreeBet(nextProps)
    }

    getFreeBet(props) {
        if (this.state.eligible && props && props.freeBetData) {
            const data = props.freeBetData
            this.setState({
                homeFreeItem: {
                    text: 'Nhận thưởng cược',
                    btnText: `NHẬN ${toThousands(data.bonusAmount)} NGAY`,
                }
            })
        }
    }

    goPageName(flag) {
        this.props.changeFreeModalStatus(false)
        if (flag) {
            Actions.FreeBetPage({
                fillType: 'name'
            })
        } else {
            Actions.FreeBetPage({
                fillType: 'game'
            })
        }
        window.PiwikMenberCode(true ? 'Register_Journey_DepositNow' : 'Register_Journey_Getfreebet')
    }

    getMemberContact(memberInfor) {
        let contacts = memberInfor.Contacts || memberInfor.contacts
        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phoneStatus = tempPhone ? (tempPhone.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
        return phoneStatus ? 'phone' : 'bank'
    }

    render() {
        const { eligible, homeFreeItem } = this.state
        const homeFreeImg = eligible ? HomeFreeBackgroundImg.homeFreeImg1 : HomeFreeBackgroundImg.homeFreeImg2
        return <Modal
            animationType='fade'
            transparent={true}
            visible={true}>
            <View style={styles.viewModalContainer}>
                <ImageBackground
                    source={homeFreeImg.img}
                    resizeMode='stretch'
                    style={[styles.homeFreeImg, { height: homeFreeImg.height, paddingTop: homeFreeImg.paddingTop }]}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.changeFreeModalStatus(false)
                        }}
                        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        style={styles.modalCloseBtn}>
                        <Text style={styles.modalCloseBtnText}>X</Text>
                    </TouchableOpacity>

                    <ImageBackground
                        source={require('./../../images/freeBet/homeFreeListBg.png')}
                        resizeMode='stretch'
                        style={styles.promationBox}
                    >
                        <View style={styles.promationTextWrap}>
                            <Text style={styles.promationText}>Gửi Tiền Liền Tay, Nhận Ngay Thưởng Đăng Ký Tại Thể Thao Lên Đến 3.8 Triệu Đồng!</Text>
                        </View>
                        <View style={styles.promationBtnWrap}>
                            <TouchableOpacity style={styles.promationBtn} onPress={this.goPageName.bind(this, true)}>
                                <Text style={styles.promationBtnText}>GỬI TIỀN NGAY</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>

                    {
                        eligible && <ImageBackground
                            source={require('./../../images/freeBet/homeFreeListBg.png')}
                            resizeMode='stretch'
                            style={styles.promationBox}
                        >
                            <View style={styles.promationTextWrap}>
                                <Text style={styles.promationText}>{homeFreeItem.text}</Text>
                            </View>
                            <View style={styles.promationBtnWrap}>
                                <TouchableOpacity style={styles.promationBtn} onPress={this.goPageName.bind(this, false)}>
                                    <Text style={styles.promationBtnText}>{homeFreeItem.btnText}</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    }
                </ImageBackground>

                <TouchableOpacity
                    onPress={() => {
                        this.props.changeFreeModalStatus(false)
                        window.PiwikMenberCode('Register_Journey_Homepage')
                    }}
                    style={styles.closeBtn}>
                    <Text style={styles.closeBtnTitle}>Trở Về Trang Chủ</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    }
}

export default HomeFreeBetModal = connect(
    (state) => {
        return {
            freeBetData: state.freeBetData,
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
            getFreeBetInforAction: () => dispatch(getFreeBetInforAction()),
        }
    }
)(HomeFreeBetModalContainer)

const styles = StyleSheet.create({
    viewModalContainer: {
        width,
        height,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
        alignItems: 'center',
    },
    modalCloseBtn: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 100,
        position: 'absolute',
        right: 10,
        top: -30
    },
    modalCloseBtnText: {
        color: '#fff',
        fontSize: 20
    },
    homeFreeImg: {
        width,
    },
    promationBox: {
        marginHorizontal: 25,
        width: width - 50,
        height: (width - 50) * .26,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    promationTextWrap: {
        width: (width - 50) * .5,
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    promationBtnWrap: {
        width: (width - 50) * .5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 10
    },
    promationText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    promationBtn: {
        width: (width - 50) * .5 - 40,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        shadowColor: '#00000084',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
        paddingHorizontal: 5
    },
    promationBtnText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12
    },
    closeBtn: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        width,
    },
    closeBtnTitle: {
        color: '#25AAE1',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
})