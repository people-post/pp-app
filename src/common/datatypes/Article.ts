import { ArticleBase } from './ArticleBase.js';
import { OgpData } from './OgpData.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { ArticleBaseData, CommentTagData } from '../../types/backend2.js';

interface ArticleData extends ArticleBaseData {
  comment_tags?: CommentTagData[];
  reply_to?: { id: string; type: string };
  [key: string]: unknown;
}

export class Article extends ArticleBase {
  #files: RemoteFile[] = [];
  #attachments: RemoteFile[] = [];
  #mTagComments = new Map<string, SocialItemId[]>();

  constructor(data: ArticleData) {
    super(data);
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f as Record<string, unknown>));
      }
    }

    if (data.attachments) {
      for (const d of data.attachments) {
        this.#attachments.push(new RemoteFile(d as Record<string, unknown>));
      }
    }
    this.#initCommentTags(data.comment_tags);
  }

  isDraft(): boolean {
    return false;
  }

  isRepost(): boolean {
    return (
      !!this._data.link_to &&
      (this._data.link_type == null ||
        this._data.link_type == SocialItem.TYPE.ARTICLE ||
        this._data.link_type == SocialItem.TYPE.FEED_ARTICLE) &&
      this.#isEmpty()
    );
  }

  isQuotePost(): boolean {
    return !!this._data.link_to && !this.isRepost();
  }

  getLinkTo(): string | null {
    return this._data.link_to || null;
  }

  getLinkType(): string | null | undefined {
    return this._data.link_type;
  }

  getLinkToSocialId(): SocialItemId {
    return new SocialItemId(this._data.link_to, this._data.link_type || null);
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.ARTICLE;
  }

  getTitle(): string | null | undefined {
    return this._data.title;
  }

  getContent(): string | null | undefined {
    return this._data.content;
  }

  getFiles(): RemoteFile[] {
    return this.#files;
  }

  getAttachment(): RemoteFile | undefined {
    return this.#attachments[0];
  }

  getVisibility(): string | null {
    return this._data.visibility || null;
  }

  getOwnerId(): string | null {
    return this._data.owner_id || null;
  }

  getAuthorId(): string | null {
    return this._data.author_id || null;
  }

  getTagIds(): string[] | undefined {
    return this._data.tag_ids;
  }

  getPublishMode(): string | undefined {
    return this._data.publish_mode;
  }

  getPendingAuthorTagIds(): string[] | undefined {
    return this._data.author_tag_ids;
  }

  getPendingAuthorNewTagNames(): string[] | undefined {
    return this._data.author_new_tag_names;
  }

  getPendingNewTagNames(): string[] | undefined {
    return this._data.new_tag_names;
  }

  getClassification(): string | undefined {
    return this._data.classification;
  }

  getUpdateTime(): Date {
    return new Date((this._data.updated_at || 0) * 1000);
  }

  getExternalQuoteUrl(): string | null {
    if (this._data.link_type == SocialItem.TYPE.URL) {
      return this._data.link_to || null;
    } else {
      return null;
    }
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

  #isEmpty(): boolean {
    return this._data.title == null && this._data.content == null;
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

