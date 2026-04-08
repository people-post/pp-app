import { View } from '../../lib/ui/controllers/views/View.js';
import { DefaultLongList } from '../../common/gui/DefaultLongList.js';
import { FOrder } from './FOrder.js';
import { FvcOrder } from './FvcOrder.js';
import { CustomerOrder } from '../../common/datatypes/CustomerOrder.js';
import { Api } from '../../common/plt/Api.js';
import { Account } from '../../common/dba/Account.js';
import { CustomerOrderData } from '../../types/backend2.js';
import type { RemoteError } from '../../types/basic.js';

interface ApiOrdersResponse {
  error?: RemoteError;
  data?: { orders?: CustomerOrderData[] };
}

export class FOrderList extends DefaultLongList {
  isOrderSelected(orderId: string): boolean { return this._currentId == orderId; }

  onCustomerOrderInfoFragmentRequestShowOrder(_fOrderInfo: FOrder, orderId: string): void {
    this.switchToItem(orderId);
  }

  _createInfoFragment(id: string): FOrder {
    let f = new FOrder();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setOrderId(id);
    return f;
  }

  _createItemView(itemId: string): View {
    let v = new View();
    let f = new FvcOrder();
    f.setOrderId(itemId);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems(): void {
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

  #onOrdersRRR(responseText: string): void {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText) as ApiOrdersResponse;
    if (response.error) {
      this.onRemoteErrorInFragment(this, response.error);
    } else {
      let orders: CustomerOrder[] = [];
      if (response.data?.orders) {
        for (let o of response.data.orders) {
          orders.push(new CustomerOrder(o));
        }
      }

      if (orders.length) {
        for (let o of orders) {
          let id = o.getId();
          if (!id) {
            continue;
          }
          Account.updateOrder(o);
          this._ids.push(id);
        }
      } else {
        this._isIdsComplete = true;
      }
      this._fItems.onScrollFinished();
    }
  }
};
