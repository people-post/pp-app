import { FrontPageLayoutConfig } from './FrontPageLayoutConfig.js';

export class TriplePanelConfig extends FrontPageLayoutConfig {
  getLeftValue() { return this._getData("left"); }
  getRightValue() { return this._getData("right"); }
  getBottomValue() { return this._getData("bottom"); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.TriplePanelConfig = TriplePanelConfig;
}
