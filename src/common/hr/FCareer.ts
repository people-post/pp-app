import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PCareerInfo } from './PCareerInfo.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { UserRole } from '../datatypes/UserRole.js';
import { Account } from '../dba/Account.js';

export const CF_CAREER = {
  ON_CLICK : "CF_CAREER_1",
} as const;

export interface FCareerProps {
  data?: { roleId?: string | null };
  callbacks?: {
    onClickInCareerFragment?: (f: FCareer) => void;
    getRoleForCareerFragment?: (f: FCareer, roleId: string) => UserRole | null;
    shouldHighlightInCareerFragment?: (f: FCareer, roleId: string) => boolean;
  };
  onDataUpdate?: (data: unknown) => void;
}

export class FCareer extends Fragment {
  private _props: FCareerProps | null = null;

  setProps(props: FCareerProps): void { this._props = props; }
  getProps(): FCareerProps | null { return this._props; }

  getRoleId(): string | null { return this._props?.data?.roleId ?? null; }
  setRoleId(id: string | null): void {
    if (!this._props) { this._props = {}; }
    if (!this._props.data) { this._props.data = {}; }
    this._props.data.roleId = id;
  }

  action(type: string | symbol, data?: unknown): void {
    switch (type) {
    case CF_CAREER.ON_CLICK:
      this._props?.callbacks?.onClickInCareerFragment?.(this);
      break;
    default:
      super.action(type, data);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    const roleId = this._props?.data?.roleId ?? "";
    let role = this._props?.callbacks?.getRoleForCareerFragment?.(this, roleId) ?? null;
    if (!role) {
      return;
    }

    let panel = new PCareerInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", `G.action("${CF_CAREER.ON_CLICK}")`);
      if (this._props?.callbacks?.shouldHighlightInCareerFragment?.(this, roleId)) {
        panel.highlight();
      }
    }

    let p = panel.getNamePanel();
    p.replaceContent(this.#renderName(role));

    p = panel.getStatusPanel();
    if (Account.isRoleApplicationPending?.(roleId)) {
      p.replaceContent("Applied");
    } else if (Account.isInGroup?.(roleId)) {
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

