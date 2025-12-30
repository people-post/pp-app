
export class FvcReport extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fVisit = new stat.FVisit();
    this._fVisit.setQueryInfo("DOMAIN");
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary, visitSummary) {
    let v = new ui.View();
    let f = new stat.FvcVisit();
    f.setQueryInfo("DOMAIN", visitSummary.getSubQueryKey(),
                   visitSummary.getSubQueryValue(),
                   fVisitSummary.getDuration());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.SectionPanel(R.t("Your domain visits"));
    p.pushPanel(pp);

    this._fVisit.attachRender(pp.getContentPanel());
    this._fVisit.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hstn = window.hstn || {};
  window.hstn.FvcReport = FvcReport;
}
