import { FViewContentWithHeroBanner } from '../../lib/ui/controllers/fragments/FViewContentWithHeroBanner.js';
import { FViewContentMux } from '../../lib/ui/controllers/fragments/FViewContentMux.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { ICON } from '../../common/constants/Icons.js';
import { T_DATA } from '../../common/plt/Events.js';
import { FUserInfoHeroBanner } from './FUserInfoHeroBanner.js';
import { FvcWeb3OwnerPosts } from '../blog/FvcWeb3OwnerPosts.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';
import { FvcChat } from '../messenger/FvcChat.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';

interface Web3UserInfoDataSource {
  getUserId(): string | null;
}

interface Web3UserInfoDelegate {
  onFragmentRequestShowView(f: FvcWeb3UserInfo, view: View, title: string): void;
}

export class FvcWeb3UserInfo extends FViewContentWithHeroBanner {
  #fBanner: FUserInfoHeroBanner;
  #fBlog: FvcWeb3OwnerPosts;
  #fMain: FViewContentMux;
  #userId: string | null = null;
  protected _dataSource!: Web3UserInfoDataSource;
  protected _delegate!: Web3UserInfoDelegate;

  constructor() {
    super();
    this.#fBanner = new FUserInfoHeroBanner();
    this.#fBanner.setDataSource(this);
    this.#fBanner.setDelegate(this);
    this.setHeroBannerFragment(this.#fBanner);
    this.setEnableAutoHide(true);

    this.#fBlog = new FvcWeb3OwnerPosts();
    this.#fBlog.setDataSource(this);
    this.#fBlog.setDelegate(this);

    this.#fMain = new FViewContentMux();
    this.wrapContentFragment(this.#fMain);
  }

  getUserId(): string | null { return this.#userId; }
  getTagIdsForPostListFragment(_fPostList: unknown): string[] { return []; }

  getCustomTheme(): string | null {
    if (!WebConfig.isWebOwner(this.#userId)) {
      let u = Users.get(this.#userId);
      if (u) {
        return u.getColorTheme();
      }
    }
    return null;
  }

  setUserId(userId: string | null): void {
    this.#userId = userId;
    this.#fBlog.setOwnerId(userId);
    this.#resetTabs();
  }

  onUserInfoHeroBannerFragmentRequestStartChat(_fBanner: FUserInfoHeroBanner, target: ChatTarget): void {
    let v = new View();
    let f = new FvcChat();
    f.setTarget(target);
    v.setContentFragment(f);
    this._delegate.onFragmentRequestShowView(this, v, "Chat");
  }

  onUserInfoHeroBannerFragmentRequestShowView(_fBanner: FUserInfoHeroBanner, view: View, title: string): void {
    this._delegate.onFragmentRequestShowView(this, view, title);
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
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

  #resetTabs(): void {
    this.#fMain.clearContents();

    this.#fMain.addTab({name : "Blog", value : "BLOG", icon : ICON.BLOG},
                       this.#fBlog);

    this.#fMain.switchTo("BLOG");
  }
}
