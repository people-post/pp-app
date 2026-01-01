
window.CF_EXCHANGE_ITEM_INFO = {
  BUY : "CF_EXCHANGE_ITEM_INFO_1",
  SELL : "CF_EXCHANGE_ITEM_INFO_2",
}

const _CVF_EXCHANGE_ITEM = {
  MAIN : `<table class="w100">
    <tbody>
      <tr>
        <td class="exchange-item-info-brief">
          <div>
            <span class="exchange-item-info-icon inline-block s-icon3 clickable">__ICON__</span>
          </div>
          <div class="s-font5">__NAME__</div>
        </td>
        <td class="exchange-item-info-detail">__DETAIL__</td>
        <td class="exchange-item-info-actions">__ACTIONS__</td>
      </tr>
    </tbody>
    </table>`,
  ICON : ``,
  BTN_BUY :
      `<span class="button-like small s-primary" onclick="javascript:G.action(CF_EXCHANGE_ITEM_INFO.BUY)">Buy...</span>`,
  BTN_SELL :
      `<span class="button-like small danger" onclick="javascript:G.action(CF_EXCHANGE_ITEM_INFO.SELL)">Sell...</span>`,
  HINT_LOGIN :
      `<span class="u-font5 bgwhite">Login or register for more options</span>`,
  HINT_SAFE_SITE :
      `<span class="u-font5 bgwhite">Go to <a target="_blank" href="https://gcabin.com/?sector=extras&page=exchange">G-Cabin&#x1f517;</a> for more options</span>`,
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Account } from '../../common/dba/Account.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { env } from '../../index_app.js';

export class FExchangeItemInfo extends Fragment {
  constructor() {
    super();
    this._item = null;
  }

  setItem(item) { this._item = item; }

  action(type, ...args) {
    switch (type) {
    case CF_EXCHANGE_ITEM_INFO.BUY:
      this.#onBuyClicked();
      break;
    case CF_EXCHANGE_ITEM_INFO.SELL:
      this.#onSellClicked();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new Panel();
    pp.setClassName("exchange-item-info");
    p.pushPanel(pp);
    if (this._item) {
      pp.replaceContent(this.#renderItem(this._item));
    } else {
      pp.replaceContent("...");
    }
  }

  #renderItem(item) {
    let s = _CVF_EXCHANGE_ITEM.MAIN;
    s = s.replace("__ICON__", item.icon);
    s = s.replace("__NAME__", item.name);
    s = s.replace("__DETAIL__", this._renderDetail(item));
    if (Account.isAuthenticated()) {
      if (Account.isWebOwner() || env.isTrustedSite() ||
          WebConfig.isDevSite()) {
        s = s.replace("__ACTIONS__", this._renderActions(item));
      } else {
        s = s.replace("__ACTIONS__", _CVF_EXCHANGE_ITEM.HINT_SAFE_SITE);
      }
    } else {
      s = s.replace("__ACTIONS__", _CVF_EXCHANGE_ITEM.HINT_LOGIN);
    }
    return s;
  }

  _renderDetail(item) {
    let s = `<div>Latest: 33.40</div>
        <div>Volume: 332333</div>
        <div>Total: __TOTAL__</div>`;
    s = s.replace("__TOTAL__", item.total);
    return s;
  }

  _renderActions(item) {
    let s = _CVF_EXCHANGE_ITEM.BTN_BUY;
    s += _CVF_EXCHANGE_ITEM.BTN_SELL;
    return s;
  }

  #onBuyClicked() { console.log("Buy"); }
  #onSellClicked() { console.log("Sell"); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FExchangeItemInfo = FExchangeItemInfo;
}
