import { Post } from './Post.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from '../interface/SocialItem.js';

interface FeedArticleData {
  files?: unknown[];
  title?: string;
  content?: string;
  owner_id?: string;
  url?: string;
  [key: string]: unknown;
}

export class FeedArticle extends Post {
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

  isSocialable(): boolean {
    return false;
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

