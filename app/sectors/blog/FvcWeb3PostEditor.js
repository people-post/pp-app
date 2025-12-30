import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';

export class FvcWeb3PostEditor extends FScrollViewContent {
  #fEditor = null;

  setPost(post) {
    switch (post.getSocialItemType()) {
    case SocialItem.TYPE.ARTICLE:
      this.#fEditor = new blog.FWeb3ArticleEditor();
      this.#fEditor.setArticle(post);
      this.#fEditor.setDelegate(this);
      break;
    default:
      this.#fEditor = null;
      break;
    }
    this.setChild("editor", this.#fEditor);
  }

  onNewArticlePostedInArticleEditorFragment(fArticleEditor) {
    this._owner.onContentFragmentRequestPopView(this);
    fwk.Events.trigger(plt.T_DATA.NEW_OWNER_POST);
  }

  _renderContentOnRender(render) {
    if (this.#fEditor) {
      this.#fEditor.attachRender(render);
      this.#fEditor.render();
    }
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcWeb3PostEditor = FvcWeb3PostEditor;
}
