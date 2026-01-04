import { PAddressBase } from './PAddressBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

const _CPT_ADDRESS = {
  MAIN : `<div class="address-block clickable">
  <table class="address">
    <tbody>
      <tr>
        <td class="right-align">Nickname:</td>
        <td id="__ID_NICKNAME__"></td>
      </tr>
      <tr>
        <td class="right-align">Name:</td>
        <td id="__ID_NAME__"></td>
      </tr>
      <tr>
        <td class="right-align">Country:</td>
        <td id="__ID_COUNTRY__"></td>
      </tr>
      <tr>
        <td class="right-align">State/Province:</td>
        <td id="__ID_STATE__"></td>
      </tr>
      <tr>
        <td class="right-align">City:</td>
        <td id="__ID_CITY__"></td>
      </tr>
      <tr>
        <td class="right-align">Zipcode:</td>
        <td id="__ID_ZIPCODE__"></td>
      </tr>
      <tr>
        <td class="right-align">Line 1:</td>
        <td id="__ID_LINE1__"></td>
      </tr>
      <tr>
        <td class="right-align">Line 2:</td>
        <td id="__ID_LINE2__"></td>
      </tr>
    </tbody>
  </table>
  <div class="flex flex-center">
    <div id="__ID_BTN_EDIT__"></div>
    <div id="__ID_BTN_DELETE__"></div>
  </div>
  </div>`,
};

export class PAddress extends PAddressBase {
  _pNickname: Panel;
  _pName: Panel;
  _pCountry: Panel;
  _pState: Panel;
  _pCity: Panel;
  _pZipcode: Panel;
  _pLine1: Panel;
  _pLine2: Panel;
  _pBtnEdit: PanelWrapper;
  _pBtnDelete: PanelWrapper;

  constructor() {
    super();
    this._pNickname = new Panel();
    this._pName = new Panel();
    this._pCountry = new Panel();
    this._pState = new Panel();
    this._pCity = new Panel();
    this._pZipcode = new Panel();
    this._pLine1 = new Panel();
    this._pLine2 = new Panel();
    this._pBtnEdit = new PanelWrapper();
    this._pBtnDelete = new PanelWrapper();
  }

  getNicknamePanel(): Panel { return this._pNickname; }
  getNamePanel(): Panel { return this._pName; }
  getCountryPanel(): Panel { return this._pCountry; }
  getStatePanel(): Panel { return this._pState; }
  getCityPanel(): Panel { return this._pCity; }
  getZipcodePanel(): Panel { return this._pZipcode; }
  getLine1Panel(): Panel { return this._pLine1; }
  getLine2Panel(): Panel { return this._pLine2; }
  getEditBtnPanel(): PanelWrapper { return this._pBtnEdit; }
  getDeleteBtnPanel(): PanelWrapper { return this._pBtnDelete; }

  _renderFramework(): string {
    let s = _CPT_ADDRESS.MAIN;
    s = s.replace("__ID_NICKNAME__", this._getSubElementId("NN"));
    s = s.replace("__ID_NAME__", this._getSubElementId("N"));
    s = s.replace("__ID_COUNTRY__", this._getSubElementId("CY"));
    s = s.replace("__ID_STATE__", this._getSubElementId("S"));
    s = s.replace("__ID_CITY__", this._getSubElementId("C"));
    s = s.replace("__ID_ZIPCODE__", this._getSubElementId("Z"));
    s = s.replace("__ID_LINE1__", this._getSubElementId("L1"));
    s = s.replace("__ID_LINE2__", this._getSubElementId("L2"));
    s = s.replace("__ID_BTN_EDIT__", this._getSubElementId("E"));
    s = s.replace("__ID_BTN_DELETE__", this._getSubElementId("D"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this._pNickname.attach(this._getSubElementId("NN"));
    this._pName.attach(this._getSubElementId("N"));
    this._pCountry.attach(this._getSubElementId("CY"));
    this._pState.attach(this._getSubElementId("S"));
    this._pCity.attach(this._getSubElementId("C"));
    this._pZipcode.attach(this._getSubElementId("Z"));
    this._pLine1.attach(this._getSubElementId("L1"));
    this._pLine2.attach(this._getSubElementId("L2"));
    this._pBtnEdit.attach(this._getSubElementId("E"));
    this._pBtnDelete.attach(this._getSubElementId("D"));
  }
}

