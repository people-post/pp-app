export class DigitalGoodDelivery extends dat.ProductDelivery {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DigitalGoodDelivery = DigitalGoodDelivery;
}