import { FProductDelivery } from './FProductDelivery.js';

export class FServiceDelivery extends FProductDelivery {};




// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceDelivery = FServiceDelivery;
}
