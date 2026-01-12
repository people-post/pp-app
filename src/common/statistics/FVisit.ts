import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ButtonGroup, ButtonGroupDelegate } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { FLoading } from '../../lib/ui/controllers/fragments/FLoading.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { FVisitInfo, FVisitInfoDelegate } from './FVisitInfo.js';
import { VisitSummary, VisitSummaryData } from '../datatypes/VisitSummary.js';
import { R } from '../constants/R.js';
import { Api } from '../plt/Api.js';

export interface FVisitDelegate {
  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary: FVisit, visitSummary: VisitSummary): void;
}

export class FVisit extends Fragment implements ButtonGroupDelegate, FVisitInfoDelegate {
  private _fDuration: ButtonGroup;
  private _fLoading: FLoading;
  private _fList: FSimpleFragmentList | null = null;
  private _queryType: string | null = null;
  private _queryKey: string | null = null;
  private _queryValue: string | null = null;

  constructor() {
    super();
    this._fDuration = new ButtonGroup();
    this._fDuration.setDelegate(this);
    this._fDuration.addChoice({name : R.t("last 30 days"), value : 30});
    this._fDuration.addChoice({name : R.t("last 7 days"), value : 7});
    this._fDuration.addChoice({name : R.t("last 24 hours"), value : 1});
    this._fDuration.setSelectedValue(1);
    this.setChild("duration", this._fDuration);

    this._fLoading = new FLoading();
    this._fList = null;

    this._queryType = null;
    this._queryKey = null;
    this._queryValue = null;
  }

  getDuration(): number { return this._fDuration.getSelectedValue() as number; }

  setQueryInfo(type: string, key: string | null = null, value: string | null = null, duration: number = 1): void {
    this._queryType = type;
    this._queryKey = key;
    this._queryValue = value;
    this._fDuration.setSelectedValue(duration);
  }

  onButtonGroupSelectionChanged(_fButtonGroup: ButtonGroup, _value: unknown): void {
    this._fList = null;
    this.render();
  }

  onClickInVisitSummaryInfoFragment(_fSummaryInfo: FVisitInfo, visitSummary: VisitSummary): void {
    const delegate = this.getDelegate<FVisitDelegate>();
    if (delegate) {
      delegate.onVisitSummaryFragmentRequestShowSubSummary(this, visitSummary);
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fDuration.attachRender(pp);
    this._fDuration.render();

    pp = new PanelWrapper();
    p.pushPanel(pp);

    if (!this._fList) {
      this._fLoading.attachRender(pp);
      this._fLoading.render();
      this.#asyncLoadData();
      return;
    }

    if (this._fList.size() > 0) {

      this._fList.attachRender(pp);
      this._fList.render();
    } else {
      pp.setClassName("info-message");
      pp.replaceContent("No visits recorded");
    }
  }

  #asyncLoadData(): void {
    let fd = new FormData();
    let url = "api/stat/visits"
    if (this._queryKey) {
      fd.append("key", this._queryKey);
      fd.append("value", this._queryValue || "");
    }
    fd.append("duration", this._fDuration.getSelectedValue().toString());
    fd.append("type", this._queryType || "");

    Api.asFragmentPost<{ items: VisitSummaryData[] }>(this, url, fd).then(d => this.#onLoadDataRRR(d.items));
  }

  #onLoadDataRRR(ds: VisitSummaryData[]): void {
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);
    let f: FVisitInfo;
    for (let d of ds) {
      f = new FVisitInfo();
      f.setData(new VisitSummary(d));
      f.setDelegate(this);
      this._fList.append(f);
    }
    this.render();
  }
}

export default FVisit;
