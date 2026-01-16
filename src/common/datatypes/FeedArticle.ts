import { ServerDataObject } from './ServerDataObject.js';
import { Post } from '../../types/blog.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';

interface FeedArticleData {
  files?: unknown[];
  title?: string;
  content?: string;
  owner_id?: string;
  url?: string;
  [key: string]: unknown;
}

export class FeedArticle extends ServerDataObject implements Post {
  #files: RemoteFile[] = [];
  protected _data: FeedArticleData;

  constructor(data: FeedArticleData) {
    super(data);
    this._data = data;
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f as Record<string, unknown>));
      }
    }
  }

  isRepost(): boolean {
    return false;
  }

  isEditable(): boolean {
    return false;
  }

  isSocialable(): boolean {
    return false;
  }

  isPinnable(): boolean {
    return false;
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

  getSocialItemType(): string {
    return SocialItem.TYPE.FEED_ARTICLE;
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

  getOwnerId(): string | null {
    return this._data.owner_id || null;
  }

  getAuthorId(): string | null {
    return this._data.owner_id || null;
  }

  getUpdateTime(): Date {
    const createdAt = this._data.created_at;
    if (createdAt instanceof Date) {
      return createdAt;
    }
    return new Date((createdAt as number || 0) * 1000);
  }

  getSourceUrl(): string | undefined {
    return this._data.url;
  }
}

