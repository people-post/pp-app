import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { FCareerList as HrFCareerList } from '../../common/hr/FCareerList.js';
import { FCareer } from '../../common/hr/FCareer.js';
import { Blog } from '../../common/dba/Blog.js';
import { FvcCareer } from '../../sectors/hr/FvcCareer.js';

export class FCareerList extends Fragment {
  #fList;
  #selectedId = null;

  constructor() {
    super();
    this.#fList = new HrFCareerList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);
  }

  shouldHighlightInCareerFragment(fCareer, roleId) {
    return this.#selectedId == roleId;
  }
  getRoleForCareerFragment(fCareer, roleId) { return Blog.getRole(roleId); }
  getFragmentsDictForCareerListFragment(fCareerList) {
    let m = new Map();
    let items = [];
    for (let id of Blog.getOpenRoleIdsByType(
             BlogRole.T_ROLE.EXCLUSIVE)) {
      let f = new FCareer();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      items.push(f);
    }
    m.set("Insider", items);

    items = [];
    for (let id of Blog.getOpenRoleIdsByType(
             BlogRole.T_ROLE.PARTNERSHIP)) {
      let f = new FCareer();
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
    let v = new View();
    let f = new FvcCareer();
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
