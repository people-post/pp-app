import { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import { ActionButton } from '../common/gui/ActionButton.js';
import { Account } from '../common/dba/Account.js';

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
      // @ts-expect-error - delegate may have this method
      this._delegate?.onLoginClickInAccountActionButtonFragment?.(this);
      break;
    case this._fLogout:
      // @ts-expect-error - delegate may have this method
      this._delegate?.onLogoutClickInActionButtonFragment?.(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
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

export default AbAccount;
