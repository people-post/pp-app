import { Fragment } from './Fragment.js';

export const CF_UI_NAV_MAGIC = {
  ON_CLICK : Symbol(),
};

const _CFT_UI_NAV_MAGIC = {
  MAIN :
      `<span class="w100 h40px inline-block cursornresize" onclick="javascript:G.action(window.CF_UI_NAV_MAGIC.ON_CLICK)"></span>`,
};

export class FNavMagic extends Fragment {
  action(type, ...args) {
    switch (type) {
    case CF_UI_NAV_MAGIC.ON_CLICK:
      this._delegate.onNavMagicFragmentClick(this);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() { return _CFT_UI_NAV_MAGIC.MAIN; }
};
