export class CustomerOrderItem extends dat.SupplierOrderPublic {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.CustomerOrderItem = CustomerOrderItem;
}