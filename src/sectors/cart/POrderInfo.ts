const _CPT_CUSTOMER_ORDER_INFO = {
  MAIN : `<div class="customer-order-info">
    <div class="flex space-between">
      <div id="__ID_SELLER_INFO__"></div>
      <div id="__ID_STATUS_INFO__"></div>
      <div id="__ID_TIME_INFO__" class="small-info-text"></div>
    </div>
    <div id="__ID_ITEM_INFOS__"></div>
  <div>`,
}

import { POrderBase } from './POrderBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class POrderInfo extends POrderBase {
  protected _pSellerInfo: Panel;
  protected _pTimeInfo: Panel;
  protected _pStatusInfo: Panel;
  protected _pItemInfos: PanelWrapper;

  constructor() {
    super();
    this._pSellerInfo = new Panel();
    this._pTimeInfo = new Panel();
    this._pStatusInfo = new Panel();
    this._pItemInfos = new PanelWrapper();
  }

  getSellerInfoPanel(): Panel { return this._pSellerInfo; }
  getTimeInfoPanel(): Panel { return this._pTimeInfo; }
  getStatusInfoPanel(): Panel { return this._pStatusInfo; }
  getItemInfosPanel(): PanelWrapper { return this._pItemInfos; }

  _renderFramework(): string {
    let s = _CPT_CUSTOMER_ORDER_INFO.MAIN;
    s = s.replace("__ID_SELLER_INFO__", this._getSubElementId("SI"));
    s = s.replace("__ID_TIME_INFO__", this._getSubElementId("T"));
    s = s.replace("__ID_STATUS_INFO__", this._getSubElementId("S"));
    s = s.replace("__ID_ITEM_INFOS__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pSellerInfo.attach(this._getSubElementId("SI"));
    this._pTimeInfo.attach(this._getSubElementId("T"));
    this._pStatusInfo.attach(this._getSubElementId("S"));
    this._pItemInfos.attach(this._getSubElementId("I"));
  }
}
