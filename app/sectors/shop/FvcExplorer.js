
export class FvcExplorer extends ui.FScrollViewContent {
  #fmSearch;
  #fList;
  #fBtnCart;

  constructor() {
    super();
    this.#fmSearch = new ui.FHeaderMenu();
    this.#fmSearch.setIcon(C.ICON.M_SEARCH, new SearchIconOperator());
    let f = new srch.FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    this.#fList = new shop.FIdolProductList();
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

    this.#fBtnCart = new shop.FCartButton();
    this.#fBtnCart.setDelegate(this);
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
      let sid = new dat.SocialItemId(id, dat.SocialItem.TYPE.PRODUCT);
      return ui.C.URL_PARAM.ID + "=" + sid.toEncodedStr();
    }
    return "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fList.hasBufferOnTop(); }

  reload() { this.#fList.reload(); }

  scrollToTop() { this.#fList.scrollToItemIndex(0); }

  getActionButton() { return this.#fBtnCart; }

  getMenuFragments() { return [ this.#fmSearch ]; }

  onScrollFinished() { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(fAction) {
    let v = new ui.View();
    let f = new cart.FvcCurrent();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Cart");
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.DRAFT_ORDERS:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcExplorer = FvcExplorer;
}
