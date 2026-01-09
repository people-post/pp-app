import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { stat } from '../../common/statistics/index.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcReport extends FScrollViewContent {
  protected _fVisit: stat.FVisit;

  constructor() {
    super();
    this._fVisit = new stat.FVisit();
    this._fVisit.setQueryInfo("DOMAIN");
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary: stat.FVisit, visitSummary: unknown): void {
    let v = new View();
    let f = new stat.FvcVisit();
    f.setQueryInfo("DOMAIN", (visitSummary as { getSubQueryKey(): string; getSubQueryValue(): string; getDuration(): unknown }).getSubQueryKey(),
                   (visitSummary as { getSubQueryKey(): string; getSubQueryValue(): string; getDuration(): unknown }).getSubQueryValue(),
                   fVisitSummary.getDuration());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v);
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel(R.t("Your domain visits"));
    p.pushPanel(pp);

    let contentPanel = pp.getContentPanel();
    if (contentPanel) {
      this._fVisit.attachRender(contentPanel);
      this._fVisit.render();
    }
  }
};
