import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, TextInput, Modal, DeviceEventEmitter } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Actions } from 'react-native-router-flux'
import CheckBox from 'react-native-check-box'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { RealXingReg, RealMingReg, RealNameErrTip, HouseNumberReg, GetOnlyNumReg, EmailReg, phoneReg } from '../../../actions/Reg'
import ModalDropdown from 'react-native-modal-dropdown'
import { maskPhone, maskEmail } from '../../../actions/Reg'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'

const { width, height } = Dimensions.get('window')
const RegObj = {
    recipientFirstName: RealXingReg,
    recipientLastName: RealMingReg,
    email: EmailReg,
    houseNumber: HouseNumberReg,
    phone: phoneReg
}

class DailyDealAddressContainer extends React.Component {
    constructor(props) {
        super(props)
        const shippingAddress = this.props.shippingAddress
        const isAdd = this.props.isAdd
        this.state = {
            isAdd,
            shippingAddress,
            recipientFirstName: isAdd ? '' : shippingAddress.firstName,
            recipientFirstNameErr: true,
            recipientLastName: isAdd ? '' : shippingAddress.lastName,
            recipientLastNameErr: true,
            phone: isAdd ? '' : shippingAddress.phoneNumber,
            phoneErr: true,
            email: isAdd ? '' : shippingAddress.email,
            emailErr: true,
            checkBox: true,
            province: [],
            provinceIndex: -1,
            district: [],
            districtIndex: -1,
            town: [],
            townIndex: -1,
            postalCode: isAdd ? '' : shippingAddress.postalCode,
            houseNumber: isAdd ? '' : shippingAddress.houseNumber,
            houseNumberErr: true,
            remark: '',
            phonePrefixes: [],
            phoneMinLength: 9,
            phoneMaxLength: 9,
            btnStatus: false,
            arrowFlag1: false,
            arrowFlag2: false,
            arrowFlag3: false,
            zone: isAdd ? '' : shippingAddress.zone,
            address: isAdd ? '' : shippingAddress.address,
            isdelteFlag: false
        }
    }

    componentDidMount() {
        //this.getMemberContact()
        //this.getPhonePrefixes()
        this.getProvince()

        this.changeBtnStauts()
    }

    componentWillMount() {
        Toast.hide()
    }

    getPhonePrefixes() {
        fetchRequest(ApiPort.GetSetting + 'Phone/Prefix?', 'GET').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    phonePrefixes: res.prefixes,
                    phoneMinLength: res.minLength,
                    phoneMaxLength: res.maxLength
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }



    getMemberContact() {
        let memberInfor = this.props.memberInforData
        let contacts = memberInfor.Contacts || memberInfor.contacts
        let tempEmail = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'email')
        let email = tempEmail ? tempEmail.Contact : ''
        let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
        let phone = tempPhone ? tempPhone.Contact : ''
        this.setState({
            phone: phone.includes('-') ? phone.split('-')[1] : phone,
            email,
        })
    }

    getProvince(flag) {
        global.storage.load({
            key: 'DailyProvince',
            id: 'DailyProvince'
        }).then(data => {
            this.setState({
                province: data
            })
        }).catch(() => {
            Toast.loading('กำลังโหลดข้อมูล...', 2000)
        })
        const { isAdd, shippingAddress } = this.state
        fetchRequest(ApiPort.GetProvince, 'GET').then(res => {
            Toast.hide()
            let province = res.provinceList
            if (Array.isArray(province)) {
                this.setState({
                    province
                })
                if (!isAdd) {
                    let provinceIndex = province.findIndex(v => v.provinceName === shippingAddress.province)
                    let provinceId = province[provinceIndex].provinceId
                    this.setState({
                        provinceIndex
                    })
                    this.getDistrict(provinceId)
                }
                global.storage.save({
                    key: 'DailyProvince',
                    id: 'DailyProvince',
                    data: province,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getDistrict(provinceId, flag) {
        const { province, provinceIndex, district, districtIndex, town, townIndex, isAdd, shippingAddress } = this.state
        if (province.length && district.length && town.length && provinceIndex >= 0 && districtIndex >= 0 && townIndex >= 0) {
            this.setState({
                town: [],
                district: []
            })
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        isAdd && this.setState({
            districtIndex: 0
        })

        fetchRequest(ApiPort.GetDistrict + 'provinceId=' + provinceId + '&', 'GET').then(res => {
            Toast.hide()
            let district = res.districtList
            if (Array.isArray(district)) {

                this.setState({
                    district
                })
                if (!isAdd) {
                    if (flag) {
                        this.setState({
                            districtIndex: 0
                        })
                    } else {
                        let districtIndex = district.findIndex(v => v.districtName === shippingAddress.district)
                        let districtId = district[districtIndex].districtId
                        this.setState({
                            districtIndex
                        })
                        this.getTown(districtId)
                    }
                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getTown(districtId, flag) {

        const { isAdd, shippingAddress } = this.state
        isAdd && this.setState({
            townIndex: 0
        })

        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetTown + 'districtId=' + districtId + '&', 'GET').then(res => {
            Toast.hide()
            let town = res.townList
            if (Array.isArray(town)) {
                this.setState({
                    town
                })

                if (!isAdd) {
                    if (flag) {
                        this.setState({
                            townIndex: 0
                        })
                    } else {
                        let townIndex = town.findIndex(v => v.townName === shippingAddress.town)
                        this.setState({
                            townIndex
                        })
                    }

                }
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    creatProvinceList(item, i) {
        let flag = this.state.provinceIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.provinceName}</Text>
        </View>
    }

    creatDistrictList(item, i) {
        let flag = this.state.districtIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.districtName}</Text>
        </View>
    }

    creatTownList(item, i) {
        let flag = this.state.townIndex * 1 === i * 1
        return <View style={[styles.limitModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} ke={i}>
            <Text style={[styles.limitModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.townName}</Text>
        </View>
    }

    postShippingAddress() {
        const { zone, address, btnStatus, checkBox, houseNumber, recipientFirstName, recipientLastName, phone, email, province, provinceIndex, district, districtIndex, town, townIndex, postalCode } = this.state
        if (!btnStatus) return

        if (!recipientFirstName) {
            Toast.fail('รูปแบบชื่อที่กรอกไม่ถูกต้อง', 2)
            return
        }
        if (!RealXingReg.test(recipientFirstName)) {
            Toast.fail('ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข', 2)
            return
        }


        if (!recipientLastName) {
            Toast.fail('รูปแบบชื่อที่กรอกไม่ถูกต้อง', 2)
            return
        }
        if (!RealMingReg.test(recipientLastName)) {
            Toast.fail('ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข', 2)
            return
        }



        const params = {
            recipientFirstName,
            recipientLastName,
            postalCode,
            contactNo: phone,
            email,
            provinceId: province[provinceIndex].provinceId,
            districtId: district[districtIndex].districtId,
            townId: town[townIndex].townId,
            houseNumber,
            zone,
            address,
            defaultAddress: checkBox,
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.ChangeShippingAddress, 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getShippingAddress()
                Toast.success('การอัปเดตสำเร็จ', 1.5, () => {
                    Actions.pop()
                })
            } else {
                Toast.fail(res.message, 1.5)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    deleteShippingAddress() {
        let id = this.state.shippingAddress.id
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.DeleteShippingAddress + id + '?', 'DELETE').then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getShippingAddress()
                Toast.success('ลบสำเร็จ', 1.5, () => {
                    Actions.pop()
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    changeShippingAddress() {
        const { address, zone, btnStatus, checkBox, houseNumber, recipientFirstName, recipientLastName, phone, email, province, provinceIndex, district, districtIndex, town, townIndex, postalCode } = this.state
        if (!btnStatus) return
        const params = {
            id: this.state.shippingAddress.id,
            recipientFirstName,
            recipientLastName,
            postalCode,
            contactNo: phone,
            email,
            provinceId: province[provinceIndex].provinceId,
            districtId: district[districtIndex].districtId,
            townId: town[townIndex].townId,
            houseNumber,
            zone,
            address,
            defaultAddress: checkBox,
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.ChangeShippingAddress, 'PUT', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getShippingAddress()
                Toast.success('การอัปเดตสำเร็จ', 1.5, () => {
                    Actions.pop()
                })
            } else {
                Toast.fail(res.message, 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    getShippingAddress() {
        fetchRequest(ApiPort.ChangeShippingAddress, 'GET').then(res => {
            Toast.hide()
            let shippingAddress = res.result
            if (res.isSuccess) {

                let defaultShippingAddress = shippingAddress.find(v => v.defaultAddress)
                if (defaultShippingAddress) {
                    let defaultBankIndex = shippingAddress.findIndex(v => v.defaultAddress)
                    shippingAddress.splice(defaultBankIndex, 1)
                    shippingAddress.unshift(defaultShippingAddress)
                }
                global.storage.save({
                    key: 'shippingAddress',
                    id: 'shippingAddress',
                    data: shippingAddress,
                    expires: null
                })
                DeviceEventEmitter.emit('shippingAddress', shippingAddress)
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

    changeInputValue1(type, value) {
        this.setState({
            [type]: value
        }, () => {
            this.changeBtnStauts()
        })
    }

    changePhoneStatus(value) {
        const { phonePrefixes, phoneMinLength, phoneMaxLength } = this.state
        let strValue = value + ''
        let flag1 = strValue.length >= phoneMinLength && strValue.length <= phoneMaxLength
        let phonePrefixes1 = phonePrefixes.filter(v => v.length === 1)
        let phonePrefixes2 = phonePrefixes.filter(v => v.length === 2)
        let phonePrefixes3 = phonePrefixes.filter(v => v.length === 3)

        let regNumber1 = strValue.slice(0, 1)
        let regNumber2 = strValue.slice(0, 2)
        let regNumber3 = strValue.slice(0, 3)

        let flag2 = phonePrefixes1.includes(regNumber1) || phonePrefixes2.includes(regNumber2) || phonePrefixes3.includes(regNumber3)
        this.setState({
            phoneErr: flag1 && flag2
        }, () => {
            this.changeBtnStauts()
        })
    }

    changeBtnStauts() {
        const { recipientFirstNameErr, recipientFirstName, recipientLastName, recipientLastNameErr, houseNumberErr, houseNumber, phone, phoneErr, email, emailErr, provinceIndex, districtIndex, townIndex, postalCode } = this.state
        const { zone,
            address } = this.state
        let btnStatus = recipientFirstName.length > 0 && recipientLastName.length > 0 && houseNumber.length > 0 && phone.length > 0 && email.length > 0 && recipientFirstNameErr && recipientLastNameErr && phoneErr && emailErr && provinceIndex >= 0 && districtIndex >= 0 && townIndex >= 0 && postalCode.length > 0 && zone.length > 0 && address.length > 0
        this.setState({
            btnStatus
        })
    }

    changeArrowStatus(tag, arrowFlag) {
        this.setState({
            [tag]: arrowFlag
        })
    }

    render() {
        const { isdelteFlag, address, zone, arrowFlag1, arrowFlag2, arrowFlag3, btnStatus, emailErr, phoneErr, phoneMaxLength, shippingAddress, isAdd, houseNumberErr, recipientFirstNameErr, recipientLastNameErr, houseNumber, postalCode, phone, email, recipientFirstName, recipientLastName, checkBox, province, provinceIndex, district, districtIndex, town, townIndex } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <Modal animationType='fade' transparent={true} visible={isdelteFlag}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#01A6FF' : '#212121' }]}>
                            <Text style={styles.modalTopText}>ยืนยันการลบ</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={[styles.reasonText, { color: window.isBlue ? '#000' : '#fff' }]}>
                                คุณต้องการลบข้อมูลการจัดส่งนี้หรือไม่?
                            </Text>

                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#25AAE1' }]} onPress={() => {
                                    this.setState({
                                        isdelteFlag: false
                                    })
                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#25AAE1' }]}>ลบ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#01A6FF', borderColor: '#01A6FF' }]}
                                    onPress={() => {
                                        this.deleteShippingAddress()
                                        this.setState({
                                            isdelteFlag: false
                                        })
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>เก็บ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <KeyboardAwareScrollView>
                <Text style={styles.textInfor}>หมายเหตุ: ชื่อผู้รับจะต้องเป็นชื่อจริงเท่านั้น</Text>
                <View style={styles.inputContainer}>
                    <View style={styles.limitBox}>
                        <View style={styles.limitLists}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ชื่อจริง</Text>
                            <TextInput
                                placeholder='ชื่อ'
                                placeholderTextColor={'#C4C4C6'}
                                value={recipientFirstName}
                                maxLength={50}
                                onChangeText={this.changeInputValue.bind(this, 'recipientFirstName')}
                                style={[styles.limitListsInput, styles.limitListsInput1]} />
                            {
                                !recipientFirstNameErr && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข</Text>
                            }
                        </View>
                        <View style={styles.limitLists}>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}> </Text>
                            <TextInput
                                placeholder='นามสกุล'
                                placeholderTextColor={'#C4C4C6'}
                                value={recipientLastName}
                                maxLength={50}
                                onChangeText={this.changeInputValue.bind(this, 'recipientLastName')}
                                style={[styles.limitListsInput, styles.limitListsInput1]} />
                            {
                                !recipientLastNameErr && <Text style={[styles.limitListsInput1, { color: 'red', marginTop: 10 }]}>ไม่อนุญาตให้ใช้อักขระพิเศษ หรือตัวเลข</Text>
                            }
                        </View>
                    </View>

                    <View style={[styles.limitLists]}>
                        <View>
                            <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>เบอร์โทร</Text>
                            <TextInput
                                value={phone}
                                keyboardType='phone-pad'
                                textContentType='telephoneNumber'
                                placeholder='เบอร์ติดต่อ'
                                placeholderTextColor={'#C4C4C6'}
                                maxLength={phoneMaxLength}
                                onChangeText={value => {
                                    let phone = GetOnlyNumReg(value)
                                    // this.setState({
                                    //     phone
                                    // }, () => {
                                    //     this.changePhoneStatus(phone)
                                    // })
                                    this.changeInputValue('phone', phone)
                                }}
                                style={[styles.limitListsInput, { paddingLeft: 50 }]} />
                            <View style={styles.phoneHead}>
                                <Text style={styles.phoneHeadText}>+66</Text>
                            </View>
                        </View>
                        {
                            !phoneErr && <Text style={[{ color: 'red', marginTop: 10 }]}>หมายเลขโทรศัพท์นี้ไม่ถูกต้อง</Text>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>อีเมล</Text>
                        <TextInput
                            value={email}
                            keyboardType='email-address'
                            maxLength={50}
                            placeholder='fun88@fun88.com'
                            placeholderTextColor={'#C4C4C6'}
                            onChangeText={this.changeInputValue.bind(this, 'email')}
                            style={[styles.limitListsInput]} />
                        {
                            !emailErr && <Text style={[{ color: 'red', marginTop: 10 }]}>รูปแบบอีเมล์ไม่ถูกต้อง</Text>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>ที่อยู่</Text>
                        <TextInput
                            value={houseNumber}
                            maxLength={100}
                            placeholder='เลขที่บ้าน'
                            onChangeText={this.changeInputValue1.bind(this, 'houseNumber')}
                            style={[styles.limitListsInput, { marginBottom: 8 }]} />

                        <TextInput
                            value={zone}
                            maxLength={100}
                            placeholder='หมู่และเขต'
                            onChangeText={this.changeInputValue1.bind(this, 'zone')}
                            style={[styles.limitListsInput, { marginBottom: 8 }]} />

                        <TextInput
                            value={address}
                            maxLength={100}
                            placeholder='ที่อยู่'
                            onChangeText={this.changeInputValue1.bind(this, 'address')}
                            style={[styles.limitListsInput, { marginBottom: 8 }]} />

                    </View>

                    <View style={[styles.limitLists, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        {
                            <View style={styles.positionBox}>
                                <ModalDropdown
                                    animated={true}
                                    options={province}
                                    renderRow={this.creatProvinceList.bind(this)}
                                    onSelect={provinceIndex => {
                                        /// if (provinceIndex !== this.state.provinceIndex) {
                                        this.getDistrict(province[provinceIndex].provinceId, true)
                                        this.setState({
                                            provinceIndex
                                        }, () => {
                                            this.changeBtnStauts()
                                        })
                                        //}
                                    }}
                                    onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag1', true)}
                                    onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag1', false)}
                                    style={[styles.limitModalDropdown, styles.positionBox]}
                                    dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}
                                >
                                    <View style={styles.limitModalDropdownTextWrap}>
                                        <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{isAdd ?
                                            (provinceIndex < 0 ? '--จังหวัด--' : province[provinceIndex].provinceName) :
                                            (provinceIndex < 0 ? shippingAddress.province : province[provinceIndex].provinceName)}</Text>
                                        <ModalDropdownArrow arrowFlag={arrowFlag1} />
                                    </View>
                                </ModalDropdown>
                            </View>
                        }

                        {
                            <View style={styles.positionBox}>
                                <ModalDropdown
                                    animated={true}
                                    options={district}
                                    renderRow={this.creatDistrictList.bind(this)}
                                    onSelect={districtIndex => {
                                        // if (districtIndex !== this.state.districtIndex) {
                                        this.getTown(district[districtIndex].districtId, true)
                                        this.setState({
                                            districtIndex
                                        }, () => {
                                            this.changeBtnStauts()
                                        })
                                        // }
                                    }}
                                    onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag2', true)}
                                    onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag2', false)}
                                    disabled={!district.length}
                                    style={[styles.limitModalDropdown, styles.positionBox, { backgroundColor: window.isBlue ? (district.length ? '#fff' : '#E6E6E6') : 'transparent' }]}
                                    dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', marginLeft: -(1.05 * (width - 20)) / 3.1 }]}
                                >
                                    <View style={styles.limitModalDropdownTextWrap}>
                                        <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{isAdd ? (districtIndex < 0 ? '--อำเภอ/เขต--' : (district.length ? district[districtIndex].districtName : '--อำเภอ/เขต--')) : (

                                            districtIndex >= 0 && district[districtIndex].districtName
                                        )}</Text>
                                        <ModalDropdownArrow arrowFlag={arrowFlag2} />
                                    </View>
                                </ModalDropdown>
                            </View>
                        }
                        {
                            <View style={styles.positionBox}>
                                <ModalDropdown
                                    animated={true}
                                    options={town}
                                    renderRow={this.creatTownList.bind(this)}
                                    onSelect={townIndex => {
                                        this.setState({
                                            townIndex
                                        }, () => {
                                            this.changeBtnStauts()
                                        })
                                    }}
                                    onDropdownWillShow={this.changeArrowStatus.bind(this, 'arrowFlag3', true)}
                                    onDropdownWillHide={this.changeArrowStatus.bind(this, 'arrowFlag3', false)}
                                    disabled={!town.length}
                                    style={[styles.limitModalDropdown, styles.positionBox, { backgroundColor: window.isBlue ? (town.length ? '#fff' : '#E6E6E6') : 'transparent' }]}
                                    dropdownStyle={[styles.limitDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}
                                >
                                    <View style={styles.limitModalDropdownTextWrap}>
                                        <Text style={[styles.limitModalDropdownText, { color: window.isBlue ? '#000' : '#fff' }]}>{isAdd ? (townIndex < 0 ? '--ตำบล/แขวง--' : (town.length ? town[townIndex].townName : '--ตำบล/แขวง--')) : (
                                            townIndex >= 0 && town[townIndex].townName

                                        )}</Text>
                                        <ModalDropdownArrow arrowFlag={arrowFlag3} />
                                    </View>
                                </ModalDropdown>
                            </View>
                        }
                    </View>

                    <View style={styles.limitLists}>
                        <Text style={[styles.limitListsText, { color: window.isBlue ? '#323232' : '#fff' }]}>รหัสไปรษณีย์</Text>
                        <TextInput
                            value={postalCode}
                            onChangeText={value => {
                                let postalCode = GetOnlyNumReg(value)
                                this.setState({
                                    postalCode
                                }, () => {
                                    this.changeBtnStauts()
                                })
                            }}
                            placeholder='รหัสไปรษณีย์'
                            placeholderTextColor={'#C4C4C6'}
                            keyboardType='number-pad'
                            maxLength={10}
                            style={[styles.limitListsInput]} />
                    </View>

                    <CheckBox
                        checkBoxColor={'#25AAE1'}
                        checkedCheckBoxColor={'#25AAE1'}
                        style={{ flex: 0.9, marginTop: 5 }}
                        onClick={() => {
                            this.setState({ checkBox: !checkBox })
                        }}
                        isChecked={checkBox}
                        rightTextView={<Text style={{ color: window.isBlue ? '#000' : '#fff', fontSize: 12, marginLeft: 4 }}> ตั้งค่าข้อมูลนี้เป็นที่อยู่ในการจัดส่ง</Text>}
                    />

                    {
                        !isAdd && <View style={styles.fixDailyBox}>
                            <TouchableOpacity style={[styles.fixDailyBtnBox, { backgroundColor: btnStatus ? '#00AEEF' : (window.isBlue ? '#00AEEF' : '#00AEEF') }]} onPress={this.changeShippingAddress.bind(this)}>
                                <Text style={styles.fixDailyBtnBoxText}>เสร็จ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.fixDailyBtnBox, { backgroundColor: '#00AEEF' }]} onPress={() => {
                                this.setState({
                                    isdelteFlag: true
                                })
                            }}>
                                <Text style={[styles.fixDailyBtnBoxText, { color: '#fff' }]}>ลบ</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                {
                    isAdd && <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: btnStatus ? '#00AEEF' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={this.postShippingAddress.bind(this)}>
                        <Text style={styles.closeBtnText}>บันทึก</Text>
                    </TouchableOpacity>
                }
            </KeyboardAwareScrollView>

        </View>
    }
}

export default DailyDealAddress = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {}
    }
)(DailyDealAddressContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingTop: 20,
    },
    fixDailyBox: {
        marginTop: 5
    },
    fixDailyBtnBox: {
        width: width - 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#25AAE1',
        marginTop: 10
    },
    fixDailyBtnBoxText: {
        fontWeight: 'bold',
        color: '#fff'
    },
    phoneHead: {
        position: 'absolute',
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        bottom: 0,
    },
    phoneHeadText: {
        color: '#000'
    },
    textInfor: {
        color: '#FF0000',
        marginHorizontal: 10
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingTop: 15,
        marginTop: 10,
        paddingBottom: 100,
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        width: width - 20,
        borderRadius: 6
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    limitLists: {
        marginBottom: 10,
    },
    limitListsText: {
        marginBottom: 5,
    },
    limitListsInput: {
        // borderTopColor: '#F2F2F2',
        // borderLeftColor: '#F2F2F2',
        // borderRightColor: '#F2F2F2',
        // borderBottomColor: '#4C4C4C34',
        paddingLeft: 6,
        paddingRight: 6,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center',



        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderBottomWidth: 2,
        backgroundColor: '#fff',
        borderBottomColor: '#4C4C4C34'
    },
    limitBox: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    limitListsInput1: {
        width: (width - 20) / 2.1
    },
    limitModalDropdown: {
        width: width - 20,
        height: 40,
        borderRadius: 4,

        justifyContent: 'center',


        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderBottomWidth: 2,
        backgroundColor: '#fff',
        borderBottomColor: '#4C4C4C34'
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
        alignItems: 'center',
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
    positionBox: {
        width: (width - 20) / 3.1
    },
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#EFEFEF',
        borderRadius: 6,
        width: width * .9,
        overflow: 'hidden'
    },
    modalTop: {
        height: 42,
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#25AAE1',
        paddingLeft: 20
    },
    modalTopText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 20
    },
    modalBtnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    modalBtn: {
        height: 40,
        width: (width * .9 - 40) * .48,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    modalBtnText: {
        fontWeight: 'bold'
    },
    reasonText: {
        textAlign: 'center'
    },
    promotionListNo: {
        width: 26,
        height: 22,
        marginRight: 5
    },
})