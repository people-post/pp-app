import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { FVisit } from '../../common/statistics/FVisit.js';
import { FvcVisit } from '../../common/statistics/FvcVisit.js';
import { R } from '../../common/constants/R.js';
import type Render from '../../lib/ui/renders/Render.js';
import type { VisitSummary } from '../../common/statistics/VisitSummary.js';

export class FvcStatistics extends FScrollViewContent {
  protected _fVisit: FVisit;

  constructor() {
    super();
    this._fVisit = new FVisit();
    this._fVisit.setQueryInfo("ACCOUNT");
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(_fVisitSummary: FVisit, visitSummary: VisitSummary): void {
    let v = new View();
    let f = new FvcVisit();
    f.setQueryInfo("ACCOUNT", visitSummary.getSubQueryKey(),
                   visitSummary.getSubQueryValue(),
                   this._fVisit.getDuration());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v);
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel(R.t("Your profile visits"));
    p.pushPanel(pp);

    this._fVisit.attachRender(pp.getContentPanel());
    this._fVisit.render();
  }
}
