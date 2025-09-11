(function(dat) {
class SupplierOrderPrivate extends dat.SupplierOrderBase {
  getCustomerId() { return this._data.customer_id; }
};

dat.SupplierOrderPrivate = SupplierOrderPrivate;
}(window.dat = window.dat || {}));
