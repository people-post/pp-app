import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Utilities } from '../Utilities.js';
import { VisitSummary } from '../datatypes/VisitSummary.js';

export const CF_VISIT_SUMMARY_INFO = {
  ONCLICK : "CF_VISIT_SUMMARY_INFO_1",
}

const _CFT_VISIT_SUMMARY_INFO = {
  MAIN : `<div>__NAME__</div>
    <div>__N_VISITS__</div>`,
}

interface FVisitInfoDelegate {
  onClickInVisitSummaryInfoFragment(f: FVisitInfo, data: VisitSummary): void;
}

export class FVisitInfo extends Fragment {
  protected _data: VisitSummary | null = null;
  protected _delegate!: FVisitInfoDelegate;

  constructor() {
    super();
    this._data = null;
  }

  setData(d: VisitSummary): void { this._data = d; }

  action(type: string | symbol, ...args: any[]): void {
    switch (type) {
    case CF_VISIT_SUMMARY_INFO.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render: any): void {
    if (!this._data) {
      return;
    }

    let p = new Panel();
    let names = [ "pad5", "flex", "space-between", "visit-summary-info" ];
    if (this._data.getSubQueryKey()) {
      names.push("clickable");
      p.setAttribute("onclick",
                     "javascript:G.action(CF_VISIT_SUMMARY_INFO.ONCLICK)");
    }
    p.setClassName(names.join(" "));

    render.wrapPanel(p);

    p.replaceContent(this.#renderData(this._data));
  }

  #renderData(data: VisitSummary): string {
    let s = _CFT_VISIT_SUMMARY_INFO.MAIN;
    let name = data.getName() || "";
    if (data.getSubQueryKey() == "COUNTRY") {
      let c = Utilities.getCountryByCode(name);
      if (c) {
        name = Utilities.renderFlagIcon(name) + c.getName();
      }
    }
    s = s.replace("__NAME__", name);
    s = s.replace("__N_VISITS__", String(data.getTotal() || 0));
    return s;
  }

  #onClick(): void {
    if (this._data) {
      this._delegate.onClickInVisitSummaryInfoFragment(this, this._data);
    }
  }
}
