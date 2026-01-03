import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { FError } from './FError.js';
import Render from '../../lib/ui/renders/Render.js';

interface BannerDelegate {
  onErrorFragmentRequestShow?(fError: FError): void;
  onErrorFragmentRequestDismiss?(fError: FError): void;
}

export class FBanner extends Fragment {
  _fError: FError;
  _fCurrent: Fragment | null = null;
  // @ts-expect-error - _delegate type is more specific than base class
  declare _delegate: BannerDelegate;

  constructor() {
    super();
    this._fError = new FError();
    // @ts-expect-error - setDelegate accepts any object with delegate methods
    this._fError.setDelegate(this);
    this.setChild("error", this._fError);
  }

  onErrorFragmentRequestShow(_fError: FError): void {
    this.#switchToShowErrorMode();
  }

  onErrorFragmentRequestDismiss(_fError: FError): void {
    this.#switchToShowContentMode();
  }

  setContentFragment(f: Fragment | null): void {
    // Should have a better solution
    if (this._fCurrent == this._getChild("content")) {
      this._fCurrent = null;
    }
    this.setChild("content", f);
  }

  showRemoteError(data: unknown): void {
    this._fError.handleRemoteError(data);
  }

  showLocalError(msg: string): void {
    this._fError.show(msg);
  }

  _renderOnRender(_render: Render): void {
    if (this._fCurrent == this._fError) {
      return;
    }
    if (this._fCurrent) {
      this._fCurrent.render();
    } else {
      this.#switchToShowContentMode();
    }
  }

  #switchToShowContentMode(): void {
    if (this._fCurrent) {
      this._fCurrent.detachRender();
    }
    this._fCurrent = this._getChild("content");
    if (this._fCurrent) {
      this.#showRender();
      this._fCurrent.attachRender(this.getRender()!);
      this._fCurrent.render();
    } else {
      this.#hideRender();
    }
  }

  #switchToShowErrorMode(): void {
    if (this._fCurrent == this._fError) {
      return;
    }
    if (this._fCurrent) {
      this._fCurrent.detachRender();
    }
    this._fCurrent = this._fError;
    let r = this.getRender();
    if (r) {
      this._fError.attachRender(r);
    }
    this.#showRender();
  }

  #showRender(): void {
    let r = this.getRender();
    if (r) {
      r.setStyle("display", "block");
    }
  }

  #hideRender(): void {
    let r = this.getRender();
    if (r) {
      r.clear();
      r.setStyle("display", "none");
    }
  }
}
