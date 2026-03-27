import { ServerDataObject } from './ServerDataObject.js';
import { Article as ArticleInterface } from '../../types/blog.js';
import { OgpData } from './OgpData.js';
import type { RemoteFile as IRemoteFile } from '../../types/basic.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { RemoteFile } from './RemoteFile.js';
import { ArticleData, CommentTagData } from '../../types/backend2.js';

export class Article extends ServerDataObject<ArticleData> implements ArticleInterface {
  #files: IRemoteFile[] | null = null;
  #attachments: IRemoteFile[] | null = null;
  #mTagComments = new Map<string, SocialItemId[]>();

  constructor(data: ArticleData) {
    super(data);
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
    return this._data.link_to;
  }

  getLinkType(): string | null {
    return this._data.link_type;
  }

  getLinkToSocialId(): SocialItemId {
    return new SocialItemId(this._data.link_to, this._data.link_type);
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.ARTICLE;
  }

  getTitle(): string | null {
    return this._data.title;
  }

  getContent(): string | null {
    return this._data.content;
  }

  getFiles(): IRemoteFile[] {
    if (this.#files) {
      return this.#files;
    }
    this.#files = [];
    if (this._data.files) {
      for (const f of this._data.files) {
        this.#files.push(new RemoteFile(f));
      }
    }

    return this.#files;
  }

  getAttachment(): IRemoteFile | null {
    if (this.#attachments) {
      return this.#attachments[0];
    }
    this.#attachments = [];
    if (this._data.attachments) {
      for (const d of this._data.attachments) {
        this.#attachments.push(new RemoteFile(d));
      }
    }
    return this.#attachments[0];
  }

  getVisibility(): string | null {
    return this._data.visibility;
  }

  getOwnerId(): string | null {
    return this._data.owner_id;
  }

  getAuthorId(): string | null {
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

  getExternalQuoteUrl(): string | null {
    if (this._data.link_type == SocialItem.TYPE.URL) {
      return this._data.link_to;
    } else {
      return null;
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

