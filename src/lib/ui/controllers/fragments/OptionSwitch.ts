import { Fragment } from './Fragment.js';

export const CFT_OPTION_SWITCH = {
  ON_CHANGE : "CFT_OPTION_SWITCH_1",
} as const;

// Export to window for string template access
declare global {
  interface Window {
    CFT_OPTION_SWITCH?: typeof CFT_OPTION_SWITCH;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CFT_OPTION_SWITCH = CFT_OPTION_SWITCH;
}

const _CFT_OPTION_SWITCH = {
  OPTION : `<table class="w100 border-collapse">
    <tbody>
      <tr>
        <td>__NAME__:</td>
        <td class="right-align">
          <label class="switch s-font5">
            <input type="checkbox" onchange="javascript:G.action(window.CFT_OPTION_SWITCH.ON_CHANGE, '__VALUE__', this.checked)"__EXTRA__>
            <span class="slider"></span>
          </label>
        </td>
      </tr>
    </tbody>
  </table>`,
} as const;

interface OptionData {
  name: string;
  isOn: boolean;
}

export class OptionSwitch extends Fragment {
  private _optionMap: Map<string, OptionData>;

  constructor() {
    super();
    this._optionMap = new Map();
  }

  addOption(name: string, value: string, isOn: boolean): void {
    this._optionMap.set(value, {"name" : name, "isOn" : isOn})
  }
  isOptionOn(value: string): boolean { 
    const option = this._optionMap.get(value);
    return option ? option.isOn : false;
  }

  setOption(value: string, isOn: boolean): void {
    let d = this._optionMap.get(value);
    if (d) {
      d.isOn = isOn;
    } else {
      console.error("Option not exist: " + value);
    }
  }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CFT_OPTION_SWITCH.ON_CHANGE:
      this.#onChange(args[0], args[1]);
      break;
    default:
      break;
    }
  }

  _renderContent(): string {
    let items: string[] = [];
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

  #onChange(value: string, isChecked: boolean): void {
    let d = this._optionMap.get(value);
    if (d) {
      d.isOn = isChecked;
      if (this._delegate && typeof (this._delegate as any).onOptionChangeInOptionsFragment === 'function') {
        (this._delegate as any).onOptionChangeInOptionsFragment(this, value, isChecked);
      }
    }
  }
}

