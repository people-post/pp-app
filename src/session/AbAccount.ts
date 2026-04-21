import { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import { ActionButton } from '../common/gui/ActionButton.js';
import { Account } from '../common/dba/Account.js';
import Render from '../lib/ui/renders/Render.js';

export interface AbAccountDelegate {
  onLoginClickInAccountActionButtonFragment(f: AbAccount): void;
  onLogoutClickInActionButtonFragment(f: AbAccount): void;
}

// ActionButton needs some redesign
export class AbAccount extends Fragment {
  private _fLogin: ActionButton;
  private _fLogout: ActionButton;

  constructor() {
    super();
    this._fLogin = new ActionButton();
    this._fLogin.setIcon(ActionButton.T_ICON.LOGIN);
    this._fLogin.setDelegate(this);

    this._fLogout = new ActionButton();
    this._fLogout.setIcon(ActionButton.T_ICON.LOG_OUT);
    this._fLogout.setDelegate(this);
  }

  onGuiActionButtonClick(fActionButton: ActionButton): void {
    switch (fActionButton) {
    case this._fLogin:
      this.getDelegate<AbAccountDelegate>()?.onLoginClickInAccountActionButtonFragment(this);
      break;
    case this._fLogout:
      this.getDelegate<AbAccountDelegate>()?.onLogoutClickInActionButtonFragment(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: Render): void {
    let f: ActionButton;
    if (Account.isAuthenticated()) {
      f = this._fLogout;
    } else {
      f = this._fLogin;
    }
    this.setChild('current', f);
    f.attachRender(render);
    f.render();
  }
}