import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { FWeb3ArticleEditor } from './FWeb3ArticleEditor.js';

export class FvcWeb3PostEditor extends FScrollViewContent {
  #fEditor = null;

  setPost(post) {
    switch (post.getSocialItemType()) {
    case SocialItem.TYPE.ARTICLE:
      this.#fEditor = new FWeb3ArticleEditor();
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
    Events.trigger(T_DATA.NEW_OWNER_POST);
  }

  _renderContentOnRender(render) {
    if (this.#fEditor) {
      this.#fEditor.attachRender(render);
      this.#fEditor.render();
    }
  }
};
