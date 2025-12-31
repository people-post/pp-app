import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { FArticleEditor } from './FArticleEditor.js';
import { FJournalIssueEditor } from './FJournalIssueEditor.js';

export class FvcPostEditor extends FScrollViewContent {
  #fEditor = null;

  setPost(post) {
    switch (post.getSocialItemType()) {
    case SocialItem.TYPE.ARTICLE:
      this.#fEditor = new FArticleEditor();
      this.#fEditor.setArticle(post);
      this.#fEditor.setDelegate(this);
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      this.#fEditor = new FJournalIssueEditor();
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



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcPostEditor = FvcPostEditor;
}
