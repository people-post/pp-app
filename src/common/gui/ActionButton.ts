import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ICONS } from '../../lib/ui/Icons.js';
import { ICON } from '../constants/Icons.js';
import { Utilities } from '../Utilities.js';

export const CF_ACTION_BUTTON = {
  ONCLICK : "CF_GUI_ACTION_BUTTON_1",
};

// Export to window for string template access
declare global {
  interface Window {
    gui?: {
      CF_ACTION_BUTTON?: typeof CF_ACTION_BUTTON;
      CF_SIMPLE_LIST?: typeof import('./FSimpleList.js').CF_SIMPLE_LIST;
      [key: string]: unknown;
    };
  }
}

if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_ACTION_BUTTON = CF_ACTION_BUTTON;
}

// TODO: Relative is for badge, needs improvement
const _CFT_ACTION_BUTTON = {
  MAIN : `<div class="menu-slot-icon-wrapper pad5px relative">
      <a class="menu" href="javascript:void(0)" onclick="G.action(window.gui.CF_ACTION_BUTTON.ONCLICK)">__ICON__</a>
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

  private _icon: string | null = null;

  setIcon(icon: string | null): void {
    this._icon = icon;
  }

  // @ts-expect-error - override with parameters, base class has no parameters
  action(type: string, ...args: unknown[]): void {
    switch (type) {
    case CF_ACTION_BUTTON.ONCLICK:
      // @ts-expect-error - delegate may have this method
      this._delegate?.onGuiActionButtonClick?.(this);
      break;
    default:
      // @ts-expect-error - base class action() has no parameters but subclasses override with parameters
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent(): string {
    let icon = this._getIcon();
    if (!icon) {
      return "";
    }
    let s = _CFT_ACTION_BUTTON.MAIN;
    s = s.replace("__ICON__", Utilities.renderSvgMenuIcon(icon));
    return s;
  }

  _getIcon(): string | null {
    return this._icon;
  }
}
