import React from 'react'
import ReactNative, { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Modal, Clipboard, Alert, TouchableHighlight, UIManager, Platform } from 'react-native'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'
import moment from 'moment'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ImgPermissionsText, ImagePickerOption } from './../../Common/CommonData'
import { changeDepositTypeAction, getMemberInforAction } from './../../../actions/ReducerAction'
import { getName } from './../../../actions/Reg'
import { connect } from 'react-redux'
let reg = /\d{1,3}(?=(\d{3})+$)/g
import { toThousands, toThousandsAnother } from '../../../actions/Reg'

const { width, height } = Dimensions.get('window')
const ManualDepositText = [
    'ในการส่งคำร้องยืนยันธุรกรรมนี้อีกครั้ง โปรดปฏิบัติตามขั้นตอนเหล่านี้:',
    '1. คลิก "เข้าใจแล้ว ดำเนินการต่อไป"',
    '2. ในขั้นตอนถัดไปคลิกปุ่ม "ดำเนินการต่อ"',
    '3. คุณไม่จำเป็นต้องโอนเงินใดๆ โปรดรอจนกว่า หน้าธุรกรรมแสดงผลขึ้น จากนั้นจึงกดปิดหน้าดังกล่าว'
]
class RecordsManualDepositContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowdetails: false,
            isShowModal: false,
            datailsType: this.props.datailsType,
            recordItem: this.props.item,
            checkDetailsDB: '',
            updateImage: 1,
            updateImageMode: false,
            isCancleMOdal: false,
            isCopay: false,
            mmpInputTop1: 0,
            mmpInputTop2: 0,
            isShowTipModal: false,
            avatarName: '',
            avatarSource: '',
            historyList: {
                "ReasonCode": "",
                "ReasonMsg": "Ngân hàng hiện đang bảo trì, vui lòng đăng tải biên lại để giao dịch nhanh chóng hơn hoặc ติดต่อฝ่ายบริการ để được hỗ trợ.",
                "IsContactCS": true,
                "IsUploadSlip": true,
                "IsSubmitNewTrans": false,
                "IsUploadDocument": false,
                "PaidAmount": 0.0,
                "RejectedDatetime": "2019-07-22 16:05",
                "SubTransactionCount": 0,
                "IsSplitWithdrawal": false,
                "MethodType": "LocalBank",
                "CryptoExchangeRate": 0.0,
                "IsAbleRequestRejectDeposit": false,
                "ResubmitFlag": 1,
                "ResubmitAmount": 0.0,
                "TotalTransactionCount": 0,
                "ApprovedDatetime": "2019-07-22 16:05",
                "ProcessingDatetime": "2019-07-22 16:05",
                "PendingDatetime": "2019-07-22 16:05",
                "TransactionId": "VND201907224910770",
                "TransactionType": 1,
                "Amount": 507,
                "Charges": 0.0,
                "PaymentMethodId": "FP",
                "ConvertedAmount": 0.0,
                "CurrencyCode": "VND",
                "SubmittedAt": "2019-07-22 16:05",
                "StatusId": 1,
                "Status": "Approved",
                "RemarkCode": "",
                "PaymentMethodName": "Ngân Hàng Địa Phương",
                "CoinsAmount": 0.0,
                "depositWithdrawalsName": 'FastPay'
            },
        },
            this.mycomponent1 = React.createRef()
        this.mycomponent2 = React.createRef()
    }

    componentDidMount() {
        this.checkDetails()
    }

    componentWillUnmount() {
        this.props.getDepositWithdrawalsRecords && this.props.getDepositWithdrawalsRecords()
    }

    async copyTXT(txt) {
        Clipboard.setString(txt)
        this.setState({
            isCopay: true
        })

        Toast.success('คัดลอกแล้ว', 1.5)
    }


    selectCameraTapped() {
        const options = {
            title: 'อัปโหลดสลิป',
            cancelButtonTitle: 'Hủy',
            takePhotoButtonTitle: 'Chụp Ảnh', //拍照
            chooseFromLibraryButtonTitle: 'Chọn Hình Từ Thiết Bị',  //從相簿拿圖
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 6000000,
            maxHeight: 6000000,
            quality: 1,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            includeBase64: true,
            saveToPhotos: true,
            cameraRoll: true,
            waitUntilSaved: Platform.OS == 'ios' ? true : false,
        };


        // 后端支持的文件类型='.jpg,.jpeg,.gif,.bmp,.png,.doc,.docx,.pdf'
        // jpg, gif, bmp, png, doc, docx, pdf, heic & heif

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {

                this.setState({
                    avatarName: '',
                    avatarSource: '',

                    fileSize: '',
                    fileImgFlag: false
                })
            } else if (response.error) {
                Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
            } else if (response.customButton) {
            }

            let assets = response.assets
            if ((Array.isArray(assets) && assets.length)) {
                let assetsFirst = assets[0]
                this.setState({
                    avatarName: assetsFirst.fileName,
                    avatarSource: assetsFirst.base64,
                }, () => {
                    this.postImg()
                })
            } else {
                //Alert.alert('ข้อผิดพลาดในการเข้าถึงรูปภาพ', ImgPermissionsText)
            }
        })
    }


    postImg() {
        const { avatarSource, avatarName, recordItem } = this.state
        const memberInforData = this.props.memberInforData
        const MemberCode = memberInforData.MemberCode
        let data = {
            "DepositID": recordItem.TransactionId,
            "PaymentMethod": recordItem.PaymentMethodId,
            "FileName": avatarName.toLocaleLowerCase(),
            "byteAttachment": avatarSource,
            "RequestedBy": MemberCode
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.UploadAttachment, 'POST', data).then(res => {
            Toast.hide()
            if (res.isSuccess) {
                this.setState({
                    updateImage: 2,
                    //updateImageMode: true,
                })
                Toast.success('อัปโหลดสลิปสำเร็จ', 1.5)

                // setTimeout(() => {
                //     this.setState({
                //         updateImageMode: false
                //     })
                // }, 2500)
            } else {
                this.setState({
                    updateImage: 3,
                })
                Toast.fail('Pls Try it again')
            }
        }).catch(err => {
            Toast.hide()
        })
    }



    checkDetails() {
        const { recordItem, datailsType } = this.state
        //Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.GetTransactionHistory + '?transactionID=' + recordItem.TransactionId + '&transactionType=' + datailsType + '&', 'GET').then(res => {
            Toast.hide()
            this.setState({
                checkDetailsDB: res,
            })

        }).catch(err => {
            Toast.hide()
            // Toast.fail(err && err)
        })
    }


    cancleWithdrawals() {
        const { recordItem, datailsType } = this.state
        const parmas = {
            'TransactionType': 'Withdrawal',
            'Remark': 'test',
            'Amount': recordItem.Amount
        }
        Toast.loading('กำลังโหลดข้อมูล...', 2000)

        fetchRequest(ApiPort.POSTNoCancellation + recordItem.TransactionId + '/Cancellation?', 'POST', parmas).then(data => {
            Toast.hide()
            if (data.isSuccess == true) {
                this.props.cancaleWithdrawalReload()
                // Toast.success('Yêu cầu hủy của bạn đã được gứi. ', 2, () => {

                // })
                Actions.pop()
            } else {
                Toast.fail('ยกเลิกไม่สำเร็จ')
            }
        }).catch(error => {
            Toast.hide()
        })
    }

    cancleDeposit() {
        const { recordItem, datailsType } = this.state
        Toast.loading('กำลังโหลดข้อมูล...', 2000)
        fetchRequest(ApiPort.PostMemberRequestDepositReject + 'transactionID=' + recordItem.TransactionId + '&', 'POST').then(data => {
            Toast.hide()
            let Message = data.Message || ''
            if (data.IsSuccess == true) {
                // Message.length && Toast.success(Message, 2, () => {

                // })
                Actions.pop()
            } else {
                Message.length && Toast.fail(Message)
            }
        }).catch(error => {
            Toast.hide()
        })
    }



    getmmpQrcodePos() {
        if (!(UIManager.measure && this.mycomponent1)) return
        UIManager.measure(ReactNative.findNodeHandle(this.mycomponent1.current), (x, y, w, h, px, py) => {
            this.setState({
                mmpInputTop1: py,
                isShowTipModal: true
            })
        })
    }

    DepostStatusView() {
        const { historyList, mmpInputTop1, isShowTipModal, isCopay, isCancleMOdal, datailsType, recordItem, isShowModal, isShowdetails, checkDetailsDB, updateImage, updateImageMode } = this.state
        const { StatusId, SubTransactionCount, TotalTransactionCount,
            IsContactCS, // 联系在线客服
            IsSubmitNewTrans,//再次存款   – Display Resubmit Transaction button
            IsUploadSlip,  //上传存款回执单  Display upload slip button
            IsAbleRequestRejectDeposit, //取消存款
            IsUploadDocument,  // 提款证件
            IsSplitWithdrawal
        } = historyList
        return <View>
            {//新參數告知用戶當前狀態  
                historyList.ReasonMsg != "" && <Text style={{ color: window.isBlue ? '#000' : '#58585B', lineHeight: 20, marginTop: 10 }}>
                    {historyList.ReasonMsg}
                </Text>
            }

            {
                (StatusId == 1 || StatusId == 4) && <View style={styles.btnWarp1}>
                    {//上傳圖片狀態
                        updateImage == 2 &&
                        <Text style={{ color: '#25AAE1', lineHeight: 20, marginTop: 10, marginBottom: 30, fontWeight: 'bold' }}>* คุณได้ดาวน์โหลดสลิปแล้ว</Text>
                    }

                    {
                        updateImage == 3 && <Text style={{ color: '#FF0000', lineHeight: 20, marginTop: 10, marginBottom: 30, fontWeight: 'bold' }}>อัปโหลดล้มเหลว, กรุณาลองอีกครั้ง.</Text>
                    }

                    <TouchableOpacity
                        style={[styles.btnStyle1, { backgroundColor: 'transparent' }]}>
                        <Text style={{ color: '#25AAE1', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.btnStyle1]}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>อัปโหลดสลิป</Text>
                    </TouchableOpacity>
                </View>
            }

            {
                StatusId == 3 &&
                <View style={styles.btnWarp1}>
                    {
                        IsSubmitNewTrans &&
                        <TouchableOpacity
                            style={[styles.btnStyle1]}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>ทำรายการใหม่</Text>
                        </TouchableOpacity>
                    }

                    {
                        IsContactCS &&
                        <TouchableOpacity
                            style={[styles.btnStyle1, { backgroundColor: IsSubmitNewTrans ? 'transparent' : '#25AAE1' }]}>
                            <Text style={{ color: IsSubmitNewTrans ? '#25AAE1' : '#fff', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                        </TouchableOpacity>
                    }
                </View>
            }
        </View>
    }


    render() {
        const { historyList, mmpInputTop1, isShowTipModal, isCopay, isCancleMOdal, datailsType, recordItem, isShowModal, isShowdetails, checkDetailsDB, updateImage, updateImageMode } = this.state
        const { StatusId, SubTransactionCount, TotalTransactionCount,
            IsContactCS, // 联系在线客服
            IsSubmitNewTrans,//再次存款   – Display Resubmit Transaction button
            IsUploadSlip,  //上传存款回执单  Display upload slip button
            IsAbleRequestRejectDeposit, //取消存款
            IsUploadDocument,  // 提款证件
            IsSplitWithdrawal,
            ReasonMsg
        } = recordItem
        return <View style={[styles.viewContainer, { backgroundColor: window.isBlue ? '#fff' : '#000' }]}>
            <Modal animationType='fade' transparent={true} visible={isShowdetails}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#fff' : '#0F0F0F' }]}>
                        <View style={[styles.modalTop, { backgroundColor: window.isBlue ? '#00AEEF' : '#212121' }]}>
                            <Text style={styles.modalTopText}>{datailsType != "withdrawal" ? 'ข้อมูลรายการ' : 'ข้อมูลรายการ'}</Text>
                        </View>
                        <View style={styles.modalBody}>
                            {
                                datailsType == "withdrawal"
                                    ?
                                    <View>
                                        <View>

                                            <View style={styles.showdetailTextA}>
                                                <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดเงิน</Text>
                                            </View>

                                            <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                            </View>

                                            {
                                                Boolean(checkDetailsDB.PreferredBankName) && <View>
                                                    <View style={styles.showdetailTextA}>
                                                        <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>บัญชีที่ต้องการ</Text>
                                                    </View>

                                                    <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                        <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.PreferredBankName}</Text>
                                                    </View>

                                                </View>
                                            }

                                            <View style={styles.showdetailTextA}>
                                                <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ชื่อจริง</Text>
                                            </View>

                                            <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.AccountHolderName && getName(checkDetailsDB.AccountHolderName)}</Text>
                                            </View>


                                            <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ชื่อธนาคาร​​</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.BankName}</Text>
                                                </View>

                                            </View>

                                            <View style={styles.showdetailTextA}>
                                                <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>บัญชีธนาคาร</Text>
                                            </View>

                                            <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.WithdrawalAccNumber && checkDetailsDB.WithdrawalAccNumber.replace(/^(.).*(...)$/, "******$2")}</Text>
                                            </View>

                                            {
                                                false &&
                                                <View>
                                                    <View style={styles.showdetailTextA}>
                                                        <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดการถอน</Text>
                                                    </View>

                                                    <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                        <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.Province}</Text>
                                                    </View>

                                                    <View style={styles.showdetailTextA}>
                                                        <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>Thành Phố</Text>
                                                    </View>

                                                    <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                        <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.City}</Text>
                                                    </View>

                                                    <View style={styles.showdetailTextA}>
                                                        <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>Chi Nhánh</Text>
                                                    </View>

                                                    <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                        <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.Branch}</Text>
                                                    </View>
                                                </View>
                                            }


                                        </View>
                                    </View>
                                    :
                                    <View>
                                        {
                                            recordItem.PaymentMethodId == "LB" && <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ชื่อ-นามสกุล</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.AccountHolderName && getName(checkDetailsDB.AccountHolderName)}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ประเภท</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.MethodOriName}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดเงิน</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>

                                            </View>
                                        }

                                        {
                                            recordItem.PaymentMethodId == "RD" && <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ชื่อ</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.AccountHolderName && getName(checkDetailsDB.AccountHolderName)}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ประเภท</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.MethodOriName}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>จำนวนที่ส่ง</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>

                                            </View>
                                        }

                                        {
                                            recordItem.PaymentMethodId == "BQR" && <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ชื่อ</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.AccountHolderName && getName(checkDetailsDB.AccountHolderName)}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ประเภท</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>QR ฝากเงินทศนิยม</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>จำนวนที่ส่ง</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>จำนวนจริงที่โอน</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.ActualAmount)}</Text>
                                                </View>

                                            </View>
                                        }


                                        {
                                            recordItem.PaymentMethodId == "BC" &&
                                            <View>


                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ช่องทาง</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.Method}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ธนาคาร</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.BankName}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดเงิน</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>
                                            </View>

                                        }


                                        {
                                            recordItem.PaymentMethodId == "EZP" &&
                                            <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ประเภท</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.Method}</Text>
                                                </View>

                                                {
                                                    Boolean(checkDetailsDB && checkDetailsDB.Gateway && checkDetailsDB.Gateway.length > 0) && <View>
                                                        <View style={styles.showdetailTextA}>
                                                            <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ช่องทาง</Text>
                                                        </View>

                                                        <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                            <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.Gateway}</Text>
                                                        </View>
                                                    </View>
                                                }



                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ธนาคาร</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.BankName}</Text>
                                                </View>

                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดเงิน</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>
                                            </View>

                                        }





                                        {
                                            recordItem.PaymentMethodId == "CC" && <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดเงิน</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>

                                                <View>
                                                    <View style={styles.showdetailTextA}>
                                                        <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>หมายเลข S/N ของบัตรเงินสด</Text>
                                                    </View>

                                                    <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                        <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{checkDetailsDB.SerialNo}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                        }

                                        {
                                            ["MMO", 'VP', 'ZLP', 'THBQR', 'TMW'].includes(recordItem.PaymentMethodId) && <View>
                                                <View style={styles.showdetailTextA}>
                                                    <Text style={{ color: window.isBlue ? '#4A4A4A' : '#fff' }}>ยอดเงิน</Text>
                                                </View>

                                                <View style={[styles.showdetailText, { backgroundColor: window.isBlue ? '#F0F0F0' : '#212121' }]}>
                                                    <Text style={{ fontWeight: 'bold', color: window.isBlue ? '#4A4A4A' : '#FFFFFF' }}>{recordItem.PaymentMethodId === 'MMO' ? (checkDetailsDB.Amount + '').replace(reg, '$&,') : toThousands(checkDetailsDB.Amount)}</Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                            }


                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, backgroundColor: '#25AAE1', borderRadius: 6 }}>

                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: '#25AAE1', borderColor: '#25AAE1' }]}
                                    onPress={() => {
                                        this.setState({
                                            isShowdetails: false
                                        })
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff' }]}>กลับ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal animationType='fade' transparent={true} visible={isShowModal}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F', width: width * .95 }]}>
                        <View style={{ height: 50, width: 360, alignItems: 'center', justifyContent: 'center', backgroundColor: '#25AAE1', flexDirection: 'row', justifyContent: 'center', backgroundColor: window.isBlue ? '#25AAE1' : '#212121' }}>
                            <View style={{ flex: 0.7, alignItems: 'center', paddingLeft: 70 }}>
                                <Text style={styles.modalTopText}>ประกาศสำคัญ</Text>
                            </View>

                            <View style={{ flex: 0.3, alignItems: 'center', paddingLeft: 10 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            isShowModal: false
                                        })

                                    }}
                                >
                                    <Text style={[styles.modalTopText, { fontSize: 22, fontWeight: 'bold' }]}>X</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <View style={styles.modalBody}>
                            <View>
                                {
                                    ManualDepositText.map((v, i) => {
                                        return <Text key={i} style={[styles.manualDepositText, {
                                            color: window.isBlue ? '#58585B' : '#fff'
                                        }]}>{v}</Text>
                                    })
                                }

                            </View>
                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#25AAE1', width: (width * .95 - 30) / 2.1, }]} onPress={() => {
                                    this.setState({
                                        isShowModal: false
                                    })
                                    Actions.LiveChat()
                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#25AAE1', fontSize: 12, }]}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: '#25AAE1', borderColor: '#25AAE1', width: (width * .995 - 30) / 2.1, }]}
                                    onPress={() => {
                                        this.setState({
                                            isShowModal: false
                                        })
                                        Actions.RedoDepositTransaction({
                                            recordItem,
                                            getDepositWithdrawalsRecords: () => {
                                                this.props.getDepositWithdrawalsRecords()
                                            }
                                        })
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff', fontSize: 12 }]}>เข้าใจแล้ว ดำเนินการต่อไป</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal animationType='fade' transparent={true} visible={isCancleMOdal}>
                <View style={[styles.modalContainer]}>
                    <View style={[styles.modalBox, { backgroundColor: window.isBlue ? '#EFEFEF' : '#0F0F0F', width: width * .95 }]}>
                        <View style={{ height: 50, width: 360, alignItems: 'center', justifyContent: 'center', backgroundColor: '#25AAE1', flexDirection: 'row', justifyContent: 'center', backgroundColor: window.isBlue ? '#25AAE1' : '#212121' }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.modalTopText, { fontWeight: 'bold', color: window.isBlue ? '#fff' : '#fff' }]}>{datailsType == "deposit" ? 'การยืนยันคำร้อง' : 'ยกเลิกการถอน'}</Text>
                            </View>
                        </View>
                        <View style={[styles.modalBody, { paddingHorizontal: 10 }]}>
                            <View>
                                <Text style={[styles.manualDepositText, { color: window.isBlue ? '#58585B' : '#fff', textAlign: 'center', lineHeight: 28 }]}>{
                                    datailsType == "deposit" ?
                                        `คุณยืนยันที่จะยกเลิกรายการฝากเงิน ${toThousands(recordItem.Amount)} บาท หรือไม่?`
                                        : `คุณต้องการยกเลิกการถอนยอด ${toThousands(recordItem.Amount)} \nใช่หรือไม่ ?`}
                                </Text>
                            </View>

                            <View style={styles.modalBtnBox}>
                                <TouchableOpacity style={[styles.modalBtn, { borderColor: '#25AAE1', width: (width * .95 - 20) / 2.1 }]} onPress={() => {
                                    this.setState({
                                        isCancleMOdal: false
                                    })

                                }}>
                                    <Text style={[styles.modalBtnText, { color: '#25AAE1', textAlign: 'center', fontSize: 13 }]}>ย้อนกลับ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalBtn, { backgroundColor: '#25AAE1', borderColor: '#25AAE1', width: (width * .95 - 20) / 2.04 }]}
                                    onPress={() => {
                                        datailsType == "deposit" ? this.cancleDeposit() : this.cancleWithdrawals()
                                        this.setState({
                                            isCancleMOdal: false
                                        })
                                        window.PiwikMenberCode('Transaction Record', 'Submit', `Cancel_${this.props.datailsType}_TransactionRecord`)
                                    }}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#fff', textAlign: 'center', fontSize: 13 }]}>ดำเนินการยกเลิก</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <ScrollView
                automaticallyAdjustContentInsets={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[styles.deposiBanktList, {
                        borderTopColor: window.isBlue ? '#fff' : '#5C5C5C',
                        backgroundColor: window.isBlue ? '#fff' : '#212121',
                        paddingBottom: 12,
                        marginBottom: 15,
                        borderTopWidth: 0
                    }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 0 }}>
                        <View style={styles.styleView9}>
                            <Text style={[styles.recordBoxText, { color: window.isBlue ? '#58585B' : '#fff', fontWeight: 'bold', fontSize: 15 }]}>{recordItem.PaymentMethodName}</Text>
                        </View>

                        <View style={{
                            flexDirection: 'row', alignItems: 'center'
                        }}>
                            {
                                this.props.datailsType == "withdrawal" && TotalTransactionCount > 1 && <View style={{
                                    borderRightWidth: 1,
                                    borderRightColor: '#E6E6E6',
                                    paddingRight: 2,
                                    marginRight: 2,
                                    alignItems: 'flex-end'
                                }}>
                                    <Text style={{ color: '#00AEEF', fontWeight: 'bold', fontSize: 15 }}>{toThousands(recordItem.PaidAmount)}</Text>
                                    <Text style={{ color: window.isBlue ? '#999999' : '#fff', fontSize: 11 }}>Số Tiền Thực Rút</Text>
                                </View>
                            }

                            {
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[styles.recordBoxText1, { color: window.isBlue ? '#58585B' : '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'right' }]}>{toThousands(recordItem.Amount)}</Text>
                                    {
                                        TotalTransactionCount > 1 && <Text style={{ color: window.isBlue ? '#999999' : '#fff', fontSize: 11 }}>Lệnh Rút Tiền</Text>
                                    }
                                </View>
                            }
                        </View>
                    </View>

                    <Text style={[styles.recordBoxText, {
                        color: window.isBlue ? '#999999' : 'rgba(255, 255, 255, .5)',
                        // modalTop: 10,
                        fontSize: 14, marginTop: 10, marginBottom: 10
                    }]}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Text style={[styles.recordBoxText1,
                        { fontSize: 14, color: window.isBlue ? '#BFBFBF' : '#fff' }]}>{recordItem.TransactionId}</Text>
                        <TouchableOpacity
                            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            onPress={this.copyTXT.bind(this, recordItem.TransactionId)}
                            style={{
                                paddingHorizontal: 4, paddingVertical: 2,
                                borderRadius: 4, borderWidth: 1, borderColor: '#25AAE1', marginLeft: 15
                            }}>
                            <Text style={{ color: '#25AAE1' }}>คัดลอก</Text>
                        </TouchableOpacity>

                        {
                            isCopay && <View style={styles.gogostyle}><Text style={{ color: '#fff', fontWeight: 'bold' }}>✓</Text></View>
                        }
                    </View>


                    <View>
                        <TouchableOpacity onPress={() => {
                            if (this.state.checkDetailsDB !== '') {
                                this.setState({
                                    isShowdetails: true
                                })
                            }

                        }}>
                            <View style={{ borderColor: '#25AAE1', width: this.props.datailsType != "withdrawal" ? 142 : 122 }}>
                                {this.props.datailsType != "withdrawal" ?
                                    <Text style={{ color: '#25AAE1', textDecorationLine: 'underline' }}>ข้อมูลการฝาก</Text>
                                    : <Text style={{ color: '#25AAE1', textDecorationLine: 'underline' }}>ข้อมูลรายการ</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        borderBottomWidth: 1,
                        borderBottomColor: window.isBlue ? '#DDDDDD' : '#555555',
                        paddingBottom: 10
                    }}>
                    </View>
                </View>


                <View style={{ paddingHorizontal: 10, }} ref={this.mycomponent1}>
                    {
                        datailsType == "deposit" && // 充值狀態
                        <View>
                            {/* pedding */}
                            {
                                (StatusId == 1 || StatusId == 4) &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView5}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#F0A800', }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: '#F0A800' }}>ดำเนินการ</Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={{ width: 22, height: 22, borderRadius: 1000, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' }}>
                                            <View style={{ backgroundColor: '#999999', width: 12, height: 12, borderRadius: 10000 }}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#999999' : '#FFFFFF' }}>สำเร็จ</Text>
                                    </View>
                                </View>
                            }

                            {/* approval */}
                            {
                                StatusId == 2 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#fff' }}>ดำเนินการ </Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={{ width: 22, height: 22, borderRadius: 1000, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#23DB00' }}>
                                            <View style={{ backgroundColor: '#23DB00', width: 12, height: 12, borderRadius: 10000 }}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#23DB00' : '#23DB00' }}>สำเร็จ</Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.ApprovedDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            }

                            {/* Rejected */}
                            {
                                StatusId == 3 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#fff' }}>{recordItem.PaymentMethodId == "LB" ? 'ดำเนินการ' : 'ดำเนินการ'}</Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView2}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#e30002', }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#E30000' : '#E30000' }}>ยกเลิก</Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.RejectedDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            }

                            {
                                StatusId == 5 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#fff' }}>{recordItem.PaymentMethodId == "LB" ? 'ดำเนินการ' : 'ดำเนินการ'}</Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView2}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#e30002', }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#E30000' : '#E30000' }}>หมดเวลา</Text>
                                        <Text style={{ color: '#999999' }}>{moment(recordItem.TimeoutDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            }

                            <View>
                                {//新參數告知用戶當前狀態  
                                    ReasonMsg != "" && <Text style={{ color: window.isBlue ? '#000' : '#B3B3B3', lineHeight: 20, marginTop: 10 }}>
                                        {ReasonMsg}
                                    </Text>
                                }

                                {
                                    (StatusId == 1 || StatusId == 4) && <View style={styles.btnWarp1}>
                                        {
                                            recordItem.PaymentMethodId == "LB" && IsAbleRequestRejectDeposit && <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        isCancleMOdal: true
                                                    })

                                                    window.PiwikMenberCode('Transaction Record', 'Click', `Cancel_Deposit_TransactionRecord`)
                                                }}
                                                style={[styles.btnStyle1]}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>ยกเลิกการฝาก</Text>
                                            </TouchableOpacity>
                                        }

                                        {//上傳圖片狀態
                                            updateImage == 2 &&
                                            <Text style={{ color: '#25AAE1', lineHeight: 20, marginTop: 10, marginBottom: 30, fontWeight: 'bold' }}>* คุณได้ดาวน์โหลดสลิปแล้ว</Text>
                                        }

                                        {
                                            updateImage == 3 && <Text style={{ color: '#FF0000', lineHeight: 20, marginTop: 10, marginBottom: 30, fontWeight: 'bold' }}>อัปโหลดล้มเหลว, กรุณาลองอีกครั้ง.</Text>
                                        }

                                        {
                                            IsUploadSlip && updateImage != 2 &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.selectCameraTapped()


                                                    window.PiwikMenberCode('Transaction Record', 'Click', 'UploadSlip_TransactionRecord')
                                                }}
                                                style={[styles.btnStyle1, {
                                                    backgroundColor: IsAbleRequestRejectDeposit ? 'transparent' : '#25AAE1'
                                                }]}>
                                                <Text style={{ fontWeight: 'bold', color: IsAbleRequestRejectDeposit ? '#25AAE1' : '#fff' }}>อัปโหลดสลิป</Text>
                                            </TouchableOpacity>
                                        }

                                        {
                                            // recordItem.ResubmitFlag || recordItem.IsSubmitNewTrans &&
                                            recordItem.ResubmitFlag &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        isShowModal: true
                                                    })
                                                    //

                                                    window.PiwikMenberCode('Deposit Nav', 'Click', 'Resubmit_Deposit_TransactionRecord')
                                                }}
                                                style={[styles.btnStyle1]}>
                                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>ส่งการฝากเงินอีกครั้ง​</Text>
                                            </TouchableOpacity>
                                        }

                                        {
                                            IsContactCS &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Actions.LiveChat()

                                                    window.PiwikMenberCode('CS', 'Click', 'LiveChat_TransactionRecord')
                                                }}
                                                style={[styles.btnStyle1, {
                                                    backgroundColor:
                                                        window.isBlue ?
                                                            (
                                                                IsAbleRequestRejectDeposit
                                                                    ?
                                                                    (
                                                                        recordItem.ResubmitFlag
                                                                            ?
                                                                            ('transparent')
                                                                            :
                                                                            (
                                                                                IsUploadSlip
                                                                                    ?
                                                                                    (
                                                                                        updateImage == 2
                                                                                            ?
                                                                                            '#25AAE1'
                                                                                            :
                                                                                            'transparent'
                                                                                    )
                                                                                    :
                                                                                    (
                                                                                        'transparent'
                                                                                    )
                                                                            )
                                                                    )
                                                                    :

                                                                    (
                                                                        IsUploadSlip
                                                                            ?
                                                                            (
                                                                                updateImage == 2
                                                                                    ?
                                                                                    '#25AAE1'
                                                                                    :
                                                                                    'transparent'
                                                                            )
                                                                            :
                                                                            (
                                                                                '#25AAE1'
                                                                            )
                                                                    )
                                                            )
                                                            :
                                                            ((IsUploadSlip || recordItem.ResubmitFlag) ? 'transparent' : '#25AAE1')
                                                }]}>
                                                <Text style={{
                                                    color: window.isBlue ?
                                                        (

                                                            IsAbleRequestRejectDeposit
                                                                ?
                                                                (
                                                                    recordItem.ResubmitFlag
                                                                        ?
                                                                        ('#25AAE1')
                                                                        :
                                                                        (
                                                                            IsUploadSlip
                                                                                ?
                                                                                (
                                                                                    updateImage == 2
                                                                                        ?
                                                                                        '#fff'
                                                                                        :
                                                                                        '#25AAE1'
                                                                                )
                                                                                :
                                                                                '#25AAE1'
                                                                        )
                                                                )
                                                                :
                                                                (
                                                                    IsUploadSlip
                                                                        ?
                                                                        (
                                                                            updateImage == 2
                                                                                ?
                                                                                '#25AAE1'
                                                                                :
                                                                                '#25AAE1'
                                                                        )
                                                                        :
                                                                        (
                                                                            '#fff'
                                                                        )
                                                                )
                                                        )
                                                        :
                                                        (((IsUploadSlip || recordItem.ResubmitFlag) ? '#25AAE1' : '#fff')), fontWeight: 'bold'
                                                }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                }

                                {
                                    StatusId == 3 &&
                                    <View style={styles.btnWarp1}>
                                        {
                                            IsSubmitNewTrans &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Actions.pop()

                                                    Actions.DepositStack({
                                                        depositActive: recordItem.PaymentMethodId.toLocaleUpperCase(),
                                                        fromPage: 'transaction'
                                                    })
                                                }}
                                                style={[styles.btnStyle1]}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>ทำรายการใหม่</Text>
                                            </TouchableOpacity>
                                        }

                                        {
                                            // recordItem.ResubmitFlag || recordItem.IsSubmitNewTrans &&
                                            recordItem.ResubmitFlag &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        isShowModal: true
                                                    })

                                                    window.PiwikMenberCode('Deposit Nav', 'Click', 'Resubmit_Deposit_TransactionRecord')
                                                    //
                                                }}
                                                style={[styles.btnStyle1]}>
                                                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>ส่งการฝากเงินอีกครั้ง​</Text>
                                            </TouchableOpacity>
                                        }

                                        {
                                            IsContactCS &&
                                            <TouchableOpacity
                                                onPress={() => {


                                                    window.PiwikMenberCode('CS', 'Click', 'LiveChat_TransactionRecord')
                                                }}
                                                style={[styles.btnStyle1, { backgroundColor: IsSubmitNewTrans ? 'transparent' : '#25AAE1' }]}>
                                                <Text style={{ color: IsSubmitNewTrans ? '#25AAE1' : '#fff', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                }

                                {
                                    StatusId == 5 &&
                                    <View style={styles.btnWarp1}>
                                        {
                                            IsContactCS &&
                                            <TouchableOpacity
                                                onPress={() => {
                                                    Actions.LiveChat()

                                                    window.PiwikMenberCode('CS', 'Click', 'LiveChat_TransactionRecord')
                                                }}
                                                style={[styles.btnStyle1, { backgroundColor: IsSubmitNewTrans ? 'transparent' : '#25AAE1' }]}>
                                                <Text style={{ color: IsSubmitNewTrans ? '#25AAE1' : '#fff', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>

                                }
                            </View>

                        </View>
                    }

                    {
                        datailsType == "withdrawal" &&  //提款狀態
                        <View tyle={{ paddingHorizontal: 10, }}>
                            {
                                TotalTransactionCount > 1 && <View style={styles.styleView8}>
                                    <Text style={{ color: '#00AEEF', fontWeight: 'bold' }}>
                                        เพื่อปลอดภัย การทำธรุกรรมนี้จะถูกจ่ายไปยังบัญชีที่ผูกไว้ของคุณ
                                        <Text style={{ color: '#F0A800' }}> {recordItem.TotalTransactionCount}</Text> giao dịch.</Text>
                                </View>
                            }

                            {/* pending */}
                            {
                                (StatusId == 1 || StatusId == 7) &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={[styles.styleViewCircleCom1, { borderColor: '#25AAE1' }]}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#25AAE1', }]}></View>

                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: '#25AAE1' }}>{StatusId == 1 ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={[styles.styleView1, { backgroundColor: '#DDDDDD' }]}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView10}></View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#999999' : '#DBDBDB' }}>ดำเนินการ</Text>
                                    </View>

                                    <View style={[styles.styleView1, { backgroundColor: '#DDDDDD' }]}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView10}></View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#999999' : '#DBDBDB' }}>สำเร็จ</Text>
                                    </View>
                                </View>
                            }

                            {/* processing */}
                            {
                                (StatusId == 2 || StatusId == 3 || StatusId == 8 || StatusId == 9) &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>กำลังดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView5}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#F0A800', }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: '#F0A800' }}>รอดำเนินการ</Text>
                                        {
                                            TotalTransactionCount > 1 && <Text style={{ marginRight: 10, color: window.isBlue ? '#999999' : '#DBDBDB' }}>({SubTransactionCount} / {TotalTransactionCount})</Text>
                                        }
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView10}></View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#999999' : '#999999' }}>สำเร็จ</Text>
                                    </View>
                                </View>
                            }

                            {/* fail */}
                            {
                                StatusId == 5 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>กำลังดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>


                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>ดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView2}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#e30002', }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#E30000' : '#E30000' }}>ไม่สำเร็จ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.RejectedDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            }

                            {/* success */}
                            {
                                StatusId == 4 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>กำลังดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>


                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>ดำเนินการ</Text>
                                        {
                                            TotalTransactionCount > 1 && <Text style={{ marginRight: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>({SubTransactionCount} / {TotalTransactionCount})</Text>
                                        }
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={[styles.styleViewCircleCom1, { borderColor: '#21DB00' }]}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#21DB00' }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#21DB00' : '#21DB00' }}>สําเร็จ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.ApprovedDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            }



                            {/* cancel */}
                            {
                                StatusId == 6 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>กำลังดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>ดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView2}>
                                            <View style={[styles.styleViewCircleCom2, { backgroundColor: '#e30002', }]}></View>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#E30000' : '#E30000' }}>ยกเลิก</Text>
                                        <Text style={{ color: window.isBlue ? '#999999' : '#DBDBDB' }}>{moment(recordItem.RejectedDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>
                                </View>
                            }


                            {
                                StatusId === 10 &&
                                <View>
                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#999999' : '#DBDBDB' }}>กำลังดำเนินการ</Text>
                                        <Text style={{ color: window.isBlue ? '#58585B' : '#DBDBDB' }}>{moment(recordItem.SubmittedAt).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <View style={styles.styleView6}>
                                            <Text style={styles.styleView7}>✓</Text>
                                        </View>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#999999' : '#DBDBDB' }}>ดำเนินการ</Text>
                                        {
                                            TotalTransactionCount > 1 && <Text style={{ marginRight: 10, color: window.isBlue ? '#58585B' : '#DBDBDB' }}>({SubTransactionCount} / {TotalTransactionCount})</Text>
                                        }

                                        <Text style={{ color: window.isBlue ? '#58585B' : '#DBDBDB' }}>{moment(recordItem.ProcessingDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <View style={styles.styleView1}></View>

                                    <View style={styles.styleView9}>
                                        <Image
                                            source={require('./../../../images/finance/record/bufen.png')}
                                            resizeMode='stretch'
                                            style={{ width: 22, height: 22 }}
                                        ></Image>
                                        <Text style={{ marginHorizontal: 10, color: window.isBlue ? '#21DB00' : '#21DB00' }}>สำเร็จบางส่วน</Text>
                                        <Text style={{ color: window.isBlue ? '#58585B' : '#DBDBDB' }}>{moment(recordItem.ApprovedDatetime).format('DD-MM-YYYY HH:mm')}</Text>
                                    </View>

                                    <Text style={{ marginTop: 40, color: window.isBlue ? '#58585B' : '#fff' }}>ยอดเงินถูกคืนเข้าที่บัญชีหลักเรียบร้อย</Text>
                                </View>
                            }

                            {//新參數告知用戶當前狀態  
                                ReasonMsg != "" && <Text style={{ color: window.isBlue ? '#000' : '#B3B3B3', lineHeight: 20, marginTop: 10 }}>
                                    {ReasonMsg}
                                </Text>
                            }


                            {/* pending */}
                            {
                                StatusId == 1 &&
                                <View style={styles.btnWarp1}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                isCancleMOdal: true
                                            })

                                            window.PiwikMenberCode('Transaction Record', 'Click', `Cancel_Withdraw_TransactionRecord`)
                                        }}
                                        style={[styles.btnStyle1]}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>ยกเลิกการถอน</Text>
                                    </TouchableOpacity>

                                    {
                                        IsUploadDocument &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                Actions.jump('Uploadfile')
                                                window.PiwikMenberCode('Transaction Record', 'Click', `UploadDoc_Withdraw_TransactionRecord`)
                                            }}
                                            style={[styles.btnStyle1, { backgroundColor: 'transparent' }]}>
                                            <Text style={{ color: '#25AAE1', fontWeight: 'bold' }}>อัปโหลดเอกสาร </Text>
                                        </TouchableOpacity>
                                    }

                                    {
                                        IsContactCS &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                Actions.LiveChat()

                                                window.PiwikMenberCode('CS', 'Click', 'LiveChat_TransactionRecord')
                                            }}
                                            style={[styles.btnStyle1, { backgroundColor: 'transparent' }]}>
                                            <Text style={{ color: '#25AAE1', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                        </TouchableOpacity>
                                    }

                                </View>
                            }

                            {/* processing */}
                            {
                                (StatusId == 2 || StatusId == 3 || StatusId == 7 || StatusId == 8 || StatusId == 9) &&
                                <View style={styles.btnWarp1}>
                                    {
                                        IsContactCS &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                Actions.LiveChat()

                                                window.PiwikMenberCode('CS', 'Click', 'LiveChat_TransactionRecord')
                                            }}
                                            style={[styles.btnStyle1, { backgroundColor: '#25AAE1' }]}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            }

                            {/* fail */}
                            {
                                (StatusId == 5) &&
                                <View style={styles.btnWarp1}>
                                    {
                                        IsSubmitNewTrans && <TouchableOpacity
                                            onPress={() => {
                                                Actions.pop()

                                                Actions.WithdrawalsStack({
                                                    depositActive: recordItem.PaymentMethodId.toLocaleUpperCase(),
                                                    fromPage: 'transaction'
                                                })
                                            }}
                                            style={[styles.btnStyle1]}>
                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>ทำรายการใหม่</Text>
                                        </TouchableOpacity>
                                    }

                                    {
                                        IsContactCS &&
                                        <TouchableOpacity
                                            onPress={() => {
                                                Actions.LiveChat()

                                                window.PiwikMenberCode('CS', 'Click', 'LiveChat_TransactionRecord')
                                            }}
                                            style={[styles.btnStyle1, { backgroundColor: IsSubmitNewTrans ? 'transparent' : '#25AAE1' }]}>
                                            <Text style={{ color: IsSubmitNewTrans ? '#25AAE1' : '#fff', fontWeight: 'bold' }}>ติดต่อเจ้าหน้าที่ฝ่ายบริการ</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            }
                        </View>
                    }
                </View>
            </ScrollView>
        </View>
    }
}

export default RecordsManualDeposit = connect(
    (state) => {
        return {
            memberInforData: state.memberInforData,
        }
    }, (dispatch) => {
        return {
            changeDepositTypeAction: (data) => dispatch(changeDepositTypeAction(data)),
            getMemberInforAction: () => dispatch(getMemberInforAction()),
        }
    }
)(RecordsManualDepositContainer)

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
    },
    modalContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, .6)'
    },
    modalBox: {
        backgroundColor: '#EFEFEF',
        borderRadius: 6,
        width: width * .9,
        overflow: 'hidden'
    },
    modalTop: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#25AAE1',
        width: width * .9
    },
    modalTopText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    modalBody: {
        paddingTop: 20,
        paddingBottom: 15,
        paddingHorizontal: 15
    },
    modalBtnBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    modalBtn: {
        height: 38,
        width: (width * .9 - 30) / 2.1,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    modalBtnText: {
        fontWeight: 'bold',
        color: '#58585B'
    },
    manualDepositText: {
        lineHeight: 22,
    },
    deposiBanktList: {
        backgroundColor: '#fff',
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 55,
        paddingHorizontal: 5,
        justifyContent: 'center',
        borderTopWidth: 1,
    },
    showdetailTextA: {
        marginTop: 5, marginBottom: 5,
    },
    showdetailText: {
        borderRadius: 4,
        marginTop: 5, marginBottom: 5, backgroundColor: '#F0F0F0', paddingTop: 8, paddingBottom: 8, paddingLeft: 10
    },
    gogostyle: {
        backgroundColor: '#14ADF0',
        borderRadius: 120000000,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
    },
    btnWarp1: {
        marginTop: 20
    },
    btnStyle1: {
        height: 40,
        width: (width - 20),
        alignItems: 'center',
        backgroundColor: '#25AAE1',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#25AAE1',
        borderRadius: 6,
        marginBottom: 10
    },
    styleView1: {
        backgroundColor: '#58585b', width: 2, height: 40, marginVertical: 6, marginLeft: 10
    },
    styleView2: {
        width: 22, height: 22, borderRadius: 1000, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e30002'
    },
    styleView5: {
        width: 22, height: 22, borderRadius: 1000, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F0A800'
    },
    styleView6: {
        width: 22,
        height: 22,
        borderRadius: 1000,
        backgroundColor: '#58585b',
        alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#58585b'
    },
    styleView7: {
        color: '#fff', fontWeight: 'bold', fontSize: 16
    },
    styleView8: {
        backgroundColor: '#00AEEF14', borderColor: '#00AEEF80', padding: 10, borderWidth: 1, borderRadius: 6, marginBottom: 15
    },
    styleView9: {
        flexDirection: 'row', alignItems: 'center'
    },
    styleView10: {
        width: 22,
        height: 22,
        borderRadius: 1000,
        backgroundColor: '#DDDDDD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    styleViewCircleCom1: {
        width: 22,
        height: 22,
        borderRadius: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    styleViewCircleCom2: {
        width: 12,
        height: 12,
        borderRadius: 10000
    }
})