import { Post } from './Post.js';
import { JournalIssueSection } from './JournalIssueSection.js';
import { SocialItem } from '../interface/SocialItem.js';
import { JournalIssueBaseData } from '../../types/backend2.js';

export class JournalIssueBase extends Post {
  #sections: JournalIssueSection[] = [];
  protected _data: JournalIssueBaseData;

  constructor(data: JournalIssueBaseData) {
    super(data);
    this._data = data;
    if (data.sections) {
      for (const d of data.sections) {
        this.#sections.push(new JournalIssueSection(d));
      }
    }
  }

  isDraft(): boolean {
    return false;
  }

  isEditable(): boolean {
    return true;
  }

  containsPost(id: string): boolean {
    return this.getSections().some((s) => s.containsPost(id));
  }

  getOwnerId(): string | null {
    return this._data.owner_id || null;
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.JOURNAL_ISSUE;
  }

  getJournalId(): string | undefined {
    return this._data.journal_id;
  }

  getIssueId(): string | undefined {
    return this._data.issue_id;
  }

  getAbstract(): string | undefined {
    return this._data.abstract;
  }

  getSummary(): string | undefined {
    return this._data.summary;
  }

  getTagIds(): string[] | undefined {
    return this._data.tag_ids;
  }

  getSections(): JournalIssueSection[] {
    return this.#sections;
  }
}

