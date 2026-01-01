import { JournalIssueBase } from './JournalIssueBase.js';

export class DraftJournalIssue extends JournalIssueBase {
  isDraft() { return true; }
};
