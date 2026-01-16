import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import type { SocialItem } from '../../types/basic.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { FWeb3ArticleEditor } from './FWeb3ArticleEditor.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcWeb3PostEditor extends FScrollViewContent {
  #fEditor: Fragment | null = null;

  setPost(post: { getSocialItemType: () => string }): void {
    switch (post.getSocialItemType()) {
    case SocialItem.TYPE.ARTICLE:
      this.#fEditor = new FWeb3ArticleEditor();
      const editorWithArticle = this.#fEditor as { setArticle?: (post: unknown) => void; setDelegate?: (delegate: unknown) => void };
      if (editorWithArticle.setArticle) {
        editorWithArticle.setArticle(post);
      }
      if (editorWithArticle.setDelegate) {
        editorWithArticle.setDelegate(this);
      }
      break;
    default:
      this.#fEditor = null;
      break;
    }
    this.setChild("editor", this.#fEditor);
  }

  onNewArticlePostedInArticleEditorFragment(_fArticleEditor: FWeb3ArticleEditor): void {
    this._owner.onContentFragmentRequestPopView(this);
    Events.trigger(T_DATA.NEW_OWNER_POST);
  }

  _renderContentOnRender(render: Render): void {
    if (this.#fEditor) {
      this.#fEditor.attachRender(render);
      this.#fEditor.render();
    }
  }
}
