
class FGlobalCommunityInfo extends ui.Fragment {
  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.GLOBAL_COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render) {
    let profile = dba.Communities.getGlobalProfile();
    let statistics = profile ? profile.statistics : null;
    let table = document.createElement("TABLE");

    if (statistics) {
      this.#appendRow(table, "Users", statistics.n_users);
    } else {
      this.#appendRow(table, "Users", "N/A");
    }

    if (statistics) {
      this.#appendRow(table, "Web owners", statistics.n_web_owners);
    } else {
      this.#appendRow(table, "Web owners", "N/A");
    }

    // this.#appendRow(table, "Total shops", "N/A");
    // this.#appendRow(table, "Divident history", "N/A");
    // this.#appendRow(table, "Divident pool", "N/A");
    render.replaceContent(table.outerHTML);
  }

  #appendRow(table, col1, col2) {
    let row = table.insertRow(-1);
    let cell = row.insertCell(-1);
    cell.innerHTML = col1;
    cell = row.insertCell(-1);
    cell.innerHTML = col2;
  }
};

cmut.FGlobalCommunityInfo = FGlobalCommunityInfo;
}(window.cmut = window.cmut || {}));
