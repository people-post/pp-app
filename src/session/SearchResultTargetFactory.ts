import { View } from '../lib/ui/controllers/views/View.js';
import { SocialItem } from '../common/datatypes/SocialItem.js';
import { SocialItemId } from '../common/datatypes/SocialItemId.js';
import { Blog } from '../common/dba/Blog.js';
import { FSearchResultInfo } from '../common/search/FSearchResultInfo.js';
import { FvcUserInfo } from '../sectors/hr/FvcUserInfo.js';
import { FvcOwnerPostScroller } from '../sectors/blog/FvcOwnerPostScroller.js';
import { FvcPost } from '../sectors/blog/FvcPost.js';
import { FvcProject } from '../sectors/workshop/FvcProject.js';
import { FvcProduct } from '../sectors/shop/FvcProduct.js';
import { FvcOrder } from '../sectors/cart/FvcOrder.js';
import type {
  SearchResultTarget,
  SearchResultTargetFactory,
} from '../common/search/SearchResultTargetFactory.js';

export class SessionSearchResultTargetFactory
implements SearchResultTargetFactory {
  buildSearchResultTarget(itemType: string, itemId: string,
  layoutType: symbol | null): SearchResultTarget | null {
    switch (itemType) {
    case SocialItem.TYPE.USER:
    case SocialItem.TYPE.FEED:
      return this.#buildUserTarget(itemId);
    case SocialItem.TYPE.ARTICLE:
      return this.#buildArticleTarget(itemId, layoutType);
    case SocialItem.TYPE.PROJECT:
      return this.#buildProjectTarget(itemId);
    case SocialItem.TYPE.PRODUCT:
      return this.#buildProductTarget(itemId);
    case SocialItem.TYPE.ORDER:
      return this.#buildOrderTarget(itemId);
    default:
      return null;
    }
  }

  #buildUserTarget(userId: string): SearchResultTarget {
    let view = new View();
    let fragment = new FvcUserInfo();
    fragment.setUserId(userId);
    view.setContentFragment(fragment);
    return { view, title: 'User' };
  }

  #buildArticleTarget(articleId: string,
      layoutType: symbol | null): SearchResultTarget {
    let sid = new SocialItemId(articleId, SocialItem.TYPE.ARTICLE);
    switch (layoutType) {
    case FSearchResultInfo.T_LAYOUT.BRIEF:
      return this.#buildBriefArticleTarget(sid);
    default:
      return this.#buildNormalArticleTarget(sid);
    }
  }

  #buildBriefArticleTarget(sid: SocialItemId): SearchResultTarget {
    let view = new View();
    let fragment = new FvcOwnerPostScroller();
    let article = Blog.getArticle(sid.getValue());
    if (article) {
      fragment.setOwnerId(article.getOwnerId() ?? null);
    }
    fragment.setAnchorPostId(sid);
    view.setContentFragment(fragment);
    return { view, title: 'Article', asDialog: true };
  }

  #buildNormalArticleTarget(sid: SocialItemId): SearchResultTarget {
    let view = new View();
    let fragment = new FvcPost();
    fragment.setPostId(sid);
    view.setContentFragment(fragment);
    return { view, title: 'Article' };
  }

  #buildProjectTarget(projectId: string): SearchResultTarget {
    let view = new View();
    let fragment = new FvcProject();
    fragment.setProjectId(projectId);
    view.setContentFragment(fragment);
    return { view, title: 'Project' };
  }

  #buildProductTarget(productId: string): SearchResultTarget {
    let view = new View();
    let fragment = new FvcProduct();
    fragment.setProductId(productId);
    view.setContentFragment(fragment);
    return { view, title: 'Product' };
  }

  #buildOrderTarget(orderId: string): SearchResultTarget {
    let view = new View();
    let fragment = new FvcOrder();
    fragment.setOrderId(orderId);
    view.setContentFragment(fragment);
    return { view, title: 'Order' };
  }
}