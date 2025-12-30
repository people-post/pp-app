
class FvcProposal extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fProposal = new cmut.FProposal();
    this._fProposal.setLayoutType(cmut.FProposal.T_LAYOUT.FULL);
    this.setChild("proposal", this._fProposal);
  }

  setProposalId(id) { this._fProposal.setProposalId(id); }

  _renderContentOnRender(render) {
    this._fProposal.attachRender(render);
    this._fProposal.render();
  }
};

cmut.FvcProposal = FvcProposal;
}(window.cmut = window.cmut || {}));
