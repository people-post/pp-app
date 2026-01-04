import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUpgradeChoices } from './FvcUpgradeChoices.js';
import Utilities from '../../lib/ext/Utilities.js';
import { R } from '../constants/R.js';
import { Render } from '../../lib/ui/renders/Render.js';
import { RemoteError } from '../datatypes/RemoteError.js';

export const CF_QUOTA_LIMIT = {
  UPGRADE : Symbol(),
};

const _CFT_QUOTA_LIMIT = {
  UPGRADE_BTN :
      `<a class="internal-page-link" href="javascript:void(0)" onclick="javascript:G.action(gui.CF_QUOTA_LIMIT.UPGRADE)">upgrade</a>`,
};

interface QuotaErrorData {
  period: number;
  quota: number;
  fallback_period: number;
}

export class FvcQuotaLimit extends FScrollViewContent {
  _quotaError: RemoteError & { data: QuotaErrorData };

  constructor(quotaError: RemoteError & { data: QuotaErrorData }) {
    super();
    this._quotaError = quotaError;
  }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_QUOTA_LIMIT.UPGRADE:
      this.#onUpgradeClicked();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    const s = this.#renderErrorMsg(this._quotaError.code, this._quotaError.data);
    render.replaceContent(s);
  }

  #onUpgradeClicked(): void {
    const v = new View();
    v.setContentFragment(new FvcUpgradeChoices());
    this._owner.onFragmentRequestShowView(this, v, "Upgrades");
  }

  #renderErrorMsg(code: string, data: QuotaErrorData): string {
    let t = R.get(code);
    t = t.replace("__TIME__", Utilities.timeDiffString(data.period));
    t = t.replace("__QUOTA__", data.quota.toString());
    t = t.replace("__UPGRADE_BTN__", _CFT_QUOTA_LIMIT.UPGRADE_BTN);
    t = t.replace("__FREEZE_TIME__",
                  Utilities.timeDiffString(data.fallback_period));
    return t;
  }
}

