import { ServerDataObject } from './ServerDataObject.js';
import { Post } from '../../types/blog.js';
import { RemoteFile } from './RemoteFile.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import type { FeedArticleData } from '../../types/backend2.js';
import { OgpData } from './OgpData.js';

export class FeedArticle extends ServerDataObject<FeedArticleData> implements Post {
  #files: RemoteFile[] = [];

  constructor(data: FeedArticleData) {
    super(data);
    if (data.files) {
      for (const f of data.files) {
        this.#files.push(new RemoteFile(f));
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

  getOgpData(): OgpData | null {
    return null;
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.FEED_ARTICLE;
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

  getOwnerId(): string | null {
    return this._data.owner_id || null;
  }

  getAuthorId(): string | null {
    return this._data.owner_id || null;
  }

  getUpdateTime(): Date | undefined {
    return this.getCreationTime();
  }

  getSourceUrl(): string | null {
    return this._data.url;
  }
}

