import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUpgradeChoices } from './FvcUpgradeChoices.js';
import Utilities from '../../lib/ext/Utilities.js';

export const CF_QUOTA_LIMIT = {
  UPGRADE : Symbol(),
};

const _CFT_QUOTA_LIMIT = {
  UPGRADE_BTN :
      `<a class="internal-page-link" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_QUOTA_LIMIT.UPGRADE)">upgrade</a>`,
};

export class FvcQuotaLimit extends FScrollViewContent {
  constructor(quotaError) {
    super();
    this._quotaError = quotaError;
  }

  action(type, ...args) {
    switch (type) {
    case CF_QUOTA_LIMIT.UPGRADE:
      this.#onUpgradeClicked();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let s = this.#renderErrorMsg(this._quotaError.code, this._quotaError.data);
    render.replaceContent(s);
  }

  #onUpgradeClicked() {
    let v = new View();
    v.setContentFragment(new FvcUpgradeChoices());
    this._owner.onFragmentRequestShowView(this, v, "Upgrades");
  }

  #renderErrorMsg(code, data) {
    let t = R.get(code);
    t = t.replace("__TIME__", Utilities.timeDiffString(data.period));
    t = t.replace("__QUOTA__", data.quota);
    t = t.replace("__UPGRADE_BTN__", _CFT_QUOTA_LIMIT.UPGRADE_BTN);
    t = t.replace("__FREEZE_TIME__",
                  Utilities.timeDiffString(data.fallback_period));
    return t;
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_QUOTA_LIMIT = CF_QUOTA_LIMIT;
  window.gui.FvcQuotaLimit = FvcQuotaLimit;
}

