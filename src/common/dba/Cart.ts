import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { CartItem } from '../datatypes/CartItem.js';
import { Cart as CartDataType } from '../datatypes/Cart.js';
import { glb } from '../../lib/framework/Global.js';

interface ApiResponse {
  error?: unknown;
  data?: {
    items?: unknown[];
  };
}

interface CartInterface {
  clear(): void;
  getCart(cartId: string): CartDataType | null;
  asyncAddItem(productId: string, currencyId: string | null, specifications: string[], quantity: number): void;
  asyncMoveItem(itemId: string, toCartId: string): void;
  asyncChangeItemQuantity(itemId: string, delta: number): void;
  asyncRemoveItem(cartId: string, itemId: string): void;
}

export class CartClass implements CartInterface {
  // Customer shopping cart
  // Draft orders
  #mCart: Map<string, CartDataType> | null = null;
  #isLoading = false;

  clear(): void {
    this.#mCart = null;
  }

  getCart(cartId: string): CartDataType | null {
    if (this.#mCart) {
      return this.#mCart.get(cartId) || null;
    } else {
      this.#asyncLoadCartItems();
    }
    return null;
  }

  #resetItems(dataList: unknown[]): void {
    this.clear();
    this.#mCart = new Map();
    for (const data of dataList) {
      const item = new CartItem(data as Record<string, unknown>);
      const cId = item.getCartId();
      if (cId && !this.#mCart.has(cId)) {
        this.#mCart.set(cId, new CartDataType());
      }
      if (cId && this.#mCart.has(cId)) {
        const id = item.getId();
        if (id !== undefined) {
          this.#mCart.get(cId)!.set(String(id), item);
        }
      }
    }
    FwkEvents.trigger(PltT_DATA.DRAFT_ORDERS, null);
  }

  #asyncLoadCartItems(): void {
    if (this.#isLoading) {
      return;
    }
    this.#isLoading = true;
    let url = '/api/cart/guest_draft_orders';
    if (window.dba?.Account?.isAuthenticated()) {
      url = '/api/cart/draft_orders';
    }
    glb.api?.asyncRawCall(url, (r) => this.#onLoadOrderItemsRRR(r), null);
  }

  #onLoadOrderItemsRRR(responseText: string): void {
    this.#onOrderItemsRRR(responseText);
    this.#isLoading = false;
  }

  asyncAddItem(productId: string, currencyId: string | null, specifications: string[], quantity: number): void {
    let url = '/api/cart/guest_add_item';
    if (window.dba?.Account?.isAuthenticated()) {
      url = '/api/cart/add_item';
    }
    const fd = new FormData();
    fd.append('product_id', productId);
    fd.append('preferred_currency_id', currencyId ? currencyId : '');
    for (const s of specifications) {
      fd.append('specifications', s);
    }
    fd.append('quantity', quantity.toString());
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOrderItemsRRR(r), null);
  }

  asyncMoveItem(itemId: string, toCartId: string): void {
    const url = '/api/cart/move_item';
    const fd = new FormData();
    fd.append('item_id', itemId);
    fd.append('to_cart', toCartId);
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOrderItemsRRR(r), null);
  }

  asyncRemoveItem(cartId: string, itemId: string): void {
    const c = this.getCart(cartId);
    const i = c ? c.get(itemId) : null;
    if (i) {
      this.asyncChangeItemQuantity(itemId, -i.getQuantity());
    }
  }

  asyncChangeItemQuantity(itemId: string, delta: number): void {
    let url = '/api/cart/guest_update_item';
    if (window.dba?.Account?.isAuthenticated()) {
      url = '/api/cart/update_item';
    }
    const fd = new FormData();
    fd.append('item_id', itemId);
    fd.append('quantity', delta.toString());
    glb.api?.asyncRawPost(url, fd, (r) => this.#onOrderItemsRRR(r), null);
  }

  #onOrderItemsRRR(responseText: string): void {
    const response = JSON.parse(responseText) as ApiResponse;
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data?.items) {
        this.#resetItems(response.data.items);
      }
    }
  }
}

export const Cart = new CartClass();

