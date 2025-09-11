(function(blog) {
window.CF_BLOG_CONFIG = {
  ADD_ROLE : "CF_BLOG_CONFIG_1",
};

const _CFT_BLOG_CONFIG_CONTENT = {
  ROLE_NAME_CELL : `__NAME__(__TOTAL__)`,
  BTN_NEW_ROLE : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_BLOG_CONFIG.ADD_ROLE)">New writer group...</a>
    <br>`,
}

class FvcConfig extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fInsiders = new blog.FRoleList();
    this._fInsiders.setRoleType(dat.BlogRole.T_ROLE.EXCLUSIVE);
    this._fInsiders.setDelegate(this);
    this._fPartnerships = new blog.FRoleList();
    this._fPartnerships.setRoleType(dat.BlogRole.T_ROLE.PARTNERSHIP);
    this._fPartnerships.setDelegate(this);
    this._fRoles = new ui.FTabbedPane();
    this._fRoles.addPane(
        {name : "Insiders", value : "INSIDER", icon : C.ICON.EMPLOYEE},
        this._fInsiders);
    this._fRoles.addPane({
      name : "Coalitionists",
      value : "PARTNERSHIP",
      icon : C.ICON.PARTNERSHIP
    },
                         this._fPartnerships);
    this._fRoles.setDefaultPane("INSIDER");
    this.setChild("roles", this._fRoles);

    this._fMenuConfig = new gui.MenuConfig();
    this._fMenuConfig.setDataSource(this);
    this._fMenuConfig.setDelegate(this);
    this._fMenuConfig.setSectorId(C.ID.SECTOR.BLOG);
    this.setChild("mainMenu", this._fMenuConfig);

    this._fOptions = new ui.OptionSwitch();
    this._fOptions.addOption("Enable social action", "SOCIAL");
    this._fOptions.addOption("Use \"big head\" style for pinned",
                             "PIN_BIG_HEAD");
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);

    let f = new blog.FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_COMPACT_SIZE"));
    let fInfo = new blog.FPostInfo()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.COMPACT);
    f.setInfoFragment(fInfo);
    this._fLayout = new ui.ButtonGroup();
    this._fLayout.addChoice({
      name : "Compact",
      value : dat.SocialItem.T_LAYOUT.COMPACT,
      fDetail : f
    });
    f = new blog.FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_SMALL_SIZE"));
    fInfo = new blog.FPostInfo()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.SMALL);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice(
        {name : "Small", value : dat.SocialItem.T_LAYOUT.SMALL, fDetail : f});
    f = new blog.FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_MEDIUM_SIZE"));
    fInfo = new blog.FPostInfo()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.MEDIUM);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice(
        {name : "Medium", value : dat.SocialItem.T_LAYOUT.MEDIUM, fDetail : f});
    f = new blog.FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_LARGE_SIZE"));
    fInfo = new blog.FPostInfo()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.LARGE);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice(
        {name : "Large", value : dat.SocialItem.T_LAYOUT.LARGE, fDetail : f});
    f = new blog.FPostInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_BIG_HEAD_SIZE"));
    fInfo = new blog.FPostInfo()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.BIG_HEAD);
    f.setInfoFragment(fInfo);
    this._fLayout.addChoice({
      name : "Big head",
      value : dat.SocialItem.T_LAYOUT.BIG_HEAD,
      fDetail : f
    });
    this._fLayout.setDelegate(this);
    this.setChild("layout", this._fLayout);
  }

  getMenuForGuiMenuConfig(fMenuConfig) {
    let menus = dba.Menus.get(C.ID.SECTOR.BLOG, dba.Account.getId());
    return menus.length ? menus[0] : null;
  }

  onButtonGroupSelectionChanged(fButtonGroup, value) {}
  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {
    this.#asyncUpdateOptionsConfig();
  }
  onPostInfoPreviewFragmentRequestApplySize(fPreview, sizeType) {
    this.#asyncUpdateInfoViewSizeConfig(sizeType);
  }
  onRoleListFragmentRequestEditRole(fRoleList, roleId) {
    let v = new ui.View();
    let f = new blog.FvcRoleEditor();
    f.setRoleId(roleId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Blog role");
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.USER_PROFILE:
      this._owner.onContentFragmentRequestUpdateHeader(this);
      this.render();
      break;
    case plt.T_DATA.GROUPS:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  action(type, ...args) {
    switch (type) {
    case CF_BLOG_CONFIG.ADD_ROLE:
      this.#onAddRole();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let pp = new ui.SectionPanel("Layout");
    p.pushPanel(pp);
    this._fLayout.setSelectedValue(dba.Blog.getItemLayoutType());
    this._fLayout.attachRender(pp);
    this._fLayout.render();

    pp = new ui.SectionPanel("Main menu");
    p.pushPanel(pp);
    this._fMenuConfig.attachRender(pp.getContentPanel());
    this._fMenuConfig.render();

    pp = new ui.SectionPanel("Options");
    p.pushPanel(pp);
    this._fOptions.setOption("SOCIAL", dba.Blog.isSocialEnabled());
    this._fOptions.setOption("PIN_BIG_HEAD",
                             dba.Blog.getPinnedItemLayoutType() ==
                                 dat.SocialItem.T_LAYOUT.BIG_HEAD);
    this._fOptions.attachRender(pp.getContentPanel());
    this._fOptions.render();

    pp = new ui.SectionPanel("Collaborations");
    p.pushPanel(pp);
    this._fRoles.attachRender(pp.getContentPanel());
    this._fRoles.render();
    if (dba.Blog.getRoleIds().length < C.MAX.N_ROLES) {
      pp = new ui.Panel();
      p.pushPanel(pp);
      pp.replaceContent(_CFT_BLOG_CONFIG_CONTENT.BTN_NEW_ROLE);
    }
  }

  #onAddRole() {
    let v = new ui.View();
    v.setContentFragment(new blog.FvcRoleEditor());
    this._owner.onFragmentRequestShowView(this, v, "Blog role");
  }

  #asyncUpdateInfoViewSizeConfig(sizeType) {
    let fd = new FormData();
    this.#fillItemLayoutType(fd, sizeType);
    this.#fillOptionsData(fd);
    this.#asyncUpdateConfig(fd)
  }

  #asyncUpdateOptionsConfig() {
    let fd = new FormData();
    this.#fillItemLayoutType(fd);
    this.#fillOptionsData(fd);
    this.#asyncUpdateConfig(fd)
  }

  #fillItemLayoutType(fd, sType = null) {
    fd.append("item_layout_type", sType ? sType : dba.Blog.getItemLayoutType());
  }

  #fillOptionsData(fd) {
    if (this._fOptions.isOptionOn("SOCIAL")) {
      fd.append("enable_social_action", 1);
    }
    if (this._fOptions.isOptionOn("PIN_BIG_HEAD")) {
      fd.append("pinned_item_layout_type", dat.SocialItem.T_LAYOUT.BIG_HEAD);
    } else {
      fd.append("pinned_item_layout_type", fd.get("item_layout_type"));
    }
  }

  #asyncUpdateConfig(fd) {
    let url = "api/blog/update_config";
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onUpdateConfigRRR(d));
  }

  #onUpdateConfigRRR(data) {
    dba.Blog.resetConfig(data.config);
    this.render();
  }
};

blog.FvcConfig = FvcConfig;
}(window.blog = window.blog || {}));
