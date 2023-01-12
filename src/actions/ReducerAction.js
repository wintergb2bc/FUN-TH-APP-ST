import debounce from 'debounce'
import Toast from '@/containers/Toast'
import { Actions } from 'react-native-router-flux'

const BalanceColor = {
    // TOTALBAL: '#dcdcdc',//
    // MAIN: '#DCDCDC',//
    // SBT: '#c1e0ff',//
    // SP: '#c1e0ff',//
    // IPSB: '#c1e0ff',//
    // CMD: '#c1e0ff',//
    // SB: '#c1e0ff',//
    // LD: '#96D8A4',//
    // AG: '#96D8A4',
    // SLOT: '#F5E496',//
    // PT: '#F5E496',
    // IMOPT: '#FFBD51',
    // IPK: '#ae96f6',
    // SLC: '#E85668',
    // KENO: '#E85668',
    // P2P: '#AD95F5',
    // FISH: '#FFBD51',
    MAIN: '#DCDCDC',
    SB: '#85C1F9',
    CMD: '#85C1F9',
    LD: '#1CBD64',
    AG: '#1CBD64',
    SLOT: '#FFBD51',
    FISH: '#FFBD51',
    IMOPT: '#FFBD51',
    P2P: '#AD95F5',
    KENO: '#E85668',
    SLC: '#E85668'
}

export const getLoginMemberInforAction = (data) => {
    return (dispatch, getState) => {
        return dispatch({ type: 'MEMBERINFORACTION', data })
    }
}

export const getMemberInforAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'MEMBERINFORACTIONSTORAGE',
            id: 'MEMBERINFORACTIONSTORAGE'
        }).then(data => {
            dispatch({ type: 'MEMBERINFORACTION', data })
        }).catch(() => { })
        fetchRequest(ApiPort.Member, 'GET').then(res => {
            if (res.isSuccess) {
                let freeBetStatus = res.result.freeBetStatus
                let memberInfo = res.result.memberInfo
                if (freeBetStatus) {
                    memberInfo.freeBetStatus = freeBetStatus
                } else {
                    // memberInfo.freeBetStatus = {
                    //   eligible: true
                    // }  // test
                }
                global.storage.save({
                    key: 'MEMBERINFORACTIONSTORAGE',
                    id: 'MEMBERINFORACTIONSTORAGE',
                    data: memberInfo,
                    expires: null
                })
                // memberInfo.PreferWallet = 'SLOT'
                return dispatch({ type: 'MEMBERINFORACTION', data: memberInfo })
            } else {
                return dispatch({ type: 'MEMBERINFORACTION', data: {} })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

export const getBalanceInforAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'BALANCEINFORACTIONSTORAGE',
            id: 'BALANCEINFORACTIONSTORAGE'
        }).then(data => {
            dispatch({ type: 'BALANCEINFORACTION', data })
        }).catch(() => { })
        fetchRequest(ApiPort.Balance, 'GET').then(res => {
            if (Array.isArray(res) && res.length) {
                let balanceList = res
                balanceList.forEach(v => {
                    v.color = BalanceColor[v.name.toLocaleUpperCase()] ? BalanceColor[v.name.toLocaleUpperCase()] : '#DCDCDC'
                    v.name = v.name.toLocaleUpperCase()
                    v.state = v.state.toLocaleUpperCase()
                })
                global.storage.save({
                    key: 'BALANCEINFORACTIONSTORAGE',
                    id: 'BALANCEINFORACTIONSTORAGE',
                    data: balanceList,
                    expires: null
                })
                return dispatch({ type: 'BALANCEINFORACTION', data: balanceList })
            } else {
                return dispatch({ type: 'BALANCEINFORACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

export const getWalletsInforAction = () => {
    return (dispatch, getState) => {
        fetchRequest(ApiPort.Wallets, 'GET').then(res => {
            if (res.isSuccess) {
                return dispatch({ type: 'WALLETSINFORACTION', data: res.walletListingResponses })
            } else {
                return dispatch({ type: 'WALLETSINFORACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

export const changeDepositTypeAction = (type) => {
    Actions.jump('Finance')
    return (dispatch, getState) => {
        return dispatch({ type: 'DEPOSITYPE', data: type })
    }
}

export const changeHomeLiveChatIncognitoAction = (data) => {
    return (dispatch, getState) => {
        return dispatch({ type: 'LIVECHATINCOGNITO', data })
    }
}

export const changeHomeRegistLoginModalAction = (data) => {
    return (dispatch, getState) => {
        return dispatch({ type: 'HOMEREGISTLOGINMODAL', data })
    }
}

export const changeBonusTurnOverInfor = (bonusTurnOverInfor) => {
    return (dispatch, getState) => {
        return dispatch({ type: 'BONUSTURNOVERINFOR', data: bonusTurnOverInfor })
    }
}

export const changePromotionIndexAction = (type) => {
    Actions.jump('promotionLogin')
    return (dispatch, getState) => {
        return dispatch({ type: 'PROMOTIONINDEX', data: type })
    }
}

const getNewsStatisticsActionDebounce = debounce((dispatch, flag, unreadCounts) => {
    if (flag == 4) {
        let { unreadTransactionCounts, unreadPersonalMessageCounts, unreadAnnouncementCounts } = unreadCounts
        return dispatch({
            type: 'NEWSSTATISTICS', data: {
                totalNew: unreadTransactionCounts + unreadPersonalMessageCounts + unreadAnnouncementCounts,
                unreadTransactionCounts,
                unreadPersonalMessageCounts,
                unreadAnnouncementCounts
            }
        })
    } else {
        let tempArr = []
        let tempIndex = 0
        let requestsArr = [
            {
                key: 'UnreadTransactionCounts',
                flag: 2
            },
            {
                key: 'UnreadPersonalMessageCounts',
                flag: 1
            },
            {
                key: 'UnreadAnnouncementCounts',
                flag: 3
            }
        ]
        let tempRequests = flag === 'all' ? requestsArr.map(v => v.key) : requestsArr.filter(v => v.flag == flag).map(v => v.key)
        let requests = tempRequests.map(v => fetchRequest(ApiPort.Statistics + '?key=' + v + '&', 'GET'))
        Promise.all(requests).then(res => {
            if (res.length) {
                if (flag != 'all') {
                    tempIndex = requestsArr.findIndex(v => v.flag == flag)
                    tempArr[tempIndex] = res[0]
                }
                let [
                    unreadTransactionCounts = unreadCounts.unreadTransactionCounts,
                    unreadPersonalMessageCounts = unreadCounts.unreadPersonalMessageCounts,
                    unreadAnnouncementCounts = unreadCounts.unreadAnnouncementCounts
                ] = (flag === 'all' ? res : tempArr).map(v => v.statistics)
                return dispatch({
                    type: 'NEWSSTATISTICS', data: {
                        totalNew: unreadTransactionCounts + unreadPersonalMessageCounts + unreadAnnouncementCounts,
                        unreadTransactionCounts,
                        unreadPersonalMessageCounts,
                        unreadAnnouncementCounts
                    }
                })
            }
        })
    }
}, 500)

export const getNewsStatisticsAction = (flag, unreadCounts) => {
    return (dispatch, getState) => {
        getNewsStatisticsActionDebounce(dispatch, flag, unreadCounts)
    }
}

export const getStateRouterNameAction = (data) => {
    return (dispatch, getState) => {
        return dispatch({ type: 'STATEROUTERNAME', data })
    }
}

export const getSelfExclusionsAction = (flag) => {
    return (dispatch, getState) => {
        if (flag) {
            return dispatch({ type: 'SELFEXCLUSIONSACTION', data: {} })
        } else {
            fetchRequest(ApiPort.GETSelfExclusions, 'GET').then(res => {
                if (res.isSuccess) {
                    return dispatch({ type: 'SELFEXCLUSIONSACTION', data: res.result || {} })
                }
            }).catch((err) => {
                Toast.hide()
            })
        }
    }
}

export const getPromotionListInforAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'PromotionLists',
            id: 'PromotionLists'
        }).then(data => {
            dispatch({ type: 'PROMOTIONLISTINFORACTION', data })
        }).catch(() => { })
        fetchRequest(ApiPort.Promotions + '?promoCategory=&', 'GET').then(res => {
            if (Array.isArray(res) && res.length) {
                let promotionList = res
                global.storage.save({
                    key: 'PromotionLists',
                    id: 'PromotionLists',
                    data: promotionList,
                    expires: null
                })
                return dispatch({ type: 'PROMOTIONLISTINFORACTION', data: promotionList })
            } else {
                return dispatch({ type: 'PROMOTIONLISTINFORACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}


export const getQueleaActiveCampaignInforAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'QueleaActiveCampaign',
            id: 'QueleaActiveCampaign'
        }).then(data => {
            dispatch({ type: 'QUELEAACTIVECAMPAIGNINFORACTION', data })
        }).catch(() => {
            dispatch({ type: 'QUELEAACTIVECAMPAIGNINFORACTION', data: {} })
        })

        fetchRequest(ApiPort.GetQueleaActiveCampaign, 'GET').then(res => {
            if (res.isSuccess) {
                let queleaActiveCampaign = res.result
                global.storage.save({
                    key: 'QueleaActiveCampaign',
                    id: 'QueleaActiveCampaign',
                    data: queleaActiveCampaign,
                    expires: null
                })
                return dispatch({ type: 'QUELEAACTIVECAMPAIGNINFORACTION', data: queleaActiveCampaign })
            } else {
                global.storage.save({
                    key: 'QueleaActiveCampaign',
                    id: 'QueleaActiveCampaign',
                    data: {},
                    expires: null
                })
                return dispatch({ type: 'QUELEAACTIVECAMPAIGNINFORACTION', data: {} })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

export const getFreeBetInforAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'FreeBetInforAction',
            id: 'FreeBetInforAction'
        }).then(data => {
            dispatch({ type: 'FREEBETINFORACTION', data })
        }).catch(() => {
            dispatch({ type: 'FREEBETINFORACTION', data: {} })
        })

        fetchRequest(ApiPort.GetFreeBet, 'GET').then(res => {
            if (res.isSuccess) {
                global.storage.save({
                    key: 'FreeBetInforAction',
                    id: 'FreeBetInforAction',
                    data: res,
                    expires: null
                })
                return dispatch({ type: 'FREEBETINFORACTION', data: res })
            } else {
                global.storage.save({
                    key: 'FreeBetInforAction',
                    id: 'FreeBetInforAction',
                    data: {},
                    expires: null
                })
                return dispatch({ type: 'FREEBETINFORACTION', data: {} })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

export const getWithdrawalUserBankAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'withdrawalsUserBank',
            id: 'withdrawalsUserBank'
        }).then(data => {
            dispatch({ type: 'WITHDRAWALUSERBANKACTION', data })
        }).catch(() => {
            dispatch({ type: 'WITHDRAWALUSERBANKACTION', data: [] })
        })

        fetchRequest(ApiPort.GetMemberBanks + '?AccountType=Withdrawal&', 'GET').then(res => {
            if (Array.isArray(res)) {
                let withdrawalsBank = res

                let defaultBank = withdrawalsBank.find(v => v.IsDefault)
                if (defaultBank) {
                    let defaultBankIndex = withdrawalsBank.findIndex(v => v.IsDefault)
                    withdrawalsBank.splice(defaultBankIndex, 1)
                    withdrawalsBank.unshift(defaultBank)
                }

                global.storage.save({
                    key: 'withdrawalsUserBank',
                    id: 'withdrawalsUserBank',
                    data: withdrawalsBank,
                    expires: null
                })
                return dispatch({ type: 'WITHDRAWALUSERBANKACTION', data: withdrawalsBank })
            } else {
                global.storage.save({
                    key: 'withdrawalsUserBank',
                    id: 'withdrawalsUserBank',
                    data: [],
                    expires: null
                })
                return dispatch({ type: 'WITHDRAWALUSERBANKACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

export const getDepositUserBankAction = (depositBank) => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'depositUserBank',
            id: 'depositUserBank'
        }).then(data => {
            dispatch({ type: 'DEPOSITUSERBANKACTION', data })
        }).catch(() => {
            dispatch({ type: 'DEPOSITUSERBANKACTION', data: [] })
        })

        if (Array.isArray(depositBank) && depositBank.length) {
            let defaultBank = depositBank.find(v => v.IsDefault)
            if (defaultBank) {
                let defaultBankIndex = depositBank.findIndex(v => v.IsDefault)
                depositBank.splice(defaultBankIndex, 1)
                depositBank.unshift(defaultBank)
            }

            global.storage.save({
                key: 'depositUserBank',
                id: 'depositUserBank',
                data: depositBank,
                expires: null
            })

            dispatch({ type: 'DEPOSITUSERBANKACTION', data: depositBank })
            return
        }

        fetchRequest(ApiPort.GetMemberBanks + '?AccountType=Deposit&', 'GET').then(res => {
            if (Array.isArray(res)) {
                let depositBank = res

                let defaultBank = depositBank.find(v => v.IsDefault)
                if (defaultBank) {
                    let defaultBankIndex = depositBank.findIndex(v => v.IsDefault)
                    depositBank.splice(defaultBankIndex, 1)
                    depositBank.unshift(defaultBank)
                }

                global.storage.save({
                    key: 'depositUserBank',
                    id: 'depositUserBank',
                    data: depositBank,
                    expires: null
                })
                return dispatch({ type: 'DEPOSITUSERBANKACTION', data: depositBank })
            } else {
                global.storage.save({
                    key: 'depositUserBank',
                    id: 'depositUserBank',
                    data: [],
                    expires: null
                })
                return dispatch({ type: 'DEPOSITUSERBANKACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}


export const getWithdrawalLbBankAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'WithdrawalsLbBanks',
            id: 'WithdrawalsLbBanks'
        }).then(data => {
            dispatch({ type: 'WITHDRAWALLBBANKACTION', data })
        }).catch(() => {
            dispatch({ type: 'WITHDRAWALLBBANKACTION', data: [] })
        })

        fetchRequest(ApiPort.PaymentDetails + '?transactionType=Withdrawal&method=LB&isMobile=true&', 'GET').then(res => {
            let withdrawalsBank = res.Banks
            if (Array.isArray(withdrawalsBank) && withdrawalsBank.length) {

                global.storage.save({
                    key: 'WithdrawalsLbBanks',
                    id: 'WithdrawalsLbBanks',
                    data: withdrawalsBank,
                    expires: null
                })
                return dispatch({ type: 'WITHDRAWALLBBANKACTION', data: withdrawalsBank })
            } else {
                global.storage.save({
                    key: 'WithdrawalsLbBanks',
                    id: 'WithdrawalsLbBanks',
                    data: [],
                    expires: null
                })
                return dispatch({ type: 'WITHDRAWALLBBANKACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}


export const getDepositLbBankAction = () => {
    return (dispatch, getState) => {
        global.storage.load({
            key: 'DepositLbBanks',
            id: 'DepositLbBanks'
        }).then(data => {
            dispatch({ type: 'DEPOSITLBBANKACTION', data })
        }).catch(() => {
            dispatch({ type: 'DEPOSITLBBANKACTION', data: [] })
        })

        fetchRequest(ApiPort.PaymentDetails + '?transactionType=deposit&method=LB&isMobile=true&', 'GET').then(res => {
            let depositBank = res.Banks
            if (Array.isArray(depositBank) && depositBank.length) {
                global.storage.save({
                    key: 'DepositLbBanks',
                    id: 'DepositLbBanks',
                    data: depositBank,
                    expires: null
                })
                return dispatch({ type: 'DEPOSITLBBANKACTION', data: depositBank })
            } else {
                global.storage.save({
                    key: 'DepositLbBanks',
                    id: 'DepositLbBanks',
                    data: [],
                    expires: null
                })
                return dispatch({ type: 'DEPOSITLBBANKACTION', data: [] })
            }
        }).catch((err) => {
            Toast.hide()
        })
    }
}

