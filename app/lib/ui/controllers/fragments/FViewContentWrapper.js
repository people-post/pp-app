(function(ui) {
class FViewContentWrapper extends ui.FViewContentContainer {
  #fContent;

  getPreferredWidth() {
    let f = this._getContentFragment();
    if (f) {
      return f.getPreferredWidth();
    }
    return super.getPreferredWidth();
  }

  getMaxWidthClassName() {
    let f = this._getContentFragment();
    if (f) {
      return f.getMaxWidthClassName();
    }
    return super.getMaxWidthClassName();
  }

  wrapContentFragment(fContent) {
    this.#fContent = fContent;
    this.setChild("wrappedcontent", this.#fContent);
  }

  resetContentFragment(fContent) {
    this.wrapContentFragment(fContent);
    this.render();
    this.onContentFragmentRequestUpdateHeader(this);
  }

  _getContentFragment() { return this.#fContent; }
};

ui.FViewContentWrapper = FViewContentWrapper;
}(window.ui = window.ui || {}));
