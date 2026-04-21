import { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import Render from '../lib/ui/renders/Render.js';
import { ActionButton } from '../common/gui/ActionButton.js';
import { Account } from '../common/dba/Account.js';

export interface AbCloseDelegate {
  onClickInCloseActionButtonFragment(f: AbClose): void;
}

// ActionButton needs some redesign
export class AbClose extends Fragment {
  private _fClose: ActionButton;

  constructor() {
    super();
    this._fClose = new ActionButton();
    this._fClose.setIcon(ActionButton.T_ICON.CLOSE);
    this._fClose.setDelegate(this);
  }

  onGuiActionButtonClick(fButton: ActionButton): void {
    switch (fButton) {
    case this._fClose:
      this.getDelegate<AbCloseDelegate>()?.onClickInCloseActionButtonFragment(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: Render): void {
    let f: ActionButton | null = null;
    if (Account.isAuthenticated()) {
      f = this._fClose;
    } else {
      return;
    }
    this.setChild('current', f);
    if (f) {
      f.attachRender(render);
      f.render();
    }
  }
}