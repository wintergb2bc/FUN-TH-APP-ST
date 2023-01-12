import React from 'react'
import { StyleSheet, Text, View, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Image, Modal } from 'react-native'
import Toast from '@/containers/Toast'
import LinearGradient from 'react-native-linear-gradient'
import { connect } from 'react-redux'
import { getMemberInforAction, getQueleaActiveCampaignInforAction, changeHomeRegistLoginModalAction } from './../../../actions/ReducerAction'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { RecommendStepDetail, RecommendFaq, RecommendRules } from './RecommendData'
import * as Animatable from 'react-native-animatable'
import { Actions } from 'react-native-router-flux'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text

class RecommendContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerData: [
                require('./../../../images/account/recommend/recommendBanner1.png')
            ],
            bannerIndex: 0,
            isShowRecommendRules: false,
            queleaActiveCampaign: {}
        }
    }


    componentDidMount() {
        this.props.getQueleaActiveCampaignInforAction()
        this.setState({
            queleaActiveCampaign: this.props.queleaActiveCampaignData
        })

        //this.getQueleaReferrerInfo()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.queleaActiveCampaignData) {
            this.setState({
                queleaActiveCampaign: nextProps.queleaActiveCampaignData
            })
        }
    }

    getQueleaReferrerInfo() {
        fetchRequest(ApiPort.GetQueleaReferrerInfo, 'GET').then(res => {
            Toast.hide()

        }).catch(err => {
            Toast.hide()
        })
    }


    renderPage(item) {
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}
                defaultSource={window.isBlue ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')}
                source={item.item} />
        </TouchableOpacity>
    }

    goRecommendPage1() {
        window.PiwikMenberCode('Viewprogress_referfriend_landing')
        if (ApiPort.UserLogin) {
            Actions.RecommendPage()
        } else {
            // Toast.fail('กรุณาเข้าสู่ระบบ', 2)
            // Actions.login({ types: 'login' })
            // return

            if (!ApiPort.UserLogin) {
                this.props.changeHomeRegistLoginModalAction({
                    flag: true,
                    page: 'profile'
                })
                return
            }
        }
    }

    goRecommendPage2() {
      
        window.PiwikMenberCode('Learmore_referfriend_landing')
        Actions.RecommendRuler()
        return
        if (ApiPort.UserLogin) {
            Actions.RecommendPage()
        } else {
            Actions.RecommendRuler()
        }
    }

    render() {
        const { queleaActiveCampaign, bannerData, bannerIndex, isShowRecommendRules } = this.state
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F4' : '#000' }]}>
            <Modal animationType='fade' transparent={true} visible={isShowRecommendRules}>
                <View style={[styles.modalContainer]}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHead}>
                            <Text style={styles.modalHeadText}>Điều Khoản & Điều Kiện</Text>

                            <TouchableOpacity
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                                style={styles.modalHeadCloseBtn}
                                onPress={() => {
                                    this.setState({
                                        isShowRecommendRules: false
                                    })
                                    window.PiwikMenberCode('Close_TNCrefer')
                                }}>
                                <Text style={styles.modalHeadCloseBtnText}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.recommendRulesContainer}>
                            {
                                RecommendRules.map((v, i) => {
                                    return <View key={i} style={styles.recommendRulesBox}>
                                        <Text style={styles.recommendRulesText}>{i + 1}. </Text>
                                        <Text style={[styles.recommendRulesText, styles.recommendRulesText1]}>{v}</Text>
                                    </View>
                                })
                            }
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Carousel
                        data={bannerData}
                        renderItem={this.renderPage.bind(this)}
                        sliderWidth={width}
                        itemWidth={width}
                        autoplay={true}
                        loop={true}
                        inactiveSlideScale={1}
                        autoplayDelay={500}
                        autoplayInterval={4000}
                        onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                    />
                    <Pagination
                        dotsLength={bannerData.length}
                        activeDotIndex={bannerIndex}
                        containerStyle={styles.containerStyle}
                        dotStyle={styles.dotStyle}
                        inactiveDotStyle={styles.inactiveDotStyle}
                        inactiveDotOpacity={1}
                        inactiveDotScale={0.6}
                    />
                </View>

                <View style={{ paddingHorizontal: 10 }}>
                    <View>
                        <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff' }]}>วิธีเข้าร่วม</Text>
                        <View>
                            {
                                RecommendStepDetail.map((v, i) => {
                                    return <View style={[styles.recommendStepDetailBox]} key={i}>
                                        <LinearGradient
                                            colors={window.isBlue ? ['#ecebeb', '#fff'] : ['#3b3b3b', '#242425']}
                                            start={{ y: 0, x: 0 }}
                                            end={{ y: 1, x: 0 }}
                                            style={styles.recommendStepDetailWrap}>
                                            <View style={styles.recommendStepDetailImgBox}>
                                                <Image
                                                    source={v.img}
                                                    resizeMode='stretch'
                                                    style={styles.recommendStepDetailImg}
                                                ></Image>
                                            </View>

                                            <View style={styles.recommendStepDetailRightBox}>
                                                <Text style={[styles.recommendStepDetailRightText1, { color: window.isBlue ? '#161616' : '#fff' }]}>ขั้นตอนที่ {i + 1}: </Text>
                                                <Text style={[styles.recommendStepDetailRightText2, { color: window.isBlue ? '#161616' : '#fff' }]}>{v.text}</Text>
                                            </View>
                                            {
                                                i * 1 !== 0 && <View style={[styles.recommendStepDetailArrow, { borderTopColor: window.isBlue ? '#fff' : '#242425' }]}></View>
                                            }
                                        </LinearGradient>

                                    </View>
                                })
                            }
                        </View>
                        <TouchableOpacity style={[styles.recommendStepDetailBtn, { marginTop: 15 }]} onPress={this.goRecommendPage1.bind(this)}>
                            <Text style={styles.recommendStepDetailBtnText}>{ApiPort.UserLogin ? 'ดูการแนะนำของคุณ' : 'ร่วมสนุกเลย'}</Text>
                        </TouchableOpacity>
                    </View>

                    {
                        // <View>
                        //     <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff' }]}>Giải Thưởng</Text>

                        //     <View style={[styles.recommendTabble, { shadowColor: window.isBlue ? '#d6d6d6' : '#000' }]}>
                        //         <View style={[styles.recommendTr, styles.recommendTr2]}>
                        //             <View style={[styles.recommendTd, styles.recommendTd1]}>
                        //                 <Text style={styles.recommendTdText1}>Người Giới Thiệu Hợp Lệ</Text>
                        //             </View>
                        //             <View style={[styles.recommendTd, styles.recommendTd2]}>
                        //                 <Text style={styles.recommendTdText1}>Tiền Thưởng</Text>
                        //             </View>
                        //         </View>
                        //         {/* queleaActiveCampaign.maxReferral > 0 && queleaActiveCampaign.contactVerifiedReferralReward > 0 && */}
                        //         {
                        //             Array.from({ length: 5 }, (v, i) => i).map((v, i) => {
                        //                 return <View style={[styles.recommendTr, styles[`recommendTr${i % 2}`], styles[`recommendTr${i === 4 ? 3 : 4}`]]}>
                        //                     <View style={[styles.recommendTd, styles.recommendTd1]}>
                        //                         <Text style={styles.recommendTdText2}>{i + 1}</Text>
                        //                     </View>
                        //                     <View style={[styles.recommendTd, styles.recommendTd2]}>
                        //                         <Text style={styles.recommendTdText2}>{100}</Text>
                        //                     </View>
                        //                 </View>
                        //             })
                        //         }
                        //     </View>

                        //     {
                        //         <View>
                        //             <LinearGradient
                        //                 colors={['#70D5FF', '#0087E2']}
                        //                 start={{ y: 0, x: 0 }}
                        //                 end={{ y: 0, x: 1 }}
                        //                 style={styles.recommendRewardBox}>
                        //                 <View style={styles.recommendRewardBoxLeft}>
                        //                     <View style={styles.recommendRewardBoxLeftImgCircle}>
                        //                         <Image
                        //                             resizeMode='stretch'
                        //                             style={styles.recommendRewardBoxLeftImg}
                        //                             source={require('./../../../images/account/recommend/recommendIphone.png')}
                        //                         ></Image>
                        //                     </View>
                        //                 </View>
                        //                 <View style={styles.recommendRewardBoxRight}>
                        //                     <ImageBackground
                        //                         resizeMode='stretch'
                        //                         style={styles.recommendRewardBoxRightImg}
                        //                         source={require('./../../../images/account/recommend/recommendPize.png')}
                        //                     >
                        //                         <Text style={styles.recommendRewardBoxRightImgText}>1</Text>
                        //                     </ImageBackground>
                        //                     <View>
                        //                         <Text style={styles.recommendRewardBoxRightText1}>Top 1</Text>
                        //                         <Text style={styles.recommendRewardBoxRightText1}>Giới Thiệu Nhiều Bạn Nhất</Text>
                        //                         <Text style={styles.recommendRewardBoxRightText2}>iPhone 12 Pro Max</Text>
                        //                     </View>
                        //                 </View>
                        //                 <View style={styles.recommendRewardBoxLine}></View>
                        //             </LinearGradient>


                        //         </View>
                        //     }
                        // </View>
                    }


                    <View style={styles.recommendRewardDetailBox}>
                        <View style={[styles.recommendRewardDetailBoxList, styles.recommendRewardDetailBoxList3, { shadowColor: window.isBlue ? '#d6d6d6' : '#000' }]}>
                            <Image
                                source={require('./../../../images/account/recommend/RecommendStepDetail4.png')}
                                resizeMode='stretch'
                                style={styles.recommendStepDetailImg1}
                            ></Image>
                        </View>

                        <View style={[styles.recommendRewardDetailBoxList, { shadowColor: window.isBlue ? '#d6d6d6' : '#000', marginRight: 40 }]}>
                            <Text style={styles.recommendRewardDetailBoxList1}>แนะนำเพื่อนทุกๆ 1 คน</Text>
                            <Text style={styles.recommendRewardDetailBoxList2}>รับ 300 บาท</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.recommendStepDetailBtn, { backgroundColor: '#25AAE1' }]} onPress={this.goRecommendPage2.bind(this)}>
                        <Text style={styles.recommendStepDetailBtnText}>ดูเงื่อนไขเพิ่มเติม</Text>
                    </TouchableOpacity>

                    <View style={{ paddingBottom: 40 }}>
                        <Text style={[styles.recommendComTitle, { color: window.isBlue ? '#000' : '#fff' }]}>คำถามที่พบบ่อย</Text>
                        <View>
                            {
                                RecommendFaq.map((v, i) => {
                                    return <View key={i} style={styles.recommendFaqBox}>
                                        <Text style={styles.recommendFaqText1}>{v.title}</Text>
                                        <Text style={[styles.recommendFaqText2, { color: window.isBlue ? '#161616' : '#fff' }]}>{v.text}</Text>
                                    </View>
                                })
                            }
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    }
}

export default Recommend = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
            queleaActiveCampaignData: state.queleaActiveCampaignData
        }
    }, (dispatch) => {
        return {
            getMemberInforAction: () => dispatch(getMemberInforAction()),
            changeHomeRegistLoginModalAction: (flag) => dispatch(changeHomeRegistLoginModalAction(flag)),
            getQueleaActiveCampaignInforAction: () => dispatch(getQueleaActiveCampaignInforAction()),
        }
    }
)(RecommendContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    containerStyle: {
        paddingVertical: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 5
    },
    dotStyle: {
        width: 20,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
        backgroundColor: '#00CEFF'
    },
    carouselImg: {
        width,
        height: .483 * width,
    },
    inactiveDotStyle: {
        width: 10,
        backgroundColor: '#fff'
    },
    recommendStepDetailBox: {
        // shadowOffset: { width: 2, height: 2 },
        // shadowOpacity: 1,
        // shadowRadius: 5,
        // elevation: 4,
    },
    recommendComTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 45,
        marginTop: 10
    },
    recommendStepDetailWrap: {
        flexDirection: 'row',
        borderRadius: 4,
        paddingHorizontal: 10,
        height: 72,
        alignItems: 'center',
    },
    recommendStepDetailArrow: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: 16,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
        top: 0,
        zIndex: 1000,
        left: (width - 50) * .5
    },
    recommendStepDetailImgBox: {
        backgroundColor: '#25AAE1',
        borderRadius: 1000,
        marginRight: 15,
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommendStepDetailImg: {
        width: 28,
        height: 28,
    },
    recommendStepDetailRightBox: {},
    recommendStepDetailRightText1: {
        fontWeight: 'bold'
    },
    recommendStepDetailRightText2: {

    },
    recommendStepDetailBtn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#33C85D',
        borderRadius: 4
    },
    recommendStepDetailBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendFaqBox: {
        marginBottom: 10
    },
    recommendFaqText1: {
        color: '#25AAE1'
    },
    recommendFaqText2: {
        color: '#161616'
    },
    recommendTabble: {
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        shadowColor: '#00000029',
    },
    recommendTr: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#25AAE1',
    },
    recommendTr0: {
        backgroundColor: '#fff'
    },
    recommendTr1: {
        backgroundColor: '#f2f2f2'
    },
    recommendTr2: {
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4
    },
    recommendTr3: {
        borderBottomRightRadius: 4,
        borderBottomLeftRadius: 4
    },
    recommendTd: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommendTd1: {
        width: (width - 20) * .65
    },
    recommendTd2: {
        width: (width - 40) * .35
    },
    recommendTdText1: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendTdText2: {
        color: '#161616'
    },
    recommendRewardBox: {
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 15,
        borderRadius: 4,
        position: 'relative'
    },
    recommendRewardBoxLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: (width - 40) * .35,
        zIndex: 1000,
        borderWidth: 1,
        width: 1,
        borderColor: '#fff',
        borderStyle: 'dashed'
    },
    recommendRewardDetailBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 15,
        backgroundColor: '#FFFFFF',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 4,
        shadowColor: '#00000029',
        //overflow: 'hidden'
    },
    recommendStepDetailImg1: {
        width: 75,
        height: 75
    },
    doshLine: {
        // color: '#E5E5E5',
        // transform: [{
        //     rotate: '90deg'
        // }],
        // position: 'absolute',
        // left: 30,
        // top: 0
    },
    recommendRewardDetailBoxList: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        // shadowOffset: { width: 2, height: 2 },
        // shadowOpacity: 1,
        // shadowRadius: 5,
        // elevation: 4,
        // borderRadius: 5,
        backgroundColor: '#fff'
    },
    recommendRewardDetailBoxList3: {
        borderRightWidth: 1,
        borderRightColor: '#E5E5E5',
        //    borderStyle: 'dashed'
    },
    recommendRewardDetailBoxList1: {
        color: '#161616',
        textAlign: 'center'
    },
    recommendRewardDetailBoxList2: {
        color: '#00A6FF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    recommendRewardBoxLeft: {
        width: (width - 40) * .35,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommendRewardBoxLeftImgCircle: {
        width: (width - 40) * .35 * .7,
        height: (width - 40) * .35 * .7,
        backgroundColor: '#fff',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recommendRewardBoxLeftImg: {
        width: (width - 40) * .35 * .7 * .8 * .85,
        height: (width - 40) * .35 * .7 * .8,
    },
    recommendRewardBoxRight: {
        width: (width - 40) * .65,
        alignItems: 'center',
        flexDirection: 'row',
    },
    recommendRewardBoxRightImg: {
        width: 58 * .45,
        height: 70 * .45,
        marginRight: 10,
        alignItems: 'center'
    },
    recommendRewardBoxRightImgText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recommendRewardBoxRightText1: {
        color: '#fff',
    },
    recommendRewardBoxRightText2: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .5)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBox: {
        width: .92 * width,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#fff',
        position: 'relative'
    },
    modalHead: {
        flexDirection: 'row',
        backgroundColor: '#25AAE1',
        height: 45,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15
    },
    modalHeadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    modalHeadCloseBtn: {
        width: 25,
        height: 25,
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 10000,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalHeadCloseBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    recommendRulesBox: {
        flexDirection: 'row',
    },
    recommendRulesText: {
        color: '#161616',
        flexWrap: 'wrap',
        lineHeight: 18,
    },
    recommendRulesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15
    },
    recommendRulesText1: {
        width: (.92 * width) - 50
    }
})