import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FGeneralSearch } from './FGeneralSearch.js';
import { FSearchResultInfo } from './FSearchResultInfo.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import type { SocialItem } from '../../types/basic.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Blog } from '../dba/Blog.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcUserInfo } from '../../sectors/hr/FvcUserInfo.js';
import { FvcOwnerPostScroller } from '../../sectors/blog/FvcOwnerPostScroller.js';
import { FvcPost } from '../../sectors/blog/FvcPost.js';
import { FvcProject } from '../../sectors/workshop/FvcProject.js';
import { FvcProduct } from '../../sectors/shop/FvcProduct.js';
import { FvcOrder } from '../../sectors/cart/FvcOrder.js';
import { URL_PARAM } from '../constants/Constants.js';

export class FvcSearchResult extends FScrollViewContent {
  #fSearch: FGeneralSearch;

  constructor() {
    super();
    this.#fSearch = new FGeneralSearch();
    this.#fSearch.setDelegate(this);
    this.setChild("content", this.#fSearch);
  }

  getUrlParamString(): string {
    // TODO: Currently, there is no entry to here because srch
    // is not a registered sector in session gateway
    let k = this.#fSearch.getKey();
    if (k) {
      return URL_PARAM.KEY + "=" + encodeURIComponent(k);
    } else {
      return "";
    }
  }

  initFromUrl(urlParam: URLSearchParams): void {
    // TODO: Currently there is no entry to here because srch
    // is not a registered sector in session gateway
    this.#fSearch.setKey(urlParam.get(URL_PARAM.KEY) || "");
    this.render();
  }

  setKey(key: string): void { this.#fSearch.setKey(key); }
  setResultLayoutType(t: string | null): void { this.#fSearch.setResultLayoutType(t); }

  onSearchResultClickedInSearchFragment(_fSearch: FGeneralSearch, itemType: string, itemId: string): void {
    switch (itemType) {
    case SocialItem.TYPE.USER:
    case SocialItem.TYPE.FEED:
      this.#showUser(itemId);
      break;
    case SocialItem.TYPE.ARTICLE:
      this.#showArticle(itemId);
      break;
    case SocialItem.TYPE.PROJECT:
      this.#showProject(itemId);
      break;
    case SocialItem.TYPE.PRODUCT:
      this.#showProduct(itemId);
      break;
    case SocialItem.TYPE.ORDER:
      this.#showOrder(itemId);
      break;
    default:
      break;
    }
  }

  #showUser(userId: string): void {
    let v = new View();
    let f = new FvcUserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "User");
  }

  #showArticle(articleId: string): void {
    let sid = new SocialItemId(articleId, SocialItem.TYPE.ARTICLE);
    switch (this.#fSearch.getResultLayoutType()) {
    case FSearchResultInfo.T_LAYOUT.BRIEF:
      this.#showBriefArticle(sid);
      break;
    default:
      this.#showNormalArticle(sid);
      break;
    }
  }

  #showBriefArticle(sid: SocialItemId): void {
    let v = new View();
    let f = new FvcOwnerPostScroller();
    let a = Blog.getArticle(sid.getValue());
    if (a) {
      f.setOwnerId(a.getOwnerId());
    }
    f.setAnchorPostId(sid);
    v.setContentFragment(f);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "Article");
  }

  #showNormalArticle(sid: SocialItemId): void {
    let v = new View();
    let f = new FvcPost();
    f.setPostId(sid);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Article");
  }

  #showProject(projectId: string): void {
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(projectId);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Project");
  }

  #showProduct(productId: string): void {
    let v = new View();
    let f = new FvcProduct();
    f.setProductId(productId);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Product");
  }

  #showOrder(orderId: string): void {
    let v = new View();
    let f = new FvcOrder();
    f.setOrderId(orderId);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "Order");
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this.#fSearch.attachRender(render);
    this.#fSearch.render();
  }
}

export default FvcSearchResult;
