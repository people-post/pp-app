import { ProductDelivery } from './ProductDelivery.js';

export class PhysicalGoodDelivery extends ProductDelivery {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.PhysicalGoodDelivery = PhysicalGoodDelivery;
}