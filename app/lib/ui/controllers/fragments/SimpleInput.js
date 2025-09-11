(function(ui) {
class SimpleInput extends ui.FInput {
  constructor() {
    super();
    this._hasError = false;
  }

  getValue() { return this._getInputElement().value; }
  setConfig(config) {
    super.setConfig(config);
    this._hasError = false;
  }

  _clearErrorMark() {
    this._hasError = false;
    let e = this._getInputElement();
    e.className = e.className.replace(" input-error", "");
    e.className = e.className.replace("input-error ", "");
    e.className = e.className.replace("input-error", "");
  }

  _markError() {
    this._hasError = true;
    let e = this._getInputElement();
    if (e.className.indexOf("input-error") < 0) {
      if (e.className.length) {
        e.className = e.className + " input-error";
      } else {
        e.className = "input-error";
      }
    }
  }
}

ui.SimpleInput = SimpleInput;
}(window.ui = window.ui || {}));
