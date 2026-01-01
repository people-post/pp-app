import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FIdolProductList } from './FIdolProductList.js';
import { FCartButton } from './FCartButton.js';

export class FvcExplorer extends FScrollViewContent {
  #fmSearch;
  #fList;
  #fBtnCart;

  constructor() {
    super();
    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new srch.FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    this.#fList = new FIdolProductList();
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

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

  reload() { this.#fList.reload(); }

  scrollToTop() { this.#fList.scrollToItemIndex(0); }

  getActionButton() { return this.#fBtnCart; }

  getMenuFragments() { return [ this.#fmSearch ]; }

  onScrollFinished() { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(fAction) {
    let v = new View();
    let f = new cart.FvcCurrent();
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Cart");
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
