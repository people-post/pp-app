import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FGeneralSearch } from './FGeneralSearch.js';
import { FSearchResultInfo } from './FSearchResultInfo.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { SocialItemId } from '../datatypes/SocialItemId.js';
import { Blog } from '../dba/Blog.js';
import { Workshop } from '../dba/Workshop.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { FvcUserInfo } from '../../sectors/hr/FvcUserInfo.js';
import { FvcOwnerPostScroller } from '../../sectors/blog/FvcOwnerPostScroller.js';
import { FvcPost } from '../../sectors/blog/FvcPost.js';
import { FvcProject } from '../../sectors/workshop/FvcProject.js';
import { FvcProduct } from '../../sectors/shop/FvcProduct.js';
import { FvcOrder } from '../../sectors/cart/FvcOrder.js';
import { URL_PARAM } from '../constants/Constants.js';

export class FvcSearchResult extends FScrollViewContent {
  #fSearch;

  constructor() {
    super();
    this.#fSearch = new FGeneralSearch();
    this.#fSearch.setDelegate(this);
    this.setChild("content", this.#fSearch);
  }

  getUrlParamString() {
    // TODO: Currently, there is no entry to here because srch
    // is not a registered sector in session gateway
    let k = this.#fSearch.getKey();
    if (k) {
      return URL_PARAM.KEY + "=" + encodeURIComponent(k);
    } else {
      return "";
    }
  }

  initFromUrl(urlParam) {
    // TODO: Currently there is no entry to here because srch
    // is not a registered sector in session gateway
    this.#fSearch.setKey(urlParam.get(URL_PARAM.KEY));
    this.render();
  }

  setKey(key) { this.#fSearch.setKey(key); }
  setResultLayoutType(t) { this.#fSearch.setResultLayoutType(t); }

  onSearchResultClickedInSearchFragment(fSearch, itemType, itemId) {
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

  #showUser(userId) {
    let v = new View();
    let f = new FvcUserInfo();
    f.setUserId(userId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "User");
  }

  #showArticle(articleId) {
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

  #showBriefArticle(sid) {
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

  #showNormalArticle(sid) {
    let v = new View();
    let f = new FvcPost();
    f.setPostId(sid);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Article");
  }

  #showProject(projectId) {
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(projectId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Project");
  }

  #showProduct(productId) {
    let v = new View();
    let f = new FvcProduct();
    f.setProductId(productId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Product");
  }

  #showOrder(orderId) {
    let v = new View();
    let f = new FvcOrder();
    f.setOrderId(orderId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Order");
  }

  _renderContentOnRender(render) {
    this.#fSearch.attachRender(render);
    this.#fSearch.render();
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.srch = window.srch || {};
  window.srch.FvcSearchResult = FvcSearchResult;
}
