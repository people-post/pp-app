
const _CFT_CART = {
  TITLE : `[__NAME__]`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';

export class FCart extends Fragment {
  static T_LAYOUT = {
    ACTIVE : Symbol(),
    RESERVE: Symbol(),
  };

  constructor() {
    super();
    this._fItems = new FSimpleFragmentList();
    this.setChild("list", this._fItems);

    this._fBtnCheckout = new Button();
    this._fBtnCheckout.setName("Checkout...");
    this._fBtnCheckout.setDelegate(this);
    this.setChild("btnCheckout", this._fBtnCheckout);

    this._name = "";
    this._cartId = null;
    this._tLayout = null;
    this._currencyId = null;
    this._isCartTransferEnabled = false;
  }

  setName(name) { this._name = name; }
  setCartId(id) { this._cartId = id; }
  setCurrencyId(id) { this._currencyId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableCartTransfer(b) { this._isCartTransferEnabled = b; }

  getItemForCartItemFragment(fCartItem, itemId) {
    let c = this.#getCart();
    return c ? c.get(itemId) : null;
  }

  onSimpleButtonClicked(fBtn) { this.#onCheckoutClicked(); }

  onCartItemFragmentRequestShowView(fItem, v, title) {
    this._delegate.onCartFragmentRequestShowView(this, v, title);
  }

  onCartItemFragmentRequestChangeItemQuantity(fCartItem, itemId, dQty) {
    this._delegate.onCartFragmentRequestChangeItemQuantity(this, this._cartId,
                                                           itemId, dQty);
  }

  onCartItemFragmentRequestRemoveItem(fItem, itemId) {
    this._delegate.onCartFragmentRequestRemoveItem(this, this._cartId, itemId);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PRODUCT:
    case plt.T_DATA.CURRENCIES:
    case plt.T_DATA.DRAFT_ORDERS:
      this.render();
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let pMain = new ui.ListPanel();
    render.wrapPanel(pMain);

    let p;

    this._fItems.clear();
    let items = this.#getItems();
    if (items.length) {
      p = new ui.SectionPanel(this.#renderTitle());
      pMain.pushPanel(p);
      for (let item of items) {
        let f = new cart.FCartItem();
        f.setItemId(item.getId());
        f.setCurrencyId(this._currencyId);
        f.setLayoutType(this.#getItemLayoutType());
        f.setEnableTransferBtn(this._isCartTransferEnabled);
        f.setDataSource(this);
        f.setDelegate(this);
        this._fItems.append(f);
      }

      this._fItems.attachRender(p);
      this._fItems.render();
    }

    if (this._currencyId) {
      let total = 0;
      for (let item of items) {
        total += item.getPrice(this._currencyId);
      }

      if (total > 0) {
        p = new ui.Panel();
        p.setClassName("right-align");
        pMain.pushPanel(p);
        this.#renderTotal(total, p);
        pMain.pushSpace(1);

        p = new ui.PanelWrapper();
        pMain.pushPanel(p);
        this._fBtnCheckout.attachRender(p);
        this._fBtnCheckout.render();
        pMain.pushSpace(2);
      }
    }
  }

  #getCart() {
    return this._dataSource.getCartForCartFragment(this, this._cartId);
  }

  #getItems() {
    let c = this.#getCart();
    let items = c ? c.getItems() : [];
    if (this._currencyId) {
      return items.filter(i => i.getPreferredCurrencyId() == this._currencyId);
    } else {
      return items;
    }
  }

  #getItemLayoutType() {
    let t;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.RESERVE:
      t = cart.FCartItem.T_LAYOUT.RESERVE;
      break;
    default:
      t = cart.FCartItem.T_LAYOUT.ACTIVE;
      break;
    }
    return t;
  }

  #renderTitle() {
    if (this._currencyId) {
      let c = dba.Exchange.getCurrency(this._currencyId);
      let s = _CFT_CART.TITLE;
      s = s.replace("__NAME__", this.#renderCurrencyName(c));
      return s;
    } else {
      return this._name;
    }
  }

  #renderCurrencyName(currency) {
    if (currency) {
      let s = `__NAME__(__CODE__)`;
      s = s.replace("__NAME__", currency.getName());
      s = s.replace("__CODE__", currency.getCode());
      return s;
    } else {
      return "N/A";
    }
  }

  #renderTotal(value, panel) {
    let c = dba.Exchange.getCurrency(this._currencyId);
    if (c) {
      panel.replaceContent("Total: " + Utilities.renderPrice(c, value));
    }
  }

  #onCheckoutClicked() {
    this._delegate.onCartFragmentRequestCheckout(this, this._cartId,
                                                 this._currencyId);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.FCart = FCart;
}
