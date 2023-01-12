import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal, Clipboard } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import ViewShot from 'react-native-view-shot'
import { toThousands } from '../../../actions/Reg'

const { width, height } = Dimensions.get('window')

class RedoDepositTransaction extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ResubmitDepositDetails: {},
            recordItem: this.props.recordItem
        }
    }

    componentDidMount() {
        this.getResubmitOnlineDepositDetails()
    }

    getResubmitOnlineDepositDetails(item) {
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetResubmitOnlineDepositDetails + 'resubmitDepositID=' + this.state.recordItem.TransactionId + '&', 'GET').then(res => {
            Toast.hide()
            this.setState({
                ResubmitDepositDetails: res,
            })
        }).catch(err => {
            Toast.hide()
        })
    }


    CreateResubmitOnlineDeposit(res) {
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        Actions.pop()
        Actions.pop()
        fetchRequest(ApiPort.CreateResubmitOnlineDeposit + `resubmitDepositID=${this.state.recordItem.TransactionId}&returnUrl=Fun88native://` + '&', 'POST').then(res => {
            Toast.hide()
            if (res.ResubmitStatus) {
                Actions.DepositPageStack({
                    payHtml: res.ResubmitRedirectUrl,
                    money: this.state.ResubmitDepositDetails.ResubmitAmount,
                    paymentMethod: this.state.recordItem.PaymentMethodId,
                    isCreateResubmitOnlineDeposit: true
                })
                this.props.getDepositWithdrawalsRecords()
            }
        }).catch(err => {
            Toast.hide()
        })
    }


    render() {
        const { ResubmitDepositDetails } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                {
                    <View style={{ backgroundColor: window.isBlue ? '#F3F3F3' : '#2E2E2E', borderRadius: 6, padding: 10, }}>
                        <View style={{ marginVertical: 5, flexDirection: 'row' }}>
                            <Text style={{ width: (width - 20) * .5, color: window.isBlue ? '#323232' : '#FFFFFF' }}>ประเภทการเงิน</Text>
                            <Text style={{ color: window.isBlue ? '#323232' : '#00AEEF' }}>{ResubmitDepositDetails.PaymentGatewayName}</Text>
                        </View>
                        {
                            Boolean(ResubmitDepositDetails.BankName) && <View style={{ marginVertical: 5, flexDirection: 'row' }}>
                                <Text style={{ width: (width - 20) * .5, color: window.isBlue ? '#323232' : '#FFFFFF' }}>ธนาคาร</Text>
                                <Text style={{ color: window.isBlue ? '#323232' : '#00AEEF' }}>{ResubmitDepositDetails.BankName}</Text>
                            </View>
                        }

                        <View style={{ marginVertical: 5, flexDirection: 'row' }}>
                            <Text style={{ width: (width - 20) * .5, color: window.isBlue ? '#323232' : '#FFFFFF' }}>ยอดเงิน</Text>
                            <Text style={{ color: window.isBlue ? '#323232' : '#00AEEF' }}>{toThousands(ResubmitDepositDetails.ResubmitAmount)}</Text>
                        </View>
                    </View>
                }

                <Text style={{ color: '#00AEEF', marginTop: 20 }}>คุณไม่จำเป็นต้องทำการโอนเงินจริงซ้ำ โปรดคลิก ดำเนินการต่อ และอย่าปิดหน้านี้ จนกว่าหน้าธุรกรรมจะแสดงผลขึ้น หากปิดอาจจะทำให้การส่งล้มเหลว</Text>
                <TouchableOpacity
                    onPress={this.CreateResubmitOnlineDeposit.bind(this)}
                    style={{ backgroundColor: '#00AEEF', height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 4, marginTop: 30 }}>
                    <Text style={{ color: '#fff' }}>ดำเนินการต่อ</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10
    }
})

export default (RedoDepositTransaction)