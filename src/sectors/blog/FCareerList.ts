import { Fragment, FragmentOwner } from '../../lib/ui/controllers/fragments/Fragment.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { BlogRole } from '../../common/datatypes/BlogRole.js';
import { FCareerList as HrFCareerList } from '../../common/hr/FCareerList.js';
import { FCareer } from '../../common/hr/FCareer.js';
import { Blog } from '../../common/dba/Blog.js';
import { FvcCareer } from '../../sectors/hr/FvcCareer.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FCareerList extends Fragment {
  #fList: HrFCareerList;
  #selectedId: string | null = null;

  constructor() {
    super();
    this.#fList = new HrFCareerList();
    this.#fList.setDataSource(this);
    this.#fList.setDelegate(this);
    this.setChild("list", this.#fList);
  }

  shouldHighlightInCareerFragment(_fCareer: FCareer, roleId: string): boolean {
    return this.#selectedId == roleId;
  }
  getRoleForCareerFragment(_fCareer: FCareer, roleId: string): unknown { return Blog.getRole(roleId); }
  getFragmentsDictForCareerListFragment(_fCareerList: HrFCareerList): Map<string, FCareer[]> {
    let m = new Map<string, FCareer[]>();
    let items: FCareer[] = [];
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

  onClickInCareerFragment(fCareer: FCareer): void {
    this.#selectedId = fCareer.getRoleId();
    let v = new View();
    let f = new FvcCareer();
    f.setRoleId(this.#selectedId);
    v.setContentFragment(f);
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onFragmentRequestShowView(this, v, "role");
    }
    this.render();
  }

  _renderOnRender(render: Panel): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
}
