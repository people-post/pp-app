export class SupplierOrderPrivate extends dat.SupplierOrderBase {
  getCustomerId() { return this._data.customer_id; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SupplierOrderPrivate = SupplierOrderPrivate;
}
