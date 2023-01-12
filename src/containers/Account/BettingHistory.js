import React from 'react'
import { StyleSheet, Text, Modal, View, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native'
import Toast from '@/containers/Toast'
import moment from 'moment'
import { toThousands } from './../../actions/Reg'
import ModalDropdownArrow from './../Common/ModalDropdownArrow'
import DatePickerCommon from './../Common/DatePickerCommon'
import { SelectTimeText, NoRecordText } from './../Common/CommonData'
import LoadingBone from './../Common/LoadingBone'

import DatePickerView from '../Common/DatePickerView'

const { width, height } = Dimensions.get('window')

class BettingHistory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dateFrom: moment().subtract(0, 'days').format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            providerList: [],
            providerListIndex: 0,
            totalWinLoss: '',
            totalTurnover: '',
            bettingHistory: '',
            lastUpdatedDate: new Date(),
            totalPage: 0,
            rowCount: 10,
            pageNumber: 1,
            arrowFlag: false,
            dateModalVisible: false,
            dataType: '',
            value: ''
        }
    }

    componentDidMount() {
        this.getAllProviders()
    }

    getAllProviders() {
        global.storage.load({
            key: 'gameProviderList',
            id: 'gameProviderList'
        }).then(data => {
            this.setState({
                providerList: data,
                value: [data[0].value]
            })
        }).catch(() => {
            Toast.loading('กำลังโหลดข้อมูล...', 20000)
        })

        fetchRequest(ApiPort.AllProviders, 'GET').then(res => {
            Toast.hide()
            if (Array.isArray(res) && res.length) {
                let providerList = [{ providerCode: '', providerName: 'ทั้งหมด' }, ...res]
                //let providerList = res
                providerList.forEach(v => {
                    v.value = v.providerName
                    v.label = v.providerName
                })
                this.setState({
                    providerList,
                    value: [providerList[0].value]
                })
                global.storage.save({
                    key: 'gameProviderList',
                    id: 'gameProviderList',
                    data: providerList,
                    expires: null
                })
            }
        }).catch(() => {
            Toast.hide()
        })
    }

    createBettingList(item, i) {
        let flag = this.state.providerListIndex * 1 === i * 1
        return <TouchableOpacity style={[styles.toreturnModalDropdownList, { backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25AAE1' : '#212121') }]} key={i}>
            <Text style={[styles.toreturnModalDropdownListText, { color: window.isBlue ? (!flag ? '#000' : '#fff') : ('#fff') }]}>{item.providerCode === 'JIF' ? item.providerName.toLocaleUpperCase() : item.providerName}</Text>
        </TouchableOpacity>
    }


    changeBettingDatePicker(type, date) {
        this.setState({
            [type]: moment(date).format('YYYY-MM-DD'),
        })
    }
    getMemberDailyTurnover() {
        this.setState({
            totalWinLoss: '',
            totalTurnover: '',
            bettingHistory: null,
            lastUpdatedDate: '',
        })
        const { dateFrom, dateTo, providerListIndex, providerList, rowCount, pageNumber } = this.state
        const providerCode = providerList[providerListIndex].providerCode
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(`${ApiPort.GetMemberDailyTurnover}dateFrom=${dateFrom}&dateTo=${dateTo}&rowCount=${rowCount}&pageNum=${pageNumber}&providerCode=${providerCode}&`).then(res => {
            Toast.hide()
            let dailyTurnover = res.dailyTurnover || []
            if (res.isSucess && Array.isArray(dailyTurnover) && dailyTurnover.length) {
                this.setState({
                    bettingHistory: dailyTurnover,
                    totalTurnover: res.totalTurnover,
                    totalWinLoss: res.totalWinLoss,
                    lastUpdatedDate: res.lastUpdatedDate,
                    totalPage: res.totalRowCount % rowCount === 0 ? res.totalRowCount / rowCount : Math.floor(res.totalRowCount / rowCount) + 1,
                })
            } else {
                this.setState({
                    bettingHistory: dailyTurnover,
                    lastUpdatedDate: res.lastUpdatedDate,
                })
            }
        }).catch(err => {
            Toast.hide()
        })

        providerList[providerListIndex].providerCode.toLocaleUpperCase() == 'SGW' && window.PiwikMenberCode('Lottery_SGW__Bethistory')
        providerList[providerListIndex].providerCode.toLocaleUpperCase() == 'TCG' && window.PiwikMenberCode('Lottery_TC__Bethistory')
        providerList[providerListIndex].providerCode.toLocaleUpperCase() == 'TFG' && window.PiwikMenberCode('E-Sports_TF__Bethistory')
    }


    onCanclePickerModal(providerListIndex) {
        this.setState({
            providerListIndex,
        })
    }

    render() {
        const { dataType, dateModalVisible, arrowFlag, pageNumber, totalPage, lastUpdatedDate, totalWinLoss, totalTurnover, bettingHistory, dateFrom, dateTo, providerList, providerListIndex } = this.state
        const bettingTextColor = { color: window.isBlue ? '#fff' : '#fff' }
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
            <Text style={{ color: '#4E4E4E', fontSize: 11, textAlign: 'center', marginBottom: 8 }}>ประวัติการเดิมพันจะอัพเดทเฉพาะการเดิมพันที่ปรับเรียบร้อยแล้วจากผู้ให้บริการ</Text>

            <DatePickerCommon
                dateTo={dateTo}
                dateFrom={dateFrom}
                fromPage={'BettingHistory'}
                changeBettingDatePicker={this.changeBettingDatePicker.bind(this)}
            ></DatePickerCommon>


            {
                (Array.isArray(providerList) && providerList.length > 0)
                    ?
                    <DatePickerView
                        onCanclePickerModal={this.onCanclePickerModal.bind(this)}
                        pickerData={providerList}
                        selectedValueIndex={providerListIndex}
                    />
                    :
                    <View style={[styles.toreturnModalDropdown, { backgroundColor: '#e0e0e0', borderColor: 'transparent' }]}>
                        <LoadingBone></LoadingBone>
                    </View>
            }

            <TouchableOpacity style={styles.serchBtn} onPress={() => {
                this.setState({
                    pageNumber: 1
                }, () => {
                    this.getMemberDailyTurnover()
                })
            }}>
                <Text style={styles.serchBtnText}>ค้นหา</Text>
            </TouchableOpacity>

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                {
                    <View style={styles.bettingTotalTime}>
                        <Image source={require('./../../images/account/recordClock.png')} resizeMode='stretch' style={{ width: 16, height: 16, marginRight: 5 }}></Image>
                        <Text style={styles.bettingTotalTimeCircleText}>อัพเดทล่าสุด: {moment(lastUpdatedDate).format('MM/DD/YYYY HH:mm:ss')}</Text>
                    </View>
                }

                <View style={[styles.bettingTotalMoney, { backgroundColor: window.isBlue ? '#1E8CB9' : '#004764' }]}>
                    <View style={styles.bettingTotalMoneyList}>
                        <Text style={[styles.bettingTotalMoneyText, { width: 120 }]}>เงินเดิมพันรวม :</Text>
                        <Text style={styles.bettingTotalMoneyText}>{toThousands(totalTurnover)}</Text>
                    </View>
                    <View style={styles.bettingTotalMoneyList}>
                        <Text style={[styles.bettingTotalMoneyText, { width: 120 }]}>ยอดรวม ชนะ/แพ้ :</Text>
                        <Text style={styles.bettingTotalMoneyText}>{toThousands(totalWinLoss)}</Text>
                    </View>
                </View>


                {
                    bettingHistory === ''
                        ?
                        <Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{SelectTimeText}</Text>
                        :
                        (
                            Array.isArray(bettingHistory)
                                ?
                                (
                                    bettingHistory.length > 0 ? <View>
                                        {
                                            bettingHistory.map((v, i) => {
                                                let tempProviderCode = providerList.find(v1 => v1.providerCode === v.ProviderCode)
                                                let providerCode = tempProviderCode ? tempProviderCode.providerName : v.ProviderCode
                                                return <View key={i} style={[styles.bettingLists]}>

                                                    <View style={styles.bettingTextWrap}>
                                                        <View style={styles.bettingRightBox}>
                                                            <Text style={[styles.bettingTextBox]}>วันที่:: </Text>
                                                            <View>
                                                                <Text style={[styles.bettingText]}>{moment(v.DateLabel).format('MM-DD-YYYY')}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.bettingRightBox}>
                                                            <Text style={[styles.bettingTextBox]}>บัญชี: </Text>
                                                            <View>
                                                                <Text style={[styles.bettingText]}>{providerCode}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                    <View style={styles.bettingTextWrap}>
                                                        <View style={styles.bettingRightBox}>
                                                            <Text style={[styles.bettingTextBox]}>ยอดรวม: </Text>
                                                            <View>
                                                                <Text style={[styles.bettingText]}>{toThousands(v.Turnover)}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.bettingRightBox}>
                                                            <Text style={[styles.bettingTextBox]}>ชนะ/แพ้: </Text>
                                                            <View style={[styles.bettingRightBgBox, { backgroundColor: v.WinLoss > 0 ? '#65C369' : '#808080' }]}>
                                                                <Text style={styles.bettingRightText}>{toThousands(v.WinLoss)}</Text>
                                                            </View>
                                                        </View>
                                                    </View>

                                                </View>
                                            })
                                        }
                                    </View>
                                        :
                                        <Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>ไม่พบข้อมูล</Text>
                                )
                                :
                                <View>
                                    {
                                        Array.from({ length: 4 }, v => v).map((v, i) => {
                                            return <View style={[styles.rebateDataWrap1]} key={i}>
                                                <LoadingBone></LoadingBone>
                                            </View>
                                        })
                                    }
                                </View>
                        )
                }
            </ScrollView>

            {
                Array.isArray(bettingHistory) && bettingHistory.length > 0 && <View style={[styles.paginationBox, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
                    <View style={styles.paginationBox1}>
                        <ScrollView
                            automaticallyAdjustContentInsets={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            horizontal={true}
                        >
                            <View style={styles.paginationBox2}>
                                {
                                    //totalPage
                                    Array.from({ length: totalPage }, (v, i) => i + 1).map((v, i) => <TouchableOpacity
                                        key={i}
                                        style={[styles.paginationWrap, {
                                            borderColor: window.isBlue ? (pageNumber * 1 === v * 1 ? '#25AAE1' : '#DDDDDD') : (pageNumber * 1 === v * 1 ? '#00AEEF' : '#2E2E2E'),
                                            backgroundColor: window.isBlue ? (pageNumber * 1 === v * 1 ? '#25AAE1' : '#F3F3F3') : (pageNumber * 1 === v * 1 ? '#00AEEF' : '#212121')
                                        }]}
                                        onPress={() => {
                                            this.setState({
                                                pageNumber: v
                                            }, () => {
                                                this.getMemberDailyTurnover()
                                            })
                                        }}
                                    >
                                        <Text style={[styles.paginationText, { color: window.isBlue ? (pageNumber * 1 === v * 1 ? '#fff' : '#25AAE1') : '#fff' }]}>{v}</Text>
                                    </TouchableOpacity>)
                                }
                            </View>
                        </ScrollView>
                    </View>

                    <TouchableOpacity style={[styles.paginationWrap, styles.paginationComWrap, { left: 10, borderColor: window.isBlue ? '#DDDDDD' : '#2E2E2E', backgroundColor: window.isBlue ? '#F3F3F3' : '#212121' }]} onPress={() => {
                        if (pageNumber > 1) {
                            this.setState({
                                pageNumber: pageNumber - 1
                            }, () => {
                                this.getMemberDailyTurnover()
                            })
                        }
                    }}>
                        <Text style={[styles.paginationText, {
                            color: window.isBlue ? '#25AAE1' : '#fff'
                        }]}>&lt;</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.paginationWrap, styles.paginationComWrap, { right: 10, borderColor: window.isBlue ? '#DDDDDD' : '#2E2E2E', backgroundColor: window.isBlue ? '#F3F3F3' : '#212121' }]} onPress={() => {
                        if (pageNumber < totalPage) {
                            this.setState({
                                pageNumber: pageNumber + 1
                            }, () => {
                                this.getMemberDailyTurnover()
                            })
                        }
                    }}>
                        <Text style={[styles.paginationText, {
                            color: window.isBlue ? '#25AAE1' : '#fff',
                        }]}>&gt;</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    }
}

export default (BettingHistory)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: 'relative',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10
    },
    rebateDataWrap1: {
        backgroundColor: '#e0e0e0',
        marginTop: 8,
        borderRadius: 5,
        height: 120,
        overflow: 'hidden'
    },
    toreturnModalDropdown: {
        height: 40,
        borderRadius: 4,
        marginTop: 8,
        borderWidth: 1,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    toreturnDropdownStyle: {
        marginTop: 10,
        width: width - 20,
        shadowColor: '#DADADA',
        shadowRadius: 4,
        shadowOpacity: .6,
        shadowOffset: { width: 2, height: 2 },
        elevation: 4
    },
    toreturnModalDropdownTextWrap: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden'
    },
    toreturnModalDropdownList: {
        height: 30,
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    toreturnModalDropdownListText: {},
    toreturnModalDropdownText: {
        fontSize: 13
    },
    serchBtn: {
        height: 40,
        backgroundColor: '#26A9E1',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 5
    },
    serchBtnText: {
        color: '#fff'
    },
    bettingLists: {
        borderWidth: 1,
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        borderRadius: 4,
        marginBottom: 8,
        borderColor: '#C9C9C9',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center'
    },
    bettingTotalTime: {
        flexDirection: 'row',
        height: 28,
        alignItems: 'center',
        marginBottom: 5
    },
    bettingTotalTimeCircleText: {
        color: '#25AAE1',
    },
    bettingTotalMoney: {
        borderRadius: 4,
        height: 50,
        justifyContent: 'center',
        marginBottom: 8,
        paddingLeft: 10
    },
    bettingMoneyWrap1: {
        width: (width - 20) / 2,
        alignItems: 'flex-end'
    },
    bettingMoneyWrap2: {
        width: (width - 20) / 2,
        alignItems: 'flex-start'
    },
    bettingTotalMoneyText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    bettingTotalMoneyList: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bettingTextWrap: {
        width: (width - 40) * .5
    },
    bettingTextBox: {
        marginBottom: 5,
        fontSize: 13,
        color: '#323232',
        width: 60
    },
    bettingRightBox: {
        flexDirection: 'row',
    },
    bettingText: {
        fontSize: 13,
        color: '#707070'
    },
    bettingRightBgBox: {
        backgroundColor: '#33C85D',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 3,
        width: 90
    },
    bettingRightText: {
        color: '#fff',
        fontSize: 13
    },
    paginationBox: {
        zIndex: 10,
        position: 'absolute',
        bottom: 0,
        width,
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
    },
    paginationBox1: {
        marginHorizontal: 40,
        width: width - 20 - 80,
        height: 70,
        justifyContent: 'center'
    },
    paginationBox2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
    },
    paginationText: {
        color: '#25AAE1'
    },
    paginationWrap: {
        borderWidth: 1,
        borderRadius: 4,
        width: 30,
        height: 30,
        marginHorizontal: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#CCCCCC'
    },
    paginationComWrap: {
        position: 'absolute'
    },
    recordText: {
        marginTop: 100,
        textAlign: 'center'
    },
    viewModalContainer: {
        width,
        height,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, .2)',
        position: 'relative'
    },
    viewModalBox: {
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    modalHeaderText: {
        color: '#26AAE2',
        fontSize: 18
    },
    modalHeaderBtn: {
        paddingHorizontal: 20,
        height: 44,
        justifyContent: 'center'
    },
    modalHeader: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#fff'
    },
    bettingDatePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 20,
        backgroundColor: '#F3F4F8'
    },
    datePickerWrapView: {
        flexDirection: 'row',
        height: 40,
        width: (width - 20) / 2.08,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#DDDDDD',
        backgroundColor: '#fff'
    },
    calendarImg: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 8
    },
    recordStyle: {
        borderRadius: 4,
        borderWidth: 1,
        width: (width - 36) / 2.05,
    }
})