import { View } from '../../lib/ui/controllers/views/View.js';
import { SupplierOrderPrivate } from '../../common/datatypes/SupplierOrderPrivate.js';
import { DefaultLongList } from '../../common/gui/DefaultLongList.js';
import { FSupplierOrder } from './FSupplierOrder.js';
import { FvcSupplierOrder } from './FvcSupplierOrder.js';
import { Shop } from '../../common/dba/Shop.js';
import { api } from '../../common/plt/Api.js';

export class FSupplierOrderList extends DefaultLongList {
  isOrderSelected(orderId: string): boolean { return this._currentId == orderId; }

  onSupplierOrderFragmentRequestShowOrder(_fOrderInfo: FSupplierOrder, orderId: string): void {
    this.switchToItem(orderId);
  }

  _createInfoFragment(id: string): FSupplierOrder {
    let f = new FSupplierOrder();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setOrderId(id);
    return f;
  }

  _createItemView(itemId: string): View {
    let v = new View();
    let f = new FvcSupplierOrder();
    f.setOrderId(itemId);
    v.setContentFragment(f);
    return v;
  }

  _asyncLoadItems(): void {
    if (this._isBatchLoading) {
      return;
    }
    this._isBatchLoading = true;
    let url = "api/shop/orders";
    if (this._ids.length) {
      url += "?before_id=" + this._ids[this._ids.length - 1];
    }
    api.asyncRawCall(url, (r: string) => this.#onOrdersRRR(r));
  }

  #onOrdersRRR(responseText: string): void {
    this._isBatchLoading = false;
    let response = JSON.parse(responseText);
    if (response.error) {
      this._owner.onRemoteErrorInFragment(this, response.error);
    } else {
      let orders: SupplierOrderPrivate[] = [];
      for (let o of response.data.supplier_orders) {
        orders.push(new SupplierOrderPrivate(o));
      }

      if (orders.length) {
        for (let o of orders) {
          Shop.updateOrder(o);
          this._ids.push(o.getId());
        }
      } else {
        this._isIdsComplete = true;
      }
      this._fItems.onScrollFinished();
    }
  }
}
