
class FRoleList extends ui.Fragment {
  constructor() {
    super();
    this._fList = new ui.FSimpleFragmentList();
    this.setChild("list", this._fList);

    this._selectedRoleId = null;
    this._roleType = null;
  }

  setRoleType(t) { this._roleType = t; }

  getRoleForRoleFragment(fRole, roleId) { return dba.Blog.getRole(roleId); }

  shouldHighlightInRoleFragment(fRole, roleId) {
    return this._selectedRoleId == roleId;
  }

  onClickInRoleFragment(fRole) {
    this._selectedRoleId = fRole.getRoleId();
    this._delegate.onRoleListFragmentRequestEditRole(this, fRole.getRoleId());
    this.render();
  }

  _renderOnRender(render) {
    this._fList.clear();
    for (let id of dba.Blog.getRoleIdsByType(this._roleType)) {
      let f = new blog.FRole();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fList.append(f);
    }
    this._fList.attachRender(render);
    this._fList.render();
  }
};

blog.FRoleList = FRoleList;
}(window.blog = window.blog || {}));
