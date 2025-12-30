import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { C } from '../../lib/framework/Constants.js';

export class FvcExchange extends FScrollViewContent {
  constructor() {
    super();
    this._fCoin = new xchg.FExchangeItemInfo();
    this._fCash = new xchg.FCashierInfo();
    this._fCash.setDelegate(this);
    this._fFood = new xchg.FVoucherInfo();
    this._fAmusement = new xchg.FVoucherInfo();
    this.setChild("coin", this._fCoin);
    this.setChild("cash", this._fCash);
    this.setChild("food", this._fFood);
    this.setChild("amusement", this._fAmusement);
  }

  onExchangeItemInfoFragmentRequestShowView(fItem, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GLOBAL_COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render) {
    this.#updateData();
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fCoin.attachRender(pp);
    this._fCoin.render();
    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fCash.attachRender(pp);
    this._fCash.render();
    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fFood.attachRender(pp);
    this._fFood.render();
    pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fAmusement.attachRender(pp);
    this._fAmusement.render();
  }

  #updateData() {
    let p = dba.Communities.getGlobalProfile();
    let dCoin = {icon : C.ICON.COIN, name : "CabinCoin"};
    let dCash = {icon : C.ICON.CASH, name : "CabinCash"};
    // TODO: Make const for id
    let dFood = {id : "FOOD", icon : C.ICON.VOUCHER_FOOD, name : "CabinFood"};
    let dZest = {
      id : "ZEST",
      icon : C.ICON.VOUCHER_AMUSEMENT,
      name : "CabinZest"
    };
    if (p) {
      dCoin.total = p.statistics.n_coins;
      dCash.total = p.statistics.n_cash;

      dFood.data = p.statistics.food_voucher;
      dZest.data = p.statistics.zest_voucher;
    }
    this._fCoin.setItem(dCoin);
    this._fCash.setItem(dCash);
    this._fFood.setItem(dFood);
    this._fAmusement.setItem(dZest);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.xchg = window.xchg || {};
  window.xchg.FvcExchange = FvcExchange;
}
