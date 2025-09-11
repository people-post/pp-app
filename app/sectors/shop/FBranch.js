(function(shop) {
shop.CF_BRANCH = {
  ON_CLICK : Symbol(),
};

class FBranch extends ui.Fragment {
  static T_LAYOUT = {
    SMALL : Symbol(),
    FULL: Symbol(),
  };

  constructor() {
    super();
    this._fRegisters = new shop.FRegisterList();
    this._fRegisters.setDelegate(this);
    this.setChild("registers", this._fRegisters);

    this._fAddress = new gui.Address();
    this._fAddress.setDataSource(this);
    this._fAddress.setDelegate(this);
    this._fAddress.setLayoutType(gui.Address.T_LAYOUT.SMALL);
    this.setChild("address", this._fAddress);

    this._fNameInput = new ui.TextInput();
    this._fNameInput.setDelegate(this);
    this.setChild("nameEditor", this._fNameInput);

    this._tLayout = null;
    this._branchId = null;
    this._isEditEnabled = false;
  }

  setBranchId(id) { this._branchId = id; }
  setLayoutType(t) { this._tLayout = t; }
  setEnableEdit(b) { this._isEditEnabled = b; }

  getDataForGuiAddress(fAddress, addressId) {
    return dba.Address.get(addressId);
  }

  onInputChangeInTextInputFragment(fTextInput, value) { this.#asyncUpdate(); }
  onClickInAddressFragment(fAddress, addressId) {
    if (!this._tLayout || this._tLayout == this.constructor.T_LAYOUT.FULL) {
      this.#showAddressEditor(addressId);
    } else {
      this._delegate.onClickInBranchFragment(this, this._branchId);
    }
  }
  onAddressFragmentRequestEdit(fAddress, addressId) {
    this.#showAddressEditor(addressId);
  }

  onAddressFragmentRequestDelete(fAddress, addressId) {}

  onRegisterListFragmentRequestShowView(fRegisterList, view, title) {
    this._delegate.onBranchFragmentRequestShowView(this, view, title);
  }
  onRegisterSelectedInRegisterListFragment(fRegisterList, registerId) {
    let v = new ui.View();
    let f = new shop.FvcRegister();
    f.setRegisterId(registerId);
    f.setEnableEdit(this._isEditEnabled);
    v.setContentFragment(f);
    this._delegate.onBranchFragmentRequestShowView(this, v, "Register config");
  }

  action(type, ...args) {
    switch (type) {
    case shop.CF_BRANCH.ON_CLICK:
      this._delegate.onClickInBranchFragment(this, this._branchId);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.SHOP_BRANCH:
      if (data.getId() == this._branchId) {
        this.render();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    let branch = dba.Shop.getBranch(this._branchId);
    if (!branch) {
      return;
    }

    let panel = this.#createPanel();
    render.wrapPanel(panel);

    if (this._dataSource && panel.isColorInvertible() &&
        this._dataSource.isBranchSelectedInBranchFragment(this,
                                                          this._branchId)) {
      panel.invertColor();
    }

    let p = panel.getAddressPanel();
    if (p) {
      this._fAddress.setAddressId(branch.getAddressId());
      this._fAddress.attachRender(p);
      this._fAddress.render();
    }

    p = panel.getNameDecorationPanel();
    if (p) {
      p.replaceContent(R.t("Branch name") + ": ");
    }

    p = panel.getNamePanel();
    if (p) {
      this.#renderName(branch, p);
    }

    p = panel.getNameEditorPanel();
    if (p && this._isEditEnabled) {
      this._fNameInput.setConfig(
          {title : "", hint : "Branch name", value : branch.getName()});
      this._fNameInput.attachRender(p);
      this._fNameInput.render();
    }

    p = panel.getRegisterListPanel();
    if (p) {
      let pp = new ui.SectionPanel("Registers");
      p.wrapPanel(pp);
      this._fRegisters.setBranchId(this._branchId);
      this._fRegisters.setEnableEdit(this._isEditEnabled);
      this._fRegisters.attachRender(pp.getContentPanel());
      this._fRegisters.render();
    }
  }

  #createPanel() {
    let p;
    switch (this._tLayout) {
    case this.constructor.T_LAYOUT.SMALL:
      p = new shop.PBranchSmall();
      p.setAttribute("onclick", "javascript:G.action(shop.CF_BRANCH.ON_CLICK)");
      break;
    default:
      p = new shop.PBranch();
      break;
    }
    return p;
  }

  #renderName(branch, panel) {
    let name = branch.getName();
    if (name && name.length) {
      panel.replaceContent(name);
    } else {
      panel.replaceContent("New branch");
    }
  }

  #showAddressEditor(addressId) {
    let v = new ui.View();
    let f = new acnt.FvcAddressEditor();
    f.setAddressId(addressId);
    v.setContentFragment(f);
    this._delegate.onBranchFragmentRequestShowView(this, v, "Edit address");
  }

  #collectData() {
    let fd = new FormData();
    fd.append("id", this._branchId);
    fd.append("name", this._fNameInput.getValue());
    return fd;
  }

  #asyncUpdate() {
    let url = "api/shop/update_branch";
    let fd = this.#collectData();
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onUpdateRRR(d));
  }

  #onUpdateRRR(data) { dba.Shop.updateBranch(new dat.ShopBranch(data.branch)); }
};

shop.FBranch = FBranch;
}(window.shop = window.shop || {}));
