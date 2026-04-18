import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FCartItem } from './FCartItem.js';
import { Exchange } from '../../common/dba/Exchange.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Utilities } from '../../common/Utilities.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { CartItem } from '../../common/datatypes/CartItem.js';
import { Currency } from '../../common/datatypes/Currency.js';

const _CFT_CART = {
  TITLE : `[__NAME__]`,
};

export interface FCartDataSource {
  getCartForCartFragment(f: FCart, cartId: string | null): CartDataType | null;
}

export interface FCartDelegate {
  onCartFragmentRequestShowView(f: FCart, v: unknown, title: string): void;
  onCartFragmentRequestShowProduct(f: FCart, productId: string): void;
  onCartFragmentRequestChangeItemQuantity(f: FCart, cartId: string | null, itemId: string, dQty: number): void;
  onCartFragmentRequestRemoveItem(f: FCart, cartId: string | null, itemId: string): void;
  onCartFragmentRequestCheckout(f: FCart, cartId: string | null, currencyId: string | null): void;
}

export class FCart extends Fragment {
  static T_LAYOUT = {
    ACTIVE : Symbol(),
    RESERVE: Symbol(),
  };

  protected _fItems: FSimpleFragmentList;
  protected _fBtnCheckout: Button;
  protected _name: string;
  protected _cartId: string | null;
  protected _tLayout: symbol | null;
  protected _currencyId: string | null;
  protected _isCartTransferEnabled: boolean;

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

  setName(name: string): void { this._name = name; }
  setCartId(id: string | null): void { this._cartId = id; }
  setCurrencyId(id: string | null): void { this._currencyId = id; }
  setLayoutType(t: symbol | null): void { this._tLayout = t; }
  setEnableCartTransfer(b: boolean): void { this._isCartTransferEnabled = b; }

  getItemForCartItemFragment(_fCartItem: FCartItem, itemId: string): CartItem | null {
    let c = this.#getCart();
    return c ? c.get(itemId) || null : null;
  }

  onSimpleButtonClicked(_fBtn: Button): void { this.#onCheckoutClicked(); }

  onCartItemFragmentRequestShowView(_fItem: FCartItem, v: unknown, title: string): void {
    this.getDelegate<FCartDelegate>()?.onCartFragmentRequestShowView(this, v, title);
  }
  onCartItemFragmentRequestShowProduct(_fItem: FCartItem, productId: string): void {
    this.getDelegate<FCartDelegate>()?.onCartFragmentRequestShowProduct(this, productId);
  }

  onCartItemFragmentRequestChangeItemQuantity(_fCartItem: FCartItem, itemId: string, dQty: number): void {
    this.getDelegate<FCartDelegate>()?.onCartFragmentRequestChangeItemQuantity(this, this._cartId,
                                                           itemId, dQty);
  }

  onCartItemFragmentRequestRemoveItem(_fItem: FCartItem, itemId: string): void {
    this.getDelegate<FCartDelegate>()?.onCartFragmentRequestRemoveItem(this, this._cartId, itemId);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.PRODUCT:
    case T_DATA.CURRENCIES:
    case T_DATA.DRAFT_ORDERS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: PanelWrapper): void {
    let pMain = new ListPanel();
    render.wrapPanel(pMain);

    let p: Panel | SectionPanel | PanelWrapper;

    this._fItems.clear();
    let items = this.#getItems();
    if (items.length) {
      p = new SectionPanel(this.#renderTitle());
      pMain.pushPanel(p);
      for (let item of items) {
        let f = new FCartItem();
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
        let price = item.getPrice(this._currencyId);
        if (price) {
          total += price;
        }
      }

      if (total > 0) {
        p = new Panel();
        p.setClassName("tw:text-right");
        pMain.pushPanel(p);
        this.#renderTotal(total, p);
        pMain.pushSpace(1);

        p = new PanelWrapper();
        pMain.pushPanel(p);
        this._fBtnCheckout.attachRender(p);
        this._fBtnCheckout.render();
        pMain.pushSpace(2);
      }
    }
  }

  #getCart(): CartDataType | null {
    return this.getDataSource<FCartDataSource>()?.getCartForCartFragment(this, this._cartId) || null;
  }

  #getItems(): CartItem[] {
    let c = this.#getCart();
    let items = c ? c.getItems() : [];
    if (this._currencyId) {
      return items.filter(i => i.getPreferredCurrencyId() == this._currencyId);
    } else {
      return items;
    }
  }

  #getItemLayoutType(): symbol {
    let t: symbol;
    switch (this._tLayout) {
    case FCart.T_LAYOUT.RESERVE:
      t = FCartItem.T_LAYOUT.RESERVE;
      break;
    default:
      t = FCartItem.T_LAYOUT.ACTIVE;
      break;
    }
    return t;
  }

  #renderTitle(): string {
    if (this._currencyId) {
      let c = Exchange.getCurrency(this._currencyId);
      let s = _CFT_CART.TITLE;
      s = s.replace("__NAME__", this.#renderCurrencyName(c));
      return s;
    } else {
      return this._name;
    }
  }

  #renderCurrencyName(currency: Currency | null): string {
    if (currency) {
      let s = `__NAME__(__CODE__)`;
      s = s.replace("__NAME__", currency.getName() || "");
      s = s.replace("__CODE__", currency.getCode() || "");
      return s;
    } else {
      return "N/A";
    }
  }

  #renderTotal(value: number, panel: Panel): void {
    let c = Exchange.getCurrency(this._currencyId);
    if (c) {
      panel.replaceContent("Total: " + Utilities.renderPrice(c, value));
    }
  }

  #onCheckoutClicked(): void {
    this.getDelegate<FCartDelegate>()?.onCartFragmentRequestCheckout(this, this._cartId,
                                                 this._currencyId);
  }
};
