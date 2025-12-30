import { SupplierOrderBase } from './SupplierOrderBase.js';

export class SupplierOrderPublic extends SupplierOrderBase {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.SupplierOrderPublic = SupplierOrderPublic;
}
