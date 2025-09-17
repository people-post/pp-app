(function(hstn) {
class FvcWeb3ServerRegistration extends ui.FScrollViewContent {
  #agent;
  #fNameInput;
  #btnSubmit;
  #btnCancel;

  constructor() {
    super();
    this.#fNameInput = new ui.TextInput();
    this.#fNameInput.setConfig({hint : "Name", value : "", isRequired : true});
    this.#fNameInput.setDelegate(this);
    this.setChild("nameInput", this.#fNameInput);

    this.#btnSubmit = new ui.Button();
    this.#btnSubmit.setDelegate(this);
    this.#btnSubmit.setName("Submit");
    this.setChild("btnSubmit", this.#btnSubmit);

    this.#btnCancel = new ui.Button();
    this.#btnCancel.setDelegate(this);
    this.#btnCancel.setName("Cancel");
    this.setChild("btnCancel", this.#btnCancel);
  }

  setAgent(agent) { this.#agent = agent; }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this.#btnSubmit:
      this.#onSubmit();
      break;
    default:
      this._delegate.onRegistrationCanceledInServerRegistrationContentFragment(
          this);
      break;
    }
  }
  onInputChangeInTextInputFragment(fInput, value) { this.#testName(value); }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    let p = new ui.PanelWrapper();
    pList.pushPanel(p);
    p.replaceContent("Registration page for " + this.#agent.getHostname());

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#fNameInput.attachRender(p);
    this.#fNameInput.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnSubmit.attachRender(p);
    this.#btnSubmit.render();

    pList.pushSpace(1);
    p = new ui.PanelWrapper();
    pList.pushPanel(p);
    this.#btnCancel.attachRender(p);
    this.#btnCancel.render();
  }

  #testName(name) {
    this.#agent.asIsNameRegistrable(name)
        .then(b => this.#onNameResult(b))
        .catch(e => this.#onNameResult(false));
  }

  #onNameResult(b) {
    if (b) {
      this.#btnSubmit.setEnabled(true);
    } else {
      this.#btnSubmit.setEnabled(false);
      this.onLocalErrorInFragment(this,
                                  "Name is unavailable, please try new one");
    }
  }

  #onSubmit() {
    if (this.#fNameInput.validate()) {
      this.#agent.asRegister(this.#fNameInput.getValue())
          .then(() => this.#onRegisterSuccess())
          .catch(e => this.#onRegisterError(e));
    }
  }

  #onRegisterSuccess() {
    this._delegate.onRegistrationSuccessInServerRegistrationContentFragment(
        this);
  }

  #onRegisterError(e) {
    console.log(e);
    this.onLocalErrorInFragment(this, "Registration failed");
  }
};

hstn.FvcWeb3ServerRegistration = FvcWeb3ServerRegistration;
}(window.hstn = window.hstn || {}));
