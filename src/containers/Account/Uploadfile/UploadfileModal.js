import React from 'react'
import { StyleSheet, Text, Linking, Image, View, TouchableOpacity, Dimensions, FlatList, TextInput, Platform, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'
import Toast from '@/containers/Toast'
import { connect } from 'react-redux'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import * as Animatable from 'react-native-animatable'
const { width, height } = Dimensions.get('window')
const AnimatableText = Animatable.Text
export default class UploadfileModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bannerData: [
                {
                    text1: 'เลือกไฟล์ที่ท่านต้องการอัพโหลด โดยขนาดไฟล์ต้องไม่เกิน 5mb และเป็นไฟล์ .jpg, .jpeg,.png, heic, heif',
                    text2: 'จากนั้นเลือกดูตัวอย่างไฟล์เอกสาร เพื่อตรวจสอบความถูกต้องก่อนทำการอัพโหลด',
                    img: require('./../../../images/account/uploadfile/bannerData1.png'),
                },
                {
                    text1: 'เมื่อทำการอัพโหลดเอกสารแล้ว ให้คลิกที่ปุ่ม "ส่ง"',
                    text2: 'ท่านสามารถทำการส่งเอกสารได้ถึง 3 ครั้ง',
                    img: require('./../../../images/account/uploadfile/bannerData2.png'),
                },
                {
                    text1: 'หลังจากที่ทำการส่งไฟล์เอกสารแล้ว ระบบของเราจะทำการตรวจสอบเอกสาร และท่านจะได้รับข้อความยืนยันเมื่อการตรวจสอบเสร็จสิ้น ',
                    text2: '',
                    img: require('./../../../images/account/uploadfile/bannerData3.png'),
                },
                {
                    text1: 'หากเอกสารของท่านได้รับการยืนยันว่าถูกต้อง ระบบจะทำการยืนยันบัญชีของท่านโดยอัตโนมัติ แต่ถ้าหากว่าเอกสารของท่านไม่ได้รับการยืนยัน ท่านจะต้องทำการส่งเอกสารใหม่อีกครั้ง',
                    text2: '',
                    img: require('./../../../images/account/uploadfile/bannerData4.png'),
                },
            ],
            bannerIndex: 0,
            // isShowUploadModal: this.props.isShowUploadModal,
            // isShowUploadGuideModal: this.props.isShowUploadGuideModal
        }
    }

    renderPage(item) {
        const { bannerData } = this.state
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            <Image
                resizeMode='stretch'
                style={styles.carouselImg1}
                source={item.item.img} />
        </TouchableOpacity>
    }

    render() {
        const { bannerData, bannerIndex } = this.state
        const { isShowUploadModal, isShowUploadGuideModal } = this.props
        return <Modal transparent={true} visible={isShowUploadModal} animationType='fade'>
            {
                !isShowUploadGuideModal
                    ?
                    <View style={[styles.modalContainer]}>
                        <View style={styles.modalBox}>
                            <Image resizeMode='stretch' source={require('./../../../images/account/uploadfile/uploadModal.png')} style={[styles.uploadModal]}></Image>
                        </View>
                        <View style={{ backgroundColor: '#fff', paddingVertical: 15, width: .9 * width, alignItems: 'center' }}>
                            <TouchableOpacity style={styles.ModalBtn} onPress={() => {

                                this.setState({
                                    isShowUploadGuideModal: true
                                })
                                this.props.changeShowUploadModal({
                                    isShowUploadModal: true,
                                    isShowUploadGuideModal: true
                                })
                            }}>
                                <Text style={styles.ModalBtnText}>ดูการใช้งาน</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.modalCloseBox} onPress={() => {
                            this.setState({
                                isShowUploadModal: false
                            })
                            this.props.changeShowUploadModal({
                                isShowUploadModal: false,
                                isShowUploadGuideModal: false
                            })
                        }}>
                            <Image resizeMode='stretch' source={require('./../../../images/account/uploadfile/modalClose.png')} style={[styles.modalClose]}></Image>
                            <Text style={styles.modalCloseText}>คลิกที่ใดก็ได้เพื่อออกจากหน้านี้</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={[styles.modalContainer, {
                        backgroundColor: '#fff',
                        paddingTop: 40
                    }]}>
                        <TouchableOpacity hitSlop={{ top: 15, height: 15, right: 15, bottom: 15 }} onPress={() => {
                            this.props.changeShowUploadModal({
                                isShowUploadModal: false,
                                isShowUploadGuideModal: false
                            })
                        }}>
                            <Text style={{ color: '#059DD6', fontSize: 20, }}>X</Text>
                        </TouchableOpacity>
                        <Carousel
                            data={bannerData}
                            renderItem={this.renderPage.bind(this)}
                            sliderWidth={width}
                            inactiveSlideScale={1}
                            itemWidth={width}
                            useScrollView={true}
                            onSnapToItem={index => { this.setState({ bannerIndex: index }) }}
                        />

                        <Pagination
                            dotsLength={bannerData.length}
                            activeDotIndex={bannerIndex}
                            containerStyle={styles.containerStyle}
                            dotStyle={styles.dotStyle}
                            inactiveDotStyle={styles.inactiveDotStyle}
                            inactiveDotOpacity={1}
                            inactiveDotScale={1}
                        />
                    </View>
            }
        </Modal>
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer1: {
        width,
        height,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadModal: {
        width: .9 * width,
        height: .9 * width * 1.036,
    },
    uploadModal1: {
        marginBottom: 20,
        width: .6 * width,
        height: .6 * width,
    },
    modalClose: {
        width: 30,
        height: 30,
        marginBottom: 10
    },
    modalCloseText: {
        color: '#FFFFFF'
    },
    modalCloseBox: {
        alignItems: 'center',
        marginTop: 20
    },
    ModalBtn: {
        backgroundColor: '#25AAE1',
        borderRadius: 5,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        borderRadius: 6,
    },
    ModalBtn1: {
        position: 'absolute',
        bottom: 40,
        width: width - 40
    },
    ModalBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modalBox: {
        width: .9 * width,
        overflow: 'hidden',
        borderRadius: 8,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewContainer: {
        flex: 1,
        paddingTop: 20
    },
    managerListsTouch: {
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    managerLists: {
        height: 50,
        justifyContent: 'center',
        marginBottom: 10,
        overflow: 'hidden'
    },
    managerListsLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrowRight: {
        width: 8,
        height: 20,
    },
    baseCircle: {
        width: 20,
        height: 20,
        // borderWidth: 1,
        // borderRadius: 10000,
        marginRight: 10,
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    circle0: {
        borderColor: '#33C85D',
        backgroundColor: '#33C85D'
    },
    circleText0: {
        color: '#fff'
    },
    circle1: {
        borderColor: '#C83333',
        backgroundColor: '#C83333'
    },
    circle2: {
        backgroundColor: 'transparent',
        borderColor: '#00AEEF'
    },
    circleText1: {
        color: '#00AEEF',
        fontSize: 10
    },
    circle3: {
        borderColor: '#33C85D'
    },
    closeBtnWrap: {
        position: 'absolute',
        bottom: 20,
        width: width - 20,
        marginHorizontal: 10,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    closeBtnText: {
        fontSize: 15,
        color: '#00AEEF'
    },
    containerStyle: {
        paddingVertical: 2,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40
    },
    gameScrollViewBox: {
        flexDirection: 'row',
    },
    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 500,
        marginHorizontal: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#707070',
        opacity: 1
    },
    inactiveDotStyle: {
        width: 10,
        height: 10,
        borderRadius: 500,
        marginHorizontal: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d4d4d4',
    },
    carouselImg: {
        borderRadius: 4,
        alignItems: 'center',
        width: width - 20,
        marginHorizontal: 10
    },
    carouselImg1: {
        width: width * .8,
        height: (width * .8) * 1.675,
        marginTop: 20
    },
    typeImg: {
        width: 24,
        height: 20,
        marginRight: 10,
    },
    managerListsTextWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})