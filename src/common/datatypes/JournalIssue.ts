import { JournalIssueBase } from './JournalIssueBase.js';
import { SocialItemId } from './SocialItemId.js';

interface CommentTagData {
  tag_id: string;
  comment_ids: Array<{ id: string; type: string }>;
}

interface JournalIssueData {
  comment_tags?: CommentTagData[];
  [key: string]: unknown;
}

export class JournalIssue extends JournalIssueBase {
  #mTagComments = new Map<string, SocialItemId[]>();

  constructor(data: JournalIssueData) {
    super(data);
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

  getCommentTags(): string[] {
    return Array.from(this.#mTagComments.keys());
  }

  getTaggedCommentIds(tagId: string): SocialItemId[] {
    return this.#mTagComments.has(tagId) ? this.#mTagComments.get(tagId)! : [];
  }
}

