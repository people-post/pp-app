import { ChatMessage } from './ChatMessage.js';

interface RealTimeCommentData {
  type?: string;
  data?: {
    status?: string;
    guestName?: string;
    data?: string;
    [key: string]: unknown;
  } | string;
  [key: string]: unknown;
}

export class RealTimeComment extends ChatMessage {
  // Synced with backend
  static readonly T_STATUS = {
    PENDING: 'PENDING',
  } as const;

  protected _data: RealTimeCommentData;

  constructor(data: RealTimeCommentData) {
    super(data);
    this._data = data;
  }

  isFromGuest(): boolean {
    return this._data.type == ChatMessage.T_TYPE.GUEST_COMMENT;
  }

  isPending(): boolean {
    if (!this.isFromGuest()) {
      return false;
    }
    const data = this._data.data as { status?: string; [key: string]: unknown } | undefined;
    return data?.status == RealTimeComment.T_STATUS.PENDING;
  }

  getGuestName(): string | undefined {
    const data = this._data.data as { guestName?: string; [key: string]: unknown } | undefined;
    return data?.guestName;
  }

  getContent(): string {
    let text = '';
    if (this.isFromGuest()) {
      const data = this._data.data as { data?: string; status?: string; [key: string]: unknown } | undefined;
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

