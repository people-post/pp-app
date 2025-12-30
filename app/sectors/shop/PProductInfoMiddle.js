
/*
 * +-----------+-----------+--------+
 * |           |           |        |
 * |           |           |        |
 * | THUMBNAIL |   DETAIL  | PRICE  |
 * |           |           | ACTION |
 * |           |           |        |
 * +-----------+-----------+--------+
 */

const _CPT_PRODUCT_INFO_MIDDLE = {
  MAIN : `<div class="product-info-wrapper midsize">
  <div class="aspect-4-1-frame">
    <div class="aspect-content border-box flex space-around product-info midsize">
      <div id="__ID_THUMBNAIL__" class="product-info-left flex-noshrink"></div>
      <div class="product-info-detail flex-grow h100 hide-overflow clickable">
        <div id="__ID_NAME__" class="bold"></div>
        <div id="__ID_DESCRIPTION__" class="u-font7"></div>
      </div>
      <div class="product-info-misc flex-noshrink">
        <div id="__ID_PRICE__"></div>
        <div id="__ID_ACTION__"></div>
      </div>
    </div>
  </div>
  </div>`,
}

class PProductInfoMiddle extends shop.PProductInfoBase {
  constructor() {
    super();
    this._pPrice = new gui.PPriceCompact();
    this._pAction = new ui.PanelWrapper();
  }

  getPricePanel() { return this._pPrice; }
  getActionPanel() { return this._pAction; }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pThumbnail.attach(this._getSubElementId("I"));
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pAction.attach(this._getSubElementId("A"));
  }

  _renderFramework() {
    let s = _CPT_PRODUCT_INFO_MIDDLE.MAIN;
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("I"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_ACTION__", this._getSubElementId("A"));
    return s;
  }
};

shop.PProductInfoMiddle = PProductInfoMiddle;
}(window.shop = window.shop || {}));
