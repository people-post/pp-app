import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PCartItemInfo extends Panel {
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pThumbnail = new PanelWrapper();
    this._pPrice = new Panel();
    this._pBtnDelete = new PanelWrapper();
  }

  getTitlePanel() { return this._pTitle; }
  getThumbnailPanel() { return this._pThumbnail; }
  getQuantityPanel() { return null; }
  getPricePanel() { return this._pPrice; }
  getDeleteBtnPanel() { return this._pBtnDelete; }
  getSaveForLaterBtnPanel() { return null; }
  getMoveToCartBtnPanel() { return null; }
};
