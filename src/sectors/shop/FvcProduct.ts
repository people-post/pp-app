import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FProduct } from './FProduct.js';
import { FvcProductEditor } from './FvcProductEditor.js';
import { Shop } from '../../common/dba/Shop.js';
import { Account } from '../../common/dba/Account.js';

export class FvcProduct extends FScrollViewContent {
  private _fBtnEdit: ActionButton;
  private _fProduct: FProduct;

  constructor() {
    super();
    this._fBtnEdit = new ActionButton();
    this._fBtnEdit.setIcon(ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);

    this._fProduct = new FProduct();
    this._fProduct.setLayoutType(FProduct.T_LAYOUT.FULL);
    this.setChild("product", this._fProduct);
  }

  getUrlParamString(): string { return "id=" + this._fProduct.getProductId(); }
  getActionButton(): ActionButton | null {
    if (Account.isAuthenticated()) {
      let p = Shop.getProduct(this._fProduct.getProductId());
      if (p && p.isEditableByUser(Account.getId())) {
        return this._fBtnEdit;
      }
    }
    return null;
  }

  setProductId(id: string): void { this._fProduct.setProductId(id); }

  onGuiActionButtonClick(_fActionButton: ActionButton): void { this.#onEdit(); }
  onNewProductAddedInProductEditorContentFragment(_fvcProductEditor: FvcProductEditor): void {
    // Not possible because there is always some product to work with.
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.PRODUCT:
      if ((data as { getId(): string }).getId() == this._fProduct.getProductId()) {
        // @ts-expect-error - owner may have this method
        this._owner?.onContentFragmentRequestUpdateHeader?.(this);
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this._fProduct.attachRender(render);
    this._fProduct.render();
  }

  #onEdit(): void {
    let p = Shop.getProduct(this._fProduct.getProductId());
    if (p) {
      let v = new View();
      let f = new FvcProductEditor();
      f.setDelegate(this);
      f.setProduct(p);
      v.setContentFragment(f);
      // @ts-expect-error - owner may have this method
      this._owner?.onFragmentRequestShowView?.(this, v, "Product editor");
    }
  }
}

export default FvcProduct;
