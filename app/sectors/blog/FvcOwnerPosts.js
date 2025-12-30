export class FvcOwnerPosts extends ui.FScrollViewContent {
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
    this.#mMain = new gui.MainMenu();
    this.#mMain.setSector(C.ID.SECTOR.BLOG);
    this.#mMain.setDelegate(this);

    this.#fmMain = new ui.FHeaderMenu();
    this.#fmMain.setIcon(C.ICON.M_MENU, new MainIconOperator());
    this.#fmMain.setContentFragment(this.#mMain);
    this.#fmMain.setExpansionPriority(0);

    this.#mTime = new gui.MCDateFilter();
    this.#mTime.setDataSource(this);
    this.#mTime.setDelegate(this);

    this.#fmTimeFilter = new ui.FHeaderMenu();
    this.#fmTimeFilter.setIcon(C.ICON.M_SEARCH, new SearchIconOperator());
    this.#fmTimeFilter.setContentFragment(this.#mTime);
    this.#fmTimeFilter.setExpansionPriority(1);

    this.#loader = new blog.OwnerPostIdLoader();
    this.#loader.setDelegate(this);
    this.#fPosts = new blog.FPostList();
    this.#fPosts.setDataSource(this);
    this.#fPosts.setDelegate(this);
    this.#fPosts.setLoader(this.#loader);
    this.setChild("posts", this.#fPosts);

    this.setPreferredWidth({"min" : 320, "best" : 800, "max" : 0});

    this.#fBtnNew = new blog.AbNew();
  }

  initFromUrl(urlParam) {
    let id = urlParam.get(ui.C.URL_PARAM.ID);
    if (!id && urlParam.get(ui.C.URL_PARAM.N_NAV_FRAME) > 1) {
      // For multiple frames only
      let sid = dba.Blog.getDefaultPostId();
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
    return id ? ui.C.URL_PARAM.ID + "=" + id : "";
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this.#fPosts.hasBufferOnTop(); }

  setOwnerId(id) {
    this.#loader.setOwnerId(id);
    this.#mMain.setOwnerId(id);
  }

  getMenuFragments() { return [ this.#fmMain, this.#fmTimeFilter ]; }

  getActionButton() {
    if (!dba.WebConfig.isWebOwner(this.#loader.getOwnerId())) {
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
    fwk.Events.triggerTopAction(fwk.T_ACTION.REPLACE_STATE, {}, "Posts");
  }

  onTimeRangeSelectedInDateTimeFilterFragment(fDateFilter, tFrom, tTo) {
    this.#fmTimeFilter.close();
    this.#loader.setFilter(tFrom, tTo);
    this.#fPosts.reset();
  }

  onIdUpdatedInLongListIdLoader(loader) { this.#fPosts.onScrollFinished(); }

  onInfoFragmentCreatedInPostListFragment(fPosts, fInfo) {
    let ownerId = this.#loader.getOwnerId();
    if (dba.WebConfig.isWebOwner(ownerId)) {
      // Owner
      if (dba.Blog.isPostPinned(fInfo.getPostId().getValue())) {
        fInfo.setSizeType(dba.Blog.getPinnedItemLayoutType());
      } else {
        fInfo.setSizeType(dba.Blog.getItemLayoutType());
      }
    } else {
      // Other user
      let u = dba.Users.get(ownerId);
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
    case plt.T_DATA.NEW_OWNER_POST:
      if (this.#loader.getOwnerId() == dba.Account.getId()) {
        this.#fPosts.reset();
      }
      break;
    case plt.T_DATA.USER_PROFILE:
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
    if (dba.WebConfig.isWebOwner(this.#loader.getOwnerId())) {
      dba.WebConfig.setThemeId(
          this.#currentMenuItem ? this.#currentMenuItem.getId() : null);
    }
  }
}

// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcOwnerPosts = FvcOwnerPosts;
}
