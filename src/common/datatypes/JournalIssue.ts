import { ServerDataObject } from './ServerDataObject.js';
import { JournalIssue as JournalIssueInterface } from '../../types/blog.js';
import { JournalIssueSection } from './JournalIssueSection.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { JournalIssueData } from '../../types/backend2.js';
import { OgpData } from './OgpData.js';

export class JournalIssue extends ServerDataObject<JournalIssueData> implements JournalIssueInterface {
  #sections: JournalIssueSection[] = [];
  #mTagComments = new Map<string, SocialItemId[]>();

  constructor(data: JournalIssueData) {
    super(data);
    if (data.sections) {
      for (const d of data.sections) {
        this.#sections.push(new JournalIssueSection(d));
      }
    }
    if (data.comment_tags) {
      for (const ct of data.comment_tags) {
        const sids: SocialItemId[] = [];
        for (const d of ct.comment_ids) {
          sids.push(new SocialItemId(d.id, d.type));
        }
        this.#mTagComments.set(ct.tag_id, sids);
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
    return Array.from(this.#mTagComments.keys());
  }

  getHashtagIds(): string[] {
    return [];
  }

  getTaggedCommentIds(tagId: string): SocialItemId[] {
    return this.#mTagComments.has(tagId) ? this.#mTagComments.get(tagId)! : [];
  }

  getOgpData(): OgpData | null {
    return null;
  }

  isDraft(): boolean {
    return false;
  }

  containsPost(id: string): boolean {
    return this.getSections().some((s) => s.containsPost(id));
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.JOURNAL_ISSUE;
  }

  getJournalId(): string {
    return this._data.journal_id;
  }

  getIssueId(): string | null {
    return this._data.issue_id;
  }

  getAbstract(): string | null {
    return this._data.abstract;
  }

  getSummary(): string | null {
    return this._data.summary;
  }

  getTagIds(): string[] {
    return this._data.tag_ids;
  }

  getSections(): JournalIssueSection[] {
    return this.#sections;
  }
}

