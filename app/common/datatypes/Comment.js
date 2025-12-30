export class Comment extends dat.Post {
  // Synced with backend
  static T_STATUS = {
    PENDING : "PENDING",
  };

  isSocialable() { return false; }

  isFromGuest() {
    return this._data.type == dat.ChatMessage.T_TYPE.GUEST_COMMENT;
  }
  isPending() {
    return this.isFromGuest() &&
           this._data.data.status == this.constructor.T_STATUS.PENDING;
  }

  getSocialItemType() { return dat.SocialItem.TYPE.COMMENT; }
  getFromUserId() { return this._data.from_user_id; }
  getGuestName() { return this._data.data.guestName; }
  getTargetItemId() { return this._data.in_group_id; }
  getTargetItemType() { return this._data.in_group_type; }
  getContent() {
    let text = "";
    if (this.isFromGuest()) {
      text = this._data.data.data;
      if (this.isPending()) {
        text = "(pending)" + text;
      }
    } else {
      text = this._data.data;
    }
    return text;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Comment = Comment;
}
