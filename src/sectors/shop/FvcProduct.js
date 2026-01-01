import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FProduct } from './FProduct.js';
import { FvcProductEditor } from './FvcProductEditor.js';
import { Account } from '../../common/dba/Account.js';
import { Shop } from '../../common/dba/Shop.js';

export class FvcProduct extends FScrollViewContent {
  constructor() {
    super();
    this._fBtnEdit = new ActionButton();
    this._fBtnEdit.setIcon(ActionButton.T_ICON.EDIT);
    this._fBtnEdit.setDelegate(this);

    this._fProduct = new FProduct();
    this._fProduct.setLayoutType(FProduct.T_LAYOUT.FULL);
    this.setChild("product", this._fProduct);
  }

  getUrlParamString() { return "id=" + this._fProduct.getProductId(); }
  getActionButton() {
    if (Account.isAuthenticated()) {
      let p = Shop.getProduct(this._fProduct.getProductId());
      if (p && p.isEditableByUser(Account.getId())) {
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
    case T_DATA.PRODUCT:
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
    let p = Shop.getProduct(this._fProduct.getProductId());
    if (p) {
      let v = new View();
      let f = new FvcProductEditor();
      f.setDelegate(this);
      f.setProduct(p);
      v.setContentFragment(f);
      this._owner.onFragmentRequestShowView(this, v, "Product editor");
    }
  }
}
