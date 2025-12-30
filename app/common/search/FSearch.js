const _CFT_SEARCH = {
  BRIEF : `Results found: __N_RESULTS__`,
  NO_RESULT :
      `We are sorry that we couldn't find any meaningful result, please try again...`,
};

export class FSearch extends ui.Fragment {
  #fBar;
  #fContent;
  #tResultLayout = null;
  #cache = null;

  constructor() {
    super();
    this.#fBar = new gui.SearchBar();
    this.#fBar.setFatMode(true);
    this.#fBar.setDelegate(this);
    this.setChild("bar", this.#fBar);

    this.#fContent = new ui.FSimpleFragmentList();
    this.setChild("content", this.#fContent);
  }

  getKey() { return this.#fBar.getKey(); }
  getResultLayoutType() { return this.#tResultLayout; }

  setKey(key) { this.#fBar.setKey(key); }
  setResultLayoutType(t) { this.#tResultLayout = t; }

  onClickInSearchResultInfoFragment(fInfo, itemType, itemId) {
    this._delegate.onSearchResultClickedInSearchFragment(this, itemType,
                                                         itemId);
  }

  onGuiSearchBarRequestSearch(fSearchBar, key) {
    this.#cache = null;
    this.render();
  }

  _doSearch(key) {}
  _clearCache() { this.#cache = null; }

  _renderOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this.#fBar.attachRender(pp);
    this.#fBar.render();

    pp = new ui.Panel();
    pp.setClassName("s-font5 cdimgray search-result-brief");
    p.pushPanel(pp);

    let r = this.#getResult(this.#fBar.getKey());
    if (r) {
      if (r.size() == 0) {
        pp.replaceContent(_CFT_SEARCH.NO_RESULT);
      } else {
        let s = _CFT_SEARCH.BRIEF;
        s = s.replace("__N_RESULTS__", r.size());
        pp.replaceContent(s);
      }
    }

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this.#fContent.clear();
    if (r) {
      for (let item of r.getItems()) {
        let f = new srch.FSearchResultInfo();
        f.setLayoutType(this.#tResultLayout);
        f.setData(item);
        f.setDelegate(this);
        this.#fContent.append(f);
      }
    }
    this.#fContent.attachRender(pp);
    this.#fContent.render();

    p.pushSpace(3);
  }

  _updateResult(key, result) {
    this.#cache = {key : key, result : result};
    this.render();
  }

  #getResult(key) {
    let d = this.#cache;
    if (d && d.key == key) {
      return d.result;
    }
    let r = this._doSearch(key);
    if (r) {
      this._updateResult(key, r);
    }
    return r;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.srch = window.srch || {};
  window.srch.FSearch = FSearch;
}
