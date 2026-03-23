import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { FSocialItemList } from '../../common/gui/FSocialItemList.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FPostInfo } from './FPostInfo.js';
import { FvcPost } from './FvcPost.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type { Article } from '../../common/datatypes/Article.js';
import type { LongListIdRecord } from '../../common/datatypes/LongListIdRecord.js';

export interface FPostListDataSource {
  isUserAdminOfCommentTargetInPostListFragment(fPostList: FPostList, targetId: string): boolean;
  getContextOptionsForArticleInPostListFragment(fPostList: FPostList, article: Article): unknown[];
}

export interface FPostListDelegate {
  onArticleContextOptionClickedInPostListFragment(fPostList: FPostList, value: string, articleId: string): void;
  onInfoFragmentCreatedInPostListFragment(fPostList: FPostList, f: FPostInfo): void;
}

export class FPostList extends FSocialItemList {
  #loader: LongListIdLoader | null = null;

  isPostSelectedInPostInfoFragment(_fPostInfo: FPostInfo, postId: SocialItemId): boolean {
    return this.getCurrentId() == postId.toEncodedStr();
  }

  getPreviousPostIdForPostContentFragment(_fvcPost: FvcPost): SocialItemId | null {
    const currentId = this.getCurrentId();
    if (!currentId) {
      return null;
    }
    let sid = this._getIdRecord().findIdBefore(currentId);
    return sid ? SocialItemId.fromEncodedStr(sid) : null;
  }
  getNextPostIdForPostContentFragment(_fvcPost: FvcPost): SocialItemId | null {
    const currentId = this.getCurrentId();
    if (!currentId) {
      return null;
    }
    let sid = this._getIdRecord().findIdAfter(currentId);
    return sid ? SocialItemId.fromEncodedStr(sid) : null;
  }
  getContextOptionsForPostInfoFragment(_fPostInfo: FPostInfo, article: Article): unknown[] {
    return this.getDataSource<FPostListDataSource>()?.getContextOptionsForArticleInPostListFragment?.(this, article) ?? [];
  }

  setLoader(loader: LongListIdLoader): void {
    loader.setOwner(this);
    this.#loader = loader;
  }

  isUserAdminOfCommentTargetInPostInfoFragment(_fPostInfo: FPostInfo, targetId: string): boolean {
    return this.getDataSource<FPostListDataSource>()?.isUserAdminOfCommentTargetInPostListFragment?.(this, targetId) ?? false;
  }

  onVisibilityChangeInPostInfoFragment(_fPostInfo: FPostInfo): void { this.reset(); }
  onClickInPostInfoFragment(_fPostInfo: FPostInfo, postId: SocialItemId): void {
    this.switchToItem(postId.toEncodedStr());
  }

  onPostIdChangedInPostContentFragment(_fvcPost: FvcPost, postId: SocialItemId): void {
    this.switchToItem(postId.toEncodedStr(), false);
  }

  onContextOptionClickedInPostInfoFragment(_fvcPost: FvcPost, value: string, articleId: string): void {
    this.getDelegate<FPostListDelegate>()?.onArticleContextOptionClickedInPostListFragment?.(this, value, articleId);
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
    this.getDelegate<FPostListDelegate>()?.onInfoFragmentCreatedInPostListFragment?.(this, f);
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
