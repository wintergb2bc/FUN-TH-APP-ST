export const memberInforData = (state = null, action) => {
    switch (action.type) {
        case 'MEMBERINFORACTION':
            return state = action.data || {}
        default:
            return state
    }
}

export const balanceInforData = (state = [], action) => {
    switch (action.type) {
        case 'BALANCEINFORACTION':
            return state = action.data || []
        default:
            return state
    }
}

export const walletsInforData = (state = [], action) => {
    switch (action.type) {
        case 'WALLETSINFORACTION':
            return state = action.data || []
        default:
            return state
    }
}

export const depositTypeData = (state = {}, action) => {
    switch (action.type) {
        case 'DEPOSITYPE':
            return state = action.data
        default:
            return state
    }
}

export const homeRegistLoginModalData = (state = false, action) => {
    switch (action.type) {
        case 'HOMEREGISTLOGINMODAL':
            return state = action.data || {
                flag: false,
                page: 'home'
            }
        default:
            return {
                flag: false,
                page: 'home'
            }
    }
}

export const liveChatData = (state = false, action) => {
    switch (action.type) {
        case 'LIVECHATINCOGNITO':
            return state = action.data || false
        default:
            return state
    }
}



export const bonusTurnOverInforData = (state = {}, action) => {
    switch (action.type) {
        case 'BONUSTURNOVERINFOR':
            return state = action.data
        default:
            return state
    }
}

export const promotionIndexData = (state = '', action) => {
    switch (action.type) {
        case 'PROMOTIONINDEX':
            return state = action.data
        default:
            return state
    }
}


export const newsStatisticsData = (state = {
    totalNew: 0,
    unreadTransactionCounts: 0,
    unreadPersonalMessageCounts: 0,
    unreadAnnouncementCounts: 0
}, action) => {
    switch (action.type) {
        case 'NEWSSTATISTICS':
            return state = action.data
        default:
            return state
    }
}

export const stateRouterNameData = (state = '', action) => {
    switch (action.type) {
        case 'STATEROUTERNAME':
            return state = action.data
        default:
            return state
    }
}

export const selfExclusionsData = (state = {}, action) => {
    switch (action.type) {
        case 'SELFEXCLUSIONSACTION':
            return state = action.data
        default:
            return state
    }
}

export const promotionListData = (state = [], action) => {
    switch (action.type) {
        case 'PROMOTIONLISTINFORACTION':
            return state = action.data
        default:
            return state
    }
}


export const queleaActiveCampaignData = (state = {}, action) => {
    switch (action.type) {
        case 'QUELEAACTIVECAMPAIGNINFORACTION':
            return state = action.data
        default:
            return state
    }
}

export const freeBetData = (state = {}, action) => {
    switch (action.type) {
        case 'FREEBETINFORACTION':
            return state = action.data
        default:
            return state
    }
}

export const withdrawalUserBankData = (state = [], action) => {
    switch (action.type) {
        case 'WITHDRAWALUSERBANKACTION':
            return state = action.data
        default:
            return state
    }
}

export const depositUserBankData = (state = [], action) => {
    switch (action.type) {
        case 'DEPOSITUSERBANKACTION':
            return state = action.data
        default:
            return state
    }
}

export const withdrawalLbBankData = (state = [], action) => {
    switch (action.type) {
        case 'WITHDRAWALLBBANKACTION':
            return state = action.data
        default:
            return state
    }
}

export const depositLbBankData = (state = [], action) => {
    switch (action.type) {
        case 'DEPOSITLBBANKACTION':
            return state = action.data
        default:
            return state
    }
}