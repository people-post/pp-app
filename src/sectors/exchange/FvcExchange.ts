import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FExchangeItemInfo } from './FExchangeItemInfo.js';
import { FCashierInfo } from './FCashierInfo.js';
import { FVoucherInfo } from './FVoucherInfo.js';
import { Communities } from '../../common/dba/Communities.js';
import { T_DATA } from '../../common/plt/Events.js';
import { ICON } from '../../common/constants/Icons.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

interface ExchangeItemDelegate {
  onExchangeItemInfoFragmentRequestShowView(f: FExchangeItemInfo, view: View, title: string): void;
}

export class FvcExchange extends FScrollViewContent {
  protected _fCoin: FExchangeItemInfo;
  protected _fCash: FCashierInfo;
  protected _fFood: FVoucherInfo;
  protected _fAmusement: FVoucherInfo;
  protected _delegate!: ExchangeItemDelegate;

  constructor() {
    super();
    this._fCoin = new FExchangeItemInfo();
    this._fCash = new FCashierInfo();
    this._fCash.setDelegate(this);
    this._fFood = new FVoucherInfo();
    this._fAmusement = new FVoucherInfo();
    this.setChild("coin", this._fCoin);
    this.setChild("cash", this._fCash);
    this.setChild("food", this._fFood);
    this.setChild("amusement", this._fAmusement);
  }

  onExchangeItemInfoFragmentRequestShowView(fItem: FExchangeItemInfo, view: View, title: string): void {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.GLOBAL_COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
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

  #updateData(): void {
    let p = Communities.getGlobalProfile();
    let dCoin: { icon: string; name: string; total?: number } = {icon : ICON.COIN, name : "CabinCoin"};
    let dCash: { icon: string; name: string; total?: number } = {icon : ICON.CASH, name : "CabinCash"};
    // TODO: Make const for id
    let dFood: { id: string; icon: string; name: string; data?: unknown } = {id : "FOOD", icon : ICON.VOUCHER_FOOD, name : "CabinFood"};
    let dZest: { id: string; icon: string; name: string; data?: unknown } = {
      id : "ZEST",
      icon : ICON.VOUCHER_AMUSEMENT,
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
