import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, TextInput, UIManager, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import { getDoubleNum } from './../../actions/Reg'
import ModalDropdown from 'react-native-modal-dropdown'
import SwitchToggle from 'react-native-switch-toggle'
import { getSelfExclusionsAction } from '../../actions/ReducerAction'
import { connect } from 'react-redux'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import * as Animatable from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'

const { width } = Dimensions.get('window')
const AnimatableView = Animatable.View
const LimitBettingDates = [
    // {
    //     title: 'Không giới hạn đăng nhập',
    //     betLimitDayRange: 0,
    //     setting: 'NotAvailable'
    // },
    {
        title: '7 วัน',
        betLimitDayRange: 7,
        setting: 'SevenDays'
    },
    {
        title: '90 วัน',
        betLimitDayRange: 90,
        setting: 'NinetyDays'
    },
    {
        title: 'ถาวร',
        betLimitDayRange: 99999,
        setting: 'Permanent'
    }
]
class LimitUserContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            money: '',
            checked: false,
            limitBettingDatesIndex: 99999,
            Status: false,
            arrowFlag: false
        }
    }

    componentDidMount() {
        this.getSelfExclusions(this.props.selfExclusionsData)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.selfExclusionsData) {
            this.getSelfExclusions(nextProps.selfExclusionsData)
        }
    }

    getSelfExclusions(selfExclusionsData) {
        if (!Object.keys(this.props.selfExclusionsData).length) return
        let limitBettingDatesIndex = LimitBettingDates.findIndex(v => v.betLimitDayRange * 1 === selfExclusionsData.SelfExcludeDuration * 1)
        this.setState({
            money: selfExclusionsData.BetLimit + '',
            limitBettingDatesIndex,
            Status: selfExclusionsData.Status,
            checked: !selfExclusionsData.Status,
        })
    }

    createBettingList(item, i) {
        let flag = this.state.limitBettingDatesIndex * 1 === i * 1
        return <TouchableOpacity style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.title}</Text>
        </TouchableOpacity>
    }

    changeBettingIndex(index) {
        this.setState({
            limitBettingDatesIndex: index
        })
    }

    SetSelfExclusions() {
        const { checked, money, limitBettingDatesIndex } = this.state
        if (limitBettingDatesIndex * 1 === 0) {
            if (!money) {
                Toast.fail('Vui lòng nhập số tiền giới hạn')
                return
            }
        }

        let limitBettingDatesList = LimitBettingDates[limitBettingDatesIndex]

        const MemberData = {
            'setting': limitBettingDatesList.setting,
            'isEnabled': checked,
            'limitAmount': money * 1,
            'betLimitDayRange': limitBettingDatesList.betLimitDayRange
        }
        Toast.loading('กำลังโหลดข้อมูล...', 20000)
        fetchRequest(ApiPort.PUTSelfExclusions, 'PUT', MemberData).then(res => {
            Toast.hide()
            if (res.isSuccess == true) {
                Toast.success('การอัปเดตสำเร็จ', 2)
                this.setState({
                    Status: true
                })
                Actions.pop()
                this.props.getSelfExclusionsAction()

            } else {
                Toast.fail('ติดตั้งไม่สำเร็จ')
            }
        }).catch(error => {
            Toast.hide()

        })
    }

    onSwitchChange(value) {
        this.setState({
            checked: value
        })
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    render() {
        const { arrowFlag, Status, checked, limitBettingDatesIndex, money } = this.state
        const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', color: window.isBlue ? '#3C3C3C' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
        const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F3F4F8' : '#000' }]}>
            {
                // !checked && <AnimatableView
                //     animation={'fadeIn'}
                //     easing='ease-out'
                //     iterationCount='1'
                //     style={[styles.viewOverly, { top: 100 }]}></AnimatableView>
            }
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >

                <View style={[styles.viewPaddingContainer, {}]}>
                    <View style={[styles.switchBox]}>
                        <Text style={[styles.switchBoxText, { color: window.isBlue ? '#5C5C5C' : '#fff' }]}>สถานะ :</Text>
                        <View style={styles.switchWrap}>
                            <SwitchToggle
                                ///backTextRight={checked ? '' : 'Tắt'}
                                textRightStyle={{ color: 'rgba(0, 0, 0, .57)', fontSize: 12 }}
                                rightContainerStyle={{
                                    position: 'absolute',
                                    right: 10,
                                }}

                                //  backTextLeft={checked ? 'Mở' : ''}
                                textLeftStyle={{ color: 'rgba(0, 0, 0, .57)', fontSize: 12 }}
                                leftContainerStyle={{
                                    position: 'absolute',
                                    left: 10,
                                }}

                                containerStyle={{
                                    width: 75,
                                    height: 30,
                                    borderRadius: 100,
                                    padding: 5,
                                    backgroundColor: '#CECECE'
                                }}
                                circleStyle={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 100,
                                    backgroundColor: '#fff'
                                }}
                                switchOn={Status ? Status : checked}
                                onPress={() => {
                                    if (Status) return
                                    this.setState({
                                        checked: !checked
                                    })
                                }}
                                circleColorOff='white'
                                circleColorOn='white'
                                backgroundColorOn='#00BF42'
                                backgroundColorOff='#CECECE'
                                duration={200}
                            />
                        </View>
                    </View>

                    <View>
                        <View style={[styles.limitLists, {
                            borderTopWidth: 2,
                            borderColor: '#e6e7e7',
                            borderBottomWidth: 2,
                            borderBottomColor: '#e6e7e7',
                            paddingVertical: 10,
                            justifyContent: 'space-between'
                        }]}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#5C5C5C' : '#fff' }]}>จำกัดวงเงินเดิมพัน :</Text>
                            <TextInput
                                maxLength={6}
                                // placeholder='Vui lòng nhập vào hạn mức chuyển tiền'
                                editable={checked}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[
                                    styles.limitListsInput,
                                    PasswordInput,
                                    {
                                        width: width - 140,
                                        backgroundColor: (checked ? '#FFFFFF' : '#F0F0F0')
                                    }]}
                                value={money}
                                keyboardType='decimal-pad'
                                onChangeText={value => {
                                    let money = getDoubleNum(value)
                                    this.setState({
                                        money
                                    })
                                }}
                                keyboardType='numeric' />
                        </View>

                        <View style={{}}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#5C5C5C' : '#fff' }]}>ตั้งค่าวงเดิมพัน :</Text>
                            {
                                //     <ModalDropdown
                                //     animated={true}
                                //     disabled={Status}
                                //     defaultValue={LimitBettingDates[0].title}
                                //     options={LimitBettingDates}
                                //     renderRow={this.createBettingList.bind(this)}
                                //     onSelect={this.changeBettingIndex.bind(this)}
                                //     style={[styles.limitModalDropdown, PasswordInput, {
                                //         backgroundColor: window.isBlue ? (Status ? '#EDEDED' : '#fff') : (Status ? '#5C5C5C' : '#000')
                                //     }]}
                                //     onDropdownWillShow={this.changeArrowStatus.bind(this, true)}
                                //     onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
                                //     dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: 146 }]}
                                // >
                                //     <View style={[styles.limitModalDropdownTextWrap]}>
                                //         <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{LimitBettingDates[limitBettingDatesIndex].title}</Text>
                                //         <ModalDropdownArrow arrowFlag={arrowFlag} />
                                //     </View>
                                // </ModalDropdown>
                            }
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#5C5C5C' : '#fff' }]}>กรุณาควบคุมการเดิมพันในบัญชีของฉัน</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 15 }}>
                            {
                                LimitBettingDates.map((v, i) => {
                                    let flag = i == limitBettingDatesIndex
                                    return <TouchableOpacity
                                        onPress={() => {
                                            checked && this.changeBettingIndex(i)
                                        }}
                                        key={i} style={{
                                            borderWidth: 1,
                                            width: 100,
                                            height: 36,
                                            borderRadius: 10000,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: !checked ? (flag ? 'gray' : '#E0E0E2') : (flag ? '#4DABE9' : '#F3F4F8'),
                                            borderColor: !checked ? (flag ? 'gray' : '#E0E0E2') : (flag ? '#4DABE9' : '#4DABE9')
                                        }}>
                                        <Text style={{
                                            color: flag ? '#fff' : '#5C5C5C'
                                        }}>{v.title}</Text>
                                    </TouchableOpacity>
                                })
                            }
                        </View>
                        <Text style={[styles.limitBottomText, { color: window.isBlue ? '#9B9B9B' : '#fff' }]}>หมายเหตุ : หากคุณมีความประสงค์จะควบคุมการเดิมพันของคุณโดยต้องการหลีกเลี่ยง การเดิมพันในระยะเวลา 7 วัน หรือ 90 วัน คุณสามารถติดต่อห้องแชทสดเพื่อขอรับ คำแนะนำและการช่วยเหลือ</Text>
                    </View>

                </View>
            </ScrollView>

            {
                checked && !Status && <AnimatableView
                    animation={'fadeInUp'}
                    easing='ease-out'
                    iterationCount='1'
                    duration={400}
                    style={[styles.closeBtnWrap]}>
                    <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={this.SetSelfExclusions.bind(this)}>
                        <Text style={styles.closeBtnText}>บันทึก</Text>
                    </TouchableOpacity>
                </AnimatableView>
            }
        </View>
    }
}

export default LimitUser = connect(
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
)(LimitUserContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    pageInforTextWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 40,
        justifyContent: 'center',
    },
    pageInforText: {
        fontSize: 16
    },
    viewPaddingContainer: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 25,
    },
    switchBox: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        marginBottom: 6,
    },
    switchWrap: {
        marginLeft: 10,

    },
    switch: {},
    limitLists: {
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',


    },
    limitListsText: {
        marginBottom: 5,
        fontSize: 12
    },
    limitListsInput: {
        borderWidth: 1,
        paddingLeft: 6,
        fontSize: 14,
        height: 36,
        width: width - 20,
        borderRadius: 4
    },
    limitModalDropdown: {
        width: width - 20,
        height: 40,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
    },
    limitDropdownStyle: {
        marginTop: 10,
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4
    },
    limitModalDropdownTextWrap: {
        paddingLeft: 6,
        paddingRight: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    limitModalDropdownList: {
        // height: 30,
        justifyContent: 'center',
        paddingLeft: 6,
        paddingRight: 6,
        flexWrap: 'wrap',
        paddingVertical: 6
    },
    limitModalDropdownListText: {
        color: '#000',
        fontSize: 13
    },
    limitModalDropdownText: {
        fontSize: 13,
    },
    limitBottomText: {
        fontSize: 13
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
    viewOverly: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, .25)',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 40
    }
})