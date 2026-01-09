import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { VoteProgressFragment } from './VoteProgressFragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Vote } from '../datatypes/Vote.js';

interface VoteSummary {
  getBallotConfig(): {
    total: { weight: number; count: number };
    threshold: { weight: number; count: number };
  };
  getBallot(value: string): { weight: number; count: number } | null;
}

export class VotingSummaryFragment extends Fragment {
  private _fGeneral: VoteProgressFragment;
  private _fWealth: VoteProgressFragment;
  private _summary: VoteSummary | null = null;

  constructor() {
    super();
    this._fGeneral = new VoteProgressFragment();
    this._fWealth = new VoteProgressFragment();
    this.setChild("general", this._fGeneral);
    this.setChild("wealth", this._fWealth);
  }

  setSummary(summary: VoteSummary): void { this._summary = summary; }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._summary) {
      return;
    }
    let p = new ListPanel();
    render.wrapPanel(p);

    let config: {threshold: number; total: number; value: number; nayValue: number} = {'threshold' : 0, 'total' : 0, 'value': 0, 'nayValue': 0};
    let summary = this._summary;
    let bConfig = summary.getBallotConfig();

    let pp: PanelWrapper;
    if (bConfig.total.weight) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      config.total = bConfig.total.weight;
      config.threshold = bConfig.threshold.weight;
      let b = summary.getBallot(Vote.T_VALUE.YEA);
      config.value = b ? b.weight : 0;
      b = summary.getBallot(Vote.T_VALUE.NAY);
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
    let b = summary.getBallot(Vote.T_VALUE.YEA);
    config.value = b ? b.count : 0;
    b = summary.getBallot(Vote.T_VALUE.NAY);
    config.nayValue = b ? b.count : 0;
    this._fWealth.setConfig(config);
    this._fWealth.attachRender(pp);
    this._fWealth.render();
  }
}

export default VotingSummaryFragment;
