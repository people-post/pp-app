import { ArticleBase } from './ArticleBase.js';
import { OgpData } from './OgpData.js';
import { SocialItemId } from './SocialItemId.js';

interface CommentTagData {
  tag_id: string;
  comment_ids: Array<{ id: string; type: string }>;
}

interface ArticleData {
  comment_tags?: CommentTagData[];
  reply_to?: { id: string; type: string };
  [key: string]: unknown;
}

export class Article extends ArticleBase {
  #mTagComments = new Map<string, SocialItemId[]>();

  constructor(data: ArticleData) {
    super(data);
    this.#initCommentTags(data.comment_tags);
  }

  isDraft(): boolean {
    return false;
  }

  isPinnable(): boolean {
    return true;
  }

  isEditable(): boolean {
    if (this.isRepost()) {
      return false;
    }

    const files = this.getFiles();
    return files && files.every((f) => !f.isActive());
  }

  getOgpData(): OgpData {
    const d = new OgpData();
    d.setTitle(this.getTitle() || '');
    d.setType('website');
    d.setImageUrl('');
    d.setUrl(this.#getOgpUrl());
    d.setDescription(this.getContent() || '');
    const creationTime = this.getCreationTime();
    d.setCreationTime(creationTime || null);
    d.setUserId(this.getOwnerId() || null);
    d.setFiles(this.getFiles());
    return d;
  }

  getCommentTags(): string[] {
    return Array.from(this.#mTagComments.keys());
  }

  getTaggedCommentIds(tagId: string): SocialItemId[] {
    return this.#mTagComments.has(tagId) ? this.#mTagComments.get(tagId)! : [];
  }

  getHashtagIds(): string[] {
    return (this._data.hashtag_ids as string[]) || [];
  }

  getReplyToSocialId(): SocialItemId | null {
    if (this._data.reply_to) {
      const replyTo = this._data.reply_to as { id: string; type: string };
      return new SocialItemId(replyTo.id, replyTo.type);
    }
    return null;
  }

  #getOgpUrl(): string {
    return (
      'https://' + window.location.hostname + '/?id=' + this.getSocialId().toEncodedStr()
    );
  }

  #initCommentTags(ds: CommentTagData[] | undefined): void {
    if (!ds) {
      return;
    }
    for (const ct of ds) {
      const sids: SocialItemId[] = [];
      for (const d of ct.comment_ids) {
        sids.push(new SocialItemId(d.id, d.type));
      }
      this.#mTagComments.set(ct.tag_id, sids);
    }
  }
}

