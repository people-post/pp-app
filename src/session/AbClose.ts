import { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import { ActionButton } from '../common/gui/ActionButton.js';

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
      // @ts-expect-error - delegate may have this method
      this._delegate?.onClickInCloseActionButtonFragment?.(this);
      break;
    default:
      break;
    }
  }

  _renderOnRender(render: ReturnType<typeof this.getRender>): void {
    let f: ActionButton | null = null;
    if (window.dba.Account?.isAuthenticated()) {
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

export default AbClose;
