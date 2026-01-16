import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import type { SocialItem } from '../../types/basic.js';
import { URL_PARAM } from '../../lib/ui/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FIdolProductList } from './FIdolProductList.js';
import { FCartButton } from './FCartButton.js';
import { FSearchMenu } from '../../common/search/FSearchMenu.js';
import { FvcCurrent } from '../../sectors/cart/FvcCurrent.js';
import Render from '../../lib/ui/renders/Render.js';

declare global {
  var SearchIconOperator: new () => { [key: string]: unknown };
}

export class FvcExplorer extends FScrollViewContent {
  #fmSearch: FHeaderMenu;
  #fList: FIdolProductList;
  #fBtnCart: FCartButton;

  constructor() {
    super();
    this.#fmSearch = new FHeaderMenu();
    this.#fmSearch.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    let f = new FSearchMenu();
    f.setDelegate(this);
    this.#fmSearch.setContentFragment(f);

    this.#fList = new FIdolProductList();
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);

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

  reload(): void { this.#fList.reload(); }

  scrollToTop(): void { this.#fList.scrollToItemIndex(0); }

  getActionButton(): FCartButton { return this.#fBtnCart; }

  getMenuFragments(): FHeaderMenu[] { return [ this.#fmSearch ]; }

  onScrollFinished(): void { this.#fList.onScrollFinished(); }

  onGuiActionButtonClick(_fAction: FCartButton): void {
    let v = new View();
    let f = new FvcCurrent();
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Cart");
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

  _renderContentOnRender(render: Render): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
}

export default FvcExplorer;
