import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Blog } from '../dba/Blog.js';
import { Workshop } from '../dba/Workshop.js';
import { MessageThreadInfo as CommentNotice } from '../datatypes/MessageThreadInfo.js';

export const CF_COMMENT_NOTICE_INFO = {
  ON_CLICK : Symbol(),
};

const _CFT_COMMENT_NOTICE_INFO = {
  COMMENT_INFO : `<div>
  <span class="badge-holder">
    <span class="article-title">
      <a class="article-link" href="javascript:void(0)" onclick="javascript:G.action(socl.CF_COMMENT_NOTICE_INFO.ON_CLICK)">__TITLE__</a>
      <span class = "inline-notification-badge">__BADGE__</span>
    </span>
  </span>
  </div>`,
};

export interface FCommentNoticeDelegate {
  onCommentNoticeInfoFragmentRequestShowItem(f: FCommentNotice, itemId: string, idType: string): void;
}

export class FCommentNotice extends Fragment {
  private _notification: CommentNotice | null = null;

  constructor() {
    super();
    this._notification = null;
  }

  setData(notification: CommentNotice): void { this._notification = notification; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_COMMENT_NOTICE_INFO.ON_CLICK:
      if (this._notification) {
        this.getDelegate<FCommentNoticeDelegate>()?.onCommentNoticeInfoFragmentRequestShowItem?.(
            this, this._notification.getFromId(),
            this._notification.getFromIdType());
      }
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContent(): string { 
    return this._notification ? this.#renderCommentInfo(this._notification) : "";
  }

  #renderCommentInfo(n: CommentNotice): string {
    let s = _CFT_COMMENT_NOTICE_INFO.COMMENT_INFO;
    let text = this.#getCommentInfoText(n);
    if (text) {
      s = s.replace("__TITLE__", text);
    } else {
      s = s.replace("__TITLE__", "[empty]");
    }
    s = s.replace("__BADGE__", n.getNUnread().toString());
    return s;
  }

  #getCommentInfoText(n: CommentNotice): string {
    let text = "";
    switch (n.getFromIdType()) {
    case SocialItem.TYPE.ARTICLE:
      text = this.#getArticleTitle(n.getFromId());
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      text = this.#getFeedArticleTitle(n.getFromId());
      break;
    case SocialItem.TYPE.PROJECT:
      text = this.#getProjectTitle(n.getFromId());
      break;
    default:
      text = "Unrecognized item type: " + n.getFromIdType();
    }
    return text;
  }

  #getArticleTitle(articleId: string): string {
    let a = Blog.getArticle(articleId);
    return a?.getTitle() ?? articleId;
  }

  #getFeedArticleTitle(feedArticleId: string): string {
    let a = Blog.getFeedArticle(feedArticleId);
    return a?.getTitle() ?? feedArticleId;
  }

  #getProjectTitle(projectId: string): string {
    let project = Workshop.getProject(projectId);
    return project?.getName() ?? projectId;
  }
}

export default FCommentNotice;
