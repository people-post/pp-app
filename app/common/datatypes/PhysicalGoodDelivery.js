export class PhysicalGoodDelivery extends dat.ProductDelivery {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.PhysicalGoodDelivery = PhysicalGoodDelivery;
}