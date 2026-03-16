import Utilities from '../../../ext/Utilities.js';
import { RenderController } from '../RenderController';
import { View } from '../views/View';
import type { RemoteError } from '../../../../types/basic';

export interface FragmentOwner {
  onFragmentRequestShowView(f: Fragment, view: View, title: string): void;
  onRemoteErrorInFragment(f: Fragment, e: RemoteError): void;
  onLocalErrorInFragment(f: Fragment, msg: string): void;
  onContentTopResizeBeginInFragment?(f: Fragment): void;
  onContentTopResizeEndInFragment?(f: Fragment): void;
}

export class Fragment extends RenderController implements FragmentOwner {
  #id: string;

  constructor() {
    super();
    this.#id = Utilities.uuid();
  }

  protected _getFragmentId(): string { return this.#id; }

  onFragmentRequestShowView(_f: Fragment, view: View, title: string): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onFragmentRequestShowView(this, view, title);
    }
  }

  override onRemoteErrorInController(_c: RenderController, e: RemoteError): void{
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onRemoteErrorInFragment(this, e);
    }
  }

  override onLocalErrorInController(_c: RenderController, msg: string): void {
    const owner = this.getOwner<FragmentOwner>();
    if (owner) {
      owner.onLocalErrorInFragment(this, msg);
    }
  }

  onRemoteErrorInFragment(_f: Fragment, e: RemoteError): void {
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

