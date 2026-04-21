import { FrontPageLayoutConfig } from './FrontPageLayoutConfig.js';

export class TriplePanelConfig extends FrontPageLayoutConfig {
  getLeftValue(): string | null {
    return this._getData('left');
  }

  getRightValue(): string | null {
    return this._getData('right');
  }

  getBottomValue(): string | null {
    return this._getData('bottom');
  }
}

