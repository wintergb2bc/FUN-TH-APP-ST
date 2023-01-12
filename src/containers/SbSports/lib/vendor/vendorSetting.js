/*
* vendor設置，單獨分離 token,語言等 環境配置
*
* 在各產品/語言端，視實際狀況修改
*/
import i18n from './vendori18n';

//默認用戶配置，用於VendorBase
export const defaultMemberSetting = {
  amount1: 99999,
  amount2: 1000,
  amount3: 100,
  oddsType: 'EU',
  alwaysAcceptBetterOdds: true,
  betSlipVibration: false,
  betSlipSound: false,
  goalNotification: true,
  goalMyFavorite: true,
  goalIBet: true,
  goalAllRB: false,
  goalSound: true,
  goalSoundType: 1,
  goalVibration: true,
  listDisplayType: 1,
};

//環境設定，用於判斷當前環境
export const envSettings = {
  isApp: true, //是否app
}

//投注記錄 投注線描述
export function getWagerLineDesc(wagerItemData) {
  //return wagerItemData.getLineDescDefault(); //使用默認方式

  //自定描述
  let periodDesc = !wagerItemData.IsOutRightEvent ? wagerItemData.PeriodName : '';
  //如果 BetTypeName 原本開頭就帶有 PeriodName 就不用PeriodName (for im重複PeriodName)
  //例子： BetTypeName = '下半場 讓球'   PeriodName = '下半場'
  if (periodDesc && periodDesc.length > 0
    && wagerItemData.BetTypeName.indexOf(periodDesc) === 0) {
    periodDesc = '';
  }

  //let LineDesc = (this.MarketName ? (this.MarketName + ' ') : '') + ((!this.IsOutRightEvent && periodDesc.length > 0) ? (' ' + periodDesc) : '') + ' ' + this.BetTypeName;
  //J1M3只改這行，把投注類型名稱放到中間
  let LineDesc = (wagerItemData.MarketName ? (wagerItemData.MarketName + ' ') : '') + wagerItemData.BetTypeName +' '+ ((!wagerItemData.IsOutRightEvent && periodDesc.length > 0) ? (' ' + periodDesc) : '') ;

  if (wagerItemData.IsLucky) {
    LineDesc = LineDesc + ' (' + i18n.SABA.ISLUCKY + ')';
  }
  return LineDesc;
}

//詳情頁 投注線描述
export function getEventDetailLineDesc(lineData) {
  //return lineData.getLineDescDefault(); //使用默認方式
  let periodDesc = lineData.PeriodName;
  //如果 BetTypeName 原本開頭就帶有 PeriodName 就不用PeriodName (for im重複PeriodName)
  //例子： BetTypeName = '下半場 讓球'   PeriodName = '下半場'
  if (periodDesc && periodDesc.length > 0
    && lineData.BetTypeName.indexOf(periodDesc) === 0) {
    periodDesc = '';
  }

  let linedesc =  (periodDesc.length > 0 ? (periodDesc + ' ') : '') + lineData.BetTypeName; //越南要加一個空白在 period 和 bettype 之間

  //越南每個字母首字大寫
  if (linedesc) {
    if (linedesc && linedesc.indexOf(' ') !== -1) {
      let splitArr = linedesc.split(' ');
      let newArr = splitArr.map(t => {
        if (t.length > 1) {
          return t[0].toUpperCase() + t.substring(1);
        } else if (t.length === 1) {
          return t.toUpperCase();
        }
      })
      return newArr.join(' ');
    } else if (linedesc.length > 1) {
      return linedesc[0].toUpperCase() + linedesc.substring(1);
    } else if (linedesc.length === 1) {
      return linedesc.toUpperCase();
    }
  }
  return linedesc
}
