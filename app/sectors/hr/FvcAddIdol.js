
class FvcAddIdol extends ui.FScrollViewContent {
  #fSearch;

  constructor() {
    super();
    let c = new dat.SearchConfig();
    if (glb.env.isWeb3()) {
      this.#fSearch = new srch.FWeb3Search();
      c.setCategories([ dat.SocialItem.TYPE.USER ]);
    } else {
      this.#fSearch = new srch.FGeneralSearch();
      this.#fSearch.enableAddFeed();
      c.setCategories([ dat.SocialItem.TYPE.USER, dat.SocialItem.TYPE.FEED ]);
    }
    this.#fSearch.setConfig(c);
    this.#fSearch.setDelegate(this);
    this.setChild("search", this.#fSearch);
  }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    switch (itemType) {
    case dat.SocialItem.TYPE.USER:
    case dat.SocialItem.TYPE.FEED:
      this.#showUser(itemId);
      break;
    default:
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p)
    let pp = new ui.Panel();
    p.pushPanel(pp);
    if (glb.env.isWeb3()) {
      pp.replaceContent(R.get("ADD_WEB3_IDOL_HINT"));
    } else {
      pp.replaceContent(R.get("ADD_IDOL_HINT"));
    }

    pp = new ui.PanelWrapper();
    p.pushPanel(pp);
    this.#fSearch.attachRender(pp);
    this.#fSearch.render();
  }

  #showUser(userId) {
    fwk.Events.triggerTopAction(plt.T_ACTION.SHOW_USER_INFO, userId);
  }
};

hr.FvcAddIdol = FvcAddIdol;
}(window.hr = window.hr || {}));
