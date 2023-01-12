import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, ScrollView, RefreshControl, Modal, Platform } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import * as Animatable from 'react-native-animatable'
import { connect } from 'react-redux'
import { getPromotionListInforAction } from './../../../actions/ReducerAction'
import LoadIngImgActivityIndicator from './../../Common/LoadIngImgActivityIndicator'
import LoadingBone from './../../Common/LoadingBone'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')
const AnimatableView = Animatable.View
const AnimatableImage = Animatable.Image
const PromotionImg1 = {
    'ALL': require('./../../../images/promotion/preferential/preferentialIcon/promotion0.png'),
    'MEMBER': require('./../../../images/promotion/preferential/preferentialIcon/promotion1.png'),
    'SPORT': require('./../../../images/promotion/preferential/preferentialIcon/promotion2.png'),
    'ESPORTS': require('./../../../images/promotion/preferential/preferentialIcon/promotion3.png'),
    'CASINO': require('./../../../images/promotion/preferential/preferentialIcon/promotion4.png'),
    'SLOT': require('./../../../images/promotion/preferential/preferentialIcon/promotion5.png'),
    'LOTTERY': require('./../../../images/promotion/preferential/preferentialIcon/promotion6.png'),
    'VIP': require('./../../../images/promotion/preferential/preferentialIcon/promotion7.png'),
    'EXCLUSIVE': require('./../../../images/promotion/preferential/preferentialIcon/promotion8.png'),
    'THREEDCASINO': require('./../../../images/promotion/preferential/preferentialIcon/promotion9.png'),
    'INSTANTGAMES': require('./../../../images/promotion/preferential/preferentialIcon/promotion10.png'),
    'THREEDGAMES': require('./../../../images/promotion/preferential/preferentialIcon/promotion11.png'),
}

const PromotionImg2 = {
    'ALL': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue0.png'),
    'MEMBER': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue1.png'),
    'SPORT': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue2.png'),
    'ESPORTS': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue3.png'),
    'CASINO': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue4.png'),
    'SLOT': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue5.png'),
    'LOTTERY': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue6.png'),
    'VIP': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue7.png'),
    'EXCLUSIVE': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue8.png'),
    'THREEDCASINO': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue9.png'),
    'INSTANTGAMES': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue10.png'),
    'THREEDGAMES': require('./../../../images/promotion/preferential/preferentialIcon/promotionblue11.png'),
}

const PromotionPiwikMenberText = {
    ALL: 'All_promopage',
    MEMBER: 'Newmember_promopage',
    SPORT: 'Sports_promopage',
    ESPORTS: 'Esports_promopage',
    CASINO: 'Livedealer_promopage',
    SLOT: 'Slot_promopage',
    LOTTERY: 'Lottery_promopage',
    VIP: 'VIP_promopage',
    EXCLUSIVE: 'Exclusive_promopage',
    THREEDCASINO: 'P2P_promopage',
    INSTANTGAMES: 'Instantgames_promopage'
}
import { NoRecordText } from './../../Common/CommonData'
class PreferentialContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            promotions: null,
            promotionCategories: [], //優惠分類
            promotionTabsIndex: 0,
            promotionNoRebateSrots: [],
            promotionHasRebateSrots: [],
            nativeEventTitle: '',
            nativeEventYArr: [],
            contentOffsetY: 0,
            refreshing: false,
            gameLoadObj: {},
            isShowRdDepositModal: false,
            scrollViewScrollDirection: true
        }
    }

    componentDidMount(props) {
        this.getMmpStore()
        this.getPromotionCategories()
        this.props.getPromotionListInforAction()
    }

    componentWillReceiveProps(nextProps) {
        this.getPromotionList(nextProps)
    }


    getMmpStore() {
        //if (!ApiPort.UserLogin) return
        storage.load({
            key: 'PreferentialFirsrtGuider',
            id: 'PreferentialFirsrtGuider'
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

    changeisShowRdDepositModal(isShowRdDepositModal) {
        this.setState({
            isShowRdDepositModal
        })
        global.storage.save({
            key: 'PreferentialFirsrtGuider',
            id: 'PreferentialFirsrtGuider',
            data: true,
            expires: null
        })
    }

    //獲取優惠分類
    getPromotionCategories(flag) {
        const { isRebate, isFromSB } = this.props
        flag && this.setState({
            refreshing: true
        })
        flag && this.props.getPromotionListInforAction()
        global.storage.load({
            key: 'promotionCategories',
            id: 'promotionCategories'
        }).then(data => {
            this.setState({
                promotionCategories: isRebate ? data : data.filter(v => v.categoryName && v.value && v.value * 1 !== 1),
                promotionTabsIndex: isFromSB ? 2 : 0
            }, () => {
                this.getPromotionList(this.props)
            })
        }).catch(() => {
            Toast.loading('กำลังโหลดข้อมูล...', .4)
        })
        fetchRequest(ApiPort.PromotionCategories, 'GET').then(data => {
            Toast.hide()
            flag && this.setState({
                refreshing: false
            })
            if (Array.isArray(data) && data.length) {
                let promotionCategories = data.filter(v => v.categoryName.toLocaleLowerCase() != 'Sponsorship'.toLocaleLowerCase()).map((v) => ({ value: v.categoryId, label: v.resourcesName, categoryName: v.categoryName }))
                //let promotionCategories = data.map((v) => ({ value: v.categoryId, label: v.resourcesName, categoryName: v.categoryName }))
                promotionCategories.unshift({ value: '', label: 'ทั้งหมด', categoryName: 'ALL' })
                let PromotionCategoriesLen = promotionCategories.length
                if (PromotionCategoriesLen < 5) {
                    let tempArr = Array.from({ length: 5 - PromotionCategoriesLen }, v => ({ categoryName: '' }))
                    promotionCategories.push(...tempArr)
                }
                if (PromotionCategoriesLen > 5 && PromotionCategoriesLen < 10) {
                    let tempArr = Array.from({ length: 10 - PromotionCategoriesLen }, v => ({ categoryName: '' }))
                    promotionCategories.push(...tempArr)
                }
                if (PromotionCategoriesLen > 10 && PromotionCategoriesLen < 15) {
                    let tempArr = Array.from({ length: 15 - PromotionCategoriesLen }, v => ({ categoryName: '' }))
                    promotionCategories.push(...tempArr)
                }
                this.setState({
                    promotionCategories: isRebate ? promotionCategories : promotionCategories.filter(v => v.categoryName && v.value && v.value * 1 !== 1),
                    promotionTabsIndex: isFromSB ? 2 : 0
                }, () => {
                    this.getPromotionList(this.props)
                })
                global.storage.save({
                    key: 'promotionCategories',
                    id: 'promotionCategories',
                    data: promotionCategories,
                    expires: null
                })
            }
        }).catch(err => {
            Toast.hide()
        })
    }

    //獲取優惠數據
    getPromotionList(props, key) {
        const { isRebate, isFromSB } = this.props
        const { promotionCategories, promotionTabsIndex } = this.state
        if (!props) return
        let promotions = props.promotionListData
        if (Array.isArray(promotions) && promotions.length) {
            this.setState({
                promotions
            }, () => {
                if (promotionCategories.length) {
                    if (isRebate) {
                        let tempValue = promotionCategories[promotionTabsIndex].value
                        !tempValue && this.getPromotionSrots('')
                    } else {
                        this.getPromotionSrots('')
                    }
                    isFromSB && this.getPromotionSrots(2)
                }
            })
        }
    }

    changePromotionTabsIndex(index, value, categoryName) {
        if (!this.state.promotions.length) return
        if (this.state.promotionTabsIndex == index) return
        this.view && this.view[`fadeIn${this.state.promotionTabsIndex < index ? 'Right' : 'Left'}`](800)
        this.setState({
            promotionTabsIndex: index,
            promotionNoRebateSrots: [],
            nativeEventYArr: []
        }, () => {
            this.getPromotionSrots(value)
        })

        categoryName && PromotionPiwikMenberText[categoryName] && window.PiwikMenberCode('Promo', 'Click', PromotionPiwikMenberText[categoryName])
    }

    getPromotionSrots(value) {
        const { promotions, promotionCategories } = this.state
        let allCategoryId = promotionCategories.map(v => v.value)
        let PromotionsNoRebateSrots = promotions.filter(v => v.type && v.type.toLocaleLowerCase() !== 'rebate')
        let PromotionsHasRebateSrots = promotions.filter(v => v.type && v.type.toLocaleLowerCase() === 'rebate')
        //console.log(promotions.map(v => v.type))
        let promotionNoRebateSrots = []
        if (value) {
            promotionNoRebateSrots = PromotionsNoRebateSrots.filter(v => Array.isArray(v.category) && v.category.length && v.category.includes(value + '')).filter(v => {
                return (v.type.toLocaleUpperCase() === 'BONUS' && v.status.toLocaleUpperCase() === 'AVAILABLE')
                    ||
                    (v.type.toLocaleUpperCase() === 'MANUAL' && v.status.toLocaleUpperCase() === 'AVAILABLE')
                    ||
                    (v.type.toLocaleUpperCase() === 'OTHER' && !v.status)
                    ||
                    (v.type.toLocaleUpperCase() === 'SOS')
            })
        } else {
            promotionNoRebateSrots = allCategoryId.filter(Boolean).map(v => {
                return PromotionsNoRebateSrots.filter(v1 => Array.isArray(v1.category) && v1.category.length && v1.category.includes(v + '')).filter(v => {
                    return (v.type.toLocaleUpperCase() === 'BONUS' && v.status.toLocaleUpperCase() === 'AVAILABLE')
                        ||
                        (v.type.toLocaleUpperCase() === 'MANUAL' && v.status.toLocaleUpperCase() === 'AVAILABLE')
                        ||
                        (v.type.toLocaleUpperCase() === 'OTHER' && !v.status)
                        ||
                        (v.type.toLocaleUpperCase() === 'SOS')
                })
            })
        }

        let promotionHasRebateSrots = allCategoryId.filter(Boolean).map(v => {
            return PromotionsHasRebateSrots.filter(v1 => v1.category.includes(v + ''))
        })
        this.setState({
            promotionNoRebateSrots,
            promotionHasRebateSrots
        })
    }


    onScrollPreferential(event) {
        const { nativeEventYArr, promotionCategories, promotionNoRebateSrots } = this.state
        let contentOffsetY = event.nativeEvent.contentOffset.y
        this.setState({
            contentOffsetY
        })

        const offsetY = event.nativeEvent.contentOffset.y;
        if (this.scrollViewStartOffsetY > offsetY) {
            //手势往下滑动，ScrollView组件往上滚动
            this.setState({
                scrollViewScrollDirection: true
            })
        } else if (this.scrollViewStartOffsetY < offsetY) {
            //手势往上滑动，ScrollView组件往下滚动
            this.setState({
                scrollViewScrollDirection: false
            })
        }


        return
        console.log(event.panGestureRecognizer)
        if (Boolean(promotionCategories.length) && Boolean(promotionNoRebateSrots.length) && nativeEventYArr.length) {
            let tempArr = nativeEventYArr.filter(v => v.y <= contentOffsetY)
            let tempYarr = tempArr.map(v => v.y)
            let tempNum = Math.max.apply(null, tempYarr)
            let nativeEventTitle = tempArr.find(v => v.y === tempNum)
            this.setState({
                nativeEventTitle: nativeEventTitle ? nativeEventTitle.title : ''
            })
        }
    }

    _onScrollBeginDrag = (event) => {
        //event.nativeEvent.contentOffset.y表示Y轴滚动的偏移量
        const offsetY = event.nativeEvent.contentOffset.y;
        //记录ScrollView开始滚动的Y轴偏移量
        this.scrollViewStartOffsetY = offsetY;
    };



    /**
     * 滑动停止回调事件
     * @param event
     * @private
     */
    _onScrollEndDrag = (event) => {
        //console.log('_onScrollEndDrag');
        //console.log('Y=' + event.nativeEvent.contentOffset.y);
    };


    //優惠打開
    openPref(v) {
        Actions.PreferentialPage({
            promotionsDetail: v,
            fromPage: 'preferentialPage',
            changeTab: (index) => {
                this.props.changeTab(index)
            }
        })

        const bonusProductList = v.bonusProductList
        let bonusID = ''
        if (Array.isArray(bonusProductList) && bonusProductList.length) {
            bonusID = bonusProductList[0].bonusID
        } else {
            bonusID = v.bonusId
        }


        bonusID && window.PiwikMenberCode('Promo Click', 'View', bonusID + '_PromoPage')
    }


    createPromotionSort(PromotionSrots) {
        const { isRebate } = this.props
        const { promotionCategories } = this.state
        return (isRebate ? PromotionSrots : PromotionSrots.filter(v => Array.isArray(v) && v.length)).map((v1, i1) => {
            return <View key={i1} onLayout={(event) => {
                if (isRebate) {
                    if (promotionCategories[i1 + 1]) {
                        this.state.nativeEventYArr.push({
                            y: Math.floor(event.nativeEvent.layout.y) + 170,
                            title: promotionCategories[i1 + 1].label.toLocaleUpperCase()
                        })
                    }
                } else {
                    if (promotionCategories[i1]) {
                        this.state.nativeEventYArr.push({
                            y: Math.floor(event.nativeEvent.layout.y),
                            title: promotionCategories[i1].label.toLocaleUpperCase()
                        })
                    }
                }
            }}>
                {
                    <View style={styles.PromotionSrotsTextWrap}>
                        <Text style={[styles.PromotionSrotsText1, { color: window.isBlue ? '#000' : '#fff' }]}>{
                            isRebate ?
                                (
                                    Boolean(promotionCategories[i1 + 1] && promotionCategories[i1 + 1].label.toLocaleUpperCase()) && promotionCategories[i1 + 1].label.toLocaleUpperCase()
                                )
                                :
                                (Boolean(promotionCategories[i1] && promotionCategories[i1].label.toLocaleUpperCase()) && promotionCategories[i1].label.toLocaleUpperCase())
                        }</Text>
                    </View>
                }
                <View>
                    {
                        v1.map((v2, i2) => {
                            return <AnimatableView key={i2} delay={400 * i2} animation={i2 % 2 ? 'fadeInDown' : 'fadeInUp'} easing='ease-out-cubic'>
                                <TouchableOpacity
                                    style={[styles.promotionsBox]}
                                    onPress={() => { this.openPref(v2) }}
                                >
                                    <Image
                                        resizeMode='stretch'
                                        source={{ uri: v2.thumbnailImage }}
                                        // onLoadStart={this.getLoadImgStatus.bind(this, i2 + 'key2', false)}
                                        // onLoadEnd={this.getLoadImgStatus.bind(this, i2 + 'key2', true)}
                                        defaultSource={window.isBlue ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')}
                                        style={styles.preferentImg}></Image>
                                    {/* {
                                    !this.state.gameLoadObj[`imgStatus${i2}key2`] && <LoadIngImgActivityIndicator />
                                } */}
                                    <View style={[styles.preferentTagBox]}>
                                        {
                                            v2.isJustForYouPromo && <View style={[styles.preferentTag, { backgroundColor: '#0dbe02' }]}>
                                                <Text style={styles.preferentTagText}>เฉพาะคุณ</Text>
                                            </View>
                                        }
                                        {
                                            v2.isFeaturedPromo && <View style={[styles.preferentTag, { backgroundColor: '#ff6b44' }]}>
                                                <Text style={styles.preferentTagText}>จำกัด</Text>
                                            </View>
                                        }
                                    </View>
                                </TouchableOpacity>
                            </AnimatableView>
                        })
                    }
                </View>
            </View>
        })
    }


    handleViewRef = ref => this.view = ref

    getLoadImgStatus(i, flag) {
        this.state.gameLoadObj[`imgStatus${i}`] = flag
        this.setState({})
    }

    createdBounsLonding() {
        return Array.from({ length: 5 }, v => v).map((v, i) => {
            return <View key={i} style={[styles.promotionsBox, { backgroundColor: '#e0e0e0' }]}>
                <LoadingBone></LoadingBone>
            </View>
        })
    }

    renderPage(item) {
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}
                source={item.item.img} />
            {
                item.index == 1 && <TouchableOpacity style={styles.closeBtn} onPress={() => {
                    this.changeisShowRdDepositModal(false)
                }}></TouchableOpacity>
            }
        </TouchableOpacity>
    }


    createPomotionHead() {
        const { isRebate, isFromSB } = this.props
        const { scrollViewScrollDirection, isShowRdDepositModal, refreshing, promotions, promotionTabsIndex, promotionNoRebateSrots, promotionCategories, contentOffsetY, nativeEventTitle, promotionHasRebateSrots } = this.state
        const isShowPreferentialFlag = ((isRebate ? Boolean(contentOffsetY >= 170) : Boolean(contentOffsetY >= 20)) && nativeEventTitle) || (isRebate && Boolean(contentOffsetY >= 170) && !nativeEventTitle) && Array.isArray(promotions)
        return isRebate ? <AnimatableView
            duration={400}
            transition={['borderTopColor', 'rotate', 'marginTop', 'marginBottom']}
            style={{
                display: (scrollViewScrollDirection) ? 'flex' : 'none',
            }}>
            {
                !isFromSB &&
                <View style={[styles.promotionBox, { backgroundColor: window.isBlue ? '#E6E6E8' : '#212121', marginTop: 10 }]}>
                    {
                        Array.isArray(promotionCategories) && promotionCategories.length > 0 ? promotionCategories.map((v, i) => {
                            let flag = promotionTabsIndex * 1 === i * 1
                            let categoryName = v.categoryName.toLocaleUpperCase().replace(/\s/g, '')
                            return v.categoryName ? <TouchableOpacity
                                key={i}
                                style={[styles.promotionWrap,
                                {
                                    backgroundColor: window.isBlue ? (flag ? '#25AAE1' : '#fff') : (flag ? '#25aae1' : '#0f0f0f'),
                                    borderColor: window.isBlue ? 'transparent' : (flag ? 'transparent' : '#646464')
                                }
                                ]}
                                onPress={this.changePromotionTabsIndex.bind(this, i, v.value, categoryName)}>
                                {
                                    flag
                                        ?
                                        <AnimatableImage
                                            animation={'tada'}
                                            easing='ease-out'
                                            iterationCount='infinite'
                                            source={window.isBlue ? (flag ? PromotionImg2[categoryName] : PromotionImg1[categoryName]) : PromotionImg2[categoryName]}
                                            resizeMode='stretch'
                                            style={[styles.promotionWrapImg, styles[`promotionWrapImg${categoryName}`]]}
                                        ></AnimatableImage>
                                        :
                                        <Image
                                            source={window.isBlue ? (flag ? PromotionImg2[categoryName] : PromotionImg1[categoryName]) : PromotionImg2[categoryName]}
                                            resizeMode='stretch'
                                            style={[styles.promotionWrapImg, styles[`promotionWrapImg${categoryName}`]]}
                                        ></Image>
                                }
                                <Text style={[styles.promotionText, { color: window.isBlue ? (flag ? '#fff' : '#727272') : '#fff' }]}>{v.label.toLocaleUpperCase()}</Text>
                            </TouchableOpacity> : <View style={[styles.promotionWrap, { backgroundColor: 'transparent', borderColor: 'transparent' }]}></View>
                        })
                            :
                            Array.from({ length: 10 }, v => v).map((v, i) => {
                                return <View
                                    key={i}
                                    style={[styles.promotionWrap, { backgroundColor: '#e0e0e0', borderColor: '#e0e0e0' }]}>
                                    <LoadingBone></LoadingBone>
                                </View>
                            })
                    }
                </View>}


            <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            isShowRdDepositModal: true
                        })
                    }}
                    style={{
                        marginTop: 10,
                        marginRight: 10,
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderRadius: 4,
                        alignItems: 'center',
                        borderColor: '#4FAEEA',
                        backgroundColor: '#FFFFFF',
                        justifyContent: 'center', height: 35, paddingHorizontal: 10
                    }}>
                    <Image
                        source={require('./../../../images/promotion/preferential/preferentialIcon/promotion00.png')}
                        resizeMode='stretch'
                        style={{ width: 20, height: 20, marginRight: 5 }}
                    ></Image>
                    <Text style={{ color: '#4FAEEA', fontSize: 13 }}>คู่มือโบนัสต่างๆ</Text>
                </TouchableOpacity>
            </View>
        </AnimatableView>
            :
            null

    }

    render() {
        const bannerData = [
            {
                img: require('./../../../images/promotion/preferential/preferentialRecord/PreferentialRecords5.png'),
            },
            {
                img: require('./../../../images/promotion/preferential/preferentialRecord/PreferentialRecords6.png'),
            }
        ]
        const { isRebate, isFromSB } = this.props
        const { scrollViewScrollDirection, isShowRdDepositModal, refreshing, promotions, promotionTabsIndex, promotionNoRebateSrots, promotionCategories, contentOffsetY, nativeEventTitle, promotionHasRebateSrots } = this.state
        const isShowPreferentialFlag = ((isRebate ? Boolean(contentOffsetY >= 170) : Boolean(contentOffsetY >= 20)) && nativeEventTitle) || (isRebate && Boolean(contentOffsetY >= 170) && !nativeEventTitle) && Array.isArray(promotions)
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? (isRebate ? '#F3F4F8' : '#F3F4F8') : '#000' }]}>

            <Modal animationType='fade' transparent={true} visible={isShowRdDepositModal}>
                <View style={[styles.modalContainer]}>
                    <Carousel
                        data={bannerData}
                        renderItem={this.renderPage.bind(this)}
                        sliderWidth={width}
                        itemWidth={width}
                        inactiveSlideScale={1}
                        useScrollView={true}
                        onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                    />
                </View>
            </Modal>

            {
                //     <AnimatableView
                //     style={styles.preferentialTag}
                //     easing='ease-out-cubic'
                //     animation={isShowPreferentialFlag ? 'slideInDown' : 'slideOutUp'}
                //     duration={800}
                // >
                //     <Animatable.Text
                //         animation={isShowPreferentialFlag ? 'fadeInLeft' : 'fadeOutLeft'}
                //         style={{ fontWeight: 'bold', fontSize: 18 }}>{(promotionTabsIndex === 0 ? nativeEventTitle : promotionCategories[promotionTabsIndex].label).toLocaleUpperCase()}</Animatable.Text>
                // </AnimatableView>

            }
            <AnimatableView
                animation={isShowPreferentialFlag ? 'fadeInLeft' : 'fadeOutRight'}
                easing='ease-out-cubic'
                style={styles.promotionTop}
                duration={800}
            >
                <TouchableOpacity
                    hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
                    ref={ref => this.promotionTop = ref}
                    style={styles.promotionTopView}
                    onPress={() => {
                        this.scrollView.scrollTo({ x: 0, y: 0, animated: true }, 1)
                    }}>
                    <Image
                        source={require('./../../../images/promotion/preferential/preferentialIcon/preferentialArrowUp.png')}
                        resizeMode='stretch'
                        style={styles.promotionTopView}></Image>
                </TouchableOpacity>
            </AnimatableView>




            {
                Platform.OS == 'ios' && this.createPomotionHead()
            }



            <ScrollView
                ref={view => { this.scrollView = view }}
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onScroll={this.onScrollPreferential.bind(this)}
                onScrollBeginDrag={this._onScrollBeginDrag}
                onScrollEndDrag={this._onScrollEndDrag}
                scrollEventThrottle={20}
                contentContainerStyle={{}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor={'#25AAE1'}
                        onRefresh={() => {
                            if (contentOffsetY == 0) {
                                this.getPromotionCategories(true)
                            }
                        }}
                    />
                }
            >

                {
                    Platform.OS == 'android' && this.createPomotionHead()
                }
                <View>
                    {
                        isRebate
                            ?
                            <View>

                                {
                                    Array.isArray(promotions)
                                        ?
                                        <AnimatableView ref={this.handleViewRef}>
                                            {
                                                promotions.length > 0 && promotionNoRebateSrots.length > 0 ? <View style={[styles.promotionsContainer, { backgroundColor: window.isBlue ? '#FAFAFB' : '#0f0f0f' }]}>
                                                    {
                                                        Array.isArray(promotionNoRebateSrots[0])
                                                            ?
                                                            (
                                                                this.createPromotionSort(promotionNoRebateSrots)
                                                            )
                                                            :
                                                            (
                                                                <View>
                                                                    <View style={styles.PromotionSrotsTextWrap}>
                                                                        <Text style={[styles.PromotionSrotsText1, { color: window.isBlue ? '#000' : '#fff' }]}>{promotionCategories[promotionTabsIndex].label.toLocaleUpperCase()}</Text>
                                                                    </View>
                                                                    <View>
                                                                        {
                                                                            promotionNoRebateSrots.map((v, i) => {
                                                                                return <AnimatableView key={i} delay={400 * i} animation={i % 2 ? 'fadeInDown' : 'fadeInUp'}>
                                                                                    <TouchableOpacity
                                                                                        style={[styles.promotionsBox]}
                                                                                        onPress={() => { this.openPref(v) }}>
                                                                                        <View>
                                                                                            <Image
                                                                                                resizeMode='stretch'
                                                                                                source={{ uri: v.thumbnailImage }}
                                                                                                onLoadStart={this.getLoadImgStatus.bind(this, i + 'key1', false)}
                                                                                                onLoadEnd={this.getLoadImgStatus.bind(this, i + 'key1', true)}
                                                                                                defaultSource={window.isBlue ? require('./../../../images/common/loadIcon/loadinglight.jpg') : require('./../../../images/common/loadIcon/loadingdark.jpg')}
                                                                                                style={styles.preferentImg}></Image>
                                                                                            {
                                                                                                !this.state.gameLoadObj[`imgStatus${i}key1`] && <LoadIngImgActivityIndicator />
                                                                                            }
                                                                                        </View>
                                                                                        <View style={[styles.preferentTagBox]}>
                                                                                            {
                                                                                                v.isJustForYouPromo && <View style={[styles.preferentTag, { backgroundColor: '#0dbe02' }]}>
                                                                                                    <Text style={styles.preferentTagText}>เฉพาะคุณ</Text>
                                                                                                </View>
                                                                                            }
                                                                                            {
                                                                                                v.isFeaturedPromo && <View style={[styles.preferentTag, { backgroundColor: '#ff6b44' }]}>
                                                                                                    <Text style={styles.preferentTagText}>จำกัด</Text>
                                                                                                </View>
                                                                                            }
                                                                                        </View>
                                                                                    </TouchableOpacity>
                                                                                </AnimatableView>
                                                                            })
                                                                        }
                                                                    </View>
                                                                </View>
                                                            )
                                                    }
                                                </View>
                                                    :
                                                    <Text style={[styles.recordText, { color: window.isBlue ? '#000' : '#fff' }]}>{NoRecordText}</Text>
                                            }
                                        </AnimatableView>
                                        :
                                        <View style={[styles.promotionsContainer, { backgroundColor: window.isBlue ? '#fff' : '#0f0f0f' }]}>
                                            {
                                                this.createdBounsLonding()
                                            }
                                        </View>

                                }

                            </View>
                            :
                            <View style={[styles.promotionsContainer, { backgroundColor: window.isBlue ? (isRebate ? '#fff' : '#F2F2F2') : '#0f0f0f' }]}>
                                {
                                    !isRebate && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ alignItems: 'center', marginRight: 5, justifyContent: 'center', width: 20, height: 20, borderRadius: 10000, borderWidth: 1, borderColor: '#000' }}>
                                            <Text>!</Text>
                                        </View>
                                        <Text>ยอดเงินคืนจะปรับให้โดยอัตโนมัติ</Text>
                                    </View>
                                }
                                {
                                    Array.isArray(promotions)
                                        ?
                                        promotions.length > 0 && promotionHasRebateSrots.length > 0 && this.createPromotionSort(promotionHasRebateSrots)
                                        :
                                        this.createdBounsLonding()
                                }
                            </View>
                    }
                </View>
            </ScrollView>
        </View>
    }
}

export default Preferential = connect(
    (state) => {
        return {
            promotionListData: state.promotionListData
        }
    }, (dispatch) => {
        return {
            getPromotionListInforAction: () => dispatch(getPromotionListInforAction())
        }
    }
)(PreferentialContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        width,
        position: 'relative',
    },
    promotionTopView: {
        width: 80,
        height: 80,
    },
    promotionTop: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        // shadowColor: '#666',
        // shadowOpacity: .2,
        // shadowRadius: 10,
        // shadowOffset: { width: 0, height: -6 },
        // elevation: 4,
        borderRadius: 1000,
        width: 80,
        height: 80,
        zIndex: 20
    },
    preferentialTag: {
        position: 'absolute',
        zIndex: 10,
        top: 0,
        width,
        height: 45,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingLeft: 10,
        shadowColor: '#666',
        shadowOpacity: .2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -6 },
        elevation: 4
    },
    promotionBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        paddingTop: 8,
        paddingBottom: 4,
        width,
    },
    promotionWrap: {
        borderRadius: 6,
        height: 55,
        width: (width - 20) / 5.3,
        backgroundColor: '#25aae1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 3,
        overflow: 'hidden'
    },
    promotionWrapImg: {
        width: 22,
        height: 22,
        marginBottom: 4
    },
    promotionWrapImgESPORTS: {
        width: 30,
        marginBottom: 10,
        height: 19
    },
    promotionText: {
        fontSize: 10,
        textAlign: 'center'
    },
    promotionsContainer: {
        paddingHorizontal: 10,
        marginTop: 10
    },
    PromotionSrotsTextWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 46
    },
    PromotionSrotsText1: {
        fontSize: 16,
        // fontWeight: 'bold'
    },
    PromotionSrotsText2: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#25AAE1'
    },
    promotionsBox: {
        width: width - 20,
        height: 140,
        marginBottom: 10,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    preferentImg: {
        width: width - 20,
        height: 140,
    },
    preferentTagBox: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    preferentTag: {
        borderRadius: 4,
        paddingVertical: 8,
        alignItems: 'center',
        width: 80,
        zIndex: 1000,
        marginLeft: 10
    },
    preferentTagText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    recordText: {
        marginTop: 100,
        textAlign: 'center'
    },
    carouselImg: {
        width,
        height,
    },
    closeBtn: {
        height: 100,
        position: 'absolute',
        bottom: 120,
        width,
    },
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E6E8'
    },
})