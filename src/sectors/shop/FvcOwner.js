import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { ActionButton } from '../../common/gui/ActionButton.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { Product } from '../../common/datatypes/Product.js';
import { Cart as CartDataType } from '../../common/datatypes/Cart.js';
import { ID, URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { MainMenu } from '../../common/menu/MainMenu.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { FOwnerProductList } from './FOwnerProductList.js';
import { FCartButton } from './FCartButton.js';
import { FvcProductEditor } from './FvcProductEditor.js';
import { Shop } from '../../common/dba/Shop.js';
import { Cart } from '../../common/dba/Cart.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Account } from '../../common/dba/Account.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';

export class FvcOwner extends FScrollViewContent {
  #fmMain;
  #fmSearch;
  #fList;
  #fBtnNew;
  #fBtnCart;
  #currentMenuItem = null;

  constructor() {
    super();
    this.#fmMain = new FHeaderMenu();
    this.#fmMain.setIcon(ICON.M_MENU, new MainIconOperator());

    let f = new MainMenu();
    f.setSector(ID.SECTOR.SHOP);
    f.setDelegate(this);
    this.#fmMain.setContentFragment(f);
    this.#fmMain.setExpansionPriority(0);

    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    f = new FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);
    this.#fmSearch.setExpansionPriority(1);

    this.#fList = new FOwnerProductList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

    this.#fBtnNew = new ActionButton();
    this.#fBtnNew.setIcon(ActionButton.T_ICON.NEW);
    this.#fBtnNew.setDelegate(this);

    this.#fBtnCart = new FCartButton();
    this.#fBtnCart.setDelegate(this);
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      let sid = SocialItemId.fromEncodedStr(id);
      if (sid) {
        this.#fList.switchToItem(sid.getValue());
      }
    }
  }

  getUrlParamString() {
    let id = this.#fList.getCurrentId();
    if (id) {
      let sid = new SocialItemId(id, SocialItem.TYPE.PRODUCT);
      return URL_PARAM.ID + "=" + sid.toEncodedStr();
    }
    return "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fList.hasBufferOnTop(); }

  getMenuFragments() { return [ this.#fmMain, this.#fmSearch ]; }

  getActionButton() {
    if (Account.isAuthenticated()) {
      if (Account.isWebOwner()) {
        return this.#fBtnNew;
      } else {
        return this.#fBtnCart;
      }
    } else {
      let c = Cart.getCart(CartDataType.T_ID.ACTIVE);
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
    case T_DATA.DRAFT_ORDERS:
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
    api.asyncFragmentCall(this, url).then(d => this.#onDraftProductRRR(d));
  }

  #onDraftProductRRR(data) {
    this.#showDraftEditor(new Product(data.product));
  }

  #onShowCart() {
    let v = new View();
    let f = new cart.FvcCurrent();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Cart");
  }

  #showDraftEditor(product) {
    product.setIsDraft();
    let v = new View();
      let f = new FvcProductEditor();
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
    WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcOwner = FvcOwner;
}
