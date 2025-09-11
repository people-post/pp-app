(function(socl) {
socl.CF_COMMENT_NOTICE_INFO = {
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

class FCommentNotice extends ui.Fragment {
  constructor() {
    super();
    this._notification = null;
  }

  setData(notification) { this._notification = notification; }

  action(type, ...args) {
    switch (type) {
    case socl.CF_COMMENT_NOTICE_INFO.ON_CLICK:
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
    case dat.SocialItem.TYPE.ARTICLE:
      text = this.#getArticleTitle(n.getFromId());
      break;
    case dat.SocialItem.TYPE.FEED_ARTICLE:
      text = this.#getFeedArticleTitle(n.getFromId());
      break;
    case dat.SocialItem.TYPE.PROJECT:
      text = this.#getProjectTitle(n.getFromId());
      break;
    default:
      text = "Unrecognized item type: " + n.getFromIdType();
    }
    return text;
  }

  #getArticleTitle(articleId) {
    let a = dba.Blog.getArticle(articleId);
    return a ? a.getTitle() : articleId;
  }

  #getFeedArticleTitle(feedArticleId) {
    let a = dba.Blog.getFeedArticle(feedArticleId);
    return a ? a.getTitle() : feedArticleId;
  }

  #getProjectTitle(projectId) {
    let project = dba.Workshop.getProject(projectId);
    return project ? project.getTitle() : projectId;
  }
};

socl.FCommentNotice = FCommentNotice;
}(window.socl = window.socl || {}));
