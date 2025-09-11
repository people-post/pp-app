(function(cart) {
const _CPT_ACTIVE_ITEM_INFO = {
  MAIN : `<div class="cart-item-info">
    <div class="flex">
      <div id="__ID_THUMBNAIL__" class="cart-item-thumbnail"></div>
      <div>
        <div id="__ID_TITLE__" class="s-font4 bold clickable"></div>
        <div id="__ID_PRICE__"></div>
       </div>
     </div>
     <div class="flex space-between">
       <div id="__ID_BTN_DELETE__"></div>
       <div id="__ID_QUANTITY__"></div>
       <div id="__ID_BTN_SAVE_FOR_LATER__"></div>
     </div>
    </div>
  </div>`,
}

class PActiveItemInfo extends cart.PCartItemInfo {
  constructor() {
    super();
    this._pQuantity = new ui.Panel();
    this._pBtnSaveForLater = new ui.PanelWrapper();
  }

  getQuantityPanel() { return this._pQuantity; }
  getSaveForLaterBtnPanel() { return this._pBtnSaveForLater; }

  _renderFramework() {
    let s = _CPT_ACTIVE_ITEM_INFO.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("TN"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_QUANTITY__", this._getSubElementId("Q"));
    s = s.replace("__ID_BTN_DELETE__", this._getSubElementId("D"));
    s = s.replace("__ID_BTN_SAVE_FOR_LATER__", this._getSubElementId("S"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pThumbnail.attach(this._getSubElementId("TN"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pQuantity.attach(this._getSubElementId("Q"));
    this._pBtnDelete.attach(this._getSubElementId("D"));
    this._pBtnSaveForLater.attach(this._getSubElementId("S"));
  }
};

cart.PActiveItemInfo = PActiveItemInfo;
}(window.cart = window.cart || {}));
