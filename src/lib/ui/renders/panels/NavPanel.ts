import { ListPanel } from './ListPanel.js';

export class NavPanel extends ListPanel {
  declare _isLoginRequired: boolean;

  constructor() {
    super();
    this._isLoginRequired = false;
  }

  isLoginRequired(): boolean { return this._isLoginRequired; }

  setRequireLogin(b: boolean): void { this._isLoginRequired = b; }
}

