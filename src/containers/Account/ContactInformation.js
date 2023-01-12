import React from 'react'
import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, TextInput, DeviceEventEmitter, Image } from 'react-native'
import Toast from '@/containers/Toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions } from 'react-native-router-flux'
import ModalDropdown from 'react-native-modal-dropdown'
import { connect } from 'react-redux'
import { maskPhone, maskEmail } from '../../actions/Reg'
import { getMemberInforAction } from '../../actions/ReducerAction'
import CheckBox from 'react-native-check-box'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'

const { width, height } = Dimensions.get('window')
const ContactMethod = [
    'อีเมล',
    'โทรศัพท์',
    'LINE',
    'SMS'
]

const TimeArr = [
    {
        text: '00:00 น. - 03:00 น.',
        id: '0003'
    },
    {
        text: '03:00 น. - 06:00 น.',
        id: '0006'
    },
    {
        text: '06:00 น. - 09:00 น.',
        id: '0609'
    },
    {
        text: '09:00 น. - 12:00 น.',
        id: '0012'
    },
    {
        text: '12:00 น. - 15:00 น.',
        id: '1215'
    },
    {
        text: '15:00 น. - 18:00 น.',
        id: '1518'
    },
    {
        text: '18:00 น. - 21:00 น.',
        id: '1821'
    },
    {
        text: '21:00 น. - 00:00 น.',
        id: '2100'
    },
]

class ContactInformationContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            memberInfor: '',
            email: '',
            phone: '',
            countryData: [],
            countryIndex: 0,
            cityData: [],
            cityIndex: 0,
            walletsInforData: [],
            walletsInforIndex: 0,
            country: '',
            city: '',
            address: '',
            addressFlag: false,
            checkBox1: true,
            checkBox2: true,
            checkBox3: true,
            checkBox0: true,
            emailStatus: true,
            phoneStatus: true,
            arrowFlag1: false,
            arrowFlag2: false,
            arrowFlag3: false,
            arrowFlag4: false,
            arrowFlag5: false,
            IsNonMandatory: false,
            TimeArrIndex: -999999,
            isShowTip: false,
            lineCode: '',
            isLineCode: false
        }
    }

    componentDidMount() {
        this.getMemberDetailInfor(this.props.memberInforData)
        this.getProfileMasterCountryData()
        this.getProfileMasterCityData()
    }

    getMemberDetailInfor(memberInfor) {
        if (!memberInfor.MemberCode) return
        const phoneData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phoneStatus = phoneData ? (phoneData.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
        const phone = phoneData ? phoneData.Contact : ''
        const emailData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let emailStatus = emailData ? (emailData.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
        const email = emailData ? emailData.Contact : ''
        let Address = memberInfor.Address
        let walletsInforData = this.props.balanceInforData.filter(v => v.name.toLocaleUpperCase() !== 'TOTALBAL')
        let walletsInforIndex = walletsInforData.findIndex(v => v.name.toLocaleUpperCase() === memberInfor.PreferWallet.toLocaleUpperCase())
        let OfferContacts = memberInfor.OfferContacts
        let TimeRange = OfferContacts.TimeRange
        let TimeArrIndex = TimeArr.findIndex(v => v.id == TimeRange)

        let lineCode = ''
        let isLineCode = false
        const lineData = memberInfor.Contacts.find(v => v.ContactType.toLocaleLowerCase() === 'line')
        if (lineData) {
            lineCode = lineData.Contact
            isLineCode = true
        } else {
            isLineCode = false
        }
        this.setState({
            emailStatus,
            phoneStatus,
            memberInfor,
            phone,
            email,
            country: Address.Country,
            city: Address.City,
            address: Address.Address,
            addressFlag: Boolean(Address.Address),
            walletsInforData,
            walletsInforIndex: walletsInforIndex < 0 ? 0 : walletsInforIndex,

            checkBox0: OfferContacts.IsEmail,
            checkBox1: OfferContacts.IsCall,
            checkBox2: OfferContacts.IsLine,
            checkBox3: OfferContacts.IsSMS,

            IsNonMandatory: OfferContacts.IsNonMandatory,
            TimeArrIndex,
            lineCode,
            isLineCode,
        })
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.memberInforData) {
            this.getMemberDetailInfor(nextProps.memberInforData)
        }
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

    getProfileMasterCityData() {
        let index = 133
        let lastIndex = 210
        global.storage.load({
            key: 'cityData',
            id: 'cityData'
        }).then(cityData => {

            this.setState({
                cityData: cityData.slice(index, lastIndex)
            })
        }).catch(() => { })
        fetchRequest(ApiPort.GetProfileMasterData + 'category=city&', 'GET').then(res => {
            if (res.isSuccess) {
                let cityData = res.result

                this.setState({
                    cityData: cityData.slice(index, lastIndex)
                })
                global.storage.save({
                    key: 'cityData',
                    id: 'cityData',
                    data: res.result,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    creatCountryList(item, i) {
        let flag = this.state.countryIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    creatCityList(item, i) {
        let flag = this.state.cityIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    creatTimeList(item, i) {
        let flag = this.state.TimeArrIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.text}</Text>
        </View>
    }

    createWalletList(item, i) {
        let flag = this.state.walletsInforIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.localizedName}</Text>
        </View>
    }

    submitMemberInfor() {
        const { isLineCode, lineCode, TimeArrIndex, IsNonMandatory, checkBox3, checkBox0, checkBox1, checkBox2, memberInfor, countryData, countryIndex, cityData, cityIndex, walletsInforData, walletsInforIndex, address } = this.state
        if (!address) {
            Toast.fail('กรุณากรอกที่อยู่', 2)
            return
        }
        let checkBoxArr = [checkBox0, checkBox1, checkBox2, checkBox3].filter(Boolean)
        if (!IsNonMandatory && checkBoxArr.length < 2) {
            Toast.fail('กรุณาเลือกช่องทางการติดต่ออย่างน้อย 2 ช่องทาง', 2)
            return
        }

        if (TimeArrIndex < 0) {
            Toast.fail('ช่วงคัดเลือก', 2)
            return
        }

        if (this.state.checkBox2) {
            if (!lineCode) {
                Toast.fail('กรุณากรอก ID', 2)
                return
            }
        }

        if (!(countryData.length > 0 && cityData.length > 0)) return
        let contacts = memberInfor.Contacts || memberInfor.contacts
        let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let email = tempEmail ? tempEmail.Contact : ''
        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phone = tempPhone ? tempPhone.Contact : ''
        let Address = memberInfor.Address
        const params = {
            secretAnswer: '',
            secretQID: '',
            firstName: '',
            placeOfBirth: '',
            placeOfBirthID: '',
            nationality: 1,
            dob: '',
            addresses: {
                address: Address.Address ? Address.Address : address,
                zipCode: '',
                country: Address.Country ? Address.Country : countryData[countryIndex].localizedName,
                nationId: Address.NationId ? Address.NationId : countryData[countryIndex].id,
                city: Address.City ? Address.City : cityData[cityIndex].localizedName
            },
            nickName: '',
            language: 'th-th',
            messengerDetails: [{
                contact: '',
                contactTypeId: ''
            }],
            contact: phone.includes('-') ? phone : '66-' + phone,
            email,
            documentId: '',
            gender: '',
            wallet: walletsInforData[walletsInforIndex].name,
            password: '',
            confirmedPassword: '',
            blackBoxValue: E2Backbox,
            e2BlackBoxValue: E2Backbox,
            OfferContacts: {
                IsEmail: checkBox0,
                IsCall: checkBox1,
                IsLine: checkBox2,
                IsSMS: checkBox3,
                TimeRange: TimeArr[TimeArrIndex].id
            }
        }
        if (this.state.checkBox2) {
            if (lineCode) {
                params['MessengerDetails'] = [{
                    Contact: lineCode,
                    ContactTypeId: "9" //更新line用type = 9
                }]
            }
        } else {
            // if (isLineCode) {
            //     params['MessengerDetails'] = [{
            //         Contact: '',
            //         ContactTypeId: "" //更新line用type = 9
            //     }]
            // }
        }



        Toast.loading('กำลังโหลดข้อมูล...', 20000000)
        fetchRequest(ApiPort.Member, 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success('เปลี่ยนสำเร็จ', 2)
                if (this.props.memberInforData.PreferWallet !== walletsInforData[walletsInforIndex].name) {
                    DeviceEventEmitter.emit('listGetBouns', walletsInforData[walletsInforIndex].name)
                }
                this.props.getMemberInforAction()
            } else {
                Toast.fail(res.result.Message, 2)
            }
        }).catch(err => {
            Toast.hide()
        })
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

    changeArrowStatus(tag, arrowFlag) {
        this.setState({
            [tag]: arrowFlag
        })
    }

    render() {
        const { isLineCode, lineCode, arrowFlag5, isShowTip, arrowFlag4, TimeArrIndex, arrowFlag1, arrowFlag2, arrowFlag3, emailStatus, phoneStatus, country, walletsInforIndex, walletsInforData, phone, email, address, addressFlag, countryData, countryIndex, cityData, cityIndex, city } = this.state   //註冊訊息
        const PasswordInput = {
            backgroundColor: window.isBlue ? '#fff' : '#000',
            color: window.isBlue ? '#3C3C3C' : '#fff',
            borderColor: window.isBlue ? '#D1D1D1' : '#00AEEF',
            borderBottomWidth: 2,
            borderBottomColor: '#D1D1D1'
        }
        const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F3F4F8' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                    <View style={[styles.viewPaddingContainer, { backgroundColor: window.isBlue ? '#F3F4F8' : '#212121' }]}>
                        {/* 电话号码： */}

                        {
                            phone.length > 0 && <View style={styles.limitLists}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>เบอร์โทร</Text>
                                    {
                                        phoneStatus && <TouchableOpacity
                                            onPress={this.goVerification.bind(this, 'phone')}
                                            style={{
                                                height: 22,
                                                paddingHorizontal: 10, borderWidth: 1, borderRadius: 4,
                                                borderColor: '#1CBC63', justifyContent: 'center'
                                            }}>
                                            <Text style={{ color: '#1CBC63' }}>ยืนยันเบอร์โทร</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                                <View style={[styles.limitListsInput, PasswordInput, { backgroundColor: '#EDEDED', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <Text>{`**_${maskPhone(phone.split('-').length === 2 ? phone.split('-')[1] : phone.split('-')[0])}`}</Text>

                                    {
                                        !phoneStatus && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image resizeMode='stretch' source={require('./../../images/account/check1.png')} style={[styles.checkedImg]}></Image>
                                            <Text style={{ color: '#1CBC63', fontSize: 12 }}>ยืนยันแล้ว</Text>
                                        </View>
                                    }
                                </View>
                            </View>
                        }

                        {/* 地址： */}
                        <View style={styles.limitLists}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ที่อยู่</Text>
                            <TextInput
                                value={address}
                                onChangeText={address => {
                                    this.setState({
                                        address
                                    })
                                }}
                                editable={!addressFlag}
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput, { backgroundColor: window.isBlue ? (!addressFlag ? '#fff' : '#EDEDED') : (addressFlag ? '#5C5C5C' : '#000') }]} />
                        </View>

                        {/* 城市： */}
                        {
                            Array.isArray(cityData) && cityData.length > 0 && <View style={[styles.limitLists]}>
                                <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>จังหวัด</Text>
                                <ModalDropdown
                                    animated={true}
                                    options={cityData}
                                    renderRow={this.creatCityList.bind(this)}
                                    onSelect={cityIndex => {
                                        this.setState({
                                            cityIndex
                                        })
                                    }}
                                    //defaultIndex={cityData.length - 1}
                                    disabled={city}
                                    onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
                                    onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
                                    style={[styles.limitModalDropdown, PasswordInput, { backgroundColor: window.isBlue ? (city ? '#EDEDED' : '#fff') : (city ? '#5C5C5C' : '#000') }]}
                                    dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: 300 }]}
                                >
                                    <View style={[styles.limitModalDropdownTextWrap]}>
                                        <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#323232' : '#fff' }]}>{city ? city : (cityData.length > 0 ? cityData[cityIndex].localizedName : null)}</Text>
                                        {
                                            !city && <ModalDropdownArrow arrowFlag={arrowFlag1} />
                                        }
                                    </View>
                                </ModalDropdown>
                            </View>
                        }

                        {/* 国家： */}
                        {
                            Array.isArray(countryData) && countryData.length > 0 && <View style={styles.limitLists}>
                                <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ประเทศ</Text>
                                <ModalDropdown
                                    animated={true}
                                    options={countryData}
                                    renderRow={this.creatCountryList.bind(this)}
                                    onSelect={countryIndex => {
                                        this.setState({
                                            countryIndex
                                        })
                                    }}
                                    //defaultIndex={countryData.length - 1}
                                    disabled={country}
                                    onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag2', true)}
                                    onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag2', false)}
                                    style={[styles.limitModalDropdown, PasswordInput, { backgroundColor: window.isBlue ? (country ? '#EDEDED' : '#fff') : (country ? '#5C5C5C' : '#000') }]}
                                    dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: 300 }]}
                                >
                                    <View style={styles.limitModalDropdownTextWrap}>
                                        <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#323232' : '#fff' }]}>{country ? country : (countryData.length > 0 ? countryData[countryIndex].localizedName : null)}</Text>
                                        {
                                            !country && <ModalDropdownArrow arrowFlag={arrowFlag2} />
                                        }
                                    </View>
                                </ModalDropdown>
                            </View>
                        }

                        {/* 最喜欢的货币： */}
                        <View style={styles.limitLists}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ภาษาที่ต้องการ</Text>
                            <TextInput
                                value={'ไทย'}
                                editable={false}
                                placeholder='เบอร์โทรศัพท์'
                                placeholderTextColor={PlaceholderTextColor}
                                style={[styles.limitListsInput, PasswordInput, { backgroundColor: window.isBlue ? '#EDEDED' : '#212121' }]} />
                        </View>
                        {/* 使用的语言： */}

                        <View style={[styles.limitLists, { marginBottom: height * .15 }]}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 5
                            }}>
                                <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ช่องทางการติดต่อ :</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        isShowTip: !isShowTip
                                    })
                                }}>
                                    <Image
                                        resizeMode='stretch'
                                        source={require('./../../images/finance/walletSbIcon0.png')}
                                        style={styles.walletSbIcon}
                                    ></Image>
                                </TouchableOpacity>


                                {
                                    isShowTip && <View
                                        style={styles.recommendTipModal}>
                                        <Text style={styles.recommendTipModalText}>
                                            คุณสามารถเลือกช่องทางติดต่อได้มากกว่า 2 ช่องทาง เพื่อรับการแจ้งเตือนสิทธิต่างๆ เช่น เงินรางวัล , ของรางวัล หรือกิจกรรมต่างๆ !
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isShowTip: false
                                                })
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: 10,
                                                top: 10
                                            }}>
                                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>X</Text>
                                        </TouchableOpacity>
                                        <View style={styles.recommendTipModalArrow}></View>
                                    </View>
                                }



                            </View>
                            <View style={styles.checkBoxWrap}>
                                {
                                    ContactMethod.map((v, i) => {
                                        return <CheckBox
                                            key={i}
                                            checkBoxColor={'#00AEEF'}
                                            checkedCheckBoxColor={'#00AEEF'}
                                            onClick={() => {
                                                this.setState({ [`checkBox${i}`]: !this.state[`checkBox${i}`] })
                                                if (!isLineCode && this.state.checkBox2) {
                                                    this.setState({
                                                        lineCode: ''
                                                    })
                                                }
                                            }}
                                            style={{ width: 120, height: 30, justifyContent: 'center' }}
                                            isChecked={this.state[`checkBox${i}`]}
                                            rightTextView={<Text style={[{ color: window.isBlue ? '#323232' : '#fff' }, styles.checkBoxWrapText]}>{v}</Text>}
                                        />
                                    })
                                }

                                <View style={[styles.limitLists, {
                                    position: 'absolute',
                                    left: 120,
                                    top: 30
                                }]}>
                                    <ModalDropdown
                                        animated={true}
                                        options={TimeArr}
                                        renderRow={this.creatTimeList.bind(this)}
                                        onSelect={TimeArrIndex => {
                                            this.setState({
                                                TimeArrIndex
                                            })
                                        }}
                                        // disabled={city}
                                        onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag4', true)}
                                        onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag4', false)}
                                        style={[styles.limitModalDropdown, PasswordInput, {
                                            width: width - 120 - 60,
                                            height: 30,
                                            backgroundColor: window.isBlue ? (true ? '#EDEDED' : '#fff') : (true ? '#5C5C5C' : '#000')
                                        }]}
                                        dropdownStyle={[styles.limitDropdownStyle, {
                                            width: width - 120 - 60,
                                            backgroundColor: window.isBlue ? '#fff' : '#212121', height: 250
                                        }]}
                                    >
                                        <View style={[styles.limitModalDropdownTextWrap, {
                                            width: width - 120 - 60,
                                            height: 28,
                                            marginBottom: 4,
                                            borderWidth: 1,
                                            borderColor: '#777777',
                                            borderRadius: 4,
                                            backgroundColor: '#fff',
                                            borderBottomWidth: 1
                                        }]}>
                                            <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#323232' : '#fff' }]}>
                                                {
                                                    (TimeArrIndex >= 0 ? TimeArr[TimeArrIndex].text : 'ติดต่อได้ทุกเวลา')
                                                }
                                            </Text>
                                            {
                                                <ModalDropdownArrow arrowFlag={arrowFlag4} />
                                            }
                                        </View>
                                    </ModalDropdown>


                                    <TextInput style={[
                                        {
                                            backgroundColor: isLineCode ? '#EDEDED' : '#fff',
                                            width: width - 120 - 60,
                                            height: 28,
                                            borderWidth: 1,
                                            borderColor: '#777777',
                                            paddingLeft: 6,
                                            borderRadius: 4,
                                            marginTop: 4,
                                            justifyContent: 'center',
                                            paddingTop: 0,
                                            paddingBottom: 0
                                        }]}
                                        value={isLineCode ? lineCode.slice(0, 1) + Array.from({ length: lineCode.length - 1 }, v => '*').join('') : lineCode}
                                        placeholderTextColor='#908C8C'
                                        placeholder='กรุณากรอก ID'
                                        onChangeText={lineCode => {
                                            this.setState({
                                                lineCode
                                            })
                                        }}
                                        maxLength={18}
                                        editable={isLineCode ? false : this.state.checkBox2}
                                    >
                                    </TextInput>
                                </View>
                            </View>
                            <Text style={{ color: '#9E9E9E', fontSize: 12, marginTop: 8 }}>กรุณาติดต่อห้องแชทสดสำหรับการเปลี่ยนข้อมูล</Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
            {
                <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={this.submitMemberInfor.bind(this)}>
                    <Text style={styles.closeBtnText}>บันทึก</Text>
                </TouchableOpacity>
            }
        </View>
    }
}

export default ContactInformation = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            balanceInforData: state.balanceInforData,
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction()),
        }
    }
)(ContactInformationContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1
    },
    inputWrap: {
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden'
    },
    yanzhengBox: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#25AAE1',
        justifyContent: 'center',
        width: 66,
        alignItems: 'center',
        borderRadius: 4,
    },
    yanzhengBoxText: {
        color: '#fff',
        fontSize: 13
    },
    checkBoxWrap: {
        height: 90,
        flexWrap: 'wrap'
    },
    checkBoxWrapText: {
        fontSize: 12,
        paddingLeft: 4,
        paddingRight: 8,
    },
    cityLine: {
        width: 2,
        backgroundColor: '#F2F2F2',
        height: 40,
        marginRight: 30,
        marginLeft: 10
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
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 15
    },
    limitLists: {
        marginBottom: 15,
    },
    limitListsText: {
        marginBottom: 5,
        fontSize: 13
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
    limitListsTextInfor: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5
    },
    limitListsText1: {
        color: '#00AEEF',
        textDecorationLine: 'underline',
        fontSize: 13
    },
    calendarImg: {
        width: 20,
        height: 20
    },
    limitModalDropdown: {
        width: width - 20,
        height: 40,
        borderRadius: 4,
        borderWidth: 1,
        justifyContent: 'center',
    },
    limitDropdownStyle: {

        width: width - 20,
        // shadowColor: '#DADADA',
        // shadowRadius: 4,
        // shadowOpacity: .6,
        // shadowOffset: { width: 2, height: 2 },
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
        marginBottom: 50,
        borderRadius: 6
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    walletSbIcon: {
        width: 18,
        height: 18,
        marginLeft: 10
    },
    recommendTipModal: {
        position: 'absolute',
        zIndex: 1000000000,
        backgroundColor: '#25aae1',
        //borderWidth: 1,
        //borderColor: '#EDE473',
        padding: 10,
        top: -90,
        right: 0,
        paddingRight: 26,
        width: width - 20,
        borderRadius: 6
    },
    recommendTipModalText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendTipModalArrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 10,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#25aae1',
        bottom: -20,
        zIndex: 1000,
        left: (width - 20) * .30
    },
    checkedImg: {
        width: 18,
        height: 18,
        marginRight: 4
    },
})