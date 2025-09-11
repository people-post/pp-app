(function(dat) {
class SocialInfo extends dat.ServerDataObject {
  isLiked() { return this._data.is_liked; }
  isLinked() { return this._data.is_linked; }

  getNLikes() { return this._data.n_likes; }
  getNLinks() { return this._data.n_links; }
  getNComments() { return this._data.n_comments; }
};

dat.SocialInfo = SocialInfo;
}(window.dat = window.dat || {}));
