(function(blog) {
blog.CF_ROLE = {
  ON_CLICK : Symbol(),
};

class FRole extends ui.Fragment {
  constructor() {
    super();
    this._roleId;
  }

  getRoleId() { return this._roleId; }
  setRoleId(id) { this._roleId = id; }

  action(type, data) {
    switch (type) {
    case blog.CF_ROLE.ON_CLICK:
      this._delegate.onClickInRoleFragment(this);
      break;
    default:
      super.action.apply(arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let role = this._dataSource.getRoleForRoleFragment(this, this._roleId);
    if (!role) {
      return;
    }

    let panel = new blog.PRoleInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", "G.action(blog.CF_ROLE.ON_CLICK)");
      if (this._dataSource.shouldHighlightInRoleFragment(this, this._roleId)) {
        panel.highlight();
      }
    }

    let p = panel.getNamePanel();
    p.replaceContent(this.#renderName(role));

    p = panel.getStatusPanel();
    if (role.isActive()) {
      if (role.isOpen()) {
        p.replaceContent("Open");
      } else {
        p.replaceContent("Closed");
      }
    } else {
      p.replaceContent("Inactive");
    }
  }

  #renderName(role) {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", role.getName());
    s = s.replace("__TOTAL__", role.getNMembers());
    return s;
  }
};

blog.FRole = FRole;
}(window.blog = window.blog || {}));
