import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { WebConfig } from '../dba/WebConfig.js';

export const CF_SECTOR_CONFIG_BAR = {
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
export interface SectorConfigBarDataSource {
  isEnableSetInConfigBarFragment(f: SectorConfigBar): boolean;
  getSectorIdForConfigBarFragment(f: SectorConfigBar): string;
}

export interface SectorConfigBarDelegate {
  onRequestSetEnabledInConfigBar(f: SectorConfigBar, v: boolean): void;
  onRequestSetHomeInConfigBar(f: SectorConfigBar, v: boolean): void;
}

export class SectorConfigBar extends Fragment {
  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_SECTOR_CONFIG_BAR.ON_ENABLE_CLICKED:
      this.#onSetEnabled(args[0] as boolean);
      break;
    case CF_SECTOR_CONFIG_BAR.ON_HOME_CLICKED:
      this.#onSetHome(args[0] as boolean);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  _renderContent(): string {
    let table = document.createElement("TABLE");
    table.className = "config-bar";
    let row = (table as HTMLTableElement).insertRow(-1);
    let cell = (row as HTMLTableRowElement).insertCell(-1);

    let isChecked = this.getDataSource<SectorConfigBarDataSource>()?.isEnableSetInConfigBarFragment(this) || false;
    cell.innerHTML = this.#renderCell(
        "Enable", isChecked, CF_SECTOR_CONFIG_BAR.ON_ENABLE_CLICKED);

    if (isChecked &&
        WebConfig.getHomeSector() !=
            this.getDataSource<SectorConfigBarDataSource>()?.getSectorIdForConfigBarFragment(this) || "") {
      cell = row.insertCell(-1);
      cell.innerHTML = this.#renderCell(
          "Home page", false, CF_SECTOR_CONFIG_BAR.ON_HOME_CLICKED);
    }
    return table.outerHTML;
  }

  #renderCell(text: string, isChecked: boolean, actionId: string): string {
    let s = _CFT_SECTOR_CONFIG_BAR.CELL;
    s = s.replace("__NAME__", text);
    let c = document.createElement("INPUT");
    c.setAttribute("type", "checkbox");
    if (isChecked) {
      c.setAttribute("checked", "");
    }
    c.setAttribute("onclick", "G.action('" + actionId + "', this.checked)");
    s = s.replace("__CHECKBOX__", c.outerHTML);
    return s;
  }

  #onSetEnabled(v: boolean): void {
    const delegate = this.getDelegate<SectorConfigBarDelegate>();
    if (delegate) {
      delegate.onRequestSetEnabledInConfigBar(this, v);
    }
  }

  #onSetHome(v: boolean): void {
    const delegate = this.getDelegate<SectorConfigBarDelegate>();
    if (delegate) {
      delegate.onRequestSetHomeInConfigBar(this, v);
    }
  }
}

export default SectorConfigBar;
