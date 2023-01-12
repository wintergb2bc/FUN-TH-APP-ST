import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, Alert, Modal } from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import { ImgPermissionsText, ImagePickerOption } from './../../Common/CommonData'

const { width, height } = Dimensions.get('window')
const UploadFileDetailText = {
    type1: {
        FRONT: 'ด้านหน้าบัตร',
        BACK: 'ด้านหลังบัตร '
    },
    type2: {
        FRONT: 'ด้านหน้าบัตร',
        BACK: 'ด้านหลังบัตร '
    },
    type4: {
        DEFAULT: 'ด้านหน้าบัตร',
        BACK: 'ด้านหลังบัตร '
    },
    type5: {
        DEFAULT: 'ด้านหน้าบัตร',
        BACK: 'ด้านหลังบัตร '
    }
}

let fileType = [
    {
        text: 'ถ่ายรูป',
        img: require('./../../../images/account/uploadfile/fileType1.png'),
        type: 'photo'
    },
    {
        text: 'เลือกจากอัลบั้ม',
        img: require('./../../../images/account/uploadfile/fileType2.png'),
        type: 'gallery'
    },
    // {
    //     text: 'อัปโหลดไฟล์',
    //     img: '',
    //     type: 'file'
    // },
]
class UploadFileDetail extends React.Component {
    constructor(props) {
        super(props)
        const { imageRestriction, documents } = this.props
        this.state = {
            imgExtension: imageRestriction.extension.map(v => v.toLocaleLowerCase()).join(','),
            imgSize: imageRestriction.size,
            docToUpload: documents.docToUpload,
            docTypeId: documents.docTypeId * 1,
            remainingUploadTries: documents.remainingUploadTries,
            imageType1: '',
            filename1: '',
            fileBytes1: '',
            imageType0: '',
            filename0: '',
            fileBytes0: '',
            isShowImgModal: false,
            isShowFileModal: false,


            fileV: '',
            fileDocTypeId: ''
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            title: this.props.pageTitle
        })
    }


    slectFile(v, docTypeId, type) {
        if (type == 'photo') {
            launchCamera(ImagePickerOption, response => {
                this.slectFileCallBack(response, v, docTypeId)
            })
        } else if (type == 'gallery') {
            launchImageLibrary(ImagePickerOption, response => {
                this.slectFileCallBack(response, v, docTypeId)
            })
        } else if (type == 'file') {
            launchImageLibrary(ImagePickerOption, response => {
                this.slectFileCallBack(response, v, docTypeId)
            })
        }
    }


    slectFileCallBack(response, v, docTypeId) {
        let assets = response.assets


        if (response.didCancel) {
            this.setState({
                [`imageType${docTypeId}`]: '',
                [`filename${docTypeId}`]: '',
                [`fileBytes${docTypeId}`]: '',
                isShowFileModal: false
            })
        } else if (response.error) {
            Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
            this.setState({
                isShowFileModal: false
            })
        } else if (response.customButton) {
            this.setState({
                isShowFileModal: false
            })
        }



        if ((Array.isArray(assets) && assets.length)) {
            const { imageRestriction } = this.props
            let assetsFirst = assets[0]




            //后缀要求小写
            let source = assetsFirst.base64
            let fileName = assetsFirst.fileName
            let fileSize = assetsFirst.fileSize
            if (!fileName) { return }
            let extension = imageRestriction.extension.map(v => v.toLocaleLowerCase())
            let size = parseInt(imageRestriction.size)
            let fileNameArr = fileName.split('.')
            let imgType = fileNameArr[fileNameArr.length - 1].toLocaleLowerCase()
            let extensionFlag = Boolean(extension.find(v => v.includes(imgType)))
            if (!extensionFlag) {
                Toast.fail('ไฟล์นี้ไม่สามารถอัปโหลดได้ กรุณาอัปโหลดไฟล์' + extension.join(',') + 'และ heif เท่านั้น ', 2)
                this.setState({
                    isShowFileModal: false,
                    fileV: '',
                    fileDocTypeId: ''
                })
                return
            }
            if (fileSize > size * 1024 * 1024) {
                Toast.fail('ไฟล์นี้มีขนาดใหญ่เกินไป ขนาดสูงสุดในการอัปโหลดคือ' + imageRestriction.size, 2)
                this.setState({
                    isShowFileModal: false,
                    fileV: '',
                    fileDocTypeId: ''
                })
                return
            }

            this.setState({
                [`imageType${docTypeId}`]: v.imageType,
                [`filename${docTypeId}`]: fileName,
                [`fileBytes${docTypeId}`]: source,
                isShowFileModal: false,
                fileV: '',
                fileDocTypeId: ''
            })

            //console.log(v.imageType)
        } else {
            this.setState({
                isShowFileModal: false,
                fileV: '',
                fileDocTypeId: ''
            })
            //Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
        }

    }



    postVerification() {
        const { docTypeId, remainingUploadTries } = this.state
        const { imageType0, filename0, fileBytes0, imageType1, filename1, fileBytes1 } = this.state
        let params = [
            {
                imageType: imageType0,
                filename: filename0,
                fileBytes: fileBytes0
            },
            {
                imageType: imageType1,
                filename: filename1,
                fileBytes: fileBytes1
            }
        ].filter(v => v.filename && v.fileBytes)
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostVerification + 'docTypeId=' + docTypeId + '&numberOfTry=' + remainingUploadTries + '&', 'POST', params).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                Toast.success('การอัปเดตสำเร็จ', 2)
                Actions.pop()
                this.props.getVerification()
            } else {
                let error = res.errors
                Toast.fail(error[0].description, 2)
            }
        }).catch(err => {
            Toast.hide()
        })
    }



    cancleVerification(docTypeId) {
        this.setState({
            [`imageType${docTypeId}`]: '',
            [`filename${docTypeId}`]: '',
            [`fileBytes${docTypeId}`]: '',
        })
    }

    render() {
        const {
            fileV,
            fileDocTypeId, isShowFileModal, isShowImgModal, remainingUploadTries, imageType0, imageType1, docTypeId, imgExtension, imgSize, docToUpload, fileBytes0, fileBytes1 } = this.state
        const uploadImg = window.isBlue ? require('./../../../images/account/uploadfile/uploadFile0.png') : require('./../../../images/account/uploadfile/uploadFile1.png')
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#F4F4F5' : '#000' }]}>
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



                    <Image
                        style={{ width: width * .75, height: (width * .75) * 1.496, marginBottom: 15 }}
                        resizeMode='stretch'
                        source={require('./../../../images/account/uploadfile/uploadfileDemo99.png')}
                    ></Image>
                </View>
            </Modal>

            <Modal transparent={true} visible={isShowFileModal} animationType='fade'>
                <View style={[styles.modalContainer, {
                    justifyContent: 'flex-end',

                }]}>
                    <View style={{ width: width * .96, alignItems: 'center', marginBottom: 30 }}>
                        <View style={{ backgroundColor: '#dbdcdc', borderRadius: 14 }}>
                            {
                                fileType.map((v, i) => <TouchableOpacity
                                    onPress={() => {
                                        this.slectFile(fileV, fileDocTypeId, v.type)
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: width * .96,
                                        paddingHorizontal: 15,
                                        height: 50,
                                        alignItems: 'center',
                                        borderBottomWidth: i == fileType.length - 1 ? 0 : 1,
                                        borderBottomColor: 'gray'
                                    }}
                                    key={i}
                                >
                                    <Text style={{
                                        color: '#007AFF',
                                        fontSize: 16
                                    }}>{v.text}</Text>
                                    <Image
                                        style={{ width: 25, height: 25 }}
                                        resizeMode='stretch'
                                        source={v.img}
                                    ></Image>
                                </TouchableOpacity>)
                            }
                        </View>


                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    isShowFileModal: false,
                                    fileV: '',
                                    fileDocTypeId: ''
                                })
                            }}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: width * .96,
                                paddingHorizontal: 15,
                                height: 50,
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: 'gray',
                                marginTop: 10,
                                backgroundColor: '#dbdcdc',
                                borderRadius: 14
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: '#007AFF'
                            }}>ยกเลิก</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </Modal>

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.textInforWrap}>
                    <Text style={[styles.textInfor]}>กดเพิ่มไฟล์ที่ถูกต้องลงในช่องด้านล่าง รองรับไฟล์ในรูปแบบ .jpg, .jpeg และ .png เท่านั้น ขนาดไฟล์สูงสุด {imgSize} ต่อไฟล์.</Text>
                </View>
                {
                    docToUpload.map((v, i) => {
                        let flag = this.state[`imageType${i}`] === v.imageType
                        return <View key={i} style={[styles.uploadFileWrap]}>
                            <Text style={[styles.uplodFileText]}>{
                                docToUpload.length == 2 && UploadFileDetailText[`type${docTypeId}`][v.imageType.toLocaleUpperCase()]
                            }</Text>
                            {
                                flag ? <Image resizeMode='stretch' source={{ uri: 'data:image/png;base64,' + this.state[`fileBytes${i}`] }} style={styles.uploadFileImg1} />
                                    :
                                    <Image resizeMode='stretch' source={uploadImg} style={styles.uploadFileImg} />
                            }



                            {
                                flag ? <View style={styles.filenameTextBox}>
                                    <Text style={[styles.filenameText, { color: window.isBlue ? '#59595B' : '#fff', textAlign: 'center', width: width * .8 }]}>{this.state[`filename${i}`]}</Text>
                                    <TouchableOpacity style={styles.filenameCancle} onPress={this.cancleVerification.bind(this, i)}>
                                        <Text style={styles.filenameCancleText}>เลือกไฟล์</Text>
                                    </TouchableOpacity>
                                </View>
                                    :
                                    <TouchableOpacity style={styles.uploadFileBtn} onPress={() => {
                                        this.setState({
                                            isShowFileModal: true,
                                            fileV: v,
                                            fileDocTypeId: i
                                        })
                                        // this.slectFile.bind(this, v, i)
                                    }}>
                                        <Image style={styles.uploadTextIcon} resizeMode='stretch' source={require('./../../../images/account/uploadfile/uploadTextIcon.png')}></Image>
                                        <Text style={styles.uploadTextInfor}>เลือกไฟล์</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    })
                }


            </ScrollView>
            {
                // (docTypeId === 1 ? (imageType1.length > 0 && imageType0.length > 0) : (imageType1.length > 0 || imageType0.length > 0)) &&
                <View style={styles.btnWrap}>
                    <Text style={{ color: '#59595B', marginBottom: 10 }} onPress={() => {
                        Actions.UploadfileDemo({
                            docTypeId: docTypeId,
                            pageTitle: this.props.pageTitle
                        })

                    }}>ดูตัวอย่าง <Text style={{ color: '#00AEEF' }}>ที่นี่</Text></Text>
                    <Text style={{ color: window.isBlue ? '#59595B' : '#fff', marginBottom: 10 }}>สามารถแก้ไขได้อีก (<Text style={{ color: '#59BA6D' }}>{remainingUploadTries}</Text>) ครั้ง</Text>

                    <TouchableOpacity style={[styles.closeBtnWrap, {
                        backgroundColor:
                            (docToUpload.length == 1 ? imageType0.length > 0 : (imageType1.length > 0 && imageType0.length > 0)) ? '#33C85D' : '#E1E1E1'
                    }]} onPress={() => {
                        if ((docToUpload.length == 1 ? imageType0.length > 0 : (imageType1.length > 0 && imageType0.length > 0))) {
                            this.postVerification()
                        }
                    }
                    }>
                        <Text style={styles.closeBtnText}>ส่ง</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    }
}

export default UploadFileDetail

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        paddingTop: 20
    },
    filenameTextBox: {
        alignItems: 'center'
    },
    filenameText: {

    },
    filenameCancle: {
        paddingVertical: 10,
        width,
        alignItems: 'center',

    },
    filenameCancleText: {
        color: '#00AEEF',
        textDecorationLine: 'underline'
    },
    textInforWrap: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 20
    },
    textInfor: {
        textAlign: 'center',
        color: '#707070'
    },
    uploadFileWrap: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 15,
        backgroundColor: '#FFFFFF'
    },
    uplodFileText: {
        fontSize: 16,
        color: '#59595B'
    },
    uploadFileImg: {
        width: 45,
        height: 65,
        marginTop: 15,
        marginBottom: 15
    },
    uploadFileImg1: {
        marginTop: 15,
        marginBottom: 15,
        width: 80,
        height: 65,
    },
    uploadFileBtn: {
        backgroundColor: '#59BA6D',
        borderRadius: 5,
        height: 40,
        width: 180,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    uploadTextIcon: {
        width: 14,
        height: 22,
        marginRight: 15
    },
    uploadTextInfor: {
        color: '#fff'
    },
    closeBtnWrap: {
        width: width - 40,
        marginHorizontal: 20,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
    },
    closeBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff'
    },
    btnWrap: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center'
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