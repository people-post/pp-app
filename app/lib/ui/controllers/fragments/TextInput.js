(function(ui) {
ui.CF_TEXT_INPUT = {
  ONCHANGE : "CF_TEXT_INPUT_1",
}

const _CFT_TEXT_INPUT = {
  FULL : `<div>
       <p>__TITLE__</p>
       __INPUT__
    </div>`,
  INPUT :
      `<input type="text" id="__ID__" class="__CLASS_NAME__" placeholder="__HINT__" value="__VALUE__" onchange="javascript:G.action(ui.CF_TEXT_INPUT.ONCHANGE, this.value)">`
}

class TextInput extends ui.SimpleInput {
  constructor() {
    super();
    this._config = {title : "", hint : "", value : "", isRequired : true};
    this._className = "";
  }

  enableEdit() {
    let e = this._getInputElement();
    if (e) {
      e.disabled = false;
    }
  }

  disableEdit() {
    let e = this._getInputElement();
    if (e) {
      e.disabled = true;
    }
  }

  setClassName(name) { this._className = name; }

  setValue(v) {
    this._config.value = v;
    let e = this._getInputElement();
    if (e) {
      e.value = v;
    }
  }

  action(type, ...args) {
    switch (type) {
    case ui.CF_TEXT_INPUT.ONCHANGE:
      if (this._delegate) {
        this._delegate.onInputChangeInTextInputFragment(this, args[0]);
      }
      break;
    default:
      super.action.apply(this, arguments);
    }
  }

  validate() {
    let e = this._getInputElement();
    if (this._config.isRequired && !(e.value && e.value.length)) {
      e.style.border = "1px solid coral";
      e.style.borderRadius = "5px";
      return false;
    } else {
      e.style.border = null;
      e.style.borderRadius = null;
      return true;
    }
  }

  _renderContent() {
    let s = _CFT_TEXT_INPUT.INPUT;
    s = s.replace("__HINT__", this._config.hint);
    s = s.replace("__ID__", this._getInputElementId());
    s = s.replace("__CLASS_NAME__", this._className);
    s = s.replace("__VALUE__", this._config.value ? this._config.value : "");
    if (this._config.title && this._config.title.length) {
      let ss = _CFT_TEXT_INPUT.FULL;
      ss = ss.replace("__TITLE__", this._config.title);
      s = ss.replace("__INPUT__", s);
    }
    return s;
  }
};

ui.TextInput = TextInput;
}(window.ui = window.ui || {}));