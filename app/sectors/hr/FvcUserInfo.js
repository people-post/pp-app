(function(hr) {
class FvcUserInfo extends ui.FViewContentWithHeroBanner {
  #fBanner;
  #fBlog;
  #fWorkshop;
  #fShop;
  #fCommunity;
  #fMain;
  #userId = null;

  constructor() {
    super();
    this.#fBanner = new hr.FUserInfoHeroBanner();
    this.#fBanner.setDataSource(this);
    this.#fBanner.setDelegate(this);
    this.setHeroBannerFragment(this.#fBanner);
    this.setEnableAutoHide(true);

    this.#fBlog = new blog.FvcOwnerPosts();
    this.#fBlog.setDataSource(this);
    this.#fBlog.setDelegate(this);

    this.#fWorkshop = new wksp.FvcOwner();
    this.#fWorkshop.setDelegate(this);

    this.#fShop = new shop.FvcOwner();
    this.#fShop.setDelegate(this);

    this.#fCommunity = new cmut.FvcUserCommunity();
    this.#fCommunity.setDelegate(this);

    this.#fMain = new ui.FViewContentMux();
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
    this.#fWorkshop.setOwnerId(userId);
    this.#fShop.setOwnerId(userId);
    this.#fCommunity.setUserId(userId);
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

  onNewProposalRequestedInUserCommunityContentFragment(fUCC) {}

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

  _onContentDidAppear() { this.#asyncMarkAccountVisit(); }

  #asyncMarkAccountVisit() {
    let url = "api/stat/mark_account_visit?user_id=" + this.#userId;
    plt.Api.asyncRawCall(url);
  }

  #resetTabs() {
    this.#fMain.clearContents();

    this.#fMain.addTab({name : "Blog", value : "BLOG", icon : C.ICON.BLOG},
                       this.#fBlog);
    let user = dba.Users.get(this.#userId);
    if (user && user.isWorkshopOpen()) {
      this.#fMain.addTab(
          {name : "Workshop", value : "WORKSHOP", icon : C.ICON.WORKSHOP},
          this.#fWorkshop);
    }

    if (dba.WebConfig.isDevSite()) {
      if (user && user.isShopOpen()) {
        this.#fMain.addTab({name : "Shop", value : "SHOP", icon : C.ICON.SHOP},
                           this.#fShop);
      }
    }

    if (user && user.getCommunityId()) {
      this.#fMain.addTab(
          {name : "Community", value : "COMMUNITY", icon : C.ICON.COMMUNITY},
          this.#fCommunity);
    }
    this.#fMain.switchTo("BLOG");
  }
};

hr.FvcUserInfo = FvcUserInfo;
}(window.hr = window.hr || {}));
