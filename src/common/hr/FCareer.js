import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PCareerInfo } from './PCareerInfo.js';

export const CF_CAREER = {
  ON_CLICK : Symbol(),
};

export class FCareer extends Fragment {
  constructor() {
    super();
    this._roleId;
  }

  getRoleId() { return this._roleId; }
  setRoleId(id) { this._roleId = id; }

  action(type, data) {
    switch (type) {
    case CF_CAREER.ON_CLICK:
      this._delegate.onClickInCareerFragment(this);
      break;
    default:
      super.action.apply(arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let role = this._dataSource.getRoleForCareerFragment(this, this._roleId);
    if (!role) {
      return;
    }

    let panel = new PCareerInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", "G.action(S.hr.CF_CAREER.ON_CLICK)");
      if (this._dataSource.shouldHighlightInCareerFragment(this,
                                                           this._roleId)) {
        panel.highlight();
      }
    }

    let p = panel.getNamePanel();
    p.replaceContent(this.#renderName(role));

    p = panel.getStatusPanel();
    if (window.dba.Account.isRoleApplicationPending(this._roleId)) {
      p.replaceContent("Applied");
    } else if (window.dba.Account.isInGroup(this._roleId)) {
      p.replaceContent("Joined");
    }
  }

  #renderName(role) {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", role.getName());
    s = s.replace("__TOTAL__", role.getNMembers());
    return s;
  }
}
