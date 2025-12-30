import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';

export const CF_UI_NAV_BACK = {
  ON_CLICK : Symbol(),
};

const _CFT_UI_NAV_BACK = {
  MAIN :
      `<a href="javascript:void(0)" onclick="javascript:G.action(ui.CF_UI_NAV_BACK.ON_CLICK)">__ICON__</a>`,
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

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.CF_UI_NAV_BACK = CF_UI_NAV_BACK;
  window.ui.FNavBack = FNavBack;
}
