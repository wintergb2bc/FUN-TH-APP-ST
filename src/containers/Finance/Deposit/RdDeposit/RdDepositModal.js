import React from 'react'
import { StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
const { width, height } = Dimensions.get('window')
import Carousel, { Pagination } from 'react-native-snap-carousel'
export default class RdDepositModal extends React.Component {
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
        </TouchableOpacity>
    }



    render() {
        const { bannerIndex } = this.state
        const bannerData = [
            {
                img: require('./../../../../images/finance/deposit/rdIcon/rdGuide1.png'),
            },
            {
                img: require('./../../../../images/finance/deposit/rdIcon/rdGuide2.png'),
            },
            {
                img: require('./../../../../images/finance/deposit/rdIcon/rdGuide3.png'),
            },
            {
                img: require('./../../../../images/finance/deposit/rdIcon/rdGuide4.png'),
            },
        ]

        return <Modal animationType='fade' transparent={true} visible={this.props.isShowRdDepositModal}>
            <View style={[styles.modalContainer]}>
                <Carousel
                    data={bannerData}
                    renderItem={this.renderPage.bind(this)}
                    sliderWidth={width}
                    itemWidth={width}
                    inactiveSlideScale={1}
                    useScrollView={true}
                    firstItem={bannerIndex}
                    onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                />

                {
                    bannerIndex == 3 ? <View style={styles.guiderBox}>
                        <TouchableOpacity style={[styles.guiderBtn, styles.guiderBtn1]} onPress={() => {
                            this.props.changeisShowRdDepositModal(false)
                        }}>
                            <Text style={[styles.guiderBtnText1]}>เข้าใจแล้ว</Text>
                        </TouchableOpacity>



                        <TouchableOpacity style={[styles.guiderBtn, styles.guiderBtn2]} onPress={() => {
                            this.setState({
                                bannerIndex: 0
                            })
                        }}>
                            <Text style={[styles.guiderBtnText2]}>ดูขั้นตอนอีกครั้ง</Text>
                        </TouchableOpacity>
                    </View>
                        :
                        <View style={styles.guiderBox}>
                            <TouchableOpacity style={[styles.guiderBtn, styles.guiderBtn1]} onPress={() => {
                                this.setState({
                                    bannerIndex: bannerIndex + 1
                                })
                            }}>
                                <Text style={[styles.guiderBtnText1]}>ถัดไป</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={[styles.guiderBtn, styles.guiderBtn2, {
                                backgroundColor: 'transparent'
                            }]} onPress={() => {
                                this.props.changeisShowRdDepositModal(false)
                            }}>
                                <Text style={[styles.guiderBtnText2]}>ปิดขั้นตอนการฝาก</Text>
                            </TouchableOpacity>
                        </View>
                }
            </View>
        </Modal>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .1)',
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
    }
})