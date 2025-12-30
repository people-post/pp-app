
class FvcRegister extends ui.FScrollViewContent {
  #fRegister;

  constructor() {
    super();
    this.#fRegister = new shop.FRegister();
    this.#fRegister.setDelegate(this);
    this.setChild("register", this.#fRegister);
  }

  setRegisterId(id) { this.#fRegister.setRegisterId(id); }
  setEnableEdit(b) { this.#fRegister.setEnableEdit(b); }

  onRegisterFragmentRequestShowView(fRegister, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onClickInRegisterFragment(fRegister, registerId) {}

  _renderContentOnRender(render) {
    this.#fRegister.attachRender(render);
    this.#fRegister.render();
  }
};

shop.FvcRegister = FvcRegister;
}(window.shop = window.shop || {}));
