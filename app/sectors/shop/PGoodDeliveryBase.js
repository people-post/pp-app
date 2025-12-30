
export class PGoodDeliveryBase extends ui.Panel {
  constructor() {
    super();
    this._pBtnAdd = new ui.PanelWrapper();
    this._pProductCount = new ui.Panel();
  }

  getAddBtnPanel() { return this._pBtnAdd; }
  getProductCountPanel() { return this._pProductCount; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PGoodDeliveryBase = PGoodDeliveryBase;
}
