import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PCareerInfo } from './PCareerInfo.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { UserRole } from '../datatypes/UserRole.js';

export const CF_CAREER = {
  ON_CLICK : Symbol(),
};

export interface FCareerDataSource {
  getRoleForCareerFragment(f: FCareer, roleId: string): UserRole | null;
  shouldHighlightInCareerFragment(f: FCareer, roleId: string): boolean;
}

export interface FCareerDelegate {
  onClickInCareerFragment(f: FCareer): void;
}

export class FCareer extends Fragment {
  private _roleId: string | null = null;

  getRoleId(): string | null { return this._roleId; }
  setRoleId(id: string | null): void { this._roleId = id; }

  action(type: string | symbol, data?: unknown): void {
    switch (type) {
    case CF_CAREER.ON_CLICK:
      // @ts-expect-error - delegate may have this method
      this._delegate?.onClickInCareerFragment?.(this);
      break;
    default:
      super.action(type, data);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    let role = this.getDataSource<FCareerDataSource>()?.getRoleForCareerFragment(this, this._roleId as string || "") || null;
    if (!role) {
      return;
    }

    let panel = new PCareerInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", "G.action(S.hr.CF_CAREER.ON_CLICK)");
      if (this.getDataSource<FCareerDataSource>()?.shouldHighlightInCareerFragment(this,
                                                           this._roleId as string || "")) {
        panel.highlight();
      }
    }

    let p = panel.getNamePanel();
    p.replaceContent(this.#renderName(role));

    p = panel.getStatusPanel();
    if (window.dba.Account.isRoleApplicationPending(this._roleId as string || "")) {
      p.replaceContent("Applied");
    } else if (window.dba.Account.isInGroup(this._roleId as string || "")) {
      p.replaceContent("Joined");
    }
  }

  #renderName(role: UserRole): string {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", role.getName() || "");
    s = s.replace("__TOTAL__", role.getNMembers().toString());
    return s;
  }
}

export default FCareer;

