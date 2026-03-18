import { ServerDataObject } from './ServerDataObject.js';
import { SupplierOrderPublic } from './SupplierOrderPublic.js';
import type { CustomerOrderData } from '../../types/backend2.js';

export class CustomerOrder extends ServerDataObject {
  #items: SupplierOrderPublic[] = [];
  protected _data: CustomerOrderData;

  constructor(data: CustomerOrderData) {
    super(data);
    this._data = data;
    this.#items = this.#initItems(data.items || []);
  }

  getItems(): SupplierOrderPublic[] {
    return this.#items;
  }

  getShippingAddress(): unknown {
    return this._data.shipping_address;
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

  getTotalPrice(): number | undefined {
    return this._data.total as number | undefined;
  }

  getCurrencyId(): string | undefined {
    return this._data.currency_id;
  }

  getShopId(): string | undefined {
    return this._data.shop_id;
  }

  getState(): string | undefined {
    return this._data.state;
  }

  getStatus(): string | undefined {
    return (this._data.status as string | undefined) || (this._data.state as string | undefined);
  }

  getUpdateTime(): Date {
    return new Date((this._data.updated_at || 0) * 1000);
  }

  #initItems(dataList: unknown[]): SupplierOrderPublic[] {
    const items: SupplierOrderPublic[] = [];
    for (const d of dataList) {
      items.push(new SupplierOrderPublic(d as Record<string, unknown>));
    }
    return items;
  }
}

