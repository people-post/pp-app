export const CF_TEAM = {
  ON_CLICK : Symbol(),
} as const;

import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { PTeamInfo } from './PTeamInfo.js';
import type { Team } from '../../common/datatypes/Team.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

interface TeamDataSource {
  getTeamForTeamFragment(f: FTeam, teamId: string): Team | null;
  shouldHighlightInTeamFragment(f: FTeam, teamId: string): boolean;
}

interface TeamDelegate {
  onClickInTeamFragment(f: FTeam): void;
}

export class FTeam extends Fragment {
  protected _teamId: string | null = null;
  protected _dataSource!: TeamDataSource;
  protected _delegate!: TeamDelegate;

  constructor() {
    super();
  }

  getTeamId(): string | null { return this._teamId; }
  setTeamId(id: string | null): void { this._teamId = id; }

  action(type: string | symbol, _data: unknown): void {
    switch (type) {
    case CF_TEAM.ON_CLICK:
      this._delegate.onClickInTeamFragment(this);
      break;
    default:
      super.action(type, _data);
      break;
    }
  }

  _renderOnRender(render: Panel): void {
    if (!this._teamId) {
      return;
    }

    let team = this._dataSource.getTeamForTeamFragment(this, this._teamId);
    if (!team) {
      return;
    }

    let panel = new PTeamInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", "G.action(CF_TEAM.ON_CLICK)");
      if (this._dataSource.shouldHighlightInTeamFragment(this, this._teamId)) {
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

  #renderName(team: Team): string {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", team.getName());
    s = s.replace("__TOTAL__", String(team.getNMembers()));
    return s;
  }
}
