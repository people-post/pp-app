import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Blog } from '../../common/dba/Blog.js';
import { FRole } from './FRole.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

interface RoleListDelegate {
  onRoleListFragmentRequestEditRole(f: FRoleList, roleId: string): void;
}

export class FRoleList extends Fragment {
  protected _fList: FSimpleFragmentList;
  protected _selectedRoleId: string | null = null;
  protected _roleType: string | null = null;
  protected _delegate!: RoleListDelegate;

  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);
  }

  setRoleType(t: string | null): void { this._roleType = t; }

  getRoleForRoleFragment(_fRole: FRole, roleId: string): unknown { return Blog.getRole(roleId); }

  shouldHighlightInRoleFragment(_fRole: FRole, roleId: string): boolean {
    return this._selectedRoleId == roleId;
  }

  onClickInRoleFragment(fRole: FRole): void {
    this._selectedRoleId = fRole.getRoleId();
    this._delegate.onRoleListFragmentRequestEditRole(this, fRole.getRoleId());
    this.render();
  }

  _renderOnRender(render: Panel): void {
    this._fList.clear();
    if (this._roleType) {
      for (let id of Blog.getRoleIdsByType(this._roleType)) {
        let f = new FRole();
        f.setRoleId(id);
        f.setDataSource(this);
        f.setDelegate(this);
        this._fList.append(f);
      }
    }
    this._fList.attachRender(render);
    this._fList.render();
  }
}
