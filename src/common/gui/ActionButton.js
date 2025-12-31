import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { ICON } from '../constants/Icons.js';
import { Utilities } from '../Utilities.js';

export const CF_ACTION_BUTTON = {
  ONCLICK : "CF_GUI_ACTION_BUTTON_1",
};

// TODO: Relative is for badge, needs improvement
const _CFT_ACTION_BUTTON = {
  MAIN : `<div class="menu-slot-icon-wrapper pad5px relative">
      <a class="menu" href="javascript:void(0)" data-action="ONCLICK">__ICON__</a>
  </div>`,
};

export class ActionButton extends Fragment {
  static T_ICON = {
    NONE : ``,
    INFO: ICON.INFO,
    NEW: ICONS.NEW,
    EDIT: ICON.EDIT,
    ORDER: ICON.CART,
    MORE: ICONS.MORE,
    LOG_OUT: ICON.LOG_OUT,
    CLOSE: `Close`,
    CHECKOUT: `Checkout`,
    LOGIN: ICON.ACCOUNT,
    DONATE: ICON.COFFEE_MUG,
  };

  constructor() {
    super();
    this._icon = null;
  }

  setIcon(icon) { this._icon = icon; }

  action(type, ...args) {
    switch (type) {
    case CF_ACTION_BUTTON.ONCLICK:
      this._delegate.onGuiActionButtonClick(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() {
    let icon = this._getIcon();
    if (!icon) {
      return "";
    }
    let s = _CFT_ACTION_BUTTON.MAIN;
    s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(icon));
    return s;
  }

  _onContentDidAppear() {
    this._attachActionListeners('[data-action]', {
      'ONCLICK': CF_ACTION_BUTTON.ONCLICK
    });
  }

  _getIcon() { return this._icon; }
};

// Maintain backward compatibility with global namespace (reduced - constants no longer needed for onclick)
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.ActionButton = ActionButton;
}
