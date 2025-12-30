
const _CFT_BLOG_REPORT = {
  TAG_STATISTICS : `<div class="flex space-between baseline-align-items">
    <div class="ellipsis">__TAG_NAME__</div>
    <div class="small-info-text no-wrap">__COUNT__</div>
  </div>`,
};
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FNoticeList } from './FNoticeList.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { View } from '../../lib/ui/controllers/views/View.js';

export class FvcReport extends FScrollViewContent {
  #selectedPostId = null;

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

  onBlogNoticeListFragmentRequestShowView(fNoticeList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onClickInFPostStatisticsInfo(fInfo, data) { this.#onViewPost(data.uuid); }

  getNextPostIdForPostContentFragment(fvcPost) {
    let profile = dba.Account.getBlogProfile();
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
      return new dat.SocialItemId(n.uuid, dat.SocialItem.TYPE.ARTICLE);
    }
    return null;
  }

  getPreviousPostIdForPostContentFragment(fvcPost) {
    let profile = dba.Account.getBlogProfile();
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
      return new dat.SocialItemId(n.uuid, dat.SocialItem.TYPE.ARTICLE);
    }
    return null;
  }

  onPostIdChangedInPostContentFragment(fvcContent, postId) {
    this.#selectedPostId = postId;
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new PanelWrapper();
    p.pushPanel(pp);
    this._fNoticeList.attachRender(pp);
    this._fNoticeList.render();

    let ids = dba.Notifications.getBlogRequestIds();
    if (ids.length) {
      pp = new SectionPanel("Requests");
      p.pushPanel(pp);
      this._fRequestList.clear();
      for (let id of ids) {
        let f = new S.hr.FRequestInfo();
        f.setRequestId(id);
        f.setDelegate(this);
        this._fRequestList.append(f);
      }
      this._fRequestList.attachRender(pp.getContentPanel());
      this._fRequestList.render();
    }

    let profile = dba.Account.getBlogProfile()
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

  #onViewPost(postId) {
    this.#selectedPostId =
        new dat.SocialItemId(postId, dat.SocialItem.TYPE.ARTICLE);
    let v = new View();
    let f = new blog.FvcPost();
    f.setPostId(this.#selectedPostId);
    f.setDataSource(this);
    f.setDelegate(this);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Post " + postId);
  }

  #renderStatistics(panel, notifications) {
    this._fMostComments.clear();
    for (let n of notifications) {
      let f = new blog.FPostStatisticsInfo();
      f.setData(n);
      f.setDelegate(this);
      this._fMostComments.append(f);
    }

    this._fMostComments.attachRender(panel);
    this._fMostComments.render();
  }

  #renderTagStatisticsBlock(statistics) {
    let ss = _CFT_BLOG_REPORT.TAG_STATISTICS;
    let s;
    let items = [];
    for (let d of statistics) {
      let tag = dba.WebConfig.getTag(d.tag_id);
      if (tag) {
        s = ss.replace("__TAG_NAME__", tag.getName());
        s = s.replace("__COUNT__", d.count);
        items.push(s);
      }
    }
    return items.join("");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcReport = FvcReport;
}
