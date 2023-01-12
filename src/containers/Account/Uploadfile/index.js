import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image, Modal, Dimensions, TouchableOpacity, ImageBackground } from 'react-native'
import Toast from '@/containers/Toast'
import Touch from 'react-native-touch-once'
import { Actions } from 'react-native-router-flux'
import LoadingBone from './../../Common/LoadingBone'
import Carousel, { Pagination } from 'react-native-snap-carousel'
const { width, height } = Dimensions.get('window')
import UploadfileModal from './UploadfileModal'
const UploadfileName = {
    type1: {
        title: 'เอกสารยืนยันตัวตน',  // Proof of Identification   身份证明
        img: require('./../../../images/account/uploadfile/type1.png')
    },
    type2: {
        title: 'เอกสารยืนยันที่อยู่', //Proof of Address    地址证明文件
        img: require('./../../../images/account/uploadfile/type2.png'),
    },
    type3: {
        title: 'รูปถ่ายหน้าตรงคู่กับบัตรประชาชน', // Proof of Identification with Real Time Face   一张人脸照片直接和身份证一起。
        img: require('./../../../images/account/uploadfile/type3.png'),
    },
    type4: {
        title: 'หลักฐานการฝากเงิน​', // 存款证明 Proof of Deposit
        img: require('./../../../images/account/uploadfile/type4.png'),
    },
    type5: {
        title: 'เอกสารยืนยันบัญชีธนาคาร', // 银行账户验证文件  Proof of Bank Account Owner
        img: require('./../../../images/account/uploadfile/type5.png'),
    }
}

class Uploadfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            imageRestriction: '',
            documents: [],
            uploadfileIcon: {
                invalid: {
                    icon: null,
                    text: ''
                },
                pending: {
                    icon: <Image resizeMode='stretch' source={require('./../../../images/account/uploadfile/pending.png')} style={[styles.baseCircle]}></Image>,
                    text: 'กำลังดำเนินการ'
                },
                approve: {
                    icon: <Image resizeMode='stretch' source={require('./../../../images/account/uploadfile/approve.png')} style={[styles.baseCircle]}></Image>,
                    text: 'HỢP LỆ'
                },
                reject: {
                    icon: <Image resizeMode='stretch' source={require('./../../../images/account/uploadfile/reject.png')} style={[styles.baseCircle]}></Image>,
                    text: 'TỪ CHỐI'
                },
                noattachment: {
                    icon: null,
                    text: ''
                }
            },
            isShowUploadModal: false,
            isShowUploadGuideModal: false,
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
            uploadInfor: [
                {
                    img: require('./../../../images/account/uploadfile/uploadInfor1.png'),
                    text: 'รายการการฝากเงินที่ปลอดภัย',
                },
                {
                    img: require('./../../../images/account/uploadfile/uploadInfor2.png'),
                    text: 'ดำเนินการถอนเงินเร็ว',
                },
                {
                    img: require('./../../../images/account/uploadfile/uploadInfor3.png'),
                    text: 'สิทธิพิเศษรายวัน',
                }
            ]
        }
    }

    componentDidMount() {
        this.getVerification()
        this.getMmpStore()
    }


    getMmpStore() {
        storage.load({
            key: 'UploadfileModal' + window.userNameDB,
            id: 'UploadfileModal' + window.userNameDB
        }).then(data => {
            this.setState({
                isShowUploadModal: false
            })
        }).catch(() => {
            this.setState({
                isShowUploadModal: true
            })
        })
    }

    getVerification(flag, i) {
        global.storage.load({
            key: 'Uploadfile',
            id: 'Uploadfile'
        }).then(data => {
            this.setState({
                imageRestriction: data.imageRestriction,
                documents: data.documents
            })
        }).catch(() => {
            Toast.loading('กำลังโหลดข้อมูล...', 2000)
        })
        fetchRequest(ApiPort.GetVerification, 'GET').then(res => {
            Toast.hide()
            //if (res.isSuccess) {
            let documents = res.documents
            let imageRestriction = res.imageRestriction
            this.setState({
                imageRestriction,
                documents
            })
            if (flag) {
                if (Array.isArray(documents) && documents.length > 0) {
                    let documentsList = documents[i]
                    let docStatus = documentsList.docStatus.toLocaleLowerCase()
                    let uploadStatus = ['pending', 'approve', 'reject'].some(v1 => v1 === docStatus)
                    if (uploadStatus) {
                        Actions.UploadFileStatusStack({
                            pageTitle: UploadfileName[`type${documentsList.docTypeId}`].title,
                            documents: documentsList,
                            imageRestriction
                        })
                    }
                }
            }
            global.storage.save({
                key: 'Uploadfile',
                id: 'Uploadfile',
                data: res,
                expires: null
            })
            // }
        }).catch(err => {
            Toast.hide()
        })
    }

    actionToPage(v, i) {
        const { imageRestriction } = this.state
        if ((Array.isArray(v.docToUpload) && v.docToUpload.length)) {
            Actions.UploadFileDetail({
                imageRestriction,
                documents: v,
                getVerification: () => {
                    this.getVerification(true, i)
                },
                pageTitle: UploadfileName[`type${v.docTypeId}`].title
            })
        } else {
            let docStatus = v.docStatus.toLocaleLowerCase()
            let uploadStatus = ['pending', 'approve', 'reject'].some(v1 => v1 === docStatus)
            if (uploadStatus) {
                Actions.UploadFileStatusStack({
                    pageTitle: UploadfileName[`type${v.docTypeId}`].title,
                    documents: v,
                    imageRestriction,
                    getVerification: () => {
                        this.getVerification(true, i)
                    }
                })
            }
        }
    }


    renderPage(item) {
        const { bannerData } = this.state
        return <TouchableOpacity key={item.index} style={[styles.carouselImg]}>
            {
                // <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 35 }}>ขั้นตอนการอัพโหลดเอกสาร</Text>
                // <Text style={{ marginTop: 10, marginBottom: 30 }}>{`${item.index + 1}/${bannerData.length}`}</Text>

                // <Text style={{ marginBottom: 10 }}>
                //     <Text style={{ fontWeight: 'bold', }}>ขั้นตอนที่ {item.index + 1}: </Text>
                //     {item.item.text1}
                // </Text>
                // item.item.text2.length > 0 && <Text>{item.item.text2}</Text>
            }

            <Image
                resizeMode='stretch'
                style={styles.carouselImg1}
                source={item.item.img} />
        </TouchableOpacity>
    }


    changeShowUploadModal({ isShowUploadModal, isShowUploadGuideModal }, flag) {
        this.setState({
            isShowUploadModal,
            isShowUploadGuideModal
        })

        global.storage.save({
            key: 'UploadfileModal' + window.userNameDB,
            id: 'UploadfileModal' + window.userNameDB,
            data: true,
            expires: null
        })
    }

    render() {
        const managerListsBackgroundColor = window.isBlue ? '#fff' : '#212121'
        const managerListsText0 = { color: window.isBlue ? 'rgba(0, 0, 0, .5)' : 'rgba(255, 255, 255, .5)' }
        const managerListsText1 = { color: window.isBlue ? '#000' : '#fff', fontWeight: 'bold' }
        const managerListsStyle = [styles.managerLists, { backgroundColor: managerListsBackgroundColor }]
        const arrowRightImg = window.isBlue ? require('./../../../images/common/arrowIcon/right0.png') : require('./../../../images/common/arrowIcon/right1.png')
        const { isUpload } = this.props
        const { documents, uploadfileIcon } = this.state
        const { uploadInfor, isShowUploadModal, bannerData, bannerIndex, isShowUploadGuideModal } = this.state
        return <View style={[styles.viewContainer]}>
            {
                !isUpload && <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 200 }}>
                    <Image resizeMode='stretch' source={require('./../../../images/account/uploadfile/upload.png')}
                        style={[{
                            width: 80,
                            height: 80,
                            marginBottom: 10
                        }]}></Image>
                    <Text style={{ color: '#6C6C6C' }}>บัญชีของท่านไม่ต้องทำการส่งเอกสารยืนยันตัวตน</Text>
                </View>
            }
            {
                (isUpload == 'NEW') && <View style={[styles.viewContainer]}>
                    <ScrollView
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                    >
                        <UploadfileModal
                            isShowUploadModal={isShowUploadModal}
                            isShowUploadGuideModal={isShowUploadGuideModal}
                            changeShowUploadModal={this.changeShowUploadModal.bind(this)}
                        ></UploadfileModal>

                        {

                            <View>
                                {
                                    (Array.isArray(documents) && documents.length > 0)
                                        ?
                                        documents.map((v, i) => {
                                            let docStatus = v.docStatus.toLocaleLowerCase()
                                            return <View style={managerListsStyle} key={i}>
                                                <Touch style={styles.managerListsTouch} onPress={this.actionToPage.bind(this, v, i)}>
                                                    <View style={styles.managerListsLeft}>
                                                        <View style={styles.managerListsTextWrap}>
                                                            <Image resizeMode='stretch' source={UploadfileName[`type${v.docTypeId}`].img} style={styles.typeImg}></Image>
                                                            <Text style={[managerListsText0]}>{UploadfileName[`type${v.docTypeId}`].title}</Text>
                                                            {
                                                                // docStatus && uploadfileIcon[docStatus] && uploadfileIcon[docStatus].text.length > 0 && <Text style={managerListsText1}>{uploadfileIcon[docStatus].text}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        {
                                                            docStatus && uploadfileIcon[docStatus] && uploadfileIcon[docStatus].icon
                                                        }
                                                        <Image resizeMode='stretch' source={arrowRightImg} style={[styles.arrowRight]}></Image>
                                                    </View>
                                                </Touch>
                                            </View>
                                        })
                                        :
                                        <View>
                                            {
                                                Array.from({ length: 2 }, v => v).map((v, i) => {
                                                    return <View style={[styles.managerLists, { backgroundColor: '#e0e0e0' }]} key={i}>
                                                        <LoadingBone></LoadingBone>
                                                    </View>
                                                })
                                            }
                                        </View>
                                }
                            </View>
                        }
                    </ScrollView>
                    {
                        //  isUpload &&
                        <Touch style={[styles.closeBtnWrap]} onPress={() => {
                            this.setState({
                                isShowUploadModal: true,
                                isShowUploadGuideModal: true
                            })
                        }}>
                            <Text style={styles.closeBtnText}>คลิกที่นี่เพื่อดูวิธีการ</Text>
                        </Touch>
                    }
                </View>
            }
            {
                isUpload == 'เร็วๆนี้' && <ScrollView
                    automaticallyAdjustContentInsets={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: '#1694DE', paddingTop: 20 }}
                >
                    <ImageBackground style={styles.viewContainer1} source={require('./../../../images/account/uploadfile/verificationBg.png')}
                        resizeMode='stretch'
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>ประกาศสำคัญ:</Text>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginTop: 20, marginBottom: 5 }}>การยืนยันข้อมูลที่ง่ายและเร็วขึ้น!</Text>
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>เมื่อทำการยืนยันข้อมูล พร้อมรับสิทธิพิเศษ</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 35 }}>
                            {
                                uploadInfor.map((v, i) => {
                                    return <View key={i} style={{
                                        width: (width - 20) / 3.2,
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        height: 100
                                    }}>
                                        <Image
                                            style={{
                                                width: 70,
                                                height: 70,
                                                marginBottom: 10
                                            }}
                                            source={v.img}
                                            resizeMode='stretch'></Image>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', flexWrap: 'wrap' }}>{v.text}</Text>
                                    </View>
                                })
                            }
                        </View>

                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 28, marginTop: 80 }}>เร็วๆนี้ !</Text>
                    </ImageBackground>
                </ScrollView>
            }
        </View>
    }
}

export default Uploadfile

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
    },
    viewContainer1: {
        width,
        height: 1.488 * width,
        alignItems: 'center',
        paddingTop: width * .6,
        paddingHorizontal: 10
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
        width: width - 20,
        height: (width - 20) * 1.651,
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