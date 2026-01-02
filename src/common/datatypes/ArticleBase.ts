import { Post } from './Post.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';

interface ArticleBaseData {
  files?: unknown[];
  attachments?: unknown[];
  link_to?: string;
  link_type?: string | null;
  title?: string | null;
  content?: string | null;
  visibility?: string;
  owner_id?: string;
  author_id?: string;
  tag_ids?: string[];
  publish_mode?: string;
  author_tag_ids?: string[];
  author_new_tag_names?: string[];
  new_tag_names?: string[];
  classification?: string;
  updated_at?: number;
  [key: string]: unknown;
}

export class ArticleBase extends Post {
  #files: RemoteFile[] = [];
  #attachments: RemoteFile[] = [];
  protected _data: ArticleBaseData;

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
    throw new Error('isDraft is required in ArticleBase');
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

  #isEmpty(): boolean {
    return this._data.title == null && this._data.content == null;
  }
}

