import { SupplierOrderBase } from './SupplierOrderBase.js';
import type { SupplierOrderPrivateData } from '../../types/backend2.js';

export class SupplierOrderPrivate extends SupplierOrderBase<SupplierOrderPrivateData> {
  getCustomerId(): string {
    return this._data.customer_id;
  }
}

