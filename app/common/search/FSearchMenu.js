(function(srch) {
class FSearchMenu extends gui.MenuContent {
  #fBar;
  #tResultLayout = null;

  constructor() {
    super();
    this.#fBar = new gui.SearchBar();
    this.#fBar.setMenuRenderMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("searchbar", this.#fBar);
  }

  setResultLayoutType(t) { this.#tResultLayout = t; }

  onGuiSearchBarRequestSearch(fSearchBar, value) {
    this._delegate.onMenuFragmentRequestCloseMenu(this);
    let cls = fwk.Factory.getClass(
        fwk.T_CATEGORY.UI, fwk.T_OBJ.SEARCH_RESULT_VIEW_CONTENT_FRAGMENT);
    let f = new cls();
    f.setKey(value);
    f.setResultLayoutType(this.#tResultLayout);
    let v = new ui.View();
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Search result");
  }

  _renderOnRender(render) {
    this.#fBar.setFatMode(!this._isQuickLinkRenderMode);
    this.#fBar.attachRender(render);
    this.#fBar.render();
  }
};

srch.FSearchMenu = FSearchMenu;
}(window.srch = window.srch || {}));
