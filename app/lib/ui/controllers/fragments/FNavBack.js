import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';

export const CF_UI_NAV_BACK = {
  ON_CLICK : Symbol(),
};

// Export to window for string template access
if (typeof window !== 'undefined') {
  window.CF_UI_NAV_BACK = CF_UI_NAV_BACK;
}

const _CFT_UI_NAV_BACK = {
  MAIN :
      `<a href="javascript:void(0)" onclick="javascript:G.action(window.CF_UI_NAV_BACK.ON_CLICK)">__ICON__</a>`,
};

export class FNavBack extends Fragment {
  action(type, ...args) {
    switch (type) {
    case CF_UI_NAV_BACK.ON_CLICK:
      this._delegate.onNavBackFragmentClick(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() {
    let s = _CFT_UI_NAV_BACK.MAIN;
    s = s.replace("__ICON__", ICONS.BACK);
    return s;
  }
}

