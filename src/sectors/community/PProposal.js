
const _CPT_PROPOSAL = {
  MAIN : `<div id="__ID_TITLE__" class="view-content-title"></div>
    <div id="__ID_SUBTITLE__" class="small-info-text"></div>
    <br>
    <div id="__ID_VOTING_SUMMARY__"></div>
    <br>
    <div id="__ID_CONTENT__"></div>`,
}

import { PProposalBase } from './PProposalBase.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

export class PProposal extends PProposalBase {
  constructor() {
    super();
    this._pTitle = new Panel();
    this._pSubtitle = new Panel();
    this._pVotingSummary = new PanelWrapper();
    this._pContent = new Panel();
  }

  getTitlePanel() { return this._pTitle; }
  getSubtitlePanel() { return this._pSubtitle; }
  getVotingSummaryPanel() { return this._pVotingSummary; }
  getContentPanel() { return this._pContent; }

  _renderFramework() {
    let s = _CPT_PROPOSAL.MAIN;
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_SUBTITLE__", this._getSubElementId("ST"));
    s = s.replace("__ID_VOTING_SUMMARY__", this._getSubElementId("VS"));
    s = s.replace("__ID_CONTENT__", this._getSubElementId("C"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pTitle.attach(this._getSubElementId("T"));
    this._pSubtitle.attach(this._getSubElementId("ST"));
    this._pVotingSummary.attach(this._getSubElementId("VS"));
    this._pContent.attach(this._getSubElementId("C"));
  }
};
