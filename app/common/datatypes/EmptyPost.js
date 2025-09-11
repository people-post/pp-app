(function(dat) {
class EmptyPost extends dat.Post {
  static TYPE = {DELETED : "DELETED", PERMISSION: "PERMISSION"};

  isSocialable() { return false; }

  getSocialItemType() { return dat.SocialItem.TYPE.INVALID; }
  getErrorCode() { return this._data.err_code; }
};

dat.EmptyPost = EmptyPost;
}(window.dat = window.dat || {}));
