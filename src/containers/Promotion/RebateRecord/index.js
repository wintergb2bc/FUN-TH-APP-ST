import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import moment from 'moment'
import { toThousands } from '../../../actions/Reg'
import DatePickerCommon from './../../Common/DatePickerCommon'
import LoadIngImgActivityIndicator from './../../Common/LoadIngImgActivityIndicator'
import { SelectTimeText, NoRecordText } from './../../Common/CommonData'
import LoadingBone from './../../Common/LoadingBone'
import * as Animatable from 'react-native-animatable'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
import RebateRecordDetail from './RebateRecordDetail'
export default class RebateRecord extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            dateFrom: moment().subtract(0, 'days').format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            totalPayout: '',
            promotionList: '',
            searchDays: 1,
            gameLoadObj: {},
            isShowRdDepositModal: false,
            openDatailFlag: false,
            rebates: []
        }
    }

    componentDidMount() {
        this.getMmpStore()
        this.getRebateRecords()
    }


    getMmpStore() {
        storage.load({
            key: 'RebateRecordFirsrtGuider' + window.userNameDB,
            id: 'RebateRecordFirsrtGuider' + window.userNameDB
        }).then(data => {
            this.setState({
                isShowRdDepositModal: false
            })
        }).catch(() => {
            this.setState({
                isShowRdDepositModal: true
            })
        })
    }

    changeBettingDatePicker(type, date) {
        window.PiwikMenberCode('Calendar_rebate_promopage')
        this.setState({
            [type]: moment(date).format('YYYY-MM-DD')
        })
    }

    getRebateRecords() {
        this.setState({
            totalPayout: '',
            promotionList: {},
            searchDays: 1,
            gameLoadObj: {}
        })
        const { dateFrom, dateTo } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.Promotions + `?promoSecondType=rebatepromotion&dateFrom=${dateFrom}&dateTo=${dateTo}&`, 'GET').then(res => {
            Toast.hide()
            if (Array.isArray(res)) {
                let promotionList = res.filter(v => v.memberPromotionRebateViewData)
                let tempMemberPromotionRebateViewData = promotionList.map(v => v.memberPromotionRebateViewData)
                let totalPayout = tempMemberPromotionRebateViewData.reduce((num, v) => num += (v.rebatesSummary.length ? v.rebatesSummary[0].totalRebateAmount * 10000000000 : 0), 0) / 10000000000
                this.setState({
                    totalPayout,
                    promotionList,
                    searchDays: moment(dateTo).diff(moment(dateFrom), 'day') + 1
                })
            }
        }).catch(err => {
            Toast.hide()
        })
        window.PiwikMenberCode('Search_rebate_promopage')
    }

    getLoadImgStatus(i, flag) {
        this.state.gameLoadObj[`imgStatus${i}`] = flag
        this.setState({})
    }


    renderPage(item) {
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}
                source={item.item.img} />
            {
                item.index == 2 && <TouchableOpacity style={styles.closeBtn} onPress={() => {
                    this.changeisShowRdDepositModal(false)
                }}></TouchableOpacity>
            }
        </TouchableOpacity>
    }

    changeisShowRdDepositModal(isShowRdDepositModal) {
        this.setState({
            isShowRdDepositModal
        })

        global.storage.save({
            key: 'RebateRecordFirsrtGuider' + window.userNameDB,
            id: 'RebateRecordFirsrtGuider' + window.userNameDB,
            data: true,
            expires: null
        })
    }

    openDatail(openDatailFlag) {
        this.setState({
            openDatailFlag
        })
    }

    render() {
        const { rebates, openDatailFlag, isShowRdDepositModal, searchDays, promotionList, totalPayout, dateFrom, dateTo } = this.state
        const RebateRightText1Color = { color: window.isBlue ? '#000' : '#fff' }
        const defaultSource = window.isBlue ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')
        const bannerData = [
            {
                img: require('./../../../images/promotion/preferential/preferentialRecord/PreferentialRecords1.png'),
            },
            {
                img: require('./../../../images/promotion/preferential/preferentialRecord/PreferentialRecords2.png'),
            },
            {
                img: require('./../../../images/promotion/preferential/preferentialRecord/PreferentialRecords3.png'),
            }
        ]
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>

            <Modal animationType='fade' transparent={true} visible={isShowRdDepositModal}>
                <View style={[styles.modalContainer]}>
                    <Carousel
                        data={bannerData}
                        renderItem={this.renderPage.bind(this)}
                        sliderWidth={width}
                        inactiveSlideScale={1}
                        itemWidth={width}
                        useScrollView={true}
                        onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                    />
                </View>
            </Modal>

            <RebateRecordDetail
                openDatailFlag={openDatailFlag}
                openDatail={this.openDatail.bind(this)}
                rebates={rebates}
            ></RebateRecordDetail>


            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <DatePickerCommon
                    fromPage={'RebateRecord'}
                    changeBettingDatePicker={this.changeBettingDatePicker.bind(this)}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                ></DatePickerCommon>

                <TouchableOpacity style={styles.serchBtn} onPress={this.getRebateRecords.bind(this)}>
                    <Text style={styles.serchBtnText}>ค้นหา</Text>
                </TouchableOpacity>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F3F4F8', paddingVertical: 10 }}>
                    <View>
                        <Text style={[styles.myPromotionSrotsText2, { color: window.isBlue ? '#737373' : '#A5A5A5' }]}>ยอดหมุนเวียนทั้งหมดถูกบันทึกอัตโนมัติ</Text>
                        <Text style={[styles.myPromotionSrotsText2, { color: window.isBlue ? '#737373' : '#A5A5A5' }]}>อัพเดทล่าสุด: {moment(new Date()).format('YYYY-MM-DD hh:mm:ss')}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            this.changeisShowRdDepositModal(true)
                        }}
                        style={{ flexDirection: 'row', borderWidth: 1, borderRadius: 4, alignItems: 'center', borderColor: '#4FAEEA', backgroundColor: '#FFFFFF', justifyContent: 'center', height: 30, paddingHorizontal: 5 }}>
                        <Image
                            source={require('./../../../images/promotion/preferential/preferentialIcon/promotion00.png')}
                            resizeMode='stretch'
                            style={{ width: 20, height: 20, marginRight: 5 }}
                        ></Image>
                        <Text style={{ color: '#4FAEEA', fontSize: 13 }}>คู่มือโบนัสต่างๆ</Text>
                    </TouchableOpacity>
                </View>

                {
                    Array.isArray(promotionList) && promotionList.length > 0 && <View style={styles.rebateTotalWrapText}>
                        <Text style={styles.rebateTotalText}>ยอดเงินคืนทั้งหมด {toThousands(totalPayout)}</Text>
                    </View>
                }
                <View>
                    {
                        promotionList === ''
                            ?
                            <Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{SelectTimeText}</Text>
                            :
                            (
                                Array.isArray(promotionList)
                                    ?
                                    (
                                        promotionList.length > 0
                                            ?
                                            promotionList.map((v, i) => {
                                                let rebatesSummary = v.memberPromotionRebateViewData.rebatesSummary
                                                let isRebatesSummary = Array.isArray(rebatesSummary) && rebatesSummary.length > 0
                                                return <AnimatableView key={i} delay={400 * i} animation={i % 2 ? 'fadeInDown' : 'fadeInUp'} easing='ease-out-cubic'>
                                                    <View style={[styles.rebateDataWrap, { backgroundColor: window.isBlue ? '#fff' : '#000', borderColor: window.isBlue ? '#fff' : '#575757', }]}>
                                                        <TouchableOpacity style={styles.rebateLeftData} onPress={() => {
                                                            if (!v.modalHtml) return
                                                            Actions.PreferentialPage({ promotionsDetail: v })
                                                        }}>
                                                            <View style={styles.thumbnailMobileImage}>
                                                                <Image
                                                                    resizeMode='stretch'
                                                                    defaultSource
                                                                    onLoadStart={this.getLoadImgStatus.bind(this, i, false)}
                                                                    onLoadEnd={this.getLoadImgStatus.bind(this, i, true)}
                                                                    source={v.thumbnailMobileImage ? { uri: v.thumbnailMobileImage } : defaultSource}
                                                                    style={styles.thumbnailMobileImage}></Image>
                                                                {
                                                                    !this.state.gameLoadObj[`imgStatus${i}`] && <LoadIngImgActivityIndicator />
                                                                }
                                                            </View>
                                                        </TouchableOpacity>
                                                        <View style={styles.rebateRightData}>
                                                            <View style={styles.rebateRightTextWrap}>
                                                                <Text style={[styles.rebateRightText1, RebateRightText1Color]}>ระดับสมาชิก</Text>
                                                                <Text style={[styles.rebateRightText2, { color: window.isBlue ? '#000' : '#25AAE1' }]}>{v.isVip ? 'สมาชิก VIP' : 'สมาชิกทั่วไป'}</Text>
                                                            </View>
                                                            <View style={styles.rebateRightTextWrap}>
                                                                <Text style={[styles.rebateRightText1, RebateRightText1Color]}>ยอดหมุนเวียน {searchDays} วันหลัง</Text>
                                                                <Text style={[styles.rebateRightText2, { color: window.isBlue ? '#000' : '#25AAE1' }]}>{isRebatesSummary ? toThousands(rebatesSummary[0].totalTurnover) : '-'}</Text>
                                                            </View>
                                                            <View style={styles.rebateRightTextWrap}>
                                                                <Text style={[styles.rebateRightText1, RebateRightText1Color]}>ยอดเงินคืน {searchDays} วันหลัง</Text>
                                                                <Text style={[styles.rebateRightText2, { color: '#25AAE1' }]}>{isRebatesSummary ? toThousands(rebatesSummary[0].totalRebateAmount) : '-'}</Text>
                                                            </View>
                                                            {
                                                                isRebatesSummary ? <TouchableOpacity
                                                                    style={[styles.historyBtn, styles.historyBtn1]}
                                                                    onPress={() => {
                                                                        this.setState({
                                                                            openDatailFlag: true,
                                                                            rebates: v.memberPromotionRebateViewData.rebatesSummary[0].rebates
                                                                        })

                                                                        // Actions.RebateRecordDetail({
                                                                        //     rebates: v.memberPromotionRebateViewData.rebatesSummary[0].rebates,
                                                                        //     thumbnailMobileImage: v.thumbnailMobileImage
                                                                        // })
                                                                    }}>
                                                                    <Text style={[styles.historyBtnText, { color: window.isBlue ? '#25AAE1' : '#fff' }]}>ประวัติ</Text>
                                                                </TouchableOpacity>
                                                                    :
                                                                    <View style={[styles.historyBtn]}>
                                                                        <Text style={[styles.historyBtnText, { color: window.isBlue ? '#555' : '#fff' }]}>ไม่พบข้อมูล เดิมพันตอนนี้!</Text>
                                                                    </View>
                                                            }
                                                        </View>
                                                    </View>
                                                </AnimatableView>
                                            })
                                            :
                                            <Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
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
                </View>
            </ScrollView>
        </View>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        position: 'relative',
        padding: 10,
        paddingBottom: 0
    },
    rebateLeftData: {
        justifyContent: 'center',
        width: 95,
    },
    thumbnailMobileImage: {
        width: 95,
        height: 70,
        borderRadius: 4,
        overflow: 'hidden'
    },
    serchBtn: {
        height: 40,
        backgroundColor: '#06ADEF',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    serchBtnText: {
        color: '#fff'
    },
    rebateTextWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rebateSrotsText: {
        color: '#737373',
        fontSize: 9,
        fontWeight: 'bold'
    },
    rebateTotalWrapText: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rebateTotalText: {
        color: '#25AAE1',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    rebateDataWrap: {
        marginBottom: 8,
        borderRadius: 5,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 8,
        paddingBottom: 8
    },
    rebateDataWrap1: {
        backgroundColor: '#e0e0e0',
        marginTop: 8,
        borderRadius: 5,
        height: 120,
        overflow: 'hidden'
    },
    rebateRightData: {
        width: width - 150
    },
    rebateRightTextWrap: {
        flexDirection: 'row',
        paddingVertical: 1.5,
        justifyContent: 'space-between'
    },
    rebateRightText1: {
        fontSize: 14,
        marginRight: 15
    },
    rebateRightText2: {
        fontWeight: 'bold',
        fontSize: 14
    },
    historyBtn: {
        borderRadius: 5,
        // borderWidth: 1,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555555',
        marginTop: 4
    },
    historyBtn1: {
        borderWidth: 1,
        borderColor: '#64CAF2'
    },
    historyBtnText: {},
    recordText: {
        marginTop: 100,
        textAlign: 'center'
    },
    carouselImg: {
        width,
        height,
    },
    closeBtn: {
        height: 50,
        position: 'absolute',
        bottom: 140,
        width,
    },
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E6E8'
    },
    myPromotionSrotsText2: {
        fontSize: 10
    },
})