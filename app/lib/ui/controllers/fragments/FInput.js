(function(ui) {
class FInput extends ui.Fragment {
  constructor() {
    super();
    this._config = null;
  }

  getConfig() { return this._config; }
  setConfig(config) { this._config = config; }

  _getInputElementId() { return "EIN_ID_" + this._id; }
  _getInputElement() {
    return document.getElementById(this._getInputElementId());
  }
}

ui.FInput = FInput;
}(window.ui = window.ui || {}));
