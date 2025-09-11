(function(shop) {
shop.CF_REGISTER = {
  ON_CLICK : Symbol(),
};

class FRegister extends ui.Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  };

  constructor() {
    super();
    this._fTerminals = new pay.FPaymentTerminalList();
    this._fTerminals.setDelegate(this);
    this.setChild("terminals", this._fTerminals);

    this._fNameInput = new ui.TextInput();
    this._fNameInput.setDelegate(this);
    this.setChild("nameEditor", this._fNameInput);

    this._tLayout = null;
    this._registerId = null;
    this._isEditEnabled = false;
  }

  setRegisterId(id) { this._registerId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  onInputChangeInTextInputFragment(fTextInput, value) { this.#asyncUpdate(); }
  onPaymentTerminalListFragmentRequestShowView(fTerminals, view, title) {
    this._delegate.onRegisterFragmentRequestShowView(this, view, title);
  }
  onPaymentTerminalSelectedInPaymentTerminalListFragment(fTerminalList,
                                                         terminalId) {
    let v = new ui.View();
    let f = new pay.FvcPaymentTerminal();
    f.setTerminalId(terminalId);
    f.setEnableEdit(this._isEditEnabled);
    v.setContentFragment(f);
    this._delegate.onRegisterFragmentRequestShowView(this, v,
                                                     "Terminal config");
  }

  action(type, ...args) {
    switch (type) {
    case shop.CF_REGISTER.ON_CLICK:
      this._delegate.onClickInRegisterFragment(this, this._registerId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.SHOP_REGISTER:
      if (data.getId() == this._registerId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let register = dba.Shop.getRegister(this._registerId);
    if (!register) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this._dataSource && panel.isColorInvertible() &&
        this._dataSource.isRegisterSelectedInRegisterFragment(
            this, this._registerId)) {
      panel.invertColor();
    }

    let p = panel.getNameDecorationPanel();
    if (p) {
      p.replaceContent(R.t("Register name") + ": ");
    }

    p = panel.getNamePanel();
    if (p) {
      this.#renderName(register, p);
    }

    p = panel.getNameEditorPanel();
    if (p && this._isEditEnabled) {
      this._fNameInput.setConfig(
          {title : "", hint : "Register name", value : register.getName()});
      this._fNameInput.attachRender(p);
      this._fNameInput.render();
    }

    p = panel.getTerminalListPanel();
    if (p) {
      let pp = new ui.SectionPanel("Payment terminals");
      p.wrapPanel(pp);
      this._fTerminals.setRegisterId(this._registerId);
      this._fTerminals.setEnableEdit(this._isEditEnabled);
      this._fTerminals.attachRender(pp.getContentPanel());
      this._fTerminals.render();
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.SMALL:
      p = new shop.PRegisterSmall();
      p.setAttribute("onclick",
                     "javascript:G.action(shop.CF_REGISTER.ON_CLICK)");
      break;
    default:
      p = new shop.PRegister();
      break;
    }
    return p;
  }

  #renderName(register, panel) {
    let name = register.getName();
    if (name && name.length) {
      panel.replaceContent(name);
    } else {
      panel.replaceContent("New register");
    }
  }
  #collectData() {
    let fd = new FormData();
    fd.append("id", this._registerId);
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate() {
    let url = "api/shop/update_register";
    let fd = this.#collectData();
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data) {
    dba.Shop.updateRegister(new dat.ShopRegister(data.register));
  }
};

shop.FRegister = FRegister;
}(window.shop = window.shop || {}));
