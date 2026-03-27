import { ServerDataObject } from './ServerDataObject.js';
import { Article } from '../../types/blog.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import { ArticleBaseData } from '../../types/backend2.js';

export class DraftArticle extends ServerDataObject<ArticleBaseData> implements Article {
  #files: RemoteFile[] = [];
  #attachments: RemoteFile[] = [];

  constructor(data: ArticleBaseData) {
    super(data);
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f));
      }
    }

    if (data.attachments) {
      for (const d of data.attachments) {
        this.#attachments.push(new RemoteFile(d));
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

  getFiles(): RemoteFile[] {
    return this.#files;
  }

  getAttachment(): RemoteFile | null {
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
    return this._data.tag_ids;
  }

  getPublishMode(): string {
    return this._data.publish_mode ?? '';
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
    return new SocialItemId(this.getId(), this.getSocialItemType());
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

