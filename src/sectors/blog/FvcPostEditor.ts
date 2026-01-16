import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { SocialItem } from '../../common/interface/SocialItem.js';
import { FArticleEditor } from './FArticleEditor.js';
import { FJournalIssueEditor } from './FJournalIssueEditor.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events } from '../../lib/framework/Events.js';
import { Blog } from '../../common/dba/Blog.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type { Article } from '../../common/datatypes/Article.js';
import type { JournalIssue } from '../../common/datatypes/JournalIssue.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcPostEditor extends FScrollViewContent {
  #fEditor: Fragment | null = null;

  setPost(post: { getSocialItemType: () => string }): void {
    switch (post.getSocialItemType()) {
    case SocialItem.TYPE.ARTICLE:
      this.#fEditor = new FArticleEditor();
      const editorWithArticle = this.#fEditor as { setArticle?: (post: unknown) => void; setDelegate?: (delegate: unknown) => void };
      if (editorWithArticle.setArticle) {
        editorWithArticle.setArticle(post);
      }
      if (editorWithArticle.setDelegate) {
        editorWithArticle.setDelegate(this);
      }
      break;
    case SocialItem.TYPE.JOURNAL_ISSUE:
      this.#fEditor = new FJournalIssueEditor();
      const editorWithIssue = this.#fEditor as { setJournalIssue?: (post: unknown) => void; setDelegate?: (delegate: unknown) => void };
      if (editorWithIssue.setJournalIssue) {
        editorWithIssue.setJournalIssue(post);
      }
      if (editorWithIssue.setDelegate) {
        editorWithIssue.setDelegate(this);
      }
      break;
    default:
      this.#fEditor = null;
      break;
    }
    this.setChild("editor", this.#fEditor);
  }

  onNewArticlePostedInArticleEditorFragment(_fArticleEditor: FArticleEditor): void {
    this._owner.onContentFragmentRequestPopView(this);
    Events.trigger(T_DATA.NEW_OWNER_POST);
  }
  onArticleUpdatedInArticleEditorFragment(_fEditor: FArticleEditor, article: Article): void {
    Blog.updateArticle(article);
    this._owner.onContentFragmentRequestPopView(this);
  }
  onJournalIssueUpdatedInJournalIssueEditorFragment(_fJournalIssueEditor: FJournalIssueEditor,
                                                    journalIssue: JournalIssue): void {
    Blog.updateJournalIssue(journalIssue);
    this._owner.onContentFragmentRequestPopView(this);
  }

  _renderContentOnRender(render: Render): void {
    if (this.#fEditor) {
      this.#fEditor.attachRender(render);
      this.#fEditor.render();
    }
  }
}
