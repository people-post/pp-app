(window as any).CF_BLOG_ROLE_EDITOR = {
  SUBMIT : "CF_BLOG_ROLE_EDITOR_1",
};

const _CFT_BLOG_ROLE_EDITOR = {
  SEC_NAME :
      `<input id="ID_BLOG_ROLE_NAME" type="text" placeholder="Name" value="__NAME__">`,
  SEC_SUBMIT : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_BLOG_ROLE_EDITOR.SUBMIT)">Submit<a>`,
} as const;

import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { HintText } from '../../lib/ui/controllers/fragments/HintText.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import type { Panel as PanelType } from '../../lib/ui/renders/panels/Panel.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { UserGroup } from '../../common/datatypes/UserGroup.js';
import { ICON } from '../../common/constants/Icons.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Groups } from '../../common/dba/Groups.js';
import { Blog } from '../../common/dba/Blog.js';
import { R } from '../../common/constants/R.js';
import { Api } from '../../common/plt/Api.js';

interface RoleData {
  id?: string;
  name: string;
  type: string;
  is_open: boolean;
  is_active: boolean;
  tag_ids: string[];
}

export class FvcRoleEditor extends FScrollViewContent {
  private _fTypeChoices: ButtonGroup;
  private _fOptions: OptionSwitch;
  private _fTagsEditor: TagsEditorFragment;
  private _roleId: string | null = null;

  constructor() {
    super();
    this._fTypeChoices = new ButtonGroup();
    this._fTypeChoices.setDataSource(this);
    this._fTypeChoices.setDelegate(this);
    this._fTypeChoices.addChoice({
      name : "Insider",
      value : BlogRole.T_ROLE.EXCLUSIVE,
      icon : ICON.EMPLOYEE,
      fDetail : new HintText(R.get("BLOG_ROLE_EXCLUSIVE"))
    });
    this._fTypeChoices.addChoice({
      name : "Coalitionist",
      value : BlogRole.T_ROLE.PARTNERSHIP,
      icon : ICON.PARTNERSHIP,
      fDetail : new HintText(R.get("BLOG_ROLE_PARTNERSHIP"))
    });
    this._fTypeChoices.setSelectedValue(BlogRole.T_ROLE.PARTNERSHIP);
    this.setChild("typeChoices", this._fTypeChoices);

    this._fOptions = new OptionSwitch();
    this._fOptions.setDelegate(this);
    this._fOptions.addOption("Active", "ACTIVE", true);
    this._fOptions.addOption("Recruiting", "OPEN", true);
    this.setChild("options", this._fOptions);

    this._fTagsEditor = new TagsEditorFragment();
    this._fTagsEditor.setDataSource(this);
    this.setChild("tags", this._fTagsEditor);
  }

  setRoleId(id: string | null): void { this._roleId = id; }

  getTagsForTagsEditorFragment(_fEditor: TagsEditorFragment): unknown[] { return WebConfig.getTags(); }
  getInitialCheckedIdsForTagsEditorFragment(_fEditor: TagsEditorFragment): string[] {
    let role = this.#getRole();
    return role ? role.getAllowedTagIds() : [];
  }
  onButtonGroupSelectionChanged(_fButtonGroup: ButtonGroup, _value: string): void {}
  onOptionChangeInOptionsFragment(_f: OptionSwitch, _value: string, _isOn: boolean): void {}

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case (window as any).CF_BLOG_ROLE_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderContentOnRender(render: PanelType): void {
    let p = new ListPanel();
    render.wrapPanel(p);
    let pp = new SectionPanel("Name");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(this.#renderNameInputs());
    if (!this._roleId) {
      // New role, provide selection of type
      pp = new SectionPanel("Type");
      p.pushPanel(pp);
      this._fTypeChoices.attachRender(pp.getContentPanel());
      this._fTypeChoices.render();
    }
    pp = new SectionPanel("Allowed tags");
    p.pushPanel(pp);
    this._fTagsEditor.attachRender(pp.getContentPanel());
    this._fTagsEditor.render();
    pp = new SectionPanel("Options");
    p.pushPanel(pp);
    this.#renderOptions(pp.getContentPanel());
    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_BLOG_ROLE_EDITOR.SEC_SUBMIT);
  }

  #renderOptions(panel: PanelType): void {
    let role = this.#getRole();
    if (role) {
      this._fOptions.setOption("ACTIVE", role.isActive());
      this._fOptions.setOption("OPEN", role.isOpen());
    }
    this._fOptions.attachRender(panel);
    this._fOptions.render();
  }

  #getRole(): BlogRole | null { return Blog.getRole(this._roleId); }

  #renderNameInputs(): string {
    let s = _CFT_BLOG_ROLE_EDITOR.SEC_NAME;
    let name = "";
    let role = this.#getRole();
    if (role) {
      name = role.getName();
    }
    s = s.replace("__NAME__", name);
    return s;
  }

  #onSubmit(): void {
    let role = this.#collectData();
    if (role.id) {
      this.#asyncRequestEditRole(role);
    } else {
      this.#asyncRequestAddRole(role);
    }
  }

  #collectData(): RoleData {
    let role: RoleData = {
      name: "",
      type: "",
      is_open: false,
      is_active: false,
      tag_ids: []
    };
    let e = document.getElementById("ID_BLOG_ROLE_NAME");
    if (e && e instanceof HTMLInputElement) {
      role.name = e.value;
    }
    role.id = this._roleId || undefined;
    role.type = this._fTypeChoices.getSelectedValue();
    role.is_open = this._fOptions.isOptionOn("OPEN");
    role.is_active = this._fOptions.isOptionOn("ACTIVE");
    role.tag_ids = this._fTagsEditor.getSelectedTagIds();
    return role;
  }

  #makeForm(role: RoleData): FormData {
    let fd = new FormData();
    if (role.id) {
      fd.append("id", role.id);
    } else {
      fd.append("type", role.type);
    }
    fd.append("name", role.name);
    if (role.is_open) {
      fd.append("is_open", String(role.is_open));
    }
    if (role.is_active) {
      fd.append("is_active", String(role.is_active));
    }
    for (let id of role.tag_ids) {
      fd.append("tag_ids", id);
    }
    return fd;
  }

  #asyncRequestAddRole(role: RoleData): void {
    let url = "api/blog/add_role";
    let fd = this.#makeForm(role);
    Api.asFragmentPost(this, url, fd).then((d: {groups: unknown[]}) => this.#onNewRoleRRR(d));
  }

  #asyncRequestEditRole(role: RoleData): void {
    let url = "api/blog/update_role";
    let fd = this.#makeForm(role);
    Api.asFragmentPost(this, url, fd).then((d: {groups: unknown[]}) => this.#onEditRoleRRR(d));
  }

  #asyncRequestDeleteRole(id: string): void {
    let url = "api/blog/delete_role";
    let fd = new FormData();
    fd.append("id", id);
    Api.asFragmentPost(this, url, fd)
        .then((d: {groups: unknown[]}) => this.#onDeleteRoleRRR(d));
  }

  #onNewRoleRRR(data: {groups: unknown[]}): void { this.#onEditRoleFinished(data.groups); }
  #onEditRoleRRR(data: {groups: unknown[]}): void { this.#onEditRoleFinished(data.groups); }
  #onDeleteRoleRRR(data: {groups: unknown[]}): void { this.#onEditRoleFinished(data.groups); }

  #onEditRoleFinished(groups: unknown[]): void {
    WebConfig.resetRoles(groups);
    for (let d of groups) {
      Groups.update(new UserGroup(d as Record<string, unknown>));
    }
    this._owner.onContentFragmentRequestPopView(this);
  }
};
