
class FvcAddressEditor extends ui.FScrollViewContent {
  #fAddress;
  #btnSubmit;
  #addressId = null;

  constructor() {
    super();
    this.#fAddress = new gui.AddressEditor();
    this.setChild("editor", this.#fAddress);

    this.#btnSubmit = new ui.Button();
    this.#btnSubmit.setName("Submit");
    this.#btnSubmit.setDelegate(this);
    this.setChild("submit", this.#btnSubmit);
  }

  setAddressId(id) { this.#addressId = id; }

  onSimpleButtonClicked(fBtn) { this.#onSubmit(); }

  _renderContentOnRender(render) {
    let addr;
    if (this.#addressId) {
      addr = dba.Address.get(this.#addressId);
      if (!addr) {
        return;
      }
    }

    let panel = new ui.ListPanel();
    render.wrapPanel(panel);

    let p = new ui.PanelWrapper();
    panel.pushPanel(p);
    this.#fAddress.attachRender(p);
    this.#fAddress.render();
    if (addr) {
      this.#fAddress.setData(addr);
    }

    panel.pushSpace(1);

    p = new ui.PanelWrapper();
    panel.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();
  }

  #onSubmit() {
    if (this.#addressId) {
      this.#asyncUpdateAddress(this.#fAddress.getData());
    } else {
      this.#asyncAddAddress(this.#fAddress.getData());
    }
  }

  #fillFormData(formData, address) {
    formData.append("nickname", address.getNickname());
    formData.append("name", address.getName());
    formData.append("country", address.getCountry());
    formData.append("state", address.getState());
    formData.append("city", address.getCity());
    formData.append("zipcode", address.getZipcode());
    formData.append("lines", address.getLine(0));
    let line1 = address.getLine(1);
    if (line1 && line1.length) {
      formData.append("lines", line1);
    }
  }

  #asyncUpdateAddress(address) {
    let url = "/api/user/update_address";
    let fd = new FormData();
    fd.append("id", this.#addressId);
    this.#fillFormData(fd, address);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onUpdateAddressRRR(d));
  }

  #asyncAddAddress(address) {
    let url = "/api/user/add_address";
    let fd = new FormData();
    this.#fillFormData(fd, address);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onAddAddressRRR(d));
  }

  #onUpdateAddressRRR(data) {
    dba.Address.update(new dat.Address(data.address));
    this._owner.onContentFragmentRequestPopView(this);
  }

  #onAddAddressRRR(data) {
    dba.Account.resetAddressIds(data.address_ids);
    this._owner.onContentFragmentRequestPopView(this);
  }
};

acnt.FvcAddressEditor = FvcAddressEditor;
}(window.acnt = window.acnt || {}));
