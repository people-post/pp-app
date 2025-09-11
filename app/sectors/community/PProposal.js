(function(cmut) {
const _CPT_PROPOSAL = {
  MAIN : `<div id="__ID_TITLE__" class="view-content-title"></div>
    <div id="__ID_SUBTITLE__" class="small-info-text"></div>
    <br>
    <div id="__ID_VOTING_SUMMARY__"></div>
    <br>
    <div id="__ID_CONTENT__"></div>`,
}

class PProposal extends cmut.PProposalBase {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pSubtitle = new ui.Panel();
    this._pVotingSummary = new ui.PanelWrapper();
    this._pContent = new ui.Panel();
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

cmut.PProposal = PProposal;
}(window.cmut = window.cmut || {}));
