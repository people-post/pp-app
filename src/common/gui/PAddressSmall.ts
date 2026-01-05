import { PAddressBase } from './PAddressBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';

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
} as const;

export class PAddressSmall extends PAddressBase {
  _pCountry: Panel;
  _pState: Panel;
  _pCity: Panel;
  _pZipcode: Panel;
  _pLine1: Panel;
  _pLine2: Panel;

  constructor() {
    super();
    this._pCountry = new Panel();
    this._pState = new Panel();
    this._pCity = new Panel();
    this._pZipcode = new Panel();
    this._pLine1 = new Panel();
    this._pLine2 = new Panel();
  }

  getCountryPanel(): Panel { return this._pCountry; }
  getStatePanel(): Panel { return this._pState; }
  getCityPanel(): Panel { return this._pCity; }
  getZipcodePanel(): Panel { return this._pZipcode; }
  getLine1Panel(): Panel { return this._pLine1; }
  getLine2Panel(): Panel { return this._pLine2; }

  _renderFramework(): string {
    let s: string = _CPT_ADDRESS_SMALL.MAIN;
    s = s.replace("__ID_COUNTRY__", this._getSubElementId("CY"));
    s = s.replace("__ID_STATE__", this._getSubElementId("S"));
    s = s.replace("__ID_CITY__", this._getSubElementId("C"));
    s = s.replace("__ID_ZIPCODE__", this._getSubElementId("Z"));
    s = s.replace("__ID_LINE1__", this._getSubElementId("L1"));
    s = s.replace("__ID_LINE2__", this._getSubElementId("L2"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pCountry.attach(this._getSubElementId("CY"));
    this._pState.attach(this._getSubElementId("S"));
    this._pCity.attach(this._getSubElementId("C"));
    this._pZipcode.attach(this._getSubElementId("Z"));
    this._pLine1.attach(this._getSubElementId("L1"));
    this._pLine2.attach(this._getSubElementId("L2"));
  }
}

