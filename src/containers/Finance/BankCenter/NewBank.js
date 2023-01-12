import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import ModalDropdown from 'react-native-modal-dropdown'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from '@/containers/Toast'
import CheckBox from 'react-native-check-box'
import { GetOnlyNumReg, RealNameReg, RealNameErrTip, ProvinceReg, CityReg, BranchReg, getName } from '../../../actions/Reg'
import ModalDropdownArrow from './../../Common/ModalDropdownArrow'
import { getMemberInforAction, getDepositUserBankAction, getWithdrawalUserBankAction, getDepositLbBankAction, getWithdrawalLbBankAction } from '././../../../actions/ReducerAction'

const { width } = Dimensions.get('window')
const RegObj = {
    accountHolderName: RealNameReg,
    province: ProvinceReg,
    city: CityReg,
    branch: BranchReg
}

class NewBankContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bankList: [],
            banksIndex: 0,
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
            isFocusNumber: false
        }
    }

    componentDidMount() {
        this.getMemberData(this.props.memberInforData)
        if (this.props.bankType === 'D') {
            this.props.getDepositLbBankAction()
            this.getDepositLbBank(this.props)
        }

        if (this.props.bankType === 'W') {
            this.props.getWithdrawalLbBankAction()
            this.getWithdrawalLbBank(this.props)
        }
    }

    componentWillReceiveProps(nextProps) {
        this.getMemberData(nextProps.memberInforData)
        this.props.bankType === 'D' && this.getDepositLbBank(nextProps)
        this.props.bankType === 'W' && this.getWithdrawalLbBank(nextProps)
    }

    getDepositLbBank(props) {
        if (props) {
            let depositLbBankData = props.depositLbBankData
            if (Array.isArray(depositLbBankData)) {
                this.setState({
                    bankList: depositLbBankData
                })
            }
        }
    }

    getWithdrawalLbBank(props) {
        if (props) {
            let withdrawalLbBankData = props.withdrawalLbBankData
            if (Array.isArray(withdrawalLbBankData)) {
                this.setState({
                    bankList: withdrawalLbBankData
                })


                const { bankInfor, memberBanksTransactionHistory } = this.props
                if (bankInfor) {
                    let banksIndex = withdrawalLbBankData.findIndex(v => bankInfor.BankName == v.Name)
                    this.setState({
                        checkBox: bankInfor.IsDefault,
                        accountNumber: bankInfor.AccountNumber,
                        banksIndex,
                        addDisalbed: true
                    })
                }
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
        let flag = this.state.banksIndex * 1 === index * 1
        return <View style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={index}>
            <Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.Name}</Text>
        </View>
    }

    UpdateMemberBankAccount() {
        const { bankList, addDisalbed, accountNumber, accountHolderName, city, province, branch, banksIndex, checkBox } = this.state
        if (!addDisalbed) { return '' }
        const { bankInfor, memberBanksTransactionHistory } = this.props
        let params = {
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bankName: bankList[banksIndex].Name,
            city: city,
            province: province,
            branch: branch,
            type: this.props.bankType,
            isDefault: checkBox,
            CreatedBy: this.props.memberInforData.MemberCode
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.UpdateMemberBankAccount + 'bankId=' + bankInfor.BankAccountID + '&', 'PUT', params).then(data => {
            Toast.hide()
            if (data.isSuccess == true) {
                if (this.props.bankType === 'D') {
                    this.props.getDepositUserBankAction()
                }
                Toast.success('ตั้ังค่าสำเร็จ', 2, () => {
                    if (this.props.bankType === 'D') {
                        //this.props.getDepositUserBankAction()

                        if (this.props.fromPage == 'LbDeposit' && this.props.changeIsFinishAddBankFlag) {
                            let bankInfor = {
                                accountNumber: accountNumber,
                                accountHolderName: accountHolderName,
                                bankName: bankList[banksIndex].Name,
                                isDB: true
                            }
                            this.props.changeIsFinishAddBankFlag(true, bankInfor)
                        }
                    }
                    if (this.props.bankType === 'W') {
                        this.props.getWithdrawalUserBankAction()
                        this.props.getMemberBanksTransactionHistory && this.props.getMemberBanksTransactionHistory()
                    }
                    if (this.props.isGetFreeBet) {
                        this.submitName(accountHolderName)
                    } else {
                        Actions.pop()
                    }
                    this.setState({
                        accountNumber: '',
                        accountHolderName: '',
                        city: '',
                        province: '',
                        branch: ''
                    })
                })

            } else {
                Toast.fail(data.message, 1.5)
            }
        })
    }

    //添加
    addBank() {
        const { bankList, addDisalbed, accountNumber, accountHolderName, city, province, branch, banksIndex, checkBox } = this.state
        if (!addDisalbed) { return '' }
        const { bankInfor, memberBanksTransactionHistory } = this.props
        if (bankInfor) {
            this.UpdateMemberBankAccount()
            return
        }
        if (this.props.fromPage == 'LbDeposit' && !checkBox) {
            Actions.pop()
            let bankInfor = {
                accountNumber: accountNumber,
                accountHolderName: accountHolderName,
                bankName: bankList[banksIndex].Name,
                isDB: false
            }
            this.props.changeIsFinishAddBankFlag && this.props.changeIsFinishAddBankFlag(true, bankInfor)
            return
        }

        let params = {
            accountNumber: accountNumber,
            accountHolderName: accountHolderName,
            bankName: bankList[banksIndex].Name,
            city: city,
            province: province,
            branch: branch,
            type: this.props.bankType,
            isDefault: checkBox
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.MemberBanks, 'POST', params).then(data => {
            Toast.hide()
            if (data.isSuccess == true) {
                if (this.props.bankType === 'D') {
                    this.props.getDepositUserBankAction()
                }
                Toast.success('เพิ่มบัญชีสำเร็จ​', 2, () => {
                    if (this.props.bankType === 'D') {
                        //this.props.getDepositUserBankAction()

                        if (this.props.fromPage == 'LbDeposit' && this.props.changeIsFinishAddBankFlag) {
                            let bankInfor = {
                                accountNumber: accountNumber,
                                accountHolderName: accountHolderName,
                                bankName: bankList[banksIndex].Name,
                                isDB: true
                            }
                            this.props.changeIsFinishAddBankFlag(true, bankInfor)
                        }
                    }
                    if (this.props.bankType === 'W') {
                        this.props.getWithdrawalUserBankAction()
                        this.props.getMemberBanksTransactionHistory && this.props.getMemberBanksTransactionHistory()
                    }
                    if (this.props.isGetFreeBet) {
                        this.submitName(accountHolderName)
                    } else {
                        Actions.pop()
                    }
                    this.setState({
                        accountNumber: '',
                        accountHolderName: '',
                        city: '',
                        province: '',
                        branch: ''
                    })
                })

            } else {
                Toast.fail(data.message, 1.5)
            }
        }).catch(error => {
            Toast.hide()
        })
    }

    submitName(name) {
        const { eligible } = this.state
        if (this.state.name) {
            this.props.getMemberInforAction()
            Actions.pop()
            Actions.FreeBetPage({
                fillType: 'game',
                isGetFreeBet: true
            })
            return
        }
        const params = {
            key: 'FirstName',
            value1: name.trim(),
            value2: ''
        }

        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.Member, 'PATCH', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.props.getMemberInforAction()
                Actions.pop()
                Actions.FreeBetPage({
                    fillType: 'game',
                    isGetFreeBet: true
                })
            } else {
                Toast.fail('ติดตั้งไม่สำเร็จ', 2)
            }
        }).catch(() => {
            Toast.hide()
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
        const { accountHolderName, accountHolderNameErr, province, provinceErr, city, cityErr, branch, branchErr, accountNumber, banksIndex } = this.state
        let falg = this.props.fromPage === 'LbDeposit' ? true : (provinceErr && province.length > 0 && cityErr && branchErr && city.length > 0 && branch.length > 0)
        let addDisalbed = true && accountHolderName.length > 0 && accountHolderNameErr && accountNumber.length > 0 && banksIndex != -99 && accountNumber.length >= 10 && accountNumber.length <= 19
        this.setState({
            addDisalbed
        })
    }

    changeArrowStatus(arrowFlag) {
        this.setState({
            arrowFlag
        })
    }

    render() {
        const {
            banksIndex,
            bankList,
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
            name
        } = this.state
        const PlaceholderTextColor = window.isBlue ? 'rgba(0, 0, 0, .4)' : '#fff'
        const PasswordInput = {
            backgroundColor: window.isBlue ? '#fff' : '#000',

            borderWidth: 1,
            borderColor: "#F2F2F2",
            color: window.isBlue ? '#3C3C3C' : '#fff',
            borderBottomWidth: 2,
            borderBottomColor: '#F2F2F2'
        }
        const { bankInfor, memberBanksTransactionHistory, isSetDefault } = this.props
        return <View style={{ flex: 1, backgroundColor: window.isBlue ? '#F4F4F5' : '#0F0F0F' }}>
            <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>

                {
                    bankInfor && <View style={{ backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 20, marginTop: 10 }}>
                        <View>
                            <Text style={[styles.bankNameText]}>{bankInfor.BankName}</Text>
                            <Text style={[styles.bankNameText, { paddingVertical: 5 }]}>{bankInfor.AccountNumber.replace(/^().*(...)$/, "***$2")}</Text>
                            {
                                <View>
                                    {
                                        Boolean(memberBanksTransactionHistory) && <Text style={[styles.bankNameText]}>จำนวนครั้งที่ถอน : {memberBanksTransactionHistory.TotalUpToDateTransaction}</Text>
                                    }
                                    {
                                        Boolean(memberBanksTransactionHistory) && <Text style={[styles.bankNameText]}>จำนวนรวมยอดที่ถอน : {memberBanksTransactionHistory.TotalUpToDateAmount}</Text>
                                    }
                                </View>
                            }
                        </View>
                    </View>
                }


                <View style={{ paddingHorizontal: 10 }}>

                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                checkBox: !checkBox
                            })
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 8,
                            marginTop: 20
                        }}>
                        <View

                            style={{
                                width: 20,
                                borderWidth: 1,
                                borderRadius: 4,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 6,
                                height: 20,
                                backgroundColor: checkBox ? '#00AEEF' : 'transparent',
                                borderColor: checkBox ? '#00AEEF' : '#9B9B9B',
                            }}>
                            {
                                checkBox && <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: -2 }}>✓</Text>
                            }
                        </View>
                        <Text style={{ color: '#58585B' }}>ตั้งเป็นบัญชีธนาคารที่ต้องการ</Text>
                    </TouchableOpacity>


                    {/* 银行选择 */}
                    <View style={[styles.limitLists, { paddingTop: 15 }]}>
                        <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}>ชื่อธนาคาร</Text>
                        {
                            bankList.length > 0 && <ModalDropdown
                                animated={true}
                                defaultValue={bankList[0].Name}
                                options={bankList}
                                renderRow={this.accountDropdown.bind(this)}
                                onSelect={banksIndex => {
                                    this.setState({
                                        banksIndex
                                    }, () => {
                                        this.changeBtnStatus()
                                    })
                                }}
                                disabled={isSetDefault}
                                onDropdownWillShow={this.changeArrowStatus.bind(this, true)}
                                onDropdownWillHide={this.changeArrowStatus.bind(this, false)}
                                style={[styles.toreturnModalDropdown]}
                                dropdownStyle={[styles.toreturnDropdownStyle, { backgroundColor: window.isBlue ? '#fff' : '#212121', height: bankList.length < 10 ? bankList.length * 30 : 300 }]}
                            >
                                <View style={[styles.targetWalletBox, PasswordInput, {
                                    backgroundColor: isSetDefault ? '#D9D9D9' : '#fff'
                                }]}>
                                    <Text style={[styles.toreturnModalDropdownText, { color: window.isBlue ? '#323232' : '#fff' }]}>{Boolean(banksIndex != -99 && bankList[banksIndex] && bankList[banksIndex].Name) ? bankList[banksIndex].Name : 'Chọn ngân hàng'}</Text>
                                    <ModalDropdownArrow arrowFlag={arrowFlag} />
                                </View>
                            </ModalDropdown>
                        }
                    </View>

                    {/* 姓名 */}
                    <View style={styles.limitLists}>
                        <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}>ชื่อจริง</Text>
                        <TextInput
                            value={name.length <= 0 ? accountHolderName : getName(accountHolderName)}
                            maxLength={50}
                            editable={name.length <= 0}
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput, {
                                backgroundColor: name.length <= 0 ? '#fff' : '#D9D9D9'
                            }]}
                            onFocus={() => {
                                this.setState({
                                    isFocusName: true
                                })
                            }}
                            onChangeText={this.changeInputValue.bind(this, 'accountHolderName')}
                        />

                        <Text style={{ color: '#9A9A9A', fontSize: 12 }}>ไม่สามารถแก้ไขได้ ชื่อผู้ฝากต้องเป็นชื่อเดียวกับชื่อจริงที่คุณลงทะเบียนไว้</Text>
                        {
                            isFocusName && accountHolderName.length <= 0 && <Text style={{ color: 'red', marginTop: 10 }}>Vui lòng điền đầy đủ họ tên</Text>
                        }
                        {
                            !accountHolderNameErr && accountHolderName.length > 0 && <Text style={{ color: 'red', marginTop: 10 }}>{RealNameErrTip}</Text>
                        }
                    </View>
                    {/* 银行卡号 */}
                    <View style={styles.limitLists}>
                        <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}>บัญชีธนาคาร</Text>
                        <TextInput
                            editable={!isSetDefault}
                            value={accountNumber}
                            maxLength={19}
                            PlaceholderTextColor='#C4C4C6'
                            placeholder={'เลขบัญชีธนาคารจะต้องมี 10~19 หลัก'}
                            keyboardType='number-pad'
                            placeholderTextColor={PlaceholderTextColor}
                            style={[styles.limitListsInput, PasswordInput, {
                                backgroundColor: isSetDefault ? '#D9D9D9' : '#fff'
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
                            // isFocusNumber && accountNumber.length <= 0 && <Text style={{ color: 'red', marginTop: 10 }}>Vui lòng điền số tài khoản ngân hàng</Text>
                        }

                        {
                            !(accountNumber.length >= 10 && accountNumber.length <= 19) && accountNumber.length > 0 && <Text style={{ color: 'red', marginTop: 10 }}>เลขบัญชีธนาคารจะต้องมี 10~19 หลัก</Text>
                        }
                    </View>
                    {
                        this.props.fromPage !== 'LbDeposit' && false && <View>
                            {/* 省份 */}
                            <View style={styles.limitLists}>
                                <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}>Tỉnh</Text>
                                <TextInput
                                    value={province}
                                    maxLength={20}
                                    placeholderTextColor={PlaceholderTextColor}
                                    style={[styles.limitListsInput, PasswordInput]}
                                    onChangeText={this.changeInputValue.bind(this, 'province')}
                                />
                                {
                                    !provinceErr && <Text style={{ color: 'red', marginTop: 10 }}>รูปแบบไม่ถูกต้อง.</Text>
                                }
                            </View>
                            {/* 城市 */}
                            <View style={styles.limitLists}>
                                <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}>Thành Phố</Text>
                                <TextInput
                                    value={city}
                                    maxLength={20}
                                    placeholderTextColor={PlaceholderTextColor}
                                    style={[styles.limitListsInput, PasswordInput]}
                                    onChangeText={this.changeInputValue.bind(this, 'city')}
                                />
                                {
                                    !cityErr && <Text style={{ color: 'red', marginTop: 10 }}>รูปแบบไม่ถูกต้อง.</Text>
                                }
                            </View>
                            {/* 分行 */}
                            <View style={styles.limitLists}>
                                <Text style={[styles.withdrawalText, { color: window.isBlue ? '#323232' : '#fff' }]}>Chi Nhánh</Text>
                                <TextInput
                                    value={branch}
                                    maxLength={20}
                                    placeholderTextColor={PlaceholderTextColor}
                                    style={[styles.limitListsInput, PasswordInput]}
                                    onChangeText={this.changeInputValue.bind(this, 'branch')}
                                />
                                {
                                    !branchErr && <Text style={{ color: 'red', marginTop: 10 }}>รูปแบบไม่ถูกต้อง.</Text>
                                }
                            </View>

                        </View>
                    }

                    {
                        //     <View style={styles.limitLists}>
                        //     <CheckBox
                        //         checkBoxColor={'#25AAE1'}
                        //         checkedCheckBoxColor={'#25AAE1'}
                        //         onClick={() => {
                        //             this.setState({ checkBox: !checkBox })
                        //         }}
                        //         isChecked={checkBox}
                        //         rightTextView={<Text style={{ color: window.isBlue ? '#000' : '#fff', fontSize: 12, marginLeft: 10 }}>Nhớ chi tiết ngân hàng của tôi</Text>}
                        //     />
                        // </View>
                    }

                    <TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: addDisalbed ? '#00AEEF' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={this.addBank.bind(this)}>
                        <Text style={styles.LBdepositPageBtnText1}>บันทึก</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
            {
                // this.props.fromPage !== 'LbDeposit' && <TouchableOpacity style={[styles.LBdepositPageBtn1, { backgroundColor: addDisalbed ? '#00AEEF' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={this.addBank.bind(this)}>
                //     <Text style={styles.LBdepositPageBtnText1}>บันทึก</Text>
                // </TouchableOpacity>
            }

            {
                // this.props.fromPage === 'LbDeposit' && <View style={[styles.LbAddBankBox, { backgroundColor: window.isBlue ? '#fff' : '#212121' }]}>
                //     <TouchableOpacity style={[styles.LBdepositPageBtn]} onPress={() => {
                //         Actions.pop()
                //     }}>
                //         <Text style={styles.LBdepositPageBtnText}>Hủy</Text>
                //     </TouchableOpacity>
                //     <TouchableOpacity style={[styles.LBdepositPageBtn2, { backgroundColor: addDisalbed ? '#1CBD64' : (window.isBlue ? 'rgba(0, 0, 0, .4)' : '#5C5C5C') }]} onPress={this.addBank.bind(this)}>
                //         <Text style={styles.LBdepositPageBtnText1}>LƯU</Text>
                //     </TouchableOpacity>
                // </View>
            }

        </View>
    }
}

export default NewBank = connect(
    (state) => {
        return {
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
)(NewBankContainer)

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
        borderWidth: 1,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        height: 40,
        width: width - 20,
        borderRadius: 4,
        justifyContent: 'center'
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
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 4,
    },
    toreturnModalDropdown: {
        justifyContent: 'center',
        width: width - 20,
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
    LBdepositPageBtn1: {
        // position: 'absolute',
        // bottom: 0,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1CBD64',
        width: width - 80,
        borderRadius: 6,
        marginHorizontal: 40,
        marginTop: 50
    },
    LBdepositPageBtnText1: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    bankNameText: {
        width: width - 50,
        flexWrap: 'wrap',
        color: '#000'
    },
})