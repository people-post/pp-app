(function(shop) {
class PGoodDeliveryBase extends ui.Panel {
  constructor() {
    super();
    this._pBtnAdd = new ui.PanelWrapper();
    this._pProductCount = new ui.Panel();
  }

  getAddBtnPanel() { return this._pBtnAdd; }
  getProductCountPanel() { return this._pProductCount; }
};

shop.PGoodDeliveryBase = PGoodDeliveryBase;
}(window.shop = window.shop || {}));
