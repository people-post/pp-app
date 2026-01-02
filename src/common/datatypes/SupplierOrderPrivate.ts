import { SupplierOrderBase } from './SupplierOrderBase.js';

interface SupplierOrderPrivateData {
  customer_id?: string;
  [key: string]: unknown;
}

export class SupplierOrderPrivate extends SupplierOrderBase {
  protected declare _data: SupplierOrderPrivateData;

  getCustomerId(): string | undefined {
    return this._data.customer_id as string | undefined;
  }
}

