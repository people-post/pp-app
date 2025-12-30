export const CF_CART_ITEM = {
  SHOW_PRODUCT : Symbol(),
  INCREASE_ITEM : Symbol(),
  DESCREASE_ITEM : Symbol(),
};

const _CFT_CART_ITEM = {
  NAME :
      `<span onclick="javascript:G.action(cart.CF_CART_ITEM.SHOW_PRODUCT, '__PRODUCT_ID__')">__NAME__</div>`,
  QUANTITY : `<span>
    <span class="button-like tiny low-profile s-cinfotext bold" onclick="javascript:G.action(cart.CF_CART_ITEM.DESCREASE_ITEM, '__ITEM_ID__')">-</span>
    <span class="quantity-between-knob">__QUANTITY__</span>
    <span class="button-like tiny low-profile s-cinfotext bold" onclick="javascript:G.action(cart.CF_CART_ITEM.INCREASE_ITEM, '__ITEM_ID__')">+</span>
  </span>`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class FCartItem extends Fragment {
  static T_LAYOUT = {
    ACTIVE : Symbol(),
    RESERVE: Symbol(),
  };

  constructor() {
    super();
    this._fThumbnail = new gui.FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fBtnDelete = new ui.Button();
    this._fBtnDelete.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtnDelete.setThemeType(ui.Button.T_THEME.RISKY);
    this._fBtnDelete.setName("delete");
    this._fBtnDelete.setDelegate(this);
    this.setChild("btnDelete", this._fBtnDelete);

    this._fBtnSaveForLater = new ui.Button();
    this._fBtnSaveForLater.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtnSaveForLater.setThemeType(ui.Button.T_THEME.NONE);
    this._fBtnSaveForLater.setName("Save for later");
    this._fBtnSaveForLater.setDelegate(this);
    this.setChild("btnSaveForLater", this._fBtnSaveForLater);

    this._fBtnMoveToCart = new ui.Button();
    this._fBtnMoveToCart.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtnMoveToCart.setThemeType(ui.Button.T_THEME.NONE);
    this._fBtnMoveToCart.setName("Move to cart");
    this._fBtnMoveToCart.setDelegate(this);
    this.setChild("btnMoveToCart", this._fBtnMoveToCart);

    this._itemId = null;
    this._tLayout = null;
    this._currencyId = null;
    this._isTransferButtonEnabled = false;
  }

  setItemId(id) { this._itemId = id; }
  setCurrencyId(id) { this._currencyId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableTransferBtn(b) { this._isTransferButtonEnabled = b; }

  getFilesForThumbnailFragment(fThumbnail) {
    let f = this.#getThumbnialFile();
    return f ? [ f ] : [];
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this._fBtnDelete:
      this._delegate.onCartItemFragmentRequestRemoveItem(this, this._itemId);
      break;
    case this._fBtnMoveToCart:
      dba.Cart.asyncMoveItem(this._itemId, dat.Cart.T_ID.ACTIVE);
      break;
    case this._fBtnSaveForLater:
      dba.Cart.asyncMoveItem(this._itemId, dat.Cart.T_ID.RESERVE);
      break;
    default:
      break;
    }
  }

  onThumbnailClickedInThumbnailFragment(fThumbnail, idx) {
    let item = this.#getItem();
    if (item) {
      this.#onProductClicked(item.getProductId());
    }
  }

  action(type, ...args) {
    switch (type) {
    case cart.CF_CART_ITEM.SHOW_PRODUCT:
      this.#onProductClicked(args[0]);
      break;
    case cart.CF_CART_ITEM.INCREASE_ITEM:
      this._delegate.onCartItemFragmentRequestChangeItemQuantity(this, args[0],
                                                                 1);
      break;
    case cart.CF_CART_ITEM.DESCREASE_ITEM:
      this._delegate.onCartItemFragmentRequestChangeItemQuantity(this, args[0],
                                                                 -1);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.CURRENCIES:
    case plt.T_DATA.PRODUCT:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let item = this.#getItem();
    if (!item) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let p = panel.getThumbnailPanel();
    this.#renderThumbnail(p);

    p = panel.getTitlePanel();
    this.#renderTitle(item, p);

    p = panel.getPricePanel();
    this.#renderUnitPrice(item, p, this._currencyId);

    p = panel.getQuantityPanel();
    if (p) {
      this.#renderQuantity(item, p);
    }

    p = panel.getDeleteBtnPanel();
    this._fBtnDelete.attachRender(p);
    this._fBtnDelete.render();

    if (this._isTransferButtonEnabled) {
      p = panel.getSaveForLaterBtnPanel();
      if (p && dba.Account.isAuthenticated()) {
        this._fBtnSaveForLater.attachRender(p);
        this._fBtnSaveForLater.render();
      }

      p = panel.getMoveToCartBtnPanel();
      if (p) {
        this._fBtnMoveToCart.attachRender(p);
        this._fBtnMoveToCart.render();
      }
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.RESERVE:
      p = new cart.PReservedItemInfo();
      break;
    default:
      p = new cart.PActiveItemInfo();
      break;
    }
    return p;
  }

  #renderThumbnail(panel) {
    let p = new ui.PanelWrapper();
    p.setClassName("thumbnail small");
    panel.wrapPanel(p);
    this._fThumbnail.attachRender(p);
    this._fThumbnail.render();
  }

  #renderTitle(item, panel) { panel.replaceContent(this.#renderName(item)); }

  #renderName(item) {
    let product = dba.Shop.getProduct(item.getProductId());
    if (product) {
      let s = _CFT_CART_ITEM.NAME;
      s = s.replace("__NAME__", product.getName());
      s = s.replace("__PRODUCT_ID__", product.getId());
      return s;
    }
    return "N/A";
  }

  #renderUnitPrice(item, panel, currencyId) {
    let cid = currencyId ? currencyId : item.getPreferredCurrencyId();
    let c = dba.Exchange.getCurrency(cid);
    let s = Utilities.renderPrice(c, item.getUnitPrice(cid));
    panel.replaceContent(s);
  }

  #renderQuantity(item, panel) {
    let s = _CFT_CART_ITEM.QUANTITY;
    s = s.replace("__QUANTITY__", item.getQuantity() + "x");
    s = s.replace(/__ITEM_ID__/g, item.getId());
    panel.replaceContent(s);
  }

  #getItem() {
    return this._dataSource.getItemForCartItemFragment(this, this._itemId);
  }

  #getThumbnialFile() {
    let item = this.#getItem();
    if (item) {
      let product = dba.Shop.getProduct(item.getProductId());
      if (product) {
        return product.getFileForSpecs(item.getSpecs());
      }
    }
    return null
  }

  #onProductClicked(productId) {
    let v = new ui.View();
    let f = new shop.FvcProduct();
    f.setProductId(productId);
    v.setContentFragment(f);
    this._delegate.onCartItemFragmentRequestShowView(this, v, "product");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.CF_CART_ITEM = CF_CART_ITEM;
}