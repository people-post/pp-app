import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { FPostInfo } from './FPostInfo.js';
import { FOgp } from './FOgp.js';
import { FvcPost } from './FvcPost.js';
import { FProjectInfo } from '../workshop/FProjectInfo.js';
import { FProduct } from '../shop/FProduct.js';
import { FvcProject } from '../workshop/FvcProject.js';
import { FvcProduct } from '../shop/FvcProduct.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Fragment as FragmentType } from '../../lib/ui/controllers/fragments/Fragment.js';

interface QuoteElementDelegate {
  onQuotedElementRequestShowView(f: FQuoteElement, view: View, title: string): void;
}

export class FQuoteElement extends Fragment {
  #fItem: FragmentType | null = null;
  #item: string | null = null;
  #type: string | null = null;
  #sizeType: string = "FULL";
  protected _delegate!: QuoteElementDelegate;

  getItem(): string | null { return this.#item; }
  getType(): string | null { return this.#type; }

  setSize(t: string): void { this.#sizeType = t; }
  setItem(item: string, type: string): void {
    this.#item = item;
    this.#type = type;
  }

  isPostSelectedInPostInfoFragment(_fPostInfo: FPostInfo, _postId: SocialItemId): boolean { return false; }
  isProjectSelectedInProjectInfoFragment(_fProjectInfo: FProjectInfo, _projectId: string): boolean {
    return false;
  }
  isProductSelectedInProductInfoFragmetn(_fProductInfo: FProduct, _productId: string): boolean {
    return false;
  }

  onClickInPostInfoFragment(_fPostInfo: FPostInfo, postId: SocialItemId): void { this.#showPost(postId); }
  onClickInProjectInfoFragment(_fProjectInfo: FProjectInfo, projectId: string): void {
    this.#showProject(projectId);
  }
  onClickInProductInfoFragment(_fProductInfo: FProduct, productId: string): void {
    this.#showProduct(productId);
  }

  _renderOnRender(render: Panel): void {
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

  #createItemFragment(): FragmentType | null {
    if (!this.#item || !this.#type) {
      return null;
    }

    let f: FragmentType | null = null;
    switch (this.#type) {
    case SocialItem.TYPE.ARTICLE:
    case SocialItem.TYPE.FEED_ARTICLE:
      f = new FPostInfo();
      f.setPostId(new SocialItemId(this.#item, this.#type));
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.PROJECT:
      f = new FProjectInfo();
      f.setProjectId(this.#item);
      f.setDataSource(this);
      f.setDelegate(this);
      break;
    case SocialItem.TYPE.PRODUCT:
      f = new FProduct();
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

  #showPost(id: SocialItemId): void {
    // id is SocialItemId
    let v = new View();
    let f = new FvcPost();
    f.setPostId(id);
    v.setContentFragment(f);
    this._delegate.onQuotedElementRequestShowView(this, v,
                                                  "Post " + id.getValue());
  }

  #showProject(id: string): void {
    let v = new View();
    let f = new FvcProject();
    f.setProjectId(id);
    v.setContentFragment(f);
    this._delegate.onQuotedElementRequestShowView(this, v, "Project " + id);
  }

  #showProduct(id: string): void {
    let v = new View();
    let f = new FvcProduct();
    f.setProductId(id);
    v.setContentFragment(f);
    this._delegate.onQuotedElementRequestShowView(this, v, "Product" + id);
  }
}
