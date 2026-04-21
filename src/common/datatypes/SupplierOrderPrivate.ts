import { SupplierOrderBase } from './SupplierOrderBase.js';
import { Address } from './Address.js';
import type { SupplierOrderPrivateData } from '../../types/backend2.js';

export class SupplierOrderPrivate extends SupplierOrderBase<SupplierOrderPrivateData> {
  getCustomerId(): string {
    return this._data.customer_id;
  }

  getShippingAddress(): Address | null {
    // TODO: Implement
    return null;
  }
}

