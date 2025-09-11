(function(gui) {
gui.CF_ADDRESS = {
  ON_CLICK : Symbol(),
};

class Address extends ui.Fragment {
  static T_LAYOUT = {
    LARGE : Symbol(),
    SMALL: Symbol(),
  };

  constructor() {
    super();
    this._fBtnEdit = new ui.Button();
    this._fBtnEdit.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtnEdit.setName("Edit");
    this._fBtnEdit.setDelegate(this);
    this.setChild("btnEdit", this._fBtnEdit);

    this._fBtnDelete = new ui.Button();
    this._fBtnDelete.setLayoutType(ui.Button.LAYOUT_TYPE.SMALL);
    this._fBtnDelete.setName("Delete...");
    this._fBtnDelete.setThemeType(ui.Button.T_THEME.DANGER);
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
    case gui.CF_ADDRESS.ON_CLICK:
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
      p = new gui.PAddressSmall();
      break;
    default:
      p = new gui.PAddress();
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

gui.Address = Address;
}(window.gui = window.gui || {}));
