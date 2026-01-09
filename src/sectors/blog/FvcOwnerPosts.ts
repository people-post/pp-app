import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { ID, URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { MainIconOperator } from '../../lib/ui/animators/MainIconOperator.js';
import { SearchIconOperator } from '../../lib/ui/animators/SearchIconOperator.js';
import { MainMenu } from '../../common/menu/MainMenu.js';
import { MCDateFilter } from '../../common/menu/MCDateFilter.js';
import { OwnerPostIdLoader } from './OwnerPostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbNew } from './AbNew.js';
import { Blog } from '../../common/dba/Blog.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import type { ActionButton } from '../../common/gui/ActionButton.js';
import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import type { LongListIdLoader } from '../../common/plt/LongListIdLoader.js';
import type { MenuItem } from '../../common/datatypes/MenuItem.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcOwnerPosts extends FScrollViewContent {
  #currentMenuItem: MenuItem | null = null;
  #mMain: MainMenu;
  #fmMain: FHeaderMenu;
  #fmTimeFilter: FHeaderMenu;
  #mTime: MCDateFilter;
  #fPosts: FPostList;
  #fBtnNew: AbNew;
  #loader: OwnerPostIdLoader;

  constructor() {
    super();
    this.#mMain = new MainMenu();
    this.#mMain.setSector(ID.SECTOR.BLOG);
    this.#mMain.setDelegate(this);

    this.#fmMain = new FHeaderMenu();
    this.#fmMain.setIcon(ICON.M_MENU, new MainIconOperator());
    this.#fmMain.setContentFragment(this.#mMain);
    this.#fmMain.setExpansionPriority(0);

    this.#mTime = new MCDateFilter();
    this.#mTime.setDataSource(this);
    this.#mTime.setDelegate(this);

    this.#fmTimeFilter = new FHeaderMenu();
    this.#fmTimeFilter.setIcon(ICON.M_SEARCH, new SearchIconOperator());
    this.#fmTimeFilter.setContentFragment(this.#mTime);
    this.#fmTimeFilter.setExpansionPriority(1);

    this.#loader = new OwnerPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new FPostList();
    this.#fPosts.setDataSource(this);
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);

    this.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});

    this.#fBtnNew = new AbNew();
  }

  initFromUrl(urlParam: URLSearchParams): void {
    let id = urlParam.get(URL_PARAM.ID);
    if (!id && Number(urlParam.get(URL_PARAM.N_NAV_FRAME)) > 1) {
      // For multiple frames only
      let sid = Blog.getDefaultPostId();
      if (sid) {
        id = sid.toEncodedStr();
      }
    }
    if (id) {
      this.#fPosts.switchToItem(id);
    }
  }

  getUrlParamString(): string {
    let id = this.#fPosts.getCurrentId();
    return id ? URL_PARAM.ID + "=" + id : "";
  }

  isReloadable(): boolean { return true; }
  hasHiddenTopBuffer(): boolean { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id: string | null): void {
    this.#loader.setOwnerId(id);
    this.#mMain.setOwnerId(id);
  }

  getMenuFragments(): Fragment[] { return [ this.#fmMain, this.#fmTimeFilter ]; }

  getActionButton(): ActionButton | null {
    if (!WebConfig.isWebOwner(this.#loader.getOwnerId())) {
      return null;
    }
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  reload(): void { this.#fPosts.reset(); }

  scrollToTop(): void { this.#fPosts.scrollToTop(); }
  onScrollFinished(): void { this.#fPosts.onScrollFinished(); }

  isUserAdminOfCommentTargetInPostListFragment(_fPostList: FPostList, _targetId: string): boolean {
    return false;
  }

  onItemSelectedInGuiMainMenu(_fMainMenu: MainMenu, menuItem: MenuItem): void {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
      Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Posts");
  }

  onTimeRangeSelectedInDateTimeFilterFragment(_fDateFilter: MCDateFilter, tFrom: Date | null, tTo: Date | null): void {
    this.#fmTimeFilter.close();
    this.#loader.setFilter(tFrom, tTo);
    this.#fPosts.reset();
  }

  onIdUpdatedInLongListIdLoader(_loader: LongListIdLoader): void { this.#fPosts.onScrollFinished(); }

  onInfoFragmentCreatedInPostListFragment(_fPosts: FPostList, fInfo: unknown): void {
    let ownerId = this.#loader.getOwnerId();
    const fInfoWithMethods = fInfo as { getPostId?: () => { getValue: () => string }; setSizeType?: (size: string) => void };
    if (WebConfig.isWebOwner(ownerId)) {
      // Owner
      if (fInfoWithMethods.getPostId && Blog.isPostPinned(fInfoWithMethods.getPostId().getValue())) {
        if (fInfoWithMethods.setSizeType) {
          fInfoWithMethods.setSizeType(Blog.getPinnedItemLayoutType());
        }
      } else {
        if (fInfoWithMethods.setSizeType) {
          fInfoWithMethods.setSizeType(Blog.getItemLayoutType());
        }
      }
    } else {
      // Other user
      let u = Users.get(ownerId);
      if (u) {
        let c = u.getBlogConfig();
        if (c && fInfoWithMethods.getPostId) {
          const configWithLayout = c as { getPostLayoutType?: (postId: string) => string };
          if (configWithLayout.getPostLayoutType && fInfoWithMethods.setSizeType) {
            fInfoWithMethods.setSizeType(configWithLayout.getPostLayoutType(fInfoWithMethods.getPostId().getValue()));
          }
        }
      }
    }
  }

  handleSessionDataUpdate(dataType: string, data: unknown): void {
    switch (dataType) {
    case T_DATA.NEW_OWNER_POST:
      if (window.dba?.Account && this.#loader.getOwnerId() == window.dba.Account.getId()) {
        this.#fPosts.reset();
      }
      break;
    case T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _onRenderAttached(render: Render): void {
    super._onRenderAttached(render);
    this.#applyTheme();
  }

  _renderContentOnRender(render: Render): void {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }

  #getTagIds(): string[] {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  #prepare(menuItem: MenuItem): void {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#loader.setTagIds(this.#getTagIds());
      this.#fPosts.reset();
    }
  }

  #applyTheme(): void {
    if (WebConfig.isWebOwner(this.#loader.getOwnerId())) {
      WebConfig.setThemeId(
          this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
    }
  }
}
