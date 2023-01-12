import React from 'react'
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, TouchableOpacity, Platform, Image } from 'react-native'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import ModalDropdown from 'react-native-modal-dropdown'
import { passwordReg, passwordErrTip } from './../../../actions/Reg'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'

const RegObj = {
    password: passwordReg,
    rePassword: passwordReg
}
const { width } = Dimensions.get('window')

class ResetPasswordProfileContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            secretQuestionsData: [],
            secretQuestionsIndex: 0,
            password: '',
            passwordErr: true,
            rePassword: '',
            rePasswordErr: true,
            btnStatus: false,
            question: '',
            arrowFlag: false
        }
    }

    componentDidMount() {
        this.getProfileMasterSecretquestionsData()
    }

    getProfileMasterSecretquestionsData() {
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetProfileMasterData + 'category=secretquestions&', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    secretQuestionsData: res.result
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    submitMemberInfor() {
        const { password, rePassword, question, secretQuestionsData, secretQuestionsIndex, btnStatus } = this.state
        if (!btnStatus) return

        if (password === rePassword) {
            Toast.fail('กรุณาใส่รหัสผ่านอื่น', 2)
            return
        }

        if (!question) {
            Toast.fail('กรุณากรอกคำตอบของคุณ', 2)
            return
        }

        let contacts = this.props.memberInforData.Contacts || this.props.memberInforData.contacts
        let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let email = tempEmail ? tempEmail.Contact : ''
        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phone = tempPhone ? tempPhone.Contact : ''
        const params = {
            secretAnswer: question.trim(),
            secretQID: secretQuestionsData[secretQuestionsIndex].id + '',
            firstName: '',
            placeOfBirth: '',
            placeOfBirthID: '',
            nationality: 1,
            dob: '',
            addresses: {
                address: '',
                zipCode: '',
                country: '',
                nationId: '',
                city: ''
            },
            nickName: '',
            language: 'th-th',
            messengerDetails: [{
                contact: '',
                contactTypeId: ''
            }],
            contact: phone,
            email,
            documentId: '',
            gender: '',
            wallet: '',
            password: password,
            confirmedPassword: rePassword,
            blackBoxValue: E2Backbox,
            e2BlackBoxValue: E2Backbox,
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.Member, 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success('การอัปเดตสำเร็จ', 2)
                Actions.login({
                    types: 'login'
                })
                this.setState({
                    password: '',
                    passwordErr: true,
                    rePassword: '',
                    rePasswordErr: true,
                    btnStatus: false,
                    question: ''
                })
            }
        }).catch(err => {
            Toast.hide()
        })

    }

    changeInputValue(type, value) {
        const Err = RegObj[type].test(value)
        this.setState({
            [`${type}Err`]: Err,
            [type]: value
        }, () => {
            this.changeBtnStauts()
        })
    }

    changeBtnStauts() {
        const { rePasswordErr, passwordErr, password, rePassword, question } = this.state
        let btnStatus = rePasswordErr && password.length > 0 && passwordErr && rePassword.length > 0 && question.length > 0 && password !== rePassword
        this.setState({
            btnStatus
        })
    }

    creatSecretQuestionsList(item, i) {
        let flag = this.state.secretQuestionsIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    render() {
        const { arrowFlag, question, secretQuestionsData, secretQuestionsIndex, btnStatus, rePasswordErr, passwordErr, password, rePassword } = this.state
        const PasswordInput = { backgroundColor: window.isBlue ? '#fff' : '#000', color: window.isBlue ? '#3C3C3C' : '#fff', borderColor: window.isBlue ? '#F2F2F2' : '#00AEEF' }
        const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                <View style={styles.pageInforTextWrap}>
                    <Text style={[styles.pageInforText, { color: window.isBlue ? '#3C3C3C' : '#fff' }]}>THÔNG TIN ĐĂNG NHẬP VÀ BẢO MẬT TÀI KHOẢN</Text>
                </View>

                <View style={[styles.viewPaddingContainer, { backgroundColor: window.isBlue ? '#FFF' : '#212121' }]}>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Mật Khẩu :</Text>
                        <TextInput
                            value={password}
                            secureTextEntry={true}
                            maxLength={20}
                            onChangeText={this.changeInputValue.bind(this, 'password')}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput]} />
                        {
                            !passwordErr && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>{passwordErrTip}</Text>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Xác nhận Mật khẩu :</Text>
                        <TextInput
                            value={rePassword}
                            maxLength={20}
                            secureTextEntry={true}
                            onChangeText={this.changeInputValue.bind(this, 'rePassword')}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput]} />
                        {
                            !rePasswordErr && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>{passwordErrTip}</Text>
                        }
                        {
                            password === rePassword && rePasswordErr && rePassword.length > 0 && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>กรุณาใส่รหัสผ่านอื่น</Text>
                        }
                    </View>

                    {
                        secretQuestionsData.length > 0 && <View style={styles.limitLists}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Câu hỏi bảo mật :</Text>
                            <ModalDropdown
                                animated={true}
                                options={secretQuestionsData}
                                renderRow={this.creatSecretQuestionsList.bind(this)}
                                onSelect={secretQuestionsIndex => {
                                    this.setState({
                                        secretQuestionsIndex
                                    })
                                }}
                                onDropdownWillShow={this.changeArrowStatus.bind(this, true)}
                                onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
                                style={[styles.limitModalDropdown, PasswordInput]}
                                dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: secretQuestionsData.length * 30 + 4 }]}
                            >
                                <View style={styles.limitModalDropdownTextWrap}>
                                    <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{secretQuestionsData[secretQuestionsIndex].localizedName}</Text>
                                    <ModalDropdownArrow arrowFlag={arrowFlag} />
                                </View>
                            </ModalDropdown>
                        </View>
                    }

                    {/* 安全性答案： */}
                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>Câu trả lời bảo mật :</Text>
                        <TextInput
                            value={question}
                            maxLength={50}
                            onChangeText={question => {
                                this.setState({
                                    question
                                }, () => {
                                    this.changeBtnStauts()
                                })
                            }}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput]} />
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: btnStatus ? '#33C85D' : 'rgba(0, 0, 0, .4)' }]} onPress={this.submitMemberInfor.bind(this)}>
                <Text style={styles.closeBtnText}>บันทึก</Text>
            </TouchableOpacity>
        </View>
    }
}

export default ResetPasswordProfile = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {}
    }
)(ResetPasswordProfileContainer)

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
    limitModalDropdownText: {
        fontSize: 13,
    },
    limitModalDropdownList: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 6,
        paddingRight: 6,
    },
})