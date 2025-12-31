
export class FPhysicalGoodDelivery extends shop.FGoodDelivery {};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FPhysicalGoodDelivery = FPhysicalGoodDelivery;
}
