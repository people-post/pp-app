import { Post } from './Post.js';
import { JournalIssueSection } from './JournalIssueSection.js';
import { SocialItem } from './SocialItem.js';

export class JournalIssueBase extends Post {
  #sections = [];

  constructor(data) {
    super(data);
    for (let d of data.sections) {
      this.#sections.push(new JournalIssueSection(d));
    }
  }

  isDraft() { return false; }
  isEditable() { return true; }

  containsPost(id) { return this.getSections().some(s => s.containsPost(id)); }

  getOwnerId() { return this._data.owner_id; }
  getSocialItemType() { return SocialItem.TYPE.JOURNAL_ISSUE; }
  getJournalId() { return this._data.journal_id; }
  getIssueId() { return this._data.issue_id; }
  getAbstract() { return this._data.abstract; }
  getSummary() { return this._data.summary; }
  getTagIds() { return this._data.tag_ids; }

  getSections() { return this.#sections; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.JournalIssueBase = JournalIssueBase;
}
