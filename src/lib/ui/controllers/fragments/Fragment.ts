import Utilities from '../../../ext/Utilities.js';
import { RenderController } from '../RenderController.js';

export interface FragmentOwner {
  onFragmentRequestShowView(f: Fragment, view: any, title: string): void;
  onRemoteErrorInFragment(f: Fragment, e: unknown): void;
  onLocalErrorInFragment(f: Fragment, msg: string): void;
  onContentTopResizeBeginInFragment?(f: Fragment): void;
  onContentTopResizeEndInFragment?(f: Fragment): void;
}

export class Fragment extends RenderController implements FragmentOwner {
  protected _id: string;

  constructor() {
    super();
    this._id = Utilities.uuid();
  }

  onFragmentRequestShowView(_f: Fragment, view: any, title: string): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onFragmentRequestShowView(this, view, title);
    }
  }
  onRemoteErrorInController(_c: RenderController, e: unknown): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onRemoteErrorInFragment(this, e);
    }
  }
  onRemoteErrorInFragment(_f: Fragment, e: unknown): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onRemoteErrorInFragment(this, e);
    }
  }
  onLocalErrorInFragment(_f: Fragment, msg: string): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onLocalErrorInFragment(this, msg);
    }
  }
  onContentTopResizeBeginInFragment(_f: Fragment): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner && owner.onContentTopResizeBeginInFragment) {
      owner.onContentTopResizeBeginInFragment(this);
    }
  }
  onContentTopResizeEndInFragment(_f: Fragment): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner && owner.onContentTopResizeEndInFragment) {
      owner.onContentTopResizeEndInFragment(this);
    }
  }
}

