(function(gui) {
class FBanner extends ui.Fragment {
  constructor() {
    super();
    this._fError = new gui.FError();
    this._fError.setDelegate(this);
    this.setChild("error", this._fError);

    this._fCurrent = null;
  }

  onErrorFragmentRequestShow(fError) { this.#switchToShowErrorMode(); }
  onErrorFragmentRequestDismiss(fError) { this.#switchToShowContentMode(); }

  setContentFragment(f) {
    // Should have a better solution
    if (this._fCurrent == this._getChild("content")) {
      this._fCurrent = null;
    }
    this.setChild("content", f);
  }

  showRemoteError(data) { this._fError.handleRemoteError(data); }
  showLocalError(msg) { this._fError.show(msg); }

  _renderOnRender(render) {
    if (this._fCurrent == this._fError) {
      return;
    }
    if (this._fCurrent) {
      this._fCurrent.render();
    } else {
      this.#switchToShowContentMode();
    }
  }

  #switchToShowContentMode() {
    if (this._fCurrent) {
      this._fCurrent.detachRender();
    }
    this._fCurrent = this._getChild("content");
    if (this._fCurrent) {
      this.#showRender();
      this._fCurrent.attachRender(this.getRender());
      this._fCurrent.render();
    } else {
      this.#hideRender();
    }
  }

  #switchToShowErrorMode() {
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

  #showRender() {
    let r = this.getRender();
    if (r) {
      r.setStyle("display", "block");
    }
  }

  #hideRender() {
    let r = this.getRender();
    if (r) {
      r.clear();
      r.setStyle("display", "none");
    }
  }
};

gui.FBanner = FBanner;
}(window.gui = window.gui || {}));
