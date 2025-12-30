
export class PCartItemInfo extends ui.Panel {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pThumbnail = new ui.PanelWrapper();
    this._pPrice = new ui.Panel();
    this._pBtnDelete = new ui.PanelWrapper();
  }

  getTitlePanel() { return this._pTitle; }
  getThumbnailPanel() { return this._pThumbnail; }
  getQuantityPanel() { return null; }
  getPricePanel() { return this._pPrice; }
  getDeleteBtnPanel() { return this._pBtnDelete; }
  getSaveForLaterBtnPanel() { return null; }
  getMoveToCartBtnPanel() { return null; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.PCartItemInfo = PCartItemInfo;
}
