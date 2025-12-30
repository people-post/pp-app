import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';
import { Account } from './Account.js';
import { CartItem } from '../datatypes/CartItem.js';
import { Cart } from '../datatypes/Cart.js';

export const Cart = function() {
  // Customer shopping cart
  // Draft orders
  let _mCart = null;
  let _isLoading = false;

  function _clear() { _mCart = null; }

  function _getCart(cartId) {
    if (_mCart) {
      return _mCart.get(cartId);
    } else {
      __asyncLoadCartItems();
    }
    return null;
  }

  function __getCarts() {
    if (_mCart) {
      return _mCart.values();
    } else {
      __asyncLoadCartItems();
    }
    return [];
  }

  function __resetItems(dataList) {
    _clear();
    _mCart = new Map();
    for (let data of dataList) {
      let item = new CartItem(data);
      let cId = item.getCartId();
      if (!_mCart.has(cId)) {
        _mCart.set(cId, new Cart());
      }
      _mCart.get(cId).set(item.getId(), item);
    }
    FwkEvents.trigger(PltT_DATA.DRAFT_ORDERS);
  }

  function __asyncLoadCartItems() {
    if (_isLoading) {
      return;
    }
    _isLoading = true;
    let url = "/api/cart/guest_draft_orders";
    if (Account.isAuthenticated()) {
      url = "/api/cart/draft_orders";
    }
    api.asyncRawCall(url, r => __onLoadOrderItemsRRR(r));
  }

  function __onLoadOrderItemsRRR(responseText) {
    __onOrderItemsRRR(responseText);
    _isLoading = false;
  }

  function _asyncAddItem(productId, currencyId, specifications, quantity) {
    let url = "/api/cart/guest_add_item";
    if (Account.isAuthenticated()) {
      url = "/api/cart/add_item";
    }
    let fd = new FormData();
    fd.append('product_id', productId);
    fd.append('preferred_currency_id', currencyId ? currencyId : "");
    for (let s of specifications) {
      fd.append('specifications', s);
    }
    fd.append('quantity', quantity);
    api.asyncRawPost(url, fd, r => __onOrderItemsRRR(r));
  }

  function _asyncMoveItem(itemId, toCartId) {
    let url = "/api/cart/move_item";
    let fd = new FormData();
    fd.append('item_id', itemId);
    fd.append('to_cart', toCartId);
    api.asyncRawPost(url, fd, r => __onOrderItemsRRR(r));
  }

  function _asyncRemoveItem(cartId, itemId) {
    let c = _getCart(cartId);
    let i = c ? c.get(itemId) : null;
    if (i) {
      _asyncChangeItemQuantity(itemId, -i.getQuantity());
    }
  }

  function _asyncChangeItemQuantity(itemId, delta) {
    let url = "/api/cart/guest_update_item";
    if (Account.isAuthenticated()) {
      url = "/api/cart/update_item";
    }
    let fd = new FormData();
    fd.append('item_id', itemId);
    fd.append('quantity', delta);
    api.asyncRawPost(url, fd, r => __onOrderItemsRRR(r));
  }

  function __onOrderItemsRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      __resetItems(response.data.items);
    }
  }

  return {
    clear : _clear,
    getCart : _getCart,
    asyncAddItem : _asyncAddItem,
    asyncMoveItem : _asyncMoveItem,
    asyncChangeItemQuantity : _asyncChangeItemQuantity,
    asyncRemoveItem : _asyncRemoveItem,
  };
}();
}();

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dba = window.dba || {};
  window.dba.Cart = Cart;
}
