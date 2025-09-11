(function(shop) {
const _CPT_PRODUCT = {
  MAIN : `<div id="__ID_BTN_ADD__"></div>
  <div id="__ID_COUNT__" class="small-info-text"></div>`,
}

class PGoodDelivery extends shop.PGoodDeliveryBase {
  _renderFramework() {
    let s = _CPT_PRODUCT.MAIN;
    s = s.replace("__ID_BTN_ADD__", this._getSubElementId("BA"));
    s = s.replace("__ID_COUNT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pBtnAdd.attach(this._getSubElementId("BA"));
    this._pProductCount.attach(this._getSubElementId("C"));
  }
};

shop.PGoodDelivery = PGoodDelivery;
}(window.shop = window.shop || {}));
