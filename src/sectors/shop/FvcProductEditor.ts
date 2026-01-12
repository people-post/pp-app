export const CF_PRODUCT_EDITOR = {
  SUBMIT : "CF_SHOP_PRODUCT_EDITOR_1",
}

const _CFT_PRODUCT_EDITOR = {
  NAME : `<div>
      <label class="s-font5" for="edit-product-name">Name</label>
      <br>
      <textarea id="edit-product-name" class="edit-product-name">__NAME__</textarea>
    </div>
    <br>`,
  ACTIONS : `<br>
    <br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action('${CF_PRODUCT_EDITOR.SUBMIT}')">Submit</a>
    <br>
    <br>
    __DELETE_BUTTON__
    <br>
    <br>`,
  DELETE_BUTTON :
      `<a class="button-bar danger" href="javascript:void(0)">Delete</a>`,
}
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FMultiMediaFileUploader } from '../../lib/ui/controllers/fragments/FMultiMediaFileUploader.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { BasePrice, Product } from '../../common/datatypes/Product.js';
import { RichContentEditor } from '../../common/gui/RichContentEditor.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { PriceEditorFragment } from '../../common/gui/PriceEditorFragment.js';
import { FProductDeliveryEditorManager } from './FProductDeliveryEditorManager.js';
import { PProductEditor } from './PProductEditor.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Shop } from '../../common/dba/Shop.js';
import { Api } from '../../common/plt/Api.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';

interface ProductData {
  id: string;
  name: string;
  description: string;
  base_prices: BasePrice[];
  tag_ids: string[];
  tag_names: string[];
  delivery_choices: string[];
}

export class FvcProductEditor extends FScrollViewContent {
  private _fContent: RichContentEditor;
  private _fFiles: FMultiMediaFileUploader;
  private _fteOwner: TagsEditorFragment;
  private _fPrice: PriceEditorFragment;
  private _fDelivery: FProductDeliveryEditorManager;
  private _product: Product | null = null;

  constructor() {
    super();
    this._fContent = new RichContentEditor();
    this.setChild("content", this._fContent);

    this._fFiles = new FMultiMediaFileUploader();
    this._fFiles.setCacheIds([ "0", "1", "2", "3", "4", "5", "6", "7", "8" ]);
    this._fFiles.setDataSource(this);
    this._fFiles.setDelegate(this);
    this.setChild("files", this._fFiles);

    this._fteOwner = new TagsEditorFragment();
    this._fteOwner.setDataSource(this);
    this._fteOwner.setDelegate(this);
    this.setChild("ownerTags", this._fteOwner);

    this._fPrice = new PriceEditorFragment();
    this.setChild("price", this._fPrice);

    this._fDelivery = new FProductDeliveryEditorManager();
    this.setChild("delivery", this._fDelivery);

    this._product = null;
  }

  setProduct(product: Product): void { this._product = product; }

  getTagsForTagsEditorFragment(_fEditor: TagsEditorFragment): ReturnType<typeof WebConfig.getTags> { return WebConfig.getTags(); }
  getInitialCheckedIdsForTagsEditorFragment(_fEditor: TagsEditorFragment): string[] {
    return this._product ? this._product.getTagIds() ?? [] : [];
  }

  onMultiMediaFileUploadWillBegin(_uploadView: unknown): void { this.#disableSubmitButton(); }
  onMultiMediaFileUploadFinished(_uploadView: unknown): void { this.#enableSubmitButton(); }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_PRODUCT_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: PanelWrapper): void {
    let pProductEditor = new PProductEditor();
    render.wrapPanel(pProductEditor);

    let product = this._product;

    let pName = pProductEditor.getNamePanel();
    this.#renderName(product, pName);

    let pFiles = pProductEditor.getFilesPanel();
    this.#renderFiles(product, pFiles);

    let pDescription = pProductEditor.getDescriptionPanel();
    this.#renderDescription(product, pDescription);

    let pMenuTags = pProductEditor.getMenuTagsPanel();
    this.#renderMenuTags(product, pMenuTags);

    let pPrice = pProductEditor.getPricePanel();
    this.#renderPrice(product, pPrice);

    let pDelivery = pProductEditor.getDeliveryPanel();
    this.#renderDelivery(product, pDelivery);

    let pActions = pProductEditor.getActionsPanel();
    this.#renderActions(product, pActions);
  }

  #renderName(product: Product | null, panel: Panel): void {
    let s = _CFT_PRODUCT_EDITOR.NAME;
    const name = product ? product.getName() ?? "" : "";
    s = s.replace("__NAME__", name);
    panel.replaceContent(s);
  }

  #renderFiles(product: Product | null, panel: Panel): void {
    if (product) {
      this._fFiles.setToHrefFiles(product.getFiles());
    }
    this._fFiles.attachRender(panel);
    this._fFiles.render();
  }

  #renderDescription(product: Product | null, panel: Panel): void {
    this._fContent.setConfig(
        {title : "Description", value : product ? product.getDescription() : "", hint : ""});
    this._fContent.attachRender(panel);
    this._fContent.render();
  }

  #renderMenuTags(_product: Product | null, panel: Panel): void {
    this._fteOwner.setEnableNewTags(true);
    this._fteOwner.attachRender(panel);
    this._fteOwner.render();
  }

  #renderPrice(product: Product | null, panel: Panel): void {
    this._fPrice.setPrices(product ? product.getBasePrices() : []);
    this._fPrice.attachRender(panel);
    this._fPrice.render();
  }

  #renderActions(product: Product | null, panel: Panel): void {
    let s = _CFT_PRODUCT_EDITOR.ACTIONS;
    if (product && product.isDraft()) {
      s = s.replace("__DELETE_BUTTON__", "");
    } else {
      s = s.replace("__DELETE_BUTTON__", _CFT_PRODUCT_EDITOR.DELETE_BUTTON);
    }
    panel.replaceContent(s);
  }

  #renderDelivery(product: Product | null, panel: PanelWrapper): void {
    let p = new SectionPanel("Delivery");
    panel.wrapPanel(p);
    if (product) {
      this._fDelivery.setChoices(product.getDeliveryChoices());
    }
    this._fDelivery.attachRender(p.getContentPanel());
    this._fDelivery.render();
  }

  #enableSubmitButton(): void {}
  #disableSubmitButton(): void {}

  #onSubmit(): void {
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
    Api.asFragmentPost(this, url, fd).then(d => this.#onSubmitRRR(d));
  }

  #validateData(): boolean { return this._fPrice.validate(); }

  #collectData(): ProductData {
    let data: Partial<ProductData> = {};
    let product = this._product;
    if (product) {
      data.id = product.getId();
    } else {
      data.id = "";
    }
    let e = document.getElementById("edit-product-name") as HTMLTextAreaElement | null;
    data.name = e?.value || "";
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
    return data as ProductData;
  }

  #onSubmitRRR(data: { product: unknown }): void {
    if (this._product && this._product.isDraft()) {
      // @ts-expect-error - delegate may have this method
      this._delegate?.onNewProductAddedInProductEditorContentFragment?.(this);
    } else {
      Shop.updateProduct(new Product(data.product));
    }
    // @ts-expect-error - owner may have this method
    this._owner?.onContentFragmentRequestPopView?.(this);
  }
}

export default FvcProductEditor;
