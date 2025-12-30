import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PSupplierOrderBase extends Panel {
  getCustomerNamePanel() { return null; }
  getCreationTimePanel() { return null; }
  getTimeInfoPanel() { return null };
  getUpdateTimePanel() { return null; }
  getStatusInfoPanel() { return null }
  getStatusPanel() { return null; }
  getItemInfosPanel() { return null; }
  getItemsPanel() { return null; }
  getExtraPricePanel() { return null; }
  getExtraRefundPanel() { return null; }
  getSubtotalPanel() { return null; }
  getShippingHandlingPanel() { return null; }
  getDiscountPanel() { return null; }
  getRefundPanel() { return null; }
  getTotalPriceInfoPanel() { return null; }
  getTotalPricePanel() { return null; }
  getShippingAddressBtnPanel() { return null; }
  getShippingAddressPanel() { return null; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PSupplierOrderBase = PSupplierOrderBase;
}
