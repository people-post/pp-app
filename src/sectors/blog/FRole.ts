import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PRoleInfo } from './PRoleInfo.js';

export const CF_ROLE = {
  ON_CLICK : Symbol(),
} as const;

interface Role {
  getName(): string;
  getNMembers(): number;
  isActive(): boolean;
  isOpen(): boolean;
}

interface RoleDataSource {
  getRoleForRoleFragment(f: FRole, roleId: string): Role | null;
  shouldHighlightInRoleFragment(f: FRole, roleId: string): boolean;
}

interface RoleDelegate {
  onClickInRoleFragment(f: FRole): void;
}

export class FRole extends Fragment {
  protected _roleId: string = "";
  protected _dataSource!: RoleDataSource;
  protected _delegate!: RoleDelegate;

  constructor() {
    super();
  }

  getRoleId(): string { return this._roleId; }
  setRoleId(id: string): void { this._roleId = id; }

  action(type: string | symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_ROLE.ON_CLICK:
      this._delegate.onClickInRoleFragment(this);
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    let role = this._dataSource.getRoleForRoleFragment(this, this._roleId);
    if (!role) {
      return;
    }

    let panel = new PRoleInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", "G.action(CF_ROLE.ON_CLICK)");
      if (this._dataSource.shouldHighlightInRoleFragment(this, this._roleId)) {
        panel.highlight();
      }
    }

    let p = panel.getNamePanel();
    p.replaceContent(this.#renderName(role));

    p = panel.getStatusPanel();
    if (role.isActive()) {
      if (role.isOpen()) {
        p.replaceContent("Open");
      } else {
        p.replaceContent("Closed");
      }
    } else {
      p.replaceContent("Inactive");
    }
  }

  #renderName(role: Role): string {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", role.getName());
    s = s.replace("__TOTAL__", String(role.getNMembers()));
    return s;
  }
}
