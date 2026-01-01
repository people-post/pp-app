import { Notice } from './Notice.js';
import { SocialItem } from './SocialItem.js';
import { ChatTarget } from './ChatTarget.js';
import { ChatMessage } from './ChatMessage.js';

export class MessageThreadInfo extends Notice {
  constructor(data) {
    super();
    this._data = data;
  }

  isFrom(type) { return this._data.from_id_type == type; }
  isFromUser() { return this.isFrom(SocialItem.TYPE.USER); }

  getFromId() { return this._data.from_id; }
  getFromIdType() { return this._data.from_id_type; }
  getChatTarget() {
    let t = new ChatTarget();
    t.setId(this._data.from_id);
    t.setIdType(this._data.from_id_type);
    return t;
  }
  getNUnread() { return this._data.n_unread; }
  getLatest() {
    return this._data.latest ? new ChatMessage(this._data.latest) : null;
  }
};
