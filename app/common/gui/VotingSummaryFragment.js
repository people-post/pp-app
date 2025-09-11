(function(gui) {
class VotingSummaryFragment extends ui.Fragment {
  constructor() {
    super();
    this._fGeneral = new gui.VoteProgressFragment();
    this._fWealth = new gui.VoteProgressFragment();
    this.setChild("general", this._fGeneral);
    this.setChild("wealth", this._fWealth);
    this._summary = null;
  }

  setSummary(summary) { this._summary = summary; }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let config = {'threshold' : 0, 'total' : 0};
    let summary = this._summary;
    let bConfig = summary.getBallotConfig();

    let pp;
    if (bConfig.total.weight) {
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      config.total = bConfig.total.weight;
      config.threshold = bConfig.threshold.weight;
      let b = summary.getBallot(dat.Vote.T_VALUE.YEA);
      config.value = b ? b.weight : 0;
      b = summary.getBallot(dat.Vote.T_VALUE.NAY);
      config.nayValue = b ? b.weight : 0;
      this._fGeneral.setConfig(config);
      this._fGeneral.attachRender(pp);
      this._fGeneral.render();

      p.pushSpace(1);
    }

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    config.total = bConfig.total.count;
    config.threshold = bConfig.threshold.count;
    let b = summary.getBallot(dat.Vote.T_VALUE.YEA);
    config.value = b ? b.count : 0;
    b = summary.getBallot(dat.Vote.T_VALUE.NAY);
    config.nayValue = b ? b.count : 0;
    this._fWealth.setConfig(config);
    this._fWealth.attachRender(pp);
    this._fWealth.render();
  }
};

gui.VotingSummaryFragment = VotingSummaryFragment;
}(window.gui = window.gui || {}));
