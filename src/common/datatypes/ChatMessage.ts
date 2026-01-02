import { ServerDataObject } from './ServerDataObject.js';

export class ChatMessage extends ServerDataObject {
  // Synced with backend
  static readonly T_TYPE = {
    TEXT: 'TXT',
    FMT: 'FMT',
    GUEST_COMMENT: 'GST_CMT',
  } as const;

  // Synced with backend
  static readonly T_FMT = {
    REQUEST_ACCEPT: 'REQ_ACCEPT',
    REQUEST_DECLINE: 'REQ_DECLINE',
    NEW_GROUP_MEMBER: 'NEW_GRP_MEMBER',
  } as const;

  // TODO:
  // 1. Keys are keywords from T_FMT, not good
  // 2. Texts should be using R.get()
  static readonly T_FMT_TEMPLATES = {
    REQ_ACCEPT: `Your application to __NAME__ was approved.`,
    REQ_DECLINE: `Your application to __NAME__ was declined.`,
    NEW_GRP_MEMBER: `__NAME__ joined.`,
  } as const;

  isInGroup(): boolean {
    return !!(this._data.in_group_id as string | undefined);
  }

  getFromUserId(): string {
    return this._data.from_user_id as string;
  }

  getType(): string {
    return this._data.type as string;
  }

  getData(): unknown {
    return this._data.data;
  }
}

