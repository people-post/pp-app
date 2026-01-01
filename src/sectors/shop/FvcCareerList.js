import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FCareerList } from '../../common/hr/FCareerList.js';
import { FCareer } from '../../common/hr/FCareer.js';
import { Shop } from '../../common/dba/Shop.js';
import { FvcCareer } from '../../sectors/hr/FvcCareer.js';

export class FvcCareerList extends FScrollViewContent {
  constructor() {
    super();
    this._fList = new FCareerList();
    this._fList.setDataSource(this);
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);

    this._selectedId = null;
  }

  shouldHighlightInCareerFragment(fCareer, roleId) {
    return this._selectedId == roleId;
  }
  getRoleForCareerFragment(fCareer, roleId) { return Shop.getTeam(roleId); }
  getFragmentsDictForCareerListFragment(fCareerList) {
    let m = new Map();
    if (!Shop.isOpen()) {
      return m;
    }
    let fs = [];
    for (let id of Shop.getOpenTeamIds()) {
      let f = new FCareer();
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
    let v = new View();
    let f = new FvcCareer();
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
