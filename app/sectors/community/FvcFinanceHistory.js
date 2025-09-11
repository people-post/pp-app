(function(cmut) {
class FvcFinanceHistory extends ui.FScrollViewContent {
  constructor() {
    super();
    this._communityId;
  }

  setCommunityId(id) { this._communityId = id; }
};

cmut.FvcFinanceHistory = FvcFinanceHistory;
}(window.cmut = window.cmut || {}));
