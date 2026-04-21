import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PTeamInfo } from './PTeamInfo.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ShopTeam } from '../../common/datatypes/ShopTeam.js';

const CF_TEAM = {
  ON_CLICK : "CF_TEAM_1",
} as const;

export interface FTeamDelegate {
  onClickInTeamFragment(f: FTeam): void;
}

export interface FTeamDataSource {
  getTeamForTeamFragment(f: FTeam, teamId: string): any;
  shouldHighlightInTeamFragment(f: FTeam, teamId: string): boolean;
}

export class FTeam extends Fragment {
  protected _teamId: string | null = null;

  constructor() {
    super();
  }

  getTeamId(): string | null { return this._teamId; }
  setTeamId(id: string | null): void { this._teamId = id; }

  action(type: string | symbol, _data?: unknown): void {
    switch (type) {
    case CF_TEAM.ON_CLICK:
      this.getDelegate<FTeamDelegate>()?.onClickInTeamFragment(this);
      break;
    default:
      super.action(type, _data);
      break;
    }
  }

  _renderOnRender(render: PanelWrapper): void {
    if (!this._teamId) return;
    let team = this.getDataSource<FTeamDataSource>()?.getTeamForTeamFragment(this, this._teamId);
    if (!team) {
      return;
    }

    let panel = new PTeamInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("data-pp-action", CF_TEAM.ON_CLICK);
      if (this.getDataSource<FTeamDataSource>()?.shouldHighlightInTeamFragment(this, this._teamId)) {
        panel.highlight();
      }
    }

    let p = panel.getNamePanel();
    p.replaceContent(this.#renderName(team));

    p = panel.getStatusPanel();
    if (team.isActive()) {
      if (team.isOpen()) {
        p.replaceContent("Open");
      } else {
        p.replaceContent("Closed");
      }
    } else {
      p.replaceContent("Inactive");
    }
  }

  #renderName(team: ShopTeam): string {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", team.getName() || "");
    s = s.replace("__TOTAL__", String(team.getNMembers()));
    return s;
  }
}
