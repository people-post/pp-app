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
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcCurrent } from '../../sectors/cart/FvcCurrent.js';
import { Api } from '../../common/plt/Api.js';
import { Account } from '../../common/dba/Account.js';

declare global {
  var MainIconOperator: new () => { [key: string]: unknown };
  var SearchIconOperator: new () => { [key: string]: unknown };
}

export class FvcOwner extends FScrollViewContent {
  #fmMain: FHeaderMenu;
  #fmSearch: FHeaderMenu;
  #fList: FOwnerProductList;
  #fBtnNew: ActionButton;
  #fBtnCart: FCartButton;
  #currentMenuItem: { getTagIds(): string[]; getId(): string | null } | null = null;

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

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (id) {
      let sid = SocialItemId.fromEncodedStr(id);
      if (sid) {
        this.#fList.switchToItem(sid.getValue());
      }
    }
  }

  getUrlParamString(): string {
    let id = this.#fList.getCurrentId();
    if (id) {
      let sid = new SocialItemId(id, SocialItem.TYPE.PRODUCT);
      return URL_PARAM.ID + "=" + sid.toEncodedStr();
    }
    return "";
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fList.hasBufferOnTop(); }

  getMenuFragments(): FHeaderMenu[] { return [ this.#fmMain, this.#fmSearch ]; }

  getActionButton(): ActionButton | FCartButton | null {
    if (Account.isAuthenticated()) {
      if (Account.isWebOwner()) {
        return this.#fBtnNew;
      } else {
        return this.#fBtnCart;
      }
    } else {
      let c = Cart.getCart(CartDataType.T_ID.ACTIVE);
      if (c && c.getItems().length) {
        return this.#fBtnCart;
      }
    }
    return null;
  }

  onNewProductAddedInProductEditorContentFragment(_fvcProductEditor: FvcProductEditor): void {
    // @ts-expect-error - delegate may have this method
    this._delegate?.onNewProductAddedInShopOwnerContentFragment?.(this);
  }

  onGuiActionButtonClick(fBtnAction: ActionButton | FCartButton): void {
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

  getTagIdsForProductListFragment(_fProductList: unknown): string[] {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  setOwnerId(ownerId: string | null): void { this.#fList.setOwnerId(ownerId); }

  reload(): void { this.#fList.reload(); }

  scrollToTop(): void { this.#fList.scrollToItemIndex(0); }
  onScrollFinished(): void { this.#fList.onScrollFinished(); }

  onItemSelectedInGuiMainMenu(_fMainMenu: MainMenu, menuItem: { getTagIds(): string[]; getId(): string | null }): void {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
    Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Products");
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.DRAFT_ORDERS:
      // @ts-expect-error - owner may have this method
      this._owner?.onContentFragmentRequestUpdateHeader?.(this);
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _onRenderAttached(_render: ReturnType<typeof this.getRender>): void {
    super._onRenderAttached(_render);
    this.#applyTheme();
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }

  #onNewProduct(): void {
    let url = "api/shop/new_product";
    Api.asFragmentCall(this, url).then(d => this.#onDraftProductRRR(d));
  }

  #onDraftProductRRR(data: { product: unknown }): void {
    this.#showDraftEditor(new Product(data.product));
  }

  #onShowCart(): void {
    let v = new View();
    let f = new FvcCurrent();
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Cart");
  }

  #showDraftEditor(product: Product): void {
    product.setIsDraft();
    let v = new View();
    let f = new FvcProductEditor();
    f.setDelegate(this);
    f.setProduct(product);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Product editor");
  }

  #prepare(menuItem: { getTagIds(): string[]; getId(): string | null }): void {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#fList.reload();
    }
  }

  #applyTheme(): void {
    WebConfig.setThemeId(
        this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
  }
}

export default FvcOwner;
