
const _CFT_CART_BUTTON = {
  CART_BADGE : `<span class="cart-badge inline-block bgtransparent s-font6 bold cgold center-align">__COUNT__</span>`,
};

class FCartButton extends gui.ActionButton {
  _getIcon() {
    let c = dba.Cart.getCart(dat.Cart.T_ID.ACTIVE);
    let n = c ? c.countItems() : 0;
    let s = _CFT_CART_BUTTON.CART_BADGE;
    s = s.replace("__COUNT__", n);
    return gui.ActionButton.T_ICON.ORDER + s;
  }
};

shop.FCartButton = FCartButton;
}(window.shop = window.shop || {}));
