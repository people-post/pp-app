import { Panel } from './Panel.js';

export class PTabbedPaneTabBase extends Panel {
  getIconPanel(): Panel | null { return null; }
  getNamePanel(): Panel | null { return null; }
  getBadgePanel(): Panel | null { return null; }
  getCloseBtnPanel(): Panel | null { return null; }

  invertColor(_b: boolean): void {}
}

