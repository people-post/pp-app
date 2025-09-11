(function(dba) {
dba.Cart = function() {
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
      let item = new dat.CartItem(data);
      let cId = item.getCartId();
      if (!_mCart.has(cId)) {
        _mCart.set(cId, new dat.Cart());
      }
      _mCart.get(cId).set(item.getId(), item);
    }
    fwk.Events.trigger(plt.T_DATA.DRAFT_ORDERS);
  }

  function __asyncLoadCartItems() {
    if (_isLoading) {
      return;
    }
    _isLoading = true;
    let url = "/api/cart/guest_draft_orders";
    if (dba.Account.isAuthenticated()) {
      url = "/api/cart/draft_orders";
    }
    plt.Api.asyncRawCall(url, r => __onLoadOrderItemsRRR(r));
  }

  function __onLoadOrderItemsRRR(responseText) {
    __onOrderItemsRRR(responseText);
    _isLoading = false;
  }

  function _asyncAddItem(productId, currencyId, specifications, quantity) {
    let url = "/api/cart/guest_add_item";
    if (dba.Account.isAuthenticated()) {
      url = "/api/cart/add_item";
    }
    let fd = new FormData();
    fd.append('product_id', productId);
    fd.append('preferred_currency_id', currencyId ? currencyId : "");
    for (let s of specifications) {
      fd.append('specifications', s);
    }
    fd.append('quantity', quantity);
    plt.Api.asyncRawPost(url, fd, r => __onOrderItemsRRR(r));
  }

  function _asyncMoveItem(itemId, toCartId) {
    let url = "/api/cart/move_item";
    let fd = new FormData();
    fd.append('item_id', itemId);
    fd.append('to_cart', toCartId);
    plt.Api.asyncRawPost(url, fd, r => __onOrderItemsRRR(r));
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
    if (dba.Account.isAuthenticated()) {
      url = "/api/cart/update_item";
    }
    let fd = new FormData();
    fd.append('item_id', itemId);
    fd.append('quantity', delta);
    plt.Api.asyncRawPost(url, fd, r => __onOrderItemsRRR(r));
  }

  function __onOrderItemsRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
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
}(window.dba = window.dba || {}));
