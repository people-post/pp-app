(function(dat) {
class ChatTarget {
  #sId = new dat.SocialItemId();
  #isReadOnly = false;

  isReadOnly() { return this.#isReadOnly; }
  isGroup() { return this.getIdType() == dat.SocialItem.TYPE.GROUP; }
  isUser() { return this.getIdType() == dat.SocialItem.TYPE.USER; }

  getId() { return this.#sId.getValue(); }
  getIdType() { return this.#sId.getType(); }

  setId(id) { this.#sId.setValue(id); }
  setIdType(t) { this.#sId.setType(t); }
  setIsReadOnly(b) { this.#isReadOnly = b; }
};

dat.ChatTarget = ChatTarget;
}(window.dat = window.dat || {}));
