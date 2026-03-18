import { ServerDataObject } from './ServerDataObject.js';
import { CustomerOrderItem } from './CustomerOrderItem.js';
import type { CustomerOrderData, CustomerOrderItemData } from '../../types/backend2.js';

export class CustomerOrder extends ServerDataObject<CustomerOrderData> {
  #items: CustomerOrderItem[] | undefined = undefined;

  getItems(): CustomerOrderItem[] {
    if (this.#items) {
      return this.#items;
    }

    // Lazy initialization
    if (this._data.items) {
      this.#items = this.#initItems(this._data.items);
    } else {
      this.#items = [];
    }
    return this.#items;
  }

  getShippingAddress(): unknown {
    return this._data.shipping_address;
  }

  getSubtotal(): number {
    return this._data.subtotal;
  }

  getDiscount(): number {
    return this._data.discount;
  }

  getRefund(): number {
    return this._data.refund;
  }

  getShippingHandlingCost(): number {
    return this._data.shipping_handling_cost;
  }

  getTotalPrice(): number {
    return this._data.total;
  }

  getCurrencyId(): string {
    return this._data.currency_id;
  }

  getShopId(): string | null {
    return this._data.shop_id;
  }

  getState(): string | null {
    return this._data.state;
  }

  getStatus(): string | null {
    return this._data.status ?? this._data.state;
  }

  getUpdateTime(): Date {
    return new Date((this._data.updated_at || 0) * 1000);
  }

  #initItems(dataList: CustomerOrderItemData[]): CustomerOrderItem[] {
    const items: CustomerOrderItem[] = [];
    for (const d of dataList) {
      items.push(new CustomerOrderItem(d));
    }
    return items;
  }
}

