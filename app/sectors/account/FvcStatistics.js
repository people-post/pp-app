(function(acnt) {
class FvcStatistics extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fVisit = new stat.FVisit();
    this._fVisit.setQueryInfo("ACCOUNT");
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary, visitSummary) {
    let v = new ui.View();
    let f = new stat.FvcVisit();
    f.setQueryInfo("ACCOUNT", visitSummary.getSubQueryKey(),
                   visitSummary.getSubQueryValue(),
                   fVisitSummary.getDuration());
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.SectionPanel(R.t("Your profile visits"));
    p.pushPanel(pp);

    this._fVisit.attachRender(pp.getContentPanel());
    this._fVisit.render();
  }
};

acnt.FvcStatistics = FvcStatistics;
}(window.acnt = window.acnt || {}));
