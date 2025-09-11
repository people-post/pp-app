(function(shop) {
const _CPT_PRODUCT_INFO_LARGE_QUOTE = {
  MAIN : `<div class="quote-element pad5px">
  <div id="__ID_SELLER_NAME__"></div>
  <div class="quote-element-content pad5px">
    <div id="__ID_NAME__" class="u-font5"></div>
    <div id="__ID_DESCRIPTION__" class="u-font5"></div>
  </div>
  <div id="__ID_IMAGE__"></div>
  </div>`,
}

class PProductInfoLargeQuote extends shop.PProductInfoBase {
  constructor() {
    super();
    this._pSellerName = new ui.PanelWrapper();
  }

  getSellerNamePanel() { return this._pSellerName; }

  _renderFramework() {
    let s = _CPT_PRODUCT_INFO_LARGE_QUOTE.MAIN;
    s = s.replace("__ID_SELLER_NAME__", this._getSubElementId("SN"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_DESCRIPTION__", this._getSubElementId("D"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pSellerName.attach(this._getSubElementId("SN"));
    this._pName.attach(this._getSubElementId("N"));
    this._pDescription.attach(this._getSubElementId("D"));
    this._pThumbnail.attach(this._getSubElementId("I"));
  }
};

shop.PProductInfoLargeQuote = PProductInfoLargeQuote;
}(window.shop = window.shop || {}));
