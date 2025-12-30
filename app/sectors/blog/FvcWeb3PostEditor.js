
class FvcWeb3PostEditor extends ui.FScrollViewContent {
  #fEditor = null;

  setPost(post) {
    switch (post.getSocialItemType()) {
    case dat.SocialItem.TYPE.ARTICLE:
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

blog.FvcWeb3PostEditor = FvcWeb3PostEditor;
}(window.blog = window.blog || {}));
