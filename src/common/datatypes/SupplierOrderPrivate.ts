import { SupplierOrderBase } from './SupplierOrderBase.js';
import type { SupplierOrderPrivateData } from '../../types/backend2.js';

export class SupplierOrderPrivate extends SupplierOrderBase {
  protected declare _data: SupplierOrderPrivateData;

  getCustomerId(): string | undefined {
    return this._data.customer_id as string | undefined;
  }
}

