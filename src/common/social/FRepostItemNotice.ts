import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FUserInfo } from '../hr/FUserInfo.js';
import Timer from '../../lib/ext/Timer.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { PRepostItemNotice } from './PRepostItemNotice.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { Blog } from '../dba/Blog.js';
import { RepostItemNotice } from '../datatypes/RepostItemNotice.js';
import { Api } from '../plt/Api.js';

export class FRepostItemNotice extends Fragment {
  private _notice: RepostItemNotice | null = null;
  private _fUser1: FUserInfo;
  private _fUser2: FUserInfo;
  private _timer: Timer;

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

  setData(d: RepostItemNotice): void { this._notice = d; }

  _onContentDidAppear(): void {
    if (this._notice && this._notice.getNUnread()) {
      this._timer.set(() => this.#asyncMarkReadership(this._notice!), 5000);
    }
  }

  _onBeforeRenderDetach(): void { this._timer.cancel(); }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    if (!this._notice) return;
    let pMain = new PRepostItemNotice();
    render.wrapPanel(pMain);

    let p = pMain.getMessagePanel();
    let pp = new PanelWrapper();
    let ids = this._notice.getUserIds();
    if (ids.length > 0) {
      p.pushPanel(pp);
      this._fUser1.setUserId(ids[0]);
      this._fUser1.attachRender(pp);
      this._fUser1.render();
      pp = new PanelWrapper();
      if (ids.length > 1) {
        p.pushPanel(pp);
        this._fUser2.setUserId(ids[1]);
        this._fUser2.attachRender(pp);
        this._fUser2.render();
        pp = new PanelWrapper();
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

  #getNoticeTitle(n: RepostItemNotice): string {
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

  #getArticleTitle(articleId: string): string {
    let a = Blog.getArticle(articleId);
    return a ? a.getTitle() : articleId;
  }

  #getFeedArticleTitle(feedArticleId: string): string {
    let a = Blog.getFeedArticle(feedArticleId);
    return a ? a.getTitle() : feedArticleId;
  }

  #asyncMarkReadership(notice: RepostItemNotice): void {
    let url = "api/messenger/mark_notification_readership";
    let fd = new FormData();
    for (let id of notice.getNotificationIds()) {
      fd.append("ids", id);
    }
    Api.asyncRawPost(url, fd, (_r: string) => this.#onMarkReadershipRRR());
  }

  #onMarkReadershipRRR(): void {}
}

export default FRepostItemNotice;
