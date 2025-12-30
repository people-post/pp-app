export const CF_PRODUCT_EDITOR = {
  SUBMIT : "CF_SHOP_PRODUCT_EDITOR_1",
}

const _CFT_PRODUCT_EDITOR = {
  NAME : `<div class="textarea-wrapper">
      <label class="s-font5" for="edit-product-name">Name</label>
      <br>
      <textarea id="edit-product-name" class="edit-product-name">__NAME__</textarea>
    </div>
    <br>`,
  ACTIONS : `<br>
    <br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(shop.CF_PRODUCT_EDITOR.SUBMIT)">Submit</a>
    <br>
    <br>
    __DELETE_BUTTON__
    <br>
    <br>`,
  DELETE_BUTTON :
      `<a class="button-bar danger" href="javascript:void(0)">Delete</a>`,
}

export class FvcProductEditor extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fContent = new gui.RichContentEditor();
    this.setChild("content", this._fContent);

    this._fFiles = new ui.FMultiMediaFileUploader();
    this._fFiles.setCacheIds([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);
    this._fFiles.setDataSource(this);
    this._fFiles.setDelegate(this);
    this.setChild("files", this._fFiles);

    this._fteOwner = new gui.TagsEditorFragment();
    this._fteOwner.setDataSource(this);
    this._fteOwner.setDelegate(this);
    this.setChild("ownerTags", this._fteOwner);

    this._fPrice = new gui.PriceEditorFragment();
    this.setChild("price", this._fPrice);

    this._fDelivery = new shop.FProductDeliveryEditorManager();
    this.setChild("delivery", this._fDelivery);

    this._product = null;
  }

  setProduct(product) { this._product = product; }

  getTagsForTagsEditorFragment(fEditor) { return dba.WebConfig.getTags(); }
  getInitialCheckedIdsForTagsEditorFragment(fEditor) {
    return this._product ? this._product.getTagIds() : [];
  }

  onMultiMediaFileUploadWillBegin(uploadView) { this.#disableSubmitButton(); }
  onMultiMediaFileUploadFinished(uploadView) { this.#enableSubmitButton(); }

  action(type, ...args) {
    switch (type) {
    case shop.CF_PRODUCT_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let panel = new shop.PProductEditor();
    render.wrapPanel(panel);

    let product = this._product;

    let p = panel.getNamePanel();
    this.#renderName(product, p);

    p = panel.getFilesPanel();
    this.#renderFiles(product, p);

    p = panel.getDescriptionPanel();
    this.#renderDescription(product, p);

    p = panel.getMenuTagsPanel();
    this.#renderMenuTags(product, p);

    p = panel.getPricePanel();
    this.#renderPrice(product, p);

    p = panel.getDeliveryPanel();
    this.#renderDelivery(product, p);

    p = panel.getActionsPanel();
    this.#renderActions(product, p);
  }

  #renderName(product, panel) {
    let s = _CFT_PRODUCT_EDITOR.NAME;
    if (product.getName()) {
      s = s.replace("__NAME__", product.getName());
    } else {
      s = s.replace("__NAME__", "");
    }
    panel.replaceContent(s);
  }

  #renderFiles(product, panel) {
    this._fFiles.setToHrefFiles(product.getFiles());
    this._fFiles.attachRender(panel);
    this._fFiles.render();
  }

  #renderDescription(product, panel) {
    this._fContent.setConfig(
        {title : "Description", value : product.getDescription(), hint : ""});
    this._fContent.attachRender(panel);
    this._fContent.render();
  }

  #renderMenuTags(product, panel) {
    this._fteOwner.setEnableNewTags(true);
    this._fteOwner.attachRender(panel);
    this._fteOwner.render();
  }

  #renderPrice(product, panel) {
    this._fPrice.setPrices(product ? product.getBasePrices() : []);
    this._fPrice.attachRender(panel);
    this._fPrice.render();
  }

  #renderActions(product, panel) {
    let s = _CFT_PRODUCT_EDITOR.ACTIONS;
    if (product.isDraft()) {
      s = s.replace("__DELETE_BUTTON__", "");
    } else {
      s = s.replace("__DELETE_BUTTON__", _CFT_PRODUCT_EDITOR.DELETE_BUTTON);
    }
    panel.replaceContent(s);
  }

  #renderDelivery(product, panel) {
    let p = new ui.SectionPanel("Delivery");
    panel.wrapPanel(p);
    if (product) {
      this._fDelivery.setChoices(product.getDeliveryChoices());
    }
    this._fDelivery.attachRender(p.getContentPanel());
    this._fDelivery.render();
  }

  #enableSubmitButton() {}
  #disableSubmitButton() {}

  #onSubmit() {
    if (!this.#validateData()) {
      return;
    }
    let data = this.#collectData();
    let fd = new FormData();
    fd.append("id", data.id);
    fd.append("name", data.name);
    for (let d of data.delivery_choices) {
      fd.append("delivery_choices", d);
    }
    fd.append("description", data.description);
    for (let bp of data.base_prices) {
      fd.append("base_prices", JSON.stringify(bp));
    }

    for (let id of data.tag_ids) {
      fd.append("tag_ids", id);
    }

    for (let name of data.tag_names) {
      fd.append("new_tag_names", name);
    }

    this._fFiles.saveDataToForm(fd);

    let url = "/api/shop/update_product";
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #validateData() { return this._fPrice.validate(); }

  #collectData() {
    let data = {};
    let product = this._product;
    if (product) {
      data.id = product.getId();
    }
    let e = document.getElementById("edit-product-name");
    data.name = e.value;
    data.description = this._fContent.getValue();
    data.base_prices = [];
    for (let p of this._fPrice.getPrices()) {
      data.base_prices.push({
        "currency_id" : p.currency_id,
        "sales_price" : p.sales_price,
        "list_price" : p.list_price
      });
    }
    data.tag_ids = this._fteOwner.getSelectedTagIds();
    data.tag_names = this._fteOwner.getNewTagNames();
    data.delivery_choices = this._fDelivery.getChoiceDataList();
    return data;
  }

  #onSubmitRRR(data) {
    if (this._product.isDraft()) {
      this._delegate.onNewProductAddedInProductEditorContentFragment(this);
    } else {
      dba.Shop.updateProduct(new dat.Product(data.product));
    }
    this._owner.onContentFragmentRequestPopView(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.CF_PRODUCT_EDITOR = CF_PRODUCT_EDITOR;
}