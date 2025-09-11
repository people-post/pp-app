(function(ui) {
ui.CF_NUMBER_INPUT = {
  ONCHANGE : "CF_NUMBER_INPUT_1",
}

const _CFT_NUMBER_INPUT = {
  FULL : `<div>
       <p>__TITLE__</p>
       __INPUT__
    </div>`,
  INPUT :
      `<input class="__CLASS__" type="number" id="__ID__" min="__MIN__" max="__MAX__" step="__STEP__", value="__VALUE__" onchange="javascript:G.action(ui.CF_NUMBER_INPUT.ONCHANGE, this.value)">__UNIT__`,
}

class NumberInput extends ui.SimpleInput {
  // Config: {
  // title
  // min
  // max
  // step
  // value
  // unit
  // }
  action(type, ...args) {
    switch (type) {
    case ui.CF_NUMBER_INPUT.ONCHANGE:
      if (this._delegate) {
        this._delegate.onInputChangeInNumberInputFragment(this, args[0]);
      }
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  validate() {
    // Range will be automatically checked
    let v = parseInt(this.getValue());
    if (this.#isValueInRange(v)) {
      this._clearErrorMark();
      return true;
    } else {
      this._markError();
      return false;
    }
  }

  _renderContent() {
    let s = _CFT_NUMBER_INPUT.INPUT;
    s = s.replace("__CLASS__", this._hasError ? "input-error" : "");
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__MIN__", this._config.min);
    s = s.replace("__MAX__", this._config.max);
    s = s.replace("__STEP__", this._config.step);
    s = s.replace("__VALUE__", this._config.value);
    s = s.replace("__UNIT__", this._config.unit ? this._config.unit : "");
    if (this._config.title && this._config.title.length) {
      let ss = _CFT_NUMBER_INPUT.FULL;
      ss = ss.replace("__TITLE__", this._config.title);
      s = ss.replace("__INPUT__", s);
    }
    return s;
  }

  #isValueInRange(v) {
    if (isNaN(v)) {
      return false;
    }
    if (Object.hasOwn(this._config, "min") && v < this._config.min) {
      return false;
    }
    if (Object.hasOwn(this._config, "max") && v > this._config.max) {
      return false;
    }
    return true;
  }
};

ui.NumberInput = NumberInput;
}(window.ui = window.ui || {}));
