(function(ui) {
class FScrollable extends ui.Fragment {
  onScrollFinished() {}

  isReloadable() { return false; }
  hasBufferOnTop() { return false; }

  scrollToTop() {}
  reload() {}
};

ui.FScrollable = FScrollable;
}(window.ui = window.ui || {}));
