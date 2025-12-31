export const CF_LIKED_ITEM_NOTICE = {
  ONCLICK : "CF_SOCL_LIKED_ITEM_NOTICE_1",
}

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FUserInfo } from '../hr/FUserInfo.js';
import Timer from '../../lib/ext/Timer.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PLikedItemNotice } from './PLikedItemNotice.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Blog } from '../dba/Blog.js';
import { api } from '../plt/Api.js';

export class FLikedItemNotice extends Fragment {
  constructor() {
    super();
    this._notice = null;
    this._fUser1 = new FUserInfo();
    this._fUser1.setLayoutType(FUserInfo.T_LAYOUT.MID_SQUARE);
    this._fUser2 = new FUserInfo();
    this._fUser2.setLayoutType(FUserInfo.T_LAYOUT.MID_SQUARE);
    this._timer = new Timer();

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

  action(type, ...args) {
    switch (type) {
    case CF_LIKED_ITEM_NOTICE.ONCLICK:
      this.#onClick();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let pMain = new PLikedItemNotice();
    pMain.setClassName("clickable");
    pMain.setAttribute(
        "onclick", "javascript:G.action(socl.CF_LIKED_ITEM_NOTICE.ONCLICK)");
    render.wrapPanel(pMain);

    let p = pMain.getMessagePanel();
    let pp;
    let ids = this._notice.getUserIds();
    if (ids.length > 0) {
      pp = new PanelWrapper();
      pp.setElementType("SPAN");
      pp.setClassName("inline-block pad5px");
      p.pushPanel(pp);
      this._fUser1.setUserId(ids[0]);
      this._fUser1.attachRender(pp);
      this._fUser1.render();
      if (ids.length > 1) {
        pp = new PanelWrapper();
        pp.setElementType("SPAN");
        pp.setClassName("inline-block pad5px");
        p.pushPanel(pp);
        this._fUser2.setUserId(ids[1]);
        this._fUser2.attachRender(pp);
        this._fUser2.render();
      }
    }
    pp = new PanelWrapper();
    pp.setElementType("SPAN");
    pp.setClassName("inline-block pad5px");
    let text = "liked your post.";
    if (ids.length > 2) {
      text = "and " + (ids.length - 2) + " others " + text;
    }
    p.pushPanel(pp);
    pp.replaceContent(text);

    pp = pMain.getTitlePanel();
    pp.replaceContent(this.#getNoticeTitle(this._notice));
  }

  #getNoticeTitle(n) {
    let title = "";
    switch (n.getFromIdType()) {
    case SocialItem.TYPE.ARTICLE:
      title = this.#getArticleTitle(n.getFromId());
      break;
    case SocialItem.TYPE.FEED_ARTICLE:
      title = this.#getFeedArticleTitle(n.getFromId());
      break;
    default:
      title = "Unrecognized item: " + n.getFromIdType();
    }
    return title;
  }

  #getArticleTitle(articleId) {
    let a = Blog.getArticle(articleId);
    return a ? a.getTitle() : articleId;
  }

  #getFeedArticleTitle(feedArticleId) {
    let a = Blog.getFeedArticle(feedArticleId);
    return a ? a.getTitle() : feedArticleId;
  }

  #onClick() {
    if (!this._notice) {
      return;
    }
    let n = this._notice;
    if (n.isFrom(SocialItem.TYPE.ARTICLE)) {
      this._delegate.onPostClickedInLikedItemNoticeInfoFragment(
          this, n.getFromId(), n.getFromIdType());
    }
  }

  #asyncMarkReadership(notice) {
    let url = "api/messenger/mark_notification_readership";
    let fd = new FormData();
    for (let id of notice.getNotificationIds()) {
      fd.append("ids", id);
    }
    api.asyncRawPost(url, fd, r => this.#onMarkReadershipRRR(r));
  }

  #onMarkReadershipRRR(responseText) {}
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.socl = window.socl || {};
  window.socl.CF_LIKED_ITEM_NOTICE = CF_LIKED_ITEM_NOTICE;
  window.socl.FLikedItemNotice = FLikedItemNotice;
}
