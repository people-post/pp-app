import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { FPostInfo } from './FPostInfo.js';
import { FOgp } from './FOgp.js';
import { FvcPost } from './FvcPost.js';

export class FQuoteElement extends Fragment {
  #fItem = null;
  #item = null;
  #type = null;
  #sizeType = "FULL";

  getItem() { return this.#item; }
  getType() { return this.#type; }

  setSize(t) { this.#sizeType = t; }
  setItem(item, type) {
    this.#item = item;
    this.#type = type;
  }

  isPostSelectedInPostInfoFragment(fPostInfo, postId) { return false; }
  isProjectSelectedInProjectInfoFragment(fProjectInfo, projectId) {
    return false;
  }
  isProductSelectedInProductInfoFragmetn(fProductInfo, productId) {
    return false;
  }

  onClickInPostInfoFragment(fPostInfo, postId) { this.#showPost(postId); }
  onClickInProjectInfoFragment(fProjectInfo, projectId) {
    this.#showProject(projectId);
  }
  onClickInProductInfoFragment(fProductInfo, productId) {
    this.#showProduct(productId);
  }

  _renderOnRender(render) {
    this.#fItem = this.#createItemFragment();
    this.setChild("item", this.#fItem);

    if (this.#fItem) {
      this.#fItem.setSizeType(this.#sizeType == "FULL"
                                  ? SocialItem.T_LAYOUT.EXT_QUOTE_LARGE
                                  : SocialItem.T_LAYOUT.EXT_QUOTE_SMALL);
      this.#fItem.attachRender(render);
      this.#fItem.render();
    }
  }

  #createItemFragment() {
    let f = null;
    switch (this.#type) {
    case SocialItem.TYPE.ARTICLE:
    case SocialItem.TYPE.FEED_ARTICLE:
      f = new FPostInfo();
      f.setPostId(new SocialItemId(this.#item, this.#type));
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.PROJECT:
      f = new wksp.FProjectInfo();
      f.setProjectId(this.#item);
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.PRODUCT:
      f = new shop.FProduct();
      f.setProductId(this.#item);
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.URL:
      f = new FOgp();
      f.setUrl(this.#item);
      f.setDelegate(this);
      break;
    default:
      break;
    }
    return f;
  }

  #showPost(id) {
    // id is SocialItemId
    let v = new View();
    let f = new FvcPost();
    f.setPostId(id);
    v.setContentFragment(f);
    this._delegate.onQuotedElementRequestShowView(this, v,
                                                  "Post " + id.getValue());
  }

  #showProject(id) {
    let v = new View();
    let f = new wksp.FvcProject();
    f.setProjectId(id);
    v.setContentFragment(f);
    this._delegate.onQuotedElementRequestShowView(this, v, "Project " + id);
  }

  #showProduct(id) {
    let v = new View();
    let f = new shop.FvcProduct();
    f.setProductId(id);
    v.setContentFragment(f);
    this._delegate.onQuotedElementRequestShowView(this, v, "Product" + id);
  }
};
