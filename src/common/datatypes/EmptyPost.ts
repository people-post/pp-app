import { ServerDataObject } from './ServerDataObject.js';
import { Post } from '../../types/blog.js';
import { SocialItemId } from './SocialItemId.js';

interface EmptyPostData {
  err_code?: string;
  [key: string]: unknown;
}

export class EmptyPost extends ServerDataObject implements Post {
  // Use a different name to avoid conflict with SocialItem.TYPE
  static readonly ERROR_TYPE = {
    DELETED: 'DELETED',
    PERMISSION: 'PERMISSION',
  } as const;
  
  // Keep TYPE as alias for backward compatibility, but make it compatible with base class
  static readonly TYPE = {
    ...EmptyPost.ERROR_TYPE,
    // Include base class TYPE properties for type compatibility
    ARTICLE: 'ARTICLE',
    JOURNAL_ISSUE: 'JOURNAL_ISSUE',
    PROJECT: 'PROJECT',
    PRODUCT: 'PRODUCT',
    ORDER: 'ORDER',
    URL: 'URL',
    FEED_ARTICLE: 'FEED_ARTICLE',
    USER: 'USER',
    FEED: 'FEED',
    GROUP: 'GROUP',
    COMMENT: 'COMMENT',
    HASHTAG: 'HASHTAG',
    INVALID: 'INVALID',
  } as const;

  protected _data: EmptyPostData;

  constructor(data: EmptyPostData) {
    super(data);
    this._data = data;
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

  getOwnerId(): string | null {
    return null;
  }

  getAuthorId(): string | null {
    return null;
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
    // Return empty string for invalid type since base class expects string
    // The INVALID symbol is used internally but can't be returned as string
    return '';
  }

  getErrorCode(): string | undefined {
    return this._data.err_code;
  }
}

