import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FCareerList } from '../../common/hr/FCareerList.js';
import { FCareer } from '../../common/hr/FCareer.js';
import { FvcCareer } from '../../sectors/hr/FvcCareer.js';
import { Workshop } from '../../common/dba/Workshop.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';

export class FvcCareerList extends FScrollViewContent {
  protected _fList: FCareerList;
  protected _selectedId: string | null;

  constructor() {
    super();
    this._fList = new FCareerList();
    this._fList.setDataSource(this);
    this._fList.setDelegate(this);
    this.setChild("list", this._fList);

    this._selectedId = null;
  }

  shouldHighlightInCareerFragment(fCareer: FCareer, roleId: string): boolean {
    return this._selectedId == roleId;
  }
  getRoleForCareerFragment(fCareer: FCareer, roleId: string): unknown {
    return Workshop.getTeam(roleId);
  }
  getFragmentsDictForCareerListFragment(fCareerList: FCareerList): Map<unknown, FCareer[]> {
    let m = new Map<unknown, FCareer[]>();
    if (!Workshop.isOpen()) {
      return m;
    }
    let fs: FCareer[] = [];
    for (let id of Workshop.getOpenTeamIds()) {
      let f = new FCareer();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      fs.push(f);
    }
    m.set(null, fs);
    return m;
  }

  onClickInCareerFragment(fCareer: FCareer): void {
    this._selectedId = fCareer.getRoleId();
    let v = new View();
    let f = new FvcCareer();
    f.setRoleId(this._selectedId);
    v.setContentFragment(f);
    this._owner.onFragmentRequestShowView(this, v, "role");
    this.render();
  }

  _renderContentOnRender(render: Render): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
};
