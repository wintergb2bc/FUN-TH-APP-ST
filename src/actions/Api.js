import { Platform } from 'react-native'
window.userNameDB = ''//
window.userLogin = false//
window.userPassword = ''//
window.UpdateV = 1000   // 強制關閉版本
window.FUN88Version = '1.0.5.2' //版本號 
window.isGameLock = false
window.E2Backbox = 'No dataBase '// 黑盒子
window.Iovation = 'No dataBase '// 黑盒子
window.affCodeKex = '' //代理號
window.DeviceSignatureBlackBox = ''
window.LoginEntryTXT = ''
window.noFastLogin = false//点击退出不能快速登录
window.DeviceInfoIos = true//ios手机型号是没有指纹的
window.isFastImage = !true
window.sprStatus = {
	isComingSoon: false,
	isNew: true,
}
window.Devicetoken = ''
window.isReSqrFlag = false
window.isBannerReSqrFlag = false

window.isShowRestrictedPage = false
window.UmPma = false /// 給友盟推送近PMA 如未登錄 先登錄後跳進PMA by benji

window.gameLoadInfor = {}
window.mainPageIndex = 0

window.isSTcommon_url = false

window.isBlue = true//蓝色皮
window.TXTColor = '#000'//字体颜色
window.BGColor = '#fff'//背景颜色
window.NAVBGColor = '#00aeef'//导航栏背景颜色

window.memberCode = ''
window.IM_Token = ''
window.IM_MemberCode = ''
window.loginStatus = ''
window.IMBetCartdata = []//投注主单
window.BetMore = false
window.VendorData = ''//当前的Vendor，
window.lowerV = 'IM'//当前游戏
window.notificationInfo = ''//游戏推送
window.notificationRecommend = ''//消息推送
global.Toasts = ''
window.GameListNum = 0//游戏个数
window.EuroViewHeight = 0
window.isMobileOpen=true
window.SBRecommendCheckDone=false
window.isSuperCert = true
window.regWebsite = Platform.OS === 'android' ? 16 : (
	isSuperCert ? 17 : 34
)
window.appId = Platform.OS === 'android' ? 'net.funpodium.fun88.thb' : (
	isSuperCert ? 'com.letf1go.nativeapp.thb' : 'com.letf1go.nativeapp.thb.EPuser'
)
window.isSBFlag=false
window.ApiPort = ({
	'Token': null, // 用戶token
	'ReToken': null,//用戶retoken
	'LogoutTokey': '',
	'access_token': '',
	'UserLogin': false,//用戶登錄狀態
	'login': '/api/Login?', //獲取登入地址  POST
	'logout': '/api/Member/Logout?', //登出    POST 
	'PostToken': '/get/token?',

	// App
	'GetRewardURLs': '/api/App/RewardURLs?',
	'GetAppURLs': '/api/App/URLs?',

	// LiveChat
	'LiveChat': '/api/LiveChat/Url?', //克服

	//Notification
	'NotificationOne': '/api/Notification?',  //POST 第一次開app 註冊友盟個推
	'PostNotificationSend': '/api/Notification/Send?',

	// Games
	'Game': '/api/Games/',//遊戲
	'Sequence': '/api/Games/Sequence?',
	'AllProviders': '/api/Games/AllProviders?',
	'GetAllGameCategories': '/api/Games/GetAllGameCategories?',
	'RecommendedGameList': '/api/Games/RecommendedGameList?',
	'SetRecentPlayedGame': '/api/Games/SetRecentPlayedGame?',
	'GetMaintenanceStatus': '/api/Games/Navigation/MaintenanceStatus?',
	// CMS
	'Banner': '/api/CMS/Banners?',   //banner 數據 Get 
	'Promotions': '/api/CMS/Promotions', // 活動  GET
	'PromotionCategories': '/api/CMS/PromotionCategories?',// 活動類別
	'PromotionsPost': '/api/CMS/Promotions/Applications',  // 申請活動
	'Promotion': '/api/CMS/Promotion', // 活動內容 GET
	'GetFreeBet': '/api/CMS/FreeBet?',
	'GetProfileMasterData': '/api/ProfileMasterData?',
	'GetPromotionSummary': '/api/CMS/PromotionSummary?',
	'GetDailyDealsPromotion': '/api/CMS/DailyDealsPromotion?',
	'GetDailyDealsBonusRuleInfo': '/api/CMS/DailyDealsBonusRuleInfo?',
	'GetDailyDealsHistory': '/api/CMS/DailyDealsHistory?',
	'GetPromotionsApplications': '/api/CMS/Promotions/Applications?',
	'GetRebateApprovedList': '/api/CMS/RebateApprovedList?',
	'PostApplyDailyDeals': '/api/CMS/ApplyDailyDeals?',
	'DeleteShippingAddress': '/api/DailyDeals/ShippingAddress/',
	'GetCalculateBonusTurnOver': '/api/CMS/CalculateBonusTurnOver?',
	'GetLeaderboard': '/api/CMS/Leaderboard?',

	// PersonalMessage
	'GetInboxMessages': '/api/PersonalMessage/InboxMessages?',
	'GetInboxMessageIndividualDetail': '/api/PersonalMessage/InboxMessageIndividualDetail?',
	'PatchActionOnInboxMessage': '/api/PersonalMessage/ActionOnInboxMessage?',

	// Announcement
	'GetAnnouncements': '/api/Announcement/Announcements?',
	'GetAnnouncementIndividualDetail': '/api/Announcement/AnnouncementIndividualDetail?',
	'PatchActionOnAnnouncement': '/api/Announcement/ActionOnAnnouncement?',

	// Verification
	'GetEmailVerifyCode': '/api/Member/Email/Verify?',
	'PostEmailVerifyTac': '/api/Member/Email/VerifyTac?',
	'GetPhoneVerifyCode': '/api/Member/Phone/Verify?',
	'PostPhoneVerifyCode': '/api/Member/Phone/TAC?',
	'ForgetPassword': '/api/Member/Email/ForgetPasswordByEmail',
	'PostVerification': '/api/Verification?',
	'GetVerification': '/api/Verification?',
	'GetImageDataFromAWS': '/api/Verification/getImageDataFromAWS?',
	'GetCDUActivate': '/api/Verification/getCDUActivate?',
	'GetDocumentApprovalStatus': '/api/Verification/getDocumentApprovalStatus?',
	'PostInsertNewAccountHolderName': '/api/Verification/InsertNewAccountHolderName?',
	'GetVerificationAttempt': '/api/Member/VerificationAttempt?',

	// DailyDeals
	'GetShippingAddress': '/api/DailyDeals/ShippingAddress?',
	'GetProvince': '/api/DailyDeals/Province?',
	'GetDistrict': '/api/DailyDeals/District?',
	'GetTown': '/api/DailyDeals/Town?',
	'ChangeShippingAddress': '/api/DailyDeals/ShippingAddress?',

	// BIAPI
	'GetMemberDailyTurnover': '/api/BIAPI/MemberDailyTurnover?',

	//ProfileMasterData
	'GetProfileMasterData': '/api/ProfileMasterData?',

	// member
	'MemberRestricted': '/api/Member/MemberRestricted?',
	'GetGamePreference': '/api/Member/GetGamePreference?',
	'PostSetGamePreference': '/api/Member/SetGamePreference?',
	'GetCheckMemberLogin': '/api/Member/CheckMemberLogin?',
	'GETSelfExclusions': '/api/Member/GetSelfExclusionRestriction?',
	'PUTSelfExclusions': '/api/Member/SelfExclusions?',
	'NewsNotifications': '/api/Member/Notifications', // 存提款 紅利消息存款消息类别 1,2  提款 类别 3,4  红利 5 , 6, 7, 8
	'Password': '/api/Member/Password',
	'Member': '/api/Member?',  // 會員數據 Get 
	'ForgetUsername': '/api/Member/ForgetUsernameByEmail',  //忘記用戶名
	'REForgetPassword': '/api/Member/ForgetPassword',  //忘記密碼回調更改
	'Statistics': '/api/Member/Statistics', //消息點擊
	'PostConfiscatedMemberVerification': '/api/Member/ConfiscatedMemberVerification?',
	'KYCVerification': '/api/Verification/',
	'PostSetFreeBetWallet': '/api/Member/SetFreeBetWallet?',
	'PostPasscodeGenerate': '/api/Member/Passcode/Generate?',
	'PostWelcomeCall': '/api/Member/WelcomeCall?',

	// Balance
	'Balance': '/api/Balance?', //獲取錢包餘額  Get

	// Payment
	'Payment': '/api/Payment/Methods',//充值
	'PaymentDetails': '/api/Payment/Methods/Details', //充值細節
	'PaymentSettings': '/api/Payment/Methods/Settings?',//個別充值渠道規則
	'PaymentApplications': '/api/Payment/Applications?', //付款
	'PaymentApplications1': '/api/Payment/Applications', //付款
	'GopayLB': '/api/Payment/Applications/',  //本銀 在線支付 完成請求
	'MemberBanks': '/api/Payment/MemberBanks?',//用戶銀行卡
	'GetmemberBanksTransactionHistory': '/api/Payment/MemberBanks/TransactionHistory?',
	'PostBindReverseDepositAccount': '/api/Payment/BindReverseDepositAccount?',
	'GetEWalletAccountQRURL': '/api/Payment/EWalletAccountQRURL?',
	'POSTNoCancellation': '/api/Payment/Applications/', //提款記錄取消
	'GetMemberBanks': '/api/Payment/MemberBanks',
	'PATCHMemberBanksDefault': '/api/Payment/MemberBanks/',
	'DELETEMemberBanksDefault': '/api//Payment/MemberBanks/',
	'CheckIsExpressDepositBank': '/api/Payment/MemberBanks/CheckIsExpressDepositBank',
	'GetBankMaintenanceInfo': '/Payment/Banks/GetBankMaintenanceInfo?',
	'GetResubmitOnlineDepositDetails': '/api/Payment/Transactions/GetResubmitDepositDetails?',
	'CreateResubmitOnlineDeposit': '/api/Payment/Transactions/CreateResubmitOnlineDeposit?',
	'BankingHistory': '/api/Payment/Applications/BankingHistory?',
	'PostMemberRequestDepositReject': '/api/Payment/Applications/MemberRequestDepositReject?',
	'UploadAttachment': '/api/Payment/Applications/UploadAttachment?', //上傳圖片交易紀錄更新訊息
	'GetTransactionHistory': '/api/Payment/Transactions/GetTransactionHistory',//查詢詳細交易紀錄
	'merchants': '/api/merchants/',
	'GetSuggestedAmount': '/api/Payment/SuggestedAmount?', // 推荐金额
	'GetDepositAccountByAmount': '/api/Payment/DepositAccountByAmount?',
	'UpdateMemberBankAccount': '/api/Payment/UpdateMemberBankAccount?',
	"getWithdrawalVerificationSetting": '/api/Payment/getWithdrawalVerificationSetting?',

	// Transfer
	'Transfer': '/api/Transfer/Applications?',//轉帳
	'TransferApplicationsByDate': '/api/Transfer/ApplicationsByDate',//轉賬紀錄
	'Wallets': '/api/Transfer/Wallets?', //獲取目標帳戶 
	'WalletProviderMapping': '/api/Transfer/WalletProviderMapping?', //獲取目標帳戶 

	// Bonus
	'PostClaim': '/api/Bonus/Claim',//優惠申請
	'BonusApplications': '/api/Bonus/Applications', //優惠歷史
	'Bonus': '/api/Bonus',// 存款主賬優惠
	'BonusCalculate': '/api/Bonus/Calculate?',//存款轉帳優惠 檢測 
	'GetApplicationsByDate': '/api/Bonus/ApplicationsByDate?',
	'PostCancelPromotion': '/api/Bonus/CancelPromotion?',
	'PostApplications': '/api/Bonus/Applications?',
	'CheckServingPreBonus': '/api/Bonus/CheckServingPreBonus?',

	// PT
	'GETCheckVendor': '/api/Vendor/PT?',
	'PUTPTChangePWD': '/api/Vendor/PT/Password?redirectUrl=' + common_url,
	'PTUSERNAME': '/api/Vendor/PT/Username?username=',

	// IPK
	'GETCheckVendorIpk': '/api/Vendor/IPK?',
	'GetSetting': '/api/Setting',


	//SosBonus
	'GetSosBonus': '/api/SosBonus?',
	'ChangeSosBonusApplications': '/api/SosBonus/Applications?',
	'PostSosBonusVerifications': '/api/SosBonus/Verifications?',


	//Validation
	'GetValidation': '/api/Validation?validationType=',

	'GetQueleaActiveCampaign': '/api/Quelea/GetQueleaActiveCampaign?',
	'GetQueleaReferrerInfo': '/api/Quelea/GetQueleaReferrerInfo?',
	'GetQueleaReferrerEligible': '/api/Quelea/ReferrerEligible?',
	'PostQueleaReferrerSignUp': '/api/Quelea/ReferrerSignUp?',
	'GetQueleaReferreeTaskStatus': '/api/Quelea/ReferreeTaskStatus?',
	'GetQueleaReferrerActivity': '/api/Quelea/ReferrerActivity?',
	'GetQueleaReferreeList': '/api/Quelea/ReferreeList?',
	'PostThroughoutVerification': '/api/Quelea/ThroughoutVerification?',


	'GetMiniGames': '/api/MiniGames?',
	'GetMiniGamesBanners': '/api/MiniGames/Banners?',
	'MiniGames': '/api/MiniGames/',


	GetIMToken: '/api/Vendor/IPSB/Token?',
	GETSBTToken: '/api/Vendor/SBT/Token?', //BTI舊版
	GETBTIToken: '/api/Vendor/BTI/Token?', //BTI新版
	GETBalanceSB: '/api/Balance?wallet=SB&',
	GetProvidersMaintenanceStatus: '/api/Games/GetProvidersMaintenanceStatus?',
	NotifyBettingInfo: '/api/Vendor/NotifyBettingInfo?',

	// 欧洲杯
	getEuroTeamStat: '/api/v1.0/brands/FUN88/teams/stats?', // 球队数据
	getEuroGroupList: '/api/v1.0/brands/FUN88/groups?', // 球队排名
	getEuroPlayer: '/api/v1.0/brands/FUN88/players/stats/',// 球员数据
	'PostVoiceMessageVerify': '/api/Member/VoiceMessage/Verify?',
	'PostVoiceMessageTAC': '/api/Member/VoiceMessage/TAC?',



	GetTeamsWC22: '/api/ProfileMasterData/TeamsWC22?',
	PostTeamPreferencesWC22: '/api/Member/TeamPreferencesWC22?',
	GetCustomFlag: '/api/Member/CustomFlag?',
	GetWorldCupBanner: '/api/v1/app/webbanners/position/',
	GetWorldCupNews: '/api/v1/news',
	GetWC22Deeplink: '/api/News/WC22Deeplink'

})