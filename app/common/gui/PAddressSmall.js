(function(gui) {
const _CPT_ADDRESS_SMALL = {
  MAIN : `<div class="address-block clickable">
    <div id="__ID_LINE1__"></div>
    <div id="__ID_LINE2__"></div>
    <div class="flex flex-start">
      <div id="__ID_CITY__"></div>
      <div>,&nbsp;</div>
      <div id="__ID_STATE__"></div>
      <div>&nbsp;</div>
      <div id="__ID_ZIPCODE__"></div>
      <div>,&nbsp;</div>
      <div id="__ID_COUNTRY__"></div> 
    </div> 
  </div>`,
};

class PAddressSmall extends gui.PAddressBase {
  constructor() {
    super();
    this._pCountry = new ui.Panel();
    this._pState = new ui.Panel();
    this._pCity = new ui.Panel();
    this._pZipcode = new ui.Panel();
    this._pLine1 = new ui.Panel();
    this._pLine2 = new ui.Panel();
  }

  getCountryPanel() { return this._pCountry; }
  getStatePanel() { return this._pState; }
  getCityPanel() { return this._pCity; }
  getZipcodePanel() { return this._pZipcode; }
  getLine1Panel() { return this._pLine1; }
  getLine2Panel() { return this._pLine2; }

  _renderFramework() {
    let s = _CPT_ADDRESS_SMALL.MAIN;
    s = s.replace("__ID_COUNTRY__", this._getSubElementId("CY"));
    s = s.replace("__ID_STATE__", this._getSubElementId("S"));
    s = s.replace("__ID_CITY__", this._getSubElementId("C"));
    s = s.replace("__ID_ZIPCODE__", this._getSubElementId("Z"));
    s = s.replace("__ID_LINE1__", this._getSubElementId("L1"));
    s = s.replace("__ID_LINE2__", this._getSubElementId("L2"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pCountry.attach(this._getSubElementId("CY"));
    this._pState.attach(this._getSubElementId("S"));
    this._pCity.attach(this._getSubElementId("C"));
    this._pZipcode.attach(this._getSubElementId("Z"));
    this._pLine1.attach(this._getSubElementId("L1"));
    this._pLine2.attach(this._getSubElementId("L2"));
  }
};

gui.PAddressSmall = PAddressSmall;
}(window.gui = window.gui || {}));
