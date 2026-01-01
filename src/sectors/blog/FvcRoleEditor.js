
window.CF_BLOG_ROLE_EDITOR = {
  SUBMIT : "CF_BLOG_ROLE_EDITOR_1",
}

const _CFT_BLOG_ROLE_EDITOR = {
  SEC_NAME :
      `<input id="ID_BLOG_ROLE_NAME" type="text" placeholder="Name" value="__NAME__">`,
  SEC_SUBMIT : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(CF_BLOG_ROLE_EDITOR.SUBMIT)">Submit<a>`,
}
import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { ButtonGroup } from '../../lib/ui/controllers/fragments/ButtonGroup.js';
import { HintText } from '../../lib/ui/controllers/fragments/HintText.js';
import { OptionSwitch } from '../../lib/ui/controllers/fragments/OptionSwitch.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { SectionPanel } from '../../lib/ui/renders/panels/SectionPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { UserGroup } from '../../common/datatypes/UserGroup.js';
import { ICON } from '../../common/constants/Icons.js';
import { TagsEditorFragment } from '../../common/gui/TagsEditorFragment.js';
import { WebConfig } from '../../common/dba/WebConfig.js';
import { Groups } from '../../common/dba/Groups.js';
import { Blog } from '../../common/dba/Blog.js';
import { api } from '../../common/plt/Api.js';
import { R } from '../../common/constants/R.js';

export class FvcRoleEditor extends FScrollViewContent {
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

    this._roleId = null;
  }

  setRoleId(id) { this._roleId = id; }

  getTagsForTagsEditorFragment(fEditor) { return WebConfig.getTags(); }
  getInitialCheckedIdsForTagsEditorFragment(fEditor) {
    let role = this.#getRole();
    return role ? role.getAllowedTagIds() : [];
  }
  onButtonGroupSelectionChanged(fButtonGroup, value) {}
  onOptionChangeInOptionsFragment(f, value, isOn) {}

  action(type, ...args) {
    switch (type) {
    case CF_BLOG_ROLE_EDITOR.SUBMIT:
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

  #renderOptions(panel) {
    let role = this.#getRole();
    if (role) {
      this._fOptions.setOption("ACTIVE", role.isActive());
      this._fOptions.setOption("OPEN", role.isOpen());
    }
    this._fOptions.attachRender(panel);
    this._fOptions.render();
  }

  #getRole() { return Blog.getRole(this._roleId); }

  #renderNameInputs() {
    let s = _CFT_BLOG_ROLE_EDITOR.SEC_NAME;
    let name = "";
    let role = this.#getRole();
    if (role) {
      name = role.getName();
    }
    s = s.replace("__NAME__", name);
    return s;
  }

  #onSubmit() {
    let role = this.#collectData();
    if (role.id) {
      this.#asyncRequestEditRole(role);
    } else {
      this.#asyncRequestAddRole(role);
    }
  }

  #collectData() {
    let role = {};
    let e = document.getElementById("ID_BLOG_ROLE_NAME");
    if (e) {
      role.name = e.value;
    }
    role.id = this._roleId;
    role.type = this._fTypeChoices.getSelectedValue();
    role.is_open = this._fOptions.isOptionOn("OPEN");
    role.is_active = this._fOptions.isOptionOn("ACTIVE");
    role.tag_ids = this._fTagsEditor.getSelectedTagIds();
    return role;
  }

  #makeForm(role) {
    let fd = new FormData();
    if (role.id) {
      fd.append("id", role.id);
    } else {
      fd.append("type", role.type);
    }
    fd.append("name", role.name);
    if (role.is_open) {
      fd.append("is_open", role.is_open);
    }
    if (role.is_active) {
      fd.append("is_active", role.is_active);
    }
    for (let id of role.tag_ids) {
      fd.append("tag_ids", id);
    }
    return fd;
  }

  #asyncRequestAddRole(role) {
    let url = "api/blog/add_role";
    let fd = this.#makeForm(role);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onNewRoleRRR(d));
  }

  #asyncRequestEditRole(role) {
    let url = "api/blog/update_role";
    let fd = this.#makeForm(role);
    api.asyncFragmentPost(this, url, fd).then(d => this.#onEditRoleRRR(d));
  }

  #asyncRequestDeleteRole(id) {
    let url = "api/blog/delete_role";
    let fd = FormData();
    fd.append("id", id);
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onDeleteRoleRRR(d));
  }

  #onNewRoleRRR(data) { this.#onEditRoleFinished(data.groups); }
  #onEditRoleRRR(data) { this.#onEditRoleFinished(data.groups); }
  #onDeleteRoleRRR(data) { this.#onEditRoleFinished(data.groups); }

  #onEditRoleFinished(groups) {
    WebConfig.resetRoles(groups);
    for (let d of groups) {
      Groups.update(new UserGroup(d));
    }
    this._owner.onContentFragmentRequestPopView(this);
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcRoleEditor = FvcRoleEditor;
}
