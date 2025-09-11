(function(cmut) {
class FvcCoinHistory extends ui.FScrollViewContent {
  constructor() {
    super();
    this._communityId;
  }

  setCommunityId(id) { this._communityId = id; }
};

cmut.FvcCoinHistory = FvcCoinHistory;
}(window.cmut = window.cmut || {}));

