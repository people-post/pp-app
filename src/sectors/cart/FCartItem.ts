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
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FilesThumbnailFragment } from '../../common/gui/FilesThumbnailFragment.js';
import { Cart } from '../../common/dba/Cart.js';
import { Shop } from '../../common/dba/Shop.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { CartItem } from '../../common/datatypes/CartItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { PReservedItemInfo } from './PReservedItemInfo.js';
import { PActiveItemInfo } from './PActiveItemInfo.js';
import { FvcProduct } from '../shop/FvcProduct.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';
import type { PCartItemInfo } from './PCartItemInfo.js';
import { Account } from '../../common/dba/Account.js';

interface CartItemDataSource {
  getItemForCartItemFragment(f: FCartItem, itemId: string): CartItem | null;
}

interface CartItemDelegate {
  onCartItemFragmentRequestShowView(f: FCartItem, v: unknown, title: string): void;
  onCartItemFragmentRequestChangeItemQuantity(f: FCartItem, itemId: string, dQty: number): void;
  onCartItemFragmentRequestRemoveItem(f: FCartItem, itemId: string): void;
}

export class FCartItem extends Fragment {
  static T_LAYOUT = {
    ACTIVE : Symbol(),
    RESERVE: Symbol(),
  };

  protected _fThumbnail: FilesThumbnailFragment;
  protected _fBtnDelete: Button;
  protected _fBtnSaveForLater: Button;
  protected _fBtnMoveToCart: Button;
  protected _itemId: string | null;
  protected _tLayout: symbol | null;
  protected _currencyId: string | null;
  protected _isTransferButtonEnabled: boolean;
  protected _dataSource!: CartItemDataSource;
  protected _delegate!: CartItemDelegate;

  constructor() {
    super();
    this._fThumbnail = new FilesThumbnailFragment();
    this._fThumbnail.setDataSource(this);
    this._fThumbnail.setDelegate(this);
    this.setChild("thumbnail", this._fThumbnail);

    this._fBtnDelete = new Button();
    this._fBtnDelete.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnDelete.setThemeType(Button.T_THEME.RISKY);
    this._fBtnDelete.setName("delete");
    this._fBtnDelete.setDelegate(this);
    this.setChild("btnDelete", this._fBtnDelete);

    this._fBtnSaveForLater = new Button();
    this._fBtnSaveForLater.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnSaveForLater.setThemeType(Button.T_THEME.NONE);
    this._fBtnSaveForLater.setName("Save for later");
    this._fBtnSaveForLater.setDelegate(this);
    this.setChild("btnSaveForLater", this._fBtnSaveForLater);

    this._fBtnMoveToCart = new Button();
    this._fBtnMoveToCart.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnMoveToCart.setThemeType(Button.T_THEME.NONE);
    this._fBtnMoveToCart.setName("Move to cart");
    this._fBtnMoveToCart.setDelegate(this);
    this.setChild("btnMoveToCart", this._fBtnMoveToCart);

    this._itemId = null;
    this._tLayout = null;
    this._currencyId = null;
    this._isTransferButtonEnabled = false;
  }

  setItemId(id: string | null): void { this._itemId = id; }
  setCurrencyId(id: string | null): void { this._currencyId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setEnableTransferBtn(b: boolean): void { this._isTransferButtonEnabled = b; }

  getFilesForThumbnailFragment(fThumbnail: FilesThumbnailFragment): unknown[] {
    let f = this.#getThumbnialFile();
    return f ? [ f ] : [];
  }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn) {
    case this._fBtnDelete:
      this._delegate.onCartItemFragmentRequestRemoveItem(this, this._itemId as string);
      break;
    case this._fBtnMoveToCart:
      Cart.asyncMoveItem(this._itemId as string, CartDataType.T_ID.ACTIVE);
      break;
    case this._fBtnSaveForLater:
      Cart.asyncMoveItem(this._itemId as string, CartDataType.T_ID.RESERVE);
      break;
    default:
      break;
    }
  }

  onThumbnailClickedInThumbnailFragment(fThumbnail: FilesThumbnailFragment, idx: number): void {
    let item = this.#getItem();
    if (item) {
      this.#onProductClicked(item.getProductId());
    }
  }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_CART_ITEM.SHOW_PRODUCT:
      this.#onProductClicked(args[0] as string);
      break;
    case CF_CART_ITEM.INCREASE_ITEM:
      this._delegate.onCartItemFragmentRequestChangeItemQuantity(this, args[0] as string,
                                                                 1);
      break;
    case CF_CART_ITEM.DESCREASE_ITEM:
      this._delegate.onCartItemFragmentRequestChangeItemQuantity(this, args[0] as string,
                                                                 -1);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.CURRENCIES:
    case T_DATA.PRODUCT:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    let item = this.#getItem();
    if (!item) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    let p: Panel | PanelWrapper | null = panel.getThumbnailPanel();
    if (p) {
      this.#renderThumbnail(p);
    }

    p = panel.getTitlePanel();
    if (p) {
      this.#renderTitle(item, p);
    }

    p = panel.getPricePanel();
    if (p) {
      this.#renderUnitPrice(item, p, this._currencyId);
    }

    p = panel.getQuantityPanel();
    if (p) {
      this.#renderQuantity(item, p);
    }

    p = panel.getDeleteBtnPanel();
    if (p) {
      this._fBtnDelete.attachRender(p);
      this._fBtnDelete.render();
    }

    if (this._isTransferButtonEnabled) {
      p = panel.getSaveForLaterBtnPanel();
      if (p && Account.isAuthenticated()) {
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

  #createPanel(): PCartItemInfo {
    let p: PCartItemInfo;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.RESERVE:
      p = new PReservedItemInfo();
      break;
    default:
      p = new PActiveItemInfo();
      break;
    }
    return p;
  }

  #renderThumbnail(panel: Panel): void {
    let p = new PanelWrapper();
    p.setClassName("thumbnail small");
    panel.wrapPanel(p);
    this._fThumbnail.attachRender(p);
    this._fThumbnail.render();
  }

  #renderTitle(item: CartItem, panel: Panel): void { panel.replaceContent(this.#renderName(item)); }

  #renderName(item: CartItem): string {
    let product = Shop.getProduct(item.getProductId());
    if (product) {
      let s = _CFT_CART_ITEM.NAME;
      s = s.replace("__NAME__", product.getName());
      s = s.replace("__PRODUCT_ID__", product.getId());
      return s;
    }
    return "N/A";
  }

  #renderUnitPrice(item: CartItem, panel: Panel, currencyId: string | null): void {
    let cid = currencyId ? currencyId : item.getPreferredCurrencyId();
    let c = Exchange.getCurrency(cid);
    let s = Utilities.renderPrice(c, item.getUnitPrice(cid));
    panel.replaceContent(s);
  }

  #renderQuantity(item: CartItem, panel: Panel): void {
    let s = _CFT_CART_ITEM.QUANTITY;
    s = s.replace("__QUANTITY__", item.getQuantity() + "x");
    s = s.replace(/__ITEM_ID__/g, item.getId());
    panel.replaceContent(s);
  }

  #getItem(): CartItem | null {
    return this._dataSource.getItemForCartItemFragment(this, this._itemId as string);
  }

  #getThumbnialFile(): unknown {
    let item = this.#getItem();
    if (item) {
      let product = Shop.getProduct(item.getProductId());
      if (product) {
        return product.getFileForSpecs(item.getSpecs());
      }
    }
    return null;
  }

  #onProductClicked(productId: string): void {
    let v = new View();
    let f = new FvcProduct();
    f.setProductId(productId);
    v.setContentFragment(f);
    this._delegate.onCartItemFragmentRequestShowView(this, v, "product");
  }
};
