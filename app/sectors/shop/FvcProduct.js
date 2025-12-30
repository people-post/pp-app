export class FvcProduct extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fBtnEdit = new gui.ActionButton();
    this._fBtnEdit.setIcon(gui.ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);

    this._fProduct = new shop.FProduct();
    this._fProduct.setLayoutType(shop.FProduct.T_LAYOUT.FULL);
    this.setChild("product", this._fProduct);
  }

  getUrlParamString() { return "id=" + this._fProduct.getProductId(); }
  getActionButton() {
    if (dba.Account.isAuthenticated()) {
      let p = dba.Shop.getProduct(this._fProduct.getProductId());
      if (p && p.isEditableByUser(dba.Account.getId())) {
        return this._fBtnEdit;
      }
    }
    return null;
  }

  setProductId(id) { this._fProduct.setProductId(id); }

  onGuiActionButtonClick(fActionButton) { this.#onEdit(); }
  onNewProductAddedInProductEditorContentFragment(fvcProductEditor) {
    // Not possible because there is always some product to work with.
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.PRODUCT:
      if (data.getId() == this._fProduct.getProductId()) {
        this._owner.onContentFragmentRequestUpdateHeader(this);
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    this._fProduct.attachRender(render);
    this._fProduct.render();
  }

  #onEdit() {
    let p = dba.Shop.getProduct(this._fProduct.getProductId());
    if (p) {
      let v = new ui.View();
      let f = new shop.FvcProductEditor();
      f.setDelegate(this);
      f.setProduct(p);
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Product editor");
    }
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcProduct = FvcProduct;
}
