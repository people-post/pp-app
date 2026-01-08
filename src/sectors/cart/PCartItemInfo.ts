import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PCartItemInfo extends Panel {
  protected _pTitle: Panel;
  protected _pThumbnail: PanelWrapper;
  protected _pPrice: Panel;
  protected _pBtnDelete: PanelWrapper;

  constructor() {
    super();
    this._pTitle = new Panel();
    this._pThumbnail = new PanelWrapper();
    this._pPrice = new Panel();
    this._pBtnDelete = new PanelWrapper();
  }

  getTitlePanel(): Panel { return this._pTitle; }
  getThumbnailPanel(): PanelWrapper { return this._pThumbnail; }
  getQuantityPanel(): Panel | null { return null; }
  getPricePanel(): Panel { return this._pPrice; }
  getDeleteBtnPanel(): PanelWrapper { return this._pBtnDelete; }
  getSaveForLaterBtnPanel(): PanelWrapper | null { return null; }
  getMoveToCartBtnPanel(): PanelWrapper | null { return null; }
}
