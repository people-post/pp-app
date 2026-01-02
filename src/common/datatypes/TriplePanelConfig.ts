import { FrontPageLayoutConfig } from './FrontPageLayoutConfig.js';

export class TriplePanelConfig extends FrontPageLayoutConfig {
  getLeftValue(): unknown {
    return this._getData('left');
  }

  getRightValue(): unknown {
    return this._getData('right');
  }

  getBottomValue(): unknown {
    return this._getData('bottom');
  }
}

