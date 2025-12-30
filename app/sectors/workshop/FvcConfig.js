
export class FvcConfig extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fTeams = new ui.FSimpleFragmentList();
    this.setChild("teams", this._fTeams);

    this._fOptions = new ui.OptionSwitch();
    this._fOptions.addOption("Set as home page", "HOME");
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);

    this._fMenuConfig = new gui.MenuConfig();
    this._fMenuConfig.setDataSource(this);
    this._fMenuConfig.setDelegate(this);
    this._fMenuConfig.setSectorId(C.ID.SECTOR.WORKSHOP);
    this.setChild("mainMenu", this._fMenuConfig);

    this._fBtnAddTeam = new ui.Button();
    this._fBtnAddTeam.setName("New team...");
    this._fBtnAddTeam.setDelegate(this);
    this.setChild("btnAddTeam", this._fBtnAddTeam);

    this._fBtnClose = new ui.Button();
    this._fBtnClose.setName("Close workshop...");
    this._fBtnClose.setThemeType(ui.Button.T_THEME.DANGER);
    this._fBtnClose.setDelegate(this);
    this.setChild("btnClose", this._fBtnClose);

    this._selectedTeamId = null;
  }

  shouldHighlightInTeamFragment(fTeam, teamId) {
    return teamId && (teamId == this._selectedTeamId);
  }
  getTeamForTeamFragment(fTeam, teamId) { return dba.Workshop.getTeam(teamId); }
  onClickInTeamFragment(fTeam) {
    let teamId = fTeam.getTeamId();
    this._selectedTeamId = teamId;
    this.#onEditTeam(teamId);
    this._fTeams.render();
  }
  onSimpleButtonClicked(fBtn) {
    switch (fBtn) {
    case this._fBtnAddTeam:
      this.#onAddTeam();
      break;
    case this._fBtnClose:
      this.#onCloseWorkshop();
      break;
    default:
      break;
    }
  }

  getMenuForGuiMenuConfig(fMenuConfig) {
    let menus = dba.Menus.get(C.ID.SECTOR.WORKSHOP, dba.Account.getId());
    return menus.length ? menus[0] : null;
  }

  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {
    if (value == "HOME") {
      dba.WebConfig.asyncSetHomeSector(isChecked ? C.ID.SECTOR.WORKSHOP
                                                 : C.ID.SECTOR.BLOG);
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GROUPS:
    case fwk.T_DATA.WEB_CONFIG:
    case plt.T_DATA.WORKSHOP_CONFIG:
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

    let pp = new ui.SectionPanel("Options");
    p.pushPanel(pp);
    this._fOptions.setOption("HOME", dba.WebConfig.getHomeSector() ==
                                         C.ID.SECTOR.WORKSHOP);
    this._fOptions.attachRender(pp.getContentPanel());
    this._fOptions.render();

    pp = new ui.SectionPanel("Main menu");
    p.pushPanel(pp);
    this._fMenuConfig.attachRender(pp.getContentPanel());
    this._fMenuConfig.render();

    pp = new ui.SectionPanel("Teams");
    p.pushPanel(pp);
    this._fTeams.clear();
    for (let id of dba.Workshop.getTeamIds()) {
      let f = new wksp.FTeam();
      f.setTeamId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fTeams.append(f);
    }
    this._fTeams.attachRender(pp.getContentPanel());
    this._fTeams.render();

    p.pushSpace(1);
    if (dba.Workshop.getTeamIds().length < C.MAX.N_TEAMS) {
      pp = new ui.PanelWrapper();
      p.pushPanel(pp);
      this._fBtnAddTeam.attachRender(pp);
      this._fBtnAddTeam.render();
      p.pushSpace(1);
    }
    pp = new ui.Panel();
    p.pushPanel(pp);
    this._fBtnClose.attachRender(pp);
    this._fBtnClose.render();
  }

  #onAddTeam() { this._delegate.onWorkshopConfigFragmentRequestAddTeam(this); }
  #onEditTeam(teamId) {
    this._delegate.onWorkshopConfigFragmentRequestEditTeam(this, teamId);
  }
  #onCloseWorkshop() {
    this._confirmDangerousOperation(
        R.get("CLOSE_WORKSHOP_PROMPT"),
        () =>
            this._delegate.onWorkshopConfigFragmentRequestCloseWorkshop(this));
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.FvcConfig = FvcConfig;
}
