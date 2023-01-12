import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Image } from 'react-native'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import { RealXingReg, RealMingReg, EmailReg } from './../../../actions/Reg'

const RegObj = {
    firstName: RealXingReg,
    lastName: RealMingReg,
    email: EmailReg
}
const { width } = Dimensions.get('window')

export default class LockedAccountVerification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dob: '',
            dobIsFocus: false,
            email: '',
            emailIsFocus: false,
            firstName: '',
            firstNameIsFocus: false,
            lastName: '',
            lastNameIsFocus: false,
            firstNameErr: true,
            lastNameErr: true,
            emailErr: true,
            btnStatus: false,
            attempts: this.props.attempts
        }
    }

    componentDidMount() { }

    submitMemberInfor() {
        const { dob, email, firstName, lastName, btnStatus } = this.state
        if (!btnStatus) return
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        let params = {
            userName: this.props.userNameDB,
            dob,
            email,
            firstName: firstName.trim(),
            lastName: lastName.trim()
        }
        fetchRequest(ApiPort.PostConfiscatedMemberVerification, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                let result = res.result
                this.setState({
                    email: '',
                    firstName: '',
                    lastName: '',
                    firstNameErr: true,
                    lastNameErr: true,
                    emailErr: true,
                    btnStatus: false,
                    dob: '',
                    dobIsFocus: false,
                    firstNameIsFocus: false,
                    lastNameIsFocus: false,
                    emailIsFocus: false
                })
                if (result.isValid) {
                    Toast.success(result.message, 2)
                    Actions.LockedAccountVerificationStatus({
                        status: 1,
                        onBack: () => {
                            Actions.login({
                                types: 'login'
                            })
                        }
                    })

                } else if (result.isValid === false) {
                    Toast.fail(result.message, 2)
                    let attempts = result.attempts
                    this.setState({
                        attempts
                    })
                    Actions.LockedAccountVerificationStatus({
                        status: 0,
                        attempts
                    })
                } else {
                    Toast.fail(res.result.Message, 2)
                    return
                }
            } else {
            }
        }).catch(err => {
            Toast.hide()
        })

    }

    changeInputValue(type, value) {
        if (type === 'dob') {
            this.setState({
                [type]: moment(value).format('YYYY-MM-DD')
            }, () => {
                this.changeBtnStauts()
            })
        } else {
            const Err = RegObj[type].test(value)
            this.setState({
                [`${type}Err`]: Err,
                [type]: value
            }, () => {
                this.changeBtnStauts()
            })
        }
    }

    inputFocusBlur(flag, type) {
        this.setState({
            [`${type}IsFocus`]: flag
        })
    }

    changeBtnStauts() {
        const { firstNameErr, lastNameErr, emailErr, email, firstName, lastName, dob } = this.state
        let btnStatus = firstNameErr && firstName.length > 0 && lastNameErr && lastName.length > 0 && emailErr && email.length > 0 && dob
        this.setState({
            btnStatus
        })
    }

    render() {
        const { dobIsFocus, lastNameIsFocus, firstNameIsFocus, emailIsFocus, attempts, btnStatus, firstNameErr, lastNameErr, emailErr, dob, email, firstName, lastName } = this.state
        const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', color: window.isBlue ? '#3C3C3C' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
        const CalendarImg = window.isBlue ? require('./../../../images/common/calendarIcon/calendar0.png') : require('./../../../images/common/calendarIcon/calendar1.png')
        const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'

        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                <View style={styles.pageInforTextWrap}>
                    <Text style={[styles.pageInforText, { color: window.isBlue ? '#3C3C3C' : '#fff' }]}>Vui lòng trả lời các câu hỏi bên dưới để xác thực và kích hoạt lại tài khoản.</Text>
                </View>

                <View style={[styles.viewPaddingContainer, { backgroundColor: window.isBlue ? '#FFF' : '#212121' }]}>
                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Ngày Sinh :</Text>
                       {
                    //     <DatePicker
                    //     title='Ngày bắt đầu'
                    //     minDate={new Date(1930, 1, 1)}
                    //     maxDate={new Date()}
                    //     mode='date'
                    //     onChange={this.changeInputValue.bind(this, 'dob')}
                    //     format='YYYY-MM-DD'
                    //     locale={DatePickerLocale}
                    //     onDismiss={this.inputFocusBlur.bind(this, true, 'dob')}
                    // >
                    //     <List.Item styles={StyleSheet.create(ListItemstyles)}>
                    //         <View style={[styles.limitListsInput, PasswordInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: window.isBlue ? '#fff' : '#000' }]}>
                    //             <Text style={[styles.dob, { color: dob ? '#3C3C3C' : 'rgba(0, 0, 0, .4)' }]}>{dob ? dob : 'Ngày/tháng/năm'}</Text>
                    //             <Image source={CalendarImg} resizeMode='stretch' style={styles.calendarImg}></Image>
                    //         </View>
                    //     </List.Item>
                    // </DatePicker>
                       }
                        {
                            dobIsFocus && dob.length <= 0 && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>Ngày Tháng Năm Sinh không được để trống</Text>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Họ :</Text>
                        <TextInput
                            value={firstName}
                            maxLength={50}
                            onChangeText={this.changeInputValue.bind(this, 'firstName')}
                            placeholder='Họ'
                            onFocus={this.inputFocusBlur.bind(this, true, 'firstName')}
                            //onBlur={this.inputFocusBlur.bind(this, false, 'firstName')}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput]} />

                        {
                            firstNameIsFocus && firstName.length <= 0 && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>Vui lòng nhập họ của bạn.</Text>
                        }
                        {
                            !firstNameErr && firstName.length > 0 && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข</Text>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Tên :</Text>
                        <TextInput
                            value={lastName}
                            maxLength={50}
                            placeholder='Tên'
                            onFocus={this.inputFocusBlur.bind(this, true, 'lastName')}
                            //onBlur={this.inputFocusBlur.bind(this, false, 'lastName')}
                            onChangeText={this.changeInputValue.bind(this, 'lastName')}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput]} />
                        {
                            lastNameIsFocus && lastName.length <= 0 && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>Vui lòng nhập tên đệm và tên.</Text>
                        }
                        {
                            !lastNameErr && lastName.length > 0 && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข</Text>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>อีเมล :</Text>
                        <TextInput
                            value={email}
                            placeholder='Email'
                            onFocus={this.inputFocusBlur.bind(this, true, 'email')}
                            //onBlur={this.inputFocusBlur.bind(this, false, 'Email')}
                            keyboardType='email-address'
                            maxLength={50}
                            onChangeText={this.changeInputValue.bind(this, 'email')}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput]} />
                        {
                            emailIsFocus && email.length <= 0 && <Text style={[{ color: 'red', marginTop: 10 }]}> Địa chỉ email không được để trống.</Text>

                        }
                        {
                            !emailErr && email.length > 0 && <Text style={[{ color: 'red', marginTop: 10 }]}>รูปแบบอีเมลไม่ถูกต้อง</Text>
                        }
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <View style={styles.bottombtnWrap}>
                <Text style={styles.bottombtnWrap1}>Còn (<Text style={styles.bottombtnWrap2}>{attempts}</Text>) lần thử.</Text>
                <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: btnStatus ? '#33C85D' : 'rgba(0, 0, 0, .4)' }]} onPress={this.submitMemberInfor.bind(this)}>
                    <Text style={styles.closeBtnText}>บันทึก</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    pageInforTextWrap: {
        padding: 10,
        justifyContent: 'center',
        backgroundColor: '#EDEDED'
    },
    pageInforText: {
        fontSize: 16
    },
    viewPaddingContainer: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 15
    },
    limitLists: {
        marginBottom: 15,
    },
    limitListsText: {
        marginBottom: 5
    },
    limitListsInput: {
        borderWidth: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center'
    },
    dob: {},
    calendarImg: {
        width: 20,
        height: 20
    },
    closeBtnWrap: {
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
    bottombtnWrap: {
        position: 'absolute',
        bottom: 0,
        width,
    },
    bottombtnWrap1: {
        height: 40,
        textAlign: 'center'
    },
    bottombtnWrap2: {
        color: '#00AEEF'
    }
})