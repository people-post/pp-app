import { Post } from './Post.js';
import { ChatMessage } from './ChatMessage.js';
import { SocialItem } from './SocialItem.js';

interface CommentData {
  type?: string;
  data?: unknown;
  from_user_id?: string;
  in_group_id?: string;
  in_group_type?: string;
  [key: string]: unknown;
}

interface CommentDataWithStatus {
  status?: string;
  guestName?: string;
  data?: string;
}

export class Comment extends Post {
  // Synced with backend
  static readonly T_STATUS = {
    PENDING: 'PENDING',
  } as const;

  protected _data: CommentData;

  constructor(data: CommentData) {
    super(data);
    this._data = data;
  }

  isSocialable(): boolean {
    return false;
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

