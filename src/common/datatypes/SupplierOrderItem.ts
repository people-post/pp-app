import { ServerDataObject } from './ServerDataObject.js';
import type { SupplierOrderItemData } from '../../types/backend2.js';

export class SupplierOrderItem extends ServerDataObject {
  protected _data: SupplierOrderItemData;

  constructor(data: SupplierOrderItemData) {
    super(data);
    this._data = data;
  }

  getDescription(): string | undefined {
    return this._data.product?.description;
  }

  getQuantity(): number | undefined {
    return this._data.product?.quantity;
  }

  getUnitPrice(): number | undefined {
    return this._data.product?.unit_price;
  }

  getState(): string | undefined {
    return this._data.state as string | undefined;
  }

  getStatus(): string | undefined {
    return (this._data.status as string | undefined) || (this._data.state as string | undefined);
  }
}

