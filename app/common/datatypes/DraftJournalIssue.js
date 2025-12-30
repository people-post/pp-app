import { JournalIssueBase } from './JournalIssueBase.js';

export class DraftJournalIssue extends JournalIssueBase {
  isDraft() { return true; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DraftJournalIssue = DraftJournalIssue;
}
