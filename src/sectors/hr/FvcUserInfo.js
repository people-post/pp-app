import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { api } from '../../common/plt/Api.js';
import { FUserInfoHeroBanner } from './FUserInfoHeroBanner.js';
import { FvcOwnerPosts } from '../blog/FvcOwnerPosts.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';
export class FvcUserInfo extends FViewContentWithHeroBanner {
  #fBanner;
  #fBlog;
  #fWorkshop;
  #fShop;
  #fCommunity;
  #fMain;
  #userId = null;

  constructor() {
    super();
    this.#fBanner = new FUserInfoHeroBanner();
    this.#fBanner.setDataSource(this);
    this.#fBanner.setDelegate(this);
    this.setHeroBannerFragment(this.#fBanner);
    this.setEnableAutoHide(true);

    this.#fBlog = new FvcOwnerPosts();
    this.#fBlog.setDataSource(this);
    this.#fBlog.setDelegate(this);

    this.#fWorkshop = new wksp.FvcOwner();
    this.#fWorkshop.setDelegate(this);

    this.#fShop = new shop.FvcOwner();
    this.#fShop.setDelegate(this);

    this.#fCommunity = new cmut.FvcUserCommunity();
    this.#fCommunity.setDelegate(this);

    this.#fMain = new FViewContentMux();
    this.wrapContentFragment(this.#fMain);
  }

  getUserId() { return this.#userId; }
  getTagIdsForPostListFragment(fPostList) { return []; }

  getCustomTheme() {
    if (!WebConfig.isWebOwner(this.#userId)) {
      let u = Users.get(this.#userId);
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
    let v = new View();
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
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.USER_PROFILE:
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
    api.asyncRawCall(url);
  }

  #resetTabs() {
    this.#fMain.clearContents();

    this.#fMain.addTab({name : "Blog", value : "BLOG", icon : ICON.BLOG},
                       this.#fBlog);
    let user = Users.get(this.#userId);
    if (user && user.isWorkshopOpen()) {
      this.#fMain.addTab(
          {name : "Workshop", value : "WORKSHOP", icon : ICON.WORKSHOP},
          this.#fWorkshop);
    }

    if (WebConfig.isDevSite()) {
      if (user && user.isShopOpen()) {
        this.#fMain.addTab({name : "Shop", value : "SHOP", icon : ICON.SHOP},
                           this.#fShop);
      }
    }

    if (user && user.getCommunityId()) {
      this.#fMain.addTab(
          {name : "Community", value : "COMMUNITY", icon : ICON.COMMUNITY},
          this.#fCommunity);
    }
    this.#fMain.switchTo("BLOG");
  }
}
