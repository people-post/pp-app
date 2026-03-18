import { ServerDataObject } from './ServerDataObject.js';
import { Post } from '../../types/blog.js';
import { ChatMessage } from './ChatMessage.js';
import { SocialItem } from './SocialItem.js';
import { SocialItemId } from './SocialItemId.js';
import type { CommentData, CommentDataWithStatus } from '../../types/backend2.js';

export class Comment extends ServerDataObject implements Post {
  // Synced with backend
  static readonly T_STATUS = {
    PENDING: 'PENDING',
  } as const;

  protected _data: CommentData;

  constructor(data: CommentData) {
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

  isFromGuest(): boolean {
    return this._data.type == ChatMessage.T_TYPE.GUEST_COMMENT;
  }

  isPending(): boolean {
    return (
      this.isFromGuest() &&
      (this._data.data as CommentDataWithStatus)?.status == Comment.T_STATUS.PENDING
    );
  }

  getSocialItemType(): string {
    return SocialItem.TYPE.COMMENT;
  }

  getFromUserId(): string | undefined {
    return this._data.from_user_id;
  }

  getGuestName(): string | undefined {
    return (this._data.data as CommentDataWithStatus)?.guestName;
  }

  getTargetItemId(): string | undefined {
    return this._data.in_group_id;
  }

  getTargetItemType(): string | undefined {
    return this._data.in_group_type;
  }

  getContent(): string {
    let text = '';
    if (this.isFromGuest()) {
      const data = this._data.data as CommentDataWithStatus;
      text = data?.data || '';
      if (this.isPending()) {
        text = '(pending)' + text;
      }
    } else {
      text = (this._data.data as string) || '';
    }
    return text;
  }
}

