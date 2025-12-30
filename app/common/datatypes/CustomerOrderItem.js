import { SupplierOrderPublic } from './SupplierOrderPublic.js';

export class CustomerOrderItem extends SupplierOrderPublic {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.CustomerOrderItem = CustomerOrderItem;
}