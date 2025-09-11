(function(cart) {
const _CPT_RESERVED_ITEM_INFO = {
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
       <div id="__ID_BTN_MOVE_TO_CART__"></div>
     </div>
    </div>
  </div>`,
}

class PReservedItemInfo extends cart.PCartItemInfo {
  constructor() {
    super();
    this._pBtnMoveToCart = new ui.PanelWrapper();
  }

  getMoveToCartBtnPanel() { return this._pBtnMoveToCart; }

  _renderFramework() {
    let s = _CPT_RESERVED_ITEM_INFO.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_THUMBNAIL__", this._getSubElementId("TN"));
    s = s.replace("__ID_PRICE__", this._getSubElementId("P"));
    s = s.replace("__ID_BTN_DELETE__", this._getSubElementId("D"));
    s = s.replace("__ID_BTN_MOVE_TO_CART__", this._getSubElementId("M"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pThumbnail.attach(this._getSubElementId("TN"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pPrice.attach(this._getSubElementId("P"));
    this._pBtnDelete.attach(this._getSubElementId("D"));
    this._pBtnMoveToCart.attach(this._getSubElementId("M"));
  }
};

cart.PReservedItemInfo = PReservedItemInfo;
}(window.cart = window.cart || {}));
