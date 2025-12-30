import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';

export class FvcStatistics extends FScrollViewContent {
  constructor() {
    super();
    this._fVisit = new stat.FVisit();
    this._fVisit.setQueryInfo("ACCOUNT");
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary, visitSummary) {
    let v = new View();
    let f = new stat.FvcVisit();
    f.setQueryInfo("ACCOUNT", visitSummary.getSubQueryKey(),
                   visitSummary.getSubQueryValue(),
                   fVisitSummary.getDuration());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel(R.t("Your profile visits"));
    p.pushPanel(pp);

    this._fVisit.attachRender(pp.getContentPanel());
    this._fVisit.render();
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.acnt = window.acnt || {};
  window.acnt.FvcStatistics = FvcStatistics;
}
