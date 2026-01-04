import { Fragment } from './Fragment.js';

export const CF_UI_NAV_MAGIC = {
  ON_CLICK : Symbol(),
};

// Export to window for string template access
declare global {
  interface Window {
    CF_UI_NAV_MAGIC?: typeof CF_UI_NAV_MAGIC;
    [key: string]: unknown;
  }
}

if (typeof window !== 'undefined') {
  window.CF_UI_NAV_MAGIC = CF_UI_NAV_MAGIC;
}

const _CFT_UI_NAV_MAGIC = {
  MAIN :
      `<span class="w100 h40px inline-block cursornresize" onclick="javascript:G.action(window.CF_UI_NAV_MAGIC.ON_CLICK)"></span>`,
} as const;

export class FNavMagic extends Fragment {
  action(type: symbol | string, ..._args: any[]): void {
    switch (type) {
    case CF_UI_NAV_MAGIC.ON_CLICK:
      if (this._delegate && typeof (this._delegate as any).onNavMagicFragmentClick === 'function') {
        (this._delegate as any).onNavMagicFragmentClick(this);
      }
      break;
    default:
      super.action.apply(this, arguments as any);
      break;
    }
  }

  _renderContent(): string { return _CFT_UI_NAV_MAGIC.MAIN; }
}

