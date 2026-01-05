import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { Button } from '../../lib/ui/controllers/fragments/Button.js';
import { MenuConfig } from '../../common/menu/MenuConfig.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Menus } from '../../common/dba/Menus.js';
import { T_DATA } from '../../common/plt/Events.js';
import { R } from '../../common/constants/R.js';
import { ID, MAX } from '../../common/constants/Constants.js';
import { T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { FTeam } from './FTeam.js';

export class FvcConfig extends FScrollViewContent {
  constructor() {
    super();
    this._fTeams = new FSimpleFragmentList();
    this.setChild("teams", this._fTeams);

    this._fOptions = new OptionSwitch();
    this._fOptions.addOption("Set as home page", "HOME");
    this._fOptions.setDelegate(this);
    this.setChild("options", this._fOptions);

    this._fMenuConfig = new MenuConfig();
    this._fMenuConfig.setDataSource(this);
    this._fMenuConfig.setDelegate(this);
    this._fMenuConfig.setSectorId(ID.SECTOR.WORKSHOP);
    this.setChild("mainMenu", this._fMenuConfig);

    this._fBtnAddTeam = new Button();
    this._fBtnAddTeam.setName("New team...");
    this._fBtnAddTeam.setDelegate(this);
    this.setChild("btnAddTeam", this._fBtnAddTeam);

    this._fBtnClose = new Button();
    this._fBtnClose.setName("Close workshop...");
    this._fBtnClose.setThemeType(Button.T_THEME.DANGER);
    this._fBtnClose.setDelegate(this);
    this.setChild("btnClose", this._fBtnClose);

    this._selectedTeamId = null;
  }

  shouldHighlightInTeamFragment(fTeam, teamId) {
    return teamId && (teamId == this._selectedTeamId);
  }
  getTeamForTeamFragment(fTeam, teamId) { return Workshop.getTeam(teamId); }
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
    let menus = Menus.get(ID.SECTOR.WORKSHOP, window.dba.Account.getId());
    return menus.length ? menus[0] : null;
  }

  onOptionChangeInOptionsFragment(fOptions, value, isChecked) {
    if (value == "HOME") {
      WebConfig.asyncSetHomeSector(isChecked ? ID.SECTOR.WORKSHOP
                                                 : ID.SECTOR.BLOG);
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.GROUPS:
    case FwkT_DATA.WEB_CONFIG:
    case T_DATA.WORKSHOP_CONFIG:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);

    let pp = new SectionPanel("Options");
    p.pushPanel(pp);
    this._fOptions.setOption("HOME", WebConfig.getHomeSector() ==
                                         ID.SECTOR.WORKSHOP);
    this._fOptions.attachRender(pp.getContentPanel());
    this._fOptions.render();

    pp = new SectionPanel("Main menu");
    p.pushPanel(pp);
    this._fMenuConfig.attachRender(pp.getContentPanel());
    this._fMenuConfig.render();

    pp = new SectionPanel("Teams");
    p.pushPanel(pp);
    this._fTeams.clear();
    for (let id of Workshop.getTeamIds()) {
      let f = new FTeam();
      f.setTeamId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fTeams.append(f);
    }
    this._fTeams.attachRender(pp.getContentPanel());
    this._fTeams.render();

    p.pushSpace(1);
    if (Workshop.getTeamIds().length < MAX.N_TEAMS) {
      pp = new PanelWrapper();
      p.pushPanel(pp);
      this._fBtnAddTeam.attachRender(pp);
      this._fBtnAddTeam.render();
      p.pushSpace(1);
    }
    pp = new Panel();
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
