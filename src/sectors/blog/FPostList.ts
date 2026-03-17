import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import UtilitiesExt from '../../lib/ext/Utilities.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FPostInfo } from './FPostInfo.js';
import { FvcPost } from './FvcPost.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type { Article } from '../../common/datatypes/Article.js';
import type { LongListIdRecord } from '../../common/datatypes/LongListIdRecord.js';

export class FPostList extends FSocialItemList {
  #loader: LongListIdLoader | null = null;

  isPostSelectedInPostInfoFragment(_fPostInfo: FPostInfo, postId: SocialItemId): boolean {
    return this.getCurrentId() == postId.toEncodedStr();
  }

  getPreviousPostIdForPostContentFragment(_fvcPost: FvcPost): SocialItemId | null {
    let sid = this._getIdRecord().findIdBefore(this.getCurrentId());
    return sid ? SocialItemId.fromEncodedStr(sid) : null;
  }
  getNextPostIdForPostContentFragment(_fvcPost: FvcPost): SocialItemId | null {
    let sid = this._getIdRecord().findIdAfter(this.getCurrentId());
    return sid ? SocialItemId.fromEncodedStr(sid) : null;
  }
  getContextOptionsForPostInfoFragment(_fPostInfo: FPostInfo, article: Article): unknown[] {
    return UtilitiesExt.optCall(
        this._dataSource, "getContextOptionsForArticleInPostListFragment", this,
        article);
  }

  setLoader(loader: LongListIdLoader): void {
    this.#loader = loader;
    const loaderWithOwner = loader as unknown as { setOwner?: (owner: unknown) => void };
    if (loaderWithOwner.setOwner) {
      loaderWithOwner.setOwner(this);
    }
  }

  isUserAdminOfCommentTargetInPostInfoFragment(_fPostInfo: FPostInfo, targetId: string): boolean {
    return UtilitiesExt.optCall(this._dataSource,
                                 "isUserAdminOfCommentTargetInPostListFragment",
                                 this, targetId) as boolean;
  }

  onVisibilityChangeInPostInfoFragment(_fPostInfo: FPostInfo): void { this.reset(); }
  onClickInPostInfoFragment(_fPostInfo: FPostInfo, postId: SocialItemId): void {
    this.switchToItem(postId.toEncodedStr());
  }

  onPostIdChangedInPostContentFragment(_fvcPost: FvcPost, postId: SocialItemId): void {
    this.switchToItem(postId.toEncodedStr(), false);
  }

  onContextOptionClickedInPostInfoFragment(_fvcPost: FvcPost, value: string, articleId: string): void {
    UtilitiesExt.optCall(this._delegate,
                          "onArticleContextOptionClickedInPostListFragment",
                          this, value, articleId);
  }

  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.POST_IDS:
      this.reload();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _getIdRecord(): LongListIdRecord {
    if (!this.#loader) {
      throw new Error('Loader is required');
    }
    return this.#loader.getIdRecord();
  }

  _asyncLoadFrontItems(): void {
    if (this.#loader) {
      this.#loader.asyncLoadFrontItems();
    }
  }
  _asyncLoadBackItems(): void {
    if (this.#loader) {
      this.#loader.asyncLoadBackItems();
    }
  }

  _createInfoFragment(id: string): FPostInfo {
    let sid = SocialItemId.fromEncodedStr(id);
    let f = new FPostInfo();
    f.setDataSource(this);
    f.setDelegate(this);
    f.setPostId(sid);
    if (this._delegate) {
      const delegateWithCallback = this._delegate as { onInfoFragmentCreatedInPostListFragment?: (fPosts: FPostList, f: FPostInfo) => void };
      if (delegateWithCallback.onInfoFragmentCreatedInPostListFragment) {
        delegateWithCallback.onInfoFragmentCreatedInPostListFragment(this, f);
      }
    }
    return f;
  }

  _createItemView(id: string | number): View | null {
    // id is SocialItemId encoded str
    if (id == null) {
      return null;
    }

    let sid = SocialItemId.fromEncodedStr(String(id));
    if (!sid) {
      return null;
    }

    let v = new View();
    let f = new FvcPost();
    f.setPostId(sid);
    f.setDataSource(this);
    f.setDelegate(this);
    v.setContentFragment(f);
    return v;
  }
}
