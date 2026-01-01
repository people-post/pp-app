import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { Account } from '../../common/dba/Account.js';
import { Utilities as MessengerUtilities } from './Utilities.js';

export class FChatHeader extends Fragment {
  constructor() {
    super();
    this._target = null;
  }

  setTarget(target) { this._target = target; }

  _renderOnRender(render) {
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

  #renderTitle() {
    if (this._target.isGroup()) {
      return MessengerUtilities.getGroupName(this._target.getId());
    } else {
      return Account.getUserNickname(this._target.getId(), "Unknown user");
    }
  }
};
