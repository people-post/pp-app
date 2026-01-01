import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FHeaderMenu } from '../../lib/ui/controllers/fragments/FHeaderMenu.js';
import { ID, URL_PARAM } from '../../common/constants/Constants.js';
import { ICON } from '../../common/constants/Icons.js';
import { MainMenu } from '../../common/menu/MainMenu.js';
import { MCDateFilter } from '../../common/menu/MCDateFilter.js';
import { OwnerPostIdLoader } from './OwnerPostIdLoader.js';
import { FPostList } from './FPostList.js';
import { AbNew } from './AbNew.js';
import { Blog } from '../../common/dba/Blog.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Users } from '../../common/dba/Users.js';
import { Account } from '../../common/dba/Account.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
export class FvcOwnerPosts extends FScrollViewContent {
  #currentMenuItem = null;
  #mMain;
  #fmMain;
  #fmTimeFilter;
  #mTime;
  #fPosts;
  #fBtnNew;
  #loader;

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

  initFromUrl(urlParam) {
    let id = urlParam.get(URL_PARAM.ID);
    if (!id && urlParam.get(URL_PARAM.N_NAV_FRAME) > 1) {
      // For multiple frames only
      let sid = Blog.getDefaultPostId();
      if (sid) {
        id = sid.toEncodedStr()
      }
    }
    if (id) {
      this.#fPosts.switchToItem(id);
    }
  }

  getUrlParamString() {
    let id = this.#fPosts.getCurrentId();
    return id ? URL_PARAM.ID + "=" + id : "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id) {
    this.#loader.setOwnerId(id);
    this.#mMain.setOwnerId(id);
  }

  getMenuFragments() { return [ this.#fmMain, this.#fmTimeFilter ]; }

  getActionButton() {
    if (!WebConfig.isWebOwner(this.#loader.getOwnerId())) {
      return false;
    }
    return this.#fBtnNew.isAvailable() ? this.#fBtnNew : null;
  }

  reload() { this.#fPosts.reset(); }

  scrollToTop() { this.#fPosts.scrollToTop(); }
  onScrollFinished() { this.#fPosts.onScrollFinished(); }

  isUserAdminOfCommentTargetInPostListFragment(fPostList, targetId) {
    return false;
  }

  onItemSelectedInGuiMainMenu(fMainMenu, menuItem) {
    this.#prepare(menuItem);
    this.#applyTheme();

    this.#fmMain.close();
      Events.triggerTopAction(T_ACTION.REPLACE_STATE, {}, "Posts");
  }

  onTimeRangeSelectedInDateTimeFilterFragment(fDateFilter, tFrom, tTo) {
    this.#fmTimeFilter.close();
    this.#loader.setFilter(tFrom, tTo);
    this.#fPosts.reset();
  }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }

  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    let ownerId = this.#loader.getOwnerId();
    if (WebConfig.isWebOwner(ownerId)) {
      // Owner
      if (Blog.isPostPinned(fInfo.getPostId().getValue())) {
        fInfo.setSizeType(Blog.getPinnedItemLayoutType());
      } else {
        fInfo.setSizeType(Blog.getItemLayoutType());
      }
    } else {
      // Other user
      let u = Users.get(ownerId);
      if (u) {
        let c = u.getBlogConfig();
        if (c) {
          fInfo.setSizeType(c.getPostLayoutType(fInfo.getPostId().getValue()));
        }
      }
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.NEW_OWNER_POST:
      if (this.#loader.getOwnerId() == Account.getId()) {
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
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _onRenderAttached(render) {
    super._onRenderAttached(render);
    this.#applyTheme();
  }

  _renderContentOnRender(render) {
    this.#fPosts.attachRender(render);
    this.#fPosts.render();
  }

  #getTagIds() {
    return this.#currentMenuItem ? this.#currentMenuItem.getTagIds() : [];
  }

  #prepare(menuItem) {
    if (this.#currentMenuItem != menuItem) {
      this.#currentMenuItem = menuItem;
      this.#loader.setTagIds(this.#getTagIds());
      this.#fPosts.reset();
    }
  }

  #applyTheme() {
    if (WebConfig.isWebOwner(this.#loader.getOwnerId())) {
      WebConfig.setThemeId(
          this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
    }
  }
}
