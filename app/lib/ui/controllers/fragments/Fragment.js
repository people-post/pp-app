import Utilities from '../../../ext/Utilities.js';
import { RenderController } from '../RenderController.js';

export class Fragment extends RenderController {
  constructor() {
    super();
    this._id = Utilities.uuid();
  }

  onFragmentRequestShowView(f, view, title) {
    this._owner.onFragmentRequestShowView(this, view, title);
  }
  onRemoteErrorInController(c, e) {
    this._owner.onRemoteErrorInFragment(this, e);
  }
  onRemoteErrorInFragment(f, e) {
    this._owner.onRemoteErrorInFragment(this, e);
  }
  onLocalErrorInFragment(f, msg) {
    this._owner.onLocalErrorInFragment(this, msg);
  }
  onContentTopResizeBeginInFragment(f) {
    this._owner.onContentTopResizeBeginInFragment(this);
  }
  onContentTopResizeEndInFragment(f) {
    this._owner.onContentTopResizeEndInFragment(this);
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.ui = window.ui || {};
  window.ui.Fragment = Fragment;
}
