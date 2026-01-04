import Utilities from '../../../ext/Utilities.js';
import { RenderController } from '../RenderController.js';

export class Fragment extends RenderController {
  protected _id: string;

  constructor() {
    super();
    this._id = Utilities.uuid();
  }

  onFragmentRequestShowView(f: Fragment, view: any, title: string): void {
    if (this._owner) {
      (this._owner as any).onFragmentRequestShowView(this, view, title);
    }
  }
  onRemoteErrorInController(c: RenderController, e: unknown): void {
    if (this._owner) {
      (this._owner as any).onRemoteErrorInFragment(this, e);
    }
  }
  onRemoteErrorInFragment(f: Fragment, e: unknown): void {
    if (this._owner) {
      (this._owner as any).onRemoteErrorInFragment(this, e);
    }
  }
  onLocalErrorInFragment(f: Fragment, msg: string): void {
    if (this._owner) {
      (this._owner as any).onLocalErrorInFragment(this, msg);
    }
  }
  onContentTopResizeBeginInFragment(f: Fragment): void {
    if (this._owner) {
      (this._owner as any).onContentTopResizeBeginInFragment(this);
    }
  }
  onContentTopResizeEndInFragment(f: Fragment): void {
    if (this._owner) {
      (this._owner as any).onContentTopResizeEndInFragment(this);
    }
  }
}

