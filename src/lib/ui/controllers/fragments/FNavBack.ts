import { Fragment } from './Fragment.js';
import { ICONS } from '../../Icons.js';

export const CF_UI_NAV_BACK = {
  ON_CLICK : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_UI_NAV_BACK?: typeof CF_UI_NAV_BACK;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_UI_NAV_BACK = CF_UI_NAV_BACK;
}

const _CFT_UI_NAV_BACK = {
  MAIN :
      `<a href="javascript:void(0)" onclick="javascript:G.action(window.CF_UI_NAV_BACK.ON_CLICK)">__ICON__</a>`,
} as const;

export class FNavBack extends Fragment {
  action(type: symbol | string, ..._args: any[]): void {
    switch (type) {
    case CF_UI_NAV_BACK.ON_CLICK:
      if (this._delegate && typeof (this._delegate as any).onNavBackFragmentClick === 'function') {
        (this._delegate as any).onNavBackFragmentClick(this);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _renderContent(): string {
    let s: string = _CFT_UI_NAV_BACK.MAIN;
    s = s.replace("__ICON__", ICONS.BACK);
    return s;
  }
}

