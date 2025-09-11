(function(dat) {
class SupplierOrderBase extends dat.ServerDataObject {
  constructor(data) {
    super(data);
    this._items = this.#initItems(data.items);
  }

  getCustomerId() { return this._data.customer_id; }
  getItems() { return this._items; }
  getShippingAddress() { return this._data.shipping_address; }
  getExtraPrice() { return this._data.extra_price; }
  getExtraRefund() { return this._data.extra_refund; }
  getSubtotal() { return this._data.subtotal; }
  getDiscount() { return this._data.discount; }
  getRefund() { return this._data.refund; }
  getShippingHandlingCost() { return this._data.shipping_handling_cost; }
  getTotal() { return this._data.total; }
  getCurrencyId() { return this._data.currency_id; }
  getState() { return this._data.state; }
  getStatus() {
    return this._data.status ? this._data.status : this._data.state;
  }
  getUpdateTime() { return new Date(this._data.updated_at * 1000); }

  size() { return this._items.length; }

  #initItems(dataList) {
    let items = [];
    for (let d of dataList) {
      items.push(new dat.SupplierOrderItem(d));
    }
    return items;
  }
};

dat.SupplierOrderBase = SupplierOrderBase;
}(window.dat = window.dat || {}));
