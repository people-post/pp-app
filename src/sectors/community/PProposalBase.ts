import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PProposalBase extends Panel {
  isColorInvertible(): boolean { return false; }

  getIconPanel(): Panel | null { return null; }
  getTitlePanel(): Panel | null { return null; }
  getSubtitlePanel(): Panel | null { return null; }
  getStatusPanel(): Panel | null { return null; }
  getVotePanel(): Panel | null { return null; }
  getVotingSummaryPanel(): Panel | null { return null; }
  getContentPanel(): Panel | null { return null; }

  invertColor(): void {}
}
