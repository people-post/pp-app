import Utilities from '../../../ext/Utilities.js';
import { RenderController } from '../RenderController.js';

export class Fragment extends RenderController {
  protected _id: string;

  constructor() {
    super();
    this._id = Utilities.uuid();
  }

  onFragmentRequestShowView(_f: Fragment, view: any, title: string): void {
    if (this._owner) {
      (this._owner as any).onFragmentRequestShowView(this, view, title);
    }
  }
  onRemoteErrorInController(_c: RenderController, e: unknown): void {
    if (this._owner) {
      (this._owner as any).onRemoteErrorInFragment(this, e);
    }
  }
  onRemoteErrorInFragment(_f: Fragment, e: unknown): void {
    if (this._owner) {
      (this._owner as any).onRemoteErrorInFragment(this, e);
    }
  }
  onLocalErrorInFragment(_f: Fragment, msg: string): void {
    if (this._owner) {
      (this._owner as any).onLocalErrorInFragment(this, msg);
    }
  }
  onContentTopResizeBeginInFragment(_f: Fragment): void {
    if (this._owner) {
      (this._owner as any).onContentTopResizeBeginInFragment(this);
    }
  }
  onContentTopResizeEndInFragment(_f: Fragment): void {
    if (this._owner) {
      (this._owner as any).onContentTopResizeEndInFragment(this);
    }
  }
}

