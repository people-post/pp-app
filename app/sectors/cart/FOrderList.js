(function(cart) {
class FOrderList extends gui.DefaultLongList {
  isOrderSelected(orderId) { return this._currentId == orderId; }

  onCustomerOrderInfoFragmentRequestShowOrder(fOrderInfo, orderId) {
    this.switchToItem(orderId);
  }

  _createInfoFragment(id) {
    let f = new cart.FOrder();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setOrderId(id);
    return f;
  }

  _createItemView(itemId) {
    let v = new ui.View();
    let f = new cart.FvcOrder();
    f.setOrderId(itemId);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems() {
    if (this._isBatchLoading) {
      return;
    }
    this._isBatchLoading = true;
    let url = "/api/user/orders";
    if (this._ids.length) {
      url += "?before_id=" + this._ids[this._ids.length - 1];
    }
    plt.Api.asyncRawCall(url, r => this.#onOrdersRRR(r));
  }

  #onOrdersRRR(responseText) {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let orders = [];
      for (let o of response.data.orders) {
        orders.push(new dat.CustomerOrder(o));
      }

      if (orders.length) {
        for (let o of orders) {
          dba.Account.updateOrder(o);
          this._ids.push(o.getId());
        }
      } else {
        this._isIdsComplete = true;
      }
      this._fItems.onScrollFinished();
    }
  }
};

cart.FOrderList = FOrderList;
}(window.cart = window.cart || {}));
