import { Panel } from '../../lib/ui/renders/panels/Panel.js';

export class PRegisterBase extends Panel {
  constructor() { super(); }

  isColorInvertible(): boolean { return false; }

  getNameDecorationPanel(): Panel | null { return null; }
  getNamePanel(): Panel | null { return null; }
  getNameEditorPanel(): Panel | null { return null; }
  getTerminalInfoPanel(): Panel | null { return null; }
  getTerminalListPanel(): Panel | null { return null; }

  invertColor(): void {}
};
