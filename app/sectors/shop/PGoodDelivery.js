
const _CPT_PRODUCT = {
  MAIN : `<div id="__ID_BTN_ADD__"></div>
  <div id="__ID_COUNT__" class="small-info-text"></div>`,
}

export class PGoodDelivery extends shop.PGoodDeliveryBase {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PGoodDelivery = PGoodDelivery;
}
