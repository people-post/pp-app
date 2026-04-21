import { Fragment } from './Fragment.js';

export const CF_UI_NAV_MAGIC = {
  ON_CLICK: "CF_UI_NAV_MAGIC_1",
} as const;

const _CFT_UI_NAV_MAGIC = {
  MAIN :
      `<span class="tw:w-full tw:h-[40px] tw:inline-block tw:cursor-n-resize" data-pp-action="${CF_UI_NAV_MAGIC.ON_CLICK}"></span>`,
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

