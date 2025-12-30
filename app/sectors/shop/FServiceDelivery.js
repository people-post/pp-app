
export class FServiceDelivery extends shop.FProductDelivery {};




// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FServiceDelivery = FServiceDelivery;
}
