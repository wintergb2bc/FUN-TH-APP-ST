import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Dimensions, TextInput, Image, Modal, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from '@/containers/Toast'
import CheckBox from 'react-native-check-box'
import { GetOnlyNumReg, RealNameReg, RealNameErrTip, ProvinceReg, CityReg, BranchReg, getName } from './../../../../actions/Reg'
import ModalDropdownArrow from './../../../Common/ModalDropdownArrow'
import { getMemberInforAction, getDepositUserBankAction, getWithdrawalUserBankAction, getDepositLbBankAction, getWithdrawalLbBankAction } from './.././../../../actions/ReducerAction'
import RedStar from './../../../Common/RedStar'
const { width, height } = Dimensions.get('window')
const RegObj = {
    accountHolderName: RealNameReg,
    province: ProvinceReg,
    city: CityReg,
    branch: BranchReg
}
import RdBindReverseDepositAccountModal from './RdBindReverseDepositAccountModal'
import * as Animatable from 'react-native-animatable'
const AnimatableView = Animatable.View
class RdDepositContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bankList: [],
            bankListTemp: [],
            bankId: -9999,
            bankType: this.props.bankType,//提款或充值银行卡
            accountHolderName: '',
            accountHolderNameErr: true,
            accountNumber: '',
            province: '',//省份
            provinceErr: true,
            city: '',//城市
            cityErr: true,
            branch: '',//分行
            branchErr: true,
            addDisalbed: false,
            checkBox: false,
            arrowFlag: false,
            name: '',
            eligible: false,
            isFocusName: false,
            isFocusNumber: false,
            isShowRecommendTip: false,
            searchText: '',
            isShowBankFilter: false,
            isRdBindReverseDepositAccountModal: false,
            description: '',
            errorCode: ''
        }
    }

    componentDidMount() {
        this.getMemberData(this.props.memberInforData)
        if (this.props.bankType === 'D') {
            this.props.getDepositLbBankAction()
            this.getDepositLbBank(this.props)
        }

        // if (this.props.bankType === 'W') {
        //     this.props.getWithdrawalLbBankAction()
        //     this.getWithdrawalLbBank(this.props)
        // }
    }

    componentWillReceiveProps(nextProps) {
        this.getMemberData(nextProps.memberInforData)
        this.props.bankType === 'D' && this.getDepositLbBank(nextProps)
        //this.props.bankType === 'W' && this.getWithdrawalLbBank(nextProps)
    }

    componentWillUnmount() {
        this.props.depositSelect && this.props.depositSelect()
    }

    getDepositLbBank(props) {
        if (props) {
            let depositLbBankData = props.depositLbBankData
            if (Array.isArray(depositLbBankData)) {
                this.setState({
                    bankList: depositLbBankData,
                    bankListTemp: depositLbBankData
                })
            }
        }
    }

    getWithdrawalLbBank(props) {
        if (props) {
            let withdrawalLbBankData = props.withdrawalLbBankData
            if (Array.isArray(withdrawalLbBankData)) {
                this.setState({
                    bankList: withdrawalLbBankData,
                    bankListTemp: depositLbBankData
                })
            }
        }
    }

    getMemberData(memberInforData) {
        if (!memberInforData.MemberCode) return
        this.setState({
            name: memberInforData.FirstName,
            accountHolderName: memberInforData.FirstName
        })

        let freeBetStatus = memberInforData.freeBetStatus
        if (freeBetStatus) {
            this.setState({
                eligible: freeBetStatus.eligible,
            })
        }
    }

    accountDropdown(item, index) {
        let flag = this.state.bankId * 1 === index * 1
        return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
            <Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.Name}</Text>
        </View>
    }

    //添加
    addBank() {
        window.PiwikMenberCode('Deposit', 'Click', `AddBank_LBExpress`)
        const { bankList, addDisalbed, accountNumber, accountHolderName, city, province, branch, bankId, checkBox } = this.state
        if (!addDisalbed) { return '' }
        let bankName = bankList.find(v => v.Id == bankId).Name
        let params = {
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bankName,
            city: city,
            province: province,
            branch: branch,
            type: 'D',
            isDefault: true
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.MemberBanks, 'POST', params).then(data => {
            Toast.hide()
            if (data.isSuccess) {
                Toast.success('เพิ่มบัญชีสำเร็จ​')
                let bankNameNumber = bankName + '-' + accountNumber.trim()
                this.getBankList(bankNameNumber)
            } else {
                data.message && Toast.fail(data.message)
            }
            //this.props.getDepositUserBankAction()
            //this.PostBindReverseDepositAccount(bankList.find(v => v.Id == bankId).Id)
        }).catch(error => {
            Toast.hide()
        })
    }


    getBankList(bankNameNumber) {
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetMemberBanks + '?AccountType=Deposit&', 'GET').then(res => {
            Toast.hide()
            if (Array.isArray(res)) {
                let depositBank = res

                let defaultBank = depositBank.find(v => v.IsDefault)
                if (defaultBank) {
                    let defaultBankIndex = depositBank.findIndex(v => v.IsDefault)
                    depositBank.splice(defaultBankIndex, 1)
                    depositBank.unshift(defaultBank)
                }

                //this.props.getDepositUserBankAction(res)

                let bankCodeList = depositBank.find(v => v.Name == bankNameNumber)
                let bankCode = bankCodeList.Code

                this.PostBindReverseDepositAccount(bankCode)
                global.storage.save({
                    key: 'depositUserBank',
                    id: 'depositUserBank',
                    data: depositBank,
                    expires: null
                })
            } else {
                global.storage.save({
                    key: 'depositUserBank',
                    id: 'depositUserBank',
                    data: [],
                    expires: null
                })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }


    PostBindReverseDepositAccount(Id) {
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostBindReverseDepositAccount + `bankId=${Id}&`, 'POST').then(data => {
            Toast.hide()

            if (!data.isSuccess) {
                let errors = data.errors
                if (Array.isArray(errors) && errors.length) {
                    let errors0 = errors[0]
                    let { description, errorCode } = errors0
                    this.setState({
                        description,
                        errorCode,
                        isRdBindReverseDepositAccountModal: true
                    })
                }
            } else {
                Toast.success('เพิ่มบัญชีสำเร็จ​')
                Actions.pop()
            }
        })
    }

    changeInputValue(type, value) {
        let Err = RegObj[type].test(value)
        this.setState({
            [`${type}Err`]: Err,
            [type]: value
        }, () => {
            this.changeBtnStatus()
        })
    }

    changeBtnStatus() {
        const { accountHolderName, accountHolderNameErr, province, provinceErr, city, cityErr, branch, branchErr, accountNumber, bankId } = this.state
        let falg = this.props.fromPage === 'LbDeposit' ? true : (provinceErr && province.length > 0 && cityErr && branchErr && city.length > 0 && branch.length > 0)
        let addDisalbed = bankId != -9999 && accountNumber.length >= 10 && accountNumber.length <= 19
        this.setState({
            addDisalbed
        })
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    changeSearchTextValue(searchText) {
        const { bankList } = this.state
        let bankListTemp = bankList.filter(v => v.Name.toLocaleUpperCase().includes(searchText.toLocaleUpperCase()))
        this.setState({
            bankListTemp,
            searchText,
            bankId: -9999,
        })
    }

    chnageisRdBindReverseDepositAccountModal(isRdBindReverseDepositAccountModal) {
        this.setState({
            isRdBindReverseDepositAccountModal
        })
    }

    render() {
        const {
            bankId,
            bankList,
            bankListTemp,
            accountHolderName,
            accountNumber,
            province,//省份
            city,//城市
            branch,//分行
            addDisalbed,
            checkBox,
            accountHolderNameErr,
            provinceErr,
            cityErr,
            branchErr,
            arrowFlag,
            isFocusName,
            isFocusNumber,
            searchText,
            name,
            isShowRecommendTip,
            isShowBankFilter,
            isRdBindReverseDepositAccountModal,
            description,
            errorCode
        } = this.state
        const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
        return <View style={{ flex: 1, backgroundColor: window.isBlue ? '#F4F4F5' : '#0F0F0F', paddingHorizontal: 10 }}>
            <Modal animationType='fade' transparent={true} visible={isShowBankFilter}>
                <View style={[styles.modalContainer]}>
                    <View style={styles.modalBox}>
                        <TouchableOpacity style={[styles.closeBtn]} onPress={() => {
                            this.setState({
                                isShowBankFilter: false,
                                searchText: ''
                            })
                        }}>
                            <Image
                                resizeMode='stretch'
                                source={require('./../../../../images/finance/deposit/rdIcon/closeBtn.png')}
                                style={[styles.closeBtnImg]}
                            ></Image>
                        </TouchableOpacity>


                        <View style={styles.searchBox}>
                            <View style={[styles.walletSbIconBox]}>
                                <Image
                                    resizeMode='stretch'
                                    source={require('./../../../../images/finance/deposit/rdIcon/MagnifyingGlass.png')}
                                    style={[styles.walletSbIcon1]}
                                >
                                </Image>
                            </View>
                            <TextInput
                                value={searchText}
                                maxLength={50}
                                placeholder='Search bank'
                                placeholderTextColor={'#B0B0B2'}
                                style={[styles.limitListsInput, { backgroundColor: '#F3F3F3', borderWidth: 0, paddingLeft: 30 }]}
                                onChangeText={this.changeSearchTextValue.bind(this)}
                            />
                        </View>

                        <View>
                            <ScrollView contentContainerStyle={{
                                paddingBottom: 60
                            }}>
                                {
                                    bankListTemp.map((v, i) => {
                                        let flag = bankId == v.Id
                                        return <TouchableOpacity style={styles.bankSelectBox} key={i} onPress={() => {
                                            this.setState({
                                                bankId: v.Id,
                                                isShowBankFilter: false
                                            }, () => {
                                                this.changeBtnStatus()
                                            })
                                        }}>
                                            {
                                                flag ? <Image
                                                    resizeMode='stretch'
                                                    source={require('./../../../../images/finance/deposit/rdIcon/rdSelect.png')}
                                                    style={styles.rdSelect}
                                                ></Image>
                                                    :
                                                    <View style={styles.rdSelect}></View>
                                            }
                                            <Text style={{ width: width - 70, color: '#000' }}>{v.Name}</Text>
                                        </TouchableOpacity>
                                    })
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>


            <RdBindReverseDepositAccountModal
                isPop={true}
                chnageisRdBindReverseDepositAccountModal={this.chnageisRdBindReverseDepositAccountModal.bind(this)}
                description={description}
                errorCode={errorCode}
                isRdBindReverseDepositAccountModal={isRdBindReverseDepositAccountModal}
            />


            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
                <View style={{ marginVertical: 15, flexDirection: 'row', backgroundColor: '#D9F6FF', borderRadius: 6, padding: 5 }}>
                    <View style={{ width: 15, height: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 10000, backgroundColor: '#00A8E5', marginRight: 5 }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>!</Text>
                    </View>
                    <Text style={{ color: '#2C2C2C', fontSize: 12, width: width - 50, flexWrap: 'wrap' }}>{`กรุณาเพิ่มบัญชีธนาคารก่อนการฝากเงินแบบฝากด่วน หากเพิ่มแล้วจะไม่สามารถแก้ไขข้อมูลได้ กรุณาตรวจสอบให้แน่ใจว่าข้อมูลถูกต้อง เพื่อป้องกันธุรกรรมถูกยกเลิกหรือยอดเงินสูญหาย`}</Text>
                </View>


                {/* 姓名 */}
                <View style={styles.limitLists}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}><RedStar /> ชื่อ-นามสกุล
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    isShowRecommendTip: !isShowRecommendTip
                                })
                            }}
                            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}>
                            <Image
                                resizeMode='stretch'
                                source={require('./../../../../images/finance/walletSbIcon02.png')}
                                style={styles.walletSbIcon}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                    {
                        isShowRecommendTip && <AnimatableView
                            animation={'bounceIn'}
                            easing='ease-out'
                            iterationCount='1'
                            style={styles.recommendTipModal}>
                            <Text style={styles.recommendTipModalText}>
                                ชื่อบัญชีธนาคารต้องตรงกับชื่อที่ลงทะเบียน หากต้องการแก้ไข กรุณาติดต่อแชทสด
                            </Text>
                            <View style={styles.recommendTipModalArrow}></View>

                            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 7 }} onPress={() => {
                                this.setState({
                                    isShowRecommendTip: false
                                })
                            }}>
                                <Text style={{ color: '#fff', fontSize: 16 }}>X</Text>
                            </TouchableOpacity>
                        </AnimatableView>
                    }


                    <TextInput
                        value={name.length <= 0 ? accountHolderName : getName(accountHolderName)}
                        maxLength={50}
                        editable={name.length <= 0}
                        placeholderTextColor={PlaceholderTextColor}
                        style={[styles.limitListsInput, {
                            backgroundColor: name.length <= 0 ? '#fff' : '#D9D9D9'
                        }]}
                        onFocus={() => {
                            this.setState({
                                isFocusName: true
                            })
                        }}
                        onChangeText={this.changeInputValue.bind(this, 'accountHolderName')}
                    />
                </View>
                {/* 银行选择 */}
                <View style={[styles.limitLists, {}]}>
                    <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}><RedStar /> ชื่อธนาคาร</Text>
                    <TouchableOpacity style={[styles.targetWalletBox]} onPress={() => {
                        this.setState({
                            isShowBankFilter: true,
                            bankListTemp: bankList
                        }, () => {
                            this.changeBtnStatus()
                        })
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                resizeMode='stretch'
                                source={require('./../../../../images/finance/deposit/rdIcon/rdBankIcon1.png')}
                                style={[styles.closeBtnImg, { marginRight: 5 }]}
                            ></Image>
                            <Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#323232' : '#fff' }]}>{bankId != -9999 ? bankListTemp.find(v => v.Id == bankId).Name : 'เลือกธนาคาร'}</Text>
                        </View>
                        <ModalDropdownArrow arrowFlag={arrowFlag} />
                    </TouchableOpacity>
                </View>

                {/* 银行卡号 */}
                <View style={styles.limitLists}>
                    <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}><RedStar /> หมายเลขบัญชี</Text>
                    <TextInput
                        value={accountNumber}
                        maxLength={19}
                        PlaceholderTextColor='#C4C4C6'
                        placeholder={'เลขบัญชีธนาคารจะต้องมี 10~19 หลัก'}
                        keyboardType='number-pad'
                        placeholderTextColor={PlaceholderTextColor}
                        style={[styles.limitListsInput, {
                            borderColor: ((!(accountNumber.length >= 10 && accountNumber.length <= 19) && accountNumber.length > 0)) ? 'red' : '#F2F2F2',
                            borderBottomColor: ((!(accountNumber.length >= 10 && accountNumber.length <= 19) && accountNumber.length > 0)) ? 'red' : '#4C4C4C34'
                        }]}
                        onFocus={() => {
                            this.setState({
                                isFocusNumber: true
                            })
                        }}
                        onChangeText={value => {
                            let accountNumber = GetOnlyNumReg(value)
                            this.setState({
                                accountNumber
                            }, () => {
                                this.changeBtnStatus()
                            })
                        }}
                    />

                    {
                        //isFocusNumber && accountNumber.length <= 0 && <Text style={{ color: 'red', marginTop: 10 }}>Vui lòng điền số tài khoản ngân hàng</Text>
                    }

                    {
                        (!(accountNumber.length >= 10 && accountNumber.length <= 19) && accountNumber.length > 0) && <Text style={{ color: 'red', marginTop: 10 }}>เลขบัญชีไม่ถูกต้อง</Text>
                    }
                </View>
            </KeyboardAwareScrollView>

            <View style={styles.btnWrap}>
                <TouchableOpacity style={[styles.LBdepositPageBtn1, {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: '#26AAE2'
                }]} onPress={() => {
                    Actions.pop()
                }}>
                    <Text style={[styles.LBdepositPageBtnText1, { color: '#26AAE2' }]}>ยกเลิก</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: addDisalbed ? '#00AEEF' : '#D9D9D9' }]} onPress={this.addBank.bind(this)}>
                    <Text style={[styles.LBdepositPageBtnText1, {
                        color: addDisalbed ? '#FFFFFF' : '#908C8C'
                    }]}>บันทึก</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
}

export default RdDeposit = connect(
    (state) => {
        return {
            depositUserBankData: state.depositUserBankData,
            memberInforData: state.memberInforData,
            withdrawalLbBankData: state.withdrawalLbBankData,
            depositLbBankData: state.depositLbBankData
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            getDepositUserBankAction: () => dispatch(getDepositUserBankAction()),
            getWithdrawalUserBankAction: () => dispatch(getWithdrawalUserBankAction()),
            getDepositLbBankAction: () => dispatch(getDepositLbBankAction()),
            getWithdrawalLbBankAction: () => dispatch(getWithdrawalLbBankAction()),
        }
    }
)(RdDepositContainer)

const styles = StyleSheet.create({
    limitLists: {
        marginBottom: 10
    },
    LBdepositPageBtn2: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width,
        marginTop: 15
    },
    LbAddBankBox: {
        paddingTop: 10,
        position: 'absolute',
        width,
        bottom: 0,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    LBdepositPageBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#25AAE1'
    },
    LBdepositPageBtn: {
        width: .9 * width,
        height: 46,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25AAE1'
    },
    limitListsInput: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center',




        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderBottomWidth: 2,
        backgroundColor: '#fff',
        borderBottomColor: '#4C4C4C34',
    },
    withdrawalText: {
        color: '#000',
        marginBottom: 5
    },
    targetWalletBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        height: 40,
        alignItems: 'center',
        borderRadius: 4,


        borderWidth: 1,
        borderColor: '#F2F2F2',
        borderBottomWidth: 2,
        backgroundColor: '#fff',
        borderBottomColor: '#4C4C4C34',
    },
    toreturnModalDropdown: {
        justifyContent: 'center',
        width: width - 20,
    },
    rdSelect: {
        width: 20,
        height: 20,
        margin: 5
    },
    bankSelectBox: {
        flexDirection: 'row',
        paddingHorizontal: 4,
        alignItems: 'center'
    },
    toreturnDropdownStyle: {
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4,
    },
    toreturnModalDropdownList: {
        // height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: 6
    },
    dropdown: {
        position: 'absolute',
        right: 10,
        width: 0,
        height: 0,
        zIndex: 9,
        borderStyle: 'solid',
        borderWidth: 5,
        marginTop: 5,
        borderTopColor: '#58585B',//下箭头颜色
        borderLeftColor: '#fff',//右箭头颜色
        borderBottomColor: '#fff',//上箭头颜色
        borderRightColor: '#fff'//左箭头颜色 
    },
    btnWrap: {
        position: 'absolute',
        bottom: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width - 60,
        marginHorizontal: 30
    },
    LBdepositPageBtn1: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CBD64',
        width: (width - 60) * .45,
        borderRadius: 6,
    },
    LBdepositPageBtnText1: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    walletSbIcon: {
        width: 18,
        height: 18,
        marginLeft: 6
    },
    walletSbIconBox: {
        position: 'absolute',
        left: 8,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        zIndex: 10000
    },
    walletSbIcon1: {
        width: 18,
        height: 18,
    },
    closeBtn: {
        position: 'absolute',
        right: 10,
        top: 20,
    },
    closeBtnImg: {
        width: 25,
        height: 25,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    recommendTipModal: {
        position: 'absolute',
        zIndex: 1000000000,
        backgroundColor: '#139ED8',
        padding: 8,
        bottom: -25,
        right: 0,
        borderRadius: 6,
        width: width - 20,
        paddingRight: 20
    },
    recommendTipModalText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendTipModalBtnBox: {
        alignItems: 'flex-end',
        marginTop: 6
    },
    recommendTipModalBtn: {
        backgroundColor: '#FFD756',
        borderRadius: 2,
        paddingHorizontal: 15,
        paddingVertical: 5,
        zIndex: 100000,
        marginTop: 6
    },
    recommendTipModalArrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 10,
        borderLeftColor: 'transparent',
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#139ED8',
        top: -20,
        zIndex: 1000,
        left: (width - 20) * .25
    },
    recommendTipModalBtnText: {
        fontWeight: 'bold',
    },
    recommendRecordBtnBox: {
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 10,
        justifyContent: 'center',
        marginBottom: 15,
        alignItems: 'center',
    },
    modalContainer: {
        width,
        height,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        width,
        height: height * .6,
        paddingHorizontal: 10,
        paddingTop: 60,
    },
    rdisRdBindReverseDepositAccountModal: {
        width: 66,
        height: 66
    },
    modalBox1: {
        width: width * .9,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    closeBtn1: {
        width: width * .9 - 20,
        height: 40,
        borderColor: '#25AAE1',
        borderWidth: 1,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeBtnText1: {
        color: '#25AAE1'
    }
})