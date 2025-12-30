
export class FvcCareerList extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fList = new S.hr.FCareerList();
    this._fList.setDataSource(this);
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);

    this._selectedId = null;
  }

  shouldHighlightInCareerFragment(fCareer, roleId) {
    return this._selectedId == roleId;
  }
  getRoleForCareerFragment(fCareer, roleId) { return dba.Shop.getTeam(roleId); }
  getFragmentsDictForCareerListFragment(fCareerList) {
    let m = new Map();
    if (!dba.Shop.isOpen()) {
      return m;
    }
    let fs = [];
    for (let id of dba.Shop.getOpenTeamIds()) {
      let f = new S.hr.FCareer();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      fs.push(f);
    }
    m.set(null, fs);
    return m;
  }

  onClickInCareerFragment(fCareer) {
    this._selectedId = fCareer.getRoleId();
    let v = new ui.View();
    let f = new hr.FvcCareer();
    f.setRoleId(this._selectedId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "role");
    this.render();
  }

  _renderContentOnRender(render) {
    this._fList.attachRender(render);
    this._fList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.FvcCareerList = FvcCareerList;
}
