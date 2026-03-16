import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FCareerList } from '../../common/hr/FCareerList.js';
import { FCareer } from '../../common/hr/FCareer.js';
import { Shop } from '../../common/dba/Shop.js';
import { FvcCareer } from '../../sectors/hr/FvcCareer.js';

export class FvcCareerList extends FScrollViewContent {
  private _fList: FCareerList;
  private _selectedId: string | null = null;

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
  getRoleForCareerFragment(_fCareer: FCareer, roleId: string): ReturnType<typeof Shop.getTeam> { return Shop.getTeam(roleId); }
  getFragmentsDictForCareerListFragment(_fCareerList: FCareerList): Map<null, FCareer[]> {
    let m = new Map<null, FCareer[]>();
    if (!Shop.isOpen()) {
      return m;
    }
    let fs: FCareer[] = [];
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

  onClickInCareerFragment(fCareer: FCareer): void {
    this._selectedId = fCareer.getRoleId();
    let v = new View();
    let f = new FvcCareer();
    f.setRoleId(this._selectedId);
    v.setContentFragment(f);
    // @ts-expect-error - owner may have this method
    this._owner?.onFragmentRequestShowView?.(this, v, "role");
    this.render();
  }

  _renderContentOnRender(render: ReturnType<typeof this.getRender>): void {
    this._fList.attachRender(render);
    this._fList.render();
  }
}

export default FvcCareerList;
