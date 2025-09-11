(function(gui) {
gui.CF_SECTOR_CONFIG_BAR = {
  ON_ENABLE_CLICKED : "CF_GUI_SECTOR_CONFIG_BAR_1",
  ON_HOME_CLICKED : "CF_GUI_SECTOR_CONFIG_BAR_2",
}

const _CFT_SECTOR_CONFIG_BAR = {
  CELL : `<table class="w100 border-collapse">
    <tbody>
      <tr>
        <td><span>__NAME__:</span></td>
        <td class="right-align">
          <label class="switch s-font5">__CHECKBOX__<span class="slider"></span></label>
        </td>
      </tr>
    </tbody>
  </table>`,
}

class SectorConfigBar extends ui.Fragment {
  action(type, ...args) {
    switch (type) {
    case gui.CF_SECTOR_CONFIG_BAR.ON_ENABLE_CLICKED:
      this.#onSetEnabled(args[0]);
      break;
    case gui.CF_SECTOR_CONFIG_BAR.ON_HOME_CLICKED:
      this.#onSetHome(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContent() {
    let table = document.createElement("TABLE");
    table.className = "config-bar";
    let row = table.insertRow(-1);
    let cell = row.insertCell(-1);

    let isChecked = this._dataSource.isEnableSetInConfigBarFragment(this);
    cell.innerHTML = this.#renderCell(
        "Enable", isChecked, "gui.CF_SECTOR_CONFIG_BAR.ON_ENABLE_CLICKED");

    if (isChecked &&
        dba.WebConfig.getHomeSector() !=
            this._dataSource.getSectorIdForConfigBarFragment(this)) {
      cell = row.insertCell(-1);
      cell.innerHTML = this.#renderCell(
          "Home page", false, "gui.CF_SECTOR_CONFIG_BAR.ON_HOME_CLICKED");
    }
    return table.outerHTML;
  }

  #renderCell(text, isChecked, actionId) {
    let s = _CFT_SECTOR_CONFIG_BAR.CELL;
    s = s.replace("__NAME__", text);
    let c = document.createElement("INPUT");
    c.setAttribute("type", "checkbox");
    if (isChecked) {
      c.setAttribute("checked", "");
    }
    c.setAttribute("onclick", "G.action(" + actionId + ", this.checked)");
    s = s.replace("__CHECKBOX__", c.outerHTML);
    return s;
  }

  #onSetEnabled(v) { this._delegate.onRequestSetEnabledInConfigBar(this, v); }

  #onSetHome(v) { this._delegate.onRequestSetHomeInConfigBar(this, v); }
};

gui.SectorConfigBar = SectorConfigBar;
}(window.gui = window.gui || {}));
