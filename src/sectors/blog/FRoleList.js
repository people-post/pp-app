import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FSimpleFragmentList } from '../../lib/ui/controllers/fragments/FSimpleFragmentList.js';
import { Blog } from '../../common/dba/Blog.js';
import { FRole } from './FRole.js';

export class FRoleList extends Fragment {
  constructor() {
    super();
    this._fList = new FSimpleFragmentList();
    this.setChild("list", this._fList);

    this._selectedRoleId = null;
    this._roleType = null;
  }

  setRoleType(t) { this._roleType = t; }

  getRoleForRoleFragment(fRole, roleId) { return Blog.getRole(roleId); }

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
    for (let id of Blog.getRoleIdsByType(this._roleType)) {
      let f = new FRole();
      f.setRoleId(id);
      f.setDataSource(this);
      f.setDelegate(this);
      this._fList.append(f);
    }
    this._fList.attachRender(render);
    this._fList.render();
  }
};
