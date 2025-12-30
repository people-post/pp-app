
class FvcExplorer extends ui.FScrollViewContent {
  #fmSearch;
  #fList;
  #fBtnNew;

  constructor() {
    super();
    this.#fmSearch = new ui.FHeaderMenu();
    this.#fmSearch.setIcon(C.ICON.M_SEARCH, new SearchIconOperator());
    let f = new srch.FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    this.#fList = new wksp.FIdolProjectList();
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

    this.#fBtnNew = new gui.ActionButton();
    this.#fBtnNew.setIcon(gui.ActionButton.T_ICON.NEW);
    this.#fBtnNew.setDelegate(this);
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(ui.C.URL_PARAM.ID);
    if (id) {
      let sid = dat.SocialItemId.fromEncodedStr(id);
      if (sid) {
        this.#fList.switchToItem(sid.getValue());
      }
    }
  }

  getUrlParamString() {
    let id = this.#fList.getCurrentId();
    if (id) {
      let sid = new dat.SocialItemId(id, dat.SocialItem.TYPE.PROJECT);
      return ui.C.URL_PARAM.ID + "=" + sid.toEncodedStr();
    }
    return "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fList.hasBufferOnTop(); }

  getActionButton() {
    if (dba.Account.isAuthenticated() && dba.Account.isWebOwner()) {
      return this.#fBtnNew;
    }
    return null;
  }

  getMenuFragments() { return [ this.#fmSearch ]; }

  reload() { this.#fList.reload(); }

  scrollToTop() { this.#fList.scrollToItemIndex(0); }
  onScrollFinished() { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(fActionButton) {
    this._delegate.onWorkshopExplorerFragmentRequestCreateProject(this);
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};

wksp.FvcExplorer = FvcExplorer;
}(window.wksp = window.wksp || {}));
