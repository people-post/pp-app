import { FScrollViewContent } from '../fragments/FScrollViewContent.js';

export const CF_NOTICE = {
  CLOSE : Symbol(),
};

const _CFT_NOTICE = {
  MAIN : `<div class="info-message">__MESSAGE__</div>
  <br>
  <a class="button-bar s-primary" href="javascript:void(0)" data-action="CLOSE">Close</a>`,
};

export class FvcNotice extends FScrollViewContent {
  constructor() {
    super();
    this._msg = null;
    this._fcnClose = null;
  }

  setMessage(msg) { this._msg = msg; }
  setCloseAction(func) { this._fcnClose = func; }

  action(type, ...args) {
    switch (type) {
    case CF_NOTICE.CLOSE:
      this.#onClose();
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderContentOnRender(render) {
    let s = _CFT_NOTICE.MAIN.replace("__MESSAGE__", this._msg);
    render.replaceContent(s);
  }

  _onContentDidAppear() {
    this._attachActionListeners('[data-action]', {
      'CLOSE': CF_NOTICE.CLOSE
    });
  }

  #onClose() {
    if (this._fcnClose) {
      this._fcnClose();
    } else {
      this._owner.onContentFragmentRequestPopView(this);
    }
  }
};

