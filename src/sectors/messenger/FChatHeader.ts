import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Utilities as MessengerUtilities } from './Utilities.js';
import { ChatTarget } from '../../common/datatypes/ChatTarget.js';
import type { Panel as PanelType } from '../../lib/ui/renders/panels/Panel.js';

export class FChatHeader extends Fragment {
  protected _target: ChatTarget | null = null;

  constructor() {
    super();
  }

  setTarget(target: ChatTarget): void { this._target = target; }

  _renderOnRender(render: PanelType): void {
    let p = new ListPanel();
    p.setClassName("flex space-between chat-view-header");
    render.wrapPanel(p);
    let pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent("");

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent(this.#renderTitle());

    pp = new Panel();
    p.pushPanel(pp);
    pp.replaceContent("");
  }

  #renderTitle(): string {
    if (!this._target) {
      return "Unknown";
    }
    if (this._target.isGroup()) {
      return MessengerUtilities.getGroupName(this._target.getId());
    } else {
      if (window.dba?.Account) {
        return window.dba.Account.getUserNickname(this._target.getId(), "Unknown user");
      }
      return "Unknown user";
    }
  }
}
