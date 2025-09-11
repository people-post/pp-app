(function(dat) {
class MessageThreadInfo extends dat.Notice {
  constructor(data) {
    super();
    this._data = data;
  }

  isFrom(type) { return this._data.from_id_type == type; }
  isFromUser() { return this.isFrom(dat.SocialItem.TYPE.USER); }

  getFromId() { return this._data.from_id; }
  getFromIdType() { return this._data.from_id_type; }
  getChatTarget() {
    let t = new dat.ChatTarget();
    t.setId(this._data.from_id);
    t.setIdType(this._data.from_id_type);
    return t;
  }
  getNUnread() { return this._data.n_unread; }
  getLatest() {
    return this._data.latest ? new dat.ChatMessage(this._data.latest) : null;
  }
};

dat.MessageThreadInfo = MessageThreadInfo;
}(window.dat = window.dat || {}));
