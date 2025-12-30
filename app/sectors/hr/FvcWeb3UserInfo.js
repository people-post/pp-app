import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';

export class FvcWeb3UserInfo extends FViewContentWithHeroBanner {
  #fBanner;
  #fBlog;
  #fMain;
  #userId = null;

  constructor() {
    super();
    this.#fBanner = new hr.FUserInfoHeroBanner();
    this.#fBanner.setDataSource(this);
    this.#fBanner.setDelegate(this);
    this.setHeroBannerFragment(this.#fBanner);
    this.setEnableAutoHide(true);

    this.#fBlog = new blog.FvcWeb3OwnerPosts();
    this.#fBlog.setDataSource(this);
    this.#fBlog.setDelegate(this);

    this.#fMain = new FViewContentMux();
    this.wrapContentFragment(this.#fMain);
  }

  getUserId() { return this.#userId; }
  getTagIdsForPostListFragment(fPostList) { return []; }

  getCustomTheme() {
    if (!dba.WebConfig.isWebOwner(this.#userId)) {
      let u = dba.Users.get(this.#userId);
      if (u) {
        return u.getColorTheme();
      }
    }
    return null;
  }

  setUserId(userId) {
    this.#userId = userId;
    this.#fBlog.setOwnerId(userId);
    this.#resetTabs();
  }

  onUserInfoHeroBannerFragmentRequestStartChat(fBanner, target) {
    let v = new ui.View();
    let f = new msgr.FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Chat");
  }

  onUserInfoHeroBannerFragmentRequestShowView(fBanner, view, title) {
    this.onFragmentRequestShowView(this, view, title);
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PUBLIC_PROFILES:
    case plt.T_DATA.USER_PROFILE:
      this.#resetTabs();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  #resetTabs() {
    this.#fMain.clearContents();

    this.#fMain.addTab({name : "Blog", value : "BLOG", icon : C.ICON.BLOG},
                       this.#fBlog);

    this.#fMain.switchTo("BLOG");
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.hr = window.hr || {};
  window.hr.FvcWeb3UserInfo = FvcWeb3UserInfo;
}
