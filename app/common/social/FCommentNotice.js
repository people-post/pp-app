export const CF_COMMENT_NOTICE_INFO = {
  ON_CLICK : Symbol(),
};

const _CFT_COMMENT_NOTICE_INFO = {
  COMMENT_INFO : `<div class="comment-notice">
  <span class="badge-holder">
    <span class="article-title">
      <a class="article-link" href="javascript:void(0)" onclick="javascript:G.action(socl.CF_COMMENT_NOTICE_INFO.ON_CLICK)">__TITLE__</a>
      <span class = "inline-notification-badge">__BADGE__</span>
    </span>
  </span>
  </div>`,
};

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Blog } from '../dba/Blog.js';
import { Workshop } from '../dba/Workshop.js';

export class FCommentNotice extends Fragment {
  constructor() {
    super();
    this._notification = null;
  }

  setData(notification) { this._notification = notification; }

  action(type, ...args) {
    switch (type) {
    case CF_COMMENT_NOTICE_INFO.ON_CLICK:
      this._delegate.onCommentNoticeInfoFragmentRequestShowItem(
          this, this._notification.getFromId(),
          this._notification.getFromIdType());
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() { return this.#renderCommentInfo(this._notification); }

  #renderCommentInfo(n) {
    let s = _CFT_COMMENT_NOTICE_INFO.COMMENT_INFO;
    let text = this.#getCommentInfoText(n);
    if (text) {
      s = s.replace("__TITLE__", text);
    } else {
      s = s.replace("__TITLE__", "[empty]");
    }
    s = s.replace("__BADGE__", n.getNUnread());
    return s;
  }

  #getCommentInfoText(n) {
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

  #getArticleTitle(articleId) {
    let a = Blog.getArticle(articleId);
    return a ? a.getTitle() : articleId;
  }

  #getFeedArticleTitle(feedArticleId) {
    let a = Blog.getFeedArticle(feedArticleId);
    return a ? a.getTitle() : feedArticleId;
  }

  #getProjectTitle(projectId) {
    let project = Workshop.getProject(projectId);
    return project ? project.getTitle() : projectId;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.socl = window.socl || {};
  window.socl.CF_COMMENT_NOTICE_INFO = CF_COMMENT_NOTICE_INFO;
  window.socl.FCommentNotice = FCommentNotice;
}
