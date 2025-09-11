(function(shop) {
shop.CF_TEAM = {
  ON_CLICK : Symbol(),
};

class FTeam extends ui.Fragment {
  constructor() {
    super();
    this._teamId;
  }

  getTeamId() { return this._teamId; }
  setTeamId(id) { this._teamId = id; }

  action(type, data) {
    switch (type) {
    case shop.CF_TEAM.ON_CLICK:
      this._delegate.onClickInTeamFragment(this);
      break;
    default:
      super.action.apply(arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let team = this._dataSource.getTeamForTeamFragment(this, this._teamId);
    if (!team) {
      return;
    }

    let panel = new shop.PTeamInfo();
    render.wrapPanel(panel);

    if (panel.isHighlightable()) {
      panel.setAttribute("onclick", "G.action(shop.CF_TEAM.ON_CLICK)");
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

  #renderName(team) {
    let s = `__NAME__(__TOTAL__)`;
    s = s.replace("__NAME__", team.getName());
    s = s.replace("__TOTAL__", team.getNMembers());
    return s;
  }
};

shop.FTeam = FTeam;
}(window.shop = window.shop || {}));
