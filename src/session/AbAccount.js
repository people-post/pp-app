import { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import { ActionButton } from '../common/gui/ActionButton.js';

// ActionButton needs some redesign
export class AbAccount extends Fragment {
  constructor() {
    super();
    this._fLogin = new ActionButton();
    this._fLogin.setIcon(ActionButton.T_ICON.LOGIN);
    this._fLogin.setDelegate(this);

    this._fLogout = new ActionButton();
    this._fLogout.setIcon(ActionButton.T_ICON.LOG_OUT);
    this._fLogout.setDelegate(this);
  }

  onGuiActionButtonClick(fActionButton) {
    switch (fActionButton) {
    case this._fLogin:
      this._delegate.onLoginClickInAccountActionButtonFragment(this);
      break;
    case this._fLogout:
      this._delegate.onLogoutClickInActionButtonFragment(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render) {
    let f = null;
    if (dba.Account.isAuthenticated()) {
      f = this._fLogout;
    } else {
      f = this._fLogin;
    }
    this.setChild('current', f);
    f.attachRender(render);
    f.render();
  }
};

