
const _CPT_SUPPLIER_ORDER_INFO = {
  MAIN : `<div class="supplier-order-info">
    <div class="flex space-between">
      <div id="__ID_STATUS_INFO__"></div>
      <div id="__ID_PRICE__"></div>
      <div id="__ID_ADDRESS_BTN__"></div>
      <div id="__ID_TIME_INFO__" class="small-info-text"></div>
    </div>
    <div id="__ID_ITEM_INFOS__"></div>
  </div>`,
} as const;

import { PSupplierOrderBase } from './PSupplierOrderBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PSupplierOrderInfo extends PSupplierOrderBase {
  protected _pAddressBtn: Panel;
  protected _pStatusInfo: Panel;
  protected _pTimeInfo: Panel;
  protected _pItemInfos: PanelWrapper;
  protected _pTotalPriceInfo: Panel;

  constructor() {
    super();
    this._pAddressBtn = new Panel();
    this._pStatusInfo = new Panel();
    this._pTimeInfo = new Panel();
    this._pItemInfos = new PanelWrapper();
    this._pTotalPriceInfo = new Panel();
  }

  getShippingAddressBtnPanel(): Panel { return this._pAddressBtn; }
  getStatusInfoPanel(): Panel { return this._pStatusInfo; }
  getTimeInfoPanel(): Panel { return this._pTimeInfo; }
  getItemInfosPanel(): PanelWrapper { return this._pItemInfos; }
  getTotalPriceInfoPanel(): Panel { return this._pTotalPriceInfo; }

  _renderFramework(): string {
    let s = _CPT_SUPPLIER_ORDER_INFO.MAIN;
    s = s.replace("__ID_ADDRESS_BTN__", this._getSubElementId("A"));
    s = s.replace("__ID_STATUS_INFO__", this._getSubElementId("S"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_TIME_INFO__", this._getSubElementId("T"));
    s = s.replace("__ID_ITEM_INFOS__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pAddressBtn.attach(this._getSubElementId("A"));
    this._pStatusInfo.attach(this._getSubElementId("S"));
    this._pTotalPriceInfo.attach(this._getSubElementId("P"));
    this._pTimeInfo.attach(this._getSubElementId("T"));
    this._pItemInfos.attach(this._getSubElementId("I"));
  }
}
