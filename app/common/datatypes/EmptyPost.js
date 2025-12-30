export class EmptyPost extends dat.Post {
  static TYPE = {DELETED : "DELETED", PERMISSION: "PERMISSION"};

  isSocialable() { return false; }

  getSocialItemType() { return dat.SocialItem.TYPE.INVALID; }
  getErrorCode() { return this._data.err_code; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.EmptyPost = EmptyPost;
}
