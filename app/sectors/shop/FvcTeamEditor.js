(function(shop) {
shop.CF_SHOP_TEAM_EDITOR = {
  SUBMIT : "CF_SHOP_TEAM_EDITOR_1",
}

const _CFT_SHOP_TEAM_EDITOR = {
  SEC_NAME :
      `<input id="ID_SHOP_TEAM_NAME" type="text" placeholder="Name" value="__NAME__">`,
  SEC_SUBMIT : `<br>
    <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(shop.CF_SHOP_TEAM_EDITOR.SUBMIT)">Submit<a>`,
}

class FvcTeamEditor extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fOptions = new ui.OptionSwitch();
    this._fOptions.setDelegate(this);
    this._fOptions.addOption("Active", "ACTIVE", true);
    this._fOptions.addOption("Recruiting", "OPEN", true);
    this.setChild("options", this._fOptions);

    this._fPermissions = new ui.OptionSwitch();
    this._fPermissions.setDelegate(this);
    this.setChild("permissions", this._fPermissions);

    this._teamId = null;
  }

  setTeamId(id) { this._teamId = id; }

  onOptionChangeInOptionsFragment(f, value, isOn) {}

  action(type, ...args) {
    switch (type) {
    case shop.CF_SHOP_TEAM_EDITOR.SUBMIT:
      this.#onSubmit();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let p = new ui.ListPanel();
    render.wrapPanel(p);
    let pp = new ui.SectionPanel("Name");
    p.pushPanel(pp);
    pp.getContentPanel().replaceContent(this.#renderNameInputs());

    this.#setOptions();

    pp = new ui.SectionPanel("Permissions");
    p.pushPanel(pp);
    this._fPermissions.attachRender(pp.getContentPanel());
    this._fPermissions.render();

    pp = new ui.SectionPanel("Options");
    p.pushPanel(pp);
    this._fOptions.attachRender(pp.getContentPanel());
    this._fOptions.render();

    pp = new ui.Panel();
    p.pushPanel(pp);
    pp.replaceContent(_CFT_SHOP_TEAM_EDITOR.SEC_SUBMIT);
  }

  #setOptions() {
    let team = this.#getTeam();
    if (team) {
      this._fOptions.setOption("ACTIVE", team.isActive());
      this._fOptions.setOption("OPEN", team.isOpen());
    }
  }

  #getTeam() { return dba.Shop.getTeam(this._teamId); }

  #renderNameInputs() {
    let s = _CFT_SHOP_TEAM_EDITOR.SEC_NAME;
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
    let e = document.getElementById("ID_SHOP_TEAM_NAME");
    if (e) {
      data.name = e.value;
    }
    data.id = this._teamId;
    data.is_open = this._fOptions.isOptionOn("OPEN");
    data.is_active = this._fOptions.isOptionOn("ACTIVE");
    data.permissions = [];
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
    let url = "api/shop/add_team";
    let fd = this.#makeForm(data);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onNewTeamRRR(d));
  }

  #asyncRequestEditTeam(data) {
    let url = "api/shop/update_team";
    let fd = this.#makeForm(data);
    plt.Api.asyncFragmentPost(this, url, fd).then(d => this.#onEditTeamRRR(d));
  }

  #asyncRequestDeleteTeam(id) {
    let url = "api/shop/delete_team";
    let fd = FormData();
    fd.append("id", id);
    plt.Api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onDeleteTeamRRR(d));
  }

  #onNewTeamRRR(data) { this.#onEditTeamFinished(data.groups); }
  #onEditTeamRRR(data) { this.#onEditTeamFinished(data.groups); }
  #onDeleteTeamRRR(data) { this.#onEditTeamFinished(data.groups); }

  #onEditTeamFinished(groups) {
    dba.WebConfig.resetRoles(groups);
    for (let d of groups) {
      dba.Groups.update(new dat.UserGroup(d));
    }
    this._owner.onContentFragmentRequestPopView(this);
  }
};

shop.FvcTeamEditor = FvcTeamEditor;
}(window.shop = window.shop || {}));
