import { Notice } from './Notice.js';
import { SocialItem } from './SocialItem.js';
import { ChatTarget } from './ChatTarget.js';
import { ChatMessage } from './ChatMessage.js';

interface MessageThreadData {
  from_id: string;
  from_id_type: string;
  n_unread: number;
  latest?: Record<string, unknown>;
}

export class MessageThreadInfo extends Notice {
  private _data: MessageThreadData;

  constructor(data: MessageThreadData) {
    super();
    this._data = data;
  }

  isFrom(type: string): boolean {
    return this._data.from_id_type === type;
  }

  isFromUser(): boolean {
    return this.isFrom(SocialItem.TYPE.USER);
  }

  getFromId(): string {
    return this._data.from_id;
  }

  getFromIdType(): string {
    return this._data.from_id_type;
  }

  getChatTarget(): ChatTarget {
    const t = new ChatTarget();
    t.setId(this._data.from_id);
    t.setIdType(this._data.from_id_type);
    return t;
  }

  getNUnread(): number {
    return this._data.n_unread;
  }

  getLatest(): ChatMessage | null {
    return this._data.latest ? new ChatMessage(this._data.latest as Record<string, unknown>) : null;
  }
}

