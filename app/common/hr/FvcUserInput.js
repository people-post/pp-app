export class FvcUserInput extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fAll = new ui.FSimpleFragmentList();

    this._fInputs = new ui.FSimpleFragmentList();
    this._fAll.append(this._fInputs);

    this._fActions = new ui.ButtonList();
    this._fActions.setDelegate(this);
    this._fActions.addButton("OK", () => this.#onInputOk());
    this._fActions.addButton("Cancel", () => this.#onInputCancelled(), true);
    this._fAll.append(this._fActions);

    this._fSpace = new ui.Label("<br>");
    this._fAll.append(this._fSpace);
    this.setChild("all", this._fAll);

    this._config = {fcnValidate : null, fcnOK : null};
  }

  addInputCollector(fragment) { this._fInputs.append(fragment); }
  onButtonClickedInButtonList(f, buttonId) {}

  setConfig(config) { this._config = config; }

  _renderContentOnRender(render) {
    this._fAll.attachRender(render);
    this._fAll.render();
  }

  #onInputCancelled() { this._owner.onContentFragmentRequestPopView(this); }

  #onInputOk() {
    if (!this._config.fcnValidate || this._config.fcnValidate()) {
      this._owner.onContentFragmentRequestPopView(this);
      if (this._config.fcnOK) {
        this._config.fcnOK();
      }
    }
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.S = window.S || {};
  window.S.hr = window.S.hr || {};
  window.S.hr.FvcUserInput = FvcUserInput;
}
