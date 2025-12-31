import { SupplierOrderBase } from './SupplierOrderBase.js';

export class SupplierOrderPrivate extends SupplierOrderBase {
  getCustomerId() { return this._data.customer_id; }
};


