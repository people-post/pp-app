(function(scol) {
class FvcFlashcard extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fCard = new scol.FFlashcard();
    this.setChild("card", this._fCard);

    this._fNavBar = new scol.FListNavigationBar();
    this._fNavBar.setDelegate(this);
    this.setChild("navBar", this._fNavBar);

    this._idList = [];
  }

  setQuizIds(ids) {
    this._idList = ids;
    this._fNavBar.setIdx(0);
    this._fNavBar.setNTotal(ids.length);
    this._fCard.setQuizId(ids[0]);
  }

  onNavigableListItemFragmentRequestSwitchItem(fNavBar, idx) {
    this._fCard.setQuizId(this._idList[idx]);
    this._fCard.render();
  }

  _renderContentOnRender(render) {
    let pList = new ui.ListPanel();
    render.wrapPanel(pList);

    let p = new ui.PanelWrapper();
    p.setClassName("hmin300px");
    pList.pushPanel(p);
    this._fCard.attachRender(p);
    this._fCard.render();

    pList.pushSpace(1);

    p = new ui.PanelWrapper();
    p.setClassName("pad5");
    pList.pushPanel(p);
    this._fNavBar.attachRender(p);
    this._fNavBar.render();
  }
};

scol.FvcFlashcard = FvcFlashcard;
}(window.scol = window.scol || {}));
