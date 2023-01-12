import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, ImageBackground, Image } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Carousel, { Pagination } from 'react-native-snap-carousel'

const { width, height } = Dimensions.get('window')
const HomeCarousel = [
    {
        img: require('./../../images/home/homeModalCarousel/homeModalCarousel1.png'),
        text: 'Tự Hào Là Nhà Cái Hàng Đầu Châu Á Và Là Đối Tác Chính Thức Của Tottenham Hotspurs, Newcastle',
        infor: 'Bỏ Qua'
    },
    {
        img: require('./../../images/home/homeModalCarousel/homeModalCarousel2.png'),
        text: 'Trải Nghiệm Giải Trí Đỉnh Cao Với Sản Phẩm Đa Dạng, Gửi Tiền Và Rút Tiền Nhanh Chóng, Dễ Dàng.',
        infor: 'Bỏ Qua'
    },
    {
        img: require('./../../images/home/homeModalCarousel/homeModalCarousel3.png'),
        text: 'Tận Hưởng Khuyến Mãi Hấp Dẫn. Thưởng Đăng Ký, Hoàn Trả Không Giới Hạn Mỗi Ngày Đang Chờ Bạn!',
        infor: 'Bỏ Qua'
    },
    {
        img: require('./../../images/home/homeModalCarousel/homeModalCarousel4.png'),
        text: 'Tận Hưởng Khuyến Mãi Hấp Dẫn. Thưởng Đăng Ký, Hoàn Trả Không Giới Hạn Mỗi Ngày Đang Chờ Bạn!',
        infor: 'Bỏ Qua'
    },
]
export default class HomeModalCarousel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            homeCarouselIndex: 0,
        }
    }

    closeHomeModal() {
        this.props.closeHomeModal()
    }


    pageToLogin(type, piwikMenberText) {
        this.closeHomeModal()
        if (type == 'login') {
            Actions.login({
                isFrist: true
            })
            return
        }
        Actions.Register()
    }

    renderhomeCarouse(item) {
        const { homeCarouselIndex } = this.state
        return <ImageBackground
            key={item.index}
            source={item.item.img}
            resizeMode='cover'
            style={styles.homeCarouselImg}>
            {
                homeCarouselIndex == 3 && <View style={styles.homeModalWrap}>
                    <View style={styles.homeModalBtnWrap}>
                        <TouchableOpacity style={[styles.homeModalBtn, styles.homeModalBtn0]} onPress={this.pageToLogin.bind(this, 'login')}>
                            <Text style={styles.homeModalBtnText}>เข้าสู่ระบบ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.homeModalBtn, styles.homeModalBtn1]} onPress={this.pageToLogin.bind(this, 'register')}>
                            <Text style={styles.homeModalBtnText}>ลงทะเบียน</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </ImageBackground>
    }

    render() {
        const { homeCarouselIndex } = this.state
        return <Modal animationType='fade' visible={true} transparent={true}>
            <View style={styles.viewContainer}>
                <View style={styles.homeCarouselContainer}>
                    <Carousel
                        data={HomeCarousel}
                        renderItem={this.renderhomeCarouse.bind(this)}
                        sliderWidth={width}
                        inactiveSlideScale={1}
                        itemWidth={width}
                        initialScrollIndex={homeCarouselIndex}
                        firstItem={homeCarouselIndex}
                        onSnapToItem={homeCarouselIndex => { this.setState({ homeCarouselIndex }) }}
                        onBeforeSnapToItem={homeCarouselIndex => { this.setState({ homeCarouselIndex }) }}
                    />
                    <Pagination
                        dotsLength={HomeCarousel.length}
                        activeDotIndex={homeCarouselIndex}
                        containerStyle={styles.homePaginationContainer}
                        dotStyle={styles.homePaginationDot}
                        inactiveDotStyle={styles.homePaginationInactiveDot}
                        inactiveDotOpacity={1}
                        inactiveDotScale={1}
                    />
                </View>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        width,
        height,
        backgroundColor: '#000'
    },
    homeModalImg: {
        marginBottom: 100
    },
    homeCarouselImg: {
        width,
        height,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: height * .35
    },
    homePaginationContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 20,
    },
    homePaginationDot: {
        width: 6,
        height: 6,
        borderRadius: 1000,
        marginHorizontal: -8,
        backgroundColor: '#25AAE1'
    },
    homePaginationInactiveDot: {
        width: 6,
        height: 6,
        borderRadius: 1000,
        backgroundColor: '#fff',
        marginHorizontal: -8
    },
    homeCarouselText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 20,
        lineHeight: 26,
        fontStyle: 'italic'
    },
    homeModalBottom: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        bottom: 30,
    },
    changeHomeBox: {
        width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        height: 40,
    },
    changeHomeBoxWrap: {
        height: 40,
        justifyContent: 'center',
        width: width / 2,
        position: 'absolute',
        top: 0,
        bottom: 0,
    },
    changeHomeBoxWrapLeft: {
        left: 0
    },
    changeHomeBoxWrapRight: {
        right: 0
    },
    closeHomeBox: {
        height: 50,
        width,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeHomeBoxText: {
        color: '#fff',
        fontSize: 18
    },
    homeModalWrap: {
        alignItems: 'center',
        paddingTop: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 5,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 65
    },
    homeModalText: {
        color: '#000',
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 'bold',
        fontSize: 16
    },
    homeModalBtnWrap: {
        marginTop: 40,
        overflow: 'hidden'
    },
    homeModalBtn: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        width: width * .6,
        borderRadius: 6
    },
    homeModalBtn0: {
        backgroundColor: '#00AEEF'
    },
    homeModalBtn1: {
        backgroundColor: '#33BC63'
    },
    homeModalBtnText: {
        color: '#fff'
    }
})