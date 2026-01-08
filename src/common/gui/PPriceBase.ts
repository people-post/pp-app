import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPriceBase extends Panel {
  protected _pUnit: PanelWrapper;
  protected _pListPrice: Panel;
  protected _pSalesPrice: Panel;

  constructor() {
    super();
    this._pUnit = new PanelWrapper();
    this._pListPrice = new Panel();
    this._pSalesPrice = new Panel();
  }

  getUnitPanel(): PanelWrapper { return this._pUnit; }
  getListPricePanel(): Panel { return this._pListPrice; }
  getSalesPricePanel(): Panel { return this._pSalesPrice; }
}

export default PPriceBase;

