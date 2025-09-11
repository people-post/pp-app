(function(dat) {
class LikedItemNotice extends dat.Notice {
  constructor(itemId, itemType) {
    super();
    this._itemId = itemId;
    this._itemType = itemType;
    this._elements = [];
  }

  isFrom(type) { return type == this._itemType; }

  getFromId() { return this._itemId; }
  getFromIdType() { return this._itemType; }
  getNUnread() {
    let n = 0;
    for (let e of this._elements) {
      if (!e.read_at) {
        n++;
      }
    }
    return n;
  }
  getUserIds() {
    let ids = [];
    for (let e of this._elements) {
      ids.push(e.from_user_id);
    }
    return ids;
  }
  getNotificationIds() {
    let ids = [];
    for (let e of this._elements) {
      ids.push(e.id);
    }
    return ids;
  }

  addData(d) { this._elements.push(d); }
};

dat.LikedItemNotice = LikedItemNotice;
}(window.dat = window.dat || {}));