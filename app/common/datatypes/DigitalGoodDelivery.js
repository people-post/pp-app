import { ProductDelivery } from './ProductDelivery.js';

export class DigitalGoodDelivery extends ProductDelivery {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DigitalGoodDelivery = DigitalGoodDelivery;
}