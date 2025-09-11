(function(ui) {
class FLoading extends ui.Fragment {
  _renderContent() {
    return `<div class="center-align">__ICON__</div>`.replace("__ICON__",
                                                              ui.ICONS.LOADING);
  }
};

ui.FLoading = FLoading;
}(window.ui = window.ui || {}));
