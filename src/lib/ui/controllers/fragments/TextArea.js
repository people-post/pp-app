import { SimpleInput } from './SimpleInput.js';

export const CF_TEXT_AREA = {
  ON_CHANGE : "CF_TEXT_AREA_1",
}

const _CFT_TEXT_AREA = {
  TITLE : `<p class="title">__TITLE__</p>`,
  INPUT :
      `<textarea id="__ID__" class="__CLASS_NAME__" onchange="javascript:G.action(window.CF_TEXT_AREA.ON_CHANGE, this.value)" placeholder="__HINT__">__VALUE__</textarea>`,
}

export class TextArea extends SimpleInput {
  constructor() {
    super();
    this._config = {title : "", hint : "", value : "", isRequired : true};
    this._className = "";
  }

  setClassName(name) { this._className = name; }

  setValue(v) {
    this._config.value = v;
    let e = this._getInputElement();
    if (e) {
      e.value = v;
    }
  }

  validate() {
    let e = this._getInputElement();
    if (this._config.isRequired && !e.value) {
      e.style.borderColor = "bgfirebrick";
      return false;
    } else {
      return true;
    }
  }

  action(type, ...args) {
    switch (type) {
    case CF_TEXT_AREA.ON_CHANGE:
      this.#onInputChange(args[0]);
      break;
    default:
      break;
    }
  }

  _renderContent() {
    let s = _CFT_TEXT_AREA.INPUT;
    s = s.replace("__HINT__", this._config.hint);
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__VALUE__", this._config.value ? this._config.value : "");
    s = s.replace("__CLASS_NAME__", this._className);
    if (this._config.title && this._config.title.length) {
      let ss = _CFT_TEXT_AREA.TITLE;
      ss = ss.replace("__TITLE__", this._config.title);
      s = ss + s;
    }
    return s;
  }

  #onInputChange(newValue) {
    if (this._delegate) {
      this._delegate.onInputChangeInTextArea(this, newValue);
    }
  }
};

