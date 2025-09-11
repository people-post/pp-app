(function(stat) {
class FvcVisit extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fVisit = new stat.FVisit();
    this._fVisit.setDelegate(this);
    this.setChild("summary", this._fVisit);
  }

  onVisitSummaryFragmentRequestShowSubSummary(fVisitSummary, visitSummary) {}

  setQueryInfo(type, key, value, duration) {
    this._fVisit.setQueryInfo(type, key, value, duration);
  }

  _renderContentOnRender(render) {
    this._fVisit.attachRender(render);
    this._fVisit.render();
  }
};

stat.FvcVisit = FvcVisit;
}(window.stat = window.stat || {}));
