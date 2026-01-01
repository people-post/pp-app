import { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import { ActionButton } from '../common/gui/ActionButton.js';
import { Account } from '../common/dba/Account.js';

// ActionButton needs some redesign
export class AbClose extends Fragment {
  constructor() {
    super();
    this._fClose = new ActionButton();
    this._fClose.setIcon(ActionButton.T_ICON.CLOSE);
    this._fClose.setDelegate(this);
  }

  onGuiActionButtonClick(fButton) {
    switch (fButton) {
    case this._fClose:
      this._delegate.onClickInCloseActionButtonFragment(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render) {
    let f = null;
    if (Account.isAuthenticated()) {
      f = this._fClose;
    } else {
      return null;
    }
    this.setChild('current', f);
    if (f) {
      f.attachRender(render);
      f.render();
    }
  }
};
