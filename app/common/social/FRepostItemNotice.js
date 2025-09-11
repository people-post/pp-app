(function(socl) {
class FRepostItemNotice extends ui.Fragment {
  constructor() {
    super();
    this._notice = null;
    this._fUser1 = new S.hr.FUserInfo();
    this._fUser1.setLayoutType(S.hr.FUserInfo.T_LAYOUT.MID_SQUARE);
    this._fUser2 = new S.hr.FUserInfo();
    this._fUser2.setLayoutType(S.hr.FUserInfo.T_LAYOUT.MID_SQUARE);
    this._timer = new ext.Timer();

    this.setChild("user1", this._fUser1);
    this.setChild("user2", this._fUser2);
  }

  setData(d) { this._notice = d; }

  _onContentDidAppear() {
    if (this._notice.getNUnread()) {
      this._timer.set(() => this.#asyncMarkReadership(this._notice), 5000);
    }
  }

  _onBeforeRenderDetach() { this._timer.cancel(); }

  _renderOnRender(render) {
    let pMain = new socl.PRepostItemNotice();
    render.wrapPanel(pMain);

    let p = pMain.getMessagePanel();
    let pp = new ui.PanelWrapper();
    let ids = this._notice.getUserIds();
    if (ids.length > 0) {
      p.pushPanel(pp);
      this._fUser1.setUserId(ids[0]);
      this._fUser1.attachRender(pp);
      this._fUser1.render();
      pp = new ui.PanelWrapper();
      if (ids.length > 1) {
        p.pushPanel(pp);
        this._fUser2.setUserId(ids[1]);
        this._fUser2.attachRender(pp);
        this._fUser2.render();
        pp = new ui.PanelWrapper();
      }
    }
    let text = " reposted your article.";
    if (ids.length > 2) {
      text = " and " + (ids.length - 2) + " others" + text;
    }
    p.pushPanel(pp);
    pp.replaceContent(text);

    pp = pMain.getTitlePanel();
    pp.replaceContent(this.#getNoticeTitle(this._notice));
  }

  #getNoticeTitle(n) {
    let title = "";
    switch (n.getFromIdType()) {
    case dat.SocialItem.TYPE.ARTICLE:
      title = this.#getArticleTitle(n.getFromId());
      break;
    case dat.SocialItem.TYPE.FEED_ARTICLE:
      title = this.#getFeedArticleTitle(n.getFromId());
      break;
    default:
      title = "Unrecognized item: " + n.getFromIdType();
    }
    return title;
  }

  #getArticleTitle(articleId) {
    let a = dba.Blog.getArticle(articleId);
    return a ? a.getTitle() : articleId;
  }

  #getFeedArticleTitle(feedArticleId) {
    let a = dba.Blog.getFeedArticle(feedArticleId);
    return a ? a.getTitle() : feedArticleId;
  }

  #asyncMarkReadership(notice) {
    let url = "api/messenger/mark_notification_readership";
    let fd = new FormData();
    for (let id of notice.getNotificationIds()) {
      fd.append("ids", id);
    }
    plt.Api.asyncRawPost(url, fd, r => this.#onMarkReadershipRRR(r));
  }

  #onMarkReadershipRRR(responseText) {}
};

socl.FRepostItemNotice = FRepostItemNotice;
}(window.socl = window.socl || {}));
