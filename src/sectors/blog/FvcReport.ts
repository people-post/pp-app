const _CFT_BLOG_REPORT = {
  TAG_STATISTICS : `<div class="flex space-between baseline-align-items">
    <div class="ellipsis">__TAG_NAME__</div>
    <div class="small-info-text no-wrap">__COUNT__</div>
  </div>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FNoticeList } from './FNoticeList.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { SocialItemId } from '../../common/datatypes/SocialItemId.js';
import { SocialItem } from '../../common/datatypes/SocialItem.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FPostStatisticsInfo } from './FPostStatisticsInfo.js';
import { FvcPost } from './FvcPost.js';
import { Notifications } from '../../common/dba/Notifications.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { FRequestInfo } from '../../common/hr/FRequestInfo.js';
import type Render from '../../lib/ui/renders/Render.js';

interface BlogProfile {
  most_commented_articles: Array<{ uuid: string; title: string; count: number }>;
  count_by_tag: Array<{ tag_id: string; count: number }>;
}

interface PostStatisticsData {
  uuid: string;
  title: string;
  count: number;
}

export class FvcReport extends FScrollViewContent {
  #selectedPostId: SocialItemId | null = null;
  protected _fNoticeList: FNoticeList;
  protected _fRequestList: FSimpleFragmentList;
  protected _fMostComments: FSimpleFragmentList;

  constructor() {
    super();
    this._fNoticeList = new FNoticeList();
    this._fNoticeList.setDelegate(this);
    this.setChild("notices", this._fNoticeList);

    this._fRequestList = new FSimpleFragmentList();
    this.setChild("requests", this._fRequestList);

    this._fMostComments = new FSimpleFragmentList();
    this.setChild("mostComments", this._fMostComments);
  }

  onBlogNoticeListFragmentRequestShowView(_fNoticeList: FNoticeList, view: View, title: string): void {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onClickInFPostStatisticsInfo(_fInfo: FPostStatisticsInfo, data: PostStatisticsData): void { this.#onViewPost(data.uuid); }

  getNextPostIdForPostContentFragment(_fvcPost: FvcPost): SocialItemId | null {
    if (!window.dba?.Account) {
      return null;
    }
    let profile = window.dba.Account.getBlogProfile() as BlogProfile | null;
    if (!profile) {
      return null;
    }
    let idx = 0;
    let id = this.#selectedPostId ? this.#selectedPostId.getValue() : null;
    for (let n of profile.most_commented_articles) {
      idx++;
      if (n.uuid == id) {
        break;
      }
    }
    if (idx < profile.most_commented_articles.length) {
      let n = profile.most_commented_articles[idx];
      return new SocialItemId(n.uuid, SocialItem.TYPE.ARTICLE);
    }
    return null;
  }

  getPreviousPostIdForPostContentFragment(_fvcPost: FvcPost): SocialItemId | null {
    if (!window.dba?.Account) {
      return null;
    }
    let profile = window.dba.Account.getBlogProfile() as BlogProfile | null;
    if (!profile) {
      return null;
    }
    let idx = -1;
    let id = this.#selectedPostId ? this.#selectedPostId.getValue() : null;
    for (let n of profile.most_commented_articles) {
      if (n.uuid == id) {
        break;
      }
      idx++;
    }
    if (idx >= 0 && idx + 1 < profile.most_commented_articles.length) {
      let n = profile.most_commented_articles[idx];
      return new SocialItemId(n.uuid, SocialItem.TYPE.ARTICLE);
    }
    return null;
  }

  onPostIdChangedInPostContentFragment(_fvcContent: FvcPost, postId: SocialItemId): void {
    this.#selectedPostId = postId;
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderContentOnRender(render: Render): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fNoticeList.attachRender(pp);
    this._fNoticeList.render();

    let ids = Notifications.getBlogRequestIds();
    if (ids.length) {
      pp = new SectionPanel("Requests");
      p.pushPanel(pp);
      this._fRequestList.clear();
      for (let id of ids) {
        let f = new FRequestInfo();
        f.setRequestId(id);
        f.setDelegate(this);
        this._fRequestList.append(f);
      }
      this._fRequestList.attachRender(pp.getContentPanel());
      this._fRequestList.render();
    }

    if (!window.dba?.Account) {
      return;
    }
    let profile = window.dba.Account.getBlogProfile() as BlogProfile | null;
    if (profile) {
      let items = profile.most_commented_articles;
      if (items && items.length) {
        pp = new SectionPanel("Most commented posts");
        pp.setClassName("post-statistics");
        p.pushPanel(pp);
        this.#renderStatistics(pp.getContentPanel(), items);
      }

      items = profile.count_by_tag;
      if (items && items.length) {
        items.sort((a, b) => b.count - a.count);
        pp = new SectionPanel("Posts by category");
        pp.setClassName("post-statistics");
        p.pushPanel(pp);
        pp.getContentPanel().replaceContent(
            this.#renderTagStatisticsBlock(items));
      }
    }
  }

  #onViewPost(postId: string): void {
    this.#selectedPostId =
        new SocialItemId(postId, SocialItem.TYPE.ARTICLE);
    let v = new View();
    let f = new FvcPost();
    f.setPostId(this.#selectedPostId);
    f.setDataSource(this);
    f.setDelegate(this);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Post " + postId);
  }

  #renderStatistics(panel: PanelWrapper, notifications: Array<{ uuid: string; title: string; count: number }>): void {
    this._fMostComments.clear();
    for (let n of notifications) {
      let f = new FPostStatisticsInfo();
      f.setData(n);
      f.setDelegate(this);
      this._fMostComments.append(f);
    }

    this._fMostComments.attachRender(panel);
    this._fMostComments.render();
  }

  #renderTagStatisticsBlock(statistics: Array<{ tag_id: string; count: number }>): string {
    let ss = _CFT_BLOG_REPORT.TAG_STATISTICS;
    let s: string;
    let items: string[] = [];
    for (let d of statistics) {
      let tag = WebConfig.getTag(d.tag_id);
      if (tag) {
        s = ss.replace("__TAG_NAME__", tag.getName());
        s = s.replace("__COUNT__", String(d.count));
        items.push(s);
      }
    }
    return items.join("");
  }
}
