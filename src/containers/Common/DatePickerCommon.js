import React from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, Modal } from 'react-native'
import Toast from '@/containers/Toast'

import DatePicker from 'react-native-date-picker'
import moment from 'moment'


const { width, height } = Dimensions.get('window')
const HistoryDates = [
    {
        title: 'วัน',
        day: 0,
        piwikMenberText: 'Day_rebate_promopage'
    },
    {
        title: 'สัปดาห์',
        day: 6,
        piwikMenberText: 'Week_rebate_promopage'
    },
    {
        title: 'เดือน',
        day: 29,
        piwikMenberText: 'Month_rebate_promopage'
    },
]

export default class DatePickerCommon extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDateLabel: 0,
            minDate: moment().subtract(89, 'days').format('YYYY-MM-DD'),
            isShowDataPicker: false,
            dateType: 'from'
        }
    }

    changeBettingDatePicker(type, date) {
        const { dateTo, dateFrom } = this.props
        if (type === 'dateFrom') {
            if ((new Date(moment(date).format('YYYY-MM-DD'))).getTime() > (new Date(dateTo)).getTime()) {
                Toast.fail('วันเริ่มต้นต้องก่อนวันที่สิ้นสุด', 2)
                return
            } else {
                this.setState({
                    currentDateLabel: moment().diff(moment(date), 'days')
                })
            }
        }
        if (type === 'dateTo') {
            if ((new Date(moment(date).format('YYYY-MM-DD'))).getTime() < (new Date(dateFrom)).getTime()) {
                Toast.fail('วันเริ่มต้นต้องก่อนวันที่สิ้นสุด', 2)
                return
            }
        }
        this.props.changeBettingDatePicker(type, date)
    }

    changeBettingHistoryDatesIndex(label, i) {
        this.setState({
            currentDateLabel: label * 1
        })
        this.props.changeBettingDatePicker('dateFrom', moment().subtract(label, 'days').format('YYYY-MM-DD'))

        this.props.fromPage === 'RebateRecord' && HistoryDates[i].piwikMenberText && window.PiwikMenberCode(HistoryDates[i].piwikMenberText)
    }


    openPickerModal(type) {
        this.setState({
            isShowDataPicker: true,
            dateType: type
        })
    }

    render() {
        const { isShowDataPicker, currentDateLabel, minDate, dateType } = this.state
        const { dateTo, dateFrom, fromPage } = this.props
        const CalendarImg = window.isBlue ? require('./../../images/common/calendarIcon/calendar0.png') : require('./../../images/common/calendarIcon/calendar1.png')

        return <View>
            {
                ['RebateRecord', 'BettingHistory'].some(v => v === fromPage) && <View style={styles.bettingWraps}>
                    {
                        HistoryDates.map((v, i) => {
                            let flag = v.day === currentDateLabel
                            return <TouchableOpacity
                                onPress={this.changeBettingHistoryDatesIndex.bind(this, v.day, i)}
                                key={i}
                                style={[styles.bettingBox, {
                                    backgroundColor: window.isBlue ? (flag ? '#06ADEF' : '#fff') : (flag ? '#25AAE1' : '#0F0F0F'),
                                    borderColor: window.isBlue ? (flag ? '#06ADEF' : '#C9C9C9') : (flag ? '#25AAE1' : '#646464'),
                                    //  borderBottomColor: window.isBlue ? (flag ? '#009CD6' : '#DADADA') : (flag ? '#009CD6' : '#646464'),
                                }]}
                            >
                                <Text style={[{ color: window.isBlue ? (flag ? '#fff' : '#707070') : '#fff', fontWeight: 'bold' }]}>{v.title}</Text>
                            </TouchableOpacity>
                        })
                    }
                </View>
            }

            <View style={styles.bettingDatePicker}>
                <TouchableOpacity styles={styles.bettingDatePicker} onPress={this.openPickerModal.bind(this, 'from')}>
                    <View style={[styles.datePickerWrapView, {
                        backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: '#C9C9C9',
                        borderBottomColor: window.isBlue ? '#4C4C4C34' : '#00CEFF',
                    },
                    fromPage == 'record' ? styles.recordStyle : '',
                    ]}>
                        <Text style={[styles.bettingDate, { color: window.isBlue ? '#707070' : '#fff' }]}>{moment(dateFrom).format('DD-MM-YYYY')}</Text>
                        <Image source={CalendarImg} resizeMode='stretch' style={[styles.calendarImg]}></Image>
                    </View>
                </TouchableOpacity>


                <TouchableOpacity styles={styles.bettingDatePicker} onPress={this.openPickerModal.bind(this, 'to')}>
                    <View style={[styles.datePickerWrapView, {
                        backgroundColor: window.isBlue ? '#fff' : '#0F0F0F', borderColor: '#C9C9C9',
                        borderBottomColor: window.isBlue ? '#4C4C4C34' : '#00CEFF',
                    },
                    fromPage == 'record' ? styles.recordStyle : ''
                    ]}>
                        <Text style={[styles.bettingDate, { color: window.isBlue ? '#707070' : '#fff' }]}>{moment(dateTo).format('DD-MM-YYYY')}</Text>
                        <Image source={CalendarImg} resizeMode='stretch' style={styles.calendarImg}></Image>
                    </View>
                </TouchableOpacity>
            </View>

            <DatePicker
                title=' '
                confirmText='เสร็จสิ้น'
                cancelText='  '
                modal
                mode='date'
                locale={'th'}
                open={isShowDataPicker}
                date={new Date(dateType == 'from' ? dateFrom : dateTo)}
                maximumDate={new Date()}
                minimumDate={new Date(minDate)}
                onConfirm={date => {
                    this.setState({
                        isShowDataPicker: false
                    })
                    this.changeBettingDatePicker(dateType == 'from' ? 'dateFrom' : 'dateTo', date)
                }}
                onCancel={() => {
                    this.setState({
                        isShowDataPicker: false
                    })
                }}
            />
        </View>
    }
}

const styles = StyleSheet.create({
    bettingWraps: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    bettingBox: {
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        width: (width - 20) / 3.2,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
    },
    bettingDatePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    datePickerWrapView: {
        flexDirection: 'row',
        height: 40,
        width: (width - 20) / 2.05,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4
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