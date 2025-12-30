import { Fragment } from './Fragment.js';
import { LContext } from '../layers/LContext.js';
import { ICONS } from '../../Icons.js';
import { Utilities as CommonUtilities } from '../../../../common/Utilities.js';
import { T_ACTION } from '../../../framework/Events.js';
import { Events } from '../../../framework/Events.js';

export const CF_OPTION_CONTEXT_BUTTON = {
  ONCLICK : Symbol(),
};

const _CFT_OPTION_CONTEXT_BUTTON = {
  BTN :
      `<span class="clickable" onclick="javascript:G.action(ui.CF_OPTION_CONTEXT_BUTTON.ONCLICK)">__ICON__</span>`,
};

export class OptionContextButton extends Fragment {
  #lc;
  #icon;

  constructor() {
    super();
    this.#lc = new LContext();
    this.#lc.setDelegate(this);
    this.#icon =
        `<span class="bd1px bdsolid s-cprimebd option-context-default-icon-wrapper inline-block s-icon6">__ICON__</span>`
            .replace("__ICON__", ICONS.MORE);
  }

  setIcon(icon) { this.#icon = icon; }
  setTargetName(name) { this.#lc.setTargetName(name); }

  addOption(name, value, icon = null, themeType = null) {
    this.#lc.addOption(name, value, icon, themeType);
  }
  clearOptions() { this.#lc.clearOptions(); }

  onOptionClickedInContextLayer(lContext, value) {
    this._delegate.onOptionClickedInContextButtonFragment(this, value);
  }

  action(type, ...args) {
    switch (type) {
    case CF_OPTION_CONTEXT_BUTTON.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    render.replaceContent(this.#renderIcon(this.#icon));
  }

  #renderIcon(icon) {
    let s = _CFT_OPTION_CONTEXT_BUTTON.BTN;
    let ss = CommonUtilities.renderSvgFuncIcon(icon);
    s = s.replace("__ICON__", ss);
    return s;
  }

  #onClick() {
    Events.triggerTopAction(T_ACTION.SHOW_LAYER, this, this.#lc,
                                "Context");
  }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.CF_OPTION_CONTEXT_BUTTON = CF_OPTION_CONTEXT_BUTTON;
  window.ui.OptionContextButton = OptionContextButton;
}
