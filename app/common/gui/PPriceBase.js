(function(gui) {
class PPriceBase extends ui.Panel {
  constructor() {
    super();
    this._pUnit = new ui.PanelWrapper();
    this._pListPrice = new ui.Panel();
    this._pSalesPrice = new ui.Panel();
  }

  getUnitPanel() { return this._pUnit; }
  getListPricePanel() { return this._pListPrice; }
  getSalesPricePanel() { return this._pSalesPrice; }
};

gui.PPriceBase = PPriceBase;
}(window.gui = window.gui || {}));