(function(shop) {
class FvcOwner extends ui.FScrollViewContent {
  #fmMain;
  #fmSearch;
  #fList;
  #fBtnNew;
  #fBtnCart;
  #currentMenuItem = null;

  constructor() {
    super();
    this.#fmMain = new ui.FHeaderMenu();
    this.#fmMain.setIcon(C.ICON.M_MENU, new MainIconOperator());

    let f = new gui.MainMenu();
    f.setSector(C.ID.SECTOR.SHOP);
    f.setDelegate(this);
    this.#fmMain.setContentFragment(f);
    this.#fmMain.setExpansionPriority(0);

    this.#fmSearch = new ui.FHeaderMenu();
    this.#fmSearch.setIcon(C.ICON.M_SEARCH, new SearchIconOperator());
    f = new srch.FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#fList = new shop.FOwnerProductList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

    this.#fBtnNew = new gui.ActionButton();
    this.#fBtnNew.setIcon(gui.ActionButton.T_ICON.NEW);
    this.#fBtnNew.setDelegate(this);

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

  getMenuFragments() { return [ this.#fmMain, this.#fmSearch ]; }

  getActionButton() {
    if (dba.Account.isAuthenticated()) {
      if (dba.Account.isWebOwner()) {
        return this.#fBtnNew;
      } else {
        return this.#fBtnCart;
      }
    } else {
      let c = dba.Cart.getCart(dat.Cart.T_ID.ACTIVE);
      if (c && cart.getItems().length) {
        return this.#fBtnCart;
      }
    }
    return null;
  }

  onNewProductAddedInProductEditorContentFragment(fvcProductEditor) {
    this._delegate.onNewProductAddedInShopOwnerContentFragment(this);
  }

  onGuiActionButtonClick(fBtnAction) {
    switch (fBtnAction) {
    case this.#fBtnNew:
      this.#onNewProduct();
      break;
    case this.#fBtnCart:
      this.#onShowCart();
      break;
    default:
      break;
    }
  }

  getTagIdsForProductListFragment(fProductList) {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  setOwnerId(ownerId) { this.#fList.setOwnerId(ownerId); }

  reload() { this.#fList.reload(); }

  scrollToTop() { this.#fList.scrollToItemIndex(0); }
  onScrollFinished() { this.#fList.onScrollFinished(); }

  onItemSelectedInGuiMainMenu(fMainMenu, menuItem) {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
    fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "Products");
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

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this.#applyTheme();
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  #onNewProduct() {
    let url = "api/shop/new_product";
    plt.Api.asyncFragmentCall(this, url).then(d => this.#onDraftProductRRR(d));
  }

  #onDraftProductRRR(data) {
    this.#showDraftEditor(new dat.Product(data.product));
  }

  #onShowCart() {
    let v = new ui.View();
    let f = new cart.FvcCurrent();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Cart");
  }

  #showDraftEditor(product) {
    product.setIsDraft();
    let v = new ui.View();
    let f = new shop.FvcProductEditor();
    f.setDelegate(this);
    f.setProduct(product);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Product editor");
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

shop.FvcOwner = FvcOwner;
}(window.shop = window.shop || {}));
