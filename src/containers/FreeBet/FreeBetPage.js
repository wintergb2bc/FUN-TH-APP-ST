import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, Platform, ImageBackground, Modal } from 'react-native'
import { getMemberInforAction, getBalanceInforAction, changeDepositTypeAction, getFreeBetInforAction, getWithdrawalLbBankAction, getWithdrawalUserBankAction } from '../../actions/ReducerAction'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import * as Animatable from 'react-native-animatable'
import { maskPhone, RealNameReg, RealNameErrTip, GetOnlyNumReg, toThousands } from '../../actions/Reg'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ModalDropdown from 'react-native-modal-dropdown'
import FreeBetContinueModal from './FreeBetModal/FreeBetContinueModal'
import FreeBetPhoneErrModal from './FreeBetModal/FreeBetPhoneErrModal'
import DeviceInfo from 'react-native-device-info'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import LoadIngImgActivityIndicator from './../Common/LoadIngImgActivityIndicator'
import { IphoneXMax } from './../Common/CommonData'

const getModel = DeviceInfo.getModel()
const isIphoneMax = !IphoneXMax.some(v => v === getModel) && Platform.OS === 'ios'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text
const AnimatableView = Animatable.View

class FreeBetMethodContainer extends React.Component {
    constructor(props) {
        super(props)
        let fillType = this.props.fillType
        let phoneEmailCodeLength = 6
        this.state = {
            name: '',
            nameErr: false,
            fillType,
            freeGameList: [],
            bonusAmount: '',
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
            phoneEmailCodeLength,
            verificationStatus: 0,
            phoneEmailStep: false,
            isShowPhoneBtn: false,
            phoneEmailCode0: '',
            phoneEmailCode1: '',
            phoneEmailCode2: '',
            phoneEmailCode3: '',
            phoneEmailCode4: '',
            phoneEmailCode5: '',
            memberInfor: {},
            phone: '',
            phoneStatus: true,
            countdownNum: 300,
            countdownNumMMSS: '',
            isShowCountdownNumMMSS: false,
            freeBetInfor: '',
            message: '',
            banksIndex: -99,
            bankList: [],
            accountNumber: '',

            isShowFreeBetContinueModal: false,
            isShowFreeBetPhoneErrModal: false,
            arrowFlag: false,
            gameLoadObj: {}
        }
    }

    componentDidMount() {
        this.props.getFreeBetInforAction()
        !this.props.isGetFreeBet && this.props.getWithdrawalLbBankAction()
        this.getWithdrawalLbBank(this.props)
        this.getMemberContact(this.props.memberInforData)
        this.getFreeBet(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.memberInforData) {
            this.getMemberContact(nextProps.memberInforData)
        }
        this.getFreeBet(nextProps)
        this.getWithdrawalLbBank(nextProps)
    }

    componentWillUnmount() {
        this.intervalNum && clearInterval(this.intervalNum)
        this.setTimeoutHide && clearTimeout(this.setTimeoutHide)
    }

    getWithdrawalLbBank(props) {
        if (props) {
            let withdrawalLbBankData = props.withdrawalLbBankData
            if (Array.isArray(withdrawalLbBankData)) {
                this.setState({
                    bankList: withdrawalLbBankData
                })
            }
        }
    }

    getFreeBet(props) {
        if (this.props.fillType == 'name') return
        if (props && props.freeBetData) {
            const data = props.freeBetData
            this.setState({
                freeGameList: data.games,
                bonusAmount: data.bonusAmount
            })
        }
    }


    createFpBankList(item, index) {
        let flag = this.state.banksIndex * 1 === index * 1
        return <View style={[styles.toreturnModalDropdownList, { backgroundColor: flag ? '#25AAE1' : '#fff' }]} key={index}>
            <Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff'), width: width - 80 }]}>{item.Name}</Text>
        </View>
    }

    getMemberContact(memberInfor) {
        let contacts = memberInfor.Contacts || memberInfor.contacts
        if (memberInfor && contacts && contacts.length) {
            let tempPhone = contacts.find(v => v.ContactType.toLocaleLowerCase() === 'phone')
            let phoneStatus = tempPhone ? (tempPhone.Status.toLocaleLowerCase() === 'unverified' ? true : false) : true
            let phone = tempPhone ? tempPhone.Contact : ''
            this.setState({
                memberInfor,
                phone,
                phoneStatus
            })
            memberInfor.FirstName && this.setState({
                name: memberInfor.FirstName
            })
        }
    }

    submitName(type) {
        const { name, nameErr } = this.state

        if (!name) {
            Toast.fail(RealNameErrTip, 2)
            return
        }
        if (nameErr) {
            Toast.fail(RealNameErrTip, 2)
            return
        }

        const params = {
            key: 'FirstName',
            value1: name.trim(),
            value2: ''
        }
        Toast.loading('?????????????????????????????????????????????...', 20000)
        fetchRequest(ApiPort.Member, 'PATCH', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                this.submitBank(type)
            } else {
                Toast.fail('????????????????????????????????????????????????', 2)
            }
        }).catch(() => {
            Toast.hide()
        })
    }

    submitBank(type) {
        const { bankList, accountNumber, name, banksIndex, fillType } = this.state

        let params = {
            accountNumber: accountNumber,
            accountHolderName: name,
            bankName: bankList[banksIndex].Name,
            city: '',
            province: '',
            branch: '',
            type: 'W',
            isFreebet: fillType !== 'name',
            isDefault: true
        }
        Toast.loading('?????????????????????????????????????????????...', 20000)
        fetchRequest(ApiPort.MemberBanks, 'POST', params).then(data => {
            Toast.hide()
            if (data.isSuccess) {
                this.props.getWithdrawalUserBankAction()
                this.props.getMemberInforAction()
                this.setState({
                    accountNumber: '',
                    name: '',
                    banksIndex: -99,
                })
                Toast.success('??????????????????????????????????????????', 1.5, () => {
                    if (type === 'name') {
                        Actions.pop()
                        this.props.changeDepositTypeAction({
                            type: 'deposit',
                            fromPage: 'FreeBetPage'
                        })
                    } else {
                        this.view && this.view.fadeInRight(400)
                        this.setState({
                            fillType: 'gameOver'
                        })
                    }
                })
            } else {
                Toast.hide()
            }
        }).catch(error => {
            Toast.hide()
        })
    }

    submitNameBank(type) {
        const { memberInfor } = this.state
        if (memberInfor.FirstName) {
            this.submitBank(type)
        } else {
            this.submitName(type)
        }
    }

    changePhoneInput(i, val) {
        let v = val.replace(/[^0-9]/g, '')
        //this.refs[`focus${i}`].blur()
        if ((i + 1) < this.state.phoneEmailCodeLength && (v + '')) {
            this.refs[`focus${i + 1}`].focus()
        }
        this.setState({
            [`phoneEmailCode${i}`]: v
        })
        this.state.phoneEmailCodeArr[i] = v
    }

    getPhoneVerifyCode(flag) {
        const { phone, memberInfor, phoneStatus } = this.state
        if (!phoneStatus) {
            this.view && this.view.fadeInRight(400)
            this.setState({
                fillType: 'bank'
            })
            return
        }

        this.clearEmailPhoneCode(true)
        this.setState({
            message: '',
            isShowPhoneBtn: false,
            verificationStatus: 0
        })
        const data = {
            MsIsdn: phone,
            IsRegistration: false,
            IsOneTimeService: false,
            MemberCode: memberInfor.UserName,
            CurrencyCode: 'THB',
            SiteId: Platform.OS === 'android' ? 16 : 17,
            IsMandatoryStep: true,
            ServiceAction: 'ContactVerification',
        }
        Toast.loading('????????????????????????, ??????????????????????????????????????????', 20000)
        fetchRequest(ApiPort.GetPhoneVerifyCode, 'POST', data).then(res => {
            Toast.hide()
            if (res.isSuccess && res.result && res.result.smsSent) {
                this.setState({
                    phoneEmailStep: true
                }, () => {
                    this.refs[`focus0`].focus()
                    this.makeNumInterval()
                })
            } else {
                if (res.result) {
                    let message = res.result.message
                    // this.setState({
                    //     message
                    // })
                    if (res.result.errorCode.toLocaleUpperCase().includes('SMS004')) {
                        this.setState({
                            isShowFreeBetPhoneErrModal: true
                        })
                    } else {
                        message && Toast.fail(message, 2)
                    }
                }
            }
        }).catch(err => {
            Toast.hide()
        })
        window.PiwikMenberCode(flag ? 'Freebet_SendOTP_SMS' : 'Freebet_OTPSwitch_SMS')
    }

    sendPhoneVerifyCode() {
        const { phoneEmailCodeArr, phoneEmailCodeLength, phone, memberInfor } = this.state

        if (phoneEmailCodeArr.filter(Boolean).length !== phoneEmailCodeLength) {
            this.setState({
                message: '??????????????????????????????????????? OTP '
            })
            return
        }

        this.setState({
            message: '',
            verificationStatus: 0
        })

        const data = {
            VerificationCode: phoneEmailCodeArr.join(''),
            MsIsdn: phone,
            IsRegistration: false,
            ServiceAction: 'ContactVerification',// ContactVerification
            SiteId: Platform.OS === 'android' ? 16 : 17,
            MemberCode: memberInfor.UserName,
            IsMandatoryStep: false
        }
        Toast.loading('????????????????????????, ??????????????????????????????????????????', 20000)
        fetchRequest(ApiPort.PostPhoneVerifyCode, 'POST', data).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                // if (this.props.isGetFreeBet) {
                //     Actions.pop()
                //     return
                // }
                this.props.getMemberInforAction()
                this.intervalNum && clearInterval(this.intervalNum)
                this.setState({
                    verificationStatus: 1
                })
                clearInterval(this.intervalNum)
                if (res.result) {
                    let message = res.result.message || 'S??? ??i???n Tho???i ???? X??c Th???c'
                    this.setState({
                        message
                    })
                }
            } else {
                this.setState({
                    verificationStatus: 2
                })
                this.setTimeoutHide = setTimeout(() => {
                    this.clearEmailPhoneCode()
                }, 1500)
                if (res.result) {
                    let message = res.result.message || 'M?? x??c th???c OTP kh??ng tr??ng kh???p v???i h??? th???ng.'
                    this.setState({
                        message
                    })
                }
            }
        }).catch(err => {
            Toast.hide()
        })

        window.PiwikMenberCode('Freebet_SubmitOTP')
    }

    makeNumInterval() {
        this.setState({
            isShowCountdownNumMMSS: true
        })
        function addZero(n) {
            return n < 10 ? '0' + n : n
        }
        let countdownNum = this.state.countdownNum
        this.intervalNum = setInterval(() => {
            if (countdownNum !== 0) {
                countdownNum--
                this.setState({
                    countdownNum
                })
                let min = addZero(Math.floor(countdownNum / 60 % 60))
                let sec = addZero(Math.floor(countdownNum % 60))
                this.setState({
                    countdownNumMMSS: min + ':' + sec
                })
            } else {
                this.setState({
                    countdownNum: 300,
                    message: '',
                    emailPhoneCodeArr: Array.from({ length: this.state.phoneEmailCodeLength }, v => ''),
                    isShowCountdownNumMMSS: false,
                    isShowPhoneBtn: true
                })
                this.clearEmailPhoneCode(true)
                clearInterval(this.intervalNum)
            }
        }, 1000)
    }

    clearEmailPhoneCode(flag) {
        const { phoneEmailCodeLength } = this.state
        for (let i = 0; i < phoneEmailCodeLength; i++) {
            this.setState({
                [`phoneEmailCode${i}`]: ''
            })
        }
        this.setState({
            //message: '',
            verificationStatus: 0,
            phoneEmailCodeArr: Array.from({ length: phoneEmailCodeLength }, v => ''),
        })
        flag && this.setState({
            message: ''
        })
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    freeBetPlayGame({ targetWallet }, i) {
        const { phoneStatus } = this.state
        Toast.loading('?????????????????????????????????????????????...', 20000)
        fetchRequest(ApiPort.PostSetFreeBetWallet + 'wallet=' + targetWallet + '&', 'POST').then(data => {
            if (data.isSuccess) {
                this.props.getMemberInforAction()
                Toast.success(data.message, 2)
                if (this.props.isGetFreeBet) {
                    this.view && this.view.fadeInRight(400)
                    this.setState({
                        fillType: phoneStatus ? 'phone' : 'bank'
                    })
                } else {
                    this.view && this.view.fadeInRight(400)
                    this.setState({
                        fillType: phoneStatus ? 'phone' : 'bank'
                    })
                }
            } else {
                Toast.fail(data.message, 2)
            }
        }).catch(error => {
            Toast.hide()
        })

        window.PiwikMenberCode(`Referred_Passed_wallet${i}`)
        window.PiwikMenberCode(`Product${i}_recommend`)
    }

    changeFreeBetContinueModal(isShowFreeBetContinueModal) {
        this.setState({
            isShowFreeBetContinueModal
        })
    }

    changeFreeBetPhoneErrModal(isShowFreeBetPhoneErrModal) {
        this.setState({
            isShowFreeBetPhoneErrModal
        })
    }

    getLoadImgStatus(i, flag) {
        this.state.gameLoadObj[`imgStatus${i}`] = flag
        this.setState({})
    }

    handleViewRef = ref => this.view = ref

    createBnakName(type) {
        const { memberInfor, name, nameErr, bankList, accountNumber, banksIndex, arrowFlag } = this.state
        return <View>
            <View style={styles.limitLists}>
                <Text style={styles.boclkInforText}>H??? v?? T??n</Text>
                <TextInput
                    style={[styles.limitListsInput, { backgroundColor: memberInfor.FirstName ? '#EFEFEF' : '#fff' }]}
                    autoComplete='username'
                    maxLength={20}
                    textContentType='username'
                    value={name}
                    editable={!memberInfor.FirstName}
                    autoCapitalize='none'
                    onChangeText={name => {
                        let nameErr = !(RealNameReg.test(name) && name.trim().length > 0)
                        this.setState({
                            name,
                            nameErr
                        })
                    }}
                    placeholderTextColor='#B7B7B7'
                    maxLength={50}
                    placeholder='John Wick'
                />
                {
                    nameErr && <Text style={{ color: 'red', marginTop: 10 }}>{RealNameErrTip}</Text>
                }
            </View>


            {
                Array.isArray(bankList) && bankList.length > 0 && <View style={styles.limitLists}>
                    <Text style={styles.boclkInforText}>Ng??n H??ng R??t Ti???n</Text>
                    <ModalDropdown
                        animated={true}
                        options={bankList}
                        renderRow={this.createFpBankList.bind(this)}
                        onSelect={banksIndex => {
                            this.setState({
                                banksIndex
                            })
                        }}
                        onDropdownWillShow={() => {
                            this.changeArrowStatus(true)
                            window.PiwikMenberCode('Freebet_Updatewithdrawal_banklist')
                        }
                        }
                        onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
                        style={[styles.toreturnModalDropdown]}
                        dropdownStyle={[styles.toreturnDropdownStyle, { height: bankList.length < 10 ? bankList.length * 30 : 300 }]}
                    >
                        <View style={[styles.targetWalletBox]}>
                            <Text style={[styles.toreturnModalDropdownText, { color: banksIndex >= 0 ? '#000' : '#B7B7B7' }]}>{banksIndex >= 0 ? bankList[banksIndex].Name : 'Vui l??ng ch???n'}</Text>
                            <ModalDropdownArrow arrowFlag={arrowFlag} />
                        </View>
                    </ModalDropdown>
                </View>
            }

            <View style={styles.limitLists}>
                <Text style={styles.boclkInforText}>S??? T??i Kho???n Ng??n H??ng R??t Ti???n</Text>
                <TextInput
                    value={accountNumber}
                    keyboardType='decimal-pad'
                    onChangeText={value => {
                        let accountNumber = GetOnlyNumReg(value)
                        this.setState({
                            accountNumber
                        })
                    }}
                    placeholderTextColor='#B7B7B7'
                    placeholder='Ex: 12345678910'
                    style={[styles.limitListsInput]} />
            </View>

            <TouchableOpacity
                style={[styles.freeBtn, {
                    backgroundColor: (name.length > 0 && !nameErr && accountNumber.length > 0 && banksIndex >= 0) ? '#25AAE1' : '#B7B7B7',
                    borderColor: (name.length > 0 && !nameErr && accountNumber.length > 0 && banksIndex >= 0) ? '#25AAE1' : '#B7B7B7',
                }]}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={() => {
                    if (name.length > 0 && !nameErr && accountNumber.length > 0 && banksIndex >= 0) {
                        this.submitNameBank(type)
                        window.PiwikMenberCode('Freebet_Updatewithdrawal')
                    }
                }}>
                <Text style={styles.freeBtnText}>Nh???n Khuy???n M??i</Text>
            </TouchableOpacity>
        </View>
    }

    render() {
        const { isShowFreeBetPhoneErrModal, isShowFreeBetContinueModal, bonusAmount, freeGameList, fillType, verificationStatus, phoneEmailCodeLength, message, isShowCountdownNumMMSS, phoneEmailStep, phoneEmailCodeArr, phone, countdownNumMMSS } = this.state
        //const fillType = 'gameOver'
        return <View style={[styles.viewContainer]}>
            {
                isShowFreeBetContinueModal && <FreeBetContinueModal
                    changeFreeBetContinueModal={this.changeFreeBetContinueModal.bind(this)}
                />
            }

            {
                isShowFreeBetPhoneErrModal && <FreeBetPhoneErrModal
                    changeFreeBetPhoneErrModal={this.changeFreeBetPhoneErrModal.bind(this)}
                />
            }

            <KeyboardAwareScrollView>
                <ImageBackground
                    source={require('./../../images/freeBet/freebetContactTopBg.png')}
                    resizeMode='stretch'
                    style={[styles.freebetContactTopBg]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.changeFreeBetContinueModal(true)

                            fillType === 'phone' && window.PiwikMenberCode(verificationStatus === 1 ? 'Freebet_OTP_CS' : 'Freebet_SendOTP_close')
                            fillType === 'bank' && window.PiwikMenberCode('Freebet_Updatewithdrawal_close')
                            fillType === 'name' && window.PiwikMenberCode('Journey_verifyname_close')
                            fillType === 'gameOver' && window.PiwikMenberCode('Bonusprocessing_close')
                        }}
                        style={styles.closeBtnTop}
                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                        <Text style={styles.closeBtnTopText}>X</Text>
                    </TouchableOpacity>

                    {
                        fillType == 'name' && <View>
                            <View style={styles.freeTopInfor}>
                                <View style={[styles.freeTopBody, { paddingTop: 40 }]}>
                                    <Image
                                        source={require('./../../images/freeBet/freeName.png')}
                                        resizeMode='stretch'
                                        style={styles.freeName}
                                    ></Image>
                                    <Text style={styles.freePhoneText1}>H??y Cho Ch??ng T??i Bi???t H??? T??n C???a B???n</Text>
                                    <Text style={styles.freePhoneText2}>Ch??? c??n 1 b?????c ????? nh???n th?????ng. Vui l??ng ?????m b???o th??ng tin ???????c ??i???n ch??nh x??c</Text>
                                </View>
                            </View>
                        </View>
                    }

                    {
                        fillType == 'phone' && <View>
                            <View style={styles.freeTopInfor}>
                                <Text style={styles.freeTopInforText}>Nh???n {toThousands(bonusAmount)} C?????c Mi???n Ph??!</Text>
                            </View>
                            <View style={styles.numPageWrap}>
                                <View style={styles.circleWrap}>
                                    <Text style={styles.circleText}>1</Text>
                                </View>
                                <View style={[styles.circleLine, styles.circleLine1]}></View>
                            </View>
                            <View style={styles.freeTopBody}>
                                <Image
                                    source={require('./../../images/freeBet/freePhone.png')}
                                    resizeMode='stretch'
                                    style={styles.freePhone}
                                ></Image>
                                <Text style={styles.freePhoneText1}>X??c th???c s??? ??i???n tho???i di ?????ng</Text>
                                <Text style={styles.freePhoneText2}>X??c th???c s??? ??i???n tho???i di ?????ng ????? ???????c c???p nh???t tin t???c v?? khuy???n m??i m???i nh???t t??? Fun88.</Text>
                            </View>
                        </View>
                    }

                    {
                        fillType == 'bank' && <View>
                            <View style={styles.freeTopInfor}>
                                <Text style={styles.freeTopInforText}>Nh???n 88,000 C?????c Mi???n Ph??!</Text>
                            </View>
                            <View style={styles.numPageWrap}>
                                <View style={styles.circleWrap}>
                                    <Text style={styles.circleText}>2</Text>
                                </View>
                                <View style={[styles.circleLine, styles.circleLine2]}></View>
                            </View>
                            <View style={styles.freeTopBody}>
                                <Image
                                    source={require('./../../images/freeBet/freeName.png')}
                                    resizeMode='stretch'
                                    style={styles.freeName}
                                ></Image>
                                <Text style={styles.freePhoneText1}>H??y Cho Ch??ng T??i Bi???t H??? T??n C???a B???n</Text>
                                <Text style={styles.freePhoneText2}>Ch??? c??n 1 b?????c ????? nh???n th?????ng. Vui l??ng ?????m b???o th??ng tin ???????c ??i???n ch??nh x??c</Text>
                            </View>
                        </View>
                    }

                    {
                        fillType == 'game' && <View>
                            <View style={styles.freeTopBody}>
                                <Image
                                    source={require('./../../images/freeBet/freeGame.png')}
                                    resizeMode='stretch'
                                    style={styles.freeGame}
                                ></Image>
                                <Text style={styles.freePhoneText1}>B???n ???? s???n s??ng tham gia c??ng ch??ng t??i?</Text>
                                <Text style={styles.freePhoneText2}>Vui l??ng ch???n v?? ti???n g???i ??, ti???n th?????ng s??? ???????c c???p nh???t v??o v?? ti???n ???? ch???n. Nh???p ti???p theo ????? ?????n b?????c k??? ti???p</Text>
                            </View>
                        </View>
                    }

                    {
                        fillType == 'gameOver' && <View>
                            <View style={styles.freeTopBody}>
                                <Image
                                    source={require('./../../images/freeBet/freeGame.png')}
                                    resizeMode='stretch'
                                    style={styles.freeGame}
                                ></Image>
                                <Text style={styles.freePhoneText1}>Y??u c???u Nh???n C?????c Mi???n Ph??</Text>
                                <Text style={styles.freePhoneText1}>??ang ???????c ti???n h??nh.</Text>
                            </View>
                        </View>
                    }
                </ImageBackground>

                <AnimatableView style={[styles.viewPageContainer]} ref={this.handleViewRef}>
                    {
                        fillType === 'name' && <View>
                            <View style={styles.viewModalTopTipBox}>
                                <Text style={styles.viewModalTopTipBoxText}>S??? ??i???n tho???i di ?????ng ch??? ???????c ph??p thay ?????i 1 l???n. Vui l??ng nh???p s??? ??i???n tho???i ch??nh x??c ????? nh???n c?????c mi???n ph??.</Text>
                            </View>
                            {
                                this.createBnakName('name')
                            }
                        </View>
                    }

                    {
                        fillType == 'phone' && <View>
                            <View>
                                <Text style={styles.boclkInforText}>S??? ??i???n Tho???i Di ?????ng</Text>
                                {
                                    phone.length > 0 && <View style={[styles.phoneTopBox]}>
                                        <View style={[styles.phoneHeadBox]}>
                                            <Text style={[styles.phoneHeadBoxText]}>+66</Text>
                                        </View>
                                        <TextInput
                                            style={[styles.limitListsInput, { width: width - 20 - 40 - 10, borderColor: !phoneEmailStep ? '#B7B7B7' : '#EFEFEF', backgroundColor: !phoneEmailStep ? '#fff' : '#EFEFEF' }]}
                                            autoComplete='username'
                                            maxLength={20}
                                            textContentType='username'
                                            value={!phoneEmailStep ? phone.split('-')[1] : maskPhone(phone.split('-')[1])}
                                            autoCapitalize='none'
                                            editable={false}
                                        />
                                    </View>
                                }

                                {
                                    !phoneEmailStep && <Text style={styles.phoneChangeText1}>????? c???p nh???t s??? ??i???n tho???i vui l??ng li??n h??? <Text
                                        onPress={() => {
                                            Actions.LiveChat()
                                        }} style={styles.phoneChangeText2}>????????????????????????????????????????????????</Text></Text>
                                }
                                {
                                    message.length > 0 && verificationStatus == 0 && !phoneEmailStep && <Text style={[styles.errorText, { color: '#FF0000' }]}>{message}</Text>
                                }
                            </View>


                            {
                                !phoneEmailStep && <View>
                                    <View style={{ marginTop: 20 }}>
                                        <TouchableOpacity style={styles.freeBtn} hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} onPress={this.getPhoneVerifyCode.bind(this, true)}>
                                            <Text style={styles.freeBtnText}>G???i m?? qua tin nh???n SMS</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }

                            {
                                phoneEmailStep && <View>
                                    <TouchableOpacity style={[styles.phonesupportBox]} onPress={() => {
                                        Actions.LiveChat()
                                    }}>
                                        <Image source={require('./../../images/common/supportCS.png')} resizeMode='stretch' style={styles.phonesupportBoxImg}></Image>
                                        <Text style={styles.phonesupportBoxText}>Tr?????ng h???p b???n mu???n thay ?????i s??? ??i???n tho???i, vui l??ng li??n h??? B??? Ph???n ????????????????????????????????????????????????</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.step2Text}>Ch??ng t??i ???? g???i m?? x??c th???c ?????n s??? ??i???n tho???i c???a b???n</Text>
                                    <View style={styles.phoneInputWrap}>
                                        {
                                            phoneEmailCodeArr.map((v, i) => {
                                                return <TextInput
                                                    ref={`focus${i}`}
                                                    key={i}
                                                    value={this.state[`phoneEmailCode${i}`]}
                                                    style={[styles.phoneInput,
                                                    {
                                                        borderColor: verificationStatus == 0 ? '#D4D4D4' : (verificationStatus == 1 ? '#00C507' : '#FF0000')
                                                    }]}
                                                    maxLength={1}
                                                    keyboardType={'number-pad'}
                                                    onChangeText={this.changePhoneInput.bind(this, i)}></TextInput>
                                            })
                                        }
                                    </View>

                                    {
                                        message.length > 0 && <Text style={[styles.errorText, { color: verificationStatus == 0 ? '#FF0000' : (verificationStatus == 1 ? '#00C507' : '#FF0000'), marginBottom: 10 }]}>{message}</Text>
                                    }


                                    {
                                        verificationStatus != 1 && <Text style={[styles.resetCodeText1]}>G???i l???i m?? x??c th???c trong v??ng {countdownNumMMSS} <Text
                                            onPress={() => {
                                                !isShowCountdownNumMMSS && this.getPhoneVerifyCode(false)
                                            }}
                                            style={[styles.resetCodeText2, { color: isShowCountdownNumMMSS ? '#B7B7B7' : '#00C507' }]}>G???I L???I M??</Text></Text>
                                    }

                                    {
                                        verificationStatus == 1 ?
                                            <View>
                                                <TouchableOpacity
                                                    style={[styles.freeBtn]}
                                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                    onPress={() => {
                                                        this.view && this.view.fadeInRight(400)
                                                        this.setState({
                                                            fillType: 'bank'
                                                        })

                                                        window.PiwikMenberCode('Freebet_Submit_gostep2')
                                                    }}>
                                                    <Text style={styles.freeBtnText}>Ti???p Theo</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View>
                                                <TouchableOpacity
                                                    style={[styles.freeBtn, {
                                                        backgroundColor: phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength ? '#25AAE1' : '#B7B7B7',
                                                        borderColor: phoneEmailCodeArr.filter(Boolean).length == phoneEmailCodeLength ? '#25AAE1' : '#B7B7B7'
                                                    }]}
                                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                    onPress={this.sendPhoneVerifyCode.bind(this)}>
                                                    <Text style={styles.freeBtnText}>X??c Th???c</Text>
                                                </TouchableOpacity>
                                                {/* <TouchableOpacity
                                                    style={[styles.freeBtn, {
                                                        borderColor: isShowPhoneBtn ? '#25AAE1' : '#B7B7B7',
                                                        backgroundColor: '#fff'
                                                    }]}
                                                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                                                    onPress={() => {
                                                        isShowPhoneBtn && this.getPhoneVerifyCode(false)
                                                    }}>
                                                    <Text style={[styles.freeBtnText, { color: isShowPhoneBtn ? '#25AAE1' : '#B7B7B7' }]}>G???i m?? qua cu???c g???i</Text>
                                                </TouchableOpacity> */}
                                            </View>
                                    }

                                </View>
                            }
                        </View>
                    }

                    {
                        fillType == 'bank' && <View>
                            <View style={styles.viewModalTopTipBox}>
                                <Text style={styles.viewModalTopTipBoxText}>H??? t??n th???t kh??ng th??? thay ?????i. H??? t??n th???t c???n ph???i tr??ng kh???p v???i h??? t??n t??i kho???n ng??n h??ng.</Text>
                            </View>

                            {
                                this.createBnakName('bank')
                            }
                        </View>
                    }

                    {
                        fillType == 'game' && <View>
                            <Text style={[styles.boclkInforText1, { marginTop: 5 }]}>Tr?? Ch??i ????? Xu???t</Text>
                            <View>
                                {
                                    Array.isArray(freeGameList) && freeGameList.length > 0 && freeGameList.map((v, i) => {
                                        return <TouchableOpacity
                                            key={i}
                                            style={styles.bounsGameBox}
                                            onPress={this.freeBetPlayGame.bind(this, v, i + 1)}
                                        >
                                            <ImageBackground
                                                resizeMode='stretch'
                                                source={{ uri: v.imageUrl }}
                                                style={styles.bounsGameBox1}
                                                onLoadStart={this.getLoadImgStatus.bind(this, i, false)}
                                                onLoadEnd={this.getLoadImgStatus.bind(this, i, true)}
                                                defaultSource={window.isBlue ? require('./../../images/common/loadIcon/loadinglight.jpg') : require('./../../images/common/loadIcon/loadingdark.jpg')}
                                            >
                                                {
                                                    !this.state.gameLoadObj[`imgStatus${i}`] && <LoadIngImgActivityIndicator />
                                                }
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    })
                                }
                            </View>
                        </View>
                    }


                    {
                        fillType == 'gameOver' && <View>
                            <Text style={styles.gameOverText}>B???n s??? nh???n ???????c th??ng b??o khi th?????ng c?? c???p nh???t v??? th??ng tin c?????c mi???n ph??</Text>

                            <Text style={styles.gameOverText}>Nh???p <Text
                                onPress={() => {
                                    Actions.pop()
                                    Actions.PreferentialRecords()
                                }}
                                style={styles.gameOverText2}>v??o ????y</Text> ????? xem tr???ng th??i</Text>
                        </View>
                    }
                </AnimatableView>
            </KeyboardAwareScrollView>
            <TouchableOpacity style={styles.backConatiner} onPress={() => {
                Actions.pop()
                fillType === 'phone' && window.PiwikMenberCode('Freebet_SendOTP_SMSLater')
                fillType === 'bank' && window.PiwikMenberCode('Freebet_Updatewithdrawal_later')
                fillType === 'game' && window.PiwikMenberCode('Product_recommend_homepage')
                fillType === 'gameOver' && window.PiwikMenberCode('Bonusprocessing_Main')
            }}>
                <Text style={styles.backConatinerText}>{!fillType.includes('game') ? 'X??c Th???c Sau' : 'Tr??? V??? Trang Ch???'}</Text>
            </TouchableOpacity>
        </View>
    }
}

export default FreeBetPage = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            freeBetData: state.freeBetData,
            withdrawalLbBankData: state.withdrawalLbBankData
        }
    }, (dispatch) => {
        return {
            getWithdrawalLbBankAction: () => dispatch(getWithdrawalLbBankAction()),
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            getBalanceInforAction: () => dispatch(getBalanceInforAction()),
            getFreeBetInforAction: () => dispatch(getFreeBetInforAction()),
            getWithdrawalUserBankAction: () => dispatch(getWithdrawalUserBankAction()),
        }
    }
)(FreeBetMethodContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    freebetContactTopBg: {
        width: width,
        height: width * .7,
        paddingHorizontal: 10,
        paddingTop: isIphoneMax ? 45 : 25
    },
    freeTopInfor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    freeGame: {
        width: 68,
        height: 68,
        marginTop: 30,
    },
    freeTopInforText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center'
    },
    closeBtnTop: {
        position: 'absolute',
        width: 35,
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10000,
        top: isIphoneMax ? 40 : 20,
        right: 10,
        zIndex: 1000
    },
    closeBtnTopText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold'
    },
    numPageWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 12,
    },
    circleWrap: {
        backgroundColor: '#fff',
        borderRadius: 200,
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        borderColor: '#5ED0FF',
        borderWidth: 5,
    },
    gameOverText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#232323'
    },
    gameOverText2: {
        color: '#25AAE1',
        textDecorationLine: 'underline'
    },
    circleText: {
        color: '#25AEE1',
        fontWeight: 'bold',
        fontSize: 16
    },
    circleLine: {
        height: 2,
        backgroundColor: '#fff',
        width: width / 2,
        position: 'absolute',
    },
    circleLine1: {
        right: -10
    },
    circleLine2: {
        left: -10
    },
    freeTopBody: {
        alignItems: 'center'
    },
    freePhone: {
        width: 40,
        height: 40 * 1.545
    },
    freeName: {
        width: 60,
        height: 60 * .761,
        marginBottom: 10
    },
    freePhoneText1: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
        fontSize: 16,
        marginBottom: 2
    },
    freePhoneText2: {
        textAlign: 'center',
        color: '#fff',
    },
    viewPageContainer: {
        marginHorizontal: 10,
        marginTop: 12
    },
    boclkInforText: {
        fontWeight: 'bold',
        marginTop: 4,
        marginBottom: 8,
        color: '#000'
    },
    phoneTopBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        borderRadius: 2,
    },
    phoneHeadBox: {
        height: 40,
        width: 40,
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    phoneHeadBoxText: {
        color: '#000'
    },
    freeBtn: {
        height: 42,
        backgroundColor: '#25AAE1',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    freeBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    phonesupportBox: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#25AAE1',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginTop: 10,
        borderRadius: 6
    },
    phonesupportBoxImg: {
        width: 30,
        height: 30,
        marginRight: 8
    },
    phonesupportBoxText: {
        color: '#25AAE1',
        fontSize: 12,
        flexWrap: 'wrap',
        width: width - 80
    },
    step2Text: {
        color: '#000',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10
    },
    phoneInputWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    phoneInput: {
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#D4D4D4',
        width: 40,
        height: 40,
        textAlign: 'center',
        color: '#000',
        marginBottom: 5
    },
    phoneChangeText1: {
        color: '#25AAE1',
        marginTop: 15
    },
    phoneChangeText2: {
        textDecorationLine: 'underline'
    },
    errorText: {
        color: '#FF0000',
        marginTop: 15,
        textAlign: 'center'
    },
    resetCodeText1: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 2,
        color: '#000'
    },
    resetCodeText2: {
        textDecorationLine: 'underline'
    },
    viewModalTopTipBox: {
        backgroundColor: '#FFD9D9',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E12525',
        borderRadius: 6,
        marginBottom: 5
    },
    viewModalTopTipBoxText: {
        color: '#E12525',
        fontSize: 12,
        flexWrap: 'wrap',
        textAlign: 'center'
    },
    limitLists: {
        marginBottom: 8,
    },
    toreturnModalDropdown: {
        justifyContent: 'center',
    },
    toreturnDropdownStyle: {
        marginTop: 10,
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
        backgroundColor: '#fff'
    },
    targetWalletBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 40,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        alignItems: 'center',
        borderRadius: 4,
    },
    limitListsInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 14,
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        borderColor: '#B7B7B7',
    },
    toreturnModalDropdownList: {
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6
    },
    toreturnModalDropdownListText: {
        flexWrap: 'wrap',
    },
    bounsGameBox: {
        marginBottom: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    bounsGameBox1: {
        alignItems: 'center',
        justifyContent: 'center',
        width: (width - 20),
        height: (width - 20) * .24,
    },
    boclkInforText1: {
        textAlign: 'center',
        color: '#232323',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15
    },
    backConatinerText: {
        color: '#25AAE1',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center'
    },
    backConatiner: {
        alignItems: 'center',
        height: 40,
        justifyContent: 'center',
        width,
        position: 'absolute',
        bottom: 15
    },
})