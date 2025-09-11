(function(cmut) {
class PProposalBase extends ui.Panel {
  isColorInvertible() { return false; }

  getIconPanel() { return null; }
  getTitlePanel() { return null; }
  getSubtitlePanel() { return null; }
  getStatusPanel() { return null; }
  getVotePanel() { return null; }
  getVotingSummaryPanel() { return null; }
  getContentPanel() { return null; }

  invertColor() {}
};

cmut.PProposalBase = PProposalBase;
}(window.cmut = window.cmut || {}));
