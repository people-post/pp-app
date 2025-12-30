
export class POrderBase extends ui.Panel {
  getShopNamePanel() { return null; }
  getSellerInfoPanel() { return null; }
  getOrderIdPanel() { return null; }
  getTimeInfoPanel() { return null; }
  getCreationTimePanel() { return null; }
  getStatusInfoPanel() { return null; }
  getStatusPanel() { return null; }
  getItemInfosPanel() { return null; }
  getItemsPanel() { return null; }
  getSubtotalPanel() { return null; }
  getShippingHandlingPanel() { return null; }
  getDiscountPanel() { return null; }
  getRefundPanel() { return null; }
  getTotalPanel() { return null; }
  getShippingAddressPanel() { return null; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cart = window.cart || {};
  window.cart.POrderBase = POrderBase;
}
