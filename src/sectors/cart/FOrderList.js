import { View } from '../../lib/ui/controllers/views/View.js';
import { DefaultLongList } from '../../common/gui/DefaultLongList.js';
import { FOrder } from './FOrder.js';
import { FvcOrder } from './FvcOrder.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';
import { Account } from '../../common/dba/Account.js';

export class FOrderList extends DefaultLongList {
  isOrderSelected(orderId) { return this._currentId == orderId; }

  onCustomerOrderInfoFragmentRequestShowOrder(fOrderInfo, orderId) {
    this.switchToItem(orderId);
  }

  _createInfoFragment(id) {
    let f = new FOrder();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setOrderId(id);
    return f;
  }

  _createItemView(itemId) {
    let v = new View();
    let f = new FvcOrder();
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
    Api.asyncRawCall(url, r => this.#onOrdersRRR(r));
  }

  #onOrdersRRR(responseText) {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let orders = [];
      for (let o of response.data.orders) {
        orders.push(new CustomerOrder(o));
      }

      if (orders.length) {
        for (let o of orders) {
          Account.updateOrder(o);
          this._ids.push(o.getId());
        }
      } else {
        this._isIdsComplete = true;
      }
      this._fItems.onScrollFinished();
    }
  }
};
