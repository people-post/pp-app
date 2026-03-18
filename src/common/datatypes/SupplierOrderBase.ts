import { ServerDataObject } from './ServerDataObject.js';
import { SupplierOrderItem } from './SupplierOrderItem.js';
import type { SupplierOrderBaseData, SupplierOrderItemData } from '../../types/backend2.js';

export class SupplierOrderBase<T extends SupplierOrderBaseData> extends ServerDataObject<T> {
  private _items: SupplierOrderItem[];

  constructor(data: T) {
    super(data);
    this._items = this.#initItems(data.items);
  }

  getItems(): SupplierOrderItem[] {
    return this._items;
  }

  getExtraPrice(): number {
    return this._data.extra_price;
  }

  getExtraRefund(): number {
    return this._data.extra_refund;
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

  getTotal(): number {
    return this._data.total;
  }

  getCurrencyId(): string {
    return this._data.currency_id;
  }

  getState(): string | null {
    return this._data.state;
  }

  getStatus(): string | null {
    return this._data.status ?? this._data.state;
  }

  getUpdateTime(): Date {
    const updatedAt = this._data.updated_at;
    return new Date((updatedAt ?? 0) * 1000);
  }

  size(): number {
    return this._items.length;
  }

  #initItems(dataList: SupplierOrderItemData[]): SupplierOrderItem[] {
    const items: SupplierOrderItem[] = [];
    for (const d of dataList) {
      items.push(new SupplierOrderItem(d));
    }
    return items;
  }
}

