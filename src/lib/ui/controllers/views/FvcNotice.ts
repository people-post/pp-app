import { FScrollViewContent } from '../fragments/FScrollViewContent.js';

export const CF_NOTICE = {
  CLOSE : Symbol(),
} as const;

const _CFT_NOTICE = {
  MAIN : `<div class="info-message">__MESSAGE__</div>
  <br>
  <a class="button-bar s-primary" href="javascript:void(0)" onclick="javascript:G.action(window.CF_NOTICE.CLOSE)">Close</a>`,
} as const;

export class FvcNotice extends FScrollViewContent {
  declare _msg: string | null;
  declare _fcnClose: (() => void) | null;

  constructor() {
    super();
    this._msg = null;
    this._fcnClose = null;
  }

  setMessage(msg: string): void { this._msg = msg; }
  setCloseAction(func: () => void): void { this._fcnClose = func; }

  action(type: symbol, ..._args: unknown[]): void {
    switch (type) {
    case CF_NOTICE.CLOSE:
      this.#onClose();
      break;
    default:
      super.action(type, ..._args);
      break;
    }
  }

  _renderContentOnRender(render: any): void {
    let s = _CFT_NOTICE.MAIN.replace("__MESSAGE__", this._msg || "");
    render.replaceContent(s);
  }

  #onClose(): void {
    if (this._fcnClose) {
      this._fcnClose();
    } else {
      if (this._owner) {
        (this._owner as any).onContentFragmentRequestPopView(this);
      }
    }
  }
}

// Export to window for string template access
if (typeof window !== 'undefined') {
  (window as any).CF_NOTICE = CF_NOTICE;
}

