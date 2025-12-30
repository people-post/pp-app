import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { PAddress } from './PAddress.js';
import { PAddressSmall } from './PAddressSmall.js';

export const CF_ADDRESS = {
  ON_CLICK : Symbol(),
};

export class Address extends Fragment {
  static T_LAYOUT = {
    LARGE : Symbol(),
    SMALL: Symbol(),
  };

  constructor() {
    super();
    this._fBtnEdit = new Button();
    this._fBtnEdit.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnEdit.setName("Edit");
    this._fBtnEdit.setDelegate(this);
    this.setChild("btnEdit", this._fBtnEdit);

    this._fBtnDelete = new Button();
    this._fBtnDelete.setLayoutType(Button.LAYOUT_TYPE.SMALL);
    this._fBtnDelete.setName("Delete...");
    this._fBtnDelete.setThemeType(Button.T_THEME.DANGER);
    this._fBtnDelete.setDelegate(this);
    this.setChild("btnDelete", this._fBtnDelete);

    this._addressId = null;
    this._tLayout = null;
  }

  getAddressId() { return this._addressId; }

  setAddressId(id) { this._addressId = id; }
  setLayoutType(t) { this._tLayout = t; }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this._fBtnEdit:
      this.#onEdit();
      break;
    case this._fBtnDelete:
      this.#onDelete();
      break;
    default:
      break;
    }
  }

  action(type, ...args) {
    switch (type) {
    case CF_ADDRESS.ON_CLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ADDRESS:
      if (data.getId() == this._addressId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let addr = this._dataSource.getDataForGuiAddress(this, this._addressId);
    if (!addr) {
      return;
    }
    let panel = this.#createPanel();
    panel.setAttribute("onclick",
                       "javascript:G.action(gui.CF_ADDRESS.ON_CLICK)");
    render.wrapPanel(panel);
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
      this._fBtnEdit.attachRender(p);
      this._fBtnEdit.render();
    }
    p = panel.getDeleteBtnPanel();
    if (p) {
      this._fBtnDelete.attachRender(p);
      this._fBtnDelete.render();
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.SMALL:
      p = new PAddressSmall();
      break;
    default:
      p = new PAddress();
      break;
    }
    return p;
  }

  #toString(s) { return s ? s : ""; }

  #onClick() {
    if (this._delegate) {
      this._delegate.onClickInAddressFragment(this, this._addressId);
    }
  }

  #onEdit() {
    if (this._delegate) {
      this._delegate.onAddressFragmentRequestEdit(this, this._addressId);
    }
  }

  #onDelete() {
    if (this._delegate) {
      this._delegate.onAddressFragmentRequestDelete(this, this._addressId);
    }
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_ADDRESS = CF_ADDRESS;
  window.gui.Address = Address;
}
