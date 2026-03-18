import { ServerDataObject } from './ServerDataObject.js';
import { Article as ArticleInterface } from '../../types/blog.js';
import { OgpData } from './OgpData.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { ArticleData, CommentTagData } from '../../types/backend2.js';

export class Article extends ServerDataObject implements ArticleInterface {
  protected _data: ArticleData;
  #files: RemoteFile[] = [];
  #attachments: RemoteFile[] = [];
  #mTagComments = new Map<string, SocialItemId[]>();

  constructor(data: ArticleData) {
    super(data);
    this._data = data;
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

  getLinkTo(): string | undefined {
    return this._data.link_to;
  }

  getLinkType(): string | undefined {
    return this._data.link_type;
  }

  getLinkToSocialId(): SocialItemId {
    return new SocialItemId(this._data.link_to, this._data.link_type);
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.ARTICLE;
  }

  getTitle(): string | undefined {
    return this._data.title;
  }

  getContent(): string | undefined {
    return this._data.content;
  }

  getFiles(): RemoteFile[] {
    return this.#files;
  }

  getAttachment(): RemoteFile | undefined {
    return this.#attachments[0];
  }

  getVisibility(): string | undefined {
    return this._data.visibility;
  }

  getOwnerId(): string | undefined {
    return this._data.owner_id;
  }

  getAuthorId(): string | undefined {
    return this._data.author_id;
  }

  getTagIds(): string[] {
    return this._data.tag_ids || [];
  }

  getPublishMode(): string {
    return this._data.publish_mode || '';
  }

  getPendingAuthorTagIds(): string[] {
    return this._data.author_tag_ids || [];
  }

  getPendingAuthorNewTagNames(): string[] {
    return this._data.author_new_tag_names || [];
  }

  getPendingNewTagNames(): string[] {
    return this._data.new_tag_names || [];
  }

  getClassification(): string {
    return this._data.classification || '';
  }

  getUpdateTime(): Date {
    return new Date((this._data.updated_at || 0) * 1000);
  }

  getExternalQuoteUrl(): string | undefined {
    if (this._data.link_type == SocialItem.TYPE.URL) {
      return this._data.link_to;
    } else {
      return undefined;
    }
  }

  isPinnable(): boolean {
    return true;
  }

  isSocialable(): boolean {
    return true;
  }

  getSocialId(): SocialItemId {
    return new SocialItemId(this.getId() as string, this.getSocialItemType());
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

