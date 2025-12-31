
/*
 * +---+-------------+
 * |   |             |
 * |   |             |
 * |   |-------------|
 * |   |             |
 * +---+-------------+
 */

const _CPT_PRODUCT_INFO_LARGE = {
  MAIN : `<div class="flex flex-start product-info large">
    <div class="w50px flex-noshrink">
      <div id="__ID_SELLER_ICON__" class="user-icon-column"></div>
    </div>
    <div class="flex-grow no-overflow">
      <div class="crosslink-note" id="__ID_REFERENCE__"></div>
      <div id="__ID_SELLER_NAME__"></div>
      <div class="product-detail-large">
        <div id="__ID_NAME__" class="u-font5 bold"></div>
        <div id="__ID_DESCRIPTION__" class="u-font5"></div>
      </div>
      <div id="__ID_THUMBNAIL__"></div>
      <div class="flex space-between">
        <div id="__ID_PRICE__"></div>
        <div id="__ID_ACTION__"></div>
      </div>
    </div>
    </div>`,
}

import { PProductInfoBase } from './PProductInfoBase.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProductInfoLarge extends PProductInfoBase {
  constructor() {
    super();
    this._pSellerIcon = new PanelWrapper();
    this._pSellerName = new PanelWrapper();
    this._pReference = new PanelWrapper();
    this._pPrice = new gui.PPrice();
    this._pAction = new PanelWrapper();
  }

  getPricePanel() { return this._pPrice; }
  getSellerIconPanel() { return this._pSellerIcon; }
  getSellerNamePanel() { return this._pSellerName; }
  getReferencePanel() { return this._pReference; }
  getActionPanel() { return this._pAction; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pSellerIcon.attach(this._getSubElementId("SI"));
    this._pReference.attach(this._getSubElementId("R"));
    this._pSellerName.attach(this._getSubElementId("SN"));
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pThumbnail.attach(this._getSubElementId("I"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pAction.attach(this._getSubElementId("A"));
  }

  _renderFramework() {
    let s = _CPT_PRODUCT_INFO_LARGE.MAIN;
    s = s.replace("__ID_SELLER_ICON__", this._getSubElementId("SI"));
    s = s.replace("__ID_REFERENCE__", this._getSubElementId("R"));
    s = s.replace("__ID_SELLER_NAME__", this._getSubElementId("SN"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PProductInfoLarge = PProductInfoLarge;
}
