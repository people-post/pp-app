
export class PProposalBase extends ui.Panel {
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.cmut = window.cmut || {};
  window.cmut.PProposalBase = PProposalBase;
}
