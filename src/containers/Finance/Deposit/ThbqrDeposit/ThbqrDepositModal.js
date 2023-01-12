import React from 'react'
import { StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
const { width, height } = Dimensions.get('window')
import Carousel, { Pagination } from 'react-native-snap-carousel'
export default class ThbqrDepositModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerIndex: 0
        }
    }

    closeModalPop(flag, piwikMenberText) {

    }


    renderPage(item) {
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg}
                source={item.item.img} />
            {
                item.index == 2 && <TouchableOpacity style={styles.closeBtn} onPress={() => {
                    this.props.changeIsShowThbqrDepositModal(false)
                }}></TouchableOpacity>
            }
        </TouchableOpacity>
    }



    render() {
        const { bannerIndex } = this.state
        const bannerData = [
            {
                img: require('./../../../../images/finance/deposit/THBQRIcon/THBQRIcon1.png'),
            },
            {
                img: require('./../../../../images/finance/deposit/THBQRIcon/THBQRIcon2.png'),
            },
            {
                img: require('./../../../../images/finance/deposit/THBQRIcon/THBQRIcon3.png'),
            }
        ]

        return <Modal animationType='fade' transparent={true} visible={this.props.isShowThbqrDepositModal}>
            <View style={[styles.modalContainer]}>
                <Carousel
                    data={bannerData}
                    renderItem={this.renderPage.bind(this)}
                    sliderWidth={width}
                    inactiveSlideScale={1}
                    itemWidth={width}
                    useScrollView={true}
                    firstItem={bannerIndex}
                    onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                />
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    carouselImg: {
        width,
        height,
    },
    guiderBtn: {
        height: 40,
        width: width - 20,
        marginHorizontal: 10,
        backgroundColor: '#00AEEF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    guiderBtn2: {
        backgroundColor: '#fff',
        marginTop: 15
    },
    guiderBtnText1: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    guiderBtnText2: {
        color: '#00AEEF',
        fontWeight: 'bold'
    },
    guiderBox: {
        position: 'absolute',
        bottom: 60
    },
    closeBtn: {
        width: 80,
        height: 80,
        position: 'absolute',
        top: 50,
    }
})