(function(dat) {
class DraftJournalIssue extends dat.JournalIssueBase {
  isDraft() { return true; }
};

dat.DraftJournalIssue = DraftJournalIssue;
}(window.dat = window.dat || {}));
