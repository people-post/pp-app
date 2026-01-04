import { Panel } from './Panel.js';

export class ConsolePanel extends Panel {
  declare _pHomeBtn: Panel;

  constructor() {
    super();
    this._pHomeBtn = new Panel();
  }

  getHomeBtnPanel(): Panel { return this._pHomeBtn; }
  getTabPanel(): Panel | null { return null; }
  getNavPanel(_i: number): Panel | null { return null; }

  clearNavPanels(): void {}
}

