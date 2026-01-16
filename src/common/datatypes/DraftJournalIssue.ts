import { ServerDataObject } from './ServerDataObject.js';
import { JournalIssue } from '../../types/blog.js';
import { JournalIssueSection } from './JournalIssueSection.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { JournalIssueBaseData } from '../../types/backend2.js';

export class DraftJournalIssue extends ServerDataObject implements JournalIssue {
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

  isRepost(): boolean {
    return false;
  }

  isEditable(): boolean {
    return true;
  }

  isSocialable(): boolean {
    return true;
  }

  isPinnable(): boolean {
    return false;
  }

  getOwnerId(): string | null {
    return this._data.owner_id || null;
  }

  getAuthorId(): string | null {
    return null;
  }

  getLinkTo(): string | null {
    return null;
  }

  getLinkToSocialId(): SocialItemId | null {
    return null;
  }

  getSocialId(): SocialItemId {
    return new SocialItemId(this.getId() as string, this.getSocialItemType());
  }

  getVisibility(): string | null {
    return null;
  }

  getCommentTags(): string[] {
    return [];
  }

  getHashtagIds(): string[] {
    return [];
  }

  getTaggedCommentIds(_tagId: string): SocialItemId[] {
    return [];
  }

  getOgpData(): unknown {
    return null;
  }

  isDraft(): boolean {
    return true;
  }

  containsPost(id: string): boolean {
    return this.getSections().some((s) => s.containsPost(id));
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

