
window.CF_WORKSHOP_TEAM_EDITOR = {
  SUBMIT : "CF_WORKSHOP_TEAM_EDITOR_1",
}

const _CFT_WORKSHOP_TEAM_EDITOR = {
  SEC_NAME :
      `<input id="ID_WORKSHOP_TEAM_NAME" type="text" placeholder="Name" value="__NAME__">`,
  SEC_SUBMIT : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_WORKSHOP_TEAM_EDITOR.SUBMIT)">Submit<a>`,
}
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Workshop } from '../../common/dba/Workshop.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Groups } from '../../common/dba/Groups.js';
import { WorkshopTeam } from '../../common/datatypes/WorkshopTeam.js';
import { UserGroup } from '../../common/datatypes/UserGroup.js';
import { Api } from '../../common/plt/Api.js';

export class FvcTeamEditor extends FScrollViewContent {
  constructor() {
    super();
    this._fOptions = new OptionSwitch();
    this._fOptions.setDelegate(this);
    this._fOptions.addOption("Active", "ACTIVE", true);
    this._fOptions.addOption("Recruiting", "OPEN", true);
    this.setChild("options", this._fOptions);

    this._fPermissions = new OptionSwitch();
    this._fPermissions.setDelegate(this);
    this._fPermissions.addOption("Create new projects", "P_CREATE", false);
    this._fPermissions.addOption("Assign project team", "P_ASSIGN", false);

    this.setChild("permissions", this._fPermissions);

    this._teamId = null;
  }

  setTeamId(id) { this._teamId = id; }

  onOptionChangeInOptionsFragment(f, value, isOn) {}

  action(type, ...args) {
    switch (type) {
    case CF_WORKSHOP_TEAM_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel("Name");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(this.#renderNameInputs());

    this.#setOptions();

    pp = new SectionPanel("Permissions");
    p.pushPanel(pp);
    this._fPermissions.attachRender(pp.getContentPanel());
    this._fPermissions.render();

    pp = new SectionPanel("Options");
    p.pushPanel(pp);
    this._fOptions.attachRender(pp.getContentPanel());
    this._fOptions.render();

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_WORKSHOP_TEAM_EDITOR.SEC_SUBMIT);
  }

  #setOptions() {
    let team = this.#getTeam();
    if (team) {
      this._fOptions.setOption("ACTIVE", team.isActive());
      this._fOptions.setOption("OPEN", team.isOpen());
      this._fPermissions.setOption(
          "P_CREATE", team.hasPermission(WorkshopTeam.T_PERMISSION.CREATE));
      this._fPermissions.setOption(
          "P_ASSIGN", team.hasPermission(WorkshopTeam.T_PERMISSION.ASSIGN));
    }
  }

  #getTeam() { return Workshop.getTeam(this._teamId); }

  #renderNameInputs() {
    let s = _CFT_WORKSHOP_TEAM_EDITOR.SEC_NAME;
    let name = "";
    let team = this.#getTeam();
    if (team) {
      name = team.getName();
    }
    s = s.replace("__NAME__", name);
    return s;
  }

  #onSubmit() {
    let data = this.#collectData();
    if (data.id) {
      this.#asyncRequestEditTeam(data);
    } else {
      this.#asyncRequestAddTeam(data);
    }
  }

  #collectData() {
    let data = {};
    let e = document.getElementById("ID_WORKSHOP_TEAM_NAME");
    if (e) {
      data.name = e.value;
    }
    data.id = this._teamId;
    data.is_open = this._fOptions.isOptionOn("OPEN");
    data.is_active = this._fOptions.isOptionOn("ACTIVE");
    data.permissions = [];
    if (this._fPermissions.isOptionOn("P_CREATE")) {
      data.permissions.push(WorkshopTeam.T_PERMISSION.CREATE);
    }
    if (this._fPermissions.isOptionOn("P_ASSIGN")) {
      data.permissions.push(WorkshopTeam.T_PERMISSION.ASSIGN);
    }
    return data;
  }

  #makeForm(data) {
    let fd = new FormData();
    if (data.id) {
      fd.append("id", data.id);
    }
    fd.append("name", data.name);
    if (data.is_open) {
      fd.append("is_open", data.is_open);
    }
    if (data.is_active) {
      fd.append("is_active", data.is_active);
    }
    for (let p of data.permissions) {
      fd.append("permissions", p);
    }
    return fd;
  }

  #asyncRequestAddTeam(data) {
    let url = "api/workshop/add_team";
    let fd = this.#makeForm(data);
    Api.asFragmentPost(this, url, fd).then(d => this.#onNewTeamRRR(d));
  }

  #asyncRequestEditTeam(data) {
    let url = "api/workshop/update_team";
    let fd = this.#makeForm(data);
    Api.asFragmentPost(this, url, fd).then(d => this.#onEditTeamRRR(d));
  }

  #asyncRequestDeleteTeam(id) {
    let url = "api/workshop/delete_team";
    let fd = FormData();
    fd.append("id", id);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onDeleteTeamRRR(d));
  }

  #onNewTeamRRR(data) { this.#onEditTeamFinished(data.groups); }
  #onEditTeamRRR(data) { this.#onEditTeamFinished(data.groups); }
  #onDeleteTeamRRR(data) { this.#onEditTeamFinished(data.groups); }

  #onEditTeamFinished(groups) {
    WebConfig.resetRoles(groups);
    for (let d of groups) {
      Groups.update(new UserGroup(d));
    }
    this._owner.onContentFragmentRequestPopView(this);
  }
};
