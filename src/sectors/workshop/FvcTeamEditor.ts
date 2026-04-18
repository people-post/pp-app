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
import type { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { GroupData } from '../../types/backend2.js';

export const CF_WORKSHOP_TEAM_EDITOR = {
  SUBMIT: "CF_WORKSHOP_TEAM_EDITOR_1",
} as const;

const _CFT_WORKSHOP_TEAM_EDITOR = {
  SEC_NAME:
      `<input id="ID_WORKSHOP_TEAM_NAME" type="text" placeholder="Name" value="__NAME__">`,
  SEC_SUBMIT: `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" data-pp-action="${CF_WORKSHOP_TEAM_EDITOR.SUBMIT}">Submit</a>`,
} as const;

interface TeamData {
  id: string | null;
  name: string;
  is_open: boolean;
  is_active: boolean;
  permissions: string[];
}

interface ApiGroupsResponse {
  groups: GroupData[];
};

export class FvcTeamEditor extends FScrollViewContent {
  protected _fOptions: OptionSwitch;
  protected _fPermissions: OptionSwitch;
  protected _teamId: string | null = null;

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
  }

  setTeamId(id: string | null): void { this._teamId = id; }

  onOptionChangeInOptionsFragment(_f: OptionSwitch, _value: string, _isOn: boolean): void {}

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_WORKSHOP_TEAM_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderContentOnRender(render: PanelWrapper): void {
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

    let ppSubmit = new Panel();
    p.pushPanel(ppSubmit);
    ppSubmit.replaceContent(_CFT_WORKSHOP_TEAM_EDITOR.SEC_SUBMIT);
  }

  #setOptions(): void {
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

  #getTeam(): WorkshopTeam | null {
    if (!this._teamId) {
      return null;
    }
    return Workshop.getTeam(this._teamId);
  }

  #renderNameInputs(): string {
    let s: string = _CFT_WORKSHOP_TEAM_EDITOR.SEC_NAME;
    let name = "";
    let team = this.#getTeam();
    if (team) {
      name = team.getName() || "";
    }
    s = s.replace("__NAME__", name);
    return s;
  }

  #onSubmit(): void {
    let data = this.#collectData();
    if (data.id) {
      this.#asyncRequestEditTeam(data);
    } else {
      this.#asyncRequestAddTeam(data);
    }
  }

  #collectData(): TeamData {
    let data: TeamData = { id: null, name: "", is_open: false, is_active: false, permissions: [] };
    let e = document.getElementById("ID_WORKSHOP_TEAM_NAME") as HTMLInputElement | null;
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

  #makeForm(data: TeamData): FormData {
    let fd = new FormData();
    if (data.id) {
      fd.append("id", data.id);
    }
    fd.append("name", data.name);
    if (data.is_open) {
      fd.append("is_open", String(data.is_open));
    }
    if (data.is_active) {
      fd.append("is_active", String(data.is_active));
    }
    for (let p of data.permissions) {
      fd.append("permissions", p);
    }
    return fd;
  }

  #asyncRequestAddTeam(data: TeamData): void {
    let url = "api/workshop/add_team";
    let fd = this.#makeForm(data);
    Api.asFragmentPost<ApiGroupsResponse>(this, url, fd).then(d => this.#onNewTeamRRR(d));
  }

  #asyncRequestEditTeam(data: TeamData): void {
    let url = "api/workshop/update_team";
    let fd = this.#makeForm(data);
    Api.asFragmentPost<ApiGroupsResponse>(this, url, fd).then(d => this.#onEditTeamRRR(d));
  }

  /*
  #asyncRequestDeleteTeam(id: string): void {
    let url = "api/workshop/delete_team";
    let fd = new FormData();
    fd.append("id", id);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onDeleteTeamRRR(d));
  }
  */

  #onNewTeamRRR(data: ApiGroupsResponse): void {
    this.#onEditTeamFinished(data.groups);
  }

  #onEditTeamRRR(data: ApiGroupsResponse): void {
    this.#onEditTeamFinished(data.groups);
  }
  /*
  #onDeleteTeamRRR(data: unknown): void {
    let dataObj = data as { groups: unknown[] };
    this.#onEditTeamFinished(dataObj.groups);
  }
  */

  #onEditTeamFinished(groups: GroupData[]): void {
    WebConfig.resetRoles(groups);
    for (let d of groups) {
      Groups.update(new UserGroup(d));
    }
    this._requestPopView();
  }
}
