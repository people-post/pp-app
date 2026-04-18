import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { T_DATA } from '../../common/plt/Events.js';
import { Communities } from '../../common/dba/Communities.js';
import type { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class FGlobalCommunityInfo extends Fragment {
  handleSessionDataUpdate(dataType: symbol | string, data: unknown): void {
    switch (dataType) {
    case T_DATA.GLOBAL_COMMUNITY_PROFILE:
      this.render();
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Panel): void {
    let profile = Communities.getGlobalProfile();
    let statistics = profile?.statistics || null;
    let table = document.createElement("TABLE");

    if (statistics) {
      this.#appendRow(table as HTMLTableElement, "Users", String(statistics.n_users || "N/A"));
    } else {
      this.#appendRow(table as HTMLTableElement, "Users", "N/A");
    }

    if (statistics) {
      this.#appendRow(table as HTMLTableElement, "Web owners", String(statistics.n_web_owners || "N/A"));
    } else {
      this.#appendRow(table as HTMLTableElement, "Web owners", "N/A");
    }

    // this.#appendRow(table, "Total shops", "N/A");
    // this.#appendRow(table, "Divident history", "N/A");
    // this.#appendRow(table, "Divident pool", "N/A");
    render.replaceContent(table.outerHTML);
  }

  #appendRow(table: HTMLTableElement, col1: string, col2: string): void {
    let row = table.insertRow(-1);
    let cell = row.insertCell(-1);
    cell.innerHTML = col1;
    cell = row.insertCell(-1);
    cell.innerHTML = col2;
  }
}
