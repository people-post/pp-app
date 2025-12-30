
export class FvcOwner extends ui.FScrollViewContent {
  #fmMain;
  #fmSearch;
  #fList;
  #fBtnNew;
  #currentMenuItem = null;

  constructor() {
    super();
    this.#fmMain = new ui.FHeaderMenu();
    this.#fmMain.setIcon(C.ICON.M_MENU, new MainIconOperator());
    let f = new gui.MainMenu();
    f.setSector(C.ID.SECTOR.WORKSHOP);
    f.setDelegate(this);
    this.#fmMain.setContentFragment(f);
    this.#fmMain.setExpansionPriority(0);

    this.#fmSearch = new ui.FHeaderMenu();
    this.#fmSearch.setIcon(C.ICON.M_SEARCH, new SearchIconOperator());
    f = new srch.FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#fList = new wksp.FOwnerProjectList();
    this.#fList.setDataSource(this);
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

  getMenuFragments() { return [ this.#fmMain, this.#fmSearch ]; }

  getActionButton() {
    if (dba.Account.isAuthenticated() && dba.Account.isWebOwner()) {
      return this.#fBtnNew;
    }
    return null;
  }

  getTagIdsForProjectListFragment(fProjectList) {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  setOwnerId(ownerId) { this.#fList.setOwnerId(ownerId); }

  reload() { this.#fList.reload(); }

  scrollToTop() { this.#fList.scrollToItemIndex(0); }
  onScrollFinished() { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(fActionButton) {
    this._delegate.onWorkshopOwnerFragmentRequestCreateProject(this);
  }

  onItemSelectedInGuiMainMenu(fMainMenu, menuItem) {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
    fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "Projects");
  }

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this.#applyTheme();
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  #prepare(menuItem) {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#fList.reload();
    }
  }

  #applyTheme() {
    dba.WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcOwner = FvcOwner;
}
