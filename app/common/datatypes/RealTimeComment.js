(function(dat) {
class RealTimeComment extends dat.ChatMessage {
  // Synced with backend
  static T_STATUS = {
    PENDING : "PENDING",
  };

  isFromGuest() {
    return this._data.type == this.constructor.T_TYPE.GUEST_COMMENT
  }
  isPending() {
    return this.isFromGuest() &&
           this._data.data.status == this.constructor.T_STATUS.PENDING;
  }
  getGuestName() { return this._data.data.guestName; }
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

dat.RealTimeComment = RealTimeComment;
}(window.dat = window.dat || {}));
