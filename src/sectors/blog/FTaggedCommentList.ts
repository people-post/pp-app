import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { SocialItem } from '../../types/basic.js';
import { ConstListIdLoader } from '../../common/plt/ConstListIdLoader.js';
import { FPostList } from './FPostList.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import type { Article } from '../../common/datatypes/Article.js';

export class FTaggedCommentList extends Fragment {
  #idLoader: ConstListIdLoader;
  #fComments: FPostList;
  #tagId: string | null = null;
  #isAdmin: boolean = false;

  constructor() {
    super();
    this.#idLoader = new ConstListIdLoader();
    this.#fComments = new FPostList();
    this.#fComments.setEnableTopBuffer(false);
    this.#fComments.setLoader(this.#idLoader);
    this.#fComments.setDataSource(this);
    this.#fComments.setDelegate(this);
    this.setChild("comments", this.#fComments);
  }

  getTagId(): string | null { return this.#tagId; }

  setIsAdmin(b: boolean): void { this.#isAdmin = b; }
  setTagId(id: string | null): void { this.#tagId = id; }
  setCommentIds(sids: SocialItemId[]): void {
    this.#idLoader.setIds(sids.map(sid => sid.toEncodedStr()));
  }

  getContextOptionsForArticleInPostListFragment(_fPostList: FPostList, _article: Article): Array<{name: string; value: string}> | null {
    if (this.#isAdmin) {
      return [ {name : "Untag", value : ""} ];
    }
    return null;
  }

  onInfoFragmentCreatedInPostListFragment(_fPostList: FPostList, fInfo: unknown): void {
    (fInfo as {setSizeType(type: string): void}).setSizeType(SocialItem.T_LAYOUT.EXT_COMMENT);
  }

  onArticleContextOptionClickedInPostListFragment(_fPostList: FPostList, _value: string, articleId: string): void {
    (this._delegate as any).onTaggedCommentListFragmentRequestUntagCommentArticle(
        this, articleId);
  }

  _renderOnRender(render: Panel): void {
    this.#fComments.attachRender(render);
    this.#fComments.render();
  }
};
