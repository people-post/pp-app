export class DraftJournalIssue extends dat.JournalIssueBase {
  isDraft() { return true; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DraftJournalIssue = DraftJournalIssue;
}
