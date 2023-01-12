import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions, ScrollView, Modal, TouchableOpacity, TextInput, DeviceEventEmitter } from 'react-native'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ModalDropdown from 'react-native-modal-dropdown'
import moment from 'moment'
import { connect } from 'react-redux'
import { getMemberInforAction, changeDepositTypeAction, getWithdrawalUserBankAction, RealXingReg, RealMingReg } from '../../actions/ReducerAction'
import { RealNameReg, RealNameErrTip, getName, maskEmail } from './../../actions/Reg'
import { Actions } from 'react-native-router-flux'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import { getDoubleNum, GetOnlyNumReg, toThousands } from '../../actions/Reg'
const SexData = [
    {
        localizedName: 'ชาย'
    },
    {
        localizedName: 'หญิง'
    }
]
import DatePicker from 'react-native-date-picker'
const SexMale = {
    FEMALE: 'Nam',
    MALE: 'Nữ'
}

const { width, height } = Dimensions.get('window')

class MemberInforContainr extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            emailStatus: true,
            memberInfor: {},
            name: '',
            name1: '',
            name2: '',
            nameErr: false,
            nameFlag: false,
            sexIndex: -999,
            gender: '',
            secretQuestionsData: [],
            secretQuestionsIndex: 0,
            question: '',
            SecurityAnswer: '',
            countryData: [],
            countryIndex: 0,
            birthdayDate: '',
            dob: '',
            profileMasterData: [],
            profileMasterDataIndex: 0,
            country: '',
            placeOfBirthID: '',
            availablePreferenceArr: [],
            availablePreferenceArrIndex: 0,
            isShowAddBankBtn: false,
            isShowBankBtn: false,
            arrowFlag1: false,
            arrowFlag2: false,
            arrowFlag3: false,
            arrowFlag4: false,
            arrowFlag5: false,
            eligible: false,
            mainWalletName: 'บาท',
            walletsInforData: [],
            walletsInforIndex: 0,
            isShowModal: false,
            isShowDataPicker: false
        }
    }

    componentDidMount() {
        this.getMemberData(this.props.memberInforData, this.props.withdrawalUserBankData)
        this.props.getWithdrawalUserBankAction()
        //this.getGamePreference()
        this.getProfileMasterSecretquestionsData()
        this.getProfileMasterCountryData()
        this.getProfileMasterData()
    }

    componentWillReceiveProps(nextProps) {
        let memberInforData = nextProps.memberInforData
        let withdrawalUserBankData = nextProps.withdrawalUserBankData
        if (nextProps && memberInforData) {
            //(memberInforData.DOB || memberInforData.Gender) && 
            this.getMemberData(memberInforData, withdrawalUserBankData)
        }
    }

    getMemberData(memberInforData, withdrawalUserBankData) {
        if (!memberInforData.MemberCode) return
        let gender = memberInforData.Gender
        let dob = memberInforData.DOB || ''
        let Address = memberInforData.Address

        const emailData = memberInforData.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let emailStatus = emailData ? (emailData.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
        const email = emailData ? emailData.Contact : ''


        let walletsInforData = this.props.balanceInforData.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL')
        let walletsInforIndex = walletsInforData.findIndex(v => v.name.toLocaleUpperCase() === memberInforData.PreferWallet.toLocaleUpperCase())



        this.setState({
            walletsInforData,
            walletsInforIndex: walletsInforIndex < 0 ? 0 : walletsInforIndex,
            emailStatus,
            email,
            memberInfor: memberInforData,
            name: memberInforData.FirstName,
            nameFlag: memberInforData.FirstName,
            birthdayDate: dob ? moment(dob).format('YYYY-MM-DD') : '',
            gender,
            dob,
            country: Address.Country,
            placeOfBirthID: memberInforData.PlaceOfBirthID,
            SecurityAnswer: memberInforData.SecurityAnswer,
            question: memberInforData.SecurityAnswer,
            isShowBankBtn: Boolean(Array.isArray(withdrawalUserBankData) && withdrawalUserBankData.length)
        })

        if (memberInforData.FirstName && memberInforData.FirstName.length) {
            this.setState({
                name1: memberInforData.FirstName.split(' ')[0],
                name2: memberInforData.FirstName.split(' ')[1],
            })
        }

        let freeBetStatus = memberInforData.freeBetStatus
        if (freeBetStatus) {
            this.setState({
                eligible: freeBetStatus.eligible,
            })
        }
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
            if (res.isSuccess) {
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
        let availablePreferenceArr = Object.keys(res.availablePreference).map(v => {
            return {
                localizedName: v,
                id: availablePreference[v]
            }
        })
        let playerPreference = res.playerPreference
        let availablePreferenceArrIndex = availablePreferenceArr.findIndex(v => v.id.toLocaleUpperCase() === playerPreference.toLocaleUpperCase())
        this.setState({
            availablePreferenceArr,
            availablePreferenceArrIndex: availablePreferenceArrIndex < 0 ? 0 : availablePreferenceArrIndex
        })
    }

    postSetGamePreference() {
        const { availablePreferenceArr, availablePreferenceArrIndex } = this.state
        //Toast.loading('กำลังโหลดข้อมูล...', 2000)
        let gamePreference = availablePreferenceArr[availablePreferenceArrIndex].id
        let params = {
            gamePreference
        }
        fetchRequest(ApiPort.PostSetGamePreference, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                DeviceEventEmitter.emit('availablePreference', gamePreference.toLocaleUpperCase())
                //Toast.success('การอัปเดตสำเร็จ', 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getProfileMasterData() {
        global.storage.load({
            key: 'profileMasterData',
            id: 'profileMasterData'
        }).then(profileMasterData => {
            this.setState({
                profileMasterData
            })
        }).catch(() => { })
        fetchRequest(ApiPort.GetProfileMasterData + 'category=PlaceOfBirthID', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    profileMasterData: res.result
                })
                global.storage.save({
                    key: 'profileMasterData',
                    id: 'profileMasterData',
                    data: res.result,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getProfileMasterSecretquestionsData() {
        global.storage.load({
            key: 'secretQuestionsData',
            id: 'secretQuestionsData'
        }).then(secretQuestionsData => {
            this.setState({
                secretQuestionsData
            })
        }).catch(() => { })
        fetchRequest(ApiPort.GetProfileMasterData + 'category=secretquestions&', 'GET').then(res => {
            if (res.isSuccess) {
                this.setState({
                    secretQuestionsData: res.result
                })
                global.storage.save({
                    key: 'secretQuestionsData',
                    id: 'secretQuestionsData',
                    data: res.result,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getProfileMasterCountryData() {
        global.storage.load({
            key: 'countryData',
            id: 'countryData'
        }).then(countryData => {
            this.setState({
                countryData
            })
        }).catch(() => { })
        fetchRequest(ApiPort.GetProfileMasterData + 'category=nations&', 'GET').then(res => {
            if (res.isSuccess) {
                this.setState({
                    countryData: res.result
                })
                global.storage.save({
                    key: 'countryData',
                    id: 'countryData',
                    data: res.result,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    creatSecretQuestionsList(item, i) {
        let flag = this.state.secretQuestionsIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    createAvailablePreferenceList(item, i) {
        let flag = this.state.availablePreferenceArrIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }



    creatSexList(item, i) {
        let flag = this.state.sexIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    creatCountryList(item, i) {
        let flag = this.state.countryIndex * 1 === i * 1
        return <TouchableOpacity style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </TouchableOpacity>
    }

    creatProfileMasterList(item, i) {
        let flag = this.state.profileMasterDataIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    submitMemberInfor() {
        //this.postSetGamePreference()
        const { walletsInforData, walletsInforIndex, name1, name2, nameErr, profileMasterDataIndex, profileMasterData, memberInfor, name, question, secretQuestionsData, secretQuestionsIndex, countryData, countryIndex, birthdayDate, sexIndex } = this.state
        if (!name1) {
            Toast.fail('รูปแบบชื่อที่กรอกไม่ถูกต้อง', 2)
            return
        }
        // if (!RealXingReg.test(name1)) {
        //     Toast.fail('ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข', 2)
        //     return
        // }

        if (!name2) {
            Toast.fail('รูปแบบชื่อที่กรอกไม่ถูกต้อง', 2)
            return
        }
        // if (!RealMingReg.test(name2)) {
        //     Toast.fail('ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข', 2)
        //     return
        // }
        // if (nameErr) {
        //     Toast.fail(RealNameErrTip, 2)
        //     return
        // }
        if (!birthdayDate) {
            Toast.fail('กรุณาเลือกวันเดือนปีเกิด', 2)
            return
        }
        if (!question) {
            Toast.fail('กรุณากรอกคำตอบของคุณ', 2)
            return
        }


        let contacts = memberInfor.Contacts || memberInfor.contacts
        let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let email = tempEmail ? tempEmail.Contact : ''
        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phone = tempPhone ? tempPhone.Contact : ''
        let Address = memberInfor.Address
        const params = {
            secretAnswer: question.trim(),
            secretQID: secretQuestionsData[secretQuestionsIndex].id + '',
            firstName: (memberInfor.FirstName ? memberInfor.FirstName : (name1.trim() + ' ' + name2.trim())).trim(),
            placeOfBirth: profileMasterData[profileMasterDataIndex].localizedName,
            placeOfBirthID: memberInfor.PlaceOfBirthID ? memberInfor.PlaceOfBirthID : profileMasterData[profileMasterDataIndex].id,
            nationality: 1,
            dob: memberInfor.DOB ? moment(memberInfor.DOB).format('YYYY-MM-DD') : birthdayDate,
            addresses: {
                address: '',
                zipCode: '',
                country: '',
                nationId: '',
                //country: Address.Country ? Address.Country : countryData[countryIndex].localizedName,
                //nationId: Address.NationId ? Address.NationId : countryData[countryIndex].id,
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
            wallet: walletsInforData[walletsInforIndex].name,
            gender: memberInfor.Gender ? memberInfor.Gender : sexIndex,
            // wallet: memberInfor.PreferWallet,
            password: '',
            confirmedPassword: '',
            blackBoxValue: E2Backbox,
            e2BlackBoxValue: E2Backbox,
        }

        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.Member, 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success('เปลี่ยนสำเร็จ', 2)
                // this.setState({
                //     question: ''
                // })

                this.props.getMemberInforAction()
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    checkBankStatus(flag) {
        if (flag) {
            Actions.NewBank({
                bankType: 'W',
                isGetFreeBet: true
            })
        } else {
            this.props.changeDepositTypeAction({
                type: 'banks'
            })
        }

        window.PiwikMenberCode(flag ? 'Profile_add_withdrawalbank' : 'Profile_View_withdrawalbank')
    }

    changeArrowStatus(tag, arrowFlag) {
        this.setState({
            [tag]: arrowFlag
        })
    }


    createWalletList(item, i) {
        let flag = this.state.walletsInforIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121')
        }]} ke={i}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle, { backgroundColor: item.color }]}></View>
                <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
            </View>
            <Text style={{ color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }}>{toThousands(item.balance)}</Text>
        </View>
    }


    goVerification(name) {
        const { memberInfor } = this.state
        if (memberInfor.FirstName) {
            this.state[`${name}Status`] && Actions.Verification({
                fillType: name,
                fromPage: 'ContactInformation',
                ServiceAction: 'ContactVerification'
            })
        } else {
            Actions.Verification({
                fillType: 'name',
                nextPage: name,
                fromPage: 'ContactInformation',
                ServiceAction: 'ContactVerification'
            })
        }
    }

    changeRebateDatePicker(day) {
        this.setState({
            birthdayDate: moment(day).format('YYYY-MM-DD')
        })
    }

    render() {
        const { name2, isShowDataPicker, walletsInforIndex, isShowModal, walletsInforData, name1, email, emailStatus, isShowBankBtn, isShowAddBankBtn, arrowFlag1, arrowFlag2, arrowFlag3, arrowFlag4, arrowFlag5, SecurityAnswer, nameErr, availablePreferenceArr, availablePreferenceArrIndex, placeOfBirthID, profileMasterDataIndex, profileMasterData, country, nameFlag, dob, birthdayDate, name, secretQuestionsData, secretQuestionsIndex, question, countryData, countryIndex, sexIndex, gender } = this.state   //註冊訊息
        const PasswordInput = {
            backgroundColor: window.isBlue ? '#F3F4F5' : '#000',
            color: window.isBlue ? '#3C3C3C' : '#fff',
            borderColor: window.isBlue ? '#D1D1D1' : '#00AEEF',
            borderBottomWidth: 2
        }

        const PlaceholderTextColor = window.isBlue ? '#C4C4C6' : '#fff'
        const CalendarImg = window.isBlue ? require('./../../images/common/calendarIcon/calendar0.png') : require('./../../images/common/calendarIcon/calendar1.png')
        // let mainWalletName = 'บาท'
        // let balanceInforData = this.props.balanceInforData
        // if (this.props.memberInforData && Array.isArray(balanceInforData) && balanceInforData.length) {
        //     let PreferWallet = this.props.memberInforData.PreferWallet
        //     let temp = balanceInforData.find(v => v.name.toLocaleUpperCase() == PreferWallet.toLocaleUpperCase())
        //    }

        let sexIndexAnother = gender && gender.toUpperCase() == 'MALE' ? 0 : 1
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F3F4F5' : '#000' }]}>
            <DatePicker
                title=' '
                confirmText='เสร็จสิ้น'
                cancelText='  '
                modal
                mode='date'
                open={isShowDataPicker}
                date={new Date(birthdayDate ? birthdayDate : new Date())}
                maximumDate={new Date(moment(new Date()).subtract(21, 'year'))}
                minimumDate={new Date(1930, 1, 1)}
                onConfirm={date => {
                    this.setState({
                        isShowDataPicker: false,
                        birthdayDate: moment(date).format('YYYY-MM-DD')
                    })
                }}
                locale={'th'}
                onCancel={() => {
                    this.setState({
                        isShowDataPicker: false
                    })
                }}
            />
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                <Modal transparent={true} visible={isShowModal} animationType='fade'>
                    <View style={[styles.modalContainer]}>
                        <View style={styles.modalBox}>
                            <View style={styles.phcTextBox}>
                                <Text style={styles.phcTextBoxText}>!</Text>
                            </View>
                            <Text style={{ fontSize: 16, paddingTop: 10 }}>แจ้งเตือน​</Text>
                            <Text style={{ paddingVertical: 10, textAlign: 'center', color: '#666' }}>หากทำการยืนยันข้อมูลแล้วจะไม่สามารถแก้ไขได้ โปรดตรวจสอบให้แน่ใจว่าข้อมูลถูกต้อง หรือติดต่อ ฝ่ายบริการเพื่อแก้ไขภายหลัง​</Text>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        isShowModal: false
                                    })
                                    this.submitMemberInfor()
                                }}
                                style={{
                                    height: 40,
                                    backgroundColor: '#25AAE1',
                                    alignItems: 'center',
                                    width: width * .85 - 30,
                                    borderRadius: 6,
                                    justifyContent: 'center'
                                }}>
                                <Text style={{ color: '#fff' }}>ยืนยัน</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({
                                        isShowModal: false
                                    })

                                }}
                                style={{
                                    height: 40,
                                    marginTop: 10,
                                    backgroundColor: '#fff',
                                    alignItems: 'center',
                                    width: width * .85 - 30,
                                    borderWidth: 1,
                                    borderColor: '#00ADEF',
                                    borderRadius: 6,
                                    justifyContent: 'center'
                                }}>
                                <Text style={{ color: '#00ADEF' }}>ตรวจสอบข้อมูล​</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                <View style={[styles.viewPaddingContainer, { backgroundColor: window.isBlue ? '#fff' : '#212121', marginHorizontal: 5, paddingHorizontal: 5 }]}>
                    {/* 姓名 */}
                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ชื่อจริง</Text>
                        {
                            !nameFlag ? <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TextInput
                                    value={name1}
                                    editable={!nameFlag}
                                    placeholder='ปัญญา'
                                    onChangeText={name1 => {
                                        let nameErr = !(RealNameReg.test(name1) && name1.trim().length > 0)
                                        this.setState({
                                            name1: name1.trim(),
                                            nameErr
                                        })
                                    }}
                                    placeholderTextColor={PlaceholderTextColor}
                                    style={[styles.limitListsInput, PasswordInput, {
                                        width: (width - 20) * .48,
                                        backgroundColor: window.isBlue ? (!nameFlag ? '#fff' : '#EDEDED') : (nameFlag ? '#5C5C5C' : '#000')
                                    }]} />

                                <TextInput
                                    value={name2}
                                    editable={!nameFlag}
                                    placeholder='สุขใจ'
                                    onChangeText={name2 => {
                                        let nameErr = !(RealNameReg.test(name2) && name2.trim().length > 0)
                                        this.setState({
                                            name2: name2.trim(),
                                            nameErr
                                        })
                                    }}
                                    placeholderTextColor={PlaceholderTextColor}
                                    style={[styles.limitListsInput, PasswordInput, {
                                        width: (width - 20) * .48,
                                        backgroundColor: window.isBlue ? (!nameFlag ? '#fff' : '#EDEDED') : (nameFlag ? '#5C5C5C' : '#000')
                                    }]} />
                            </View>
                                :
                                <View style={{ justifyContent: 'center' }}>
                                    <TextInput
                                        value={getName(name)}
                                        editable={!nameFlag}
                                        placeholder='ปัญญา'
                                        onChangeText={name => {
                                            let nameErr = !(RealNameReg.test(name) && name.trim().length > 0)
                                            this.setState({
                                                name: name.trim(),
                                                nameErr
                                            })
                                        }}
                                        placeholderTextColor={PlaceholderTextColor}
                                        style={[styles.limitListsInput, PasswordInput, {
                                            width: (width - 20),
                                            backgroundColor: window.isBlue ? (!nameFlag ? '#fff' : '#EDEDED') : (nameFlag ? '#5C5C5C' : '#000')
                                        }]} />

                                    <View style={{ position: 'absolute', right: 10 }}>
                                        <Text style={{ color: '#1CBC63', fontSize: 12 }}>ยืนยันแล้ว</Text>
                                    </View>
                                </View>

                        }
                        <Text style={{ color: '#FF0000', fontSize: 11, marginTop: 4 }}>กรุณากรอกชื่อ นามสกุลจริงที่ตรงกับชื่อบัญชีธนาคารในการฝาก-ถอน ป้องกันความล่าช้าหรือ ยอดเงินถูกยกเลิก เมื่อยืนยันแล้วจะไม่สามารถแก้ไขชื่อได้​</Text>
                        {
                            // nameErr && <Text style={{ color: '#EDEDED' }}>{RealNameErrTip}</Text>
                        }
                    </View>

                    {/* 生日 */}
                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>วันเกิด</Text>
                        <TouchableOpacity onPress={() => {
                            !dob && this.setState({
                                isShowDataPicker: true
                            })
                        }} style={[{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: width - 20,
                            // backgroundColor: window.isBlue ? (dob ? '#EDEDED' : '#fff') : (dob ? '#5C5C5C' : '#000')
                        }]}>
                            <View style={styles.dataBox}>
                                <Text style={[styles.birthdayDate, { color: window.isBlue ? '#000' : '#fff' }]}>{dob ? moment(birthdayDate).format('YYYY').slice(0, 2) + '**' : (birthdayDate ? moment(birthdayDate).format('YYYY') : '')} ปี</Text>
                                <Text style={styles.dataImg}>〉</Text>
                            </View>
                            <View style={styles.dataBox}>
                                <Text style={[styles.birthdayDate, { color: window.isBlue ? '#000' : '#fff' }]}>{dob ? '**' : (birthdayDate ? moment(birthdayDate).format('MM') : '')} เดือน</Text>
                                <Text style={styles.dataImg}>〉</Text>
                            </View>
                            <View style={styles.dataBox}>
                                <Text style={[styles.birthdayDate, { color: window.isBlue ? '#000' : '#fff' }]}>{dob ? '**' : (birthdayDate ? moment(birthdayDate).format('DD') : '')} วัน</Text>
                                <Text style={styles.dataImg}>〉</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={{ color: '#9A9A9A', fontSize: 11, marginTop: 4 }}>คุณสามารถใส่วันเกิดได้ครั้งเดียวเท่านั้น</Text>
                    </View>

                    {/* 钱包*/}
                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>สกุลเงินที่ต้องการ</Text>
                        <View style={{ justifyContent: 'center' }}>

                            <TextInput
                                value={'บาท'}
                                editable={false}
                                maxLength={50}
                                onChangeText={question => {
                                    this.setState({
                                        question
                                    })
                                }}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput, { backgroundColor: '#EDEDED' }]} />
                            <Image resizeMode='stretch'
                                style={{ width: 20, height: 20, position: 'absolute', right: 10 }}
                                source={require('./../../images/account/locker.png')} />
                        </View>


                    </View>

                    {
                        !(Array.isArray(this.props.withdrawalUserBankData) && this.props.withdrawalUserBankData.length > 0)
                            ?
                            <View style={styles.limitLists}>
                                <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ธนาคารสำหรับการถอนเงิน</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: '#9A9A9A', fontSize: 11 }}>คุณยังไม่ได้ทำการเพิ่มบัญชีธนาคารสำหรับการถอนเงิน</Text>
                                    <TouchableOpacity
                                        onPress={() => { Actions.NewBank({ bankType: 'D' }) }}
                                        style={{
                                            alignItems: 'center', justifyContent: 'center',
                                            width: 80, height: 40, borderRadius: 4, backgroundColor: "#25AAE1"
                                        }}>
                                        <Text style={{ color: '#fff' }}>เพิ่ม</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View style={styles.limitLists}>
                                <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ธนาคารสำหรับการถอนเงิน</Text>
                                <Text onPress={() => {
                                    this.props.changeDepositTypeAction({
                                        type: 'banks'
                                    })
                                }} style={{ color: '#25AAE1', textDecorationLine: 'underline', fontSize: 12 }}>ดูข้อมูลบัญชีสำหรับการถอนที่บันทึกไว้</Text>
                                <Text style={{ color: '#9A9A9A', fontSize: 10, marginTop: 10 }}>คุณสามารถเพิ่มบัญชีสำหรับการถอนได้เพียง 1 ครั้ง หากต้องการเปลี่ยนแปลง กรุณาติดต่อแชทสด</Text>
                            </View>
                    }



                    {/* 性别  gender */}
                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>เพศ</Text>

                        <View style={{ flexDirection: 'row' }}>
                            {
                                SexData.map((v, i) => <TouchableOpacity onPress={() => {
                                    if (gender) {
                                        return
                                    }
                                    this.setState({
                                        sexIndex: i
                                    })
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, justifyContent: 'center', marginRight: 100 }}>
                                        <View style={{
                                            backgroundColor: '#E8E8E8',
                                            width: 16,
                                            height: 16,
                                            borderRadius: 100000,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 15
                                        }}>
                                            {
                                                (gender ? (gender.toUpperCase() == 'MALE' ? 0 : 1) : sexIndex) == i && <View style={{
                                                    backgroundColor: '#fff',
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 100000
                                                }}></View>
                                            }
                                        </View>
                                        <Text>{v.localizedName}</Text>
                                    </View>
                                </TouchableOpacity>)
                            }
                        </View>
                    </View>

                    {/*eamil */}
                    <View style={styles.limitLists}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>อีเมล</Text>

                            {
                                emailStatus && <TouchableOpacity
                                    onPress={this.goVerification.bind(this, 'email')}
                                    style={{
                                        height: 22,
                                        paddingHorizontal: 10, borderWidth: 1, borderRadius: 4,
                                        borderColor: '#1CBC63', justifyContent: 'center'
                                    }}>
                                    <Text style={{ color: '#1CBC63' }}>ยืนยันอีเมล</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={[styles.limitListsInput, PasswordInput, { backgroundColor: '#EDEDED', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            {
                                email && email.length > 0 && <Text>{maskEmail(email)}</Text>
                            }

                            {
                                !emailStatus && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image resizeMode='stretch' source={require('./../../images/account/check1.png')} style={[styles.checkedImg]}></Image>
                                    <Text style={{ color: '#1CBC63', fontSize: 12 }}>ยืนยันแล้ว</Text>
                                </View>
                            }
                        </View>

                        <Text style={{ color: '#4A4A4A', fontSize: 12, textAlign: 'center', marginTop: 5 }}>กรุณาติดต่อห้องแชทสด <Text
                            onPress={() => {
                                Actions.LiveChat()
                            }}
                            style={{ color: '#1CBC63' }}>หากต้องการอัพเดทข้</Text>อมูลส่วนตัว</Text>
                    </View>


                    <View style={{ width, height: 8, marginHorizontal: -10, backgroundColor: '#F3F4F5' }}>
                    </View>



                    {/* 最喜欢的电子钱包： */}
                    <View style={[styles.limitLists, {
                        paddingTop: 10
                    }]}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>บัญชีที่ต้องการ</Text>
                        {
                            walletsInforData.length > 0 && <ModalDropdown
                                animated={true}
                                options={walletsInforData}
                                renderRow={this.createWalletList.bind(this)}
                                onSelect={walletsInforIndex => {
                                    this.setState({
                                        walletsInforIndex
                                    })
                                }}
                                style={[styles.limitModalDropdown, PasswordInput, { backgroundColor: '#fff' }]}
                                onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag5', true)}
                                onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag5', false)}
                                dropdownStyle={[styles.limitDropdownStyle, {
                                    backgroundColor: window.isBlue ? '#fff' : '#212121',
                                    height: walletsInforData.length * 20
                                }]}
                            >
                                <View style={styles.limitModalDropdownTextWrap}>
                                    <View style={styles.walletTranferBox}>
                                        <View style={[styles.toreturnModalDropdownCircle, styles.toreturnModalDropdownCircle1, { backgroundColor: walletsInforData[walletsInforIndex].color }]}></View>
                                        <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{walletsInforData[walletsInforIndex].localizedName}</Text>
                                    </View>
                                    <ModalDropdownArrow arrowFlag={arrowFlag5} />
                                </View>
                            </ModalDropdown>
                        }
                    </View>

                    <View style={{ width, height: 8, marginHorizontal: -10, backgroundColor: '#F3F4F5' }}>
                    </View>



                    {/* 安全问题 */}
                    {
                        secretQuestionsData.length > 0 && <View style={styles.limitLists}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>คำถามความปลอดภัย</Text>
                            <ModalDropdown
                                animated={true}
                                disabled={SecurityAnswer}
                                options={secretQuestionsData}
                                renderRow={this.creatSecretQuestionsList.bind(this)}
                                onSelect={secretQuestionsIndex => {
                                    this.setState({
                                        secretQuestionsIndex
                                    })
                                }}
                                onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag3', true)}
                                onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag3', false)}
                                style={[styles.limitModalDropdown, PasswordInput, { backgroundColor: window.isBlue ? (SecurityAnswer ? '#EDEDED' : '#fff') : (SecurityAnswer ? '#5C5C5C' : '#000') }]}
                                dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: secretQuestionsData.length * 30 + 4 }]}
                            >
                                <View style={styles.limitModalDropdownTextWrap}>
                                    <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{secretQuestionsData[secretQuestionsIndex].localizedName}</Text>
                                    {
                                        !SecurityAnswer && <ModalDropdownArrow arrowFlag={arrowFlag3} />
                                    }
                                </View>
                            </ModalDropdown>
                        </View>
                    }

                    {/* 安全性答案： */}
                    <View style={styles.limitLists}>
                        <TextInput
                            value={SecurityAnswer ? SecurityAnswer.replace(/^(.).*(.)$/, "$1*******") : question}
                            editable={!SecurityAnswer}
                            maxLength={50}
                            placeholder='คำตอบด้านความปลอดภัย'
                            placeholderTextColor='#C4C4C6'
                            onChangeText={question => {
                                this.setState({
                                    question
                                })
                            }}
                            style={[styles.limitListsInput, PasswordInput, { backgroundColor: window.isBlue ? (SecurityAnswer ? '#EDEDED' : '#fff') : (SecurityAnswer ? '#5C5C5C' : '#000') }]} />
                    </View>
                </View>

                {
                    <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={
                        () => {
                            this.setState({
                                isShowModal: true
                            })
                        }
                    }>
                        <Text style={styles.closeBtnText}>บันทึก</Text>
                    </TouchableOpacity>
                }
            </KeyboardAwareScrollView>
        </View>
    }
}

export default MemberInfor = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            balanceInforData: state.balanceInforData,
            withdrawalUserBankData: state.withdrawalUserBankData
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
            getWithdrawalUserBankAction: () => dispatch(getWithdrawalUserBankAction()),
        }
    }
)(MemberInforContainr)


const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    pageInforTextWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        height: 40,
        justifyContent: 'center'
    },
    pageInforText: {
        fontSize: 16
    },
    viewPaddingContainer: {
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
    calendarImg: {
        width: 20,
        height: 20
    },
    birthdayDate: {
        marginRight: 6
    },
    limitModalDropdown: {
        width: width - 20,
        height: 40,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
    },
    limitModalDropdown1: {
        width: width - 20,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bankBtnText1: {
        color: '#fff',
        fontWeight: 'bold'
    },
    bankBtn1: {
        backgroundColor: '#25AAE1',
        height: 35,
        justifyContent: 'center',
        paddingHorizontal: 12,
        borderRadius: 4
    },
    bankBtnText2: {
        color: '#25AAE1',
        textDecorationLine: 'underline'
    },
    bankBtn2: {
        paddingVertical: 8
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
        height: 30,
        justifyContent: 'center',
        paddingLeft: 6,
        paddingRight: 6,
    },
    limitModalDropdownListText: {
        color: '#000'
    },
    limitModalDropdownText: {
        fontSize: 13,
    },
    datePickerWrapView: {
        flexDirection: 'row',
        height: 40,
        width: width - 22,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4
    },
    closeBtnWrap: {
        marginHorizontal: 10,
        width: width - 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 200
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    dataBox: {
        backgroundColor: '#EDEDED',
        width: (width - 20) / 3.2,
        borderRadius: 4,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: 10
    },
    dataImg: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#25AAE1',
        transform: [{
            rotate: '90deg'
        }]
    },
    toreturnModalDropdownCircle: {
        width: 8,
        borderRadius: 1000,
        backgroundColor: '#DCDCDC',
        marginRight: 5,
        height: 18
    },
    toreturnModalDropdownCircle1: {
        height: 18,
        width: 8
    },
    walletTranferBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBox: {
        width: .85 * width,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#fff',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    phcTextBox: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        backgroundColor: '#E2141C',
        marginBottom: 5
    },
    phcTextBoxText: {
        fontWeight: 'bold',
        fontSize: 30,
        color: '#fff'
    },
    checkedImg: {
        width: 18,
        height: 18,
        marginRight: 4
    },
})