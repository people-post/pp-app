import { ServerDataObject } from './ServerDataObject.js';
import { SupplierOrderItem } from './SupplierOrderItem.js';

export class SupplierOrderBase extends ServerDataObject {
  private _items: SupplierOrderItem[];

  constructor(data: Record<string, unknown>) {
    super(data);
    this._items = this.#initItems(data.items as Record<string, unknown>[] | undefined);
  }

  getCustomerId(): string | number | undefined {
    return this._data.customer_id as string | number | undefined;
  }

  getItems(): SupplierOrderItem[] {
    return this._items;
  }

  getShippingAddress(): unknown {
    return this._data.shipping_address;
  }

  getExtraPrice(): number | undefined {
    return this._data.extra_price as number | undefined;
  }

  getExtraRefund(): number | undefined {
    return this._data.extra_refund as number | undefined;
  }

  getSubtotal(): number | undefined {
    return this._data.subtotal as number | undefined;
  }

  getDiscount(): number | undefined {
    return this._data.discount as number | undefined;
  }

  getRefund(): number | undefined {
    return this._data.refund as number | undefined;
  }

  getShippingHandlingCost(): number | undefined {
    return this._data.shipping_handling_cost as number | undefined;
  }

  getTotal(): number | undefined {
    return this._data.total as number | undefined;
  }

  getCurrencyId(): string | number | undefined {
    return this._data.currency_id as string | number | undefined;
  }

  getState(): string | undefined {
    return this._data.state as string | undefined;
  }

  getStatus(): string | undefined {
    return (this._data.status as string | undefined) || (this._data.state as string | undefined);
  }

  getUpdateTime(): Date {
    const updatedAt = this._data.updated_at as number | undefined;
    return new Date((updatedAt || 0) * 1000);
  }

  size(): number {
    return this._items.length;
  }

  #initItems(dataList: Record<string, unknown>[] | undefined): SupplierOrderItem[] {
    const items: SupplierOrderItem[] = [];
    if (dataList) {
      for (const d of dataList) {
        items.push(new SupplierOrderItem(d));
      }
    }
    return items;
  }
}

