export class FvcSearchResult extends ui.FScrollViewContent {
  #fSearch;

  constructor() {
    super();
    this.#fSearch = new srch.FGeneralSearch();
    this.#fSearch.setDelegate(this);
    this.setChild("content", this.#fSearch);
  }

  getUrlParamString() {
    // TODO: Currently, there is no entry to here because srch
    // is not a registered sector in session gateway
    let k = this.#fSearch.getKey();
    if (k) {
      return C.URL_PARAM.KEY + "=" + encodeURIComponent(k);
    } else {
      return "";
    }
  }

  initFromUrl(urlParam) {
    // TODO: Currently there is no entry to here because srch
    // is not a registered sector in session gateway
    this.#fSearch.setKey(urlParam.get(C.URL_PARAM.KEY));
    this.render();
  }

  setKey(key) { this.#fSearch.setKey(key); }
  setResultLayoutType(t) { this.#fSearch.setResultLayoutType(t); }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
    switch (itemType) {
    case dat.SocialItem.TYPE.USER:
    case dat.SocialItem.TYPE.FEED:
      this.#showUser(itemId);
      break;
    case dat.SocialItem.TYPE.ARTICLE:
      this.#showArticle(itemId);
      break;
    case dat.SocialItem.TYPE.PROJECT:
      this.#showProject(itemId);
      break;
    case dat.SocialItem.TYPE.PRODUCT:
      this.#showProduct(itemId);
      break;
    case dat.SocialItem.TYPE.ORDER:
      this.#showOrder(itemId);
      break;
    default:
      break;
    }
  }

  #showUser(userId) {
    let v = new ui.View();
    let f = new hr.FvcUserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "User");
  }

  #showArticle(articleId) {
    let sid = new dat.SocialItemId(articleId, dat.SocialItem.TYPE.ARTICLE);
    switch (this.#fSearch.getResultLayoutType()) {
    case srch.FSearchResultInfo.T_LAYOUT.BRIEF:
      this.#showBriefArticle(sid);
      break;
    default:
      this.#showNormalArticle(sid);
      break;
    }
  }

  #showBriefArticle(sid) {
    let v = new ui.View();
    let f = new blog.FvcOwnerPostScroller();
    let a = dba.Blog.getArticle(sid.getValue());
    if (a) {
      f.setOwnerId(a.getOwnerId());
    }
    f.setAnchorPostId(sid);
    v.setContentFragment(f);
    fwk.Events.triggerTopAction(fwk.T_ACTION.SHOW_DIALOG, this, v, "Article");
  }

  #showNormalArticle(sid) {
    let v = new ui.View();
    let f = new blog.FvcPost();
    f.setPostId(sid);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Article");
  }

  #showProject(projectId) {
    let v = new ui.View();
    let f = new wksp.FvcProject();
    f.setProjectId(projectId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Project");
  }

  #showProduct(productId) {
    let v = new ui.View();
    let f = shop.FvcProduct();
    f.setProductId(productId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Product");
  }

  #showOrder(orderId) {
    let v = new ui.View();
    let f = new cart.FvcOrder();
    f.setOrderId(orderId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Order");
  }

  _renderContentOnRender(render) {
    this.#fSearch.attachRender(render);
    this.#fSearch.render();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.srch = window.srch || {};
  window.srch.FvcSearchResult = FvcSearchResult;
}
