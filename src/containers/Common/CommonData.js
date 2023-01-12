import { StyleSheet, Dimensions, Platform } from 'react-native'
const { width, height } = Dimensions.get('window')

export const DatePickerLocale = {
    DatePickerLocale: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: ''
    },
    okText: 'Xác nhận',
    dismissText: 'Hủy'
}


export const ListItemstyles = {}

export const DepositDatas = [
    {
        title: 'ฝากเงิน',
        router: 'deposit',
        img: require('./../../images/common/financeIcon/deposit.png'),
        img1: require('./../../images/common/financeIcon/deposit1.png'),
        piwikMenberText1: 'Deposit_homepage',
        piwikMenberText2: 'Deposit_profile'
    },
    {
        title: 'โอนเงิน',
        router: 'transfer',
        img: require('./../../images/common/financeIcon/transfer.png'),
        img1: require('./../../images/common/financeIcon/transfer1.png'),
        piwikMenberText1: 'Transfer_homepage',
        piwikMenberText2: 'Transfer_profile'
    },
    {
        title: 'ถอนเงิน',
        router: 'withdrawal',
        img: require('./../../images/common/financeIcon/withdrawal.png'),
        img1: require('./../../images/common/financeIcon/withdrawal1.png'),
        piwikMenberText1: 'Withdraw_homapge',
        piwikMenberText2: 'Withdraw_profile'
    }
]

export const IphoneXMax = ['iPhone 5', 'iPhone 5s', 'iPhone 6', 'iPhone 6s', 'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8', 'iPhone 8 Plus', 'iPhone SE']

export const ImgPermissionsText = Platform.OS == 'ios' ? `โปรดอนุญาตให้เข้าถึงรูปภาพใน iphone ที่ตั้งค่า > ความเป็นส่วนตัว > รูปภาพ ตกลง` : 'โปรดอนุญาตในการเข้าถึงกล้องถ่ายรูปในโทรศัพท์ของคุณที่ การตั้งค่า > การจัดการแอปพลิเคชัน > แอป FUN88 > การอนุญาต'

export const ImagePickerOption = {
    title: 'Chọn hình', //TODO:CN-DONE 选择图片
    cancelButtonTitle: 'Hủy', //TODO:CN-DONE 取消
    chooseFromLibraryButtonTitle: 'Chọn hình', //TODO:CN-DONE 选择图片
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    //durationLimit: 10,
    // maxWidth: 6000000,
    // maxHeight: 6000000,
    // quality: 1,
    // angle: 0,
    allowsEditing: false,
    noData: false,
    storageOptions: {
        skipBackup: true
    },
    includeBase64: true,
    saveToPhotos: true
}

export const SelectTimeText = 'ไม่พบข้อมูล'
export const NoRecordText = 'ไม่พบข้อมูล'

export const GameLockText = 'เรียนท่านสมาชิก เนื่องจากเราพบความผิดปกติในบัญชีของคุณ เราจึงไม่สามารถให้บริการคุณได้ชั่วคราว ถ้าคุญมีคำถามเพิ่มเติม โปรดติดต่อเจ้าหน้าที่บริการลูกค้า' // 尊敬的用户，由于您账号存在异常，暂时不能为您提供服务，如有疑问，请联系客服
export const GameMaintenanceText = 'เรียนท่านสมาชิกเกม ที่คุณเปิดอยู่ระหว่างการปรับปรุง โปรดเข้าเกมอีกครั้งในภายหลัง หากคุณมีคำถามใด ๆ โปรดติดต่อแชทสดของเรา' // 亲爱的竞博会员您所打开的游戏正在维护中，请稍后再尝试进入。若您有任何疑问，请联系我们的在线客服。