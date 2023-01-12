import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import { toThousands } from '../../../actions/Reg'

const DepositStatusPending = {//'Pending'
    img1: require('./../../../images/finance/record/tranfer_circle.png'),
    text1: 'กำลังดำเนินการ',
    color1: '#fff',
    borderColor1: '#009DE3',
    backgroundColor1: '#009DE3',
    opacity1: 1,

    img2: require('./../../../images/finance/record/tranfer_right.png'),
    text2: 'เรียบร้อย',
    color2: '#fff',
    borderColor2: '#B2B2B2',
    backgroundColor2: '#B2B2B2',
    opacity2: .6,
}
const DepositStatus = {
    StatusId1: DepositStatusPending,
    StatusId2: {// 'Approved'
        img1: require('./../../../images/finance/record/tranfer_circle.png'),
        text1: 'กำลังดำเนินการ',
        color1: '#fff',
        borderColor1: '#009DE3',
        backgroundColor1: '#009DE3',
        opacity1: 1,

        img2: require('./../../../images/finance/record/tranfer_right.png'),
        text2: 'เรียบร้อย',
        color2: '#fff',
        borderColor2: '#83E300',
        backgroundColor2: '#83E300',
        opacity2: 1,
    },
    StatusId3: {//'Rejected'
        img1: require('./../../../images/finance/record/tranfer_circle.png'),
        text1: 'เรียบร้อย',
        color1: '#fff',
        borderColor1: '#009DE3',
        backgroundColor1: '#009DE3',
        opacity1: 1,

        img2: require('./../../../images/finance/record/tranfer_false.png'),
        text2: 'Từ Chối',
        color2: '#fff',
        borderColor2: '#E30000',
        backgroundColor2: '#E30000',
        opacity2: 1,
    },
    StatusId4: DepositStatusPending,
}

const WithdrawalStatusPend = {//'等待浏览'
    img1: require('./../../../images/finance/record/withdrawal_loading.png'),
    text1: 'รอการอนุมัติ',
    color1: '#009DE3',
    borderColor1: '#009DE3',
    backgroundColor1: '#fff',
    opacity1: 1,

    img2: require('./../../../images/finance/record/tranfer_circle.png'),
    text2: 'กำลังดำเนินการ',
    color2: '#fff',
    borderColor2: '#B2B2B2',
    backgroundColor2: '#B2B2B2',
    opacity2: .6,

    img3: require('./../../../images/finance/record/tranfer_right.png'),
    text3: 'เรียบร้อย',
    color3: '#fff',
    borderColor3: '#B2B2B2',
    backgroundColor3: '#B2B2B2',
    opacity3: .6,
}
const WithdrawalStatusPending = {//'进行中'
    img1: require('./../../../images/finance/record/withdrawal_loading.png'),
    text1: 'รอการอนุมัติ',
    color1: '#009DE3',
    borderColor1: '#009DE3',
    backgroundColor1: '#fff',
    opacity1: 1,

    img2: require('./../../../images/finance/record/tranfer_circle.png'),
    text2: 'กำลังดำเนินการ',
    color2: '#fff',
    borderColor2: '#009DE3',
    backgroundColor2: '#009DE3',
    opacity2: 1,

    img3: require('./../../../images/finance/record/tranfer_right.png'),
    text3: 'เรียบร้อย',
    color3: '#fff',
    borderColor3: '#B2B2B2',
    backgroundColor3: '#B2B2B2',
    opacity3: .6,
}
const WithdrawalStatus = {
    StatusId1: WithdrawalStatusPend,
    StatusId2: WithdrawalStatusPending,
    StatusId3: WithdrawalStatusPending,
    StatusId4: {//'已完成'
        img1: require('./../../../images/finance/record/withdrawal_loading.png'),
        text1: 'รอการอนุมัติ',
        color1: '#009DE3',
        borderColor1: '#009DE3',
        backgroundColor1: '#fff',
        opacity1: 1,

        img2: require('./../../../images/finance/record/tranfer_circle.png'),
        text2: 'กำลังดำเนินการ',
        color2: '#fff',
        borderColor2: '#009DE3',
        backgroundColor2: '#009DE3',
        opacity2: 1,

        img3: require('./../../../images/finance/record/tranfer_right.png'),
        text3: 'เรียบร้อย',
        color3: '#fff',
        borderColor3: '#83E300',
        backgroundColor3: '#83E300',
        opacity3: 1,
    },
    StatusId5: {//'拒绝'
        img1: require('./../../../images/finance/record/withdrawal_loading.png'),
        text1: 'รอการอนุมัติ',
        color1: '#009DE3',
        borderColor1: '#009DE3',
        backgroundColor1: '#fff',
        opacity1: 1,

        img2: require('./../../../images/finance/record/tranfer_circle.png'),
        text2: 'กำลังดำเนินการ',
        color2: '#fff',
        borderColor2: '#009DE3',
        backgroundColor2: '#009DE3',
        opacity2: 1,

        img3: require('./../../../images/finance/record/tranfer_false.png'),
        text3: 'Từ Chối',
        color3: '#fff',
        borderColor3: '#E30000',
        backgroundColor3: '#E30000',
        opacity3: 1,
    },
    StatusId6: {//'取消'
        img1: require('./../../../images/finance/record/withdrawal_loading.png'),
        text1: 'รอการอนุมัติ',
        color1: '#009DE3',
        borderColor1: '#009DE3',
        backgroundColor1: '#fff',
        opacity1: 1,

        img2: require('./../../../images/finance/record/tranfer_false.png'),
        text2: 'ไม่สำเร็จ',
        color3: '#fff',
        borderColor2: '#E30000',
        backgroundColor2: '#E30000',
        opacity2: 1,
    },
    StatusId7: WithdrawalStatusPend,
    StatusId8: WithdrawalStatusPending,
    StatusId9: WithdrawalStatusPending,
    StatusId10: {//'已完成'
        img1: require('./../../../images/finance/record/withdrawal_loading.png'),
        text1: 'รอการอนุมัติ',
        color1: '#009DE3',
        borderColor1: '#009DE3',
        backgroundColor1: '#fff',
        opacity1: 1,

        img2: require('./../../../images/finance/record/tranfer_circle.png'),
        text2: 'กำลังดำเนินการ',
        color2: '#fff',
        borderColor2: '#009DE3',
        backgroundColor2: '#009DE3',
        opacity2: 1,

        img3: require('./../../../images/finance/record/tranfer_right.png'),
        text3: 'สำเร็จบางส่วน',
        color3: '#fff',
        borderColor3: '#83E300',
        backgroundColor3: '#83E300',
        opacity3: 1,
    },
}

const PageTitle = {
    deposit: 'Gửi Tiền Ngân Hàng Địa Phương',
    withdrawal: 'ประวัติการถอน'
}

class recordsDatails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            recordsDatails: this.props.recordsDatails,
            datailsType: this.props.datailsType,
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: PageTitle[this.props.datailsType]
        })
    }

    cancleWithdrawals({ TransactionId, Amount }) {
        const parmas = {
            'TransactionType': 'Withdrawal',
            'Remark': 'test',
            'Amount': Amount
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)

        fetchRequest(ApiPort.POSTNoCancellation + TransactionId + '/Cancellation?', 'POST', parmas).then(data => {
            Toast.hide()
            if (data.isSuccess == true) {
                this.props.cancaleWithdrawalReload()
                Toast.success('ยกเลิกสำเร็จ', 2, () => {
                    Actions.pop()
                })
            } else {
                Toast.fail('ยกเลิกไม่สำเร็จ')
            }
        }).catch(error => {
            Toast.hide()
        })
    }

    render() {
        const { recordsDatails, datailsType } = this.state
        const statusId = recordsDatails.StatusId
        let recordsStatus = datailsType === 'deposit' ? DepositStatus : WithdrawalStatus
        let recordsStatusItem = recordsStatus[`StatusId${statusId}`]

        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#000' }]} ref='viewShot' options={{ format: 'jpg', quality: 0.9 }}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {/* 详情 */}
                <View style={styles.datails}>
                    <Text style={[styles.topLeftText1, { color: window.isBlue ? '#9B9B9B' : '#fff' }]}>{recordsDatails.depositWithdrawalsName}</Text>
                    <View>
                        <Text style={[styles.topRigthText1, { color: window.isBlue ? '#000' : '#fff' }]}>Ref ID:{recordsDatails.TransactionId}</Text>
                        <Text style={[styles.topRigthText2, { color: window.isBlue ? '#9B9B9B' : 'rgba(255, 255, 255, .5)' }]}>{moment(recordsDatails.SubmittedAt).format('YYYY-MM-DD | HH:mm:ss')}</Text>
                        <Text style={[styles.topRigthText3, { color: window.isBlue ? '#000' : '#009DE3' }]}>{toThousands(recordsDatails.Amount)}</Text>
                    </View>
                </View>

                <View style={styles.recordsStatusBox}>
                    <View style={[styles.depositStatusBox, { backgroundColor: recordsStatusItem.backgroundColor1, borderColor: recordsStatusItem.borderColor1, opacity: recordsStatusItem.opacity1 }]}>
                        <Image source={recordsStatusItem.img1} style={styles.depositStatusImg} />
                        <Text style={[styles.depositStatusBoxText, { color: recordsStatusItem.color1 }]}>{recordsStatusItem.text1}</Text>
                    </View>
                    <View style={styles.recordsStatusBoxLine}></View>
                    <View style={[styles.depositStatusBox, { backgroundColor: recordsStatusItem.backgroundColor2, borderColor: recordsStatusItem.borderColor2, opacity: recordsStatusItem.opacity2 }]}>
                        <Image source={recordsStatusItem.img2} style={styles.depositStatusImg} />
                        <Text style={styles.depositStatusBoxText}>{recordsStatusItem.text2}</Text>
                    </View>
                    {
                        datailsType === 'withdrawal' && statusId !== 6 && <View>
                            <View style={styles.recordsStatusBoxLine}></View>
                            <View style={[styles.depositStatusBox, { backgroundColor: recordsStatusItem.backgroundColor3, borderColor: recordsStatusItem.borderColor3, opacity: recordsStatusItem.opacity3 }]}>
                                <Image source={recordsStatusItem.img3} style={styles.depositStatusImg} />
                                <Text style={styles.depositStatusBoxText}>{recordsStatusItem.text3}</Text>
                            </View>
                        </View>
                    }
                </View>

                {
                    datailsType === 'withdrawal' && statusId === 1 && <TouchableOpacity style={[styles.recordsDatailsBtn, { marginTop: 20 }]} onPress={this.cancleWithdrawals.bind(this, recordsDatails)}>
                        <Text style={styles.recordsDatailsBtnText}>ยกเลิกการถอน</Text>{/* 取消提款 */}
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 20
    },
    datails: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    topLeftText1: {
        color: '#9B9B9B'
    },
    topRigthText1: {
        color: '#000'
    },
    topRigthText2: {
        color: '#9B9B9B',
        textAlign: 'right'
    },
    topRigthText3: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'right'
    },
    recordsDatailsBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25AAE1',
        height: 40,
        marginBottom: 10
    },
    recordsDatailsBtnText: {
        color: '#25AAE1'
    },
    depositStatusBox: {
        flexDirection: 'row',
        height: 32,
        width: 240,
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 1,
        paddingLeft: 35
    },
    depositStatusImg: {
        marginRight: 5,
        width: 18,
        height: 18,
        position: 'absolute',
        left: 10
    },
    recordsStatusBox: {
        position: 'relative',
        marginTop: 10,
        marginBottom: 20
    },
    recordsStatusBoxLine: {
        width: 2,
        height: 20,
        backgroundColor: '#B2B2B2',
        marginLeft: 18
    },
    depositStatusBoxText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
})

export default (recordsDatails)