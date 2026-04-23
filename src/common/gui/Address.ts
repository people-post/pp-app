import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { T_DATA } from '../plt/Events.js';
import type { Address as AddressDataType } from '../datatypes/Address.js';

export const CF_ADDRESS = {
  ON_CLICK : "CF_ADDRESS_1",
};

class PAddressBase extends Panel {
  getNicknamePanel(): Panel | null { return null; }
  getNamePanel(): Panel | null { return null; }
  getCountryPanel(): Panel | null { return null; }
  getStatePanel(): Panel | null { return null; }
  getCityPanel(): Panel | null { return null; }
  getZipcodePanel(): Panel | null { return null; }
  getLine1Panel(): Panel | null { return null; }
  getLine2Panel(): Panel | null { return null; }
  getEditBtnPanel(): PanelWrapper | null { return null; }
  getDeleteBtnPanel(): PanelWrapper | null { return null; }
}

const _CPT_ADDRESS: { MAIN: string } = {
  MAIN : `<div class="address-block tw:cursor-pointer">
  <table class="address">
    <tbody>
      <tr>
        <td class="tw:text-right">Nickname:</td>
        <td id="__ID_NICKNAME__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">Name:</td>
        <td id="__ID_NAME__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">Country:</td>
        <td id="__ID_COUNTRY__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">State/Province:</td>
        <td id="__ID_STATE__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">City:</td>
        <td id="__ID_CITY__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">Zipcode:</td>
        <td id="__ID_ZIPCODE__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">Line 1:</td>
        <td id="__ID_LINE1__"></td>
      </tr>
      <tr>
        <td class="tw:text-right">Line 2:</td>
        <td id="__ID_LINE2__"></td>
      </tr>
    </tbody>
  </table>
  <div class="tw:flex tw:justify-center">
    <div id="__ID_BTN_EDIT__"></div>
    <div id="__ID_BTN_DELETE__"></div>
  </div>
  </div>`,
};

class PAddress extends PAddressBase {
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

const _CPT_ADDRESS_SMALL: { MAIN: string } = {
  MAIN : `<div class="address-block tw:cursor-pointer">
    <div id="__ID_LINE1__"></div>
    <div id="__ID_LINE2__"></div>
    <div class="tw:flex tw:justify-start">
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

class PAddressSmall extends PAddressBase {
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

export interface AddressDataSource {
  getDataForGuiAddress(f: Address, id: string | null): AddressDataType | null;
}

export interface AddressDelegate {
  onClickInAddressFragment(f: Address, id: string | null): void;
  onAddressFragmentRequestEdit(f: Address, id: string | null): void;
  onAddressFragmentRequestDelete(f: Address, id: string | null): void;
}

export class Address extends Fragment {
  static T_LAYOUT = {
    LARGE : Symbol(),
    SMALL: Symbol(),
  };

  #fBtnEdit: Button;
  #fBtnDelete: Button;
  #addressId: string | null = null;
  #tLayout: symbol | null = null;

  constructor() {
    super();
    this.#fBtnEdit = new Button();
    this.#fBtnEdit.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#fBtnEdit.setName("Edit");
    this.#fBtnEdit.setDelegate(this);
    this.setChild("btnEdit", this.#fBtnEdit);

    this.#fBtnDelete = new Button();
    this.#fBtnDelete.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this.#fBtnDelete.setName("Delete...");
    this.#fBtnDelete.setThemeType(Button.T_THEME.DANGER);
    this.#fBtnDelete.setDelegate(this);
    this.setChild("btnDelete", this.#fBtnDelete);
  }

  getAddressId(): string | null { return this.#addressId; }

  setAddressId(id: string | null): void { this.#addressId = id; }
  setLayoutType(t: symbol | null): void { this.#tLayout = t; }

  onSimpleButtonClicked(fBtn: Button): void {
    switch (fBtn) {
    case this.#fBtnEdit:
      this.#onEdit();
      break;
    case this.#fBtnDelete:
      this.#onDelete();
      break;
    default:
      break;
    }
  }

  action(type: symbol | string, ...args: unknown[]): void {
    switch (type) {
    case CF_ADDRESS.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.ADDRESS:
      if ((data as { getId(): string }).getId() == this.#addressId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: unknown): void {
    const addr = this.getDataSource<AddressDataSource>()
        ?.getDataForGuiAddress(this, this.#addressId);
    if (!addr) {
      return;
    }
    const panel = this.#createPanel();
    panel.setAttribute("data-pp-action", String(CF_ADDRESS.ON_CLICK));
    (render as { wrapPanel(p: unknown): void }).wrapPanel(panel);
    let p = panel.getNicknamePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getNickname()));
    }
    p = panel.getNamePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getName()));
    }
    p = panel.getCountryPanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getCountry()));
    }
    p = panel.getStatePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getState()));
    }
    p = panel.getCityPanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getCity()));
    }
    p = panel.getZipcodePanel();
    if (p) {
      p.replaceContent(this.#toString(addr.getZipcode()));
    }
    p = panel.getLine1Panel();
    if (p) {
      p.replaceContent(this.#toString(addr.getLine(0)));
    }
    p = panel.getLine2Panel();
    if (p) {
      p.replaceContent(this.#toString(addr.getLine(1)));
    }
    p = panel.getEditBtnPanel();
    if (p) {
      this.#fBtnEdit.attachRender(p);
      this.#fBtnEdit.render();
    }
    p = panel.getDeleteBtnPanel();
    if (p) {
      this.#fBtnDelete.attachRender(p);
      this.#fBtnDelete.render();
    }
  }

  #createPanel(): PAddress | PAddressSmall {
    let p: PAddress | PAddressSmall;
    switch (this.#tLayout) {
    case Address.T_LAYOUT.SMALL:
      p = new PAddressSmall();
      break;
    default:
      p = new PAddress();
      break;
    }
    return p;
  }

  #toString(s: string | null): string { return s ? s : ""; }

  #onClick(): void {
    this.getDelegate<AddressDelegate>()
        ?.onClickInAddressFragment(this, this.#addressId);
  }

  #onEdit(): void {
    this.getDelegate<AddressDelegate>()
        ?.onAddressFragmentRequestEdit(this, this.#addressId);
  }

  #onDelete(): void {
    this.getDelegate<AddressDelegate>()
        ?.onAddressFragmentRequestDelete(this, this.#addressId);
  }
}

