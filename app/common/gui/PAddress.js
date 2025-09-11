(function(gui) {
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

class PAddress extends gui.PAddressBase {
  constructor() {
    super();
    this._pNickname = new ui.Panel();
    this._pName = new ui.Panel();
    this._pCountry = new ui.Panel();
    this._pState = new ui.Panel();
    this._pCity = new ui.Panel();
    this._pZipcode = new ui.Panel();
    this._pLine1 = new ui.Panel();
    this._pLine2 = new ui.Panel();
    this._pBtnEdit = new ui.PanelWrapper();
    this._pBtnDelete = new ui.PanelWrapper();
  }

  getNicknamePanel() { return this._pNickname; }
  getNamePanel() { return this._pName; }
  getCountryPanel() { return this._pCountry; }
  getStatePanel() { return this._pState; }
  getCityPanel() { return this._pCity; }
  getZipcodePanel() { return this._pZipcode; }
  getLine1Panel() { return this._pLine1; }
  getLine2Panel() { return this._pLine2; }
  getEditBtnPanel() { return this._pBtnEdit; }
  getDeleteBtnPanel() { return this._pBtnDelete; }

  _renderFramework() {
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

  _onFrameworkDidAppear() {
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
};

gui.PAddress = PAddress;
}(window.gui = window.gui || {}));
