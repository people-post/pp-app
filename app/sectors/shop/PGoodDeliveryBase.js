import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PGoodDeliveryBase extends Panel {
  constructor() {
    super();
    this._pBtnAdd = new PanelWrapper();
    this._pProductCount = new Panel();
  }

  getAddBtnPanel() { return this._pBtnAdd; }
  getProductCountPanel() { return this._pProductCount; }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.PGoodDeliveryBase = PGoodDeliveryBase;
}
