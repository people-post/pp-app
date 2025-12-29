import Utilities from '../../../ext/Utilities.js';

(function(ui) {
class Fragment extends ui.RenderController {
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

ui.Fragment = Fragment;
}(window.ui = window.ui || {}));
