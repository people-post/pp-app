import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FCareerList } from '../../common/hr/FCareerList.js';
import { FCareer } from '../../common/hr/FCareer.js';
import { FvcCareer } from '../../sectors/hr/FvcCareer.js';
import { Workshop } from '../../common/dba/Workshop.js';
import type { Render } from '../../lib/ui/controllers/RenderController.js';
import type { UserRole } from '../../common/datatypes/UserRole.js';

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

  shouldHighlightInCareerFragment(_fCareer: FCareer, roleId: string): boolean {
    return this._selectedId == roleId;
  }
  getRoleForCareerFragment(_fCareer: FCareer, roleId: string): UserRole | null {
    return Workshop.getTeam(roleId) as UserRole | null;
  }
  getFragmentsDictForCareerListFragment(_fCareerList: FCareerList): Map<unknown, FCareer[]> {
    let m = new Map<unknown, FCareer[]>();
    if (!Workshop.isOpen()) {
      return m;
    }
    let fs: FCareer[] = [];
    for (let id of Workshop.getOpenTeamIds()) {
      let f = new FCareer();
      f.setProps({
        data: { roleId: id },
        callbacks: {
          onClickInCareerFragment: (career) => this.onClickInCareerFragment(career),
          getRoleForCareerFragment: (_c, roleId) => this.getRoleForCareerFragment(_c, roleId),
          shouldHighlightInCareerFragment: (_c, roleId) => this.shouldHighlightInCareerFragment(_c, roleId),
        },
      });
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
