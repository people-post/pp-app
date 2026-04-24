import type { ColorTheme as ColorThemeType } from '../../types/basic.js';
import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FUserInfoHeroBanner } from './FUserInfoHeroBanner.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import { Api } from '../../common/plt/Api.js';
import { ProfileHubFacade } from '../../common/hr/ProfileHubFacade.js';
import { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';

export interface FvcUserInfoDataSource {
  getUserId(): string | null;
}

export interface FvcUserInfoDelegate {
  onNewProposalRequestedInUserCommunityContentFragment(f: FViewContentBase): void;
}

export class FvcUserInfo extends FViewContentWithHeroBanner {
  #fBanner: FUserInfoHeroBanner;
  #fMain: FViewContentMux;
  #userId: string | null = null;

  constructor() {
    super();
    this.#fBanner = new FUserInfoHeroBanner();
    this.#fBanner.setDataSource(this);
    this.#fBanner.setDelegate(this);
    this.setHeroBannerFragment(this.#fBanner);
    this.setEnableAutoHide(true);

    this.#fMain = new FViewContentMux();
    this.wrapContentFragment(this.#fMain);
  }

  getUserId(): string | null { return this.#userId; }
  getTagIdsForPostListFragment(_fPostList: FViewContentBase): string[] { return []; }

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
    this.#resetTabs();
  }

  onUserInfoHeroBannerFragmentRequestStartChat(_fBanner: FUserInfoHeroBanner, target: ChatTarget): void {
    let v = ProfileHubFacade.createChatView(target);
    if (v) {
      this.onFragmentRequestShowView(this, v, "Chat");
    }
  }

  onUserInfoHeroBannerFragmentRequestShowView(_fBanner: FUserInfoHeroBanner, view: View, title: string): void {
    this.onFragmentRequestShowView(this, view, title);
  }

  onNewProposalRequestedInUserCommunityContentFragment(fUCC: FViewContentBase): void {
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

  _onContentDidAppear(): void {
    this.#asyncMarkAccountVisit();
  }

  #asyncMarkAccountVisit(): void {
    if (!this.#userId) {
      return;
    }
    let url = "api/stat/mark_account_visit?user_id=" + this.#userId;
    Api.asyncRawCall(url);
  }

  #resetTabs(): void {
    this.#fMain.clearContents();
    let defaultTabId: string | null = null;
    for (let tab of ProfileHubFacade.getWeb2Tabs()) {
      if (tab.isEnabled && !tab.isEnabled(this.#userId)) {
        continue;
      }
      let fvc = tab.createTabContent(this.#userId);
      fvc.setDataSource(this);
      fvc.setDelegate(this);
      if (defaultTabId === null) {
        defaultTabId = tab.id;
      }
      this.#fMain.addTab(
          {name : tab.name, value : tab.id, icon : tab.icon || ICON.BLOG},
          fvc);
    }
    if (defaultTabId) {
      this.#fMain.switchTo(defaultTabId);
    }
  }
}
