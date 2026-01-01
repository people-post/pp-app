import { ServerDataObject } from './ServerDataObject.js';
import { SupplierOrderPublic } from './SupplierOrderPublic.js';

export class CustomerOrder extends ServerDataObject {
  constructor(data) {
    super(data);
    this._items = this.#initItems(data.items);
  }

  getItems() { return this._items; }
  getShippingAddress() { return this._data.shipping_address; }
  getSubtotal() { return this._data.subtotal; }
  getDiscount() { return this._data.discount; }
  getRefund() { return this._data.refund; }
  getShippingHandlingCost() { return this._data.shipping_handling_cost; }
  getTotalPrice() { return this._data.total; }
  getCurrencyId() { return this._data.currency_id; }
  getShopId() { return this._data.shop_id; }
  getState() { return this._data.state; }
  getStatus() {
    return this._data.status ? this._data.status : this._data.state;
  }
  getUpdateTime() { return new Date(this._data.updated_at * 1000); }

  #initItems(dataList) {
    let items = [];
    for (let d of dataList) {
      items.push(new SupplierOrderPublic(d));
    }
    return items;
  }
};
