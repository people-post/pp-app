(function(ui) {
class FScrollViewContent extends ui.FViewContentBase {
  onScrollFinished() {}

  isReloadable() { return false; }
  hasHiddenTopBuffer() { return false; }

  scrollToTop() {}
  reload() {}

  _renderOnRender(render) { this._renderContentOnRender(render); }
  _renderContentOnRender(render) {}
};

ui.FScrollViewContent = FScrollViewContent;
}(window.ui = window.ui || {}));
