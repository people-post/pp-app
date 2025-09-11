(function(dat) {
class TriplePanelConfig extends dat.FrontPageLayoutConfig {
  getLeftValue() { return this._getData("left"); }
  getRightValue() { return this._getData("right"); }
  getBottomValue() { return this._getData("bottom"); }
};

dat.TriplePanelConfig = TriplePanelConfig;
}(window.dat = window.dat || {}));
