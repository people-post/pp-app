export class SupplierOrderPublic extends dat.SupplierOrderBase {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SupplierOrderPublic = SupplierOrderPublic;
}
