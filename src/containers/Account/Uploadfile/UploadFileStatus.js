import Toast from '@/containers/Toast'
import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Modal } from 'react-native'
import { Actions } from 'react-native-router-flux'

const { width, height } = Dimensions.get('window')

const UploadInfor = {
    pending: {
        title: 'กำลังประมวลผล',
        infor: 'ขณะนี้ข้อมูลของคุณกำลังได้รับการตรวจสอบ',
        buttonText: 'ยกเลิก',
        img: require('./../../../images/account/uploadfile/status0.png')
    },
    approve: {
        title: 'อนุมัติ ',
        infor: 'เอกสารของคุณได้รับการยืนยันแล้ว',
        buttonText: 'ยกเลิก',
        img: require('./../../../images/account/uploadfile/status1.png')
    },
    reject: {
        title: 'ปฏิเสธ',
        infor: 'เอกสารของคุณไม่ได้รับการยืนยันกรุณาลองอีกครั้ง',
        buttonText: 'กรุณาลองใหม่อีกครั้ง',
        img: require('./../../../images/account/uploadfile/status2.png')
    }
}

class UploadFileStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowImgModal: false,
            uploadImg: []
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: this.props.pageTitle
        })
        this.GetVerification()
    }

    GetVerification() {
        const { documents } = this.props
        const { attachmentFront, attachmentBack } = documents
        let idArr = [attachmentFront, attachmentBack].filter(v => v > 0)
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        let requests = idArr.map(v => fetchRequest(ApiPort.GetImageDataFromAWS + `attachmentID=${v}&`, 'GET'))
        Promise.all(requests).then(res => {
            Toast.hide()
            if (Array.isArray(res) && res.length) {
                this.setState({
                    uploadImg: res
                })
            }
        })
        //fetchRequest(ApiPort.GetImageDataFromAWS + 'attachmentID=13015&', 'GET').then(res => {})
    }

    changeUploadPage() {
        const { imageRestriction, documents, pageTitle, getVerification } = this.props
        const docStatus = documents.docStatus.toLocaleLowerCase()
        Actions.pop()
        if (docStatus === 'reject') {
            if (Array.isArray(documents.docToUpload) && documents.docToUpload.length === 0) {
                let documentsJson = JSON.parse(JSON.stringify(documents))
                let docTypeId = documents.docTypeId
                if (docTypeId == 1) {
                    documentsJson.docToUpload = [
                        {
                            imageType: "Front"
                        }
                    ]
                } else if (docTypeId == 5 || docTypeId == 3 || docTypeId == 4) {
                    documentsJson.docToUpload = [
                        {
                            imageType: "Default"
                        }
                    ]
                } else {
                    documentsJson.docToUpload = [
                        {
                            imageType: 'Front'
                        },
                        {
                            imageType: 'Back'
                        }
                    ]
                }
                Actions.UploadFileDetail({
                    imageRestriction,
                    documents: documentsJson,
                    getVerification,
                    pageTitle
                })
            } else {
                Actions.UploadFileDetail({
                    imageRestriction,
                    documents,
                    getVerification,
                    pageTitle
                })
            }
        }
    }

    render() {
        const { documents } = this.props
        let { remainingUploadTries, attachmentBackFileName, attachmentFrontFileName } = documents
        const { isShowImgModal, uploadImg } = this.state
        let docStatus = documents.docStatus.toLocaleLowerCase()
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
                    style={{
                        alignItems: 'center',
                        marginTop: 20
                    }} onPress={() => {
                        Actions.pop()
                    }}>
                    <Text style={{ color: '#00AEEF', fontSize: 20, fontWeight: 'bold' }}>X</Text>
                </TouchableOpacity>
                <View style={styles.imgBox}>
                    <Image source={UploadInfor[docStatus].img} resizeMode='stretch' style={styles.uploadFileImg}></Image>
                    {
                        // attachmentFrontFileName && <Text style={styles.imgName}>{attachmentFrontFileName}</Text>
                    }
                    {
                        // attachmentBackFileName && <Text style={styles.imgName}>{attachmentBackFileName}</Text>
                    }
                    <Text style={[styles.textInfor1, { color: window.isBlue ? '#000' : '#fff' }]}>{UploadInfor[docStatus].title}</Text>
                    <Text style={[styles.textInfor2, { color: window.isBlue ? '#000' : '#fff' }]}>{(remainingUploadTries == 0 && docStatus === 'reject') ? `ปฏิเสธ 
                    คุณสามารถส่งเอกสารได้ไม่เกิน (3) ครั้ง 
                    กรุณาติดต่อฝ่ายบริการลูกค้` : UploadInfor[docStatus].infor}</Text>
                </View>
            </ScrollView>

            <Modal transparent={true} visible={isShowImgModal} animationType='fade'>
                <View style={[styles.modalContainer]}>
                    <TouchableOpacity style={{
                        alignItems: 'center',
                        marginBottom: 20
                    }} onPress={() => {
                        this.setState({
                            isShowImgModal: false
                        })
                    }}>
                        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity>



                    <View>
                        {
                            Array.isArray(uploadImg) && uploadImg.length > 0 && uploadImg.map((v, i) => {
                                return <View key={i}>
                                    <Image
                                        style={{ width: width - 20, height: (width - 20) * .5, marginBottom: 15 }}
                                        resizeMode='stretch'
                                        source={{ uri: 'data:image/png;base64,' + v.attachment }}
                                    ></Image>
                                </View>
                            })
                        }
                    </View>
                </View>
            </Modal>
            <View style={styles.btnWrap}>
                <TouchableOpacity style={{ alignItems: 'center', marginBottom: 20 }} onPress={() => {
                    this.setState({
                        isShowImgModal: true
                    })
                }}>
                    <Text style={{ color: '#00AEEF', textDecorationLine: 'underline' }}>ดูไฟล์ที่ส่ง</Text>
                </TouchableOpacity>
                {
                    (remainingUploadTries == 0 && docStatus === 'reject')
                        ?
                        <View>
                            {
                                (remainingUploadTries == 0 && docStatus === 'reject') &&
                                <Text style={{ color: window.isBlue ? '#000' : '#fff', marginBottom: 15, textAlign: 'center' }}>สามารถแก้ไขได้อีก (<Text style={{ color: '#59BA6D' }}>{remainingUploadTries}</Text>) ครั้ง</Text>
                            }
                            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#1CBD64' : '#25AAE1', marginBottom: 15 }]} onPress={() => {
                                Actions.LiveChat()
                            }}>
                                <Text style={styles.closeBtnText}>TRY AGAIN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={this.changeUploadPage.bind(this)}>
                                <Text style={styles.closeBtnText}>ยกเลิก</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity style={[styles.closeBtnWrap, { backgroundColor: window.isBlue ? '#00AEEF' : '#25AAE1' }]} onPress={this.changeUploadPage.bind(this)}>
                            <Text style={styles.closeBtnText}>{UploadInfor[docStatus].buttonText}</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    }
}

export default UploadFileStatus

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingTop: 20
    },
    imgName: {
        color: '#00aeff',
        fontSize: 13,
        marginBottom: 5
    },
    btnWrap: {
        position: 'absolute',
        bottom: 40,
    },
    closeBtnWrap: {
        width: width - 20,
        marginHorizontal: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    imgBox: {
        marginTop: .15 * height,
        alignItems: 'center',
    },
    textInfor1: {
        fontWeight: 'bold',
        marginTop: 5
    },
    textInfor2: {
        textAlign: 'center'
    },
    uploadFileImg: {
        width: .3 * width,
        height: .3 * width * 1.076,
        marginBottom: 15
    },
    modalContainer: {
        width,
        height,
        backgroundColor: 'rgba(0, 0, 0, .6)',
        alignItems: 'center',
        paddingTop: 40
        //justifyContent: 'center'
    },
})