(function(ui) {
ui.CFT_OPTION_SWITCH = {
  ON_CHANGE : "CFT_OPTION_SWITCH_1",
}

const _CFT_OPTION_SWITCH = {
  OPTION : `<table class="w100 border-collapse">
    <tbody>
      <tr>
        <td>__NAME__:</td>
        <td class="right-align">
          <label class="switch s-font5">
            <input type="checkbox" onchange="javascript:G.action(ui.CFT_OPTION_SWITCH.ON_CHANGE, '__VALUE__', this.checked)"__EXTRA__>
            <span class="slider"></span>
          </label>
        </td>
      </tr>
    </tbody>
  </table>`,
}

class OptionSwitch extends ui.Fragment {
  constructor() {
    super();
    this._optionMap = new Map();
  }

  addOption(name, value, isOn) {
    this._optionMap.set(value, {"name" : name, "isOn" : isOn})
  }
  isOptionOn(value) { return this._optionMap.get(value).isOn; }

  setOption(value, isOn) {
    let d = this._optionMap.get(value);
    if (d) {
      d.isOn = isOn;
    } else {
      console.error("Option not exist: " + value);
    }
  }

  action(type, ...args) {
    switch (type) {
    case ui.CFT_OPTION_SWITCH.ON_CHANGE:
      this.#onChange(args[0], args[1]);
      break;
    default:
      break;
    }
  }

  _renderContent() {
    let items = [];
    let t = _CFT_OPTION_SWITCH.OPTION;
    for (let [v, d] of this._optionMap.entries()) {
      let s = t.replace("__NAME__", d.name);
      s = s.replace("__VALUE__", v);
      if (d.isOn) {
        s = s.replace("__EXTRA__", `checked=""`);
      } else {
        s = s.replace("__EXTRA__", "");
      }
      items.push(s);
    }
    return items.join("");
  }

  #onChange(value, isChecked) {
    let d = this._optionMap.get(value);
    d.isOn = isChecked;
    this._delegate.onOptionChangeInOptionsFragment(this, value, isChecked);
  }
}

ui.OptionSwitch = OptionSwitch;
}(window.ui = window.ui || {}));
