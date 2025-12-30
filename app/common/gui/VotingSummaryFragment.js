import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { VoteProgressFragment } from './VoteProgressFragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class VotingSummaryFragment extends Fragment {
  constructor() {
    super();
    this._fGeneral = new VoteProgressFragment();
    this._fWealth = new VoteProgressFragment();
    this.setChild("general", this._fGeneral);
    this.setChild("wealth", this._fWealth);
    this._summary = null;
  }

  setSummary(summary) { this._summary = summary; }

  _renderOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let config = {'threshold' : 0, 'total' : 0};
    let summary = this._summary;
    let bConfig = summary.getBallotConfig();

    let pp;
    if (bConfig.total.weight) {
      pp = new PanelWrapper();
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

    pp = new PanelWrapper();
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

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.VotingSummaryFragment = VotingSummaryFragment;
}
