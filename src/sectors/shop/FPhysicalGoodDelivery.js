import { FGoodDelivery } from './FGoodDelivery.js';

export class FPhysicalGoodDelivery extends FGoodDelivery {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FPhysicalGoodDelivery = FPhysicalGoodDelivery;
}
