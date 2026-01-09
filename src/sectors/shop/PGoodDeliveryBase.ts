import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PGoodDeliveryBase extends Panel {
  protected _pBtnAdd: PanelWrapper;
  protected _pProductCount: Panel;

  constructor() {
    super();
    this._pBtnAdd = new PanelWrapper();
    this._pProductCount = new Panel();
  }

  getAddBtnPanel(): PanelWrapper { return this._pBtnAdd; }
  getProductCountPanel(): Panel { return this._pProductCount; }
}
