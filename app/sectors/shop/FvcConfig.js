(function(shop) {
shop.CF_SHOP_CONFIG = {
  ON_NAME_CHANGE : Symbol(),
};

const _CFT_SHOP_CONFIG = {
  SHOP_NAME :
      `<input type="text" class="tight-label-like border-box" placeholder="Your shop name" value="__VALUE__" onchange="javascript:G.action(shop.CF_SHOP_CONFIG.ON_NAME_CHANGE, this.value)">`,
};

class FvcConfig extends ui.FScrollViewContent {
  #fTeams;
  #fOptions;
  #fMenuConfig;
  #fBranches;
  #fLayout;
  #btnAddTeam;
  #btnClose;
  #selectedTeamId = null;

  constructor() {
    super();
    this.#fTeams = new ui.FSimpleFragmentList();
    this.setChild("teams", this.#fTeams);

    this.#fOptions = new ui.OptionSwitch();
    this.#fOptions.addOption("Set as home page", "HOME");
    this.#fOptions.setDelegate(this);
    this.setChild("options", this.#fOptions);

    this.#fMenuConfig = new gui.MenuConfig();
    this.#fMenuConfig.setDataSource(this);
    this.#fMenuConfig.setDelegate(this);
    this.#fMenuConfig.setSectorId(C.ID.SECTOR.SHOP);
    this.setChild("mainMenu", this.#fMenuConfig);

    this.#fBranches = new shop.FBranchList();
    this.#fBranches.setEnableEdit(true);
    this.#fBranches.setDelegate(this);
    this.setChild("branches", this.#fBranches);

    this.#btnAddTeam = new ui.Button();
    this.#btnAddTeam.setName("New team...");
    this.#btnAddTeam.setDelegate(this);
    this.setChild("btnAddTeam", this.#btnAddTeam);

    this.#btnClose = new ui.Button();
    this.#btnClose.setName("Close shop...");
    this.#btnClose.setThemeType(ui.Button.T_THEME.DANGER);
    this.#btnClose.setDelegate(this);
    this.setChild("btnClose", this.#btnClose);

    this.#fLayout = new ui.ButtonGroup();
    this.#fLayout.setDelegate(this);
    let f = new shop.FProductInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_MEDIUM_SIZE"));
    let fInfo = new shop.FProduct()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.MEDIUM);
    f.setInfoFragment(fInfo);
    this.#fLayout.addChoice(
        {name : "Medium", value : dat.SocialItem.T_LAYOUT.MEDIUM, fDetail : f});
    f = new shop.FProductInfoLayoutPreview();
    f.setDelegate(this);
    f.setDescription(R.get("INTRO_LARGE_SIZE"));
    fInfo = new shop.FProduct()
    fInfo.setSizeType(dat.SocialItem.T_LAYOUT.LARGE);
    f.setInfoFragment(fInfo);
    this.#fLayout.addChoice(
        {name : "Large", value : dat.SocialItem.T_LAYOUT.LARGE, fDetail : f});
    this.setChild("layout", this.#fLayout);
  }

  shouldHighlightInTeamFragment(fTeam, teamId) {
    return teamId && (teamId == this.#selectedTeamId);
  }
  getTeamForTeamFragment(fTeam, teamId) { return dba.Shop.getTeam(teamId); }
  getMenuForGuiMenuConfig(fMenuConfig) {
    let menus = dba.Menus.get(C.ID.SECTOR.SHOP, dba.Account.getId());
    return menus.length ? menus[0] : null;
  }

  onClickInTeamFragment(fTeam) {
    let teamId = fTeam.getTeamId();
    this.#selectedTeamId = teamId;
    this.#onEditTeam(teamId);
    this.#fTeams.render();
  }

  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this.#btnAddTeam:
      this.#onAddTeam();
      break;
    case this.#btnClose:
      this.#onCloseShop();
      break;
    default:
      break;
    }
  }

  onButtonGroupSelectionChanged(fButtonGroup, value) {}
  onProductInfoPreviewFragmentRequestApplySize(fPreview, sizeType) {
    this.#asyncUpdateInfoViewSizeConfig(sizeType);
  }

  onBranchListFragmentRequestShowView(fBranchList, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }

  onBranchSelectedInBranchListFragment(fBranchList, branchId) {
    let v = new ui.View();
    let f = new shop.FvcBranch();
    f.setBranchId(branchId);
    f.setEnableEdit(true);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "Branch config");
  }

  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {
    if (value == "HOME") {
      dba.WebConfig.asyncSetHomeSector(isChecked ? C.ID.SECTOR.SHOP
                                                 : C.ID.SECTOR.BLOG);
    }
  }

  action(type, ...args) {
    switch (type) {
    case shop.CF_SHOP_CONFIG.ON_NAME_CHANGE:
      this.#onNameChange(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case fwk.T_DATA.WEB_CONFIG:
    case plt.T_DATA.GROUPS:
    case plt.T_DATA.SHOP_CONFIG:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);

    let config = dba.Shop.getConfig();

    let pp = new ui.SectionPanel("Options");
    p.pushPanel(pp);
    this.#fOptions.setOption("HOME",
                             dba.WebConfig.getHomeSector() == C.ID.SECTOR.SHOP);
    this.#fOptions.attachRender(pp.getContentPanel());
    this.#fOptions.render();

    if (config) {
      pp = new ui.SectionPanel("Shop name");
      p.pushPanel(pp);
      pp.getContentPanel().replaceContent(this.#renderName(config.name));
    }

    pp = new ui.SectionPanel("Main menu");
    p.pushPanel(pp);
    this.#fMenuConfig.attachRender(pp.getContentPanel());
    this.#fMenuConfig.render();

    p.pushSpace(1);

    pp = new ui.SectionPanel("Layout");
    p.pushPanel(pp);
    this.#fLayout.setSelectedValue(dba.Shop.getItemLayoutType());
    this.#fLayout.attachRender(pp);
    this.#fLayout.render();

    p.pushSpace(1);

    pp = new ui.SectionPanel("Teams");
    p.pushPanel(pp);
    this.#fTeams.clear();
    for (let id of dba.Shop.getTeamIds()) {
      let f = new shop.FTeam();
      f.setTeamId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      this.#fTeams.append(f);
    }
    this.#fTeams.attachRender(pp.getContentPanel());
    this.#fTeams.render();
    p.pushSpace(1);

    if (dba.Shop.getTeamIds().length < C.MAX.N_TEAMS) {
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      this.#btnAddTeam.attachRender(pp);
      this.#btnAddTeam.render();
      p.pushSpace(1);
    }

    pp = new ui.SectionPanel("Branches");
    p.pushPanel(pp);
    this.#fBranches.attachRender(pp.getContentPanel());
    this.#fBranches.render();

    p.pushSpace(1);

    pp = new ui.Panel();
    p.pushPanel(pp);
    this.#btnClose.attachRender(pp);
    this.#btnClose.render();
  }

  #renderName(name) {
    let s = _CFT_SHOP_CONFIG.SHOP_NAME;
    s = s.replace("__VALUE__", name ? name : "");
    return s;
  }

  #onNameChange(newName) {
    let c = dba.Shop.getConfig();
    if (c) {
      c.name = newName;
      dba.Shop.asyncUpdateConfig(c);
    }
  }

  #onAddTeam() { this._delegate.onShopConfigFragmentRequestAddTeam(this); }
  #onEditTeam(teamId) {
    this._delegate.onShopConfigFragmentRequestEditTeam(this, teamId);
  }

  #onCloseShop() {
    this._confirmDangerousOperation(
        R.get("CLOSE_SHOP_PROMPT"),
        () => this._delegate.onShopConfigFragmentRequestCloseShop(this));
  }

  #asyncUpdateInfoViewSizeConfig(sizeType) {
    let fd = new FormData();
    this.#fillItemLayoutType(fd, sizeType);
    // dba.Shop.asyncUpdateConfig(fd)
  }

  #asyncUpdateOptionsConfig() {
    let fd = new FormData();
    this.#fillItemLayoutType(fd);
    // dba.Shop.asyncUpdateConfig(fd)
  }

  #fillItemLayoutType(fd, sType = null) {
    fd.append("item_layout_type", sType ? sType : dba.Shop.getItemLayoutType());
  }
};

shop.FvcConfig = FvcConfig;
}(window.shop = window.shop || {}));
