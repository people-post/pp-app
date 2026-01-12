import type { ColorTheme as ColorThemeType } from '../../types/Basic.js';
import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FUserInfoHeroBanner } from './FUserInfoHeroBanner.js';
import { FvcOwnerPosts } from '../blog/FvcOwnerPosts.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';
import { FvcOwner as WorkshopFvcOwner } from '../workshop/FvcOwner.js';
import { FvcOwner as ShopFvcOwner } from '../shop/FvcOwner.js';
import { FvcUserCommunity } from '../community/FvcUserCommunity.js';
import { FvcChat } from '../messenger/FvcChat.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { Api } from '../../common/plt/Api.js';

export interface FvcUserInfoDataSource {
  getUserId(): string | null;
}

export interface FvcUserInfoDelegate {
  onNewProposalRequestedInUserCommunityContentFragment(f: FvcUserCommunity): void;
}

export class FvcUserInfo extends FViewContentWithHeroBanner {
  #fBanner: FUserInfoHeroBanner;
  #fBlog: FvcOwnerPosts;
  #fWorkshop: WorkshopFvcOwner;
  #fShop: ShopFvcOwner;
  #fCommunity: FvcUserCommunity;
  #fMain: FViewContentMux;
  #userId: string | null = null;

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

    this.#fWorkshop = new WorkshopFvcOwner();
    this.#fWorkshop.setDelegate(this);

    this.#fShop = new ShopFvcOwner();
    this.#fShop.setDelegate(this);

    this.#fCommunity = new FvcUserCommunity();
    this.#fCommunity.setDelegate(this);

    this.#fMain = new FViewContentMux();
    this.wrapContentFragment(this.#fMain);
  }

  getUserId(): string | null { return this.#userId; }
  getTagIdsForPostListFragment(_fPostList: unknown): string[] { return []; }

  getCustomTheme(): ColorThemeType | null {
    if (!WebConfig.isWebOwner(this.#userId)) {
      let u = Users.get(this.#userId);
      if (u) {
        return u.getColorTheme?.() || null;
      }
    }
    return null;
  }

  setUserId(userId: string | null): void {
    this.#userId = userId;
    this.#fBlog.setOwnerId(userId);
    this.#fWorkshop.setOwnerId(userId);
    this.#fShop.setOwnerId(userId);
    this.#fCommunity.setUserId(userId);
    this.#resetTabs();
  }

  onUserInfoHeroBannerFragmentRequestStartChat(_fBanner: FUserInfoHeroBanner, target: ChatTarget): void {
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "Chat");
  }

  onUserInfoHeroBannerFragmentRequestShowView(_fBanner: FUserInfoHeroBanner, view: View, title: string): void {
    this.onFragmentRequestShowView(this, view, title);
  }

  onNewProposalRequestedInUserCommunityContentFragment(fUCC: FvcUserCommunity): void {
    const delegate = this.getDelegate<FvcUserInfoDelegate>();
    if (delegate) {
      delegate.onNewProposalRequestedInUserCommunityContentFragment(fUCC);
    }
  }

  handleSessionDataUpdate(dataType: string | symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.USER_PUBLIC_PROFILES:
    case T_DATA.USER_PROFILE:
      this.#resetTabs();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _onContentDidAppear(): void { this.#asyncMarkAccountVisit(); }

  #asyncMarkAccountVisit(): void {
    if (!this.#userId) {
      return;
    }
    let url = "api/stat/mark_account_visit?user_id=" + this.#userId;
    Api.asyncRawCall(url);
  }

  #resetTabs(): void {
    this.#fMain.clearContents();

    this.#fMain.addTab({name : "Blog", value : "BLOG", icon : ICON.BLOG},
                       this.#fBlog);
    let user = Users.get(this.#userId);
    if (user && user.isWorkshopOpen?.() === true) {
      this.#fMain.addTab(
          {name : "Workshop", value : "WORKSHOP", icon : ICON.WORKSHOP},
          this.#fWorkshop);
    }

    if (WebConfig.isDevSite()) {
      if (user && user.isShopOpen?.() === true) {
        this.#fMain.addTab({name : "Shop", value : "SHOP", icon : ICON.SHOP},
                           this.#fShop);
      }
    }

    if (user && user.getCommunityId?.() !== undefined) {
      this.#fMain.addTab(
          {name : "Community", value : "COMMUNITY", icon : ICON.COMMUNITY},
          this.#fCommunity);
    }
    this.#fMain.switchTo("BLOG");
  }
}
