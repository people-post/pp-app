
class FCareerList extends ui.Fragment {
  #fList;
  #selectedId = null;

  constructor() {
    super();
    this.#fList = new S.hr.FCareerList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);
  }

  shouldHighlightInCareerFragment(fCareer, roleId) {
    return this.#selectedId == roleId;
  }
  getRoleForCareerFragment(fCareer, roleId) { return dba.Blog.getRole(roleId); }
  getFragmentsDictForCareerListFragment(fCareerList) {
    let m = new Map();
    let items = [];
    for (let id of dba.Blog.getOpenRoleIdsByType(
             dat.BlogRole.T_ROLE.EXCLUSIVE)) {
      let f = new S.hr.FCareer();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      items.push(f);
    }
    m.set("Insider", items);

    items = [];
    for (let id of dba.Blog.getOpenRoleIdsByType(
             dat.BlogRole.T_ROLE.PARTNERSHIP)) {
      let f = new S.hr.FCareer();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      items.push(f);
    }
    m.set("Coalitionist", items);
    return m;
  }

  onClickInCareerFragment(fCareer) {
    this.#selectedId = fCareer.getRoleId();
    let v = new ui.View();
    let f = new hr.FvcCareer();
    f.setRoleId(this.#selectedId);
    v.setContentFragment(f);
    this.onFragmentRequestShowView(this, v, "role");
    this.render();
  }

  _renderOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};

blog.FCareerList = FCareerList;
}(window.blog = window.blog || {}));
