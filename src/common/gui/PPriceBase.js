import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PPriceBase extends Panel {
  constructor() {
    super();
    this._pUnit = new PanelWrapper();
    this._pListPrice = new Panel();
    this._pSalesPrice = new Panel();
  }

  getUnitPanel() { return this._pUnit; }
  getListPricePanel() { return this._pListPrice; }
  getSalesPricePanel() { return this._pSalesPrice; }
}

