(function(auth) {
class FvcLoginBase extends ui.FScrollViewContent {
  getActionButton() {
    // Return empty fragment to avoid being assigned with default action button
    return new ui.Fragment();
  }
};

auth.FvcLoginBase = FvcLoginBase;
}(window.auth = window.auth || {}));
