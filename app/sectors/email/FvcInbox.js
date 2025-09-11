(function(emal) {
class FvcInbox extends ui.FScrollViewContent {
  constructor() {
    super();
    this._fEmails = new emal.FAllEmailList();
    this._fEmails.setDelegate(this);
    this.setChild("emails", this._fEmails);
  }

  initFromUrl(urlParam) {
    super.initFromUrl(urlParam);
    this._fEmails.initFromUrl(urlParam);
  }

  isReloadable() { return true; }
  hasHiddenTopBuffer() { return this._fEmails.hasBufferOnTop(); }

  getUrlParamString() { return this._fEmails.getUrlParamString(); }

  reload() { this._fEmails.reload(); }

  scrollToTop() { this._fEmails.scrollToItemIndex(0); }

  onScrollFinished() { this._fEmails.onScrollFinished(); }

  _renderContentOnRender(render) {
    this._fEmails.attachRender(render);
    this._fEmails.render();
  }
};

emal.FvcInbox = FvcInbox;
}(window.emal = window.emal || {}));
