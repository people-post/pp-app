import { SupplierOrderBase } from './SupplierOrderBase.js';

export class SupplierOrderPrivate extends SupplierOrderBase {
  getCustomerId() { return this._data.customer_id; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SupplierOrderPrivate = SupplierOrderPrivate;
}
