import { ServerDataObject } from './ServerDataObject.js';
import { Article } from '../../types/blog.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { ArticleBaseData } from '../../types/backend2.js';

export class DraftArticle extends ServerDataObject implements Article {
  protected _data: ArticleBaseData;
  #files: RemoteFile[] = [];
  #attachments: RemoteFile[] = [];

  constructor(data: ArticleBaseData) {
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
  }

  isDraft(): boolean {
    return true;
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
    return this._data.link_to || undefined;
  }

  getLinkType(): string | undefined {
    return this._data.link_type;
  }

  getLinkToSocialId(): SocialItemId {
    return new SocialItemId(this._data.link_to, this._data.link_type || null);
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
    return this._data.visibility || undefined;
  }

  getOwnerId(): string | undefined {
    return this._data.owner_id || undefined;
  }

  getAuthorId(): string | undefined {
    return this._data.author_id || undefined;
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
      return this._data.link_to || undefined;
    } else {
      return undefined;
    }
  }

  isEditable(): boolean {
    return false;
  }

  isSocialable(): boolean {
    return true;
  }

  isPinnable(): boolean {
    return false;
  }

  getSocialId(): SocialItemId {
    return new SocialItemId(this.getId() as string, this.getSocialItemType());
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

  #isEmpty(): boolean {
    return this._data.title == null && this._data.content == null;
  }
}

