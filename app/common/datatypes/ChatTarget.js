import { SocialItemId } from './SocialItemId.js';
import { SocialItem } from './SocialItem.js';

export class ChatTarget {
  #sId = new SocialItemId();
  #isReadOnly = false;

  isReadOnly() { return this.#isReadOnly; }
  isGroup() { return this.getIdType() == SocialItem.TYPE.GROUP; }
  isUser() { return this.getIdType() == SocialItem.TYPE.USER; }

  getId() { return this.#sId.getValue(); }
  getIdType() { return this.#sId.getType(); }

  setId(id) { this.#sId.setValue(id); }
  setIdType(t) { this.#sId.setType(t); }
  setIsReadOnly(b) { this.#isReadOnly = b; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ChatTarget = ChatTarget;
}
