import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUpgradeChoices } from './FvcUpgradeChoices.js';
import Utilities from '../../lib/ext/Utilities.js';
import { R } from '../constants/R.js';
import Render from '../../lib/ui/renders/Render.js';
import { FragmentOwner } from '../../lib/ui/controllers/fragments/Fragment.js';

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
  #quotaError: { code: string; data: QuotaErrorData };

  constructor(quotaError: { code: string; data: QuotaErrorData }) {
    super();
    this.#quotaError = quotaError;
  }

  action(type: symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_QUOTA_LIMIT.UPGRADE:
      this.#onUpgradeClicked();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: Render): void {
    const s = this.#renderErrorMsg(this.#quotaError.code, this.#quotaError.data);
    render.replaceContent(s);
  }

  #onUpgradeClicked(): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      const v = new View();
      v.setContentFragment(new FvcUpgradeChoices());
      owner.onFragmentRequestShowView(this, v, "Upgrades");
    }
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

