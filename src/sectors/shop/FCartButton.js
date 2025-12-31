import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { ActionButton } from '../../common/gui/ActionButton.js';

const _CFT_CART_BUTTON = {
  CART_BADGE : `<span class="cart-badge inline-block bgtransparent s-font6 bold cgold center-align">__COUNT__</span>`,
};

export class FCartButton extends ActionButton {
  _getIcon() {
    let c = dba.Cart.getCart(CartDataType.T_ID.ACTIVE);
    let n = c ? c.countItems() : 0;
    let s = _CFT_CART_BUTTON.CART_BADGE;
    s = s.replace("__COUNT__", n);
    return ActionButton.T_ICON.ORDER + s;
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FCartButton = FCartButton;
}
