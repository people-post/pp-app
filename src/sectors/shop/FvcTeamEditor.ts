export const CF_SHOP_TEAM_EDITOR = {
  SUBMIT : "CF_SHOP_TEAM_EDITOR_1",
}

const _CFT_SHOP_TEAM_EDITOR = {
  SEC_NAME :
      `<input id="ID_SHOP_TEAM_NAME" type="text" placeholder="Name" value="__NAME__">`,
  SEC_SUBMIT : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action('${CF_SHOP_TEAM_EDITOR.SUBMIT}')">Submit<a>`,
}

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { UserGroup } from '../../common/datatypes/UserGroup.js';
import { Shop } from '../../common/dba/Shop.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Groups } from '../../common/dba/Groups.js';
import { Api } from '../../common/plt/Api.js';

interface TeamData {
  id: string | null;
  name: string;
  is_open: boolean;
  is_active: boolean;
  permissions: string[];
}

export class FvcTeamEditor extends FScrollViewContent {
  private _fOptions: OptionSwitch;
  private _fPermissions: OptionSwitch;
  private _teamId: string | null = null;

  constructor() {
    super();
    this._fOptions = new OptionSwitch();
    this._fOptions.setDelegate(this);
    this._fOptions.addOption("Active", "ACTIVE", true);
    this._fOptions.addOption("Recruiting", "OPEN", true);
    this.setChild("options", this._fOptions);

    this._fPermissions = new OptionSwitch();
    this._fPermissions.setDelegate(this);
    this.setChild("permissions", this._fPermissions);

    this._teamId = null;
  }

  setTeamId(id: string | null): void { this._teamId = id; }

  onOptionChangeInOptionsFragment(_f: OptionSwitch, _value: string, _isOn: boolean): void {}

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SHOP_TEAM_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
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
    pp.replaceContent(_CFT_SHOP_TEAM_EDITOR.SEC_SUBMIT);
  }

  #setOptions(): void {
    let team = this.#getTeam();
    if (team) {
      this._fOptions.setOption("ACTIVE", team.isActive());
      this._fOptions.setOption("OPEN", team.isOpen());
    }
  }

  #getTeam(): ReturnType<typeof Shop.getTeam> { return Shop.getTeam(this._teamId); }

  #renderNameInputs(): string {
    let s = _CFT_SHOP_TEAM_EDITOR.SEC_NAME;
    let name = "";
    let team = this.#getTeam();
    if (team) {
      name = team.getName();
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
    let data: Partial<TeamData> = {};
    let e = document.getElementById("ID_SHOP_TEAM_NAME") as HTMLInputElement | null;
    if (e) {
      data.name = e.value;
    } else {
      data.name = "";
    }
    data.id = this._teamId;
    data.is_open = this._fOptions.isOptionOn("OPEN");
    data.is_active = this._fOptions.isOptionOn("ACTIVE");
    data.permissions = [];
    return data as TeamData;
  }

  #makeForm(data: TeamData): FormData {
    let fd = new FormData();
    if (data.id) {
      fd.append("id", data.id);
    }
    fd.append("name", data.name);
    if (data.is_open) {
      fd.append("is_open", data.is_open.toString());
    }
    if (data.is_active) {
      fd.append("is_active", data.is_active.toString());
    }
    for (let p of data.permissions) {
      fd.append("permissions", p);
    }
    return fd;
  }

  #asyncRequestAddTeam(data: TeamData): void {
    let url = "api/shop/add_team";
    let fd = this.#makeForm(data);
    Api.asFragmentPost(this, url, fd).then(d => this.#onNewTeamRRR(d));
  }

  #asyncRequestEditTeam(data: TeamData): void {
    let url = "api/shop/update_team";
    let fd = this.#makeForm(data);
    Api.asFragmentPost(this, url, fd).then(d => this.#onEditTeamRRR(d));
  }

  #asyncRequestDeleteTeam(id: string): void {
    let url = "api/shop/delete_team";
    let fd = new FormData();
    fd.append("id", id);
    Api.asFragmentPost(this, url, fd)
        .then(d => this.#onDeleteTeamRRR(d));
  }

  #onNewTeamRRR(data: { groups: unknown[] }): void { this.#onEditTeamFinished(data.groups); }
  #onEditTeamRRR(data: { groups: unknown[] }): void { this.#onEditTeamFinished(data.groups); }
  #onDeleteTeamRRR(data: { groups: unknown[] }): void { this.#onEditTeamFinished(data.groups); }

  #onEditTeamFinished(groups: unknown[]): void {
    WebConfig.resetRoles(groups);
    for (let d of groups) {
      Groups.update(new UserGroup(d));
    }
    // @ts-expect-error - owner may have this method
    this._owner?.onContentFragmentRequestPopView?.(this);
  }
}

export default FvcTeamEditor;
