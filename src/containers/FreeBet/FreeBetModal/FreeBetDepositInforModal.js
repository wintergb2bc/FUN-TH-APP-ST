import React from 'react'
import { View, Text, StyleSheet, Dimensions, Modal, ImageBackground, TouchableHighlight } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'


const { width, height } = Dimensions.get('window')
const HomeCarousel = [
    {
        img: require('./../../../images/freeBet/freeBetModal/depositInfor1.png'),
    },
    {
        img: require('./../../../images/freeBet/freeBetModal/depositInfor2.png'),
    },
    {
        img: require('./../../../images/freeBet/freeBetModal/depositInfor3.png'),
    },
    {
        img: require('./../../../images/freeBet/freeBetModal/depositInfor4.png'),
    },
]

export default class FreeBetDepositInforModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            homeCarouselIndex: 0
        }
    }

    renderhomeCarouse(item) {
        return <ImageBackground
            key={item.index}
            source={item.item.img}
            resizeMode='stretch'
            style={styles.homeCarouselImg}>
        </ImageBackground>
    }

    render() {
        const { homeCarouselIndex } = this.state
        return <Modal animationType='fade' visible={true} transparent={true}>
            <View style={styles.viewContainer}>
                <View style={styles.viewBox}>
                    <Carousel
                        data={HomeCarousel}
                        renderItem={this.renderhomeCarouse.bind(this)}
                        sliderWidth={width}
                        inactiveSlideScale={1}
                        itemWidth={width}
                        firstItem={homeCarouselIndex}
                        onSnapToItem={homeCarouselIndex => { this.setState({ homeCarouselIndex }) }}
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

                <TouchableHighlight
                    style={styles.viewOverlyContainer}
                    onPress={() => {
                        this.props.changeFreeBetDepositInforModal(false)

                        window.PiwikMenberCode('DepositGuide_Close')
                    }}
                >
                    <Text style={{ color: 'transparent' }}>123</Text>
                </TouchableHighlight>
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .8)'
    },
    viewOverlyContainer: {
        width,
        height,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    viewBox: {
        width,
        position: 'relative',
        zIndex: 1000
    },
    homeCarouselImg: {
        width: width - 20,
        height: (width - 20) * 1.386,
        marginHorizontal: 10
    },
    homePaginationContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -60,
    },
    homePaginationDot: {
        width: 12,
        height: 12,
        borderRadius: 1000,
        backgroundColor: '#fff'
    },
    homePaginationInactiveDot: {
        width: 12,
        height: 12,
        borderRadius: 1000,
        backgroundColor: '#707070',
    },
})