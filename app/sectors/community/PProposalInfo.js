
const _CPT_PROPOSAL_INFO = {
  MAIN : `<div id="__ID_MAIN__" class="proposal-info">
  <div class="flex space-between clickable">
    <div>
     <span id="__ID_ICON__" class="inline-block s-icon6 clickable"></span>
     <span id="__ID_TITLE__"></span>
    </div>
    <div class="small-info-text right-align">
      <div id="__ID_STATUS__"></div>
      <div id="__ID_VOTE__"></div>
    </div>
  </div>
  <div id="__ID_VOTING_SUMMARY__"></div>
  </div>`,
}

class PProposalInfo extends cmut.PProposalBase {
  constructor() {
    super();
    this._pTitle = new ui.Panel();
    this._pIcon = new ui.Panel();
    this._pStatus = new ui.Panel();
    this._pVote = new ui.Panel();
    this._pVotingSummary = new ui.PanelWrapper();
  }

  isColorInvertible() { return true; }

  getIconPanel() { return this._pIcon; }
  getTitlePanel() { return this._pTitle; }
  getStatusPanel() { return this._pStatus; }
  getVotePanel() { return this._pVote; }
  getVotingSummaryPanel() { return this._pVotingSummary; }

  invertColor() {
    let e = document.getElementById(this._getSubElementId("M"));
    if (e) {
      e.className = "proposal-info selected";
    }
  }

  _renderFramework() {
    let s = _CPT_PROPOSAL_INFO.MAIN;
    s = s.replace("__ID_MAIN__", this._getSubElementId("M"));
    s = s.replace("__ID_ICON__", this._getSubElementId("I"));
    s = s.replace("__ID_TITLE__", this._getSubElementId("T"));
    s = s.replace("__ID_STATUS__", this._getSubElementId("S"));
    s = s.replace("__ID_VOTE__", this._getSubElementId("V"));
    s = s.replace("__ID_VOTING_SUMMARY__", this._getSubElementId("VS"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this._pIcon.attach(this._getSubElementId("I"));
    this._pTitle.attach(this._getSubElementId("T"));
    this._pStatus.attach(this._getSubElementId("S"));
    this._pVote.attach(this._getSubElementId("V"));
    this._pVotingSummary.attach(this._getSubElementId("VS"));
  }
};

cmut.PProposalInfo = PProposalInfo;
}(window.cmut = window.cmut || {}));
