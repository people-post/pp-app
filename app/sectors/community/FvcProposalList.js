(function(cmut) {
class FvcProposalList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new cmut.FProposalList();
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);
  }

  setCommunityId(id) { this._fList.setCommunityId(id); }

  reload() { this._fList.reload(); }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};

cmut.FvcProposalList = FvcProposalList;
}(window.cmut = window.cmut || {}));
