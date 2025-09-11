(function(blog) {
class FvcPostEditor extends ui.FScrollViewContent {
  #fEditor = null;

  setPost(post) {
    switch (post.getSocialItemType()) {
    case dat.SocialItem.TYPE.ARTICLE:
      this.#fEditor = new blog.FArticleEditor();
      this.#fEditor.setArticle(post);
      this.#fEditor.setDelegate(this);
      break;
    case dat.SocialItem.TYPE.JOURNAL_ISSUE:
      this.#fEditor = new blog.FJournalIssueEditor();
      this.#fEditor.setJournalIssue(post);
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
  onArticleUpdatedInArticleEditorFragment(fEditor, article) {
    dba.Blog.updateArticle(article);
    this._owner.onContentFragmentRequestPopView(this);
  }
  onJournalIssueUpdatedInJournalIssueEditorFragment(fJournalIssueEditor,
                                                    journalIssue) {
    dba.Blog.updateJournalIssue(journalIssue);
    this._owner.onContentFragmentRequestPopView(this);
  }

  _renderContentOnRender(render) {
    if (this.#fEditor) {
      this.#fEditor.attachRender(render);
      this.#fEditor.render();
    }
  }
};

blog.FvcPostEditor = FvcPostEditor;
}(window.blog = window.blog || {}));
